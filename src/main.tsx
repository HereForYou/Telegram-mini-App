import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import WebApp from "@twa-dev/sdk";

import "./index.css";
import ToastrProvider from "./providers/toastrProvider.tsx";

WebApp.ready();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <TonConnectUIProvider manifestUrl="https://mike-coin-bot-1.vercel.app/tonconnect-manifest.json">
    <ToastrProvider position="top-center">
      <App />
    </ToastrProvider>
  </TonConnectUIProvider>
);
