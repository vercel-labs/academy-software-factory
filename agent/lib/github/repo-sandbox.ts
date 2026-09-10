import type {
  SandboxBootstrapContext,
  SandboxSession,
  SandboxSessionContext,
} from "eve/sandbox";
import { FACTORY_REPO } from "../config.js";
import { githubCredentials } from "./credentials.js";
import {
  brokerPolicy,
  mintInstallationToken,
  REMOTE_URL,
  REPO_DIR,
} from "./git-remote.js";

async function runOrThrow(
  sandbox: Pick<SandboxSession, "run">,
  command: string
): Promise<void> {
  const result = await sandbox.run({ command });
  if (result.exitCode !== 0) {
    throw new Error(
      `Sandbox command failed (${result.exitCode}): ${String(
        result.stderr || result.stdout
      ).trim()}`
    );
  }
}

export function repoRevalidationKey(): string {
  return `signalworks-repo-v1:${FACTORY_REPO}:${process.env.FACTORY_SETUP_COMMAND ?? ""}`;
}

export async function repoBootstrap({
  use,
}: SandboxBootstrapContext): Promise<void> {
  const sandbox = await use();
  const token = await mintInstallationToken(githubCredentials);
  await sandbox.setNetworkPolicy(brokerPolicy(token));
  try {
    await runOrThrow(sandbox, `git clone --depth 50 ${REMOTE_URL} repo`);
  } finally {
    await sandbox.setNetworkPolicy("allow-all");
  }
  const setup = process.env.FACTORY_SETUP_COMMAND;
  if (setup) {
    await runOrThrow(sandbox, `cd repo && ${setup}`);
  }
}

export async function refreshDefaultBranch(sandbox: Pick<SandboxSession, "run">): Promise<void> {
  await runOrThrow(
    sandbox,
    `branch=$(git -C ${REPO_DIR} symbolic-ref --short refs/remotes/origin/HEAD) && branch=\${branch#origin/} && git -C ${REPO_DIR} -c core.hooksPath=/dev/null fetch ${REMOTE_URL} "+refs/heads/$branch:refs/remotes/origin/$branch" && git -C ${REPO_DIR} -c core.hooksPath=/dev/null checkout -B "$branch" "refs/remotes/origin/$branch"`
  );
}

export async function repoOnSession({
  use,
}: SandboxSessionContext): Promise<void> {
  const sandbox = await use();
  await runOrThrow(
    sandbox,
    'git config --global --add safe.directory /workspace && git config --global --add safe.directory /workspace/repo && git config --global user.name "Signalworks Factory[bot]" && git config --global user.email "signalworks-factory[bot]@users.noreply.github.com"'
  );
  const token = await mintInstallationToken(githubCredentials);
  await sandbox.setNetworkPolicy(brokerPolicy(token));
  try {
    await refreshDefaultBranch(sandbox);
  } finally {
    await sandbox.setNetworkPolicy("allow-all");
  }
}
