# Settings switches (`switch-01`)

Notification settings list with switches.

- Kind: component, category: Forms & inputs
- Live preview: https://nextui.dev/components/switch-01
- Install: `npx shadcn@latest add https://nextui.dev/r/switch-01.json`
- shadcn dependencies: switch, label, separator

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/switch-01.tsx`

```tsx
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

const SETTINGS = [
  { id: "marketing", title: "Marketing emails", body: "Product news and feature launches.", on: false },
  { id: "security", title: "Security alerts", body: "New sign-ins and password changes.", on: true },
  { id: "weekly", title: "Weekly summary", body: "A digest of your team's activity.", on: true },
];

export default function Switch01() {
  return (
    <div className="w-full max-w-md rounded-xl border bg-card">
      {SETTINGS.map((s, i) => (
        <div key={s.id}>
          {i > 0 && <Separator />}
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="space-y-1">
              <Label htmlFor={`switch-01-${s.id}`}>{s.title}</Label>
              <p className="text-sm text-muted-foreground">{s.body}</p>
            </div>
            <Switch id={`switch-01-${s.id}`} defaultChecked={s.on} />
          </div>
        </div>
      ))}
    </div>
  );
}
```
