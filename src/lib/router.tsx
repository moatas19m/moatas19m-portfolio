import { createBrowserRouter } from "react-router-dom";
import { lazy, Suspense } from "react";

// Keep App as the persistent layout that owns the Canvas + Galaxy background.
const AppLayout     = lazy(() => import("../App.jsx"));
const ProjectsPage  = lazy(() => import("../pages/ProjectsPage.jsx"));
const AboutPage     = lazy(() => import("../pages/AboutPage.jsx"));
// const WorkPage      = lazy(() => import("../pages/WorkPage.jsx"));
// const SkillsPage    = lazy(() => import("../pages/SkillsPage.jsx"));
// const HobbiesPage   = lazy(() => import("../pages/HobbiesPage.jsx"));
// const ContactPage   = lazy(() => import("../pages/ContactPage.jsx"));

const withSuspense = (el: JSX.Element) => (
    <Suspense fallback={<div className="p-6 text-white/80">Loading…</div>}>{el}</Suspense>
);

export const router = createBrowserRouter([
    {
        path: "/",
        element: withSuspense(<AppLayout />),

        children: [
            { index: true, element: withSuspense(<div />) },
            { path: "projects", element: withSuspense(<ProjectsPage />) },
            { path: "about",    element: withSuspense(<AboutPage />) },
            // { path: "work",     element: withSuspense(<WorkPage />) },
            // { path: "skills",   element: withSuspense(<SkillsPage />) },
            // { path: "hobbies",  element: withSuspense(<HobbiesPage />) },
            // { path: "contact",  element: withSuspense(<ContactPage />) },

            // { path: "*", element: withSuspense(<NotFound />) },
        ],
    },
]);