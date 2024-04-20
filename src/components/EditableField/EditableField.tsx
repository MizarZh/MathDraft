import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { randomStringGenerator } from '../../utils'

import './EditableField.css'

interface EditableFieldProps {
  value: string
  idx: number
  onSave: (newVal: string, idx: number) => void
  elemType: 'text' | 'link'
  to: string
}

const EditableField = ({
  value,
  idx,
  onSave,
  elemType,
  to,
}: EditableFieldProps) => {
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
    <div className="editable-field">
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
        onClick={handleEdit}
        className="edit-icon material-symbols-outlined"
      >
        edit
      </span>
    </div>
  )
}

export default EditableField
