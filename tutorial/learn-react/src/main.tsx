import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import PackingList from "./PackingList";
// import App from "./App";
// import Gallery from "./Gallery";
// import TodoList from "./TodoList";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* <Gallery /> */}
    {/* <TodoList /> */}
    {/* <App /> */}
    <PackingList />
  </StrictMode>
);
