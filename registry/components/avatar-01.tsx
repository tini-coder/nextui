"use client";

import { useState } from "react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const PEOPLE = ["AN", "BT", "CL", "DH", "EV"];

// Hovering an avatar lifts it and its neighbours by a falloff of its distance, then springs
// everything back on leave. Lift eases in cleanly; the return overshoots for the bounce.
const LIFT = -4;
const FALLOFF = 0.45;
const SCALE = 1.05;
const EASE_IN = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_OUT = "cubic-bezier(0.34, 3.85, 0.64, 1)";

export default function Avatar01() {
  const [active, setActive] = useState<number | null>(null);
  const items = [...PEOPLE, "+12"];

  return (
    <div className="flex items-center gap-3">
      <div className="flex -space-x-2" onMouseLeave={() => setActive(null)}>
        {items.map((label, i) => {
          const shift = active === null ? 0 : LIFT * Math.pow(FALLOFF, Math.abs(i - active));
          const more = i === items.length - 1;
          return (
            <div
              key={label}
              onMouseEnter={() => setActive(i)}
              className="transition-transform duration-[320ms] will-change-transform motion-reduce:transform-none! motion-reduce:transition-none"
              style={{
                transform: `translateY(${shift.toFixed(3)}px) scale(${active === i ? SCALE : 1})`,
                transitionTimingFunction: active === null ? EASE_OUT : EASE_IN,
              }}
            >
              <Avatar className="size-9 ring-2 ring-background">
                <AvatarFallback
                  className={more ? "bg-primary text-xs font-medium text-primary-foreground" : "bg-secondary text-xs font-medium"}
                >
                  {label}
                </AvatarFallback>
              </Avatar>
            </div>
          );
        })}
      </div>
      <p className="text-sm text-muted-foreground">17 teammates online</p>
    </div>
  );
}
