import { defineAgent } from "eve";
import { MODELS } from "./lib/models.js";

export default defineAgent({
  limits: { maxOutputTokensPerSession: 80_000 },
  model: MODELS.orchestrator,
});
