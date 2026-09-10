import { defineAgent } from "eve";
import { MODELS } from "../../lib/models.js";
import { buildResultSchema } from "../../lib/build-result.js";
export default defineAgent({
  description: "Implement one supported and approved specification in a separate checkout. Return a committed candidate branch and change evidence.",
  model: MODELS.builder,
  outputSchema: buildResultSchema,
});
