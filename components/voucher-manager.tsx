"use client"
import { useState, useEffect } from "react"
import { VoucherUploader } from "./voucher-uploader"
import { PlusCircle } from "lucide-react"

type VoucherManagerProps = {
  onSelectVoucher: (voucherUrl: string, title: string) => void
}

export function VoucherManager({ onSelectVoucher }: VoucherManagerProps) {
  const [showUploader, setShowUploader] = useState(false)
  const [vouchers, setVouchers] = useState<{ id: string; name: string; url: string }[]>([])

  // Carica i voucher salvati al caricamento del componente
  useEffect(() => {
    const savedVouchers = localStorage.getItem("savedVouchers")
    if (savedVouchers) {
      try {
        setVouchers(JSON.parse(savedVouchers))
      } catch (e) {
        console.error("Errore nel caricamento dei voucher salvati", e)
      }
    }
  }, [])

  // Salva i voucher quando cambiano
  useEffect(() => {
    if (vouchers.length > 0) {
      localStorage.setItem("savedVouchers", JSON.stringify(vouchers))
    }
  }, [vouchers])

  const handleUpload = (file: File) => {
    // Crea un URL per il file caricato
    const fileUrl = URL.createObjectURL(file)

    // Aggiungi il nuovo voucher alla lista
    const newVoucher = {
      id: Date.now().toString(),
      name: file.name,
      url: fileUrl,
    }

    setVouchers((prev) => [...prev, newVoucher])
    setShowUploader(false)
  }

  const handleDelete = (id: string) => {
    setVouchers((prev) => prev.filter((voucher) => voucher.id !== id))
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-5 mb-6">
      <h2 className="text-2xl font-bold text-[#2a4d7f] mb-4">
        📄 <span className="ml-2">I Tuoi Voucher</span>
      </h2>

      {vouchers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">Non hai ancora caricato nessun voucher</p>
          <button
            onClick={() => setShowUploader(true)}
            className="inline-flex items-center px-4 py-2 bg-[#2a4d7f] text-white rounded-md hover:bg-[#2a4d7f]/90 transition-colors"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Carica il tuo primo voucher
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-3 mb-4">
            {vouchers.map((voucher) => (
              <div key={voucher.id} className="flex items-center justify-between p-3 border rounded-lg">
                <button
                  className="flex-1 text-left truncate"
                  onClick={() => onSelectVoucher(voucher.url, voucher.name)}
                >
                  {voucher.name}
                </button>
                <button onClick={() => handleDelete(voucher.id)} className="ml-2 text-red-500 hover:text-red-700">
                  Elimina
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowUploader(true)}
            className="inline-flex items-center px-3 py-1.5 bg-[#2a4d7f] text-white rounded-md hover:bg-[#2a4d7f]/90 transition-colors"
          >
            <PlusCircle className="mr-1 h-4 w-4" />
            Carica nuovo voucher
          </button>
        </>
      )}

      {showUploader && <VoucherUploader onUpload={handleUpload} onClose={() => setShowUploader(false)} />}
    </div>
  )
}
