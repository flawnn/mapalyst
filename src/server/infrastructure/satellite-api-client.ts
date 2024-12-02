import { type z } from "zod";
import {
  type AnalyzeSatelliteImagesQuery,
  AnalyzeSatelliteImagesQuerySchema,
  type AnalyzeSatelliteImagesResponse,
  AnalyzeSatelliteImagesResponseSchema,
} from "./py-api/models/analyzeImages";
import {
  type DownloadSatelliteImagesQuery,
  DownloadSatelliteImagesQuerySchema,
  type DownloadSatelliteImagesResponse,
  DownloadSatelliteImagesResponseSchema,
} from "./py-api/models/downloadSatelliteImages";

// Custom error class for API errors
export class SatelliteApiError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public body: unknown,
  ) {
    super(message);
    this.name = "SatelliteApiError";
  }
}

// API Configuration
const API_CONFIG = {
  baseUrl: "https://67a4c3059ca6fc342b8602dbdc7a8a34.serveo.net",
  timeout: 3000000, // 30 seconds
} as const;

// Helper function to handle API responses
async function handleApiResponse<T>(
  response: Response,
  schema: z.ZodType<T>,
): Promise<T> {
  if (!response.ok) {
    // Parse error response body, defaulting to null if parsing fails
    const errorBody: unknown = await response.json().catch(() => null);
    throw new SatelliteApiError(
      `API request failed with status ${response.status}`,
      response.status,
      errorBody,
    );
  }

  const data: unknown = await response.json();
  try {
    return schema.parse(data);
  } catch (error) {
    throw new SatelliteApiError(
      "Invalid API response format",
      response.status,
      error,
    );
  }
}

// API Client implementation
export const satelliteApiClient = {
  async downloadSatelliteImages(
    params: DownloadSatelliteImagesQuery,
  ): Promise<DownloadSatelliteImagesResponse> {
    const validatedParams = DownloadSatelliteImagesQuerySchema.parse(params);
    const queryString = new URLSearchParams({
      latitude: validatedParams.latitude.toString(),
      longitude: validatedParams.longitude.toString(),
      zoom: validatedParams.zoom.toString(),
    }).toString();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/downloadSatelliteImages?${queryString}`,
        {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
          keepalive: true,
        },
      );

      return await handleApiResponse(
        response,
        DownloadSatelliteImagesResponseSchema,
      );
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new SatelliteApiError(
          "Request timeout",
          408,
          "Request took too long to complete",
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  },

  async analyzeSatelliteImages(
    params: AnalyzeSatelliteImagesQuery,
  ): Promise<AnalyzeSatelliteImagesResponse> {
    const validatedParams = AnalyzeSatelliteImagesQuerySchema.parse(params);
    const queryString = new URLSearchParams({
      analysis_type: validatedParams.type,
      image_id: validatedParams.image_id,
    }).toString();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.timeout);

    try {
      const response = await fetch(
        `${API_CONFIG.baseUrl}/analyzeSatelliteImages?${queryString}`,
        {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
          keepalive: true,
        },
      );

      return await handleApiResponse(
        response,
        AnalyzeSatelliteImagesResponseSchema,
      );
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        throw new SatelliteApiError(
          "Request timeout",
          408,
          "Request took too long to complete",
        );
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  },
};
