import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import Trends from '../src/Trends'
import { ChartProps } from '../src/interfaces/propInterfaces'

import data from './data'

export default {
  title: 'Trends',
  component: Trends,
} as Meta

const Template: StoryFn<ChartProps> = (args: any) => (<div style={{height: "200px"}}><Trends {...args} /></div>)

export const Example = Template.bind({})

Example.args = {
  api: "",
  data: data,
  includeWeekends: false,
  showDetails: false,
  graphStart: new Date(2024, 6, 16),
  graphEnd: new Date(2024, 7, 15),
  showTrends: true
}
