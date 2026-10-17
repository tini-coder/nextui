# Empty state (`empty-01`)

Dashed empty state with a skeleton-card illustration, copy and two actions.

- Kind: component, category: Feedback & display
- Live preview: https://nextui.dev/components/empty-01
- Install: `npx shadcn@latest add https://nextui.dev/r/empty-01.json`
- npm dependencies: lucide-react
- shadcn dependencies: button

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/empty-01.tsx`

```tsx
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

export default function Empty01() {
  return (
    <div className="flex w-full max-w-md flex-col items-center rounded-xl border border-dashed px-6 py-10 text-center">
      <div
        aria-hidden
        className="flex w-full justify-center gap-3 overflow-hidden pt-2 [mask-image:linear-gradient(to_right,transparent,black_30%,black_70%,transparent)]"
      >
        <SkeletonCard />
        <SkeletonCard featured />
        <SkeletonCard />
      </div>
      <h3 className="mt-6 font-semibold">No projects yet</h3>
      <p className="mt-1 max-w-64 text-sm text-muted-foreground">
        Create your first project to start inviting your team.
      </p>
      <div className="mt-6 flex gap-2">
        <Button>
          <Plus /> New project
        </Button>
        <Button variant="outline">Import</Button>
      </div>
    </div>
  );
}
```
