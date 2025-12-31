import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { categories } from "@/lib/database"

export function ServiceCategories() {
  return (
    <section className="py-16">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold mb-4">Popular Services</h2>
        <p className="text-lg text-muted-foreground">Browse by category to find the right professional</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {categories.map((category) => (
          <Link key={category.id} href={`/services/${category.slug}`}>
            <Card className="hover:shadow-2xl transition-all hover:scale-105 cursor-pointer h-full overflow-hidden">
              <CardContent className="p-0">
                <div className="relative w-full h-64 overflow-hidden">
                  <Image
                    src={
                      category.imageUrl ||
                      `/placeholder.svg?height=500&width=800&query=professional pakistani ${category.name.toLowerCase()} worker at work in pakistan high quality photo`
                    }
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6 text-center bg-gradient-to-t from-background to-muted/20">
                  <h3 className="font-bold text-xl mb-2">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
