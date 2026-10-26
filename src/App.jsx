import React from "react";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import { AppRoutes } from "./routes/AppRoutes.jsx";

import "./styles/global.css";
import "./styles/layout.css";
import "./styles/components.css";

export function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  );
}

export default App;
