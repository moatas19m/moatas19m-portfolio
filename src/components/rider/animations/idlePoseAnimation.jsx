import { LoopOnce, LoopRepeat, Vector3 } from 'three';

export const CLIPS = ['fall-landing', 'ninja-idle', 'walking', 'warrior-idle'];

const INITIAL_ORDER = ['fall-landing', 'walking', 'warrior-idle', 'ninja-idle'];

const LOOP_PATTERN = [
    { name: 'warrior-idle', loop: 'repeat', repetitions: 3, clamp: true },
    { name: 'ninja-idle',   loop: 'once',   repetitions: 1, clamp: true },
];

function prep(actions, name, { loop = 'once', repetitions = 1, clamp = true } = {}) {
    const a = actions[name];
    a.reset();
    if (loop === 'repeat') a.setLoop(LoopRepeat, repetitions ?? Infinity);
    else                   a.setLoop(LoopOnce, 0);
    a.clampWhenFinished = clamp;
    a.enabled = true;
    return a;
}

export function easeTo(fromAction, toAction, duration = 0.5, warp = true) {
    toAction.reset().play();
    fromAction.crossFadeTo(toAction, duration, warp);
    return toAction;
}

/**
 * @param {{[name: string]: import('three').AnimationAction}} actions
 * @param {{
 *   fade?: number,
 *   delaySec?: number,
 *   targetObject?: import('three').Object3D,
 *   hipsName?: string,
 *   floorY?: number,
 *   fallScale?: number,      // scales ONLY downward Y during fall
 *   walkFps?: number,
 *   walkEarlyExitFrames?: number
 * }} opts
 * @returns {{ dispose: () => void, tick: (dt:number)=>void }}
 */
export function playIdleAnimation(actions, opts = {}) {
    const fade = opts.fade ?? 0.5;
    const delayMs = Math.max(0, Math.round((opts.delaySec ?? 2) * 1000));
    const targetObject = opts.targetObject ?? null;
    const hipsName = opts.hipsName ?? 'mixamorigHips';
    const floorY   = opts.floorY   ?? 0;
    const fallScale = opts.fallScale ?? 0.6;

    // Early-exit walking config
    const walkFps = opts.walkFps ?? 30;
    const walkEarlyExitFrames = Math.max(0, opts.walkEarlyExitFrames ?? 10);
    const walkEarlyExitSec = walkEarlyExitFrames / Math.max(1, walkFps);
    let didEarlyExitWalk = false;

    // Prep sequences
    const initial = INITIAL_ORDER.map(name => prep(actions, name, { loop: 'once', clamp: true }));
    const loopPrepared = LOOP_PATTERN.map(cfg => ({ ...cfg, action: prep(actions, cfg.name, cfg) }));

    let phase = 'initial';
    let i = 0;
    let current = initial[0];
    const mixer = current.getMixer();

    // Hips tracking for live bake
    const hips = mixer.getRoot()?.getObjectByName?.(hipsName) || null;
    const prevHipsWorld = new Vector3();
    const currHipsWorld = new Vector3();
    let havePrev = false;

    // Actions
    const fallAction = actions['fall-landing'];
    const walkAction = actions['walking'];
    const warriorIdleAction = actions['warrior-idle'];

    // Lock X/Z while in fall or walk (prevents drift)
    const baseXZ = new Vector3();

    function snapshotBaseXZ() {
        if (!targetObject) return;
        baseXZ.set(targetObject.position.x, 0, targetObject.position.z);
    }

    function switchTo(nextAction) {
        if (!nextAction) return current;
        // When entering fall/walk, remember current X/Z to keep them fixed
        if (targetObject && (nextAction === fallAction || nextAction === walkAction)) snapshotBaseXZ();
        if (nextAction === walkAction) didEarlyExitWalk = false;
        havePrev = false; // reset hips delta tracker at clip boundaries
        current = easeTo(current, nextAction, fade, true);
        return current;
    }

    const startTimer = setTimeout(() => {
        try { snapshotBaseXZ(); current.fadeIn(fade).play(); }
        catch (err) { console.warn('startTimer: could not start first animation', err); }
    }, delayMs);

    const onFinished = (e) => {
        if (e.action !== current) return;

        // End-of-fall safety clamp
        if (current === fallAction && targetObject) {
            targetObject.position.y = Math.max(floorY, targetObject.position.y);
            targetObject.updateMatrixWorld();
        }

        // End-of-walk cleanup: keep hips local X/Z clean
        if (current === walkAction && hips) {
            hips.position.x = 0;
            hips.position.z = 0;
        }

        if (phase === 'initial') {
            i += 1;
            if (i < initial.length) {
                return switchTo(initial[i]);
            }
            phase = 'loop';
        }

        // Loop forever
        const idx = loopPrepared.findIndex(x => x.action === current);
        const next = loopPrepared[(idx + 1) % loopPrepared.length].action;
        switchTo(next);
    };

    mixer.addEventListener('finished', onFinished);

    function tick(/* dt */) {
        if (!hips || !targetObject || !current?.isRunning()) return;

        // ---- Early exit walking → warrior-idle (skip last N frames) ----
        if (current === walkAction && !didEarlyExitWalk) {
            const clip = current.getClip();
            const exitAt = Math.max(0, clip.duration - walkEarlyExitSec);
            if (current.time >= exitAt) {
                switchTo(warriorIdleAction);
                didEarlyExitWalk = true;
                return;
            }
        }

        // Track hips world position
        hips.getWorldPosition(currHipsWorld);
        if (!havePrev) {
            prevHipsWorld.copy(currHipsWorld);
            havePrev = true;
            return;
        }

        const dy = currHipsWorld.y - prevHipsWorld.y;

        if (current === fallAction) {
            // Only move DOWN during fall (ignore upward dy)
            const down = Math.min(0, dy) * fallScale;
            if (down !== 0) {
                targetObject.position.y = Math.max(floorY, targetObject.position.y + down);
            }
            // Lock X/Z so fall never drifts forward
            targetObject.position.x = baseXZ.x;
            targetObject.position.z = baseXZ.z;
        }
        else if (current === walkAction) {
            // Keep rider anchored in place horizontally while walking
            targetObject.position.x = baseXZ.x;
            targetObject.position.z = baseXZ.z;
        }

        targetObject.updateMatrixWorld();
        prevHipsWorld.copy(currHipsWorld);
    }

    function dispose() {
        try { mixer.removeEventListener('finished', onFinished); }
        catch (err) { console.warn('cleanup: could not remove event listener', err); }
        clearTimeout(startTimer);
        [...initial, ...loopPrepared.map(x => x.action)].forEach(a => {
            try { a.stop(); } catch (err) { console.warn('cleanup: could not stop action', err); }
        });
    }

    return { dispose, tick };
}