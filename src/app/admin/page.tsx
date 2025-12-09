"use client";

import { useState } from "react";
import { Plus, CheckCircle, XCircle } from "lucide-react";
import { useMarket } from "@/context/MarketContext";

export default function AdminPage() {
    const { markets, createMarket, resolveMarket } = useMarket();
    const [activeTab, setActiveTab] = useState("create");
    const [formData, setFormData] = useState({
        question: "",
        category: "CRYPTO",
        endTime: "",
        description: "",
        image: "/sol.png"
    });

    const handleCreate = () => {
        if (!formData.question || !formData.endTime) return;
        createMarket({
            question: formData.question,
            category: formData.category,
            endTime: new Date(formData.endTime).toISOString(),
            description: formData.description || "No description",
            image: formData.image
        });
        alert("Market Created!");
        setFormData({ question: "", category: "CRYPTO", endTime: "", description: "", image: "/sol.png" });
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h1 className="text-4xl font-black italic mb-8">ADMIN <span className="text-secondary">PANEL</span></h1>

            <div className="flex gap-4 mb-8 border-b-2 border-border">
                <button
                    onClick={() => setActiveTab("create")}
                    className={`px-6 py-3 font-mono font-bold border-b-4 transition-all ${activeTab === "create" ? "border-primary text-white" : "border-transparent text-gray-500"}`}
                >
                    CREATE MARKET
                </button>
                <button
                    onClick={() => setActiveTab("resolve")}
                    className={`px-6 py-3 font-mono font-bold border-b-4 transition-all ${activeTab === "resolve" ? "border-primary text-white" : "border-transparent text-gray-500"}`}
                >
                    RESOLVE MARKETS
                </button>
            </div>

            {activeTab === "create" ? (
                <div className="bg-surface border-2 border-border p-8 shadow-neo">
                    <div className="space-y-6">
                        <div>
                            <label className="block font-mono font-bold text-sm mb-2 text-primary">QUESTION</label>
                            <input
                                type="text"
                                value={formData.question}
                                onChange={e => setFormData({ ...formData, question: e.target.value })}
                                placeholder="e.g. Will BONK hit $0.00005?"
                                className="w-full bg-background border-2 border-border p-3 font-bold focus:outline-none focus:border-primary transition-colors text-white"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label className="block font-mono font-bold text-sm mb-2 text-primary">END DATE</label>
                                <input
                                    type="datetime-local"
                                    value={formData.endTime}
                                    onChange={e => setFormData({ ...formData, endTime: e.target.value })}
                                    className="w-full bg-background border-2 border-border p-3 font-bold focus:outline-none focus:border-primary transition-colors text-white"
                                />
                            </div>
                            <div>
                                <label className="block font-mono font-bold text-sm mb-2 text-primary">CATEGORY</label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-background border-2 border-border p-3 font-bold focus:outline-none focus:border-primary transition-colors text-white"
                                >
                                    <option>CRYPTO</option>
                                    <option>MEMES</option>
                                    <option>POLITICS</option>
                                    <option>SPORTS</option>
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block font-mono font-bold text-sm mb-2 text-primary">DESCRIPTION</label>
                            <textarea
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-background border-2 border-border p-3 font-bold focus:outline-none focus:border-primary transition-colors text-white h-24"
                            />
                        </div>
                        <button
                            onClick={handleCreate}
                            className="w-full py-4 bg-primary text-black font-black text-xl border-2 border-white shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                        >
                            LAUNCH MARKET
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Active Markets for Resolution */}
                    {markets.filter(m => !m.resolved).map((market) => (
                        <div key={market.id} className="bg-surface border-2 border-border p-4 flex items-center justify-between">
                            <div>
                                <h3 className="font-bold">{market.question}</h3>
                                <p className="text-xs font-mono text-gray-400">Ends: {new Date(market.endTime).toLocaleDateString()} • Vol: ${market.volume}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => resolveMarket(market.id, true)}
                                    className="px-4 py-2 bg-green-500/20 text-green-500 border-2 border-green-500 font-bold hover:bg-green-500 hover:text-black transition-all flex items-center gap-2"
                                >
                                    <CheckCircle className="w-4 h-4" /> YES
                                </button>
                                <button
                                    onClick={() => resolveMarket(market.id, false)}
                                    className="px-4 py-2 bg-red-500/20 text-red-500 border-2 border-red-500 font-bold hover:bg-red-500 hover:text-black transition-all flex items-center gap-2"
                                >
                                    <XCircle className="w-4 h-4" /> NO
                                </button>
                            </div>
                        </div>
                    ))}
                    {markets.filter(m => !m.resolved).length === 0 && (
                        <div className="text-center text-gray-500 p-8">No active markets to resolve.</div>
                    )}
                </div>
            )}
        </div>
    );
}
