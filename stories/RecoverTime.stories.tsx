import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import RecoverTime from '../src/RecoverTime'
import { ChartProps } from '../src/Helpers'

import data from './data'

export default {
    title: 'RecoverTime',
    component: RecoverTime,
} as Meta

const Template: StoryFn<ChartProps> = (args: any) => (<div style={{height: "400px", width: "600px"}}><RecoverTime {...args} /></div>)

export const Example = Template.bind({})

Example.args = {
    api: "",
    data: data,
    start: new Date(2024, 6, 16),
    end: new Date(2024, 7, 15),
    message: "Please Select a Team"
}