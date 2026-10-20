"use client";

import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "motion/react";
import {
  HomeArt,
  MacroArt,
  PhoneArt,
  SignalArt,
  Wearable,
} from "@/components/device-art";
import { Frame } from "@/components/frame";
import { citationNumber, citations, type CitationId } from "@/lib/citations";
import type { ImageKey } from "@/lib/images";

type Images = Record<ImageKey, string | null>;

const nav = [
  { href: "#device", label: "Device" },
  { href: "#care", label: "Care" },
  { href: "#principles", label: "Principles" },
  { href: "#science", label: "Science" },
];

const signals = [
  {
    title: "Heart rate",
    body: "The resting trend across the window. A higher day is context for a clinician, not a label the band applies.",
  },
  {
    title: "Oxygen saturation",
    body: "Shown with the other readings. One percent does not clear you, and it does not alarm on its own.",
  },
  {
    title: "Temperature",
    body: "Kept in the same pattern so a shift is not read by itself.",
  },
  {
    title: "Breathing rate",
    body: "Part of the picture. The model does not decide what a rate means for you.",
  },
  {
    title: "Activity",
    body: "How much you move. A quieter stretch can be rest, or a reason to look. A person tells those apart.",
  },
  {
    title: "Sleep",
    body: "Duration across the days you wear it. Short nights are reported with the rest of the pattern, not scored as illness.",
  },
];

const worn = [
  {
    title: "Before you leave",
    body: "Setup is at the bedside. The pathway, the signals, and how long the band stays on are named before discharge. A loaner is part of the pathway when a household needs one.",
  },
  {
    title: "At home",
    body: "The band stores readings and can sync later, so a gap in Wi-Fi is not a failed day. Battery and the time of the last sync stay visible. A dead battery or a dropped link is unknown, not reassurance.",
  },
  {
    title: "Each day",
    body: "An optional check-in: better, about the same, or worse, plus a note for the team. You can skip it. It is not monitored as an emergency line.",
  },
  {
    title: "If you feel worse",
    body: "Contact your care team. Do not wait for a flag. This prototype does not send messages or provide urgent care. In an emergency, call your local emergency number.",
  },
];

const chapters = [
  {
    kicker: "01",
    title: "Wear it until the follow-up.",
    body: "Issued at the bedside. Worn at home. Taken off when you are seen again. One pathway: cardiac recovery, postpartum recovery, or recovery after surgery. In this prototype the window is 14 days. The appointment already on the calendar stays there.",
    art: "macro" as const,
  },
  {
    kicker: "02",
    title: "It watches your pattern.",
    body: "Heart rate, oxygen saturation, temperature, and breathing rate, read with activity and sleep. An optional check-in adds how you feel that day. A change from your own earlier days can raise a flag. The flag asks a clinician to look. It is not a diagnosis, a treatment, or a promise that you are fine.",
    art: "signal" as const,
  },
  {
    kicker: "03",
    title: "A person decides.",
    body: "A clinician sees the flag, the trend, and anything you wrote, then chooses the next step: keep watching, take a closer look, or move the follow-up. Interval does not close the episode or tell you to wait.",
    art: "phone" as const,
  },
];

const benefits = [
  {
    title: "The care gap.",
    body: "After cardiac care, childbirth, or surgery, the days before the next appointment are usually unseen. Interval keeps a recovery signal in that specific window, then stops.",
  },
  {
    title: "A reason to look.",
    body: "A flag means someone on the care team is asked to review your trend and your check-in. You are not left to decide alone whether a change can wait.",
  },
  {
    title: "Earlier attention.",
    body: "A shift in heart rate, breathing, activity, or sleep can surface while the follow-up is still ahead. The aim is a human look, not an automated verdict.",
  },
  {
    title: "The visit still happens.",
    body: "Monitoring does not replace the appointment. If a concerning change is reviewed sooner, some returns may be avoided. That is an aim. It is not a result we claim to have measured.",
  },
];

const limits = [
  {
    title: "False alarms.",
    body: "A sensitive watch will sometimes flag a change that is benign. That can worry people, and it adds work. Thresholds are set with clinicians. Every flag has a person behind it.",
  },
  {
    title: "Wearing it.",
    body: "If the band comes off, the record goes quiet. Quiet is not the same as well. The wear window is short on purpose. Comfort is part of the design.",
  },
  {
    title: "Battery and connection.",
    body: "A dead battery or a dropped link is unknown, not reassurance. Missing data is something to check. Silence is never treated as recovery.",
  },
];

