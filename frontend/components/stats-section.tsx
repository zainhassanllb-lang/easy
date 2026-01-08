"use client"

import { Users, Briefcase, Star, MapPin } from "lucide-react"

export function StatsSection() {
    const stats = [
        {
            label: "Verified Workers",
            value: "2,500+",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            label: "Successful Tasks",
            value: "15,000+",
            icon: Briefcase,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            label: "Average Rating",
            value: "4.9/5",
            icon: Star,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            label: "Active Cities",
            value: "Lahore",
            icon: MapPin,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        }
    ]

    return (
        <section className="py-12 md:py-16 bg-gradient-to-br from-[#4cade1] via-[#00a693] to-[#14916a] relative overflow-hidden">
            {/* Ambient background accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-[120px] -mr-40 -mt-40" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/5 rounded-full blur-[120px] -ml-40 -mb-40" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    {stats.map((stat, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center p-5 md:p-6 rounded-[1.5rem] border border-white/10 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white/5 backdrop-blur-md group hover:-translate-y-1.5 hover:bg-white/10"
                        >
                            <div className={`p-2.5 rounded-xl mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm bg-white/10`}>
                                <stat.icon className={`h-5 w-5 text-white`} />
                            </div>
                            <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-1 tracking-tight">
                                {stat.value}
                            </h3>
                            <p className="text-[10px] md:text-xs font-bold text-white/70 uppercase tracking-[0.15em]">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
