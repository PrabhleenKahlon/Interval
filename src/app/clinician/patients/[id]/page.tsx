
"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Suspense, useState } from "react";

type Priority = "high" | "moderate" | "routine";
type ReviewStatus = "pending" | "acknowledged" | "completed";

type Patient = {
    id: string;
    name: string;
    initials: string;
    pathway: string;
    procedure: string;
    day: number;
    duration: number;
    priority: Priority;
    lastSync: string;
    connected: boolean;
    heartRate: string;
    respiratoryRate: string;
    temperature: string;
    oxygen: string;
    alertTitle: string;
    alertDescription: string;
    alertFactors: string[];
    trend: number[];
};

const patients: Patient[] = [
    {
        id: "INT-001",
        name: "Noha Beydoun",
        initials: "NB",
        pathway: "Cardiac recovery",
        procedure: "Post-discharge cardiac monitoring",
        day: 4,
        duration: 14,
        priority: "high",
        lastSync: "5 minutes ago",
        connected: true,
        heartRate: "104",
        respiratoryRate: "22",
        temperature: "37.6",
        oxygen: "96",
        alertTitle: "Recovery pattern change detected",
        alertDescription:
            "A sustained increase in resting heart rate and respiratory rate has been identified relative to this patient's recent recovery baseline. Clinical assessment is requested.",
        alertFactors: [
            "Resting heart rate above recent baseline",
            "Respiratory rate increasing over the last 12 hours",
            "Change sustained across multiple readings",
        ],
        trend: [73, 76, 74, 78, 80, 77, 84, 88, 91, 95, 100, 104],
    },
    {
        id: "INT-002",
        name: "Marilyn Marcanno",
        initials: "MM",
        pathway: "Postpartum recovery",
        procedure: "Postpartum discharge monitoring",
        day: 6,
        duration: 10,
        priority: "moderate",
        lastSync: "12 minutes ago",
        connected: true,
        heartRate: "89",
        respiratoryRate: "19",
        temperature: "37.8",
        oxygen: "98",
        alertTitle: "Recovery trend requires review",
        alertDescription:
            "A gradual increase in temperature has been observed during the monitoring period. The finding is not diagnostic and requires clinical interpretation alongside symptoms.",
        alertFactors: [
            "Temperature trending upward",
            "Change relative to previous readings",
            "Additional symptom assessment recommended",
        ],
        trend: [36.7, 36.8, 36.9, 36.8, 37.0, 37.1, 37.0, 37.3, 37.4, 37.5, 37.7, 37.8],
    },
    {
        id: "INT-003",
        name: "Prabhleen Kahlon",
        initials: "PK",
        pathway: "Post-surgical recovery",
        procedure: "Postoperative discharge monitoring",
        day: 3,
        duration: 7,
        priority: "routine",
        lastSync: "3 hours ago",
        connected: false,
        heartRate: "—",
        respiratoryRate: "—",
        temperature: "—",
        oxygen: "—",
        alertTitle: "Wearable data unavailable",
        alertDescription:
            "The wearable has not synchronized for three hours. Current recovery status cannot be determined from device measurements. A connectivity review is required.",
        alertFactors: [
            "Last successful sync was three hours ago",
            "Current measurements unavailable",
            "Missing data must not be interpreted as stable recovery",
        ],
        trend: [76, 74, 75, 73, 72, 74, 73, 72, 74, 73, 72, 73],
    },
];

function findPatient(id: string) {
    const normalized = decodeURIComponent(id).toLowerCase();
    const aliases: Record<string, string> = {
        noha: "INT-001",
        marilyn: "INT-002",
        prabhleen: "INT-003",
        "1": "INT-001",
        "2": "INT-002",
        "3": "INT-003",
    };

    const resolved = aliases[normalized] ?? id;

    return patients.find(
        (p) =>
            p.id.toLowerCase() === resolved.toLowerCase() ||
            p.name.toLowerCase().replace(/\s+/g, "-") === normalized
    );
}

