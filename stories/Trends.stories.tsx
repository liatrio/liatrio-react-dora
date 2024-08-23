import React, { useState } from 'react'
import { StoryFn, Meta } from '@storybook/react'
import TrendGraph from '../src/TrendGraph'
import { ChartProps } from '../src/interfaces/propInterfaces'

import dataSet from './data'

export default {
  title: 'TrendGraph',
  component: TrendGraph,
} as Meta

const Template: StoryFn<ChartProps> = () => {
  const [data, setData] = useState<any>(dataSet[0])

  const args = {
    showIndividualTrends: true
  }

  const onChange = (event: any) => {
    setData(dataSet[event.target.value])
  }

  return (
    <div style={{height: "200px", width: "600px"}}>
      <select onChange={onChange}>
        <option value={0} selected>Low</option>
        <option value={1}>High</option>
        <option value={2}>Medium</option>
        <option value={3}>Elite</option>
        <option value={4}>Team</option>
      </select>
      <br/>
      <br/>
      <TrendGraph {...args} data={data} />
    </div>
  )
}

export const Example = Template.bind({})