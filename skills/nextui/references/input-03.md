# Password with strength meter (`input-03`)

Password input with show/hide toggle and a live strength checklist.

- Kind: component, category: Forms & inputs
- Live preview: https://nextui.dev/components/input-03
- Install: `npx shadcn@latest add https://nextui.dev/r/input-03.json`
- npm dependencies: lucide-react
- shadcn dependencies: input, label, utils

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/input-03.tsx`

```tsx
"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const RULES = [
  { label: "8+ characters", test: (v: string) => v.length >= 8 },
  { label: "A number", test: (v: string) => /\d/.test(v) },
  { label: "An uppercase letter", test: (v: string) => /[A-Z]/.test(v) },
  { label: "A symbol", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export default function Input03() {
  const [value, setValue] = useState("");
  const [show, setShow] = useState(false);
  const score = RULES.filter((r) => r.test(value)).length;
  const tone = ["bg-border", "bg-destructive", "bg-orange-500", "bg-amber-500", "bg-emerald-500"][score];

  return (
    <div className="w-full max-w-xs space-y-2">
      <Label htmlFor="password-03">Password</Label>
      <div className="relative">
        <Input
          id="password-03"
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Create a password"
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
        {RULES.map((_, i) => (
          <span key={i} className={cn("h-1 flex-1 rounded-full transition-colors", i < score ? tone : "bg-border")} />
        ))}
      </div>
      <ul className="space-y-1 text-xs">
        {RULES.map((rule) => (
          <li key={rule.label} className={rule.test(value) ? "text-foreground" : "text-muted-foreground"}>
            {rule.test(value) ? "✓" : "·"} {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
```
