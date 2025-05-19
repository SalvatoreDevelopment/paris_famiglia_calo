"use client"
import { X, Printer } from "lucide-react"
import Image from "next/image"

type VoucherData = {
  title: string
  code?: string
  date?: string
  time?: string
  location?: string
  meetingPoint?: string
  arrivalTime?: string
  details?: string
  provider?: string
  price?: string
  qrCodeImage?: string // URL dell'immagine del QR code originale
}

type VoucherViewerProps = {
  voucherData: VoucherData
  onClose: () => void
}

export function VoucherViewer({ voucherData, onClose }: VoucherViewerProps) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 print:p-0 print:bg-white">
      <div className="relative w-full max-w-2xl h-[80vh] bg-white rounded-lg overflow-auto print:h-auto print:overflow-visible print:max-w-none print:w-full print:rounded-none">
        <div className="sticky top-0 right-0 z-10 flex justify-end gap-2 p-2 bg-white print:hidden">
          <button
            onClick={handlePrint}
            className="bg-[#2a4d7f] text-white rounded-full p-2 shadow-md hover:bg-[#2a4d7f]/90 transition-colors"
            title="Stampa voucher"
          >
            <Printer className="h-5 w-5" />
          </button>
          <button
            onClick={onClose}
            className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-colors"
            title="Chiudi"
          >
            <X className="h-5 w-5 text-[#2a4d7f]" />
          </button>
        </div>

        <div className="p-8 print:p-4" id="printable-voucher">
          {/* Header */}
          <div className="border-b border-gray-200 pb-4 mb-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-[#2a4d7f]">{voucherData.title}</h2>
                {voucherData.date && <p className="text-lg text-[#e06666]">{voucherData.date}</p>}
              </div>
              <div className="bg-[#e06666] text-white px-3 py-1 rounded-md text-sm font-bold">VOUCHER</div>
            </div>
          </div>

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="relative w-32 h-16 bg-gray-100 rounded flex items-center justify-center">
              <span className="text-gray-500 text-xs">Logo Provider</span>
            </div>
          </div>

          {/* Voucher Details */}
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-bold text-lg mb-3 text-[#2a4d7f]">Dettagli Prenotazione</h3>
            <div className="space-y-2">
              {voucherData.code && (
                <div className="flex justify-between">
                  <span className="font-medium">Codice:</span>
                  <span>{voucherData.code}</span>
                </div>
              )}
              {voucherData.date && (
                <div className="flex justify-between">
                  <span className="font-medium">Data:</span>
                  <span>{voucherData.date}</span>
                </div>
              )}
              {voucherData.time && (
                <div className="flex justify-between">
                  <span className="font-medium">Ora:</span>
                  <span>{voucherData.time}</span>
                </div>
              )}
              {voucherData.provider && (
                <div className="flex justify-between">
                  <span className="font-medium">Fornitore:</span>
                  <span>{voucherData.provider}</span>
                </div>
              )}
              {voucherData.price && (
                <div className="flex justify-between">
                  <span className="font-medium">Prezzo:</span>
                  <span>{voucherData.price}</span>
                </div>
              )}
            </div>
          </div>

          {/* Location Info */}
          {voucherData.location && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 text-[#2a4d7f]">Indirizzo</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p>{voucherData.location}</p>
                {voucherData.meetingPoint && (
                  <div className="mt-2">
                    <span className="font-medium">Punto d'incontro: </span>
                    <span>{voucherData.meetingPoint}</span>
                  </div>
                )}
                {voucherData.arrivalTime && (
                  <div className="mt-2">
                    <span className="font-medium">Arrivo: </span>
                    <span>{voucherData.arrivalTime}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Additional Details */}
          {voucherData.details && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 text-[#2a4d7f]">Informazioni Aggiuntive</h3>
              <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-line">
                <p>{voucherData.details}</p>
              </div>
            </div>
          )}

          {/* QR Code */}
          <div className="flex justify-center mt-8 mb-4">
            <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
              {voucherData.qrCodeImage ? (
                <Image
                  src={voucherData.qrCodeImage || "/placeholder.svg"}
                  alt="QR Code del voucher"
                  width={128}
                  height={128}
                  className="mx-auto"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-100 flex flex-col items-center justify-center text-center p-2">
                  <span className="text-gray-500 text-xs mb-1">QR Code originale</span>
                  <span className="text-gray-500 text-xs">dal PDF del voucher</span>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 mt-6 border-t border-gray-200 pt-4">
            <p>Presentare questo voucher al fornitore del servizio</p>
            <p className="mt-1">Viaggio a Parigi – 21/24 Maggio 2025</p>
          </div>
        </div>
      </div>
    </div>
  )
}
