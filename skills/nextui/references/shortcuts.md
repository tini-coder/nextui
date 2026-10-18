# Shortcuts (`shortcuts`)

Shortcut list with styled key caps.

- Kind: component, category: Feedback & display
- Live preview: https://nextui.dev/components/shortcuts
- Install: `npx shadcn@latest add https://nextui.dev/r/shortcuts.json`

## Usage

```tsx
import { KeyboardShortcuts } from "@/components/nextui/shortcuts";

export function EditorShortcuts() {
  return (
    <KeyboardShortcuts
      shortcuts={[
        { label: "Command palette", keys: ["⌘", "⇧", "P"] },
        { label: "Go to line", keys: ["Ctrl", "G"] },
        { label: "Close tab", keys: ["⌘", "W"] },
      ]}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `shortcuts` | `KeyboardShortcutItem[]` | `Search, New file, Save, Toggle sidebar, Undo` | Rows: a label and the keys to press |
| `className` | `string` |  | Extra classes on the list |

## When to use

- Help panels and cheat sheets for keyboard shortcuts.
- Keys render as kbd elements, so screen readers announce them as keys.

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/shortcuts.tsx`

```tsx
import { cn } from "@/lib/utils";

/** One row: what the shortcut does and the keys to press. */
export type KeyboardShortcutItem = {
  label: string;
  keys: string[];
};

const SHORTCUTS: KeyboardShortcutItem[] = [
  { label: "Search", keys: ["⌘", "K"] },
  { label: "New file", keys: ["⌘", "N"] },
  { label: "Save", keys: ["⌘", "S"] },
  { label: "Toggle sidebar", keys: ["⌘", "B"] },
  { label: "Undo", keys: ["⌘", "Z"] },
];

export type KeyboardShortcutsProps = {
  shortcuts?: KeyboardShortcutItem[];
  className?: string;
};

/** A list of actions with their keyboard shortcuts drawn as keycaps. */
export function KeyboardShortcuts({ shortcuts = SHORTCUTS, className }: KeyboardShortcutsProps) {
  return (
    <ul className={cn("w-full max-w-xs divide-y rounded-lg border bg-card text-sm", className)}>
      {shortcuts.map((s) => (
        <li key={s.label} className="flex items-center justify-between px-4 py-2.5">
          <span>{s.label}</span>
          <span className="flex gap-1">
            {s.keys.map((k, i) => (
              <kbd
                key={`${k}-${i}`}
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

export default function Kbd01() {
  return <KeyboardShortcuts />;
}
```
