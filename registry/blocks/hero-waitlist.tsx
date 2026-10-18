"use client";

import type { FormEvent } from "react";
import { ArrowRight, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const PEOPLE = ["AN", "JL", "MK", "TP", "RS"];

export type WaitlistHeroProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  placeholder?: string;
  ctaLabel?: string;
  /** Initials shown in the avatar stack. */
  avatars?: string[];
  /** Number of filled stars next to the avatars. */
  rating?: number;
  socialProof?: string;
  /** Called with the email when the form is submitted; the native submit is prevented when set. */
  onSubmit?: (email: string, event: FormEvent<HTMLFormElement>) => void;
  className?: string;
};

/** Centered waitlist hero with an email form and avatar social proof. */
export function WaitlistHero({
  eyebrow = "Private beta · Spring 2027",
  title = "The inbox that writes back for you",
  description = "Drafts replies in your voice, sorts what matters and gets you to zero before lunch.",
  placeholder = "you@company.com",
  ctaLabel = "Join the waitlist",
  avatars = PEOPLE,
  rating = 5,
  socialProof = "Loved by 2,400+ early users",
  onSubmit,
  className,
}: WaitlistHeroProps) {
  const handleSubmit = onSubmit
    ? (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const email = new FormData(e.currentTarget).get("email");
        onSubmit(typeof email === "string" ? email : "", e);
      }
    : undefined;

  return (
    <section className={cn("bg-background px-6 py-24 sm:py-32", className)}>
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">{eyebrow}</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">{title}</h1>
        <p className="mx-auto mt-6 max-w-lg text-lg text-pretty text-muted-foreground">{description}</p>
        <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-md flex-col gap-2 sm:flex-row">
          <Input
            type="email"
            name="email"
            required
            placeholder={placeholder}
            aria-label="Email"
            className="h-10 flex-1"
          />
          <Button size="lg" type="submit">
            {ctaLabel} <ArrowRight />
          </Button>
        </form>
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {avatars.map((p) => (
              <Avatar key={p} className="size-8 ring-2 ring-background">
                <AvatarFallback className="text-xs">{p}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="text-left text-sm">
            <div className="flex text-amber-500">
              {Array.from({ length: rating }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </div>
            <p className="text-muted-foreground">{socialProof}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Hero03() {
  return <WaitlistHero />;
}
