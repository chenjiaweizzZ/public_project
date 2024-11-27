export const draggableTypeArr = [
  {
    type: 'select',
    key: 'symbol',
    name: '前置括号',
    defaultValue: '(',
    value: [
      { operatorName: '(', operatorValue: '(' },
      { operatorName: '((', operatorValue: '((' },
      { operatorName: '(((', operatorValue: '(((' }
    ]
  },
  {
    type: 'select',
    key: 'symbol',
    name: '括号',
    defaultValue: ')',
    value: [
      { operatorName: ')', operatorValue: ')' },
      { operatorName: '))', operatorValue: '))' },
      { operatorName: ')))', operatorValue: ')))' }
    ]
  },
  {
    type: 'select',
    key: 'symbol',
    name: '运算符',
    defaultValue: '+',
    value: [
      { operatorName: '+', operatorValue: '+' },
      { operatorName: '-', operatorValue: '-' },
      { operatorName: '*', operatorValue: '*' },
      { operatorName: '/', operatorValue: '/' },
      // { operatorName: '²', operatorValue: '²' },
      // { operatorName: '³', operatorValue: '³' },
      // { operatorName: '√', operatorValue: '√' }
    ]
  },
  { type: 'select', key: 'subject', name: '题目', defaultValue: '', value: [], },
  { type: 'input', key: 'number', name: '数值', defaultValue: '', }
]

export const computeTypeArr = [{ name: '总分', value: 1 }, { name: '维度分', value: 2 }]