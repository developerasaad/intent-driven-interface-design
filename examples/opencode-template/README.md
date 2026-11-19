# OpenCode example — add original source here

The user-created OpenCode test/template has **not** been supplied with this package. Its files must be copied here before the example can be deployed. Do not recreate it from assumptions, add a lookalike, or describe it as a completed demo.

For a Node-based static frontend, place the real project files here (including its `package.json` and lockfile), and make `npm run build` produce `dist/index.html`. GitHub Pages will serve that build from `/intent-driven-interface-design/demo/` in the default project-page setup. Configure asset paths and router base accordingly; a framework such as Next.js may need a dedicated static export and base-path setup.

The workflow builds the example only when `package.json` exists. It refuses to package a `dist/` directory that does not contain `index.html`. If no example exists, GitHub Pages publishes the documentation without presenting a fabricated demo.

Do not copy the example into `skill/`. It's evaluation material, not a mandatory design reference for agents.
