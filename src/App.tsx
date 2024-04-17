import React, { KeyboardEvent, FormEvent, useState, useRef } from 'react'
import './App.css'
import 'mathlive'
import { MathfieldElement } from 'mathlive'
import 'mathlive/fonts.css'
import { randomStringGenerator } from './utils'

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

interface Equation {
  name: string
  eq: string
}

function App() {
  // const [eqs, setEqs] = useState([
  //   { eq: '\\alpha = \\beta' },
  //   { eq: '\\delta = \\gamma' },
  // ] as Equation[])

  const temp = localStorage.getItem('eqs')

  const [eqs, setEqs] = useState(
    JSON.parse(temp === null ? '[]' : temp) as Equation[]
  )

  const elRefs = useRef([] as Array<MathfieldElement | null>)

  function keyHandler(ev: KeyboardEvent, idx: number) {
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
  }

  function setSaveEqs(value: Equation[]) {
    setEqs(value)
    console.log(value)
    localStorage.setItem('eqs', JSON.stringify(value))
  }

  const updateInputValue = (idx: number, val: string) => {
    setSaveEqs(
      eqs.map((preVal: Equation, i: number) => {
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

  const moveUp = (idx: number) => {
    if (idx > 0) {
      const x = [...eqs]
      const temp = x[idx]
      x[idx] = x[idx - 1]
      x[idx - 1] = temp
      setSaveEqs(x)
    }
  }

  const moveDown = (idx: number) => {
    if (idx < eqs.length - 1) {
      const x = [...eqs]
      const temp = x[idx]
      x[idx] = x[idx + 1]
      x[idx + 1] = temp
      setSaveEqs(x)
    }
  }

  function addElement() {
    setSaveEqs([...eqs, { name: randomStringGenerator(), eq: '' }])
  }

  const eqList = eqs.map((eq: Equation, idx: number) => (
    <div className="equation" key={`equation-${idx}`}>
      <div className="controller" key={`controller-${idx}`}>
        <div className="control" key={`drag-${idx}`}>
          ≡
        </div>
        <div
          className="control"
          key={`up-${idx}`}
          onMouseUp={() => moveUp(idx)}
        >
          ↑
        </div>
        <div
          className="control"
          key={`down-${idx}`}
          onMouseUp={() => moveDown(idx)}
        >
          ↓
        </div>
        <div
          className="control"
          key={`X-${idx}`}
          onMouseUp={() => deleteEq(idx)}
        >
          X
        </div>
      </div>
      <math-field
        onKeyDownCapture={(ev) => keyHandler(ev, idx)}
        onBeforeInput={(ev) =>
          updateInputValue(idx, (ev.target as MathfieldElement).value)
        }
        ref={(el) => {
          elRefs.current[idx] = el
          el?.addEventListener('move-out', (ev) => {
            // console.log(ev)
            if (ev.detail.direction === 'upward') {
              if (idx > 0) {
                el.blur()
                // console.log(el)
                // console.log(elRefs.current[idx - 1])
                elRefs.current[idx - 1]?.focus()
                elRefs.current[idx - 1]?.executeCommand('moveToMathfieldEnd')
              }
            } else if (ev.detail.direction === 'downward') {
              if (idx < eqs.length - 1) {
                el.blur()
                elRefs.current[idx + 1]?.focus()
                elRefs.current[idx + 1]?.executeCommand('moveToMathfieldStart')
              }
            }
          })
        }}
        key={`math-field-${idx}`}
      >
        {eq.eq}
      </math-field>
    </div>
  ))

  eqList.push(
    <div className="add-eq" key="add" onClick={addElement}>
      +
    </div>
  )

  return <div className="eq-section">{eqList}</div>
}

export default App
