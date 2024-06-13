import React from 'react'
import { StoryFn, Meta } from '@storybook/react'
import DeploymentFrequency, { DeploymentFrequencyProps } from '../src/DeploymentFrequency'

export default {
    title: 'DeploymentFrequency',
    component: DeploymentFrequency,
} as Meta

const Template: StoryFn<DeploymentFrequencyProps> = (args: any) => (<div style={{height: "400px", width: "600px"}}><DeploymentFrequency {...args} /></div>)

export const Example = Template.bind({})

Example.args = {
    api: "",
    repositories: ['clockwork', 'liatrio-intranet'],
    data: `[
        {"created_at": "2024-05-15T14:41:39Z", "state": "success", "repository": "dora-deploy-demo"},
        {"created_at": "2024-05-15T14:02:14Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-15T13:59:08Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-15T13:57:36Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-15T13:46:38Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-15T13:42:54Z", "state": "failure", "repository": "clockwork"},
        {"created_at": "2024-05-15T11:00:47Z", "state": "failure", "repository": "clockwork"},
        {"created_at": "2024-05-15T01:05:31Z", "state": "success", "repository": "dojo-portal"},
        {"created_at": "2024-05-15T00:00:50Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-14T23:58:01Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-14T23:56:38Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-14T23:48:41Z", "state": "failure", "repository": "clockwork"},
        {"created_at": "2024-05-14T23:47:11Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-14T23:22:48Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-14T20:05:53Z", "state": "success", "repository": "liatrio-intranet"},
        {"created_at": "2024-05-14T16:37:05Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-14T11:00:43Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-13T17:58:11Z", "state": "success", "repository": "flywheel-infrastructure-aws-sc-portfolio-shared-products"},
        {"created_at": "2024-05-13T17:58:09Z", "state": "success", "repository": "flywheel-infrastructure-aws-sc-portfolio-shared-products"},
        {"created_at": "2024-05-13T17:58:06Z", "state": "success", "repository": "flywheel-infrastructure-aws-sc-portfolio-shared-products"},
        {"created_at": "2024-05-13T17:57:35Z", "state": "success", "repository": "flywheel-infrastructure-aws-sc-portfolio-shared-products"},
        {"created_at": "2024-05-13T16:59:14Z", "state": "success", "repository": "liatrio-intranet"},
        {"created_at": "2024-05-13T16:54:12Z", "state": "success", "repository": "liatrio-intranet"},
        {"created_at": "2024-05-13T16:10:49Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-13T16:10:27Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-13T16:08:51Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-13T16:07:27Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-13T15:41:13Z", "state": "success", "repository": "gratibot"},
        {"created_at": "2024-05-13T14:35:05Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-13T13:11:44Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-05-13T11:02:09Z", "state": "success", "repository": "harvester"},
        {"created_at": "2024-05-13T11:00:41Z", "state": "success", "repository": "clockwork"},
        {"created_at": "2024-04-12T20:02:20Z", "state": "failure", "repository": "flywheel-infrastructure-aws-sc-portfolio-vpc"}
      ]`
}
