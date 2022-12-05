import { AuthProvider } from "./auth";
import { ToastProvider } from "./toast";
import { LocationProvider } from "./location";

interface AppProviderProps {
  children: React.ReactNode;
}

const AppProvider = ({ children }: AppProviderProps) => (
  <AuthProvider>
    <LocationProvider>
      <ToastProvider>{children}</ToastProvider>
    </LocationProvider>
  </AuthProvider>
);

export default AppProvider;
