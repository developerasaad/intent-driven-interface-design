# Skill evaluation protocol

This document is for evaluating the skill, not for routine UI delivery. The goal is to detect both obvious defects and the subtler failure of imposing a signature aesthetic across unrelated tasks.

## Experimental setup

For each test prompt in `cases.json`, use the same model, task context, runtime budget, dependencies, and allowed tools in at least two blinded conditions: **without this skill** and **with this skill**. Where useful, include a third condition using another design skill. Randomize order and repeat selected cases; stochastic outputs should not be judged from a single run. Preserve the original user prompt without adding aesthetic cues during evaluation.

Use actual rendered interfaces and functional checks wherever feasible. Do not infer success from agent commentary. Collect final artifacts, screenshots at representative widths, accessibility findings, and whether the main flow functions. Log time/tool budget so a slow, overengineered skill is not rewarded merely for doing more work.

## Score each dimension from 0 to 4

| Dimension | 0 | 2 | 4 |
| --- | --- | --- | --- |
| Task fit | Main user purpose missed | Partially supports task | Clearly supports real tasks and content |
| Coherence | Severe style/interaction drift | Some inconsistent rules | Consistent system with justified variation |
| Distinctiveness and reference independence | Unjustified copying or generic recipe | Mixed independent and templated choices | Specific design direction grounded in project |
| Usability and accessibility | Critical blockers | Usable with notable gaps | Strong navigation, semantics, states, accessibility within test scope |
| Engineering and responsiveness | Broken or unmaintainable | Mostly working with defects | Reliable across tested sizes and states, maintainable |
| Evidence and efficiency | Fabricated verification or severe thrashing | Partial evidence/overwork | Accurate verification, proportionate effort |

Do not average away critical defects. A broken primary task, serious inaccessible blocker, invented testimonial, or false claim of testing is an automatic fail for that run regardless of aesthetics. Score distinctiveness **within project**, not novelty for its own sake.

## Cross-task bias test

After several unrelated prompts, compare whether outputs repeatedly use the same hero composition, typography personality, color relationships, card structure, or navigation pattern despite differing user needs. A recurring pattern is not automatically wrong; require an explanation in terms of shared constraints before labeling it skill-induced bias. Compare frequency against the same model without the skill.

## What improvement would count

The skill is useful only if it yields consistently better task fit, coherence, and verification without appreciably reducing legitimate stylistic range or adding disproportionate planning overhead. Track per-dimension changes, critical failures, and variance across prompts. Modify the skill when real tests show a repeatable problem; do not add stylistic prohibitions from a single disliked output.

## Recommended manual workflow

1. Test initial positive/negative trigger cases.
2. Run each relevant case without skill and with skill. Blind filenames/labels for reviewers.
3. Capture rendered output and record completed tasks, tested viewports, and gaps.
4. Have at least two reviewers score independently where possible; review disagreements.
5. Inspect whether the new instructions caused copied aesthetics, rigid procedures, or unhelpful verbosity.
6. Update the skill only for supported failure patterns and re-run regression cases.

`cases.json` is a task set, not a set of exemplar designs. It intentionally has no expected palettes, fonts, grids, or visual answer keys.
