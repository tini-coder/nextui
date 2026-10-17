"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";

const LENGTH = 6;

export default function Input04() {
  const [digits, setDigits] = useState<string[]>(Array(LENGTH).fill(""));
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function update(index: number, value: string) {
    const chars = value.replace(/\D/g, "").split("");
    if (!chars.length) return;
    const next = [...digits];
    chars.slice(0, LENGTH - index).forEach((c, i) => (next[index + i] = c));
    setDigits(next);
    refs.current[Math.min(index + chars.length, LENGTH - 1)]?.focus();
  }

  function onKeyDown(index: number, event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...digits];
      if (next[index]) next[index] = "";
      else if (index > 0) {
        next[index - 1] = "";
        refs.current[index - 1]?.focus();
      }
      setDigits(next);
    }
    if (event.key === "ArrowLeft") refs.current[index - 1]?.focus();
    if (event.key === "ArrowRight") refs.current[index + 1]?.focus();
  }

  const complete = digits.every(Boolean);

  return (
    <div className="space-y-3 text-center">
      <Label className="justify-center">Enter the 6-digit code</Label>
      <div className="flex items-center gap-2">
        {digits.map((digit, i) => (
          <div key={i} className="contents">
            {i === LENGTH / 2 && <span className="text-muted-foreground">–</span>}
            <input
              ref={(el) => {
                refs.current[i] = el;
              }}
              value={digit}
              inputMode="numeric"
              autoComplete={i === 0 ? "one-time-code" : "off"}
              aria-label={`Digit ${i + 1}`}
              onChange={(e) => update(i, e.target.value)}
              onKeyDown={(e) => onKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              className="size-11 rounded-lg border border-input bg-transparent text-center text-lg font-medium tabular-nums shadow-xs outline-none transition-[box-shadow,border-color] focus:border-ring focus:ring-[3px] focus:ring-ring/50"
            />
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        {complete ? "Verifying…" : "Didn’t get it? "}
        {!complete && <button className="font-medium text-foreground underline underline-offset-2">Resend code</button>}
      </p>
    </div>
  );
}
