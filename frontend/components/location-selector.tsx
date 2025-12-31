"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cities, localities } from "@/lib/database"
import { MapPin, Search } from "lucide-react"

export function LocationSelector() {
  const [selectedCity, setSelectedCity] = useState("")
  const [selectedLocality, setSelectedLocality] = useState("")
  const router = useRouter()

  const handleSearch = () => {
    if (selectedCity) {
      const params = new URLSearchParams()
      params.set("city", selectedCity)
      if (selectedLocality) {
        params.set("locality", selectedLocality)
      }
      router.push(`/services?${params.toString()}`)
    }
  }

  return (
    <Card className="p-4 md:p-6 shadow-2xl border-2 bg-white/95 backdrop-blur">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-base md:text-lg">Search by Location</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
        <Select
          value={selectedCity}
          onValueChange={(value) => {
            setSelectedCity(value)
            setSelectedLocality("")
          }}
        >
          <SelectTrigger className="h-11">
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
          <SelectTrigger className="h-11">
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

        <Button onClick={handleSearch} disabled={!selectedCity} className="bg-primary hover:bg-primary/90 h-11">
          <Search className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Search Services</span>
          <span className="sm:hidden">Search</span>
        </Button>
      </div>
    </Card>
  )
}
