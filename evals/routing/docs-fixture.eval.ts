import { defineEval } from "eve/evals";
export default defineEval({
  description: "The bare documentation fixture resolves its course identity and asks for missing intent.",
  tags: ["fast", "routing"],
  async test(t) {
    await t.send("# Clarify webhook retries\n\nThe webhook retry docs are confusing. Please fix them.");
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
