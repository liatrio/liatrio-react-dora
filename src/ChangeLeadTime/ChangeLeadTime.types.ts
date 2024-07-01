import { Record } from "../Helpers"

export interface ChangeLeadTimeTooltipPayload {
  name: string
  value: number
  payload: Record
}

export interface ChangeLeadTimeTooltipProps {
  active?: boolean
  label?: string | number
  payload?: ChangeLeadTimeTooltipPayload[]
}