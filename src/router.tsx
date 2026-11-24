import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import { FlightSearch } from "./features/flights/FlightSearch";
import { flightLoader, flightsLoader } from "./features/flights/loaders";
import { RouteError } from "./pages/RouteError";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: App,
    hydrateFallbackElement: <p className="empty">Loading ...</p>, // 1º load da app
    children: [ //pathless route
      {
        ErrorBoundary: RouteError,
        children: [
          { index: true, element: <Navigate to="/flights" replace /> },
          {
            path: "flights",
            Component: FlightSearch,
            loader: flightsLoader,
          },
          {
            path: "flights/:id",
            loader: flightLoader,
            lazy: async() => {
              const {FlightDetail} = await import('./features/flights/FlightDetail');
              return {Component: FlightDetail};
            }
          },
          { 
            path: "about",
            lazy: async() => {
              const {AboutPage} = await import('./pages/AboutPage');
              return {Component: AboutPage};
            }
           },
          { path: "*", Component: NotFoundPage },
        ],
      },
    ],
  },
]);
