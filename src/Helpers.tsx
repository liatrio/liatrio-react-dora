export const generateDistinctColors = (count: number) => {
  const colors = []
  const goldenRatioConjugate = 0.618033988749895
  let hue = Math.random() // Start at a random hue

  for (let i = 0; i < count; i++) {
      hue += goldenRatioConjugate
      hue %= 1
      const color = hslToHex(hue, 0.5, 0.6) // Convert HSL color to hex
      colors.push(color)
  }

  return colors
}

const hslToHex = (h: number, s: number, l: number) => {
  const hue = Math.round(360 * h)
  const saturation = Math.round(100 * s)
  const lightness = Math.round(100 * l)

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}

export const fetchData = async (api: string, body: any, reviver: (key: string, value: any) => any, onSuccess: (data: any) => void, onFailure?: (data: any) => void) => {
  if(!body.end) {
    body.end = new Date()
  }

  if(!body.start) {
    body.start = new Date()
    body.start.setDate(body.end.getDate() - 30)
  }

  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
  }

  try {
      const response = await fetch(api, options)
      const json = await response.text()
      
      const parsedData = JSON.parse(json, reviver)

      onSuccess(parsedData)
  } catch (error) {
      if(onFailure) {
        onFailure(error)
      }
  }
}