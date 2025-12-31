"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cities, localities } from "@/lib/database"
import { MapPin } from "lucide-react"

interface LocationFilterProps {
  initialCity?: string
  initialLocality?: string
}

export function LocationFilter({ initialCity, initialLocality }: LocationFilterProps) {
  const [selectedCity, setSelectedCity] = useState(initialCity || "")
  const [selectedLocality, setSelectedLocality] = useState(initialLocality || "")
  const router = useRouter()
  const pathname = usePathname()

  const handleFilter = () => {
    const params = new URLSearchParams()
    if (selectedCity) {
      params.set("city", selectedCity)
    }
    if (selectedLocality) {
      params.set("locality", selectedLocality)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleClear = () => {
    setSelectedCity("")
    setSelectedLocality("")
    router.push(pathname)
  }

  return (
    <Card className="p-6 border-2">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Filter by Location</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Select
          value={selectedCity}
          onValueChange={(value) => {
            setSelectedCity(value)
            setSelectedLocality("")
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select City" />
          </SelectTrigger>
          <SelectContent>
            {cities.map((city) => (
              <SelectItem key={city.value} value={city.value}>
                {city.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedLocality} onValueChange={setSelectedLocality} disabled={!selectedCity}>
          <SelectTrigger>
            <SelectValue placeholder="Select Area (Optional)" />
          </SelectTrigger>
          <SelectContent>
            {selectedCity &&
              localities[selectedCity]?.map((locality) => (
                <SelectItem key={locality.value} value={locality.value}>
                  {locality.label}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>

        <Button onClick={handleFilter} disabled={!selectedCity}>
          Apply Filter
        </Button>

        <Button variant="outline" onClick={handleClear}>
          Clear
        </Button>
      </div>
    </Card>
  )
}
