import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { TrafficControlProvider } from "./context/TrafficControlContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <TrafficControlProvider>
      <App />
  </TrafficControlProvider>
);
