import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import './index.css'
import { AuthProvider } from "./context/AuthContext";
import { LocationProvider } from "./context/LocationProvider";

ReactDOM.createRoot(document.getElementById("root")).render(
<LocationProvider>
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
  </LocationProvider>
);
