import { describe, it, expect, vi } from 'vitest'
import { getErrorMessage } from '../errorHandler'
import { ApiError } from '../api'

describe('Error Handler', () => {
  describe('getErrorMessage', () => {
    it('should handle ApiError with 422 validation errors', () => {
      const error = new ApiError('Validation failed', 422, {
        errors: {
          email: ['Email is required'],
          password: ['Password is too short']
        }
      })
      
      const result = getErrorMessage(error, (key: string) => key)
      expect(result).toBe('Email is required')
    })

    it('should handle ApiError with 403 status', () => {
      const error = new ApiError('Forbidden', 403)
      
      const result = getErrorMessage(error, (key: string) => key)
      expect(result).toBe('cannotContributeOwnMusic')
    })

    it('should handle standard Error', () => {
      const error = new Error('Standard error message')
      
      const result = getErrorMessage(error, (key: string) => key)
      expect(result).toBe('Standard error message')
    })

    it('should handle string error', () => {
      const error = 'String error message'
      
      const result = getErrorMessage(error, (key: string) => key)
      expect(result).toBe('errorGeneric')
    })

    it('should handle unknown error type', () => {
      const error = { someProperty: 'value' }
      
      const result = getErrorMessage(error, (key: string) => key)
      expect(result).toBe('errorGeneric')
    })

    it('should handle null/undefined error', () => {
      const result1 = getErrorMessage(null, (key: string) => key)
      const result2 = getErrorMessage(undefined, (key: string) => key)
      
      expect(result1).toBe('errorGeneric')
      expect(result2).toBe('errorGeneric')
    })

    it('should use translation function for generic error', () => {
      const mockT = vi.fn((key: string) => `translated_${key}`)
      
      const result = getErrorMessage(null, mockT)
      
      expect(mockT).toHaveBeenCalledWith('errorGeneric')
      expect(result).toBe('translated_errorGeneric')
    })
  })
})