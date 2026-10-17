"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, MotionConfig, motion, useInView } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Person = { id: number; initials: string; photo?: string };

const PHOTOS = [12, 32, 47, 5, 68, 15, 44, 25, 59, 9, 36, 21];
const INITIALS = ["MT", "AC", "SL", "JN", "KP", "LH", "RD", "VB", "TN", "EO", "QM", "HP"];

const personAt = (id: number): Person => {
  const i = id % PHOTOS.length;
  return { id, initials: INITIALS[i], photo: `https://i.pravatar.cc/80?img=${PHOTOS[i]}` };
};

const VISIBLE = 5;
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

export default function Waitlist() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { margin: "-40px" });
  const [count, setCount] = useState(180);
  const [people, setPeople] = useState<Person[]>(() =>
    Array.from({ length: VISIBLE }, (_, i) => personAt(VISIBLE - 1 - i)),
  );
  const [joined, setJoined] = useState(false);
  const nextId = useRef(VISIBLE);

  const addPerson = (person: Person) => {
    setPeople((list) => [person, ...list].slice(0, VISIBLE));
    setCount((c) => c + 1);
  };

  // While in view, someone new joins every couple of seconds.
  useEffect(() => {
    if (!inView) return;
    const timer = setInterval(() => {
      const person = personAt(nextId.current++);
      setPeople((list) => [person, ...list].slice(0, VISIBLE));
      setCount((c) => c + 1);
    }, 2200);
    return () => clearInterval(timer);
  }, [inView]);

  return (
    <MotionConfig reducedMotion="user">
      <div ref={ref} className="grid w-full max-w-md gap-4">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (joined) return;
            setJoined(true);
            addPerson({ id: nextId.current++, initials: "You" });
          }}
        >
          <Label htmlFor="waitlist-email" className="sr-only">
            Email
          </Label>
          <Input
            id="waitlist-email"
            type="email"
            required
            placeholder="Enter your email"
            disabled={joined}
            className="h-10 flex-1 border-transparent bg-muted shadow-none dark:bg-muted"
          />
          <Button type="submit" className="h-10 px-5" disabled={joined}>
            {joined ? "You're in" : "Join Waitlist"}
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
            <span className="text-muted-foreground">People joined today</span>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
