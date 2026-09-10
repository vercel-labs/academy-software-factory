import { defineEval } from "eve/evals";
export default defineEval({
  description: "A vague issue asks for clarification without launching repository work.",
  tags: ["fast", "routing"],
  async test(t) {
    await t.send("Issue #91, https://github.com/example/sdk/issues/91. Notifications fail sometimes. Please fix whatever is wrong.");
    t.succeeded();
    t.calledTool("create_work_order");
    t.calledTool("classify_issue");
    t.calledTool("route_work_order", { output: { lane: "manual", approvalRequired: true } });
    t.calledTool("record_evidence", { output: { status: "needs-clarification" } });
    t.notCalledTool("investigator");
    t.notCalledTool("builder");
    t.notCalledTool("verifier");
    t.notCalledTool("github__createPullRequest");
  },
});
