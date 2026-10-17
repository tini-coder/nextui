# Testimonial cards (`testimonials-01`)

Three testimonial cards with ratings and avatars.

- Kind: block, category: Testimonials & team
- Live preview: https://nextui.dev/blocks/testimonials-01
- Install: `npx shadcn@latest add https://nextui.dev/r/testimonials-01.json`
- npm dependencies: lucide-react
- shadcn dependencies: card, avatar

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/blocks/testimonials-01.tsx`

```tsx
import { Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";

const QUOTES = [
  { quote: "We moved our whole roadmap over in an afternoon. The team has not looked back.", name: "Linh Tran", role: "Head of Product, Northwind", initials: "LT" },
  { quote: "The dashboards finally answer the questions our board actually asks.", name: "Marcus Hale", role: "CFO, Brightline", initials: "MH" },
  { quote: "Setup took ten minutes and support replied before I finished my coffee.", name: "Aisha Khan", role: "Founder, Parcel", initials: "AK" },
];

export default function Testimonials01() {
  return (
    <section className="bg-muted/40 px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">Loved by fast-moving teams</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {QUOTES.map((q) => (
            <Card key={q.name}>
              <CardContent className="flex h-full flex-col gap-6">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="flex-1 text-pretty">&ldquo;{q.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Avatar>
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
```
