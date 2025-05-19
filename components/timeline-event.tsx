"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp, Map, ExternalLink, Navigation, Train } from "lucide-react"

type TimelineEventProps = {
  time: string
  emoji: string
  description: string
  voucher?: {
    text: string
    url?: string
    details?: string
    meetingPoint?: string
    arrivalTime?: string
  }
  isLast: boolean
}

export function TimelineEvent({ time, emoji, description, voucher, isLast }: TimelineEventProps) {
  const [showDetails, setShowDetails] = useState(false)

  // Determina se il voucher contiene informazioni di trasporto
  const isTransport = voucher?.text?.includes("Metro") || voucher?.text?.includes("Trasporto")

  // Determina se è un voucher di volo
  const isFlightVoucher = voucher?.text?.includes("Volo") || voucher?.text?.includes("volo")

  // Determina se è uno spostamento a piedi o un trasporto
  const isWalking = emoji === "🚶" || emoji === "🚶‍♂️" || description.toLowerCase().includes("passeggiata")
  const isTransportation =
    emoji === "🚌" ||
    emoji === "🚇" ||
    emoji === "🚕" ||
    description.toLowerCase().includes("navetta") ||
    description.toLowerCase().includes("trasferimento") ||
    description.toLowerCase().includes("spostamento")

  // Determina se l'evento coinvolge l'uso della metro
  const involvesMetro =
    description.toLowerCase().includes("metro") ||
    (voucher?.details && voucher.details.toLowerCase().includes("metro")) ||
    (voucher?.details &&
      (voucher.details.includes("M1") ||
        voucher.details.includes("M2") ||
        voucher.details.includes("M3") ||
        voucher.details.includes("M4") ||
        voucher.details.includes("M5") ||
        voucher.details.includes("M6") ||
        voucher.details.includes("M7") ||
        voucher.details.includes("M8") ||
        voucher.details.includes("M9") ||
        voucher.details.includes("M10") ||
        voucher.details.includes("M11") ||
        voucher.details.includes("M12") ||
        voucher.details.includes("M13") ||
        voucher.details.includes("M14")))

  // Determina se mostrare Google Maps
  const showGoogleMaps = isWalking || isTransportation

  // Determina se è un'attività organizzata (tour, visita guidata, ecc.)
  const isOrganizedActivity =
    description.toLowerCase().includes("tour") ||
    description.toLowerCase().includes("visita") ||
    description.toLowerCase().includes("crociera") ||
    description.toLowerCase().includes("museo")

  // Estrae la stazione della metro di partenza o arrivo, se presente
  const extractMetroStation = () => {
    const detailsText = voucher?.details || ""

    // Cerca pattern come "Metro 14 da X a Y" o "Metro 12 → X"
    if (detailsText.includes("Metro 14 da")) {
      return detailsText.split("Metro 14 da ")[1].split(" a ")[0]
    } else if (detailsText.includes("Metro 12 →")) {
      return detailsText.split("Metro 12 →")[1].split(",")[0].trim()
    } else if (detailsText.includes("Metro 14 →")) {
      return detailsText.split("Metro 14 →")[1].split(",")[0].trim()
    } else if (detailsText.includes("Metro 1 →")) {
      return detailsText.split("Metro 1 →")[1].split(",")[0].trim()
    }

    return ""
  }

  // Costruisce l'URL di Google Maps per la destinazione
  const getGoogleMapsUrl = () => {
    let destination = ""
    let travelMode = isWalking ? "walking" : "transit"

    // Gestione speciale per luoghi specifici
    if (description.includes("Louvre")) {
      destination = "Musée du Louvre, Paris, France"
    } else if (description.includes("Torre Eiffel")) {
      destination = "Tour Eiffel, Paris, France"
    } else if (description.includes("Montmartre")) {
      destination = "Montmartre, Paris, France"
    } else if (description.includes("Quartiere Latino")) {
      destination = "Quartier Latin, Paris, France"
    } else if (description.includes("Champs-Élysées")) {
      destination = "Champs-Élysées, Paris, France"
    } else if (description.includes("aeroporto")) {
      destination = "Paris Beauvais Airport, France"
      travelMode = "transit"
    } else if (voucher?.meetingPoint) {
      destination = voucher.meetingPoint + ", Paris, France"
    } else if (description.includes("per ")) {
      destination = description.split("per ")[1] + ", Paris, France"
    } else if (description.includes("verso ")) {
      destination = description.split("verso ")[1] + ", Paris, France"
    } else {
      // Usa una destinazione generica se non riesce a estrarre dal testo
      destination = "Paris, France"
    }

    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=${travelMode}`
  }

  // Costruisce l'URL di Google Maps per trovare la stazione della metro più vicina
  const getMetroStationUrl = () => {
    const metroStation = extractMetroStation()

    if (metroStation) {
      // Se abbiamo identificato una stazione specifica
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`Metro ${metroStation} Paris France`)}`
    } else {
      // Cerca genericamente stazioni della metro nelle vicinanze
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Metro station Paris France")}`
    }
  }

  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#2a4d7f] text-white text-base font-bold">
          {time}
        </div>
        {!isLast && <div className="w-0.5 h-full bg-[#2a4d7f]/20 mt-2"></div>}
      </div>
      <div className="flex-1">
        <div className="text-xl">
          <span className="mr-2">{emoji}</span>
          <span className="font-medium">{description}</span>
        </div>
        <div className="mt-2">
          <div className="flex flex-wrap gap-3">
            {showGoogleMaps && (
              <a
                href={getGoogleMapsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-[#2a4d7f] text-white rounded-lg text-base font-medium hover:opacity-90 transition-colors"
              >
                <Navigation className="mr-2 h-5 w-5" />
                {isWalking ? "Indicazioni a piedi" : "Indicazioni trasporto"}
              </a>
            )}

            {involvesMetro && (
              <a
                href={getMetroStationUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-[#e06666] text-white rounded-lg text-base font-medium hover:opacity-90 transition-colors"
              >
                <Train className="mr-2 h-5 w-5" /> Trova stazione metro
              </a>
            )}

            {voucher && (
              <>
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="inline-flex items-center px-4 py-2 bg-[#f5f0e6] text-[#2a4d7f] border border-[#2a4d7f]/30 rounded-lg text-base font-medium hover:bg-[#f5f0e6]/70 transition-colors"
                >
                  {isTransport ? <Map className="mr-2 h-5 w-5" /> : "📄"} {voucher.text}
                  {showDetails ? <ChevronUp className="ml-2 h-5 w-5" /> : <ChevronDown className="ml-2 h-5 w-5" />}
                </button>

                {voucher.url && voucher.url !== "#" && !isFlightVoucher && (
                  <a
                    href={voucher.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 bg-[#2a4d7f] text-white rounded-lg text-base font-medium hover:bg-[#2a4d7f]/90 transition-colors"
                  >
                    <ExternalLink className="mr-2 h-5 w-5" /> Apri PDF voucher
                  </a>
                )}
              </>
            )}
          </div>

          {voucher && showDetails && (
            <div className="mt-3 p-4 bg-[#f5f0e6] rounded-lg text-base whitespace-pre-line border border-[#2a4d7f]/20">
              {voucher.meetingPoint && isOrganizedActivity && (
                <p className="mb-2">
                  <span className="font-semibold">Punto d'incontro:</span> {voucher.meetingPoint}
                </p>
              )}
              {voucher.arrivalTime && (
                <p className="mb-2">
                  <span className="font-semibold">Arrivo:</span> {voucher.arrivalTime}
                </p>
              )}
              {voucher.details && (
                <div className="mb-2">
                  <span className="font-semibold">Dettagli:</span>
                  <div className="mt-1">{voucher.details}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
