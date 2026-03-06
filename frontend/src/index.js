import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

// Global reset — minimal, no external CSS dependencies
const globalStyles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #f0f2f5; color: #333; }
  a { color: #2980b9; }
  button:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const style = document.createElement("style");
style.textContent = globalStyles;
document.head.appendChild(style);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
