# Alert banners (`alert-01`)

Info, success, warning and error alerts with dismiss buttons.

- Kind: component, category: Feedback & display
- Live preview: https://nextui.dev/components/alert-01
- Install: `npx shadcn@latest add https://nextui.dev/r/alert-01.json`
- npm dependencies: lucide-react
- shadcn dependencies: utils

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/alert-01.tsx`

```tsx
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ALERTS = [
  { icon: Info, tone: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-300", title: "Heads up", body: "A new version is available. Refresh to update." },
  { icon: CircleCheck, tone: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300", title: "Payment received", body: "Your invoice #1042 has been paid." },
  { icon: TriangleAlert, tone: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300", title: "Storage almost full", body: "You have used 92% of your plan." },
  { icon: CircleAlert, tone: "border-destructive/30 bg-destructive/10 text-destructive", title: "Deploy failed", body: "Build step exited with code 1." },
];

export default function Alert01() {
  return (
    <div className="w-full max-w-md space-y-3">
      {ALERTS.map(({ icon: Icon, tone, title, body }) => (
        <div key={title} role="alert" className={cn("flex items-start gap-3 rounded-lg border px-4 py-3 text-sm", tone)}>
          <Icon className="mt-0.5 size-4 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">{title}</p>
            <p className="opacity-80">{body}</p>
          </div>
          <button aria-label="Dismiss" className="opacity-60 transition-opacity hover:opacity-100">
            <X className="size-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
```
