import { DoraRecord } from "../interfaces/apiInterfaces"
import { blue, defaultDoraMetric, defaultDoraState, defaultMetricThresholdSet, green, grey, orange, yellow } from "../constants"
import { getDateDaysInPast, subtractHolidays, subtractWeekends } from "./dateFunctions"
import { ChartProps, MetricThresholds, ThresholdColors } from "../interfaces/propInterfaces"
import { DoraMetric, DoraState } from "../interfaces/metricInterfaces"

const calculateChangeFailureRateAverage = (props: ChartProps, data: DoraRecord[]) : number => {
  const totalSuccessfulRecords = data.filter(f => f.status === true && !f.failed_at).length
  const totalFailedRecords = data.filter(f => f.status === false || (f.status === true && f.failed_at)).length

  return (totalFailedRecords / (totalSuccessfulRecords === 0 ? 1 : totalSuccessfulRecords)) * 100
}

const calculateChangeLeadTimeAverage = (props: ChartProps, data: DoraRecord[]) : number => {
  let totalSuccessfulRecords = 0
  let totalLeadTime = 0

  data.forEach(record => {
    if(record.totalCycle === undefined) {
      return
    }

    totalSuccessfulRecords++
    totalLeadTime += record.totalCycle
  })

  if(totalSuccessfulRecords === 0) {
    return NaN
  }

  return totalLeadTime / totalSuccessfulRecords
}

const calculateDeploymentFrequencyAverage = (props: ChartProps, data: DoraRecord[]) : number => {
  let sorted = data
    .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
  
  if(sorted.length === 0) {
    return NaN
  }

  if(sorted.length === 1) {
    return ((props.end?.getTime() ?? getDateDaysInPast(1).getTime()) - (props.start?.getTime() ?? getDateDaysInPast(31).getTime())) / (1000 * 60 * 60)
  }

  let totalDeployTime = 0

  for(let index = 1; index < sorted.length; index++) {
    let start = sorted[index - 1].created_at
    let end = sorted[index].created_at
    let diff = end.getTime() - start.getTime()

    if(!props.includeWeekendsInCalculations) {
      diff = subtractWeekends(diff, start, end)
    }

    if(props.holidays && props.holidays.length > 0) {
      diff = subtractHolidays(diff, start, end, props.holidays)
    }

    totalDeployTime += diff
  }
  
  let avgDeployTime = (totalDeployTime / sorted.length) / (1000 * 60 * 60)
  
  return avgDeployTime
}

const calculateRecoverTimeAverage = (props: ChartProps, data: DoraRecord[]) : number => {
  let totalFailedRecords = 0
  let totalRecoveryTime = 0

  data.forEach(record => {
    if((record.status === true && !record.failed_at) || record.recoverTime === undefined) {
      return
    }

    totalFailedRecords++
    totalRecoveryTime += record.recoverTime
  })

  if(totalFailedRecords === 0) {
    return NaN
  }

  return totalRecoveryTime / totalFailedRecords
}


const calculateMetric = (metricName: string, props: ChartProps, data: DoraRecord[]) => {
  let calculator: any = null
  const defaultThresholds: MetricThresholds = (defaultMetricThresholdSet as any)[metricName]
  const thresholds: MetricThresholds = props.metricThresholdSet ? (props.metricThresholdSet as any)[metricName] : null

  if(metricName === "deploymentFrequency") {
    calculator = calculateDeploymentFrequencyAverage
  } else if (metricName === "changeFailureRate") {
    calculator = calculateChangeFailureRateAverage
  } else if (metricName === "changeLeadTime") {
    calculator = calculateChangeLeadTimeAverage
  } else if (metricName === "recoverTime") {
    calculator = calculateRecoverTimeAverage
  } else {
    return {...defaultDoraMetric}
  }

  const metric : DoraMetric = {...defaultDoraMetric}

  metric.average = calculator(props, data)
  metric.color = determineMetricColor(metric.average, defaultThresholds, thresholds, props.colors)
  metric.display = generateMetricDisplay(metric.average, metricName)
  
  return metric
}

const determineMetricColor = (value: number, defaultThresholds?: MetricThresholds, thresholds?: MetricThresholds, thresholdColors?: ThresholdColors) : string => {
  if(Number.isNaN(value)) {
    return grey
  }

  if(value < (thresholds?.elite ? thresholds.elite : defaultThresholds?.elite ?? 0)) {
    return thresholdColors?.elite ? thresholdColors.elite : green
  } else if(value < (thresholds?.high ? thresholds.high : defaultThresholds?.high ?? 0)) {
    return thresholdColors?.high ? thresholdColors.high : blue
  } else if(value < (thresholds?.medium ? thresholds.medium : defaultThresholds?.medium ?? 0)) {
    return thresholdColors?.medium ? thresholdColors.medium : yellow
  } else {
    return thresholdColors?.low ? thresholdColors.low : orange
  }
}

export const generateMetricDisplay = (value: number, metricName?: string) : string => {
  if(Number.isNaN(value)) {
    return '?'
  } else if(metricName === "changeFailureRate") {
    return `${value.toFixed(2)}%`
  } else if(value < 1) {
    return `${(value * 60).toFixed(2)} mins`
  } else if(value < 48) {
    return `${value.toFixed(2)} hrs`
  } else {
    return `${(value / 24).toFixed(2)} days`
  }
}

export const buildDoraState = (props: ChartProps, data: DoraRecord[]) : DoraState => {
  let state: any = {...defaultDoraState}

  Object.keys(state).forEach((metricName) => {
    state[metricName] = calculateMetric(metricName, props, data)
  })

  return state
}