"use client"

import { useState, useEffect } from "react"
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react"

type ImageViewerProps = {
  images: string[] // Array di URL delle immagini
  title: string
  pdfUrl?: string // URL opzionale del PDF originale per il download
  onClose: () => void
}

export function ImageViewer({ images, title, pdfUrl, onClose }: ImageViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = images.length
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [imageError, setImageError] = useState(false)

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

  // Download PDF if available
  const downloadPDF = () => {
    if (pdfUrl) {
      const link = document.createElement("a")
      link.href = pdfUrl
      link.download = title.replace(/\s+/g, "-").toLowerCase() + ".pdf"
      link.target = "_blank"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
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

  // Vai alla pagina precedente
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
      setImageError(false)
    }
  }

  // Vai alla pagina successiva
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
      setImageError(false)
    }
  }

  // Gestione errore immagine
  const handleImageError = () => {
    setImageError(true)
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
          <h2 className="text-lg font-semibold truncate">
            {title} {totalPages > 1 ? `(Pagina ${currentPage}/${totalPages})` : ""}
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          {pdfUrl && (
            <button onClick={downloadPDF} className="p-2 rounded-full hover:bg-white/20" aria-label="Scarica PDF">
              <Download className="h-5 w-5" />
            </button>
          )}
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20" aria-label="Chiudi">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Image Content */}
      <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center">
        <div
          className="relative flex items-center justify-center p-4 w-full h-full"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transformOrigin: "center center",
            transition: "transform 0.3s ease",
          }}
        >
          {imageError ? (
            <div className="flex flex-col items-center justify-center bg-gray-200 p-8 rounded-lg">
              <X className="h-16 w-16 text-red-500 mb-4" />
              <h3 className="text-xl font-bold text-gray-800 mb-2">Immagine non disponibile</h3>
              <p className="text-gray-600 mb-4">
                Non è stato possibile caricare l'immagine. Prova a scaricare il PDF originale.
              </p>
              {pdfUrl && (
                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 bg-[#2a4d7f] text-white rounded-lg flex items-center"
                >
                  <Download className="h-5 w-5 mr-2" />
                  <span>Scarica PDF</span>
                </button>
              )}
            </div>
          ) : (
            <img
              src={images[currentPage - 1] || "/images/vouchers/fallback.png"}
              alt={`${title} - Pagina ${currentPage}`}
              className="max-w-full max-h-full object-contain shadow-lg"
              onError={handleImageError}
            />
          )}

          {/* Pulsanti di navigazione pagina (solo se ci sono più pagine) */}
          {totalPages > 1 && !imageError && (
            <>
              {currentPage > 1 && (
                <button
                  onClick={prevPage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white"
                  aria-label="Pagina precedente"
                >
                  <ChevronLeft className="h-6 w-6 text-[#2a4d7f]" />
                </button>
              )}
              {currentPage < totalPages && (
                <button
                  onClick={nextPage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white/80 rounded-full shadow-lg hover:bg-white"
                  aria-label="Pagina successiva"
                >
                  <ChevronRight className="h-6 w-6 text-[#2a4d7f]" />
                </button>
              )}
            </>
          )}
        </div>
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

      {/* Page navigation (for multi-page PDFs) */}
      {totalPages > 1 && (
        <div className="bg-gray-100 p-2 flex justify-center items-center">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`p-2 rounded-lg ${currentPage === 1 ? "text-gray-400" : "text-[#2a4d7f] hover:bg-gray-200"}`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="mx-4 text-gray-700">
            Pagina {currentPage} di {totalPages}
          </span>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-lg ${
              currentPage === totalPages ? "text-gray-400" : "text-[#2a4d7f] hover:bg-gray-200"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

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
