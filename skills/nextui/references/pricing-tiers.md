# Pricing tiers (`pricing-tiers`)

Three plans with a monthly/annual toggle, usage chips and a framed recommended tier.

- Kind: block, category: Features & pricing
- Live preview: https://nextui.dev/blocks/pricing-tiers
- Install: `npm create nextui add pricing-tiers`
- npm dependencies: lucide-react
- shadcn dependencies: button, utils

## Usage

```tsx
"use client";

import { ThreeTierPricing } from "@/components/nextui/pricing-tiers";

export function Pricing() {
  return (
    <ThreeTierPricing
      annualDiscount={0.2}
      plans={[
        { name: "Hobby", body: "For side projects.", monthly: 0, usage: ["1 project", "1 seat"], features: ["Community support"], cta: "Start free", href: "/signup" },
        { name: "Team", body: "For small teams.", monthly: 29, usage: ["10 projects", "5 seats"], features: ["Analytics", "SSO"], cta: "Start trial", featured: true },
        { name: "Scale", body: "For larger orgs.", monthly: 89, usage: ["Unlimited", "25 seats"], features: ["Audit log", "SLA"], cta: "Contact sales", href: "/contact" },
      ]}
      onSelect={(plan, period) => console.log(plan.name, period)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `plans` | `PricingPlan[]` | `Starter, Pro, Business` | Plans: name, body, monthly price, usage lines, features, cta, href, featured |
| `annualDiscount` | `number` | `0.33` | Fraction taken off the monthly price when billed annually |
| `currency` | `string` | `"$"` | Symbol before the price |
| `periodLabel` | `string` | `"/month"` | Text after the price |
| `monthlyLabel` | `string` | `"Monthly"` | First toggle option |
| `annualLabel` | `string` | `"Annual"` | Second toggle option |
| `discountLabel` | `string` | `"33% off"` | Badge on the annual option; derived from the discount |
| `recommendedLabel` | `string` | `"Recommended for you"` | Line above the featured plan |
| `includedLabel` | `string` | `"What's included"` | Heading above each feature list |
| `period` | `"monthly" \| "annual"` |  | Controlled billing period |
| `defaultPeriod` | `"monthly" \| "annual"` | `"monthly"` | Billing period on first render |
| `onPeriodChange` | `(period: BillingPeriod) => void` |  | The toggle changed |
| `onSelect` | `(plan: PricingPlan, period: BillingPeriod) => void` |  | A plan button was clicked |
| `className` | `string` |  | Extra classes on the section |

## When to use

- A pricing page with three plans and a billing toggle
- Annual prices are rounded from the monthly price and the discount

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/blocks/pricing-tiers.tsx`

