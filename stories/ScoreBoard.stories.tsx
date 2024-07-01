import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import ScoreBoard from '../src/ScoreBoard/ScoreBoard'
import { Props } from '../src/Helpers'

export default {
    title: 'ScoreBoard',
    component: ScoreBoard,
} as Meta

const Template: StoryFn<Props> = (args: any) => (<div style={{height: "200px", width: "400px"}}><ScoreBoard {...args} /></div>)

export const Example = Template.bind({})

Example.args = {
    api: "",
    repositories: [],
    data: ``
}
