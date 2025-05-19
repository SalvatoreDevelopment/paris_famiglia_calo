"use client"

import { useState, useEffect } from "react"
import { X, Download, ExternalLink, ChevronLeft } from "lucide-react"

type PDFViewerProps = {
  url: string
  title: string
  onClose: () => void
}

export function PDFViewer({ url, title, onClose }: PDFViewerProps) {
  const [loading, setLoading] = useState(true)

  // Handle escape key to close the viewer
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  // Open in new tab
  const openInNewTab = () => {
    window.open(url, "_blank")
  }

  // Download PDF
  const downloadPDF = () => {
    const link = document.createElement("a")
    link.href = url
    link.download = title.replace(/\s+/g, "-").toLowerCase() + ".pdf"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex flex-col">
      {/* Header */}
      <div className="bg-[#2a4d7f] text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={onClose}
            className="mr-3 p-1 rounded-full hover:bg-white/20 flex items-center justify-center"
            aria-label="Torna indietro"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold truncate">{title}</h2>
        </div>
        <div className="flex items-center space-x-2">
          <button onClick={downloadPDF} className="p-2 rounded-full hover:bg-white/20" aria-label="Scarica PDF">
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={openInNewTab}
            className="p-2 rounded-full hover:bg-white/20"
            aria-label="Apri in nuova scheda"
          >
            <ExternalLink className="h-5 w-5" />
          </button>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20" aria-label="Chiudi">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 bg-gray-100 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-[#2a4d7f] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-[#2a4d7f] font-medium">Caricamento PDF...</p>
            </div>
          </div>
        )}
        <iframe
          src={`${url}#toolbar=0&navpanes=0`}
          className="w-full h-full"
          onLoad={() => setLoading(false)}
          title={title}
        />
      </div>

      {/* Bottom bar with back button */}
      <div className="bg-white p-3 flex justify-center">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-[#2a4d7f] text-white rounded-lg flex items-center hover:bg-[#2a4d7f]/90"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          <span>Torna all'itinerario</span>
        </button>
      </div>
    </div>
  )
}
