export interface ChangeLeadTimeProps {
  api: string
  data: string
  repositories?: string[]
  team?: string
  start?: Date
  end?: Date
}

export interface CycleRecord {
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

export interface CycleGraphRecord {
  data: CycleRecord
  totalCycle: number
  start: number
  timeInPipeline: number
  timeInPR: number
  timeInDev: number
  timeInTest: number
}

export interface CycleMeanRecord {
  start: number,
  meanTimeInPipeline: number,
  meanTimeInPR: number,
  meanTimeInDev: number,
  meanTimeInTest: number
}

export interface ChangeLeadTimeTooltipPayload {
  name: string
  value: number
  payload: CycleGraphRecord
}

export interface ChangeLeadTimeTooltipProps {
  active?: boolean
  label?: string | number
  payload?: ChangeLeadTimeTooltipPayload[]
}