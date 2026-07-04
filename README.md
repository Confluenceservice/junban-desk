# Junban Desk

A custom queue workspace for Jira Service Management, built on [Atlassian Forge](https://developer.atlassian.com/platform/forge/).

Junban Desk replaces the default JSM queue views with a single, focused agent workspace:

- **"Needs action" queue** — every open ticket that is not waiting on the customer, oldest first
- **Filters** — All / Unassigned / Assigned to me (remembered across reloads)
- **Inline ticket detail** — collapsible description and the full comment thread, with internal notes clearly marked
- **Reply without leaving the queue** — customer reply or internal note, with a Zendesk-style status-at-submit dropdown
- **Assignment** — assign to yourself or others directly from the detail pane
- **Auto-refresh** — the queue polls in the background, pausing while the tab is hidden

The frontend is Forge Custom UI (React + Vite in a sandboxed iframe). The backend is a set of
Forge resolvers calling the Jira REST API as the logged-in agent, so Jira's own permission
checks always apply.

## Documentation and support

- **User guide:** <https://thomasbergernz.github.io/junban-desk/>
- **Installation:** <https://thomasbergernz.github.io/junban-desk/install>
- **Support:** <https://thomasbergernz.github.io/junban-desk/support>
- **Privacy policy:** <https://thomasbergernz.github.io/junban-desk/privacy>
- **Security policy:** [SECURITY.md](SECURITY.md)

The easiest way to use Junban Desk is the Atlassian Marketplace listing (paid, per user).
The instructions below are for running your own copy from source.

## Project layout

```
manifest.yml.example   Forge manifest template (copy to manifest.yml)
src/resolvers/         Backend resolvers (queue, ticket, reply, assign)
static/queue/          Custom UI frontend (React + Vite)
```

## Getting started

Requirements: Node.js 22.x or 24.x LTS and the [Forge CLI](https://developer.atlassian.com/platform/forge/getting-started/) (`npm install -g @forge/cli`, then `forge login`).

```bash
# 1. Install dependencies (root + frontend)
npm install
npm --prefix static/queue install

# 2. Create your manifest and register your own app id
cp manifest.yml.example manifest.yml
forge register

# 3. Build the frontend, then deploy and install
npm run build:queue
forge deploy -e development
forge install   # choose Jira and your site
```

The app appears as **Junban Desk** in the sidebar of your JSM project.

### Development loop

- Backend (resolver) changes: `forge tunnel` hot-reloads them.
- Frontend changes: re-run `npm run build:queue`, then refresh (no hot reload for Custom UI).
- Manifest changes: redeploy; scope changes also need `forge install --upgrade`.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for setup, testing, and PR guidelines. If you work
with an AI coding assistant, [AGENTS.md](AGENTS.md) documents the architecture and
constraints it should follow.

## License

[Apache 2.0](LICENSE)
