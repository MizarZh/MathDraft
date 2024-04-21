import { VirtualKeyboardName, VirtualKeyboardLayout } from 'mathlive'

export const layout = [
  'greek',
  {
    label: 'minimal',
    tooltip: 'Only the essential',
    rows: [
      [
        '+',
        '-',
        '\\times',
        '\\frac{#@}{#?}',
        '=',
        '.',
        '(',
        ')',
        '\\sqrt{#0}',
        '#@^{#?}',
      ],
      ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ],
  },
  'alphabetic',
  {
    label: '&times',
    rows: [['+', '-', '\\times', '\\divide']],
  },
] as (VirtualKeyboardName | VirtualKeyboardLayout)[]
