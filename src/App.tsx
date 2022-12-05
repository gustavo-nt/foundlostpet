import { Router } from "./Routes";
import { BrowserRouter } from "react-router-dom";

import "leaflet/dist/leaflet.css";
import "./styles/global.scss";

import AppProvider from "./hooks";

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Router />
      </AppProvider>
    </BrowserRouter>
  );
}
