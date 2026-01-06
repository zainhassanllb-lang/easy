import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { categories } from "@/lib/database"
import { LocationFilter } from "@/components/location-filter"
import { WorkerCard } from "@/components/worker-card"
import { ArrowLeft, MapPin } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBanner } from "@/components/page-banner"

interface PageProps {
  params: Promise<{
    category: string
  }>
  searchParams: Promise<{
    city?: string
    locality?: string
  }>
}

async function fetchWorkersByCategory(categorySlug: string, city?: string, locality?: string) {
  try {
    const backendUrl = process.env.BACKEND_URL || "https://easy-backend-pkd1.onrender.com"
    const params = new URLSearchParams()
    params.append("category", categorySlug)
    if (city) params.append("city", city)
    if (locality) params.append("locality", locality)

    const res = await fetch(`${backendUrl}/api/workers?${params.toString()}`, {
      method: "GET",
      cache: "no-store",
    })

    if (!res.ok) {
      return []
    }

    const data = await res.json()
    // Convert MongoDB _id to id and dates for compatibility
    return (data.workers || []).map((w: any) => ({
      ...w,
      id: w._id?.toString() || w.id,
      packageExpiry: w.packageExpiry ? (typeof w.packageExpiry === 'string' ? new Date(w.packageExpiry) : w.packageExpiry) : null,
      verifiedAt: w.verifiedAt ? (typeof w.verifiedAt === 'string' ? new Date(w.verifiedAt) : w.verifiedAt) : null,
      createdAt: w.createdAt ? (typeof w.createdAt === 'string' ? new Date(w.createdAt) : w.createdAt) : null,
    }))
  } catch (error) {
    console.error("Failed to fetch workers:", error)
    return []
  }
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params
  const { city, locality } = await searchParams

  const category = categories.find((c) => c.slug === categorySlug)

  if (!category) {
    notFound()
  }

  const workers = await fetchWorkersByCategory(category.slug, city, locality)

  return (
    <>
      <Header />
      <PageBanner
        image="/services-banner.jpg"
        title="Browse Services"
        description="Discover trusted professionals in your area"
        height="md"
      />
      <main className="min-h-screen">
        {/* Header */}
        <section className="bg-primary/5 py-8">
          <div className="container mx-auto px-4">
            <Link href="/services">
              <Button variant="default" size="sm" className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Services
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mb-2 capitalize">{category.name}</h1>
            <p className="text-muted-foreground">{category.description}</p>
          </div>
        </section>

        <div className="container mx-auto px-4 py-8">
          {/* Location Filter */}
          <LocationFilter initialCity={city} initialLocality={locality} />

          {/* Worker Listings */}
          <div className="mt-8 space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-8">
              <div>
                <h2 className="text-4xl font-black tracking-tight mb-2 flex items-center gap-3">
                  {category.name}s
                  <span className="text-lg font-bold text-primary bg-primary/10 px-3 py-1 rounded-full">
                    {workers.length} Available
                  </span>
                </h2>
                <p className="text-lg text-muted-foreground font-medium">
                  Verified {category.name.toLowerCase()}s {city ? `in ${city}` : "across Pakistan"}
                </p>
              </div>
            </div>

            {workers.length > 0 ? (
              <div className="space-y-16">
                {/* Featured Section if any workers have premium/standard packages */}
                {workers.some((w: any) => w.packageType === 'premium' || w.packageType === 'standard') && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-slate-200" />
                      <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Featured Professionals</span>
                      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-slate-200" />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                      {workers
                        .filter((w: any) => w.packageType === 'premium' || w.packageType === 'standard')
                        .map((worker: any) => (
                          <WorkerCard key={worker.id} worker={worker} />
                        ))}
                    </div>
                  </div>
                )}

                {/* Main Results Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                  {workers
                    .filter((w: any) => !(w.packageType === 'premium' || w.packageType === 'standard'))
                    .map((worker: any) => (
                      <WorkerCard key={worker.id} worker={worker} />
                    ))}
                </div>
              </div>
            ) : (
              <Card className="p-20 text-center border-dashed border-2 bg-muted/30 rounded-[2rem]">
                <div className="max-w-md mx-auto space-y-6">
                  <div className="h-20 w-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                    <MapPin className="h-10 w-10 text-muted-foreground" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">No pros found here yet</h3>
                    <p className="text-muted-foreground">
                      We're expanding fast! Try searching in a different city or browse all categories.
                    </p>
                  </div>
                  <Link href="/services" className="inline-block">
                    <Button variant="default" size="lg" className="rounded-full px-8 font-bold">
                      Browse All Services
                    </Button>
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
