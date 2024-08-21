import { DoraRecord } from '../interfaces/apiInterfaces'

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

