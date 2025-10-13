import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import React, { useEffect, useRef } from "react";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export type LazyModule<T> = () => Promise<{ default: T }>;
export const preload = <T>(importer: LazyModule<T>) => { void importer(); };

// Preload when a sentinel scrolls into view
export function PreloadOnView({
                                  importer,
                                  rootMargin = "200px"
                              }: { importer: LazyModule<any>, rootMargin?: string }) {
    const ref = useRef<HTMLSpanElement | null>(null);
    useEffect(() => {
        const el = ref.current;
        if (!el || typeof IntersectionObserver === "undefined") return;
        let done = false;
        const io = new IntersectionObserver((entries) => {
            if (!done && entries.some(e => e.isIntersecting)) {
                done = true;
                preload(importer);
                io.disconnect();
            }
        }, { root: null, rootMargin, threshold: 0 });
        io.observe(el);
        return () => io.disconnect();
    }, [importer, rootMargin]);
    return React.createElement("span", {
        ref,
        "aria-hidden": "true",
        style: { display: "block", width: 1, height: 1 },
    });
}
