// Mock database structure for EASY marketplace
// In production, this would connect to a real database

export interface Worker {
  id: string
  name: string
  email: string
  phone: string
  whatsapp: string
  city: string
  locality: string[]
  category: string
  experience: number
  skills: string[]
  about: string
  cnicNumber: string
  cnicImages: string[]
  selfieImage: string
  isVerified: boolean
  isActive: boolean
  profileImage: string
  packageType: "basic" | "standard" | "premium" | null
  packageExpiry: Date | null
  hasPurchasedPackage: boolean
  paymentProof: string | null
  paymentStatus: "pending" | "verified" | "rejected" | null
  profileViews: number
  profileClicks: number
  contactClicks: number
  whatsappClicks: number
  rating: number
  reviewCount: number
  createdAt: Date
  verifiedAt: Date | null
  verificationStatus: "pending" | "verified" | "rejected"
  pendingCnicUpdate: boolean
}

export interface Client {
  id: string
  name: string
  email: string
  phone: string
  city: string
  locality: string
  profileImage: string
  createdAt: Date
}

export interface User {
  id: string
  email: string
  password: string
  role: "worker" | "client" | "admin"
  profileId: string
  createdAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  imageUrl: string
}

export interface Package {
  id: string
  name: string
  price: number
  duration: number
  features: string[]
  isActive: boolean
  rank: number
}

// Mock data
export const categories: Category[] = [
  {
    id: "1",
    name: "Electrician",
    slug: "electrician",
    description: "Licensed electricians for all your electrical needs",
    icon: "zap",
    imageUrl: "/professional-pakistani-electrician-working-with-wi.jpg",
  },
  {
    id: "2",
    name: "Plumber",
    slug: "plumber",
    description: "Professional plumbing services",
    icon: "droplet",
    imageUrl: "/professional-pakistani-plumber-fixing-pipes-high-q.jpg",
  },
  {
    id: "3",
    name: "Carpenter",
    slug: "carpenter",
    description: "Expert carpentry and woodwork",
    icon: "hammer",
    imageUrl: "/professional-pakistani-carpenter-working-with-wood.jpg",
  },
  {
    id: "4",
    name: "Painter",
    slug: "painter",
    description: "Professional painting services",
    icon: "paintbrush",
    imageUrl: "/professional-pakistani-house-painter-painting-wall.jpg",
  },
  {
    id: "6",
    name: "Home Chef",
    slug: "home-chef",
    description: "Professional home cooking services",
    icon: "chef-hat",
    imageUrl: "/professional-pakistani-home-chef-cooking-in-kitche.jpg",
  },
  {
    id: "7",
    name: "Furniture",
    slug: "furniture",
    description: "Furniture making and repair services",
    icon: "armchair",
    imageUrl: "/professional-pakistani-furniture-maker-crafting-fu.jpg",
  },
  {
    id: "8",
    name: "Cleaning",
    slug: "cleaning",
    description: "Professional home and office cleaning",
    icon: "sparkles",
    imageUrl: "/professional-pakistani-cleaning-service-worker-cle.jpg",
  },
  {
    id: "9",
    name: "Gardening",
    slug: "gardening",
    description: "Garden maintenance and landscaping",
    icon: "flower",
    imageUrl: "/professional-pakistani-gardener-working-in-garden-.jpg",
  },
  {
    id: "10",
    name: "Security",
    slug: "security",
    description: "Professional security guard services",
    icon: "shield",
    imageUrl: "/professional-pakistani-security-guard-in-uniform-h.jpg",
  },
  {
    id: "11",
    name: "Pest Control",
    slug: "pest-control",
    description: "Expert pest control and fumigation",
    icon: "bug",
    imageUrl: "/professional-pakistani-pest-control-worker-sprayin.jpg",
  },
  {
    id: "12",
    name: "Rent a Car",
    slug: "rent-a-car",
    description: "Car rental and driver services",
    icon: "car",
    imageUrl: "/professional-pakistani-driver-with-car-rental-serv.jpg",
  },
  {
    id: "13",
    name: "Solar Ceiling",
    slug: "solar-ceiling",
    description: "Solar panel installation on roofs",
    icon: "sun",
    imageUrl: "/professional-pakistani-solar-panel-installer-on-ro.jpg",
  },
  {
    id: "14",
    name: "Cobbler",
    slug: "cobbler",
    description: "Expert shoe repair and maintenance services",
    icon: "hammer",
    imageUrl: "/cobbler-service.png",
  },
  {
    id: "15",
    name: "Darning",
    slug: "darning",
    description: "Professional darning and invisible mending services",
    icon: "needle",
    imageUrl: "/darning-service.png",
  },
]

