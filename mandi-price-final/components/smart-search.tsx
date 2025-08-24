"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Search, Loader2, TrendingUp, Clock, AlertCircle } from "lucide-react"

interface LocationSuggestion {
  name: string
  type: "city" | "district" | "state" | "landmark" | "address"
  coordinates: { lat: number; lon: number }
  displayName: string
  country?: string
  state?: string
  county?: string
  postcode?: string
  placeId?: string
}

interface MandiRecord {
  state: string
  district: string
  market: string
  commodity: string
  variety: string
  arrival_date: string
  min_price: string
  max_price: string
  modal_price: string
  distance?: number
  coordinates?: { lat: number; lon: number }
}

interface SmartSearchProps {
  onLocationChange?: (location: string, coordinates?: { lat: number; lon: number }) => void
  onCropChange?: (crop: string) => void
  userLocation: string
  setUserLocation: (location: string) => void
  apiKey: string
  apiUrl: string
  fetchAllData: (filters: Record<string, string>) => Promise<any[]>
}

const stateCoordinates: Record<string, { latMin: number; latMax: number; lonMin: number; lonMax: number }> = {
  maharashtra: { latMin: 15.6, latMax: 22.0, lonMin: 72.6, lonMax: 80.9 },
  "uttar pradesh": { latMin: 23.8, latMax: 30.4, lonMin: 77.1, lonMax: 84.6 },
  "tamil nadu": { latMin: 8.1, latMax: 13.6, lonMin: 76.2, lonMax: 80.3 },
  karnataka: { latMin: 11.5, latMax: 18.5, lonMin: 74.1, lonMax: 78.6 },
  gujarat: { latMin: 20.1, latMax: 24.7, lonMin: 68.2, lonMax: 74.5 },
  rajasthan: { latMin: 23.0, latMax: 30.2, lonMin: 69.5, lonMax: 78.2 },
  "madhya pradesh": { latMin: 21.1, latMax: 26.9, lonMin: 74.0, lonMax: 82.8 },
  "west bengal": { latMin: 21.5, latMax: 27.2, lonMin: 85.8, lonMax: 89.9 },
  punjab: { latMin: 29.5, latMax: 32.5, lonMin: 73.9, lonMax: 76.9 },
  haryana: { latMin: 27.4, latMax: 30.9, lonMin: 74.5, lonMax: 77.6 },
  kerala: { latMin: 8.2, latMax: 12.8, lonMin: 74.9, lonMax: 77.4 },
  "jammu and kashmir": { latMin: 32.2, latMax: 35.2, lonMin: 74.7, lonMax: 80.0 },
  himachal: { latMin: 30.7, latMax: 32.7, lonMin: 75.8, lonMax: 79.2 },
  uttarakhand: { latMin: 28.6, latMax: 31.6, lonMin: 77.7, lonMax: 80.1 },
}

