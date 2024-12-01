import { z } from "zod";

// Analyze Satellite Images
export const AnalyzeSatelliteImagesQuerySchema = z.object({
  image_id: z.string(),
  type: z.string().default("basic"),
});

export const AnalyzeSatelliteImagesResponseSchema = z.object({
  image_id: z.string(),
  processed_images: z.array(z.string()), // Changed from Uint8Array to base64String
  counts: z.array(z.number()),
});

export type AnalyzeSatelliteImagesQuery = z.infer<
  typeof AnalyzeSatelliteImagesQuerySchema
>;
export type AnalyzeSatelliteImagesResponse = z.infer<
  typeof AnalyzeSatelliteImagesResponseSchema
>;
