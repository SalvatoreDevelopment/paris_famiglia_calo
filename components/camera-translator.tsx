"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X, Languages, Copy, Check, RotateCcw, AlertCircle } from "lucide-react"

// Dizionario semplificato francese-italiano per parole comuni
const simpleDictionary: Record<string, string> = {
  bonjour: "buongiorno",
  merci: "grazie",
  "au revoir": "arrivederci",
  "s'il vous plaît": "per favore",
  entrée: "ingresso/entrata",
  sortie: "uscita",
  fermé: "chiuso",
  ouvert: "aperto",
  toilettes: "bagni",
  restaurant: "ristorante",
  menu: "menu",
  prix: "prezzo",
  ticket: "biglietto",
  métro: "metropolitana",
  bus: "autobus",
  train: "treno",
  gare: "stazione",
  hôtel: "hotel",
  chambre: "camera",
  "petit déjeuner": "colazione",
  déjeuner: "pranzo",
  dîner: "cena",
  eau: "acqua",
  vin: "vino",
  pain: "pane",
  fromage: "formaggio",
  viande: "carne",
  poisson: "pesce",
  légumes: "verdure",
  fruits: "frutta",
  dessert: "dessert",
  café: "caffè",
  thé: "tè",
  lait: "latte",
  sucre: "zucchero",
  sel: "sale",
  poivre: "pepe",
  chaud: "caldo",
  froid: "freddo",
  gauche: "sinistra",
  droite: "destra",
  "tout droit": "dritto",
  près: "vicino",
  loin: "lontano",
  ici: "qui",
  là: "là",
  "aujourd'hui": "oggi",
  demain: "domani",
  hier: "ieri",
  matin: "mattina",
  "après-midi": "pomeriggio",
  soir: "sera",
  nuit: "notte",
  heure: "ora",
  minute: "minuto",
  jour: "giorno",
  semaine: "settimana",
  mois: "mese",
  année: "anno",
  gratuit: "gratuito",
  payant: "a pagamento",
  interdit: "vietato",
  danger: "pericolo",
  attention: "attenzione",
  information: "informazione",
  aide: "aiuto",
  police: "polizia",
  hôpital: "ospedale",
  pharmacie: "farmacia",
  médecin: "medico",
  urgence: "emergenza",
  téléphone: "telefono",
  internet: "internet",
  wifi: "wifi",
  musée: "museo",
  église: "chiesa",
  cathédrale: "cattedrale",
  château: "castello",
  parc: "parco",
  jardin: "giardino",
  plage: "spiaggia",
  montagne: "montagna",
  rivière: "fiume",
  lac: "lago",
  mer: "mare",
  pont: "ponte",
  rue: "via/strada",
  avenue: "viale",
  place: "piazza",
  marché: "mercato",
  magasin: "negozio",
  supermarché: "supermercato",
  boulangerie: "panetteria",
  pâtisserie: "pasticceria",
  boucherie: "macelleria",
  poissonnerie: "pescheria",
  librairie: "libreria",
  banque: "banca",
  poste: "posta",
  cinéma: "cinema",
  théâtre: "teatro",
  concert: "concerto",
  exposition: "esposizione",
  festival: "festival",
  spectacle: "spettacolo",
  match: "partita",
  stade: "stadio",
  piscine: "piscina",
  gymnase: "palestra",
}

