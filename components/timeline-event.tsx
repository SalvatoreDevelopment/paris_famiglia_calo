"use client"
import { useState } from "react"
import { ChevronDown, ChevronUp, Map, ExternalLink } from "lucide-react"

type TimelineEventProps = {
  time: string
  emoji: string
  description: string
  voucher?: {
    text: string
    url?: string
    handleVoucher?: () => void
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

  return (
    <div className="flex">
      <div className="flex flex-col items-center mr-4">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#2a4d7f] text-white">
          {time.split(":")[0]}
        </div>
        {!isLast && <div className="w-0.5 h-full bg-[#2a4d7f]/20 mt-2"></div>}
      </div>
      <div className="flex-1">
        <div className="text-lg">
          <span className="mr-2">{emoji}</span>
          <span className="font-medium">{description}</span>
        </div>
        {voucher && (
          <div className="mt-1">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`inline-flex items-center px-3 py-1.5 ${
                  isTransport ? "bg-[#2a4d7f]/10 text-[#2a4d7f]" : "bg-[#e06666]/10 text-[#e06666]"
                } rounded-lg text-sm font-medium hover:bg-opacity-20 transition-colors`}
              >
                {isTransport ? <Map className="mr-1 h-4 w-4" /> : "📄"} {voucher.text}
                {showDetails ? <ChevronUp className="ml-1 h-4 w-4" /> : <ChevronDown className="ml-1 h-4 w-4" />}
              </button>

              {voucher.url && voucher.url !== "#" && !isFlightVoucher && (
                <a
                  href={voucher.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 bg-[#2a4d7f] text-white rounded-lg text-sm font-medium hover:bg-[#2a4d7f]/90 transition-colors"
                >
                  <ExternalLink className="mr-1 h-4 w-4" /> Apri PDF
                </a>
              )}
            </div>

            {showDetails && (
              <div className="mt-2 p-3 bg-[#f5f0e6] rounded-lg text-sm whitespace-pre-line">
                {voucher.meetingPoint && (
                  <p className="mb-1">
                    <span className="font-semibold">Punto d'incontro:</span> {voucher.meetingPoint}
                  </p>
                )}
                {voucher.arrivalTime && (
                  <p className="mb-1">
                    <span className="font-semibold">Arrivo:</span> {voucher.arrivalTime}
                  </p>
                )}
                {voucher.details && (
                  <div className="mb-1">
                    <span className="font-semibold">Dettagli:</span>
                    <div className="mt-1">{voucher.details}</div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