function Badge({
    children,
    tone = "slate",
}: {
    children: React.ReactNode;
    tone?: "red" | "amber" | "green" | "blue" | "slate";
}) {
    const tones = {
        red: "bg-red-50 text-red-700 border-red-100",
        amber: "bg-amber-50 text-amber-700 border-amber-100",
        green: "bg-emerald-50 text-emerald-700 border-emerald-100",
        blue: "bg-blue-50 text-blue-700 border-blue-100",
        slate: "bg-slate-100 text-slate-600 border-slate-200",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}
        >
            {children}
        </span>
    );
}

function Panel({
    title,
    subtitle,
    children,
}: {
    title: string;
    subtitle?: string;
    children: React.ReactNode;
}) {
    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-100 px-6 py-5">
                <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                {subtitle && (
                    <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
                )}
            </div>
            <div className="p-6">{children}</div>
        </section>
    );
}

function Metric({
    label,
    value,
    unit,
    detail,
    unavailable,
}: {
    label: string;
    value: string;
    unit: string;
    detail: string;
    unavailable?: boolean;
}) {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-xs font-medium text-slate-500">{label}</p>
            <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-semibold tracking-tight text-slate-900">
                    {value}
                </span>
                <span className="text-xs text-slate-500">{unit}</span>
            </div>
            <p className={`mt-3 text-xs ${unavailable ? "text-amber-700" : "text-slate-500"}`}>
                {detail}
            </p>
        </div>
    );
}

function TrendChart({
    values,
    disconnected,
    label,
}: {
    values: number[];
    disconnected: boolean;
    label: string;
}) {
    const width = 760;
    const height = 240;
    const padding = 24;
    const min = Math.min(...values) - 8;
    const max = Math.max(...values) + 8;
    const range = max - min || 1;

    const points = values.map((value, index) => {
        const x = padding + (index / (values.length - 1)) * (width - padding * 2);
        const y = height - padding - ((value - min) / range) * (height - padding * 2);
        return `${x},${y}`;
    });

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-semibold text-slate-900">
                        {label}
                    </p>
                    <p className="text-xs text-slate-500">
                        Illustrative readings across the monitoring window
                    </p>
                </div>
                <Badge tone={disconnected ? "amber" : "blue"}>
                    {disconnected ? "Historical data only" : "Recent readings"}
                </Badge>
            </div>

            <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <svg
                    viewBox={`0 0 ${width} ${height}`}
                    className="h-auto w-full"
                    role="img"
                    aria-label="Illustrative recovery measurement trend"
                >
                    {[0, 1, 2, 3, 4].map((i) => {
                        const y = padding + (i / 4) * (height - padding * 2);
                        return (
                            <line
                                key={i}
                                x1={padding}
                                y1={y}
                                x2={width - padding}
                                y2={y}
                                stroke="#e2e8f0"
                                strokeWidth="1"
                            />
                        );
                    })}
                    <polyline
                        points={points.join(" ")}
                        fill="none"
                        stroke={disconnected ? "#94a3b8" : "#2563eb"}
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    {points.map((point, i) => {
                        const [cx, cy] = point.split(",").map(Number);
                        return (
                            <circle
                                key={i}
                                cx={cx}
                                cy={cy}
                                r={i === points.length - 1 ? 5 : 2.5}
                                fill={disconnected ? "#94a3b8" : "#2563eb"}
                            />
                        );
                    })}
                </svg>
                <div className="mt-2 flex justify-between text-xs text-slate-400">
                    <span>Earlier readings</span>
                    <span>Most recent available</span>
                </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-slate-500">
                Demonstration data only. This chart does not establish clinical
                thresholds, predictive accuracy, or a diagnosis.
            </p>
        </div>
    );
}

