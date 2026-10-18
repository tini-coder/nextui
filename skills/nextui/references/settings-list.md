# Settings list (`settings-list`)

Notification settings list with switches.

- Kind: component, category: Forms & inputs
- Live preview: https://nextui.dev/components/settings-list
- Install: `npx shadcn@latest add https://nextui.dev/r/settings-list.json`
- shadcn dependencies: switch, label, separator

## Usage

```tsx
"use client";

import { useState } from "react";
import { SettingsSwitches } from "@/components/nextui/settings-list";

export function NotificationSettings() {
  const [prefs, setPrefs] = useState({ push: true, digest: false });

  return (
    <SettingsSwitches
      settings={[
        { id: "push", title: "Push notifications", body: "Mentions and direct messages." },
        { id: "digest", title: "Daily digest", body: "One email each morning." },
      ]}
      checked={prefs}
      onCheckedChange={(id, value) => setPrefs((p) => ({ ...p, [id]: value }))}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `settings` | `SettingSwitchItem[]` | `3 sample email settings` | Rows: id, title, body and optional starting state on |
| `checked` | `Record<string, boolean>` |  | Controlled state by setting id; leave out to use each row's on |
| `onCheckedChange` | `(id: string, checked: boolean) => void` |  | Called when a switch flips |
| `className` | `string` |  | Extra classes on the card |

## When to use

- Settings pages with on and off preferences.
- Each title is a label for its switch, so clicking the text flips it.

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/settings-list.tsx`

```tsx
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

/** One setting row; `on` is its starting state when uncontrolled. */
export type SettingSwitchItem = {
  id: string;
  title: string;
  body: string;
  on?: boolean;
};

const SETTINGS: SettingSwitchItem[] = [
  { id: "marketing", title: "Marketing emails", body: "Product news and feature launches.", on: false },
  { id: "security", title: "Security alerts", body: "New sign-ins and password changes.", on: true },
  { id: "weekly", title: "Weekly summary", body: "A digest of your team's activity.", on: true },
];

export type SettingsSwitchesProps = {
  settings?: SettingSwitchItem[];
  /** Controlled state by setting id; leave out to let each switch manage itself. */
  checked?: Record<string, boolean>;
  /** Called when a switch flips. */
  onCheckedChange?: (id: string, checked: boolean) => void;
  className?: string;
};

/** A card of labelled switches, one row per setting. */
export function SettingsSwitches({ settings = SETTINGS, checked, onCheckedChange, className }: SettingsSwitchesProps) {
  return (
    <div className={cn("w-full max-w-md rounded-xl border bg-card", className)}>
      {settings.map((s, i) => (
        <div key={s.id}>
          {i > 0 && <Separator />}
          <div className="flex items-center justify-between gap-4 p-4">
            <div className="space-y-1">
              <Label htmlFor={`switch-01-${s.id}`}>{s.title}</Label>
              <p className="text-sm text-muted-foreground">{s.body}</p>
            </div>
            <Switch
              id={`switch-01-${s.id}`}
              {...(checked ? { checked: checked[s.id] ?? false } : { defaultChecked: s.on })}
              onCheckedChange={onCheckedChange ? (value) => onCheckedChange(s.id, value) : undefined}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Switch01() {
  return <SettingsSwitches />;
}
```
