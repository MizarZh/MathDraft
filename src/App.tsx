import React, { useState, useRef } from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import Main from './components/Main'
import NotebookBoard from './components/NotebookBoard/NotebookBoard'
import Welcome from './components/Welcome'

import { randomStringGenerator } from './utils'

function App() {
  return (
    <div id="base">
      <div className="left-sidebar">
        <NotebookBoard></NotebookBoard>
      </div>
      <div className="main">
        <Routes>
          <Route path="/" element={<Welcome></Welcome>}></Route>
          {/* <Route path="/notebook/" element={<Main></Main>}></Route> */}
          <Route path="/notebook/:notebookName" element={<Main></Main>}></Route>
        </Routes>
      </div>
    </div>
  )
}

export default App
