"use client";

import { Newspaper, TrendingUp, Info } from "lucide-react";

const NEWS = [
    {
        id: 1,
        title: "Solana Breakpoint 2025 Announced: What to Expect",
        source: "Decrypt",
        time: "2h ago",
        tag: "ECOSYSTEM",
        summary: "The annual conference promises major announcements regarding FireDancer and mobile stack improvements."
    },
    {
        id: 2,
        title: "BONK Surpasses PEPE in 24h Trading Volume",
        source: "CoinDesk",
        time: "4h ago",
        tag: "MEMES",
        summary: "The dog-themed token continues its rally as community sentiment reaches all-time highs."
    },
    {
        id: 3,
        title: "SEC Approves Bitcoin Spot ETF Options",
        source: "Bloomberg",
        time: "6h ago",
        tag: "REGULATION",
        summary: "A landmark decision that could pave the way for more institutional capital flowing into crypto markets."
    },
    {
        id: 4,
        title: "Phantom Wallet Adds Support for Bitcoin Ordinals",
        source: "The Block",
        time: "12h ago",
        tag: "TECH",
        summary: "Users can now manage their inscriptions directly alongside their SPL tokens and NFTs."
    }
];

export default function NewsPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-black italic mb-8 flex items-center gap-4">
                <Newspaper className="w-10 h-10 text-primary" />
                MEME <span className="text-secondary">WIRE</span>
            </h1>

            <div className="grid gap-6">
                {NEWS.map((item) => (
                    <div key={item.id} className="bg-surface border-2 border-border p-6 shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group">
                        <div className="flex justify-between items-start mb-4">
                            <span className="bg-white text-black px-2 py-1 font-mono font-bold text-xs border border-transparent">
                                {item.tag}
                            </span>
                            <span className="font-mono text-xs text-gray-500">{item.time} • {item.source}</span>
                        </div>
                        <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">{item.title}</h2>
                        <p className="text-gray-400 leading-relaxed font-mono text-sm">
                            {item.summary}
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-12 bg-primary text-black border-2 border-white p-6 shadow-neo flex items-center gap-4">
                <Info className="w-8 h-8" />
                <div>
                    <h3 className="font-bold text-lg">ALPHA LEAKS</h3>
                    <p className="font-mono text-sm">Subscribe to our newsletter to get early alerts on new market listings.</p>
                </div>
                <button className="ml-auto bg-black text-white px-6 py-3 font-bold hover:bg-white hover:text-black transition-colors border-2 border-transparent">
                    SUBSCRIBE
                </button>
            </div>
        </div>
    );
}
