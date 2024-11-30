import * as React from "react";
import { Textarea } from "~/ui/components/textarea";
import { cn } from "~/lib/utils";

const ChatInput = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, onKeyDown, ...props }, ref) => (
  <Textarea
    autoComplete="off"
    ref={ref}
    name="message"
    rows={1}
    onKeyDown={(e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
      }
      onKeyDown?.(e);
    }}
    className={cn(
      "max-h-32 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md resize-none",
      "min-h-[48px] py-[calc(24px-0.75em)]",
      "flex items-center leading-[1.5]",
      className,
    )}
    {...props}
  />
));

ChatInput.displayName = "ChatInput";

export { ChatInput };
