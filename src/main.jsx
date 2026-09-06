import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// STRIPE IMPORTS
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

//  GOOGLE AUTH IMPORT
import { GoogleOAuthProvider } from "@react-oauth/google";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
);

// Google Client ID
const GOOGLE_CLIENT_ID = "441112021745-gjvon0valn6vmalq9872u497rqi0npoa.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Elements stripe={stripePromise}>
        <App />
      </Elements>
    </GoogleOAuthProvider>
  </StrictMode>
);