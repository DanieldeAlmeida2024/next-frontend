"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../../hooks/useMap";
import { socket } from "../../utils/socket-io";
import { parseRouteId } from "../../utils/route-input";
import { isMoveForRoute, validGps } from "../../utils/route-socket-data";
import type { DriverMovedPayload } from "../../utils/route-socket-data";

export type MapDriverProps = { routeIdElementId: string };

export function MapDriver({ routeIdElementId }: MapDriverProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    if (!map || !routeIdElementId) return;
    const element = document.getElementById(routeIdElementId);
    if (!(element instanceof HTMLSelectElement)) return;

    let eventName: string | null = null;
    let movedHandler: ((data: unknown) => void) | null = null;
    let generation = 0;
    let disposed = false;

    function unsubscribe() {
      if (eventName && movedHandler) socket.off(eventName, movedHandler);
      eventName = null;
      movedHandler = null;
    }

    function onRouteChange() {
      unsubscribe();
      generation += 1;
      const routeId = parseRouteId(element.value);
      if (!routeId) return;
      const subscribedGeneration = generation;
      const name = `server:new-points/${routeId}:list`;

      const handler = async (value: unknown) => {
        if (disposed || subscribedGeneration !== generation ||
            !isMoveForRoute(value, routeId)) return;
        const data: DriverMovedPayload = value;
        if (!map.hasRoute(routeId)) {
          try {
            const response = await fetch(`/api/routes/${encodeURIComponent(routeId)}`,
              { cache: "no-store" });
            if (!response.ok) return;
            const route = await response.json();
            if (disposed || subscribedGeneration !== generation) return;
            const leg = route?.directions?.routes?.[0]?.legs?.[0];
            if (!validGps(leg?.start_location) || !validGps(leg?.end_location)) return;
            map.addRouteWithIcons({
              routeId,
              startMarkerOptions: { position: leg.start_location },
              endMarkerOptions: { position: leg.end_location },
              carMarkerOptions: { position: leg.start_location },
            });
          } catch {
            return; // API do laboratório fora do ar: nunca aplicar posição parcial.
          }
        }
        if (!disposed && subscribedGeneration === generation) {
          map.moveCar(routeId, { lat: data.lat, lng: data.lng });
        }
      };

      eventName = name;
      movedHandler = handler;
      socket.on(name, handler);
    }

    socket.connect();
    element.addEventListener("change", onRouteChange);
    onRouteChange();

    return () => {
      disposed = true;
      generation += 1;
      element.removeEventListener("change", onRouteChange);
      unsubscribe();
      socket.disconnect();
    };
  }, [routeIdElementId, map]);

  return <div className="w-2/3 h-full" ref={mapContainerRef} />;
}
