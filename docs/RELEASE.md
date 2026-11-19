# Publishing guide

The package, repository and GitHub Pages deployment are independent. A green build does not mean any of them are already public.

## 1. Prepare the repository

Create a public GitHub repository named `intent-driven-interface-design` under your account (or change all repository references if you choose another name). Push these files to `main`. Do not commit `node_modules/`, `_site/`, or the generated example's `dist/` directory. Enable branch protection or rulesets requiring the `Checks` workflow before merging into `main`.

For GitHub Pages, open **Settings → Pages → Build and deployment → Source: GitHub Actions**. Run the `GitHub Pages` workflow or push a site change. The site is expected to be published as a project page at `https://developerasaad.github.io/intent-driven-interface-design/` if the owner and repository keep those names. Verify the deployed URL before linking to it publicly.

## 2. Add your actual OpenCode example

Copy the original project into `examples/opencode-template/`. Keep its license and attribution requirements intact, including those of dependencies and assets. The example must have its own committed `package.json` and `package-lock.json`, with `npm run build` writing `dist/index.html`. Configure the static asset/router base for `/<repository-name>/demo/`—the workflow supplies `BASE_PATH`, `PUBLIC_BASE_PATH`, and `VITE_BASE`, but your build configuration must actually use the applicable variable. For Vite, for example, read `process.env.VITE_BASE` in the Vite config and set `base` from it.

Build locally, check the generated URLs, then let the Pages workflow deploy it at `/demo/`. The published site must say whether this is a single showcase or a measured evaluation. Do not claim the example proves the skill outperforms other approaches without a fair comparison.

## 3. Publish on npm

The `package.json` name is provisional until confirmed on npm. Check that the name is available and not confusingly similar to an existing package. If you rename it, update the CLI command, README, website, package metadata and tests before release.

Run all checks and examine the exact tarball:

```sh
npm ci
npm run validate
npm test
npm pack --dry-run
```

For a **first publish**, authenticate to npm with your own account and required two-factor authentication and publish manually:

```sh
npm login
npm publish --access public
```

Never place an npm token in the repository. The first version must be published before configuring a trusted publisher through the npm package's settings. Once that package exists, configure **Trusted publishing** for GitHub Actions and set the exact GitHub owner, repository, and workflow filename `publish.yml` (filename only, not its path). Enable **Allow npm publish** for this trusted publisher; newly configured publishers otherwise allow staged publishing by default. Follow the current npm instructions for any one-time verification requirements. This allows later releases through GitHub Actions without an npm publish token and with provenance. Do not assume a release succeeded until the package appears on the registry.

For subsequent versions, update `package.json` and `package-lock.json`, `CHANGELOG.md`, run tests, commit, and push a matching version tag such as `v0.1.1`. The tag triggers the publish workflow. Ensure the configured trusted publisher exactly matches the repository and workflow. Prefer a protected release process and review the tarball before tagging.

## 4. Verify publicly

From a fresh directory, run `npx intent-driven-interface-design@<published-version> install --dir .`, then check that `.opencode/skills/intent-driven-interface-design/SKILL.md` and its references were installed. Test `status` and `uninstall`. Open the GitHub Pages URL and confirm the site and `/demo/` work on a phone-sized viewport. Check Pages and npm permissions if a workflow fails.

## 5. Keeping documents current

When a command, feature, or installation path changes, update `README.md`, the site, tests and the relevant workflow together. Report what was actually checked. Read `AGENTS.md` for the documentation voice expected when using OpenCode.
