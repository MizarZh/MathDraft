import React, { useState, useRef } from 'react'
import { notebookListItemName } from '../../config'

import EditableField from '../EditableField/EditableField'
import { randomStringGenerator } from '../../utils'

import './NotebookBoard.css'

function NotebookBoard() {
  const notebookListData = localStorage.getItem(notebookListItemName)
  const [notebookList, setNotebookList] = useState(
    JSON.parse(notebookListData === null ? '[]' : notebookListData) as string[]
  )
  const setSaveNotbookList = (value: string[]) => {
    setNotebookList(value)
    localStorage.setItem(notebookListItemName, JSON.stringify(value))
  }

  const saveHandler = (newVal: string, idx: number) => {
    const newList = [...notebookList]
    newList[idx] = newVal
    setSaveNotbookList(newList)

    const equationData = localStorage.getItem(notebookList[idx])
    localStorage.removeItem(notebookList[idx])
    if (equationData !== null) {
      localStorage.setItem(newVal, equationData)
    } else {
      localStorage.setItem(newVal, '[]')
    }
  }

  const addHandler = () => {
    setSaveNotbookList([...notebookList, `Notebook-${randomStringGenerator(6)}`])
  }

  return (
    <div className="notebook-root">
      {notebookList.map((val, idx) => {
        return (
          <EditableField
            key={idx}
            value={val}
            idx={idx}
            onSave={saveHandler}
            elemType={'Link'}
            to={`/notebook/${val}/`}
          ></EditableField>
        )
      })}
      <div className="add-notebook" onClick={addHandler}>
        +
      </div>
    </div>
  )
}

export default NotebookBoard
