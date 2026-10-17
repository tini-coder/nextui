# Keyboard shortcuts (`kbd-01`)

Shortcut list with styled key caps.

- Kind: component, category: Feedback & display
- Live preview: https://nextui.dev/components/kbd-01
- Install: `npx shadcn@latest add https://nextui.dev/r/kbd-01.json`

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/kbd-01.tsx`

```tsx
const SHORTCUTS = [
  { label: "Search", keys: ["⌘", "K"] },
  { label: "New file", keys: ["⌘", "N"] },
  { label: "Save", keys: ["⌘", "S"] },
  { label: "Toggle sidebar", keys: ["⌘", "B"] },
  { label: "Undo", keys: ["⌘", "Z"] },
];

export default function Kbd01() {
  return (
    <ul className="w-full max-w-xs divide-y rounded-lg border bg-card text-sm">
      {SHORTCUTS.map((s) => (
        <li key={s.label} className="flex items-center justify-between px-4 py-2.5">
          <span>{s.label}</span>
          <span className="flex gap-1">
            {s.keys.map((k) => (
              <kbd
                key={k}
                className="grid h-6 min-w-6 place-items-center rounded border border-b-2 bg-background px-1.5 font-mono text-xs text-muted-foreground"
              >
                {k}
              </kbd>
            ))}
          </span>
        </li>
      ))}
    </ul>
  );
}
```
