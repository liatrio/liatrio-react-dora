import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import ChangeLeadTime from '../src/ChangeLeadTime'
import { ChartProps } from '../src/interfaces/propInterfaces'

import data from './data'

export default {
  title: 'ChangeLeadTime',
  component: ChangeLeadTime,
} as Meta

const Template: StoryFn<ChartProps> = (args: any) => <div style={{height: "200px", width: "600px"}}><ChangeLeadTime {...args} /></div>

export const Example = Template.bind({})

Example.args = {
  api: "",
  data: data,
  graphStart: new Date(2024, 6, 16),
  graphEnd: new Date(2024, 7, 15)
}
