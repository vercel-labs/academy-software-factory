import type { ApprovalContext, ApprovalStatus } from "eve/tools";
import { z } from "zod";
export function createPullRequestPolicy(ctx: Pick<ApprovalContext, "toolInput">): ApprovalStatus {
  return z.object({ draft: z.literal(true) }).safeParse(ctx.toolInput).success
    ? "not-applicable"
    : { type: "denied", reason: "Only draft pull requests are permitted." };
}
