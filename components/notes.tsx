export function Notes() {
  return (
    <div className="w-full bg-white rounded-xl shadow-md p-5 mb-6">
      <h2 className="text-2xl font-bold text-[#2a4d7f] mb-4">
        📝 <span className="ml-2">Note Importanti</span>
      </h2>
      <ul className="space-y-3 text-lg">
        <li className="flex">
          <span className="mr-2">📱</span>
          <span>Numero di emergenza: 112</span>
        </li>
        <li className="flex">
          <span className="mr-2">🏨</span>
          <span>Hotel Campanile: 33144677575</span>
        </li>
        <li className="flex">
          <span className="mr-2">🚇</span>
          <span>Metro: acquistare carnet da 10 biglietti (più economico)</span>
        </li>
        <li className="flex">
          <span className="mr-2">🚶</span>
          <span>Scarpe comode per le lunghe camminate</span>
        </li>
        <li className="flex">
          <span className="mr-2">💶</span>
          <span>Portare contanti per i free tour (mancia a discrezione)</span>
        </li>
        <li className="flex">
          <span className="mr-2">🔌</span>
          <span>Adattatore per prese elettriche francesi</span>
        </li>
        <li className="flex">
          <span className="mr-2">☂️</span>
          <span>Controllare meteo prima di partire</span>
        </li>
        <li className="flex">
          <span className="mr-2">🧳</span>
          <span>Per la crociera: non portare bagagli superiori a 16 litri</span>
        </li>
        <li className="flex">
          <span className="mr-2">🗺️</span>
          <span>Scaricare mappa offline di Parigi sul telefono</span>
        </li>
        <li className="flex">
          <span className="mr-2">✈️</span>
          <span>Voucher dei voli forniti separatamente</span>
        </li>
      </ul>
    </div>
  )
}
