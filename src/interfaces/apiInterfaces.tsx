export interface DoraRecord {
  repository: string
  team: string
  title?: string
  user?: string
  sha: string
  status: boolean
  failed_at?: Date
  merged_at?: Date
  created_at: Date
  fixed_at?: Date
  totalCycle: number
  totalCycleHrs: number
  totalCycleDays: number
  totalCycleMins: number
  cycleLabel: string
  cycleType: string
  start: number
  recoverTime: number
  deploy_url: string
  fixed_url: string
  change_url: string
}