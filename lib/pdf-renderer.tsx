"use client"

import { useState, useEffect, useRef } from "react"
import { FileText } from "lucide-react"
import { Download } from "lucide-react" // Import Download component

// Importa PDF.js solo lato client
let pdfjs: any = null

// Inizializza PDF.js solo lato client
if (typeof window !== "undefined") {
  import("pdfjs-dist").then((module) => {
    pdfjs = module
    // Imposta il worker
    if (!pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
    }
  })
}

type PDFRendererProps = {
  url: string
  currentPage: number
  onTotalPagesChange: (totalPages: number) => void
}

export function PDFRenderer({ url, currentPage, onTotalPagesChange }: PDFRendererProps) {
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)
  const [pageImages, setPageImages] = useState<string[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Carica il PDF e lo converte in immagini
  useEffect(() => {
    // Se PDF.js non è ancora caricato, attendi
    if (!pdfjs) {
      const checkInterval = setInterval(() => {
        if (pdfjs) {
          clearInterval(checkInterval)
          loadPDF()
        }
      }, 100)
      return () => clearInterval(checkInterval)
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

    async function loadPDF() {
      try {
        setLoading(true)

        const loadingTask = pdfjs.getDocument(url)
        const pdf = await loadingTask.promise
        onTotalPagesChange(pdf.numPages)

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
  }, [url, loading, onTotalPagesChange])

  // Download PDF
  const downloadPDF = () => {
    const link = document.createElement("a")
    link.href = url
    link.download = "documento.pdf"
    link.target = "_blank"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-[#2a4d7f] border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-[#2a4d7f] font-medium">Conversione PDF in corso...</p>
        <p className="mt-2 text-gray-500 text-sm">Questo potrebbe richiedere alcuni secondi</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="text-red-500 mb-4">
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
          Si è verificato un errore durante la conversione del PDF in immagine. Puoi provare a scaricare il PDF per
          visualizzarlo.
        </p>
        <button
          onClick={downloadPDF}
          className="w-full max-w-xs px-4 py-2 bg-[#2a4d7f] text-white rounded-lg hover:bg-[#2a4d7f]/90 flex items-center justify-center mb-3"
        >
          <Download className="h-4 w-4 mr-2" />
          Scarica PDF
        </button>
      </div>
    )
  }

  if (pageImages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <div className="bg-gray-200 rounded-full p-6 mb-4">
          <FileText className="h-16 w-16 text-[#2a4d7f]" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Nessuna pagina disponibile</h3>
        <p className="text-gray-600 mb-8">Il PDF sembra essere vuoto o non è stato possibile convertirlo.</p>
        <button
          onClick={downloadPDF}
          className="w-full max-w-xs px-6 py-3 bg-[#2a4d7f] text-white rounded-lg flex items-center justify-center"
        >
          <Download className="h-5 w-5 mr-2" />
          <span>Scarica PDF</span>
        </button>
      </div>
    )
  }

  return (
    <img
      src={pageImages[currentPage - 1] || "/placeholder.svg"}
      alt={`Pagina ${currentPage}`}
      className="max-w-full max-h-full object-contain shadow-lg"
    />
  )
}
