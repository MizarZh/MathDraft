import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

import './EditableField.css'

interface EditableFieldProps {
  value: string
  idx: number
  onSave: (newVal: string, idx: number) => void
  onDelete: (idx: number) => void
  elemType: 'text' | 'link'
  to: string
  moveable: boolean
}

export const EditableField = ({
  value,
  idx,
  onSave,
  onDelete,
  elemType,
  to,
  moveable,
}: EditableFieldProps) => {
  const {
    isDragging,
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: value })

  const dragStyle = {
    opacity: isDragging ? 0.2 : 1,
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const [isEditing, setIsEditing] = useState(false)
  const [editedValue, setEditedValue] = useState(value)

  // force update
  useEffect(() => {
    setEditedValue(value)
  }, [value])

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedValue(e.target.value)
  }

  const handleSave = () => {
    onSave(editedValue, idx)
    setIsEditing(false)
  }

  const handleDelete = () => {
    onDelete(idx)
  }

  const handleEnter = (ev: React.KeyboardEvent) => {
    if (ev.key === 'Enter') handleSave()
  }

  const displayElem = (elemType: 'text' | 'link') => {
    if (elemType == 'text') {
      return <h1>{value}</h1>
    } else if (elemType === 'link') {
      return <Link to={to}>{value}</Link>
    }
  }

  return (
    <div className="editable-field" ref={setNodeRef} style={dragStyle}>
      {moveable ? (
        <span
          className="control material-symbols-outlined"
          {...attributes}
          {...listeners}
        >
          menu
        </span>
      ) : null}
      {isEditing ? (
        <input
          type="text"
          value={editedValue}
          onChange={handleChange}
          onBlur={handleSave}
          onKeyDown={handleEnter}
          autoFocus
        />
      ) : (
        displayElem(elemType)
      )}
      <span
        className="control material-symbols-outlined"
        onClick={handleDelete}
      >
        delete
      </span>
      <span
        onClick={handleEdit}
        className="edit-icon material-symbols-outlined"
      >
        edit
      </span>
    </div>
  )
}

export const EditableFieldOverlay = ({
  value,
  elemType,
}: {
  value: string
  elemType: 'text' | 'link'
}) => {
  const displayElem = (elemType: 'text' | 'link') => {
    if (elemType == 'text') {
      return <h1>{value}</h1>
    } else if (elemType === 'link') {
      return <Link to="">{value}</Link>
    }
  }
  return (
    <div className="editable-field">
      <span className="control material-symbols-outlined">menu</span>
      {displayElem(elemType)}
      <span className="control material-symbols-outlined">delete</span>
      <span className="edit-icon material-symbols-outlined">edit</span>
    </div>
  )
}
