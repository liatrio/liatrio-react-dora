import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import ChangeLeadTime from '../src/ChangeLeadTime'

export default {
    title: 'ChangeLeadTime',
    component: ChangeLeadTime,
} as Meta

const Template: StoryFn<ChangeLeadTimeProps> = (args: any) => <ChangeLeadTime {...args} />

export const Example = Template.bind({})

Example.args = {
}

interface ChangeLeadTimeProps {
}
