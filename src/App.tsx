
import { useState } from 'react'
import Table from './componets/Table'
import Form from './componets/Form'
import './index.css'

function App() {
  const [rows, setRows] = useState<number[]>([])
  const [lower, setLower] = useState<number | null>(null)
  const [upper, setUpper] = useState<number | null>(null)
  const [selectedRow, setSelectedRow] = useState<number | null>(null)
  const [isClosed, setIsClosed] = useState(false)

  const [saveMessage, setSaveMessage] = useState<string | null>(null)
  const [showHistory, setShowHistory] = useState(false)
  const [history, setHistory] = useState<any[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)

  const saveHistory = async (
    lowerValue: number,
    upperValue: number,
    count: number,
    maxDiff: number,
    average: number,
  ) => {
    try {
      const response = await fetch('http://localhost:3000/historial', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lower: lowerValue,
          upper: upperValue,
          count,
          maxDiff,
          average,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al guardar el historial')
      }

      setSaveMessage('Historial guardado correctamente.')
    } catch (error) {
      console.error('Error guardando el historial en la base de datos:', error)
      setSaveMessage('Error guardando el historial. Revisa la consola.')
    }
  }

  const fetchHistory = async () => {
    setLoadingHistory(true)
    try {
      const res = await fetch('http://localhost:3000/historial')
      if (!res.ok) throw new Error('Error al obtener historial')
      const data = await res.json()
      setHistory(data)
    } catch (err) {
      console.error('Error obteniendo historial:', err)
      setHistory([])
    } finally {
      setLoadingHistory(false)
    }
  }

  const handleToggleHistory = async () => {
    const show = !showHistory
    setShowHistory(show)
    if (show) await fetchHistory()
  }

  const handleGenerate = (numbers: number[], lowerValue: number, upperValue: number) => {
    setRows(numbers)
    setLower(lowerValue)
    setUpper(upperValue)
    setSelectedRow(null)
    setSaveMessage(null)
  }

  const handleClear = () => {
    setRows([])
    setLower(null)
    setUpper(null)
    setSelectedRow(null)
  }
  const handleClose = () => setIsClosed(true)

  const diffs = rows.map((n, i) => (i === 0 ? 0 : Math.abs(n - rows[i - 1])))
  const maxDiff = diffs.length > 0 ? Math.max(...diffs) : null
  const avg = rows.length > 0 ? rows.reduce((a, b) => a + b, 0) / rows.length : null

  if (isClosed) {
    return (
      <div className="p-4 text-gray-600">
        <p>Contenido oculto.</p>
      </div>
    )
  }

  return (


    <div className="justify-center p-4 text-gray-600">
      <Form onGenerate={handleGenerate} onClear={handleClear} />
       <br />
       <br />
      <div className="ml-5">
        <Table rows={rows} lower={lower} selectedRow={selectedRow} onSelectRow={setSelectedRow} />
      </div>
     

      <div className="mt-4 space-y-1 text-sm text-gray-700">
        <p>Limite inferior: {lower ?? '-'}</p>
        <p>Limite superior: {upper ?? '-'}</p>
        <p>Cantidad de filas: {rows.length}</p>
        <p>Diferencia mayor: {maxDiff ?? '-'}</p>
        <p>Promedio num aleatorios: {avg !== null ? avg.toFixed(2) : '-'}</p>
        <p>Fila seleccionada tabla: {selectedRow !== null ? selectedRow + 1 : '-'}</p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => {
            if (lower === null || upper === null || maxDiff === null || avg === null) {
              setSaveMessage('No hay datos para guardar. Genera números primero.')
              return
            }
            void saveHistory(lower, upper, rows.length, maxDiff, avg)
          }}
          className="rounded bg-green-600 px-4 py-2 text-white disabled:opacity-60"
          disabled={rows.length === 0}
        >
          Guardar historial
        </button>

        <button
          type="button"
          onClick={() => {
            void handleToggleHistory()
          }}
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          {showHistory ? 'Ocultar historial' : 'Mostrar historial'}
        </button>

        <span className="text-sm text-gray-700">{saveMessage}</span>
      </div>

      {showHistory && (
        <div className="mt-4 overflow-auto max-h-64 border p-2">
          {loadingHistory ? (
            <p>Cargando historial...</p>
          ) : history.length === 0 ? (
            <p>No hay registros guardados.</p>
          ) : (
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left">
                  <th className="px-2">ID</th>
                  <th className="px-2">Limite Inferior</th>
                  <th className="px-2">Limite Superior</th>
                  <th className="px-2">Cantidad Filas</th>
                  <th className="px-2">Dif Mayor</th>
                  <th className="px-2">Promedio</th>
                </tr>
              </thead>
              <tbody>
                {history.map((h) => (
                  <tr key={h.id} className="border-t">
                    <td className="px-2 py-1">{h.id}</td>
                    <td className="px-2 py-1">{h.limite_inferior}</td>
                    <td className="px-2 py-1">{h.limite_superior}</td>
                    <td className="px-2 py-1">{h.cantidad_filas}</td>
                    <td className="px-2 py-1">{h.dif_mayor}</td>
                    <td className="px-2 py-1">{Number(h.promedio).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      <div className="mt-6">
        <button type="button" onClick={handleClose} className="rounded bg-red-500 px-4 py-2 text-white">
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default App
