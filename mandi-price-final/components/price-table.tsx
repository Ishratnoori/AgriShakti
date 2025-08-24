"use client"

import { useState, useEffect } from "react"

interface PriceTableProps {
  states: string[]
  selectedState: string
  setSelectedState: (state: string) => void
  selectedCrop: string
  setSelectedCrop: (crop: string) => void
  priceData: any[]
  loading: boolean
  error: string
  initialMessage: string
  onSearch: () => void
  onClear: () => void
}

export function PriceTable({
  states,
  selectedState,
  setSelectedState,
  selectedCrop,
  setSelectedCrop,
  priceData,
  loading,
  error,
  initialMessage,
  onSearch,
  onClear,
}: PriceTableProps) {
  const [userCoordinates, setUserCoordinates] = useState<{ lat: number; lon: number } | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserCoordinates({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          })
        },
        (error) => {
          console.log("Geolocation error:", error)
        },
      )
    }
  }, [])

  const cityCoordinates: Record<string, { lat: number; lon: number }> = {
    mumbai: { lat: 19.076, lon: 72.8777 },
    pune: { lat: 18.5204, lon: 73.8567 },
    nagpur: { lat: 21.1458, lon: 79.0882 },
    nashik: { lat: 19.9975, lon: 73.7898 },
    aurangabad: { lat: 19.8762, lon: 75.3433 },
    solapur: { lat: 17.6599, lon: 75.9064 },
    amravati: { lat: 20.9374, lon: 77.7796 },
    kolhapur: { lat: 16.705, lon: 74.2433 },
    sangli: { lat: 16.8524, lon: 74.5815 },
    ahmednagar: { lat: 19.0948, lon: 74.748 },
    "chattrapati sambhajinagar": { lat: 19.8762, lon: 75.3433 },
    delhi: { lat: 28.7041, lon: 77.1025 },
    bangalore: { lat: 12.9716, lon: 77.5946 },
    hyderabad: { lat: 17.385, lon: 78.4867 },
    chennai: { lat: 13.0827, lon: 80.2707 },
    kolkata: { lat: 22.5726, lon: 88.3639 },
    ahmedabad: { lat: 23.0225, lon: 72.5714 },
    jaipur: { lat: 26.9124, lon: 75.7873 },
    lucknow: { lat: 26.8467, lon: 80.9462 },
    kanpur: { lat: 26.4499, lon: 80.3319 },
    indore: { lat: 22.7196, lon: 75.8577 },
    bhopal: { lat: 23.2599, lon: 77.4126 },
    patna: { lat: 25.5941, lon: 85.1376 },
    gurgaon: { lat: 28.4595, lon: 77.0266 },
    guwahati: { lat: 26.1445, lon: 91.7362 },
  }

  const stateCoordinates: Record<string, { lat: number; lon: number }> = {
    maharashtra: { lat: 19.7515, lon: 75.7139 },
    "uttar pradesh": { lat: 26.8467, lon: 80.9462 },
    karnataka: { lat: 15.3173, lon: 75.7139 },
    "tamil nadu": { lat: 11.1271, lon: 78.6569 },
    gujarat: { lat: 23.0225, lon: 72.5714 },
    rajasthan: { lat: 27.0238, lon: 74.2179 },
    "madhya pradesh": { lat: 22.9734, lon: 78.6569 },
    "west bengal": { lat: 22.9868, lon: 87.855 },
    bihar: { lat: 25.0961, lon: 85.3131 },
    haryana: { lat: 29.0588, lon: 76.0856 },
  }

  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const getMandiCoordinates = (market: string, state: string): { lat: number; lon: number } | null => {
    const searchKey = market
      .toLowerCase()
      .replace(/[^\w\s]/g, "")
      .trim()

    if (cityCoordinates[searchKey]) {
      return cityCoordinates[searchKey]
    }

    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (searchKey.includes(city) || city.includes(searchKey)) {
        return coords
      }
    }

    const stateKey = state.toLowerCase()
    if (stateCoordinates[stateKey]) {
      return stateCoordinates[stateKey]
    }

    return null
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Live Mandi Crop Prices</h2>

      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label htmlFor="state-filter" className="block text-sm font-medium text-gray-700">
            State:
          </label>
          <select
            id="state-filter"
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
          >
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="crop-filter" className="block text-sm font-medium text-gray-700">
            Crop:
          </label>
          <input
            type="text"
            id="crop-filter"
            placeholder="e.g., Wheat"
            value={selectedCrop}
            onChange={(e) => setSelectedCrop(e.target.value)}
            className="mt-1 block w-full pl-3 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
          />
        </div>

        <button onClick={onSearch} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
          Search
        </button>

        <button onClick={onClear} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">
          Clear
        </button>
      </div>

      <div className="overflow-x-auto">
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600"></div>
          </div>
        )}

        {error && <div className="text-red-500 text-center p-4 bg-red-100 rounded-md mb-4">{error}</div>}

        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mandi Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min Price (₹/Quintal)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Max Price (₹/Quintal)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Modal Price (₹/Quintal)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Distance
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Directions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {priceData.length > 0 ? (
              priceData.map((record, index) => {
                let distance = "N/A"
                let distanceValue = 0

                if (userCoordinates) {
                  const mandiCoords = getMandiCoordinates(record.market, record.state)
                  if (mandiCoords) {
                    distanceValue = calculateDistance(
                      userCoordinates.lat,
                      userCoordinates.lon,
                      mandiCoords.lat,
                      mandiCoords.lon,
                    )
                    distance = `${distanceValue.toFixed(1)} km`
                  }
                }

                const distanceColor =
                  distanceValue < 50 ? "text-green-600" : distanceValue < 200 ? "text-blue-600" : "text-orange-600"

                return (
                  <tr key={`${record.market}-${record.commodity}-${index}`} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{record.market}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{record.commodity}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₹{Number.parseFloat(record.min_price || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      ₹{Number.parseFloat(record.max_price || 0).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-700">
                      ₹{Number.parseFloat(record.modal_price || 0).toLocaleString()}
                    </td>
                    <td className={`px-6 py-4 text-sm font-medium ${distanceColor}`}>{distance}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => {
                          const destination = encodeURIComponent(`${record.market}, ${record.state}, India`)
                          window.open(`https://www.google.com/maps/dir/?api=1&destination=${destination}`, "_blank")
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 rounded-full transition-colors"
                      >
                        🗺️ Directions
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-4 text-gray-500">
                  {initialMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
