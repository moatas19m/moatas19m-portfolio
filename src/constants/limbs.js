// src/constants/limbs.js

/**
 * Exact bone names from your rider.glb (Mixamo rig).
 * Source: console dump from rider.scene.traverse(...)
 *
 * Usage:
 *   import { BONES, CHAINS, getBone, getBones } from '../constants/limbs';
 *   const leftArm = getBone(scene, BONES.LEFT_ARM);
 *   const { leftArm, rightArm } = getBones(scene, { leftArm: BONES.LEFT_ARM, rightArm: BONES.RIGHT_ARM });
 */

export const BONES = Object.freeze({
    // Core
    HIPS: "mixamorigHips",
    SPINE: "mixamorigSpine",
    SPINE1: "mixamorigSpine1",
    SPINE2: "mixamorigSpine2",
    NECK: "mixamorigNeck",
    HEAD: "mixamorigHead",
    HEAD_TOP_END: "mixamorigHeadTop_End",

    // Left shoulder/arm
    LEFT_SHOULDER: "mixamorigLeftShoulder",
    LEFT_ARM: "mixamorigLeftArm",
    LEFT_FOREARM: "mixamorigLeftForeArm",
    LEFT_HAND: "mixamorigLeftHand",

    // Left fingers
    LEFT_THUMB_1: "mixamorigLeftHandThumb1",
    LEFT_THUMB_2: "mixamorigLeftHandThumb2",
    LEFT_THUMB_3: "mixamorigLeftHandThumb3",
    LEFT_THUMB_4: "mixamorigLeftHandThumb4",

    LEFT_INDEX_1: "mixamorigLeftHandIndex1",
    LEFT_INDEX_2: "mixamorigLeftHandIndex2",
    LEFT_INDEX_3: "mixamorigLeftHandIndex3",
    LEFT_INDEX_4: "mixamorigLeftHandIndex4",

    LEFT_MIDDLE_1: "mixamorigLeftHandMiddle1",
    LEFT_MIDDLE_2: "mixamorigLeftHandMiddle2",
    LEFT_MIDDLE_3: "mixamorigLeftHandMiddle3",
    LEFT_MIDDLE_4: "mixamorigLeftHandMiddle4",

    LEFT_RING_1: "mixamorigLeftHandRing1",
    LEFT_RING_2: "mixamorigLeftHandRing2",
    LEFT_RING_3: "mixamorigLeftHandRing3",
    LEFT_RING_4: "mixamorigLeftHandRing4",

    LEFT_PINKY_1: "mixamorigLeftHandPinky1",
    LEFT_PINKY_2: "mixamorigLeftHandPinky2",
    LEFT_PINKY_3: "mixamorigLeftHandPinky3",
    LEFT_PINKY_4: "mixamorigLeftHandPinky4",

    // Right shoulder/arm
    RIGHT_SHOULDER: "mixamorigRightShoulder",
    RIGHT_ARM: "mixamorigRightArm",
    RIGHT_FOREARM: "mixamorigRightForeArm",
    RIGHT_HAND: "mixamorigRightHand",

    // Right fingers
    RIGHT_THUMB_1: "mixamorigRightHandThumb1",
    RIGHT_THUMB_2: "mixamorigRightHandThumb2",
    RIGHT_THUMB_3: "mixamorigRightHandThumb3",
    RIGHT_THUMB_4: "mixamorigRightHandThumb4",

    RIGHT_INDEX_1: "mixamorigRightHandIndex1",
    RIGHT_INDEX_2: "mixamorigRightHandIndex2",
    RIGHT_INDEX_3: "mixamorigRightHandIndex3",
    RIGHT_INDEX_4: "mixamorigRightHandIndex4",

    RIGHT_MIDDLE_1: "mixamorigRightHandMiddle1",
    RIGHT_MIDDLE_2: "mixamorigRightHandMiddle2",
    RIGHT_MIDDLE_3: "mixamorigRightHandMiddle3",
    RIGHT_MIDDLE_4: "mixamorigRightHandMiddle4",

    RIGHT_RING_1: "mixamorigRightHandRing1",
    RIGHT_RING_2: "mixamorigRightHandRing2",
    RIGHT_RING_3: "mixamorigRightHandRing3",
    RIGHT_RING_4: "mixamorigRightHandRing4",

    RIGHT_PINKY_1: "mixamorigRightHandPinky1",
    RIGHT_PINKY_2: "mixamorigRightHandPinky2",
    RIGHT_PINKY_3: "mixamorigRightHandPinky3",
    RIGHT_PINKY_4: "mixamorigRightHandPinky4",

    // Left leg
    LEFT_UP_LEG: "mixamorigLeftUpLeg",
    LEFT_LEG: "mixamorigLeftLeg",
    LEFT_FOOT: "mixamorigLeftFoot",
    LEFT_TOE_BASE: "mixamorigLeftToeBase",
    LEFT_TOE_END: "mixamorigLeftToe_End",

    // Right leg
    RIGHT_UP_LEG: "mixamorigRightUpLeg",
    RIGHT_LEG: "mixamorigRightLeg",
    RIGHT_FOOT: "mixamorigRightFoot",
    RIGHT_TOE_BASE: "mixamorigRightToeBase",
    RIGHT_TOE_END: "mixamorigRightToe_End",
});

