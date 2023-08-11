import React from "react";
import ReactDOM from "react-dom/client";
import Router from "./Router.tsx";
import "./index.css";
import { Toaster } from "@/shared/components/ui/toaster.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router />
    <Toaster />
  </React.StrictMode>
);
