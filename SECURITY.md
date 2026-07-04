# Security policy

## Reporting a vulnerability

Please do **not** open public issues for security vulnerabilities. Report them
privately via
[GitHub Security Advisories](https://github.com/thomasbergernz/junban-desk/security/advisories/new).

Include what you found, how to reproduce it, and the impact you believe it has.
We will acknowledge reports within 2 business days and keep you informed while
we investigate and fix.

## Supported versions

Junban Desk is a Forge Cloud app: Marketplace installations are always on the
latest released version, so fixes ship to everyone as soon as they are
deployed. Self-managed installations (from source) should track `main`.

## Security model

- All Jira API calls run **as the logged-in user** (`asUser()`); Jira's own
  permission checks apply to every read and write.
- The app requests only three scopes: `read:jira-work`, `write:jira-work`,
  `read:jira-user`.
- The app declares **no external egress** and stores no data outside
  Atlassian — see the [privacy policy](docs/privacy.md).
