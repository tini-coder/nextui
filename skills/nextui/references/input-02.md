# Input with icon and button (`input-02`)

Newsletter-style input with a leading icon and submit button.

- Kind: component, category: Forms & inputs
- Live preview: https://nextui.dev/components/input-02
- Install: `npx shadcn@latest add https://nextui.dev/r/input-02.json`
- npm dependencies: lucide-react
- shadcn dependencies: input, button

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/input-02.tsx`

```tsx
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Input02() {
  return (
    <form className="flex w-full max-w-md gap-2">
      <div className="relative flex-1">
        <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input type="email" placeholder="Enter your email" className="pl-9" aria-label="Email" />
      </div>
      <Button type="submit">Subscribe</Button>
    </form>
  );
}
```
