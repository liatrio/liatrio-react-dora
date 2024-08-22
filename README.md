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

    This is the function your parent component should use to pull data to supply in the **data** property of the components

    The parameters of this function are as follows:

    **FetchProps**
      * **api**:
        * This is the url to the API for gathering data.
      
      * **getAuthHeaderValue** (*optional*):
        * This is a function that should provide the value of the `Authorization` HTTP Header for the `api`.
        * If not specified, no auth will be used

      * **team** (*optional*): 
        * The name of the team to show pull data for.

      * **repositories** (*optional*):
        * A list of repository names to pull data for.
      
      * **daysToPull** (*optional*):
        * The number of days in the past from the current date to pull data for
        * If not specified, 365 is the default

      * **includeWeekendsInCalculations** (*optional*):
        * When calculating the averages for each metric in the **Board** component, this setting allows you to include/exclude weekends in those calculations.  This is useful when you don't have teams that work weekends.

      * **holidays** (*optional*):
        * This field allows you to specify holidays for that your organization follows to exclude from the calculations for the **Board** component.

  * **buildDoraState**

    This function returns a DoraState object with information about each DORA Metric:

    ```
    DoraMetric {
      average: number
      display: string
      color: string
      trend: string
    }

    DoraState {
      deploymentFrequency: DoraMetric
      changeLeadTime: DoraMetric
      changeFailureRate: DoraMetric
      recoverTime: DoraMetric
    }
    ```

    * **average** - Is the average of the metric of the supplied time frame
    * **display** - Is a formated display string for the metric
    * **color** - Is the color for the displays string based on the **colors** supplied in the component properties
    * **trend** - Is whether this period measured is improving, falling behind, or staying even with the requested period

    It takes the following values as parameters:

    * **props** - An object contianing the [Component Properties](https://github.com/liatrio/liatrio-react-dora?tab=readme-ov-file#component-properties)
    * **data** - The data supplied by the **fetchData** function

  * **getDateDaysInPast** and **getDateDaysInPastUtc**

    These functions are just shortcuts to get a Date a certain number of days in the past

# Component Properties

* **graphStart** (*optional*):
  * If not supplied this will default to 30 days in the past.
  * This value is used to determine the starting date for the charts.

* **graphEnd** (*optional*):
  * If not supplied, this will default to 1 day in the past.
  * This value is used to determine the ending date for the charts.

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

  The threshold values for **elite**, **high** and **medium** are measured in hours.  **low** is considered anything longer than medium.

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

These components rely on **data** being supplied to them.  We supply the [liatrio-dora-api](https://github.com/liatrio/liatrio-dora-api) to gather this data out of a Loki DB that is fed by our [liatrio-otel-collector](https://github.com/liatrio/liatrio-otel-collector).  If you want to create your own API, it just needs to return the [Data Schema](https://github.com/liatrio/liatrio-react-dora?tab=readme-ov-file#data-schemas).

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
