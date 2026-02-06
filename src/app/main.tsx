import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { AppRouter } from "./appRouter";
import { ChangeAppThemeProvider } from "@/features/changeAppTheme";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChangeAppThemeProvider>
      <AppRouter />
    </ChangeAppThemeProvider>
  </StrictMode>,
);
