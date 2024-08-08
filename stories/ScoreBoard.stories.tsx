import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import ScoreBoard from '../src/ScoreBoard/ScoreBoard'
import { Props } from '../src/Helpers'

import data from './data'

export default {
    title: 'ScoreBoard',
    component: ScoreBoard,
} as Meta

const Template: StoryFn<Props> = (args: any) => (<div style={{height: "200px"}}><ScoreBoard {...args} /></div>)

export const Example = Template.bind({})

Example.args = {
    api: "",
    repositories: ['dora-elite-repo'],
    data: data,
    includeWeekends: false,
    showDetails: true,
    start: new Date(2024, 5, 1),
    end: new Date(2024, 6, 2)
}
