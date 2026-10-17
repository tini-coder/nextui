# FAQ accordion (`accordion-01`)

Accessible accordion built on details and summary.

- Kind: component, category: Feedback & display
- Live preview: https://nextui.dev/components/accordion-01
- Install: `npx shadcn@latest add https://nextui.dev/r/accordion-01.json`
- npm dependencies: lucide-react

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/accordion-01.tsx`

```tsx
import { Plus } from "lucide-react";

const ITEMS = [
  ["Is there a free plan?", "Yes. The free plan includes three projects and community support, forever."],
  ["Can I cancel anytime?", "You can cancel from your billing settings. You keep access until the end of the period."],
  ["Do you offer refunds?", "We refund any payment within 14 days, no questions asked."],
];

export default function Accordion01() {
  return (
    <div className="w-full max-w-md divide-y rounded-lg border bg-card">
      {ITEMS.map(([q, a], i) => (
        <details key={q} open={i === 0} className="group px-4 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium">
            {q}
            <Plus className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45" />
          </summary>
          <p className="pb-4 text-sm text-muted-foreground">{a}</p>
        </details>
      ))}
    </div>
  );
}
```
