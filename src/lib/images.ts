import fs from "node:fs";
import path from "node:path";

export const imageFiles = {
  hero: "hero-device.png",
  macro: "device-macro.png",
  home: "lifestyle-home.png",
  phone: "companion-phone.png",
  signal: "signal-field.png",
  heroBleed: "hero-bleed.png",
  dailyWear: "daily-wear.png",
  cardWrist: "card-wrist.png",
  cardRest: "card-rest.png",
  cardWindow: "card-window.png",
  portalPatient: "portal-patient.png",
  portalClinician: "portal-clinician.png",
  signalsWide: "signals-wide.png",
  trustStill: "trust-still.png",
  scienceWide: "science-wide.png",
  limitsBedside: "limits-bedside.png",
} as const;

export type ImageKey = keyof typeof imageFiles;

export function resolveImages(): Record<ImageKey, string | null> {
  const dir = path.join(process.cwd(), "public", "images");
  return Object.fromEntries(
    Object.entries(imageFiles).map(([key, file]) => [
      key,
      fs.existsSync(path.join(dir, file)) ? `/images/${file}` : null,
    ]),
  ) as Record<ImageKey, string | null>;
}
