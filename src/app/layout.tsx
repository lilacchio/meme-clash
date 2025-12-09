import type { Metadata } from "next";
import { Inter, Space_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import BetSlip from "@/components/BetSlip";
import clsx from "clsx";
import AppWalletProvider from "@/components/WalletProvider";
import { MarketProvider } from "@/context/MarketContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-geist-sans" });
const spaceMono = Space_Mono({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-geist-mono",
});

export const metadata: Metadata = {
    title: "MemeClash | Bet on the Meme War",
    description: "The first Neo-Brutalist Prediction Market for Solana Memecoins.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body
                className={clsx(
                    inter.variable,
                    spaceMono.variable,
                    "bg-background text-foreground font-sans antialiased min-h-screen flex flex-col"
                )}
            >
                <AppWalletProvider>
                    <MarketProvider>
                        <Navbar />
                        <div className="flex flex-1 container mx-auto pt-4 gap-6">
                            <aside className="hidden md:block w-64 shrink-0">
                                <Sidebar />
                            </aside>
                            <main className="flex-1 min-w-0">{children}</main>
                            <aside className="hidden lg:block w-80 shrink-0">
                                <BetSlip />
                            </aside>
                        </div>
                    </MarketProvider>
                </AppWalletProvider>
            </body>
        </html>
    );
}
