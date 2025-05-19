"use client"

import { useState, useEffect, useRef } from "react"
import { X, Download, ChevronLeft, ZoomIn, ZoomOut, RotateCw } from "lucide-react"

type PDFViewerProps = {
  url: string
  title: string
  onClose: () => void
}

export function PDFViewer({ url, title, onClose }: PDFViewerProps) {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Check if we're on a mobile device - improved detection
  useEffect(() => {
    const checkMobile = () => {
      // More comprehensive mobile detection
      const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera
      const isMobileDevice =
        /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|tablet|iPad|Android/i.test(
          userAgent.toLowerCase(),
        ) || window.innerWidth <= 768

      console.log("Device detection:", { userAgent, isMobileDevice, width: window.innerWidth })
      setIsMobile(isMobileDevice)
    }

    checkMobile()

    // Add resize listener to detect orientation changes
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Add loading timeout
  useEffect(() => {
    // Set a timeout to stop the loading indicator after 5 seconds
    loadingTimeoutRef.current = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout reached")
        setLoading(false)
      }
    }, 5000)

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [loading])

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
    console.log("Iframe error detected")
    setLoadError(true)
    setLoading(false)
  }

  // Handle iframe load success
  const handleIframeLoad = () => {
    console.log("Iframe loaded successfully")
    setLoading(false)
  }

  // Zoom in
  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3))
  }

  // Zoom out
  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }

  // Rotate
  const rotate = () => {
    setRotation((prev) => (prev + 90) % 360)
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
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20" aria-label="Chiudi">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* PDF Content */}
      <div className="flex-1 bg-gray-100 overflow-auto">
        {loading && !loadError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-[#2a4d7f] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-[#2a4d7f] font-medium">Caricamento PDF...</p>
            </div>
          </div>
        )}

        {loadError ? (
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
              <button
                onClick={onClose}
                className="w-full px-4 py-2 bg-[#2a4d7f] text-white rounded-lg hover:bg-[#2a4d7f]/90 flex items-center justify-center"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Torna all'itinerario
              </button>
            </div>
          </div>
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              transform: `scale(${scale}) rotate(${rotation}deg)`,
              transformOrigin: "center center",
              transition: "transform 0.3s ease",
            }}
          >
            <iframe
              ref={iframeRef}
              src={`${url}#toolbar=0&navpanes=0&view=FitH`}
              className="w-full h-full"
              onLoad={handleIframeLoad}
              onError={handleIframeError}
              title={title}
              style={{ border: "none" }}
            />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="bg-gray-200 p-2 flex justify-center items-center space-x-4">
        <button
          onClick={zoomOut}
          className="p-2 rounded-full bg-white text-[#2a4d7f] hover:bg-gray-100"
          aria-label="Zoom out"
        >
          <ZoomOut className="h-5 w-5" />
        </button>
        <button
          onClick={zoomIn}
          className="p-2 rounded-full bg-white text-[#2a4d7f] hover:bg-gray-100"
          aria-label="Zoom in"
        >
          <ZoomIn className="h-5 w-5" />
        </button>
        <button
          onClick={rotate}
          className="p-2 rounded-full bg-white text-[#2a4d7f] hover:bg-gray-100"
          aria-label="Rotate"
        >
          <RotateCw className="h-5 w-5" />
        </button>
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
