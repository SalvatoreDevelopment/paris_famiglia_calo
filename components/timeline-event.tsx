"use client"

import { useState } from "react"
import { ChevronDown, ChevronUp, MapPin, Clock, ExternalLink, FileText, Map } from "lucide-react"
import { PDFImageViewer } from "./pdf-image-viewer"

type VoucherProps = {
  text?: string
  url?: string
  details?: string
  meetingPoint?: string
  arrivalTime?: string
  title?: string
}

type TransportationProps = {
  type: "metro" | "walk" | "bus" | "shuttle"
  details: string
  duration: string
  destination?: string
}

type TimelineEventProps = {
  time: string
  emoji: string
  description: string
  voucher?: VoucherProps
  transportation?: TransportationProps
  isLast?: boolean
  isCurrentActivity?: boolean
}

export function TimelineEvent({
  time,
  emoji,
  description,
  voucher,
  transportation,
  isLast = false,
  isCurrentActivity = false,
}: TimelineEventProps) {
  const [expanded, setExpanded] = useState(false)
  const [showPDF, setShowPDF] = useState(false)

  // Function to open Google Maps with walking directions
  const openWalkingDirections = () => {
    // Extract destination from description or transportation
    const destination = transportation?.destination || description.split(" - ")[1] || description
    const encodedDestination = encodeURIComponent(`${destination}, Paris, France`)
    window.open(`https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${encodedDestination}`, "_blank")
  }

  // Function to open Google Maps with transit directions
  const openTransitDirections = () => {
    // Extract destination from description or transportation
    const destination = transportation?.destination || description.split(" - ")[1] || description
    const encodedDestination = encodeURIComponent(`${destination}, Paris, France`)
    window.open(`https://www.google.com/maps/dir/?api=1&travelmode=transit&destination=${encodedDestination}`, "_blank")
  }

  // Function to find nearest metro station
  const findNearestMetro = () => {
    window.open("https://www.google.com/maps/search/metro+station+near+me", "_blank")
  }

  // Function to handle voucher click
  const handleVoucherClick = () => {
    if (voucher?.url) {
      setShowPDF(true)
    }
  }

  return (
    <div
      className={`relative ${isLast ? "" : "pb-6"} ${isCurrentActivity ? "bg-[#2a4d7f]/5 -mx-4 px-4 py-3 rounded-lg border border-[#2a4d7f]/20" : ""}`}
    >
      {/* Timeline connector */}
      {!isLast && <div className="absolute left-[22px] top-[44px] bottom-0 w-[2px] bg-[#2a4d7f]/20"></div>}

      <div className="flex items-start">
        {/* Time and emoji circle */}
        <div className="flex flex-col items-center mr-4">
          <div className="text-sm font-medium text-[#2a4d7f] mb-1">{time}</div>
          <div
            className={`flex items-center justify-center w-11 h-11 rounded-full bg-white border-2 ${
              isCurrentActivity ? "border-[#e06666]" : "border-[#2a4d7f]"
            } z-10`}
          >
            <span className="text-xl">{emoji}</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div
            className={`font-medium ${isCurrentActivity ? "text-[#e06666]" : "text-[#2a4d7f]"} cursor-pointer`}
            onClick={() => setExpanded(!expanded)}
          >
            <div className="flex justify-between items-center">
              <div>{description}</div>
              {(voucher || transportation) && (
                <button className="ml-2 text-gray-500">
                  {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
              )}
            </div>
          </div>

          {/* Expanded details */}
          {expanded && (
            <div className="mt-3 space-y-4">
              {/* Transportation details */}
              {transportation && (
                <div className="bg-[#2a4d7f]/5 p-3 rounded-lg">
                  <div className="flex items-center text-[#2a4d7f] font-medium mb-2">
                    {transportation.type === "metro" && <span className="mr-2">🚇</span>}
                    {transportation.type === "walk" && <span className="mr-2">🚶</span>}
                    {transportation.type === "bus" && <span className="mr-2">🚌</span>}
                    {transportation.type === "shuttle" && <span className="mr-2">🚐</span>}
                    <span>Spostamento:</span>
                  </div>
                  <p className="text-gray-700 mb-2">{transportation.details}</p>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>Durata: {transportation.duration}</span>
                  </div>

                  {/* Transportation buttons */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={openWalkingDirections}
                      className="flex items-center px-3 py-2 bg-[#2a4d7f] text-white text-sm rounded-lg hover:bg-[#2a4d7f]/90"
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Indicazioni a piedi</span>
                    </button>
                    <button
                      onClick={openTransitDirections}
                      className="flex items-center px-3 py-2 bg-[#2a4d7f] text-white text-sm rounded-lg hover:bg-[#2a4d7f]/90"
                    >
                      <Map className="h-4 w-4 mr-1" />
                      <span>Indicazioni trasporto</span>
                    </button>
                    <button
                      onClick={findNearestMetro}
                      className="flex items-center px-3 py-2 bg-[#2a4d7f] text-white text-sm rounded-lg hover:bg-[#2a4d7f]/90"
                    >
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>Trova stazione metro</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Voucher details */}
              {voucher && (
                <div className="bg-[#e06666]/5 p-3 rounded-lg border border-[#e06666]/20">
                  <div className="flex items-center text-[#e06666] font-medium mb-2">
                    <FileText className="h-4 w-4 mr-1" />
                    <span>{voucher.details ? "Dettagli voucher:" : "Voucher disponibile"}</span>
                  </div>

                  {voucher.details && <p className="text-gray-700 whitespace-pre-line mb-3">{voucher.details}</p>}

                  {voucher.meetingPoint && (
                    <div className="mb-3">
                      <div className="text-gray-700 font-medium">Punto d'incontro:</div>
                      <p className="text-gray-600">{voucher.meetingPoint}</p>
                    </div>
                  )}

                  {voucher.arrivalTime && (
                    <div className="mb-3">
                      <div className="text-gray-700 font-medium">Orario di arrivo consigliato:</div>
                      <p className="text-gray-600">{voucher.arrivalTime}</p>
                    </div>
                  )}

                  {voucher.url && voucher.text && (
                    <button
                      onClick={handleVoucherClick}
                      className="flex items-center px-3 py-2 bg-[#e06666] text-white text-sm rounded-lg hover:bg-[#e06666]/90"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
                      <span>{voucher.text}</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* PDF Image Viewer */}
      {showPDF && voucher?.url && (
        <PDFImageViewer url={voucher.url} title={voucher.title || description} onClose={() => setShowPDF(false)} />
      )}
    </div>
  )
}
