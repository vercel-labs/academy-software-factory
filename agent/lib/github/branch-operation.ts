import type { SandboxSession } from "eve/sandbox";
import { brokerPolicy, REMOTE_URL, REPO_DIR, validateBranch } from "./git-remote.js";

type BranchSandbox = Pick<SandboxSession, "run" | "setNetworkPolicy">;
export async function runBranchOperation(
  input: { branch: string; operation: "checkout" | "push" },
  dependencies: { getSandbox: () => Promise<BranchSandbox>; getToken: () => Promise<string> },
) {
  const refusal = validateBranch(input.branch);
  if (refusal) return { success: false, error: refusal };
  const sandbox = await dependencies.getSandbox();
  const token = await dependencies.getToken();
  await sandbox.setNetworkPolicy(brokerPolicy(token));
  try {
    const ref = `refs/heads/${input.branch}`;
    const command = input.operation === "push"
      ? `git -C ${REPO_DIR} -c core.hooksPath=/dev/null push ${REMOTE_URL} '${ref}:${ref}'`
      : `git -C ${REPO_DIR} -c core.hooksPath=/dev/null fetch ${REMOTE_URL} '${ref}' && git -C ${REPO_DIR} -c core.hooksPath=/dev/null checkout -B '${input.branch}' FETCH_HEAD`;
    const result = await sandbox.run({ command });
    if (result.exitCode !== 0) {
      return { success: false, error: String(result.stderr || result.stdout).trim() };
    }
    return { success: true, branch: input.branch };
  } finally {
    await sandbox.setNetworkPolicy("allow-all");
  }
}
