import { z } from "zod";

// Download Satellite Images
export const DownloadSatelliteImagesQuerySchema = z.object({
  latitude: z.number(),
  longitude: z.number(),
  zoom: z.number().default(10),
});

export const DownloadSatelliteImagesResponseSchema = z.object({
  image_id: z.string(),
  images: z.array(z.string()), // Changed from Uint8Array to base64String
});

// Derive TypeScript types from Zod schemas
export type DownloadSatelliteImagesQuery = z.infer<
  typeof DownloadSatelliteImagesQuerySchema
>;
export type DownloadSatelliteImagesResponse = z.infer<
  typeof DownloadSatelliteImagesResponseSchema
>;