function PatientDetailContent() {
    const params = useParams();
    const rawId = params.id;
    const id = Array.isArray(rawId) ? rawId[0] : rawId ?? "";
    const patient = findPatient(id);

    const [reviewStatus, setReviewStatus] = useState<ReviewStatus>("pending");
    const [assessment, setAssessment] = useState("");
    const [decision, setDecision] = useState("continue-monitoring");
    const [contacted, setContacted] = useState(false);
    const [reviewError, setReviewError] = useState("");
    const [history, setHistory] = useState<string[]>([
        "Monitoring episode created",
        "Wearable monitoring initiated",
        "Automated monitoring status generated",
    ]);

    if (!patient) {
        return (
            <main className="min-h-screen bg-slate-50 p-10">
                <h1 className="text-2xl font-bold text-slate-900">
                    Patient not found
                </h1>
                <p className="mt-3 text-slate-600">
                    No demonstration patient matches this URL.
                </p>
                <Link
                    href="/clinician/patients"
                    className="mt-6 inline-block font-semibold text-blue-600"
                >
                    ← Return to patient directory
                </Link>
            </main>
        );
    }

    const disconnected = !patient.connected;
    const isHigh = patient.priority === "high";

    const priorityTone = disconnected
        ? "amber"
        : isHigh
            ? "red"
            : patient.priority === "moderate"
                ? "amber"
                : "green";

    function acknowledge() {
        setReviewStatus("acknowledged");
        setHistory((prev) => [
            ...prev,
            "Monitoring notification acknowledged by clinician",
        ]);
    }

    function completeReview() {
        if (!assessment.trim()) {
            setReviewError("Enter a clinical assessment before completing the review.");
            return;
        }

        setReviewError("");
        setReviewStatus("completed");
        setHistory((prev) => [
            ...prev,
            `Clinical review completed — ${decision.replaceAll("-", " ")}`,
            ...(contacted ? ["Patient contact documented"] : []),
        ]);
    }

    return (
        <div className="min-h-screen bg-[#f4f7fb] text-slate-900">
            <header className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-6 py-5">
                    <div>
                        <Link
                            href="/clinician/patients"
                            className="text-sm font-medium text-slate-500 hover:text-blue-600"
                        >
                            ← Back to patient directory
                        </Link>
                        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-blue-600">
                            Interval / Clinical Workspace
                        </p>
                        <h1 className="mt-1 text-2xl font-bold">Patient Monitoring Record</h1>
                    </div>
                    <Badge tone="blue">Prototype environment</Badge>
                </div>
            </header>

            <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-5">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 text-lg font-semibold text-white">
                                {patient.initials}
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold">{patient.name}</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    {patient.id} · {patient.pathway}
                                </p>
                            </div>
                        </div>
                        <Badge tone={priorityTone}>
                            {disconnected
                                ? "Data unavailable"
                                : isHigh
                                    ? "High priority"
                                    : patient.priority === "moderate"
                                        ? "Review required"
                                        : "Routine monitoring"}
                        </Badge>
                    </div>

                    <div className="mt-6 grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2 lg:grid-cols-4">
                        <div>
                            <p className="text-xs text-slate-500">Recovery pathway</p>
                            <p className="mt-1 text-sm font-semibold">{patient.procedure}</p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Monitoring period</p>
                            <p className="mt-1 text-sm font-semibold">
                                Day {patient.day} of {patient.duration}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Wearable connection</p>
                            <div className="mt-1">
                                <Badge tone={disconnected ? "amber" : "green"}>
                                    {disconnected ? "Not synchronized" : "Connected"}
                                </Badge>
                            </div>
                        </div>
                        <div>
                            <p className="text-xs text-slate-500">Last successful sync</p>
                            <p className="mt-1 text-sm font-semibold">{patient.lastSync}</p>
                        </div>
                    </div>
                </section>

                {disconnected && (
                    <div className="rounded-xl border border-amber-200 bg-amber-50 p-5">
                        <p className="font-semibold text-amber-900">
                            Monitoring integrity warning
                        </p>
                        <p className="mt-2 text-sm leading-6 text-amber-800">
                            Current wearable measurements are unavailable. The absence of
                            readings cannot be interpreted as evidence of stable recovery.
                            Follow the appropriate connectivity and patient follow-up
                            procedure.
                        </p>
                    </div>
                )}

                <section>
                    <div className="mb-4">
                        <h2 className="text-lg font-semibold">Wearable measurements</h2>
                        <p className="mt-1 text-sm text-slate-500">
                            {disconnected
                                ? "Current readings unavailable due to interrupted synchronization."
                                : "Most recently received demonstration measurements."}
                        </p>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <Metric
                            label="Heart rate"
                            value={patient.heartRate}
                            unit="bpm"
                            detail={disconnected ? "No current reading" : "Latest available measurement"}
                            unavailable={disconnected}
                        />
                        <Metric
                            label="Respiratory rate"
                            value={patient.respiratoryRate}
                            unit="breaths/min"
                            detail={disconnected ? "No current reading" : "Latest available measurement"}
                            unavailable={disconnected}
                        />
                        <Metric
                            label="Temperature"
                            value={patient.temperature}
                            unit="°C"
                            detail={disconnected ? "No current reading" : "Latest available measurement"}
                            unavailable={disconnected}
                        />
                        <Metric
                            label="Oxygen saturation"
                            value={patient.oxygen}
                            unit="%"
                            detail={disconnected ? "No current reading" : "Latest available measurement"}
                            unavailable={disconnected}
                        />
                    </div>
                </section>

                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                    <Panel
                        title="Recovery trend"
                        subtitle="Visualizing changes rather than isolated measurements"
                    >
                        <TrendChart
                            values={patient.trend}
                            disconnected={disconnected}
                            label={
                                patient.id === "INT-002"
                                    ? "Temperature trend (°C)"
                                    : "Heart rate trend (bpm)"
                            }
                        />
                    </Panel>

                    <Panel
                        title="AI-supported monitoring assessment"
                        subtitle="Automated pattern recognition for clinical review"
                    >
                        <Badge tone={disconnected ? "amber" : priorityTone}>
                            {disconnected
                                ? "Connectivity review"
                                : isHigh
                                    ? "Prioritized clinical review"
                                    : patient.priority === "moderate"
                                        ? "Review requested"
                                        : "Routine status"}
                        </Badge>

                        <h3 className="mt-5 text-lg font-semibold">
                            {patient.alertTitle}
                        </h3>
                        <p className="mt-3 text-sm leading-6 text-slate-600">
                            {patient.alertDescription}
                        </p>

                        <h4 className="mt-6 text-sm font-semibold">
                            Factors contributing to this flag
                        </h4>
                        <ul className="mt-3 space-y-3">
                            {patient.alertFactors.map((factor) => (
                                <li key={factor} className="flex gap-3 text-sm text-slate-600">
                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                                    {factor}
                                </li>
                            ))}
                        </ul>

                        <div className="mt-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-xs font-semibold text-blue-900">
                                Human oversight required
                            </p>
                            <p className="mt-2 text-xs leading-5 text-blue-800">
                                This flag is not a diagnosis or treatment recommendation.
                                Clinicians must interpret it alongside symptoms, medical
                                history, and other clinical information.
                            </p>
                        </div>
                    </Panel>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
                    <Panel
                        title="Clinical review"
                        subtitle="Document assessment and follow-up decisions"
                    >
                        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-sm font-semibold">Review status</p>
                                <p className="mt-1 text-xs text-slate-500">
                                    Every AI-generated flag requires an accountable clinical response.
                                </p>
                            </div>
                            <Badge
                                tone={
                                    reviewStatus === "completed"
                                        ? "green"
                                        : reviewStatus === "acknowledged"
                                            ? "blue"
                                            : "amber"
                                }
                            >
                                {reviewStatus === "pending"
                                    ? "Awaiting review"
                                    : reviewStatus === "acknowledged"
                                        ? "Acknowledged"
                                        : "Review completed"}
                            </Badge>
                        </div>

                        {reviewStatus === "pending" && (
                            <button
                                type="button"
                                onClick={acknowledge}
                                className="mb-6 rounded-lg bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-700"
                            >
                                Acknowledge notification
                            </button>
                        )}

                        <label
                            htmlFor="assessment"
                            className="block text-sm font-semibold"
                        >
                            Clinical assessment
                        </label>
                        <textarea
                            id="assessment"
                            value={assessment}
                            onChange={(event) => setAssessment(event.target.value)}
                            disabled={reviewStatus === "completed"}
                            placeholder="Document clinical interpretation, symptoms reviewed, and reasoning..."
                            className="mt-2 min-h-32 w-full rounded-xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-blue-500 disabled:bg-slate-50"
                        />

                        <label
                            htmlFor="decision"
                            className="mt-5 block text-sm font-semibold"
                        >
                            Follow-up decision
                        </label>
                        <select
                            id="decision"
                            value={decision}
                            onChange={(event) => setDecision(event.target.value)}
                            disabled={reviewStatus === "completed"}
                            className="mt-2 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm disabled:bg-slate-50"
                        >
                            <option value="continue-monitoring">Continue monitoring</option>
                            <option value="contact-patient">Contact patient for assessment</option>
                            <option value="arrange-follow-up">Arrange clinical follow-up</option>
                            <option value="escalate-care">Escalate for urgent clinical assessment</option>
                            <option value="investigate-connectivity">Investigate missing wearable data</option>
                        </select>

                        <label className="mt-5 flex items-center gap-3 text-sm text-slate-700">
                            <input
                                type="checkbox"
                                checked={contacted}
                                onChange={(event) => setContacted(event.target.checked)}
                                disabled={reviewStatus === "completed"}
                                className="h-4 w-4 accent-blue-600"
                            />
                            Patient contact completed
                        </label>

                        {reviewError && (
                            <p className="mt-4 text-sm text-red-600">{reviewError}</p>
                        )}

                        {reviewStatus !== "completed" ? (
                            <button
                                type="button"
                                onClick={completeReview}
                                className="mt-6 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
                            >
                                Complete clinical review
                            </button>
                        ) : (
                            <div className="mt-6 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                                Clinical review recorded in this demonstration session.
                            </div>
                        )}
                    </Panel>

                    <div className="space-y-6">
                        <Panel
                            title="Review history"
                            subtitle="Illustrative record of monitoring and clinician actions"
                        >
                            <div className="space-y-5">
                                {history.map((event, index) => (
                                    <div key={`${event}-${index}`} className="flex gap-3">
                                        <div className="flex flex-col items-center">
                                            <span className="h-3 w-3 rounded-full bg-blue-500" />
                                            {index !== history.length - 1 && (
                                                <span className="mt-1 h-full min-h-6 w-px bg-slate-200" />
                                            )}
                                        </div>
                                        <div className="pb-3">
                                            <p className="text-sm font-medium text-slate-800">
                                                {event}
                                            </p>
                                            <p className="mt-1 text-xs text-slate-400">
                                                Demonstration event
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Panel>

                        <Panel title="Patient safety and privacy">
                            <div className="space-y-4 text-sm leading-6 text-slate-600">
                                <p>
                                    <strong className="text-slate-900">Limited monitoring:</strong>{" "}
                                    The proposed system collects recovery-related measurements
                                    for a defined period after discharge.
                                </p>
                                <p>
                                    <strong className="text-slate-900">Clinical accountability:</strong>{" "}
                                    AI identifies patterns for review; clinicians remain
                                    responsible for assessment and care decisions.
                                </p>
                                <p>
                                    <strong className="text-slate-900">Data integrity:</strong>{" "}
                                    Missing measurements are identified separately from
                                    clinical stability.
                                </p>
                                <p>
                                    <strong className="text-slate-900">Transparency:</strong>{" "}
                                    Contributing factors are displayed to support review,
                                    without claiming to fully explain an AI model.
                                </p>
                            </div>
                        </Panel>
                    </div>
                </div>

                <footer className="border-t border-slate-200 py-6 text-xs leading-6 text-slate-500">
                    Interval is a conceptual academic prototype. All monitoring
                    measurements, flags, and patient scenarios shown here are fictional
                    demonstrations. Clinical accuracy has not been validated. Reviews
                    are stored only in the current page session and do not constitute
                    medical records or actual clinical actions.
                </footer>
            </main>
        </div>
    );
}
export default function PatientDetailPage() {
    return (
        <Suspense
            fallback={
                <div className="flex min-h-screen items-center justify-center bg-[#f4f7fb]">
                    <p className="text-sm text-slate-500">
                        Loading patient record...
                    </p>
                </div>
            }
        >
            <PatientDetailContent />
        </Suspense>
    );
}
