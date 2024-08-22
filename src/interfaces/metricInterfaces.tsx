

export interface DoraMetric {
  average: number
  display: string
  color: string
  trend: Trend
}

export interface DoraState {
  deploymentFrequency: DoraMetric
  changeLeadTime: DoraMetric
  changeFailureRate: DoraMetric
  recoverTime: DoraMetric
}

export enum Trend {
  Improving,
  Declining,
  Neutral,
  Unknown
}