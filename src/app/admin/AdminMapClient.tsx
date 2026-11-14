"use client";

import { useEffect, useRef } from "react";
import { useMap } from "../../hooks/useMap";
import { socket } from "../../utils/socket-io";
import { parseRouteId } from "../../utils/route-input";
import { isMoveForRoute, validGps } from "../../utils/route-socket-data";

function AdminMapClient() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const map = useMap(mapContainerRef);

  useEffect(() => {
    if (!map) return;
    let disposed = false;

    const handleMoved = async (payload: unknown) => {
      if (!payload || typeof payload !== "object") return;
      const routeId = parseRouteId((payload as { route_id?: unknown }).route_id);
      if (!routeId || !isMoveForRoute(payload, routeId) || disposed) return;
      const data = payload;
      if (!map.hasRoute(routeId)) {
        try {
          const response = await fetch(`/api/routes/${encodeURIComponent(routeId)}`,
            { cache: "no-store" });
          if (!response.ok) return;
          const route = await response.json();
          if (disposed || map.hasRoute(routeId)) return;
          const leg = route?.directions?.routes?.[0]?.legs?.[0];
          if (!validGps(leg?.start_location) || !validGps(leg?.end_location)) return;
          map.addRouteWithIcons({
            routeId,
            startMarkerOptions: { position: leg.start_location },
            endMarkerOptions: { position: leg.end_location },
            carMarkerOptions: { position: leg.start_location },
          });
        } catch {
          return;
        }
      }
      if (!disposed) map.moveCar(routeId, { lat: data.lat, lng: data.lng });
    };

    socket.connect();
    socket.on("server:new-points:list", handleMoved);
    return () => {
      disposed = true;
      socket.off("server:new-points:list", handleMoved);
      socket.disconnect();
    };
  }, [map]);

  return <div className="h-full w-full" ref={mapContainerRef} />;
}

export default AdminMapClient;
