import React, { useState } from 'react'
import Loader from '../components/landing/Loader'
import CustomCursor from '../components/landing/CustomCursor'
import { LandingNavbar } from '../components/landing/LandingNavbar'
import Hero from '../components/landing/Hero'
import ProblemSolution from '../components/landing/ProblemSolution'
import Architecture from '../components/landing/Architecture'
import EmotionEngine from '../components/landing/EmotionEngine'
import Therapists from '../components/landing/Therapists'
import StatsCTA from '../components/landing/StatsCTA'

export default function LandingPage() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="landing-page-root">
      <CustomCursor />
      {isLoading && <Loader onComplete={() => setIsLoading(false)} />}
      {!isLoading && (
        <>
          <LandingNavbar />
          <main>
            <Hero />
            <ProblemSolution />
            <Architecture />
            <EmotionEngine />
            <Therapists />
            <StatsCTA />
          </main>
        </>
      )}
    </div>
  )
}
