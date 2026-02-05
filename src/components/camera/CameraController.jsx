import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLocation } from "react-router-dom";
import { cameraConfig } from "@app/constants/cameraConfig.js";
import { controlsConfig } from "@app/constants/controlsConfig.js";

export default function CameraController(props) {
    const { pathname } = useLocation();
    const { camera } = useThree();
    const isHome = pathname === "/";

    // Select proper config
    const cam = isHome ? cameraConfig.home : cameraConfig.other;
    const ctrl = isHome ? controlsConfig.home : controlsConfig.other;

    // Update camera parameters
    useEffect(() => {
        camera.position.set(...cam.position);
        camera.near = cam.near;
        camera.far = cam.far;
        camera.fov = cam.fov;
        camera.updateProjectionMatrix();
    }, [cam, camera]);

    return <OrbitControls makeDefault {...props} {...ctrl} />;
}