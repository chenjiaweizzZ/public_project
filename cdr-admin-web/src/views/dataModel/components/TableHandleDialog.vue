<!-- table操作Dialog -->
<template>
  <el-dialog
    :visible.sync="realUseShow"
    :close-on-click-modal="false"
    @closed="tableDialogClosed"
    width="1300px"
  >
    <template slot="title">
      <div class="table-dialog-title">
        <div class="table-title-logo"></div>
        <div class="table-title-font">{{ model === 'create' ? '新增' : '编辑' }}表</div>
      </div>
    </template>
    <div class="table-dialog-body">
      <el-form
        :inline="true"
        ref="formTableData"
        :model="realUseForm.tableData"
        :show-message="false"
        class="demo-form-inline"
      >
        <div class="part-one">
          <div class="part-one-input">
            <el-form-item
              label="表名"
              prop="name"
              :rules="{
                required: true,
                trigger: 'blur'
              }"
            >
              <el-input
                v-model="realUseForm.tableData.name"
                :disabled="model === 'edit' ? true : false"
                placeholder="请输入内容"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="表中文名"
              prop="nameCn"
              :rules="{
                required: true,
                trigger: 'blur'
              }"
            >
              <el-input v-model="realUseForm.tableData.nameCn" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="realUseForm.tableData.remark" placeholder="请输入内容"></el-input>
            </el-form-item>
            <el-form-item label="类型">
              <el-select size="mini" v-model="realUseForm.tableData.type" @change="tableTypeChange" placeholder="请选择">
                <el-option
                  v-for="item in tableTypes"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.id"
                  :disabled="model==='edit'"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="part-one-btn">
            <el-button size="mini" type="primary" @click="addFeild" plain>新增</el-button>
          </div>
        </div>
      </el-form>
      <div class="part-two">
        <el-table
          ref="table"
          :data="realUseForm.tableFieldList"
          border
          stripe
          style="width: 100%"
          max-height="360"
        >
          <el-table-column type="index" label="序号" width="50"></el-table-column>
          <el-table-column prop="nameCn" label="字段中文名" width="150">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.nameCn"
                @keyup.enter.native="addFeild"
                v-if="scope.$index < 4 && realUseForm.tableData.type === 1"
                :disabled="
                  (model === 'edit' && scope.$index < formData.tableFieldList.length) ||
                  (model === 'create' && scope.$index < 4 && realUseForm.tableData.type === 1)
                    ? true
                    : false
                "
                placeholder="请输入"
              ></el-input>
              <!-- TODO -->
              <el-select
                filterable
                remote
                :remote-method="remoteMethod"
                placeholder="请输入"
                :loading="loading"
                v-model="scope.row.nameCn"
                v-select-lazy-load="loadMetaData"
                @change="equipParams(scope.row)"
                :disabled="(model === 'edit' && scope.$index < formData.tableFieldList.length)"
                v-else
              >
                <el-option
                  v-for="(item, index) in metaDataList"
                  :key="index"
                  :label="item.deCodeName"
                  :value="item.deCodeName"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="字段名" width="150">
            <template slot-scope="scope">
              <!-- <el-input
                v-model="scope.row.name"
                @keyup.enter.native="addFeild"
                :disabled="
                  (model === 'edit' && scope.$index < formData.tableFieldList.length) ||
                  (model === 'create' && scope.$index < 4)
                    ? true
                    : false
                "
                placeholder="请输入"
              /> -->
              <el-input
                v-model="scope.row.name"
                @keyup.enter.native="addFeild"
                :disabled="true"
                placeholder="请输入"
              />
            </template>
          </el-table-column>
          <el-table-column prop="type" label="字段类型" width="150">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.type"
                @change="typeChange(scope.row)"
                :disabled="
                  (model === 'edit' && scope.$index < formData.tableFieldList.length) ||
                  (model === 'create' && scope.$index < 4 && realUseForm.tableData.type === 1)
                    ? true
                    : false
                "
                filterable
                placeholder="请选择"
              >
                <el-option
                  v-for="item in fieldDictionary"
                  :key="item.id"
                  :label="item.typeName"
                  :value="item.typeName"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="length" label="长度" width="100">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.length"
                @keyup.enter.native="addFeild"
                :disabled="
                  (model === 'edit' && scope.$index < formData.tableFieldList.length) ||
                  (model === 'create' && scope.$index < 4 && realUseForm.tableData.type === 1) ||
                  scope.row.type === 'date'
                    ? true
                    : false
                "
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="remark" label="说明">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.remark"
                @keyup.enter.native="addFeild"
                placeholder="请输入"
              ></el-input>
            </template>
          </el-table-column>

          <el-table-column label="主键" width="80">
            <template slot-scope="scope">
              <el-radio
                :disabled="model === 'edit' ? true : false"
                v-model="primaryId"
                :label="scope.$index"
                >&nbsp;</el-radio
              >
            </template>
          </el-table-column>
          <el-table-column prop="isIndex" label="索引" width="80">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.isIndex"
                :true-label="1"
                :false-label="0"
              ></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="isDefaultSelect" label="默认查询" width="80">
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.isDefaultSelect"
                :true-label="1"
                :false-label="0"
              ></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="realUseShow = false">取 消</el-button>
      <el-button size="mini" type="primary" @click="onSubmit">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import _ from '@/utils'
