import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import { categories } from "@/lib/database"
import { WorkerCard } from "@/components/worker-card"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBanner } from "@/components/page-banner"

interface SearchParams {
  city?: string
  locality?: string
  category?: string
}

async function fetchWorkersByLocation(city?: string, locality?: string) {
  try {
    const backendUrl = process.env.BACKEND_URL || "https://easy-e6lz.onrender.com"
    const params = new URLSearchParams()
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

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { city, locality } = params

  let workers = []
  if (city) {
    workers = await fetchWorkersByLocation(city, locality)
  }

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
        <div className="container mx-auto px-4 py-12">
          {/* Service Categories with Images */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8 text-center">Popular Categories</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((cat) => (
                <Link key={cat.id} href={`/services/${cat.slug}`}>
                  <Card className="hover:shadow-2xl transition-all hover:scale-105 cursor-pointer h-full overflow-hidden">
                    <CardContent className="p-0">
                      <div className="relative w-full h-56 overflow-hidden">
                        <Image
                          src={cat.imageUrl || "/placeholder.svg?height=400&width=600"}
                          alt={cat.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6 text-center bg-gradient-to-t from-background to-muted/20">
                        <h3 className="font-bold text-xl mb-2">{cat.name}</h3>
                        <p className="text-sm text-muted-foreground">{cat.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {workers.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold mb-6">Available Workers</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {workers.map((worker: any) => (
                  <WorkerCard key={worker.id} worker={worker} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
