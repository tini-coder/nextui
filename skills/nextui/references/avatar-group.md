# Avatar group (`avatar-group`)

Stacked avatars with an overflow count.

- Kind: component, category: Buttons, badges & avatars
- Live preview: https://nextui.dev/components/avatar-group
- Install: `npx shadcn@latest add https://nextui.dev/r/avatar-group.json`
- shadcn dependencies: avatar

## Usage

```tsx
import { AvatarGroup } from "@/components/nextui/avatar-group";

export function Collaborators() {
  return (
    <AvatarGroup
      people={[
        { initials: "MT", name: "Minh Tran", src: "/avatars/minh.png" },
        { initials: "AC", name: "Ava Chen" },
        { initials: "SL", name: "Sam Lee" },
      ]}
      moreLabel="+4"
      caption="7 people editing"
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `people` | `AvatarGroupItem[]` | `AN, BT, CL, DH, EV` | Avatars to show: initials, optional src and name |
| `moreLabel` | `string \| null` | `"+12"` | Label on the last highlighted avatar; null hides it |
| `caption` | `ReactNode` | `"17 teammates online"` | Text beside the group |
| `className` | `string` |  | Extra classes on the wrapper |

## When to use

- Showing who is in a team, document or call in a small space.
- Hover lifts avatars in a wave; reduced motion turns it off.

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/avatar-group.tsx`

```tsx
"use client";

import type * as React from "react";
import { useState } from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

/** One person in the group; `initials` show until (or instead of) the image. */
export type AvatarGroupItem = {
  initials: string;
  src?: string;
  name?: string;
};

const PEOPLE: AvatarGroupItem[] = [
  { initials: "AN" },
  { initials: "BT" },
  { initials: "CL" },
  { initials: "DH" },
  { initials: "EV" },
];

// Hovering an avatar lifts it and its neighbours by a falloff of its distance, then springs
// everything back on leave. Lift eases in cleanly; the return overshoots for the bounce.
const LIFT = -4;
const FALLOFF = 0.45;
const SCALE = 1.05;
const EASE_IN = "cubic-bezier(0.22, 1, 0.36, 1)";
const EASE_OUT = "cubic-bezier(0.34, 3.85, 0.64, 1)";

export type AvatarGroupProps = {
  people?: AvatarGroupItem[];
  /** Label on the last, highlighted avatar; pass null to hide it. */
  moreLabel?: string | null;
  /** Text beside the group. */
  caption?: React.ReactNode;
  className?: string;
};

/** Overlapping avatars that lift in a wave around the one you hover. */
export function AvatarGroup({
  people = PEOPLE,
  moreLabel = "+12",
  caption = "17 teammates online",
  className,
}: AvatarGroupProps) {
  const [active, setActive] = useState<number | null>(null);
  const items: AvatarGroupItem[] = moreLabel ? [...people, { initials: moreLabel }] : people;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex -space-x-2" onMouseLeave={() => setActive(null)}>
        {items.map((person, i) => {
          const shift = active === null ? 0 : LIFT * Math.pow(FALLOFF, Math.abs(i - active));
          const more = Boolean(moreLabel) && i === items.length - 1;
          return (
            <div
              key={`${person.initials}-${i}`}
              onMouseEnter={() => setActive(i)}
              className="transition-transform duration-[320ms] will-change-transform motion-reduce:transform-none! motion-reduce:transition-none"
              style={{
                transform: `translateY(${shift.toFixed(3)}px) scale(${active === i ? SCALE : 1})`,
                transitionTimingFunction: active === null ? EASE_OUT : EASE_IN,
              }}
            >
              <Avatar className="size-9 ring-2 ring-background">
                {person.src && <AvatarImage src={person.src} alt={person.name ?? person.initials} />}
                <AvatarFallback
                  className={more ? "bg-primary text-xs font-medium text-primary-foreground" : "bg-secondary text-xs font-medium"}
                >
                  {person.initials}
                </AvatarFallback>
              </Avatar>
            </div>
          );
        })}
      </div>
      {caption && <p className="text-sm text-muted-foreground">{caption}</p>}
    </div>
  );
}

export default function Avatar01() {
  return <AvatarGroup />;
}
```
