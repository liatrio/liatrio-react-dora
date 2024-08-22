# Introduction

This component library contains charts for the standard DORA metrics.

# Installation

You can install these components using the following command:

```
npm install https://github.com/liatrio/liatrio-react-dora/releases/download/v1.0.0/liatrio-react-dora-1.0.0.tgz
```
Or
```
yarn add liatrio-react-dora@https://github.com/liatrio/liatrio-react-dora/releases/download/v1.0.0/liatrio-react-dora-1.0.0.tgz
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

# Exposed Components
  * Board
  * DeploymentFrequency
  * ChangeLeadTime
  * ChangeFailureRate
  * RecoverTime

# Exposed Functionality
  * **fetchData**

    This function allows you to manually fetch data outside of the component to an API that returns our expected schema and process it to send it in as the **data** field

  * **buildDoraState**

    This function takes in the processed data from **fetchData** and returns a **DoraState** that you can use to display information outside of the components:

    ```
    DoraState {
      deploymentFrequency: DoraMetric
      changeLeadTime: DoraMetric
      changeFailureRate: DoraMetric
      recoverTime: DoraMetric
    }

    DoraMetric {
      average: number
      display: string
      color: string
      trend: string
    }
    ```

  * **getDateDaysInPast** and **getDateDaysInPastUtc**

    These functions are just shortcuts to get a Date a certain number of days in the past

# Component Properties

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

* **loading** (*optional*):
  * Boolean to allow a container component to control the loading status if it wants to supply **data**

* **includeWeekendsInCalculations** (*optional*):
  * When calculating the averages for each metric in the **Board** component, this setting allows you to include/exclude weekends in those calculations.  This is useful when you don't have teams that work weekends.

* **metricThresholdSet** (*optional*):
  * This allows you to customize the metric thresholds use for the **Board** component coloring.  You only have to override the ones you need. There are defaults based on the official DORA Report that are used when these are not supplied.

  The format for this field is:

  ```
  MetricThresholds {
    elite?: number
    high?: number
    medium?: number
  }
  
  MetricThresholdSet {
    deploymentFrequency?: MetricThresholds
    changeLeadTime?: MetricThresholds
    changeFailureRate?: MetricThresholds
    recoverTime?: MetricThresholds
  }
  ```

* **colors** (*optional*):
  * This allows you to customize the colors used by the **Board** component, they support any of the standard color formats

  The format for this field is:

  ```
  ThresholdColors {
    elite?: string
    high?: string
    medium?: string
    low?: string
  }
  ```

* **message** (*optional*):
  * This allows a parent component to display a custom message while it does something.  This setting overrides **loading** and the nodata state that happens if **data** is empty or the **api** returns no data

* **showTrends** (*optional*):
  * This field controls whether trends or coloring is shown in the **Board** component

* **holidays** (*optional*):
  * This field allows you to specify holidays for that your organization follows to exclude from the calculations for the **Board** component

* **alwaysShowDetails** (*optional*):
  * This field controls whether the **Board** component shows the details on hover or statically below the icon

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
