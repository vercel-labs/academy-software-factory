import type { GitHubIssueEvent } from "eve/channels/github";
import { z } from "zod";
import { issueSourceSchema } from "./work-order.js";

const payloadSchema = z.object({
  title: z.string().min(1),
  body: z.string().nullish(),
  html_url: z.url(),
});
export function normalizeIssue(issue: Pick<GitHubIssueEvent, "raw" | "issueNumber">) {
  const payload = payloadSchema.parse(issue.raw);
  return issueSourceSchema.parse({
    title: payload.title, body: payload.body ?? "", url: payload.html_url, number: issue.issueNumber,
  });
}
