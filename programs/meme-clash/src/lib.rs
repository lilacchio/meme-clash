use anchor_lang::prelude::*;
use anchor_lang::solana_program::clock::Clock;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod meme_clash {
    use super::*;

    pub fn initialize_market(ctx: Context<InitializeMarket>, question: String, end_time: i64) -> Result<()> {
        let market = &mut ctx.accounts.market;
        market.authority = ctx.accounts.authority.key();
        market.question = question;
        market.end_time = end_time;
        
        // Initial Liquidity (Virtual) - Seeded to prevent division by zero
        // In a real app, you'd require a deposit. Here we simulate "House Liquidity".
        market.yes_shares = 1000 * 1_000_000; // 1000 units
        market.no_shares = 1000 * 1_000_000;
        market.total_liquidity = 0; // User deposited USDC
        market.resolved = false;
        Ok(())
    }

    pub fn place_bet(ctx: Context<PlaceBet>, amount: u64, is_yes: bool) -> Result<()> {
        let market = &mut ctx.accounts.market;
        let user_bet = &mut ctx.accounts.user_bet;

        // 1. User deposits 'amount' USDC (Virtual for now, would be transfer in production)
        // This implicitly mints 'amount' of YES and 'amount' of NO shares.
        // 2. User keeps the desired side (e.g., YES).
        // 3. User swaps the undesired side (e.g., NO) into the pool for more desired side (YES).
        
        // CPMM Formula: x * y = k
        // We are swapping in 'amount' of Undesired Shares to get 'out' Desired Shares.
        // (x + amount) * (y - out) = x * y
        // y - out = (x * y) / (x + amount)
        // out = y - (x * y) / (x + amount)
        
        let (pool_keep, pool_swap) = if is_yes {
            (market.yes_shares, market.no_shares)
        } else {
            (market.no_shares, market.yes_shares)
        };

        // Calculate output amount using CPMM
        // We are putting 'amount' into 'pool_swap' (the undesired side) to take from 'pool_keep'
        let k = (pool_keep as u128) * (pool_swap as u128);
        let new_pool_swap = (pool_swap as u128) + (amount as u128);
        let new_pool_keep = k / new_pool_swap;
        let shares_out = (pool_keep as u128) - new_pool_keep;

        // Total shares user gets = Initial Mint (amount) + Swapped Out (shares_out)
        let total_user_shares = amount + (shares_out as u64);

        // Update Market State
        if is_yes {
            market.no_shares += amount; // Pool gets the NO shares user didn't want
            market.yes_shares -= shares_out as u64; // Pool gives up YES shares
            user_bet.yes_shares += total_user_shares;
        } else {
            market.yes_shares += amount;
            market.no_shares -= shares_out as u64;
            user_bet.no_shares += total_user_shares;
        }

        market.total_liquidity += amount;
        
        // Update User State
        user_bet.amount_invested += amount;
        
        Ok(())
    }

    pub fn resolve_market(ctx: Context<ResolveMarket>, outcome: bool) -> Result<()> {
        let market = &mut ctx.accounts.market;
        require!(market.authority == ctx.accounts.authority.key(), CustomError::Unauthorized);
        market.resolved = true;
        market.outcome = Some(outcome);
        Ok(())
    }

    pub fn claim(ctx: Context<Claim>) -> Result<()> {
        let market = &mut ctx.accounts.market;
        let user_bet = &mut ctx.accounts.user_bet;
        
        require!(market.resolved, CustomError::MarketNotResolved);
        
        let payout = if market.outcome.unwrap() {
            user_bet.yes_shares
        } else {
            user_bet.no_shares
        };

        require!(payout > 0, CustomError::NoWinnings);

        // In a real app, transfer USDC to user.
        // Here we just zero out the bet to prevent double claim.
        user_bet.yes_shares = 0;
        user_bet.no_shares = 0;
        user_bet.claimed = true;

        Ok(())
    }
}

#[derive(Accounts)]
pub struct InitializeMarket<'info> {
    #[account(init, payer = authority, space = 8 + 500)] // Increased space
    pub market: Account<'info, Market>,
    #[account(mut)]
    pub authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct PlaceBet<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(init_if_needed, payer = user, space = 8 + 100, seeds = [b"bet", market.key().as_ref(), user.key().as_ref()], bump)]
    pub user_bet: Account<'info, UserBet>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct ResolveMarket<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    pub authority: Signer<'info>,
}

#[derive(Accounts)]
pub struct Claim<'info> {
    #[account(mut)]
    pub market: Account<'info, Market>,
    #[account(mut, seeds = [b"bet", market.key().as_ref(), user.key().as_ref()], bump)]
    pub user_bet: Account<'info, UserBet>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct Market {
    pub authority: Pubkey,
    pub question: String,
    pub end_time: i64,
    pub yes_shares: u64,
    pub no_shares: u64,
    pub total_liquidity: u64,
    pub resolved: bool,
    pub outcome: Option<bool>,
}

#[account]
pub struct UserBet {
    pub amount_invested: u64,
    pub yes_shares: u64,
    pub no_shares: u64,
    pub claimed: bool,
}

#[error_code]
pub enum CustomError {
    #[msg("You are not authorized to perform this action.")]
    Unauthorized,
    #[msg("Market is not yet resolved.")]
    MarketNotResolved,
    #[msg("No winnings to claim.")]
    NoWinnings,
}
