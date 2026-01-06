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
      <Link href={`/worker/${worker.id}`} className="block">
        <Card className="group relative h-[520px] flex flex-col hover:shadow-2xl transition-all duration-500 border-none bg-background overflow-hidden ring-1 ring-slate-200/50">
          {/* Magazine Cover Image Section */}
          <div className="relative h-[280px] w-full overflow-hidden">
            <Image
              src={
                worker.profileImage ||
                `/placeholder.svg?height=400&width=400&query=professional pakistani ${worker.category || ""} worker portrait smiling`
              }
              alt={worker.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

            {/* Verification Badge */}
            {worker.isVerified && (
              <div className="absolute top-4 left-4 bg-green-500/90 backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg animate-in fade-in slide-in-from-left-2 duration-300">
                <CheckCircle2 className="h-3.5 w-3.5 fill-white text-green-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Verified Pro</span>
              </div>
            )}

            {/* Package Badge (if any) */}
            {worker.packageType && (
              <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur-md text-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-lg border border-white/20">
                <Star className="h-3.5 w-3.5 fill-white text-primary" />
                <span className="text-[10px] font-black uppercase tracking-widest">{worker.packageType}</span>
              </div>
            )}

            {/* Bottom Info Overlay */}
            <div className="absolute bottom-4 left-4 right-4">
              <span className="inline-block px-2 py-1 rounded bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase font-bold tracking-tighter mb-2">
                {worker.category}
              </span>
              <h3 className="text-xl font-black text-white leading-tight drop-shadow-md group-hover:text-primary transition-colors line-clamp-1">
                {worker.name}
              </h3>
            </div>
          </div>

          <CardContent className="flex-1 p-6 flex flex-col justify-between bg-white relative">
            {/* Quick Stats Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-500">
                  <MapPin className="h-4 w-4" />
                  <span className="text-xs font-bold truncate max-w-[120px]">{worker.locality}</span>
                </div>
                <div className="flex items-center gap-1 text-amber-500">
                  <Star className="h-4 w-4 fill-amber-500" />
                  <span className="text-sm font-black">{worker.rating || "N/A"}</span>
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Experience</div>
                  <div className="flex items-center gap-1.5 font-black text-slate-800">
                    <Briefcase className="h-3.5 w-3.5 text-primary" />
                    <span>{worker.experience}+ YRS</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Availability</div>
                  <div className="flex items-center gap-1.5 font-black text-slate-800">
                    <Clock className="h-3.5 w-3.5 text-primary" />
                    <span>Anytime</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons Section */}
            <div className="grid grid-cols-2 gap-3 mt-6 relative z-10">
              <Button
                variant="outline"
                className="w-full h-11 border-2 border-slate-200 text-slate-900 font-black rounded-xl hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 active:scale-95"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleStatsClick("call")
                  setIsCallDialogOpen(true)
                }}
              >
                <Phone className="h-4 w-4 mr-2" />
                CALL
              </Button>
              <Button
                className="w-full h-11 bg-green-600 hover:bg-green-700 text-white font-black rounded-xl shadow-lg shadow-green-200 transition-all duration-300 active:scale-95"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  handleStatsClick("whatsapp")
                  window.open(`https://wa.me/${worker.whatsapp.replace(/[^0-9]/g, "")}`, "_blank")
                }}
              >
                <MessageCircle className="h-4 w-4 mr-2" />
                CHAT
              </Button>
            </div>
          </CardContent>

          {/* Hover Reveal Effect - Moved before content or added z-index to content */}
          <div className="absolute inset-0 bg-primary/5 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0" />
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