export function SmartSearch({
  userLocation,
  setUserLocation,
  apiKey,
  apiUrl,
  fetchAllData,
  onLocationChange,
  onCropChange,
}: SmartSearchProps) {
  const [location, setLocation] = useState("")
  const [crop, setCrop] = useState("")
  const [locationSuggestions, setLocationSuggestions] = useState<LocationSuggestion[]>([])
  const [cropSuggestions, setCropSuggestions] = useState<string[]>([])
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)
  const [showCropSuggestions, setShowCropSuggestions] = useState(false)
  const [smartLoading, setSmartLoading] = useState(false)
  const [smartResults, setSmartResults] = useState("")
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState("")
  const [userCoords, setUserCoords] = useState<{ lat: number; lon: number } | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [apiCallCount, setApiCallCount] = useState(0)
  const [lastApiCall, setLastApiCall] = useState(0)
  const [smartCrop, setSmartCrop] = useState("")
  const [locationDetecting, setLocationDetecting] = useState(false)
  const [locationInput, setLocationInput] = useState("")
  const [availableCrops, setAvailableCrops] = useState<string[]>([])
  const [locationCache, setLocationCache] = useState<Map<string, LocationSuggestion[]>>(new Map())
  const [geocodeCache, setGeocodeCache] = useState<Map<string, { lat: number; lon: number } | null>>(new Map())
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)

  const locationInputRef = useRef<HTMLInputElement>(null)
  const cropInputRef = useRef<HTMLInputElement>(null)
  const locationSuggestionsRef = useRef<HTMLDivElement>(null)
  const cropSuggestionsRef = useRef<HTMLDivElement>(null)

  const LOCATIONIQ_API_KEY = "pk.31743a3955e57a3b56c78a9740833590"
  const API_RATE_LIMIT = 1000 // 1 second between calls - more reasonable
  const MAX_RETRIES = 2 // Reduced retries to avoid long delays
  const DEBOUNCE_DELAY = 500 // Debounce autocomplete calls

  const cropList = [
    "Apple",
    "Banana",
    "Orange",
    "Mango",
    "Grapes",
    "Pomegranate",
    "Papaya",
    "Guava",
    "Pineapple",
    "Watermelon",
    "Muskmelon",
    "Sweet Orange",
    "Mosambi",
    "Lemon",
    "Lime",
    "Coconut",
    "Dates",
    "Fig",
    "Custard Apple",
    "Dragon Fruit",
    "Rice",
    "Wheat",
    "Maize",
    "Barley",
    "Bajra",
    "Jowar",
    "Ragi",
    "Oats",
    "Quinoa",
    "Millets",
    "Onion",
    "Potato",
    "Tomato",
    "Brinjal",
    "Okra",
    "Cabbage",
    "Cauliflower",
    "Carrot",
    "Radish",
    "Beetroot",
    "Spinach",
    "Fenugreek",
    "Coriander",
    "Mint",
    "Curry Leaves",
    "Green Chilli",
    "Red Chilli",
    "Capsicum",
    "Cucumber",
    "Bottle Gourd",
    "Ridge Gourd",
    "Bitter Gourd",
    "Snake Gourd",
    "Pumpkin",
    "Sweet Potato",
    "Yam",
    "Ginger",
    "Garlic",
    "Turmeric",
    "Drumstick",
    "Cotton",
    "Sugarcane",
    "Groundnut",
    "Sunflower",
    "Mustard",
    "Sesame",
    "Castor",
    "Soybean",
    "Arhar",
    "Moong",
    "Urad",
    "Chana",
    "Masoor",
    "Rajma",
    "Black Gram",
    "Green Gram",
    "Field Pea",
    "Cowpea",
    "Horse Gram",
    "Lentil",
  ]

  const makeApiCall = async (url: string, retryCount = 0): Promise<Response | null> => {
    const now = Date.now()
    if (now - lastApiCall < API_RATE_LIMIT) {
      const waitTime = API_RATE_LIMIT - (now - lastApiCall)
      await new Promise((resolve) => setTimeout(resolve, waitTime))
    }

    try {
      setLastApiCall(Date.now())
      setApiCallCount((prev) => prev + 1)

      const response = await fetch(url)

      if (response.status === 429) {
        if (retryCount < MAX_RETRIES) {
          const delay = Math.min(2000 * (retryCount + 1), 5000) // Max 5 second delay
          console.log(`[v0] Rate limited, retrying in ${delay}ms...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          return makeApiCall(url, retryCount + 1)
        }
        throw new Error("Rate limit exceeded. Please try again later.")
      }

      if (response.status === 404) {
        throw new Error("Location not found. Please try a different search term.")
      }

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      return response
    } catch (error) {
      if (retryCount < MAX_RETRIES && (error.message.includes("fetch") || error.message.includes("network"))) {
        console.log(`[v0] Network error, retrying... (${retryCount + 1}/${MAX_RETRIES})`)
        await new Promise((resolve) => setTimeout(resolve, 1000))
        return makeApiCall(url, retryCount + 1)
      }
      throw error
    }
  }

  const generateLocationSuggestions = async (input: string): Promise<LocationSuggestion[]> => {
    if (!input || input.length < 2) return []

    const cacheKey = input.toLowerCase().trim()
    if (locationCache.has(cacheKey)) {
      return locationCache.get(cacheKey) || []
    }

    try {
      const url = `https://api.locationiq.com/v1/autocomplete.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(input)}&limit=8&format=json&countrycodes=in&addressdetails=1`
      const response = await makeApiCall(url)

      if (!response) {
        console.error("[v0] LocationIQ autocomplete failed")
        return []
      }

      const data = await response.json()

      const suggestions = data.map((item: any) => {
        const displayParts = []
        if (item.address?.city || item.address?.town || item.address?.village) {
          displayParts.push(item.address.city || item.address.town || item.address.village)
        }
        if (item.address?.state_district && !displayParts.includes(item.address.state_district)) {
          displayParts.push(item.address.state_district)
        }
        if (item.address?.state && !displayParts.includes(item.address.state)) {
          displayParts.push(item.address.state)
        }

        let type: LocationSuggestion["type"] = "address"
        if (item.class === "place") {
          if (item.type === "city" || item.type === "town") type = "city"
          else if (item.type === "state") type = "state"
          else if (item.type === "county") type = "district"
        } else if (item.class === "tourism" || item.class === "historic") {
          type = "landmark"
        }

        return {
          name: item.display_name.split(",")[0],
          type,
          displayName: displayParts.join(", "),
          fullAddress: item.display_name,
          lat: Number.parseFloat(item.lat),
          lon: Number.parseFloat(item.lon),
        }
      })

      setLocationCache((prev) => new Map(prev).set(cacheKey, suggestions))
      return suggestions
    } catch (error) {
      console.error("[v0] Error fetching location suggestions:", error.message)
      return []
    }
  }

  const generateCropSuggestions = (input: string): string[] => {
    if (!input || input.length < 1) return []

    const normalizedInput = input.toLowerCase().trim()
    return cropList
      .filter((crop) => crop.toLowerCase().includes(normalizedInput))
      .sort((a, b) => {
        const aIndex = a.toLowerCase().indexOf(normalizedInput)
        const bIndex = b.toLowerCase().indexOf(normalizedInput)
        if (aIndex !== bIndex) return aIndex - bIndex
        return a.length - b.length
      })
      .slice(0, 8)
  }

  const handleLocationInputChange = async (value: string) => {
    setLocationInput(value)
    setLocation(value)

    if (debounceTimer) {
      clearTimeout(debounceTimer)
    }

    if (value.length >= 2) {
      setShowLocationSuggestions(true)

      const timer = setTimeout(async () => {
        try {
          const suggestions = await generateLocationSuggestions(value)
          setLocationSuggestions(suggestions)
          setShowLocationSuggestions(suggestions.length > 0)
        } catch (error) {
          console.error("[v0] Error in debounced location search:", error)
          setLocationSuggestions([])
          setShowLocationSuggestions(false)
        }
      }, DEBOUNCE_DELAY)

      setDebounceTimer(timer)
    } else {
      setLocationSuggestions([])
      setShowLocationSuggestions(false)
    }

    setError("") // Clear any previous errors
  }

  const handleCropInputChange = (value: string) => {
    setSmartCrop(value)
    setCrop(value)
    const suggestions = generateCropSuggestions(value)
    setCropSuggestions(suggestions)
    setShowCropSuggestions(suggestions.length > 0)
  }

  const handleLocationSuggestionSelect = (suggestion: LocationSuggestion) => {
    setLocationInput(suggestion.displayName)
    setLocation(suggestion.displayName)
    setUserLocation(suggestion.displayName)
    setUserCoords(suggestion.coordinates)
    setShowLocationSuggestions(false)
    setError("") // Clear any errors
  }

  const handleCropSuggestionSelect = (crop: string) => {
    setSmartCrop(crop)
    setCrop(crop)
    setShowCropSuggestions(false)
  }

  const detectCurrentLocation = () => {
    if (!navigator.geolocation) {
      setUserLocation("Location not supported")
      return
    }

    setLocationDetecting(true)
    setIsLoadingLocation(true)

    const geoOptions = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0,
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setUserCoords({ lat: latitude, lon: longitude })

        const stateData = getStateFromCoordinates(latitude, longitude)
        if (stateData && stateData.state) {
          setLocation(`${stateData.state} (Auto-detected)`)
          setUserLocation(`${stateData.state} (Auto-detected)`)
        } else {
          setLocation(`Location detected (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`)
          setUserLocation(`Location detected (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`)
        }
        setLocationDetecting(false)
        setIsLoadingLocation(false)
      },
      (error) => {
        console.log("[v0] Geolocation error:", error)
        setLocation("Location detection failed")
        setUserLocation("Location detection failed")
        setLocationDetecting(false)
        setIsLoadingLocation(false)
      },
      geoOptions,
    )
  }

  const getStateFromCoordinates = (lat: number, lon: number) => {
    for (const state in stateCoordinates) {
      const range = stateCoordinates[state]
      if (lat >= range.latMin && lat <= range.latMax && lon >= range.lonMin && lon <= range.lonMax) {
        return { state }
      }
    }
    return null
  }

  const geocodeLocation = async (address: string): Promise<{ lat: number; lon: number } | null> => {
    if (!address || address.trim() === "") return null

    if (userCoords && address.includes("(Auto-detected)")) {
      return userCoords
    }

    let normalizedAddress = address.toLowerCase().trim()

    normalizedAddress = normalizedAddress
      .replace(/$$.*?$$/g, "") // Remove parenthetical content like "(naveen mandi sthal)"
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim()

    if (geocodeCache.has(normalizedAddress)) {
      const cached = geocodeCache.get(normalizedAddress)
      if (cached) {
        console.log("[v0] Using cached geocoding result:", cached)
      }
      return cached
    }

    console.log("[v0] Geocoding address with LocationIQ:", normalizedAddress)

    try {
      const url = `https://api.locationiq.com/v1/search.php?key=${LOCATIONIQ_API_KEY}&q=${encodeURIComponent(normalizedAddress)}&format=json&countrycodes=in&limit=1&addressdetails=1`
      const response = await makeApiCall(url)

      if (response) {
        const data = await response.json()
        if (data && data.length > 0) {
          const result = {
            lat: Number.parseFloat(data[0].lat),
            lon: Number.parseFloat(data[0].lon),
          }
          console.log("[v0] LocationIQ geocoding successful:", result)

          setGeocodeCache((prev) => new Map(prev).set(normalizedAddress, result))
          return result
        }
      }
    } catch (error) {
      console.error("[v0] LocationIQ geocoding error:", error)

      if (normalizedAddress.includes(",")) {
        const cityOnly = normalizedAddress.split(",")[0].trim()
        if (cityOnly !== normalizedAddress) {
          console.log("[v0] Trying fallback geocoding with city only:", cityOnly)
          return await geocodeLocation(cityOnly)
        }
      }

      setGeocodeCache((prev) => new Map(prev).set(normalizedAddress, null))
      return null
    }

    console.log("[v0] Geocoding failed for address:", address)
    setGeocodeCache((prev) => new Map(prev).set(normalizedAddress, null))
    return null
  }

  const haversineDistance = (coords1: { lat: number; lon: number }, coords2: { lat: number; lon: number }) => {
    const R = 6371 // Radius of the Earth in km
    const dLat = ((coords2.lat - coords1.lat) * Math.PI) / 180
    const dLon = ((coords2.lon - coords1.lon) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coords1.lat * Math.PI) / 180) *
        Math.cos((coords2.lat * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const handleSmartSearch = async () => {
    if (!location.trim() || !crop.trim()) {
      setError("Please enter both location and crop")
      return
    }

    setSmartLoading(true)
    setShowResults(false)
    setError("")

    try {
      const userCoordinates = await geocodeLocation(location)
      if (!userCoordinates) {
        throw new Error(
          "Could not find coordinates for your location. Please try a different location or select from suggestions.",
        )
      }

      console.log("[v0] User coordinates:", userCoordinates)

      const allRecords = await fetchAllData({})
      const uniqueStates = [...new Set(allRecords.map((r) => r.state))].sort()
      console.log("[v0] Available states in API data:", uniqueStates)

      const cropRecords = allRecords.filter((r) => r.commodity.toLowerCase().trim() === crop.toLowerCase().trim())

      const uniqueCrops = [...new Set(allRecords.map((r) => r.commodity))].sort()
      console.log("[v0] Available crops in API data:", uniqueCrops)
      console.log("[v0] Crop records before state filtering:", cropRecords.length)

      let userState = null
      if (location.includes("(Auto-detected)")) {
        userState = location.replace(" (Auto-detected)", "").trim()
      }

      let filteredRecords = cropRecords
      let fallbackMessage = ""

      if (userState) {
        console.log("[v0] Filtering by user state:", userState)

        const stateMatches = cropRecords.filter((r) => {
          const recordState = r.state.toLowerCase().trim()
          const targetState = userState.toLowerCase().trim()
          console.log("[v0] Comparing record state:", recordState, "with target state:", targetState)
          return recordState === targetState
        })
        console.log("[v0] State matches found:", stateMatches.length)

        if (stateMatches.length > 0) {
          filteredRecords = stateMatches
          console.log("[v0] Using user's state data:", filteredRecords.length)
        } else {
          console.log("[v0] No data for user's state, showing all available data")
          fallbackMessage = `No data available for ${userState}. Showing results from all available states.`
        }
      }

      if (filteredRecords.length === 0) {
        throw new Error(`No mandi data found for crop: ${crop}`)
      }

      console.log("[v0] Found crop records:", filteredRecords.length)

      const validMandis = []
      const MAX_RADIUS_KM = 200

      for (const record of filteredRecords) {
        try {
          const mandiCoords = await geocodeLocation(`${record.market}, ${record.state}`)
          if (mandiCoords && userCoordinates) {
            const distance = haversineDistance(userCoordinates, mandiCoords)
            if (distance !== Number.POSITIVE_INFINITY && !isNaN(distance) && distance <= MAX_RADIUS_KM) {
              validMandis.push({
                ...record,
                distance: Math.round(distance * 10) / 10,
                coordinates: mandiCoords,
              })
            }
          }
        } catch (error) {
          console.log(`[v0] Failed to geocode mandi: ${record.market}, ${record.state}`)
        }
      }

      console.log("[v0] Total valid mandis within 200km:", validMandis.length)

      if (validMandis.length === 0) {
        setSmartResults(`
          <div class="text-center py-6">
            <p class="text-orange-600 font-semibold mb-2">No mandis found within 200km radius</p>
            <p class="text-gray-600 text-sm">Try searching for a different location or crop, or check back later for updated data.</p>
            <p class="text-xs text-gray-500 mt-2">Searched ${filteredRecords.length} records for "${crop}" within 200km of your location</p>
          </div>
        `)
        setShowResults(true)
        setSmartLoading(false)
        return
      }

      validMandis.sort((a, b) => {
        const priceA = Number.parseFloat(a.modal_price) || 0
        const priceB = Number.parseFloat(b.modal_price) || 0
        return priceB - priceA
      })

      displayTopPriceMandisResults(validMandis.slice(0, 10), fallbackMessage)
    } catch (error) {
      console.log("[v0] Smart search error:", error)
      setError(error.message)
      setSmartResults(`<p class="text-red-600">Error: ${error.message}</p>`)
    } finally {
      setSmartLoading(false)
      setShowResults(true)
    }
  }

  const displayTopPriceMandisResults = (mandis: any[], fallbackMessage = "") => {
    const resultsHtml = `
      <div class="space-y-4">
        <div class="flex items-center gap-3 mb-6">
          <span class="text-3xl">💰</span>
          <h3 class="text-2xl font-semibold text-gray-700">Highest Prices Within 200km:</h3>
        </div>
        
        ${
          fallbackMessage
            ? `
          <div class="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
            <p class="text-orange-700 text-sm font-medium">${fallbackMessage}</p>
          </div>
        `
            : ""
        }
        
        ${mandis
          .map(
            (mandi, index) => `
          <div class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
            <div class="flex justify-between items-start mb-2">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-lg font-bold text-gray-800">#${index + 1}</span>
                  <h4 class="font-semibold text-gray-900">${mandi.market}, ${mandi.state}</h4>
                </div>
                <div class="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <span class="inline-flex items-center gap-1">
                    <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                    ${mandi.commodity}
                  </span>
                  <span class="inline-flex items-center gap-1">
                    <span class="w-2 h-2 bg-blue-500 rounded-full"></span>
                    ${mandi.distance} km away
                  </span>
                  <span class="inline-flex items-center gap-1 text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    Within 200km
                  </span>
                </div>
              </div>
              <div class="text-right">
                <div class="text-2xl font-bold text-green-600">₹${Number(mandi.modal_price).toLocaleString()}</div>
                <div class="text-xs text-gray-500">per Quintal</div>
              </div>
            </div>
            <div class="flex justify-end">
              <button 
                onclick="window.open('https://www.google.com/maps/dir/?api=1&destination=${mandi.coordinates.lat},${mandi.coordinates.lon}&travelmode=driving', '_blank')"
                class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                🧭 Show Directions
              </button>
            </div>
          </div>
        `,
          )
          .join("")}
        
        <p class="text-center text-sm text-gray-500 mt-4">
          Showing top ${mandis.length} mandis with highest prices within 200km radius
        </p>
      </div>
    `

    setSmartResults(resultsHtml)
  }

  const extractStateFromAddress = (address: string): string | null => {
    const stateNames = Object.keys(stateCoordinates)
    for (const state of stateNames) {
      if (address.includes(state)) {
        return state
      }
    }
    return null
  }

  const isCityInState = (city: string, state: string): boolean => {
    const stateAssociations: Record<string, string[]> = {
      maharashtra: [
        "mumbai",
        "pune",
        "nashik",
        "aurangabad",
        "solapur",
        "amravati",
        "nanded",
        "kolhapur",
        "akola",
        "latur",
        "dhule",
        "ahmednagar",
        "chandrapur",
        "parbhani",
        "jalgaon",
        "bhiwandi",
        "panvel",
        "thane",
        "satara",
        "ratnagiri",
      ],
      "uttar pradesh": [
        "lucknow",
        "kanpur",
        "agra",
        "varanasi",
        "allahabad",
        "meerut",
        "ghaziabad",
        "aligarh",
        "moradabad",
        "saharanpur",
        "gorakhpur",
        "noida",
        "firozabad",
        "jhansi",
        "bareilly",
        "mathura",
      ],
      "tamil nadu": [
        "chennai",
        "coimbatore",
        "madurai",
        "tiruchirappalli",
        "salem",
        "tirunelveli",
        "erode",
        "vellore",
        "thoothukudi",
        "dindigul",
        "thanjavur",
        "tiruvannamalai",
      ],
      karnataka: [
        "bangalore",
        "mysore",
        "hubli",
        "mangalore",
        "belgaum",
        "gulbarga",
        "davangere",
        "bellary",
        "bijapur",
        "shimoga",
        "tumkur",
      ],
      gujarat: [
        "ahmedabad",
        "surat",
        "rajkot",
        "vadodara",
        "bhavnagar",
        "jamnagar",
        "junagadh",
        "gandhinagar",
        "anand",
        "mehsana",
      ],
      rajasthan: [
        "jaipur",
        "jodhpur",
        "udaipur",
        "kota",
        "bikaner",
        "ajmer",
        "bhilwara",
        "alwar",
        "bharatpur",
        "sikar",
      ],
      "madhya pradesh": ["indore", "bhopal", "jabalpur", "gwalior", "ujjain", "sagar", "dewas", "satna", "ratlam"],
      "west bengal": ["kolkata", "howrah", "durgapur", "asansol", "siliguri"],
      punjab: ["ludhiana", "amritsar", "jalandhar", "patiala", "bathinda", "mohali"],
      haryana: ["faridabad", "gurgaon", "panipat", "ambala", "yamunanagar", "rohtak", "hisar", "karnal", "sonipat"],
      kerala: [
        "kochi",
        "thiruvananthapuram",
        "kozhikode",
        "thrissur",
        "kollam",
        "kannur",
        "kottayam",
        "palakkad",
        "alappuzha",
        "malappuram",
      ],
      "jammu and kashmir": ["jammu", "srinagar", "nowpora", "pulwama", "udhampur", "anantnag", "baramulla", "kathua"],
      himachal: ["shimla", "dharamshala", "manali", "kullu", "solan", "mandi", "hamirpur", "kangra", "nahan"],
      uttarakhand: ["dehradun", "haridwar", "rishikesh", "roorkee", "haldwani", "rudrapur", "kashipur", "jaspur"],
    }

    const cities = stateAssociations[state] || []
    return cities.some((stateCity) => city.toLowerCase().includes(stateCity) || stateCity.includes(city.toLowerCase()))
  }

  const isDistrictInState = (district: string, state: string): boolean => {
    const districtStateMapping: Record<string, string> = {
      // Maharashtra districts
      "mumbai suburban": "maharashtra",
      "mumbai city": "maharashtra",
      thane: "maharashtra",
      raigad: "maharashtra",
      pune: "maharashtra",
      nashik: "maharashtra",
      ahmednagar: "maharashtra",
      solapur: "maharashtra",
      satara: "maharashtra",
      sangli: "maharashtra",
      kolhapur: "maharashtra",
      aurangabad: "maharashtra",
      jalna: "maharashtra",
      parbhani: "maharashtra",
      hingoli: "maharashtra",
      nanded: "maharashtra",
      latur: "maharashtra",
      osmanabad: "maharashtra",
      beed: "maharashtra",
      dhule: "maharashtra",
      jalgaon: "maharashtra",
      nandurbar: "maharashtra",
      akola: "maharashtra",
      washim: "maharashtra",
      amravati: "maharashtra",
      buldhana: "maharashtra",
      yavatmal: "maharashtra",
      wardha: "maharashtra",
      nagpur: "maharashtra",
      bhandara: "maharashtra",
      gondia: "maharashtra",
      chandrapur: "maharashtra",
      gadchiroli: "maharashtra",

      // Uttar Pradesh districts
      agra: "uttar pradesh",
      aligarh: "uttar pradesh",
      allahabad: "uttar pradesh",
      prayagraj: "uttar pradesh",
      ambedkar: "uttar pradesh",
      amethi: "uttar pradesh",
      amroha: "uttar pradesh",
      auraiya: "uttar pradesh",
      azamgarh: "uttar pradesh",
      baghpat: "uttar pradesh",
      bahraich: "uttar pradesh",
      ballia: "uttar pradesh",
      balrampur: "uttar pradesh",
      banda: "uttar pradesh",
      barabanki: "uttar pradesh",
      bareilly: "uttar pradesh",
      basti: "uttar pradesh",
      bhadohi: "uttar pradesh",
      bijnor: "uttar pradesh",
      budaun: "uttar pradesh",
      bulandshahr: "uttar pradesh",
      chandauli: "uttar pradesh",
      chitrakoot: "uttar pradesh",
      deoria: "uttar pradesh",
      etah: "uttar pradesh",
      etawah: "uttar pradesh",
      faizabad: "uttar pradesh",
      ayodhya: "uttar pradesh",
      farrukhabad: "uttar pradesh",
      fatehpur: "uttar pradesh",
      firozabad: "uttar pradesh",
      gautam: "uttar pradesh",
      ghaziabad: "uttar pradesh",
      ghazipur: "uttar pradesh",
      gonda: "uttar pradesh",
      gorakhpur: "uttar pradesh",
      hamirpur: "uttar pradesh",
      hapur: "uttar pradesh",
      hardoi: "uttar pradesh",
      hathras: "uttar pradesh",
      jalaun: "uttar pradesh",
      jaunpur: "uttar pradesh",
      jhansi: "uttar pradesh",
      kannauj: "uttar pradesh",
      kanpur: "uttar pradesh",
      kasganj: "uttar pradesh",
      kaushambi: "uttar pradesh",
      kheri: "uttar pradesh",
      kushinagar: "uttar pradesh",
      lalitpur: "uttar pradesh",
      lucknow: "uttar pradesh",
      maharajganj: "uttar pradesh",
      mahoba: "uttar pradesh",
      mainpuri: "uttar pradesh",
      mathura: "uttar pradesh",
      mau: "uttar pradesh",
      meerut: "uttar pradesh",
      mirzapur: "uttar pradesh",
      moradabad: "uttar pradesh",
      muzaffarnagar: "uttar pradesh",
      pilibhit: "uttar pradesh",
      pratapgarh: "uttar pradesh",
      raebareli: "uttar pradesh",
      rampur: "uttar pradesh",
      saharanpur: "uttar pradesh",
      sambhal: "uttar pradesh",
      "sant kabir nagar": "uttar pradesh",
      shahjahanpur: "uttar pradesh",
      shamli: "uttar pradesh",
      shravasti: "uttar pradesh",
      siddharthnagar: "uttar pradesh",
      sitapur: "uttar pradesh",
      sonbhadra: "uttar pradesh",
      sultanpur: "uttar pradesh",
      unnao: "uttar pradesh",
      varanasi: "uttar pradesh",

      // Tamil Nadu districts
      ariyalur: "tamil nadu",
      chengalpattu: "tamil nadu",
      chennai: "tamil nadu",
      coimbatore: "tamil nadu",
      cuddalore: "tamil nadu",
      dharmapuri: "tamil nadu",
      dindigul: "tamil nadu",
      erode: "tamil nadu",
      kallakurichi: "tamil nadu",
      kanchipuram: "tamil nadu",
      kanyakumari: "tamil nadu",
      karur: "tamil nadu",
      krishnagiri: "tamil nadu",
      madurai: "tamil nadu",
      mayiladuthurai: "tamil nadu",
      nagapattinam: "tamil nadu",
      namakkal: "tamil nadu",
      nilgiris: "tamil nadu",
      perambalur: "tamil nadu",
      pudukkottai: "tamil nadu",
      ramanathapuram: "tamil nadu",
      ranipet: "tamil nadu",
      salem: "tamil nadu",
      sivaganga: "tamil nadu",
      tenkasi: "tamil nadu",
      thanjavur: "tamil nadu",
      theni: "tamil nadu",
      thoothukudi: "tamil nadu",
      tiruchirappalli: "tamil nadu",
      tirunelveli: "tamil nadu",
      tirupathur: "tamil nadu",
      tiruppur: "tamil nadu",
      tiruvannamalai: "tamil nadu",
      tiruvarur: "tamil nadu",
      vellore: "tamil nadu",
      viluppuram: "tamil nadu",
      virudhunagar: "tamil nadu",
    }

    return districtStateMapping[district.toLowerCase()] === state.toLowerCase()
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🔍</span>
        <h2 className="text-2xl font-semibold text-gray-700">Smart Search: Find the Best Price Nearby</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="relative">
          <label htmlFor="location-input" className="block text-sm font-medium text-gray-700 mb-2">
            Your Location:
          </label>
          <div className="relative">
            <Input
              ref={locationInputRef}
              type="text"
              id="location-input"
              placeholder="Enter city, district, or state"
              value={locationInput}
              onChange={(e) => handleLocationInputChange(e.target.value)}
              onFocus={() => {
                if (locationSuggestions.length > 0) {
                  setShowLocationSuggestions(true)
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowLocationSuggestions(false), 200)
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin className="text-red-500" />
            </div>
            {isLoadingLocation && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Loader2 className="animate-spin h-4 w-4 text-blue-500" />
              </div>
            )}
          </div>

          {showLocationSuggestions && locationSuggestions.length > 0 && (
            <div
              ref={locationSuggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {locationSuggestions.map((suggestion, index) => (
                <Button
                  key={`${suggestion.placeId || suggestion.name}-${index}`}
                  onClick={() => handleLocationSuggestionSelect(suggestion)}
                  variant="ghost"
                  className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {suggestion.type === "city"
                        ? "🏙️"
                        : suggestion.type === "district"
                          ? "🏘️"
                          : suggestion.type === "state"
                            ? "🗺️"
                            : suggestion.type === "landmark"
                              ? "🏛️"
                              : "📍"}
                    </span>
                    <div className="flex-1">
                      <span className="font-medium text-gray-900">{suggestion.displayName}</span>
                      {suggestion.state && (
                        <div className="text-xs text-gray-500 mt-1">
                          {suggestion.state}
                          {suggestion.country && `, ${suggestion.country}`}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 text-right">
                      <div>{suggestion.lat.toFixed(4)}</div>
                      <div>{suggestion.lon.toFixed(4)}</div>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>

        <div className="relative">
          <label htmlFor="crop-input" className="block text-sm font-medium text-gray-700 mb-2">
            Crop:
          </label>
          <div className="relative">
            <Input
              ref={cropInputRef}
              type="text"
              id="crop-input"
              placeholder="e.g., Apple, Wheat, Rice"
              value={smartCrop}
              onChange={(e) => handleCropInputChange(e.target.value)}
              onFocus={() => {
                if (cropSuggestions.length > 0) {
                  setShowCropSuggestions(true)
                }
              }}
              onBlur={() => {
                setTimeout(() => setShowCropSuggestions(false), 200)
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <TrendingUp className="text-green-500" />
            </div>
          </div>

          {showCropSuggestions && cropSuggestions.length > 0 && (
            <div
              ref={cropSuggestionsRef}
              className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto"
            >
              {cropSuggestions.map((crop, index) => (
                <Button
                  key={`${crop}-${index}`}
                  onClick={() => handleCropSuggestionSelect(crop)}
                  variant="ghost"
                  className="w-full text-left px-4 py-3 hover:bg-green-50 focus:bg-green-50 focus:outline-none border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center gap-2">
                    <Clock className="text-sm" />
                    <span className="font-medium text-gray-900">{crop}</span>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mb-6">
        <Button
          onClick={handleSmartSearch}
          disabled={smartLoading}
          className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-all duration-200 flex items-center gap-2 min-w-[200px] justify-center"
        >
          {smartLoading ? (
            <>
              <Loader2 className="animate-spin rounded-full h-5 w-5" />
              <span>Searching...</span>
            </>
          ) : (
            <>
              <Search className="h-4 w-4" />
              <span>Find Best Price</span>
            </>
          )}
        </Button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="text-red-500" />
            <p className="text-red-700 font-medium">Error:</p>
          </div>
          <p className="text-red-600 mt-1">{error}</p>
        </div>
      )}

      {showResults && smartResults && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div dangerouslySetInnerHTML={{ __html: smartResults }} />
        </div>
      )}
    </div>
  )
}
