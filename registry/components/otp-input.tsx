"use client";

import { useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export type OneTimeCodeInputProps = {
  /** Number of digit boxes. */
  length?: number;
  /** Defaults to "Enter the {length}-digit code". */
  label?: React.ReactNode;
  /** Show a dash between the two halves of the code. */
  separator?: boolean;
  value?: string;
  defaultValue?: string;
  onChange?: (code: string) => void;
  /** Called once every box is filled. */
  onComplete?: (code: string) => void;
  onResend?: () => void;
  /** Shown under the boxes once the code is complete. */
  completeText?: React.ReactNode;
  resendPrompt?: React.ReactNode;
  resendLabel?: React.ReactNode;
  className?: string;
};

const toDigits = (code: string, length: number) => Array.from({ length }, (_, i) => code[i] ?? "");

/** A row of single-digit boxes for a one-time code, with paste, arrow keys and backspace handling. */
export function OneTimeCodeInput({
  length = 6,
  label,
  separator = true,
  value,
  defaultValue = "",
  onChange,
  onComplete,
  onResend,
  completeText = "Verifying…",
  resendPrompt = "Didn’t get it? ",
  resendLabel = "Resend code",
  className,
}: OneTimeCodeInputProps) {
  const [inner, setInner] = useState<string[]>(() => toDigits(defaultValue, length));
  const digits = value !== undefined ? toDigits(value, length) : inner;
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function commit(next: string[]) {
    if (value === undefined) setInner(next);
    const code = next.join("");
    onChange?.(code);
    if (next.every(Boolean) && !digits.every((d, i) => d === next[i])) onComplete?.(code);
  }

  function update(index: number, input: string) {
    const chars = input.replace(/\D/g, "").split("");
    if (!chars.length) return;
    const next = [...digits];
    chars.slice(0, length - index).forEach((c, i) => (next[index + i] = c));
    commit(next);
    refs.current[Math.min(index + chars.length, length - 1)]?.focus();
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
      commit(next);
    }
    if (event.key === "ArrowLeft") refs.current[index - 1]?.focus();
    if (event.key === "ArrowRight") refs.current[index + 1]?.focus();
  }

  const complete = digits.every(Boolean);
  const split = separator && length > 1 ? Math.floor(length / 2) : -1;

  return (
    <div className={cn("space-y-3 text-center", className)}>
      <Label className="justify-center">{label ?? `Enter the ${length}-digit code`}</Label>
      <div className="flex items-center gap-2">
        {digits.map((digit, i) => (
          <div key={i} className="contents">
            {i === split && <span className="text-muted-foreground">–</span>}
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
        {complete ? completeText : resendPrompt}
        {!complete && (
          <button type="button" onClick={onResend} className="font-medium text-foreground underline underline-offset-2">
            {resendLabel}
          </button>
        )}
      </p>
    </div>
  );
}

export default function Input04() {
  return <OneTimeCodeInput />;
}
