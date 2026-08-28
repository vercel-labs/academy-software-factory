# Academy Software Factory

This is the project for the Vercel Academy course **Creating a Software Factory**.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel-labs%2Facademy-software-factory&project-name=signalworks-software-factory&repository-name=signalworks-software-factory)

## Branches

- `main` is the deployable course starter. It includes GitHub intake, repository sandbox infrastructure, the notification SDK, and four case fixtures. Learners build the factory from this branch.
- `solution` is the completed reference. It includes five root tools, Investigator, Builder, and Verifier subagents, approval gates, draft pull request policy, traces, and evaluations.

A fresh clone should remain on `main`.

## Repository map

```text
agent/                         # eve agent, channels, policies, and stations
fixtures/issues/               # prompts for the four course cases
fixtures/runs/                 # recorded outcomes used before live model calls
packages/notification-sdk/     # sample TypeScript product the factory maintains
evals/                         # regression evaluations on the solution branch
```

The upstream repository is the course template. Your personal fork is the factory's target: it is cloned into sandboxes, receives `factory/*` branches, and hosts draft pull requests.

## Setup

Clone your personal fork and install dependencies:

```bash
git clone https://github.com/YOUR_GITHUB_NAME/signalworks-software-factory.git
cd signalworks-software-factory
git switch main
pnpm install
pnpm exec eve link
```

Use the latest Vercel CLI to create and attach a managed GitHub connector:

```bash
vercel connect create github --name signalworks-factory --triggers
vercel connect attach github/signalworks-factory --triggers --trigger-path /eve/v1/github
vercel connect list
```

During GitHub App installation, grant access only to the personal course repository. Vercel Connect supplies short-lived installation tokens, so the project does not need a personal access token, webhook secret, or GitHub App private key.

Add the course configuration to the linked Vercel project, then pull it and the local OIDC token into `.env.local`:

```bash
vercel env add FACTORY_REPO --value YOUR_GITHUB_NAME/signalworks-software-factory
vercel env add FACTORY_LABEL --value factory
vercel env add FACTORY_BRANCH_PREFIX --value factory/
vercel env add FACTORY_SETUP_COMMAND --value "pnpm install --frozen-lockfile"
vercel env add GITHUB_CONNECTOR --value github/signalworks-factory
vercel env pull .env.local
```

Confirm that `.env.local` contains the non-secret course values below. Do not remove the OIDC values pulled by Vercel:

```dotenv
FACTORY_REPO=YOUR_GITHUB_NAME/signalworks-software-factory
FACTORY_LABEL=factory
FACTORY_BRANCH_PREFIX=factory/
FACTORY_SETUP_COMMAND=pnpm install --frozen-lockfile
GITHUB_CONNECTOR=github/signalworks-factory
```

`GITHUB_CONNECTOR` must match the UID printed by `vercel connect list`.

## Validate the current branch

```bash
pnpm install
pnpm validate
```

The starter reports zero tools and zero subagents. The solution reports five tools and three subagents.

## Invoke locally

After the course has added the root tools and instructions, invoke a fixture without the TUI:

```bash
pnpm exec eve invoke "$(cat fixtures/issues/bug-example.md)"
```

For an interactive run, use `pnpm exec eve dev` and paste the fixture into the TUI.

## Inspect the solution

```bash
git switch solution
pnpm validate
pnpm trace
pnpm exec eve eval --list
```

Return to the starter before beginning the course:

```bash
git switch main
```
