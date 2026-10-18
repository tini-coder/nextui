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
