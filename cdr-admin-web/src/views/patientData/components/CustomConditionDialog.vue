<!-- 组件 -->
<template>
  <el-dialog :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
    <div slot="title" class="title-style">
      <span style="margin-left:5px">自定义条件</span>
    </div>
    <div class="content-container">
      <div class="content-style">
        <!-- 后端数据结构没有唯一识别的字段，只能用index了 -->
        <div style="margin:13px 11px;flex:1">
          <div v-for="(item, index) in conditionListArr" :key="index" style="margin-bottom:10px">
            <div>
              <span style="margin-right:14px">条件{{ index + 1 }}</span>
              <el-select style="width:92px" v-model="item.condition" placeholder="请选择">
                <el-option
                  v-for="item in andOrOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-button
                class="deleteBtn-style"
                type="warning"
                plain
                @click="deleteCondition(index)"
                >删除条件</el-button
              >
            </div>
            <el-table :data="item.list" border style="width: 100%;margin-top:10px">
              <el-table-column label="操作" align="center" width="75px">
                <template slot-scope="scope">
                  <div class="icon-box">
                    <i
                      class="el-icon-circle-plus-outline"
                      @click="addEvent(scope.row, item.list)"
                    ></i>
                    <i class="el-icon-delete" @click="deleteEvent(scope.row, item.list, index)"></i>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="序号" type="index" align="center" width="80">
              </el-table-column>
              <el-table-column label="字段名" align="center">
                <template slot-scope="scope">
                  <el-select
                    style="width:100%"
                    filterable
                    v-model="scope.row.tableFieldName"
                    @change="changeTableFieldName(scope.row, index)"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in fieldOptions"
                      :key="item.id"
                      :label="item.nameCn"
                      :value="item.name"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="关系" align="center">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.condition"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in (scope.row.showSpecialRelation?specialRelationList:defaultRelationList)"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="内容" align="center">
                <template slot-scope="scope" style="width:100%">
                  <el-input-number
                    v-if="
                      scope.row.showValue === 'inputIntegerNumber' ||
                        scope.row.showValue === 'inputNumber'
                    "
                    v-model="scope.row.value"
                    :controls-position="scope.row.showValue === 'inputIntegerNumber' ? 'right' : ''"
                    :controls="scope.row.showValue === 'inputIntegerNumber' ? true : false"
                    label="描述文字"
                  ></el-input-number>
                  <el-date-picker
                    v-else-if="scope.row.showValue === 'dateTimePicker'"
                    v-model="scope.row.value"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="选择日期时间"
                  >
                  </el-date-picker>
                  <el-input v-else v-model="scope.row.value" placeholder="请输入内容"></el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="add-condition" @click="addCondition">
          <i class="el-icon-plus"></i>
          <span>新增条件</span>
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="handleClose">取 消</el-button>
      <el-button type="primary" @click="confirmCondition">查 询</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getTableFieldList } from '@/service/patientData'
