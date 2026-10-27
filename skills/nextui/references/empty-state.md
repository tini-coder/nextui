# Empty state (`empty-state`)

Dashed empty state with a skeleton-card illustration, copy and two actions.

- Kind: component, category: Feedback & display
- Live preview: https://nextui.dev/components/empty-state
- Install: `npm create nextui add empty-state`
- npm dependencies: lucide-react
- shadcn dependencies: button

## Usage

```tsx
"use client";

import { Upload } from "lucide-react";
import { EmptyState } from "@/components/nextui/empty-state";

export function NoFiles() {
  return (
    <EmptyState
      title="No files yet"
      description="Upload a file or drag one here to get started."
      actionLabel="Upload file"
      actionIcon={Upload}
      onAction={() => console.log("upload")}
      secondaryActionLabel={null}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `title` | `ReactNode` | `"No projects yet"` | Heading under the cards |
| `description` | `ReactNode` | `"Create your first project to start inviting your team."` | Supporting text |
| `actionLabel` | `ReactNode \| null` | `"New project"` | Primary button label; null hides it |
| `actionIcon` | `LucideIcon` | `Plus` | Icon before the primary label |
| `onAction` | `() => void` |  | Called when the primary button is clicked |
| `secondaryActionLabel` | `ReactNode \| null` | `"Import"` | Outline button label; null hides it |
| `onSecondaryAction` | `() => void` |  | Called when the outline button is clicked |
| `className` | `string` |  | Extra classes on the container |

## When to use

- Lists, tables or dashboards with nothing to show yet.
- Lead with one clear action that fills the empty space.

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/empty-state.tsx`

```tsx
import type * as React from "react";
import type { LucideIcon } from "lucide-react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function SkeletonCard({ featured = false }: { featured?: boolean }) {
  return (
    <div
      className={cn(
        "w-36 shrink-0 overflow-hidden rounded-lg border bg-card",
        featured
          ? "relative z-10 -translate-y-2 shadow-lg shadow-black/5 dark:shadow-black/40"
          : "opacity-60"
      )}
    >
      <div className="space-y-3 p-3">
        <div className="flex items-center gap-2">
          <span className="size-6 shrink-0 rounded-full bg-muted" />
          <div className="flex-1 space-y-1">
            <span className="block h-1.5 w-1/2 rounded-full bg-muted" />
            <span className="block h-1.5 w-3/4 rounded-full bg-muted" />
          </div>
        </div>
        <div className="space-y-1.5">
          <span className="block h-1.5 w-full rounded-full bg-muted" />
          <span className="block h-1.5 w-4/5 rounded-full bg-muted" />
        </div>
      </div>
      <div className="flex items-center gap-1.5 border-t bg-muted/40 px-3 py-2">
        <span className="h-1.5 flex-1 rounded-full bg-muted" />
        <span className="size-3.5 rounded-sm bg-muted" />
        <span className="size-3.5 rounded-sm bg-muted" />
      </div>
    </div>
  );
}

export type EmptyStateProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  /** Label of the primary button; pass null to hide it. */
  actionLabel?: React.ReactNode | null;
  /** Icon before the primary label. */
  actionIcon?: LucideIcon;
  onAction?: () => void;
  /** Label of the outline button; pass null to hide it. */
  secondaryActionLabel?: React.ReactNode | null;
  onSecondaryAction?: () => void;
  className?: string;
};

/** A dashed empty state with a stack of skeleton cards, a message and call-to-action buttons. */
export function EmptyState({
  title = "No projects yet",
  description = "Create your first project to start inviting your team.",
  actionLabel = "New project",
  actionIcon: ActionIcon = Plus,
  onAction,
  secondaryActionLabel = "Import",
  onSecondaryAction,
  className,
}: EmptyStateProps) {
  return (
    <div className={cn("flex w-full max-w-md flex-col items-center rounded-xl border border-dashed px-6 py-10 text-center", className)}>
      <div
        aria-hidden
        className="flex w-full justify-center gap-3 overflow-hidden pt-2 [mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)]"
      >
        <SkeletonCard />
        <SkeletonCard featured />
        <SkeletonCard />
      </div>
      <h3 className="mt-6 font-semibold">{title}</h3>
      {description && <p className="mt-1 max-w-64 text-sm text-muted-foreground">{description}</p>}
      {(actionLabel || secondaryActionLabel) && (
        <div className="mt-6 flex gap-2">
          {actionLabel && (
            <Button onClick={onAction}>
              <ActionIcon /> {actionLabel}
            </Button>
          )}
          {secondaryActionLabel && (
            <Button variant="outline" onClick={onSecondaryAction}>
              {secondaryActionLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export default function Empty01() {
  return <EmptyState />;
}
```
