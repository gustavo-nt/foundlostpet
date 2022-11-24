import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/geocodeApi";

interface GeoLocation {
  uf: string;
  city: string;
  country: string;
  ufCode: string;
  longitude: number;
  latitude: number;
}

interface LocationContextProviderProps {
  children: React.ReactNode;
}

interface LocationContextData {
  geoLocation: GeoLocation;
}

export const LocationContext = createContext({} as LocationContextData);

export const LocationContextProvider = ({
  children,
}: LocationContextProviderProps) => {
  const [geoLocation, setGeoLocation] = useState({
    latitude: -30.0277,
    longitude: -51.2287,
    uf: "Rio Grande do Sul",
    city: "Porto Alegre",
    country: "Brasil",
    ufCode: "RS",
  } as GeoLocation);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setReverseGeoCode(latitude, longitude);
      });
    }

    async function setReverseGeoCode(latitude: number, longitude: number) {
      const { data } = await api.get("/data/reverse-geocode-client", {
        params: {
          latitude,
          longitude,
          localityLanguage: "pt",
        },
      });

      setGeoLocation({
        latitude,
        longitude,
        city: data.city,
        country: data.countryName,
        uf: data.principalSubdivision,
        ufCode: data.principalSubdivisionCode.slice(-2),
      });
    }
  }, []);

  return (
    <LocationContext.Provider
      value={{
        geoLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocationContext = () => useContext(LocationContext);
