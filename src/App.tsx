import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import { LeaderboardProvider } from "@/context/LeaderboardContext";
import { AppRoutes } from "@/routes/AppRoutes";

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <LeaderboardProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </LeaderboardProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}
