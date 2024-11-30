"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/ui/components/card";

// Initialize the mapboxgl access token -- stole it from the example
mapboxgl.accessToken =
  "pk.eyJ1IjoiZ29tbWVoZCIsImEiOiJjbTQ0bXJ2MjcwbGVyMmpyNHpqYjBvNjJsIn0.sOK0TBihHPHnPUTHAROaLA";

export const MapInterface: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: [-98, 40], // Centered on USA/North America
      zoom: 1, // Shows most of North America
      minZoom: 1,
    });

    // Cleanup on unmount
    return () => {
      map.current?.remove();
    };
  }, []);

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="text-2xl">Map Interface</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <div ref={mapContainer} className="h-full w-full rounded-md" />
      </CardContent>
    </Card>
  );
};
