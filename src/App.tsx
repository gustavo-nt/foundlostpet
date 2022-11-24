import { Router } from "./Routes";
import { BrowserRouter } from "react-router-dom";
import { LocationContextProvider } from "./contexts/LocationContext";

import "leaflet/dist/leaflet.css";
import "./styles/global.scss";

export function App() {
  return (
    <BrowserRouter>
      <LocationContextProvider>
        <Router />
      </LocationContextProvider>
    </BrowserRouter>
  );
}
