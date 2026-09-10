import { defineInstructions } from "eve/instructions";
import { FACTORY_BRANCH_PREFIX, FACTORY_REPO } from "../lib/config.js";
import bug from "../../fixtures/runs/issue-42.json" with { type: "json" };
import docs from "../../fixtures/runs/issue-43.json" with { type: "json" };
import falsePremise from "../../fixtures/runs/issue-44.json" with { type: "json" };
import publicApi from "../../fixtures/runs/issue-45.json" with { type: "json" };
export default defineInstructions({
  content: [
    `The configured repository is ${FACTORY_REPO}. Candidate branches must start with ${FACTORY_BRANCH_PREFIX}.`,
    "When a local exercise supplies an exact fixture title without source metadata, use the matching recorded course identity below and the supplied body. These are synthetic teaching sources, not proof that live GitHub issues exist. Explicit normalized GitHub event identity takes precedence. Other requests missing identity require clarification.",
    JSON.stringify([bug, docs, falsePremise, publicApi].map(({ issue }) => issue)),
    "Before publishing from a local fixture, require a real issue in the configured repository and verify its context with GitHub. A synthetic fixture can be investigated and built, but its recorded source URL must never be presented as a verified live issue.",
  ].join("\n\n"),
});
