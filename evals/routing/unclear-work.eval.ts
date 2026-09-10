import { defineEval } from "eve/evals";
export default defineEval({
  description: "A vague issue asks for clarification without launching repository work.",
  tags: ["fast", "routing"],
  async test(t) {
    await t.send("Issue #91, https://github.com/example/sdk/issues/91. Notifications fail sometimes. Please fix whatever is wrong.");
    t.succeeded();
    t.calledTool("create_work_order");
    t.calledTool("classify_issue");
    t.calledTool("route_work_order");
    t.calledSubagent("investigator", { count: 0 });
    t.calledSubagent("builder", { count: 0 });
    t.calledSubagent("verifier", { count: 0 });
    t.calledTool("github__createPullRequest", { count: 0 });
  },
});
