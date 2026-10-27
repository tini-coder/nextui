# Avatar status (`avatar-status`)

Team list with online, away and offline status dots.

- Kind: component, category: Buttons, badges & avatars
- Live preview: https://nextui.dev/components/avatar-status
- Install: `npm create nextui add avatar-status`
- shadcn dependencies: avatar, utils

## Usage

```tsx
"use client";

import { AvatarsWithStatus } from "@/components/nextui/avatar-status";

export function TeamList() {
  return (
    <AvatarsWithStatus
      people={[
        { name: "Linh Pham", role: "Support", initials: "LP", status: "online" },
        { name: "Noah Kim", role: "Sales", initials: "NK", status: "away", src: "/avatars/noah.png" },
      ]}
      onSelect={(person) => console.log(person.name)}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `people` | `AvatarStatusItem[]` | `3 sample people` | Rows: name, role, initials, status and optional src |
| `onSelect` | `(person: AvatarStatusItem) => void` |  | Called when a row is clicked; rows become clickable when set |
| `className` | `string` |  | Extra classes on the list |

## When to use

- Team or contact lists where presence matters.
- Status is "online", "away" or "offline" and sets the dot colour.

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/avatar-status.tsx`

```tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

export type AvatarStatus = "online" | "away" | "offline";

/** One row: a person, their role and presence. */
export type AvatarStatusItem = {
  name: string;
  role: string;
  initials: string;
  status: AvatarStatus;
  src?: string;
};

const PEOPLE: AvatarStatusItem[] = [
  { name: "Minh Tran", role: "Engineering", initials: "MT", status: "online" },
  { name: "Ava Chen", role: "Design", initials: "AC", status: "away" },
  { name: "Sam Lee", role: "Marketing", initials: "SL", status: "offline" },
];

const DOT = { online: "bg-emerald-500", away: "bg-amber-500", offline: "bg-muted-foreground/40" };

export type AvatarsWithStatusProps = {
  people?: AvatarStatusItem[];
  /** Called with the person whose row was clicked; rows become clickable when set. */
  onSelect?: (person: AvatarStatusItem) => void;
  className?: string;
};

/** A list of people with an avatar, a presence dot and a status label. */
export function AvatarsWithStatus({ people = PEOPLE, onSelect, className }: AvatarsWithStatusProps) {
  return (
    <ul className={cn("w-full max-w-xs divide-y rounded-lg border bg-card", className)}>
      {people.map((p) => (
        <li
          key={p.name}
          className={cn("flex items-center gap-3 p-3", onSelect && "cursor-pointer hover:bg-muted/50")}
          onClick={onSelect ? () => onSelect(p) : undefined}
        >
          <span className="relative">
            <Avatar>
              {p.src && <AvatarImage src={p.src} alt={p.name} />}
              <AvatarFallback>{p.initials}</AvatarFallback>
            </Avatar>
            <span
              aria-label={p.status}
              className={cn("absolute right-0 bottom-0 size-2.5 rounded-full ring-2 ring-card", DOT[p.status])}
            />
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{p.name}</p>
            <p className="text-xs text-muted-foreground">{p.role}</p>
          </div>
          <span className="ml-auto text-xs capitalize text-muted-foreground">{p.status}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Avatar02() {
  return <AvatarsWithStatus />;
}
```
