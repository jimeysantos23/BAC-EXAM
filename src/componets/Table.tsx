import type { TableProps } from '../types'

export default function Table({
  rows,
  lower = null,
  rowCount = 5,
  selectedRow = null,
  onSelectRow,
}: TableProps) {
  const getDiff = (i: number): string => {
    if (i === 0) {
      if (lower !== null && rows[0] !== undefined) return String(Math.abs(rows[0] - lower))
      return '-'
    }
    if (rows[i] !== undefined && rows[i - 1] !== undefined) return String(Math.abs(rows[i] - rows[i - 1]))
    return '-'
  }

  const handleClickRow = (index: number, hasValue: boolean) => {
    if (!hasValue || !onSelectRow) return
    onSelectRow(index)
  }

  return (
    <div className="rounded p-2 shadow-sm">
      <table className="w-1/4 border-collapse center">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2 text-left">Número</th>
            <th className="border px-4 py-2 text-left">Diferencia</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rowCount }).map((_, i) => {
            const val = rows[i] !== undefined ? rows[i] : null
            const isSelected = selectedRow === i
            return (
              <tr
                key={i}
                className={isSelected ? 'bg-blue-100' : 'hover:bg-gray-50 cursor-pointer'}
                onClick={() => handleClickRow(i, val !== null)}
              >
                <td className="border px-4 py-2 text-sm">{val ?? '-'}</td>
                <td className="border px-4 py-2 text-sm">{val !== null ? getDiff(i) : '-'}</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}