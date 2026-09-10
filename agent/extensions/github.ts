import githubExtension from "@github-tools/eve-extension";
import { factoryRepo } from "../lib/config.js";
import { GITHUB_CONNECTOR } from "../lib/github/credentials.js";
import { createPullRequestPolicy } from "../lib/github/approval.js";
export default githubExtension({
  connector: GITHUB_CONNECTOR,
  context: factoryRepo,
  include: [
    "getRepository", "getIssueContext", "listIssueComments", "listBranches",
    "getPullRequestContext", "listPullRequestFiles", "createPullRequest",
  ],
  requireApproval: { createPullRequest: createPullRequestPolicy },
});
