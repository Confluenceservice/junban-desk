# Contributing to re-desk

Thanks for your interest in contributing! This is a small project, so the process is
deliberately lightweight.

If you use an AI coding assistant, point it at [AGENTS.md](AGENTS.md) — it documents the
architecture, commands, and constraints agents (and humans) should follow.

## Development setup

Requirements: Node.js 22.x or 24.x LTS and the
[Forge CLI](https://developer.atlassian.com/platform/forge/getting-started/)
(`npm install -g @forge/cli`, then `forge login`). You'll need your own Atlassian
development site with a Jira Service Management project.

```bash
# 1. Fork and clone, then install dependencies (root + frontend)
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

> **Never commit your real `manifest.yml`** — it contains your private app id. It's
> gitignored; keep it that way. `manifest.yml.example` is the shared template.

## Development loop

- Backend (resolver) changes: `forge tunnel` hot-reloads them.
- Frontend changes: re-run `npm run build:queue`, then redeploy (Custom UI has no hot reload).
- Manifest changes: redeploy; scope changes also need `forge install --upgrade`.

## Before you open a PR

1. `npm run lint` — ESLint clean
2. `forge lint` — manifest valid (if you touched `manifest.yml.example`)
3. `npm test` — Vitest resolver suite passes
4. Frontend changes have no automated coverage yet — verify manually in the browser and
   describe what you checked in the PR description.

Test conventions live in [TESTING.md](TESTING.md): colocate tests (`foo.js` → `foo.test.js`),
mock all Forge/Jira boundaries, and add a regression test reproducing the exact precondition
for every bug you fix.

## Commit and PR style

- [Conventional Commits](https://www.conventionalcommits.org/): `feat:`, `fix:`, `docs:`,
  `test:`, `chore:` — scoped where useful (e.g. `fix(qa): …`).
- Keep PRs small and focused: one logical change per PR.
- Explain the *why* in the PR description, not just the what.

## Reporting bugs and requesting features

Open a GitHub issue. For bugs, include reproduction steps, expected vs actual behavior,
and relevant `forge logs` output if it's a backend issue.

## Security

Please do **not** open public issues for security vulnerabilities. Report them privately
via [GitHub Security Advisories](../../security/advisories/new).

## License

By contributing, you agree that your contributions are licensed under the
[Apache 2.0 License](LICENSE).
