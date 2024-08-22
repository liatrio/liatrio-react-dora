import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import ChangeLeadTime from '../src/ChangeLeadTime'

test('renders component', () => {
  render(<ChangeLeadTime  data={[]} />)
  const element = screen.getByTestId('ChangeLeadTime')
  expect(element).toBeInTheDocument()
})
