import { useState } from 'react'
import Table from './componets/Table'
import Form from './componets/Form'
import './index.css'

function AppNew() {
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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="rounded-lg bg-white p-8 shadow-md">
          <p className="text-center text-gray-500">Contenido oculto.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Generador de Números Aleatorios
        </h1>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
          <Form onGenerate={handleGenerate} onClear={handleClear} />
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Resultados</h2>
          <div className="flex justify-center">
            <Table rows={rows} lower={lower} selectedRow={selectedRow} onSelectRow={setSelectedRow} />
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-lg font-semibold text-gray-700">Estadísticas</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="rounded-md bg-gray-50 p-3">
              <span className="text-sm text-gray-500">Límite inferior</span>
              <p className="text-lg font-medium text-gray-800">{lower ?? '-'}</p>
            </div>
            <div className="rounded-md bg-gray-50 p-3">
              <span className="text-sm text-gray-500">Límite superior</span>
              <p className="text-lg font-medium text-gray-800">{upper ?? '-'}</p>
            </div>
            <div className="rounded-md bg-gray-50 p-3">
              <span className="text-sm text-gray-500">Cantidad de filas</span>
              <p className="text-lg font-medium text-gray-800">{rows.length}</p>
            </div>
            <div className="rounded-md bg-gray-50 p-3">
              <span className="text-sm text-gray-500">Diferencia mayor</span>
              <p className="text-lg font-medium text-gray-800">{maxDiff ?? '-'}</p>
            </div>
            <div className="rounded-md bg-gray-50 p-3">
              <span className="text-sm text-gray-500">Promedio</span>
              <p className="text-lg font-medium text-gray-800">{avg !== null ? avg.toFixed(2) : '-'}</p>
            </div>
            <div className="rounded-md bg-gray-50 p-3">
              <span className="text-sm text-gray-500">Fila seleccionada</span>
              <p className="text-lg font-medium text-gray-800">{selectedRow !== null ? selectedRow + 1 : '-'}</p>
            </div>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-white p-6 shadow-lg">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => {
                if (lower === null || upper === null || maxDiff === null || avg === null) {
                  setSaveMessage('No hay datos para guardar. Genera números primero.')
                  return
                }
                void saveHistory(lower, upper, rows.length, maxDiff, avg)
              }}
              className="rounded-lg bg-emerald-600 px-6 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700 disabled:opacity-50"
              disabled={rows.length === 0}
            >
              Guardar historial
            </button>

            <button
              type="button"
              onClick={() => { void handleToggleHistory() }}
              className="rounded-lg bg-blue-600 px-6 py-2.5 font-medium text-white shadow-sm transition hover:bg-blue-700"
            >
              {showHistory ? 'Ocultar historial' : 'Mostrar historial'}
            </button>

            <button
              type="button"
              onClick={handleClose}
              className="rounded-lg bg-red-500 px-6 py-2.5 font-medium text-white shadow-sm transition hover:bg-red-600"
            >
              Cerrar
            </button>
          </div>

          {saveMessage && (
            <p className="mt-4 text-center text-sm text-gray-600">{saveMessage}</p>
          )}
        </div>

        {showHistory && (
          <div className="rounded-xl bg-white p-6 shadow-lg">
            <h2 className="mb-4 text-lg font-semibold text-gray-700">Historial</h2>
            <div className="max-h-72 overflow-auto">
              {loadingHistory ? (
                <p className="text-center text-gray-500">Cargando historial...</p>
              ) : history.length === 0 ? (
                <p className="text-center text-gray-500">No hay registros guardados.</p>
              ) : (
                <table className="w-full table-auto text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200 text-left">
                      <th className="whitespace-nowrap px-3 py-2 font-semibold text-gray-600">ID</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold text-gray-600">Límite Inferior</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold text-gray-600">Límite Superior</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold text-gray-600">Cantidad Filas</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold text-gray-600">Dif Mayor</th>
                      <th className="whitespace-nowrap px-3 py-2 font-semibold text-gray-600">Promedio</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((h) => (
                      <tr key={h.id} className="border-b border-gray-100 transition hover:bg-gray-50">
                        <td className="whitespace-nowrap px-3 py-2">{h.id}</td>
                        <td className="whitespace-nowrap px-3 py-2">{h.limite_inferior}</td>
                        <td className="whitespace-nowrap px-3 py-2">{h.limite_superior}</td>
                        <td className="whitespace-nowrap px-3 py-2">{h.cantidad_filas}</td>
                        <td className="whitespace-nowrap px-3 py-2">{h.dif_mayor}</td>
                        <td className="whitespace-nowrap px-3 py-2">{Number(h.promedio).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-gray-400">BAC-EXAM</p>
      </div>
    </div>
  )
}

export default AppNew
