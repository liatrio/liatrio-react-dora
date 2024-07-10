import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import DeploymentFrequency from '../src/DeploymentFrequency'
import { Props } from '../src/Helpers'

import data from './data'

export default {
    title: 'DeploymentFrequency',
    component: DeploymentFrequency,
} as Meta

const Template: StoryFn<Props> = (args: any) => (<div style={{height: "400px", width: "600px"}}><DeploymentFrequency {...args} /></div>)

export const Example = Template.bind({})

Example.args = {
    api: "",
    repositories: ['dora-high-repo'],
    data: data
}
