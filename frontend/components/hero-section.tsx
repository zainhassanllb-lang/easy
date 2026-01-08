"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin } from "lucide-react"
import Image from "next/image"
import { categories } from "@/lib/database"

import { useRouter } from "next/navigation"

export function HeroSection() {
    const router = useRouter()
    const [searchQuery, setSearchQuery] = useState("")
    const [currentImage, setCurrentImage] = useState(0)
    const heroImages = [
        "/hero_banner_electrician_1767781425295.png",
        "/hero_banner_plumber_1767781440270.png",
        "/hero_banner_carpenter_1767781456070.png"
    ]

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % heroImages.length)
        }, 5000)
        return () => clearInterval(timer)
    }, [heroImages.length])

    const handleSearch = () => {
        if (searchQuery.trim()) {
            router.push(`/services?search=${encodeURIComponent(searchQuery)}`)
        } else {
            router.push("/services")
        }
    }

    return (
        <section className="relative h-[600px] md:h-[700px] w-full overflow-hidden flex items-center justify-center">
            {/* Background Slideshow */}
            <div className="absolute inset-0 z-0">
                {heroImages.map((img, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImage ? "opacity-100" : "opacity-0"
                            }`}
                    >
                        <Image
                            src={img}
                            alt="Hero Background"
                            fill
                            className="object-cover"
                            priority={index === 0}
                        />
                        <div className="absolute inset-0 bg-black/40" />
                        {/* Subtler overlay for better text readability */}
                    </div>
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-4 text-center pt-16 md:pt-0">
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-4 md:mb-6 drop-shadow-lg tracking-tight">
                    Expert Help, <br className="md:hidden" />
                    <span className="text-secondary">Right Personalized.</span>
                </h1>
                <p className="text-lg md:text-2xl text-white/90 mb-8 md:mb-10 max-w-2xl mx-auto font-light drop-shadow-md">
                    Connecting you with verified professionals for every home service need. Fast, reliable, and secure.
                </p>

                {/* Search Box - Floating Style */}
                <div className="max-w-4xl mx-auto bg-white rounded-3xl md:rounded-full p-3 shadow-2xl flex flex-col md:flex-row items-center gap-3 md:gap-2 animate-in fade-in zoom-in duration-500 w-full">
                    <div className="relative w-full md:w-1/3">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <MapPin className="h-5 w-5" />
                        </div>
                        <Input
                            placeholder="Location (e.g. Lahore)"
                            className="pl-12 h-12 md:h-14 border border-slate-100 md:border-none bg-slate-50 md:bg-transparent focus-visible:ring-0 text-base rounded-2xl md:rounded-full w-full"
                        // Future implementation for location filtering
                        />
                    </div>

                    <div className="hidden md:block w-px h-8 bg-gray-200"></div>

                    <div className="relative w-full md:w-1/2">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                            <Search className="h-5 w-5" />
                        </div>
                        <Input
                            placeholder="What service do you need?"
                            className="pl-12 h-12 md:h-14 border border-slate-100 md:border-none bg-slate-50 md:bg-transparent focus-visible:ring-0 text-base rounded-2xl md:rounded-full w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                        />
                    </div>

                    <Button
                        size="lg"
                        className="w-full md:w-auto h-12 md:h-14 rounded-2xl md:rounded-full px-8 text-lg font-semibold shadow-md bg-primary hover:bg-primary/90 transition-all"
                        onClick={handleSearch}
                    >
                        Search
                    </Button>
                </div>

                {/* Popular searches suggestions */}
                <div className="mt-8 text-white/80 text-sm md:text-base">
                    <span className="font-semibold mr-2">Popular:</span>
                    <span className="inline-flex gap-2 flex-wrap justify-center">
                        {['Electrician', 'Plumber', 'Cleaning', 'AC Repair'].map(tag => (
                            <span key={tag} className="px-3 py-1 bg-white/10 rounded-full backdrop-blur-sm border border-white/20 hover:bg-white/20 cursor-pointer transition-colors">
                                {tag}
                            </span>
                        ))}
                    </span>
                </div>
            </div>
        </section>
    )
}