import { repeat } from '@antv/x6/lib/util/string/string'
export default {
  name: '',
  props: {
    /* create:新增 edit:编辑 */
    model: {
      type: String,
      default: 'create'
    },
    show: {
      type: Boolean,
      default: false
    },
    formData: {
      type: Object
    },
    fieldDictionary: {
      type: Array
    },
    tableTypes: {
      type: Array
    },
    metaDataList: {
      type: Array
    }
  },
  data() {
    return {
      realUseShow: false,
      realUseForm: {},
      primaryId: -1,
      num: 10,
      loading: false
    }
  },
  directives: {
    'select-lazy-load': {
      bind(el, binding) {
        // 因为el-select最终会渲染成ul  li  ，所以我们要找到对应的ul元素节点，因为最底层的滚动条就是这个ul的
        const SELECTDOM = el.querySelector('.el-select-dropdown .el-select-dropdown__wrap')
        // 为对应的ul绑定滚动条滚动事件
        SELECTDOM.addEventListener('scroll', function() {
          const condition = this.scrollHeight - this.scrollTop == this.clientHeight
          // 判断滚动到底部
          if (condition) {
            // binding.value 为自定义指令绑定的值，因为绑定的是个方法，所以这里是方法调用，触发指令后执行加载数据
            binding.value()
          }
        })
      }
    }
  },
  watch: {
    show(currentData) {
      this.realUseShow = currentData
    },
    realUseShow(currentData) {
      this.$emit('update:show', currentData)
    },
    formData: {
      handler: function(currentData) {
        this.realUseForm = _.deepCopy(currentData, {})
        let index = this.realUseForm.tableFieldList.findIndex(i => {
          return i.isPrimary === 1
        })
        this.primaryId = index
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    loadMetaData() {
      this.$emit('loadMetaData')
    },
    remoteMethod(v) {
      this.$emit('searchMetaData', v)
    },
    equipParams(row) {
      let obj = this.metaDataList.find(i => {
        return i.deCodeName === row.nameCn
      })
      row.name = obj.name
      row.type = obj.dataType
      row.length = obj.length
      row.remark = obj.deCodeDefinition
    },
    onSubmit() {
      /* 验证表格信息 */
      this.$refs.formTableData.validate(valid => {
        if (valid) {
          let lastItem = this.realUseForm.tableFieldList[this.realUseForm.tableFieldList.length - 1]
          // 判断最后一个成员字段名、字段中文名、字段类型是否都为空，都为空时删除字段数组最后一个成员，并保存
          if (!lastItem.name && !lastItem.type && !lastItem.nameCn) {
            this.realUseForm.tableFieldList.pop()
            this.emitEvent(true)
            // 正常流程
          } else if (!this.emitEvent()) {
            return false
          }
        } else {
          _.showMessage('error', '请输入必填信息')
          return false
        }
      })
    },

    emitEvent(isEmit = false) {
      let result = this.realUseForm.tableFieldList.some(i => {
        return i.isDefaultSelect === 1
      })
      if (!result) {
        return _.showMessage('warning', '必须有一个字段为默认查询，请勾选！')
      }
      if (!isEmit && !this.checkFeildItem(this.realUseForm.tableFieldList)) return false
      if (this.model === 'create' && this.primaryId >= 0) {
        this.realUseForm.tableFieldList[this.primaryId].isPrimary = 1
      }
      this.model === 'create'
        ? this.$emit('createTable', this.realUseForm)
        : this.$emit('editTable', this.realUseForm)
    },
    resetDic() {
      
      this.$emit('resetDic')
    },
    addFeild() {
      this.resetDic()
      /* 滚动至底部 */
      let fieldList = this.realUseForm.tableFieldList
      if (!this.checkFeildItem(fieldList)) return
      let obj = {
        isDefaultSelect: 1,
        isIndex: 0,
        isPrimary: 0,
        length: 0,
        name: '',
        remark: '',
        tableDataId: this.realUseForm.tableData.id,
        type: ''
      }
      fieldList.push(obj)
      this.$nextTick(() => {
        this.$refs.table.bodyWrapper.scrollTop = this.$refs.table.bodyWrapper.scrollHeight
      })
    },

    checkFeildItem(list) {
      if (list.length === 0) return true
      let lastItem = list[list.length - 1]
      if (!lastItem.name || !lastItem.type)
        return _.showMessage('warning', '字段名称和类型为必填项，请输入！')
      else return true
    },

    tableDialogClosed() {
      this.$refs.formTableData.resetFields()
      this.resetDic()
    },

    typeChange(row) {
      if (row.type === 'date') {
        row.length = ''
      }
    },
    tableTypeChange(id) {
      this.$emit('tableTypeChange', id)
    }
  }
}
</script>
<style lang="scss" scoped>
.table-dialog-title {
  display: flex;
  align-items: center;
  .table-title-logo {
    width: 4px;
    height: 17px;
    margin-top: 1px;
    background: #0075ff;
  }
  .table-title-font {
    font-size: 18px;
    padding-left: 5px;
  }
}
.table-dialog-body {
  border: 1px solid #e6e6e6;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 2px;
  .part-one {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .part-one-input {
      display: flex;
      align-items: center;
    }
  }
  .part-two {
    margin-top: 10px;
    min-height: 90px;
  }
}
::v-deep .el-form-item {
  margin-bottom: 0;
}
::v-deep .el-input__icon {
  line-height: 28px !important;
}
::v-deep .el-input--mini {
  font-size: 14px;
}
::v-deep .el-button--primary.is-plain {
  background: #fff;
}
::v-deep .el-button--primary.is-plain:hover {
  background-color: #0075ff;
}
::v-deep .el-input.is-disabled .el-input__inner {
  background-color: #F9F9F9;
  border-color: #C4CBD4;
}
</style>
