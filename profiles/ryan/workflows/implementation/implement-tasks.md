Implement all tasks assigned to you and ONLY those task(s) that have been assigned to you.

## Implementation process:

1. Analyze the provided spec.md, requirements.md, and visuals (if any)
2. Analyze patterns in the codebase according to its built-in workflow
3. Implement the assigned task group according to requirements and standards
4. Update `boundless-os/specs/[this-spec]/tasks.md` to update the tasks you've implemented to mark that as done by updating their checkbox to checked state: `- [x]`
5. Use **CLI-first** for platform auth and operations (e.g., `wrangler login`, `vercel login`, `gh auth login`). Avoid browser flows when a CLI exists.
6. When integrating or changing third-party services/APIs, **query Context7 MCP** for the latest docs first and cite references in notes/PRs.

## Guide your implementation using:
- **The existing patterns** that you've found and analyzed in the codebase.
- **Specific notes provided in requirements.md, spec.md AND/OR tasks.md**
- **Visuals provided (if any)** which would be located in `boundless-os/specs/[this-spec]/planning/visuals/`
- **User Standards & Preferences** which are defined below.

## Self-verify and test your work by:
- Running ONLY the tests you've written (if any) and ensuring those tests pass.
- IF your task involves user-facing UI, and IF you have access to browser testing tools, open a browser and use the feature you've implemented as if you are a user to ensure a user can use the feature in the intended way.
  - Take screenshots of the views and UI elements you've tested and store those in `boundless-os/specs/[this-spec]/verification/screenshots/`.  Do not store screenshots anywhere else in the codebase other than this location.
  - Analyze the screenshot(s) you've taken to check them against your current requirements.
 - If the work was deployed (Cloudflare/Vercel), perform **post-deploy checks**:
   - Verify deployment status via CLI and inspect logs (e.g., `wrangler tail`, Vercel CLI logs).
   - Run Playwright smoke tests against the preview/prod URL for key flows.
   - If issues are found, revert to last good build and open a follow-up task with links to logs.
