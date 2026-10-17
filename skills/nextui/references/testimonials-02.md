# Single quote (`testimonials-02`)

One large testimonial with author.

- Kind: block, category: Testimonials & team
- Live preview: https://nextui.dev/blocks/testimonials-02
- Install: `npx shadcn@latest add https://nextui.dev/r/testimonials-02.json`
- shadcn dependencies: avatar

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/blocks/testimonials-02.tsx`

```tsx
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function Testimonials02() {
  return (
    <section className="bg-background px-6 py-20 sm:py-28">
      <figure className="mx-auto max-w-3xl text-center">
        <svg aria-hidden viewBox="0 0 24 24" className="mx-auto size-10 fill-primary/20">
          <path d="M10 7H6a3 3 0 0 0-3 3v7h7v-7H6a1 1 0 0 1 1-1h3V7Zm11 0h-4a3 3 0 0 0-3 3v7h7v-7h-4a1 1 0 0 1 1-1h3V7Z" />
        </svg>
        <blockquote className="mt-6 text-2xl font-medium tracking-tight text-balance sm:text-3xl">
          &ldquo;We replaced four tools with one and shipped our redesign two weeks early. The team actually enjoys
          planning now.&rdquo;
        </blockquote>
        <figcaption className="mt-10 flex items-center justify-center gap-3">
          <Avatar className="size-11">
            <AvatarFallback>HV</AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="font-semibold">Hoa Vu</p>
            <p className="text-sm text-muted-foreground">Head of Product, Northwind</p>
          </div>
        </figcaption>
      </figure>
    </section>
  );
}
```
