export default {
  data() {
    return {
      form: {
        flupRuleId: "",
        smartFlupMethod: "",
        flupContent: "",
        flupInterval: 0,
        flupNumber: 1,
        flupType: "",
        interventionBenchmark: "",
        interventionDay: 0,
        serialNo: "",
        validDate: 2,
        flupContentId: '',
        smartFlupMethodId: '',
        flupPeriod: 0,
        executeUnit: 0,
        checkItems: []
      },
      followupTypeList: [],
      interventionList: [],
      followupContentList: [],
      allfollowupWayList: [],
      checkTypeList: [],
      checkPartList: [],
      checkItemList: [],
      inspectionNameList: [],
      inspectionTypeList: [],
      deptList: [],
      rules: {
        flupPlan: [
          { required: true, message: '请选择随访计划', trigger: 'change' },
        ],
        flupStartTime: [
          { required: true, message: '请选择随访日期', trigger: 'change' },
        ],
        flupType: [
          { required: true, message: '请选择随访类型', trigger: 'blur' },
        ],
        smartFlupMethod: [
          { required: true, message: '请选择随访路径', trigger: 'blur' }
        ],
        inspectionTypeRule: [
          { required: true, message: '请选择样本类型', trigger: 'blur' }
        ],
        inspectionNameRule: [
          { required: true, message: '请选择检验名称', trigger: 'blur' }
        ],
        checkTypeRule: [
          { required: true, message: '请选择检查类型', trigger: 'blur' }
        ],
        checkPartRule: [
          { required: true, message: '请选择部位', trigger: 'blur' }
        ],
        checkItemRule: [
          { required: true, message: '请选择检查项目', trigger: 'blur' }
        ],
        flupContent: [
          { required: true, message: '请选择或输入', trigger: 'blur' }
        ],
        validDate: [
          { required: true, message: '请输入有效天数', trigger: 'blur' },
        ],
      },
    }
  },
  computed: {
    followupWayList() {
      this.allfollowupWayList.forEach(element => {
        if (['电话', '微信'].includes(element.dict_name)) {
          this.$set(element, 'disabled', false)
        } else {
          this.$set(element, 'disabled', true)
        }
        if (['消息提醒', '定期检查', '定期检验', '定期复诊', '健康宣教'].includes(this.form.flupType) && element.dict_name === '电话') {
          this.$set(element, 'disabled', true)
        }
        if (this.form.flupType == '专科随访') {
          if (element.dict_name == '电话') {
            this.$set(element, 'disabled', false)
          } else {
            this.$set(element, 'disabled', true)
          }
        }
      })
      return [...this.allfollowupWayList]
    },
    checkItems() {
      let arr = []
      if (this.form.flupType === '定期检查') {
        if (this.form.flupContent) {
          this.form.flupContent.split(',').forEach((element) => {
            let itemArr = element.split('|')
            arr.push({ type: itemArr[0], typeID: itemArr[1], part: itemArr[2], partID: itemArr[3], item: itemArr[4], itemID: itemArr[5] })
          })
        } else {
          arr = [{ type: '', part: '', item: '' }]
        }
      } else if (this.form.flupType == '定期检验') {
        if (this.form.flupContent) {
          this.form.flupContent.split(',').forEach((element) => {
            let itemArr = element.split('|')
            arr.push({ name: itemArr[0], nameID: itemArr[1], type: itemArr[2], typeID: itemArr[3] })
          })
        } else {
          arr = [{ name: '', type: '' }]
        }
      }
      return arr
    }
  },
  created() {
    this.form.checkItems = this.checkItems
  },
  methods: {
    //获取所有随访类型
    getFollowupTypeList(type) {
      return this.$apis.getFollowupTypeList({
        keyWord: '',
        enable: type
      }).then((res) => {
        this.followupTypeList = res.data
      })
    },
    //获取所有随访方式
    getFolloupWayList() {
      this.$apis.getFollowupWayList().then(res => {
        this.allfollowupWayList = res.data || []
      })
    },
    clickSelect(v, s, obj) {
      if (v) {
        switch (s) {
          case 'checkTypeList':
            this.getCheckTypeList()
            break
          case 'checkPartList':
            this.getCheckPartList(obj.typeID)
            break
          case 'checkItemList':
            this.getCheckItemList(obj.partID)
            break
          case 'inspectionNameList':
            this.getInspectionNameList()
            break
          case 'inspectionTypeList':
            this.getInspectionTypeList()
            break
        }
      }
    },
    changeDept(v) {
      let itemobj = this.deptList.find((value, index, item) => {
        return value.Text == v
      })
      this.form.flupContentId = itemobj.Value
    },
    changeInspectionName(obj, v) {
      let itemobj = this.inspectionNameList.find((value, index, item) => {
        return value.YLMC == v
      })
      obj.nameID = itemobj.AUTOID
    },
    changeInspectionType(obj, v) {
      let itemobj = this.inspectionTypeList.find((value, index, item) => {
        return value.SAMPLEDESCRIBE == v
      })
      obj.typeID = itemobj.AUTOID
    },
    changeCheckType(obj, v) {
      obj.part = ''
      obj.item = ''
      let itemobj = this.checkTypeList.find((value, index, item) => {
        return value.examTypeName == v
      })
      obj.typeID = itemobj.examTypeID
    },
    changeCheckPart(obj, v) {
      obj.item = ''
      let itemobj = this.checkPartList.find((value, index, item) => {
        return value.examBodyName == v
      })
      obj.partID = itemobj.examBodyID
    },
    changeCheckItem(obj, v) {
      let itemobj = this.checkItemList.find((value, index, item) => {
        return value.examItemName == v
      })
      obj.itemID = itemobj.examItemID_HIS
    },
    getCheckTypeList() {
      this.$apis.getCheckTypeList({
        systemID: 'SUIFANG',
        hospitalID: '1118011815000575310',
      }).then((res) => {
        this.checkTypeList = res.examTypeList
      })
    },
    getCheckPartList(typeID = '') {
      this.$apis.getCheckPartsList({
        systemID: 'SUIFANG',
        hospitalID: '1118011815000575310',
        examTypeID: typeID
      }).then((res) => {
        this.checkPartList = res.examBodyList
      })
    },
    getCheckItemList(bodyID = '', query = '') {
      this.$apis.getCheckItemList({
        examItemLike: query,
        systemID: 'SUIFANG',
        hospitalID: '1118011815000575310',
        examBodyID: bodyID,
      }).then((res) => {
        this.checkItemList = res.examItemList
      })
    },
    getInspectionNameList(query) {
      this.$apis.getExamineList({
        examineName: query,
      }).then((res) => {
        this.inspectionNameList = res.dataList
      })
    },
    getInspectionTypeList(query) {
      this.$apis.getSampleList({
        sampleName: query,
      }).then((res) => {
        this.inspectionTypeList = res.dataList
      })
    },
    addItem(type) {
      type === 0 ? this.form.checkItems.push({ type: '', part: '', item: '' }) : this.form.checkItems.push({ name: '', type: '' })
    },
    deleteItem(i) {
      this.form.checkItems.splice(i, 1)
    },
    getForm(newTask) {
      if (newTask != '临时任务') {
        if (this.form.flupType === '定期检查' || this.form.flupType === '定期检验') {
          this.form.flupContent = ''
          this.form.checkItems.forEach((element, i) => {
            if (i !== 0) {
              this.form.flupContent += ','
            }
            this.form.flupType === '定期检查' ? this.form.flupContent += `${element.type}|${element.typeID}|${element.part}|${element.partID}|${element.item}|${element.itemID}`
              : this.form.flupContent += `${element.name}|${element.nameID}|${element.type}|${element.typeID}`
          })
          this.$delete(this.form, 'checkItems')
        }
      }
      return this.form
    },
    switchFollowupContent(val) {
      let itemobj = this.followupContentList.find((value, index, item) => {
        return value.questionnaireName == val
      })
      this.form.flupContentId = itemobj.serialNo
    },
    switchFollowupType(v) {
      this.form.flupContent = ''
      this.form.flupContentId = ''
      this.form.smartFlupMethod = ''
      switch (v) {
        case '定期检查':
        case '定期检验':
          this.form.checkItems = this.checkItems
          break
        case '专科随访':
        case '调查问卷':
        case '健康宣教':
          this.$apis.flupPathqueryFollowUpContent({
            hospitalId: JSON.parse(sessionStorage.getItem("global")).hospital_id, name: v
          }).then((res) => {
            this.followupContentList = res
          })
          break
        case '定期复诊':
          this.$apis.systemManagequeryCurrentUserDept().then(res => {
            this.deptList = res
          })
      }
    },
    switchFollowupWay(v) {
      let itemobj = this.followupWayList.find((value, index, item) => {
        return value.dict_name == v
      })
      this.form.smartFlupMethodId = itemobj.dict_code
    }
  }
}