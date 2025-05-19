export function getDayData() {
  return {
    day1: [
      {
        time: "09:40",
        emoji: "✈️",
        description: "Partenza da Brindisi (BDS) con volo per Parigi Beauvais",
        voucher: {
          text: "Info Volo",
          url: "#",
          details:
            "Ryanair FR1234. Presentarsi in aeroporto almeno 2 ore prima della partenza. Bagaglio a mano incluso.",
        },
      },
      {
        time: "12:00",
        emoji: "✈️",
        description: "Arrivo a Parigi Beauvais (BVA)",
      },
      {
        time: "12:30",
        emoji: "🚌",
        description: "Trasferimento a Parigi centro (navetta Beauvais + metro per Bercy)",
        voucher: {
          text: "Info Trasporto",
          url: "#",
          details: "Durata trasferimento: circa 2 ore. Navetta aeroportuale + metro per Bercy",
        },
      },
      {
        time: "15:00",
        emoji: "🏨",
        description: "Arrivo e check-in presso Campanile Hotel Paris Bercy Village",
        voucher: {
          text: "Voucher Hotel",
          url: "#",
          imageUrl: "/hotel-campanile-bercy-village-confirmation.png",
          title: "Hotel Campanile Paris Bercy Village",
          details: `Elios Tours
0832311077
sergio.mandurino@eliostours.it
Reservation 34111277 made on 28.04.25

Campanile Hotel Paris Bercy Village
75012, 17 Rue Baron Le Roy, Paris
33144677575

Check-in: 21.05.2025, from 14:00:00
Check-out: 24.05.2025, until 12:00:00

Double room (full double bed), for 2 adults
Bedding: Double bed
Guests: Vincenzo Calo, Addolorata Martella

Meal type: Breakfast included

Not included: City tax: 33 EUR

GPS: 48.83517 2.387617`,
          meetingPoint: "17 Rue Baron Le Roy, 75012 Paris",
          arrivalTime: "Check-in dalle 14:00, Check-out entro le 12:00 del 24/05",
        },
      },
      {
        time: "17:00",
        emoji: "🚶",
        description: "Partenza per il tour dei misteri",
        voucher: {
          text: "Indicazioni Metro",
          url: "#",
          details:
            "🚇 Metro 14 da Cour Saint-Émilion a Châtelet, poi 🚶‍♂ a piedi fino al punto d'incontro. Durata totale: ~25 min",
        },
      },
      {
        time: "18:00",
        emoji: "🕵️",
        description: "Free Tour Misteri e Leggende di Parigi (fino alle 20:00)",
        voucher: {
          text: "Voucher Free Tour Misteri",
          url: "#",
          imageUrl: "/paris-mystery-voucher.png",
          title: "Free Tour Misteri e Leggende di Parigi",
          meetingPoint: "Uscita della metro Cité",
          arrivalTime: "Arrivare 15 minuti prima",
          details: "La guida avrà un ombrello nero con logo giallo",
        },
      },
      {
        time: "20:00",
        emoji: "🍽️",
        description: "Cena in zona Marais o Île de la Cité",
      },
      {
        time: "21:00",
        emoji: "🏨",
        description: "Rientro in hotel",
      },
    ],
    day2: [
      {
        time: "08:30",
        emoji: "☕",
        description: "Colazione e partenza per Montmartre",
        voucher: {
          text: "Indicazioni Metro",
          url: "#",
          details: "🚇 Metro 14 → Madeleine, poi cambio con Metro 12 → Abbesses. Durata totale: ~45 min",
        },
      },
      {
        time: "11:00",
        emoji: "🎨",
        description: "Free Tour Montmartre (fino alle 13:00)",
        voucher: {
          text: "Voucher Free Tour Montmartre",
          url: "#",
          imageUrl: "/placeholder-k285k.png",
          title: "Free Tour di Montmartre",
          meetingPoint: "Place Blanche, davanti al ristorante FIVE GUYS",
          arrivalTime: "Arrivare 15 minuti prima",
          details: "La guida avrà un cartello CIVITATIS e un ombrello verde",
        },
      },
      {
        time: "13:00",
        emoji: "🍽️",
        description: "Pausa pranzo e spostamento verso il Louvre",
        voucher: {
          text: "Indicazioni Metro",
          url: "#",
          details: "🚇 Metro 12 → Concorde, poi cambio con Metro 1 → Palais Royal – Musée du Louvre",
        },
      },
      {
        time: "14:00",
        emoji: "🏛️",
        description: "Visita al Museo del Louvre (fino alle 16:00)",
        voucher: {
          text: "Biglietti Louvre",
          url: "#",
          imageUrl: "/placeholder-wrbr2.png",
          title: "Biglietti Museo del Louvre",
          meetingPoint: "Entrée Carrousel o Pyramide",
          details: "Portare documento d'identità",
        },
      },
      {
        time: "16:00",
        emoji: "🚶",
        description: "Passeggiata: Giardini Tuileries, Place de la Concorde, Champs-Élysées",
      },
      {
        time: "17:00",
        emoji: "🛍️",
        description: "Tempo libero: shopping (Rue de Rivoli / Galeries Lafayette) o relax",
      },
      {
        time: "19:00",
        emoji: "🍽️",
        description: "Cena in zona Opéra o rientro in hotel",
      },
    ],
    day3: [
      {
        time: "09:30",
        emoji: "☕",
        description: "Colazione in hotel",
      },
      {
        time: "10:30",
        emoji: "📚",
        description: "Visita al Quartiere Latino",
        voucher: {
          text: "Voucher Free Tour Quartiere Latino",
          url: "#",
          imageUrl: "/latin-quarter-voucher.png",
          title: "Free Tour del Quartiere Latino",
          meetingPoint: "Fontana di Saint-Michel, Place Saint Michel",
          arrivalTime: "Arrivare 15 minuti prima",
          details: "La guida avrà un ombrello nero con logo giallo",
        },
      },
      {
        time: "13:30",
        emoji: "🍽️",
        description: "Pranzo in un bistrot",
      },
      {
        time: "16:00",
        emoji: "🗼",
        description: "Visita alla Torre Eiffel",
        voucher: {
          text: "Voucher Free Tour Torre Eiffel",
          url: "#",
          imageUrl: "/eiffel-arc-free-tour-voucher.png",
          title: "Free Tour nei dintorni della Torre Eiffel e Arco di Trionfo",
          meetingPoint: "Av. des Champs-Élysées, 152, davanti al negozio MONTBLANC",
          arrivalTime: "Arrivare 10 minuti prima",
          details: "La guida avrà un ombrello verde e un cartello CIVITATIS",
        },
      },
      {
        time: "19:00",
        emoji: "🚢",
        description: "Crociera sulla Senna",
        voucher: {
          text: "Voucher Crociera",
          url: "#",
          imageUrl: "/seine-river-cruise-voucher.png",
          title: "Crociera sulla Senna",
          meetingPoint: "Bateaux Parisiens, Port de la Bourdonnais, 75007 Paris",
          arrivalTime: "Presentarsi 15 minuti prima",
          details: "Non sarà possibile accedere alla barca con un bagaglio superiore ai 16 litri di volume",
        },
      },
      {
        time: "21:00",
        emoji: "🍽️",
        description: "Cena romantica",
      },
    ],
    day4: [
      {
        time: "09:00",
        emoji: "☕",
        description: "Colazione in hotel",
      },
      {
        time: "10:00",
        emoji: "🏨",
        description: "Check-out dall'hotel",
        voucher: {
          text: "Ricordati di lasciare la camera",
          url: "#",
          details: "Check-out entro le 12:00",
        },
      },
      {
        time: "11:00",
        emoji: "🛍️",
        description: "Shopping e passeggiata finale",
      },
      {
        time: "14:00",
        emoji: "🍽️",
        description: "Pranzo d'arrivederci",
      },
      {
        time: "16:00",
        emoji: "🚌",
        description: "Navetta per l'aeroporto",
      },
      {
        time: "19:30",
        emoji: "✈️",
        description: "Volo Paris BVA → Brindisi",
        voucher: {
          text: "Info Volo",
          url: "#",
          details:
            "Ryanair FR5678. Presentarsi in aeroporto almeno 2 ore prima della partenza. Bagaglio a mano incluso.",
        },
      },
    ],
  }
}