/**
 * Handy chains (parent -> child order) for posing/IK/retargeting.
 */
export const CHAINS = Object.freeze({
    SPINE: [
        BONES.HIPS,
        BONES.SPINE,
        BONES.SPINE1,
        BONES.SPINE2,
        BONES.NECK,
        BONES.HEAD,
        BONES.HEAD_TOP_END,
    ],

    LEFT_ARM: [BONES.LEFT_SHOULDER, BONES.LEFT_ARM, BONES.LEFT_FOREARM, BONES.LEFT_HAND],
    RIGHT_ARM: [BONES.RIGHT_SHOULDER, BONES.RIGHT_ARM, BONES.RIGHT_FOREARM, BONES.RIGHT_HAND],

    LEFT_LEG: [BONES.LEFT_UP_LEG, BONES.LEFT_LEG, BONES.LEFT_FOOT, BONES.LEFT_TOE_BASE, BONES.LEFT_TOE_END],
    RIGHT_LEG: [BONES.RIGHT_UP_LEG, BONES.RIGHT_LEG, BONES.RIGHT_FOOT, BONES.RIGHT_TOE_BASE, BONES.RIGHT_TOE_END],

    LEFT_FINGERS: {
        THUMB:  [BONES.LEFT_THUMB_1, BONES.LEFT_THUMB_2, BONES.LEFT_THUMB_3, BONES.LEFT_THUMB_4],
        INDEX:  [BONES.LEFT_INDEX_1, BONES.LEFT_INDEX_2, BONES.LEFT_INDEX_3, BONES.LEFT_INDEX_4],
        MIDDLE: [BONES.LEFT_MIDDLE_1, BONES.LEFT_MIDDLE_2, BONES.LEFT_MIDDLE_3, BONES.LEFT_MIDDLE_4],
        RING:   [BONES.LEFT_RING_1, BONES.LEFT_RING_2, BONES.LEFT_RING_3, BONES.LEFT_RING_4],
        PINKY:  [BONES.LEFT_PINKY_1, BONES.LEFT_PINKY_2, BONES.LEFT_PINKY_3, BONES.LEFT_PINKY_4],
    },

    RIGHT_FINGERS: {
        THUMB:  [BONES.RIGHT_THUMB_1, BONES.RIGHT_THUMB_2, BONES.RIGHT_THUMB_3, BONES.RIGHT_THUMB_4],
        INDEX:  [BONES.RIGHT_INDEX_1, BONES.RIGHT_INDEX_2, BONES.RIGHT_INDEX_3, BONES.RIGHT_INDEX_4],
        MIDDLE: [BONES.RIGHT_MIDDLE_1, BONES.RIGHT_MIDDLE_2, BONES.RIGHT_MIDDLE_3, BONES.RIGHT_MIDDLE_4],
        RING:   [BONES.RIGHT_RING_1, BONES.RIGHT_RING_2, BONES.RIGHT_RING_3, BONES.RIGHT_RING_4],
        PINKY:  [BONES.RIGHT_PINKY_1, BONES.RIGHT_PINKY_2, BONES.RIGHT_PINKY_3, BONES.RIGHT_PINKY_4],
    },
});

/**
 * Quick groupings for convenience.
 */
export const GROUPS = Object.freeze({
    SHOULDERS: [BONES.LEFT_SHOULDER, BONES.RIGHT_SHOULDER],
    UPPER_ARMS: [BONES.LEFT_ARM, BONES.RIGHT_ARM],
    FOREARMS: [BONES.LEFT_FOREARM, BONES.RIGHT_FOREARM],
    HANDS: [BONES.LEFT_HAND, BONES.RIGHT_HAND],
    LEGS_UPPER: [BONES.LEFT_UP_LEG, BONES.RIGHT_UP_LEG],
    LEGS_LOWER: [BONES.LEFT_LEG, BONES.RIGHT_LEG],
    FEET: [BONES.LEFT_FOOT, BONES.RIGHT_FOOT],
});

/**
 * Tiny helpers to fetch bones from a THREE.Scene (or Object3D root).
 */
export function getBone(scene, name) {
    return scene?.getObjectByName?.(name) || null;
}

export function getBones(scene, nameMap) {
    // nameMap = { leftArm: BONES.LEFT_ARM, rightArm: BONES.RIGHT_ARM, ... }
    const out = {};
    for (const [key, boneName] of Object.entries(nameMap)) {
        out[key] = getBone(scene, boneName);
    }
    return out;
}