import { LoopOnce, LoopRepeat } from 'three';

/** Canonical clip names from rider GLB */
export const CLIPS = [
    'fall-landing',
    'gangnam-style',
    'hiphop',
    'ninja-idle',
    'walking',
    'warrior-idle',
];

/** Initial one-off order */
const INITIAL_ORDER = [
    'fall-landing',
    'walking',
    'warrior-idle',
    'ninja-idle',
    'hiphop',
    'gangnam-style',
];

/** Infinite loop pattern:
 * warrior-idle ×3  → ninja-idle → hiphop → gangnam-style → (repeat forever)
 */
const LOOP_PATTERN = [
    { name: 'warrior-idle', loop: 'repeat', repetitions: 3, clamp: true },
    { name: 'ninja-idle',   loop: 'once',   repetitions: 1, clamp: true },
    { name: 'hiphop',       loop: 'once',   repetitions: 1, clamp: true },
    { name: 'gangnam-style',loop: 'once',   repetitions: 1, clamp: true },
];

/** prepare an action with loop + clamp */
function prep(actions, name, { loop = 'once', repetitions = 1, clamp = true } = {}) {
    const a = actions[name];              // per your note: assume exists
    a.reset();
    if (loop === 'repeat') a.setLoop(LoopRepeat, repetitions ?? Infinity);
    else                   a.setLoop(LoopOnce, 0);
    a.clampWhenFinished = clamp;
    a.enabled = true;
    return a;
}

/** ease helper: cross-fade from A -> B */
export function easeTo(fromAction, toAction, duration = 0.5, warp = true) {
    toAction.reset().play();
    fromAction.crossFadeTo(toAction, duration, warp);
    return toAction;
}

/** main entry point Rider.jsx calls
 * @param {{[p: string]: AnimationAction | null}} actions
 * @param {{ fade?: number }} opts
 * @returns {() => void} disposer
 */
export function playIdleAnimation(actions, opts = {}) {
    const fade = opts.fade ?? 0.5;

    // Phase A: initial ordered sequence (one-offs)
    const initial = INITIAL_ORDER.map(name => prep(actions, name, { loop: 'once', clamp: true }));

    let phase = 'initial';
    let i = 0;
    let current = initial[0];
    current.fadeIn(fade).play();

    // Use the current action's mixer
    const mixer = current.getMixer();

    // Phase B: infinite loop pattern
    const loopPrepared = LOOP_PATTERN.map(cfg => ({ ...cfg, action: prep(actions, cfg.name, cfg) }));
    let j = -1; // will move to 0 on first 'finished' in loop phase

    const onFinished = (e) => {
        if (e.action !== current) return;

        if (phase === 'initial') {
            i += 1;
            if (i < initial.length) {
                current = easeTo(current, initial[i], fade, true);
                return;
            }
            // switch to loop phase
            phase = 'loop';
            j = -1;
        }

        // loop forever over the pattern
        j = (j + 1) % loopPrepared.length;
        const next = loopPrepared[j].action;
        current = easeTo(current, next, fade, true);
    };

    mixer.addEventListener('finished', onFinished);

    // disposer
    return () => {
        try { mixer.removeEventListener('finished', onFinished); } catch (err) {
            console.warn('cleanup: could not remove event listener', err);
        }
        // stop everything we touched
        [...initial, ...loopPrepared.map(x => x.action)].forEach(a => {
            try { a.stop(); } catch (err) {
                console.warn('cleanup: could not remove event listener', err);
            }
        });
    };
}