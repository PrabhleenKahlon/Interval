
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/clinician/sidebar";

type Patient = {
    id: string;
    name: string;
    pathway: string;
    day: number;
    duration: number;
    priority: "High" | "Needs review" | "Routine";
    lastSync: string;
    connection: "Connected" | "Data unavailable";
};

const patients: Patient[] = [
    {
        id: "INT-001",
        name: "Noha Beydoun",
        pathway: "Cardiac recovery",
        day: 4,
        duration: 14,
        priority: "High",
        lastSync: "5 min ago",
        connection: "Connected",
    },
    {
        id: "INT-002",
        name: "Marilyn Marcanno",
        pathway: "Postpartum recovery",
        day: 6,
        duration: 10,
        priority: "Needs review",
        lastSync: "12 min ago",
        connection: "Connected",
    },
    {
        id: "INT-003",
        name: "Prabhleen Kahlon",
        pathway: "Post-surgical recovery",
        day: 3,
        duration: 7,
        priority: "Routine",
        lastSync: "3 hours ago",
        connection: "Data unavailable",
    },
];

export default function ClinicianPatientsPage() {
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All patients");

    const filteredPatients = useMemo(() => {
        return patients.filter((patient) => {
            const matchesSearch =
                patient.name.toLowerCase().includes(search.toLowerCase()) ||
                patient.id.toLowerCase().includes(search.toLowerCase()) ||
                patient.pathway.toLowerCase().includes(search.toLowerCase());

            const matchesFilter =
                filter === "All patients" ||
                patient.priority === filter ||
                (filter === "Data issues" &&
                    patient.connection === "Data unavailable");

            return matchesSearch && matchesFilter;
        });
    }, [search, filter]);

    return (
        <div className="min-h-screen bg-[#f4f7fb] text-[#111b31] lg:pl-[280px]">
            <Sidebar />
           
            <header className="border-b border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-6 lg:px-12">
                    <div>
                        <p className="text-sm text-slate-500">
                            Interval / Clinical workspace
                        </p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
                            Patients
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">
                            Prototype environment
                        </span>
                        <Link
                            href="/"
                            className="text-sm font-medium text-slate-500 hover:text-slate-900"
                        >
                            Back to website ↗
                        </Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1600px] space-y-8 px-6 py-10 lg:px-12">
                <div>
                    <h2 className="text-3xl font-semibold tracking-tight">
                        Patient directory
                    </h2>
                    <p className="mt-3 text-base text-slate-500">
                        View enrolled patients, monitor connectivity, and open
                        individual recovery records for clinical review.
                    </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">Active patients</p>
                        <p className="mt-3 text-4xl font-semibold">
                            {patients.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">Requiring review</p>
                        <p className="mt-3 text-4xl font-semibold">
                            {patients.filter((p) => p.priority !== "Routine").length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                        <p className="text-sm text-slate-500">Data issues</p>
                        <p className="mt-3 text-4xl font-semibold">
                            {patients.filter((p) => p.connection === "Data unavailable").length}
                        </p>
                    </div>
                </div>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 p-7">
                        <div>
                            <h3 className="text-xl font-semibold">
                                Active monitoring patients
                            </h3>
                            <p className="mt-2 text-sm text-slate-500">
                                Select a patient to view detailed recovery information.
                            </p>
                        </div>

                        <span className="text-sm text-slate-500">
                            {filteredPatients.length} of {patients.length} patients
                        </span>
                    </div>

                    <div className="grid gap-3 border-b border-slate-100 bg-slate-50/50 p-6 md:grid-cols-[1fr_220px]">
                        <input
                            type="search"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search patients, IDs, or recovery pathways..."
                            aria-label="Search patients"
                            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm outline-none focus:border-blue-500"
                        />

                        <select
                            value={filter}
                            onChange={(event) => setFilter(event.target.value)}
                            aria-label="Filter patients"
                            className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"
                        >
                            <option>All patients</option>
                            <option>High</option>
                            <option>Needs review</option>
                            <option>Routine</option>
                            <option>Data issues</option>
                        </select>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px] text-left">
                            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                <tr>
                                    <th className="px-7 py-5 font-semibold">Patient</th>
                                    <th className="px-5 py-5 font-semibold">Recovery pathway</th>
                                    <th className="px-5 py-5 font-semibold">Monitoring</th>
                                    <th className="px-5 py-5 font-semibold">Priority</th>
                                    <th className="px-5 py-5 font-semibold">Last sync</th>
                                    <th className="px-5 py-5 font-semibold">Action</th>
                                </tr>
                            </thead>

                            <tbody className="divide-y divide-slate-100">
                                {filteredPatients.map((patient) => (
                                    <tr
                                        key={patient.id}
                                        className="transition-colors hover:bg-slate-50"
                                    >
                                        <td className="px-7 py-6">
                                            <p className="font-semibold">{patient.name}</p>
                                            <p className="mt-1 text-sm text-slate-400">
                                                Patient ID: {patient.id}
                                            </p>
                                        </td>

                                        <td className="px-5 py-6 text-sm text-slate-600">
                                            {patient.pathway}
                                        </td>

                                        <td className="px-5 py-6">
                                            <p className="text-sm">
                                                Day {patient.day} of {patient.duration}
                                            </p>
                                            <p
                                                className={`mt-1 text-sm ${patient.connection === "Connected"
                                                        ? "text-emerald-600"
                                                        : "text-amber-600"
                                                    }`}
                                            >
                                                {patient.connection === "Connected"
                                                    ? "Active"
                                                    : "Data unavailable"}
                                            </p>
                                        </td>

                                        <td className="px-5 py-6">
                                            <span
                                                className={`inline-flex rounded-full border px-3 py-1 text-xs font-medium ${patient.priority === "High"
                                                        ? "border-red-200 bg-red-50 text-red-600"
                                                        : patient.priority === "Needs review"
                                                            ? "border-amber-200 bg-amber-50 text-amber-700"
                                                            : "border-slate-200 bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {patient.priority}
                                            </span>
                                        </td>

                                        <td className="px-5 py-6 text-sm text-slate-500">
                                            {patient.lastSync}
                                        </td>

                                        <td className="px-5 py-6">
                                            <Link
                                                href={`/clinician/patients/${patient.id}`}
                                                className="inline-flex items-center rounded-lg bg-[#111b31] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#243653]"
                                            >
                                                View patient →
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {filteredPatients.length === 0 && (
                            <div className="px-6 py-16 text-center">
                                <p className="font-medium">No matching patients</p>
                                <p className="mt-2 text-sm text-slate-500">
                                    Try changing your search or filter.
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                <p className="text-sm leading-relaxed text-slate-500">
                    Educational prototype. All patient records and monitoring
                    scenarios are fictional. Missing wearable data must not be
                    interpreted as evidence of normal recovery. AI-supported
                    flags require human clinical assessment.
                </p>
            </main>
        </div>
    );
}
