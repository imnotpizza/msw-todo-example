import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { startMsw } from "./mocks/startMsw.ts";

async function initMsw() {
  if (import.meta.env.VITE_MSW_ENABLED === "true") {
    await startMsw();
  }
}

initMsw().then(() => {
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
});
