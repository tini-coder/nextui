import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const PEOPLE = [
  { name: "Minh Tran", role: "Engineering", initials: "MT", status: "online" },
  { name: "Ava Chen", role: "Design", initials: "AC", status: "away" },
  { name: "Sam Lee", role: "Marketing", initials: "SL", status: "offline" },
] as const;

const DOT = { online: "bg-emerald-500", away: "bg-amber-500", offline: "bg-muted-foreground/40" };

export default function Avatar02() {
  return (
    <ul className="w-full max-w-xs divide-y rounded-lg border bg-card">
      {PEOPLE.map((p) => (
        <li key={p.name} className="flex items-center gap-3 p-3">
          <span className="relative">
            <Avatar>
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
