import { connectGitHubCredentials } from "@vercel/connect/eve";

export const GITHUB_CONNECTOR =
  process.env.GITHUB_CONNECTOR ?? "github/signalworks-factory";

export const githubCredentials = connectGitHubCredentials(GITHUB_CONNECTOR);

