"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import { Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState, useEffect, useCallback } from "react"
import type { CarouselApi } from "@/components/ui/carousel"

export function TestimonialsSection() {
    const [api, setApi] = useState<CarouselApi>()

    const testimonials = [
        {
            name: "Sarah Ahmed",
            role: "Homeowner",
            content: "I found an electrician in minutes! The service was professional and very affordable. Highly recommended for anyone needing quick home repairs.",
            rating: 5,
            image: "/professional-pakistani-worker-smiling-at-work.jpg"
        },
        {
            name: "Ali Hassan",
            role: "Small Business Owner",
            content: "EASY has been a game-changer for my shop maintenance. The plumbers are skilled and always on time. Great platform!",
            rating: 5,
            image: "/professional-pakistani-home-chef-cooking-in-kitche.jpg"
        },
        {
            name: "Fatima Khan",
            role: "Housewife",
            content: "Used the cleaning services last week. The team was thorough and respectful. Will definitely use again for deep cleaning.",
            rating: 4,
            image: "/professional-pakistani-cleaning-service-worker-cle.jpg"
        },
        {
            name: "Omer Zafar",
            role: "Tenant",
            content: "Moved to a new apartment and needed a painter. Found one within an hour, and the job was done by the weekend. Super efficient!",
            rating: 5,
            image: "/professional-pakistani-house-painter-painting-wall.jpg"
        }
    ]

    useEffect(() => {
        if (!api) return

        const intervalId = setInterval(() => {
            api.scrollNext()
        }, 5000)

        return () => clearInterval(intervalId)
    }, [api])

    return (
        <section className="py-16 bg-muted/30">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-4">What Our Clients Say</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Real stories from satisfied customers who found the right help on EASY.
                    </p>
                </div>

                <div className="max-w-5xl mx-auto px-12">
                    <Carousel
                        setApi={setApi}
                        opts={{
                            align: "start",
                            loop: true,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 md:-ml-4 items-stretch">
                            {testimonials.map((testimonial, index) => (
                                <CarouselItem key={index} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 flex">
                                    <div className="p-1 flex-1 flex">
                                        <Card className="flex-1 border-none shadow-md bg-background flex flex-col">
                                            <CardContent className="flex flex-col p-6 h-full">
                                                <Quote className="h-8 w-8 text-primary/20 mb-4 shrink-0" />
                                                <p className="text-muted-foreground mb-6 flex-grow italic text-sm md:text-base">
                                                    "{testimonial.content}"
                                                </p>
                                                <div className="flex items-center gap-4 mt-auto">
                                                    <Avatar className="h-10 w-10 border border-slate-100">
                                                        <AvatarImage src={testimonial.image} alt={testimonial.name} className="object-cover" />
                                                        <AvatarFallback>{testimonial.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-semibold text-sm leading-none mb-1">{testimonial.name}</p>
                                                        <p className="text-[10px] md:text-xs text-muted-foreground">{testimonial.role}</p>
                                                    </div>
                                                </div>
                                                <div className="flex mt-3 gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-3 w-3 ${i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious className="-left-4" />
                        <CarouselNext className="-right-4" />
                    </Carousel>
                </div>
            </div>
        </section>
    )
}
