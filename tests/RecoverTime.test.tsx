import React from 'react'
import { render } from '@testing-library/react'
import RecoverTime from '../src/RecoverTime'
import '@testing-library/jest-dom'

test('renders component with text', () => {
    const { getByTestId } = render(<RecoverTime />)
    const element = getByTestId('RecoverTime')
    expect(element).toBeInTheDocument()
})
