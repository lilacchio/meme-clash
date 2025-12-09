"use client";

import { Trophy, TrendingUp, Wallet } from "lucide-react";

const LEADERS = [
    { rank: 1, name: "degen_king.sol", profit: "+$45,230", winRate: "88%", volume: "$1.2M", pic: "👑" },
    { rank: 2, name: "satoshi_clown.sol", profit: "+$32,100", winRate: "76%", volume: "$890k", pic: "🤡" },
    { rank: 3, name: "pepe_prophet.sol", profit: "+$28,450", winRate: "62%", volume: "$2.1M", pic: "🐸" },
    { rank: 4, name: "solana_surfer.sol", profit: "+$12,300", winRate: "54%", volume: "$450k", pic: "🏄" },
    { rank: 5, name: "doge_father.sol", profit: "-$2,100", winRate: "41%", volume: "$120k", pic: "🐕" },
];

export default function LeaderboardPage() {
    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-black italic mb-8 flex items-center gap-4">
                <Trophy className="w-10 h-10 text-primary" />
                WAR <span className="text-secondary">ROOM</span>
            </h1>

            <div className="bg-surface border-2 border-border p-8 shadow-neo">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b-2 border-border text-gray-500 font-mono text-sm">
                            <th className="p-4">RANK</th>
                            <th className="p-4">TRADER</th>
                            <th className="p-4">PNL</th>
                            <th className="p-4">WIN RATE</th>
                            <th className="p-4">VOLUME</th>
                        </tr>
                    </thead>
                    <tbody>
                        {LEADERS.map((leader) => (
                            <tr key={leader.rank} className="border-b border-gray-800 hover:bg-white/5 transition-colors font-mono font-bold">
                                <td className="p-4 text-2xl items-center flex gap-2">
                                    <span className={leader.rank <= 3 ? "text-primary" : "text-gray-500"}>#{leader.rank}</span>
                                </td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{leader.pic}</span>
                                        <span className="text-white hover:text-primary cursor-pointer hover:underline transition-colors">{leader.name}</span>
                                    </div>
                                </td>
                                <td className={`p-4 ${leader.profit.startsWith("+") ? "text-green-500" : "text-red-500"}`}>
                                    {leader.profit}
                                </td>
                                <td className="p-4 text-white">{leader.winRate}</td>
                                <td className="p-4 text-gray-400">{leader.volume}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                <div className="bg-surface border-2 border-border p-6 shadow-neo flex flex-col items-center text-center">
                    <TrendingUp className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-bold text-gray-400 text-sm mb-1">TOTAL VOLUME</h3>
                    <p className="font-black text-2xl text-white">$12,450,230</p>
                </div>
                <div className="bg-surface border-2 border-border p-6 shadow-neo flex flex-col items-center text-center">
                    <Wallet className="w-8 h-8 text-secondary mb-4" />
                    <h3 className="font-bold text-gray-400 text-sm mb-1">TVL</h3>
                    <p className="font-black text-2xl text-white">$4,200,500</p>
                </div>
                <div className="bg-surface border-2 border-border p-6 shadow-neo flex flex-col items-center text-center">
                    <Trophy className="w-8 h-8 text-yellow-500 mb-4" />
                    <h3 className="font-bold text-gray-400 text-sm mb-1">TOP 24H GAINER</h3>
                    <p className="font-black text-2xl text-white">+342%</p>
                </div>
            </div>
        </div>
    );
}
