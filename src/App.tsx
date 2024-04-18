import React, { useState, useRef } from 'react'
import './App.css'

import { randomStringGenerator } from './utils'
import { EquationData } from './types'

import {
  DndContext,
  closestCenter,
  closestCorners,
  PointerSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import Equation from './Equation'

import type { MathfieldElement, MoveOutEvent } from 'mathlive'

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

function App() {
  const temp = localStorage.getItem('eqs')

  const [eqs, setEqs] = useState(
    JSON.parse(temp === null ? '[]' : temp) as EquationData[]
  )

  const elRefs = useRef([] as Array<MathfieldElement | null>)

  function keyHandler(ev: React.KeyboardEvent, idx: number) {
    const target = ev.target as MathfieldElement
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
    // console.log(value)
    localStorage.setItem('eqs', JSON.stringify(value))
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
    setSaveEqs([...eqs, { id: randomStringGenerator(), eq: '' }])
  }

  const moveOutHandler = (
    ev: CustomEvent<MoveOutEvent>,
    el: MathfieldElement,
    idx: number
  ) => {
    // console.log(ev)
    if (ev.detail.direction === 'upward') {
      if (idx > 0) {
        let preCaretPoint = el.caretPoint?.x
        console.log(el.offsetTop + el.offsetHeight / 2)
        console.log(preCaretPoint)
        el.blur()
        // console.log()
        // console.log(elRefs.current[idx - 1])
        elRefs.current[idx - 1]?.focus()
        // elRefs.current[idx - 1]?.executeCommand('moveToMathfieldEnd')
        // console.log(elRefs.current[idx - 1]?.getCaretPoint())
        const caretPoint = elRefs.current[idx - 1]?.caretPoint?.y
        elRefs.current[idx - 1]?.setCaretPoint(preCaretPoint, caretPoint)
      }
    } else if (ev.detail.direction === 'downward') {
      if (idx < eqs.length - 1) {
        el.blur()
        elRefs.current[idx + 1]?.focus()
        elRefs.current[idx + 1]?.executeCommand('moveToMathfieldStart')
      }
    }
  }

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
        if (oldIndex !== newIndex) swap(oldIndex, newIndex)
      }
  }

  function dragStartHandler(ev) {
    // console.log(ev)
  }

  // const sensers = useSensors(useSensor(PointerSensor), useSensor(MouseSensor))

  return (
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
      </DndContext>
      <div className="add-eq" onMouseUp={addElement}>
        +
      </div>
    </div>
  )
}

export default App
