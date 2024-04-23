import React, { useState, useRef, useEffect, useContext } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  DndContext,
  closestCorners,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import type { MathfieldElement, MoveOutEvent } from 'mathlive'

import { randomStringGenerator } from '../utils'
import { EquationData } from '../types'
import { defaultEquationConfig } from '../config'

import { Equation, EquationOverlay } from './Equation/Equation'
import { EditableField } from './EditableField/EditableField'
import { NotebookListContext } from '../App'

import './Main.css'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'math-field': React.DetailedHTMLProps<
        React.HTMLAttributes<MathfieldElement>,
        MathfieldElement
      >
    }
  }
}

function Main() {
  const params = useParams()
  let notebookName: string
  if (params.notebookName === undefined) {
    notebookName = 'eqs'
  } else {
    notebookName = params.notebookName
  }

  const { notebookList, notebookListSaveHandler, notebookListDeleteHander } =
    useContext(NotebookListContext)

  // 404
  const navigate = useNavigate()
  useEffect(() => {
    if (notebookList.indexOf(notebookName) === -1) {
      navigate('/404')
    }
  })

  // equation
  const [eqs, setEqs] = useState([] as EquationData[])
  const elRefs = useRef([] as Array<MathfieldElement | null>)

  // force update
  useEffect(() => {
    const equationData = localStorage.getItem(notebookName)
    setEqs(
      JSON.parse(equationData === null ? '[]' : equationData) as EquationData[]
    )
  }, [notebookName])

  // // show index
  // const [showTextareaList, setShowTextareaList] = useState(
  //   Array(eqs.length).fill(false)
  // )

  // const setShowTextarea = (idx: number, val: boolean) => {
  //   const temp = showTextareaList
  //   temp[idx] = val
  //   setShowTextareaList(temp)
  // }

  // const [showTextarea, setShowTextarea] = useState(false)

  function keyHandler(ev: React.KeyboardEvent, idx: number) {
    // const target = ev.target as MathfieldElement
    // add arrow, input, selection and paste support
    // if (ev.key === 'ArrowLeft' || ev.key === 'ArrowRight') {
    //   const X = target.caretPoint?.x
    //   if (X !== undefined) {
    //     setCaretX(X)
    //   }
    // }
    // if (idx !== undefined) {
    //   if (ev.key === 'Enter') {
    //     const x = [...eqs]
    //     x.splice(idx + 1, 0, 'test')
    //     setEqs(x)
    //   } else if (ev.key === 'Backspace') {
    //     if (target.value === '') {
    //       const x = [...eqs]
    //       x.splice(idx, 1)
    //       setEqs(x)
    //     }
    //   }
    // }
    // console.log(target.caretPoint)
  }

  function setSaveEqs(value: EquationData[]) {
    setEqs(value)
    localStorage.setItem(notebookName, JSON.stringify(value))
  }

  const updateInputValue = (idx: number, val: string) => {
    setSaveEqs(
      eqs.map((preVal: EquationData, i: number) => {
        if (i === idx) {
          return { ...preVal, eq: val }
        } else {
          return preVal
        }
      })
    )
  }

  const deleteEq = (idx: number) => {
    setSaveEqs(eqs.filter((_, i: number) => i !== idx))
  }

  const swap = (idx1: number, idx2: number) => {
    const x = [...eqs]
    const temp = x[idx1]
    x[idx1] = x[idx2]
    x[idx2] = temp
    setSaveEqs(x)
  }

  const moveUp = (idx: number) => {
    if (idx > 0) {
      swap(idx, idx - 1)
    }
  }

  const moveDown = (idx: number) => {
    if (idx < eqs.length - 1) {
      swap(idx, idx + 1)
    }
  }

  const toggleCollapse = (idx: number) => {
    const x = [...eqs]
    const collapse = eqs[idx].config.collapse
    x[idx].config.collapse = collapse ? false : true
    setSaveEqs(x)
  }

  const addElement = () => {
    setSaveEqs([
      ...eqs,
      {
        id: randomStringGenerator(8),
        eq: '',
        config: Object.assign({}, defaultEquationConfig),
      },
    ])
  }

  const moveOutHandler = (
    ev: CustomEvent<MoveOutEvent>,
    el: MathfieldElement,
    idx: number
  ) => {
    const caretX = el.caretPoint?.x
    if (ev.detail.direction === 'upward') {
      if (idx > 0) {
        el.blur()
        elRefs.current[idx - 1]?.focus()
        // elRefs.current[idx - 1]?.executeCommand('moveToMathfieldStart')
        const caretY = elRefs.current[idx - 1]?.caretPoint?.y
        if (caretY !== undefined && caretX !== undefined)
          elRefs.current[idx - 1]?.setCaretPoint(caretX, caretY)
      }
    } else if (ev.detail.direction === 'downward') {
      if (idx < eqs.length - 1) {
        el.blur()
        elRefs.current[idx + 1]?.focus()
        // elRefs.current[idx + 1]?.executeCommand('moveToMathfieldStart')
        const caretY = elRefs.current[idx + 1]?.caretPoint?.y
        if (caretY !== undefined && caretX !== undefined)
          elRefs.current[idx + 1]?.setCaretPoint(caretX, caretY)
      }
    }
  }

  // drag
  const [draggingIdx, setDraggingIdx] = useState<number | null>(null)

  function dragEndHandler(ev: DragEndEvent) {
    const { active, over } = ev
    if (over !== null)
      if (active.id !== over.id) {
        let oldIndex = 0,
          newIndex = 0
        for (const [idx, eq] of eqs.entries()) {
          if (eq.id === active.id) {
            oldIndex = idx
          }
          if (eq.id === over.id) {
            newIndex = idx
          }
        }
        if (oldIndex !== newIndex) {
          setSaveEqs(arrayMove(eqs, oldIndex, newIndex))
        }
      }
  }

  function dragStartHandler(ev: DragStartEvent) {
    const { active } = ev
    for (const [idx, eq] of eqs.entries()) {
      if (active.id === eq.id) {
        setDraggingIdx(idx)
      }
    }
  }

  return (
    <div className="main-section">
      <EditableField
        to=""
        value={notebookName}
        idx={notebookList.indexOf(notebookName)}
        elemType="title"
        onSave={notebookListSaveHandler}
        onDelete={notebookListDeleteHander}
        moveable={false}
      ></EditableField>
      <div className="eq-section">
        <DndContext
          collisionDetection={closestCorners}
          onDragEnd={dragEndHandler}
          onDragStart={dragStartHandler}
        >
          <SortableContext items={eqs} strategy={verticalListSortingStrategy}>
            {eqs.map((val, idx) => (
              <Equation
                key={val.id}
                idx={idx}
                eqData={val}
                elRefs={elRefs}
                // showTextarea={showTextareaList[idx]}
                func={{
                  updateInputValue,
                  deleteEq,
                  moveUp,
                  moveDown,
                  keyHandler,
                  moveOutHandler,
                  toggleCollapse,
                  // setShowTextarea,
                }}
              ></Equation>
            ))}
          </SortableContext>
          <DragOverlay>
            {draggingIdx ? (
              <EquationOverlay eqData={eqs[draggingIdx]} showTextarea={false} />
            ) : null}
          </DragOverlay>
        </DndContext>
        <div className="add-eq" onMouseUp={addElement}>
          +
        </div>
      </div>
    </div>
  )
}

export default Main
