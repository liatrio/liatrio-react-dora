import React from 'react'
import { render, screen } from '@testing-library/react' 
import '@testing-library/jest-dom'
import ChangeFailureRate from '../src/ChangeFailureRate'

test('renders component', () => {
  render(<ChangeFailureRate  data={[]} />)
  const element = screen.getByTestId('ChangeFailureRate')
  expect(element).toBeInTheDocument()
})
