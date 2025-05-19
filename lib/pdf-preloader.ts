// Utility per precaricare e memorizzare nella cache i PDF
export class PDFPreloader {
  private static cache: Map<string, Blob> = new Map()
  private static preloadQueue: string[] = []
  private static isPreloading = false

  // Aggiunge un PDF alla coda di precaricamento
  static addToQueue(url: string): void {
    if (!this.cache.has(url) && !this.preloadQueue.includes(url)) {
      this.preloadQueue.push(url)

      // Avvia il precaricamento se non è già in corso
      if (!this.isPreloading) {
        this.processQueue()
      }
    }
  }

  // Elabora la coda di precaricamento
  private static async processQueue(): Promise<void> {
    if (this.preloadQueue.length === 0) {
      this.isPreloading = false
      return
    }

    this.isPreloading = true
    const url = this.preloadQueue.shift()!

    try {
      console.log(`Precaricamento PDF: ${url}`)
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Errore nel precaricamento del PDF: ${response.status} ${response.statusText}`)
      }

      const blob = await response.blob()
      this.cache.set(url, blob)
      console.log(`PDF precaricato con successo: ${url}`)
    } catch (error) {
      console.error(`Errore durante il precaricamento del PDF: ${url}`, error)
    }

    // Continua con il prossimo PDF nella coda
    this.processQueue()
  }

  // Ottiene un PDF dalla cache o lo carica se non è presente
  static async getPDF(url: string): Promise<Blob | null> {
    // Se il PDF è già nella cache, restituiscilo
    if (this.cache.has(url)) {
      return this.cache.get(url)!
    }

    // Altrimenti, caricalo e memorizzalo nella cache
    try {
      console.log(`Caricamento PDF on-demand: ${url}`)
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error(`Errore nel caricamento del PDF: ${response.status} ${response.statusText}`)
      }

      const blob = await response.blob()
      this.cache.set(url, blob)
      return blob
    } catch (error) {
      console.error(`Errore durante il caricamento del PDF: ${url}`, error)
      return null
    }
  }

  // Verifica se un PDF è nella cache
  static isInCache(url: string): boolean {
    return this.cache.has(url)
  }

  // Ottiene l'URL oggetto per un PDF dalla cache
  static getObjectURL(url: string): string | null {
    const blob = this.cache.get(url)
    if (blob) {
      return URL.createObjectURL(blob)
    }
    return null
  }

  // Precarica tutti i PDF dell'itinerario
  static preloadAllPDFs(): void {
    const pdfUrls = [
      "/pdfs/hotel-voucher.pdf",
      "/pdfs/tour-misteri.pdf",
      "/pdfs/tour-montmartre.pdf",
      "/pdfs/louvre-tickets.pdf",
      "/pdfs/tour-quartiere-latino.pdf",
      "/pdfs/tour-eiffel.pdf",
      "/pdfs/crociera-senna.pdf",
    ]

    pdfUrls.forEach((url) => this.addToQueue(url))
  }
}
