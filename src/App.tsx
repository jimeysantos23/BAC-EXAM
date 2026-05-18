
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

  const handleGenerate = (numbers: number[], lowerValue: number, upperValue: number) => {
    setRows(numbers)
    setLower(lowerValue)
    setUpper(upperValue)
    setSelectedRow(null)
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
  const avg = rows.length > 0 ? Math.round(rows.reduce((a, b) => a + b, 0) / rows.length) : null

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
        <p>Promedio num aleatorios: {avg ?? '-'}</p>
        <p>Fila seleccionada tabla: {selectedRow !== null ? selectedRow + 1 : '-'}</p>
      </div>

      <div className="mt-6">
        <button type="button" onClick={handleClose} className="rounded bg-red-500 px-4 py-2 text-white">
          Cerrar
        </button>
      </div>
    </div>
  )
}

export default App
