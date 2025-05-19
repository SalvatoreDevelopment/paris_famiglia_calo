"use client"

import { useState } from "react"
import { Phone, X, MapPin, User, Building } from "lucide-react"

export function SosButton() {
  const [isOpen, setIsOpen] = useState(false)

  const emergencyContacts = [
    {
      name: "Numero di emergenza europeo",
      number: "112",
      description: "Polizia, ambulanza, vigili del fuoco",
    },
    {
      name: "Polizia",
      number: "17",
      description: "Emergenze di sicurezza",
    },
    {
      name: "Ambulanza",
      number: "15",
      description: "Emergenze mediche",
    },
    {
      name: "Ambasciata Italiana a Parigi",
      number: "+33 1 49 54 03 00",
      description: "Assistenza ai cittadini italiani",
    },
    {
      name: "Hotel Campanile Bercy",
      number: "+33 1 43 46 65 50",
      description: "Assistenza dall'hotel",
    },
  ]

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`
  }

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          const message = `La mia posizione attuale: https://maps.google.com/?q=${latitude},${longitude}`

          // Try to use the Web Share API if available
          if (navigator.share) {
            navigator
              .share({
                title: "La mia posizione",
                text: message,
              })
              .catch((err) => {
                // Fallback: copy to clipboard
                navigator.clipboard.writeText(message).then(() => {
                  alert("Posizione copiata negli appunti. Puoi incollarla in un messaggio.")
                })
              })
          } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(message).then(() => {
              alert("Posizione copiata negli appunti. Puoi incollarla in un messaggio.")
            })
          }
        },
        (error) => {
          alert("Impossibile ottenere la posizione: " + error.message)
        },
      )
    } else {
      alert("Geolocalizzazione non supportata dal tuo dispositivo")
    }
  }

  return (
    <>
      {/* SOS Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-20 w-14 h-14 rounded-full bg-red-600 text-white shadow-lg flex items-center justify-center hover:bg-red-700 transition-colors"
        aria-label="Emergenza"
      >
        <Phone className="h-6 w-6" />
      </button>

      {/* Emergency Panel */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md max-h-[80vh] overflow-y-auto">
            <div className="p-4 bg-red-600 text-white rounded-t-xl flex justify-between items-center">
              <h2 className="text-xl font-bold">Emergenza SOS</h2>
              <button onClick={() => setIsOpen(false)} className="p-1 rounded-full hover:bg-white/20">
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <button
                  onClick={handleShareLocation}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg flex items-center justify-center hover:bg-blue-700"
                >
                  <MapPin className="h-5 w-5 mr-2" />
                  Condividi la tua posizione
                </button>
              </div>

              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Numeri di emergenza:</h3>
                <div className="space-y-3">
                  {emergencyContacts.map((contact, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-start">
                        {contact.name.includes("Hotel") ? (
                          <Building className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        ) : (
                          <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <div className="font-medium text-gray-800">{contact.name}</div>
                          <div className="text-sm text-gray-500">{contact.description}</div>
                        </div>
                        <button
                          onClick={() => handleCall(contact.number)}
                          className="ml-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 flex items-center"
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          <span>{contact.number}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <h3 className="font-medium text-yellow-800 mb-1">Informazioni importanti:</h3>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• In caso di emergenza, chiama prima il 112</li>
                  <li>• Comunica sempre la tua posizione esatta</li>
                  <li>• Mantieni la calma e segui le istruzioni</li>
                  <li>• Tieni a portata di mano i documenti d'identità</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
