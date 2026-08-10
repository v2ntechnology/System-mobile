import "@fontsource-variable/inter";
import "@fontsource-variable/sora";
import "./styles/global.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { App } from "./app/app";
import { applyPerformanceProfile } from "./lib/performance";

// FE-07 — decide antes da primeira pintura se o blur fica ativo.
applyPerformanceProfile();

const container = document.getElementById("root");
if (!container) throw new Error("Elemento #root não encontrado em index.html");

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
