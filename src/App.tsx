import React, { useState, createContext } from 'react'
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'

import Drawer from '@mui/material/Drawer'
import Snackbar from '@mui/material/Snackbar'

import { notebookListItemName, copyBoardItemName } from './config'
import { matchLocationOfNotebook } from './utils'
import { CopyEquationData } from './types'

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

interface CopyEqsContextType {
  copyEqs: CopyEquationData[]
  setSaveCopyEqs: (value: CopyEquationData[]) => void
}

export const NotebookListContext = createContext({} as NotebookListContextType)
export const CopyEqsContext = createContext({} as CopyEqsContextType)

export function App() {
  const [notebookList, setNotebookList] = useState(() => {
    const notebookListData = localStorage.getItem(notebookListItemName)
    return JSON.parse(
      notebookListData === null ? '[]' : notebookListData
    ) as string[]
  })
  const navigate = useNavigate()
  const location = useLocation()

  const setSaveNotbookList = (value: string[]) => {
    setNotebookList(value)
    localStorage.setItem(notebookListItemName, JSON.stringify(value))
  }

  const notebookListSaveHandler = (newVal: string, idx: number) => {
    const oldVal = notebookList[idx]
    if (newVal === notebookListItemName || oldVal === copyBoardItemName) {
      setAlert('Group name should not be the same as list config name!')
    }
    // same name or not exists in the list
    else if (newVal === oldVal || notebookList.indexOf(newVal) === -1) {
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
      if (matchLocationOfNotebook(location, oldVal))
        navigate(`/notebook/${newVal}`)
    } else {
      setAlert('Name already exists!')
    }
  }

  const notebookListDeleteHander = (idx: number) => {
    const newList = notebookList.filter((_, i) => i !== idx)
    const oldVal = notebookList[idx]
    localStorage.removeItem(oldVal)
    setSaveNotbookList(newList)
    if (matchLocationOfNotebook(location, oldVal)) navigate('/')
  }

  // Copy equation
  const [copyEqs, setCopyEqs] = useState(() => {
    const copyEqsData = localStorage.getItem(copyBoardItemName)
    console.log(copyEqsData)
    return JSON.parse(
      copyEqsData === null ? '[]' : copyEqsData
    ) as CopyEquationData[]
  })

  const setSaveCopyEqs = (value: CopyEquationData[]) => {
    setCopyEqs(value)
    localStorage.setItem(copyBoardItemName, JSON.stringify(value))
  }

  // left right sidbar toggle
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

  const drawerWidth = 300,
    copyDrawerWidth = 500

  const getMainStyle = () => {
    return {
      marginLeft: leftSidebarToggle ? 30 : -drawerWidth,
      marginRight: rightSidebarToggle ? 30 : -copyDrawerWidth,
      transition: '250ms',
    }
  }

  const [alert, setAlert] = useState('')

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
        <CopyEqsContext.Provider
          value={
            {
              copyEqs,
              setSaveCopyEqs,
            } as CopyEqsContextType
          }
        >
          <span
            className="left-sidebar-toggler material-symbols-outlined"
            onClick={toggleLeftSidebar}
          >
            menu
          </span>
          <Drawer
            open={leftSidebarToggle}
            variant="persistent"
            anchor="left"
            PaperProps={{
              sx: {
                width: drawerWidth,
              },
            }}
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              zIndex: -10,
              boxSizing: 'border-box',
            }}
            transitionDuration={250}
          >
            <NotebookBoard></NotebookBoard>
          </Drawer>
          <div className="main" style={getMainStyle()}>
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
          <Drawer
            open={rightSidebarToggle}
            variant="persistent"
            anchor="right"
            PaperProps={{
              sx: {
                width: copyDrawerWidth,
              },
            }}
            sx={{
              width: copyDrawerWidth,
              flexShrink: 0,
              zIndex: -10,
              boxSizing: 'border-box',
            }}
            transitionDuration={250}
          >
            <CopyBoard></CopyBoard>
          </Drawer>
        </CopyEqsContext.Provider>
      </NotebookListContext.Provider>
      <Snackbar
        open={alert !== ''}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={6000}
        message={alert}
        onClose={() => setAlert('')}
      ></Snackbar>
    </div>
  )
}