const principles = [
  {
    id: "privacy",
    title: "Privacy",
    matter:
      "Recovery signals are intimate. They are collected at home, not on a ward. A breach, a long memory, or a use you did not expect would expose how you are healing.",
    mitigation:
      "Analysis stays close to the device: on-device inference, or federated learning so a model can improve without pooling raw waveforms in one file. Data is encrypted in transit and at rest. Collection is minimized to the signals named for that pathway, kept only for the wear window and a defined review period, then deleted on a schedule told to you before you leave.",
  },
  {
    id: "access",
    title: "Access",
    matter:
      "A product that assumes a new phone, comfort with apps, and always-on broadband leaves people out. The gap Interval is meant to close would stay open.",
    mitigation:
      "The band stores readings and syncs later. A low-bandwidth mode sends a short summary and any flags, not a live stream. A simple fallback — a plain status on the device, a paper plan, or a scheduled call — means access does not depend on broadband or high tech literacy. Setup happens at the bedside. A loaner is part of the pathway when a household needs one.",
  },
  {
    id: "judgment",
    title: "Judgment",
    matter:
      "If the people in the training data do not resemble the people who would wear Interval, attention lands unevenly. Age, sex, skin tone, comorbidity, language, and the pathway itself all change what a steady recovery looks like.",
    mitigation:
      "Training and evaluation use diverse data across those pathways and populations. Flag rates and missed changes are checked by subgroup, not only as one score. Human review is mandatory before any clinical action. The model does not diagnose, does not tell you that you are fine, and does not close an episode on its own.",
  },
];

