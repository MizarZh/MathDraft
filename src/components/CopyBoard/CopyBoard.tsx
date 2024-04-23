import React, { useState, useContext } from 'react'
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

import { CopyEqsContext } from '../../App'
import { CopyElement, CopyElementOverlay } from './CopyElement'

import './CopyBoard.css'

function CopyBoard() {
  const { copyEqs, setSaveCopyEqs } = useContext(CopyEqsContext)

  const deleteCopyEq = (idx: number) => {
    setSaveCopyEqs(copyEqs.filter((_, i: number) => i !== idx))
  }

  const [draggingIdx, setDraggingIdx] = useState<number | null>(null)

  function dragEndHandler(ev: DragEndEvent) {
    const { active, over } = ev
    if (over !== null)
      if (active.id !== over.id) {
        let oldIndex = 0,
          newIndex = 0
        for (const [idx, eq] of copyEqs.entries()) {
          if (eq.id === active.id) {
            oldIndex = idx
          }
          if (eq.id === over.id) {
            newIndex = idx
          }
        }
        if (oldIndex !== newIndex) {
          setSaveCopyEqs(arrayMove(copyEqs, oldIndex, newIndex))
        }
      }
  }

  function dragStartHandler(ev: DragStartEvent) {
    const { active } = ev
    for (const [idx, eq] of copyEqs.entries()) {
      if (active.id === eq.id) {
        setDraggingIdx(idx)
      }
    }
  }

  return (
    <div className="copyboard-root">
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={dragEndHandler}
        onDragStart={dragStartHandler}
      >
        <SortableContext items={copyEqs} strategy={verticalListSortingStrategy}>
          {copyEqs.map((val, idx) => (
            <CopyElement
              copyEq={val}
              idx={idx}
              key={val.id}
              func={{ deleteCopyEq }}
            ></CopyElement>
          ))}
        </SortableContext>
        <DragOverlay>
          {draggingIdx ? (
            <CopyElementOverlay copyEq={copyEqs[draggingIdx]} />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  )
}

export default CopyBoard
