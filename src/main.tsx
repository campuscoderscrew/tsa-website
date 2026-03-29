import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";

import ConnectWithUs from "./components/connect-with-us/connect-with-us";
import Test from "./components/test/test";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ConnectWithUs />
        <Test />
    </StrictMode>
);