import _ from '@/utils'
const defaultConObj = {
  condition: '',
  tableFieldName: '',
  value: ''
}
export default {
  name: '',
  props: {
    showCustomConditionDialog: {
      type: Boolean
    },
    conditionList: {
      type: Array,
      default() {
        return []
      }
    },
    activeTableId: {
      type: Number
    }
  },
  watch: {
    showCustomConditionDialog(currentData) {
      this.dialogVisible = currentData
      if (this.dialogVisible) this.getTableFieldList()
    },
    conditionList: {
      immediate: true,
      handler: function(currentData) {
        console.log(currentData, 'currentData')
        this.conditionListArr = _.deepCopy(currentData, [])
        console.log(this.conditionListArr, 'Arr')
      },
      deep: true
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      dialogVisible: false,
      conditionListArr: [],
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
      fieldOptions: [],
      specialRelationList: [
        {
          value: '=',
          label: '等于'
        },
        {
          value: '>',
          label: '大于'
        },
        {
          value: '<',
          label: '小于'
        }
      ],
      defaultRelationList: [
        {
          value: 'like',
          label: '包含'
        },
        {
          value: '=',
          label: '等于'
        }
      ]
    }
  },
  methods: {
    getTableFieldList() {
      getTableFieldList({
        tableId: this.activeTableId
      })
        .then(res => {
          this.fieldOptions = res
        })
        .catch(err => {
          console.log(err, 'errr')
        })
    },
    addEvent(row, list, index) {
      console.log(row, list, 'llllaaa', defaultConObj)
      list.splice(list.indexOf(row) + 1, 0, _.deepCopy(defaultConObj, {}))
    },
    deleteEvent(row, list, index) {
      if (list.length != 1) list.splice(list.indexOf(row), 1)
      else {
        console.log(list, 'ddddddd')
        //TODO
        list[0].condition = ''
        list[0].tableFieldName = ''
        list[0].value = ''
      }
    },
    handleClose() {
      this.$emit('closeDialog')
    },
    changeTableFieldName(val, index) {
      console.log(val, 'changeTableFieldName', index)
      this.fieldOptions.forEach(item => {
        if (item.name === val.tableFieldName) {
          val.condition = ''
          this.handleRelation(item.type, val, index)
          this.handleValue(item.type, val, index)
        }
      })
    },
    //处理每一行的关系展示类型
    //类型是日期或者数字：等于，大于，小于；类型如果是其他：包含，等于
    handleRelation(type, val) {
      switch (type.toUpperCase()) {
        case 'INT':
        case 'BIGINT':
        case 'FLOAT':
        case 'DOUBLE':
        case 'DATE':
        case 'TIME':
        case 'YEAR':
        case 'DATETIME':
        case 'TIMESTAMP':
          val.showSpecialRelation = true
          val.condition = '='
          break
        default:
          val.showSpecialRelation = false
      }
    },
    //处理每一行的内容展示类型
    //int或者bigint类型：计数器；  float或者double：数字类型的输入框；  日期类型：时间空间；   其他：普通输入框
    handleValue(type, val) {
      console.log('sayhi', type)
      switch (type.toUpperCase()) {
        case 'INT':
        case 'BIGINT':
          val.showValue = 'inputIntegerNumber'
          val.value = 0
          break
        //  case 'INT':
        case 'FLOAT':
        case 'DOUBLE':
          val.showValue = 'inputNumber'
          val.value = 0
          break
        case 'DATE':
        case 'TIME':
        case 'YEAR':
        case 'DATETIME':
        case 'TIMESTAMP':
          val.showValue = 'dateTimePicker'
          val.value = ''
          break
        default:
          val.showValue = 'input'
          val.value = ''
      }
    },
    addCondition() {
      this.$emit('addCondition', this.conditionListArr)
    },
    deleteCondition(index) {
      this.$emit('deleteCondition', index)
    },
    confirmCondition() {
      console.log(this.conditionListArr, '最终')
      let flag = this.conditionListArr.some(item => {
        return item.list.some(obj => {
          //obj.value!=0特殊处理，value是数字0的时候，!0是true
          return !item.condition || !obj.tableFieldName || (obj.value!=0&&!obj.value)
        })
      })
      if (flag) {
        this.$message({
          showClose: true,
          message: '请补全条件',
          type: 'error'
        })
        return
      }
      this.$emit('confirmCustom', this.conditionListArr)
    }
  }
}
</script>
<style lang="scss" scoped>
.title-style {
  font-size: 18px;
  border-left: 4px solid #0075ff;
}
.content-container {
  width: 100%;
  display: flex;
  justify-content: center;
  .content-style {
    border: 1px solid #e6e6e6;
    max-height: 350px;
    border-radius: 2px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    width: 96%;
    // padding-right:-10px ;
    .deleteBtn-style {
      width: 92px;
      height: 28px;
      line-height: 3px;
      text-align: center;
      margin-left: 14px;
    }
    .icon-box {
      width: 100%;
      display: flex;
      justify-content: space-around;
      color: #0075ff;
    }
    .add-condition {
      width: 100%;
      background: #e6f6ff;
      height: 27px;
      color: #0075ff;
      line-height: 27px;
      text-align: center;
      flex: 1;
    }
  }
}
::v-deep .el-button--warning.is-plain {
  color: #fc561f;
  background-color: #fff;
  border-color: #fc561f;
}
::v-deep .el-dialog__body {
  padding: 0 auto;
}
::v-deep .el-input__icon {
  line-height: 28px !important;
}

::v-deep .el-input-number.is-controls-right .el-input-number__increase {
  height: 13px;
  margin-top: 5px;
}
::v-deep .el-input-number.is-controls-right .el-input-number__decrease {
  height: 13px;
  margin-bottom: 6px;
}
</style>
