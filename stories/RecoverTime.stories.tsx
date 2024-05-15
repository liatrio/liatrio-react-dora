import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import RecoverTime from '../src/RecoverTime'

export default {
    title: 'RecoverTime',
    component: RecoverTime,
} as Meta

const Template: StoryFn<RecoverTimeProps> = (args: any) => <RecoverTime {...args} />

export const Example = Template.bind({})

Example.args = {
}

interface RecoverTimeProps {
}
