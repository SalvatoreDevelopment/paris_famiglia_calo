// Mappa dei voucher alle immagini
// Ogni voucher può avere più pagine (array di URL di immagini)
export const voucherImages: Record<string, string[]> = {
  "/pdfs/hotel-voucher.pdf": ["/images/vouchers/hotel/pagina-1.jpg"],
  "/pdfs/tour-misteri.pdf": [
    "/images/vouchers/tour-misteri/pagina-1.jpg",
    "/images/vouchers/tour-misteri/pagina-2.jpg",
  ],
  "/pdfs/tour-montmartre.pdf": ["/images/vouchers/tour-montmartre/pagina-1.jpg"],
  "/pdfs/louvre-tickets.pdf": ["/images/vouchers/louvre/pagina-1.jpg", "/images/vouchers/louvre/pagina-2.jpg"],
  "/pdfs/tour-quartiere-latino.pdf": [
    "/images/vouchers/tour-quartiere-latino/pagina-1.jpg",
    "/images/vouchers/tour-quartiere-latino/pagina-2.jpg",
  ],
  "/pdfs/tour-eiffel.pdf": ["/images/vouchers/tour-eiffel/pagina-1.jpg"],
  "/pdfs/crociera-senna.pdf": [
    "/images/vouchers/crociera-senna/pagina-1.jpg",
    "/images/vouchers/crociera-senna/pagina-2.jpg",
    "/images/vouchers/crociera-senna/pagina-3.jpg",
  ],
}

// Funzione per ottenere le immagini di un voucher
export function getVoucherImages(pdfUrl: string): string[] {
  // Se il voucher non esiste nella mappa, restituisci un'immagine di fallback
  if (!voucherImages[pdfUrl]) {
    return ["/images/vouchers/fallback.png"]
  }

  return voucherImages[pdfUrl]
}
