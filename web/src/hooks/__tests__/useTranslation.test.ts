import { describe, it, expect, vi } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useTranslation } from '../useTranslation'

vi.mock('../../store/language', () => ({
  useLanguageStore: () => ({
    currentLanguage: { code: 'pt' },
    setLanguage: vi.fn()
  })
}))

describe('useTranslation', () => {
  it('should return translation function', () => {
    const { result } = renderHook(() => useTranslation())
    
    expect(result.current.t).toBeDefined()
    expect(typeof result.current.t).toBe('function')
  })

  it('should translate common keys', () => {
    const { result } = renderHook(() => useTranslation())
    
    expect(result.current.t('login')).toBe('Entrar')
    expect(result.current.t('register')).toBe('Registrar')
  })

  it('should return key if translation not found', () => {
    const { result } = renderHook(() => useTranslation())
    
    expect(result.current.t('nonexistent.key')).toBe('nonexistent.key')
  })

  it('should handle empty key', () => {
    const { result } = renderHook(() => useTranslation())
    
    expect(result.current.t('')).toBe('')
  })

  it('should handle undefined key', () => {
    const { result } = renderHook(() => useTranslation())
    
    expect(result.current.t(undefined as any)).toBe(undefined)
  })
})