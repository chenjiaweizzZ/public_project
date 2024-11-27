<template>
  <div>
    <el-form
      class="padding20X paddingX20 padding-bottom10"
      ref="form"
      :rules="rules"
      :model="form"
      label-width="80px"
    >
      <el-form-item label="随访类型" prop="flup_type">
        <el-select class="width100" v-model="form.flup_type" @change="switchFollowupType">
          <el-option
            v-for="(item, i) in followupTypeList"
            :key="i"
            :label="item.name"
            :value="item.name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="form.flup_type == '调查问卷'" prop="flup_content" label="问卷内容">
        <el-select
          class="width100"
          v-model="form.flup_content"
          filterable
          @change="switchFollowupContent"
        >
          <el-option
            v-for="(item, i) in followupContentList"
            :key="i"
            :label="item.questionnaire_name"
            :value="item.questionnaire_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else-if="form.flup_type == '健康宣教'" prop="flup_content" label="宣教内容">
        <el-select class="width100" v-model="form.flup_content" @change="switchFollowupContent">
          <el-option
            v-for="(item, i) in followupContentList"
            :key="i"
            :label="item.questionnaire_name"
            :value="item.questionnaire_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else-if="form.flup_type == '专科随访'" prop="flup_content" label="随访模板">
        <el-select class="width100" v-model="form.flup_content" @change="switchFollowupContent">
          <el-option
            v-for="(item, i) in followupContentList"
            :key="i"
            :label="item.questionnaire_name"
            :value="item.questionnaire_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else-if="form.flup_type == '定期复诊'" label="科室" prop="flup_content">
        <el-select class="width100" v-model="form.flup_content" @change="changeDept">
          <el-option v-for="(item, i) in deptList" :key="i" :label="item.Text" :value="item.Text"></el-option>
        </el-select>
      </el-form-item>
      <template v-else-if="form.flup_type == '定期检查'">
        <el-row v-for="(item, i) in form.checkItems" :key="i" type="flex">
          <el-form-item
            label="检查内容"
            :prop="'checkItems.' + i + '.type'"
            :rules="rules.checkTypeRule"
          >
            <el-select
              placeholder="请选择检查内容"
              @visible-change="clickSelect($event, 'checkTypeList')"
              class="width130px"
              v-model="item.type"
              @change="changeCheckType(item, $event)"
            >
              <el-option
                v-for="(item, j) in checkTypeList"
                :key="j"
                :label="item.examTypeName"
                :value="item.examTypeName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="margin-left10 flex1"
            label-width="0"
            :prop="'checkItems.' + i + '.part'"
            :rules="rules.checkPartRule"
          >
            <el-select
              placeholder="请选择检查部位"
              @visible-change="clickSelect($event, 'checkPartList', item)"
              class="width100"
              v-model="item.part"
              @change="changeCheckPart(item, $event)"
            >
              <el-option
                v-for="(item, j) in checkPartList"
                :key="j"
                :label="item.examBodyName"
                :value="item.examBodyName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="margin-left10"
            label-width="0"
            :prop="'checkItems.' + i + '.item'"
            :rules="rules.checkItemRule"
          >
            <el-select
              class="width150px"
              placeholder="请选择检查项目"
              @visible-change="clickSelect($event, 'checkItemList', item)"
              filterable
              remote
              :remote-method="val => getCheckItemList(item.partID, val)"
              v-model="item.item"
              @change="changeCheckItem(item, $event)"
            >
              <el-option
                v-for="(item, j) in checkItemList"
                :key="j"
                :label="item.examItemName"
                :value="item.examItemName"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button
            class="margin-bottom20 margin-left10"
            v-if="i == 0"
            type="text"
            @click="addItem(0)"
          >添加</el-button>
          <el-button
            class="margin-bottom20 margin-left10"
            v-else
            type="text"
            @click="deleteItem(i)"
          >删除</el-button>
        </el-row>
      </template>
      <template v-else-if="form.flup_type == '定期检验'">
        <el-row v-for="(item, i) in form.checkItems" :key="i" type="flex">
          <el-form-item
            :prop="'checkItems.' + i + '.name'"
            label="检验内容"
            :rules="rules.inspectionNameRule"
          >
            <el-select
              placeholder="请选择检验名称"
              @change="changeInspectionName(item, $event)"
              @visible-change="clickSelect($event, 'inspectionNameList')"
              filterable
              remote
              :remote-method="getInspectionNameList"
              class="width200px"
              v-model="item.name"
            >
              <el-option
                v-for="(item, j) in inspectionNameList"
                :key="j"
                :label="item.YLMC"
                :value="item.YLMC"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            :prop="'checkItems.' + i + '.type'"
            class="margin-left10 flex1"
            label-width="0"
            :rules="rules.inspectionTypeRule"
          >
            <el-select
              placeholder="请选择样本类型"
              @change="changeInspectionType(item, $event)"
              @visible-change="clickSelect($event, 'inspectionTypeList')"
              filterable
              remote
              :remote-method="getInspectionTypeList"
              class="width100"
              v-model="item.type"
            >
              <el-option
                v-for="(item, j) in inspectionTypeList"
                :key="j"
                :label="item.SAMPLEDESCRIBE"
                :value="item.SAMPLEDESCRIBE"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-button
            class="margin-bottom20 margin-left10"
            v-if="i == 0"
            type="text"
            @click="addItem(1)"
          >添加</el-button>
          <el-button
            class="margin-bottom20 margin-left10"
            v-else
            type="text"
            @click="deleteItem(i)"
          >删除</el-button>
        </el-row>
      </template>
      <el-form-item v-else-if="form.flup_type == '消息提醒'" prop="flup_content" label="消息内容">
        <el-input
          class="width100"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
          :maxlength="50"
          v-model="form.flup_content"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item prop="intervention_benchmark" label="执行时间">
        <el-row type="flex">
          <el-select class="flex1" v-model="form.intervention_benchmark">
            <el-option
              v-for="(item, i) in interventionList"
              :key="i"
              :label="item.dict_name"
              :value="item.dict_name"
            ></el-option>
          </el-select>
          <el-input-number
            class="margin-left10"
            style="width:170px"
            :min="0"
            :max="9999"
            controls-position="right"
            v-model="form.intervention_day"
          ></el-input-number>
          <el-select class="margin-left10" style="width:60px" v-model="form.execute_unit">
            <el-option
              v-for="(item, i) in unitList"
              :key="i"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-row>
      </el-form-item>

      <el-row type="flex">
        <el-form-item class="width50" prop="valid_date" label="有效天数">
          <el-input-number style="width:170px" :min="0" :max="9999" v-model="form.valid_date"></el-input-number>
        </el-form-item>
        <!-- <el-form-item class="width50" prop="intervention_day" label="介入天数">
          <el-input-number style="width:170px" :min="0" v-model="form.intervention_day"></el-input-number>
        </el-form-item>-->
      </el-row>

      <el-form-item label="随访周期">
        <el-radio-group v-model="form.flup_period" @change="changeCircle">
          <el-radio
            v-for="(item, i) in followupCircleList"
            :key="i"
            :label="item.value"
          >{{ item.title }}</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-row type="flex" v-if="form.flup_period">
        <el-form-item class="width50" prop="flup_interval" label-width="100px" label="随访间隔(天)">
          <el-input-number style="width:170px" :min="1" :max="9999" v-model="form.flup_interval"></el-input-number>
        </el-form-item>
        <el-form-item v-if="form.flup_period !== 2" class="width50" prop="flup_number" label="随访次数">
          <el-input-number :min="2" v-model="form.flup_number" :max="9999" style="width:170px"></el-input-number>
        </el-form-item>
      </el-row>
      <el-row type="flex"></el-row>
      <el-form-item prop="smart_flup_method" label="随访途径">
        <el-radio-group v-model="form.smart_flup_method">
          <el-radio
            @change="switchFollowupWay"
            v-for="(item, i) in followupWayList"
            :disabled="item.disabled"
            :key="i"
            :label="item.dict_name"
          >{{ item.dict_name }}</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <el-row class="dialog-footer" type="flex" justify="end">
      <el-button @click="closeDialog(true)">取 消</el-button>
      <el-button type="primary" @click="closeDialog(false)">确 定</el-button>
    </el-row>
  </div>
