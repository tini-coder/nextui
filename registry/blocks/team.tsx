"use client";

import { useEffect, useRef } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Colours for the illustrated bust shown when a member has no photo. */
export type TeamMemberLook = { skin: string; hair: string; suit: string; long?: boolean; tie?: string };

export type TeamMember = {
  name: string;
  role: string;
  /** A cut-out portrait (transparent PNG/WebP). Without one, an illustrated bust stands in. */
  photo?: string;
  look?: TeamMemberLook;
  /** Link for "View profile"; defaults to "#". */
  profileHref?: string;
  linkedinHref?: string;
  xHref?: string;
  /** Turns the card into the champagne keynote card. */
  featured?: { eyebrow: string; title: string; href?: string };
};

type Look = TeamMemberLook;
type Member = TeamMember;

const DEFAULT_LOOK: Look = { skin: "#e2bc9f", hair: "#2a211c", suit: "#2b2f3a" };

const TEAM: Member[] = [
  { name: "Khoa Le", role: "Co-founder, CEO", look: { skin: "#d9b49a", hair: "#2a211c", suit: "#2b2f3a", tie: "#6b2a35" } },
  { name: "Mai Pham", role: "Co-founder, CTO", look: { skin: "#e6c3a8", hair: "#1d1715", suit: "#3a3530", long: true } },
  { name: "Thu Ha", role: "Staff engineer", look: { skin: "#e2bc9f", hair: "#3b2a22", suit: "#23324a", long: true } },
  {
    name: "Daniel Ortiz",
    role: "Head of Design",
    look: { skin: "#c99a7a", hair: "#211a17", suit: "#1f2430" },
    featured: { eyebrow: "Keynote", title: "Design at scale" },
  },
  { name: "Leo Martin", role: "Customer success", look: { skin: "#edc9ad", hair: "#7a5a3f", suit: "#45403a" } },
  { name: "Priya Shah", role: "Engineering", look: { skin: "#b9876a", hair: "#16110f", suit: "#2c2a33", long: true } },
  { name: "Grace Kim", role: "Operations", look: { skin: "#ecccb3", hair: "#241c18", suit: "#3b4150", long: true } },
];

const EASE = [0.22, 1, 0.36, 1] as const;
const SMOOTH = "ease-[cubic-bezier(0.22,1,0.36,1)]";

// Warm ivory cards and a champagne keynote card; text keeps the site tokens.
const SURFACE = "bg-[#f5f3f0] dark:bg-[#1d1b18]";
const CHAMPAGNE = "bg-[linear-gradient(160deg,#faf3e3_0%,#f0e0bd_55%,#e6cf9f_100%)] text-[#2a2216]";

/** Head-and-shoulders silhouette on a transparent ground, so every card shares one backdrop. */
function Bust({ look, className }: { look: Look; className?: string }) {
  return (
    <svg viewBox="0 0 200 220" aria-hidden className={className}>
      {look.long && <path d="M58 96c-4-46 20-70 42-70s46 24 42 70l6 70H52z" fill={look.hair} />}
      <path d="M86 118h28v40H86z" fill={look.skin} />
      <path d="M86 140c8 8 20 8 28 0v10H86z" fill="#000" opacity=".12" />
      <path d="M8 220c4-48 38-70 92-72 54 2 88 24 92 72z" fill={look.suit} />
      <path d="M76 150l24 52 24-52-24 8z" fill="#f7f4ee" />
      {look.tie && <path d="M96 160h8l4 34-8 10-8-10z" fill={look.tie} />}
      <path d="M76 150l-14 8 30 52 8-8zM124 150l14 8-30 52-8-8z" fill="#000" opacity=".22" />
      <ellipse cx="66" cy="94" rx="6" ry="9" fill={look.skin} />
      <ellipse cx="134" cy="94" rx="6" ry="9" fill={look.skin} />
      <ellipse cx="100" cy="88" rx="34" ry="41" fill={look.skin} />
      <path
        d={look.long ? "M64 92c-2-40 22-56 36-56s40 14 36 56c-6-22-22-32-40-32-12 10-24 18-32 32z" : "M64 88c-2-34 18-50 36-50s40 14 36 50c-4-16-14-26-36-26S68 72 64 88z"}
        fill={look.hair}
      />
    </svg>
  );
}

