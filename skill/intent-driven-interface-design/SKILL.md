---
name: intent-driven-interface-design
license: MIT
description: Designs, builds, refines, and reviews website or application interfaces through context-sensitive design decisions, consistent implementation, and visual verification. Use for new UI, redesigns, component systems, and substantial frontend changes. Avoids copying reference aesthetics or enforcing a universal look. Do not use for unrelated backend-only work or trivial nonvisual edits.
---

# Intent-driven interface design

## Purpose

Produce an interface that serves its particular users and content, has a coherent visual and interaction language, and works in the real product. Use your existing design and engineering knowledge. **This skill constrains decision quality and validation, not the aesthetic result.** A distinctive design is welcome only when it improves the work; familiar patterns are welcome when they aid comprehension.

Do not interpret this skill, its wording, or any reference material as a visual template. Do not aim for a recognizable house style across projects.

## Operating order

Follow the user's explicit goals, constraints, existing brand/system, and supplied content first. Next respect established usability, accessibility, platform conventions, and technical realities. Then make independent, context-driven design choices. When principles conflict, explain a consequential tradeoff briefly instead of hiding it. Do not override user-specified aesthetics merely to appear original.

Adapt effort to scope: a small UI fix needs a focused diagnosis; a new site needs discovery and a direction; an established product needs an audit before changes. Do not generate long planning documents unless they help the work or are requested.

## 1. Understand the actual task

Before making visual decisions, identify from the request and available project material:

- **Purpose:** what the product/site is, and the outcome the interface must support.
- **Users and tasks:** who uses it, their context, and the top actions or questions.
- **Content and information:** what genuinely exists, relative importance, expected density, and reading/scanning needs.
- **Identity:** stated brand traits, voice, existing visual language, and any supplied assets or references.
- **Constraints:** platform, stack, component system, breakpoints, accessibility, performance, and implementation scope.

Inspect the existing codebase, design system, assets, and target screens before proposing a redesign. Distinguish facts from assumptions. Ask a focused question only if an unresolved decision would substantially change the outcome and cannot be reasonably inferred. Otherwise proceed with explicit, minimal assumptions. Never invent company claims, testimonials, usage figures, or product features to make a design feel complete.

## 2. Reason about the design, not a pattern library

Determine the information architecture and primary user journey before selecting a layout. Establish a design direction appropriate to the project. Consider genuinely different structures when there is meaningful ambiguity, but do not perform a fixed number of concepts as a ritual. Select a direction using task fit, clarity, content fit, coherence, accessibility, feasibility, and identity—not trendiness or resemblance to a reference.

Use your learned understanding of typography, color, proportion, grids, hierarchy, interaction, and platform patterns. Do not default to any particular font, gradient, card, rounded corner, hero, dashboard shell, or animation. Do not ban these patterns either. Each choice must have a functional or expressive reason rooted in the specific project.

For substantial work, keep a **compact design contract** (in your implementation notes or the project if it will help maintainers): intended character; content hierarchy; layout principles; type roles; color roles; spacing/density; component and interaction conventions; responsive strategy. Specify relationships and reusable tokens where useful, not arbitrary pixel values before context. The contract is a consistency tool, not a permanent constraint: revise it if rendered evidence shows a better direction.

## 3. Handle references without aesthetic capture

When a reference website, screenshot, skill, framework, or visual example is supplied:

1. Determine its role: a desired match, an existing brand requirement, functional evidence, or loose inspiration. An explicit request to match takes precedence.
2. Identify **transferable principles** (e.g. information organization, hierarchy, interaction clarity) separately from **surface choices** (e.g. distinctive arrangement, palette, type treatment, decorative motifs).
3. Choose independently for the current product. Reuse a component or convention where appropriate, not the source's full visual signature by default.
4. Compare the result with the project's intent—not with how faithfully it resembles a reference unless fidelity was requested.

Read [reference boundaries](references/reference-boundaries.md) when examples, other design skills, or inspiration material might strongly influence the result.

## 4. Implement one coherent interface

- Respect existing code, constraints, dependencies, and established component conventions. Prefer incremental changes for an existing product unless the brief asks for a redesign.
- Encode repeated decisions in reusable tokens, styles, and components; avoid visually similar elements implemented with arbitrary divergent values.
- Let different content types use different treatments when their purpose calls for it, while maintaining shared visual logic.
- Make navigation, forms, dialogs, filters, feedback, and state changes behave as they appear to behave. Include important empty, error, loading, focus, disabled, and success states where relevant.
- Use real or explicitly identified placeholder content, with realistic lengths and edge cases. Do not disguise missing content with invented credibility signals.
- Protect semantic structure, keyboard operation, visible focus, legible contrast, sensible touch targets, reduced-motion preferences where motion exists, and responsive behavior.
- Favor the smallest implementation complexity that can deliver and maintain the intended result. Do not introduce animation, dependencies, or abstractions merely to signal polish.

## 5. Inspect the rendered result, then refine

**Source code is not visual proof.** If a browser, preview, screenshot, or testing tool is available, run the interface and inspect rendered screens across the relevant viewport range. Check whole-page rhythm and local details, content-heavy states, interactions, overflow, alignment, typography, and consistency. Fix observed defects and inspect again; prioritize blockers and systemic inconsistencies before decorative refinements.

Use [rendered review protocol](references/rendered-review.md) for substantial multi-page work or when visual and interaction defects are reported. Automated tests help but do not substitute for rendered inspection. Do not report a screenshot review, accessibility audit, or functional test that was not actually performed. If inspection tools are absent, perform available code-level checks and state the verification gap precisely.

## Completion standard

Before calling the work complete, ask:

1. Does the interface let its intended users accomplish the important tasks without unnecessary friction?
2. Does its presentation fit this particular product and its actual content, rather than a generic aesthetic recipe?
3. Do the sections, components, typography, spacing, and interaction states form a coherent system—with justified differences?
4. Is the result functional, accessible within scope, responsive, and maintainable?
5. What was actually verified, and what remains unverified?

Report the result and material tradeoffs concisely. Do not declare the work "premium," "human-designed," "pixel-perfect," or "production-ready" without supporting evidence. If issues remain, name them specifically.

## Skill development

This is intentionally an instruction-only skill. It supplies a process and quality boundaries, **not a gallery, theme, component kit, or mandatory design language**. For regression testing of the skill itself, see [evaluation protocol](evals/rubric.md). Do not read evaluation cases while designing a user's interface unless explicitly evaluating the skill.
