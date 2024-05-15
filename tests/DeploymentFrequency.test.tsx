import React from 'react'
import { render } from '@testing-library/react'
import DeploymentFrequency from '../src/DeploymentFrequency'
import '@testing-library/jest-dom'

test('renders component with text', () => {
    const { getByTestId } = render(<DeploymentFrequency />)
    const element = getByTestId('DeploymentFrequency')
    expect(element).toBeInTheDocument()
})
