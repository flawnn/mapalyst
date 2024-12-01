"use client";

import { X } from "lucide-react";
import Image from "next/image";
import React from "react";
import { cn } from "~/lib/utils";
import { Button } from "./button";

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
  className?: string;
}

export const ImageModal: React.FC<ImageModalProps> = ({
  src,
  alt,
  onClose,
  className,
}) => {
  const [isClosing, setIsClosing] = React.useState(false);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for animation to complete
    setTimeout(onClose, 200);
  };

  // Close on escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm",
        "duration-200 ease-in-out",
        isClosing ? "animate-out fade-out-0 zoom-out-95" : "animate-in fade-in-0 zoom-in-95",
        className
      )}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div className="relative max-h-[90vh] max-w-[90vw] overflow-hidden rounded-lg bg-background shadow-lg">
        <Image
          src={src}
          alt={alt}
          className="h-auto w-auto object-contain"
          width={1200}
          height={800}
          priority
        />
      </div>
    </div>
  );
}; 