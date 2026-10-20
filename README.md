# Interval

Product site for Interval, a temporary wearable for the days between hospital discharge and the follow-up visit. It watches recovery patterns and asks a clinician to look when something changes. It does not diagnose, and it does not claim regulatory clearance.

## Run locally

```bash
npm install
npm run dev
```

Open [http://127.0.0.1:3847](http://127.0.0.1:3847).

The dev server binds to `0.0.0.0` on port **3847**.

## Optional photography

Drop generated images in `public/images/`. The page uses them when the file is present and falls back to the built-in device art when it is not.

- `public/images/hero-device.png`
- `public/images/device-macro.png`
- `public/images/lifestyle-home.png`
- `public/images/companion-phone.png`
- `public/images/signal-field.png`
