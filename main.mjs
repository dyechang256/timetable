import "./src/register.mjs";
import { routes } from "./src/routes.mjs";
import { DB, CLASS_STORE_NAME } from "./src/shared/db.mjs";

function onHashChange() {
  const hash = window.location.hash;
  console.log(hash);
  if (hash === "") {
    window.location.hash = "#home";
  }
  const page = routes[hash];
  if (!page) {
    console.warn("unknown route");
    return;
  }
  const appRoot = document.querySelector("app-root");
  appRoot.innerHTML = page;
}
window.addEventListener("hashchange", onHashChange);
onHashChange();
