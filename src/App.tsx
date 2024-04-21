import React, { useState, createContext } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import { notebookListItemName } from './config'
import { matchLocationOfNotebook } from './utils'

import Main from './components/Main'
import NotebookBoard from './components/NotebookBoard/NotebookBoard'
import CopyBoard from './components/CopyBoard/CopyBoard'
import Welcome from './components/Welcome'
import ErrorPage from './components/ErrorPage'

import './App.css'

interface NotebookListContextType {
  notebookList: string[]
  setSaveNotbookList: (value: string[]) => void
  setNotebookList: React.Dispatch<React.SetStateAction<string[]>>
  notebookListSaveHandler: (newVal: string, idx: number) => void
  notebookListDeleteHander: (idx: number) => void
}

export const NotebookListContext = createContext({} as NotebookListContextType)

export function App() {
  const notebookListData = localStorage.getItem(notebookListItemName)
  const [notebookList, setNotebookList] = useState(
    JSON.parse(notebookListData === null ? '[]' : notebookListData) as string[]
  )
  const navigate = useNavigate()
  const location = useLocation()

  const setSaveNotbookList = (value: string[]) => {
    setNotebookList(value)
    localStorage.setItem(notebookListItemName, JSON.stringify(value))
  }

  const notebookListSaveHandler = (newVal: string, idx: number) => {
    const oldVal = notebookList[idx]
    // same name or not exists in the list
    if (newVal === oldVal || notebookList.indexOf(newVal) === -1) {
      const newList = [...notebookList]
      newList[idx] = newVal

      const equationData = localStorage.getItem(oldVal)
      localStorage.removeItem(oldVal)
      if (equationData !== null) {
        localStorage.setItem(newVal, equationData)
      } else {
        localStorage.setItem(newVal, '[]')
      }
      setSaveNotbookList(newList)
      const match = matchLocationOfNotebook(location)
      if (match !== null && match[1] === oldVal) navigate(`/notebook/${newVal}`)
    } else {
      alert('Name already exists!')
    }
  }

  const notebookListDeleteHander = (idx: number) => {
    const newList = notebookList.filter((_, i) => i !== idx)
    const oldVal = notebookList[idx]
    localStorage.removeItem(oldVal)
    setSaveNotbookList(newList)
    const match = matchLocationOfNotebook(location)
    if (match !== null && match[1] === oldVal) navigate('/')
  }

  const [leftSidebarToggle, setLeftSidebarToggle] = useState(true)
  const [rightSidebarToggle, setRightSidebarToggle] = useState(false)

  const toggleLeftSidebar = () => {
    leftSidebarToggle ? setLeftSidebarToggle(false) : setLeftSidebarToggle(true)
    // setLeftSidebarToggle(toggle)
  }

  const toggleRightSidebar = () => {
    rightSidebarToggle
      ? setRightSidebarToggle(false)
      : setRightSidebarToggle(true)
  }

  return (
    <div id="base">
      <NotebookListContext.Provider
        value={
          {
            notebookList,
            setNotebookList,
            setSaveNotbookList,
            notebookListSaveHandler,
            notebookListDeleteHander,
          } as NotebookListContextType
        }
      >
        <span
          className="left-sidebar-toggler material-symbols-outlined"
          onClick={toggleLeftSidebar}
        >
          menu
        </span>
        <div
          className={
            leftSidebarToggle ? 'left-sidebar' : 'left-sidebar collapse'
          }
        >
          {/* {leftSidebarToggle ? <NotebookBoard></NotebookBoard> : null} */}
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
            <Route path="404" element={<ErrorPage></ErrorPage>}></Route>
          </Routes>
        </div>
        <span
          className="right-sidebar-toggler material-symbols-outlined"
          onClick={toggleRightSidebar}
        >
          menu
        </span>
        <div
          className={
            rightSidebarToggle ? 'right-sidebar' : 'right-sidebar collapse'
          }
        >
          <CopyBoard></CopyBoard>
        </div>
      </NotebookListContext.Provider>
    </div>
  )
}
