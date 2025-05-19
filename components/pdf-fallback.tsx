"use client"

import { ChevronLeft, Download, FileText } from "lucide-react"

type PDFFallbackProps = {
  url: string
  title: string
  onClose: () => void
}

export function PDFFallback({ url, title, onClose }: PDFFallbackProps) {
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
      </div>

      {/* Content */}
      <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-gray-200 rounded-full p-6 mb-4">
          <FileText className="h-16 w-16 text-[#2a4d7f]" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-8">
          Il tuo dispositivo non supporta la visualizzazione diretta dei PDF nell'app.
        </p>
        <p className="text-gray-600 mb-8">Puoi scaricare il PDF per visualizzarlo con un'app esterna.</p>
        <button
          onClick={downloadPDF}
          className="w-full max-w-xs px-6 py-3 bg-[#2a4d7f] text-white rounded-lg flex items-center justify-center mb-4"
        >
          <Download className="h-5 w-5 mr-2" />
          <span>Scarica PDF</span>
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
