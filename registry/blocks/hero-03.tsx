import { ArrowRight, Star } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PEOPLE = ["AN", "JL", "MK", "TP", "RS"];

export default function Hero03() {
  return (
    <section className="bg-background px-6 py-24 sm:py-32">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium text-primary">Private beta · Spring 2027</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          The inbox that writes back for you
        </h1>
        <p className="mx-auto mt-6 max-w-lg text-lg text-pretty text-muted-foreground">
          Drafts replies in your voice, sorts what matters and gets you to zero before lunch.
        </p>
        <form className="mx-auto mt-10 flex max-w-md flex-col gap-2 sm:flex-row">
          <Input type="email" required placeholder="you@company.com" aria-label="Email" className="h-10 flex-1" />
          <Button size="lg" type="submit">
            Join the waitlist <ArrowRight />
          </Button>
        </form>
        <div className="mt-8 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {PEOPLE.map((p) => (
              <Avatar key={p} className="size-8 ring-2 ring-background">
                <AvatarFallback className="text-xs">{p}</AvatarFallback>
              </Avatar>
            ))}
          </div>
          <div className="text-left text-sm">
            <div className="flex text-amber-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="size-3.5 fill-current" />
              ))}
            </div>
            <p className="text-muted-foreground">Loved by 2,400+ early users</p>
          </div>
        </div>
      </div>
    </section>
  );
}
