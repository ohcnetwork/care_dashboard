import { Error404 } from "../pages/Error404";
import { Routes } from "./types";

export const errorRouter: Routes[] = [
  { path: "*", element: <Error404 /> },
  { path: "404", element: <Error404 /> },
];
