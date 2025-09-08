import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import { SuggestionForm } from '../SuggestionForm'
import { useTranslation } from '@/hooks/useTranslation'
import { api } from '@/lib/api'

vi.mock('@/hooks/useTranslation')
vi.mock('@/lib/api')

const mockUseTranslation = vi.mocked(useTranslation)
const mockApi = vi.mocked(api)

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

describe('SuggestionForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseTranslation.mockReturnValue({
      t: (key: string) => {
        const translations: Record<string, string> = {
          suggestMusic: 'Sugerir Música',
          musicTitle: 'Título da Música',
          youtubeUrl: 'URL do YouTube',
          reason: 'Motivo da Sugestão',
          submit: 'Enviar Sugestão',
          cancel: 'Cancelar',
          required: 'Campo obrigatório',
          invalidUrl: 'URL inválida',
          success: 'Música sugerida com sucesso!',
          error: 'Erro ao sugerir música',
        }
        return translations[key] || key
      },
      currentLanguage: { code: 'pt', name: 'Português', flag: '🇧🇷' },
      setLanguage: vi.fn(),
      availableLanguages: [],
    })

    mockApi.post.mockResolvedValue({
      data: {
        id: 1,
        title: 'Test Music',
        youtube_id: 'test123',
        thumb: 'test.jpg',
      },
    })
  })

  it('should render form with YouTube URL field', () => {
    render(<SuggestionForm />, { wrapper: createWrapper() })

    expect(screen.getByLabelText(/url do youtube/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/reason for suggestion/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument()
  })

  it('should render cancel button', () => {
    render(<SuggestionForm />, { wrapper: createWrapper() })

    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
  })

  it('should have form element', () => {
    render(<SuggestionForm />, { wrapper: createWrapper() })

    const formElement = document.querySelector('form')
    expect(formElement).toBeInTheDocument()
  })

  it('should have input fields with correct types', () => {
    render(<SuggestionForm />, { wrapper: createWrapper() })

    const urlInput = screen.getByLabelText(/url do youtube/i)
    const reasonInput = screen.getByLabelText(/reason for suggestion/i)

    expect(urlInput).toBeInTheDocument()
    expect(reasonInput).toBeInTheDocument()
    expect(urlInput.tagName).toBe('INPUT')
    expect(reasonInput.tagName).toBe('INPUT')
  })

  it('should have submit button with correct type', () => {
    render(<SuggestionForm />, { wrapper: createWrapper() })

    const submitButton = screen.getByRole('button', { name: /save/i })
    expect(submitButton).toHaveAttribute('type', 'submit')
  })

  it('should have cancel button with correct type', () => {
    render(<SuggestionForm />, { wrapper: createWrapper() })

    const cancelButton = screen.getByRole('button', { name: /cancelar/i })
    expect(cancelButton).toHaveAttribute('type', 'button')
  })
})
