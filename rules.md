# VELORA Urban Mobility OS — Brand & Application Rules

> **CRITICAL RULE — READ FIRST:**
> **Do ONLY what is explicitly mentioned in the prompt. Do not add, remove, infer, or assume any feature, section, content block, component, color, copy, or interaction that has not been directly requested. Every output must map 1-to-1 to the stated instruction. No creative additions. No "helpful" extras. Strict literal execution only.**

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Core Governing Rules](#2-core-governing-rules)
3. [Brand Identity](#3-brand-identity)
4. [Logo Guidelines](#4-logo-guidelines)
5. [Color System](#5-color-system)
6. [Typography System](#6-typography-system)
7. [Spacing & Layout Grid](#7-spacing--layout-grid)
8. [Application Architecture](#8-application-architecture)
9. [Page & Section Rules](#9-page--section-rules)
10. [Component Guidelines](#10-component-guidelines)
11. [Dark Mode vs Light Mode Rules](#11-dark-mode-vs-light-mode-rules)
12. [Data Visualization Rules](#12-data-visualization-rules)
13. [Imagery Guidelines](#13-imagery-guidelines)
14. [Voice & Content Tone](#14-voice--content-tone)
15. [Brand Consistency Checklist](#15-brand-consistency-checklist)
16. [Prohibited Practices](#16-prohibited-practices)

---

## 1. Project Overview

| Field | Value |
|---|---|
| **Application Name** | VELORA |
| **Full Title** | VELORA Urban Mobility OS |
| **Category** | Smart City · Urban Mobility · Civic Intelligence Platform |
| **Platform** | Web Application (Responsive) |
| **Design Tool** | Google Stitch (Prototype source) |
| **Primary Audience** | City operators, transit authorities, urban planners, municipal command centers |
| **Secondary Audience** | Passengers / end-users of urban transit systems |

### Purpose Statement
VELORA is an Urban Mobility Operating System that unifies smart city intelligence, real-time transit control, crisis & incident management, crowd analytics, and urban prosperity metrics into a single command platform. It serves both back-office operators ("Command & Intelligence" view) and public-facing passengers ("Passenger Experience" view).

---

## 2. Core Governing Rules

These rules are **non-negotiable** and apply to every output, every screen, every component, every iteration.

### Rule 1 — Prompt Fidelity (Highest Priority)
```
DO ONLY WHAT IS MENTIONED IN THE PROMPT.
```
- If a section is not mentioned → **do not create it**
- If a color is not specified → **use the established design system below, not your own choice**
- If copy is not provided → **use the placeholder format defined in these rules**
- If a feature is not described → **do not invent it**
- Never add "bonus" features, decorative elements, or assumed interactions

### Rule 2 — Brand Consistency
```
Every screen, section, component, and piece of copy must look and feel like it belongs to VELORA.
```
- Apply the VELORA color system on every output without deviation
- Typography must match the defined type hierarchy — no substitutions
- Tone of voice must remain consistent across all user-facing content
- UI patterns must be reused, not reinvented per screen

### Rule 3 — Logo Uniformity
```
The VELORA logo must appear in its defined form on every screen, every time, without modification.
```
- No resizing beyond defined min/max bounds
- No recoloring outside approved variants
- No repositioning outside defined placement zones
- Full rules in [Section 4 — Logo Guidelines](#4-logo-guidelines)

### Rule 4 — Mode Respect
```
Light mode pages and dark mode pages must never mix their color systems.
```
- Editorial/marketing pages → Light Mode system only
- Dashboard/command pages → Dark Mode system only
- Never apply dark-mode components to light-mode pages and vice versa

### Rule 5 — Data Integrity Display
```
All metrics, percentages, and live-data indicators must use the correct semantic color (defined in Section 5).
```
- Optimal / positive → defined green token
- Warning → defined amber token
- Critical / alert → defined red token
- Never use generic or unsanctioned colors for status indicators

---

## 3. Brand Identity

### 3.1 Brand Name
- **Primary name**: `VELORA`
- **Full product name**: `VELORA Urban Mobility OS`
- Always written in **ALL CAPS**: `VELORA` — never `Velora`, `velora`, or `VeLora`
- In body copy, "the platform" or "the system" may be used after first mention

### 3.2 Taglines
| Context | Tagline |
|---|---|
| Hero / Homepage | *"The Future of Urban Mobility"* |
| Intelligence Module | *"Smart City Intelligence. Live Control."* |
| Editorial / Awareness | *"This isn't traffic. It's lost life."* |
| Platform Summary | *"Urban Mobility OS"* |

- Taglines must be used verbatim. Do not paraphrase or alter punctuation.

### 3.3 Brand Pillars

| Pillar | Description |
|---|---|
| **Intelligence** | AI-driven, data-first decision making |
| **Control** | Real-time command with zero latency perception |
| **Clarity** | Complex data made immediately legible |
| **Humanity** | Cities are people — metrics represent lives, not numbers |

### 3.4 Brand Personality
- **Professional** — never playful or casual in operator-facing content
- **Authoritative** — decisive, direct, no hedging language
- **Precise** — exact numbers, exact states, no approximations
- **Calm under pressure** — even in crisis views, visual language is composed

---

## 4. Logo Guidelines

### 4.1 Primary Logo
- **Wordmark**: `VELORA` in the primary sans-serif typeface (Inter or equivalent)
- **Weight**: Bold / 700
- **Letter-spacing**: `0.15em` (tracked out for authority)
- **Case**: ALL CAPS — always

### 4.2 Logo Variants

| Variant | Usage | Background |
|---|---|---|
| **Dark logotype** — black `#0A0A0A` wordmark | Light mode pages, white/cream backgrounds | White / Off-white |
| **Light logotype** — white `#FFFFFF` wordmark | Dark mode pages, dark dashboards | Black / Dark Navy |
| **Amber logotype** — `#E8A020` wordmark | Special callouts, loading screens, isolated brand moments | Black only |

> **Never use the amber variant on any background other than pure black or near-black.**

### 4.3 Logo Sizing

| Context | Minimum Size | Maximum Size |
|---|---|---|
| Navigation bar | 80px width | 140px width |
| Footer | 60px width | 120px width |
| Loading / Splash | 120px width | 200px width |
| Favicon / App icon | 32×32px | 64×64px |

### 4.4 Logo Clear Space
- Maintain a clear zone equal to the height of the letter "V" in the logotype on all four sides
- No other element, text, image, or UI component may enter this clear zone

### 4.5 Logo Placement Zones

| Page Type | Primary Position | Secondary Position |
|---|---|---|
| Light mode (marketing) | Top-left of navigation bar | Footer, centered |
| Dark mode (dashboard) | Top-left of sidebar or top nav | None |
| Splash / Preloader | Horizontally centered, vertically centered | — |

### 4.6 Prohibited Logo Modifications
- ❌ Do not stretch, compress, or skew the wordmark
- ❌ Do not apply gradients to the wordmark
- ❌ Do not add drop shadows to the wordmark
- ❌ Do not place the wordmark on a mid-tone or patterned background
- ❌ Do not rotate the wordmark
- ❌ Do not use any color outside the three approved variants
- ❌ Do not add a tagline or sub-label directly attached to the wordmark

---

## 5. Color System

### 5.1 Light Mode Palette (Marketing / Editorial Pages)

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--color-bg-primary` | Pure White | `#FFFFFF` | Page background |
| `--color-bg-secondary` | Off White | `#F8F8F6` | Section alternates, card backgrounds |
| `--color-bg-tertiary` | Light Warm Grey | `#F0EFEB` | Subtle containers |
| `--color-text-primary` | Near Black | `#0A0A0A` | Headlines, primary body |
| `--color-text-secondary` | Dark Grey | `#3A3A3A` | Supporting body, captions |
| `--color-text-muted` | Medium Grey | `#767676` | Labels, metadata, helper text |
| `--color-accent-primary` | VELORA Black | `#0A0A0A` | CTAs, buttons, strong emphasis |
| `--color-accent-amber` | Intelligence Amber | `#E8A020` | Key metric highlights only |
| `--color-border` | Hairline | `#E5E5E5` | Dividers, card borders |
| `--color-border-strong` | Medium Border | `#CACACA` | Form inputs, separators |

### 5.2 Dark Mode Palette (Dashboard / Command Pages)

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--color-dark-bg-base` | Void Black | `#000000` | Base canvas |
| `--color-dark-bg-surface` | Deep Dark | `#0D0D0D` | Card surfaces, panels |
| `--color-dark-bg-elevated` | Dark Elevation | `#161616` | Modals, elevated components |
| `--color-dark-bg-overlay` | Dark Navy | `#0A0F1A` | Map overlays, data panels |
| `--color-dark-text-primary` | Pure White | `#FFFFFF` | Headlines, primary data |
| `--color-dark-text-secondary` | Light Grey | `#ABABAB` | Supporting labels |
| `--color-dark-text-muted` | Dim Grey | `#5A5A5A` | Metadata, timestamps |
| `--color-dark-accent-amber` | Intelligence Amber | `#E8A020` | Primary metrics, active states |
| `--color-dark-accent-teal` | Live Teal | `#00C4B4` | Real-time data, map elements |
| `--color-dark-border` | Dark Border | `rgba(255,255,255,0.08)` | Card edges, dividers |
| `--color-dark-border-bright` | Active Border | `rgba(232,160,32,0.35)` | Selected/active card borders |

### 5.3 Semantic / Status Colors (Both Modes)

| Token | Name | Hex | Usage |
|---|---|---|---|
| `--color-status-optimal` | Optimal Green | `#22C55E` | "Optimal" states, healthy metrics |
| `--color-status-warning` | Warning Amber | `#F59E0B` | Degraded performance, caution |
| `--color-status-critical` | Crisis Red | `#EF4444` | Incidents, failures, alerts |
| `--color-status-inactive` | Inactive Grey | `#6B7280` | Offline, unavailable, disabled |
| `--color-status-processing` | Processing Blue | `#3B82F6` | Loading, AI processing states |

### 5.4 Color Usage Rules
- **Never use amber** (`#E8A020`) for body text — reserved for metric highlights and accent moments only
- **Never use status colors** for decoration — only for semantic state communication
- **Never mix** light-mode and dark-mode tokens on the same page
- **Background overlays** on dark pages: `rgba(0,0,0,0.72)` minimum opacity for readability
- **On imagery**: text must have a scrim or overlay — never raw text directly over photography without contrast treatment

---

## 6. Typography System

### 6.1 Typeface Stack

| Role | Typeface | Fallback | Notes |
|---|---|---|---|
| **Display / Editorial** | Playfair Display | Georgia, serif | Hero headlines, "The Intelligence Core" style headings |
| **UI / Interface** | Inter | -apple-system, sans-serif | All navigation, buttons, labels, data, captions |
| **Mono / Data** | JetBrains Mono | Courier New, monospace | Live metrics, numeric counters, code, coordinates |

### 6.2 Type Scale

| Scale Token | Size | Weight | Line Height | Usage |
|---|---|---|---|---|
| `--text-display` | 64–96px | 400 (Regular) | 1.1 | Hero section primary headline |
| `--text-h1` | 48–56px | 400–500 | 1.15 | Section titles (editorial serif) |
| `--text-h2` | 32–40px | 400 | 1.2 | Sub-section headings |
| `--text-h3` | 24–28px | 500–600 | 1.25 | Card titles, dashboard section headers |
| `--text-h4` | 18–20px | 600 | 1.3 | Module labels, feature names |
| `--text-body-lg` | 16–18px | 400 | 1.65 | Editorial body copy |
| `--text-body` | 14–16px | 400 | 1.6 | Standard body, descriptions |
| `--text-body-sm` | 13px | 400 | 1.55 | Captions, supporting copy |
| `--text-label` | 11–12px | 500–600 | 1.4 | UI labels, navigation, tags |
| `--text-micro` | 10–11px | 500 | 1.3 | Metadata, timestamps, fine print |
| `--text-metric` | 48–96px | 700 | 1.0 | Large KPI numbers (Mono or Inter) |

### 6.3 Typography Rules
- **Serif (Playfair Display)** is used exclusively for editorial/storytelling headlines — never for UI elements, buttons, or data labels
- **Inter** is used for all functional UI — never use serif in navigation or dashboards
- **Letter-spacing** on ALL CAPS labels: `0.1em` minimum
- **Kerning**: optical kerning enabled on all display text
- **Maximum line length**: 72 characters for body copy, 56 characters for editorial paragraphs
- **Hyphenation**: disabled across all text — never auto-hyphenate
- **Text alignment**: left-align body copy always. Center-align display headlines and isolated metric numbers only

---

## 7. Spacing & Layout Grid

### 7.1 Grid System

| Context | Columns | Gutter | Margin | Max Width |
|---|---|---|---|---|
| Desktop (≥1280px) | 12 | 24px | 80px | 1440px |
| Laptop (1024–1279px) | 12 | 20px | 48px | — |
| Tablet (768–1023px) | 8 | 16px | 32px | — |
| Mobile (< 768px) | 4 | 12px | 20px | — |

### 7.2 Spacing Scale

All spacing must derive from the 8px base unit:

```
4px   — Micro (icon padding, hairline gaps)
8px   — XS (tag internal padding, tight spacing)
12px  — SM (between label and input)
16px  — MD (standard component padding)
24px  — LG (card padding, section internal gaps)
32px  — XL (between cards, between components)
48px  — 2XL (section internal vertical rhythm)
64px  — 3XL (between major sections, light mode)
96px  — 4XL (hero section padding)
128px — 5XL (large hero vertical rhythm)
```

### 7.3 Layout Rules
- **Section padding**: minimum `64px` vertical on desktop, `40px` on tablet, `32px` on mobile
- **Card padding**: `24px` uniform on desktop, `16px` on mobile
- **Navigation height**: `64px` fixed on desktop, `56px` on mobile
- **Sidebar width** (dashboard): `240px` expanded, `64px` collapsed

---

## 8. Application Architecture

VELORA has **five primary views**. Each view has distinct layout, color mode, and purpose rules.

```
VELORA Urban Mobility OS
├── 1. Marketing / Landing (Light Mode)
│   ├── Hero — "The Future of Urban Mobility"
│   ├── Problem Statement — "This isn't traffic. It's lost life."
│   ├── The Intelligence Core — Feature showcase
│   │   ├── Demand Prediction
│   │   ├── Traffic Intelligence
│   │   └── Crowd Forecasting
│   ├── City Aerial — Visual interlude
│   └── Footer
│
├── 2. Smart City Intelligence — Live Control (Dark Mode)
│   ├── Live Metrics Header (94.2% composite score)
│   ├── Keys Integrity Panel
│   ├── AI Support Module
│   ├── "What If?" Scenario Engine
│   ├── Crisis & Incident Management
│   │   └── Live Map Interface
│   └── Urban Prosperity Metrics
│       └── Optimal Status Indicator
│
├── 3. VELORA Command & Intelligence (Dark Mode)
│   ├── Personalized Welcome ("Welcome, Alex")
│   ├── Command Dashboard
│   └── Intelligence Feed
│
├── 4. VELORA Passenger Experience (Light/Dark Hybrid)
│   ├── Passenger-facing journey view
│   └── Personal mobility dashboard
│
└── 5. Prototype Views (Internal / Dev only)
    └── Interactive click-through prototypes
```

---

## 9. Page & Section Rules

### 9.1 Marketing / Landing Page (Light Mode)

**Purpose**: Public-facing brand and product introduction

| Section | Rules |
|---|---|
| **Navigation** | VELORA logo (dark variant) top-left. Nav links: Inter 13px, weight 500. One primary CTA button. Transparent background scrolling → white on scroll. |
| **Hero** | Full-viewport height. Display serif headline. Sub-headline in Inter regular. Dark CTA button (`#0A0A0A`). No carousel, no auto-play video. |
| **Problem Statement** | Editorial, high contrast. Quote-style headline. Supporting body copy max 60 words. Photography with gradient overlay. |
| **Intelligence Core** | 3-column feature grid (desktop). Icon + H4 title + body copy per card. Cards on off-white background. No drop shadows — hairline borders only. |
| **City Visual** | Full-bleed aerial city photography. No text overlaid without gradient scrim. |
| **Footer** | VELORA logo centered. Navigation links in Inter 12px. Copyright. Minimal — no social icons unless explicitly instructed. |

### 9.2 Smart City Intelligence — Live Control (Dark Mode)

**Purpose**: Operational command center for city operators

| Section | Rules |
|---|---|
| **Live Metrics Bar** | Large percentage (JetBrains Mono, bold, amber `#E8A020`). Sub-label in Inter 12px muted. Always show composite score prominently. |
| **Status Cards** | Dark surface `#161616`. Hairline border `rgba(255,255,255,0.08)`. Title in Inter 14px/500. Metric in Mono/Inter bold. Status dot using semantic colors only. |
| **Crisis & Incident Management** | Map must occupy right 60% minimum on desktop. Left panel: incident list. Map tiles: dark satellite or dark street style — never light map tiles in dark mode. |
| **Urban Prosperity Metrics** | "Optimal" circular indicator: white circle, "Optimal" text in `--color-status-optimal` green. Surrounding metrics in list format. |
| **"What If?" Module** | Clearly labeled as scenario simulation. Never present simulated data as live data. |

### 9.3 Command & Intelligence (Dark Mode)

**Purpose**: Personalized command center for named operators

| Section | Rules |
|---|---|
| **Welcome Header** | "Welcome, [Name]" — always first-name only. Inter 28px, white. Never surname alone. |
| **Dashboard Grid** | Module cards in 2–3 column grid. Consistent card height within each row. |
| **Intelligence Feed** | Chronological. Timestamp on every entry (JetBrains Mono, muted). Severity badge using semantic status colors. |

### 9.4 Passenger Experience (Mixed Mode)

**Purpose**: Public-facing personal mobility interface

- Lighter, more approachable tone than command views
- Amber accent used more sparingly — primarily for active/selected states
- Font sizes larger (accessibility: body minimum 16px)
- CTA buttons more prominent — minimum 48px height touch targets

---

## 10. Component Guidelines

### 10.1 Buttons

| Variant | Background | Text | Border | Usage |
|---|---|---|---|---|
| **Primary (Light)** | `#0A0A0A` | `#FFFFFF` | None | Main CTA, light mode |
| **Primary (Dark)** | `#E8A020` | `#000000` | None | Main CTA, dark mode |
| **Secondary (Light)** | `transparent` | `#0A0A0A` | `1px solid #0A0A0A` | Secondary action, light mode |
| **Secondary (Dark)** | `transparent` | `#FFFFFF` | `1px solid rgba(255,255,255,0.3)` | Secondary action, dark mode |
| **Ghost** | `transparent` | `#767676` | None | Tertiary action |
| **Destructive** | `#EF4444` | `#FFFFFF` | None | Irreversible actions only |

**Button Rules:**
- Border-radius: `2px` (light mode) / `4px` (dark mode) — VELORA uses minimal rounding
- Padding: `12px 24px` (standard), `10px 20px` (compact)
- Font: Inter, 14px, weight 600, letter-spacing `0.04em`
- No button icons unless explicitly instructed
- Never use gradient fills on buttons

### 10.2 Cards

**Light Mode Cards:**
- Background: `#FFFFFF` or `#F8F8F6`
- Border: `1px solid #E5E5E5`
- Border-radius: `4px`
- Padding: `24px`
- No drop-shadow — borders only

**Dark Mode Cards:**
- Background: `#161616`
- Border: `1px solid rgba(255,255,255,0.08)`
- Border-radius: `6px`
- Padding: `20px`
- Active/selected state: border changes to `rgba(232,160,32,0.4)`

### 10.3 Navigation (Desktop)

**Light Mode Nav:**
- Height: `64px`
- Background: `rgba(255,255,255,0.95)` with `backdrop-filter: blur(12px)` on scroll
- Logo: top-left
- Links: Inter 13px, weight 500, color `#3A3A3A`
- Active link: color `#0A0A0A`, optional underline
- CTA button: right-aligned, primary style

**Dark Mode Nav / Sidebar:**
- Width: `240px` expanded
- Background: `#0D0D0D`
- Border-right: `1px solid rgba(255,255,255,0.06)`
- Section labels: Inter 11px, uppercase, letter-spacing `0.1em`, color `#5A5A5A`
- Nav items: Inter 14px, weight 500, color `#ABABAB`
- Active item: color `#FFFFFF`, background `rgba(255,255,255,0.06)`, amber left-border `2px solid #E8A020`

### 10.4 Data / Metric Displays

- Large KPI number: JetBrains Mono, bold, minimum 48px
- Unit label: Inter, 14px, muted color, positioned top-right of number or below
- Status indicator dot: `8px` diameter circle, semantic color, positioned left of label
- Progress bars: `4px` height, rounded cap, amber fill on dark mode, black fill on light mode
- Percentage rings: stroke width `3px`, amber stroke on dark mode

### 10.5 Map Components
- Dark mode only: use dark map tiles (Mapbox dark-v11 or equivalent)
- Incident markers: semantic status colors, `24px` circular markers
- Route overlays: teal `#00C4B4` for active routes, amber `#E8A020` for highlighted
- Always show legend if more than one data layer is visible
- Map attribution text: Inter 10px, muted

### 10.6 Badges & Tags

| Type | Background | Text | Border |
|---|---|---|---|
| Optimal | `rgba(34,197,94,0.12)` | `#22C55E` | `1px solid rgba(34,197,94,0.3)` |
| Warning | `rgba(245,158,11,0.12)` | `#F59E0B` | `1px solid rgba(245,158,11,0.3)` |
| Critical | `rgba(239,68,68,0.12)` | `#EF4444` | `1px solid rgba(239,68,68,0.3)` |
| Inactive | `rgba(107,114,128,0.12)` | `#6B7280` | `1px solid rgba(107,114,128,0.2)` |
| Info | `rgba(59,130,246,0.12)` | `#3B82F6` | `1px solid rgba(59,130,246,0.3)` |

- Tag font: Inter, 11px, weight 600, letter-spacing `0.06em`, ALL CAPS
- Tag padding: `3px 8px`
- Tag border-radius: `3px`

---

## 11. Dark Mode vs Light Mode Rules

| Rule | Light Mode | Dark Mode |
|---|---|---|
| **Page background** | `#FFFFFF` or `#F8F8F6` | `#000000` base |
| **Typography color** | `#0A0A0A` primary | `#FFFFFF` primary |
| **Card style** | Bordered, no shadow | Dark surface, subtle border |
| **Accent color** | Used sparingly — black is accent | Amber `#E8A020` is accent |
| **Map tiles** | N/A | Dark satellite only |
| **Photography** | Full-color editorial | Darker treatment, potential duotone |
| **Navigation** | Top horizontal bar | Left sidebar |
| **Logo variant** | Dark wordmark | Light wordmark |
| **Border style** | `1px solid #E5E5E5` | `1px solid rgba(255,255,255,0.08)` |

**Mixing rule**: A single page must not combine light-mode sections and dark-mode sections unless the design explicitly calls for a defined transition zone with a deliberate visual separation (e.g., a full-bleed image divider).

---

## 12. Data Visualization Rules

### 12.1 Chart & Graph Style
- **Background**: transparent on dark cards, `#F8F8F6` on light cards
- **Grid lines**: `rgba(255,255,255,0.06)` dark / `rgba(0,0,0,0.06)` light — hairline only
- **Axis labels**: Inter, 11px, muted color, no axis borders
- **Data line color**: Amber `#E8A020` for primary series, Teal `#00C4B4` for secondary
- **Fill/area**: 10–15% opacity of the line color

### 12.2 Live Metrics Display
- Refresh indicator: subtle amber pulse animation `1.5s` ease-in-out infinite on the data dot
- Last updated timestamp: always visible, Inter 10px, muted, top-right of panel
- "LIVE" badge: `4px` red dot + "LIVE" text in Inter 11px/600, critical red `#EF4444`

### 12.3 The "Optimal" Circular Indicator
- White circle, `120px` diameter minimum
- Inner text: "Optimal" in Inter, 14px, weight 500, color `#22C55E`
- Surrounding ring (optional): `3px` stroke, `#22C55E`
- Used exclusively for composite urban health scores — not for individual metrics

### 12.4 The Composite Score (e.g., 94.2%)
- Displayed in JetBrains Mono, bold, minimum `72px`
- Color: `#E8A020` (Amber) — always
- Decimal point retained — never round to whole number in display
- Sub-label below: Inter 13px, muted — describes what the score represents

---

## 13. Imagery Guidelines

### 13.1 Approved Photography Style
- **Urban aerial views**: top-down or 45° drone perspectives of cities
- **City infrastructure**: roads, transit networks, bridges — always at scale
- **Golden hour / dusk**: preferred lighting for marketing images
- **High-contrast night scenes**: for dark mode editorial moments

### 13.2 Photography Treatment

| Context | Treatment |
|---|---|
| Light mode hero | Full-color, high contrast, editorial crop |
| Light mode mid-page | Slightly desaturated (90% saturation) |
| Dark mode background | Dark-treated, 60–70% brightness |
| Text-over-image | Linear gradient scrim, `rgba(0,0,0,0.5)` minimum |

### 13.3 Photography Rules
- No stock photography showing individuals' faces prominently — data and infrastructure only
- No bright, cheerful, lifestyle photography — VELORA is professional and urban-scale
- Aspect ratios: `16:9` for widescreen sections, `3:2` for card images, `1:1` for thumbnails
- Never stretch or distort images — always `object-fit: cover`

### 13.4 Prohibited Image Types
- ❌ Clipart or illustration (unless explicitly instructed)
- ❌ Cartoon or flat illustration styles
- ❌ Images with visible watermarks
- ❌ Non-urban contexts (nature, rural, residential without scale)
- ❌ Anything that contradicts the premium, civic intelligence brand

---

## 14. Voice & Content Tone

### 14.1 Operator-Facing Content (Command, Intelligence, Crisis)
- **Tone**: Authoritative, precise, calm
- **Sentence structure**: Short. Direct. Active voice.
- **Numbers**: Always specific — `94.2%` not "approximately 94%"
- **Tense**: Present for live data ("Network operating at 94.2%"), past for incidents ("Incident resolved at 14:22")
- **Never**: Exclamation marks, emoji, informal language, hedging words ("maybe", "possibly", "could be")

### 14.2 Passenger-Facing Content
- **Tone**: Helpful, clear, confident
- **Sentence structure**: Plain English, no jargon
- **Personalization**: Use first name when available ("Welcome, Alex")
- **Status language**: "On time", "Delayed", "Cancelled" — not "Experiencing delays" or "Service disruption detected"

### 14.3 Marketing / Editorial Content
- **Tone**: Visionary, provocative, humanist
- **Headlines**: Emotionally resonant — "This isn't traffic. It's lost life."
- **Body copy**: Editorial weight, not product marketing language
- **Avoid**: Buzzwords ("synergy", "leverage", "paradigm"), passive voice, filler sentences

### 14.4 Content Rules
- Every data label must have a unit (%, km/h, minutes, incidents)
- Every status badge must have an accompanying timestamp or last-updated indicator
- Error messages: explain the error, provide an action — never dead-end the user
- Empty states: always include a label and a suggested next action

---

## 15. Brand Consistency Checklist

Use this checklist before delivering any screen, page, or component output.

### Logo
- [ ] Logo is present in its defined position for this page type
- [ ] Logo variant matches the page mode (dark / light / amber)
- [ ] Logo is within defined size range
- [ ] Clear space around logo is maintained
- [ ] Logo has not been modified, recolored, or restyled

### Color
- [ ] Only tokens from this document are used — no custom or ad-hoc colors
- [ ] Light mode pages use only light mode palette
- [ ] Dark mode pages use only dark mode palette
- [ ] Status colors are used semantically, not decoratively
- [ ] Amber is used only for primary metrics and key accent moments

### Typography
- [ ] Display serif is only used for editorial/marketing headlines
- [ ] Inter is used for all UI elements
- [ ] JetBrains Mono is used for all numerical/live data
- [ ] No typefaces outside the defined stack are used
- [ ] Type sizes match the defined scale

### Layout
- [ ] Grid system is respected (12-col desktop, 8-col tablet, 4-col mobile)
- [ ] Spacing derives from the 8px base unit
- [ ] Section padding meets minimums

### Components
- [ ] Buttons use only defined variants
- [ ] Cards use correct mode-specific style
- [ ] Badges use semantic color system only
- [ ] No drop shadows on cards in light mode
- [ ] Map tiles are dark style in dark mode

### Content
- [ ] All data shown has a unit and a label
- [ ] Status badges have timestamps
- [ ] Copy matches the tone defined for this view type
- [ ] "VELORA" is always written in ALL CAPS
- [ ] Taglines are used verbatim, not paraphrased

### Prompt Fidelity
- [ ] Everything present was explicitly requested in the prompt
- [ ] Nothing was added that was not requested
- [ ] No features, sections, or components were invented beyond the brief

---

## 16. Prohibited Practices

The following are **absolutely prohibited** across all VELORA outputs:

### Prompt Violations
- ❌ Adding content, sections, or features not mentioned in the prompt
- ❌ Changing copy that was provided verbatim in the prompt
- ❌ Reorganizing sections without instruction
- ❌ Making design decisions that contradict explicit prompt instructions

### Brand Violations
- ❌ Spelling "VELORA" in any case other than ALL CAPS
- ❌ Using the logo in any variant outside the three approved
- ❌ Using any typeface not in the defined stack
- ❌ Using any color not defined in the token system
- ❌ Applying light mode components to dark mode pages
- ❌ Applying dark mode components to light mode pages
- ❌ Adding gradients to buttons, logos, or typographic elements
- ❌ Using drop-shadows on cards (light mode policy)

### Data & Metrics Violations
- ❌ Displaying simulated data without a "Simulation" label
- ❌ Using status colors decoratively (only semantic use allowed)
- ❌ Showing metrics without units
- ❌ Rounding precise data figures for display

### Typography Violations
- ❌ Using Playfair Display (or any serif) in UI, navigation, or dashboards
- ❌ Using Inter for editorial display headlines (use serif)
- ❌ Auto-hyphenating any text
- ❌ Mixing typeface weights arbitrarily outside the defined scale

### Imagery Violations
- ❌ Using bright, lifestyle, or non-urban photography
- ❌ Placing text directly over photography without a gradient scrim
- ❌ Stretching or distorting images
- ❌ Using illustrations unless explicitly instructed

### Copy Violations
- ❌ Informal language in operator-facing screens
- ❌ Exclamation marks anywhere in operator or intelligence UIs
- ❌ Hedging language ("approximately", "maybe", "could be")
- ❌ Paraphrasing established taglines

---

*Document version: 1.0 | Application: VELORA Urban Mobility OS | Source: Stitch prototype reference*
*This rules.md is the single source of truth for all VELORA brand and application decisions.*
*Any conflict between this document and an individual prompt instruction must be flagged before proceeding.*
