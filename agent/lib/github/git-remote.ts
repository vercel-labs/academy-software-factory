import type { GitHubChannelCredentials } from "eve/channels/github";
import type { SandboxNetworkPolicy } from "eve/sandbox";
import { FACTORY_REPO } from "../config.js";

const protectedBranches = new Set(["main", "master"]);
const branchPattern = /^[A-Za-z0-9](?:[A-Za-z0-9._/-]*[A-Za-z0-9])?$/;

export const REPO_DIR = "/workspace/repo";
export const REMOTE_URL = `https://github.com/${FACTORY_REPO}.git`;

export function validateBranch(branch: string): string | null {
  if (
    !branchPattern.test(branch) ||
    branch.includes("..") ||
    branch.includes("//")
  ) {
    return `"${branch}" is not a valid branch name.`;
  }
  if (branch.startsWith("refs/") || branch === "HEAD") {
    return `"${branch}" is not a plain branch name.`;
  }
  if (protectedBranches.has(branch)) {
    return `Direct pushes to ${branch} are not allowed.`;
  }
  return null;
}

export function brokerPolicy(token: string): SandboxNetworkPolicy {
  const authorization = `Basic ${Buffer.from(
    `x-access-token:${token}`
  ).toString("base64")}`;
  return {
    allow: {
      "*": [],
      "github.com": [
        { transform: [{ headers: { Authorization: authorization } }] },
      ],
    },
  };
}

export async function mintInstallationToken(
  credentials: GitHubChannelCredentials
): Promise<string> {
  const token = credentials.installationToken;
  if (token === undefined) {
    throw new Error("The GitHub connector exposes no installation token.");
  }
  return typeof token === "function" ? await token() : token;
}
