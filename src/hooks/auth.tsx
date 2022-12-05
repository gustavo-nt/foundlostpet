import { createContext, useCallback, useState, useContext } from "react";

import api from "../services/disappearanceApi";

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address: {
    id: string;
    city: string;
    uf: string;
    latitude: number;
    longitude: number;
    created_at: string;
    updated_at: string;
  };
}

interface AuthState {
  token: string;
  user: User;
}

interface SignInCredentials {
  email: string;
  password: string;
}

interface AuthContextData {
  user: User;
  signOut(): void;
  updateUser(user: User): void;
  signIn(credentials: SignInCredentials): Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [data, setData] = useState<AuthState>(() => {
    const token = localStorage.getItem("@FoundLostPet:token");
    const user = localStorage.getItem("@FoundLostPet:user");

    if (token && user) {
      api.defaults.headers.authorization = `Bearer ${token}`;

      return { token, user: JSON.parse(user) };
    }

    return {} as AuthState;
  });

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    const response = await api.post("sessions", { email, password });

    const { token, user } = response.data;

    localStorage.setItem("@FoundLostPet:token", token);
    localStorage.setItem("@FoundLostPet:user", JSON.stringify(user));

    api.defaults.headers.authorization = `Bearer ${token}`;

    setData({ token, user });
  }, []);

  const signOut = useCallback(() => {
    localStorage.removeItem("@FoundLostPet:token");
    localStorage.removeItem("@FoundLostPet:user");

    setData({} as AuthState);
  }, []);

  const updateUser = useCallback(
    (user: User) => {
      setData({
        token: data.token,
        user,
      });

      localStorage.setItem("@FoundLostPet:user", JSON.stringify(user));
    },
    [data.token],
  );

  return (
    <AuthContext.Provider
      value={{ user: data.user, signIn, signOut, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  return context;
}

export { AuthProvider, useAuth };
