import { Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type TestimonialItem = {
  quote: string;
  name: string;
  role: string;
  initials: string;
  /** Optional photo; falls back to the initials. */
  avatar?: string;
  /** Filled stars, 5 by default. */
  rating?: number;
};

const QUOTES: TestimonialItem[] = [
  { quote: "We moved our whole roadmap over in an afternoon. The team has not looked back.", name: "Linh Tran", role: "Head of Product, Northwind", initials: "LT" },
  { quote: "The dashboards finally answer the questions our board actually asks.", name: "Marcus Hale", role: "CFO, Brightline", initials: "MH" },
  { quote: "Setup took ten minutes and support replied before I finished my coffee.", name: "Aisha Khan", role: "Founder, Parcel", initials: "AK" },
];

export type TestimonialCardsProps = {
  title?: string;
  testimonials?: TestimonialItem[];
  className?: string;
};

/** Heading over a grid of star-rated testimonial cards. */
export function TestimonialCards({
  title = "Loved by fast-moving teams",
  testimonials = QUOTES,
  className,
}: TestimonialCardsProps) {
  return (
    <section className={cn("bg-muted/40 px-6 py-20 sm:py-28", className)}>
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h2>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((q) => (
            <Card key={q.name}>
              <CardContent className="flex h-full flex-col gap-6">
                <div className="flex gap-0.5 text-primary">
                  {Array.from({ length: q.rating ?? 5 }).map((_, i) => (
                    <Star key={i} className="size-4 fill-current" />
                  ))}
                </div>
                <p className="flex-1 text-pretty">&ldquo;{q.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    {q.avatar && <AvatarImage src={q.avatar} alt={q.name} />}
                    <AvatarFallback className="text-xs">{q.initials}</AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{q.name}</p>
                    <p className="text-muted-foreground">{q.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function Testimonials01() {
  return <TestimonialCards />;
}
