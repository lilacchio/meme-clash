"use client";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useMarket } from "@/context/MarketContext";
import { useState } from "react";
import { SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ArrowUpRight, Wallet, TrendingUp, DollarSign, Loader2 } from "lucide-react";
import MarketCard from "@/components/MarketCard";

// Mock treasury for deposits
const TREASURY_DESTINATION = new PublicKey("11111111111111111111111111111111");

export default function ProfilePage() {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { markets, balances, rewards, deposit, claimRewards } = useMarket();
    const [loading, setLoading] = useState(false);
    const [depositAmount, setDepositAmount] = useState("");

    const userAddress = publicKey?.toString();
    const userBalance = userAddress ? (balances[userAddress] || 0) : 0;
    const userRewards = userAddress ? (rewards[userAddress] || 0) : 0;

    const myMarkets = markets.filter(m => m.creatorAddress === userAddress);
    const totalVolume = myMarkets.reduce((acc, m) => acc + m.volume, 0);

    const handleDeposit = async () => {
        if (!publicKey || !depositAmount) return;
        setLoading(true);
        try {
            const lamports = parseFloat(depositAmount) * LAMPORTS_PER_SOL;
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: TREASURY_DESTINATION,
                    lamports: lamports,
                })
            );

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, "confirmed");

            // Mock: Credit 1:1 USDC for SOL (Simulated rate for devnet simplicity)
            // Or usually 1 SOL = $150. Let's do a fixed rate to make numbers look big. 1 SOL = 100 MockUSDC.
            const creditAmount = parseFloat(depositAmount) * 100;
            deposit(userAddress!, creditAmount);
            alert(`Deposited! wallet credited with $${creditAmount} betting power.`);
            setDepositAmount("");
        } catch (error) {
            console.error("Deposit failed", error);
            alert("Deposit failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleClaim = () => {
        if (!userAddress) return;
        claimRewards(userAddress);
        alert(`Claimed $${userRewards.toFixed(2)} to your betting balance!`);
    };

    if (!publicKey) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
                <h1 className="text-3xl font-black italic">CONNECT WALLET TO VIEW PROFILE</h1>
                <WalletMultiButton style={{ backgroundColor: '#ccff00', color: 'black' }} />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-6xl">
            <h1 className="text-4xl font-black italic mb-8">MY DASHBOARD</h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Balance Card */}
                <div className="bg-surface border-2 border-border p-6 shadow-neo">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-gray-400 font-mono text-sm font-bold">BETTING BALANCE</p>
                            <h2 className="text-4xl font-black text-white mt-1">${userBalance.toFixed(2)}</h2>
                        </div>
                        <Wallet className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            value={depositAmount}
                            onChange={e => setDepositAmount(e.target.value)}
                            placeholder="SOL Amount"
                            className="bg-black border border-gray-700 px-3 py-2 w-28 text-white text-sm"
                        />
                        <button
                            disabled={loading || !depositAmount}
                            onClick={handleDeposit}
                            className={`px-4 py-2 font-bold text-xs bg-white text-black hover:bg-primary transition-colors flex items-center gap-1 ${loading ? "opacity-50" : ""}`}
                        >
                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : "DEPOSIT SOL"}
                        </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-2 font-mono">1 SOL = 100 MockUSDC (Devnet)</p>
                </div>

                {/* Rewards Card */}
                <div className="bg-surface border-2 border-border p-6 shadow-neo">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-gray-400 font-mono text-sm font-bold">CLAIMABLE EARNINGS</p>
                            <h2 className="text-4xl font-black text-green-500 mt-1">${userRewards.toFixed(2)}</h2>
                        </div>
                        <DollarSign className="w-8 h-8 text-green-500" />
                    </div>
                    <button
                        onClick={handleClaim}
                        disabled={userRewards <= 0}
                        className="w-full py-2 bg-green-500/20 text-green-500 border border-green-500 font-bold text-sm hover:bg-green-500 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        CLAIM REWARDS
                    </button>
                </div>

                {/* Creator Stats */}
                <div className="bg-surface border-2 border-border p-6 shadow-neo">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <p className="text-gray-400 font-mono text-sm font-bold">MARKETS CREATED</p>
                            <h2 className="text-4xl font-black text-white mt-1">{myMarkets.length}</h2>
                        </div>
                        <TrendingUp className="w-8 h-8 text-secondary" />
                    </div>
                    <div>
                        <p className="text-gray-400 font-mono text-xs">Total Volume Generated</p>
                        <p className="text-xl font-bold text-secondary">${totalVolume.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* My Markets List */}
            <h2 className="text-2xl font-black italic mb-6 flex items-center gap-2">
                MY MARKETS <span className="text-sm font-normal not-italic text-gray-500 bg-surface px-2 py-1 border border-gray-800 rounded-full">{myMarkets.length}</span>
            </h2>

            {myMarkets.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {myMarkets.map((market) => (
                        <MarketCard
                            key={market.id}
                            id={market.id}
                            question={market.question}
                            yesPrice={market.yesPrice}
                            volume={`$${(market.volume).toLocaleString()}`}
                            endTime={new Date(market.endTime).toLocaleDateString()}
                            image={market.image || "/placeholder.png"}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded bg-surface/50">
                    <p className="text-gray-500 font-mono mb-4">You haven't created any markets yet.</p>
                    <a href="/create" className="inline-block px-6 py-3 bg-primary text-black font-bold hover:scale-105 transition-transform">
                        CREATE FIRST MARKET
                    </a>
                </div>
            )}
        </div>
    );
}
