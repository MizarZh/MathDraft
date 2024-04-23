import React, { useState, createContext } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import { CopyEquationData } from '../../types'

import './CopyElement.css'
interface CopyElementProps {
  copyEq: CopyEquationData
  idx: number
  func: {
    // updateInputValue: (idx: number, val: string) => void
    deleteCopyEq: (idx: number) => void
  }
}

function CopyElement({ copyEq, idx, func }: CopyElementProps) {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: copyEq.id })

  const { deleteCopyEq } = func

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
          onMouseUp={() => {
            navigator.clipboard.writeText(copyEq.eq)
          }}
        >
          content_copy
        </span>
        <span
          className="control material-symbols-outlined"
          onMouseUp={() => deleteCopyEq(idx)}
        >
          delete
        </span>
      </div>
      <div className="input-area">
        <math-field>{copyEq.eq}</math-field>
      </div>
    </div>
  )
}

function CopyElementOverlay({ copyEq }: { copyEq: CopyEquationData }) {
  return (
    <div className="equation">
      <div className="controller">
        <span className="control material-symbols-outlined">menu</span>
        <span className="control material-symbols-outlined">content_copy</span>
        <span className="control material-symbols-outlined">delete</span>
      </div>
      <div className="input-area">
        <math-field>{copyEq.eq}</math-field>
      </div>
    </div>
  )
}

export { CopyElement, CopyElementOverlay }
