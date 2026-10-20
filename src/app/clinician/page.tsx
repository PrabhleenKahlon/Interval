
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/clinician/sidebar";

type Priority = "High" | "Moderate" | "Routine";
type MonitoringStatus = "Active" | "Data unavailable";

type Patient = {
    id: string;
    name: string;
    pathway: string;
    day: number;
    totalDays: number;
    priority: Priority;
    monitoring: MonitoringStatus;
    lastSync: string;
    review: string;
};

const patients: Patient[] = [
    {
        id: "1",
        name: "Noha Beydoun",
        pathway: "Cardiac recovery",
        day: 4,
        totalDays: 14,
        priority: "High",
        monitoring: "Active",
        lastSync: "5 min ago",
        review: "Review required",
    },
    {
        id: "2",
        name: "Marilyn Marcanno",
        pathway: "Postpartum recovery",
        day: 6,
        totalDays: 10,
        priority: "Moderate",
        monitoring: "Active",
        lastSync: "12 min ago",
        review: "Review required",
    },
    {
        id: "3",
        name: "Prabhleen Kahlon",
        pathway: "Post-surgical recovery",
        day: 3,
        totalDays: 7,
        priority: "Routine",
        monitoring: "Data unavailable",
        lastSync: "3 hours ago",
        review: "Connectivity check",
    },
];

function priorityStyle(priority: Priority) {
    if (priority === "High") {
        return "bg-red-50 text-red-700 border-red-200";
    }
    if (priority === "Moderate") {
        return "bg-amber-50 text-amber-700 border-amber-200";
    }
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
}

function StatCard({
    label,
    value,
    description,
    accent,
}: {
    label: string;
    value: number;
    description: string;
    accent: string;
}) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{label}</p>
                <span className={`h-2.5 w-2.5 rounded-full ${accent}`} />
            </div>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-900">
                {value}
            </p>
            <p className="mt-2 text-xs text-slate-500">{description}</p>
        </div>
    );
}

