export default {
  typeList: [
    {
      value: 0,
      label: '自定义'
    },
    {
      value: 1,
      label: '字段'
    },
    {
      value: 2,
      label: '占位符'
    }
  ],
  andOrOptions: [
    {
      value: 'and',
      label: '并且'
    },
    {
      value: 'or',
      label: '或者'
    }
  ],
  specialRelationList: [
    {
      value: '=',
      label: '等于'
    }
  ],
  defaultCondition: {
    tableFieldName: '',
    condition: '',
    fieldCondition: '=',
    type: 1,
    node: '',
    value: ''
  },
  joinTypeArr: [
    { name: ',' },
    { name: 'INNER JOIN' },
    { name: 'LEFT JOIN' },
    { name: 'RIGHT JOIN' },
    { name: 'CROSS JOIN' }
  ],
  fromEdgeCondition: (tableField, val) => {
    return {
      tableFieldName: tableField,
      condition: '',
      fieldCondition: '=',
      type: 1,
      value: val
    }
  },
  IUpdateSelectSQL: {
    createSelectSqlDto: [],
    id: '',
    viewConfig: ''
  },
  IGroupCreate: {
    apiCode: '',
    apiNotes: '',
    apiVersion: '1.0',
    parentField: '',
    parentCode: '',
    transformerCode: '',
    extraPackage: '',
    typeIdAndDbname: '',
  }
}
