import { Link } from "react-router-dom";

export default function SplitCanvasLayout({ children, title, leftViewId = "left-3d-view" }) {
    return (
        <div className="bg-transparent relative h-screen w-screen overflow-hidden">
            <div className="absolute inset-0 flex">
                {/* Left: tracked region for <View> from the global Canvas */}
                <div
                    id={leftViewId}
                    className="h-full"
                    style={{ width: "18%", pointerEvents: "none" }} // events go to the global canvas; View will route them
                />

                {/* Right: textual content */}
                <div className="flex-1 overflow-y-auto bg-black/30 backdrop-blur-md border-l border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-xl font-semibold text-white">{title}</h1>
                        <Link
                            to="/"
                            className="text-sm opacity-80 hover:opacity-100 underline text-neutral-200"
                        >
                            Back to Home
                        </Link>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}