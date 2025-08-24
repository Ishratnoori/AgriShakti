"use client"

import { useState, useEffect } from "react"
import { Header } from "./header"
import { SmartSearch } from "./smart-search"
import { PriceTable } from "./price-table"

export function MandiPricesApp() {
  const [selectedState, setSelectedState] = useState("All States")
  const [selectedCrop, setSelectedCrop] = useState("")
  const [userLocation, setUserLocation] = useState("")
  const [priceData, setPriceData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [initialMessage, setInitialMessage] = useState("Select filters and click Search to view mandi prices.")

  const states = [
    "All States",
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
  ]

  const apiKey = "579b464db66ec23bdd000001e1583739ef0340446508923a979788ea"
  const apiUrl = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070"

  useEffect(() => {
    autoDetectLocation()
  }, [])

  const autoDetectLocation = () => {
    if (!navigator.geolocation) {
      setInitialMessage("Geolocation is not supported by your browser. Please select your state manually.")
      return
    }

    const geoOptions = {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 0,
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        const stateData = getStateFromCoordinates(latitude, longitude)

        if (stateData && stateData.state) {
          setSelectedState(stateData.state)
          setUserLocation(`${stateData.state} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`)
          setInitialMessage(`Location detected: ${stateData.state}. Click Search to view local prices.`)
        } else {
          setUserLocation(`Location detected (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`)
          setInitialMessage(
            "Location detected but couldn't identify your state automatically. Please select your state from the dropdown below.",
          )
        }
      },
      (error) => {
        let errorText = "Location access denied. Please select your state manually."
        if (error.code === error.TIMEOUT) {
          errorText = "Location request timed out. Please select your state manually."
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorText = "Location information is unavailable. Please select your state manually."
        }
        setInitialMessage(errorText)
      },
      geoOptions,
    )
  }

  const getStateFromCoordinates = (lat: number, lon: number) => {
    const stateRanges = [
      { state: "Rajasthan", latMin: 23.0, latMax: 30.2, lonMin: 69.5, lonMax: 78.2 },
      { state: "Maharashtra", latMin: 15.6, latMax: 22.0, lonMin: 72.6, lonMax: 80.9 },
      { state: "Uttar Pradesh", latMin: 23.8, latMax: 30.4, lonMin: 77.1, lonMax: 84.6 },
      { state: "Gujarat", latMin: 20.1, latMax: 24.7, lonMin: 68.2, lonMax: 74.5 },
      { state: "Karnataka", latMin: 11.5, latMax: 18.5, lonMin: 74.1, lonMax: 78.6 },
      { state: "Andhra Pradesh", latMin: 12.6, latMax: 19.9, lonMin: 77.0, lonMax: 84.8 },
      { state: "Tamil Nadu", latMin: 8.1, latMax: 13.6, lonMin: 76.2, lonMax: 80.3 },
      { state: "Madhya Pradesh", latMin: 21.1, latMax: 26.9, lonMin: 74.0, lonMax: 82.8 },
      { state: "West Bengal", latMin: 21.5, latMax: 27.2, lonMin: 85.8, lonMax: 89.9 },
      { state: "Bihar", latMin: 24.3, latMax: 27.5, lonMin: 83.3, lonMax: 88.1 },
      { state: "Punjab", latMin: 29.5, latMax: 32.5, lonMin: 73.9, lonMax: 76.9 },
      { state: "Haryana", latMin: 27.4, latMax: 30.9, lonMin: 74.5, lonMax: 77.6 },
      { state: "Kerala", latMin: 8.2, latMax: 12.8, lonMin: 74.9, lonMax: 77.4 },
      { state: "Odisha", latMin: 17.8, latMax: 22.6, lonMin: 81.4, lonMax: 87.5 },
      { state: "Telangana", latMin: 15.8, latMax: 19.9, lonMin: 77.3, lonMax: 81.8 },
      { state: "Assam", latMin: 24.2, latMax: 28.2, lonMin: 89.7, lonMax: 96.0 },
      { state: "Jharkhand", latMin: 21.9, latMax: 25.3, lonMin: 83.3, lonMax: 87.6 },
      { state: "Chhattisgarh", latMin: 17.8, latMax: 24.1, lonMin: 80.2, lonMax: 84.4 },
      { state: "Himachal Pradesh", latMin: 30.2, latMax: 33.2, lonMin: 75.5, lonMax: 79.0 },
      { state: "Uttarakhand", latMin: 28.4, latMax: 31.4, lonMin: 77.6, lonMax: 81.0 },
    ]

    for (const range of stateRanges) {
      if (lat >= range.latMin && lat <= range.latMax && lon >= range.lonMin && lon <= range.lonMax) {
        return { state: range.state, display_name: `${range.state} (detected from coordinates)` }
      }
    }

    return null
  }

  const fetchAllData = async (filters: Record<string, string>) => {
    let allRecords = []
    let offset = 0
    const limit = 1000

    while (true) {
      const queryParams = new URLSearchParams({
        "api-key": apiKey,
        format: "json",
        offset: offset.toString(),
        limit: limit.toString(),
        ...filters,
      })

      const response = await fetch(`${apiUrl}?${queryParams}`)
      if (!response.ok) throw new Error(`API request failed: ${response.status}`)

      const data = await response.json()

      if (data.records && data.records.length > 0) {
        allRecords = allRecords.concat(data.records)
        offset += limit
      } else {
        break
      }
    }

    return allRecords
  }

  const validateAndFilterData = (records: any[]) => {
    const currentDate = new Date()
    const thirtyDaysAgo = new Date(currentDate.getTime() - 30 * 24 * 60 * 60 * 1000)

    return records
      .filter((record) => {
        if (!record.commodity || !record.market || !record.state) {
          return false
        }

        const minPrice = Number.parseFloat(record.min_price) || 0
        const maxPrice = Number.parseFloat(record.max_price) || 0
        const modalPrice = Number.parseFloat(record.modal_price) || 0

        if (minPrice > 50000 || maxPrice > 50000 || modalPrice > 50000) {
          return false
        }

        if (minPrice <= 0 && maxPrice <= 0 && modalPrice <= 0) {
          return false
        }

        if (record.arrival_date) {
          try {
            const arrivalDate = new Date(record.arrival_date)
            if (arrivalDate < thirtyDaysAgo) {
              return false
            }
          } catch (e) {
            // Invalid date format, keep the record
          }
        }

        return true
      })
      .sort((a, b) => {
        if (a.arrival_date && b.arrival_date) {
          return new Date(b.arrival_date).getTime() - new Date(a.arrival_date).getTime()
        }
        return 0
      })
  }

  const fetchData = async (state = selectedState, crop = selectedCrop) => {
    setLoading(true)
    setError("")

    try {
      const filters: Record<string, string> = {}

      if (state !== "All States") {
        filters["filters[state]"] = state
      }

      if (crop.trim()) {
        filters["filters[commodity]"] = crop
      }

      const records = await fetchAllData(filters)
      const validatedRecords = validateAndFilterData(records)

      setPriceData(validatedRecords)

      if (validatedRecords.length === 0) {
        setInitialMessage(
          `No records found for ${crop || "selected criteria"} ${state !== "All States" ? `in ${state}` : ""}`,
        )
      } else {
        const stateText = state !== "All States" ? ` in ${state}` : ""
        const cropText = crop.trim() ? ` for ${crop}` : ""
        setInitialMessage(`Found ${validatedRecords.length} records${cropText}${stateText}`)
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      setError("Failed to fetch data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setSelectedState("All States")
    setSelectedCrop("")
    setPriceData([])
    setError("")
    setInitialMessage("Select filters and click Search to view mandi prices.")
  }

  return (
    <div className="bg-gray-100 text-gray-800 min-h-screen">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <SmartSearch
          userLocation={userLocation}
          setUserLocation={setUserLocation}
          apiKey={apiKey}
          apiUrl={apiUrl}
          fetchAllData={fetchAllData}
        />

        <PriceTable
          states={states}
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCrop={selectedCrop}
          setSelectedCrop={setSelectedCrop}
          priceData={priceData}
          loading={loading}
          error={error}
          initialMessage={initialMessage}
          onSearch={() => fetchData()}
          onClear={clearFilters}
        />
      </main>
    </div>
  )
}
