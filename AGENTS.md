# AGENTS.md

Guidance for AI coding agents (and humans) working on **re-desk** — an Atlassian Forge Cloud
app that replaces the default Jira Service Management queue views with a single "needs action"
workspace: ticket table + inline detail pane (comment thread, reply, internal notes,
status-at-submit, assignment).

Human contributors: see [CONTRIBUTING.md](CONTRIBUTING.md) for setup and PR guidelines.

## Architecture

- **Frontend: Forge Custom UI** (React + Vite in a sandboxed iframe). This is a deliberate
  design decision — do **not** convert it to UI Kit or import `@forge/react` components.
  Runtime: `nodejs24.x`, arm64.
- **Backend: Forge resolvers** calling the Jira REST API via `api.asUser()`, so Jira's own
  permission checks always apply. Keep it that way — do not switch resolvers to `asApp()`.

## Layout

- `manifest.yml.example` — manifest template. Copy to `manifest.yml` and run `forge register`
  to mint your own app id. **Never commit the real `manifest.yml`** (it carries a private app
  id; it is gitignored). One `jiraServiceManagement:queuePage` module → `queue` resource
  (`static/queue/dist`) + `resolver` function. Scopes: `read:jira-work`, `write:jira-work`,
  `read:jira-user`.
- `src/index.js` → `src/resolvers/index.js` — backend resolvers, all `asUser()`:
  - `getQueue` — needs-action JQL (`statusCategory != Done AND status != "Waiting for customer"`,
    project key from queue-page context; falls back without the status clause on 400)
  - `getTicket` — fields + comment thread (`jsdPublic === false` = internal note) + transitions
  - `submitReply` — comment (internal via `sd.public.comment` property) ± workflow transition
  - `getAssignableUsers`, `assignIssue` (`'me'` → context accountId, `null` unassigns)
  - ADF helpers: `adfToText`, `textToAdf`
- `static/queue/` — Vite + React Custom UI. `App.jsx` (filter state persisted to localStorage,
  30s background poll, paused when the tab is hidden), `QueueTable.jsx`, `TicketDetail.jsx`,
  `styles.css`. Vite `base: ''` is mandatory (iframe-relative asset paths).
- `src/resolvers/index.test.js` — Vitest unit tests; see `TESTING.md` for conventions.

## Commands

Run Forge commands from the repo root.

- `npm run build:queue` — **required before every deploy/tunnel** (Custom UI has no hot reload)
- `npm run lint` — ESLint; `forge lint` — manifest validation
- `npm test` — Vitest resolver suite (mocked Forge boundaries, no network)
- `forge deploy --non-interactive -e development`
- `forge install --non-interactive --site <your-site>.atlassian.net --product jira --environment development`
  (add `--upgrade` only after scope/egress changes)
- `forge logs -e development --since 15m` — backend diagnostics

## Forge platform rules

- Always pass `--non-interactive` to `deploy` and `install`; never to other commands.
- Validate `manifest.yml` with `forge lint` after any manifest change.
- Scope or egress changes require a redeploy **and** `forge install --upgrade`.
- When tunnelling: manifest changes require redeploy + tunnel restart; resolver-only code
  changes hot-reload through the tunnel. Frontend changes always need `npm run build:queue`
  and a redeploy.
- Never deploy with `--no-verify` unless explicitly asked.
- When a Forge CLI command fails, surface the failing output verbatim; use `--verbose` to
  troubleshoot.

## Constraints

- Keep resolvers `asUser()` — permission checks stay Jira's, and the app needs no extra
  authorization logic.
- Minimise scopes; add new ones only when strictly required, and remember the
  deploy + install `--upgrade` dance.
- Custom UI iframe: interact with Jira only via `@forge/bridge` (frontend) and resolvers
  (backend). No direct DOM access to the parent page.
- Test conventions (`TESTING.md`): colocate `foo.test.js` next to `foo.js`, mock all
  Forge/Jira boundaries, add a regression test with the exact precondition for every bug fix.
