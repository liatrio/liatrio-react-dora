import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import ChangeFailureRate from '../src/ChangeFailureRate'
import { Props } from '../src/Helpers'

import data from './data'

export default {
    title: 'ChangeFailureRate',
    component: ChangeFailureRate,
} as Meta

const Template: StoryFn<Props> = (args: any) => (<div style={{height: "200px", width: "600px"}}><ChangeFailureRate {...args} /></div>)

export const Example = Template.bind({})

Example.args = {
    api: "",
    repositories: ['dora-elite-repo'],
    data: data,
    start: new Date(2024, 6, 12),
    end: new Date(2024, 7, 11)
}
