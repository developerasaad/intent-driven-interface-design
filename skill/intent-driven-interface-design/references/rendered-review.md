# Rendered review protocol

Use for substantial UI builds, redesigns, and reviews of quality problems. Tailor checks to the actual interface rather than mechanically inspecting every item on a small task.

## Verify what exists

1. Identify implemented routes, states, layouts, and target devices. Start the actual project using its documented commands; do not silently replace its toolchain.
2. Open rendered pages using an available browser or preview. Capture representative screenshots if supported; check at least a narrow mobile width and a typical desktop width for responsive products, plus an intermediate width where layout transitions are uncertain. Viewport choices should reflect project analytics or platform requirements when available.
3. Examine primary tasks from start to end. Exercise relevant menus, forms, validation, errors, keyboard interactions, and state transitions. If the environment cannot exercise them, distinguish inspection from functional verification.
4. Compare each screen with the project-specific design contract, then inspect the screen on its own merits.

## Two independent review passes

**System-level:**
- Is the most important information/action identifiable without relying on decoration?
- Do content density, hierarchy, line length, visual rhythm, and navigation fit actual use?
- Are repeated elements consistent across pages? Are exceptions purposeful?
- Does the responsive layout preserve hierarchy and avoid overflow or awkward reordering?
- Does the design seem appropriate for this user's domain and brand rather than generic or reference-copied?

**Component-level:**
- Inspect alignment, typography roles, spacing relationships, edge cases, truncation, and long content.
- Verify controls have visible meaning and expected affordances, with hover/focus/active/disabled/error states when relevant.
- Check contrast and focus visibility, labels, semantics, keyboard access, and reduced-motion behavior where applicable.
- Check images and icons for relevance, distortion, accessibility text, and licensing/asset provenance if applicable.
- Inspect blank, loading, failure, and no-results states for primary flows.

## Prioritization

1. Broken flows, inaccessible essential controls, content loss, serious responsive failures.
2. Information architecture and hierarchy problems; cross-page component drift.
3. Readability, consistency, spacing, content treatment, visual balance.
4. Nonessential polish.

Treat all subjective aesthetic judgments as hypotheses. State the observed issue (e.g. "body copy wraps into very short lines at 390px") and the proposed correction instead of just calling a page "bland." Don't destroy a coherent design to address one small flaw.

## Exit criteria and evidence

Re-render after consequential fixes. Record the route/state/viewports actually reviewed and any relevant test or lint/build outcomes. If screenshots or a browser were unavailable, say "not visually inspected" rather than implying otherwise. Automated accessibility tools do not replace manual keyboard/screen-reader checks; claim only what was tested. Stop when meaningful defects are addressed or report outstanding limitations and their impact.
