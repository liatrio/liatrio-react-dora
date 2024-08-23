import React, { useState } from 'react'
import { StoryFn, Meta } from '@storybook/react'
import ChangeFailureRate from '../src/ChangeFailureRate'
import { ChartProps } from '../src/interfaces/propInterfaces'

import dataSet from './data'

export default {
  title: 'ChangeFailureRate',
  component: ChangeFailureRate,
} as Meta

const Template: StoryFn<ChartProps> = () => {
  const [data, setData] = useState<any>(dataSet[0])

  const args = {
    showWeekends: true,
    graphStart: new Date(2024, 6, 16),
    graphEnd: new Date(2024, 7, 15)
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
      <ChangeFailureRate {...args} data={data} />
    </div>
  )
}

export const Example = Template.bind({})

Example.args = {
  api: "",
  data: dataSet[0],
  graphStart: new Date(2024, 6, 16),
  graphEnd: new Date(2024, 7, 15)
}
