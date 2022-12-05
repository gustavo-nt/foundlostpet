import { useEffect } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import { LatLngTuple, LeafletMouseEvent } from "leaflet";

interface LeafletContentProps {
  isEnableTouch?: boolean;
  position?: LatLngTuple;
  isCentered: boolean;
  onClickMap?: (e: LeafletMouseEvent) => void;
}

export const LeafletContent = ({
  onClickMap,
  isEnableTouch,
  position,
  isCentered,
}: LeafletContentProps) => {
  const map = useMap();

  useMapEvent("click", (e) => {
    if (onClickMap && isEnableTouch) {
      onClickMap(e);
    }
  });

  useEffect(() => {
    if (position) {
      if (isCentered) {
        map.setView(position, 15, {
          animate: true,
        });
      } else {
        map.latLngToContainerPoint(position);
      }
    }
  }, [map, position, isEnableTouch, isCentered]);

  return null;
};
