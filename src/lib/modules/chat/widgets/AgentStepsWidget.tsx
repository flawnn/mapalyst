import React from "react";
import { cn } from "~/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export const ANALYSIS_STEPS = {
  ANALYZE_QUERY: "Analyze Query",
  GET_SATELLITE_IMAGES: "Get Satellite Images",
  ANALYZE_OBJECT_TYPE: "Analyze Object",
  PROCESS_IMAGES: "Process Images",
} as const;

export type AnalysisStep = keyof typeof ANALYSIS_STEPS;

interface AgentStepsWidgetProps {
  currentStep: AnalysisStep;
  className?: string;
}

const StepItem: React.FC<{
  step: AnalysisStep;
  isActive: boolean;
  isPassed: boolean;
}> = ({ step, isActive, isPassed }) => {
  return (
    <motion.div
      className={cn(
        "relative flex items-center gap-3 py-2 transition-colors",
        isActive ? "text-primary" : isPassed ? "text-muted-foreground" : "text-muted-foreground/60"
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      {/* Step indicator dot */}
      <div
        className={cn(
          "h-2 w-2 rounded-full transition-colors",
          isActive ? "bg-primary" : isPassed ? "bg-muted-foreground" : "bg-muted-foreground/60"
        )}
      />

      {/* Step text */}
      <span className="text-sm font-medium">{ANALYSIS_STEPS[step]}</span>

      {/* Active step shimmer effect */}
      {isActive && (
        <motion.div
          className="absolute inset-0 rounded-md bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: "linear",
          }}
        />
      )}
    </motion.div>
  );
};

export const AgentStepsWidget: React.FC<AgentStepsWidgetProps> = ({
  currentStep,
  className,
}) => {
  // Get ordered array of steps
  const steps = Object.keys(ANALYSIS_STEPS) as AnalysisStep[];
  const currentStepIndex = steps.indexOf(currentStep);

  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <AnimatePresence mode="sync">
        {steps.map((step, index) => (
          <StepItem
            key={step}
            step={step}
            isActive={step === currentStep}
            isPassed={index < currentStepIndex}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};