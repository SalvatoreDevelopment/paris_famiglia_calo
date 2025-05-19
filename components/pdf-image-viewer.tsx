"use client"

import { useState, useEffect, useRef } from "react"
import { X, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCw } from "lucide-react"
import * as pdfjs from "pdfjs-dist"

// Inizializza PDF.js
// @ts-ignore
if (typeof window !== "undefined" && !pdfjs.GlobalWorkerOptions.workerSrc) {
  // @ts-ignore
  pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
}

type PDFImageViewerProps = {
  url: string
  title: string
  onClose: () => void
}

export function PDFImageViewer({ url, title, onClose }: PDFImageViewerProps) {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [pageImages, setPageImages] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Carica il PDF e lo converte in immagini
  useEffect(() => {
    const loadPDF = async () => {
      try {
        setLoading(true)

        // @ts-ignore
        const loadingTask = pdfjs.getDocument(url)
        const pdf = await loadingTask.promise
        setTotalPages(pdf.numPages)

        const images: string[] = []

        // Renderizza ogni pagina come immagine
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i)
          const viewport = page.getViewport({ scale: 1.5 }) // Scala più alta per migliore qualità

          // Crea un canvas per renderizzare la pagina
          const canvas = document.createElement("canvas")
          const context = canvas.getContext("2d")
          canvas.height = viewport.height
          canvas.width = viewport.width

          // Renderizza la pagina sul canvas
          await page.render({
            canvasContext: context!,
            viewport: viewport,
          }).promise

          // Converti il canvas in un'immagine
          const imageUrl = canvas.toDataURL("image/jpeg", 0.8)
          images.push(imageUrl)
        }

        setPageImages(images)
        setLoading(false)
      } catch (error) {
        console.error("Errore durante il caricamento del PDF:", error)
        setLoadError(true)
        setLoading(false)
      }
    }

    loadPDF()

    // Imposta un timeout per il caricamento
    loadingTimeoutRef.current = setTimeout(() => {
      if (loading) {
        console.log("Loading timeout reached")
        setLoadError(true)
        setLoading(false)
      }
    }, 15000) // Timeout più lungo per la conversione

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current)
      }
    }
  }, [url, loading])

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
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
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
    }
  }

  // Vai alla pagina successiva
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
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
          <button onClick={downloadPDF} className="p-2 rounded-full hover:bg-white/20" aria-label="Scarica PDF">
            <Download className="h-5 w-5" />
          </button>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/20" aria-label="Chiudi">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* PDF Content as Images */}
      <div className="flex-1 bg-gray-100 overflow-auto flex items-center justify-center">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-[#2a4d7f] border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4 text-[#2a4d7f] font-medium">Conversione PDF in corso...</p>
              <p className="mt-2 text-gray-500 text-sm">Questo potrebbe richiedere alcuni secondi</p>
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
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Impossibile convertire il PDF</h3>
              <p className="text-gray-600 mb-6">
                Si è verificato un errore durante la conversione del PDF in immagine. Puoi provare a scaricare il PDF
                per visualizzarlo.
              </p>
              <button
                onClick={downloadPDF}
                className="w-full px-4 py-2 bg-[#2a4d7f] text-white rounded-lg hover:bg-[#2a4d7f]/90 flex items-center justify-center mb-3"
              >
                <Download className="h-4 w-4 mr-2" />
                Scarica PDF
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
        ) : (
          !loading &&
          pageImages.length > 0 && (
            <div
              className="relative flex items-center justify-center p-4"
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transformOrigin: "center center",
                transition: "transform 0.3s ease",
              }}
            >
              <img
                src={pageImages[currentPage - 1] || "/placeholder.svg"}
                alt={`${title} - Pagina ${currentPage}`}
                className="max-w-full max-h-full object-contain shadow-lg"
              />

              {/* Pulsanti di navigazione pagina (solo se ci sono più pagine) */}
              {totalPages > 1 && (
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
          )
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
