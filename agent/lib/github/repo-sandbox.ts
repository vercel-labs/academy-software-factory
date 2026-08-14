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
} from "./git-remote.js";

async function runOrThrow(
  sandbox: SandboxSession,
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
    const setup = process.env.FACTORY_SETUP_COMMAND;
    if (setup) {
      await runOrThrow(sandbox, `cd repo && ${setup}`);
    }
  } finally {
    await sandbox.setNetworkPolicy("allow-all");
  }
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
    await runOrThrow(
      sandbox,
      `cd repo && branch=$(git symbolic-ref --short refs/remotes/origin/HEAD | sed 's|^origin/||') && git fetch ${REMOTE_URL} "$branch" && git checkout -B "$branch" FETCH_HEAD`
    );
  } finally {
    await sandbox.setNetworkPolicy("allow-all");
  }
}
