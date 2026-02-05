import "./index.css";
import React, {Suspense, useRef} from "react";
import { Canvas } from "@react-three/fiber";
import ErrorBoundary from "./components/ErrorBoundary.jsx";
import GalaxyBackground from "@app/components/background/GalaxyBackground.jsx";
import {Outlet, useLocation} from "react-router-dom";
import HeroScene from "@app/components/HeroScene.jsx";
import {AboutLeft3D} from "@app/pages/AboutPage.jsx";
import {Environment, OrbitControls} from "@react-three/drei";
import SubtleCameraParallax from "@app/utils/SubtleCameraParallax.jsx";
import CameraController from "@app/components/camera/CameraController.jsx";
import {Vector3} from "three";

function SceneSwitch() {
    const { pathname } = useLocation();

    return (
        <>
            {pathname === "/" && <HeroScene />}
             {pathname.startsWith("/about") && <AboutLeft3D />}
            {/* Add more per-route 3D scenes here if you want */}
        </>
    );
}

export default function App() {

    return (
        <div className="relative h-screen bg-black text-white overflow-hidden">
            {/* Persistent 3D layer */}
            <ErrorBoundary>
                <Canvas
                    className="absolute inset-0 z-0"
                    gl={{ alpha: true, antialias: true }}
                    camera={{ position: new Vector3(10, 1, 0), fov: 60, near: 0.5, far: 100 }}
                    onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
                >
                    {/*<CameraController enableDamping dampingFactor={0.1} />*/}

                    <Suspense fallback={null}>
                        {/* Lights */}
                        <hemisphereLight intensity={0.35} />
                        <directionalLight
                            position={[3, 5, 5]}
                            intensity={1.2}
                            castShadow
                            shadow-mapSize={[1024, 1024]}
                        />

                        {/* Environment lighting */}
                        <Environment preset="sunset" environmentIntensity={0.50} background={false}/>

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

                        <SubtleCameraParallax
                            strength={0.52}            // try 0.08 – 0.18
                            maxScreenDeflection={0.4}
                            rebase={10}
                            damping={10}
                        />

                        {/* Route-aware slot for per-page 3D scenes */}
                        <SceneSwitch />
                    </Suspense>
                </Canvas>
            </ErrorBoundary>

            {/* Child routes render here */}
            <Outlet />

            {/* Optional: warm up a heavy page */}
            {/*<PreloadOnView importer={() => import("./pages/ProjectsPage.jsx")} />*/}

            {/* Bottom vignette */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent z-5" />
        </div>
    );
}