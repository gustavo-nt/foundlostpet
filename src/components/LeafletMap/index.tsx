import { LeafletMouseEvent, LatLngTuple } from "leaflet";
import { MapContainer, TileLayer, useMapEvent, useMap } from "react-leaflet";
import { LeafletContent } from "./components/LeafletContent";

interface LeafletMapProps {
  isEnableTouch?: boolean;
  isCentered?: boolean;
  children?: React.ReactNode;
  position?: LatLngTuple;
  onClickMap?: (e: LeafletMouseEvent) => void;
}

export function LeafletMap({
  children,
  onClickMap,
  isCentered = false,
  isEnableTouch = true,
  position,
}: LeafletMapProps) {
  return (
    <MapContainer
      center={[-29.642238999999986, -50.79557500000001]}
      style={{ width: "100%", height: "100%" }}
      minZoom={5}
      zoom={15}
    >
      <TileLayer
        url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}@2x?access_token=${
          import.meta.env.VITE_MAPBOX_TOKEN
        }`}
      />
      {children}
      <LeafletContent
        onClickMap={onClickMap}
        isEnableTouch={isEnableTouch}
        position={position}
        isCentered={isCentered}
      />
    </MapContainer>
  );
}
