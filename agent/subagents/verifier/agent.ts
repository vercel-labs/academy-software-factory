import { defineAgent } from "eve";
import { MODELS } from "../../lib/models.js";
import { verificationSchema } from "../../lib/verification.js";
export default defineAgent({
  description: "Independently inspect a pushed candidate and rerun checks in a fresh checkout. Judge every acceptance criterion and return findings without editing.",
  model: MODELS.verifier,
  outputSchema: verificationSchema,
});
