# Testimonials (`testimonials`)

Three testimonial cards with ratings and avatars.

- Kind: block, category: Testimonials & team
- Live preview: https://nextui.dev/blocks/testimonials
- Install: `npm create nextui add testimonials`
- npm dependencies: lucide-react
- shadcn dependencies: card, avatar

## Usage

```tsx
import { TestimonialCards } from "@/components/nextui/testimonials";

export function Reviews() {
  return (
    <TestimonialCards
      title="What customers say"
      testimonials={[
        { quote: "Onboarding took a day, not a quarter.", name: "Sam Ortiz", role: "COO, Fieldline", initials: "SO" },
        { quote: "Our support queue dropped by half.", name: "Nina Park", role: "Head of CX, Loop", initials: "NP", avatar: "/people/nina.jpg" },
        { quote: "Finally, reports the board reads.", name: "Ivo Petrov", role: "CFO, Arcadia", initials: "IP", rating: 4 },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `string` | `"Loved by fast-moving teams"` | Heading above the cards |
| `testimonials` | `TestimonialItem[]` | `3 sample quotes` | Cards: quote, name, role, initials, optional avatar and rating |
| `className` | `string` |  | Extra classes on the section |

## When to use

- Social proof on a landing or pricing page
- Three cards fill one row on desktop; more wrap onto new rows

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/blocks/testimonials.tsx`

```tsx
import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  /** Optional photo; falls back to the initials. */
  avatar?: string;
  /** Filled stars, 5 by default. */
  rating?: number;
};

const QUOTES: TestimonialItem[] = [
  { quote: "We moved our whole roadmap over in an afternoon. The team has not looked back.", name: "Linh Tran", role: "Head of Product, Northwind", initials: "LT" },
  { quote: "The dashboards finally answer the questions our board actually asks.", name: "Marcus Hale", role: "CFO, Brightline", initials: "MH" },
  { quote: "Setup took ten minutes and support replied before I finished my coffee.", name: "Aisha Khan", role: "Founder, Parcel", initials: "AK" },
];

export type TestimonialCardsProps = {
  title?: string;
  testimonials?: TestimonialItem[];
  className?: string;
};

/** Heading over a grid of star-rated testimonial cards. */
export function TestimonialCards({
  title = "Loved by fast-moving teams",
  testimonials = QUOTES,
  className,
}: TestimonialCardsProps) {
  return (
    <section className={cn("bg-muted/40 px-6 py-20 sm:py-28", className)}>
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((q) => (
            <Card key={q.name}>
              <CardContent className="flex h-full flex-col gap-6">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: q.rating ?? 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="flex-1 text-pretty">&ldquo;{q.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    {q.avatar && <AvatarImage src={q.avatar} alt={q.name} />}
                    <AvatarFallback className="text-xs">{q.initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{q.name}</p>
                    <p className="text-muted-foreground">{q.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Testimonials01() {
  return <TestimonialCards />;
}
```
