import { Record } from "../Helpers"

export interface CycleGraphRecord {
  data: Record
  totalCycle: number
  start: number
  timeInPR: number
  timeInTest: number
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