export const cities = [
  { value: "lahore", label: "Lahore" },
]

export const localities: Record<string, { value: string; label: string }[]> = {
  lahore: [
    { value: "aabpara-housing-society", label: "Aabpara Housing Society" },
    { value: "airline-housing-society", label: "Airline Housing Society" },
    { value: "airport-housing-society", label: "Airport Housing Society" },
    { value: "al-faisal-town", label: "Al-Faisal Town" },
    { value: "al-hafeez-garden", label: "Al-Hafeez Garden" },
    { value: "al-hamra-town", label: "Al-Hamra Town" },
    { value: "al-kabir-town-phase-1", label: "Al-Kabir Town Phase 1" },
    { value: "al-kabir-town-phase-2", label: "Al-Kabir Town Phase 2" },
    { value: "al-kabir-town-phase-3", label: "Al-Kabir Town Phase 3" },
    { value: "al-noor-town", label: "Al-Noor Town" },
    { value: "allama-iqbal-town", label: "Allama Iqbal Town" },
    { value: "allama-iqbal-town-huma-block", label: "Allama Iqbal Town Huma Block" },
    { value: "allama-iqbal-town-kareem-block", label: "Allama Iqbal Town Kareem Block" },
    { value: "allama-iqbal-town-nargis-block", label: "Allama Iqbal Town Nargis Block" },
    { value: "allama-iqbal-town-ravi-block", label: "Allama Iqbal Town Ravi Block" },
    { value: "anarkali", label: "Anarkali" },
    { value: "askari-1", label: "Askari 1" },
    { value: "askari-2", label: "Askari 2" },
    { value: "askari-3", label: "Askari 3" },
    { value: "askari-4", label: "Askari 4" },
    { value: "askari-5", label: "Askari 5" },
    { value: "askari-6", label: "Askari 6" },
    { value: "askari-7", label: "Askari 7" },
    { value: "askari-8", label: "Askari 8" },
    { value: "audit-accounts-housing-society", label: "Audit & Accounts Housing Society" },
    { value: "aviation-society", label: "Aviation Society" },
    { value: "azam-gardens", label: "Azam Gardens" },
    { value: "bahria-orchard-phase-1", label: "Bahria Orchard Phase 1" },
    { value: "bahria-orchard-phase-2", label: "Bahria Orchard Phase 2" },
    { value: "bahria-orchard-phase-3", label: "Bahria Orchard Phase 3" },
    { value: "bahria-orchard-phase-4", label: "Bahria Orchard Phase 4" },
    { value: "bahria-town-sector-a", label: "Bahria Town Sector A" },
    { value: "bahria-town-sector-b", label: "Bahria Town Sector B" },
    { value: "bahria-town-sector-c", label: "Bahria Town Sector C" },
    { value: "bahria-town-sector-d", label: "Bahria Town Sector D" },
    { value: "bahria-town-sector-e", label: "Bahria Town Sector E" },
    { value: "bahria-town-sector-f", label: "Bahria Town Sector F" },
    { value: "bahria-town-sector-g", label: "Bahria Town Sector G" },
    { value: "bahria-town-sector-h", label: "Bahria Town Sector H" },
    { value: "bahria-town-sector-i", label: "Bahria Town Sector I" },
    { value: "barkat-market", label: "Barkat Market" },
    { value: "batapur", label: "Batapur" },
    { value: "bedian-road", label: "Bedian Road" },
    { value: "bilal-gunj", label: "Bilal Gunj" },
    { value: "bund-road", label: "Bund Road" },
    { value: "canal-bank-road", label: "Canal Bank Road" },
    { value: "canal-road", label: "Canal Road" },
    { value: "cantonment", label: "Cantonment" },
    { value: "cavalry-ground", label: "Cavalry Ground" },
    { value: "chauburji", label: "Chauburji" },
    { value: "chinar-bagh", label: "Chinar Bagh" },
    { value: "chungi-amar-sidhu", label: "Chungi Amar Sidhu" },
    { value: "data-darbar-area", label: "Data Darbar Area" },
    { value: "defence-raya", label: "Defence Raya" },
    { value: "defence-road", label: "Defence Road" },
    { value: "dha-phase-1", label: "DHA Phase 1" },
    { value: "dha-phase-2", label: "DHA Phase 2" },
    { value: "dha-phase-3", label: "DHA Phase 3" },
    { value: "dha-phase-4", label: "DHA Phase 4" },
    { value: "dha-phase-5", label: "DHA Phase 5" },
    { value: "dha-phase-6", label: "DHA Phase 6" },
    { value: "dha-phase-7", label: "DHA Phase 7" },
    { value: "dha-phase-8", label: "DHA Phase 8" },
    { value: "dha-phase-9-prism", label: "DHA Phase 9 Prism" },
    { value: "dha-phase-9-town", label: "DHA Phase 9 Town" },
    { value: "dha-rahbar-phase-1", label: "DHA Rahbar Phase 1" },
    { value: "dha-rahbar-phase-2", label: "DHA Rahbar Phase 2" },
    { value: "eden", label: "Eden" },
    { value: "eden-avenue", label: "Eden Avenue" },
    { value: "eden-city", label: "Eden City" },
    { value: "expo-center-area", label: "Expo Center Area" },
    { value: "faisal-town", label: "Faisal Town" },
    { value: "faisal-town-extension", label: "Faisal Town Extension" },
    { value: "falcon-complex", label: "Falcon Complex" },
    { value: "ferozpur-road", label: "Ferozpur Road" },
    { value: "garden-town", label: "Garden Town" },
    { value: "ghazi-road", label: "Ghazi Road" },
    { value: "gor-i", label: "GOR I" },
    { value: "gor-ii", label: "GOR II" },
    { value: "green-town", label: "Green Town" },
    { value: "gulberg-i", label: "Gulberg I" },
    { value: "gulberg-ii", label: "Gulberg II" },
    { value: "gulberg-iii", label: "Gulberg III" },
    { value: "gulberg-iv", label: "Gulberg IV" },
    { value: "gulberg-v", label: "Gulberg V" },
    { value: "gulberg-main-boulevard", label: "Gulberg Main Boulevard" },
    { value: "gulshan-e-ravi", label: "Gulshan-e-Ravi" },
    { value: "hall-road", label: "Hall Road" },
    { value: "halloki", label: "Halloki" },
    { value: "harbanspura", label: "Harbanspura" },
    { value: "hassan-town", label: "Hassan Town" },
    { value: "ichhra", label: "Ichhra" },
    { value: "iqbal-avenue", label: "Iqbal Avenue" },
    { value: "iqbal-town", label: "Iqbal Town" },
    { value: "islampura", label: "Islampura" },
    { value: "jail-road", label: "Jail Road" },
    { value: "johar-town-phase-1", label: "Johar Town Phase 1" },
    { value: "johar-town-phase-2", label: "Johar Town Phase 2" },
    { value: "johar-town-block-a", label: "Johar Town Block A" },
    { value: "johar-town-block-b", label: "Johar Town Block B" },
    { value: "johar-town-block-c", label: "Johar Town Block C" },
    { value: "johar-town-block-d", label: "Johar Town Block D" },
    { value: "johar-town-block-e", label: "Johar Town Block E" },
    { value: "johar-town-block-f", label: "Johar Town Block F" },
    { value: "jubilee-town", label: "Jubilee Town" },
    { value: "kahna", label: "Kahna" },
    { value: "kahna-nau", label: "Kahna Nau" },
    { value: "kalma-chowk", label: "Kalma Chowk" },
    { value: "khayaban-e-amin", label: "Khayaban-e-Amin" },
    { value: "kot-lakhpat", label: "Kot Lakhpat" },
    { value: "krishan-nagar", label: "Krishan Nagar" },
    { value: "lda-avenue", label: "LDA Avenue" },
    { value: "lake-city-phase-1", label: "Lake City Phase 1" },
    { value: "lake-city-phase-2", label: "Lake City Phase 2" },
    { value: "lahore-cantt", label: "Lahore Cantt" },
    { value: "liberty-market", label: "Liberty Market" },
    { value: "lower-mall", label: "Lower Mall" },
    { value: "madina-colony", label: "Madina Colony" },
    { value: "mall-road", label: "Mall Road" },
    { value: "manawan", label: "Manawan" },
    { value: "mazang", label: "Mazang" },
    { value: "military-accounts-housing-society", label: "Military Accounts Housing Society" },
    { value: "misri-shah", label: "Misri Shah" },
    { value: "model-town-block-a", label: "Model Town Block A" },
    { value: "model-town-block-b", label: "Model Town Block B" },
    { value: "model-town-block-c", label: "Model Town Block C" },
    { value: "model-town-block-d", label: "Model Town Block D" },
    { value: "model-town-block-e", label: "Model Town Block E" },
    { value: "model-town-block-f", label: "Model Town Block F" },
    { value: "model-town-block-g", label: "Model Town Block G" },
    { value: "model-town-block-h", label: "Model Town Block H" },
    { value: "model-town-block-k", label: "Model Town Block K" },
    { value: "model-town-extension", label: "Model Town Extension" },
    { value: "mozang", label: "Mozang" },
    { value: "mughalpura", label: "Mughalpura" },
    { value: "multan-road", label: "Multan Road" },
    { value: "muslim-town", label: "Muslim Town" },
    { value: "mustafa-town", label: "Mustafa Town" },
    { value: "nfc-housing-society", label: "NFC Housing Society" },
    { value: "nishat-colony", label: "Nishat Colony" },
    { value: "nishtar-colony", label: "Nishtar Colony" },
    { value: "nishtar-town", label: "Nishtar Town" },
    { value: "paragon-city", label: "Paragon City" },
    { value: "pcsir-housing-society", label: "PCSIR Housing Society" },
    { value: "pia-housing-society", label: "PIA Housing Society" },
    { value: "punjab-university-area", label: "Punjab University Area" },
    { value: "punjab-society-phase-1", label: "Punjab Society Phase 1" },
    { value: "punjab-society-phase-2", label: "Punjab Society Phase 2" },
    { value: "punjab-society-phase-3", label: "Punjab Society Phase 3" },
    { value: "race-course", label: "Race Course" },
    { value: "raiwind-road", label: "Raiwind Road" },
    { value: "ravi-road", label: "Ravi Road" },
    { value: "ravi-town", label: "Ravi Town" },
    { value: "sabzazar-block-a", label: "Sabzazar Block A" },
    { value: "sabzazar-block-b", label: "Sabzazar Block B" },
    { value: "sabzazar-block-c", label: "Sabzazar Block C" },
    { value: "sabzazar-block-d", label: "Sabzazar Block D" },
    { value: "sabzazar-block-e", label: "Sabzazar Block E" },
    { value: "sabzazar-block-f", label: "Sabzazar Block F" },
    { value: "samanabad", label: "Samanabad" },
    { value: "sarwar-road", label: "Sarwar Road" },
    { value: "scheme-mor", label: "Scheme Mor" },
    { value: "shad-bagh", label: "Shad Bagh" },
    { value: "shadman", label: "Shadman" },
    { value: "shah-jamal", label: "Shah Jamal" },
    { value: "shahdara", label: "Shahdara" },
    { value: "shalimar-gardens-area", label: "Shalimar Gardens Area" },
    { value: "shalimar-town", label: "Shalimar Town" },
    { value: "shaukat-khanum", label: "Shaukat Khanum" },
    { value: "state-life-phase-1", label: "State Life Phase 1" },
    { value: "state-life-phase-2", label: "State Life Phase 2" },
    { value: "sukh-chayn-gardens", label: "Sukh Chayn Gardens" },
    { value: "sundar-industrial-estate", label: "Sundar Industrial Estate" },
    { value: "tajpura", label: "Tajpura" },
    { value: "thokar-niaz-baig", label: "Thokar Niaz Baig" },
    { value: "township-sector-a1", label: "Township Sector A1" },
    { value: "township-sector-a2", label: "Township Sector A2" },
    { value: "township-sector-b1", label: "Township Sector B1" },
    { value: "township-sector-b2", label: "Township Sector B2" },
    { value: "township-sector-c1", label: "Township Sector C1" },
    { value: "township-sector-c2", label: "Township Sector C2" },
    { value: "upper-mall", label: "Upper Mall" },
    { value: "valencia-town", label: "Valencia Town" },
    { value: "wahdat-road", label: "Wahdat Road" },
    { value: "wahdat-colony", label: "Wahdat Colony" },
    { value: "walled-city", label: "Walled City" },
    { value: "walton", label: "Walton" },
    { value: "wapda-town-phase-1", label: "Wapda Town Phase 1" },
    { value: "wapda-town-phase-2", label: "Wapda Town Phase 2" },
  ],
}

