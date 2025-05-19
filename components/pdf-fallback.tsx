"use client"

import { FileText, AlertTriangle, ChevronLeft } from "lucide-react"

type PDFFallbackProps = {
  title: string
  onClose: () => void
}

export function PDFFallback({ title, onClose }: PDFFallbackProps) {
  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="flex flex-col items-center text-center">
          <div className="bg-yellow-100 p-3 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-yellow-600" />
          </div>

          <h2 className="text-xl font-bold text-gray-800 mb-2">PDF non disponibile</h2>

          <div className="mb-6">
            <p className="text-gray-600 mb-2">Il file PDF "{title}" non è stato trovato nella cartella /pdfs/.</p>
            <p className="text-gray-600">
              Assicurati di aver caricato tutti i PDF necessari come indicato nel file README.
            </p>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg w-full mb-6 text-left">
            <h3 className="font-medium text-gray-800 mb-2 flex items-center">
              <FileText className="h-4 w-4 mr-2" />
              <span>Istruzioni:</span>
            </h3>
            <ol className="list-decimal pl-5 text-sm text-gray-700 space-y-1">
              <li>Crea una cartella "pdfs" nella directory "public"</li>
              <li>Aggiungi i file PDF dei voucher nella cartella</li>
              <li>Assicurati che i nomi dei file corrispondano a quelli richiesti</li>
              <li>Ricarica l'applicazione</li>
            </ol>
          </div>

          <button
            onClick={onClose}
            className="w-full py-2 bg-[#2a4d7f] text-white rounded-lg flex items-center justify-center"
          >
            <ChevronLeft className="h-5 w-5 mr-1" />
            <span>Torna all'itinerario</span>
          </button>
        </div>
      </div>
    </div>
  )
}
