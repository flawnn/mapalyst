import { ReactNode } from "react";

export type MessageSender = "user" | "assistant";

export interface BaseMessage {
  id: string;
  sender: MessageSender;
  timestamp?: Date;
}

export interface TextMessage extends BaseMessage {
  type: "text";
  content: string;
}

export interface WidgetMessage extends BaseMessage {
  type: "widget";
  widget: ReactNode;
}

export type ChatMessage = TextMessage | WidgetMessage;

export interface ChatWidget {
  render(): ReactNode;
} 