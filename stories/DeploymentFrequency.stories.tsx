import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import DeploymentFrequency from '../src/DeploymentFrequency'
import { Props } from '../src/Helpers'

export default {
    title: 'DeploymentFrequency',
    component: DeploymentFrequency,
} as Meta

const Template: StoryFn<Props> = (args: any) => (<div style={{height: "400px", width: "600px"}}><DeploymentFrequency {...args} /></div>)

export const Example = Template.bind({})

Example.args = {
    api: "",
    repositories: ['clockwork', 'liatrio-intranet'],
    data: `[
        {"created_at": "2024-05-15T14:41:39Z", "status": true, "repository": "dora-deploy-demo"},
        {"created_at": "2024-05-15T14:02:14Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-15T13:59:08Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-15T13:57:36Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-15T13:46:38Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-15T13:42:54Z", "status": false, "repository": "clockwork"},
        {"created_at": "2024-05-15T11:00:47Z", "status": false, "repository": "clockwork"},
        {"created_at": "2024-05-15T01:05:31Z", "status": true, "repository": "dojo-portal"},
        {"created_at": "2024-05-15T00:00:50Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-14T23:58:01Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-14T23:56:38Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-14T23:48:41Z", "status": false, "repository": "clockwork"},
        {"created_at": "2024-05-14T23:47:11Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-14T23:22:48Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-14T20:05:53Z", "status": true, "repository": "liatrio-intranet"},
        {"created_at": "2024-05-14T16:37:05Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-14T11:00:43Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-13T17:58:11Z", "status": true, "repository": "flywheel-infrastructure-aws-sc-portfolio-shared-products"},
        {"created_at": "2024-05-13T17:58:09Z", "status": true, "repository": "flywheel-infrastructure-aws-sc-portfolio-shared-products"},
        {"created_at": "2024-05-13T17:58:06Z", "status": true, "repository": "flywheel-infrastructure-aws-sc-portfolio-shared-products"},
        {"created_at": "2024-05-13T17:57:35Z", "status": true, "repository": "flywheel-infrastructure-aws-sc-portfolio-shared-products"},
        {"created_at": "2024-05-13T16:59:14Z", "status": true, "repository": "liatrio-intranet"},
        {"created_at": "2024-05-13T16:54:12Z", "status": true, "repository": "liatrio-intranet"},
        {"created_at": "2024-05-13T16:10:49Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-13T16:10:27Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-13T16:08:51Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-13T16:07:27Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-13T15:41:13Z", "status": true, "repository": "gratibot"},
        {"created_at": "2024-05-13T14:35:05Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-13T13:11:44Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-05-13T11:02:09Z", "status": true, "repository": "harvester"},
        {"created_at": "2024-05-13T11:00:41Z", "status": true, "repository": "clockwork"},
        {"created_at": "2024-04-12T20:02:20Z", "status": false, "repository": "flywheel-infrastructure-aws-sc-portfolio-vpc"}
      ]`
}
