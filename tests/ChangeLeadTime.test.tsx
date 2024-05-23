import React from 'react'
import { render } from '@testing-library/react'
import ChangeLeadTime from '../src/ChangeLeadTime/ChangeLeadTime'
import '@testing-library/jest-dom'

test('renders component', () => {
    const { getByTestId } = render(<ChangeLeadTime api="" />)
    const element = getByTestId('ChangeLeadTime')
    expect(element).toBeInTheDocument()
})
