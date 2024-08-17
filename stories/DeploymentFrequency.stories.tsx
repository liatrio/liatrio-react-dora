import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import DeploymentFrequency from '../src/DeploymentFrequency'
import { ChartProps } from '../src/Helpers'

import data from './data'

export default {
    title: 'DeploymentFrequency',
    component: DeploymentFrequency,
} as Meta

const Template: StoryFn<ChartProps> = (args: any) => (<div style={{height: "200px", width: "600px"}}><DeploymentFrequency {...args} /></div>)

export const Example = Template.bind({})

Example.args = {
    api: "",
    data: data,
    showWeekends: true,
    start: new Date(2024, 6, 16),
    end: new Date(2024, 7, 15)
}
