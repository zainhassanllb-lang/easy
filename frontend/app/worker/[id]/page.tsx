import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { IncrementStats } from "@/components/increment-stats"
import { Star, MapPin, Award, Clock, Edit } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { PageBanner } from "@/components/page-banner"
import { ReviewsSection } from "@/components/reviews-section"
import { ContactActions } from "@/components/contact-actions"
import { getCurrentUser } from "@/lib/auth"

interface PageProps {
  params: Promise<{
    id: string
  }>
}

async function getWorkerById(id: string) {
  try {
    const backendUrl = process.env.BACKEND_URL || "https://easy-e6lz.onrender.com"

    const res = await fetch(`${backendUrl}/api/workers/${id}`, {
      method: "GET",
      cache: "no-store",
    })

    if (!res.ok) {
      return null
    }

    const data = await res.json()
    const worker = data.worker || null

    if (!worker) {
      return null
    }

    // Convert MongoDB _id to id for compatibility
    if (worker._id) {
      worker.id = worker._id.toString()
    }

    // Convert date strings to Date objects for compatibility
    if (worker.packageExpiry && typeof worker.packageExpiry === 'string') {
      worker.packageExpiry = new Date(worker.packageExpiry)
    }
    if (worker.verifiedAt && typeof worker.verifiedAt === 'string') {
      worker.verifiedAt = new Date(worker.verifiedAt)
    }
    if (worker.createdAt && typeof worker.createdAt === 'string') {
      worker.createdAt = new Date(worker.createdAt)
    }

    // Ensure skills is an array
    if (typeof worker.skills === 'string') {
      worker.skills = worker.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
    }
    if (!Array.isArray(worker.skills)) {
      worker.skills = []
    }

    // Ensure locality is an array
    if (typeof worker.locality === 'string') {
      worker.locality = [worker.locality]
    }
    if (!Array.isArray(worker.locality)) {
      worker.locality = []
    }

    // Handle image URLs - prepend backend URL if needed
    if (worker.profileImage && !worker.profileImage.startsWith('http') && !worker.profileImage.startsWith('/')) {
      worker.profileImage = `${backendUrl}${worker.profileImage.startsWith('/') ? '' : '/'}${worker.profileImage}`
    }

    return worker
  } catch (error) {
    console.error("Failed to fetch worker:", error)
    return null
  }
}

export const dynamicParams = true

export default async function WorkerProfilePage({ params }: PageProps) {
  const { id } = await params

  if (!id || id === "undefined" || id === "null" || id.trim() === "") {
    notFound()
  }

  const worker = await getWorkerById(id)

  if (!worker) {
    notFound()
  }

  const currentUser = await getCurrentUser()
  const isOwnProfile = currentUser?.role === "worker" && currentUser.profileId === id

  return (
    <>
      <Header />
      {!isOwnProfile && <IncrementStats workerId={id} />}

      <PageBanner
        image="/worker-profile-banner.jpg"
        title={worker.name}
        description={`Professional ${worker.category} | ${worker.locality}, ${worker.city}`}
        height="md"
      >
        {isOwnProfile && (
          <div className="flex justify-center mt-6">
            <Link href="/worker/edit-profile">
              <Button className="bg-white text-primary hover:bg-white/90 min-w-[180px]" size="lg">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </Link>
          </div>
        )}
      </PageBanner>

      <main className="min-h-screen bg-muted/40">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Profile */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Header */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                    <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-muted flex-shrink-0 mx-auto sm:mx-0">
                      <Image
                        src={worker.profileImage || "/placeholder.svg"}
                        alt={worker.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 text-center sm:text-left">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold">{worker.name}</h1>
                        {worker.isVerified && (
                          <Badge className="bg-secondary text-secondary-foreground">Verified</Badge>
                        )}
                        {worker.packageType === "premium" && (
                          <Badge className="bg-accent text-accent-foreground">Premium</Badge>
                        )}
                      </div>

                      <p className="text-lg md:text-xl text-muted-foreground capitalize mb-3">{worker.category}</p>

                      <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-start mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 md:h-5 md:w-5 fill-yellow-400 text-yellow-400" />
                          <span className="font-semibold text-sm md:text-base">{typeof worker.rating === 'number' ? worker.rating.toFixed(1) : 'N/A'}</span>
                          <span className="text-muted-foreground text-xs md:text-sm">
                            ({worker.reviewCount} reviews)
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-muted-foreground text-xs md:text-sm">
                          <MapPin className="h-4 w-4" />
                          <span className="capitalize">
                            {Array.isArray(worker.locality) ? worker.locality.join(', ') : worker.locality}, {worker.city}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* About */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-4">About</h2>
                  <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{worker.about}</p>
                </CardContent>
              </Card>

              {/* Skills */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <h2 className="text-lg md:text-xl font-semibold mb-4">Skills & Expertise</h2>
                  <div className="flex flex-wrap gap-2">
                    {worker.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary" className="px-3 py-1 text-xs md:text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Reviews */}
              <ReviewsSection workerId={id} canReview={currentUser?.role === 'client' && currentUser?.profileId !== id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Stats */}
              <Card>
                <CardContent className="p-4 md:p-6">
                  <h3 className="font-semibold mb-4">Quick Info</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-xs md:text-sm text-muted-foreground">Experience</div>
                        <div className="font-semibold text-sm md:text-base">{worker.experience} years</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Award className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-xs md:text-sm text-muted-foreground">Reviews</div>
                        <div className="font-semibold text-sm md:text-base">{worker.reviewCount} reviews</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <div className="text-xs md:text-sm text-muted-foreground">Location</div>
                        <div className="font-semibold text-sm md:text-base capitalize">
                          {Array.isArray(worker.locality) ? worker.locality.join(', ') : worker.locality}, {worker.city}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="p-4 md:p-6">
                  <h3 className="font-semibold mb-4">Contact Information</h3>
                  <ContactActions workerId={worker.id} phone={worker.phone} whatsapp={worker.whatsapp} />
                  <div className="mt-4">
                    <div className="text-xs md:text-sm text-muted-foreground mb-1">Email</div>
                    <div className="font-medium text-sm md:text-base break-all">{worker.email}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
