"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X, Languages, Copy, Check, RotateCcw, AlertCircle, ExternalLink } from "lucide-react"
import { createWorker, type Tesseract } from "tesseract.js"

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
  const workerRef = useRef<Tesseract.Worker | null>(null)

  // Initialize Tesseract worker
  useEffect(() => {
    if (isOpen && !workerRef.current) {
      const initWorker = async () => {
        try {
          const worker = await createWorker({
            logger: (m) => {
              if (m.status === "recognizing text") {
                setOcrProgress(Math.round(m.progress * 100))
              }
            },
          })

          // Load French language data
          await worker.loadLanguage("fra")
          await worker.initialize("fra")
          workerRef.current = worker
        } catch (error) {
          console.error("Failed to initialize Tesseract worker:", error)
        }
      }

      initWorker()
    }

    return () => {
      // Terminate worker when component unmounts
      if (workerRef.current) {
        workerRef.current.terminate()
        workerRef.current = null
      }
    }
  }, [isOpen])

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

  // Process the image with Tesseract OCR
  const processImageWithOCR = async (canvas: HTMLCanvasElement) => {
    setIsProcessing(true)
    setProcessingStatus("Riconoscimento testo...")
    setOcrProgress(0)
    setShowOcrOptions(false)

    try {
      if (!workerRef.current) {
        // Initialize worker if not already done
        const worker = await createWorker({
          logger: (m) => {
            if (m.status === "recognizing text") {
              setOcrProgress(Math.round(m.progress * 100))
            }
          },
        })

        await worker.loadLanguage("fra")
        await worker.initialize("fra")
        workerRef.current = worker
      }

      // Recognize text in the image
      const { data } = await workerRef.current.recognize(canvas)

      // Get the recognized text
      const text = data.text.trim()
      setExtractedText(text)

      // Translate the text
      setProcessingStatus("Traduzione in corso...")
      await translateText(text)
    } catch (error) {
      console.error("OCR processing error:", error)
      setTranslatedText("Errore nel riconoscimento del testo. Prova a scattare un'altra foto con testo più chiaro.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Open Google Lens
  const openGoogleLens = () => {
    // Google Lens URL
    window.open("https://lens.google.com", "_blank")
  }

  // Process with internal OCR
  const processWithInternalOCR = () => {
    if (canvasRef.current) {
      processImageWithOCR(canvasRef.current)
    }
  }

  // Simple translation function using the dictionary
  const translateText = async (text: string) => {
    // Wait a moment to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (!text || text.length === 0) {
      setTranslatedText("Nessun testo riconosciuto. Prova a scattare un'altra foto con testo più chiaro.")
      return
    }

    // Split the text into words and phrases
    const words = text.toLowerCase().split(/\s+/)
    const phrases: string[] = []

    // Try to match multi-word phrases first (up to 3 words)
    for (let i = 0; i < words.length; i++) {
      let matched = false

      // Try 3-word phrases
      if (i + 2 < words.length) {
        const phrase3 = `${words[i]} ${words[i + 1]} ${words[i + 2]}`
        if (simpleDictionary[phrase3]) {
          phrases.push(simpleDictionary[phrase3])
          i += 2
          matched = true
          continue
        }
      }

      // Try 2-word phrases
      if (i + 1 < words.length) {
        const phrase2 = `${words[i]} ${words[i + 1]}`
        if (simpleDictionary[phrase2]) {
          phrases.push(simpleDictionary[phrase2])
          i += 1
          matched = true
          continue
        }
      }

      // Try single words
      if (simpleDictionary[words[i]]) {
        phrases.push(simpleDictionary[words[i]])
        matched = true
      } else {
        // Keep original word if no translation found
        phrases.push(words[i])
      }
    }

    // Join the translated phrases
    let translated = phrases.join(" ")

    // If we couldn't translate much, provide a fallback message
    const originalWords = text.split(/\s+/).length
    const translatedWords = Object.keys(simpleDictionary).filter((word) =>
      text.toLowerCase().includes(word.toLowerCase()),
    ).length

    if (translatedWords < originalWords * 0.3) {
      translated += "\n\n⚠️ Traduzione limitata. Riconosciute solo alcune parole."
    }

    setTranslatedText(translated)
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

                    <button
                      onClick={openGoogleLens}
                      className="w-full py-3 px-4 bg-[#e06666] text-white rounded-lg flex items-center justify-center hover:bg-[#e06666]/90"
                    >
                      <ExternalLink className="h-5 w-5 mr-2" />
                      <span>Apri Google Lens (consigliato)</span>
                    </button>

                    <p className="text-xs text-gray-500 text-center mt-2">
                      Google Lens offre un riconoscimento più preciso e traduzione migliore
                    </p>
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
                    <button
                      onClick={openGoogleLens}
                      className="flex items-center px-3 py-2 bg-[#e06666] text-white rounded-lg hover:bg-[#e06666]/90"
                    >
                      <ExternalLink className="h-4 w-4 mr-1" />
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
