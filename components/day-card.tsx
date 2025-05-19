import { TimelineEvent } from "./timeline-event"

type Event = {
  time: string
  emoji: string
  description: string
  voucher?: {
    text: string
    url?: string
    imageUrl?: string
    title?: string
    details?: string
    meetingPoint?: string
    arrivalTime?: string
  }
  transportation?: {
    type: "metro" | "walk" | "bus" | "shuttle"
    details: string
    duration: string
    destination?: string
  }
}

type DayCardProps = {
  id: string
  date: string
  title: string
  events: Event[]
  currentActivity?: {
    time: string
    description: string
  } | null
}

export function DayCard({ id, date, title, events, currentActivity }: DayCardProps) {
  return (
    <div id={id} className="w-full bg-white rounded-xl shadow-md p-5 mb-6">
      <h2 className="text-2xl font-bold text-[#2a4d7f] mb-4">
        📅{" "}
        <span className="ml-2">
          {date} – {title}
        </span>
      </h2>
      <div className="space-y-4">
        {events.map((event, index) => (
          <TimelineEvent
            key={index}
            time={event.time}
            emoji={event.emoji}
            description={event.description}
            voucher={event.voucher}
            transportation={event.transportation}
            isLast={index === events.length - 1}
            isCurrentActivity={
              currentActivity !== null &&
              currentActivity?.time === event.time &&
              currentActivity?.description === event.description
            }
          />
        ))}
      </div>
    </div>
  )
}
