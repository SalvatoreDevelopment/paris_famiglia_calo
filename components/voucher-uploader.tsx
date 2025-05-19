"use client"
import { useState, useRef } from "react"
import type React from "react"

import { Upload, X } from "lucide-react"

type VoucherUploaderProps = {
  onUpload: (file: File) => void
  onClose: () => void
}

export function VoucherUploader({ onUpload, onClose }: VoucherUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.type === "application/pdf") {
        onUpload(file)
      } else {
        alert("Per favore carica un file PDF")
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      if (file.type === "application/pdf") {
        onUpload(file)
      } else {
        alert("Per favore carica un file PDF")
      }
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-lg p-6">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-xl font-bold text-[#2a4d7f] mb-4">Carica PDF Voucher</h2>

        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            dragActive ? "border-[#2a4d7f] bg-[#2a4d7f]/5" : "border-gray-300"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="mb-2 text-sm text-gray-500">
            <span className="font-semibold">Clicca per caricare</span> o trascina qui il file
          </p>
          <p className="text-xs text-gray-500 mb-4">Solo PDF (max 10MB)</p>

          <input ref={inputRef} type="file" className="hidden" accept="application/pdf" onChange={handleChange} />

          <button
            onClick={handleButtonClick}
            className="px-4 py-2 bg-[#2a4d7f] text-white rounded-md hover:bg-[#2a4d7f]/90 transition-colors"
          >
            Seleziona file
          </button>
        </div>

        <p className="mt-4 text-sm text-gray-500 text-center">
          I PDF caricati saranno disponibili solo su questo dispositivo
        </p>
      </div>
    </div>
  )
}
