# Junban Desk privacy policy

[← Back to user guide](index.md)

**Effective date:** 4 July 2026

This policy describes how **Junban Desk** (the app) handles data. Junban Desk is
published on the Atlassian Marketplace by **Collaboration Services** ("we",
"us"). It applies to the app only; your use of Jira itself is governed by
[Atlassian's privacy policy](https://www.atlassian.com/legal/privacy-policy).

## Summary

- Junban Desk **stores no data of its own** — nothing is persisted outside your
  Atlassian site.
- Junban Desk makes **no external network calls** — it talks only to the Jira
  REST API inside Atlassian's Forge platform.
- Every request runs **as the logged-in user**, so Jira's permission model
  always applies.

## What data the app processes

To render the queue workspace, the app reads the following from your Jira
site, in-flight only, at the moment a user loads or acts on the page:

- Issue data: summaries, descriptions, statuses, timestamps
- Comment threads, including internal agent notes
- User display names and account IDs (reporters, assignees, assignable users)

When an agent replies, adds an internal note, transitions, or assigns a
ticket, the app writes that change to Jira through the Jira REST API — exactly
as if the agent had done it in Jira directly.

## What data the app stores

**None.** The app runs entirely on Atlassian's
[Forge](https://developer.atlassian.com/platform/forge/) platform and has no
database, no external storage, and no analytics or tracking. Data read from
Jira is processed in memory to answer the request that asked for it and is not
retained afterwards.

The app's frontend keeps three small UI preferences (selected filter, selected
ticket key, and pane-divider position) in your **browser's local storage** on
your own device. These never leave your browser.

## Where data goes

Nowhere outside Atlassian. The app declares no external egress in its Forge
manifest, which Atlassian enforces at the platform level: the app is
technically incapable of sending data to non-Atlassian hosts.

## Personal data rights (GDPR and similar)

Because the app persists no personal data, there is nothing held by us to
report or erase. Requests concerning personal data in your Jira site (issue
content, comments, profiles) are handled by your Jira administrators and
Atlassian's own data-subject tooling.

## Contact

Questions about this policy: [support@confluenceservice-dev.atlassian.net](mailto:support@confluenceservice-dev.atlassian.net)
or via our [support portal](https://confluenceservice-dev.atlassian.net/servicedesk/customer/portals).

## Changes

We will update this page if the app's data handling ever changes (for
example, if a future version adds storage). Material changes will be noted in
the app's [changelog](https://github.com/thomasbergernz/junban-desk/blob/main/CHANGELOG.md).
