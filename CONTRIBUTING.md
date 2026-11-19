# Contributing

Bug reports, documentation fixes and focused pull requests are welcome.

Before changing the skill, read `SKILL.md` and the evaluation rubric in `skill/intent-driven-interface-design/evals/rubric.md`. The goal is to improve the quality of design decisions without introducing a standard look.

## Local checks

Use Node.js 20 or newer and Python 3. Then run:

```sh
npm ci
npm run validate
npm test
npm pack --dry-run
npm run build:site
```

If you change installer behavior, add a test for the new path or failure mode. If you change the website, test keyboard navigation and mobile layout. If you change the skill, describe the expected improvement and whether you compared outputs with and without it. No model benchmark has been completed for the initial release.

Keep pull requests limited to one purpose. State what you tested and what you could not test. Do not upload credentials or copy third-party designs or assets without checking their terms.
