// src/components/BikeWithRiderBones.jsx
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { BONES } from "../constants/limbs";

/**
 * Bone-only posing (no animation clips).
 * Assumes Mixamo-like bone names; adjust regex map below if needed.
 * Sockets used if present on the bike: SeatSocket, FrontWheel, BackWheel.
 */
export default function BikeWithRiderBones({
  bikeUrl = "/src/assets/models/motorcycle.glb",
  riderUrl = "/src/assets/models/rider.glb",
  mountDelay = 0.35,     // seconds before we start posing
  poseDuration = 0.8,    // seconds to blend from T to seated
  driveDelay = 0.95,     // seconds after mount start to begin driving
  driveDuration = 3.0,   // seconds to drive toward camera
  liftOffset = 0.02,     // lift rider slightly above seat
  spinFactor = 16,       // wheel spin speed
}) {
  const group = useRef();
  const bikeRef = useRef();
  const riderRef = useRef();
  const { camera } = useThree();

  // Load models
  const bikeGltf = useGLTF(bikeUrl);
  const riderGltf = useGLTF(riderUrl);

  // Find sockets/wheels on bike
  const seat = useMemo(() => bikeGltf.scene.getObjectByName("SeatSocket") || null, [bikeGltf]);
  const frontWheel = useMemo(() => bikeGltf.scene.getObjectByName("FrontWheel") || null, [bikeGltf]);
  const backWheel  = useMemo(() => bikeGltf.scene.getObjectByName("BackWheel")  || null, [bikeGltf]);

  // Pose engine state
  const bones = useRef({});
  const initial = useRef({}); // initial bone quaternions/positions
  const target  = useRef({}); // target bone quaternions/positions (seated)
  const mountStart = useRef(0);
  const driveStart = useRef(0);
  const startedMount = useRef(false);
  const startedDrive = useRef(false);

  // Seat snap (position/orientation) once models are in
  useEffect(() => {
    if (!riderRef.current || !bikeRef.current) return;
    const riderRoot = riderRef.current;

    if (seat) {
      seat.updateWorldMatrix(true, true);
      riderRoot.updateWorldMatrix(true, true);
      seat.getWorldPosition(riderRoot.position);
      seat.getWorldQuaternion(riderRoot.quaternion);
      riderRoot.position.y += liftOffset;
    } else {
      // fallback: roughly above bike center
      const b = new THREE.Box3().setFromObject(bikeRef.current);
      const c = new THREE.Vector3(); b.getCenter(c);
      riderRoot.position.copy(c).add(new THREE.Vector3(0, 0.85, 0));
      riderRoot.rotation.y = Math.PI; // face forward (tweak as needed)
    }
  }, [seat, liftOffset]);

  // Collect Mixamo-like bones and define seated targets
  useEffect(() => {
    if (!riderRef.current) return;

    const map = {
      hips: BONES.HIPS,
      spine: BONES.SPINE,
      leftUpperLeg: BONES.LEFT_UP_LEG,
      leftLowerLeg: BONES.LEFT_LEG,
      rightUpperLeg: BONES.RIGHT_UP_LEG,
      rightLowerLeg: BONES.RIGHT_LEG,
      leftArm: BONES.LEFT_ARM,
      leftForeArm: BONES.LEFT_FOREARM,
      rightArm: BONES.RIGHT_ARM,
      rightForeArm: BONES.RIGHT_FOREARM,
      head: BONES.HEAD,
      leftFoot: BONES.LEFT_FOOT,
      rightFoot: BONES.RIGHT_FOOT,
    };

    const found = {};
    riderRef.current.traverse(o => {
      if (o.isBone) {
        for (const [k, boneName] of Object.entries(map)) {
          if (o.name === boneName) found[k] = o;
        }
      }
    });

    bones.current = found;

    // Save initial quaternions/positions
    for (const [k, b] of Object.entries(found)) {
      initial.current[k] = {
        q: b.quaternion.clone(),
        p: b.position.clone(),
      };
    }

    // Define targets (SEATED RIDE) as quaternions for robust interpolation.
    // Angles in radians; tweak to your model.
    const deg = (d) => (d * Math.PI) / 180;
    const toQuat = (eulerXYZ) => new THREE.Quaternion().setFromEuler(
      new THREE.Euler(eulerXYZ.x, eulerXYZ.y, eulerXYZ.z, "XYZ")
    );

    target.current = {
      // lower pelvis a bit (use bone local position)
      hips: {
        p: new THREE.Vector3(0, -0.04, 0),
        q: initial.current.hips?.q.clone() || new THREE.Quaternion(),
      },

      // slight forward lean
      spine: {
        q: toQuat(new THREE.Vector3(deg(8), deg(0), deg(0))),
      },

      // legs bent to sit
      leftUpperLeg:  { q: toQuat(new THREE.Vector3(deg(55), deg(5),  deg(0))) },
      leftLowerLeg:  { q: toQuat(new THREE.Vector3(deg(-70), deg(0), deg(0))) },
      rightUpperLeg: { q: toQuat(new THREE.Vector3(deg(55), deg(-5), deg(0))) },
      rightLowerLeg: { q: toQuat(new THREE.Vector3(deg(-70), deg(0), deg(0))) },

      // arms reaching bars
      leftArm:      { q: toQuat(new THREE.Vector3(deg(-20), deg(35), deg(-10))) },
      leftForeArm:  { q: toQuat(new THREE.Vector3(deg(-15), deg(10), deg( 10))) },
      rightArm:     { q: toQuat(new THREE.Vector3(deg(-20), deg(-35), deg(10))) },
      rightForeArm: { q: toQuat(new THREE.Vector3(deg(-15), deg(-10), deg(-10))) },

      // neutral head
      head:         { q: toQuat(new THREE.Vector3(deg(0), deg(0), deg(0))) },

      // keep feet roughly level
      leftFoot:     { q: toQuat(new THREE.Vector3(deg(0), deg(0), deg(0))) },
      rightFoot:    { q: toQuat(new THREE.Vector3(deg(0), deg(0), deg(0))) },
    };

    // Start mount timer
    mountStart.current = performance.now() + mountDelay * 1000;
    startedMount.current = false;
    driveStart.current = mountStart.current + driveDelay * 1000;
    startedDrive.current = false;
  }, [riderGltf, mountDelay, driveDelay]);

  // Place whole group and compute drive path
  const startPos = useRef(new THREE.Vector3());
  const endPos = useRef(new THREE.Vector3());
  useEffect(() => {
    if (!group.current) return;
    group.current.position.set(0, 0, 2.5);
    startPos.current.copy(group.current.position);

    const dir = new THREE.Vector3();
    camera.getWorldDirection(dir); // usually -Z
    endPos.current.copy(startPos.current).addScaledVector(dir, 6);
  }, [camera]);

  // Ease functions
  const easeInOutQuad = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

  useFrame((_s, delta) => {
    const now = performance.now();

    // 1) Blend bones from T-pose → seated target
    if (now >= mountStart.current) {
      if (!startedMount.current) startedMount.current = true;
      const t = Math.min(1, (now - mountStart.current) / (poseDuration * 1000));
      const k = easeInOutQuad(t);

      for (const [kBone, bone] of Object.entries(bones.current)) {
        if (!bone) continue;

        // Rotation
        const initQ = initial.current[kBone]?.q;
        const tgtQ  = target.current[kBone]?.q;
        if (initQ && tgtQ) {
          // slerp from initial → target
          const q = new THREE.Quaternion().copy(initQ).slerp(tgtQ, k);
          bone.quaternion.copy(q);
        }

        // Optional local position offsets (hips only here)
        if (kBone === "hips") {
          const initP = initial.current.hips?.p;
          const tgtP  = target.current.hips?.p;
          if (initP && tgtP) {
            const p = new THREE.Vector3().copy(initP).lerp(tgtP, k);
            bone.position.copy(p);
          }
        }
      }
    }

    // 2) Start driving the whole rig forward after a short beat
    if (now >= driveStart.current) {
      if (!startedDrive.current) startedDrive.current = true;
      const t = Math.min(1, (now - driveStart.current) / (driveDuration * 1000));
      const k = easeOutCubic(t);

      group.current.position.lerpVectors(startPos.current, endPos.current, k);
      group.current.rotation.x = -0.06 * Math.sin(k * Math.PI);

      const spin = spinFactor * delta;
      if (frontWheel) frontWheel.rotation.x -= spin;
      if (backWheel)  backWheel.rotation.x  -= spin;
    }
  });

  return (
    <group ref={group}>
      <primitive ref={bikeRef} object={bikeGltf.scene} />
      <primitive ref={riderRef} object={riderGltf.scene} />
    </group>
  );
}

useGLTF.preload("/src/assets/models/motorcycle.glb");
useGLTF.preload("/src/assets/models/rider.glb");
