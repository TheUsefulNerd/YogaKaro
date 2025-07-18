import React, { useEffect, useState } from "react"
import { useKeenSlider } from "keen-slider/react"
import "keen-slider/keen-slider.min.css"
import "./LearnSection.css"

const topics = [
  {
    icon: "🪙",
    title: "Token Fundamentals",
    description: "Understand how tokens are earned, stored, and used in blockchain ecosystems.",
  },
  {
    icon: "👛",
    title: " Smart Wallets",
    description: "Explore how digital wallets manage your assets and transactions on the blockchain.",
  },
  {
    icon: "💱",
    title: "DEX",
    description: "Learn how to swap tokens, calculate gas fees, and interact with liquidity pools.",
  },
  {
    icon: "🕵️‍♂️",
    title: "(zkProofs)",
    description: "Explore how contracts run automatically on blockchain - Zero Knowledge Proofs",
  },
  {
    icon: "📜",
    title: "Smart Contracts",
    description: "See how on-chain logic works through simplified token and contract simulations.",
  },
  {
    icon: "📈",
    title: "Tokenomics",
    description: "Get introduced to supply, demand, inflation, and how value is created in crypto.",
  },
  {
    icon: "🧪",
    title: "Web3 UX & Safety",
    description: "See how on-chain logic works through simplified token and contract simulations.",
  },
    {
    icon: "🔐",
    title: "Privacy Principles",
    description: "Learn why controlling your data and assets is central to Web3 philosophy.",
  },
]

export default function LearnSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slides: {
      perView: 3,
      spacing: 40,
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel)
    },
  })

  useEffect(() => {
    const interval = setInterval(() => {
      instanceRef.current?.next(1000)
    }, 3000)
    return () => clearInterval(interval)
  }, [instanceRef])

  return (
    <section className="pt-32 pb-24 bg-[#f8f8fc]learn-section-inside section-spacing">
  {/* 🔹 Heading outside card container */}
  <div className="text-center mb-12 px-6">
    <h1 className="hero-title">What You'll Learn</h1>
  </div>

  {/* 🔹 Only cards inside max-width container */}
  <div className="learn-wrapper relative">
    <div className="keen-slider max-w-6xl mx-auto overflow-visible" ref={sliderRef}>
      {topics.map((topic, index) => {
        let isCurrent = false

        if (instanceRef.current?.track?.details?.slides) {
          const slide = instanceRef.current.track.details.slides[index]
          isCurrent = slide?.rel === currentSlide
        }

        return (
          <div key={index} className="keen-slider__slide">
            <div className={`active-slide ${isCurrent ? "animate-in" : ""}`}>
              <div className="text-4xl mb-3">{topic.icon}</div>
              <h3>{topic.title}</h3>
              <p>{topic.description}</p>
            </div>
          </div>
        )
      })}
    </div>
  </div>
</section>
  )
}
