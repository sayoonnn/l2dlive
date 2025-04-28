import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { web } from "../client_secret.json";
import App from "./App";

createRoot(document.getElementById("root")!).render(<App />);
