/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import Avatar from "boring-avatars";
import { CornerDownLeft } from "lucide-react";
import React, { useRef, useState } from "react";
import { useToast } from "~/hooks/use-toast";
import { Button } from "~/ui/components/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/components/card";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "~/ui/components/chat/chat-bubble";
import { ChatInput } from "~/ui/components/chat/chat-input";
import { ChatMessageList } from "~/ui/components/chat/chat-message-list";
import { chatConfig } from "./config/chat-config";
import { useChat } from "./useChat";

export const ChatInterface: React.FC = () => {
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();
  const { messages, isLoading, sendMessage, messagesEndRef } = useChat();
  const messageListRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputValue.trim();
    if (!message || isLoading) return;

    try {
      setInputValue("");
      await sendMessage(message);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Failed to send message",
        description:
          error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="flex-shrink-0 pb-4">
        <CardTitle className="text-2xl">Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4 overflow-hidden p-0">
        <div className="flex-1 overflow-hidden px-4">
          <ChatMessageList
            ref={messageListRef}
            className="h-full overflow-y-auto"
          >
            {messages.map((message, index) => (
              <ChatBubble
                key={index}
                variant={message.role === "user" ? "sent" : "received"}
                hasRichContent={!!message.widget}
              >
                {message.role === "user" ? (
                  <div className="size-8 flex-shrink-0 overflow-hidden rounded-full">
                    <Avatar
                      size={32}
                      name="W"
                      variant="marble"
                      colors={[
                        "#92A1C6",
                        "#146A7C",
                        "#F0AB3D",
                        "#C271B4",
                        "#C20D90",
                      ]}
                    />
                  </div>
                ) : (
                  <ChatBubbleAvatar fallback={chatConfig.bot.fallback}>
                    {chatConfig.bot.avatar}
                  </ChatBubbleAvatar>
                )}
                <ChatBubbleMessage className="text-sm font-light">
                  {message.widget ? message.widget : message.content}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}
            {isLoading && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar fallback={chatConfig.bot.fallback}>
                  {chatConfig.bot.avatar}
                </ChatBubbleAvatar>
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}
            <div ref={messagesEndRef} style={{ height: 1 }} />
          </ChatMessageList>
        </div>

        <div className="bg-background focus-within:ring-ring relative m-1 flex rounded-lg border focus-within:ring-1">
          <ChatInput
            value={inputValue}
            onChange={(e) => !isLoading && setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !isLoading) {
                e.preventDefault();
                void handleSubmit(e);
              }
            }}
            placeholder={
              isLoading ? "Please wait..." : "Type your message here..."
            }
            className="bg-background min-h-12 flex-1 resize-none rounded-l-lg border-0 p-3 shadow-none focus-visible:ring-0 disabled:opacity-50"
            disabled={isLoading}
            aria-disabled={isLoading}
          />
          <div className="flex items-center p-2">
            <Button
              type="submit"
              size="sm"
              onClick={(e) => void handleSubmit(e)}
              className="gap-1.5"
              disabled={!inputValue.trim() || isLoading}
            >
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
