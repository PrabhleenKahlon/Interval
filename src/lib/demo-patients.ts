
export type Priority = "High" | "Moderate" | "Routine";

export type ReviewStatus =
    | "Pending"
    | "In Review"
    | "Reviewed"
    | "Not Required";

export type Patient = {
    id: string;
    name: string;
    age: number;
    pathway: string;
    procedure: string;
    dischargeDate: string;
    monitoringStart: string;
    monitoringEnd: string;
    monitoringDay: number;
    totalDays: number;

    priority: Priority;
    reviewStatus: ReviewStatus;
    monitoringStatus: "Active" | "Completed" | "Disconnected";

    aiFlag: string;
    aiExplanation: string;
    aiRecommendation: string;

    heartRate: number[];
    activity: number[];
    sleep: number[];

    symptoms: string[];
    painLevel: number;

    battery: number;
    lastSync: string;

    clinicianNotes: string;
};

export const demoPatients: Patient[] = [
    {
        id: "INT-1001",
        name: "Noha Beydoun",
        age: 64,
        pathway: "Cardiac Recovery",
        procedure: "Discharge following cardiac hospitalization",

        dischargeDate: "2026-10-12",
        monitoringStart: "2026-10-12",
        monitoringEnd: "2026-10-26",
        monitoringDay: 6,
        totalDays: 14,

        priority: "High",
        reviewStatus: "Pending",
        monitoringStatus: "Active",

        aiFlag:
            "Sustained increase in resting heart rate and reduced physical activity",

        aiExplanation:
            "Interval has identified a progressive increase in resting heart rate over the monitoring period, accompanied by decreasing activity and reduced sleep duration. These changes differ from the patient's earlier recovery measurements and may warrant clinical assessment.",

        aiRecommendation:
            "Clinical review requested. The system does not diagnose the cause of these changes or determine treatment.",

        heartRate: [72, 74, 76, 81, 89, 98],
        activity: [62, 59, 54, 46, 35, 22],
        sleep: [7.2, 7.0, 6.8, 6.4, 5.9, 5.3],

        symptoms: ["Unusual fatigue", "Dizziness"],
        painLevel: 3,

        battery: 76,
        lastSync: "8 minutes ago",

        clinicianNotes:
            "Patient enrolled in temporary post-discharge cardiac monitoring.",
    },

    {
        id: "INT-1002",
        name: "Marilyn Marcanno",
        age: 31,
        pathway: "Postpartum Recovery",
        procedure: "Discharge following childbirth",

        dischargeDate: "2026-10-15",
        monitoringStart: "2026-10-15",
        monitoringEnd: "2026-10-29",
        monitoringDay: 3,
        totalDays: 14,

        priority: "Moderate",
        reviewStatus: "Pending",
        monitoringStatus: "Active",

        aiFlag:
            "Patient-reported symptoms and changes in recovery pattern",

        aiExplanation:
            "Interval has identified reduced activity and sleep duration alongside patient-reported swelling and fatigue. Wearable measurements alone cannot determine whether these changes are expected during postpartum recovery.",

        aiRecommendation:
            "Clinical review requested to assess the reported symptoms and determine whether additional follow-up is appropriate.",

        heartRate: [78, 79, 81, 84],
        activity: [42, 39, 33, 25],
        sleep: [5.8, 5.4, 4.9, 4.6],

        symptoms: ["Increased swelling", "Unusual fatigue"],
        painLevel: 5,

        battery: 91,
        lastSync: "12 minutes ago",

        clinicianNotes:
            "Patient enrolled in temporary postpartum recovery monitoring.",
    },

    {
        id: "INT-1003",
        name: "Prabhleen Kahlon",
        age: 22,
        pathway: "Post-Surgical Recovery",
        procedure: "Discharge following a routine surgical procedure",

        dischargeDate: "2026-10-13",
        monitoringStart: "2026-10-13",
        monitoringEnd: "2026-10-27",
        monitoringDay: 5,
        totalDays: 14,

        priority: "Routine",
        reviewStatus: "Not Required",
        monitoringStatus: "Active",

        aiFlag: "No concerning recovery pattern identified",

        aiExplanation:
            "Current measurements show relatively stable resting heart rate, improving activity, and consistent sleep duration. No pattern deviation has been flagged by the simulated monitoring system.",

        aiRecommendation:
            "Continue the prescribed monitoring period and scheduled follow-up. Absence of an alert does not guarantee that complications are absent.",

        heartRate: [78, 76, 75, 74, 73],
        activity: [25, 32, 40, 49, 57],
        sleep: [6.2, 6.5, 6.8, 7.0, 7.2],

        symptoms: [],
        painLevel: 2,

        battery: 84,
        lastSync: "Just now",

        clinicianNotes:
            "Routine post-operative monitoring. Follow-up appointment remains scheduled.",
    },
];

// Retrieve a patient using their unique ID.
export function getPatientById(id: string): Patient | undefined {
    return demoPatients.find((patient) => patient.id === id);
}

// Patients requiring clinician review.
export function getFlaggedPatients(): Patient[] {
    return demoPatients.filter(
        (patient) =>
            patient.priority === "High" ||
            patient.priority === "Moderate"
    );
}

// Overview statistics.
export function getDashboardStats() {
    return {
        totalPatients: demoPatients.length,

        activePatients: demoPatients.filter(
            (patient) => patient.monitoringStatus === "Active"
        ).length,

        highPriority: demoPatients.filter(
            (patient) => patient.priority === "High"
        ).length,

        moderatePriority: demoPatients.filter(
            (patient) => patient.priority === "Moderate"
        ).length,

        routinePatients: demoPatients.filter(
            (patient) => patient.priority === "Routine"
        ).length,

        pendingReviews: demoPatients.filter(
            (patient) => patient.reviewStatus === "Pending"
        ).length,
    };
}
