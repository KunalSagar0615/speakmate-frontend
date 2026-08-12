import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useEffect } from "react";
import AppRoutes from "./routes/AppRoutes";
import { ReportsProvider } from "./context/ReportsContext";
import { SettingsProvider } from "./context/SettingsContext";

export default function App() {
  useEffect(() => {
    fetch(
      "https://speakmate-ai-friend.onrender.com/actuator/health"
    ).catch(() => {});
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <ReportsProvider>
        <SettingsProvider>
          <AppRoutes />
        </SettingsProvider>
      </ReportsProvider>
    </BrowserRouter>
  );
}