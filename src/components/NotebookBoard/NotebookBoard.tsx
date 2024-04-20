import React, { useState, useRef, useContext, useEffect } from 'react'
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

import { randomStringGenerator } from '../../utils'

import {
  EditableField,
  EditableFieldOverlay,
} from '../EditableField/EditableField'
import { NotebookListContext } from '../../App'

import './NotebookBoard.css'

function NotebookBoard() {
  const {
    notebookList,
    setSaveNotbookList,
    notebookListSaveHandler,
    notebookListDeleteHander,
  } = useContext(NotebookListContext)

  const addHandler = () => {
    setSaveNotbookList([
      ...notebookList,
      `Notebook-${randomStringGenerator(6)}`,
    ])
  }

  const [draggingIdx, setDraggingIdx] = useState<number | null>(null)

  function dragEndHandler(ev: DragEndEvent) {
    const { active, over } = ev
    if (over !== null)
      if (active.id !== over.id) {
        let oldIndex = 0,
          newIndex = 0
        for (const [idx, notebook] of notebookList.entries()) {
          if (notebook === active.id) {
            oldIndex = idx
          }
          if (notebook === over.id) {
            newIndex = idx
          }
        }
        if (oldIndex !== newIndex) {
          setSaveNotbookList(arrayMove(notebookList, oldIndex, newIndex))
        }
      }
  }

  function dragStartHandler(ev: DragStartEvent) {
    const { active } = ev
    for (const [idx, notebook] of notebookList.entries()) {
      if (active.id === notebook) {
        setDraggingIdx(idx)
      }
    }
  }

  return (
    <div className="notebook-root">
      <DndContext
        collisionDetection={closestCorners}
        onDragEnd={dragEndHandler}
        onDragStart={dragStartHandler}
      >
        <SortableContext
          items={notebookList}
          strategy={verticalListSortingStrategy}
        >
          {notebookList.map((val, idx) => {
            return (
              <EditableField
                key={val}
                value={val}
                idx={idx}
                onSave={notebookListSaveHandler}
                onDelete={notebookListDeleteHander}
                elemType={'link'}
                to={`/notebook/${val}/`}
                moveable={true}
              ></EditableField>
            )
          })}
          <div className="add-notebook" onClick={addHandler}>
            +
          </div>
          <DragOverlay>
            {draggingIdx ? (
              <EditableFieldOverlay
                value={notebookList[draggingIdx]}
                elemType="link"
              />
            ) : null}
          </DragOverlay>
        </SortableContext>
      </DndContext>
    </div>
  )
}

export default NotebookBoard
