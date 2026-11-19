import { createBrowserRouter, Navigate } from "react-router";
import App from "./App";
import { FlightSearch } from "./features/flights/FlightSearch";
import { AboutPage } from "./pages/AboutPage";
import { flightsLoader } from "./features/flights/loaders";

export const router = createBrowserRouter([
    {
        path: '/',
        Component: App,
        hydrateFallbackElement: <p className="empty">Loading ...</p>, // 1º load da app
        children: [
            {index: true, element: <Navigate to='/flights' replace/>},
            {path: 'flights', Component: FlightSearch, loader: flightsLoader },
            {path: 'about', Component: AboutPage },
        ]
    }
])