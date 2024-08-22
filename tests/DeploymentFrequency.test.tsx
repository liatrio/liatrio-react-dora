import React from 'react'
import { render, screen } from '@testing-library/react'
import DeploymentFrequency from '../src/DeploymentFrequency'
import '@testing-library/jest-dom'

test('renders component', () => {
  render(<DeploymentFrequency data={[]} />)
  const element = screen.getByTestId('DeploymentFrequency')
  expect(element).toBeInTheDocument()
})
