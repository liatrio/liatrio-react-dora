import React from 'react'
import { render, screen } from '@testing-library/react'
import ChangeLeadTime from '../src/ChangeLeadTime/ChangeLeadTime'
import '@testing-library/jest-dom'

test('renders component', () => {
    render(<ChangeLeadTime api="" />)
    const element = screen.getByTestId('ChangeLeadTime')
    expect(element).toBeInTheDocument()
})
