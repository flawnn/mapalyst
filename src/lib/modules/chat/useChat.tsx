import { useState, useEffect, useRef, useCallback } from "react";

import { api } from "~/trpc/react";
import { useMap } from "../map/context/MapContext";
import { type AnalysisStep } from "./widgets/AgentStepsWidget";
import { AnalysisResponseWidget } from "./widgets/AnalysisResponseWidget";

// Initial map state from MapInterface.tsx
const INITIAL_MAP_STATE = {
  center: [-98, 40] as [number, number],
  zoom: 1,
} as const;

const STEP_MINIMUM_DURATION = 500; // ms
const SCROLL_DELAY = 100; // ms
const CONTENT_UPDATE_DELAY = 150; // ms

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  widget?: React.ReactNode;
}

interface AnalysisState {
  currentStep: AnalysisStep;
  initialImages?: string[];
  analysisResults?: {
    processedImages: string[];
    timeSeriesData: Array<{
      timestamp: number;
      value: number;
    }>;
  };
}

// Helper to ensure minimum step duration
const waitMinimumDuration = () =>
  new Promise((resolve) => setTimeout(resolve, STEP_MINIMUM_DURATION));

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisState, setAnalysisState] = useState<AnalysisState>({
    currentStep: "ANALYZE_QUERY",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const { zoomTo } = useMap();
  const analyzeQueryMutation = api.satellite.analyzeQuery.useMutation();
  const analyzeImagesMutation = api.satellite.analyzeImages.useMutation();
  const synthesizeFindingsMutation = api.satellite.synthesizeFindings.useMutation();

  // Enhanced scroll to bottom function
  const scrollToBottom = useCallback((delay: number = SCROLL_DELAY, immediate: boolean = false) => {
    // Clear any existing scroll timeout
    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    // Set new scroll timeout
    scrollTimeoutRef.current = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({
          behavior: immediate ? "auto" : "smooth",
          block: "end",
        });
      }
    }, delay);
  }, []);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  // Scroll on messages change
  useEffect(() => {
    // Immediate scroll for user messages, smooth for others
    const isUserMessage = messages[messages.length - 1]?.role === "user";
    scrollToBottom(isUserMessage ? 0 : SCROLL_DELAY, isUserMessage);
  }, [messages, scrollToBottom]);

  // Scroll on analysis state change (for dynamic content updates)
  useEffect(() => {
    // Use a longer delay for content updates to ensure content is rendered
    scrollToBottom(CONTENT_UPDATE_DELAY);
  }, [analysisState, scrollToBottom]);

  // Add ResizeObserver to handle dynamic content resizing
  useEffect(() => {
    if (!messagesEndRef.current) return;

    const observer = new ResizeObserver(() => {
      scrollToBottom(CONTENT_UPDATE_DELAY);
    });

    const parentElement = messagesEndRef.current.parentElement;
    if (parentElement) {
      observer.observe(parentElement);
    }

    return () => {
      observer.disconnect();
    };
  }, [scrollToBottom]);

  const addMessage = (message: ChatMessage) => {
    setMessages((prev) => [...prev, message]);
  };

  const updateAnalysisState = (updates: Partial<AnalysisState>) => {
    setAnalysisState((prev) => ({ ...prev, ...updates }));
  };

  const updateLastAssistantMessage = useCallback((updates: Partial<ChatMessage>) => {
    setMessages((prev) => {
      const newMessages = [...prev];
      const lastAssistantIndex = newMessages
        .map((msg, index) => ({ ...msg, index }))
        .filter((msg) => msg.role === "assistant")
        .pop();

      if (lastAssistantIndex) {
        newMessages[lastAssistantIndex.index] = {
          ...newMessages[lastAssistantIndex.index],
          ...updates,
        } as ChatMessage;
      }
      return newMessages;
    });

    // Trigger scroll after message update
    scrollToBottom(SCROLL_DELAY * 2);
  }, [scrollToBottom]);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);

      // Reset map to initial state
      zoomTo(INITIAL_MAP_STATE.center, INITIAL_MAP_STATE.zoom);

      // Add user message
      addMessage({ role: "user", content });

      // Add initial assistant message with loading state
      addMessage({
        role: "assistant",
        content: "Analyzing your request...",
        widget: (
          <AnalysisResponseWidget
            currentStep="ANALYZE_QUERY"
            className="mt-4"
          />
        ),
      });

      // Step 1: Analyze Query
      updateAnalysisState({ currentStep: "ANALYZE_QUERY" });
      await waitMinimumDuration();

      const queryAnalysis = await analyzeQueryMutation.mutateAsync({
        query: content,
      });

      // Update map view
      zoomTo(
        [queryAnalysis.coordinates.longitude, queryAnalysis.coordinates.latitude],
        14,
      );

      // Step 2: Get Satellite Images
      updateAnalysisState({
        currentStep: "GET_SATELLITE_IMAGES",
        initialImages: queryAnalysis.images,
      });
      updateLastAssistantMessage({
        widget: (
          <AnalysisResponseWidget
            currentStep="GET_SATELLITE_IMAGES"
            initialImages={queryAnalysis.images}
            className="mt-4"
          />
        ),
      });
      await waitMinimumDuration();

      // Step 3: Analyze Object Type
      updateAnalysisState({ currentStep: "ANALYZE_OBJECT_TYPE" });
      updateLastAssistantMessage({
        widget: (
          <AnalysisResponseWidget
            currentStep="ANALYZE_OBJECT_TYPE"
            initialImages={queryAnalysis.images}
            className="mt-4"
          />
        ),
      });
      await waitMinimumDuration();

      // Step 4: Process Images
      updateAnalysisState({ currentStep: "PROCESS_IMAGES" });
      const analysisResult = await analyzeImagesMutation.mutateAsync({
        image_id: queryAnalysis.image_id,
        type: queryAnalysis.type,
      });
      await waitMinimumDuration();

      // Step 5: Synthesize Findings
      const findings = await synthesizeFindingsMutation.mutateAsync({
        timeSeriesData: analysisResult.timeSeriesData,
        coordinates: queryAnalysis.coordinates,
        type: queryAnalysis.type,
      });

      // Update final message with complete analysis and findings
      updateLastAssistantMessage({
        content: findings.summary,
        widget: (
          <AnalysisResponseWidget
            currentStep="PROCESS_IMAGES"
            content={findings.summary}
            initialImages={queryAnalysis.images}
            analysisResults={{
              processedImages: analysisResult.processedImages,
              timeSeriesData: analysisResult.timeSeriesData,
            }}
            findings={findings}
            className="mt-4"
          />
        ),
      });
    } catch (error) {
      console.error("Error in sendMessage:", error);
      addMessage({
        role: "assistant",
        content:
          "I apologize, but I encountered an error processing your request. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    sendMessage,
    analysisState,
    messagesEndRef,
  };
}
