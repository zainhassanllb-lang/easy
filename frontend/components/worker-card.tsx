// "use client"

// import Link from "next/link"
// import Image from "next/image"
// import { Card, CardContent } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import type { Worker } from "@/lib/database"
// import { CheckCircle2, Phone, MessageCircle } from "lucide-react"

// interface WorkerCardProps {
//   worker: Worker
// }

// export function WorkerCard({ worker }: WorkerCardProps) {
//   return (
//     <Link href={`/worker/${worker.id}`}>
//       <Card className="hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
//         <CardContent className="p-4">
//           <div className="flex items-start gap-3 mb-3">
//             <div className="relative w-12 h-12 rounded-full overflow-hidden bg-muted flex-shrink-0">
//               <Image
//                 src={
//                   worker.profileImage ||
//                   `/placeholder.svg?height=100&width=100&query=professional pakistani ${worker.category || "/placeholder.svg"} worker portrait smiling high quality`
//                 }
//                 alt={worker.name}
//                 fill
//                 className="object-cover"
//               />
//             </div>
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-1 mb-1">
//                 <h3 className="font-semibold text-base truncate">{worker.name}</h3>
//                 {worker.isVerified && <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />}
//               </div>
//               <p className="text-xs text-muted-foreground capitalize line-clamp-1">{worker.category}</p>
//               <p className="text-xs text-muted-foreground capitalize">
//                 {Array.isArray(worker.locality) ? worker.locality.join(', ') : worker.locality} - {worker.city}
//               </p>
//             </div>
//           </div>

//           {/* Stats Grid */}
//           <div className="grid grid-cols-3 gap-2 mb-3">
//             <div className="bg-muted/50 rounded-lg p-2 text-center">
//               <div className="font-semibold text-sm">N/A</div>
//               <div className="text-xs text-muted-foreground">Age</div>
//             </div>
//             <div className="bg-muted/50 rounded-lg p-2 text-center">
//               <div className="font-semibold text-sm">{worker.experience}+ years</div>
//               <div className="text-xs text-muted-foreground">Experience</div>
//             </div>
//             <div className="bg-muted/50 rounded-lg p-2 text-center">
//               <div className="font-semibold text-sm">{typeof worker.rating === 'number' ? worker.rating.toFixed(1) : 'N/A'}</div>
//               <div className="text-xs text-muted-foreground">Rating</div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="grid grid-cols-2 gap-2">
//             <Button
//               variant="outline"
//               size="sm"
//               className="w-full text-xs bg-transparent"
//               onClick={(e) => {
//                 e.preventDefault()
//                 window.location.href = `tel:${worker.phone}`
//               }}
//             >
//               <Phone className="h-3 w-3 mr-1" />
//               Call Now
//             </Button>
//             <Button
//               size="sm"
//               className="w-full bg-green-600 hover:bg-green-700 text-white text-xs"
//               onClick={(e) => {
//                 e.preventDefault()
//                 window.open(`https://wa.me/${worker.whatsapp.replace(/[^0-9]/g, "")}`, "_blank")
//               }}
//             >
//               <MessageCircle className="h-3 w-3 mr-1" />
//               WhatsApp
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//     </Link>
//   )
// }

"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Worker } from "@/lib/database"
import { CheckCircle2, Phone, MessageCircle, Star, Briefcase, Copy, MapPin, Clock, Check } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"

interface WorkerCardProps {
  worker: Worker
}

