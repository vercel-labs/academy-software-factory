import { defineTool } from "eve/tools";
import { z } from "zod";
import { githubCredentials } from "../../../lib/github/credentials.js";
import { mintInstallationToken } from "../../../lib/github/git-remote.js";
import { runBranchOperation } from "../../../lib/github/branch-operation.js";
export default defineTool({
  description: "Checkout an existing factory branch. Validate the branch before sandbox or credential access.",
  inputSchema: z.object({ branch: z.string().min(1) }),
  execute: (input, ctx) => runBranchOperation({ ...input, operation: "checkout" }, {
    getSandbox: () => ctx.getSandbox(),
    getToken: () => mintInstallationToken(githubCredentials),
  }),
});
