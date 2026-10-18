# Alerts (`alerts`)

Info, success, warning and error alerts with dismiss buttons.

- Kind: component, category: Feedback & display
- Live preview: https://nextui.dev/components/alerts
- Install: `npx shadcn@latest add https://nextui.dev/r/alerts.json`
- npm dependencies: lucide-react
- shadcn dependencies: utils

## Usage

```tsx
"use client";

import { useState } from "react";
import { AlertBanners, type AlertBannerItem } from "@/components/nextui/alerts";

export function Notices() {
  const [alerts, setAlerts] = useState<AlertBannerItem[]>([
    { variant: "success", title: "Changes saved", body: "Your profile is up to date." },
    { variant: "warning", title: "Trial ends in 3 days", body: "Add a card to keep your projects." },
  ]);

  return <AlertBanners alerts={alerts} onDismiss={(_, i) => setAlerts((list) => list.filter((_, j) => j !== i))} />;
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `alerts` | `AlertBannerItem[]` | `4 sample alerts` | Banners: title, body, variant and optional icon or tone override |
| `onDismiss` | `(alert: AlertBannerItem, index: number) => void` |  | Called when an alert's × is clicked |
| `dismissible` | `boolean` | `true` | Show the × on each alert |
| `className` | `string` |  | Extra classes on the stack |

## When to use

- Inline messages about the page: updates, success, warnings and errors.
- Variant is "info", "success", "warning" or "error"; remove the alert in onDismiss to hide it.

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/alerts.tsx`

```tsx
import type { LucideIcon } from "lucide-react";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertVariant = "info" | "success" | "warning" | "error";

/** One banner; `variant` picks the icon and colours, `icon` and `tone` override them. */
export type AlertBannerItem = {
  title: string;
  body?: string;
  variant?: AlertVariant;
  icon?: LucideIcon;
  /** Tailwind classes for border, fill and text colour. */
  tone?: string;
};

const VARIANTS: Record<AlertVariant, { icon: LucideIcon; tone: string }> = {
  info: { icon: Info, tone: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300" },
  success: { icon: CircleCheck, tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
  warning: { icon: TriangleAlert, tone: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  error: { icon: CircleAlert, tone: "border-destructive/30 bg-destructive/10 text-destructive" },
};

const ALERTS: AlertBannerItem[] = [
  { variant: "info", title: "Heads up", body: "A new version is available. Refresh to update." },
  { variant: "success", title: "Payment received", body: "Your invoice #1042 has been paid." },
  { variant: "warning", title: "Storage almost full", body: "You have used 92% of your plan." },
  { variant: "error", title: "Deploy failed", body: "Build step exited with code 1." },
];

export type AlertBannersProps = {
  alerts?: AlertBannerItem[];
  /** Called when an alert's × is clicked. */
  onDismiss?: (alert: AlertBannerItem, index: number) => void;
  /** Show the × on each alert. */
  dismissible?: boolean;
  className?: string;
};

/** A stack of tinted alert banners for info, success, warning and error messages. */
export function AlertBanners({ alerts = ALERTS, onDismiss, dismissible = true, className }: AlertBannersProps) {
  return (
    <div className={cn("w-full max-w-md space-y-3", className)}>
      {alerts.map((alert, i) => {
        const preset = VARIANTS[alert.variant ?? "info"];
        const Icon = alert.icon ?? preset.icon;
        return (
          <div
            key={`${alert.title}-${i}`}
            role="alert"
            className={cn("flex items-start gap-3 rounded-lg border px-4 py-3 text-sm", alert.tone ?? preset.tone)}
          >
            <Icon className="mt-0.5 size-4 shrink-0" />
            <div className="flex-1">
              <p className="font-medium">{alert.title}</p>
              {alert.body && <p className="opacity-80">{alert.body}</p>}
            </div>
            {dismissible && (
              <button
                aria-label="Dismiss"
                className="opacity-60 transition-opacity hover:opacity-100"
                onClick={onDismiss ? () => onDismiss(alert, i) : undefined}
              >
                <X className="size-4" />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function Alert01() {
  return <AlertBanners />;
}
```
