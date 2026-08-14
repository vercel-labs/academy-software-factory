import { describe, expect, it } from "vitest";
import { sendNotification } from "./index.js";

describe("sendNotification", () => {
  it("returns a receipt for an email notification", () => {
    const receipt = sendNotification({
      channel: "email",
      message: "The espresso machine has achieved sentience.",
      recipient: "ops@signalworks.test",
    });

    expect(receipt.channel).toBe("email");
    expect(receipt.id).toMatch(/^mail_/);
  });

  it("rejects an empty message", () => {
    expect(() =>
      sendNotification({
        channel: "slack",
        message: "   ",
        recipient: "#factory-floor",
      })
    ).toThrow("Notification message cannot be empty.");
  });
});

