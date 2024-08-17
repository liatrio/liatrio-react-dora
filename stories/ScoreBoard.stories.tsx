import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import ScoreBoard from '../src/ScoreBoard/ScoreBoard'
import { ChartProps } from '../src/Helpers'

import data from './data'

export default {
    title: 'ScoreBoard',
    component: ScoreBoard,
} as Meta

const Template: StoryFn<ChartProps> = (args: any) => (<div style={{height: "200px"}}><ScoreBoard {...args} /></div>)

export const Example = Template.bind({})

Example.args = {
    api: "",
    data: data,
    includeWeekends: false,
    showDetails: false,
    start: new Date(2024, 6, 16),
    end: new Date(2024, 7, 15)
}
