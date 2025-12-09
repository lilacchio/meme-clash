"use client";

import MarketCard from "@/components/MarketCard";
import { Filter } from "lucide-react";
import { useMarket } from "@/context/MarketContext";
import { useState } from "react";

export default function Home() {
    const { markets } = useMarket();
    const [filter, setFilter] = useState("ALL");

    const filteredMarkets = filter === "ALL"
        ? markets
        : markets.filter(m => m.category === filter);

    return (
        <div className="p-6">
            {/* Filters */}
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilter("ALL")}
                    className={`flex items-center gap-2 px-4 py-2 font-mono font-bold border-2 shadow-neo transition-all ${filter === "ALL" ? "bg-white text-black border-transparent" : "bg-surface text-gray-400 border-transparent hover:border-white"}`}
                >
                    <Filter className="w-4 h-4" /> ALL
                </button>
                {["CRYPTO", "POLITICS", "MEMES", "SPORTS"].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`px-4 py-2 font-mono font-bold border-2 transition-all ${filter === cat ? "bg-white text-black border-white" : "bg-surface text-gray-400 border-transparent hover:border-white hover:text-white"}`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-16">
                {filteredMarkets.length > 0 ? (
                    filteredMarkets.map((market) => (
                        <MarketCard
                            key={market.id}
                            id={market.id}
                            question={market.question}
                            yesPrice={market.yesPrice}
                            volume={`$${(market.volume / 1000).toFixed(1)}k`}
                            endTime={new Date(market.endTime).toLocaleDateString()}
                            image={market.image || "/placeholder.png"}
                        />
                    ))
                ) : (
                    <div className="col-span-full py-12 text-center text-gray-500 font-mono">
                        No markets found in this category.
                    </div>
                )}
            </div>

            {/* How It Works & Differentiators */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 border-t-2 border-dashed border-gray-800 pt-16">
                {/* How It Works */}
                <div className="space-y-8">
                    <h2 className="text-4xl font-black italic text-primary">HOW IT WORKS</h2>
                    <div className="space-y-6">
                        <div className="flex gap-4">
                            <div className="text-6xl font-black text-gray-800">1</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">CONNECT WALLET</h3>
                                <p className="text-gray-400 font-mono">Link your Phantom or Solflare. No signups, no email spam. Just pure on-chain degen action.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-6xl font-black text-gray-800">2</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">PICK YOUR SIDE</h3>
                                <p className="text-gray-400 font-mono">Will BONK flip WIF? Will Zuck fight Elon? Buy YES if you believe, buy NO if you doubt.</p>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <div className="text-6xl font-black text-gray-800">3</div>
                            <div>
                                <h3 className="text-xl font-bold mb-2">PROFIT</h3>
                                <p className="text-gray-400 font-mono">If you're right, each share redeems for $1.00 USDC. Simple math, massive gains.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Why We Are Different */}
                <div className="bg-surface border-2 border-white p-8 shadow-[8px_8px_0px_0px_rgba(255,255,255,1)]">
                    <h2 className="text-4xl font-black italic mb-8">WHY MEME<span className="text-secondary">CLASH</span>?</h2>
                    <ul className="space-y-6 font-mono font-bold">
                        <li className="flex items-start gap-3">
                            <span className="text-green-500 text-xl">✓</span>
                            <span>
                                <span className="text-primary block text-lg mb-1">MEME-FIRST CULTURE</span>
                                <span className="text-gray-400 text-sm font-normal">Polymarket is for suits. We are for the culture. We list the markets that actually matter to CT.</span>
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-500 text-xl">✓</span>
                            <span>
                                <span className="text-primary block text-lg mb-1">PERMISSIONLESS CHAOS</span>
                                <span className="text-gray-400 text-sm font-normal">No corporate gatekeepers. Anyone can create any market instantly. Pure supply and demand.</span>
                            </span>
                        </li>
                        <li className="flex items-start gap-3">
                            <span className="text-green-500 text-xl">✓</span>
                            <span>
                                <span className="text-primary block text-lg mb-1">FASTER LISTINGS</span>
                                <span className="text-gray-400 text-sm font-normal">We list markets in minutes, not days. If it's trending, it's tradeable.</span>
                            </span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
