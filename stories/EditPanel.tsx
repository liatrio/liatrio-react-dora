import React, { ReactNode } from 'react'
import { GraphProperties } from './useGraph'
import DatePicker from 'react-datepicker'
import './general.css'
import "react-datepicker/dist/react-datepicker.css"

interface Props {
  children: ReactNode,
  args: GraphProperties,
  showStandardFields: boolean,
}

const spliter = (
  <div className="editorSplit"></div>
)

const EditPanel : React.FC<Props> = (props: Props) => {
  const children = React.Children.toArray(props.children)

  const childrenWithSeparator = children.reduce<React.ReactNode[]>((acc, child, index) => {
    if (index > 0 && index % 2 === 0) {
      acc.push(spliter)
    }

    acc.push(<div className="editorFieldContainer">{child}</div>)

    return acc
  }, [])

  return (<>
    <div className="editor">
      <div className="editorFieldContainer">
        <label>Data Set:</label>
        <select onChange={props.args.changeDataSet}>
          <option value={0} selected>Low</option>
          <option value={1}>Medium</option>
          <option value={2}>High</option>
          <option value={3}>Elite</option>
          <option value={4}>Team</option>
        </select>
      </div>
      {props.showStandardFields && <>
        <div className="editorFieldContainer">
          <label>Message:</label>
          <input type='text' value={props.args.message ?? ""} onChange={props.args.changeMessage} />
        </div>
        {spliter}
        <div className="editorFieldContainer">
          <label>Loading:</label>
          <input type='checkbox' checked={props.args.loading} onChange={props.args.changeLoading} />
        </div>
        <div className="editorFieldContainer">
          <label>Include Weekends:</label>
          <input type='checkbox' checked={props.args.loading} onChange={props.args.changeIncludeWeekends} />
        </div>
        {spliter}
        {/* todo
        holidays
        */}
      </>}
      {childrenWithSeparator}
      <div className="editorFieldContainer">
        <label>Graph Date Range:</label>
        <DatePicker
            selected={props.args.calendarStartDate}
            onChange={props.args.changeDateRange}
            startDate={props.args.calendarStartDate}
            endDate={props.args.calendarEndDate}
            selectsRange
            popperPlacement="bottom"
          />
      </div>
    </div>
  </>)
}

export default EditPanel
