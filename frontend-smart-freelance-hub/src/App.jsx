import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Signup from "./pages/signup";
import Profile from "./pages/profile";
import Login from "./pages/login";
import ClientProfile from "./pages/profileCl";
import ManageJobs from "./pages/manageJobs";
import VerifyAccount from "./pages/VerifyAccount";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Added by Mostakim
import { GoogleOAuthProvider } from "@react-oauth/google";
import TransactionPage from "./pages/TransactionPage";
import PaymentPage from "./pages/PaymentPage";
import BalanceTopUp from "./pages/balancetopup";
import BalanceWithdraw from "./pages/balancewithdraw";
// Testing
import ChatComponent from "./components/ChatComponent";
import "animate.css";

// Import ModalProvider
import { ModalProvider } from "./contexts/Modalcontext";

function App() {
  return (
    <GoogleOAuthProvider clientId="282275875531-a2cv3cpku9ncnmsaf0efdsa6dfe9srvi.apps.googleusercontent.com">
      <ModalProvider>
        <BrowserRouter>
          <ToastContainer
            position="top-center"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
          <Routes>
            <Route index element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profileCl" element={<ClientProfile />} />
            <Route path="/manageJobs" element={<ManageJobs />} />
            {/*added by Mostakim */}
            <Route path="/chattest" element={<ChatComponent />} />
            <Route path="/verify-account" element={<VerifyAccount />} />
            <Route path="/PaymentPage" element={<PaymentPage />} />
            <Route path="/TransactionPage" element={<TransactionPage />} />
            <Route path="/BalanceTopUp" element={<BalanceTopUp />} />
            <Route path="/BalanceWithdraw" element={<BalanceWithdraw />} />
          </Routes>

          {/* Place OTPModal outside the Routes to make it accessible from anywhere */}
        </BrowserRouter>
      </ModalProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
