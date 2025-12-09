import { ArrowUpRight, Clock, DollarSign } from "lucide-react";
import Link from "next/link";

interface MarketProps {
    id: string;
    question: string;
    yesPrice: number;
    volume: string;
    endTime: string;
    image: string;
}

export default function MarketCard({ id, question, yesPrice, volume, endTime, image }: MarketProps) {
    const noPrice = 1 - yesPrice;
    const yesPercent = Math.round(yesPrice * 100);
    const noPercent = Math.round(noPrice * 100);

    return (
        <Link href={`/market/${id}`} className="block group">
            <div className="bg-surface border-2 border-border shadow-neo group-hover:shadow-neo-lg group-hover:-translate-y-1 transition-all h-full flex flex-col">
                <div className="h-32 bg-gray-800 relative border-b-2 border-border overflow-hidden">
                    {/* Placeholder for Market Image */}
                    <div className="absolute inset-0 flex items-center justify-center text-4xl font-black text-gray-700 opacity-20">
                        MEME WAR
                    </div>
                    <div className="absolute top-2 right-2 bg-black border border-white px-2 py-1 text-xs font-mono font-bold text-primary flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {endTime}
                    </div>
                </div>

                <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-bold text-lg leading-tight mb-4 flex-1 group-hover:text-primary transition-colors">
                        {question}
                    </h3>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between text-sm font-mono font-bold text-gray-400">
                            <span>ODDS</span>
                            <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" /> {volume} Vol</span>
                        </div>

                        {/* Probability Bars */}
                        <div className="flex h-8 w-full border-2 border-border">
                            <div
                                style={{ width: `${yesPercent}%` }}
                                className="bg-primary h-full flex items-center justify-start px-2 text-black font-bold text-xs"
                            >
                                YES {yesPercent}%
                            </div>
                            <div
                                style={{ width: `${noPercent}%` }}
                                className="bg-secondary h-full flex items-center justify-end px-2 text-black font-bold text-xs"
                            >
                                {noPercent}% NO
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}
