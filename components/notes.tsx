"use client"

import { useState, useEffect } from "react"
import { Save } from "lucide-react"

export function Notes() {
  const [notes, setNotes] = useState("")
  const [saved, setSaved] = useState(false)

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("parisTrip_notes")
    if (savedNotes) {
      setNotes(savedNotes)
    }
  }, [])

  const handleSave = () => {
    localStorage.setItem("parisTrip_notes", notes)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="w-full bg-white rounded-xl shadow-md p-5 mb-6">
      <h2 className="text-2xl font-bold text-[#2a4d7f] mb-4">📝 Note di Viaggio</h2>
      <p className="text-gray-600 mb-4">
        Usa questo spazio per annotare informazioni importanti, promemoria o qualsiasi cosa tu voglia ricordare durante
        il viaggio.
      </p>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full h-64 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2a4d7f] mb-4"
        placeholder="Scrivi qui le tue note..."
      ></textarea>
      <div className="flex justify-between items-center">
        <button
          onClick={handleSave}
          className="flex items-center px-4 py-2 bg-[#2a4d7f] text-white rounded-lg hover:bg-[#2a4d7f]/90 transition-colors"
        >
          <Save className="h-5 w-5 mr-2" />
          Salva note
        </button>
        {saved && <span className="text-green-600">✓ Note salvate!</span>}
      </div>
    </div>
  )
}
