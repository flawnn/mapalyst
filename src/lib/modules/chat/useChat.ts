import { nanoid } from "nanoid";
import { useCallback, useRef, useState } from "react";
import { useMap } from "../map/context/MapContext";

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  status?: "sending" | "sent" | "error";
}

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

  const addMessage = useCallback(
    (message: Omit<ChatMessage, "id" | "timestamp">) => {
      const newMessage: ChatMessage = {
        ...message,
        id: nanoid(),
        timestamp: new Date(),
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
        status: "sent",
      });

      setIsLoading(true);

      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));

        addMessage({
          content: "Zooming to EPFL, Lausanne...",
          sender: "bot",
        });

        zoomTo([6.561171, 46.518437], 12);
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
    [addMessage, options, zoomTo],
  );

  return {
    messages,
    isLoading,
    sendMessage,
    messageListRef,
  };
}
