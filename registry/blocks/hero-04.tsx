"use client";

import { useEffect, useRef, type RefObject } from "react";
import {
  ArrowUp,
  BookOpen,
  CalendarDays,
  ChartPie,
  ChevronDown,
  Layers,
  Mic,
  Paperclip,
  Sparkles,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// Questions the chatbox placeholder types out, one after another.
const PROMPTS = [
  "Which 3 features are most requested by our customers?",
  "What was our revenue in Q4 last year?",
  "Summarise the attendance notes from this week's meetings",
  "Which deals are likely to close before the end of the month?",
];

// Three dashed orbits; social chips ride the outer two at fixed angles so the
// innermost stays clear of the headline.
const RINGS = [
  { size: 440, duration: 70, reverse: false },
  { size: 720, duration: 110, reverse: true },
  { size: 1000, duration: 150, reverse: false },
];

// Social brand glyphs from Simple Icons (24×24, one path each).
const APPS: { ring: number; angle: number; path: string; label: string }[] = [
  {
    ring: 1,
    angle: 115,
    label: "X",
    path: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z",
  },
  {
    ring: 1,
    angle: 295,
    label: "Facebook",
    path: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  },
  {
    ring: 1,
    angle: 70,
    label: "Instagram",
    path: "M7.0301.084c-1.2768.0602-2.1487.264-2.911.5634-.7888.3075-1.4575.72-2.1228 1.3877-.6652.6677-1.075 1.3368-1.3802 2.127-.2954.7638-.4956 1.6365-.552 2.914-.0564 1.2775-.0689 1.6882-.0626 4.947.0062 3.2586.0206 3.6671.0825 4.9473.061 1.2765.264 2.1482.5635 2.9107.308.7889.72 1.4573 1.388 2.1228.6679.6655 1.3365 1.0743 2.1285 1.38.7632.295 1.6361.4961 2.9134.552 1.2773.056 1.6884.069 4.9462.0627 3.2578-.0062 3.668-.0207 4.9478-.0814 1.28-.0607 2.147-.2652 2.9098-.5633.7889-.3086 1.4578-.72 2.1228-1.3881.665-.6682 1.0745-1.3378 1.3795-2.1284.2957-.7632.4966-1.636.552-2.9124.056-1.2809.0692-1.6898.063-4.948-.0063-3.2583-.021-3.6668-.0817-4.9465-.0607-1.2797-.264-2.1487-.5633-2.9117-.3084-.7889-.72-1.4568-1.3876-2.1228C21.2982 1.33 20.628.9208 19.8378.6165 19.074.321 18.2017.1197 16.9244.0645 15.6471.0093 15.236-.005 11.977.0014 8.718.0076 8.31.0215 7.0301.0839m.1402 21.6932c-1.17-.0509-1.8053-.2453-2.2287-.408-.5606-.216-.96-.4771-1.3819-.895-.422-.4178-.6811-.8186-.9-1.378-.1644-.4234-.3624-1.058-.4171-2.228-.0595-1.2645-.072-1.6442-.079-4.848-.007-3.2037.0053-3.583.0607-4.848.05-1.169.2456-1.805.408-2.2282.216-.5613.4762-.96.895-1.3816.4188-.4217.8184-.6814 1.3783-.9003.423-.1651 1.0575-.3614 2.227-.4171 1.2655-.06 1.6447-.072 4.848-.079 3.2033-.007 3.5835.005 4.8495.0608 1.169.0508 1.8053.2445 2.228.408.5608.216.96.4754 1.3816.895.4217.4194.6816.8176.9005 1.3787.1653.4217.3617 1.056.4169 2.2263.0602 1.2655.0739 1.645.0796 4.848.0058 3.203-.0055 3.5834-.061 4.848-.051 1.17-.245 1.8055-.408 2.2294-.216.5604-.4763.96-.8954 1.3814-.419.4215-.8181.6811-1.3783.9-.4224.1649-1.0577.3617-2.2262.4174-1.2656.0595-1.6448.072-4.8493.079-3.2045.007-3.5825-.006-4.848-.0608M16.953 5.5864A1.44 1.44 0 1 0 18.39 4.144a1.44 1.44 0 0 0-1.437 1.4424M5.8385 12.012c.0067 3.4032 2.7706 6.1557 6.173 6.1493 3.4026-.0065 6.157-2.7701 6.1506-6.1733-.0065-3.4032-2.771-6.1565-6.174-6.1498-3.403.0067-6.156 2.771-6.1496 6.1738M8 12.0077a4 4 0 1 1 4.008 3.9921A3.9996 3.9996 0 0 1 8 12.0077",
  },
  {
    ring: 1,
    angle: 160,
    label: "LinkedIn",
    path: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  },
  {
    ring: 1,
    angle: 250,
    label: "YouTube",
    path: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  },
  {
    ring: 1,
    angle: 335,
    label: "GitHub",
    path: "M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12",
  },
  {
    ring: 2,
    angle: 10,
    label: "TikTok",
    path: "M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z",
  },
  {
    ring: 2,
    angle: 100,
    label: "Discord",
    path: "M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z",
  },
  {
    ring: 2,
    angle: 145,
    label: "Reddit",
    path: "M12 0C5.373 0 0 5.373 0 12c0 3.314 1.343 6.314 3.515 8.485l-2.286 2.286C.775 23.225 1.097 24 1.738 24H12c6.627 0 12-5.373 12-12S18.627 0 12 0Zm4.388 3.199c1.104 0 1.999.895 1.999 1.999 0 1.105-.895 2-1.999 2-.946 0-1.739-.657-1.947-1.539v.002c-1.147.162-2.032 1.15-2.032 2.341v.007c1.776.067 3.4.567 4.686 1.363.473-.363 1.064-.58 1.707-.58 1.547 0 2.802 1.254 2.802 2.802 0 1.117-.655 2.081-1.601 2.531-.088 3.256-3.637 5.876-7.997 5.876-4.361 0-7.905-2.617-7.998-5.87-.954-.447-1.614-1.415-1.614-2.538 0-1.548 1.255-2.802 2.803-2.802.645 0 1.239.218 1.712.585 1.275-.79 2.881-1.291 4.64-1.365v-.01c0-1.663 1.263-3.034 2.88-3.207.188-.911.993-1.595 1.959-1.595Zm-8.085 8.376c-.784 0-1.459.78-1.506 1.797-.047 1.016.64 1.429 1.426 1.429.786 0 1.371-.369 1.418-1.385.047-1.017-.553-1.841-1.338-1.841Zm7.406 0c-.786 0-1.385.824-1.338 1.841.047 1.017.634 1.385 1.418 1.385.785 0 1.473-.413 1.426-1.429-.046-1.017-.721-1.797-1.506-1.797Zm-3.703 4.013c-.974 0-1.907.048-2.77.135-.147.015-.241.168-.183.305.483 1.154 1.622 1.964 2.953 1.964 1.33 0 2.47-.81 2.953-1.964.057-.137-.037-.29-.184-.305-.863-.087-1.795-.135-2.769-.135Z",
  },
  {
    ring: 2,
    angle: 215,
    label: "Pinterest",
    path: "M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z",
  },
  {
    ring: 2,
    angle: 290,
    label: "Threads",
    path: "M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z",
  },
  {
    ring: 2,
    angle: 320,
    label: "Telegram",
    path: "M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z",
  },
];

const SUGGESTIONS = [
  { icon: ChartPie, label: "Revenue report" },
  { icon: Users, label: "Churn risks" },
  { icon: BookOpen, label: "Meeting recap" },
];

const TYPE = 38; // ms per typed character
const ERASE = 16; // ms per erased character
const HOLD = 2000; // ms a finished prompt stays before erasing

/**
 * Starts the orbits and the typewriter only while the hero is on screen and
 * the tab is visible. Orbits are CSS transforms toggled by a data attribute;
 * the typewriter writes textContent directly, so nothing re-renders React.
 */
function useHeroMotion(root: RefObject<HTMLElement | null>, text: RefObject<HTMLSpanElement | null>) {
  useEffect(() => {
    const el = root.current;
    const out = text.current;
    if (!el || !out || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let prompt = 0;
    let chars = PROMPTS[0].length;
    let erasing = true;
    let timer = 0;
    let onScreen = false;
    let running = false;

    const step = () => {
      const full = PROMPTS[prompt];
      let wait = erasing ? ERASE : TYPE;
      if (erasing && --chars <= 0) {
        erasing = false;
        prompt = (prompt + 1) % PROMPTS.length;
      } else if (!erasing && ++chars >= full.length) {
        erasing = true;
        wait = HOLD;
      }
      out.textContent = PROMPTS[prompt].slice(0, Math.max(chars, 0)) || "\u200b";
      timer = window.setTimeout(step, wait);
    };

    const sync = () => {
      const run = onScreen && !document.hidden;
      if (run === running) return;
      running = run;
      if (run) {
        el.dataset.run = "";
        timer = window.setTimeout(step, HOLD);
      } else {
        delete el.dataset.run;
        window.clearTimeout(timer);
      }
    };

    const io = new IntersectionObserver(([entry]) => {
      onScreen = entry.isIntersecting;
      sync();
    });
    io.observe(el);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      window.clearTimeout(timer);
    };
  }, [root, text]);
}

// Every animation reads its play state from --play, which flips to running
// only while the section carries data-run (on screen, tab visible).
const PLAY = { animationPlayState: "var(--play)" } as const;

export default function Hero04() {
  const ref = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  useHeroMotion(ref, textRef);

  return (
    <section
      ref={ref}
      className="relative isolate [--play:paused] data-[run]:[--play:running] overflow-hidden bg-background px-6 pt-24 pb-20 sm:pt-28 sm:pb-24"
    >
      {/* Orbits */}
      <div aria-hidden className="pointer-events-none absolute top-[46%] left-1/2 -z-10 size-0">
        <div className="absolute top-1/2 left-1/2 size-[640px] -translate-1/2 rounded-full bg-primary/[0.06] blur-3xl" />
        {RINGS.map((ring, r) => (
          <div
            key={r}
            className="absolute top-1/2 left-1/2 -translate-1/2 animate-spin motion-reduce:animate-none"
            style={{
              ...PLAY,
              width: ring.size,
              height: ring.size,
              animationDuration: `${ring.duration}s`,
              animationDirection: ring.reverse ? "reverse" : "normal",
            }}
          >
            <div className="absolute inset-0 rounded-full border border-dashed border-foreground/[0.12]" />
            {APPS.filter((a) => a.ring === r).map((app) => (
              <div
                key={app.label}
                className="absolute top-1/2 left-1/2 size-0"
                style={{ transform: `rotate(${app.angle}deg) translateY(${-ring.size / 2}px)` }}
              >
                {/* Undo the placement angle, then counter-spin so the chip stays upright. */}
                <div style={{ transform: `rotate(${-app.angle}deg)` }}>
                  <div
                    className="size-10 -translate-1/2 animate-spin motion-reduce:animate-none"
                    style={{
                      ...PLAY,
                      animationDuration: `${ring.duration}s`,
                      animationDirection: ring.reverse ? "normal" : "reverse",
                    }}
                  >
                    <div className="flex size-full items-center justify-center rounded-full border border-border/80 bg-background shadow-sm">
                      <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="size-4 text-foreground/70"
                      >
                        <path d={app.path} />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        <div className="absolute top-1/2 left-1/2 size-[1200px] -translate-1/2 bg-[radial-gradient(closest-side,transparent_55%,var(--background)_100%)]" />
      </div>

      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
          <span className="relative flex size-1.5">
            <span
              style={PLAY}
              className="absolute inset-0 animate-ping rounded-full bg-primary/60 motion-reduce:animate-none"
            />
            <span className="relative size-1.5 rounded-full bg-primary" />
          </span>
          40+ live connectors
        </span>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-balance sm:text-7xl sm:leading-[0.95]">
          AI that works with your data
        </h1>
        <p className="mt-5 font-mono text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
          Connect apps, documents and databases
        </p>

        {/* Chatbox */}
        <form
          onSubmit={(e) => e.preventDefault()}
          className="relative mt-10 w-full max-w-xl rounded-[1.25rem] bg-gradient-to-b from-border to-border/40 p-px text-left shadow-[0_24px_60px_-24px_rgb(0_0_0/0.25)] transition-shadow focus-within:shadow-[0_24px_60px_-24px_rgb(0_0_0/0.25),0_0_0_4px_color-mix(in_oklab,var(--primary)_14%,transparent)]"
        >
          <div className="rounded-[calc(1.25rem-1px)] bg-background">
            <label className="relative block px-4 pt-4">
              <span className="sr-only">Ask a question</span>
              <textarea
                rows={2}
                placeholder=" "
                className="peer relative z-10 block w-full resize-none bg-transparent text-[15px] leading-relaxed outline-none"
              />
              {/* Typed placeholder, hidden as soon as the user starts typing. */}
              <span
                aria-hidden
                className="pointer-events-none absolute inset-x-4 top-4 text-[15px] leading-relaxed text-muted-foreground peer-[:not(:placeholder-shown)]:opacity-0"
              >
                <span ref={textRef}>{PROMPTS[0]}</span>
                <span
                  style={PLAY}
                  className="ml-px inline-block h-[1.1em] w-px translate-y-[0.2em] animate-pulse bg-foreground/60 motion-reduce:animate-none"
                />
              </span>
            </label>

            <div className="flex items-center gap-1.5 px-3 pt-2 pb-3">
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 text-xs font-medium text-foreground/80 transition-colors hover:bg-muted"
              >
                <Layers className="size-3.5" />
                All sources
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>
              <button
                type="button"
                aria-label="Attach file"
                className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Paperclip className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Voice input"
                className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <Mic className="size-4" />
              </button>
              <span className="ml-auto hidden items-center gap-1 text-[11px] text-muted-foreground sm:inline-flex">
                <Sparkles className="size-3 text-primary" />
                Answers cite their sources
              </span>
              <Button type="submit" size="icon" aria-label="Ask" className="ml-auto size-8 rounded-full sm:ml-2">
                <ArrowUp />
              </Button>
            </div>
          </div>
        </form>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s.label}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
            >
              <s.icon className="size-3.5" />
              {s.label}
            </button>
          ))}
        </div>

        <div className="mt-14 grid w-full max-w-md grid-cols-2 gap-6 text-sm">
          <div className="flex flex-col items-center gap-2">
            <Zap className="size-5 text-primary" strokeWidth={1.8} />
            <p className="text-balance text-foreground/80">Instant, live connectors. No training or uploads.</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <CalendarDays className="size-5 text-primary" strokeWidth={1.8} />
            <p className="text-balance text-foreground/80">Try free for 14 days, no obligations.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
