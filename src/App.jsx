import {
  ClerkProvider,
  SignIn,
  SignUp,
  Show,
  RedirectToSignIn,
  UserButton,
} from "@clerk/react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import App, { AppLayout } from "../LedgerLaw-ai-v2.jsx";

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ClerkProviderWithNavigate({ children }) {
  const navigate = useNavigate();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      navigate={(to) => navigate(to)}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      signInFallbackRedirectUrl="/"
      signUpFallbackRedirectUrl="/"
      afterSignOutUrl="/"
    >
      {children}
    </ClerkProvider>
  );
}

function ProtectedRoute({ children }) {
  return (
    <Show when="signed-in" fallback={<RedirectToSignIn />}>
      {children}
    </Show>
  );
}

export default function AppWithAuth() {
  if (!clerkPubKey) {
    return <App />;
  }

  return (
    <BrowserRouter>
      <ClerkProviderWithNavigate>
        <Routes>
          <Route path="/sign-in/*" element={<SignIn />} />
          <Route path="/sign-up/*" element={<SignUp />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout userSlot={<UserButton />} />
              </ProtectedRoute>
            }
          />
        </Routes>
      </ClerkProviderWithNavigate>
    </BrowserRouter>
  );
}
