import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import Board from '../src/Boards/Board'
import { ChartProps } from '../src/interfaces/propInterfaces'

import data from './data'

export default {
    title: 'Board',
    component: Board,
} as Meta

const Template: StoryFn<ChartProps> = (args: any) => (<div style={{height: "200px"}}><Board {...args} /></div>)

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
