import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import DeploymentFrequency from '../src/DeploymentFrequency'

export default {
    title: 'DeploymentFrequency',
    component: DeploymentFrequency,
} as Meta

const Template: StoryFn<DeploymentFrequencyProps> = (args: any) => <DeploymentFrequency {...args} />

export const Example = Template.bind({})

Example.args = {
}

interface DeploymentFrequencyProps {
}
