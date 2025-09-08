import { describe, it, expect } from 'vitest'
import { extractYouTubeId, isValidYouTubeUrl, getYouTubeThumbnail } from '../youtube'

describe('YouTube Utils', () => {
  describe('extractYouTubeId', () => {
    it('should extract ID from standard YouTube URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      const result = extractYouTubeId(url)
      expect(result).toBe('dQw4w9WgXcQ')
    })

    it('should extract ID from short YouTube URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ'
      const result = extractYouTubeId(url)
      expect(result).toBe('dQw4w9WgXcQ')
    })

    it('should return null for invalid URL', () => {
      const url = 'https://www.google.com'
      const result = extractYouTubeId(url)
      expect(result).toBeNull()
    })

    it('should return null for empty string', () => {
      const url = ''
      const result = extractYouTubeId(url)
      expect(result).toBeNull()
    })
  })

  describe('isValidYouTubeUrl', () => {
    it('should return true for valid YouTube URL', () => {
      const url = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
      const result = isValidYouTubeUrl(url)
      expect(result).toBe(true)
    })

    it('should return true for valid short YouTube URL', () => {
      const url = 'https://youtu.be/dQw4w9WgXcQ'
      const result = isValidYouTubeUrl(url)
      expect(result).toBe(true)
    })

    it('should return false for invalid URL', () => {
      const url = 'https://www.google.com'
      const result = isValidYouTubeUrl(url)
      expect(result).toBe(false)
    })

    it('should return false for empty string', () => {
      const url = ''
      const result = isValidYouTubeUrl(url)
      expect(result).toBe(false)
    })
  })

  describe('getYouTubeThumbnail', () => {
    it('should return high quality thumbnail URL', () => {
      const videoId = 'dQw4w9WgXcQ'
      const result = getYouTubeThumbnail(videoId)
      expect(result).toBe('https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg')
    })

    it('should handle empty video ID', () => {
      const videoId = ''
      const result = getYouTubeThumbnail(videoId)
      expect(result).toBe('https://img.youtube.com/vi//hqdefault.jpg')
    })
  })
})
