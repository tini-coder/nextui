# QR scan badge (`badge-01`)

A QR code that dissolves into sand, pours into a scan badge and grows back.

- Kind: component, category: Buttons, badges & avatars
- Live preview: https://nextui.dev/components/badge-01
- Install: `npx shadcn@latest add https://nextui.dev/r/badge-01.json`
- npm dependencies: lucide-react
- shadcn dependencies: badge

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/badge-01.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";
import { QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// "https://nextui.dev" as a version 2 QR code (25x25, no quiet zone).
const QR = [
  "1111111010100101101111111",
  "1000001000110000101000001",
  "1011101000101001001011101",
  "1011101010100001101011101",
  "1011101011100011101011101",
  "1000001010101000001000001",
  "1111111010101010101111111",
  "0000000011101101000000000",
  "1000101111100100011111001",
  "1111110000000111100011010",
  "0001101111100001100011100",
  "1111010010111010000110110",
  "1110101000100111011101111",
  "1001000010001001010010010",
  "0000001110111111011111100",
  "0010010111110101110110110",
  "1111111111101101111111100",
  "0000000010000110100010000",
  "1111111010100000101010000",
  "1000001001001010100011111",
  "1011101010110110111111101",
  "1011101000101001011100111",
  "1011101001011110101001010",
  "1000001000010100000111110",
  "1111111010101101001000111",
];

const CELL = 7; // px per QR module
const SUB = 4; // grains per module edge, so a resting module draws as a solid square
const GRAIN = CELL / SUB;
const SIZE = QR.length * CELL;
const HEADROOM = 24; // room above the code for the cloud to billow into

// One loop: QR rests, dissolves into the badge, pauses, then grows back out of it.
const HOLD = 1.8;
const TRAVEL = 1.6;
const EMPTY = 0.5;
const CYCLE = HOLD + TRAVEL + EMPTY + TRAVEL;
const SPREAD = 0.6; // share of the travel window used to stagger rows (top leaves first)

type Grain = { hx: number; hy: number; cx: number; cy: number; ex: number; ey: number; delay: number; accent: boolean };

const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const clamp = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

function buildGrains(): Grain[] {
  const grains: Grain[] = [];
  const last = QR.length - 1;
  QR.forEach((row, r) => {
    for (let c = 0; c < row.length; c++) {
      if (row[c] !== "1") continue;
      for (let i = 0; i < SUB * SUB; i++) {
        const hx = c * CELL + (i % SUB) * GRAIN;
        const hy = r * CELL + Math.floor(i / SUB) * GRAIN;
        grains.push({
          hx,
          hy,
          // The control point billows up and out, which shapes the cloud funnelling into the badge.
          cx: hx + (Math.random() - 0.5) * 160,
          cy: Math.max(hy - 30 - Math.random() * 90, -HEADROOM + 4),
          ex: (Math.random() - 0.5) * 14,
          ey: (Math.random() - 0.5) * 6,
          delay: (r / last) * (SPREAD - 0.1) + Math.random() * 0.1,
          accent: Math.random() < 0.1,
        });
      }
    }
  });
  return grains;
}

export default function Badge01() {
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current!;
    const canvas = canvasRef.current!;
    const badge = badgeRef.current!;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const grains = buildGrains();
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    let W = 0;
    let H = 0;
    let qx = 0; // QR origin and badge centre, in canvas px
    let qy = HEADROOM;
    let bx = 0;
    let by = 0;
    let ink = "#000";
    let accent = "#f00";
    let raf = 0;
    let last = 0;
    let clock = 0;
    let progress = 0; // 0 = QR at rest, 1 = every grain inside the badge
    let visible = false;
    let hovered = false;
    let pulse = 0;

    function readColors() {
      ink = getComputedStyle(canvas).color;
      accent = getComputedStyle(badge).getPropertyValue("--qr-accent").trim() || ink;
    }

    function measure() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = stage.clientWidth;
      H = stage.clientHeight;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      qx = Math.round((W - SIZE) / 2);
      qy = HEADROOM;
      bx = badge.offsetLeft + badge.offsetWidth / 2;
      by = badge.offsetTop + badge.offsetHeight / 2;
    }

    function draw(p: number) {
      ctx!.clearRect(0, 0, W, H);
      let near = 0;
      for (let pass = 0; pass < 2; pass++) {
        ctx!.fillStyle = pass === 0 ? ink : accent;
        for (const g of grains) {
          const t = ease(clamp((p - g.delay) / (1 - SPREAD)));
          if (t >= 1) continue;
          if (t === 0) {
            if (pass === 0) {
              ctx!.globalAlpha = 1;
              // Snap to whole pixels so resting grains tile into solid modules with no seams.
              const x0 = Math.floor(qx + g.hx);
              const y0 = Math.floor(qy + g.hy);
              ctx!.fillRect(x0, y0, Math.ceil(qx + g.hx + GRAIN) - x0, Math.ceil(qy + g.hy + GRAIN) - y0);
            }
            continue;
          }
          if (g.accent !== (pass === 1)) continue;
          const u = 1 - t;
          const x = u * u * (qx + g.hx) + 2 * u * t * (qx + g.cx) + t * t * (bx + g.ex);
          const y = u * u * (qy + g.hy) + 2 * u * t * (qy + g.cy) + t * t * (by + g.ey);
          const s = t < 0.15 ? GRAIN - (GRAIN - 1.1) * (t / 0.15) : 1.1;
          ctx!.globalAlpha = t > 0.8 ? (1 - t) * 5 * 0.8 : 0.8;
          ctx!.fillRect(x, y, s, s);
          if (t > 0.75) near++;
        }
      }
      ctx!.globalAlpha = 1;
      // The badge swells a little while grains pour into (or out of) it.
      const target = Math.min(near / 500, 1);
      pulse += (target - pulse) * 0.2;
      badge.style.transform = pulse > 0.01 ? `scale(${1 + pulse * 0.08})` : "";
    }

    function progressAt(c: number) {
      if (c < HOLD) return 0;
      if (c < HOLD + TRAVEL) return (c - HOLD) / TRAVEL;
      if (c < HOLD + TRAVEL + EMPTY) return 1;
      return 1 - (c - HOLD - TRAVEL - EMPTY) / TRAVEL;
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      if (hovered) {
        // Hovering the badge calls the code back and keeps it up.
        progress = Math.max(0, progress - dt / (TRAVEL * 0.6));
        clock = 0;
      } else {
        if (clock === 0 && progress > 0) {
          progress = Math.max(0, progress - dt / (TRAVEL * 0.6));
        } else {
          clock = (clock + dt) % CYCLE;
          progress = progressAt(clock);
        }
        if (clock < dt) readColors();
      }
      draw(progress);
      raf = requestAnimationFrame(frame);
    }

    function start() {
      if (raf || !visible || reduce.matches) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    function still() {
      stop();
      progress = 0;
      clock = 0;
      pulse = 0;
      readColors();
      draw(0);
    }

    measure();
    readColors();
    draw(0);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(stage);

    const ro = new ResizeObserver(() => {
      measure();
      draw(progress);
    });
    ro.observe(stage);

    // Repaint with the new ink when the site theme flips.
    const mo = new MutationObserver(() => {
      readColors();
      draw(progress);
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });

    const onMotion = () => (reduce.matches ? still() : start());
    reduce.addEventListener("change", onMotion);

    const enter = () => (hovered = true);
    const leave = () => (hovered = false);
    badge.addEventListener("pointerenter", enter);
    badge.addEventListener("pointerleave", leave);
    badge.addEventListener("focusin", enter);
    badge.addEventListener("focusout", leave);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      mo.disconnect();
      reduce.removeEventListener("change", onMotion);
      badge.removeEventListener("pointerenter", enter);
      badge.removeEventListener("pointerleave", leave);
      badge.removeEventListener("focusin", enter);
      badge.removeEventListener("focusout", leave);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      role="img"
      aria-label="QR code for nextui.dev that dissolves into a scan badge and grows back"
      className="relative h-[274px] w-[300px] max-w-full"
    >
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full text-foreground" />
      <div
        ref={badgeRef}
        tabIndex={0}
        className="absolute bottom-0 left-1/2 -ml-[52px] w-[104px] rounded-full outline-none will-change-transform [--qr-accent:var(--primary)] focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        <Badge variant="outline" className="w-full justify-center gap-1.5 bg-background py-1 shadow-sm">
          <QrCode className="text-primary" />
          Scan me
        </Badge>
      </div>
    </div>
  );
}
```
