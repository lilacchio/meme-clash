"use client";

import { Info, AlertTriangle, TrendingUp, User, Globe, MessageSquare, Share2, BarChart2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMarket } from "@/context/MarketContext";
import { useState, useEffect } from "react";

// Mock Chart Component
function PriceChart({ isPositive }: { isPositive: boolean }) {
    const [timeframe, setTimeframe] = useState("1D");
    const [price, setPrice] = useState("0.00");

    useEffect(() => {
        setPrice((Math.random() * 0.99).toFixed(2));
    }, []);

    // Generate different random paths based on timeframe
    const paths: Record<string, string> = {
        "1H": "M0,150 Q50,140 100,100 T200,80 T300,120 T400,60 T500,40 T600,80 T700,20",
        "6H": "M0,200 Q100,250 200,150 T400,100 T600,80 T800,40",
        "1D": "M0,150 Q50,140 100,100 T200,80 T300,120 T400,60 T500,40 T600,80 T700,20",
        "1W": "M0,250 Q150,280 300,200 T600,100 T900,50",
        "1M": "M0,100 Q150,50 300,150 T600,200 T900,100",
        "ALL": "M0,300 Q200,50 400,250 T800,100" // Volatile
    };

    const path = paths[timeframe] || paths["1D"];
    const color = isPositive ? "#ccff00" : "#ff00ff";

    return (
        <div className="h-64 w-full bg-surface border-2 border-border relative overflow-hidden mb-6">
            <div className="absolute top-4 left-4 z-10">
                <div className="flex gap-2 mb-2">
                    {["1H", "6H", "1D", "1W", "1M", "ALL"].map((tf) => (
                        <button
                            key={tf}
                            onClick={() => setTimeframe(tf)}
                            className={`text-xs font-mono font-bold px-2 py-1 rounded transition-colors ${timeframe === tf ? "bg-white text-black" : "bg-white/10 hover:bg-white/20 text-white"}`}
                        >
                            {tf}
                        </button>
                    ))}
                </div>
            </div>

            <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="gradient" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor={color} stopOpacity="0.2" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <path d={`${path} V300 H0 Z`} fill="url(#gradient)" />
                <path d={path} fill="none" stroke={color} strokeWidth="3" vectorEffect="non-scaling-stroke" />
            </svg>

            <div className="absolute bottom-4 right-4 flex items-end flex-col">
                <span className="text-3xl font-black text-white">{price}¢</span>
                <span className={`text-sm font-mono font-bold ${isPositive ? "text-primary" : "text-secondary"}`}>
                    {isPositive ? "+12.5%" : "-5.4%"} (24h)
                </span>
            </div>
        </div>
    );
}

