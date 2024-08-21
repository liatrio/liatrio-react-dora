

export interface DoraMetric {
  average: number
  display: string
  color: string
  trend: string
}

export interface DoraState {
  deploymentFrequency: DoraMetric
  changeLeadTime: DoraMetric
  changeFailureRate: DoraMetric
  recoverTime: DoraMetric
}