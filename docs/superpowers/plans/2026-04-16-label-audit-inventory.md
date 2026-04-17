# Label Audit Inventory — Portfolio Pixel Accents

**Date:** 2026-04-16
**For plan:** `docs/superpowers/plans/2026-04-16-portfolio-pixel-accents.md`

Treatments: `replace-with-marker` (swap for `<SectionMarker>`) · `shrink` (reduce size/opacity, keep text) · `delete` (remove entirely, format self-signals) · `embed` (rewrite as prose) · `keep` (leave unchanged — not a label).

## Section headers (primary replacement targets)

| File:line | Current label | Context | Proposed treatment | Rationale |
|-----------|---------------|---------|--------------------|-----------|
| `src/components/AnimatedHomePage.tsx:611` | `PROJECTS` | CollapsibleSection title on home | `replace-with-marker` kind=`work` label=`Projects` | section-level = marker territory; glyph adds signature |
| `src/components/AnimatedHomePage.tsx:643` | `ENDEAVORS` | CollapsibleSection title on home | `replace-with-marker` kind=`games` label=`Endeavors` | "Endeavors" = games + experiments; controller glyph fits |
| `src/components/AnimatedHomePage.tsx:691` | `EXPERIENCE` | CollapsibleSection title on home | `replace-with-marker` kind=`work` label=`Experience` | work glyph repeats but kind is consistent |
| `src/components/AnimatedHomePage.tsx:763` | `EDUCATION` | CollapsibleSection title on home | `replace-with-marker` kind=`writing` label=`Education` | page glyph reads as learning/notes |
| `src/components/AnimatedHomePage.tsx:835` | `CONTACT` | CollapsibleSection title on home | `replace-with-marker` kind=`contact` label=`Contact` | envelope glyph is literal |
| `src/app/cv/CVPageClient.tsx:90` | `Experience` | CV page section via `SectionHeading` | `replace-with-marker` kind=`work` label=`Experience` | CV already compact — marker aligns with home |
| `src/app/cv/CVPageClient.tsx:119` | `Education` | CV page section via `SectionHeading` | `replace-with-marker` kind=`writing` label=`Education` | matches home |

Note: the `SectionHeading` helper at `CVPageClient.tsx:12–18` will be retired in favor of `SectionMarker` inline at the two call sites. `TextReveal` animation is dropped for these — acceptable trade since the marker is shorter text.

## Titles / display text (not labels — keep)

| File:line | Element | Treatment | Rationale |
|-----------|---------|-----------|-----------|
| `src/app/about/AboutPageClient.tsx:49` | h1 "Hunter Bastian" (mono uppercase) | `keep` | primary name display, not a label |
| `src/app/cv/CVPageClient.tsx:52` | h1 "Hunter Bastian" (mono uppercase) | `keep` | same — canonical name |
| `src/app/logo/page.tsx:15-16` | "Studio Alpine" wordmark | `keep` | /logo is a reference page |
| `src/app/blog/[slug]/page.tsx:123`, `src/app/projects/[slug]/page.tsx:165` | Article titles (mono, not uppercase) | `keep` | content titles, not labels |

## Navigation / links

| File:line | Current label | Proposed treatment | Rationale |
|-----------|---------------|--------------------|-----------|
| `src/components/Header.tsx:16,77,177,186` | Nav items `WORK` / `Info` / `Email` / `LinkedIn` (uppercase tracking) | `keep` | per CLAUDE.md "Nav links: Info, Work, Email, LinkedIn" is an explicit user decision — don't touch |
| `src/components/BreadcrumbPill.tsx:14` | breadcrumb pill (mono tracking 0.12em) | `keep` | not uppercase; already quiet |

## Inline meta (small targets — shrink or leave)

| File:line | Current | Context | Proposed treatment | Rationale |
|-----------|---------|---------|--------------------|-----------|
| `src/components/ProjectTextList.tsx:105` | category meta (mono 10px uppercase) | project list tile right-column | `shrink` (10px → 9px, opacity /60 → /50) | already small — nudge quieter, no delete: categories still useful for scanning |
| `src/components/ProjectCard.tsx:124` | tag badge (mono 9px) | project card footer | `keep` | already tiny, /60 opacity |
| `src/components/ProjectCard.tsx:137` | "Featured" pill | card top-right | `keep` | signal element, not a label pair |
| `src/components/AnimatedHomePage.tsx:738,804,815` | experience/education job title, meta (mono) | nested list items | `keep` | titles of items, not section labels |
| `src/components/BlogCardList.tsx:49,70` | date + tag pills (mono 10px) | blog list | `keep` | year self-signals already; tags help scan |
| `src/components/Footer.tsx:97,100` | footer text (mono 10px) | footer | `keep` | already small |
| `src/components/TopMeta.tsx` | coordinate strip | top-of-page ambient meta | `keep` | signature element, ambient, not labeling a pair |
| `src/app/error.tsx:15,35`, `src/app/not-found.tsx:15,59` | error page labels | edge pages | `keep` | low-traffic, consistency < risk of churn |
| `src/components/ResumeButton.tsx:22`, `AboutPageClient.tsx:88,112` | "Contact" / "View CV" / "Resume" button text (uppercase tracking) | CTAs | `keep` | CTAs read as buttons, not labels; uppercase gives them weight |
| `src/components/UnicodeLoader.tsx:35` | loader text | loading states | `keep` | ephemeral, not on main surfaces |
| `src/components/CaseStudyNav.tsx:89` | case study nav numbers/mono | project pages | `keep` | in-article navigation |
| `src/components/FooterSnakeEasterEgg.tsx` | game HUD labels | easter egg game | `keep` | game UI, intentional arcade style |
| MDX components (`DesignDecision`, `ImageAnnotation`, `LiveDemo`, `ScrollStage`, `LiquidTabs`, `ComparisonSlider`) | internal case-study helpers | MDX body | `keep` | internal to case studies, not sitewide |

## Dividers (separate from labels — covered in Task 8)

Section boundaries on Home and About currently rely on padding/whitespace + CollapsibleSection framing; no explicit `<hr>` elements to replace yet. Spec's "replace hairline dividers" move will only apply where a hairline exists on disk. During Task 8 execution, add `<PixelDivider>` between top-level sections on Home (before `ENDEAVORS`, before `CONTACT`) as a new, intentional accent — one per page, not every boundary — to avoid noise.

## Summary

- **7 section headers** get `replace-with-marker` (5 on Home, 2 on CV).
- **1 meta cluster** gets `shrink` (project text-list category column).
- **Everything else** is `keep` — either user-explicit preference (nav), already appropriately quiet, or content (not a label).
- `PixelDivider` appears on Home at 2 new insertion points, not as a replacement for existing hairlines.

This inventory pauses Task 8 until user review.
