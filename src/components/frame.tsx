import type { ReactNode } from "react";

type MotionKind = "still" | "drift" | "ring" | "pulse";

const motionClass: Record<MotionKind, string> = {
  still: "",
  drift: "ken-burns",
  ring: "ken-burns ring-breathe",
  pulse: "ken-burns signal-breathe",
};

export function Frame({
  src,
  alt,
  children,
  className = "",
  motion = "still",
}: {
  src: string | null;
  alt: string;
  children: ReactNode;
  className?: string;
  motion?: MotionKind;
}) {
  return (
    <div className={`relative overflow-hidden bg-ink ${className}`}>
      {src ? (
        // Local file from public/images. Next/Image is unnecessary for an optional drop-in.
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className={`h-full w-full object-cover ${motionClass[motion]}`}
        />
      ) : (
        children
      )}
    </div>
  );
}
