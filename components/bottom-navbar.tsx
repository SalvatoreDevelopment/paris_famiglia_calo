"use client"

import { useState, useEffect } from "react"
import { Calendar, Home, FileText } from "lucide-react"

type BottomNavbarProps = {
  activeDay: string
  setActiveDay: (day: string) => void
}

export function BottomNavbar({ activeDay, setActiveDay }: BottomNavbarProps) {
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleDayClick = (dayId: string) => {
    setActiveDay(dayId)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e06666]/20 shadow-lg z-10">
      <div className="flex justify-around items-center h-20 max-w-md mx-auto">
        <button
          onClick={() => handleDayClick("all")}
          className={`flex-1 h-full flex flex-col items-center justify-center text-base font-medium ${
            activeDay === "all" ? "text-[#e06666] border-t-2 border-[#e06666]" : "text-[#2a4d7f]"
          }`}
        >
          <Home className="h-6 w-6 mb-1" />
          <span>Tutti</span>
        </button>
        {[
          { id: "day1", label: "Giorno 1" },
          { id: "day2", label: "Giorno 2" },
          { id: "day3", label: "Giorno 3" },
          { id: "day4", label: "Giorno 4" },
        ].map((day) => (
          <button
            key={day.id}
            onClick={() => handleDayClick(day.id)}
            className={`flex-1 h-full flex flex-col items-center justify-center text-base font-medium ${
              activeDay === day.id ? "text-[#e06666] border-t-2 border-[#e06666]" : "text-[#2a4d7f]"
            }`}
          >
            <Calendar className="h-6 w-6 mb-1" />
            <span>{day.label}</span>
          </button>
        ))}
        <button
          onClick={() => handleDayClick("notes")}
          className={`flex-1 h-full flex flex-col items-center justify-center text-base font-medium ${
            activeDay === "notes" ? "text-[#e06666] border-t-2 border-[#e06666]" : "text-[#2a4d7f]"
          }`}
        >
          <FileText className="h-6 w-6 mb-1" />
          <span>Note</span>
        </button>
      </div>
    </nav>
  )
}
