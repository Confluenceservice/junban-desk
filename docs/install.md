# Installation and setup

[← Back to user guide](index.md)

## Install from the Atlassian Marketplace

1. In Jira, go to **Apps → Explore more apps** (you need Jira admin
   permission).
2. Search for **Junban Desk** and choose **Install** (or start a free trial).
3. Accept the requested permissions (listed below).

That's it — there is nothing to configure. Open any Jira Service Management
project and choose **Junban Desk** in the project sidebar.

## Requirements

- Jira Service Management (Cloud). The workspace appears in JSM projects only.
- Agents need the usual JSM agent permissions in the project (browse issues,
  add comments, transition issues, assign issues). Junban Desk enforces nothing of
  its own — see [Permissions](#permissions).

## Permissions

Junban Desk requests three OAuth scopes, the minimum needed for the workspace:

| Scope | Why |
| --- | --- |
| `read:jira-work` | Load the queue, ticket details, and comment threads |
| `write:jira-work` | Post replies and internal notes, transition and assign tickets |
| `read:jira-user` | Show reporter/assignee names and the assignable-user dropdown |

All Jira API calls run **as the logged-in user** (Forge `asUser()`), so Jira's
own permission checks always apply. An agent can never see or do anything
through Junban Desk that they couldn't do in Jira directly.

The app makes **no external network calls** and **stores no data outside
Atlassian** — see the [privacy policy](privacy.md).

## Installing from source (self-managed)

Junban Desk is open source (Apache 2.0). If you prefer to run your own copy on
your own Forge app id, follow the developer instructions in the
[README](https://github.com/thomasbergernz/junban-desk#getting-started).
