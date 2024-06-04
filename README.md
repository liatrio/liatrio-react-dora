# Introduction

This component library contains charts for the standard DORA metrics.

# Installation

You can install these components using the following command:

```
npm install https://github.com/liatrio/liatrio-react-dora/releases/download/v0.0.6/liatrio-react-dora-0.0.7.tgz
```
Or
```
yarn add https://github.com/liatrio/liatrio-react-dora/releases/download/v0.0.6/liatrio-react-dora-0.0.7.tgz
```

# Chart Properties

Each chart has a set of common properties and unique properties.

## Comomon Properties

* **start** (*optional*): This is the start date to be supplied to the `api`.  If not supplied this will default to 30 days in the past.
* **end** (*optional*): This is the end date to be supplied to the `api`.  If not supplied, this will default to the current date.
* **api** (*optional*): This is the url to the API for gathering data.  This must be filled in if `data` is omitted
* **getAuthHeaderValue** (*optional*): This is a function that should provide the value of the `Authorization` HTTP Header for the `api`.
* **data** (*optional*): A JSON string containing the data for the chart to display.  If this is supplied with the `api` property, the `api` property will be ignored.
* **team** (*optional*): The name of the team to show information about in the chart.  This works with `data` and `api`.
* **repositories** (*optional*): A list of repository names to show in the chart.  This works with `data` and `api`.

## Deployement Frequency Properties

* **includeFailures** (*optional*): This will include failures in the chart if set to true.  If not supplied, this will default to false.
* **environment** (*optional*): This will filter the charts to only show data for the specified environment.  If not supplied, all environments will be shown.

## Change Lead Time Properties

* This chart does not have any unique properties at this time

## Change Failure Rate Properties

* This chart does not have any unique properties at this time

## Recover Time Properties

* This chart does not have any unique properties at this time

# Dependencies

These charts need to be supplied data for display.  This data can be provided in two ways.

1. You can use the `data` property on each chart to send in a JSON string containing the data necessary that you have gathered from somewhere else.

2. You can use the `api` property to supply a url to an API that can provide the data necessary.
    * We do offer an API that currently integrates with Loki DB to query the data and supply it in the schema necessary [here](https://github.com/liatrio/liatrio-dora-api)

# Data Schemas

The data schema for each chart is as follows:

## Deployment Frequency

```
enum {
    success,
    failure
}

{
    created_at: Date,
    environment: string,
    state: DeploymentState,
    repository: string,
    team: string
}
```

## Change Lead Time

```
{
  openedAt: Date
  mergedAt: Date
  devDeployedAt: Date
  testDeployedAt: Date
  prodDeployedAt: Date
  repository: string
  team: string
  title: string
  user: string
}
```

## Change Failure Rate

* Not yet defined

## Recover Time

* Not yet defined