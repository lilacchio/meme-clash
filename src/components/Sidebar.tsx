import Link from "next/link";
import { Home, TrendingUp, Newspaper, Shield, Settings } from "lucide-react";

const navItems = [
    { name: "Markets", icon: Home, href: "/" },
    { name: "Leaderboard", icon: TrendingUp, href: "/leaderboard" },
    { name: "News", icon: Newspaper, href: "/news" },
];

export default function Sidebar() {
    return (
        <nav className="sticky top-24 space-y-2">
            {navItems.map((item) => (
                <Link
                    key={item.name}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 font-mono font-bold text-sm uppercase border-2 border-transparent hover:border-primary hover:shadow-neo transition-all bg-surface hover:bg-surface/80"
                >
                    <item.icon className="w-5 h-5 text-primary" />
                    {item.name}
                </Link>
            ))}
        </nav>
    );
}
