# Intent-Driven Interface Design

A portable Agent Skill for building interfaces around the product, the people using it, and the content it needs to show. It gives a coding agent a way to make and check design decisions without telling it every website should share the same visual style.

It isn't a component library or a gallery of examples. The skill doesn't supply color palettes, recommended fonts, or layouts to imitate. It asks the agent to understand the task, make coherent choices, implement them, and review what was actually rendered.

The npm installer is dependency-free and uses the standard Agent Skills folder structure. The skill can also be copied manually.

## Install

Requires Node.js 20 or newer. To install into the current project for [OpenCode](https://opencode.ai/docs/skills):

```sh
npx intent-driven-interface-design@latest install
```

This puts the complete skill in `.opencode/skills/intent-driven-interface-design/`. To install it for all your OpenCode projects:

```sh
npx intent-driven-interface-design@latest install --scope global
```

To install in the portable `.agents/skills/` directory instead:

```sh
npx intent-driven-interface-design@latest install --agent agents
```

For a different project directory, append `--dir /path/to/project`. Check an existing installation or remove one with:

```sh
npx intent-driven-interface-design@latest status
npx intent-driven-interface-design@latest uninstall
```

The installer will **not overwrite an existing directory**. `install --force` moves the original directory to a sibling backup before replacing it. If files were modified, `uninstall` refuses to remove them; `uninstall --force` moves them to a backup instead. Use `--dry-run` to inspect an action without changing files. Run `--help` for the full set of options.

**Release status:** these are the intended npm commands. They become available from the public npm registry only after the package is published. Until then, run the local CLI with `node bin/intent-driven-interface-design.mjs install` from a checkout.

## What the skill does

1. Establish the site's purpose, users, content, existing identity, and constraints before choosing a layout.
2. Explore design directions when there is a real decision to make; don't force a fixed set of concepts on every task.
3. Use references to understand principles without borrowing their entire visual identity, unless a match is explicitly requested.
4. Keep repeated elements consistent through project-specific design decisions and reusable components.
5. Render and review the result when the environment permits it. State verification limits when it doesn't.

The model still makes judgment calls. This skill can't guarantee original work, visual quality, or browser compatibility. It also doesn't replace accessibility testing or human review.

## Try it in OpenCode

Open a project with the skill installed and ask OpenCode to design or improve an interface. For example:

> Review this app's primary user tasks, then redesign the dashboard around them. Keep the existing product identity, explain any major tradeoffs, and check the rendered result at desktop and mobile widths.

OpenCode discovers skills from `SKILL.md` metadata. Whether the agent uses an available skill depends on the task and the host's skill-loading behavior. See [OpenCode's skill documentation](https://opencode.ai/docs/skills).

## Example website and evaluation

An OpenCode-built example belongs in [`examples/opencode-template/`](examples/opencode-template/). Its source isn't bundled with this initial repository package, so no result or claim about its design quality has been invented. When the real project is added, the Pages workflow can build and publish it at `/demo/` alongside a small project website.

The skill has 12 evaluation cases and a comparison rubric in [`skill/intent-driven-interface-design/evals/`](skill/intent-driven-interface-design/evals/). These are a starting point for testing, **not evidence that the skill has beaten an unassisted model**.

## Development

```sh
npm ci
npm run validate
npm test
npm pack --dry-run
npm run build:site
```

The skill validator requires Python 3. The npm CLI and its tests use only Node.js built-in modules. The static Pages site doesn't need a JavaScript framework.

For publishing instructions, see [`docs/RELEASE.md`](docs/RELEASE.md). For contribution expectations and writing style, see [`CONTRIBUTING.md`](CONTRIBUTING.md) and [`AGENTS.md`](AGENTS.md).

## License

MIT. You can use, modify, redistribute, and sell the software, including in commercial projects, as long as you keep the required copyright and license notice. See [`LICENSE`](LICENSE).