</template>

<script>
export default {
  name: 'followup_route',
  data() {
    return {
      form: {
        flup_rule_id: '',
        smart_flup_method: '',
        flup_content: '',
        flup_interval: 0,
        flup_number: 1,
        flup_type: '',
        intervention_benchmark: '',
        intervention_day: 0,
        serial_no: '',
        valid_date: 2,
        flup_content_id: '',
        smart_flup_method_id: '',
        flup_period: 0,
        execute_unit: 0,
      },
      followupTypeList: [],
      interventionList: [],
      followupContentList: [],
      // followupCircleList: [
      //   { title: '定期型随访', value: 0 },
      //   { title: '周期型随访', value: 1 },
      //   { title: '终生随访', value: 2 }
      // ],
      followupWayList: [],
      checkTypeList: [],
      checkPartList: [],
      checkItemList: [],
      inspectionNameList: [],
      inspectionTypeList: [],
      // researchTemplateList: [],
      unitList: [
        { label: '天', value: 0 },
        { label: '周', value: 1 },
        { label: '月', value: 2 },
      ],
      deptList: [],
      rules: {
        flup_type: [
          { required: true, message: '请选择随访类型', trigger: 'blur' },
        ],
        intervention_benchmark: [
          { required: true, message: '请选择介入基准', trigger: 'change' },
        ],
        intervention_day: [
          { required: true, message: '请输入天数', trigger: 'blur' },
        ],
        smart_flup_method: [
          { required: true, message: '请选择随访路径', trigger: 'blur' },
        ],
        inspectionTypeRule: [
          { required: true, message: '请选择样本类型', trigger: 'blur' },
        ],
        inspectionNameRule: [
          { required: true, message: '请选择检验名称', trigger: 'blur' },
        ],
        checkTypeRule: [
          { required: true, message: '请选择检查类型', trigger: 'blur' },
        ],
        checkPartRule: [
          { required: true, message: '请选择部位', trigger: 'blur' },
        ],
        checkItemRule: [
          { required: true, message: '请选择检查项目', trigger: 'blur' },
        ],
        flup_content: [
          { required: true, message: '请选择或输入', trigger: 'blur' },
        ],
      },
    }
  },
  props: {
    data: Object,
  },
  computed: {
    followupCircleList() {
      if (this.form.intervention_benchmark === '出院后') {
        return [
          { title: '定期型随访', value: 0 },
          { title: '周期型随访', value: 1 },
          { title: '终身随访', value: 2 },
        ]
      } else {
        this.form.flup_period = 0
        return [{ title: '定期型随访', value: 0 }]
      }
    },
  },
  created() {
    if (this.data) {
      this.form = { ...this.data }
      if (this.form.flup_type === '定期检查') {
        let arr = []
        this.form.flup_content.split(',').forEach((element) => {
          let itemArr = element.split('|')
          arr.push({
            type: itemArr[0],
            typeID: itemArr[1],
            part: itemArr[2],
            partID: itemArr[3],
            item: itemArr[4],
            itemID: itemArr[5],
          })
        })
        this.$set(this.form, 'checkItems', arr)
      } else if (this.form.flup_type == '定期检验') {
        let arr = []
        this.form.flup_content.split(',').forEach((element) => {
          let itemArr = element.split('|')
          arr.push({
            name: itemArr[0],
            nameID: itemArr[1],
            type: itemArr[2],
            typeID: itemArr[3],
          })
        })
        this.$set(this.form, 'checkItems', arr)
      }
    }

    this.$apis
      .getFollowupTypeList({
        hospitalId: JSON.parse(sessionStorage.getItem('global')).hospital_id,
        keyWord: '',
        enable: this.$route.params.type === 'specialist' ? 1 : 0,
      })
      .then((res) => {
        this.followupTypeList = res.data.filter((item) => {
          return item.enable != 0
        })
      })

    this.$apis.getInterventionList().then((res) => {
      this.interventionList = res.data
    })

    this.$apis.getFollowupWayList().then((res) => {
      this.followupWayList = res.data
      this.followupWayList.forEach((element) => {
        if (['电话', '微信'].includes(element.dict_name)) {
          this.$set(element, 'disabled', false)
        } else {
          this.$set(element, 'disabled', true)
        }
        if (
          ['消息提醒', '定期检查', '定期检验', '定期复诊', '健康宣教'].includes(
            this.form.flup_type
          ) &&
          element.dict_name === '电话'
        ) {
          this.$set(element, 'disabled', true)
        }
        if (this.form.flup_type == '专科随访') {
          if (element.dict_name == '电话') {
            this.$set(element, 'disabled', false)
          } else {
            this.$set(element, 'disabled', true)
          }
        }
      })
    })

    if (this.form.flup_type) {
      this.$apis
        .getFollowupContentList({
          name: this.form.flup_type,
        })
        .then((res) => {
          this.followupContentList = res
        })
      this.$apis.getDeptList().then((res) => {
        this.deptList = res
      })
    }
  },
  methods: {
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
    changeCircle(v) {
      switch (v) {
        case 0:
          this.form.flup_number = 1
          this.form.flup_interval = 0
          break
        case 1:
          this.form.flup_number = 2
          this.form.flup_interval = 1
          break
        case 2:
          this.form.flup_number = 0
          this.form.flup_interval = 1
          break
      }
    },
    changeDept(v) {
      let itemobj = this.deptList.find((value, index, item) => {
        return value.Text == v
      })
      this.form.flup_content_id = itemobj.Value
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
      this.$apis.getCheckTypeList().then((res) => {
        this.checkTypeList = res.examTypeList
      })
    },
    getCheckPartList(typeID = '') {
      this.$apis
        .getCheckPartsList({
          examTypeID: typeID,
        })
        .then((res) => {
          this.checkPartList = res.examBodyList
        })
    },
    getCheckItemList(bodyID = '', query = '') {
      this.$apis
        .getCheckItemList({
          examItemLike: query,
          examBodyID: bodyID,
        })
        .then((res) => {
          this.checkItemList = res.examItemList
        })
    },
    getInspectionNameList(query) {
      this.$apis
        .getExamineList({
          examineName: query,
        })
        .then((res) => {
          this.inspectionNameList = res.dataList
        })
    },
    getInspectionTypeList(query) {
      this.$apis
        .getSampleList({
          sampleName: query,
        })
        .then((res) => {
          this.inspectionTypeList = res.dataList
        })
    },
    addItem(type) {
      type === 0
        ? this.form.checkItems.push({ type: '', part: '', item: '' })
        : this.form.checkItems.push({ name: '', type: '' })
    },
    deleteItem(i) {
      this.form.checkItems.splice(i, 1)
    },
    closeDialog(isCancel) {
      if (isCancel) {
        this.$emit('close')
      } else {
        this.$refs['form'].validate((valid) => {
          if (valid) {
            if (
              this.form.flup_type === '定期检查' ||
              this.form.flup_type === '定期检验'
            ) {
              this.form.flup_content = ''
              this.form.checkItems.forEach((element, i) => {
                if (i !== 0) {
                  this.form.flup_content += ','
                }
                this.form.flup_type === '定期检查'
                  ? (this.form.flup_content += `${element.type}|${element.typeID}|${element.part}|${element.partID}|${element.item}|${element.itemID}`)
                  : (this.form.flup_content += `${element.name}|${element.nameID}|${element.type}|${element.typeID}`)
              })
              this.$delete(this.form, 'checkItems')
            }
            if (this.data) {
              this.$emit('close', { data: this.form, isNew: false })
            } else {
              this.$emit('close', { data: this.form, isNew: true })
            }
          }
        })
      }
    },
    switchFollowupContent(val) {
      let itemobj = this.followupContentList.find((value, index, item) => {
        return value.questionnaire_name == val
      })
      this.form.flup_content_id = itemobj.serial_no
    },
    switchFollowupType(v) {
      this.form.flup_content = ''
      this.form.flup_content_id = ''
      this.form.smart_flup_method = ''
      switch (v) {
        case '定期检查':
          this.$set(this.form, 'checkItems', [{ type: '', part: '', item: '' }])
          break
        case '定期检验':
          this.$set(this.form, 'checkItems', [{ name: '', type: '' }])
          break
        case '专科随访':
        case '调查问卷':
        case '健康宣教':
          this.$apis
            .getFollowupContentList({
              name: v,
            })
            .then((res) => {
              this.followupContentList = res
            })
          break
        case '定期复诊':
          this.$apis.getDeptList().then((res) => {
            this.deptList = res
          })
      }
      if (v == '专科随访') {
        this.followupWayList.forEach((element) => {
          if (element.dict_name == '微信') {
            element.disabled = true
          } else if (element.dict_name == '电话') {
            element.disabled = false
          }
        })
      } else if (
        ['消息提醒', '定期检查', '定期检验', '定期复诊', '健康宣教'].includes(v)
      ) {
        this.followupWayList.forEach((element) => {
          console.log(element)
          if (element.dict_name == '电话') {
            element.disabled = true
          } else if (element.dict_name == '微信') {
            element.disabled = false
          }
        })
      } else {
        this.followupWayList.forEach((element) => {
          if (element.dict_name == '电话') {
            element.disabled = false
          } else if (element.dict_name == '微信') {
            element.disabled = false
          }
        })
      }
    },
    switchFollowupWay(v) {
      let itemobj = this.followupWayList.find((value, index, item) => {
        return value.dict_name == v
      })
      this.form.smart_flup_method_id = itemobj.dict_code
    },
  },
}
</script>