// Comments Component
function CommentsSection() {
    const COMMENTS = [
        { user: "sol_degen", msg: "This is free money lol", time: "2m ago", pic: "🐕" },
        { user: "whale_watcher", msg: "Volume spiking, someone knows something...", time: "15m ago", pic: "🐋" },
        { user: "vitalik_fan", msg: "Does this resolve positively if the cap flips but then flips back?", time: "1h ago", pic: "🤓" },
    ];

    return (
        <div className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">Activity</h3>
                <div className="flex gap-4 text-sm text-gray-400 font-mono font-bold cursor-pointer">
                    <span className="text-white border-b-2 border-primary">Comments</span>
                    <span className="hover:text-white">Holders</span>
                    <span className="hover:text-white">Whales</span>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-surface border border-gray-700 flex items-center justify-center text-xl">👤</div>
                <input type="text" placeholder="Add a comment..." className="flex-1 bg-surface border-b-2 border-gray-800 p-2 text-white focus:outline-none focus:border-white transition-colors" />
            </div>

            <div className="space-y-6">
                {COMMENTS.map((c, i) => (
                    <div key={i} className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-black border border-gray-700 flex items-center justify-center text-xl">{c.pic}</div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-sm">{c.user}</span>
                                <span className="text-xs text-gray-500 font-mono">{c.time}</span>
                            </div>
                            <p className="text-gray-300 text-sm">{c.msg}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function MarketPage() {
    const params = useParams();
    const router = useRouter();
    const { getMarket, setActiveBet, activeBet } = useMarket();
    const marketId = params.id as string;
    const market = getMarket(marketId);

    if (!market) {
        return (
            <div className="p-12 text-center">
                <h1 className="text-2xl font-bold mb-4">Market Not Found</h1>
                <button onClick={() => router.push("/")} className="text-primary hover:underline">Return Home</button>
            </div>
        );
    }

    const yesPercent = Math.round(market.yesPrice * 100);
    const noPercent = 100 - yesPercent;

    return (
        <div className="p-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="flex items-start gap-4 mb-6">
                <div className="w-16 h-16 bg-surface border-2 border-border shadow-neo flex items-center justify-center text-3xl">
                    {market.category === "CRYPTO" ? "₿" : market.category === "POLITICS" ? "🏛️" : "🎲"}
                </div>
                <div className="flex-1">
                    <h1 className="text-3xl font-black leading-tight mb-2">{market.question}</h1>
                    <div className="flex gap-6 text-sm font-mono text-gray-400 font-bold">
                        <span className="flex items-center gap-2"><BarChart2 className="w-4 h-4" /> ${market.volume.toLocaleString()} Vol.</span>
                        <span className="text-gray-500">{new Date(market.endTime).toLocaleDateString()}</span>
                        <span className="text-primary hover:underline cursor-pointer flex items-center gap-1"><Share2 className="w-3 h-3" /> Share</span>
                    </div>
                </div>
            </div>

            <PriceChart isPositive={yesPercent > 50} />

            {/* Outcomes List */}
            <div className="bg-surface border-2 border-border p-1 mb-8">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-xs font-mono font-bold text-gray-500 uppercase">
                    <div className="col-span-6">Outcome</div>
                    <div className="col-span-2 text-right">% Chance</div>
                    <div className="col-span-4 text-center">Action</div>
                </div>

                {/* YES Row */}
                <div className="grid grid-cols-12 gap-4 items-center bg-background border-b border-gray-800 p-4 hover:bg-white/5 transition-colors group">
                    <div className="col-span-6 flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-green-500/20 text-green-500 rounded font-black text-xs">YES</div>
                        <span className="font-bold text-lg">Yes</span>
                    </div>
                    <div className="col-span-2 text-right font-mono font-bold text-primary text-xl">{yesPercent}%</div>
                    <div className="col-span-4 flex gap-2 justify-end">
                        <button
                            onClick={() => setActiveBet({ marketId: market.id, outcome: "YES" })}
                            className="bg-primary text-black px-4 py-2 font-bold text-sm hover:bg-white transition-colors"
                        >
                            Buy Yes {market.yesPrice.toFixed(2)}¢
                        </button>
                    </div>
                </div>

                {/* NO Row */}
                <div className="grid grid-cols-12 gap-4 items-center bg-background p-4 hover:bg-white/5 transition-colors group">
                    <div className="col-span-6 flex items-center gap-3">
                        <div className="w-8 h-8 flex items-center justify-center bg-red-500/20 text-red-500 rounded font-black text-xs">NO</div>
                        <span className="font-bold text-lg">No</span>
                    </div>
                    <div className="col-span-2 text-right font-mono font-bold text-secondary text-xl">{noPercent}%</div>
                    <div className="col-span-4 flex gap-2 justify-end">
                        <button
                            onClick={() => setActiveBet({ marketId: market.id, outcome: "NO" })}
                            className="bg-secondary text-black px-4 py-2 font-bold text-sm hover:bg-white transition-colors"
                        >
                            Buy No {(1 - market.yesPrice).toFixed(2)}¢
                        </button>
                    </div>
                </div>
            </div>

            {/* Info Tabs */}
            <div className="border-b border-gray-800 mb-6">
                <div className="flex gap-8">
                    <button className="pb-4 border-b-2 border-white font-bold">Market Context</button>
                    <button className="pb-4 border-b-2 border-transparent text-gray-400 font-bold hover:text-white">Order Book</button>
                    <button className="pb-4 border-b-2 border-transparent text-gray-400 font-bold hover:text-white">History</button>
                </div>
            </div>

            <div className="space-y-4 text-gray-300 leading-relaxed text-sm mb-12">
                <h3 className="font-bold text-white text-lg">{market.question}</h3>
                <p className="bg-surface p-4 border-l-4 border-primary">
                    {market.description}
                </p>
                <div className="text-xs text-gray-500 font-mono mt-4">
                    Resolution Source: <a href="#" className="text-blue-400 hover:underline">CoinGecko API</a>
                </div>
            </div>

            <CommentsSection />
        </div>
    );
}
