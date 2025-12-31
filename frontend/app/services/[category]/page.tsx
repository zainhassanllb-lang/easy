import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { categories } from "@/lib/database"
import { LocationFilter } from "@/components/location-filter"
import { WorkerCard } from "@/components/worker-card"
import { ArrowLeft } from "lucide-react"
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
    const backendUrl = process.env.BACKEND_URL || "http://localhost:5000"
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
          <div className="mt-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {workers.length} {workers.length === 1 ? "Worker" : "Workers"} Found
              </h2>
            </div>

            {workers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {workers.map((worker: any) => (
                  <WorkerCard key={worker.id} worker={worker} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <p className="text-muted-foreground mb-4">
                  No {category.name.toLowerCase()}s found
                  {city && " in this location"}
                </p>
                <Link href="/services">
                  <Button variant="outline">Browse All Services</Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
