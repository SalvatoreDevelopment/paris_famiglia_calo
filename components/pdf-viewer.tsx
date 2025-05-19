"use client"
import { useState } from "react"
import Image from "next/image"
import { X, ZoomIn, ZoomOut } from "lucide-react"

type PdfViewerProps = {
  imageUrl: string
  title: string
  onClose: () => void
}

export function PdfViewer({ imageUrl, title, onClose }: PdfViewerProps) {
  const [scale, setScale] = useState(1)

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 2.5))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex flex-col items-center justify-center p-4">
      <div className="relative w-full max-w-4xl h-[85vh] bg-white rounded-lg overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="bg-[#2a4d7f] text-white p-3 flex justify-between items-center">
          <h3 className="font-medium truncate">{title}</h3>
          <div className="flex items-center gap-2">
            <button onClick={zoomIn} className="p-1.5 rounded hover:bg-white/20 transition-colors" title="Zoom in">
              <ZoomIn className="h-5 w-5" />
            </button>
            <button onClick={zoomOut} className="p-1.5 rounded hover:bg-white/20 transition-colors" title="Zoom out">
              <ZoomOut className="h-5 w-5" />
            </button>
            <button onClick={onClose} className="p-1.5 rounded hover:bg-white/20 transition-colors ml-2" title="Chiudi">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Image Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 p-4">
          <div
            className="relative flex items-center justify-center min-h-full"
            style={{
              transform: `scale(${scale})`,
              transformOrigin: "center center",
              transition: "transform 0.2s ease",
            }}
          >
            <Image
              src={imageUrl || "/placeholder.svg"}
              alt={`Voucher: ${title}`}
              width={800}
              height={1100}
              className="shadow-lg bg-white"
              style={{ objectFit: "contain" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