export function WorkerCard({ worker }: WorkerCardProps) {
  const [isCallDialogOpen, setIsCallDialogOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => setIsCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [isCopied])

  const handleCopyPhone = () => {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(worker.phone).then(() => {
        setIsCopied(true)
        toast({
          description: "Phone number copied to clipboard",
        })
      })
    } else {
      const textArea = document.createElement("textarea")
      textArea.value = worker.phone
      document.body.appendChild(textArea)
      textArea.select()
      try {
        document.execCommand("copy")
        setIsCopied(true)
        toast({
          description: "Phone number copied to clipboard",
        })
      } catch (err) {
        console.error("Fallback: Oops, unable to copy", err)
      }
      document.body.removeChild(textArea)
    }
  }

  const handleStatsClick = async (type: "call" | "whatsapp") => {
    try {
      await fetch("/api/stats/increment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workerId: worker.id,
          stat: type === "call" ? "contactClicks" : "whatsappClicks",
        }),
      })
    } catch (error) {
      console.error("Failed to increment stats", error)
    }
  }

  return (
    <>
      <Link href={`/worker/${worker.id}`} className="block h-full">
        <Card className="group relative flex flex-col md:flex-col h-full hover:shadow-xl transition-all duration-300 border border-slate-100 bg-white overflow-hidden rounded-2xl ring-1 ring-slate-200/50">

          {/* Mobile Layout (Horizontal) - Visible only on small screens */}
          <div className="flex md:hidden h-full">
            {/* Left Image Section */}
            <div className="relative w-32 min-w-[120px] bg-slate-100">
              <Image
                src={
                  worker.profileImage ||
                  `/placeholder.svg?height=400&width=400&query=professional pakistani ${worker.category || ""} worker portrait smiling`
                }
                alt={worker.name}
                fill
                className="object-cover"
              />
              {/* Verified Badge - Mobile */}
              {worker.isVerified && (
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full p-1 shadow-sm">
                  <CheckCircle2 className="h-3 w-3 text-green-600 fill-green-100" />
                </div>
              )}
            </div>

            {/* Right Content Section */}
            <div className="flex-1 p-3 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-slate-900 line-clamp-1 leading-tight">{worker.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium mb-1">{worker.category}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-1.5 py-0.5 rounded text-amber-700">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span className="text-xs font-bold">{worker.rating || "New"}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                  <MapPin className="h-3 w-3" />
                  <span className="truncate max-w-[100px]">{worker.locality || worker.city}</span>
                </div>
              </div>

              {/* Mobile Actions */}
              <div className="grid grid-cols-2 gap-2 mt-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="h-8 text-xs font-bold border-slate-200"
                  onClick={(e) => {
                    e.preventDefault()
                    setIsCallDialogOpen(true)
                  }}
                >
                  Call
                </Button>
                <Button
                  size="sm"
                  className="h-8 text-xs font-bold bg-green-600 hover:bg-green-700"
                  onClick={(e) => {
                    e.preventDefault()
                    window.open(`https://wa.me/${worker.whatsapp.replace(/[^0-9]/g, "")}`, "_blank")
                  }}
                >
                  WhatsApp
                </Button>
              </div>
            </div>
          </div>


          {/* Desktop Layout (Vertical) - Visible only on medium+ screens */}
          <div className="hidden md:flex flex-col h-full">
            {/* Image Section */}
            <div className="relative h-48 w-full overflow-hidden bg-slate-100">
              <Image
                src={
                  worker.profileImage ||
                  `/placeholder.svg?height=400&width=400&query=professional pakistani ${worker.category || ""} worker portrait smiling`
                }
                alt={worker.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                {worker.isVerified && (
                  <div className="bg-white/90 backdrop-blur-md text-green-700 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                    <CheckCircle2 className="h-3 w-3 fill-green-100" />
                    <span className="text-[10px] font-bold uppercase">Verified</span>
                  </div>
                )}
              </div>
              {worker.packageType && (
                <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-md text-white px-2 py-0.5 rounded-full flex items-center gap-1 shadow-sm">
                  <Star className="h-3 w-3 fill-white text-white" />
                  <span className="text-[10px] font-bold uppercase">{worker.packageType}</span>
                </div>
              )}

              <div className="absolute bottom-3 left-4 right-4 text-white">
                <h3 className="text-xl font-bold leading-tight truncate">{worker.name}</h3>
                <p className="text-sm text-white/90 font-medium">{worker.category}</p>
              </div>
            </div>

            {/* Content Section */}
            <CardContent className="flex-1 p-5 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1.5 text-slate-600">
                    <MapPin className="h-4 w-4 text-slate-400" />
                    <span className="font-medium truncate max-w-[140px]">{worker.locality}</span>
                  </div>
                  <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-md text-amber-700 font-bold border border-amber-100">
                    <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    <span>{worker.rating || "N/A"}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 py-3 border-t border-b border-slate-50">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-primary/10 rounded-full text-primary">
                      <Briefcase className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Exp</p>
                      <p className="text-sm font-bold text-slate-700">{worker.experience}+ Yrs</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-green-100 rounded-full text-green-600">
                      <Clock className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase">Avail</p>
                      <p className="text-sm font-bold text-slate-700">Anytime</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-4">
                <Button
                  variant="outline"
                  className="w-full font-bold border-slate-200 hover:border-primary hover:text-primary transition-colors"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleStatsClick("call")
                    setIsCallDialogOpen(true)
                  }}
                >
                  Call
                </Button>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 font-bold shadow-md shadow-green-100"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleStatsClick("whatsapp")
                    window.open(`https://wa.me/${worker.whatsapp.replace(/[^0-9]/g, "")}`, "_blank")
                  }}
                >
                  WhatsApp
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </Link>

      <Dialog open={isCallDialogOpen} onOpenChange={setIsCallDialogOpen}>
        <DialogContent className="w-[95%] max-w-[500px] bg-white p-8 md:p-12 rounded-[3rem] overflow-hidden border-none shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] gap-0">
          <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-slate-50 via-slate-200 to-slate-50" />
          <DialogHeader className="p-0 mb-12">
            <DialogTitle className="text-center text-3xl md:text-4xl font-black text-slate-800 tracking-tight leading-tight">
              Professional <br /> Contact Details
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-12">
            <div className="relative group w-full flex justify-center py-4">
              <div className="absolute inset-0 bg-slate-50 rounded-[2rem] scale-95 opacity-50 blur-xl group-hover:scale-100 group-hover:opacity-100 transition-all duration-500" />
              <div className="relative text-3xl sm:text-4xl md:text-5xl font-black tracking-[0.15em] text-slate-800 drop-shadow-sm select-all">
                {worker.phone}
              </div>
            </div>

            <div className="w-full space-y-8">
              <p className="text-center text-lg text-slate-500 font-bold px-4 leading-relaxed">
                Copy this number to your clipboard to save or call the pro.
              </p>
              <Button
                variant="default"
                size="lg"
                className={`w-full h-20 text-2xl font-black rounded-[2rem] transition-all duration-300 active:scale-[0.95] shadow-2xl ${isCopied
                  ? "bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100"
                  : "bg-slate-900 hover:bg-slate-800 shadow-slate-200"
                  }`}
                onClick={handleCopyPhone}
              >
                {isCopied ? (
                  <>
                    <Check className="h-8 w-8 mr-4 stroke-[4px]" />
                    Number Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-8 w-8 mr-4 stroke-[3px]" />
                    Copy Number
                  </>
                )}
              </Button>
              <Button
                variant="ghost"
                className="w-full h-12 text-xl font-black text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-colors"
                onClick={() => setIsCallDialogOpen(false)}
              >
                Go Back
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}


