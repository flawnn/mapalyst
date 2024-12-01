import React from "react";
import { cn } from "~/lib/utils";
import { AgentStepsWidget, type AnalysisStep } from "./AgentStepsWidget";
import { RichResponseWidget } from "./RichResponseWidget";
import { motion, AnimatePresence } from "framer-motion";
import type { FindingsSynthesis } from "~/lib/vercel-ai/client";

interface AnalysisResponseWidgetProps {
  currentStep: AnalysisStep;
  content?: string;
  initialImages?: string[];
  analysisResults?: {
    processedImages: string[];
    timeSeriesData: Array<{
      timestamp: number;
      value: number;
    }>;
  };
  findings?: FindingsSynthesis;
  className?: string;
}

export const AnalysisResponseWidget: React.FC<AnalysisResponseWidgetProps> = ({
  currentStep,
  content,
  initialImages,
  analysisResults,
  findings,
  className,
}) => {
  return (
    <div className={cn("flex flex-col space-y-4", className)}>
      {/* Content Message */}
      {content && (
        <div className="text-sm text-foreground">{content}</div>
      )}

      {/* Steps Progress */}
      <AgentStepsWidget currentStep={currentStep} />

      {/* Separator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="h-px bg-border"
      />

      {/* Initial Images Section */}
      <AnimatePresence mode="wait">
        {initialImages && initialImages.length > 0 && (
          <motion.div
            key="initial-images"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RichResponseWidget
              images={initialImages}
              content="Here are the satellite images I found:"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analysis Results Section */}
      <AnimatePresence mode="wait">
        {analysisResults && (
          <motion.div
            key="analysis-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <RichResponseWidget
              images={analysisResults.processedImages}
              content="Here are the processed images:"
            />
            <div className="mt-4">
              <RichResponseWidget
                content="Analysis results over time:"
                timeSeriesData={analysisResults.timeSeriesData}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Findings Section */}
      <AnimatePresence mode="wait">
        {findings && (
          <motion.div
            key="findings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4 rounded-lg bg-muted p-4"
          >
            <h3 className="font-semibold">Analysis Summary</h3>
            <p className="text-sm">{findings.summary}</p>
            
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Key Findings:</h4>
              <ul className="list-inside list-disc space-y-1">
                {findings.keyFindings.map((finding, index) => (
                  <li key={index} className="text-sm">{finding}</li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span>
                Trend: <span className="font-medium capitalize">{findings.trend}</span>
              </span>
              <span>
                Confidence: <span className="font-medium">{Math.round(findings.confidence * 100)}%</span>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}; 