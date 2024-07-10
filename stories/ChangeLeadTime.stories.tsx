import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import ChangeLeadTime from '../src/ChangeLeadTime/ChangeLeadTime'
import { Props } from '../src/Helpers'

import data from './data'

export default {
    title: 'ChangeLeadTime',
    component: ChangeLeadTime,
} as Meta

const Template: StoryFn<Props> = (args: any) => <div style={{height: "400px", width: "600px"}}><ChangeLeadTime {...args} /></div>

export const Example = Template.bind({})

Example.args = {
    api: "",
    repositories: ['dora-high-repo'],
    data: data
}
