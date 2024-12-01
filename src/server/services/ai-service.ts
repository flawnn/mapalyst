import { evaluateQuery, synthesizeFindings } from "~/lib/vercel-ai/client";
import type { LocationQuery } from "~/lib/vercel-ai/types";
import type { FindingsSynthesis } from "~/lib/vercel-ai/client";

interface TimeSeriesDataPoint {
  timestamp: number;
  value: number;
}

export class AIService {
  static async evaluateQuery(query: string): Promise<LocationQuery> {
    return evaluateQuery(query);
  }

  static async synthesizeFindings(
    timeSeriesData: TimeSeriesDataPoint[],
    coordinates: { latitude: number; longitude: number },
    type: string
  ): Promise<FindingsSynthesis> {
    return synthesizeFindings(timeSeriesData, coordinates, type);
  }
}