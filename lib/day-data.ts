type Event = {
  time: string
  emoji: string
  description: string
  voucher?: {
    text: string
    url?: string
    imageUrl?: string
    title?: string
    details?: string
    meetingPoint?: string
    arrivalTime?: string
  }
  transportation?: {
    type: "metro" | "walk" | "bus" | "shuttle"
    details: string
    duration: string
    destination?: string
  }
}

type DayData = {
  [key: string]: Event[]
}

export function getDayData(): DayData {
  return {
    day1: [
      {
        time: "09:40",
        emoji: "✈️",
        description: "Partenza da Brindisi (BDS) con volo per Parigi Beauvais",
        voucher: {
          text: "Apri PDF",
          url: "/pdfs/volo-andata.pdf",
          title: "Volo Brindisi → Parigi Beauvais",
          details: "Ryanair FR123 • Posto: 15A, 15B, 15C",
        },
      },
      {
        time: "12:00",
        emoji: "🛬",
        description: "Arrivo a Parigi Beauvais (BVA)",
      },
      {
        time: "12:30",
        emoji: "🚌",
        description: "Trasferimento a Parigi centro (navetta Beauvais + metro per Bercy)",
        transportation: {
          type: "shuttle",
          details: "Navetta aeroportuale + Metro linea 14",
          duration: "2 ore",
          destination: "Parigi centro",
        },
      },
      {
        time: "15:00",
        emoji: "🏨",
        description: "Arrivo e check-in presso Campanile Hotel Paris Bercy Village",
        voucher: {
          text: "Apri PDF",
          url: "/pdfs/hotel-voucher.pdf",
          title: "Campanile Hotel Paris Bercy Village",
          details:
            "Prenotazione: 3 notti, 2 camere doppie\nIndirizzo: 177 Boulevard de Bercy, 75012 Paris\nTelefono: +33 1 43 46 65 50",
        },
      },
      {
        time: "17:00",
        emoji: "🚶",
        description: "Partenza per il tour dei misteri",
        transportation: {
          type: "metro",
          details: "Metro 14 da Cour Saint-Émilion a Châtelet, poi a piedi fino al punto d'incontro",
          duration: "25 min",
          destination: "Île de la Cité",
        },
      },
      {
        time: "18:00",
        emoji: "🕵️",
        description: "Free Tour Misteri e Leggende di Parigi",
        voucher: {
          text: "Apri PDF",
          url: "/pdfs/tour-misteri.pdf",
          title: "Free Tour Misteri e Leggende di Parigi",
          details: "Durata: 2 ore\nLingua: Italiano\nGuida: Ombrello nero con logo giallo",
          meetingPoint: "Davanti alla statua di Carlo Magno, Notre-Dame",
          arrivalTime: "17:45 (15 min prima)",
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
        emoji: "🥐",
        description: "Colazione e partenza per Montmartre",
        transportation: {
          type: "metro",
          details: "Metro 14 → Madeleine, poi cambio con Metro 12 → Abbesses",
          duration: "45 min",
          destination: "Montmartre",
        },
      },
      {
        time: "11:00",
        emoji: "🎨",
        description: "Free Tour Montmartre (Sacré-Cœur, Place du Tertre, curiosità artistiche)",
        voucher: {
          text: "Apri PDF",
          url: "/pdfs/tour-montmartre.pdf",
          title: "Free Tour Montmartre",
          details: "Durata: 2 ore\nLingua: Italiano\nGuida: Ombrello nero con logo giallo",
          meetingPoint: "Place Blanche, davanti al ristorante FIVE GUYS",
          arrivalTime: "10:45 (15 min prima)",
        },
      },
      {
        time: "13:00",
        emoji: "☕",
        description: "Pausa + spostamento verso il Louvre",
        transportation: {
          type: "metro",
          details: "Metro 12 → Concorde, poi cambio con Metro 1 → Palais Royal – Musée du Louvre",
          duration: "30 min",
          destination: "Louvre",
        },
      },
      {
        time: "14:00",
        emoji: "🖼️",
        description: "Visita al Museo del Louvre",
        voucher: {
          text: "Apri PDF",
          url: "/pdfs/louvre-tickets.pdf",
          title: "Biglietti Museo del Louvre",
          details:
            "Durata consigliata: 2 ore\nIngresso: Piramide principale\nInclude: Accesso a tutte le collezioni permanenti",
          arrivalTime: "13:45 (15 min prima)",
        },
      },
      {
        time: "16:00",
        emoji: "🚶",
        description: "Passeggiata: Giardini delle Tuileries, Place de la Concorde, inizio Champs-Élysées",
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
        time: "09:45",
        emoji: "🚶",
        description: "Partenza per il Quartiere Latino",
        transportation: {
          type: "metro",
          details: "Metro 14 → Châtelet, poi a piedi fino al punto d'incontro",
          duration: "30 min",
          destination: "Quartiere Latino",
        },
      },
      {
        time: "10:30",
        emoji: "📚",
        description: "Free Tour Quartiere Latino (Sorbona, Pantheon, Notre-Dame)",
        voucher: {
          text: "Apri PDF",
          url: "/pdfs/tour-quartiere-latino.pdf",
          title: "Free Tour Quartiere Latino",
          details: "Durata: 2 ore\nLingua: Italiano\nGuida: Ombrello nero con logo giallo",
          meetingPoint: "Fontana Saint-Michel, Place Saint-Michel",
          arrivalTime: "10:15 (15 min prima)",
        },
      },
      {
        time: "12:30",
        emoji: "🥗",
        description: "Pranzo in zona Jardin du Luxembourg",
      },
      {
        time: "14:30",
        emoji: "🚇",
        description: "Spostamento verso la Torre Eiffel",
        transportation: {
          type: "metro",
          details: "Metro 4 → Strasbourg–Saint-Denis, poi cambio con Metro 9 → Trocadéro",
          duration: "30 min",
          destination: "Torre Eiffel",
        },
      },
      {
        time: "16:00",
        emoji: "🗼",
        description: "Free Tour Torre Eiffel e dintorni",
        voucher: {
          text: "Apri PDF",
          url: "/pdfs/tour-eiffel.pdf",
          title: "Free Tour Torre Eiffel",
          details: "Durata: 2 ore\nLingua: Italiano\nGuida: Ombrello nero con logo giallo",
          meetingPoint: "Piazza del Trocadéro, davanti alla statua equestre",
          arrivalTime: "15:45 (15 min prima)",
        },
      },
      {
        time: "18:00",
        emoji: "🚢",
        description: "Crociera sulla Senna",
        voucher: {
          text: "Apri PDF",
          url: "/pdfs/crociera-senna.pdf",
          title: "Crociera sulla Senna",
          details: "Durata: 1 ora\nCompagnia: Bateaux Parisiens\nImbarco: Pontile ai piedi della Torre Eiffel",
          arrivalTime: "17:45 (15 min prima)",
        },
      },
      {
        time: "19:00",
        emoji: "🍽️",
        description: "Cena in zona Torre Eiffel o picnic al Champ de Mars",
      },
      {
        time: "21:00",
        emoji: "🏨",
        description: "Rientro in hotel",
      },
    ],
    day4: [
      {
        time: "08:30",
        emoji: "🥐",
        description: "Colazione e passeggiata a Bercy Village",
      },
      {
        time: "10:30",
        emoji: "🧳",
        description: "Ritiro bagagli e partenza verso Beauvais",
      },
      {
        time: "12:00",
        emoji: "🚌",
        description: "Trasferimento a Aeroporto di Parigi Beauvais (BVA)",
        transportation: {
          type: "shuttle",
          details: "Metro + Navetta aeroportuale",
          duration: "3 ore e 30 min",
          destination: "Aeroporto di Beauvais",
        },
      },
      {
        time: "17:20",
        emoji: "✈️",
        description: "Volo di ritorno per Brindisi",
        voucher: {
          text: "Apri PDF",
          url: "/pdfs/volo-ritorno.pdf",
          title: "Volo Parigi Beauvais → Brindisi",
          details: "Ryanair FR456 • Posto: 15A, 15B, 15C",
        },
      },
    ],
  }
}