function Portrait({ person, className }: { person: Member; className?: string }) {
  if (!person.photo) return <Bust look={person.look ?? DEFAULT_LOOK} className={className} />;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={person.photo} alt={person.name} loading="lazy" className={cn("object-contain object-bottom", className)} />;
}

const LinkedIn = () => (
  <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
    <path d="M4.98 3.5a2.5 2.5 0 11-.02 5 2.5 2.5 0 01.02-5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 21 11.2 21 14.4V21h-4v-5.8c0-1.4-.03-3.2-1.95-3.2-1.95 0-2.25 1.5-2.25 3.1V21H9z" />
  </svg>
);
const XMark = () => (
  <svg viewBox="0 0 24 24" className="size-3.5" fill="currentColor" aria-hidden>
    <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78zm-1.08 16.17h1.7L7.4 4.73H5.58z" />
  </svg>
);

// Slides up from the card's bottom edge on hover or keyboard focus.
const REVEAL = cn(
  "transition-[opacity,translate] duration-500",
  SMOOTH,
  "translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100 motion-reduce:translate-y-0",
);

// Every card lifts a little on hover, only when the viewer allows motion.
const LIFT = cn(
  "transition-[translate,box-shadow] duration-500",
  SMOOTH,
  "motion-safe:group-hover:-translate-y-2 group-hover:shadow-[0_24px_48px_-24px_rgb(40_30_10/0.35)]",
);

