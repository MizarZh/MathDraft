import React from 'react'
import './Equation.css'

import 'material-icons/iconfont/material-icons.css'
import 'material-symbols'

import 'mathlive'
import type { MathfieldElement, MoveOutEvent } from 'mathlive'
import 'mathlive/fonts.css'

import { EquationData } from './types'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  idx: number
  eqData: EquationData
  elRefs: React.MutableRefObject<(MathfieldElement | null)[]>
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
  }
}

function Equation({ idx, eqData, elRefs, func }: Props) {
  const {
    updateInputValue,
    deleteEq,
    moveUp,
    moveDown,
    keyHandler,
    moveOutHandler,
  } = func

  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: eqData.id })

  const dragStyle = {
    opacity: isDragging ? 0.2 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
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
          onMouseUp={() => moveUp(idx)}
        >
          arrow_upward
        </span>
        <span
          className="control material-symbols-outlined"
          onMouseUp={() => moveDown(idx)}
        >
          arrow_downward
        </span>
        <span
          className="control material-symbols-outlined"
          onMouseUp={() => deleteEq(idx)}
        >
          delete
        </span>
      </div>
      <math-field
        onKeyDownCapture={(ev) => keyHandler(ev, idx)}
        onInput={(ev) => {
          updateInputValue(idx, (ev.target as MathfieldElement).value)
        }}
        ref={(el) => {
          elRefs.current[idx] = el
          el?.addEventListener('move-out', (ev) => moveOutHandler(ev, el, idx))
        }}
      >
        {eqData.eq}
      </math-field>
    </div>
  )
}

function EquationOverlay({ eqData }: { eqData: EquationData }) {
  return (
    <div className="equation">
      <div className="controller">
        <span className="control material-symbols-outlined">menu</span>
        <span className="control material-symbols-outlined">arrow_upward</span>
        <span className="control material-symbols-outlined">
          arrow_downward
        </span>
        <span className="control material-symbols-outlined">delete</span>
      </div>
      <math-field>{eqData.eq}</math-field>
    </div>
  )
}

export { Equation, EquationOverlay }
