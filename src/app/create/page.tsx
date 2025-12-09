"use client";
import { useState } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useMarket } from "@/context/MarketContext";
import { useRouter } from "next/navigation";
import { SystemProgram, Transaction, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";

// Using a random public key as the "House/Fee Collector" for Devnet simulation
// In prod this would be the platform's treasury wallet
const FEE_DESTINATION = new PublicKey("11111111111111111111111111111111");
const CREATION_FEE = 0.1;

export default function CreateMarketPage() {
    const { publicKey, sendTransaction } = useWallet();
    const { connection } = useConnection();
    const { createMarket } = useMarket();
    const router = useRouter();

    const [form, setForm] = useState({
        question: "",
        description: "",
        category: "MEMES",
        image: "",
        duration: "24", // hours
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!publicKey) {
            alert("Please connect your wallet first!");
            return;
        }

        setLoading(true);

        try {
            // 1. Create 0.1 SOL Transaction
            const transaction = new Transaction().add(
                SystemProgram.transfer({
                    fromPubkey: publicKey,
                    toPubkey: FEE_DESTINATION,
                    lamports: CREATION_FEE * LAMPORTS_PER_SOL,
                })
            );

            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = publicKey;

            // 2. Send Transaction
            const signature = await sendTransaction(transaction, connection);
            await connection.confirmTransaction(signature, "confirmed");

            console.log("Creation Fee Paid:", signature);

            // 3. Create Market in Context
            const endTime = new Date(Date.now() + parseInt(form.duration) * 3600000).toISOString();

            createMarket({
                question: form.question,
                description: form.description,
                category: form.category,
                endTime: endTime,
                image: form.image || "/placeholder.png",
                creatorAddress: publicKey.toString(),
            });

            router.push("/");
        } catch (error) {
            console.error("Creation failed", error);
            alert("Transaction failed! Please check your balance (Devnet SOL required).");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-6 max-w-2xl">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Back to Markets
            </Link>

            <div className="bg-surface border-2 border-border p-8 shadow-neo relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 font-black text-9xl select-none pointer-events-none">
                    ?
                </div>

                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-black italic">CREATE MARKET</h1>
                    {!publicKey && <WalletMultiButton />}
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                    <div>
                        <label className="block font-mono font-bold text-sm mb-2 text-gray-400">Question</label>
                        <input
                            required
                            type="text"
                            value={form.question}
                            onChange={(e) => setForm({ ...form, question: e.target.value })}
                            className="w-full bg-black border-2 border-border p-3 font-mono font-bold text-lg focus:outline-none focus:border-primary transition-colors text-white"
                            placeholder="e.g. Will SOL hit $200?"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block font-mono font-bold text-sm mb-2 text-gray-400">Category</label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className="w-full bg-black border-2 border-border p-3 font-mono font-bold text-sm focus:outline-none focus:border-primary transition-colors text-white"
                            >
                                <option value="MEMES">MEMES</option>
                                <option value="CRYPTO">CRYPTO</option>
                                <option value="POLITICS">POLITICS</option>
                                <option value="SPORTS">SPORTS</option>
                            </select>
                        </div>
                        <div>
                            <label className="block font-mono font-bold text-sm mb-2 text-gray-400">Duration (Hours)</label>
                            <input
                                required
                                type="number"
                                min="1"
                                max="720" // 30 days
                                value={form.duration}
                                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                                className="w-full bg-black border-2 border-border p-3 font-mono font-bold text-sm focus:outline-none focus:border-primary transition-colors text-white"
                            />
                            <p className="text-xs text-gray-500 mt-1 font-mono">Max 720h (30 days)</p>
                        </div>
                    </div>

                    <div>
                        <label className="block font-mono font-bold text-sm mb-2 text-gray-400">Description / Rules</label>
                        <textarea
                            required
                            value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            className="w-full bg-black border-2 border-border p-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors text-white h-32"
                            placeholder="Exact resolution rules..."
                        />
                    </div>

                    <div>
                        <label className="block font-mono font-bold text-sm mb-2 text-gray-400">Image URL (Optional)</label>
                        <input
                            type="url"
                            value={form.image}
                            onChange={(e) => setForm({ ...form, image: e.target.value })}
                            className="w-full bg-black border-2 border-border p-3 font-mono text-sm focus:outline-none focus:border-primary transition-colors text-white"
                            placeholder="https://..."
                        />
                    </div>

                    <div className="bg-black/50 p-4 border border-gray-800 text-sm font-mono text-gray-400">
                        <div className="flex justify-between mb-2">
                            <span>Creation Fee</span>
                            <span className="text-white">0.1 SOL</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span>You Earn</span>
                            <span className="text-green-500">50% of fees (1% of Vol)</span>
                        </div>
                    </div>

                    <div className="bg-yellow-500/20 border border-yellow-500 p-4 mb-4 text-xs font-mono text-yellow-500">
                        ⚠ <strong>IMPORTANT:</strong> Ensure your wallet is set to <strong>DEVNET</strong>. Do not send real SOL.
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !publicKey}
                        className={`w-full py-4 font-black text-xl border-2 transition-all flex items-center justify-center gap-2
                            ${loading ? "bg-gray-800 border-gray-600 cursor-not-allowed" : "bg-primary text-black border-primary hover:bg-white shadow-neo hover:translate-x-1 hover:translate-y-1 hover:shadow-none"}
                        `}
                    >
                        {loading ? <Loader2 className="animate-spin" /> : "PAY 0.1 SOL & CREATE"}
                    </button>
                    {!publicKey && <p className="text-center text-red-500 font-mono text-xs mt-2">Connect Wallet to Create</p>}
                </form>
            </div>
        </div>
    );
}
