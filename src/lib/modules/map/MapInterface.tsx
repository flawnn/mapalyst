"use client";

import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useRef } from "react";
import { Card } from "~/ui/components/card";
import { useMap } from "./context/MapContext";

// Initialize the mapboxgl access token -- stole it from the example
mapboxgl.accessToken =
  "pk.eyJ1IjoiZ29tbWVoZCIsImEiOiJjbTQ0bXJ2MjcwbGVyMmpyNHpqYjBvNjJsIn0.sOK0TBihHPHnPUTHAROaLA";

export const MapInterface: React.FC = () => {
  const { map } = useMap();
  const mapContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      center: [-98, 40],
      zoom: 1,
      minZoom: 1,
      attributionControl: false,
      logoPosition: "bottom-right",
    });

    return () => {
      map.current?.remove();
    };
  }, [map]);

  return (
    <Card className="relative flex h-full flex-col overflow-hidden">
      <div className="absolute left-6 top-6 z-[5]">
        <div className="bg-background/60 rounded-lg px-4 py-2 shadow-lg backdrop-blur-md">
          <h2 className="text-2xl font-semibold">Map</h2>
        </div>
      </div>
      <div ref={mapContainer} className="h-full w-full" />
    </Card>
  );
};
