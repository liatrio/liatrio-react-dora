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
    repositories: ['dora-high-repo'],
    data: `{
    "records": [
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "af69ef0fb735f0690f532b76093b980c8377b412",
            "status": true,
            "merged_at": "2024-06-27T09:38:45Z",
            "created_at": "2024-06-28T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "da01221fe27406001076c3289a73331bccdb34ee",
            "status": true,
            "merged_at": "2024-06-10T16:20:17Z",
            "created_at": "2024-06-11T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "613c7e6914fcb1d09fb689b58ac4ce320350a447",
            "status": true,
            "merged_at": "2024-06-16T16:20:17Z",
            "created_at": "2024-06-17T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "1f5685df2ad794843958cf6618e55962159eb3c4",
            "status": true,
            "merged_at": "2024-06-17T09:38:45Z",
            "created_at": "2024-06-18T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "8fe42c9f4c773ff51538ddb5082eb42376f53773",
            "status": true,
            "merged_at": "2024-06-04T16:20:17Z",
            "created_at": "2024-06-05T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "8cda16903d9aa1b8afbc6f2282e9fc9b2e4d19c6",
            "status": true,
            "merged_at": "2024-06-11T09:38:45Z",
            "created_at": "2024-06-12T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "94be46462f7d0bfe908f5e8d0d84ec271c79b5a5",
            "status": true,
            "merged_at": "2024-06-23T09:38:45Z",
            "created_at": "2024-06-24T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "730128f1bf0a054e06528d38382e92be2a83ba8e",
            "status": true,
            "merged_at": "2024-07-01T09:38:45Z",
            "created_at": "2024-07-02T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "2be8b021eaca7b16e97a486cfa0040cd8f669919",
            "status": true,
            "merged_at": "2024-06-19T16:20:17Z",
            "created_at": "2024-06-20T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "79ae72e6b901466796f927322aba8fc5c5135b8d",
            "status": true,
            "merged_at": "2024-06-18T16:20:17Z",
            "created_at": "2024-06-19T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "c28ffa72b293fdb89e658a18a70b0708308589ee",
            "status": true,
            "merged_at": "2024-06-03T16:20:17Z",
            "created_at": "2024-06-04T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "89104e0bffab832ecd15ae54ea6a56523198689e",
            "status": true,
            "merged_at": "2024-06-20T09:38:45Z",
            "created_at": "2024-06-21T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "1d9291669e2fba6cf2f92826d134d20bf95b53ee",
            "status": true,
            "merged_at": "2024-06-23T16:20:17Z",
            "created_at": "2024-06-24T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "cb7099d5b76fb1df24d778462e72e2a9ec7cddb5",
            "status": true,
            "merged_at": "2024-06-24T16:20:17Z",
            "created_at": "2024-06-25T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "8ba1088861a30eb2cecd216a144edd04fac10e4c",
            "status": true,
            "merged_at": "2024-06-28T09:38:45Z",
            "created_at": "2024-06-29T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "5762e49f0800ab7db28c0f8ba8a5ac01dc9a4b4b",
            "status": true,
            "merged_at": "2024-06-22T09:38:45Z",
            "created_at": "2024-06-23T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "6fa05322a10f7636ee65daf6c653308bb7a62467",
            "status": true,
            "merged_at": "2024-06-05T09:38:45Z",
            "created_at": "2024-06-06T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "b4e43849eb12bf64664c2133c1157fd77014091c",
            "status": true,
            "merged_at": "2024-06-20T16:20:17Z",
            "created_at": "2024-06-21T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "6619cb97707d0e10e1fa15a9c27dd1963c13ac66",
            "status": true,
            "merged_at": "2024-06-14T09:38:45Z",
            "created_at": "2024-06-15T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "0d50a52e13d25b2d0f58d5ed2919c03541f303c7",
            "status": true,
            "merged_at": "2024-06-14T16:20:17Z",
            "created_at": "2024-06-15T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "",
            "user": "",
            "sha": "7e73a1ee5487cce145946c223b86015e4795eddc",
            "status": false,
            "merged_at": "1970-01-01T00:00:00Z",
            "created_at": "2024-06-17T06:28:45Z",
            "fixed_at": "2024-06-17T09:38:45Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "8efc8a1afe2384430603ae9408f9fe6e334c906d",
            "status": true,
            "merged_at": "2024-06-24T09:38:45Z",
            "created_at": "2024-06-25T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "9e1fe99515ab2635d918e8bdb5bc30ed7484a0e4",
            "status": true,
            "merged_at": "2024-06-29T09:38:45Z",
            "created_at": "2024-06-30T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "73a0fd625c88ed1975c3f94db97964f48a2fc371",
            "status": true,
            "merged_at": "2024-06-07T09:38:45Z",
            "created_at": "2024-06-08T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "d78f1fa851857c0f08a4fd4a04e6d038ae070477",
            "status": true,
            "merged_at": "2024-06-16T09:38:45Z",
            "created_at": "2024-06-17T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "cbde4bd653a79c52687e48fcc3677a30456b8055",
            "status": true,
            "merged_at": "2024-06-15T09:38:45Z",
            "created_at": "2024-06-16T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "7b506ab74cede5dcb807df8509c0020cdfac753d",
            "status": true,
            "merged_at": "2024-06-17T16:20:17Z",
            "created_at": "2024-06-18T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "9af4b395af20cb6193c789e11faf79be703e1b85",
            "status": true,
            "merged_at": "2024-06-19T09:38:45Z",
            "created_at": "2024-06-20T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "",
            "user": "",
            "sha": "8cd9d04554a65d9a8e0553e25cea2372950f8ab2",
            "status": false,
            "merged_at": "1970-01-01T00:00:00Z",
            "created_at": "2024-07-01T13:10:17Z",
            "fixed_at": "2024-07-01T16:20:17Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "d8bfe6e45a39ade6a47986bfd89fbc4999b6f688",
            "status": true,
            "merged_at": "2024-06-18T09:38:45Z",
            "created_at": "2024-06-19T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "261ede4f80dc7100cf078aa2538be723f24c8ab0",
            "status": true,
            "merged_at": "2024-06-30T16:20:17Z",
            "created_at": "2024-07-01T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "6b97dd7ac9031bc0d94fba23b0b63014c0148092",
            "status": true,
            "merged_at": "2024-06-06T09:38:45Z",
            "created_at": "2024-06-07T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "5d272dc888f96d6528edeb9f82ff35f122ce2756",
            "status": true,
            "merged_at": "2024-06-25T16:20:17Z",
            "created_at": "2024-06-26T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "e285ea064d98868a2e84600081b5841dcf29908b",
            "status": true,
            "merged_at": "2024-06-09T09:38:45Z",
            "created_at": "2024-06-10T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "2e9bc756d2c5baab7312d569bb4da7afe17f7d9b",
            "status": true,
            "merged_at": "2024-06-11T16:20:17Z",
            "created_at": "2024-06-12T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "50ba1017b977f8505e9fcd3b14a93c298488da97",
            "status": true,
            "merged_at": "2024-06-12T16:20:17Z",
            "created_at": "2024-06-13T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "4faf518fac6cf5a7745e0ad0c7e2fa315ed961e3",
            "status": true,
            "merged_at": "2024-06-26T16:20:17Z",
            "created_at": "2024-06-27T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "0f4e84e799d015c4e8da91cd89747a49332ade73",
            "status": true,
            "merged_at": "2024-06-05T16:20:17Z",
            "created_at": "2024-06-06T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "eb418224885d1e2f41a16a31f74551f52d1cdf3a",
            "status": true,
            "merged_at": "2024-06-25T09:38:45Z",
            "created_at": "2024-06-26T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "",
            "user": "",
            "sha": "158d7039c697a2de9fbb89977cfc4afcb4ac1ccc",
            "status": false,
            "merged_at": "1970-01-01T00:00:00Z",
            "created_at": "2024-06-16T13:10:17Z",
            "fixed_at": "2024-06-16T16:20:17Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "e5cb902151564beee60af54efa4617bd6e60a4d9",
            "status": true,
            "merged_at": "2024-06-08T16:20:17Z",
            "created_at": "2024-06-09T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "",
            "user": "",
            "sha": "86b13b3704bbde9c17b50f0d4a6c0c9760e17e1a",
            "status": true,
            "merged_at": "1970-01-01T00:00:00Z",
            "created_at": "2024-06-04T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "",
            "user": "",
            "sha": "f0c836e00754c596e31b882aa84df6538198c6e9",
            "status": true,
            "merged_at": "1970-01-01T00:00:00Z",
            "created_at": "2024-06-03T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "5e1e01505920afa1897a5cfbb54b58a1cb8e2566",
            "status": true,
            "merged_at": "2024-06-09T16:20:17Z",
            "created_at": "2024-06-10T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "31139a56841c9fa1a29c6a931ac48c62f418c960",
            "status": true,
            "merged_at": "2024-06-13T16:20:17Z",
            "created_at": "2024-06-14T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "4b0fc116e1a2332eb9a8dcae3912f3faad816907",
            "status": true,
            "merged_at": "2024-06-28T16:20:17Z",
            "created_at": "2024-06-29T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "",
            "user": "",
            "sha": "e00d7d283d4bfb7c5919276d9a5c878fa97b25e6",
            "status": false,
            "merged_at": "1970-01-01T00:00:00Z",
            "created_at": "2024-07-02T06:28:45Z",
            "fixed_at": "2024-07-02T09:38:45Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "0a16a9331b3de19dd445f4cf4f8900f02f7afbb3",
            "status": true,
            "merged_at": "2024-06-22T16:20:17Z",
            "created_at": "2024-06-23T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "f61c0e195e99661eb43b02fe542fcdc206a44189",
            "status": true,
            "merged_at": "2024-06-30T09:38:45Z",
            "created_at": "2024-07-01T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "45870b4c1793b9537ffe7f71b2c85c6c7b7e2547",
            "status": true,
            "merged_at": "2024-06-21T16:20:17Z",
            "created_at": "2024-06-22T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "3022094f1a8fcda874af348dd3c29ed7b4142cee",
            "status": true,
            "merged_at": "2024-06-10T09:38:45Z",
            "created_at": "2024-06-11T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "ee0e6244c974a9683c30003f6068ee30ea8922fb",
            "status": true,
            "merged_at": "2024-06-12T09:38:45Z",
            "created_at": "2024-06-13T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "a10bb64e5ce592bf26490cdf6ba4c6bf4c6e85ee",
            "status": true,
            "merged_at": "2024-06-08T09:38:45Z",
            "created_at": "2024-06-09T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "6e721672a5d4577909d4a47b6d6fdaf8712c9c43",
            "status": true,
            "merged_at": "2024-06-13T09:38:45Z",
            "created_at": "2024-06-14T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "1fb4661369e1ceb3fe29044ecb296d7a7ef2e2fb",
            "status": true,
            "merged_at": "2024-06-04T09:38:45Z",
            "created_at": "2024-06-05T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "9eb3460ad8c57cfa3c7de160c7776e44cd6cd246",
            "status": true,
            "merged_at": "2024-06-27T16:20:17Z",
            "created_at": "2024-06-28T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "240ff0cb9311ae29b9b3523702145f1b6f6c8cc1",
            "status": true,
            "merged_at": "2024-06-15T16:20:17Z",
            "created_at": "2024-06-16T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "f9ada4369704379259b830908902ab05fa8f54bc",
            "status": true,
            "merged_at": "2024-06-06T16:20:17Z",
            "created_at": "2024-06-07T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "1b1bff40b8ebc0ffb7e6ba876688f34418803351",
            "status": true,
            "merged_at": "2024-06-21T09:38:45Z",
            "created_at": "2024-06-22T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "e93d3a96070128e212ca5161623cf3586de03037",
            "status": true,
            "merged_at": "2024-06-07T16:20:17Z",
            "created_at": "2024-06-08T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "a79a0f1b95b22a132f52371f27526d14dd81ce89",
            "status": true,
            "merged_at": "2024-06-29T16:20:17Z",
            "created_at": "2024-06-30T16:20:17Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        },
        {
            "repository": "dora-high-repo",
            "team": "dora-high-repo",
            "title": "feat: set version v0.3.0",
            "user": "adrielp",
            "sha": "6efcbf11402e2b393672d9edbabcebf6a6018842",
            "status": true,
            "merged_at": "2024-06-26T09:38:45Z",
            "created_at": "2024-06-27T09:38:45Z",
            "fixed_at": "1970-01-01T00:00:00Z"
        }
    ]
}`
}
