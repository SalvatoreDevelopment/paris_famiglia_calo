// Mappa dei voucher alle immagini
// Ogni voucher può avere più pagine (array di URL di immagini)
export const voucherImages: Record<string, string[]> = {
  "/pdfs/hotel-voucher.pdf": [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hotel-voucher.jpg-oUGodIcCyUCAB3tXrrh0mYfHGRQYsL.jpeg",
  ],
  "/pdfs/tour-misteri.pdf": [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0.jpg-Sb485xO8bC86zGqXWgUqOTrT2rZ1I3.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1.jpg-0VM5s17AH7nO1d4GcHdDgZVNlYY2Z2.jpeg",
  ],
  "/pdfs/tour-montmartre.pdf": [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0.jpg-HuPLFiAtWO45ev3IrMx0JPCz59tWYS.jpeg",
  ],
  "/pdfs/louvre-tickets.pdf": [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1747692550687-bc452eba-0463-437d-8a45-9879c9cf968e_1.jpg-jRmNpxTJ0KSA33jUxPPW2GHylwQfC2.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1747692550687-bc452eba-0463-437d-8a45-9879c9cf968e_2.jpg-nRR2CaqV5AWOoNK5BXsiJhyCeehyHJ.jpeg",
  ],
  "/pdfs/tour-quartiere-latino.pdf": [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tour-quartiere-latino%201.jpg-w1UUYH9AOhvKrGODOL140eB0lc8GCj.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tour-quartiere-latino%202.jpg-J2ayqKgZtEE6iE5TEiqWgDc4XvavvA.jpeg",
  ],
  "/pdfs/tour-eiffel.pdf": [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/tour-eiffel.jpg-AAnWr7zIrDLOTxMvq7J59FSPYEZwC6.jpeg",
  ],
  "/pdfs/crociera-senna.pdf": [
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/0.jpg-BsZqDvQFpNS2fFTtvel0TG7KefWMaa.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2.jpg-BuhLvjLbRt4ehrBeGKXefnr4JZH5Ai.jpeg",
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3.jpg-KJ9exu3yzb75Yahr33TTbuDf8TGGbK.jpeg",
  ],
}

// Funzione per ottenere le immagini di un voucher
export function getVoucherImages(pdfUrl: string): string[] {
  // Se il voucher non esiste nella mappa, restituisci un'immagine di fallback
  if (!voucherImages[pdfUrl]) {
    return [
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/images/vouchers/fallback-0sk99uIjEL7mniFNPdWWY3vJpxVHvq.png",
    ]
  }

  return voucherImages[pdfUrl]
}
