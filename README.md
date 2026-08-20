# Academy Software Factory

This is the project for the Vercel Academy course **Creating a Software Factory**.

## Branches

- `main` is the deployable course starter. It includes GitHub intake, repository sandbox infrastructure, the notification SDK, and four case fixtures. Learners build the factory from this branch.
- `solution` is the completed reference. It includes five root tools, Investigator, Builder, and Verifier subagents, approval gates, draft pull request policy, traces, and evaluations.

A fresh clone should remain on `main`.

## Validate the current branch

```bash
pnpm install
pnpm validate
```

The starter reports zero tools and zero subagents. The solution reports five tools and three subagents.

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
