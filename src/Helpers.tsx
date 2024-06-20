export interface Props {
  api?: string,
  getAuthHeaderValue?: () => Promise<string | undefined>,
  team?: string,
  repositories?: string[],
  data?: string,
  end?: Date,
  start?: Date
}

export interface Record {
  repository: string,
  team: string
  title: string,
  user: string,
  sha: string,
  status: boolean,
  opened_at: Date,
  merged_at: Date,
  created_at: Date,
  fixed_at: Date
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

export const fetchData = async (props: Props, onSuccess: (data: any) => void, onFailure?: (data: any) => void) => {

  if(props.data) {
    const data: Record[] = JSON.parse(props.data, recordReviver)
    onSuccess(data)
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
      
      const parsedData = JSON.parse(json, recordReviver)

      onSuccess(parsedData)
  } catch (error) {
      if(onFailure) {
        onFailure(error)
      }
  }
}