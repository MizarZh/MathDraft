import React, { useState, useRef, createContext } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'

import { randomStringGenerator } from './utils'
import { notebookListItemName } from './config'

import Main from './components/Main'
import NotebookBoard from './components/NotebookBoard/NotebookBoard'
import Welcome from './components/Welcome'

import './App.css'

interface NotebookListContextType {
  notebookList: string[]
  setSaveNotbookList: (value: string[]) => void
  setNotebookList: React.Dispatch<React.SetStateAction<string[]>>
  saveHandler: (newVal: string, idx: number) => void
}

export const NotebookListContext = createContext({} as NotebookListContextType)

export function App() {
  const notebookListData = localStorage.getItem(notebookListItemName)
  const [notebookList, setNotebookList] = useState(
    JSON.parse(notebookListData === null ? '[]' : notebookListData) as string[]
  )
  const navigate = useNavigate()

  const setSaveNotbookList = (value: string[]) => {
    setNotebookList(value)
    localStorage.setItem(notebookListItemName, JSON.stringify(value))
  }

  const saveHandler = (newVal: string, idx: number) => {
    const newList = [...notebookList]
    newList[idx] = newVal

    const equationData = localStorage.getItem(notebookList[idx])
    localStorage.removeItem(notebookList[idx])
    if (equationData !== null) {
      localStorage.setItem(newVal, equationData)
    } else {
      localStorage.setItem(newVal, '[]')
    }
    setSaveNotbookList(newList)
    navigate(`/notebook/${newVal}`)
  }

  return (
    <div id="base">
      <NotebookListContext.Provider
        value={
          {
            notebookList,
            setNotebookList,
            setSaveNotbookList,
            saveHandler,
          } as NotebookListContextType
        }
      >
        <div className="left-sidebar">
          <NotebookBoard></NotebookBoard>
        </div>
        <div className="main">
          <Routes>
            <Route path="/" element={<Welcome></Welcome>}></Route>
            {/* <Route path="/notebook/" element={<Main></Main>}></Route> */}
            <Route
              path="/notebook/:notebookName"
              element={<Main></Main>}
            ></Route>
          </Routes>
        </div>
      </NotebookListContext.Provider>
    </div>
  )
}
