import {
  defaultGitHubAuth,
  type GitHubInboundContext,
  githubChannel,
} from "eve/channels/github";
import { FACTORY_LABEL } from "../lib/config.js";
import { githubCredentials } from "../lib/github/credentials.js";

const trustedLabelerRoles = new Set(["admin", "maintain", "write", "triage"]);

async function isTrustedLabeler(
  ctx: GitHubInboundContext
): Promise<boolean> {
  try {
    const response = await ctx.github.request<{
      permission?: string;
      role_name?: string;
    }>({
      method: "GET",
      path: `/repos/${ctx.repository.owner}/${ctx.repository.name}/collaborators/${encodeURIComponent(ctx.sender.login)}/permission`,
    });
    const role = response.body.role_name ?? response.body.permission;
    return response.ok && typeof role === "string" && trustedLabelerRoles.has(role);
  } catch {
    return false;
  }
}

const intakeTask = [
  `This issue was labeled "${FACTORY_LABEL}" by a trusted maintainer.`,
  "Read the issue context and run it through the risk-routed factory.",
  "If clarification is needed, reply with the focused questions and stop.",
  "For approved work, deliver an independently verified draft pull request. Never merge or mark it ready.",
].join("\n\n");

export default githubChannel({
  botName: "signalworks-factory",
  credentials: githubCredentials,
  onIssue: async (ctx, issue) => {
    const { labels } = issue.raw as {
      labels?: ReadonlyArray<{ name?: unknown }>;
    };
    const hasFactoryLabel =
      Array.isArray(labels) &&
      labels.some((label) => label?.name === FACTORY_LABEL);

    if (
      issue.action !== "labeled" ||
      !hasFactoryLabel ||
      ctx.sender.type === "Bot" ||
      !(await isTrustedLabeler(ctx))
    ) {
      return null;
    }

    return {
      auth: defaultGitHubAuth(ctx),
      context: [intakeTask],
    };
  },
});

