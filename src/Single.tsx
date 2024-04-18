import React, { KeyboardEvent, FormEvent, useState, useRef } from 'react'
import './App.css'
import 'mathlive'
import { MathfieldElement } from 'mathlive'
import 'mathlive/fonts.css'
import { randomStringGenerator } from './utils'
import 'material-icons/iconfont/material-icons.css'
import 'material-symbols'

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
  //   name: string
  eq: string
}

const itemName = 'eqs_single'

function Single() {
  const temp = localStorage.getItem(itemName)
  const elRefs = useRef<MathfieldElement>(null)

  const [eqs, setEqs] = useState(
    JSON.parse(temp === null ? '[]' : temp) as Equation[]
  )

  function setSaveEqs(value: Equation[]) {
    setEqs(value)
    console.log(value)
    localStorage.setItem(itemName, JSON.stringify(value))
  }

  function updateEqs(str: string) {
    console.log(str)
    console.log(elRefs.current?.menuItems)
    const regex = /\\begin{matrix}(.*?)\\end{matrix}/s
    const match = str.match(regex)
    const L = eqs.length
    if (match !== null) {
      const matches = match[1].split('\n').map((val, idx) => {
        if (idx < L - 1) {
          return val.slice(0, -2)
        } else {
          return val
        }
      })
      const eqs_list = [] as Equation[]
      for (const m of matches) {
        eqs_list.push({ eq: m })
      }
      setSaveEqs(eqs_list)
    }
  }

  let eqList = `\\begin{matrix}\n`
  const L = eqs.length
  for (let i = 0; i < eqs.length; i++) {
    const eq = eqs[i]
    eqList += eq.eq
    if (i < L - 1) {
      eqList += '\\\\'
    }
    // eqList += `\\label{eq-${i}}`
  }
  eqList += '\\end{matrix}'

  return (
    <div className="eq-section">
      <math-field
        ref={elRefs}
        onInput={(ev) => updateEqs((ev.target as MathfieldElement).value)}
      >
        {eqList}
      </math-field>
    </div>
  )
}

export default Single
