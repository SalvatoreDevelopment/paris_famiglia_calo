"use client"

import { useState, useEffect } from "react"
import { X, Download, ExternalLink, ChevronLeft, FileText } from "lucide-react"

type PDFViewerProps = {
  url: string
  title: string
  onClose: () => void
}

export function PDFViewer({ url, title, onClose }: PDFViewerProps) {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if we're on a mobile device
  useEffect(() => {
    const checkMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(
        userAgent.toLowerCase(),
      )
      setIsMobile(isMobileDevice)
    }

    checkMobile()
  }, [])

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

  // Handle iframe load error
  const handleIframeError = () => {
    setLoadError(true)
    setLoading(false)
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
        {loading && !loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-[#2a4d7f] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-[#2a4d7f] font-medium">Caricamento PDF...</p>
            </div>
          </div>
        )}

        {/* Mobile PDF View */}
        {isMobile ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <div className="bg-gray-200 rounded-full p-6 mb-4">
              <FileText className="h-16 w-16 text-[#2a4d7f]" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
            <p className="text-gray-600 mb-8">Il file PDF è pronto per essere visualizzato o scaricato.</p>
            <div className="flex flex-col w-full space-y-3">
              <button
                onClick={openInNewTab}
                className="w-full px-6 py-3 bg-[#2a4d7f] text-white rounded-lg flex items-center justify-center"
              >
                <ExternalLink className="h-5 w-5 mr-2" />
                <span>Apri PDF</span>
              </button>
              <button
                onClick={downloadPDF}
                className="w-full px-6 py-3 bg-[#e06666] text-white rounded-lg flex items-center justify-center"
              >
                <Download className="h-5 w-5 mr-2" />
                <span>Scarica PDF</span>
              </button>
            </div>
          </div>
        ) : // Desktop PDF View
        loadError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="max-w-md p-6 text-center">
              <div className="text-red-500 mb-4 flex justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Impossibile caricare il PDF</h3>
              <p className="text-gray-600 mb-6">
                Il file PDF non è disponibile o si è verificato un errore durante il caricamento. Assicurati che il file
                sia presente nella cartella /pdfs/.
              </p>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={openInNewTab}
                  className="w-full px-4 py-2 bg-[#2a4d7f] text-white rounded-lg hover:bg-[#2a4d7f]/90 flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Prova ad aprire in una nuova scheda
                </button>
                <button
                  onClick={onClose}
                  className="w-full px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 flex items-center justify-center"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Torna all'itinerario
                </button>
              </div>
            </div>
          </div>
        ) : (
          <iframe
            src={`${url}#toolbar=0&navpanes=0`}
            className="w-full h-full"
            onLoad={() => setLoading(false)}
            onError={handleIframeError}
            title={title}
          />
        )}
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
