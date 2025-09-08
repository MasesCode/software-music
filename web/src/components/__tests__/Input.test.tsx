import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from '../ui/input'

describe('Input Component', () => {
  it('should render input with placeholder', () => {
    render(<Input placeholder="Enter text" />)
    
    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('should render input with value', () => {
    render(<Input value="test value" onChange={() => {}} />)
    
    expect(screen.getByDisplayValue('test value')).toBeInTheDocument()
  })

  it('should render input with different types', () => {
    const { rerender } = render(<Input type="text" placeholder="Text" />)
    expect(screen.getByPlaceholderText('Text')).toHaveAttribute('type', 'text')
    
    rerender(<Input type="email" placeholder="Email" />)
    expect(screen.getByPlaceholderText('Email')).toHaveAttribute('type', 'email')
    
    rerender(<Input type="password" placeholder="Password" />)
    expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password')
  })

  it('should be disabled when disabled prop is true', () => {
    render(<Input disabled placeholder="Disabled" />)
    
    const input = screen.getByPlaceholderText('Disabled')
    expect(input).toBeDisabled()
  })

  it('should accept custom className', () => {
    render(<Input className="custom-class" placeholder="Custom" />)
    
    const input = screen.getByPlaceholderText('Custom')
    expect(input).toHaveClass('custom-class')
  })

  it('should render with onChange prop', () => {
    const handleChange = vi.fn()
    render(<Input onChange={handleChange} placeholder="Test" />)
    
    const input = screen.getByPlaceholderText('Test')
    expect(input).toBeInTheDocument()
    expect(handleChange).toBeDefined()
  })

  it('should have correct name attribute', () => {
    render(<Input name="test-input" placeholder="Named input" />)
    
    const input = screen.getByPlaceholderText('Named input')
    expect(input).toHaveAttribute('name', 'test-input')
  })

  it('should have correct id attribute', () => {
    render(<Input id="test-id" placeholder="ID input" />)
    
    const input = screen.getByPlaceholderText('ID input')
    expect(input).toHaveAttribute('id', 'test-id')
  })
})
