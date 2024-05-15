import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import ChangeFailureRate from '../src/ChangeFailureRate'

export default {
    title: 'ChangeFailureRate',
    component: ChangeFailureRate,
} as Meta

const Template: StoryFn<ChangeFailureRateProps> = (args: any) => <ChangeFailureRate {...args} />

export const Example = Template.bind({})

Example.args = {
}

interface ChangeFailureRateProps {
}
