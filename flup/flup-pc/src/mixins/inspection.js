export default {
  data() {
    return {
      checkTypeList: [],
      checkItemList: [],
      checkPartList: [],
      inspectionNameList: [],
      inspectionTypeList: [],
    }
  },
  methods: {
    getInspectionNameList(query) {
      this.$apis.ExaminegetExamineList({
        examineName: query || '',
      }).then((res) => {
        this.inspectionNameList = (res && res.list) || []
      })
    },
    getInspectionTypeList(query) {
      this.$apis.ExaminegetSampleList({
        sampleName: query || '',
      }).then((res) => {
        this.inspectionTypeList = (res && res.list) || []
      })
    },
    switchInspectionType(row, val) {
      let typeID = this.inspectionTypeList.find(item => { return item.SAMPLEDESCRIBE == val }).AUTOID
      row.examTypeCode = typeID
    },
    switchInspectionItem(row, val) {
      let itemID = this.inspectionNameList.find(item => { return item.YLMC == val }).AUTOID
      row.examItemCode = itemID
    },
    switchType(row, val) {
      row.checkItem = ''
      row.checkPart = ''
      row.checkItemCode = ''
      row.checkPartCode = ''
      let typeID = this.checkTypeList.find(item => { return item.examTypeName == val }).examTypeId
      row.checkTypeCode = typeID
      this.$apis.ExaminegetCheckPartsList({
        examTypeId: typeID
      }).then((res) => {
        this.checkPartList = res.examBodyInfoList
      })
    },
    switchPart(row, val) {
      row.checkItem = ''
      row.checkItemCode = ''
      let bodyID = this.checkPartList.find(item => { return item.examBodyName == val }).examBodyId
      row.checkPartCode = bodyID
      this.$apis.ExaminegetCheckItemList({
        examItemLike: '',
        examBodyId: bodyID,
      }).then((res) => {
        this.checkItemList = res.examItemInfos
      })
    },
    switchItem(row, val) {
      let itemID = this.checkItemList.find(item => { return item.examItemName == val }).examItemId
      row.checkItemCode = itemID
    },
    formatCheckType(row) {
      return row.split('|')[0]
    },
    formatCheckPart(row) {
      return row.split('|')[2]
    },
    formatCheckItem(row) {
      return row.split('|')[4]
    },
    formatInspectionType(row) {
      return row.split('|')[0]
    },
    formatInspectionName(row) {
      return row.split('|')[2]
    },
  }
}