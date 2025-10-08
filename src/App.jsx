import "./index.css";
import React, {Suspense, useEffect, useState} from "react";
import { BrowserRouter, Routes, Route, useLocation, Outlet } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Canvas, invalidate } from "@react-three/fiber";
import { Vector3 } from "three";

import HeroScene from "./components/HeroScene.jsx"; // now exports a GROUP, not a Canvas (see below)
// DOM pages
import ProjectsPage from "./pages/ProjectsPage.jsx";
import AboutPage, { AboutLeft3D } from "./pages/AboutPage.jsx";
import WorkPage from "./pages/WorkPage.jsx";
import SkillsPage from "./pages/SkillsPage.jsx";
import HobbiesPage from "./pages/HobbiesPage.jsx";
import ContactPage from "./pages/ContactPage.jsx";

import GalaxyBackground from "@app/components/background/GalaxyBackground.jsx";
import {View, Environment, OrbitControls} from "@react-three/drei";

function PageWrapper({ children }) {
    return (
        <motion.div
            className="h-full w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
        >
            {children}
        </motion.div>
    );
}

function RouteContent3D() {
    const { pathname } = useLocation();
    const [leftEl, setLeftEl] = useState(null);

    // After the DOM route mounts, capture the tracked div for Views
    useEffect(() => {
        // Wait a microtask to ensure the DOM route had time to render its layout
        queueMicrotask(() => {
            setLeftEl(document.getElementById("left-3d-view") || null);
            invalidate(); // ensure a frame after route/dom changes
        });
    }, [pathname]);

    return (
        <>
            {/* Home route renders a full-scene 3D subtree */}
            {pathname === "/" && <HeroScene />}

            {/* About route renders into SplitCanvasLayout's left pane via <View> */}
            {pathname === "/about" && leftEl && (
                <View track={leftEl}>
                    {/* Per-view camera + controls + lights */}
                    <perspectiveCamera position={[0, 2.5, 6]} fov={50} makeDefault />
                    <ambientLight intensity={0.5} />
                    <directionalLight position={[3, 5, 3]} intensity={0.8} />
                    <Environment preset="city" environmentIntensity={0.2} />
                    <OrbitControls enablePan={false} enableZoom={false} />

                    {/* The page's 3D subtree */}
                    <AboutLeft3D />
                </View>
            )}

            {/* TODO: add more Views for other split pages as you build them */}
        </>
    );
}

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <>
            {/* Persistent 3D layer (behind DOM) */}
            <Canvas
                className="pointer-events-none absolute inset-0 z-10"
                gl={{ alpha: true, antialias: true }}
                camera={{ position: new Vector3(10, 1, 0), fov: 60, near: 0.5, far: 100 }}
                // frameloop="demand"                          // render only when needed
                onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
            >
                <Suspense fallback={null}>
                    {/* Global background stays mounted across routes */}
                    <GalaxyBackground
                        count={200000}
                        size={0.01}
                        radius={16}
                        branches={3}
                        spin={1.1}
                        randomness={1}
                        randomnessPower={3}
                        insideColor="#ffd28a"
                        outsideColor="#4563ff"
                        fadeIn={0.6}
                        rotationSpeed={0.04}
                    />

                    {/* Foreground 3D swaps by route */}
                    <RouteContent3D />
                </Suspense>
            </Canvas>

            {/* DOM routes with transitions */}
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<PageWrapper><div /></PageWrapper>} />
                    <Route path="/about" element={<PageWrapper><AboutPage /></PageWrapper>} />
                    {/*<Route path="/hobbies" element={<PageWrapper><HobbiesPage /></PageWrapper>} />*/}
                    {/*<Route path="/projects" element={<PageWrapper><ProjectsPage /></PageWrapper>} />*/}
                    {/*<Route path="/work" element={<PageWrapper><WorkPage /></PageWrapper>} />*/}
                    {/*<Route path="/skills" element={<PageWrapper><SkillsPage /></PageWrapper>} />*/}
                    {/*<Route path="/contact" element={<PageWrapper><ContactPage /></PageWrapper>} />*/}
                </Routes>
            </AnimatePresence>

            {/* Cinematic bottom fade */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent z-10" />
        </>
    );
}

export default function App() {
    return (
        <BrowserRouter>
            <div className="relative h-screen bg-black text-white overflow-hidden">
                <AnimatedRoutes />
                {/* Your DOM page sections/components go here if needed */}
                <Outlet />
            </div>
        </BrowserRouter>
    );
}