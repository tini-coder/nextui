# FAQ (`faq`)

Accessible accordion built on details and summary.

- Kind: component, category: Feedback & display
- Live preview: https://nextui.dev/components/faq
- Install: `npx shadcn@latest add https://nextui.dev/r/faq.json`
- npm dependencies: lucide-react

## Usage

```tsx
import { FaqAccordion } from "@/components/nextui/faq";

export function PricingFaq() {
  return (
    <FaqAccordion
      items={[
        { question: "Do you have student pricing?", answer: "Yes, 50% off with a valid school email." },
        { question: "Can I change plans later?", answer: "Upgrade or downgrade any time from billing." },
      ]}
      defaultOpenIndex={null}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `items` | `FaqItem[]` | `3 sample questions` | Questions and their answers |
| `defaultOpenIndex` | `number \| null` | `0` | Item open on first render; null starts all closed |
| `className` | `string` |  | Extra classes on the card |

## When to use

- FAQ sections on pricing and landing pages.
- Built on native details, so it works without JavaScript and is keyboard accessible.

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/faq.tsx`

```tsx
import type * as React from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

/** One question and its answer. */
export type FaqItem = {
  question: string;
  answer: React.ReactNode;
};

const ITEMS: FaqItem[] = [
  { question: "Is there a free plan?", answer: "Yes. The free plan includes three projects and community support, forever." },
  { question: "Can I cancel anytime?", answer: "You can cancel from your billing settings. You keep access until the end of the period." },
  { question: "Do you offer refunds?", answer: "We refund any payment within 14 days, no questions asked." },
];

export type FaqAccordionProps = {
  items?: FaqItem[];
  /** Index of the item open on first render; null starts all closed. */
  defaultOpenIndex?: number | null;
  className?: string;
};

/** A FAQ list built on native details elements, with a plus that turns into a cross. */
export function FaqAccordion({ items = ITEMS, defaultOpenIndex = 0, className }: FaqAccordionProps) {
  return (
    <div className={cn("w-full max-w-md divide-y rounded-lg border bg-card", className)}>
      {items.map(({ question, answer }, i) => (
        <details key={question} open={i === defaultOpenIndex} className="group px-4 [&_summary::-webkit-details-marker]:hidden">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium">
            {question}
            <Plus className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45" />
          </summary>
          <p className="pb-4 text-sm text-muted-foreground">{answer}</p>
        </details>
      ))}
    </div>
  );
}

export default function Accordion01() {
  return <FaqAccordion />;
}
```
