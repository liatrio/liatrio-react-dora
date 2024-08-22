import { DoraRecord } from "./apiInterfaces"

export interface ChartProps {
  data: DoraRecord[]
  graphEnd?: Date
  graphStart?: Date
  loading?: boolean
  includeWeekendsInCalculations?: boolean
  metricThresholdSet?: MetricThresholdSet
  message?: string
  colors?: ThresholdColors
  showTrends?: boolean
  holidays?: Date[]
}

export interface ThresholdColors {
  elite?: string
  high?: string
  medium?: string
  low?: string
}

export interface BoardProps extends ChartProps {
  alwaysShowDetails?: boolean
}

export interface MetricThresholds {
  elite?: number
  high?: number
  medium?: number
}

export interface MetricThresholdSet {
  deploymentFrequency?: MetricThresholds
  changeLeadTime?: MetricThresholds
  changeFailureRate?: MetricThresholds
  recoverTime?: MetricThresholds
}