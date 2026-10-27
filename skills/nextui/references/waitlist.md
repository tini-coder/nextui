# Waitlist (`waitlist`)

Email signup with a live avatar stack: new people slide in, the last one tucks under a rolling join counter.

- Kind: component, category: Forms & inputs
- Live preview: https://nextui.dev/components/waitlist
- Install: `npm create nextui add waitlist`
- npm dependencies: motion
- shadcn dependencies: input, button, label, avatar

## Usage

```tsx
"use client";

import { Waitlist } from "@/components/nextui/waitlist";

export function LaunchWaitlist({ signups }: { signups: number }) {
  return (
    <Waitlist
      buttonLabel="Get early access"
      joinedLabel="See you soon"
      countLabel="Makers on the list"
      defaultCount={signups}
      simulate={false}
      avatars={[
        { initials: "AN", photo: "/team/an.jpg" },
        { initials: "BL", photo: "/team/bl.jpg" },
        { initials: "CT" },
      ]}
      visibleAvatars={3}
      onSubmit={(email) => fetch("/api/waitlist", { method: "POST", body: JSON.stringify({ email }) })}
    />
  );
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `placeholder` | `string` | `"Enter your email"` | Placeholder text of the email field |
| `buttonLabel` | `ReactNode` | `"Join Waitlist"` | Text of the submit button |
| `joinedLabel` | `ReactNode` | `"You're in"` | Button text after joining |
| `countLabel` | `ReactNode` | `"People joined today"` | Text beside the counter |
| `count` | `number` |  | Controlled count shown in the badge |
| `defaultCount` | `number` | `180` | Starting count when uncontrolled |
| `avatars` | `WaitlistAvatar[]` | `12 sample faces` | Faces for the stack, cycled in order: initials and an optional photo |
| `visibleAvatars` | `number` | `5` | How many avatars stay in the stack |
| `selfInitials` | `string` | `"You"` | Initials of the avatar added when the visitor joins |
| `simulate` | `boolean` | `true` | Add a fake joiner on a timer while in view |
| `interval` | `number` | `2200` | Milliseconds between simulated joiners |
| `id` | `string` | `"waitlist-email"` | Id of the email field |
| `onSubmit` | `(email: string) => void` |  | Called with the email when the form is submitted |
| `className` | `string` |  | Extra classes on the wrapper |

## When to use

- Pre-launch landing pages and early-access sign-ups
- Turn simulate off in production so the counter only shows real joins

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/waitlist.tsx`

```tsx
"use client";

import { useEffect, useEffectEvent, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/** One face in the avatar stack. */
export type WaitlistAvatar = { initials: string; photo?: string };

type Person = WaitlistAvatar & { id: number };

const PHOTOS = [12, 32, 47, 5, 68, 15, 44, 25, 59, 9, 36, 21];
const INITIALS = ["MT", "AC", "SL", "JN", "KP", "LH", "RD", "VB", "TN", "EO", "QM", "HP"];

const AVATARS: WaitlistAvatar[] = PHOTOS.map((photo, i) => ({
  initials: INITIALS[i],
  photo: `https://i.pravatar.cc/80?img=${photo}`,
}));

const EASE = [0.22, 1, 0.36, 1] as const;

