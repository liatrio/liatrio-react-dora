# Introduction

This component library contains charts for the standard DORA metrics.

# Installation

You can install these components using the following command:

```
npm install https://github.com/liatrio/liatrio-react-dora/releases/download/v1.0.0/liatrio-react-dora-1.0.0.tgz
```
Or
```
yarn add https://github.com/liatrio/liatrio-react-dora/releases/download/v1.0.0/liatrio-react-dora-1.0.0.tgz
```

# Usage

To use these charts, you can do as follows:

```
import { DeploymentFrequency } from `liatrio-react-dora`

...
<div style={{width: "600px", height: "400px"}}>
    <DeploymentFrequency api="http://some.url" />
</div>

```

It is important that the chart component be wrapped in an element of some size somewhere up the tree, otherwise the chart may have unexpected behavior.

# Chart Properties

* **start** (*optional*):
  * If not supplied this will default to 31 days in the past.
  * This value is used to determine the starting date for the charts.
  * If `api` is supplied, this date is sent to the API for data gathering.

* **end** (*optional*):
  * If not supplied, this will default to 1 day in the past.
  * This value is used to determine the ending date for the charts.
  * If `api` is supplied, this date is sent to the API for data gathering.

* **team** (*optional*): 
  * The name of the team to show information about in the chart.
  * If `data` is supplied, this acts as a filter on that data.
  * If `api` is supplied, this is sent to the API for data gathering.

* **repositories** (*optional*):
  * A list of repository names to show in the chart.
  * If `data` is supplied, this acts as a filter on that data.
  * If `api` is supplied, this is sent to the API for data gathering.

* **api** (*optional*):
  * This is the url to the API for gathering data.
  * This must be filled in if `data` is omitted

* **getAuthHeaderValue** (*optional*):
  * This is a function that should provide the value of the `Authorization` HTTP Header for the `api`.

* **data** (*optional*):
  * A JSON string containing the data for the chart to display.  If this is supplied with the `api` property, the `api` property will be ignored.

# Dependencies

These charts need to be supplied data for display.  This data can be provided in two ways.

1. You can use the `data` property on each chart to send in a JSON string containing the data necessary that you have gathered from somewhere else.

2. You can use the `api` property to supply a url to an API that can provide the data necessary.
    * We do offer an API that currently integrates with Loki DB to query the data and supply it in the schema necessary [here](https://github.com/liatrio/liatrio-dora-api)

# Data Schemas

The data schema for each chart is as follows:

```
{
  repository: string
  team: string
  title?: string
  user?: string
  sha: string
  status: boolean
  failed_at?: Date
  merged_at?: Date
  created_at: Date
  fixed_at?: Date
  totalCycle: number
  start: number
  recoverTime: number
}
```
