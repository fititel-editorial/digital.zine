# Product

## Register

Both equally — brand and product are first-class surfaces. The public magazine experience (hero, editions archive, editorial storytelling) is where design *is* the product; the reader library, flipbook, and admin surfaces are where design *serves* the product. PRODUCT.md defaults to brand, but the app surfaces are treated as first-class, not secondary.

## Platform

web

## Users

FITITEL serves Angolan readers, editors, and administrators.

- **Readers (primary audience):** Angolan professionals, students, and technologists curious about innovation, AI, data, and digital culture on the continent. They arrive mobile-first, often on mid-range Android devices over metered or unstable mobile data. Their context is on-the-go reading — commute, lunch break, evening browsing — so the experience must be fast, legible in bright ambient light, and frugal with bandwidth. The job: discover an edition, preview it, decide to read or buy, and return to a personal library.
- **Editors:** Internal staff who create and manage editions. They work from desktops, need efficient CRUD flows, and want the platform to stay out of their way.
- **Admins:** Oversee editors, readers, revenue, and audit activity. They live in the dashboard — metrics, tables, logs — and need density and clarity over decoration.

The emotional goal for the reader surface: a sense that they are reading something credible, considered, and rooted in their own context — not an import.

## Product Purpose

FITITEL is Angola's digital magazine for technology, innovation, and digital culture — a platform that documents and accelerates the country's and the continent's digital transformation. The product exists to publish editions (interactive flipbook reading), sell or grant access to them, give readers a personal library, and give the FITITEL team the tools to manage the whole lifecycle.

Success looks like: readers return edition after edition, the reading experience feels native to their context rather than borrowed, and the team can publish and operate without the platform fighting them.

## Brand Personality

**Editorial. Refined. Thoughtful.**

FITITEL should read as a serious publication with editorial intelligence — the credibility of a magazine that knows its subject, not the volume of a tech startup shouting for attention. Confident without being loud. Technical without being theatrical. Considered craft over decorative effects. The brand carries authority by treating the reader as someone intelligent.

This is a deliberate shift away from the current build's terminal/brutalist posture (hard offset shadows, mock `user@fittel:~$` prompts, system-log theatrics), which reads as performative tech-credibility. The destination is quieter and more typographic — editorial confidence with technical substance underneath, not technical costume on top.

## Anti-references

- **Western tech-blog generic.** Not a generic Western tech publication. FITITEL is Angolan; its identity and editorial voice must read through in every surface, not feel like a template airlifted from Silicon Valley.
- **Performative "terminal" decoration.** Mock shell prompts, blinking cursors, and system-log framing as costume. Technical credibility is earned through substance and precision, not through theatrical command-line effects.
- **SaaS startup theatrics.** Indigo gradients, hero-metric stat grids, identical feature-card grids, glassmorphism, gradient text — the templated signals of a generated landing page.

## Design Principles

1. **Editorial credibility over technical theatrics.** Authority comes from typography, hierarchy, restraint, and substance — not from costume-tech effects. When a terminal/monospace motif appears, it must carry information (a real log, a real command, real metadata), not perform "we are technical."

2. **Angolan voice, not Western template.** Every design choice should feel rooted in FITITEL's context. Resist defaulting to the visual grammar of imported publications; let the editorial voice and the audience's reality shape the surface.

3. **Respect the device and the data.** The real audience is mobile-first on mid-range devices over metered connections. Performance, payload size, and small-screen legibility are design decisions, not engineering afterthoughts. Ship light; earn every kilobyte and every animation.

4. **One voice across brand and product.** The marketing surface and the app surfaces (reader library, flipbook, admin) must feel like one considered system — same restraint, same typographic discipline, same respect for the reader — not two different designs stitched together.

5. **Show the idea, not the machinery.** Decoration should serve meaning. Effects, motion, and affordances exist to clarify content and hierarchy; when they start performing instead of communicating, cut them.

## Accessibility & Inclusion

- **Mobile-first and low-data by design.** Build for the Angolan audience's real conditions: small screens, mid-range Android devices, metered or unstable mobile networks, bright ambient light. This means legible contrast, payload discipline, and small-screen craft as defaults — not optimizations layered on later.
- **Contrast and semantics as baseline.** Body text ≥4.5:1 contrast; semantic HTML and keyboard reachability across all interactive surfaces. (Note: the current build has muted-gray-on-tinted-body contrast issues and several animations lacking `prefers-reduced-motion` alternatives — to be addressed.)
- **Honour reduced motion** consistently across every animation, including the hero badge pulse, cursor blink, and reveal-on-scroll transitions that currently lack alternatives.
