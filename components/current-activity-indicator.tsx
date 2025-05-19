"use client"
import { useState, useEffect, useCallback, useMemo } from "react"
import { Clock, Navigation, AlertCircle } from "lucide-react"
import { getDayData } from "../lib/day-data"

export function CurrentActivityIndicator() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [currentActivity, setCurrentActivity] = useState<{
    day: string
    dayName: string
    time: string
    description: string
    emoji: string
    isNext: boolean
  } | null>(null)

  // Get day data once - use useMemo to ensure it's stable
  const dayData = useMemo(() => getDayData(), [])

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timer)
  }, []) // Empty dependency array means this only runs once on mount

  // Determine current or next activity based on time
  const determineCurrentActivity = useCallback(() => {
    const dayNames = {
      day1: "Mercoledì 21 Maggio",
      day2: "Giovedì 22 Maggio",
      day3: "Venerdì 23 Maggio",
      day4: "Sabato 24 Maggio",
    }

    // For testing purposes, use the current date to determine which day to simulate
    const today = currentTime.getDate()

    // Simulate trip day based on current date
    let currentDay = null
    let currentDayName = ""

    if (today % 4 === 0) {
      currentDay = "day1"
      currentDayName = dayNames.day1
    } else if (today % 4 === 1) {
      currentDay = "day2"
      currentDayName = dayNames.day2
    } else if (today % 4 === 2) {
      currentDay = "day3"
      currentDayName = dayNames.day3
    } else {
      currentDay = "day4"
      currentDayName = dayNames.day4
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

      // Find current or next event
      let foundEvent = null
      let isNext = false

      // Find current event (the last event that has started)
      for (let i = eventsWithTimeValue.length - 1; i >= 0; i--) {
        if (eventsWithTimeValue[i].timeValue <= currentTimeValue) {
          foundEvent = eventsWithTimeValue[i]
          break
        }
      }

      // If we haven't found a current event, take the first event of the day as next
      if (!foundEvent) {
        foundEvent = eventsWithTimeValue[0]
        isNext = true
      } else {
        // Check if there's a next event within 30 minutes
        const nextEventIndex = eventsWithTimeValue.findIndex((e) => e.timeValue === foundEvent.timeValue) + 1
        if (nextEventIndex < eventsWithTimeValue.length) {
          const nextEvent = eventsWithTimeValue[nextEventIndex]
          // If next event is within 30 minutes, show it as "next"
          if (nextEvent.timeValue - currentTimeValue <= 30) {
            foundEvent = nextEvent
            isNext = true
          }
        }
      }

      if (foundEvent) {
        return {
          day: currentDay,
          dayName: currentDayName,
          time: foundEvent.time,
          description: foundEvent.description,
          emoji: foundEvent.emoji,
          isNext: isNext,
        }
      }
    }

    return null
  }, [currentTime, dayData]) // Only recalculate when currentTime or dayData changes

  // Update current activity when time changes - FIX: separate the effect from the state update
  useEffect(() => {
    // Calculate the activity once
    const activity = determineCurrentActivity()

    // Only update state if the activity has changed
    setCurrentActivity(activity)

    // No need for additional dependencies since determineCurrentActivity already depends on currentTime
  }, [currentTime, determineCurrentActivity])

  if (!currentActivity) return null

  return (
    <div className="fixed top-0 left-0 right-0 bg-white border-b border-[#2a4d7f]/20 shadow-md z-30 px-4 py-3">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-[#2a4d7f] mr-2" />
            <span className="text-sm font-medium text-[#2a4d7f]">{currentActivity.dayName}</span>
          </div>
          <div className="text-sm text-gray-500">
            {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>

        <div
          className={`mt-2 p-3 rounded-lg ${currentActivity.isNext ? "bg-[#e06666]/10 border border-[#e06666]/30" : "bg-[#2a4d7f]/10 border border-[#2a4d7f]/30"}`}
        >
          <div className="flex items-start">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white border border-current text-[#2a4d7f] mr-3 flex-shrink-0">
              <span className="text-lg">{currentActivity.emoji}</span>
            </div>
            <div className="flex-1">
              <div className="flex items-center">
                {currentActivity.isNext ? (
                  <AlertCircle className="h-4 w-4 text-[#e06666] mr-1" />
                ) : (
                  <Navigation className="h-4 w-4 text-[#2a4d7f] mr-1" />
                )}
                <span className={`text-xs font-bold ${currentActivity.isNext ? "text-[#e06666]" : "text-[#2a4d7f]"}`}>
                  {currentActivity.isNext ? "PROSSIMA ATTIVITÀ" : "ATTIVITÀ CORRENTE"}
                </span>
              </div>
              <p className="font-bold text-[#2a4d7f] mt-1">
                {currentActivity.time} - {currentActivity.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
