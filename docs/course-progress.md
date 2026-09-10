# solution-remi course implementation

`solution-remi` implements the 14 lessons in [Creating a Software Factory](https://vercel.com/academy/creating-a-software-factory). Each lesson has its own commit, followed by focused fixes and verification work. The starting commit is `a481667` on upstream `main`.

The course code is implemented. Local checks and two live routing evaluations pass. Repository-backed model runs, approval resumption, deployment, and issue-to-draft delivery remain unverified until a personal target repository and linked Vercel project are configured.

## Walk the commits

Use `git show COMMIT` to inspect a lesson without changing your checkout. To run an earlier checkpoint, create a separate worktree at that commit and install its pinned dependencies. The table lists code added and locally verified discovery; it does not imply that every live lesson checkpoint was run.

| Lesson | Commit | Implementation and checkpoint |
| --- | --- | --- |
| [1.1 Trace outcomes](https://vercel.com/academy/creating-a-software-factory/would-you-merge-this) | `701fde8` | `pnpm trace` reads all four recordings in sorted order. |
| [1.2 Work orders](https://vercel.com/academy/creating-a-software-factory/carry-the-receipts) | `b6c5705` | Typed issue/evidence records, server-created timestamps, seven-day lifetime, general delegation disabled. Two root tools. |
| [2.1 Normalize intake](https://vercel.com/academy/creating-a-software-factory/normalize-the-request) | `13fe901` | Validate trusted issues; normalize missing/null bodies. |
| [2.2 Classify and route](https://vercel.com/academy/creating-a-software-factory/classify-then-authorize) | `6213964` | Structured AI SDK classification and deterministic approval/lane policy. Four root tools. |
| [2.3 Test stopping](https://vercel.com/academy/creating-a-software-factory/test-the-stopping-rules) | `c659ba3` | Clarification, documentation, bug, public API, and high-risk route tests. |
| [3.1 Investigate](https://vercel.com/academy/creating-a-software-factory/reproduce-the-claim) | `5bbdf96` | Investigator with its own repository sandbox and command evidence. One subagent. |
| [3.2 Write specifications](https://vercel.com/academy/creating-a-software-factory/write-the-supported-spec) | `8eecea1` | Affected files, behavioral criteria, test commands, approach, and compatibility risks. |
| [3.3 Challenge premises](https://vercel.com/academy/creating-a-software-factory/challenge-the-premise) | `4d2ce2a` | Explicit disposition and instructions to stop unsupported work before building. |
| [4.1 Build](https://vercel.com/academy/creating-a-software-factory/build-within-bounds) | `5e37189` | Separate Builder sandbox and validated branch fetch/push tools. Two subagents. |
| [4.2 Package evidence](https://vercel.com/academy/creating-a-software-factory/package-the-proof) | `4b9343a` | Exact commands, exit codes, output, changed paths, and deviations. |
| [4.3 Verify](https://vercel.com/academy/creating-a-software-factory/verify-in-fresh-context) | `a9a0b58` | Fresh Verifier checkout, per-criterion verdicts, risk assessment, two-revision procedure. Three subagents. |
| [5.1 Approve](https://vercel.com/academy/creating-a-software-factory/gate-by-consequence) | `1aa2b01` | `approve_spec` requires Eve human approval before execution. Five root tools. |
| [5.2 Publish](https://vercel.com/academy/creating-a-software-factory/publish-a-draft) | `a1d2c92` | Restricted GitHub extension, tested draft-only policy, evidence-bearing PR procedure. |
| [5.3 Evaluate](https://vercel.com/academy/creating-a-software-factory/learn-from-failure) | `6a45817` | Evaluations for unclear work, unsupported claims, and the public API approval pause. |

Subsequent commits validate branch failures and credential cleanup, supply configuration and fixture identities to the root, remove credential brokering before dependency installation, exclude generated snapshots from unit discovery, strengthen evaluation assertions, and test the Git commands against temporary real repositories.

The sample notification SDK deliberately retains the uppercase-channel bug. It is the product the completed factory is meant to investigate and fix, and changing it here would invalidate the course's main reproduction case. Its existing whitespace rejection supports the false-premise case.

## Run locally

Use Node 24 and the pinned pnpm version. The first group needs no connector or model credentials:

```sh
pnpm install --frozen-lockfile
pnpm trace
pnpm validate
pnpm build
pnpm exec eve eval --list
```

The fast evaluations need AI Gateway credentials but do not launch repository subagents or create GitHub objects:

```sh
pnpm exec eve eval --tag fast --strict
pnpm exec eve traces ls
pnpm exec eve traces TRACE_ID --verbose
```

For a local fixture after configuring the relevant services:

```sh
pnpm exec eve invoke "$(cat fixtures/issues/false-premise-example.md)"
```

The root receives the four recorded fixture identities through `agent/instructions/context.ts`, so bare course prompts can create a work order without inventing an issue number. These identities remain synthetic teaching sources. Real normalized GitHub events take precedence. Publication from a fixture requires checking a real issue in the configured target repository.

## Live service setup and remaining checks

No target repository or linked Vercel project has been selected for this checkout. `FACTORY_REPO`, `GITHUB_CONNECTOR`, and local Vercel OIDC configuration were absent during verification. Existing AI Gateway access was sufficient for the fast evaluations.

Use the [README setup](../README.md#setup) and lesson 3.1 to link the intended personal repository and Vercel project, attach the GitHub connector, and pull project configuration. Keep the actual connector UID in `GITHUB_CONNECTOR`. Do not copy the placeholder target from `.env.example` into a live deployment.

Once configured, finish these checks in order:

1. Run `pnpm exec eve eval investigation/false-premise --strict`. Inspect the command-backed contradiction and absence of Builder, Verifier, and PR requests.
2. Run `pnpm exec eve eval routing/public-api-gate --strict`. It must investigate and park on `approve_spec` before Builder execution.
3. In an interactive public API run, deny the pending approval and confirm no branch is created. Then use a separate run to verify an approved specification can resume. Test a redeploy during the pause if durable resumption is part of the deployment acceptance criteria.
4. Invoke the uppercase fixture against the configured repository. Check the supported spec, pushed branch, exact test output, fresh verification, and bounded revision procedure. Introduce a deliberately insufficient regression test on a disposable candidate to exercise `request-changes`.
5. Deploy with `pnpm exec eve deploy`. Create a real issue from the bug fixture and apply the configured label from a trusted account. Inspect the resulting draft PR and its evidence. Verify the draft status and that the published branch is the revision the Verifier checked.
6. Follow lesson 5.3's teardown when finished: stop label-triggered work, close disposable drafts, remove course branches, detach/remove the connector, and remove unneeded project credentials and GitHub App access.

## Verification evidence, 2026-09-10

| Check | Result | Scope |
| --- | --- | --- |
| `pnpm trace` | Passed | Four recorded outcomes; no model execution. |
| `pnpm validate` | Passed | Type checking, 42 authored tests, zero discovery errors/warnings, five root tools and three subagents. |
| Local Git integration test | Passed | Actual commands push a candidate, preserve `main`, fetch the same candidate into a second checkout, and leave HEAD unchanged after a failed fetch. Credential brokering is represented by a local adapter. |
| `pnpm build` | Passed | Build output generated; no deployment claim. |
| `pnpm exec eve eval --list` | Passed | Four evaluations discovered. |
| `pnpm exec eve eval --tag fast --strict` | Passed | Two live model evaluations, 18/18 assertions. Both record `needs-clarification` and make no repository-subagent or PR attempt. |
| Slow evaluations and deployed flow | Pending | Need target repo, connector, and Vercel project configuration. |

The final fast traces are `f1800cceaaa7afd1d15b2b7e92c715ac` and `e562447811b43f997309e8d8005ab094`. The latter was inspected and shows creation, classification, routing, evidence recording, and a reply, with no repository station. Local trace files live under ignored `.eve` state and are not part of the branch.

## Enforcement and course limitations

Code validates intake fields, classification output, routing policy, branch names/prefixes, and literal draft creation. Eve gates execution of `approve_spec`. Branch tools reject invalid input before obtaining a sandbox or installation token, do not force-push, and restore network policy after success, command failure, or an execution exception. Root shell/write/web tools are disabled; GitHub capabilities contain no merge tool.

Station order, mandatory use of the specification approval tool, evidence authenticity, and revision counting follow the root instructions, as in the course. The draft-only policy does not independently bind a stored Verifier result to a Git commit. Investigator and Verifier have no file-writing tool, but their shell access can still modify files; their read-only behavior also relies on instructions. These are boundaries to harden and test before treating the example as a production authorization system.

The starter's label predicate also admits another label event when the factory label is already present. That known issue is retained in the local friction log; duplicate-session behavior has not been verified live.
