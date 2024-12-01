import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { AI_CONFIG } from "./config";
import { KEY_PLACES, LocationQuerySchema, type LocationQuery } from "./types";
import { z } from "zod";

const openai = createOpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

// Schema for findings synthesis
export const FindingsSynthesisSchema = z.object({
  summary: z.string(),
  keyFindings: z.array(z.string()),
  trend: z.enum(["increasing", "decreasing", "stable", "fluctuating"]),
  confidence: z.number(),
});

export type FindingsSynthesis = z.infer<typeof FindingsSynthesisSchema>;

interface TimeSeriesDataPoint {
  timestamp: number;
  value: number;
}

const SYNTHESIS_SYSTEM_INSTRUCTIONS = `You are an expert analyst specializing in satellite imagery analysis and time series data interpretation.
Your task is to analyze time series data from satellite imagery and provide insightful findings.

Consider the following aspects in your analysis:
1. Identify clear patterns or trends in the data
2. Look for seasonal variations or cycles
3. Note any significant anomalies or changes
4. Consider the geographical context and object type
5. Provide confidence level based on data quality and pattern clarity

Your analysis should be:
- Clear and concise
- Backed by the data
- Relevant to the location and object type
- Actionable where possible

Format your findings as a structured output with:
- A concise summary
- Key findings as bullet points
- Overall trend classification
- Confidence score (0-1)`;

export async function synthesizeFindings(
  timeSeriesData: TimeSeriesDataPoint[],
  coordinates: { latitude: number; longitude: number },
  objectType: string
): Promise<FindingsSynthesis> {
  try {
    const formattedData = timeSeriesData.map(point => ({
      date: new Date(point.timestamp).toISOString().split('T')[0],
      value: point.value,
    }));

    const prompt = `
Location: ${coordinates.latitude}, ${coordinates.longitude}
Object Type: ${objectType}
Time Series Data: ${JSON.stringify(formattedData, null, 2)}

Analyze this data and provide structured insights.`;

    const { object } = await generateObject<FindingsSynthesis>({
      model: openai(AI_CONFIG.model, {
        structuredOutputs: true,
      }),
      schema: FindingsSynthesisSchema,
      prompt: `${SYNTHESIS_SYSTEM_INSTRUCTIONS}\n\n${prompt}`,
    });

    return object;
  } catch (error) {
    console.error("Error in findings synthesis:", error);
    return {
      summary: "Failed to synthesize findings from the data",
      keyFindings: ["Error occurred during analysis"],
      trend: "stable",
      confidence: 0,
    };
  }
}

const SYSTEM_INSTRUCTIONS = `You are a location query parser. Extract location information from user queries.
Available key places and their coordinates are:
${Object.entries(KEY_PLACES)
  .map(([place, coords]) => `- ${place}: ${coords}`)
  .join("\n")}

Rules:
1. If a user mentions a key place, use its exact coordinates
2. If a user provides coordinates directly (in any format), convert them to "lat,lon"
3. The type parameter must be extracted from context
4. If radius is mentioned (in any unit), convert it to meters
5. If required parameters are missing or invalid, return an error message

Examples:
- "Find restaurants near EPFL" -> { "coordinates": "46.518437,6.561171", "type": "restaurant" }
- "Show cafes within 500m of 47.37,8.54" -> { "coordinates": "47.37,8.54", "type": "cafe", "radius": 500 }
- "List hotels in Paris" -> { "error": "Location 'Paris' is not in the list of key places" }`;

/**
 * Evaluates a location query and returns structured data
 * @param query - The user's location query
 * @returns A promise resolving to parsed location data
 */
export async function evaluateQuery(query: string): Promise<LocationQuery> {
  try {
    const { object } = await generateObject<LocationQuery>({
      model: openai(AI_CONFIG.model, {
        structuredOutputs: true,
      }),
      schema: LocationQuerySchema,
      prompt: `${SYSTEM_INSTRUCTIONS}\n\nUser query: ${query}`,
    });

    return object;
  } catch (error) {
    console.error("Error in AI query evaluation:", error);
    return {
      error: "Failed to process location query",
      coordinates: "0,0",
      type: "unknown",
      radius: null,
    };
  }
}

// Remove or comment out evaluateQueryStream if not needed
