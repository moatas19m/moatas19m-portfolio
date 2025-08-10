import './index.css';
import HeroScene from './components/HeroScene.jsx';
import HeroSection from './sections/HeroSection.jsx';

export default function App() {
    return (
        <div className="relative min-h-screen bg-black text-white">
            {/* 3D background */}
            <HeroScene />

            {/* Overlay content */}
            <div className="relative z-10">
                <HeroSection />
            </div>

            {/* Fade at bottom for cinematic feel */}
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent z-10" />
        </div>
    );
}
