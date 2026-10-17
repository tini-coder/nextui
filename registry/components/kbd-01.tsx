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
