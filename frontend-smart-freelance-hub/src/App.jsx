import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import Login from "./pages/login";

//Added by Mostakim
import { GoogleOAuthProvider } from "@react-oauth/google";
//

function App() {
  return (
    <GoogleOAuthProvider clientId="282275875531-a2cv3cpku9ncnmsaf0efdsa6dfe9srvi.apps.googleusercontent.com">
      <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
}

export default App;
