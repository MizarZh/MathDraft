import React, { useState, useRef, useContext, useEffect } from 'react'
import { randomStringGenerator } from '../../utils'

import EditableField from '../EditableField/EditableField'
import { NotebookListContext } from '../../App'

import './NotebookBoard.css'

function NotebookBoard() {
  const {
    notebookList,
    setSaveNotbookList,
    notebookListSaveHandler,
    notebookListDeleteHander,
  } = useContext(NotebookListContext)

  const addHandler = () => {
    setSaveNotbookList([
      ...notebookList,
      `Notebook-${randomStringGenerator(6)}`,
    ])
  }

  return (
    <div className="notebook-root">
      {notebookList.map((val, idx) => {
        return (
          <EditableField
            key={idx}
            value={val}
            idx={idx}
            onSave={notebookListSaveHandler}
            onDelete={notebookListDeleteHander}
            elemType={'link'}
            to={`/notebook/${val}/`}
            moveable={true}
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