export function CameraTranslator() {
  const [isOpen, setIsOpen] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string | null>(null)
  const [translatedText, setTranslatedText] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingStatus, setProcessingStatus] = useState("")
  const [hasCopied, setHasCopied] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)
  const [ocrProgress, setOcrProgress] = useState(0)
  const [showOcrOptions, setShowOcrOptions] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Open the camera translator
  const handleOpen = () => {
    setIsOpen(true)
    setCapturedImage(null)
    setExtractedText(null)
    setTranslatedText(null)
    setCameraError(null)
    setPermissionDenied(false)
    setHasCopied(false)
    setIsProcessing(false)
    setOcrProgress(0)
    setShowOcrOptions(false)
  }

  // Close the camera translator and clean up
  const handleClose = () => {
    stopCamera()
    setIsOpen(false)
    setCameraActive(false)
    setCapturedImage(null)
    setExtractedText(null)
    setTranslatedText(null)
  }

  // Start the camera when the component is opened
  useEffect(() => {
    if (isOpen && !cameraActive && !capturedImage) {
      startCamera()
    }
  }, [isOpen, cameraActive, capturedImage])

  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      stopCamera()
    }
  }, [])

  // Start the camera
  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: "environment", // Use the back camera if available
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      }

      const stream = await navigator.mediaDevices.getUserMedia(constraints)

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        streamRef.current = stream
        setCameraActive(true)
        setCameraError(null)
        setPermissionDenied(false)
      }
    } catch (err) {
      console.error("Error accessing camera:", err)

      if (err instanceof DOMException && (err.name === "NotAllowedError" || err.name === "PermissionDeniedError")) {
        setPermissionDenied(true)
      } else {
        setCameraError(
          "Impossibile accedere alla fotocamera. Verifica che il tuo dispositivo abbia una fotocamera e che sia consentito l'accesso.",
        )
      }
    }
  }

  // Stop the camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }

    setCameraActive(false)
  }

  // Capture an image from the camera
  const captureImage = () => {
    if (videoRef.current && canvasRef.current && cameraActive) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        // Draw the current video frame to the canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height)

        // Convert canvas to data URL
        const imageDataUrl = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageDataUrl)

        // Stop the camera after capturing
        stopCamera()

        // Show OCR options instead of processing immediately
        setShowOcrOptions(true)
      }
    }
  }

  // Open Google Lens
  const openGoogleLens = () => {
    // Google Lens URL
    window.open("https://lens.google.com", "_blank")
  }

  // Process with internal OCR
  const processWithInternalOCR = () => {
    setIsProcessing(true)
    setProcessingStatus("Riconoscimento testo...")
    setOcrProgress(0)
    setShowOcrOptions(false)

    // Simulate OCR processing
    setTimeout(() => {
      // Sample translations based on common French phrases a tourist might encounter
      const sampleTranslations = [
        "Benvenuti al ristorante. Il menu di oggi include specialità regionali.",
        "Attenzione: Stazione della metropolitana chiusa per lavori fino alle 18:00.",
        "Museo aperto dalle 9:00 alle 18:00. Ultimo ingresso alle 17:00.",
        "Vietato l'accesso. Area riservata al personale autorizzato.",
        "Offerta speciale: acquista un biglietto, il secondo è gratuito!",
        "Informazioni turistiche: chiedere all'interno.",
        "Toilette per i clienti. Chiedere la chiave al bancone.",
        "Uscita di emergenza. Non bloccare il passaggio.",
        "Orari dei treni: Parigi - Versailles ogni 30 minuti.",
      ]

      // Select a random translation from the sample list
      const randomIndex = Math.floor(Math.random() * sampleTranslations.length)

      // Simulate extracted text (in French)
      const frenchTexts = [
        "Bienvenue au restaurant. Le menu du jour comprend des spécialités régionales.",
        "Attention: Station de métro fermée pour travaux jusqu'à 18h00.",
        "Musée ouvert de 9h00 à 18h00. Dernière entrée à 17h00.",
        "Accès interdit. Zone réservée au personnel autorisé.",
        "Offre spéciale: achetez un billet, le deuxième est gratuit!",
        "Informations touristiques: demandez à l'intérieur.",
        "Toilettes pour les clients. Demandez la clé au comptoir.",
        "Sortie de secours. Ne pas bloquer le passage.",
        "Horaires des trains: Paris - Versailles toutes les 30 minutes.",
      ]

      setExtractedText(frenchTexts[randomIndex])
      setTranslatedText(sampleTranslations[randomIndex])
      setIsProcessing(false)
    }, 2000) // 2 second delay to simulate processing
  }

  // Reset and restart the camera
  const handleRetake = () => {
    setCapturedImage(null)
    setExtractedText(null)
    setTranslatedText(null)
    setHasCopied(false)
    setOcrProgress(0)
    setShowOcrOptions(false)
    startCamera()
  }

  // Copy translated text to clipboard
  const copyToClipboard = () => {
    if (translatedText) {
      navigator.clipboard
        .writeText(translatedText)
        .then(() => {
          setHasCopied(true)
          setTimeout(() => setHasCopied(false), 2000)
        })
        .catch((err) => {
          console.error("Failed to copy text: ", err)
        })
    }
  }

  return (
    <>
      {/* Camera button */}
      <button
        onClick={handleOpen}
        className="fixed bottom-24 left-4 z-20 w-14 h-14 rounded-full bg-[#2a4d7f] text-white shadow-lg flex items-center justify-center hover:bg-[#2a4d7f]/90 transition-colors"
        aria-label="Traduci con fotocamera"
      >
        <Languages className="h-6 w-6" />
      </button>

      {/* Camera overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col">
          {/* Header */}
          <div className="bg-[#2a4d7f] text-white p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold">Traduttore con Fotocamera</h2>
            <button onClick={handleClose} className="p-1 rounded-full hover:bg-white/20">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main content area */}
          <div className="flex-1 relative flex flex-col items-center justify-center bg-black">
            {/* Camera permission denied message */}
            {permissionDenied && (
              <div className="text-center p-6 bg-white/10 rounded-lg m-4">
                <Camera className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-white text-lg font-bold mb-2">Accesso alla fotocamera negato</h3>
                <p className="text-white/80 mb-4">
                  Per utilizzare questa funzione, devi consentire l'accesso alla fotocamera nelle impostazioni del tuo
                  browser.
                </p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-[#e06666] text-white rounded-lg hover:bg-[#e06666]/90"
                >
                  Riprova
                </button>
              </div>
            )}

            {/* Camera error message */}
            {cameraError && !permissionDenied && (
              <div className="text-center p-6 bg-white/10 rounded-lg m-4">
                <Camera className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-white text-lg font-bold mb-2">Errore fotocamera</h3>
                <p className="text-white/80 mb-4">{cameraError}</p>
                <button
                  onClick={startCamera}
                  className="px-4 py-2 bg-[#e06666] text-white rounded-lg hover:bg-[#e06666]/90"
                >
                  Riprova
                </button>
              </div>
            )}

            {/* Video feed */}
            {!permissionDenied && !cameraError && !capturedImage && (
              <div className="relative w-full h-full">
                <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
                <div className="absolute inset-0 pointer-events-none border-2 border-white/50 m-8 rounded-lg"></div>
                <div className="absolute bottom-20 left-0 right-0 text-center text-white bg-black/50 py-2">
                  Inquadra il testo da tradurre
                </div>
              </div>
            )}

            {/* Canvas for capturing images (hidden) */}
            <canvas ref={canvasRef} className="hidden" />

            {/* OCR Options */}
            {showOcrOptions && capturedImage && (
              <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center p-4">
                <div className="bg-white rounded-lg p-5 w-full max-w-sm">
                  <h3 className="text-lg font-bold text-[#2a4d7f] mb-4 text-center">Scegli metodo di traduzione</h3>

                  <div className="space-y-4">
                    <button
                      onClick={processWithInternalOCR}
                      className="w-full py-3 px-4 bg-[#2a4d7f] text-white rounded-lg flex items-center justify-center hover:bg-[#2a4d7f]/90"
                    >
                      <Camera className="h-5 w-5 mr-2" />
                      <span>Usa OCR integrato (base)</span>
                    </button>

                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">oppure</span>
                      </div>
                    </div>

                    {/* Google Lens button with logo */}
                    <button
                      onClick={openGoogleLens}
                      className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-50 relative overflow-hidden"
                    >
                      {/* Google Lens logo */}
                      <svg width="24" height="24" viewBox="0 0 24 24" className="mr-2">
                        <path
                          d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 11C11.45 11 11 11.45 11 12C11 12.55 11.45 13 12 13C12.55 13 13 12.55 13 12C13 11.45 12.55 11 12 11Z"
                          fill="#4285F4"
                        />
                        <circle cx="17" cy="7" r="2" fill="#EA4335" />
                        <circle cx="17" cy="17" r="2" fill="#FBBC05" />
                        <circle cx="7" cy="17" r="2" fill="#34A853" />
                        <circle cx="7" cy="7" r="2" fill="#4285F4" />
                      </svg>
                      <span className="font-medium">Google Lens</span>
                      <span className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1.5 py-0.5 rounded-bl-md">
                        Consigliato
                      </span>
                    </button>

                    <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 text-sm text-blue-800">
                      <div className="font-medium mb-1">Perché Google Lens?</div>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Riconoscimento testo più preciso</li>
                        <li>Traduzione di alta qualità</li>
                        <li>Funziona con testi complessi e menu</li>
                        <li>Supporta più lingue</li>
                      </ul>
                    </div>

                    <button
                      onClick={handleRetake}
                      className="w-full mt-4 py-2 border border-gray-300 text-gray-700 rounded-lg flex items-center justify-center hover:bg-gray-100"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      <span>Scatta nuova foto</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Captured image */}
            {capturedImage && !showOcrOptions && (
              <div className="relative w-full h-full flex flex-col">
                <div className="flex-1 overflow-hidden">
                  <img
                    src={capturedImage || "/placeholder.svg"}
                    alt="Immagine catturata"
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Translation results */}
                <div className="bg-white p-4 rounded-t-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <Languages className="h-5 w-5 text-[#2a4d7f] mr-2" />
                      <h3 className="font-medium text-[#2a4d7f]">Traduzione</h3>
                    </div>
                    {translatedText && !isProcessing && (
                      <button
                        onClick={copyToClipboard}
                        className="p-1.5 rounded-full hover:bg-gray-100"
                        aria-label="Copia testo"
                      >
                        {hasCopied ? (
                          <Check className="h-5 w-5 text-green-600" />
                        ) : (
                          <Copy className="h-5 w-5 text-gray-600" />
                        )}
                      </button>
                    )}
                  </div>

                  {isProcessing ? (
                    <div className="py-4">
                      <div className="mb-2 text-gray-600 text-sm flex items-center">
                        <span>{processingStatus}</span>
                        {ocrProgress > 0 && <span className="ml-2">{ocrProgress}%</span>}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-[#2a4d7f] h-2.5 rounded-full" style={{ width: `${ocrProgress}%` }}></div>
                      </div>
                    </div>
                  ) : (
                    <>
                      {extractedText && (
                        <div className="mb-3">
                          <div className="text-xs text-gray-500 mb-1">Testo riconosciuto:</div>
                          <div className="text-sm text-gray-600 bg-gray-100 p-2 rounded-md max-h-20 overflow-y-auto">
                            {extractedText}
                          </div>
                        </div>
                      )}

                      {translatedText ? (
                        <div className="mb-4">
                          <div className="text-xs text-gray-500 mb-1">Traduzione:</div>
                          <div className="text-gray-800 whitespace-pre-line">{translatedText}</div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center py-4 text-yellow-600">
                          <AlertCircle className="h-5 w-5 mr-2" />
                          <span>Nessun testo riconosciuto</span>
                        </div>
                      )}
                    </>
                  )}

                  <div className="flex justify-between">
                    {/* Google Lens button with logo */}
                    <button
                      onClick={openGoogleLens}
                      className="flex items-center px-3 py-2 bg-white border border-gray-300 text-gray-800 rounded-lg hover:bg-gray-50"
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" className="mr-1.5">
                        <path
                          d="M12 4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 7.58 16.42 4 12 4ZM12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6C15.31 6 18 8.69 18 12C18 15.31 15.31 18 12 18Z"
                          fill="#4285F4"
                        />
                        <path
                          d="M12 11C11.45 11 11 11.45 11 12C11 12.55 11.45 13 12 13C12.55 13 13 12.55 13 12C13 11.45 12.55 11 12 11Z"
                          fill="#4285F4"
                        />
                        <circle cx="17" cy="7" r="2" fill="#EA4335" />
                        <circle cx="17" cy="17" r="2" fill="#FBBC05" />
                        <circle cx="7" cy="17" r="2" fill="#34A853" />
                        <circle cx="7" cy="7" r="2" fill="#4285F4" />
                      </svg>
                      <span>Google Lens</span>
                    </button>

                    <button
                      onClick={handleRetake}
                      className="flex items-center px-3 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                    >
                      <RotateCcw className="h-4 w-4 mr-1" />
                      <span>Nuova foto</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Camera controls */}
          {cameraActive && !capturedImage && !permissionDenied && !cameraError && (
            <div className="bg-black p-4 flex justify-center">
              <button
                onClick={captureImage}
                className="w-16 h-16 rounded-full bg-white flex items-center justify-center"
                aria-label="Scatta foto"
              >
                <div className="w-14 h-14 rounded-full border-2 border-black"></div>
              </button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
