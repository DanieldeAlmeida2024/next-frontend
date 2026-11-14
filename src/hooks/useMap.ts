import { Loader } from "@googlemaps/js-api-loader";
import { useEffect, useState, type RefObject } from "react";
import { Map } from "../utils/map";
import { getCurrentPosition } from "./geolocation";

export function useMap(containerRef: RefObject<HTMLDivElement | null>) {
  const [map, setMap] = useState<Map>();

  useEffect(() => {
    (async () => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        libraries: ["routes", "geometry", "marker"],
      });
      const [, , , position] = await Promise.all([
        loader.importLibrary("routes"),
        loader.importLibrary("geometry"),
        loader.importLibrary("marker"),
        getCurrentPosition({ enableHighAccuracy: true }),
      ]);
      const element = containerRef.current;
      if (!element) return;
      const map = new Map(element, {
        mapId: "8e0a97af9386fef", //theme
        zoom: 15,
        center: position,
      });
      setMap(map);
    })();
  }, [containerRef]);

  return map;
}
