"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "@/components/clinician/sidebar";

type Decision = "Follow-up required" | "Continue monitoring" | "Further assessment needed";
type Review = {
    id: string;
    patient: string;
    pathway: string;
    priority: "High" | "Moderate";
    flag: string;
    explanation: string;
    decision?: Decision;
    rationale?: string;
    reviewer?: string;
    completedAt?: string;
};

const initialReviews: Review[] = [
    {
        id: "INT-001",
        patient: "Noha Beydoun",
        pathway: "Cardiac recovery",
        priority: "High",
        flag: "Heart-rate pattern change",
        explanation: "A change from the patient's recent recovery trend was flagged for clinical assessment. This is not a diagnosis.",
    },
    {
        id: "INT-002",
        patient: "Marilyn Marcanno",
        pathway: "Postpartum recovery",
        priority: "Moderate",
        flag: "Recovery trend requires review",
        explanation: "Recent monitoring patterns warrant a clinician's interpretation alongside symptoms and clinical history.",
    },
];

export default function ClinicalReviewsPage() {
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [decision, setDecision] = useState<Decision | "">("");
    const [rationale, setRationale] = useState("");
    const [reviewer, setReviewer] = useState("");
    const [showCompleted, setShowCompleted] = useState(false);

    const pending = reviews.filter((review) => !review.decision);
    const completed = reviews.filter((review) => review.decision);
    const selected = reviews.find((review) => review.id === selectedId);

    function openReview(id: string) {
        setSelectedId(id);
        setDecision("");
        setRationale("");
        setReviewer("");
    }

    function submitReview() {
        if (!selected || !decision || !rationale.trim() || !reviewer.trim()) return;
        setReviews((current) => current.map((review) =>
            review.id === selected.id
                ? { ...review, decision, rationale: rationale.trim(), reviewer: reviewer.trim(), completedAt: new Date().toLocaleString() }
                : review
        ));
        setSelectedId(null);
    }

    return (
        <div className="min-h-screen bg-[#f4f7fb] text-[#111b31] lg:pl-[280px]">
            <Sidebar />
            <header className="border-b border-slate-200 bg-white">
                <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-6 lg:px-12">
                    <div>
                        <p className="text-sm text-slate-500">Interval / Clinical workspace</p>
                        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Clinical reviews</h1>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                        <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-blue-600">Prototype environment</span>
                        <Link href="/" className="text-sm text-slate-500 hover:text-slate-900">Back to website ↗</Link>
                    </div>
                </div>
            </header>

            <main className="mx-auto max-w-[1500px] space-y-8 px-6 py-10 lg:px-12">
                <div>
                    <h2 className="text-2xl font-semibold tracking-tight">Human review queue</h2>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500">AI-supported monitoring flags are requests for assessment, not diagnoses or treatment decisions. A clinician must review the underlying patient record before documenting an action.</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                    {[
                        { label: "Pending reviews", value: pending.length, dot: "bg-amber-500" },
                        { label: "Completed in this demo", value: completed.length, dot: "bg-emerald-500" },
                        { label: "Connectivity issues", value: 1, dot: "bg-slate-500" },
                    ].map((item) => (
                        <div key={item.label} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                            <div className="flex items-center justify-between"><p className="text-sm text-slate-500">{item.label}</p><span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} /></div>
                            <p className="mt-3 text-4xl font-semibold">{item.value}</p>
                        </div>
                    ))}
                </div>

                <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-100 px-6 py-6">
                        <h3 className="text-xl font-semibold">Awaiting clinical assessment</h3>
                        <p className="mt-1 text-sm text-slate-500">Open the patient record to examine trends, context, and monitoring history before recording a decision.</p>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {pending.length === 0 && <p className="p-8 text-sm text-slate-500">No pending reviews in this demonstration.</p>}
                        {pending.map((review) => (
                            <article key={review.id} className="flex flex-wrap items-start justify-between gap-6 p-6">
                                <div className="min-w-0 flex-1 space-y-2">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <h4 className="font-semibold">{review.patient}</h4>
                                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${review.priority === "High" ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>{review.priority} priority</span>
                                    </div>
                                    <p className="text-xs text-slate-500">{review.id} · {review.pathway}</p>
                                    <p className="text-sm font-medium">{review.flag}</p>
                                    <p className="max-w-2xl text-sm leading-6 text-slate-500">{review.explanation}</p>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    <Link href={`/clinician/patients/${review.id}`} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium hover:bg-slate-50">View patient record ↗</Link>
                                    <button type="button" onClick={() => openReview(review.id)} className="rounded-lg bg-[#111b31] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#243653]">Document review →</button>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="rounded-2xl border border-amber-200 bg-amber-50 p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                            <h3 className="font-semibold text-amber-950">Connectivity follow-up · Prabhleen Kahlon</h3>
                            <p className="mt-2 max-w-3xl text-sm leading-6 text-amber-900">INT-003 has not synced for 3 hours. Missing readings are a data-integrity concern, not evidence of stable recovery. Check device connectivity and follow the appropriate outreach procedure.</p>
                        </div>
                        <Link href="/clinician/patients/INT-003" className="text-sm font-semibold text-amber-950 underline underline-offset-4">View patient →</Link>
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <button type="button" onClick={() => setShowCompleted((value) => !value)} aria-expanded={showCompleted} className="flex w-full items-center justify-between px-6 py-6 text-left">
                        <span className="text-lg font-semibold">Completed reviews ({completed.length})</span>
                        <span className="text-sm text-slate-500">{showCompleted ? "Hide −" : "Show +"}</span>
                    </button>
                    {showCompleted && <div className="space-y-4 border-t border-slate-100 p-6">
                        {completed.length === 0 ? <p className="text-sm text-slate-500">No reviews have been completed in this demo session.</p> : completed.map((review) => (
                            <div key={review.id} className="rounded-xl border border-slate-200 p-5">
                                <div className="flex flex-wrap items-center justify-between gap-2"><p className="font-semibold">{review.patient} · {review.flag}</p><span className="text-xs text-emerald-700">Documented</span></div>
                                <p className="mt-2 text-sm"><strong>Decision:</strong> {review.decision}</p>
                                <p className="mt-1 text-sm text-slate-600"><strong>Rationale:</strong> {review.rationale}</p>
                                <p className="mt-2 text-xs text-slate-500">Reviewed by {review.reviewer} · {review.completedAt}</p>
                            </div>
                        ))}
                    </div>}
                </section>

                <p className="border-t border-slate-200 pt-6 text-xs leading-6 text-slate-500">Educational prototype using fictional cases. Review entries are stored only in this page's temporary browser state; they are not saved to a database, sent to clinicians, or synchronized with individual patient records. Refreshing the page resets this demonstration.</p>
            </main>

            {selected && (
                <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/70 p-4" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedId(null); }}>
                    <div role="dialog" aria-modal="true" aria-labelledby="review-dialog-heading" className="my-auto w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
                        <div className="flex items-start justify-between gap-4">
                            <div><p className="text-xs uppercase tracking-widest text-slate-500">Demonstration review</p><h2 id="review-dialog-heading" className="mt-2 text-2xl font-semibold">{selected.patient}</h2><p className="mt-1 text-sm text-slate-500">{selected.flag}</p></div>
                            <button type="button" onClick={() => setSelectedId(null)} aria-label="Close review" className="text-2xl text-slate-500 hover:text-slate-900">×</button>
                        </div>
                        <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm leading-6 text-blue-950">Review the patient's measurements and clinical context before deciding. This prototype cannot verify that the record was examined.</div>
                        <Link href={`/clinician/patients/${selected.id}`} className="mt-4 inline-block text-sm font-medium text-blue-700 underline underline-offset-4">Open patient record ↗</Link>
                        <div className="mt-6 space-y-4">
                            <div><label htmlFor="reviewer" className="block text-sm font-medium">Reviewer name</label><input id="reviewer" value={reviewer} onChange={(event) => setReviewer(event.target.value)} maxLength={80} placeholder="Demo clinician name" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" /></div>
                            <div><label htmlFor="decision" className="block text-sm font-medium">Clinical decision</label><select id="decision" value={decision} onChange={(event) => setDecision(event.target.value as Decision | "")} className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500"><option value="">Select a decision</option><option>Follow-up required</option><option>Continue monitoring</option><option>Further assessment needed</option></select></div>
                            <div><label htmlFor="rationale" className="block text-sm font-medium">Reasoning and next steps</label><textarea id="rationale" rows={4} maxLength={1000} value={rationale} onChange={(event) => setRationale(event.target.value)} placeholder="Document why this decision was made and what happens next..." className="mt-2 w-full resize-y rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-500" /></div>
                        </div>
                        <div className="mt-6 flex flex-wrap justify-end gap-3"><button type="button" onClick={() => setSelectedId(null)} className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-medium">Cancel</button><button type="button" disabled={!reviewer.trim() || !decision || !rationale.trim()} onClick={submitReview} className="rounded-lg bg-[#111b31] px-5 py-3 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-40">Save demo review</button></div>
                    </div>
                </div>
            )}
        </div>
    );
}
