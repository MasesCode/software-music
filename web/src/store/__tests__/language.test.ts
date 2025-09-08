import { describe, it, expect, beforeEach } from 'vitest'
import { useLanguageStore, languages } from '../language'

describe('Language Store', () => {
  beforeEach(() => {
    useLanguageStore.getState().setLanguage(languages[0])
  })

  it('should initialize with Portuguese as default', () => {
    const state = useLanguageStore.getState()
    expect(state.currentLanguage.code).toBe('pt')
  })

  it('should change language to English', () => {
    const { setLanguage } = useLanguageStore.getState()
    setLanguage(languages[1])
    
    const state = useLanguageStore.getState()
    expect(state.currentLanguage.code).toBe('en')
  })

  it('should change language to Spanish', () => {
    const { setLanguage } = useLanguageStore.getState()
    setLanguage(languages[2])
    
    const state = useLanguageStore.getState()
    expect(state.currentLanguage.code).toBe('es')
  })

  it('should have all required languages available', () => {
    expect(languages).toHaveLength(3)
    expect(languages[0].code).toBe('pt')
    expect(languages[1].code).toBe('en')
    expect(languages[2].code).toBe('es')
  })

  it('should persist language changes', () => {
    const { setLanguage } = useLanguageStore.getState()
    
    setLanguage(languages[1])
    expect(useLanguageStore.getState().currentLanguage.code).toBe('en')
    
    setLanguage(languages[2])
    expect(useLanguageStore.getState().currentLanguage.code).toBe('es')
    
    setLanguage(languages[0])
    expect(useLanguageStore.getState().currentLanguage.code).toBe('pt')
  })
})
