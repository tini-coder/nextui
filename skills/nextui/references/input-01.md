# Input with label (`input-01`)

Email input with a label and helper text.

- Kind: component, category: Forms & inputs
- Live preview: https://nextui.dev/components/input-01
- Install: `npx shadcn@latest add https://nextui.dev/r/input-01.json`
- shadcn dependencies: input, label

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/input-01.tsx`

```tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Input01() {
  return (
    <div className="grid w-full max-w-sm gap-2">
      <Label htmlFor="input-01-email">Work email</Label>
      <Input id="input-01-email" type="email" placeholder="you@company.com" />
      <p className="text-xs text-muted-foreground">We will send the invoice to this address.</p>
    </div>
  );
}
```
