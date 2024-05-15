import React from 'react'
import { render } from '@testing-library/react'
import ChangeFailureRate from '../src/ChangeFailureRate'
import '@testing-library/jest-dom'

test('renders component', () => {
    const { getByTestId } = render(<ChangeFailureRate />)
    const element = getByTestId('ChangeFailureRate')
    expect(element).toBeInTheDocument()
})
