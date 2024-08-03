export interface Props {
  api?: string
  getAuthHeaderValue?: () => Promise<string | undefined>
  team?: string
  repositories?: string[]
  data?: any
  end?: Date
  start?: Date
  loading?: boolean
  showWeekends?: boolean
  includeWeekends?: boolean
  showDetails?: boolean
  colors?: string[]
}

export interface Record {
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
  start: number
  recoverTime: number
}

const date_keys = ['merged_at', 'created_at', 'fixed_at', 'failed_at']

export const recordReviver = (key: string, value: any) => {
  if (date_keys.includes(key) && value) {
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
  let hue = 1 // Start at a random hue

  for (let i = 0; i < count; i++) {
      hue += goldenRatioConjugate
      hue %= 1
      const color = hslToHex(hue, 0.9, 0.6) // Convert HSL color to hex
      colors.push(color)
  }

  return colors
}

export const generateTicks = (start: Date, end: Date, numIntervals: number) => {
  const ticks = [];
  const interval = (end.getTime() - start.getTime()) / numIntervals;
  for (let i = 0; i <= numIntervals; i++) {
    ticks.push(new Date(start.getTime() + interval * i).getTime());
  }
  return ticks
}

export const formatTicks = (tick: any) : string => {
  return new Date(tick).toLocaleDateString();
}

export const expandData = (data: Record[]) => {
  data.forEach((record) => {
    if(record.merged_at) {
      const mergedAt = record.merged_at.getTime()
      const deployedAt = record.fixed_at ? record.fixed_at.getTime() : record.created_at.getTime()

      record.totalCycle = parseFloat(((deployedAt - mergedAt) / (1000 * 60 * 60)).toFixed(2))
      record.start = (new Date(record.merged_at.toISOString().split('T')[0])).getTime()
    }

    if(record.fixed_at && record.failed_at) {
      const failedAt = record.failed_at.getTime()
      const fixedAt = record.fixed_at.getTime()

      record.recoverTime = parseFloat(((fixedAt - failedAt) / (1000 * 60 * 60)).toFixed(2))
    }

    record.created_at = record.created_at ? utcDateToLocal(record.created_at, false) : record.created_at
    record.merged_at = record.merged_at ? utcDateToLocal(record.merged_at, false) : record.merged_at
    record.fixed_at = record.fixed_at ? utcDateToLocal(record.fixed_at, false) : record.fixed_at
    record.failed_at = record.failed_at ? utcDateToLocal(record.failed_at, false) : record.failed_at
  })
}

export const filterData = (props: Props, data: Record[]) : Record[] => {
  return data.filter(record => {
    const repositoryMatch = props.repositories === undefined || props.repositories.length === 0 || props.repositories.includes(record.repository)
    const teamMatch = !props.team || record.team === props.team

    return repositoryMatch && teamMatch
  });
}

export const getDateDaysInPast = (daysInPast: number, dateOnly: boolean = true) : Date => {
  let date = new Date();

  date.setDate(date.getDate() - daysInPast)

  if(dateOnly) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  } else {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
  }
}

export const getDateDaysInPastUtc = (daysInPast: number, dateOnly: boolean = true) : Date => {
  let date = new Date()

  date.setDate(date.getDate() - daysInPast)

  return dateToUtc(date, dateOnly)
}

export const utcDateToLocal = (date: Date, dateOnly: boolean = true) => {
  if(dateOnly) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
  } else {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds())
  }
}

export const dateToUtc = (date: Date, dateOnly: boolean = true) => {
  if(dateOnly) {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  } else {
    return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()))
  }
}

export const fetchData = async (props: Props, onSuccess: (data: any) => void, onFailure?: (data: any) => void) => {
  if(props.data) {
    let data = props.data
    let parsedData: any = {}

    if(typeof data === "string") {
      parsedData = JSON.parse(data, recordReviver)
    }

    if(parsedData.records) {
      parsedData = filterData(props, parsedData.records)

      expandData(parsedData)

      onSuccess(parsedData)
    } else {
      onSuccess(props.data)
    }

    return
  }

  if(!props.api) {
    return
  }

  const start = props.start ? dateToUtc(props.start) : getDateDaysInPastUtc(31)
  const end = props.end ? dateToUtc(props.end) : getDateDaysInPastUtc(1)

  const body = {
      repositories: props.repositories,
      team: props.team,
      start: start,
      end: end
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

      parsedData = filterData(props, parsedData.records)

      expandData(parsedData)

      onSuccess(parsedData)
  } catch (error) {
      if(onFailure) {
        onFailure(error)
      }
  }
}