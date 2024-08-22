import { default as edata } from './data_elite'
import { default as mdata } from './data_medium'
import { default as hdata } from './data_high'
import { default as ldata } from './data_low'
import { default as tdata } from './data_team'
import { processData } from '../src/functions/fetchFunctions'

// const data = processData(edata, {})
// const data = processData(hdata, {})
// const data = processData(mdata, {})
// const data = processData(ldata, {})
const data = processData(tdata, {})

export default data