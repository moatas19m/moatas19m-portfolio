import { MathUtils, AnimationMixer, AnimationClip, NumberKeyframeTrack, LoopOnce } from 'three';
import { BONES, getBone } from '../../../constants/limbs';

const D = MathUtils.degToRad;

// TODO: Later polishing: The rider is floating like superman as the site loads, and settles down to the
//       'floor' (y value at which motorcycle rests) as the site fully finishes loading.

/** Apply arms-down “idle” pose immediately (no easing). */
export function applyManualIdlePose(scene, {
    shoulderDropDeg = -70,   // X: downwards
    slightForwardDeg = 8,   // Z: tiny forward to avoid torso
    forearmRelaxDeg = 5,    // X: small follow-through
} = {}) {
    const lArm  = getBone(scene, BONES.LEFT_ARM);
    const rArm  = getBone(scene, BONES.RIGHT_ARM);
    const lFore = getBone(scene, BONES.LEFT_FOREARM);
    const rFore = getBone(scene, BONES.RIGHT_FOREARM);

    if (lArm)  { lArm.rotation.order = 'XYZ'; lArm.rotation.set(D(-shoulderDropDeg), 0,  D(slightForwardDeg)); }
    if (rArm)  { rArm.rotation.order = 'XYZ'; rArm.rotation.set(D(-shoulderDropDeg), 0,  D(slightForwardDeg)); }
    if (lFore) { lFore.rotation.order = 'XYZ'; lFore.rotation.x += D(-forearmRelaxDeg); }
    if (rFore) { rFore.rotation.order = 'XYZ'; rFore.rotation.x += D(+forearmRelaxDeg); }
}

/** Build & play a tiny clip that eases into the manual idle pose; returns a disposer. */
export function playIdlePose(scene, opts) {
    const lArm  = getBone(scene, BONES.LEFT_ARM);
    const rArm  = getBone(scene, BONES.RIGHT_ARM);
    const lFore = getBone(scene, BONES.LEFT_FOREARM);
    const rFore = getBone(scene, BONES.RIGHT_FOREARM);

    const bones = [lArm, rArm, lFore, rFore].filter(Boolean);
    if (!bones.length) {
        // Nothing to animate; just set directly.
        applyManualIdlePose(scene, opts);
        return { mixer: null, dispose: () => {} };
    }

    // Snapshot start → compute end → restore start
    const start = bones.map(b => b.rotation.clone());
    applyManualIdlePose(scene, opts);
    const end   = bones.map(b => b.rotation.clone());
    bones.forEach((b, i) => b.rotation.copy(start[i]));

    const dur = 0.35;
    const tracks = [];
    bones.forEach((b, i) => {
        tracks.push(new NumberKeyframeTrack(`${b.uuid}.rotation[x]`, [0, dur], [start[i].x, end[i].x]));
        tracks.push(new NumberKeyframeTrack(`${b.uuid}.rotation[z]`, [0, dur], [start[i].z, end[i].z]));
    });

    const clip  = new AnimationClip('ManualIdlePose', dur, tracks);
    const mixer = new AnimationMixer(scene);
    const action = mixer.clipAction(clip);
    action.setLoop(LoopOnce, 0);
    action.clampWhenFinished = true;
    action.play();

    // return disposer
    const dispose = () => mixer.stopAllAction();
    return { mixer, dispose };
}