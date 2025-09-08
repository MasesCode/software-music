import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useSafeArray } from '../useSafeArray'

describe('useSafeArray', () => {
  it('should return safe array object when input is null', () => {
    const { result } = renderHook(() => useSafeArray(null as any))
    expect(result.current.array).toEqual(null)
    expect(result.current.isEmpty).toBe(true)
    expect(result.current.length).toBe(0)
  })

  it('should return safe array object when input is undefined', () => {
    const { result } = renderHook(() => useSafeArray(undefined as any))
    expect(result.current.array).toEqual([])
    expect(result.current.isEmpty).toBe(true)
    expect(result.current.length).toBe(0)
  })

  it('should return the array when input is a valid array', () => {
    const testArray = [1, 2, 3, 4, 5]
    const { result } = renderHook(() => useSafeArray(testArray))
    expect(result.current.array).toEqual(testArray)
    expect(result.current.isEmpty).toBe(false)
    expect(result.current.length).toBe(5)
  })

  it('should return safe array object when input is not an array', () => {
    const { result } = renderHook(() => useSafeArray('not an array' as any))
    expect(result.current.array).toEqual('not an array')
    expect(result.current.isEmpty).toBe(true)
    expect(result.current.length).toBe(0)
  })

  it('should handle empty array', () => {
    const { result } = renderHook(() => useSafeArray([]))
    expect(result.current.array).toEqual([])
    expect(result.current.isEmpty).toBe(true)
    expect(result.current.length).toBe(0)
  })
})
