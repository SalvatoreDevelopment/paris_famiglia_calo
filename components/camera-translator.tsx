"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, X, Languages, Copy, Check, RotateCcw } from "lucide-react"

export function CameraTranslator() {
  const [isOpen, setIsOpen] = useState(false)
  const [cameraActive, setCameraActive] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [translatedText, setTranslatedText] = useState<string | null>(null)
  const [isTranslating, setIsTranslating] = useState(false)
  const [hasCopied, setHasCopied] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Open the camera translator
  const handleOpen = () => {
    setIsOpen(true)
    setCapturedImage(null)
    setTranslatedText(null)
    setCameraError(null)
    setPermissionDenied(false)
    setHasCopied(false)
  }

  // Close the camera translator and clean up
  const handleClose = () => {
    stopCamera()
    setIsOpen(false)
    setCameraActive(false)
    setCapturedImage(null)
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

        // Simulate translation process
        simulateTranslation()
      }
    }
  }

  // Reset and restart the camera
  const handleRetake = () => {
    setCapturedImage(null)
    setTranslatedText(null)
    setHasCopied(false)
    startCamera()
  }

  // Simulate the OCR and translation process
  const simulateTranslation = () => {
    setIsTranslating(true)

    // Simulate processing delay
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
      setTranslatedText(sampleTranslations[randomIndex])
      setIsTranslating(false)
    }, 2000) // 2 second delay to simulate processing
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
              <video ref={videoRef} autoPlay playsInline className="h-full w-full object-cover" />
            )}

            {/* Canvas for capturing images (hidden) */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Captured image */}
            {capturedImage && (
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
                    <button
                      onClick={copyToClipboard}
                      disabled={!translatedText || isTranslating}
                      className="p-1.5 rounded-full hover:bg-gray-100 disabled:opacity-50"
                      aria-label="Copia testo"
                    >
                      {hasCopied ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <Copy className="h-5 w-5 text-gray-600" />
                      )}
                    </button>
                  </div>

                  {isTranslating ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2a4d7f]"></div>
                      <span className="ml-2 text-gray-600">Traduzione in corso...</span>
                    </div>
                  ) : (
                    <p className="text-gray-800 mb-4">{translatedText}</p>
                  )}

                  <div className="flex justify-end">
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
