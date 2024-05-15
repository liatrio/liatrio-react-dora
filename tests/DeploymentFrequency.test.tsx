import React from 'react'
import { render } from '@testing-library/react'
import DeploymentFrequency from '../src/DeploymentFrequency'
import '@testing-library/jest-dom'

test('renders component', () => {
    const { getByTestId } = render(<DeploymentFrequency api="" repositories={[]} />)
    const element = getByTestId('DeploymentFrequency')
    expect(element).toBeInTheDocument()
})
