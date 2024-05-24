import React from 'react'
import { render, screen } from '@testing-library/react'
import ChangeFailureRate from '../src/ChangeFailureRate'
import '@testing-library/jest-dom'

test('renders component', () => {
    render(<ChangeFailureRate />)
    const element = screen.getByTestId('ChangeFailureRate')
    expect(element).toBeInTheDocument()
})
