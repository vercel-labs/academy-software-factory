import type { Classification } from "./classification.js";
import type { WorkRoute } from "./work-order.js";
export function routeClassification(classification: Classification): WorkRoute {
  if (!classification.actionable || classification.type === "unknown") {
    return { lane: "manual", approvalRequired: true, reason: "Clarify the missing intent before repository work." };
  }
  if (classification.type === "public-api") {
    return { lane: "public-api", approvalRequired: true, reason: "Investigate compatibility, then request specification approval." };
  }
  const approvalRequired = classification.risk === "high";
  return {
    lane: classification.type,
    approvalRequired,
    reason: `${classification.type === "bug" ? "Reproduce the claim before implementation." : "Use a bounded prose specification."} ${approvalRequired ? "High risk requires approval." : "This risk level permits implementation without a specification pause."}`,
  };
}
