import { nanoid } from "nanoid";
import { useCallback, useRef, useState } from "react";
import { evaluateQuery } from "~/lib/vercel-ai/client";
import { useMap } from "../map/context/MapContext";
import {
  type ChatMessage,
  type MessageSender,
  type TextMessage,
  type WidgetMessage,
} from "./types";
import { ResponseWidget } from "./widgets/RichResponseWidget";

interface UseChatOptions {
  onNewMessage?: (message: ChatMessage) => void;
  onError?: (error: Error) => void;
}

export function useChat(options?: UseChatOptions) {
  const { zoomTo } = useMap();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messageListRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, []);

  const addWidgetMessage = useCallback(
    (widget: React.ReactNode) => {
      const newMessage: WidgetMessage = {
        id: nanoid(),
        sender: "assistant",
        type: "widget",
        widget,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, newMessage]);
      options?.onNewMessage?.(newMessage);
      setTimeout(scrollToBottom, 100);
    },
    [options, scrollToBottom],
  );

  const addMessage = useCallback(
    (message: { content: string; sender: MessageSender; status?: string }) => {
      const newMessage: TextMessage = {
        ...message,
        id: nanoid(),
        timestamp: new Date(),
        type: "text",
      };

      setMessages((prev) => [...prev, newMessage]);
      options?.onNewMessage?.(newMessage);
      setTimeout(scrollToBottom, 100);

      return newMessage;
    },
    [scrollToBottom, options],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim()) return;

      const userMessage = addMessage({
        content,
        sender: "user",
        status: "sending",
      });

      setIsLoading(true);

      try {
        const response = await evaluateQuery(content);

        const responseText = response.error
          ? `Error: ${response.error}`
          : `Found location: ${response.coordinates} (Type: ${response.type}${response.radius ? `, Radius: ${response.radius}m` : ""})`;

        addWidgetMessage(
          <ResponseWidget
            images={["/test-image.png", "/test-image.png", "/test-image.png"]}
            content={responseText}
          />,
        );

        if (!response.error && response.coordinates) {
          const [lat, lon] = response.coordinates.split(",").map(Number);
          zoomTo(
            [lon!, lat!],
            response.radius ? Math.log2(40000 / response.radius) : 12,
          );
        }

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: "sent" } : msg,
          ),
        );
      } catch (error) {
        options?.onError?.(error as Error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === userMessage.id ? { ...msg, status: "error" } : msg,
          ),
        );
      } finally {
        setIsLoading(false);
      }
    },
    [addMessage, addWidgetMessage, options, zoomTo],
  );

  return {
    messages,
    isLoading,
    sendMessage,
    messageListRef,
    addWidgetMessage,
  };
}
