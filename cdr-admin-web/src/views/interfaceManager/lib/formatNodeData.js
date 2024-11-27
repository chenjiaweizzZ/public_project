const formatNodeData = (obj, tableId, name) => {
  let resultList = obj.map(i => {
    return {
      id: i.id+'',
      group: 'list',
      attrs: {
        portNameLabel: {
          text: i.name
        },
        portTypeLabel: {
          text: i.nameCn
        },
        checkbox: {
          xlinkHref: require('@/assets/images/unSelect.svg')
        }
      },
      data: {
        isSelect: false,
        tableName: name,
        fieldName: i.name
      }
    }
  })
  return {
    id: tableId,
    shape: 'er-rect',
    label: name,
    width: 300,
    height: 24,
    position: {
      x: 100,
      y: 100
    },
    ports: resultList
  }
}

export default formatNodeData