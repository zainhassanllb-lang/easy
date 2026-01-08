
import { PageBanner } from "@/components/page-banner"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { categories } from "@/lib/database"
import { WorkerCard } from "@/components/worker-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ArrowRight, Search, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { getWorkers } from "@/lib/api"

interface SearchParams {
  city?: string
  locality?: string
  category?: string
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { city, locality } = params

  let workers = []
  if (city) {
    workers = await getWorkers({ city, locality })
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />

      <PageBanner
        image="/services-banner.jpg"
        title="Browse Services"
        description="Discover trusted professionals in your area"
        height="md"
      />

      <main className="flex-1 container mx-auto px-4 py-16">
        {/* Service Categories */}
        <div className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Popular Categories</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {categories.map((cat) => (
              <Link key={cat.id} href={`/services/${cat.slug}`} className="group">
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 hover:-translate-y-1 h-full flex flex-col">
                  <div className="relative h-40 overflow-hidden">
                    <Image
                      src={cat.imageUrl || "/placeholder.svg?height=400&width=600"}
                      alt={cat.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
                    <div className="absolute bottom-3 left-3 text-white font-bold text-lg">{cat.name}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {workers.length > 0 ? (
          <div className="space-y-8">
            <div className="flex items-end justify-between border-b pb-4">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-slate-900">Recommended Experts</h2>
                <p className="text-muted-foreground mt-1">Top-rated professionals in your area.</p>
              </div>
              <div className="bg-green-100 text-green-700 px-4 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                {workers.length} Active
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...workers].sort((a, b) => (b.packageType ? 1 : 0) - (a.packageType ? 1 : 0)).map((worker: any) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>
          </div>
        ) : city ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No professionals found in {city}</h3>
            <p className="text-muted-foreground">Try searching for a different location or browse categories.</p>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  )
}
