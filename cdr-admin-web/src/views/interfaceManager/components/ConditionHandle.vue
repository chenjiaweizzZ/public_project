<!-- 条件编辑Dialog -->
<template>
  <div class="content-container">
    <div class="content-style">
      <!-- 后端数据结构没有唯一识别的字段，只能用index了 -->
      <div style="margin:13px 11px;flex:1">
        <div v-for="(item, index) in conditionListArr" :key="index" style="margin-bottom:10px">
          <div style="height:28px;display:flex;align-items:center;">
            <div style="margin-right:14px">条件{{ index + 1 }}</div>
            <el-select
              v-if="index > 0"
              style="width:92px"
              v-model="item.condition"
              placeholder="请选择"
            >
              <el-option
                v-for="item in constant.andOrOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button
              v-if="index > 0"
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
            <el-table-column label="序号" type="index" align="center" width="80"> </el-table-column>
            <el-table-column label="关联" align="center" width="180">
              <template slot-scope="scope">
                <el-radio-group :disabled="scope.$index === 0" v-model="scope.row.condition">
                  <el-radio label="and">并</el-radio>
                  <el-radio label="or">或</el-radio>
                </el-radio-group>
              </template>
            </el-table-column>
            <el-table-column label="字段名" align="center">
              <template slot-scope="scope">
                <el-tooltip
                  :content="`${scope.row.tableFieldName[0]}.${scope.row.tableFieldName[1]}`"
                  :disabled="!scope.row.tableFieldName"
                  placement="top"
                >
                  <el-cascader
                    v-model="scope.row.tableFieldName"
                    :options="cascaderOptions"
                    :props="{
                      expandTrigger: 'hover',
                      children: 'fieldList',
                      label: 'name',
                      value: 'name'
                    }"
                  >
                  </el-cascader>
                </el-tooltip>
              </template>
            </el-table-column>
            <el-table-column label="关系" align="center">
              <template slot-scope="scope">
                <el-select v-model="scope.row.fieldCondition" placeholder="请选择">
                  <el-option
                    v-for="item in getRelation()"
                    :key="item.id"
                    :label="item.typeName"
                    :value="item.remark"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="类型" align="center">
              <template slot-scope="scope">
                <el-select
                  v-model="scope.row.type"
                  @change="typeChange(scope.row)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in constant.typeList"
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
                <el-tooltip
                  v-if="scope.row.type === 1"
                  :content="`${scope.row.value[0]}.${scope.row.value[1]}`"
                  :disabled="!scope.row.value"
                  placement="top"
                >
                  <el-cascader
                    v-model="scope.row.value"
                    :options="cascaderOptions"
                    :props="{
                      expandTrigger: 'hover',
                      children: 'fieldList',
                      label: 'name',
                      value: 'name'
                    }"
                  >
                  </el-cascader>
                </el-tooltip>

                <el-input v-else v-model="scope.row.value" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="说明" align="center">
              <template slot-scope="scope">
                <el-input v-model="scope.row.node" />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div v-if="model !== 'FROM'" class="add-condition" @click="addCondition">
        <i class="el-icon-plus"></i>
        <span>新增条件</span>
      </div>
    </div>
    <div class="footer-btn">
      <el-button v-if="model === 'FROM'" type="primary" @click="confirmCondition">确 定</el-button>
    </div>
  </div>
</template>
<script>
import _ from '@/utils'
import constant from '../constant'
export default {
  name: '',
  props: {
    show: {
      type: Boolean,
      default: false
    },
    conditionList: {
      type: Array,
      default() {
        return []
      }
    },
    model: {
      type: String
    },
    activeTableId: {
      type: Number
    },
    cascaderOptions: {
      type: Array,
      default() {
        return []
      }
    }
  },
  inject: ["getRelation"],
  data() {
    return {
      constant,
      realUseShow: false,
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      conditionListArr: [],
      fieldOptions: []
    }
  },
  watch: {
    conditionList: {
      handler: function(currentData) {
        if (this.model === 'FROM') {
          this.conditionListArr = [
            {
              condition: '',
              list: _.deepCopy(currentData, [])
            }
          ]
        } else {
          this.conditionListArr = _.deepCopy(currentData, [])
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    typeChange(row) {
      row.value = ''
    },
    addEvent(row, list) {
      list.splice(list.indexOf(row) + 1, 0, _.deepCopy(constant.defaultCondition, {}))
    },
    deleteEvent(row, list) {
      if (list.length != 1) list.splice(list.indexOf(row), 1)
    },
    /* WHERE HAVING 组合条件新增 */
    addCondition() {
      let obj = {
        condition: '',
        list: [_.deepCopy(constant.defaultCondition, {})]
      }
      this.conditionListArr.push(obj)
    },
    /* WHERE HAVING 组合条件删除 */
    deleteCondition(index) {
      this.conditionListArr.splice(index, 1)
    },

    getCondition() {
      if (this.model === 'WHERE' || this.model === 'HAVING')
        return _.deepCopy(this.conditionListArr, [])
    },

    cleanCondition() {
      this.conditionListArr = [
        {
          condition: '',
          list: _.deepCopy(this.conditionList, [])
        }
      ]
    },
    confirmCondition() {
      let flag = this.conditionListArr.some(item => {
        return item.list.some((i, index) => {
          //obj.value!=0特殊处理，value是数字0的时候，!0是true
          return !i.tableFieldName || !i.value || (!i.condition && index !== 0)
        })
      })
      if (flag) {
        return this.$message({
          showClose: true,
          message: '请选择关系、补全条件',
          type: 'warning'
        })
      }
      this.$emit('fromConfirm', this.conditionListArr)
    }
  }
}
</script>
<style lang="scss" scoped>
.content-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .content-style {
    border: 1px solid #e6e6e6;
    border-radius: 2px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    width: 96%;
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
  .footer-btn {
    width: 96%;
    height: 60px;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
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
