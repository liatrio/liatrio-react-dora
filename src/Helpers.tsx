export interface ChartProps {
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
  measures?: RankThresholds
}

export interface RankThreshold {
  elite: number,
  high: number,
  medium: number,
  low: number,
}

export interface RankThresholds {
  df: RankThreshold,
  clt: RankThreshold,
  cfr: RankThreshold,
  rt: RankThreshold,
}

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
  start: number
  recoverTime: number
  deploy_url: string
  fixed_url: string
  change_url: string
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

export const extractUniqueRepositories = (data: DoraRecord[]) => {
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

export const subtractWeekends = (props: ChartProps, start: Date, end: Date) : number => {
  const milliToDays = 24 * 60 * 60 * 1000
  let diff = end.getTime() - start.getTime()
  const gapDays = Math.floor(diff / milliToDays)

  if(!props.includeWeekends && gapDays > 1) {
    while(start.getTime() <= end.getTime()) {
      let current_day = start.getDay()

      if(current_day === 0 || current_day === 6) {
        diff -= milliToDays
      }

      start.setDate(start.getDate() + 1)
    }
  }

  return diff
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

export const expandData = (props: ChartProps, data: DoraRecord[]) => {
  data.forEach((record) => {
    if(record.merged_at) {
      const mergedAt = record.merged_at
      const deployedAt = record.fixed_at ? record.fixed_at : record.created_at

      let diff = subtractWeekends(props, mergedAt, deployedAt)

      record.totalCycle = (diff / (60 * 60 * 1000))
      record.start = (new Date(record.merged_at.toISOString().split('T')[0])).getTime()
    }

    const fixedAt = record.fixed_at ? record.fixed_at : props.end ? props.end : getDateDaysInPastUtc(1)

    if(record.failed_at) {
      const failedAt = record.failed_at.getTime()

      record.recoverTime = parseFloat(((fixedAt.getTime() - failedAt) / (1000 * 60 * 60)).toFixed(2))
    }

    record.created_at = record.created_at ? utcDateToLocal(record.created_at, false) : record.created_at
    record.merged_at = record.merged_at ? utcDateToLocal(record.merged_at, false) : record.merged_at
    record.fixed_at = record.failed_at ? utcDateToLocal(fixedAt, false) : fixedAt
    record.failed_at = record.failed_at ? utcDateToLocal(record.failed_at, false) : record.failed_at
  })
}

export const filterData = (props: ChartProps, data: DoraRecord[]) : DoraRecord[] => {
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

export const fetchData = async (props: ChartProps, onSuccess: (data: any) => void, onFailure?: (data: any) => void) => {
  if(props.data) {
    let data = props.data
    let parsedData: any = {}

    if(typeof data === "string") {
      parsedData = JSON.parse(data, recordReviver)
    }

    if(parsedData.records) {
      parsedData = filterData(props, parsedData.records)

      expandData(props, parsedData)

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

      expandData(props, parsedData)

      onSuccess(parsedData)
  } catch (error) {
      if(onFailure) {
        onFailure(error)
      }
  }
}

const calculateCFRRate = (data: DoraRecord[]) : number => {
  const totalSuccessfulRecords = data.filter(f => f.status === true && !f.failed_at).length
  const totalFailedRecords = data.filter(f => f.status === false || (f.status === true && f.failed_at)).length

  return totalFailedRecords / (totalSuccessfulRecords === 0 ? 1 : totalSuccessfulRecords)
}

const calculateCLTRate = (data: DoraRecord[]) : number => {
  let totalSuccessfulRecords = 0
  let totalLeadTime = 0

  data.forEach(record => {
    if(record.totalCycle === undefined) {
      return
    }

    totalSuccessfulRecords++
    totalLeadTime += record.totalCycle
  })

  return totalLeadTime / (totalSuccessfulRecords === 0 ? 1 : totalSuccessfulRecords)
}

export const MaxDF = 1000000

const calculateDFRate = (props: ChartProps, data: DoraRecord[]) : number => {
  let sorted = data
    .sort((a, b) => a.created_at.getTime() - b.created_at.getTime())
  
  if(sorted.length === 0) {
    return MaxDF
  }

  let totalDeployTime = 0

  for(let index = 1; index < sorted.length; index++) {
    let start = sorted[index - 1].created_at
    let end = sorted[index].created_at

    let diff = subtractWeekends(props, start, end)

    totalDeployTime += diff
  }
  
  let avgDeployTime = (totalDeployTime / sorted.length) / (1000 * 60 * 60)
  
  return avgDeployTime
}

const calculateRTRate = (data: DoraRecord[]) : number => {
  let totalFailedRecords = 0
  let totalRecoveryTime = 0

  data.forEach(record => {
    if((record.status === true && !record.failed_at) || record.recoverTime === undefined) {
      return
    }

    totalFailedRecords++
    totalRecoveryTime += record.recoverTime
  })

  return totalRecoveryTime / (totalFailedRecords === 0 ? 1 : totalFailedRecords)
}

interface Scores {
  rt: number,
  clt: number,
  cfr: number,
  df: number
}

export const calculateScores = (props: ChartProps, data: DoraRecord[]) : Scores => {
  return {
    rt: calculateRTRate(data),
    clt: calculateCLTRate(data),
    cfr: calculateCFRRate(data),
    df: calculateDFRate(props, data)
  }
}

const calculatCFRRank = (props: ChartProps, rate: number) : number => {
  if(rate < (props.measures?.cfr.elite ? props.measures?.cfr.elite : 5)) {
    return 0
  } else if(rate <= (props.measures?.cfr.high ? props.measures?.cfr.high : 10)) {
    return 1
  } else if(rate <= (props.measures?.cfr.medium ? props.measures?.cfr.medium : 45)) {
    return 2
  } else {
    return 3
  }
}

const calculateCLTRank = (props: ChartProps, rate: number) : number => {
  if(rate < (props.measures?.clt.elite ? props.measures?.cfr.elite : 24)) {
    return 0
  } else if(rate < (props.measures?.clt.high ? props.measures?.cfr.high : 24 * 7)) {
    return 1
  } else if(rate < (props.measures?.clt.medium ? props.measures?.cfr.medium : 24 * 7 * 4.33)) {
    return 2
  } else {
    return 3
  }
}

const calculateDFRank = (props: ChartProps, rate: number) : number => {
  if(rate < (props.measures?.df.elite ? props.measures?.df.elite : 24)) {
    return 0
  } else if(rate < (props.measures?.df.high ? props.measures?.df.high : 24 * 7)) {
    return 1
  } else if(rate < (props.measures?.df.medium ? props.measures?.df.medium : 24 * 7 * 4.33)) {
    return 2
  } else {
    return 3
  }
}

const calculateRTRank = (props: ChartProps, rate: number) : number => {
  if(rate < (props.measures?.rt.elite ? props.measures?.rt.elite : 1)) {
    return 0
  } else if(rate < (props.measures?.rt.high ? props.measures?.rt.high : 24)) {
    return 1
  } else if(rate < (props.measures?.rt.medium ? props.measures?.rt.medium : 24 * 7)) {
    return 2
  } else {
    return 3
  }
}

export const calculateDoraRanks = (props: ChartProps, scores: Scores) : {df: number, rt: number, clt: number, cfr: number} => {
  return {
    df: calculateDFRank(props, scores.df),
    rt: calculateRTRank(props, scores.rt),
    cfr: calculatCFRRank(props, scores.cfr),
    clt: calculateCLTRank(props, scores.clt),
  }
}

export const greenFilter = "brightness(0) saturate(100%) invert(60%) sepia(75%) saturate(4083%) hue-rotate(73deg) brightness(92%) contrast(92%)"
export const yellowFilter = "brightness(0) saturate(100%) invert(93%) sepia(74%) saturate(3024%) hue-rotate(1deg) brightness(102%) contrast(102%)"
export const orangeFilter = "brightness(0) saturate(100%) invert(45%) sepia(250%) saturate(500%) hue-rotate(-15deg) brightness(100%) contrast(120%)"
export const blueFilter = "brightness(0.5) saturate(100%) invert(21%) sepia(98%) saturate(747%) hue-rotate(179deg) brightness(97%) contrast(103%)"
export const greyFilter = "brightness(0) saturate(100%) invert(50%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(100%)"

export const convertRankToColor = (rank: number) => {
  if(rank === 0) {
    return greenFilter
  } else if(rank === 1) {
    return blueFilter
  } else if(rank === 2) {
    return yellowFilter
  } else if(rank === 3) {
    return orangeFilter
  } else {
    return greyFilter
  }
}