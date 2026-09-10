# Approval protocol test

Run `pnpm test:approval` from the repository root. The runner copies the production `agent/tools/approve_spec.ts` into this fixture before starting Eve; the generated copy is ignored by Git. This keeps Eve's runtime snapshot self-contained and prevents a second maintained implementation of the tool.

The fixture uses Eve's deterministic `mockModel` with an explicit context-window size. It runs the actual HTTP/session/approval protocol without a model provider, repository sandbox, or GitHub connector.

The two evaluations prove that a pending approval has not executed, an approval resumes the same session and returns the exact specification, and denial never completes the tool. They do not prove that the main orchestrator always chooses the gate, that a paused run survives redeployment, or that a Builder observes the approval. Those remain full-factory checks.
