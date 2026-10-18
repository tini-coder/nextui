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
