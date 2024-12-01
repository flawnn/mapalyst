import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { satelliteApiClient } from "~/server/infrastructure/satellite-api-client";
import { AIService } from "~/server/services/ai-service";
import { createTRPCRouter, publicProcedure } from "../trpc";

// Response schemas
const FindingsSynthesisResponseSchema = z.object({
  summary: z.string(),
  keyFindings: z.array(z.string()),
  trend: z.enum(["increasing", "decreasing", "stable", "fluctuating"]),
  confidence: z.number().min(0).max(1),
});

export const satelliteRouter = createTRPCRouter({
  analyzeQuery: publicProcedure
    .input(z.object({ query: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const aiResult = await AIService.evaluateQuery(input.query);
        const coordinates = aiResult.coordinates?.split(",").map(Number);
        const lat = coordinates?.[0];
        const lon = coordinates?.[1];

        if (!coordinates || coordinates.length !== 2 || isNaN(lat!) || isNaN(lon!)) {
          throw new Error("Invalid coordinates returned from AI");
        }

        const zoom = aiResult.type.toLowerCase().includes("car") ? 100 : 1000;

        const satelliteResult = await satelliteApiClient.downloadSatelliteImages({
          latitude: lat!,
          longitude: lon!,
          zoom,
        });

        return {
          coordinates: { latitude: lat!, longitude: lon! },
          type: aiResult.type,
          images: satelliteResult.images,
          image_id: satelliteResult.image_id,
        };
      } catch (error) {
        console.error("Error in analyzeQuery:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    }),

  analyzeImages: publicProcedure
    .input(
      z.object({
        image_id: z.string(),
        type: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      try {
        const result = await satelliteApiClient.analyzeSatelliteImages({
          image_id: input.image_id,
          type: input.type,
        });

        const timeSeriesData = result.counts.map((value: number, index: number) => ({
          timestamp: new Date(2023, index, 1).getTime(),
          value,
        }));

        return {
          processedImages: result.processed_images,
          timeSeriesData,
        };
      } catch (error) {
        console.error("Error in analyzeImages:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    }),

  synthesizeFindings: publicProcedure
    .input(
      z.object({
        timeSeriesData: z.array(
          z.object({
            timestamp: z.number(),
            value: z.number(),
          })
        ),
        coordinates: z.object({
          latitude: z.number(),
          longitude: z.number(),
        }),
        type: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const findings = await AIService.synthesizeFindings(
          input.timeSeriesData,
          input.coordinates,
          input.type
        );

        return FindingsSynthesisResponseSchema.parse(findings);
      } catch (error) {
        console.error("Error in synthesizeFindings:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: error instanceof Error ? error.message : "Unknown error occurred",
        });
      }
    }),
});
