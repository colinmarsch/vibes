---
name: web-app-uniqueness-designer
description: Design web apps with clearer differentiation, stronger visual identity, and memorable UX patterns while staying practical to implement.
---

# Web App Uniqueness Designer

Use this skill when a user asks for help designing or improving a web app so it feels more distinctive, memorable, and intentional.

## Outcomes
- Produce a design direction that is **recognizable** (not generic).
- Keep UX intuitive while introducing selective novelty.
- Give implementation-ready guidance (tokens, component rules, interaction specs).

## Inputs to collect quickly
1. Product type and audience.
2. Primary user goal (top 1-2 jobs to be done).
3. Brand personality in 3 adjectives.
4. Competitive set (2-5 products to avoid copying).
5. Engineering constraints (framework, timeline, accessibility bar).

If inputs are missing, make explicit assumptions and proceed.

## Workflow

### 1) Define the Differentiation Core
Create a short statement:
- **Category anchor**: what familiar pattern users expect.
- **Unique promise**: what this product does differently.
- **Experience signature**: one interaction/visual motif repeated across the app.

Template:
> "For [audience], this app feels like [familiar anchor] but stands out by [unique promise], expressed through [experience signature]."

### 2) Build a Uniqueness Matrix
Score each potential direction from 1-5 across:
- Distinctiveness
- Usability risk
- Build complexity
- Accessibility confidence
- Brand fit

Pick one primary direction and one fallback.

### 3) Design a Signature System (not just a style)
Specify:
- **Color strategy**: one hero hue, one contrast hue, neutral ramp.
- **Typography voice**: display + body pairing and usage rules.
- **Shape language**: corner radius family, stroke styles, spacing rhythm.
- **Motion grammar**: duration bands, easing families, and where motion is allowed.
- **Micro-interaction motif**: a reusable behavior (e.g., “magnetic hover”, “elastic reveal”).

### 4) Map Signature to Core Journeys
For each key user flow, define:
- Entry state
- Decision moments
- Feedback states (loading/success/error/empty)
- Delight moment (subtle, optional)

Avoid adding novelty to high-risk moments like payments, destructive actions, or account recovery.

### 5) Anti-Generic Checklist
Before finalizing, verify:
- Could this UI be confused with a default template? If yes, revise.
- Is novelty concentrated in low-risk touchpoints? If no, rebalance.
- Are accessibility constraints preserved (contrast, focus, reduced motion)?
- Do at least 3 components visibly carry the signature system?

### 6) Implementation Handoff
Always produce:
- Design tokens (color, spacing, radius, motion).
- Component rules for at least: button, card, nav, form field, feedback toast.
- Interaction specs with trigger → animation → duration.
- A 1-week phased rollout plan (foundation, components, polish).

## Output format
When responding, prefer this structure:
1. Differentiation Core (3-4 lines)
2. Three concept directions (table)
3. Chosen direction + rationale
4. Signature system spec
5. Journey-level UX notes
6. Implementation-ready checklist

## Guardrails
- Do not sacrifice clarity for originality.
- Prioritize mobile ergonomics by default.
- Keep unique patterns consistent; repeated subtlety beats random novelty.
- Provide at least one "safe mode" fallback for conservative stakeholders.