export const packages: Package[] = [
  {
    id: "2",
    name: "Standard",
    price: 3000,
    duration: 30,
    features: ["Profile listing", "Higher ranking", "Featured badge", "Priority support", "Contact details visible"],
    isActive: true,
    rank: 1,
  },
]

export const mockWorkers: Worker[] = []

// Mock user storage
const users: User[] = []

const workers: Worker[] = [...mockWorkers]

// Mock client storage
const clients: Client[] = []

// Helper functions
export function getWorkersByLocation(city: string, locality?: string) {
  return workers.filter((w) => w.city === city && w.isVerified && (!locality || w.locality.includes(locality)))
}

export function getWorkersByCategory(category: string, city?: string, locality?: string) {
  let filtered = workers.filter((w) => {
    // Only show verified workers with active packages
    if (!w.isVerified || !w.hasPurchasedPackage) return false

    // Check if package is active
    if (w.packageExpiry && new Date(w.packageExpiry) < new Date()) return false

    return w.category === category
  })

  if (city) {
    filtered = filtered.filter((w) => w.city === city)
  }

  if (locality) {
    filtered = filtered.filter((w) => w.locality.includes(locality))
  }

  return filtered.sort((a, b) => {
    const rankA = a.packageType === "premium" ? 3 : a.packageType === "standard" ? 2 : 1
    const rankB = b.packageType === "premium" ? 3 : b.packageType === "standard" ? 2 : 1

    if (rankA !== rankB) return rankB - rankA
    return b.rating - a.rating
  })
}

