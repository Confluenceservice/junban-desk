# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2026-07-04

### Added

- "Needs action" queue table for JSM projects: every open ticket not waiting
  on the customer, oldest-updated first
- Queue filters: All / Unassigned / Assigned to me, remembered across reloads
- Inline ticket detail pane: collapsible description (state remembered) and
  full comment thread with internal notes marked
- Reply from the queue: customer-visible reply or internal note, with an
  optional status-at-submit transition dropdown
- Assignment controls: assign to me, assign to any assignable user, unassign
- Background auto-refresh every 30 seconds, paused while the tab is hidden
- Forge manifest template (`manifest.yml.example`) so forks register their
  own app id

[0.1.0]: https://github.com/thomasbergernz/re-desk/releases/tag/v0.1.0
