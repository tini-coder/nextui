"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** One requirement in the checklist; `test` says whether the password meets it. */
export type PasswordRule = { label: string; test: (value: string) => boolean };

const RULES: PasswordRule[] = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  { label: "A number", test: (v: string) => /\d/.test(v) },
  { label: "An uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "A symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const TONES = ["bg-border", "bg-destructive", "bg-orange-500", "bg-amber-500", "bg-emerald-500"];

export type PasswordStrengthInputProps = {
  label?: React.ReactNode;
  placeholder?: string;
  id?: string;
  name?: string;
  /** Requirements shown as meter segments and a checklist. */
  rules?: PasswordRule[];
  value?: string;
  defaultValue?: string;
  /** Called with the new value and how many rules it passes. */
  onChange?: (value: string, score: number) => void;
  className?: string;
};

/** A password field with a show/hide toggle, a strength meter and a rules checklist. */
export function PasswordStrengthInput({
  label = "Password",
  placeholder = "Create a password",
  id = "password-03",
  name,
  rules = RULES,
  value: valueProp,
  defaultValue = "",
  onChange,
  className,
}: PasswordStrengthInputProps) {
  const [inner, setInner] = useState(defaultValue);
  const [show, setShow] = useState(false);
  const value = valueProp ?? inner;
  const score = rules.filter((r) => r.test(value)).length;
  const level = rules.length ? Math.ceil((score / rules.length) * 4) : 0;
  const tone = TONES[level];

  return (
    <div className={cn("w-full max-w-xs space-y-2", className)}>
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => {
            const next = e.target.value;
            if (valueProp === undefined) setInner(next);
            onChange?.(next, rules.filter((r) => r.test(next)).length);
          }}
          placeholder={placeholder}
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute inset-y-0 right-0 grid w-10 place-items-center text-muted-foreground hover:text-foreground"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
      <div className="flex gap-1" aria-hidden>
        {rules.map((_, i) => (
          <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < score ? tone : "bg-border")} />
        ))}
      </div>
      <ul className="space-y-1 text-xs">
        {rules.map((rule) => (
          <li key={rule.label} className={rule.test(value) ? "text-foreground" : "text-muted-foreground"}>
            {rule.test(value) ? "✓" : "·"} {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function Input03() {
  return <PasswordStrengthInput />;
}
