import React from 'react'
import { render } from '@testing-library/react'
import ChangeLeadTime from '../src/ChangeLeadTime'
import '@testing-library/jest-dom'

test('renders component', () => {
    const { getByTestId } = render(<ChangeLeadTime />)
    const element = getByTestId('ChangeLeadTime')
    expect(element).toBeInTheDocument()
})
