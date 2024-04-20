import React, { useState, useRef, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
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
import { notebookListItemName } from '../config'

import { Equation, EquationOverlay } from './Equation/Equation'
import EditableField from './EditableField/EditableField'
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

  const equationData = localStorage.getItem(notebookName)
  const [eqs, setEqs] = useState(
    JSON.parse(equationData === null ? '[]' : equationData) as EquationData[]
  )

  const elRefs = useRef([] as Array<MathfieldElement | null>)

  const { notebookList, saveHandler } = useContext(NotebookListContext)

  // force update
  useEffect(() => {
    setEqs(
      JSON.parse(equationData === null ? '[]' : equationData) as EquationData[]
    )
  }, [equationData])

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

  const addElement = () => {
    setSaveEqs([...eqs, { id: randomStringGenerator(8), eq: '' }])
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
        elemType="text"
        onSave={saveHandler}
      ></EditableField>
      <div className="eq-section">
        <DndContext
          // sensors={sensers}
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
                func={{
                  updateInputValue,
                  deleteEq,
                  moveUp,
                  moveDown,
                  keyHandler,
                  moveOutHandler,
                }}
              ></Equation>
            ))}
          </SortableContext>
          <DragOverlay>
            {draggingIdx ? <EquationOverlay eqData={eqs[draggingIdx]} /> : null}
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
