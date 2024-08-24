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
  const [showIndividualTrends, setShowIndividualTrends] = useState<boolean>(false)

  const changeDataSet = (event: any) => {
    setData(dataSet[event.target.value])
  }

  const changeShowMetricTrends = (event: any) => {
    setShowIndividualTrends(event.target.checked)
  }

  return (
    <div className="graphContainer">
      <div className="editor">
        <div className="editorFieldContainer">
          <label>Data Set:</label>
          <select onChange={changeDataSet}>
            <option value={0} selected>Low</option>
            <option value={1}>Medium</option>
            <option value={2}>High</option>
            <option value={3}>Elite</option>
            <option value={4}>Team</option>
          </select>
        </div>
        <div className="editorFieldContainer">
          <label>Show Metric Trends:</label>
          <input type='checkbox' checked={showIndividualTrends} onChange={changeShowMetricTrends} />
        </div>
      </div>
      <br/>
      <br/>
      <TrendGraph showIndividualTrends={showIndividualTrends} data={data} />
    </div>
  )
}

export const Example = Template.bind({})