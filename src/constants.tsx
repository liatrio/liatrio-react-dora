import DeploymentFrequency from "./DeploymentFrequency"
import { DoraMetric, DoraState } from "./interfaces/metricInterfaces"
import { MetricThresholdSet } from "./interfaces/propInterfaces"

export const green = "#00FF00"
export const yellow = "#FFFF00"
export const orange = "#FF8300"
export const blue = "#00FFFF"
export const grey = "#C0C0C0"

export const recordDateKeys = ['merged_at', 'created_at', 'fixed_at', 'failed_at']

export const defaultDoraMetric: DoraMetric = {
  average: NaN,
  display: '?',
  color: grey,
  trend: 'unknown',
}

export const defaultDoraState: DoraState = {
  deploymentFrequency: {...defaultDoraMetric},
  changeLeadTime: {...defaultDoraMetric},
  changeFailureRate: {...defaultDoraMetric},
  recoverTime: {...defaultDoraMetric},
}

export const millisecondsToHours = 60 * 60 * 1000
export const millisecondsToDays = 24 * millisecondsToHours
export const dayInHours = 24
export const weekInHours = dayInHours * 7
export const monthInHours = dayInHours * 30

export const defaultMetricThresholdSet: MetricThresholdSet = {
  deploymentFrequency: {
    elite: dayInHours,
    high: weekInHours,
    medium: monthInHours
  },
  changeFailureRate: {
    elite: 5,
    high: 10,
    medium: 45
  },
  changeLeadTime: {
    elite: dayInHours,
    high: weekInHours,
    medium: monthInHours
  },
  recoverTime: {
    elite: dayInHours,
    high: weekInHours,
    medium: monthInHours
  }
}