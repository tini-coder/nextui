import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

const POINTS = ["Drag-and-drop pipelines", "Automatic follow-ups", "Deal health scores", "Forecasts that update live"];

export default function Features03() {
  return (
    <section className="bg-background px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="text-sm font-medium text-primary">Sales pipeline</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">See every deal at a glance</h2>
          <p className="mt-4 text-muted-foreground">
            Move deals between stages, spot the ones going cold and know exactly where the quarter will land.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2">
            {POINTS.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm">
                <span className="grid size-5 place-items-center rounded-full bg-primary/10 text-primary">
                  <Check className="size-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <Button className="mt-8">Explore pipelines</Button>
        </div>
        <div className="grid grid-cols-3 gap-3 rounded-xl border bg-muted/40 p-4">
          {[
            { stage: "Lead", deals: ["Acme Co", "Globex"] },
            { stage: "Proposal", deals: ["Initech", "Umbrella", "Hooli"] },
            { stage: "Won", deals: ["Stark Ind."] },
          ].map((col) => (
            <div key={col.stage} className="space-y-2">
              <p className="text-xs font-medium text-muted-foreground">{col.stage}</p>
              {col.deals.map((d, i) => (
                <div key={d} className="rounded-lg border bg-card p-3 shadow-xs">
                  <p className="text-sm font-medium">{d}</p>
                  <p className="text-xs text-muted-foreground">${(i + 2) * 4},000</p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
