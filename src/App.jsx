import './index.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import HeroScene from './components/HeroScene.jsx'
import ProjectsPage from './pages/ProjectsPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import WorkPage from './pages/WorkPage.jsx'
import SkillsPage from './pages/SkillsPage.jsx'
import HobbiesPage from './pages/HobbiesPage.jsx'
import ContactPage from './pages/ContactPage.jsx'
import React from 'react';

export default function App() {
    return (
        <BrowserRouter>
            <div className="relative min-h-screen bg-black text-white">
                <Routes>
                    <Route path="/" element={<HeroScene />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/hobbies" element={<HobbiesPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/work" element={<WorkPage />} />
                    <Route path="/skills" element={<SkillsPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                </Routes>

                {/* Fade at bottom for cinematic feel */}
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black to-transparent z-10" />
            </div>
        </BrowserRouter>
    )
}