export default function ClinicianDashboard() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All patients");

    const filteredPatients = useMemo(() => {
        return patients.filter((patient) => {
            const matchesSearch =
                patient.name.toLowerCase().includes(search.toLowerCase()) ||
                patient.pathway.toLowerCase().includes(search.toLowerCase());

            const matchesFilter =
                filter === "All patients" ||
                (filter === "Needs review" &&
                    patient.review === "Review required") ||
                (filter === "High priority" && patient.priority === "High") ||
                (filter === "Data unavailable" &&
                    patient.monitoring === "Data unavailable");

            return matchesSearch && matchesFilter;
        });
    }, [search, filter]);

    const highPriority = patients.filter(
        (patient) => patient.priority === "High"
    ).length;

    const needsReview = patients.filter(
        (patient) => patient.review === "Review required"
    ).length;

    const dataIssues = patients.filter(
        (patient) => patient.monitoring === "Data unavailable"
    ).length;

    return (
        <div className="min-h-screen bg-[#f5f7fb] text-slate-900 lg:pl-[280px]">
            <Sidebar />

            <div className="flex min-h-screen">
                {/* MAIN CONTENT */}
                <main className="min-w-0 flex-1">

                    {/* HEADER */}
                    <header className="border-b border-slate-200 bg-white px-6 py-5 lg:px-10">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-xs text-slate-500">
                                    Interval / Clinical workspace
                                </p>
                                <h1 className="mt-1 text-2xl font-semibold tracking-tight">
                                    Overview
                                </h1>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="rounded-full bg-blue-50 px-3 py-2 text-xs font-medium text-blue-700">
                                    Prototype environment
                                </span>
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold">
                                    CT
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="mx-auto max-w-7xl space-y-8 px-6 py-8 lg:px-10">
                        {/* PAGE INTRO */}
                        <div>
                            <h2 className="text-2xl font-semibold tracking-tight">
                                Post-discharge monitoring
                            </h2>
                            <p className="mt-2 text-sm text-slate-500">
                                Review recovery signals, identify patients requiring attention,
                                and manage follow-up decisions.
                            </p>
                        </div>

                        {/* SUMMARY CARDS */}
                        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                            <StatCard
                                label="Active patients"
                                value={patients.length}
                                description="Currently enrolled in monitoring"
                                accent="bg-blue-500"
                            />
                            <StatCard
                                label="High priority"
                                value={highPriority}
                                description="Flagged for prioritized review"
                                accent="bg-red-500"
                            />
                            <StatCard
                                label="Needs review"
                                value={needsReview}
                                description="Awaiting clinical assessment"
                                accent="bg-amber-500"
                            />
                            <StatCard
                                label="Data issues"
                                value={dataIssues}
                                description="Missing or interrupted readings"
                                accent="bg-slate-500"
                            />
                        </section>

                        {/* PATIENT TABLE */}
                        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-6">
                                <div>
                                    <h3 className="text-lg font-semibold">
                                        Patient monitoring queue
                                    </h3>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Select a patient to review detailed recovery information.
                                    </p>
                                </div>

                                <Link
                                    href="/clinician/patients"
                                    className="text-sm font-medium text-blue-700 hover:underline"
                                >
                                    View all patients →
                                </Link>
                            </div>

                            <div className="flex flex-wrap gap-3 border-b border-slate-100 p-5">
                                <input
                                    type="text"
                                    placeholder="Search patients or recovery pathway..."
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    className="min-w-[220px] flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-blue-400"
                                />

                                <select
                                    value={filter}
                                    onChange={(event) => setFilter(event.target.value)}
                                    className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-400"
                                >
                                    <option>All patients</option>
                                    <option>Needs review</option>
                                    <option>High priority</option>
                                    <option>Data unavailable</option>
                                </select>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full min-w-[900px] text-left">
                                    <thead className="bg-slate-50">
                                        <tr className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                                            <th className="px-6 py-4">Patient</th>
                                            <th className="px-6 py-4">Recovery pathway</th>
                                            <th className="px-6 py-4">Monitoring</th>
                                            <th className="px-6 py-4">Priority</th>
                                            <th className="px-6 py-4">Last sync</th>
                                            <th className="px-6 py-4">Action</th>
                                        </tr>
                                    </thead>

                                    <tbody className="divide-y divide-slate-100">
                                        {filteredPatients.map((patient) => (
                                            <tr
                                                key={patient.id}
                                                className="transition hover:bg-slate-50"
                                            >
                                                <td className="px-6 py-5">
                                                    <p className="text-sm font-semibold">
                                                        {patient.name}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-400">
                                                        Patient ID: INT-{patient.id.padStart(3, "0")}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5 text-sm text-slate-600">
                                                    {patient.pathway}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <p className="text-sm text-slate-700">
                                                        Day {patient.day} of {patient.totalDays}
                                                    </p>
                                                    <p
                                                        className={`mt-1 text-xs ${patient.monitoring === "Active"
                                                                ? "text-emerald-600"
                                                                : "text-amber-700"
                                                            }`}
                                                    >
                                                        {patient.monitoring}
                                                    </p>
                                                </td>

                                                <td className="px-6 py-5">
                                                    <span
                                                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${priorityStyle(
                                                            patient.priority
                                                        )}`}
                                                    >
                                                        {patient.priority}
                                                    </span>
                                                </td>

                                                <td className="px-6 py-5 text-sm text-slate-500">
                                                    {patient.lastSync}
                                                </td>

                                                <td className="px-6 py-5">
                                                    <Link
                                                        href={`/clinician/patients/INT-${patient.id.padStart(3, "0")}`}
                                                        className="inline-flex rounded-lg bg-[#111b30] px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700"
                                                    >
                                                        View patient →
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}

                                        {filteredPatients.length === 0 && (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="px-6 py-12 text-center text-sm text-slate-500"
                                                >
                                                    No patients match your search.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* LOWER PANELS */}
                        <div className="grid gap-5 lg:grid-cols-2">
                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-semibold">Recent alerts</h3>
                                    <Link
                                        href="/clinician/reviews"
                                        className="text-xs font-medium text-blue-700"
                                    >
                                        View alerts →
                                    </Link>
                                </div>

                                <div className="mt-6 space-y-5">
                                    <div className="flex gap-3">
                                        <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-500" />
                                        <div>
                                            <p className="text-sm font-medium">Pattern change flagged</p>
                                            <p className="mt-1 text-xs text-slate-500">
                                                Noha Beydoun · Cardiac recovery
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Clinical review requested
                                            </p>
                                        </div>
                                    </div>

                                    <div className="border-t border-slate-100 pt-5">
                                        <div className="flex gap-3">
                                            <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-amber-500" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Recovery trend requires review
                                                </p>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Marilyn Marcanno · Postpartum recovery
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </section>

                            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                                <h3 className="text-lg font-semibold">Monitoring integrity</h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Device connectivity and missing measurements are tracked
                                    separately from clinical recovery status.
                                </p>

                                <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                                    <p className="text-sm font-semibold text-amber-900">
                                        Data unavailable
                                    </p>
                                    <p className="mt-2 text-xs leading-5 text-amber-800">
                                        Prabhleen Kahlon&apos;s wearable has not synced for
                                        3 hours. The absence of data cannot be interpreted as
                                        evidence of stable recovery.
                                    </p>
                                    <Link
                                        href="/clinician/patients/INT-003"
                                        className="mt-3 inline-block text-xs font-semibold text-amber-900 underline"
                                    >
                                        Review monitoring status →
                                    </Link>
                                </div>
                            </section>
                        </div>

                        {/* SAFETY DISCLAIMER */}
                        <div className="border-t border-slate-200 pt-6">
                            <p className="max-w-4xl text-xs leading-6 text-slate-500">
                                Interval is a conceptual post-discharge monitoring system.
                                All patient information and alerts shown are fictional.
                                AI-supported flags are requests for human review, not
                                diagnoses or automated treatment decisions. This prototype
                                does not provide real clinical monitoring.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
