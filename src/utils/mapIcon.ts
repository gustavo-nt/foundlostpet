import Leaflet from "leaflet";
import mapMarkerImg from "../assets/map-marker.png";

const mapIcon = Leaflet.icon({
  iconUrl: mapMarkerImg,
  iconSize: [38, 48],
  iconAnchor: [29, 68],
  popupAnchor: [-8, -68],
});

export default mapIcon;
