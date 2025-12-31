"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, ChevronDown } from "lucide-react"
import { categories } from "@/lib/database"

interface Slide {
  id: string
  category: string
  image: string
}

export function HeroSlider() {
  const slides: Slide[] = categories.slice(0, 5).map((category) => ({
    id: category.id,
    category: category.name,
    image: category.imageUrl,
  }))

  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const typingTexts = [
    "Find Trusted Electricians",
    "Book Professional Plumbers",
    "Hire Expert Carpenters",
    "Get Skilled Painters",
    "Connect with Home Chefs",
  ]

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length)
    }, 3000)

    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    const currentText = typingTexts[currentIndex]
    let timeout: NodeJS.Timeout

    if (!isDeleting && displayText === currentText) {
      timeout = setTimeout(() => setIsDeleting(true), 2000)
    } else if (isDeleting && displayText === "") {
      setIsDeleting(false)
    } else {
      const updateText = () => {
        setDisplayText((prev) => {
          if (isDeleting) {
            return currentText.substring(0, prev.length - 1)
          } else {
            return currentText.substring(0, prev.length + 1)
          }
        })
      }
      timeout = setTimeout(updateText, isDeleting ? 50 : 100)
    }

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentIndex, typingTexts])

  const scrollToServices = () => {
    const servicesSection = document.getElementById("services-section")
    servicesSection?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  return (
    <div className="relative w-full h-[32rem] md:h-[48rem] overflow-hidden bg-muted">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ${
            index === currentIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
        >
          <Image
            src={slide.image || "/placeholder.svg"}
            alt={slide.category}
            fill
            className="object-cover"
            priority={index === 0}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        </div>
      ))}

      <div className="absolute inset-0 flex items-center z-10">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold text-white drop-shadow-2xl leading-tight">
              {displayText}
              <span className="inline-block w-1 h-12 md:h-16 bg-secondary ml-2 animate-pulse" />
            </h1>
            <p className="text-xl md:text-2xl text-white/90 drop-shadow-lg font-medium">
              Your trusted marketplace for skilled professionals
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                size="lg"
                onClick={scrollToServices}
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border-2 border-white/30 hover:border-white/50 transition-all duration-300 hover:scale-105 shadow-xl text-lg font-semibold group"
              >
                See More
                <ChevronDown className="ml-2 h-5 w-5 group-hover:translate-y-1 transition-transform" />
              </Button>
              <Link href="/register">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-secondary via-accent to-secondary bg-[length:200%_auto] hover:bg-right-bottom transition-all duration-500 hover:scale-105 shadow-xl hover:shadow-2xl text-lg font-semibold group"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`transition-all duration-300 ${
              index === currentIndex
                ? "w-12 h-3 bg-white rounded-full shadow-lg scale-110"
                : "w-3 h-3 bg-white/50 rounded-full hover:bg-white/70 hover:scale-110"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
