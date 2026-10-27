# Quote (`quote`)

One large testimonial with author.

- Kind: block, category: Testimonials & team
- Live preview: https://nextui.dev/blocks/quote
- Install: `npm create nextui add quote`
- shadcn dependencies: avatar

## Usage

```tsx
import { SingleQuote } from "@/components/nextui/quote";

export function Quote() {
  return (
    <SingleQuote
      quote="We cut our release cycle from a month to a week."
      name="Dana White"
      role="VP Engineering, Kite"
      initials="DW"
      avatar="/people/dana.jpg"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `quote` | `string` | `"We replaced four tools with one…"` | The quote, without quotation marks |
| `name` | `string` | `"Hoa Vu"` | Author name |
| `role` | `string` | `"Head of Product, Northwind"` | Author role and company |
| `initials` | `string` | `"HV"` | Avatar fallback |
| `avatar` | `string` |  | Author photo URL |
| `className` | `string` |  | Extra classes on the section |

## When to use

- One strong customer quote between landing page sections
- Keep the quote to two or three lines for best balance

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/blocks/quote.tsx`

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type SingleQuoteProps = {
  quote?: string;
  name?: string;
  role?: string;
  initials?: string;
  /** Optional photo; falls back to the initials. */
  avatar?: string;
  className?: string;
};

/** One large centered quote with the author underneath. */
export function SingleQuote({
  quote = "We replaced four tools with one and shipped our redesign two weeks early. The team actually enjoys planning now.",
  name = "Hoa Vu",
  role = "Head of Product, Northwind",
  initials = "HV",
  avatar,
  className,
}: SingleQuoteProps) {
  return (
    <section className={cn("bg-background px-6 py-20 sm:py-28", className)}>
      <figure className="mx-auto max-w-3xl text-center">
        <svg aria-hidden viewBox="0 0 24 24" className="mx-auto size-10 fill-primary/20">
          <path d="M10 7H6a3 3 0 0 0-3 3v7h7v-7H6a1 1 0 0 1 1-1h3V7Zm11 0h-4a3 3 0 0 0-3 3v7h7v-7h-4a1 1 0 0 1 1-1h3V7Z" />
        </svg>
        <blockquote className="mt-6 text-2xl font-medium tracking-tight text-balance sm:text-3xl">
          &ldquo;{quote}&rdquo;
        </blockquote>
        <figcaption className="mt-10 flex items-center justify-center gap-3">
          <Avatar className="size-11">
            {avatar && <AvatarImage src={avatar} alt={name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="font-semibold">{name}</p>
            <p className="text-sm text-muted-foreground">{role}</p>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}

export default function Testimonials02() {
  return <SingleQuote />;
}
```
