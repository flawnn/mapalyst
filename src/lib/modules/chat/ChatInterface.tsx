"use client";

import Avatar from "boring-avatars";
import { CornerDownLeft } from "lucide-react";
import React, { useState } from "react";
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

  const { messages, isLoading, sendMessage, messageListRef } = useChat({
    onError: (error) => {
      console.error("Failed to send message:", error);
      toast({
        title: "Failed to send message",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const message = inputValue.trim();
    if (!message) return;
    
    setInputValue("");
    await sendMessage(message);
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <ChatMessageList ref={messageListRef} className="flex-1">
          {messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              {message.sender === "user" ? (
                <div className="flex-shrink-0 size-8 overflow-hidden rounded-full">
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
                {message.content}
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
        </ChatMessageList>

        <div className="bg-background focus-within:ring-ring relative flex rounded-lg border focus-within:ring-1">
          <ChatInput
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSubmit(e);
              }
            }}
            placeholder="Type your message here..."
            className="bg-background min-h-12 flex-1 resize-none rounded-l-lg border-0 p-3 shadow-none focus-visible:ring-0"
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
