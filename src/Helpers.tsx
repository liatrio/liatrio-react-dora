export interface Props {
  api?: string
  getAuthHeaderValue?: () => Promise<string | undefined>
  team?: string
  repositories?: string[]
  data?: string
  end?: Date
  start?: Date
}

export interface Record {
  repository: string
  team: string
  title: string
  user: string
  sha: string
  status: boolean
  opened_at: Date
  merged_at: Date
  created_at: Date
  fixed_at: Date
  totalCycle: number
  start: number
  timeInPR: number
  timeInTest: number
  recoverTime: number
}

export interface SummurizedRecord {

}

const date_keys = ['opened_at', 'merged_at', 'created_at', 'fixed_at']

export const recordReviver = (key: string, value: any) => {
  if (date_keys.includes(key)) {
      return new Date(value)
  }

  return value
}

const hslToHex = (h: number, s: number, l: number) => {
  const hue = Math.round(360 * h)
  const saturation = Math.round(100 * s)
  const lightness = Math.round(100 * l)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export const extractUniqueRepositories = (data: Record[]) => {
  const repositorySet = new Set<string>()

  data.forEach(record => {
      repositorySet.add(record.repository)
  })

  return Array.from(repositorySet)
}

export const generateDistinctColors = (count: number) => {
  const colors = []
  const goldenRatioConjugate = 0.618033988749895
  let hue = Math.random() // Start at a random hue

  for (let i = 0; i < count; i++) {
      hue += goldenRatioConjugate
      hue %= 1
      const color = hslToHex(hue, 0.9, 0.6) // Convert HSL color to hex
      colors.push(color)
  }

  return colors
}

export const expandData = (data: Record[]) => {
  data.forEach((record) => {
    if(record.merged_at && record.opened_at && record.created_at) {
      const mergedAt = record.merged_at.getTime()
      const prodDeployedAt = record.created_at.getTime()
      const openedAt = record.opened_at.getTime()

      record.totalCycle = parseFloat(((prodDeployedAt - openedAt) / (1000 * 60 * 60)).toFixed(2))
      record.timeInPR = parseFloat(((mergedAt - openedAt) / (1000 * 60 * 60)).toFixed(2))
      record.timeInTest = parseFloat(((prodDeployedAt - mergedAt) / (1000 * 60 * 60)).toFixed(2))
      record.start = (new Date(record.merged_at.toISOString().split('T')[0])).getTime()
    }

    if(record.fixed_at && record.created_at) {
      record.recoverTime = parseFloat(((record.fixed_at.getTime() - record.created_at.getTime()) / (1000 * 60 * 60)).toFixed(2))
    }
  })
}

export const filterData = (props: Props, data: Record[]) : Record[] => {
  return data.filter(record => {
    const repositoryMatch = props.repositories === undefined || props.repositories.length === 0 || props.repositories.includes(record.repository)
    const teamMatch = !props.team || record.team === props.team
    return repositoryMatch && teamMatch
  });
}

export const fetchData = async (props: Props, onSuccess: (data: any) => void, onFailure?: (data: any) => void) => {

  if(props.data) {
    let parsedData: Record[] = JSON.parse(props.data, recordReviver)

    parsedData = filterData(props, parsedData)

    expandData(parsedData)

    onSuccess(parsedData)

    return
  }

  if(!props.api) {
    return
  }

  const body = {
      repositories: props.repositories,
      team: props.team,
      start: props.start,
      end: props.end
  }

  if(!body.end) {
    body.end = new Date()
  }

  if(!body.start) {
    body.start = new Date()
    body.start.setDate(body.end.getDate() - 30)
  }

  let headers = {}

  if(props.getAuthHeaderValue) {
    headers = {
      'Content-Type': 'application/json',
      'Authorization': await props.getAuthHeaderValue()
    }
  } else {
    headers = {
      'Content-Type': 'application/json',
    }
  }

  const options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body),
  }

  try {
      const response = await fetch(props.api, options)
      const json = await response.text()
      
      let parsedData = JSON.parse(json, recordReviver)

      parsedData = filterData(props, parsedData)

      expandData(parsedData)

      onSuccess(parsedData.records)
  } catch (error) {
      if(onFailure) {
        onFailure(error)
      }
  }
}