function PersonCard({ person, index, profileLabel }: { person: Member; index: number; profileLabel: string }) {
  return (
    <article className={cn("relative h-80 overflow-hidden rounded-3xl", SURFACE, LIFT)}>
      <div className="relative z-10 flex items-start justify-between p-5">
        <div>
          <h3 className="text-lg font-semibold tracking-tight">{person.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">{person.role}</p>
        </div>
        <span className="font-mono text-[10px] tabular-nums text-muted-foreground/70">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <Portrait
        person={person}
        className={cn(
          "absolute bottom-0 left-1/2 h-[70%] w-auto -translate-x-1/2 origin-bottom transition-transform duration-700",
          SMOOTH,
          "motion-safe:group-hover:scale-[1.04]",
        )}
      />
      <div
        className={cn(
          "absolute inset-x-3 bottom-3 z-10 flex items-center justify-between rounded-full bg-background/75 py-1.5 pl-4 pr-1.5 shadow-sm ring-1 ring-foreground/5 backdrop-blur-md",
          REVEAL,
        )}
      >
        <a href={person.profileHref ?? "#"} className="inline-flex items-center gap-1 text-xs font-medium hover:underline focus-visible:underline focus-visible:outline-none">
          {profileLabel}
          <ArrowUpRight className="size-3.5" />
        </a>
        <div className="flex gap-1">
          {[
            { label: "LinkedIn", Icon: LinkedIn, href: person.linkedinHref },
            { label: "X", Icon: XMark, href: person.xHref },
          ].map(({ label, Icon, href }) => (
            <a
              key={label}
              href={href ?? "#"}
              aria-label={`${person.name} on ${label}`}
              className="grid size-7 place-items-center rounded-full text-foreground/70 transition-colors hover:bg-foreground hover:text-background focus-visible:bg-foreground focus-visible:text-background focus-visible:outline-none"
            >
              <Icon />
            </a>
          ))}
        </div>
      </div>
    </article>
  );
}

function FeaturedCard({
  person,
  liveLabel,
  watchLabel,
}: {
  person: Member & { featured: NonNullable<Member["featured"]> };
  liveLabel: string;
  watchLabel: string;
}) {
  return (
    <article className={cn("relative h-80 overflow-hidden rounded-3xl", CHAMPAGNE, LIFT)}>
      {/* Diagonal bands that drift on hover. */}
      <div
        aria-hidden
        className={cn(
          "absolute -inset-16 text-[#b8955a] opacity-[0.14] transition-transform duration-[1200ms]",
          SMOOTH,
          "motion-safe:group-hover:translate-x-8 motion-safe:group-hover:-translate-y-8",
        )}
        style={{
          backgroundImage: "repeating-linear-gradient(-45deg, currentColor 0 28px, transparent 28px 64px)",
          maskImage: "linear-gradient(to top left, black 30%, transparent 75%)",
        }}
      />
      <div className="relative p-5">
        <p className="text-[11px] font-medium uppercase tracking-[0.2em] opacity-60">{person.featured.eyebrow}</p>
        <h3 className="mt-2 text-xl font-semibold tracking-tight">{person.featured.title}</h3>
        <p className="mt-3 text-sm font-medium">{person.name}</p>
        <p className="mt-0.5 text-xs opacity-60">{person.role}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-[#2a2216] ring-1 ring-[#2a2216]/10">
          <span className="size-1.5 rounded-full bg-pro motion-safe:animate-pulse" />
          {liveLabel}
        </span>
      </div>
      <div
        className={cn(
          "absolute bottom-4 right-4 size-16 overflow-hidden rounded-full bg-[#fffaf0] ring-4 ring-white/70 transition-transform duration-500",
          SMOOTH,
          "motion-safe:group-hover:scale-110",
        )}
      >
        <Portrait person={person} className="absolute bottom-0 left-1/2 h-[92%] w-auto -translate-x-1/2" />
      </div>
      <a
        href={person.featured.href ?? "#"}
        aria-label={`${watchLabel} ${person.name}'s keynote`}
        className="absolute bottom-4 left-4 inline-flex h-9 items-center gap-2 rounded-full bg-white/80 pl-3 pr-3 text-xs font-medium text-[#2a2216] shadow-sm ring-1 ring-[#2a2216]/10 transition-[padding,background-color] duration-500 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a2216] motion-safe:group-hover:pr-4"
      >
        {watchLabel}
        <ArrowRight className={cn("size-3.5 transition-transform duration-500", SMOOTH, "motion-safe:group-hover:translate-x-0.5")} />
      </a>
    </article>
  );
}

export type TeamCarouselProps = {
  eyebrow?: string;
  title?: string;
  ctaLabel?: string;
  ctaHref?: string;
  /** People in the scrolling row; one with `featured` gets the keynote card. */
  members?: TeamMember[];
  profileLabel?: string;
  watchLabel?: string;
  /** Badge on the featured card. */
  liveLabel?: string;
  className?: string;
};

/** Horizontally scrolling row of team cards with hover reveals and a featured keynote card. */
export function TeamCarousel({
  eyebrow = "Speakers",
  title = "Meet the team",
  ctaLabel = "View all",
  ctaHref = "#",
  members = TEAM,
  profileLabel = "View profile",
  watchLabel = "Watch",
  liveLabel = "Live",
  className,
}: TeamCarouselProps) {
  const reduce = !!useReducedMotion();
  const rowRef = useRef<HTMLUListElement>(null);

  // Start the row centred so cards spill off both edges, featured card in the middle.
  useEffect(() => {
    const row = rowRef.current;
    if (row) row.scrollLeft = (row.scrollWidth - row.clientWidth) / 2;
  }, []);

  const rise = (delay: number) =>
    reduce
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, amount: 0.3 },
          transition: { duration: 0.8, delay, ease: EASE },
        };

  return (
    <section className={cn("overflow-hidden bg-background py-20 sm:py-28", className)}>
      <div className="mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
        <motion.p {...rise(0)} className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </motion.p>
        <motion.h2 {...rise(0.06)} className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {title}
        </motion.h2>
        <motion.a
          {...rise(0.12)}
          href={ctaHref}
          className="mt-6 inline-flex h-9 items-center rounded-full bg-primary px-5 text-sm font-medium text-primary-foreground transition-transform duration-300 motion-safe:hover:scale-105"
        >
          {ctaLabel}
        </motion.a>
      </div>

      {/* The row triggers once as a whole, so cards scrolled off to the side still play in. */}
      <motion.ul
        ref={rowRef}
        initial={reduce ? false : "hidden"}
        whileInView="shown"
        viewport={{ once: true, amount: 0.3 }}
        className="mt-12 flex justify-center-safe snap-x snap-proximity gap-4 overflow-x-auto px-6 pb-12 pt-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {members.map((p, i) => (
          <motion.li
            key={p.name}
            variants={{
              hidden: { opacity: 0, y: 48 },
              shown: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.15 + i * 0.07, ease: EASE } },
            }}
            className={cn("group w-56 shrink-0 snap-center", i % 2 === 0 && "mt-12")}
          >
            {p.featured ? (
              <FeaturedCard person={{ ...p, featured: p.featured }} liveLabel={liveLabel} watchLabel={watchLabel} />
            ) : (
              <PersonCard person={p} index={i} profileLabel={profileLabel} />
            )}
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}

export default function Team01() {
  return <TeamCarousel />;
}
