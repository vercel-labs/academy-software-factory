const defaultModel =
  process.env.FACTORY_MODEL ?? "openai/gpt-5.4-mini";

export const MODELS = {
  builder: process.env.BUILDER_MODEL ?? defaultModel,
  investigator: process.env.INVESTIGATOR_MODEL ?? defaultModel,
  orchestrator: process.env.ORCHESTRATOR_MODEL ?? defaultModel,
  verifier: process.env.VERIFIER_MODEL ?? defaultModel,
} as const;
