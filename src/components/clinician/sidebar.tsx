
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    {
        label: "Overview",
        href: "/clinician",
        icon: "▦",
    },
    {
        label: "Patients",
        href: "/clinician/patients",
        icon: "♙",
    },
    {
        label: "Clinical Reviews",
        href: "/clinician/reviews",
        icon: "☑",
    },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] flex-col bg-[#111b31] text-white lg:flex">

            {/* Interval branding */}
            <div className="flex items-center gap-4 px-6 py-9">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-2xl">
                    ◈
                </div>

                <div>
                    <Link
                        href="/clinician"
                        className="text-xl font-semibold tracking-tight"
                    >
                        Interval
                    </Link>

                    <p className="mt-1 text-xs text-slate-400">
                        Clinical workspace
                    </p>
                </div>
            </div>

            {/* Workspace navigation */}
            <div className="px-6 pt-8">
                <p className="mb-5 px-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Workspace
                </p>

                <nav
                    className="space-y-2"
                    aria-label="Clinical workspace navigation"
                >
                    {navigation.map((item) => {
                        const active =
                            item.href === "/clinician"
                                ? pathname === item.href
                                : pathname === item.href ||
                                pathname.startsWith(item.href + "/");

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center gap-4 rounded-xl px-5 py-4 text-sm font-medium transition-colors ${active
                                        ? "bg-white/15 text-white"
                                        : "text-slate-400 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <span
                                    className="w-5 text-center text-lg"
                                    aria-hidden="true"
                                >
                                    {item.icon}
                                </span>

                                <span>{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Footer */}
            <div className="mt-auto border-t border-white/10 px-7 py-6">
                <p className="text-xs text-slate-500">
                    Interval · Educational prototype
                </p>
            </div>
        </aside>
    );
}
