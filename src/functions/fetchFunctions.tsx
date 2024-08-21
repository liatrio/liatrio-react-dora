import { DoraRecord } from "../interfaces/apiInterfaces"
import { millisecondsToHours, recordDateKeys } from "../constants"
import { subtractHolidays, subtractWeekends, dateToUtc, getDateDaysInPastUtc, utcDateToLocal } from "./dateFunctions"
import { ChartProps } from "../interfaces/propInterfaces"

const recordReviver = (key: string, value: any) => {
  if (recordDateKeys.includes(key) && value) {
      return new Date(value)
  }

  return value
}

const expandData = (props: ChartProps, data: DoraRecord[]) => {
  data.forEach((record) => {
    if(record.merged_at) {
      const mergedAt = record.merged_at
      const deployedAt = record.fixed_at ? record.fixed_at : record.created_at

      let diff = deployedAt.getTime() - mergedAt.getTime()
      
      if(!props.includeWeekendsInCalculations) {
        diff = subtractWeekends(diff, mergedAt, deployedAt)
      }

      if(props.holidays && props.holidays.length > 0) {
        diff = subtractHolidays(diff, mergedAt, deployedAt, props.holidays)
      }

      record.totalCycle = diff / millisecondsToHours
      record.totalCycleHrs = record.totalCycle
      record.totalCycleDays = record.totalCycle / 24
      record.totalCycleMins = record.totalCycle * 60
      record.cycleLabel = 'hrs'

      if(record.totalCycle > 48) {
        record.cycleLabel = 'days'
      } else if(record.totalCycle < 1) {
        record.cycleLabel = 'mins'
      }

      record.start = (new Date(record.merged_at.toISOString().split('T')[0])).getTime()
    }

    const fixedAt = record.fixed_at ? record.fixed_at : props.end ? props.end : getDateDaysInPastUtc(1)

    if(record.failed_at) {
      const failedAt = record.failed_at.getTime()

      record.recoverTime = parseFloat(((fixedAt.getTime() - failedAt) / millisecondsToHours).toFixed(2))
    }

    record.created_at = record.created_at ? utcDateToLocal(record.created_at, false) : record.created_at
    record.merged_at = record.merged_at ? utcDateToLocal(record.merged_at, false) : record.merged_at
    record.fixed_at = record.failed_at ? utcDateToLocal(fixedAt, false) : fixedAt
    record.failed_at = record.failed_at ? utcDateToLocal(record.failed_at, false) : record.failed_at
  })
}

const filterData = (props: ChartProps, data: DoraRecord[]) : DoraRecord[] => {
  return data.filter(record => {
    const repositoryMatch = props.repositories === undefined || props.repositories.length === 0 || props.repositories.includes(record.repository)
    const teamMatch = !props.team || record.team === props.team

    return repositoryMatch && teamMatch
  });
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