```tsx
"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type PricingPlan = {
  name: string;
  body: string;
  /** Monthly price in dollars; the annual price is derived from the discount. */
  monthly: number;
  /** Two lines shown in the small box next to the price. */
  usage: [string, string];
  features: string[];
  cta: string;
  /** When set, the CTA renders as a link. */
  href?: string;
  /** Highlighted with the "Recommended" frame. */
  featured?: boolean;
};

export type BillingPeriod = "monthly" | "annual";

const PLANS: PricingPlan[] = [
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

type PlanCardProps = {
  plan: PricingPlan;
  annual: boolean;
  annualDiscount: number;
  currency: string;
  periodLabel: string;
  includedLabel: string;
  onSelect?: (plan: PricingPlan, period: BillingPeriod) => void;
};

function PlanCard({ plan, annual, annualDiscount, currency, periodLabel, includedLabel, onSelect }: PlanCardProps) {
  const price = annual ? Math.round(plan.monthly * (1 - annualDiscount)) : plan.monthly;
  const handleClick = onSelect ? () => onSelect(plan, annual ? "annual" : "monthly") : undefined;
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
          <span className="text-3xl font-semibold tracking-tight tabular-nums">
            {currency}
            {price}
          </span>
          <span className="text-sm text-muted-foreground">{periodLabel}</span>
        </p>
        <div className="rounded-lg border px-2.5 py-1 text-center text-xs leading-tight">
          <p className="font-medium">{plan.usage[0]}</p>
          <p className="text-muted-foreground">{plan.usage[1]}</p>
        </div>
      </div>

      <p className="mt-5 font-medium">{includedLabel}</p>
      <ul className="mt-4 space-y-3 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2.5">
            <Check className="size-4 shrink-0 text-muted-foreground" aria-hidden /> {f}
          </li>
        ))}
      </ul>

      {plan.href ? (
        <Button
          size="lg"
          variant={plan.featured ? "default" : "outline"}
          className="mt-7 w-full rounded-xl font-normal"
          asChild
        >
          <a href={plan.href} onClick={handleClick}>
            {plan.cta}
          </a>
        </Button>
      ) : (
        <Button
          size="lg"
          variant={plan.featured ? "default" : "outline"}
          className="mt-7 w-full rounded-xl font-normal"
          onClick={handleClick}
        >
          {plan.cta}
        </Button>
      )}
    </div>
  );
}

export type ThreeTierPricingProps = {
  plans?: PricingPlan[];
  /** Fraction taken off the monthly price when billed annually. */
  annualDiscount?: number;
  currency?: string;
  periodLabel?: string;
  monthlyLabel?: string;
  annualLabel?: string;
  /** Badge on the annual toggle; defaults to the discount as a percentage. */
  discountLabel?: string;
  recommendedLabel?: string;
  includedLabel?: string;
  /** Controlled billing period. */
  period?: BillingPeriod;
  defaultPeriod?: BillingPeriod;
  onPeriodChange?: (period: BillingPeriod) => void;
  /** Called when a plan's CTA is clicked. */
  onSelect?: (plan: PricingPlan, period: BillingPeriod) => void;
  className?: string;
};

/** Three pricing cards with a monthly / annual toggle and a recommended plan. */
export function ThreeTierPricing({
  plans = PLANS,
  annualDiscount = 0.33,
  currency = "$",
  periodLabel = "/month",
  monthlyLabel = "Monthly",
  annualLabel = "Annual",
  discountLabel,
  recommendedLabel = "Recommended for you",
  includedLabel = "What's included",
  period,
  defaultPeriod = "monthly",
  onPeriodChange,
  onSelect,
  className,
}: ThreeTierPricingProps) {
  const [innerPeriod, setInnerPeriod] = useState<BillingPeriod>(defaultPeriod);
  const current = period ?? innerPeriod;
  const annual = current === "annual";
  const badge = discountLabel ?? `${Math.round(annualDiscount * 100)}% off`;

  const setPeriod = (next: BillingPeriod) => {
    if (period === undefined) setInnerPeriod(next);
    onPeriodChange?.(next);
  };

  const cardProps = { annual, annualDiscount, currency, periodLabel, includedLabel, onSelect };

  return (
    <section className={cn("bg-background px-6 py-20 sm:py-28", className)}>
      <div className="mx-auto max-w-5xl">
        <div className="flex justify-center">
          <div role="group" aria-label="Billing period" className="inline-flex rounded-xl bg-muted p-1 text-sm">
            {[
              { label: monthlyLabel, value: false },
              { label: annualLabel, value: true },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                aria-pressed={annual === opt.value}
                onClick={() => setPeriod(opt.value ? "annual" : "monthly")}
                className={cn(
                  "rounded-lg px-4 py-1.5 transition-colors motion-reduce:transition-none",
                  annual === opt.value
                    ? "bg-background font-medium shadow-xs"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {opt.label}
                {opt.value && badge && <span className="ml-1.5 font-semibold text-foreground">{badge}</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid items-center gap-6 lg:grid-cols-3 lg:gap-4">
          {plans.map((plan) =>
            plan.featured ? (
              <div key={plan.name} className="rounded-3xl border bg-muted p-1.5 shadow-sm">
                <p className="py-2 text-center text-sm">{recommendedLabel}</p>
                <PlanCard plan={plan} {...cardProps} />
              </div>
            ) : (
              <PlanCard key={plan.name} plan={plan} {...cardProps} />
            ),
          )}
        </div>
      </div>
    </section>
  );
}

export default function Pricing01() {
  return <ThreeTierPricing />;
}
```
