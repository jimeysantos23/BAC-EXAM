import { useState } from 'react'
import type { FormProps } from '../types'

export default function Form({ onGenerate, onClear }: FormProps) {
  const [lowerLimit, setLowerLimit] = useState('')
  const [upperLimit, setUpperLimit] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  const validate = () => {
    const validationErrors: string[] = []
    const lowerValue = Number(lowerLimit)
    const upperValue = Number(upperLimit)

    if (lowerLimit.trim() === '' || upperLimit.trim() === '') {
      validationErrors.push('Ambos límites son obligatorios.')
    }

    if (Number.isNaN(lowerValue) || Number.isNaN(upperValue)) {
      validationErrors.push('Solo se permiten números en ambos límites.')
    }

    if (!Number.isNaN(lowerValue) && lowerValue <= 0) {
      validationErrors.push('El límite inferior debe ser mayor que 0.')
    }

    if (!Number.isNaN(upperValue) && upperValue <= 0) {
      validationErrors.push('El límite superior debe ser mayor que 0.')
    }

    if (
      !Number.isNaN(lowerValue) &&
      !Number.isNaN(upperValue) &&
      upperValue < lowerValue + 50
    ) {
      validationErrors.push(
        'El límite superior debe ser al menos 50 números mayor que el inferior.',
      )
    }

    setErrors(validationErrors)
    return validationErrors.length === 0
  }

  const generateRandomNumbers = (min: number, max: number, count = 5) => {
    const nums: number[] = []
    for (let i = 0; i < count; i++) {
      const n = Math.floor(Math.random() * (max - min + 1)) + min
      nums.push(n)
    }
    return nums
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    const lowerValue = Number(lowerLimit)
    const upperValue = Number(upperLimit)
    const numbers = generateRandomNumbers(lowerValue, upperValue, 5)

    onGenerate(numbers, lowerValue, upperValue)
  }

  const handleClear = () => {
    setLowerLimit('')
    setUpperLimit('')
    setErrors([])
    onClear()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded  p-4 shadow-sm">
      <div className="space-y-2">
        <label htmlFor="input1" className="block text-sm font-medium">
          Límite Inferior
        </label>
        <input
          type="number"
          id="input1"
          min="1"
          value={lowerLimit}
          onChange={(event) => setLowerLimit(event.target.value)}
          className="w-1/4 rounded border px-3 py-2"
          placeholder="Ingresa un número mayor a 0"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="input2" className="block text-sm font-medium">
          Límite Superior
        </label>
        <input
          type="number"
          id="input2"
          min="1"
          value={upperLimit}
          onChange={(event) => setUpperLimit(event.target.value)}
          className="w-1/4 rounded border px-3 py-2"
          placeholder="Debe ser al menos 50 mayor que el inferior"
        />
      </div>

      {errors.length > 0 && (
        <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          <ul className="list-disc space-y-1 pl-5">
            {errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex flex-wrap gap-3 pt-2">
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Boton Generar
        </button>
        <button
          type="button"
          onClick={handleClear}
          className="rounded bg-gray-200 px-4 py-2 text-gray-800"
        >
          Boton Limpiar
        </button>
      </div>
    </form>
  )
}
