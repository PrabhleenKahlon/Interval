"use client";

import Link from "next/link";
import { useState } from "react";

type Tab = "overview" | "checkin" | "privacy";
type Feeling = "Better" | "About the same" | "Worse" | "";

const readings = [
    { label: "Heart rate", value: "76", unit: "bpm" },
    { label: "Oxygen saturation", value: "98", unit: "%" },
    { label: "Temperature", value: "36.8", unit: "°C" },
    { label: "Breathing rate", value: "16", unit: "/min" },
];

export default function PatientPage() {
    const [tab, setTab] = useState<Tab>("overview");
    const [feeling, setFeeling] = useState<Feeling>("");
    const [symptoms, setSymptoms] = useState("");
    const [checkinSaved, setCheckinSaved] = useState(false);
    const [supportOpen, setSupportOpen] = useState(false);
    const [supportMessage, setSupportMessage] = useState("");
    const [supportSubmitted, setSupportSubmitted] = useState(false);

    return (
        <div className="min-h-screen bg-[#080808] text-white">
            <header className="border-b border-white/10">
                <div className="mx-auto flex h-20 max-w-5xl items-center justify-between px-5 sm:px-8">
                    <Link href="/" className="text-xl font-semibold tracking-tight hover:opacity-80">Interval</Link>
                    <Link href="/" className="text-sm text-neutral-400 transition hover:text-white">← Back to website</Link>
                </div>
            </header>

            <main className="mx-auto max-w-5xl px-5 pb-20 pt-10 sm:px-8 sm:pt-14">
                <div className="mb-12 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-sm leading-relaxed text-neutral-400">
                    <span className="font-medium text-neutral-200">Academic demonstration.</span> All names, measurements, and scenarios are fictional. Interval is not a functioning medical device or emergency service.
                </div>

                <div className="flex flex-wrap items-end justify-between gap-6">
                    <div>
                        <p className="mb-3 text-xs uppercase tracking-[0.25em] text-neutral-500">Your recovery</p>
                        <h1 className="text-4xl font-semibold tracking-[-0.045em] sm:text-6xl">Good morning, Alex.</h1>
                        <p className="mt-4 text-base text-neutral-400">Post-surgical recovery <span className="mx-2 text-neutral-600">·</span> Day 5 of 14</p>
                    </div>
                    <div className="rounded-full border border-white/15 px-4 py-2 text-sm text-neutral-300"><span className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />Device connected</div>
                </div>

                <nav aria-label="Patient portal sections" className="mt-10 flex flex-wrap gap-2 border-b border-white/10 pb-5">
                    {([["overview", "Overview"], ["checkin", "Daily check-in"], ["privacy", "Privacy & consent"]] as const).map(([key, label]) => (
                        <button key={key} type="button" onClick={() => setTab(key)} aria-current={tab === key ? "page" : undefined} className={`rounded-full px-5 py-2.5 text-sm transition ${tab === key ? "bg-white text-black" : "bg-white/[0.07] text-neutral-400 hover:bg-white/10 hover:text-white"}`}>{label}</button>
                    ))}
                </nav>

                {tab === "overview" && (
                    <div className="mt-10 space-y-8">
                        <section className="rounded-3xl border border-white/10 bg-[#121212] p-6 sm:p-8">
                            <div className="flex flex-wrap items-start justify-between gap-5">
                                <div>
                                    <h2 className="text-xl font-semibold">Your wearable is connected</h2>
                                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400">Your device is sharing recovery readings for clinical review. Connection status does not indicate whether your recovery is normal.</p>
                                </div>
                                <div className="text-left sm:text-right"><p className="text-sm text-neutral-200">82% battery</p><p className="mt-1 text-xs text-neutral-500">Last synced: just now</p></div>
                            </div>
                            <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-[82%] rounded-full bg-white/70" /></div>
                        </section>

                        <section>
                            <div className="mb-5 flex flex-wrap items-end justify-between gap-2">
                                <h2 className="text-2xl font-semibold tracking-tight">Latest readings</h2>
                                <span className="text-xs text-neutral-500">Illustrative values · Last synced just now</span>
                            </div>
                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                                {readings.map((reading) => (
                                    <div key={reading.label} className="rounded-2xl border border-white/10 bg-[#121212] p-5">
                                        <p className="min-h-10 text-sm text-neutral-400">{reading.label}</p>
                                        <p className="mt-3 text-3xl font-semibold tracking-tight">{reading.value}<span className="ml-1 text-sm font-normal text-neutral-400">{reading.unit}</span></p>
                                    </div>
                                ))}
                            </div>
                            <p className="mt-3 text-xs leading-relaxed text-neutral-500">A single reading cannot confirm that you are recovering well. Your care team considers changes over time alongside your symptoms and clinical history.</p>
                        </section>

                        <div className="grid gap-4 md:grid-cols-2">
                            <section className="rounded-3xl border border-white/10 bg-[#121212] p-6 sm:p-7">
                                <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Your next follow-up</p>
                                <h2 className="mt-4 text-3xl font-semibold">October 27</h2>
                                <p className="mt-2 text-sm text-neutral-400">Scheduled post-operative assessment</p>
                                <p className="mt-6 text-xs leading-relaxed text-neutral-500">Your follow-up remains scheduled even while monitoring is active.</p>
                            </section>
                            <section className="rounded-3xl border border-white/10 bg-[#121212] p-6 sm:p-7">
                                <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">Daily check-in</p>
                                <h2 className="mt-4 text-xl font-semibold">How are you feeling today?</h2>
                                <p className="mt-2 text-sm leading-relaxed text-neutral-400">Your symptoms and experience matter alongside the wearable readings.</p>
                                <button onClick={() => setTab("checkin")} className="mt-6 text-sm font-medium text-white underline underline-offset-4 hover:text-neutral-300">{checkinSaved ? "Review today's check-in" : "Complete check-in"} →</button>
                            </section>
                        </div>
                    </div>
                )}

                {tab === "checkin" && (
                    <section className="mt-10 max-w-2xl rounded-3xl border border-white/10 bg-[#121212] p-6 sm:p-8">
                        <p className="text-xs uppercase tracking-[0.2em] text-neutral-500">Optional daily check-in</p>
                        <h2 className="mt-3 text-2xl font-semibold">How are you feeling today?</h2>
                        <p className="mt-3 text-sm leading-relaxed text-neutral-400">Your answers add context to your readings. You can skip this check-in. It is not monitored for emergencies.</p>
                        <div className="mt-8 space-y-3">
                            {(["Better", "About the same", "Worse"] as const).map((option) => (
                                <button key={option} type="button" onClick={() => { setFeeling(option); setCheckinSaved(false); }} className={`block w-full rounded-xl border px-5 py-4 text-left text-sm transition ${feeling === option ? "border-white bg-white/10" : "border-white/10 hover:border-white/30"}`}>{option}</button>
                            ))}
                        </div>
                        <label htmlFor="symptoms" className="mt-8 block text-sm font-medium">Anything you'd like your care team to know? <span className="font-normal text-neutral-500">(optional)</span></label>
                        <textarea id="symptoms" value={symptoms} onChange={(event) => { setSymptoms(event.target.value); setCheckinSaved(false); }} rows={4} maxLength={500} placeholder="For example, pain, discomfort, or a change you've noticed..." className="mt-3 w-full resize-y rounded-xl border border-white/15 bg-[#080808] p-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-white/50" />
                        <button disabled={!feeling} onClick={() => setCheckinSaved(true)} className="mt-5 rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40">Save demo check-in</button>
                        {checkinSaved && <p role="status" className="mt-4 text-sm text-neutral-300">Check-in saved for this demonstration only. Nothing was sent to a care team.</p>}
                    </section>
                )}

                {tab === "privacy" && (
                    <section className="mt-10 max-w-3xl space-y-5">
                        <div className="rounded-3xl border border-white/10 bg-[#121212] p-6 sm:p-8">
                            <h2 className="text-2xl font-semibold">Your monitoring, your choice.</h2>
                            <p className="mt-3 text-sm leading-relaxed text-neutral-400">Interval is designed for a limited period after discharge, not ongoing surveillance. In a real deployment, you would receive clear consent information before monitoring begins.</p>
                            <dl className="mt-7 space-y-5 text-sm">
                                <div><dt className="font-medium">What is collected</dt><dd className="mt-1 text-neutral-400">Selected physiological readings, device connection status, and check-in responses.</dd></div>
                                <div><dt className="font-medium">Who can review it</dt><dd className="mt-1 text-neutral-400">Authorized members of your care team, subject to role-based access.</dd></div>
                                <div><dt className="font-medium">When monitoring ends</dt><dd className="mt-1 text-neutral-400">Day 14. Retention and deletion after monitoring would follow a separately disclosed policy.</dd></div>
                                <div><dt className="font-medium">Your choices</dt><dd className="mt-1 text-neutral-400">You can ask questions, request access to your information, or discuss withdrawing from monitoring with your care team.</dd></div>
                            </dl>
                        </div>
                        <p className="text-xs leading-relaxed text-neutral-500">This is a concept explanation, not an operational consent system. No real patient data is collected by this demonstration.</p>
                    </section>
                )}

                <section className="mt-12 border-t border-white/10 pt-9">
                    <div className="flex flex-wrap items-center justify-between gap-6">
                        <div>
                            <h2 className="text-xl font-semibold">Need support?</h2>
                            <p className="mt-2 max-w-xl text-sm leading-relaxed text-neutral-400">If you have a question or notice a change in how you feel, contact your care team. Do not wait for a wearable alert to seek help.</p>
                        </div>
                        <button onClick={() => { setSupportOpen(true); setSupportSubmitted(false); }} className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:bg-neutral-200">Contact care team →</button>
                    </div>
                    <p className="mt-6 text-xs leading-relaxed text-neutral-500">This prototype does not send messages or provide urgent care. In a real service, response hours and contact details would be shown here. For emergencies, call your local emergency number.</p>
                </section>
            </main>

            {supportOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSupportOpen(false); }}>
                    <div role="dialog" aria-modal="true" aria-labelledby="support-heading" className="w-full max-w-lg rounded-3xl border border-white/15 bg-[#171717] p-6 shadow-2xl sm:p-8">
                        <div className="flex items-start justify-between gap-4"><h2 id="support-heading" className="text-2xl font-semibold">Contact your care team</h2><button onClick={() => setSupportOpen(false)} aria-label="Close support dialog" className="text-2xl text-neutral-400 hover:text-white">×</button></div>
                        <p className="mt-3 text-sm leading-relaxed text-neutral-400">Demonstration only. This form does not contact a clinician. Real care-team contact information and response hours would appear here.</p>
                        <label htmlFor="support-message" className="mt-6 block text-sm font-medium">Your message</label>
                        <textarea id="support-message" value={supportMessage} onChange={(event) => { setSupportMessage(event.target.value); setSupportSubmitted(false); }} rows={4} maxLength={1000} placeholder="Describe your question or concern..." className="mt-3 w-full rounded-xl border border-white/15 bg-[#080808] p-4 text-sm text-white outline-none placeholder:text-neutral-600 focus:border-white/50" />
                        <button disabled={!supportMessage.trim()} onClick={() => setSupportSubmitted(true)} className="mt-4 rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-neutral-200 disabled:opacity-40">Preview support request</button>
                        {supportSubmitted && <p role="status" className="mt-4 text-sm text-neutral-300">Demo request prepared. No message has been sent.</p>}
                        <p className="mt-5 text-xs text-neutral-500">Do not use this form for emergencies. Seek immediate medical assistance when needed.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
