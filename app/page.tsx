"use client"

import { useState, useEffect, useCallback } from "react"
import { DayCard } from "../components/day-card"
import { BottomNavbar } from "../components/bottom-navbar"
import { Notes } from "../components/notes"
import { SosButton } from "../components/sos-button"
import { CurrentActivityIndicator } from "../components/current-activity-indicator"
import { getDayData } from "../lib/day-data"
import { Info } from "lucide-react"

export default function Home() {
  const [activeDay, setActiveDay] = useState("all")
  const [showHelp, setShowHelp] = useState(true)
  const [currentActivity, setCurrentActivity] = useState<{
    day: string
    time: string
    description: string
  } | null>(null)

  // Get day data once, not on every render
  const dayData = getDayData()

  // Define getCurrentActivity as a memoized function to prevent recreating it on every render
  const getCurrentActivity = useCallback(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMinute = now.getMinutes()
    const currentTimeValue = currentHour * 60 + currentMinute

    // For testing purposes, use the current date to determine which day to simulate
    const today = now.getDate()
    let currentDay = ""

    if (today % 4 === 0) {
      currentDay = "day1"
    } else if (today % 4 === 1) {
      currentDay = "day2"
    } else if (today % 4 === 2) {
      currentDay = "day3"
    } else {
      currentDay = "day4"
    }

    const events = dayData[currentDay]

    // Convert event times to minutes for easier comparison
    const eventsWithTimeValue = events.map((event) => {
      const [hours, minutes] = event.time.split(":").map(Number)
      return {
        ...event,
        timeValue: hours * 60 + minutes,
      }
    })

    // Sort events by time
    eventsWithTimeValue.sort((a, b) => a.timeValue - b.timeValue)

    // Find the current event (the last event that has started)
    for (let i = eventsWithTimeValue.length - 1; i >= 0; i--) {
      if (eventsWithTimeValue[i].timeValue <= currentTimeValue) {
        return {
          day: currentDay,
          time: eventsWithTimeValue[i].time,
          description: eventsWithTimeValue[i].description,
        }
      }
    }

    // If we haven't found a current event, return null
    return null
  }, [dayData]) // Only recreate if dayData changes

  // Effect to update the current activity
  useEffect(() => {
    // Set initial current activity
    setCurrentActivity(getCurrentActivity())

    // Update current activity every minute
    const interval = setInterval(() => {
      setCurrentActivity(getCurrentActivity())
    }, 60000)

    return () => clearInterval(interval)
  }, [getCurrentActivity]) // Only run when getCurrentActivity changes

  // Calculate top padding based on the presence of the current activity indicator
  const contentPaddingTop = currentActivity ? "pt-28" : "pt-0"

  return (
    <main className={`flex min-h-screen flex-col items-center bg-[#f5f0e6] ${contentPaddingTop}`}>
      {/* Current activity indicator */}
      <CurrentActivityIndicator />

      {/* Header */}
      <header className="w-full flex flex-col items-center py-6 px-4 text-center">
        <h1 className="text-3xl font-bold text-[#2a4d7f] mb-2">Viaggio a Parigi – 21/24 Maggio 2025</h1>
        <h2 className="text-xl text-[#e06666] mb-6">Programma per famiglia Calò</h2>
      </header>

      {/* Usage guide */}
      {showHelp && (
        <div className="w-full max-w-md px-4 mb-6">
          <div className="bg-[#2a4d7f]/10 border border-[#2a4d7f]/30 rounded-xl p-5">
            <div className="flex items-start mb-3">
              <div className="bg-[#2a4d7f] text-white p-2 rounded-full mr-3">
                <Info size={24} />
              </div>
              <h3 className="text-xl font-bold text-[#2a4d7f]">Come usare questa guida</h3>
            </div>

            <ul className="space-y-3 text-[#2a4d7f]">
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span>Usa i pulsanti in basso per navigare tra i giorni del viaggio</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span>
                  Clicca su "Indicazioni a piedi" o "Indicazioni trasporto" per aprire Google Maps con le indicazioni
                  stradali
                </span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span>Clicca su "Trova stazione metro" per trovare la stazione della metropolitana più vicina</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span>Clicca su "Apri PDF voucher" per visualizzare i voucher delle attività</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span>L'indicatore "Sei qui" mostra l'attività corrente in base all'ora</span>
              </li>
              <li className="flex items-start">
                <span className="font-bold mr-2">•</span>
                <span>In caso di emergenza, usa il pulsante rosso SOS in basso a destra</span>
              </li>
            </ul>

            <button
              onClick={() => setShowHelp(false)}
              className="mt-4 w-full py-2 bg-[#2a4d7f] text-white rounded-lg font-medium hover:bg-[#2a4d7f]/90 transition-colors"
            >
              Ho capito, nascondi questa guida
            </button>
          </div>
        </div>
      )}

      {/* Daily Itinerary */}
      <section className="w-full max-w-md px-4 pb-24">
        {(activeDay === "all" || activeDay === "day1") && (
          <DayCard
            id="day1"
            date="Mercoledì 21 Maggio"
            title="Volo, Arrivo & Free Tour Misteri"
            events={dayData.day1}
            currentActivity={currentActivity && currentActivity.day === "day1" ? currentActivity : null}
          />
        )}

        {(activeDay === "all" || activeDay === "day2") && (
          <DayCard
            id="day2"
            date="Giovedì 22 Maggio"
            title="Montmartre, Louvre e Passeggiata Iconica"
            events={dayData.day2}
            currentActivity={currentActivity && currentActivity.day === "day2" ? currentActivity : null}
          />
        )}

        {(activeDay === "all" || activeDay === "day3") && (
          <DayCard
            id="day3"
            date="Venerdì 23 Maggio"
            title="Quartiere Latino, Torre Eiffel, Crociera"
            events={dayData.day3}
            currentActivity={currentActivity && currentActivity.day === "day3" ? currentActivity : null}
          />
        )}

        {(activeDay === "all" || activeDay === "day4") && (
          <DayCard
            id="day4"
            date="Sabato 24 Maggio"
            title="Passeggiata e ritorno"
            events={dayData.day4}
            currentActivity={currentActivity && currentActivity.day === "day4" ? currentActivity : null}
          />
        )}

        {activeDay === "notes" && <Notes />}
        {activeDay === "all" && <Notes />}
      </section>

      {/* SOS Button */}
      <SosButton />

      {/* Bottom Navbar */}
      <BottomNavbar activeDay={activeDay} setActiveDay={setActiveDay} />

      {/* Footer */}
      <footer className="w-full py-4 text-center text-[#2a4d7f] bg-[#f5f0e6] border-t border-[#e06666]/20">
        <p>Creato con amore per mamma e papà ❤️</p>
      </footer>
    </main>
  )
}
