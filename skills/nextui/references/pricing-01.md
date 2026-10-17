# Three-tier pricing (`pricing-01`)

Three plans with a monthly/annual toggle, usage chips and a framed recommended tier.

- Kind: block, category: Features & pricing
- Live preview: https://nextui.dev/blocks/pricing-01
- Install: `npx shadcn@latest add https://nextui.dev/r/pricing-01.json`
- npm dependencies: lucide-react
- shadcn dependencies: button, utils

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/blocks/pricing-01.tsx`

```tsx
"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ANNUAL_DISCOUNT = 0.33;

const PLANS = [
  {
    name: "Starter",
    body: "For individuals and small teams getting started.",
    monthly: 19,
    usage: ["100 min", "50 Calls"],
    features: ["Spam filtering", "Transcript and AI analytics", "Premium voices", "Email + SMS notification"],
    cta: "Start for free",
  },
  {
    name: "Pro",
    body: "For growing teams that need smarter workflows.",
    monthly: 49,
    usage: ["200 min", "100 Calls"],
    features: ["Warm transferring", "Conversational AI SMS", "CRM + Scheduling integrations", "Unlimited concurrent calls"],
    cta: "Start with Pro",
    featured: true,
  },
  {
    name: "Business",
    body: "For large organizations with advanced needs.",
    monthly: 99,
    usage: ["500 min", "250 Calls"],
    features: ["Outbound calling", "CRM integrations", "Priority support", "Voice cloning"],
    cta: "Subscribe",
  },
];

type Plan = (typeof PLANS)[number];

function PlanCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const price = annual ? Math.round(plan.monthly * (1 - ANNUAL_DISCOUNT)) : plan.monthly;
  return (
    <div
      className={cn(
        "flex flex-col rounded-2xl border bg-card p-6 text-card-foreground",
        plan.featured ? "shadow-sm" : "shadow-xs",
      )}
    >
      <h3 className="text-sm font-semibold uppercase tracking-wide">{plan.name}</h3>
      <p className="mt-2 min-h-10 text-sm text-muted-foreground">{plan.body}</p>

      <div className="mt-6 flex items-end justify-between gap-4 border-b pb-4">
        <p className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold tracking-tight tabular-nums">${price}</span>
          <span className="text-sm text-muted-foreground">/month</span>
        </p>
        <div className="rounded-lg border px-2.5 py-1 text-center text-xs leading-tight">
          <p className="font-medium">{plan.usage[0]}</p>
          <p className="text-muted-foreground">{plan.usage[1]}</p>
        </div>
      </div>

      <p className="mt-5 font-medium">What&apos;s included</p>
      <ul className="mt-4 space-y-3 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5">
            <Check className="size-4 shrink-0 text-muted-foreground" aria-hidden /> {f}
          </li>
        ))}
      </ul>

      <Button
        size="lg"
        variant={plan.featured ? "default" : "outline"}
        className="mt-7 w-full rounded-xl font-normal"
      >
        {plan.cta}
      </Button>
    </div>
  );
}

export default function Pricing01() {
  const [annual, setAnnual] = useState(false);
  return (
    <section className="bg-background px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-center">
          <div role="group" aria-label="Billing period" className="inline-flex rounded-xl bg-muted p-1 text-sm">
            {[
              { label: "Monthly", value: false },
              { label: "Annual", value: true },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                aria-pressed={annual === opt.value}
                onClick={() => setAnnual(opt.value)}
                className={cn(
                  "rounded-lg px-4 py-1.5 transition-colors motion-reduce:transition-none",
                  annual === opt.value
                    ? "bg-background font-medium shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {opt.label}
                {opt.value && <span className="ml-1.5 font-semibold text-foreground">33% off</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid items-center gap-6 lg:grid-cols-3 lg:gap-4">
          {PLANS.map((plan) =>
            plan.featured ? (
              <div key={plan.name} className="rounded-3xl border bg-muted p-1.5 shadow-sm">
                <p className="py-2 text-center text-sm">Recommended for you</p>
                <PlanCard plan={plan} annual={annual} />
              </div>
            ) : (
              <PlanCard key={plan.name} plan={plan} annual={annual} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}
```
