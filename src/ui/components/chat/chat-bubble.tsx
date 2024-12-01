import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "~/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/components/avatar";
import { Button, type ButtonProps } from "../button";
import MessageLoading from "./message-loading";

// ChatBubble
const chatBubbleVariant = cva(
  "flex gap-3 relative group items-start",
  {
    variants: {
      variant: {
        received: "self-start max-w-[80%]",
        sent: "self-end flex-row-reverse max-w-[80%]",
      },
      hasRichContent: {
        true: "max-w-fit",
        false: "",
      }
    },
    defaultVariants: {
      variant: "received",
      hasRichContent: false,
    },
  },
);

interface ChatBubbleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleVariant> {
  hasRichContent?: boolean;
}

const ChatBubble = React.forwardRef<HTMLDivElement, ChatBubbleProps>(
  ({ className, variant, hasRichContent, children, ...props }, ref) => (
    <div
      className={cn(
        chatBubbleVariant({ variant, hasRichContent, className }),
        "group relative"
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  ),
);
ChatBubble.displayName = "ChatBubble";

// ChatBubbleAvatar
interface ChatBubbleAvatarProps {
  src?: string;
  fallback?: string;
  className?: string;
  children?: React.ReactNode;
}

const ChatBubbleAvatar: React.FC<ChatBubbleAvatarProps> = ({
  src,
  fallback,
  className,
  children,
}) => (
  <Avatar className={cn("flex-shrink-0", className)}>
    <div className="bg-secondary flex h-full w-full items-center justify-center">
      {children}
    </div>
    <AvatarFallback className={children ? "hidden" : undefined}>
      {fallback}
    </AvatarFallback>
  </Avatar>
);

// ChatBubbleMessage
const chatBubbleMessageVariants = cva(
  "p-4 font-geist text-[14px] leading-relaxed overflow-hidden",
  {
    variants: {
      variant: {
        received:
          "bg-secondary text-secondary-foreground rounded-r-lg rounded-tl-lg",
        sent: "bg-primary text-primary-foreground rounded-l-lg rounded-tr-lg",
      },
      layout: {
        default: "",
        ai: "border-t w-full rounded-none bg-transparent",
      },
    },
    defaultVariants: {
      variant: "received",
      layout: "default",
    },
  },
);

interface ChatBubbleMessageProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof chatBubbleMessageVariants> {
  isLoading?: boolean;
}

const ChatBubbleMessage = React.forwardRef<
  HTMLDivElement,
  ChatBubbleMessageProps
>(
  (
    { className, variant, layout, isLoading = false, children, ...props },
    ref,
  ) => (
    <div
      className={cn(
        chatBubbleMessageVariants({ variant, layout, className }),
        "max-w-full min-w-0 whitespace-pre-wrap break-words flex-1",
      )}
      ref={ref}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center space-x-2">
          <MessageLoading />
        </div>
      ) : (
        children
      )}
    </div>
  ),
);
ChatBubbleMessage.displayName = "ChatBubbleMessage";

// ChatBubbleTimestamp
interface ChatBubbleTimestampProps
  extends React.HTMLAttributes<HTMLDivElement> {
  timestamp: string;
}

const ChatBubbleTimestamp: React.FC<ChatBubbleTimestampProps> = ({
  timestamp,
  className,
  ...props
}) => (
  <div className={cn("mt-2 text-right text-xs", className)} {...props}>
    {timestamp}
  </div>
);

// ChatBubbleAction
type ChatBubbleActionProps = ButtonProps & {
  icon: React.ReactNode;
};

const ChatBubbleAction: React.FC<ChatBubbleActionProps> = ({
  icon,
  onClick,
  className,
  variant = "ghost",
  size = "icon",
  ...props
}) => (
  <Button
    variant={variant}
    size={size}
    className={className}
    onClick={onClick}
    {...props}
  >
    {icon}
  </Button>
);

interface ChatBubbleActionWrapperProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "sent" | "received";
  className?: string;
}

const ChatBubbleActionWrapper = React.forwardRef<
  HTMLDivElement,
  ChatBubbleActionWrapperProps
>(({ variant, className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute top-1/2 flex -translate-y-1/2 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
      variant === "sent"
        ? "-left-1 -translate-x-full flex-row-reverse"
        : "-right-1 translate-x-full",
      className,
    )}
    {...props}
  >
    {children}
  </div>
));
ChatBubbleActionWrapper.displayName = "ChatBubbleActionWrapper";

export {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleActionWrapper,
  ChatBubbleAvatar,
  ChatBubbleMessage,
  chatBubbleMessageVariants,
  ChatBubbleTimestamp,
  chatBubbleVariant,
};
