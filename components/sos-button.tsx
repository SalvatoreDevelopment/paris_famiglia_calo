"use client"
import { useState } from "react"
import { AlertTriangle, X, Phone, MapPin, Hotel, Flag, AlertCircle } from "lucide-react"

export function SosButton() {
  const [isOpen, setIsOpen] = useState(false)

  const handleCall = (number: string) => {
    window.location.href = `tel:${number}`
  }

  const handleShareLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        const message = `Sono qui: https://www.google.com/maps?q=${lat},${lng}`

        // Tenta di usare l'API di condivisione se disponibile
        if (navigator.share) {
          navigator
            .share({
              title: "La mia posizione",
              text: message,
              url: `https://www.google.com/maps?q=${lat},${lng}`,
            })
            .catch((err) => {
              // Fallback: copia negli appunti
              navigator.clipboard.writeText(message)
              alert("Posizione copiata negli appunti. Puoi incollarla in un messaggio.")
            })
        } else {
          // Fallback per browser che non supportano l'API di condivisione
          navigator.clipboard.writeText(message)
          alert("Posizione copiata negli appunti. Puoi incollarla in un messaggio.")
        }
      })
    } else {
      alert("Il tuo dispositivo non supporta la geolocalizzazione.")
    }
  }

  return (
    <>
      {/* Pulsante SOS fisso */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-4 bottom-24 z-20 flex items-center justify-center w-16 h-16 bg-red-600 text-white rounded-full shadow-lg hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300"
        aria-label="Emergenza"
      >
        <AlertTriangle className="h-8 w-8" />
      </button>

      {/* Schermata di emergenza */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-auto">
            {/* Header */}
            <div className="bg-red-600 text-white p-4 flex items-center justify-between rounded-t-xl">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2" />
                <h2 className="text-xl font-bold">Emergenza</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-white/20"
                aria-label="Chiudi"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Contenuto */}
            <div className="p-5 space-y-6">
              {/* Numeri di emergenza */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Numeri di emergenza</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleCall("112")}
                    className="flex items-center justify-between w-full p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                  >
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                      <span className="font-medium">Emergenza europea</span>
                    </div>
                    <div className="flex items-center text-red-600">
                      <Phone className="h-4 w-4 mr-1" />
                      <span className="font-bold">112</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleCall("15")}
                    className="flex items-center justify-between w-full p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                  >
                    <div className="flex items-center">
                      <AlertCircle className="h-5 w-5 text-red-600 mr-3" />
                      <span className="font-medium">Emergenza medica</span>
                    </div>
                    <div className="flex items-center text-red-600">
                      <Phone className="h-4 w-4 mr-1" />
                      <span className="font-bold">15</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handleCall("17")}
                    className="flex items-center justify-between w-full p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100"
                  >
                    <div className="flex items-center">
                      <Flag className="h-5 w-5 text-red-600 mr-3" />
                      <span className="font-medium">Polizia</span>
                    </div>
                    <div className="flex items-center text-red-600">
                      <Phone className="h-4 w-4 mr-1" />
                      <span className="font-bold">17</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Informazioni hotel */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Il tuo hotel</h3>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start mb-2">
                    <Hotel className="h-5 w-5 text-[#2a4d7f] mr-2 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#2a4d7f]">Campanile Hotel Paris Bercy Village</p>
                      <p className="text-gray-700">17 Rue Baron Le Roy, 75012 Paris</p>
                      <p className="text-gray-700">Tel: +33 1 44 67 75 75</p>
                    </div>
                  </div>
                  <button
                    onClick={() =>
                      window.open(
                        "https://www.google.com/maps?q=Campanile+Hotel+Paris+Bercy+Village,+17+Rue+Baron+Le+Roy,+75012+Paris",
                        "_blank",
                      )
                    }
                    className="w-full mt-2 py-2 bg-[#2a4d7f] text-white rounded-lg flex items-center justify-center"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Indicazioni per l'hotel
                  </button>
                </div>
              </div>

              {/* Ambasciata italiana */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Ambasciata italiana</h3>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-start mb-2">
                    <Flag className="h-5 w-5 text-[#2a4d7f] mr-2 mt-0.5" />
                    <div>
                      <p className="font-bold text-[#2a4d7f]">Ambasciata d'Italia a Parigi</p>
                      <p className="text-gray-700">51 Rue de Varenne, 75007 Paris</p>
                      <p className="text-gray-700">Tel: +33 1 49 54 03 00</p>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 mt-2">
                    <button
                      onClick={() =>
                        window.open(
                          "https://www.google.com/maps?q=Ambasciata+d'Italia+a+Parigi,+51+Rue+de+Varenne,+75007+Paris",
                          "_blank",
                        )
                      }
                      className="w-full py-2 bg-[#2a4d7f] text-white rounded-lg flex items-center justify-center"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Indicazioni per l'ambasciata
                    </button>
                    <button
                      onClick={() => handleCall("33149540300")}
                      className="w-full py-2 bg-[#2a4d7f] text-white rounded-lg flex items-center justify-center"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      Chiama l'ambasciata
                    </button>
                  </div>
                </div>
              </div>

              {/* Condividi posizione */}
              <button
                onClick={handleShareLocation}
                className="w-full py-3 bg-green-600 text-white rounded-lg flex items-center justify-center font-bold text-lg hover:bg-green-700"
              >
                <MapPin className="h-5 w-5 mr-2" />
                Condividi la mia posizione
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
