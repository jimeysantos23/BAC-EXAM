export type FormProps = {
  onGenerate: (numbers: number[], lower: number, upper: number) => void
  onClear: () => void
}


export interface TableProps {
  rows: number[]
  lower?: number | null
  rowCount?: number
  selectedRow?: number | null
  onSelectRow?: (row: number | null) => void
}