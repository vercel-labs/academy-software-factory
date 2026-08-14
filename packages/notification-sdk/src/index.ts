export type NotificationChannel = "email" | "slack" | "webhook";

export interface Notification {
  channel: NotificationChannel;
  message: string;
  recipient: string;
}

export interface DeliveryReceipt {
  channel: NotificationChannel;
  deliveredAt: string;
  id: string;
  recipient: string;
}

const deliveryPrefixes: Record<NotificationChannel, string> = {
  email: "mail",
  slack: "chat",
  webhook: "hook",
};

export function sendNotification(
  notification: Notification
): DeliveryReceipt {
  const prefix = deliveryPrefixes[notification.channel];
  if (!prefix) {
    throw new Error(`Unsupported notification channel: ${notification.channel}`);
  }
  if (notification.message.trim().length === 0) {
    throw new Error("Notification message cannot be empty.");
  }

  return {
    channel: notification.channel,
    deliveredAt: new Date().toISOString(),
    id: `${prefix}_${crypto.randomUUID()}`,
    recipient: notification.recipient,
  };
}

