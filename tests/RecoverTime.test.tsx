import React from 'react'
import { render, screen } from '@testing-library/react'
import RecoverTime from '../src/RecoverTime'
import '@testing-library/jest-dom'

test('renders component', () => {
    render(<RecoverTime />)
    const element = screen.getByTestId('RecoverTime')
    expect(element).toBeInTheDocument()
})
