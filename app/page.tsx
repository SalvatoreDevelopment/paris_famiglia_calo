"use client"

import { useState } from "react"
import { DayCard } from "@/components/day-card"
import { BottomNavbar } from "@/components/bottom-navbar"
import { Notes } from "@/components/notes"
import { PdfViewer } from "@/components/pdf-viewer"
import { getDayData } from "@/lib/day-data"
import { VoucherManager } from "@/components/voucher-manager"

export default function Home() {
  const [activeDay, setActiveDay] = useState("all")
  const [currentVoucher, setCurrentVoucher] = useState<{ imageUrl: string; title: string } | null>(null)
  const dayData = getDayData()

  const handleOpenVoucher = (imageUrl: string, title: string) => {
    setCurrentVoucher({ imageUrl, title })
  }

  const handleCloseVoucher = () => {
    setCurrentVoucher(null)
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#f5f0e6]">
      {/* Header */}
      <header className="w-full flex flex-col items-center py-6 px-4 text-center">
        <h1 className="text-3xl font-bold text-[#2a4d7f] mb-2">Viaggio a Parigi – 21/24 Maggio 2025</h1>
        <h2 className="text-xl text-[#e06666] mb-6">Programma per famiglia Calò</h2>
      </header>

      {/* Daily Itinerary */}
      <section className="w-full max-w-md px-4 pb-24">
        {(activeDay === "all" || activeDay === "day1") && (
          <DayCard
            id="day1"
            date="Mercoledì 21 Maggio"
            title="Volo, Arrivo & Free Tour Misteri"
            events={dayData.day1}
            onOpenVoucher={handleOpenVoucher}
          />
        )}

        {(activeDay === "all" || activeDay === "day2") && (
          <DayCard
            id="day2"
            date="Giovedì 22 Maggio"
            title="Montmartre, Louvre e Passeggiata Iconica"
            events={dayData.day2}
            onOpenVoucher={handleOpenVoucher}
          />
        )}

        {(activeDay === "all" || activeDay === "day3") && (
          <DayCard
            id="day3"
            date="Venerdì 23 Maggio"
            title="Quartiere Latino, Torre Eiffel, Crociera"
            events={dayData.day3}
            onOpenVoucher={handleOpenVoucher}
          />
        )}

        {(activeDay === "all" || activeDay === "day4") && (
          <DayCard
            id="day4"
            date="Sabato 24 Maggio"
            title="Passeggiata e ritorno"
            events={dayData.day4}
            onOpenVoucher={handleOpenVoucher}
          />
        )}

        {activeDay === "notes" && (
          <>
            <Notes />
            <VoucherManager onSelectVoucher={handleOpenVoucher} />
          </>
        )}
        {activeDay === "all" && <Notes />}
      </section>

      {/* Bottom Navbar */}
      <BottomNavbar activeDay={activeDay} setActiveDay={setActiveDay} />

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[#2a4d7f] bg-[#f5f0e6] border-t border-[#e06666]/20">
        <p>Creato con amore per mamma e papà ❤️</p>
      </footer>

      {/* Voucher Viewer */}
      {currentVoucher && (
        <PdfViewer imageUrl={currentVoucher.imageUrl} title={currentVoucher.title} onClose={handleCloseVoucher} />
      )}
    </main>
  )
}
