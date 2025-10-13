import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

// TODO: Delete this file, redundant, remove all usages

export default function SplitCanvasLayout({ children, title, leftViewId = "left-3d-view" }) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    return (
        <div className="bg-transparent relative h-screen w-screen overflow-hidden z-20">
            <div className="absolute inset-0 flex pointer-events-auto">
                {/* Left: tracked region for <View> from the global Canvas */}
                <div
                    id={leftViewId}
                    className={`h-full ${isMobile ? 'hidden' : ''}`}
                    style={{ 
                        width: isMobile ? "0%" : "18%", 
                        pointerEvents: "none",
                        minWidth: isMobile ? "0" : "200px"
                    }}
                    ref={(el) => {
                        if (el) {
                            console.log('[SplitCanvasLayout] left-3d-view present:', !!el);
                        } else {
                            console.log('[SplitCanvasLayout] left-3d-view unmounted');
                        }
                    }}
                    aria-label="3D visualization area"
                />

                {/* Right: textual content */}
                <div className={`flex-1 overflow-y-auto bg-black/30 backdrop-blur-md border-l border-white/10 p-4 md:p-6 ${isMobile ? 'border-l-0' : ''}`}>
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-lg md:text-xl font-semibold text-white">{title}</h1>
                        <Link
                            to="/"
                            className="text-sm opacity-80 hover:opacity-100 underline text-neutral-200 transition-opacity"
                            aria-label="Return to home page"
                        >
                            Back to Home
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}