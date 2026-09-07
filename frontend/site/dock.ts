import { createElement } from "react";
import { createRoot } from "react-dom/client";

import { SiteDock } from "./SiteDock";

const root = document.getElementById("site-dock-root");

if (root) {
  createRoot(root).render(createElement(SiteDock));
}
