import { describe, it, expect } from 'vitest'
import { translations } from '../translations'

describe('Translations', () => {
  describe('translations object', () => {
    it('should have Portuguese translations', () => {
      expect(translations.pt).toBeDefined()
      expect(translations.pt.login).toBe('Entrar')
      expect(translations.pt.register).toBe('Registrar')
    })

    it('should have English translations', () => {
      expect(translations.en).toBeDefined()
      expect(translations.en.login).toBe('Login')
      expect(translations.en.register).toBe('Register')
    })

    it('should have Spanish translations', () => {
      expect(translations.es).toBeDefined()
      expect(translations.es.login).toBe('Iniciar sesión')
      expect(translations.es.register).toBe('Registrarse')
    })

    it('should have all required keys in all languages', () => {
      const requiredKeys = [
        'login', 'register', 'logout', 'email', 'password',
        'confirmPassword', 'suggestions', 'users', 'logs',
        'title', 'artist', 'cancel', 'edit', 'delete', 'save',
        'search', 'loading', 'error', 'success'
      ]
      
      requiredKeys.forEach(key => {
        expect(translations.pt).toHaveProperty(key)
        expect(translations.en).toHaveProperty(key)
        expect(translations.es).toHaveProperty(key)
      })
    })

    it('should have consistent structure across languages', () => {
      const ptKeys = Object.keys(translations.pt)
      const enKeys = Object.keys(translations.en)
      const esKeys = Object.keys(translations.es)
      
      expect(ptKeys.length).toBeGreaterThan(0)
      expect(enKeys.length).toBe(ptKeys.length)
      expect(esKeys.length).toBe(ptKeys.length)
    })
  })
})
