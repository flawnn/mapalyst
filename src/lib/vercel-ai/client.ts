import { createOpenAI } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { AI_CONFIG } from "./config";
import { KEY_PLACES, LocationQuerySchema, type LocationQuery } from "./types";

const openai = createOpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

const SYSTEM_INSTRUCTIONS = `You are a location query parser. Extract location information from user queries.
Available key places and their coordinates are:
${Object.entries(KEY_PLACES)
  .map(([place, coords]) => `- ${place}: ${coords}`)
  .join("\n")}

Rules:
1. If a user mentions a key place, use its exact coordinates
2. If a user provides coordinates directly (in any format), convert them to "lat,lon"
3. If a location is neither a key place nor coordinates, return an error
4. The type parameter must be extracted from context
5. If radius is mentioned (in any unit), convert it to meters
6. If required parameters are missing or invalid, return an error message

Examples:
- "Find restaurants near EPFL" -> { "coordinates": "46.518437,6.561171", "type": "restaurants" }
- "Show cafes within 500m of 47.37,8.54" -> { "coordinates": "47.37,8.54", "type": "cafes", "radius": 500 }
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
        structuredOutputs: true, // Enable OpenAI's structured outputs
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
