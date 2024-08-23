

export interface DoraMetric {
  average: number
  display: string
  color: string
  trend: Trend
  rank: Rank
}

export interface DoraState {
  deploymentFrequency: DoraMetric
  changeLeadTime: DoraMetric
  changeFailureRate: DoraMetric
  recoverTime: DoraMetric
}

export enum Rank {
  unknown,
  low,
  medium,
  high,
  elite
}

export enum Trend {
  Improving,
  Declining,
  Neutral,
  Unknown
}