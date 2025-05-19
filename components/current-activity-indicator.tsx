"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Calendar, ArrowRight } from "lucide-react"
import { getDayData } from "../lib/day-data"

export function CurrentActivityIndicator() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [nextActivity, setNextActivity] = useState<{
    day: string
    dayName: string
    time: string
    description: string
    emoji: string
    timeUntil: string
    isSimulated: boolean
  } | null>(null)

  // Get day data once - use useMemo to ensure it's stable
  const dayData = useMemo(() => getDayData(), [])

  // Update current time every minute
  useEffect(() => {
    // Set initial time
    setCurrentTime(new Date())

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, []) // Empty dependency array means this only runs once on mount

  // Format minutes to a readable time string
  const formatTimeUntil = (minutes: number): string => {
    if (minutes < 0) return "In corso"

    if (minutes < 60) {
      return `Tra ${minutes} min`
    } else {
      const hours = Math.floor(minutes / 60)
      const mins = minutes % 60
      return `Tra ${hours} h${mins > 0 ? ` e ${mins} min` : ""}`
    }
  }

  // Determine next activity based on time and date
  const determineNextActivity = useCallback(() => {
    // Actual trip dates
    const tripDates = {
      day1: new Date(2025, 4, 21), // May 21, 2025
      day2: new Date(2025, 4, 22), // May 22, 2025
      day3: new Date(2025, 4, 23), // May 23, 2025
      day4: new Date(2025, 4, 24), // May 24, 2025
    }

    const dayNames = {
      day1: "Mercoledì 21 Maggio",
      day2: "Giovedì 22 Maggio",
      day3: "Venerdì 23 Maggio",
      day4: "Sabato 24 Maggio",
    }

    // Check if we're in the actual trip dates
    const now = new Date(currentTime)
    const today = now.getDate()
    const month = now.getMonth()
    const year = now.getFullYear()

    // Set time to midnight for date comparison
    const todayDate = new Date(year, month, today)

    // Find if today matches any of the trip dates
    let currentDay = null
    let currentDayName = ""
    let isSimulated = true

    // Check if we're in the actual trip dates
    if (todayDate.getTime() === tripDates.day1.getTime()) {
      currentDay = "day1"
      currentDayName = dayNames.day1
      isSimulated = false
    } else if (todayDate.getTime() === tripDates.day2.getTime()) {
      currentDay = "day2"
      currentDayName = dayNames.day2
      isSimulated = false
    } else if (todayDate.getTime() === tripDates.day3.getTime()) {
      currentDay = "day3"
      currentDayName = dayNames.day3
      isSimulated = false
    } else if (todayDate.getTime() === tripDates.day4.getTime()) {
      currentDay = "day4"
      currentDayName = dayNames.day4
      isSimulated = false
    } else {
      // If not in actual trip dates, simulate based on current date
      if (today % 4 === 0) {
        currentDay = "day1"
        currentDayName = dayNames.day1 + " (simulato)"
      } else if (today % 4 === 1) {
        currentDay = "day2"
        currentDayName = dayNames.day2 + " (simulato)"
      } else if (today % 4 === 2) {
        currentDay = "day3"
        currentDayName = dayNames.day3 + " (simulato)"
      } else {
        currentDay = "day4"
        currentDayName = dayNames.day4 + " (simulato)"
      }
    }

    if (currentDay) {
      const events = dayData[currentDay]
      const currentHour = currentTime.getHours()
      const currentMinute = currentTime.getMinutes()
      const currentTimeValue = currentHour * 60 + currentMinute

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

      // Find the next event (the first event that hasn't started yet)
      let nextEvent = null
      for (let i = 0; i < eventsWithTimeValue.length; i++) {
        if (eventsWithTimeValue[i].timeValue > currentTimeValue) {
          nextEvent = eventsWithTimeValue[i]
          break
        }
      }

      // If we haven't found a next event for today, check if we can show the first event of the next day
      if (!nextEvent) {
        // If we're on the last day, we don't have a next event
        if (currentDay === "day4") {
          // Return a placeholder for the last day with no more events
          return {
            day: currentDay,
            dayName: currentDayName,
            time: "Fine",
            description: "Tutte le attività del viaggio sono completate",
            emoji: "🏁",
            timeUntil: "Completato",
            isSimulated: isSimulated,
          }
        }

        // Otherwise, get the first event of the next day
        let nextDay = ""
        let nextDayName = ""

        if (currentDay === "day1") {
          nextDay = "day2"
          nextDayName = dayNames.day2 + (isSimulated ? " (simulato)" : "")
        } else if (currentDay === "day2") {
          nextDay = "day3"
          nextDayName = dayNames.day3 + (isSimulated ? " (simulato)" : "")
        } else if (currentDay === "day3") {
          nextDay = "day4"
          nextDayName = dayNames.day4 + (isSimulated ? " (simulato)" : "")
        }

        if (nextDay) {
          const nextDayEvents = dayData[nextDay]
          const nextDayEventsWithTimeValue = nextDayEvents.map((event) => {
            const [hours, minutes] = event.time.split(":").map(Number)
            return {
              ...event,
              timeValue: hours * 60 + minutes,
            }
          })

          // Sort events by time
          nextDayEventsWithTimeValue.sort((a, b) => a.timeValue - b.timeValue)

          // Get the first event of the next day
          nextEvent = nextDayEventsWithTimeValue[0]

          if (nextEvent) {
            // Calculate time until next event (in minutes)
            // For next day events, add 24 hours (1440 minutes) minus current time, plus the event time
            const timeUntilMinutes = 1440 - currentTimeValue + nextEvent.timeValue

            return {
              day: nextDay,
              dayName: nextDayName,
              time: nextEvent.time,
              description: nextEvent.description,
              emoji: nextEvent.emoji,
              timeUntil: formatTimeUntil(timeUntilMinutes),
              isSimulated: isSimulated,
            }
          }
        }
      } else {
        // Calculate time until next event (in minutes)
        const timeUntilMinutes = nextEvent.timeValue - currentTimeValue

        return {
          day: currentDay,
          dayName: currentDayName,
          time: nextEvent.time,
          description: nextEvent.description,
          emoji: nextEvent.emoji,
          timeUntil: formatTimeUntil(timeUntilMinutes),
          isSimulated: isSimulated,
        }
      }
    }

    // Fallback: return a default activity if we couldn't determine the next one
    return {
      day: "day1",
      dayName: "Viaggio a Parigi",
      time: "Prossimamente",
      description: "Il tuo viaggio a Parigi inizierà presto",
      emoji: "✈️",
      timeUntil: "In preparazione",
      isSimulated: true,
    }
  }, [currentTime, dayData]) // Only recalculate when currentTime or dayData changes

  // Update next activity when time changes
  useEffect(() => {
    // Calculate the activity once
    const activity = determineNextActivity()

    // Only update state if the activity has changed
    setNextActivity(activity)
  }, [currentTime, determineNextActivity])

  // Always render the component, even if nextActivity is null
  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-[#2a4d7f]/20 shadow-md z-30 px-4 py-3">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-[#2a4d7f] mr-2" />
            <span className="text-sm font-medium text-[#2a4d7f]">
              {nextActivity ? nextActivity.dayName : "Viaggio a Parigi"}
            </span>
            {nextActivity && nextActivity.isSimulated && (
              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-1.5 py-0.5 rounded">Simulazione</span>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        <div className="mt-2 p-3 rounded-lg bg-[#e06666]/10 border border-[#e06666]/30">
          <div className="flex items-start">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-[#e06666] text-[#2a4d7f] mr-3 flex-shrink-0">
              <span className="text-lg">{nextActivity ? nextActivity.emoji : "📅"}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                <ArrowRight className="h-4 w-4 text-[#e06666] mr-1" />
                <span className="text-xs font-bold text-[#e06666]">PROSSIMA ATTIVITÀ</span>
                {nextActivity && (
                  <span className="ml-2 text-xs font-medium bg-[#e06666]/20 text-[#e06666] px-1.5 py-0.5 rounded">
                    {nextActivity.timeUntil}
                  </span>
                )}
              </div>
              <p className="font-bold text-[#2a4d7f] mt-1">
                {nextActivity ? `${nextActivity.time} - ${nextActivity.description}` : "Caricamento..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
