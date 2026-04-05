import React, { useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'

import { useAppStore } from './store/appStore.js'
import { useKonami, useSectionObserver } from './hooks/index.js'

import Navbar        from './components/ui/Navbar.jsx'
import CursorFollower from './components/ui/CursorFollower.jsx'
import MatrixOverlay from './components/ui/MatrixOverlay.jsx'

import HeroSection     from './components/sections/HeroSection.jsx'
import AboutSection    from './components/sections/AboutSection.jsx'
import SkillsSection   from './components/sections/SkillsSection.jsx'
import ProjectsSection from './components/sections/ProjectsSection.jsx'
import TerminalSection from './components/sections/TerminalSection.jsx'
import ContactSection  from './components/sections/ContactSection.jsx'

const SECTION_IDS = ['home', 'about', 'skills', 'projects', 'terminal', 'contact']

export default function App() {
  const { matrixActive, setMatrixActive } = useAppStore()

  // Konami code → matrix rain
  useKonami(useCallback(() => setMatrixActive(true), [setMatrixActive]))

  // Active section tracking for navbar
  useSectionObserver(SECTION_IDS)

  return (
    <>
      {/* Custom cursor (desktop only) */}
      <CursorFollower />

      {/* Fixed navigation */}
      <Navbar />

      {/* Main content */}
      <main>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <TerminalSection />
        <ContactSection />
      </main>

      {/* Konami easter egg overlay */}
      <AnimatePresence>
        {matrixActive && <MatrixOverlay key="matrix" />}
      </AnimatePresence>
    </>
  )
}