const science = [
  {
    title: "Continuous tracking after discharge.",
    body: "Remote monitoring work has explored accelerometry and related biometrics — heart rate, activity, rest — as a way to see recovery outside the hospital. The useful idea is the trend. A change across days can show up while the follow-up is still ahead. That depends on the device being worn, and on reading the signal in the context of the pathway.",
    citation: "continuous-tracking" as const,
  },
  {
    title: "Triage, instead of a raw stream.",
    body: "Sending every reading to a clinician does not make care safer. Alert fatigue is a recurring theme: when notifications outrun the capacity to respond, important changes are easier to miss. AI-supported triage is discussed as a filter. Summarize the stream. Escalate a smaller set of pattern changes. The clinician remains the decision-maker.",
    citation: "triage" as const,
  },
  {
    title: "The thin stretch after discharge.",
    body: "Care-transition work often treats the days after discharge as a period when clinical visibility thins. Monitoring in that interval is usually framed as a bridge: stay connected, and bring a clinician in when the pattern changes, rather than waiting only for the visit already booked.",
    citation: "care-transition" as const,
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

const footerNav = [
  {
    title: "Device",
    links: [
      { href: "#device", label: "What it watches" },
      { href: "#worn", label: "At home" },
      { href: "#care", label: "14 days" },
    ],
  },
  {
    title: "Care",
    links: [
      { href: "#care", label: "How it works" },
      { href: "#purpose", label: "What it is for" },
      { href: "#limits", label: "What it will not pretend" },
    ],
  },
  {
    title: "Clinical",
    links: [
      { href: "/patient", label: "Patient portal" },
      { href: "/clinician", label: "Clinical workspace" },
      { href: "/clinician/patients", label: "Patients" },
      { href: "/clinician/reviews", label: "Reviews" },
    ],
  },
  {
    title: "Principles",
    links: [
      { href: "#privacy", label: "Privacy" },
      { href: "#access", label: "Access" },
      { href: "#judgment", label: "Judgment" },
    ],
  },
  {
    title: "Science",
    links: [
      { href: "#science", label: "Themes" },
      { href: "#citations", label: "Citations" },
    ],
  },
];

function storyCards(images: Images) {
  return [
    {
      title: "Recovery",
      body: "Worn until the follow-up. A change asks a clinician to look.",
      src: images.cardWrist,
      alt: "A wrist wearing Interval, resting on linen",
    },
    {
      title: "The days at home",
      body: "The band stores readings and can sync later.",
      src: images.cardWindow,
      alt: "At home by a window, wearing Interval",
    },
    {
      title: "Rest",
      body: "Sleep is reported with the other readings, not scored as illness.",
      src: images.cardRest,
      alt: "Asleep at home, still wearing Interval",
    },
  ];
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-12% 0px" }}
      transition={{ duration: 0.9, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function ComeForward({
  children,
  className = "",
  mild = false,
}: {
  children: React.ReactNode;
  className?: string;
  mild?: boolean;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={className}
      style={{ transformOrigin: "center center" }}
      initial={mild ? { opacity: 0.6, y: 8, scale: 0.96 } : { opacity: 0.35, y: 16, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.25, margin: "0px 0px -18% 0px" }}
      transition={{ type: "spring", stiffness: 520, damping: 26, mass: 0.55 }}
    >
      {children}
    </motion.div>
  );
}

function ChapterArt({
  kind,
  images,
}: {
  kind: (typeof chapters)[number]["art"];
  images: Images;
}) {
  if (kind === "macro") {
    return (
      <Frame
        src={images.macro}
        alt="Macro of the Interval sensor and brushed metal edge"
        className="h-full w-full"
        motion={images.macro ? "drift" : "still"}
      >
        <MacroArt />
      </Frame>
    );
  }
  if (kind === "signal") {
    return (
      <Frame
        src={images.signal}
        alt="Brushed metal edge with a warm light along the seam"
        className="h-full w-full"
        motion={images.signal ? "pulse" : "still"}
      >
        <SignalArt />
      </Frame>
    );
  }
  return (
    <Frame
      src={images.phone}
      alt="A phone on dark stone, its screen a soft ring"
      className="h-full w-full"
      motion={images.phone ? "ring" : "still"}
    >
      <PhoneArt />
    </Frame>
  );
}

function StickyChapters({ images }: { images: Images }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (value) => {
    const next = value < 0.34 ? 0 : value < 0.67 ? 1 : 2;
    setActive((current) => (current === next ? current : next));
  });

  const chapter = chapters[active];

  return (
    <>
      <div className="space-y-24 lg:hidden">
        {chapters.map((item) => (
          <article key={item.kicker} className="grid gap-8">
            <div>
              <p className="text-sm tracking-[0.22em] text-mist">{item.kicker}</p>
              <h3 className="mt-4 text-4xl leading-[1.05] font-semibold tracking-[-0.04em]">
                {item.title}
              </h3>
              <p className="mt-5 max-w-xl text-xl leading-relaxed text-silver">
                {item.body}
              </p>
            </div>
            <div
              className={`aspect-video overflow-hidden rounded-[2rem] ${item.art === "phone" && images.phone ? "ring-alive" : ""
                }`}
            >
              <ChapterArt kind={item.art} images={images} />
            </div>
          </article>
        ))}
      </div>

      <section ref={ref} className="relative hidden h-[320vh] lg:block">
        <div className="sticky top-0 flex h-screen items-center">
          <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] items-center gap-16 px-8">
            <div>
              <p className="text-sm tracking-[0.22em] text-mist">How it works</p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={chapter.kicker}
                  initial={reduce ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? undefined : { opacity: 0, y: -12 }}
                  transition={{ duration: 0.45, ease }}
                >
                  <p className="mt-6 text-sm tracking-[0.22em] text-mist">{chapter.kicker}</p>
                  <h3 className="mt-4 text-5xl leading-[1.02] font-semibold tracking-[-0.045em] xl:text-6xl">
                    {chapter.title}
                  </h3>
                  <p className="mt-6 max-w-xl text-xl leading-relaxed text-silver">
                    {chapter.body}
                  </p>
                </motion.div>
              </AnimatePresence>
              <div className="mt-10 flex gap-3" aria-hidden="true">
                {chapters.map((item, index) => (
                  <span
                    key={item.kicker}
                    className={`h-1.5 rounded-full transition-all duration-500 ${index === active ? "w-10 bg-paper" : "w-4 bg-white/25"
                      }`}
                  />
                ))}
              </div>
            </div>
            <div
              className={`relative aspect-video w-full overflow-hidden rounded-[2rem] ${chapter.art === "phone" && images.phone ? "ring-alive" : ""
                }`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={chapter.art}
                  className="absolute inset-0"
                  initial={reduce ? false : { opacity: 0, scale: 1.03 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={reduce ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.55, ease }}
                >
                  <ChapterArt kind={chapter.art} images={images} />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function CitationRef({ id }: { id: CitationId }) {
  const number = citationNumber(id);
  return (
    <sup className="ml-[0.2em] text-[0.62em] font-normal leading-none tracking-normal">
      <a
        href={`#citation-${number}`}
        aria-label={`Citation ${number}`}
        className="text-mist no-underline hover:text-silver focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper"
      >
        {number}
      </a>
    </sup>
  );
}

function EmailSignup() {
  return (
    <form
      className="w-full max-w-sm shrink-0 self-end md:w-80 md:self-start"
      onSubmit={(event) => {
        event.preventDefault();
      }}
    >
      <div>
        <label htmlFor="signup-email" className="sr-only">
          Email
        </label>
        <div className="flex items-center gap-4 border-b border-white/20">
          <input
            id="signup-email"
            name="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email"
            aria-describedby="signup-note"
            className="min-w-0 flex-1 bg-transparent py-3 text-base text-paper outline-none placeholder:text-mist"
          />
          <button
            type="submit"
            className="shrink-0 py-3 text-sm text-mist transition-colors hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
          >
            Submit
          </button>
        </div>
        <p id="signup-note" className="mt-5 text-sm leading-relaxed text-mist">
          By signing up, I agree with the data protection policy.
        </p>
      </div>
    </form>
  );
}

function CitationBody({ text, href }: { text: string; href: string }) {
  const at = text.indexOf(href);
  if (at < 0) return text;
  return (
    <>
      {text.slice(0, at)}
      <a
        href={href}
        className="underline decoration-white/25 underline-offset-2 hover:text-paper"
      >
        {href}
      </a>
      {text.slice(at + href.length)}
    </>
  );
}

function CitationList() {
  return (
    <section id="citations" aria-label="Citations" className="min-w-0 flex-1">
      <ol className="max-w-xl list-decimal space-y-6 pl-5 marker:text-mist">
        {citations.map((item, index) => (
          <li
            key={item.id}
            id={`citation-${index + 1}`}
            className="scroll-mt-28 pl-2 text-xs leading-relaxed text-mist"
          >
            <CitationBody text={item.text} href={item.href} />
          </li>
        ))}
      </ol>
    </section>
  );
}

export function Launch({ images }: { images: Images }) {
  const reduce = useReducedMotion();
  const [activeNav, setActiveNav] = useState("top");
  const [principle, setPrinciple] = useState(0);
  const current = principles[principle];

  useEffect(() => {
    const apply = () => {
      const id = window.location.hash.replace("#", "");
      const index = principles.findIndex((item) => item.id === id);
      if (index >= 0) setPrinciple(index);
    };
    apply();
    window.addEventListener("hashchange", apply);
    return () => window.removeEventListener("hashchange", apply);
  }, []);

  useEffect(() => {
    const ids = ["top", "device", "care", "principles", "science"];
    const pick = () => {
      const marker =
        (document.querySelector("header")?.getBoundingClientRect().height ?? 56) + 80;
      let next = "top";
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= marker) next = id;
      }
      setActiveNav((previous) => (previous === next ? previous : next));
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    return () => window.removeEventListener("scroll", pick);
  }, []);

  return (
    <div className="bg-ink text-paper">
      <header className="fixed inset-x-0 top-0 z-40 bg-black/40 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-5 md:px-8">
          <a
            href="#top"
            className="text-base font-semibold tracking-[-0.03em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
          >
            Interval
          </a>
          <nav aria-label="Product sections">
            <ul className="flex gap-1">
              {nav.map((item) => {
                const on = activeNav === item.href.slice(1);
                return (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      aria-current={on ? "location" : undefined}
                      className={`inline-flex h-10 items-center rounded-full px-3 text-base focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${on ? "text-paper" : "text-mist hover:text-paper"
                        }`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      <main id="top">
        <section className="relative min-h-[100svh] overflow-hidden bg-black">
          {images.heroBleed ?? images.hero ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={images.heroBleed ?? images.hero ?? undefined}
              alt="Close view of the Interval band"
              className="absolute inset-0 h-full w-full object-cover object-bottom"
            />
          ) : (
            <Wearable className="absolute inset-0 h-full w-full" />
          )}
          <motion.div
            className="relative z-10 flex min-h-[100svh] flex-col justify-start px-5 pt-28 md:px-10 md:pt-36"
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
          >
            <h1 className="max-w-5xl text-[clamp(4.75rem,15vw,9.5rem)] leading-[0.84] font-semibold tracking-[-0.06em]">
              Interval
            </h1>
            <p className="mt-5 max-w-xl text-xl leading-snug tracking-[-0.03em] text-paper md:text-2xl">
              The days between leaving and being seen again.
            </p>
          </motion.div>
        </section>

        <section className="bg-paper text-ink">
          <div className="mx-auto max-w-6xl px-5 pt-28 md:px-8 md:pt-40">
            <h2 className="max-w-4xl text-[clamp(3.5rem,8vw,6.75rem)] leading-[0.9] font-semibold tracking-[-0.055em]">
              Fourteen days.
            </h2>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-metal md:text-xl">
              Issued at the bedside. Worn at home. Taken off when you are seen again. In this prototype the window is 14 days. It does not diagnose.
            </p>
          </div>
          {images.dailyWear ? (
            <div className="mx-auto max-w-6xl px-5 pt-14 md:px-8 md:pt-16">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images.dailyWear}
                alt="Wearing Interval during the days after discharge"
                className="h-auto w-full"
              />
            </div>
          ) : null}
          <div className="mx-auto mt-12 flex max-w-6xl gap-4 overflow-x-auto px-5 pb-24 snap-x snap-mandatory md:px-8 md:pb-32 lg:grid lg:grid-cols-3 lg:overflow-visible">
            {storyCards(images).map((card) => (
              <article key={card.title} className="w-[78vw] max-w-sm shrink-0 snap-start lg:w-auto lg:max-w-none">
                {card.src ? (
                  <div className="overflow-hidden rounded-[1.75rem]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={card.src} alt={card.alt} className="aspect-square w-full object-cover" />
                  </div>
                ) : null}
                <h3 className="mt-5 text-2xl font-semibold tracking-[-0.03em]">{card.title}</h3>
                <p className="mt-2 max-w-xs text-base leading-relaxed text-metal">{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* Interactive demonstration entry points */}
        <section aria-labelledby="explore-heading" className="border-t border-white/10 bg-ink">
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Reveal>
              <p className="text-sm tracking-[0.22em] text-mist">Explore Interval</p>
              <h2 id="explore-heading" className="mt-4 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-[-0.045em] md:text-6xl">
                Two perspectives. One connected recovery.
              </h2>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-silver">
                The patient view shows the 14-day window, today's readings, battery, and the daily check-in. The clinical view shows why a pattern was flagged and the decision a person records. Every scenario is fictional.
              </p>
            </Reveal>

            <div className="mt-12 grid gap-5 md:grid-cols-2">
              <Reveal className="h-full">
                <a href="/patient" className={`group flex h-full flex-col rounded-[2rem] border border-white/15 bg-white/[0.04] transition-colors hover:border-white/40 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper ${images.portalPatient ? "overflow-hidden" : "p-8 md:p-10"}`}>
                  {images.portalPatient ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={images.portalPatient}
                      alt="Patient portal"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : null}
                  <div className={images.portalPatient ? "flex flex-1 flex-col p-8 md:p-10" : "contents"}>
                    <span className="text-sm tracking-[0.16em] text-mist">01 / PATIENT EXPERIENCE</span>
                    <h3 className="mt-8 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">Patient Portal</h3>
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-silver">Day of the wear window, heart rate, oxygen, temperature, breathing rate, last sync, and an optional note to the care team.</p>
                    <span className="mt-12 inline-flex items-center gap-2 text-base font-medium text-paper">Explore patient portal <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span>
                  </div>
                </a>
              </Reveal>
              <Reveal delay={0.1} className="h-full">
                <a href="/clinician" className={`group flex h-full flex-col rounded-[2rem] border border-white/15 bg-white/[0.04] transition-colors hover:border-white/40 hover:bg-white/[0.08] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper ${images.portalClinician ? "overflow-hidden" : "p-8 md:p-10"}`}>
                  {images.portalClinician ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={images.portalClinician}
                      alt="Clinical workspace"
                      className="aspect-[4/3] w-full object-cover"
                    />
                  ) : null}
                  <div className={images.portalClinician ? "flex flex-1 flex-col p-8 md:p-10" : "contents"}>
                    <span className="text-sm tracking-[0.16em] text-mist">02 / CLINICAL EXPERIENCE</span>
                    <h3 className="mt-8 text-3xl font-semibold tracking-[-0.035em] md:text-4xl">Clinical Workspace</h3>
                    <p className="mt-4 max-w-md text-lg leading-relaxed text-silver">A queue of cardiac, postpartum, and post-surgical pathways, the reason a trend was flagged, and a recorded human decision.</p>
                    <span className="mt-12 inline-flex items-center gap-2 text-base font-medium text-paper">Explore clinical workspace <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span></span>
                  </div>
                </a>
              </Reveal>
            </div>
            <p className="mt-7 text-sm leading-relaxed text-mist">Academic prototype only. All patient scenarios and measurements are fictional. No clinical monitoring is performed.</p>
          </div>
        </section>



        <section id="device" className="border-t border-white/10 bg-ink">
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Reveal>
              <p className="text-sm tracking-[0.22em] text-mist">The device</p>
              <h2 className="mt-4 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-[-0.045em] md:text-6xl">
                What it actually watches.
              </h2>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-silver">
                A temporary band for one recovery pathway. It does not stream every second to a clinic, and it does not decide that you are well. These are the signals in this prototype.
              </p>
            </Reveal>
            {images.signalsWide ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images.signalsWide}
                alt="The signals Interval watches"
                className="mt-14 aspect-[2/1] w-full rounded-[2rem] object-cover"
              />
            ) : null}
            <dl className={`${images.signalsWide ? "mt-8" : "mt-14"} grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3`}>
              {signals.map((item) => (
                <div key={item.title} className="bg-ink p-7 md:p-8">
                  <dt className="text-2xl font-semibold tracking-[-0.03em]">{item.title}</dt>
                  <dd className="mt-3 text-lg leading-relaxed text-silver">{item.body}</dd>
                </div>
              ))}
            </dl>
            <div id="worn" className="mt-16 grid scroll-mt-24 gap-10 md:grid-cols-2">
              {worn.map((item) => (
                <Reveal key={item.title}>
                  <h3 className="text-2xl font-semibold tracking-[-0.03em]">{item.title}</h3>
                  <p className="quiet mt-3 max-w-xl text-lg leading-relaxed">{item.body}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="care" className="border-t border-white/10 bg-ink">
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <Reveal>
              <p className="text-sm tracking-[0.22em] text-mist">Care</p>
              <h2 className="mt-4 max-w-4xl text-4xl leading-[1.05] font-semibold tracking-[-0.045em] md:text-6xl">
                A wearable. A watchful model. Then a person.
              </h2>
              <p className="mt-6 max-w-2xl text-xl leading-relaxed text-silver">
                The band without triage buries a clinic in readings. Triage without a signal has nothing honest to say. Interval is the pair, and only for this stretch of days.
              </p>
            </Reveal>
          </div>
          <StickyChapters images={images} />
        </section>

        <section id="purpose" className="scroll-mt-24 bg-stage">
          <div className="mx-auto grid max-w-6xl gap-16 px-5 py-24 md:px-8 md:py-32 lg:grid-cols-2 lg:items-center">
            <Reveal>
              <h2 className="text-4xl leading-[1.05] font-semibold tracking-[-0.045em] md:text-6xl">
                What it is for.
              </h2>
              <ul className="mt-12 space-y-10">
                {benefits.map((item) => (
                  <li key={item.title}>
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                      {item.title}
                    </h3>
                    <p
                      tabIndex={0}
                      className="quiet mt-3 max-w-xl text-lg leading-relaxed md:text-xl"
                    >
                      {item.body}
                    </p>
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={0.1}>
              <Frame
                src={images.home}
                alt="A person at home wearing Interval between visits"
                className="aspect-video overflow-hidden rounded-[2rem]"
                motion={images.home ? "drift" : "still"}
              >
                <HomeArt />
              </Frame>
            </Reveal>
          </div>
        </section>

        <section id="limits" className="scroll-mt-24 border-t border-white/10">
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            {images.limitsBedside ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={images.limitsBedside}
                alt="At the bedside, before the band goes home"
                className="mb-14 aspect-[2/1] w-full rounded-[2rem] object-cover md:mb-16"
              />
            ) : null}
            <Reveal>
              <h2 className="max-w-3xl text-4xl leading-[1.05] font-semibold tracking-[-0.045em] md:text-6xl">
                What it will not pretend.
              </h2>
            </Reveal>
            <div className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-white/10 bg-white/10 md:grid-cols-3">
              {limits.map((item, index) => (
                <Reveal key={item.title} delay={index * 0.08} className="h-full">
                  <article className="h-full bg-ink p-8 md:p-10">
                    <h3 className="text-2xl font-semibold tracking-[-0.03em]">{item.title}</h3>
                    <p className="mt-4 text-lg leading-relaxed text-silver">{item.body}</p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="principles" className="bg-stage">
          <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-32">
            <div className={images.trustStill ? "lg:grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-16" : undefined}>
              <Reveal>
                <p className="text-sm tracking-[0.22em] text-mist">Principles</p>
                <h2 className="mt-4 max-w-3xl text-4xl leading-[1.05] font-semibold tracking-[-0.045em] md:text-6xl">
                  Trust is a material.
                </h2>
              </Reveal>
              {images.trustStill ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={images.trustStill}
                  alt="Interval, kept close"
                  className="mt-10 aspect-[4/3] w-full rounded-[2rem] object-cover lg:mt-0"
                />
              ) : null}
            </div>
            <div
              className="mt-12 flex flex-wrap gap-3"
              role="tablist"
              aria-label="Product principles"
            >
              {principles.map((item, index) => {
                const selected = index === principle;
                return (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    id={item.id}
                    aria-selected={selected}
                    aria-controls={`panel-${item.id}`}
                    onClick={() => setPrinciple(index)}
                    className={`h-12 rounded-full px-5 text-lg tracking-[-0.02em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-paper ${selected ? "bg-paper text-ink" : "bg-white/10 text-paper hover:bg-white/15"
                      }`}
                  >
                    {item.title}
                  </button>
                );
              })}
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                role="tabpanel"
                id={`panel-${current.id}`}
                aria-labelledby={current.id}
                initial={reduce ? false : { opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -8 }}
                transition={{ duration: 0.35, ease }}
                className="mt-10 grid gap-10 md:grid-cols-2"
              >
                <div>
                  <h3 className="text-sm tracking-[0.18em] text-mist uppercase">Why it matters</h3>
                  <p className="mt-4 text-xl leading-relaxed md:text-2xl">{current.matter}</p>
                </div>
                <div className="rounded-[1.5rem] border border-white/10 bg-ink p-7 md:p-8">
                  <h3 className="text-sm tracking-[0.18em] text-mist uppercase">What we build</h3>
                  <p className="mt-4 text-lg leading-relaxed text-silver md:text-xl">
                    {current.mitigation}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </section>

        <section id="science" className="border-t border-white/10">
          {images.scienceWide ? (
            <div className="mx-auto max-w-6xl px-5 pt-24 md:px-8 md:pt-32">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images.scienceWide}
                alt="Behind the science notes"
                className="aspect-[2/1] w-full rounded-[2rem] object-cover"
              />
            </div>
          ) : null}
          <div className={`mx-auto max-w-3xl px-5 md:px-8 ${images.scienceWide ? "pt-12 pb-24 md:pt-16 md:pb-32" : "py-24 md:py-32"}`}>
            <ComeForward mild>
              <p className="text-sm tracking-[0.22em] text-mist">The science</p>
              <h2 className="mt-4 text-4xl leading-[1.05] font-semibold tracking-[-0.045em] md:text-5xl">
                Themes, not claims.
              </h2>
              <p className="mt-6 text-xl leading-relaxed text-silver">
                Notes for the work behind Interval. Not quotations. No effect sizes. Each one ends where a source still belongs.
              </p>
            </ComeForward>
            <div className="mt-16 space-y-24">
              {science.map((item) => (
                <ComeForward key={item.title}>
                  <article>
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] md:text-3xl">
                      {item.title}
                    </h3>
                    <p
                      tabIndex={0}
                      className="quiet mt-4 text-lg leading-relaxed md:text-xl"
                    >
                      {item.body}
                      <CitationRef id={item.citation} />
                    </p>
                  </article>
                </ComeForward>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-ink">
        <nav aria-label="Footer" className="mx-auto grid max-w-6xl grid-cols-2 gap-x-8 gap-y-12 px-5 py-20 md:px-8 md:py-28 lg:grid-cols-5">
          {footerNav.map((column) => (
            <div key={column.title}>
              <h2 className="text-xs tracking-[0.18em] text-mist uppercase">{column.title}</h2>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.href + link.label}>
                    <a
                      href={link.href}
                      className="text-base text-silver hover:text-paper focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </footer>
      <div className="bg-ink">
        <div className="mx-auto flex max-w-6xl flex-col gap-14 px-5 pt-10 pb-20 md:flex-row md:items-start md:justify-between md:gap-20 md:px-8 md:pt-14 md:pb-28">
          <CitationList />
          <EmailSignup />
        </div>
      </div>
    </div>
  );
}