/** One digit that rolls up to its new value: the old one leaves upward, the new one rises from below. */
function RollingDigit({ digit }: { digit: string }) {
  return (
    <span className="relative inline-flex h-[1em] w-[0.62em] justify-center overflow-hidden leading-none">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={digit}
          initial={{ y: "100%", opacity: 0, filter: "blur(2px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: "-100%", opacity: 0, filter: "blur(2px)" }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.35 }}
        >
          {digit}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function RollingNumber({ value }: { value: number }) {
  const digits = String(value).split("");
  return (
    <span className="inline-flex tabular-nums" aria-live="polite" aria-label={String(value)}>
      {digits.map((d, i) => (
        // Key by place value so only the digits that change roll.
        <RollingDigit key={digits.length - i} digit={d} />
      ))}
    </span>
  );
}

export type WaitlistProps = {
  placeholder?: string;
  buttonLabel?: React.ReactNode;
  /** Button text after the visitor has joined. */
  joinedLabel?: React.ReactNode;
  /** Text beside the counter. */
  countLabel?: React.ReactNode;
  /** Controlled count shown in the badge. */
  count?: number;
  defaultCount?: number;
  /** Faces used for the stack, cycled in order. */
  avatars?: WaitlistAvatar[];
  /** How many avatars stay in the stack. */
  visibleAvatars?: number;
  /** Initials for the avatar added when the visitor joins. */
  selfInitials?: string;
  /** Add a new joiner every `interval` ms while in view, to show activity. */
  simulate?: boolean;
  interval?: number;
  id?: string;
  /** Called with the email when the form is submitted. */
  onSubmit?: (email: string) => void;
  className?: string;
};

/** An email waitlist form with a live avatar stack and a rolling join counter. */
export function Waitlist({
  placeholder = "Enter your email",
  buttonLabel = "Join Waitlist",
  joinedLabel = "You're in",
  countLabel = "People joined today",
  count: countProp,
  defaultCount = 180,
  avatars = AVATARS,
  visibleAvatars = 5,
  selfInitials = "You",
  simulate = true,
  interval = 2200,
  id = "waitlist-email",
  onSubmit,
  className,
}: WaitlistProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const [innerCount, setCount] = useState(defaultCount);
  const count = countProp ?? innerCount;
  const personAt = (pid: number): Person => ({ id: pid, ...avatars[pid % avatars.length] });
  const [people, setPeople] = useState<Person[]>(() =>
    avatars.length ? Array.from({ length: visibleAvatars }, (_, i) => personAt(visibleAvatars - 1 - i)) : [],
  );
  const [joined, setJoined] = useState(false);
  const nextId = useRef(visibleAvatars);

  const addPerson = (person: Person) => {
    setPeople((list) => [person, ...list].slice(0, visibleAvatars));
    setCount((c) => c + 1);
  };

  const tick = useEffectEvent(() => {
    if (avatars.length) addPerson(personAt(nextId.current++));
  });

  // While in view, someone new joins every couple of seconds.
  useEffect(() => {
    if (!inView || !simulate) return;
    const timer = setInterval(tick, interval);
    return () => clearInterval(timer);
  }, [inView, simulate, interval]);

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} className={cn("grid w-full max-w-md gap-4", className)}>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (joined) return;
            setJoined(true);
            addPerson({ id: nextId.current++, initials: selfInitials });
            onSubmit?.(String(new FormData(e.currentTarget).get("email") ?? ""));
          }}
        >
          <Label htmlFor={id} className="sr-only">
            Email
          </Label>
          <Input
            id={id}
            name="email"
            type="email"
            required
            placeholder={placeholder}
            disabled={joined}
            className="h-10 flex-1 border-transparent bg-muted shadow-none dark:bg-muted"
          />
          <Button type="submit" className="h-10 px-5" disabled={joined}>
            {joined ? joinedLabel : buttonLabel}
          </Button>
        </form>

        <div className="flex items-center gap-2">
          <div className="relative flex items-center pl-2">
            <AnimatePresence mode="popLayout" initial={false}>
              {people.map((p) => (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.6, x: -10, filter: "blur(6px)" }}
                  animate={{ opacity: 1, scale: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 0.8, x: 18, filter: "blur(2px)" }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className="-ml-2"
                >
                  <Avatar className="size-7 ring-2 ring-background">
                    {p.photo && <AvatarImage src={p.photo} alt="" />}
                    <AvatarFallback className="text-[10px] font-medium">{p.initials}</AvatarFallback>
                  </Avatar>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Sits above the stack so the leaving avatar slides in underneath it. */}
          <div className="relative z-10 flex items-center gap-1.5 rounded-full bg-muted py-0.5 pr-3 pl-0.5 text-xs">
            <span className="flex size-7 items-center justify-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground ring-2 ring-background">
              <RollingNumber value={count} />
            </span>
            <span className="text-muted-foreground">{countLabel}</span>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}

export default function WaitlistDemo() {
  return <Waitlist />;
}
```
