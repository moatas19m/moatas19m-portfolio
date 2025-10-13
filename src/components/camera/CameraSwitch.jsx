import React, { useMemo } from "react";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import { useLocation } from "react-router-dom";

export default function CameraSwitch() {
    const { pathname } = useLocation();
    const isHome = pathname === "/";

    const camProps = useMemo(() => {
        if (isHome) {
            // HeroScene camera (default)
            return { position: [10, 1, 0], fov: 60, near: 0.5, far: 100 };
        }
        // PageCamera (default for all other routes)
        return { position: [0, 0, 0], fov: 60, near: 0.5, far: 100 };
    }, [isHome]);

    return (
        <>
            <PerspectiveCamera makeDefault {...camProps} />
            {!isHome && (
                <OrbitControls
                    makeDefault
                    enableDamping
                    dampingFactor={0.08}
                    maxPolarAngle={Math.PI * 0.58}
                    minDistance={2}
                    maxDistance={24}
                />
            )}
        </>
    );
}