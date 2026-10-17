import { cn } from "@/lib/utils";

// Each sheet tucks into the folder at rest and fans up and out on hover; the delay staggers them.
const SHEETS = [
  {
    content: <Moodboard />,
    className: "z-10 h-24 w-32 -translate-x-[62%] rotate-[-4deg] group-hover:-translate-x-[86%] group-hover:-translate-y-16 group-hover:rotate-[-14deg]",
    delay: "group-hover:delay-75",
  },
  {
    content: <Analytics />,
    className: "z-10 h-24 w-32 -translate-x-[38%] rotate-[4deg] group-hover:-translate-x-[14%] group-hover:-translate-y-14 group-hover:rotate-[12deg]",
    delay: "group-hover:delay-100",
  },
  {
    content: <DocumentFile />,
    className: "z-20 h-28 w-[5.25rem] rounded-md -translate-x-1/2 translate-y-4 group-hover:-translate-y-[3.75rem] group-hover:-rotate-2",
    delay: "group-hover:delay-0",
  },
];

export default function Card03() {
  return (
    <div className="group w-full max-w-xs">
      <div aria-hidden className="relative flex h-[17rem] items-end justify-center pb-6">
        <div className="relative h-44 w-52 [perspective:700px]">
          {/* Back panel with its tab */}
          <div className="absolute top-0 left-0 h-7 w-20 rounded-t-xl bg-zinc-300 [clip-path:polygon(0_0,72%_0,100%_100%,0_100%)] dark:bg-zinc-700" />
          <div className="absolute inset-x-0 top-5 bottom-0 rounded-2xl rounded-tl-none bg-gradient-to-b from-zinc-300 to-zinc-200 dark:from-zinc-700 dark:to-zinc-800" />

          {SHEETS.map((sheet, i) => (
            <div
              key={i}
              className={cn(
                "absolute bottom-14 left-1/2 overflow-hidden rounded-lg shadow-md ring-1 ring-black/5",
                "transition-transform duration-500 ease-[cubic-bezier(0.34,1.45,0.64,1)] motion-reduce:transition-none",
                sheet.className,
                sheet.delay,
              )}
            >
              {sheet.content}
            </div>
          ))}

          {/* Front panel tips toward the viewer as the folder opens */}
          <div
            className={cn(
              "absolute inset-x-0 bottom-0 z-30 h-[74%] origin-bottom rounded-2xl",
              "bg-gradient-to-b from-zinc-50/85 to-zinc-200/90 shadow-[0_-1px_0_rgb(255_255_255/0.9)_inset,0_12px_24px_-12px_rgb(0_0_0/0.25)] backdrop-blur-md",
              "dark:from-zinc-600/80 dark:to-zinc-800/90 dark:shadow-[0_-1px_0_rgb(255_255_255/0.12)_inset,0_12px_24px_-12px_rgb(0_0_0/0.6)]",
              "transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:[transform:rotateX(-38deg)] motion-reduce:transition-none",
            )}
          >
            <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white to-transparent dark:via-white/30" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Moodboard() {
  return (
    <div className="grid size-full grid-cols-3 grid-rows-2 gap-1 bg-amber-100 p-1.5">
      <div className="col-span-2 row-span-2 flex items-end rounded bg-gradient-to-br from-orange-400 to-rose-500 p-1.5">
        <div className="size-5 rounded-full bg-yellow-200/90" />
      </div>
      <div className="rounded bg-sky-400" />
      <div className="rounded bg-lime-400" />
    </div>
  );
}

function Analytics() {
  return (
    <div className="flex size-full flex-col gap-1.5 bg-stone-50 p-2">
      <div className="h-1.5 w-10 rounded-full bg-stone-300" />
      <div className="flex flex-1 items-end gap-1">
        {[40, 65, 50, 85, 70, 95].map((h, i) => (
          <div key={i} className="flex-1 rounded-sm bg-emerald-500/80" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

function DocumentFile() {
  return (
    <div className="relative flex size-full flex-col gap-1.5 bg-white p-2.5 pt-3 [clip-path:polygon(0_0,calc(100%-1.25rem)_0,100%_1.25rem,100%_100%,0_100%)]">
      {/* Folded corner */}
      <div className="absolute top-0 right-0 size-5 rounded-bl-md bg-zinc-200 shadow-[-1px_1px_2px_rgb(0_0_0/0.12)]" />
      <div className="mb-0.5 h-1.5 w-9 rounded-full bg-indigo-500" />
      <div className="h-1 w-full rounded-full bg-zinc-200" />
      <div className="h-1 w-full rounded-full bg-zinc-200" />
      <div className="h-1 w-10 rounded-full bg-zinc-200" />
      <div className="mt-1 h-1 w-full rounded-full bg-zinc-200" />
      <div className="h-1 w-8 rounded-full bg-zinc-200" />
      <div className="mt-auto self-start rounded bg-indigo-50 px-1 py-0.5 text-[7px] leading-none font-semibold text-indigo-600">
        PDF
      </div>
    </div>
  );
}
