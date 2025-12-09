"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
// WalletMultiButton can only be used on client side
const WalletMultiButton = dynamic(
    async () => (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
    { ssr: false }
);

export default function Navbar() {
    return (
        <header className="border-b-2 border-border bg-background sticky top-0 z-50">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 bg-primary border-2 border-white shadow-neo-sm group-hover:shadow-neo transition-all" />
                    <span className="font-mono font-black text-xl tracking-tighter italic">
                        MEME<span className="text-primary">CLASH</span>
                    </span>
                </Link>

                <div className="flex items-center gap-4">
                    <Link
                        href="/create"
                        className="hidden md:flex items-center gap-1 font-mono font-bold text-sm bg-white/10 hover:bg-white/20 text-white px-3 py-2 border border-transparent hover:border-white transition-all"
                    >
                        ＋ CREATE
                    </Link>

                    <Link
                        href="/profile"
                        className="hidden md:flex items-center gap-1 font-mono font-bold text-sm text-gray-400 hover:text-primary transition-colors"
                    >
                        PROFILE
                    </Link>

                    <WalletMultiButton style={{
                        backgroundColor: '#ccff00',
                        color: 'black',
                        fontFamily: 'var(--font-geist-mono)',
                        fontWeight: 'bold',
                        border: '2px solid white',
                        borderRadius: '0px',
                        boxShadow: '4px 4px 0px 0px #ffffff',
                        height: '40px',
                    }} />
                </div>
            </div>
        </header>
    );
}
