
import Link from "next/link"
import Image from "next/image"
import { categories } from "@/lib/database"
import { ArrowRight } from "lucide-react"

export function ServiceCategories() {
  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">Discover</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2 text-slate-900">Popular Categories</h2>
            <div className="h-1 w-20 bg-secondary mt-4 rounded-full"></div>
          </div>
          <Link href="/services" className="group flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-primary transition-colors">
            VIEW ALL SERVICES
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/services/${category.slug}`} className="group block h-full">
              <div className="relative h-full bg-white rounded-xl md:rounded-2xl overflow-hidden shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative aspect-[1/1] overflow-hidden bg-slate-50">
                  <Image
                    src={category.imageUrl || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                  {/* Icon overlay */}
                  <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-white/90 backdrop-blur-sm p-1.5 md:p-2 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                    <ArrowRight className="h-3 w-3 md:h-4 md:w-4 text-primary" />
                  </div>
                </div>

                <div className="p-3 md:p-4 text-center">
                  <h3 className="font-bold text-slate-900 group-hover:text-primary transition-colors text-sm md:text-lg leading-tight">{category.name}</h3>
                  <p className="text-[10px] md:text-xs text-muted-foreground mt-1 line-clamp-1 hidden md:block">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
