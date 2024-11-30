"use client";

import React, { createContext, useCallback, useContext, useRef } from "react";

interface MapContextType {
  map: React.MutableRefObject<mapboxgl.Map | null>;
  flyTo: (position: { lng: number; lat: number; zoom: number }) => void;
  resetView: () => void;
  zoomTo: (coordinates: [number, number], zoom: number) => void;
}

const MapContext = createContext<MapContextType | null>(null);

export const MapProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const flyTo = useCallback(
    (position: { lng: number; lat: number; zoom: number }) => {
      mapRef.current?.flyTo({
        center: [position.lng, position.lat],
        zoom: position.zoom,
        duration: 4000,
      });
    },
    [],
  );

  const resetView = useCallback(() => {
    mapRef.current?.flyTo({
      center: [-98, 40],
      zoom: 3,
      duration: 4000,
    });
  }, []);

  const zoomTo = useCallback((coordinates: [number, number], zoom: number) => {
    mapRef.current?.flyTo({
      center: coordinates,
      zoom,
      duration: 4000,
    });
  }, []);

  return (
    <MapContext.Provider value={{ map: mapRef, flyTo, resetView, zoomTo }}>
      {children}
    </MapContext.Provider>
  );
};

export const useMap = () => {
  const context = useContext(MapContext);
  if (!context) throw new Error("useMap must be used within MapProvider");
  return context;
};
