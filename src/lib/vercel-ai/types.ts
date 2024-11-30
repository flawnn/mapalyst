import { z } from "zod";

export interface AIResponse {
  content: string;
  error?: string;
}

export interface AIQueryOptions {
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
}

export const LocationQuerySchema = z.object({
  coordinates: z.string().describe("Coordinates in 'lat,lon' format"),
  type: z.string().describe("Type of object to detect"),
  radius: z.number().nullable().describe("Search radius in meters"),
  error: z.string().nullable().describe("Error message if query cannot be processed"),
});

export type LocationQuery = z.infer<typeof LocationQuerySchema>;

// Key places mapping for the system prompt
export const KEY_PLACES = {
  "EPFL": "46.518437,6.561171",
  "ETH Zurich": "47.376440,8.548157",
  // Add more key places as needed
} as const; 