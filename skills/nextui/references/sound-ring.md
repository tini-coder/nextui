# Sound ring (`sound-ring`)

A ring of rounded bars that jumps like an audio visualizer, each beat lifting a cluster of bars into a peak.

- Kind: motion, category: Effects
- Live preview: https://nextui.dev/motion/sound-ring
- Install: `npx shadcn@latest add https://nextui.dev/r/sound-ring.json`

## Usage

```tsx
import { SoundRing } from "@/components/nextui/sound-ring";

export function Listening() {
  return <SoundRing size={240} className="text-muted-foreground" />;
}
```

## Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `size` | `number` | `280` | Width and height of the ring, in px |
| `bars` | `number` | `96` | Number of bars around the ring |
| `intensity` | `number` | `1` | How often and how hard it pulses; 1 is the default |
| `label` | `string` | `"Animated sound ring"` | Description read by screen readers |
| `className` | `string` |  | Extra class on the canvas; a text color class sets the bar color |

## When to use

- A voice or audio indicator, like an AI assistant that is listening or speaking
- Around a play button or an avatar in a podcast or music player

## When not to use

- As a real level meter: the beats are made up, not read from audio
- Several on one screen: each one draws its own canvas every frame

## Accessibility

- The canvas is an image with a label, so screen readers announce it once
- With reduced motion it draws one still frame and stops
- It pauses while scrolled out of view, and follows the theme because it draws in the text color

## Source

Prefer the install command; it also pulls the shadcn dependencies. The source is here for reading and for projects without network access.

`components/nextui/sound-ring.tsx`

```tsx
"use client";

import { useEffect, useRef } from "react";

type SoundRingProps = {
  /** Width and height of the ring, in px */
  size?: number;
  /** Number of bars around the ring */
  bars?: number;
  /** How often and how hard it pulses; 1 is the default */
  intensity?: number;
  /** Description read by screen readers */
  label?: string;
  className?: string;
};

type Hit = { angle: number; width: number; strength: number; born: number };

const ATTACK = 0.06; // s for a beat to reach its peak
const DECAY = 0.32; // s for a beat to fade to about a third

/**
 * A ring of short rounded bars that jumps like an audio visualizer: each beat
 * lifts a cluster of bars into a peak that settles back into the ring.
 * The bars take the text color, so any `text-*` class restyles it.
 */
export function SoundRing({ size = 280, bars = 96, intensity = 1, label = "Animated sound ring", className }: SoundRingProps) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const c = size / 2;
    const R = size * 0.37;
    const barWidth = Math.max(2, ((Math.PI * 2 * R) / bars) * 0.5);
    const base = size * 0.012;
    const reach = size * 0.13;
    const levels = new Float32Array(bars);

    // Beats: each one lifts a cluster of bars, then fades.
    let hits: Hit[] = [];
    let nextHit = 0;
    const spawn = (t: number) => {
      const loud = Math.random() < 0.35;
      hits.push({
        angle: Math.random() * Math.PI * 2,
        width: 0.1 + Math.random() * 0.18,
        strength: (loud ? 0.75 + Math.random() * 0.25 : 0.25 + Math.random() * 0.4) * intensity,
        born: t,
      });
      nextHit = t + (Math.random() < 0.15 ? 0.3 + Math.random() * 0.3 : 0.04 + Math.random() * 0.1) / intensity;
    };
    const envelope = (age: number) => (age < ATTACK ? age / ATTACK : Math.exp(-(age - ATTACK) / DECAY));

    const target = (a: number, t: number) => {
      let sum = 0;
      for (const h of hits) {
        let d = a - h.angle;
        d = Math.atan2(Math.sin(d), Math.cos(d));
        if (Math.abs(d) > h.width * 3) continue;
        sum += h.strength * envelope(t - h.born) * Math.exp(-(d * d) / (h.width * h.width * 0.5));
      }
      return Math.min(1, sum);
    };

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const draw = (t: number, smooth: boolean) => {
      hits = hits.filter((h) => t - h.born < ATTACK + DECAY * 5);
      for (let i = 0; i < bars; i++) {
        const want = target((i / bars) * Math.PI * 2 - Math.PI / 2, t);
        // Bars jump up fast and fall back a little slower, like a level meter.
        levels[i] = smooth ? levels[i] + (want - levels[i]) * (want > levels[i] ? 0.55 : 0.18) : want;
      }

      ctx.clearRect(0, 0, size, size);
      ctx.strokeStyle = getComputedStyle(canvas).color;
      ctx.lineWidth = barWidth;
      ctx.lineCap = "round";
      ctx.beginPath();
      for (let i = 0; i < bars; i++) {
        const a = (i / bars) * Math.PI * 2 - Math.PI / 2;
        const len = levels[i] * reach;
        // Peaks grow mostly outward, a little inward.
        const r0 = R - base / 2 - len * 0.25;
        const r1 = R + base / 2 + len * 0.75;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        ctx.moveTo(c + cos * r0, c + sin * r0);
        ctx.lineTo(c + cos * r1, c + sin * r1);
      }
      ctx.stroke();
    };

    let frame = 0;
    let visible = true;
    let last = performance.now();
    let time = 0;

    const loop = (now: number) => {
      time += Math.min(now - last, 50) / 1000;
      last = now;
      while (time >= nextHit) spawn(nextHit || time);
      draw(time, true);
      frame = requestAnimationFrame(loop);
    };
    const still = () => {
      // Reduced motion: one still frame with two soft peaks, no jumping.
      hits = [
        { angle: -0.6, width: 0.25, strength: 0.7, born: time - ATTACK },
        { angle: 2.2, width: 0.2, strength: 0.45, born: time - ATTACK },
      ];
      draw(time, false);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (reduce.matches) return still();
      if (!visible) return;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      start();
    });
    io.observe(canvas);
    reduce.addEventListener("change", start);
    // Redraw the still frame when the theme changes the color.
    const mo = new MutationObserver(() => reduce.matches && still());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style", "data-theme"] });
    start();

    return () => {
      cancelAnimationFrame(frame);
      io.disconnect();
      mo.disconnect();
      reduce.removeEventListener("change", start);
    };
  }, [size, bars, intensity]);

  return <canvas ref={ref} role="img" aria-label={label} className={className} style={{ width: size, height: size }} />;
}
```