export function getWorkerById(id: string) {
  return workers.find((w) => w.id === id)
}

export function getFeaturedWorkers(limit = 6) {
  return workers
    .filter((w) => {
      if (!w.isVerified || !w.hasPurchasedPackage || w.packageType !== "premium") return false
      return !w.packageExpiry || new Date(w.packageExpiry) >= new Date()
    })
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit)
}

export function incrementWorkerStats(
  workerId: string,
  stat: "profileViews" | "profileClicks" | "contactClicks" | "whatsappClicks",
) {
  const worker = workers.find((w) => w.id === workerId)
  if (worker) {
    worker[stat]++
  }
}

export function getUnverifiedWorkers() {
  return workers.filter((w) => !w.isVerified)
}

export function verifyWorker(workerId: string) {
  const worker = workers.find((w) => w.id === workerId)
  if (worker) {
    worker.isVerified = true
    worker.verificationStatus = "verified"
    worker.verifiedAt = new Date()
    worker.pendingCnicUpdate = false
  }
}

export function addWorker(worker: Omit<Worker, "id" | "createdAt">) {
  const newWorker: Worker = {
    ...worker,
    id: `worker-${Date.now()}`,
    createdAt: new Date(),
    verificationStatus: "pending",
    pendingCnicUpdate: true,
    paymentProof: null,
    paymentStatus: null,
  }
  workers.push(newWorker)
  return newWorker
}

