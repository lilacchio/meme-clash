"use client";

import { useMarket } from "@/context/MarketContext";
import { useState, useEffect } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

export default function BetSlip() {
    const { activeBet, getMarket, placeBet } = useMarket();
    const [amount, setAmount] = useState("");

    // Reset amount when selection changes
    useEffect(() => {
        setAmount("");
    }, [activeBet]);

    if (!activeBet) {
        return (
            <div className="border-2 border-border p-4 shadow-neo bg-surface sticky top-24">
                <h3 className="font-mono font-bold text-primary mb-4">BET SLIP</h3>
                <div className="text-sm text-gray-400 text-center py-8">
                    Select an outcome to place a bet.
                </div>
            </div>
        );
    }

    const market = getMarket(activeBet.marketId);
    if (!market) return null;

    const price = activeBet.outcome === "YES" ? market.yesPrice : (1 - market.yesPrice);

    // Fee Logic
    const fee = amount ? parseFloat(amount) * 0.02 : 0;
    const netAmount = amount ? parseFloat(amount) - fee : 0;

    const shares = netAmount ? netAmount / price : 0;
    const payout = shares; // Each share pays out 1 USDC if won
    const profit = amount ? payout - parseFloat(amount) : 0; // Profit is Payout - Initial Investment (Gross Amount)
    const percentReturn = amount ? (profit / parseFloat(amount)) * 100 : 0;

    const handlePlaceOrder = () => {
        if (!amount || parseFloat(amount) <= 0) return;
        placeBet(market.id, parseFloat(amount), activeBet.outcome === "YES");
        setAmount("");
        alert(`Bet Placed! (2% Fee Deduced: $${fee.toFixed(2)})`);
    };

    return (
        <div className="border-2 border-border p-4 shadow-neo bg-surface sticky top-24">
            <h3 className="font-mono font-bold text-primary mb-4 flex items-center justify-between">
                BET SLIP
                <span className={`text-xs px-2 py-1 border ${activeBet.outcome === "YES" ? "border-green-500 text-green-500" : "border-red-500 text-red-500"}`}>
                    {activeBet.outcome}
                </span>
            </h3>

            <div className="mb-4">
                <p className="text-sm font-bold leading-tight mb-2">{market.question}</p>
                <div className="flex justify-between items-center text-xs font-mono text-gray-400">
                    <span>Price</span>
                    <span className="text-white">{price.toFixed(2)} USDC</span>
                </div>
            </div>

            <div className="space-y-4 mb-6">
                <div>
                    <label className="block font-mono font-bold text-xs mb-2 text-gray-400">AMOUNT (USDC)</label>
                    <div className="relative">
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            className="w-full bg-black border-2 border-border p-3 font-mono font-bold text-sm focus:outline-none focus:border-primary transition-colors text-white"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>Fees (2%)</span>
                    <span className="text-red-400">-${fee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>Est. Shares</span>
                    <span className="text-white">{shares.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>Est. Payout</span>
                    <span className="text-white">${payout.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-mono text-gray-400">
                    <span>Est. Profit</span>
                    <span className="text-green-500">+${profit.toFixed(2)} (+{percentReturn.toFixed(0)}%)</span>
                </div>
            </div>

            <button
                onClick={handlePlaceOrder}
                className="w-full py-3 bg-white text-black font-black text-lg border-2 border-primary shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
            >
                PLACE ORDER
            </button>
        </div>
    );
}
