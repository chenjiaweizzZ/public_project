/* 临床业务类型默认数据 */
export const IClassformer = {
  tableData: {
    id: '',
    name: '',
    nameCn: '',
    remark: '',
    tableClassId: 0,
    type: 1
  },
  tableFieldList: [
    {
      name: 'hzid',
      nameCn: '患者唯一编号',
      type: 'char',
      length: 20,
      remark: '患者唯一编号',
      isPrimary: 0,
      isIndex: 0,
      isDefaultSelect: 1
    },
    {
      name: 'hzxm',
      nameCn: '患者姓名',
      type: 'varchar',
      length: 50,
      remark: '户籍管理部门正式登记注册的姓氏和名称',
      isPrimary: 0,
      isIndex: 0,
      isDefaultSelect: 1
    },
    {
      name: 'sfzh',
      nameCn: '身份证号',
      type: 'char',
      length: 18,
      remark: '患者的身份证件上的唯一法定标识符',
      isPrimary: 0,
      isIndex: 0,
      isDefaultSelect: 1
    },
    {
      name: 'yljgbh',
      nameCn: '医疗机构编号',
      type: 'varchar',
      length: 18,
      remark: '经《医疗机构执业许可证》登记的代码',
      isPrimary: 0,
      isIndex: 0,
      isDefaultSelect: 1
    },
    {
      name: '',
      nameCn: '',
      type: '',
      length: 0,
      remark: '',
      isPrimary: 0,
      isIndex: 0,
      isDefaultSelect: 1
    }
  ]
}

export function getFormData(id) {
  return {
    tableData: {
      id: '',
      name: '',
      nameCn: '',
      remark: '',
      tableClassId: 0,
      type: id
    },
    tableFieldList: [
      {
        name: '',
        nameCn: '',
        type: '',
        length: 0,
        remark: '',
        isPrimary: 0,
        isIndex: 0,
        isDefaultSelect: 1
      }
    ]
  }
}