export function updateWorker(workerId: string, updates: Partial<Worker>) {
  const index = workers.findIndex((w) => w.id === workerId)
  if (index !== -1) {
    if (updates.cnicImages && updates.cnicImages.length > 0) {
      updates.verificationStatus = "pending"
      updates.isVerified = false
      updates.pendingCnicUpdate = true
    }
    if (updates.paymentProof) {
      updates.paymentStatus = "pending"
    }
    workers[index] = { ...workers[index], ...updates }
    return workers[index]
  }
  return null
}

export function authenticateUser(email: string, password: string) {
  return users.find((u) => u.email === email && u.password === password)
}

export function registerUser(email: string, password: string, role: "worker" | "client", profileId?: string) {
  const newUser: User = {
    id: `user-${Date.now()}`,
    email,
    password,
    role,
    profileId: profileId || "",
    createdAt: new Date(),
  }
  users.push(newUser)
  return newUser
}

export function isPackageExpired(worker: Worker): boolean {
  if (!worker.packageExpiry) return false
  return new Date(worker.packageExpiry) < new Date()
}

export function getDaysUntilExpiry(worker: Worker): number {
  if (!worker.packageExpiry) return 0
  const today = new Date()
  const expiry = new Date(worker.packageExpiry)
  const diff = expiry.getTime() - today.getTime()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function purchasePackage(workerId: string, packageType: "basic" | "standard" | "premium") {
  const worker = workers.find((w) => w.id === workerId)
  const pkg = packages.find((p) => p.name.toLowerCase() === packageType)

  if (worker && pkg) {
    worker.packageType = packageType
    worker.hasPurchasedPackage = true
    worker.packageExpiry = new Date(Date.now() + pkg.duration * 24 * 60 * 60 * 1000)
    return worker
  }
  return null
}

export function getWorkerByProfileId(profileId: string) {
  const worker = workers.find((w) => w.id === profileId)
  console.log("[v0] getWorkerByProfileId - Looking for:", profileId, "Found:", worker ? worker.id : "null")
  return worker
}

export function getUserById(userId: string) {
  return users.find((u) => u.id === userId)
}

export function addClient(client: Omit<Client, "id" | "createdAt">) {
  const newClient: Client = {
    ...client,
    id: `client-${Date.now()}`,
    createdAt: new Date(),
  }
  clients.push(newClient)
  return newClient
}

export function updateClient(clientId: string, updates: Partial<Client>) {
  const index = clients.findIndex((c) => c.id === clientId)
  if (index !== -1) {
    clients[index] = { ...clients[index], ...updates }
    return clients[index]
  }
  return null
}

export function getClientById(clientId: string) {
  return clients.find((c) => c.id === clientId)
}

export function verifyPayment(workerId: string, approved: boolean) {
  const worker = workers.find((w) => w.id === workerId)
  if (worker) {
    worker.paymentStatus = approved ? "verified" : "rejected"
    if (approved) {
      worker.isActive = true
      worker.hasPurchasedPackage = true
    }
  }
}

export function getWorkersPendingPayment() {
  return workers.filter((w) => w.paymentStatus === "pending")
}

export function getCitiesWithWorkers(): string[] {
  return cities.map((city) => city.label)
}

export function getLocalitiesByCity(city: string): string[] {
  const cityKey = cities.find((c) => c.label === city)?.value
  if (!cityKey || !localities[cityKey]) return []
  return localities[cityKey].map((locality) => locality.label)
}
