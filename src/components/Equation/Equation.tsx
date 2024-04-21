import React, { useEffect, useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import 'mathlive'
import type { MathfieldElement, MoveOutEvent } from 'mathlive'
import 'mathlive/fonts.css'
import 'material-icons/iconfont/material-icons.css'
import 'material-symbols'

import { EquationData } from '../../types'
import { layout } from '../Keyboard'

import './Equation.css'
interface EquationProps {
  idx: number
  eqData: EquationData
  elRefs: React.MutableRefObject<(MathfieldElement | null)[]>
  // showTextarea: boolean
  func: {
    updateInputValue: (idx: number, val: string) => void
    deleteEq: (idx: number) => void
    moveUp: (idx: number) => void
    moveDown: (idx: number) => void
    keyHandler: (ev: React.KeyboardEvent, idx: number) => void
    moveOutHandler: (
      ev: CustomEvent<MoveOutEvent>,
      el: MathfieldElement,
      idx: number
    ) => void
    // setShowTextarea: (idx: number, val: boolean) => void
  }
}

function Equation({ idx, eqData, elRefs, func }: EquationProps) {
  const {
    updateInputValue,
    deleteEq,
    moveUp,
    moveDown,
    keyHandler,
    moveOutHandler,
    // setShowTextarea,
  } = func

  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: eqData.id })

  const [showTextareaState, setShowTextareaState] = useState(false)
  // useEffect(() => {
  //   setShowTextareaState(showTextarea)
  // }, [showTextarea])
  const toggleShowTextareaState = () => {
    showTextareaState ? setShowTextareaState(false) : setShowTextareaState(true)
    // setShowTextarea(idx, showTextareaState)
  }

  const dragStyle = {
    opacity: isDragging ? 0.2 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const autoResize = (ev: any) => {
    const target = ev.target
    target.style.height = ''
    target.style.height = target.scrollHeight + 'px'
  }

  return (
    <div className="equation" ref={setNodeRef} style={dragStyle}>
      <div className="controller">
        <span
          className="control material-symbols-outlined"
          {...attributes}
          {...listeners}
        >
          menu
        </span>
        <span
          className="control material-symbols-outlined"
          onMouseUp={() => {
            toggleShowTextareaState()
          }}
        >
          {showTextareaState
            ? 'keyboard_double_arrow_up'
            : 'keyboard_double_arrow_down'}
        </span>
        {/* <span
          className="control material-symbols-outlined"
          onMouseUp={() => moveUp(idx)}
        >
          arrow_upward
        </span>
        <span
          className="control material-symbols-outlined"
          onMouseUp={() => moveDown(idx)}
        >
          arrow_downward
        </span> */}
        <span
          className="control material-symbols-outlined"
          onMouseUp={() => deleteEq(idx)}
        >
          delete
        </span>
      </div>
      <div className="input-area">
        <math-field
          onKeyDownCapture={(ev) => keyHandler(ev, idx)}
          onInput={(ev) => {
            updateInputValue(idx, (ev.target as MathfieldElement).value)
          }}
          data-inputAreaState={showTextareaState}
          // onContextMenuCapture={(ev) => console.log(ev.target)}
          ref={(el) => {
            if (el !== null) {
              elRefs.current[idx] = el
              el.addEventListener('move-out', (ev) =>
                moveOutHandler(ev, el, idx)
              )
              // el.addEventListener('focus', () => {
              //   window.mathVirtualKeyboard.layouts = layout
              //   window.mathVirtualKeyboard.visible = true
              // })
            }
          }}
        >
          {eqData.eq}
        </math-field>
        {showTextareaState ? (
          <textarea
            className="math-textarea"
            defaultValue={eqData.eq}
            onInput={(ev) => {
              updateInputValue(idx, (ev.target as HTMLTextAreaElement).value)
              autoResize(ev)
            }}
            onFocus={(ev) => autoResize(ev)}
            spellCheck={false}
          ></textarea>
        ) : null}
      </div>
    </div>
  )
}

function EquationOverlay({
  eqData,
  showTextarea,
}: {
  eqData: EquationData
  showTextarea: boolean
}) {
  return (
    <div className="equation">
      <div className="controller">
        <span className="control material-symbols-outlined">menu</span>
        <span className="control material-symbols-outlined">
          {showTextarea
            ? 'keyboard_double_arrow_up'
            : 'keyboard_double_arrow_down'}
        </span>
        {/* <span className="control material-symbols-outlined">arrow_upward</span>
        <span className="control material-symbols-outlined">
          arrow_downward
        </span> */}
        <span className="control material-symbols-outlined">delete</span>
      </div>
      <div className="input-area">
        <math-field>{eqData.eq}</math-field>
        {showTextarea ? (
          <textarea
            className="math-textarea"
            value={eqData.eq}
            readOnly
          ></textarea>
        ) : null}
      </div>
    </div>
  )
}

export { Equation, EquationOverlay }
