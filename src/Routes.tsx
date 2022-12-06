import { Route, Routes } from "react-router-dom";

import { Map } from "./pages/Map";
import { Home } from "./pages/Home";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/Signup";
import { Profile } from "./pages/Profile";
import { NotFound } from "./pages/NotFound";
import { Disappearance } from "./pages/Disappearance";
import { ResetPassword } from "./pages/ResetPassword";
import { CreateDisappearance } from "./pages/CreateDisappearance";
import { UpdateDisappearance } from "./pages/UpdateDisappearance";

export function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/map" element={<Map />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/create-disappearance" element={<CreateDisappearance />} />
      <Route
        path="/update-disappearance/:id"
        element={<UpdateDisappearance />}
      />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/disappearance/:id" element={<Disappearance />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
