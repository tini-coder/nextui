---
name: nextui
description: Install and use nextui agent UI components, blocks and pages (React + Tailwind, shadcn registry) in a project. Use when building UI such as agent chats, AI chat inputs, voice assistants, forms, cards, badges, hero sections, pricing, testimonials, or animated effects, or when the user mentions nextui.
---

# nextui

nextui is a library of agent UI components for React & Tailwind: chat streaming, artifacts and agent workflows, plus the blocks and pages around them. Items install through the `@nextui` shadcn registry into `components/nextui/` and are then owned by the project.

## How to use this skill

1. Pick the item that fits from the tables below and read its reference file.
2. If the project has no `NEXTUI_TOKEN` in `.env.local` or no `@nextui` entry in `components.json`, ask the user to run `npm create nextui` once: it signs in through the browser, saves the key, adds the registry (running `npx shadcn@latest init` if needed) and can connect MCP. Setup for a new app: https://nextui.dev/docs/new-project.
3. Install the item with `npm create nextui add <name>` (or `npx shadcn@latest add @nextui/<name>`). Free accounts get 3 copies or installs a day; if the registry answers with a limit error, tell the user (Builder removes the limit: https://nextui.dev/pricing).
4. Import it from `@/components/nextui/<name>` and adapt copy, data and layout to the page. Keep the motion and accessibility details as they are.

## Items with source in this repo

### Components

| Name | Title | What it is | Reference |
| --- | --- | --- | --- |
| `thinking-ring` | Thinking ring | Thinking indicator: a wobbling dot ring and a shimmering label. | [references/thinking-ring.md](references/thinking-ring.md) |
| `thinking-sparkle` | Thinking sparkle | AI thinking status with a monochrome sparkling diamond and shimmering text. | [references/thinking-sparkle.md](references/thinking-sparkle.md) |
| `thinking-bot` | Thinking bot | AI thinking status with a sleek android helmet whose visor bars bounce like a voice meter beside shimmering text. | [references/thinking-bot.md](references/thinking-bot.md) |
| `prompt-deck` | Prompt deck | A stack of prompt cards that swipes the front card away and lifts the next one into place, on a loop while it is on screen. | [references/prompt-deck.md](references/prompt-deck.md) |
| `labeled-input` | Labeled input | Email input with a label and helper text. | [references/labeled-input.md](references/labeled-input.md) |
| `subscribe-input` | Subscribe input | Newsletter-style input with a leading icon and submit button. | [references/subscribe-input.md](references/subscribe-input.md) |
| `settings-list` | Settings list | Notification settings list with switches. | [references/settings-list.md](references/settings-list.md) |
| `password-input` | Password input | Password input with show/hide toggle and a live strength checklist. | [references/password-input.md](references/password-input.md) |
| `otp-input` | OTP input | Six-digit OTP input with paste, backspace and arrow-key support. | [references/otp-input.md](references/otp-input.md) |
| `waitlist` | Waitlist | Email signup with a live avatar stack: new people slide in, the last one tucks under a rolling join counter. | [references/waitlist.md](references/waitlist.md) |
| `folder-card` | Folder card | Folder that opens on hover and fans out the files inside. | [references/folder-card.md](references/folder-card.md) |
| `pdf-stack` | PDF stack | A file card with paper sheets and tilted profile cards behind it that rise in on enter and fan out on hover. | [references/pdf-stack.md](references/pdf-stack.md) |
| `waitlist-pass` | Waitlist pass | Ticket-style waitlist pass with notched edges, a QR code stub and a tilt-and-glare hover. | [references/waitlist-pass.md](references/waitlist-pass.md) |
| `icon-buttons` | Icon buttons | Secondary, outline and destructive buttons with soft status buttons and animated icons, popping in as one group. | [references/icon-buttons.md](references/icon-buttons.md) |
| `qr-badge` | QR badge | A QR code that dissolves into sand, pours into a scan badge and grows back. | [references/qr-badge.md](references/qr-badge.md) |
| `avatar-group` | Avatar group | Stacked avatars with an overflow count. | [references/avatar-group.md](references/avatar-group.md) |
| `price-badge` | Price badge | Pill badge that rolls between prices glyph by glyph, resizing smoothly as it goes. | [references/price-badge.md](references/price-badge.md) |
| `avatar-status` | Avatar status | Team list with online, away and offline status dots. | [references/avatar-status.md](references/avatar-status.md) |
| `alerts` | Alerts | Info, success, warning and error alerts with dismiss buttons. | [references/alerts.md](references/alerts.md) |
| `faq` | FAQ | Accessible accordion built on details and summary. | [references/faq.md](references/faq.md) |
| `shortcuts` | Shortcuts | Shortcut list with styled key caps. | [references/shortcuts.md](references/shortcuts.md) |
| `empty-state` | Empty state | Dashed empty state with a skeleton-card illustration, copy and two actions. | [references/empty-state.md](references/empty-state.md) |

### Blocks

| Name | Title | What it is | Reference |
| --- | --- | --- | --- |
| `hero-grid` | Grid hero | Centered hero on a square grid where integration icons blink in and out, paused while off screen. | [references/hero-grid.md](references/hero-grid.md) |
| `hero-waitlist` | Waitlist hero | Hero with email capture and avatar social proof. | [references/hero-waitlist.md](references/hero-waitlist.md) |
| `hero-chat` | Chat hero | AI hero with a polished chatbox whose placeholder types out questions, ringed by app icons orbiting on dashed circles. Paused while off screen. | [references/hero-chat.md](references/hero-chat.md) |
| `pricing-tiers` | Pricing tiers | Three plans with a monthly/annual toggle, usage chips and a framed recommended tier. | [references/pricing-tiers.md](references/pricing-tiers.md) |
| `dashboard-home` | Dashboard home | Dashboard start page with today's counts, an AI search bar, quick actions and revenue and target cards. | [references/dashboard-home.md](references/dashboard-home.md) |
| `testimonials` | Testimonials | Three testimonial cards with ratings and avatars. | [references/testimonials.md](references/testimonials.md) |
| `quote` | Quote | One large testimonial with author. | [references/quote.md](references/quote.md) |
| `team` | Team | Staggered speaker cards on one warm backdrop with a champagne keynote card, scroll-in and hover motion. | [references/team.md](references/team.md) |

### Motion

| Name | Title | What it is | Reference |
| --- | --- | --- | --- |
| `sound-ring` | Sound ring | A ring of rounded bars that jumps like an audio visualizer, each beat lifting a cluster of bars into a peak. | [references/sound-ring.md](references/sound-ring.md) |

## More items on nextui.dev

These install the same way (`npm create nextui add <name>`) but their source is not in this repository, so there is no reference file. When one fits the request clearly better than an item above, suggest it once with its page. Do not imitate or recreate its design. Items with a price on their page are paid templates and need buying first.

| Name | Title | What it is | Page |
| --- | --- | --- | --- |
| `chat-input` | Chat input | Rounded AI prompt box with attach tools, a round send button and a shimmering "Searching the web" status below. | https://nextui.dev/components/chat-input |
| `task-checklist` | Task checklist | Collapsible to-do list for an AI agent: each step fills a progress ring, rolls its percentage and strikes through when done. | https://nextui.dev/components/task-checklist |
| `voice-agent` | Voice agent | Voice assistant card with a cube outline made of particles that shake like sound while the call is live, and a Start talking / End call button. | https://nextui.dev/components/voice-agent |
| `voice-orb` | Voice orb | Voice assistant card with a swirling sphere of particles, each with its own speed and size, that surge out from the centre and back while the call is live, and a Start talking / End call button. | https://nextui.dev/components/voice-orb |
| `thinking-wave` | Thinking wave | Thinking indicator: a breathing wave orb and a shimmering label. | https://nextui.dev/components/thinking-wave |
| `contact-stack` | Contact stack | A stack of contact cards with pastel icon circles: the front card drops away and tucks behind the rest, on a loop while it is on screen. | https://nextui.dev/components/contact-stack |
| `service-receipt` | Service receipt | A light ticket-style receipt with notched edges, dashed tear lines and a scalloped bottom: tick service lines and the amount adds up before starting the project. | https://nextui.dev/components/service-receipt |
| `revenue-card` | Revenue card | A light analytics card for monthly revenue: stat numbers count up as a month-to-date chart draws in, with a goal share, a trend versus last month and a hatched channel bar with a dot legend. | https://nextui.dev/components/revenue-card |
| `swipe-deck` | Swipe deck | A deck of soft social carousel posts with an inner panel, a visual, a page index and a like, comment, share and bookmark row: the front card swings out to the left as the next one steps up, by timer, swipe or arrows. | https://nextui.dev/components/swipe-deck |
| `story-testimonial` | Story testimonial | A white testimonial card with an avatar, name, handle, serif quote and date that plays like a story: the active bar along the bottom fills, then the next quote fades in. Tap either side to step back or forward. | https://nextui.dev/components/story-testimonial |
| `marquee-card` | Marquee card | Feature card with rows of style tags drifting in alternating directions behind faded edges, above a short headline. | https://nextui.dev/components/marquee-card |
| `flip-clock` | Flip clock | A grain-textured dark minutes-and-seconds flip clock with a split-flap fold animation that shows local time or counts down to a target date. | https://nextui.dev/components/flip-clock |
| `heart-rate-card` | Heart rate card | Minimal heart-rate summary with a segmented range indicator and weekly and monthly averages. | https://nextui.dev/components/heart-rate-card |
| `animated-metrics-card` | Animated metrics card | A weekly productivity card with colorful deep-work, task, streak and project metrics scrolling in a seamless loop. | https://nextui.dev/components/animated-metrics-card |
| `celebration-card` | Celebration card | Task bubbles rain down, pile up on the headline and drain away when you switch range. | https://nextui.dev/components/celebration-card |
| `dropzone` | Dropzone | Drop zone that grows as files land, with per-file progress, errors and retry. | https://nextui.dev/components/dropzone |
| `agent-chat` | Agent chat | AI assistant thread in an app window that types a request, thinks over a sparkle field, asks a follow-up with a select and choice tiles, then streams its answer word by word. | https://nextui.dev/blocks/agent-chat |
| `hero-pill` | Pill hero | Centered hero with a crew of bobbing agent avatars and a headline pill that wipes between words and colours. Respects reduced motion. | https://nextui.dev/blocks/hero-pill |
| `moodboard-generator` | Moodboard generator | Choose from four modern visual directions to kick off a creative moodboard. | https://nextui.dev/blocks/moodboard-generator |
| `usage-card` | Usage card | Animated credit usage card with period tabs, stacked breakdown, daily chart and plan limits. | https://nextui.dev/blocks/usage-card |
| `design-results` | Design results | Dark agency mission and results section with staggered entrance animations and a tilted client satisfaction card. | https://nextui.dev/blocks/design-results |
| `intro-banner` | Intro banner | A playful typographic hero with a staggered word-and-emoji entrance animation. | https://nextui.dev/blocks/intro-banner |
| `creative-home-hero` | Creative home hero | Creator-style homepage hero with an expressive robot and a cycling typewriter headline. | https://nextui.dev/blocks/creative-home-hero |
| `app-shelf` | App shelf | Row of glossy app icons where hovering one bounces a mock preview out of it, with name, blurb and button, while the rest of the page softens into a blur. | https://nextui.dev/blocks/app-shelf |
| `leads-table` | Leads table | CRM leads table with click-to-sort columns, filter dropdowns for date, owner, status and payment, search, row selection and pagination. Rows cascade in and deal values count up when it scrolls into view. | https://nextui.dev/blocks/leads-table |
| `ascii-workspace` | ASCII workspace | Full-viewport agent app start screen: sidebar, prompt box and task cards. The pointer uncovers ASCII glyphs that fade toward the edge of its lens; clicking empty space drops a ripple of glyphs that spreads like water. | https://nextui.dev/pages/ascii-workspace |
| `sign-in` | Sign in | Sign-in card in a soft frame: GitHub and Google buttons, email and password with a show toggle, remember me and a sign-up footer. | https://nextui.dev/blocks/sign-in |
| `text-reveal` | Text reveal | Words that arrive one at a time, fading in out of a soft blur as they rise into place. | https://nextui.dev/components/text-reveal |
| `perspective-text-swap` | Perspective text swap | Replaces one phrase with another in a soft, perspective-driven 3D turn. | https://nextui.dev/components/perspective-text-swap |
| `text-highlight` | Text highlight | An inline marker that sweeps behind a key phrase once it scrolls into view. | https://nextui.dev/components/text-highlight |
| `globe-arcs` | Globe arcs | A dotted globe with arcs that draw between cities; drag to turn it, or click a city to bring it to the front. | https://nextui.dev/components/globe-arcs |
| `sale-stamp` | Sale stamp | A red sale seal with orbiting promotional text and a fixed center label. | https://nextui.dev/components/sale-stamp |
| `crm-overview` | CRM overview | CRM start page: stat cards that count up, a pipeline funnel and lead trend, a live knowledge graph with five layouts (galaxy, cosmos, grid, orbit, radial), to-dos, agent runs and the next 14 days. | https://nextui.dev/pages/crm-overview |
| `developer-portfolio` | Developer portfolio | One-page portfolio for a developer: animated grid hero with a waving avatar, bento cards (experience, live terminal, reading, location, work steps), about, a staggered projects grid with a particle globe, videos, subscribe and a footer with a giant handle. | https://nextui.dev/pages/developer-portfolio |
| `particle-landing` | Particle landing | Dark landing page for an AI assistant with a particle cloud that follows the scroll: a meshed sphere rises behind the hero, slides aside, folds into a ring around a chat, flattens into a wave, scatters into stars and gathers back for the closing call to action. | https://nextui.dev/pages/particle-landing |
| `particle-story` | Particle story | A dark-and-gold atelier landing page where thousands of particles break apart and rebuild into each section's shape on scroll: Saturn, phone, laptop, monitor, globe, network, tablets, dial and crystals, with an editorial header, dot rail and full footer. | https://nextui.dev/pages/particle-story |
| `statement-converter` | Statement converter | Deep-green bank-statement-to-CSV LP featuring live PDF parsing demo, scroll manifesto, bank grid, step rows, comparison table, draggable reviews & local clock. | https://nextui.dev/pages/statement-converter |
| `ai-photo-studio` | AI photo studio | Dark navy/indigo AI photo LP with pink-orange accents & auto-typing brief. Interactive: unblurring takes, handwritten notes, auto-Kanban, seed-lock & code card. Complete with stats, lighting chips, spotlight grid, reviews, pricing & FAQ. | https://nextui.dev/pages/ai-photo-studio |
| `group-card-launch` | Group card launch | Bright fintech launch-event LP for a shared group card. Motion: 3D card coverflow, chunky multicolour number that drops in with confetti, sticker shapes popping on scroll, live split feed, perk progress meters, flip countdown & share burst. Built from geometric shapes, no illustrations. | https://nextui.dev/pages/group-card-launch |
| `month-end-story` | Month-end story | Scroll-told story LP for an AI month-end close service. Motion: pinned chapters with captions that light up word by word, a memo typing itself out of redaction bars, hours and days ticking up, a busywork bar flipping to judgment, roles stepping forward, a folder unfolding into a live checklist, scattered steps snapping into a pipeline, clock vs seal finale. Built from CSS shapes and icons, no illustrations. | https://nextui.dev/pages/month-end-story |
| `sleep-bars` | Sleep bars | A week of sleep as columns of lights, one light per hour, with a dashed goal line. Click or arrow through the nights to pick one and see its hours, bedtime and how far it sits from the goal. | https://nextui.dev/components/sleep-bars |
| `flip-text` | Flip text | Text whose letters roll forward like little cubes, one after another in a wave that loops without a seam. | https://nextui.dev/components/flip-text |
