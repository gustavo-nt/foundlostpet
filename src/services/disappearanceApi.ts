import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_FOUNDLOSTPET_API_URL,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response.status === 401) {
      localStorage.removeItem("@FoundLostPet:token");
      localStorage.removeItem("@FoundLostPet:user");

      window.location.href = "/";
    }
  },
);

export default api;
