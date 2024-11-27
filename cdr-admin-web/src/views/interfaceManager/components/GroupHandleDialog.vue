<!-- transformer操作Dialog -->
<template>
  <!-- 新增/编辑 transformer dialog -->
  <el-dialog
    :title="model === 'create' || model === 'createSon' ? '新 增' : '编 辑'"
    :visible.sync="realUseShow"
    :close-on-click-modal="false"
    @closed="groupDialogClosed"
    width="800px"
  >
    <el-form
      :label-position="'right'"
      :show-message="true"
      ref="groupDialog"
      label-width="90px"
      :model="realUseFormData"
    >
      <el-row>
        <el-form-item
          prop="apiCode"
          label="编 码"
          :rules="{
            required: true,
            message: '编码不能为空',
            trigger: 'blur'
          }"
        >
          <el-input
            :disabled="model !== 'create' && model !== 'createSon'"
            :maxlength="20"
            v-model="realUseFormData.apiCode"
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item
          prop="typeIdAndDbname"
          label="域 名"
          :rules="{
            required: true,
            message: '请选择域名',
            trigger: 'blur'
          }"
        >
          <el-select
            :disabled="model !== 'create' && model !== 'createSon'"
            v-model="realUseFormData.typeIdAndDbname"
          >
            <el-option
              v-for="(item, index) in classList"
              :key="index"
              :label="item.name"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-row>
      <el-row v-if="model === 'createSon' || model === 'editSon'">
        <el-form-item
          prop="parentField"
          label="父字段名"
          :rules="{
            required: true,
            message: '父字段名不能为空',
            trigger: 'blur'
          }"
        >
          <el-input v-model="realUseFormData.parentField"></el-input>
        </el-form-item>
      </el-row>
      <el-row v-show="model === 'editSon'">
        <el-form-item prop="parentParameter" label="关联">
          <el-table :data="params.parentParameters" border>
            <el-table-column label="父字段出参" align="center" prop="key">
              <template slot-scope="scope">
                <el-select v-model="scope.row.parentField" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in fOptions"
                    :key="index"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="子入参" align="center" prop="key">
              <template slot-scope="scope">
                <el-select v-model="scope.row.parameterName" placeholder="请选择">
                  <el-option
                    v-for="(item, index) in cOptions"
                    :key="index"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div class="item-handle">
                  <span @click="addEvent" class="subitem">新增</span>
                  <span @click="delEvent(scope.$index)" class="subitem">删除</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="自定义代码" prop="transformerCode">
          <el-input
            type="textarea"
            v-model="realUseFormData.transformerCode"
            maxlength="1000"
            :rows="3"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row>
        <el-form-item label="包 名" prop="extraPackage">
          <el-input
            v-model="realUseFormData.extraPackage"
          ></el-input>
        </el-form-item>
      </el-row>
      
      <el-row>
        <el-form-item label="说 明" prop="apiNotes">
          <el-input
            type="textarea"
            v-model="realUseFormData.apiNotes"
            maxlength="100"
            :rows="3"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-row>
      <el-row type="flex" justify="end">
        <el-form-item>
          <el-button @click="realUseShow = false">取 消</el-button>
          <el-button type="primary" @click="submitForm" :loading="btnLoading">确 定</el-button>
        </el-form-item>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import _ from '@/utils'
import * as _api from '@/service/interfaceManager'
export default {
  name: '',
  props: {
    /* create:新增 edit:编辑 */
    model: {
      type: String,
      default: 'create'
    },
    formData: {
      type: Object
    },
    show: {
      type: Boolean,
      default: false
    },
    classList: {
      type: Array,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      realUseShow: false,
      groupTitle: '',
      realUseFormData: {
        apiCode: '',
        apiNotes: '',
        apiVersion: '1.0',
        parentField: '',
        parentCode: '',
        transformerCode: '',
        extraPackage: '',
        typeIdAndDbname: ''
      },
      btnLoading: false,
      params: {
        parentParameters: [
          {
            parameterName: '',
            parentField: ''
          }
        ]
      },
      fOptions: [],
      cOptions: []
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
        if (this.model === 'editSon') {
          let arr = this.formData.idNo.split('-')
          let index = arr.findIndex(i => {
            return i === this.formData.id + ''
          })
          let Fid = arr[index - 1]
          let Cid = arr[index]
          Promise.all([
            _api.getSelectParam({ id: Fid, selectSon: 0 }),
            _api.getSelectParam({ id: Cid, selectSon: 0 })
          ]).then(result => {
            this.fOptions = Object.keys(result[0].outParam)
            this.cOptions = Object.keys(result[1].inParam)
          })
        }
        this.realUseFormData = _.deepCopy(currentData, {})
        if (this.realUseFormData.parentParameter) {
          let obj = JSON.parse(this.realUseFormData.parentParameter)
          obj.parentParameters
            ? (this.params = obj)
            : (this.params = {
                parentParameters: [
                  {
                    parameterName: '',
                    parentField: ''
                  }
                ]
              })
        }
      },
      deep: true
    }
  },
  methods: {
    submitForm() {
      this.$refs.groupDialog.validate(valid => {
        if (valid) {
          this.btnLoading = true
          if (this.model === 'editSon') {
            this.realUseFormData.parentParameter = JSON.stringify(this.params)
          }
          this.$emit('onSubmit', this.realUseFormData)
        } else {
          console.log('', this.realUseFormData)
          console.log('groupDialog validate 校验失败')
          return false
        }
      })
    },

    /* dialog关闭动画结束后的动作 */
    groupDialogClosed() {
      this.btnLoading = false
      this.$refs.groupDialog.resetFields()
    },
    stopBtnLoading() {
      this.btnLoading = false
    },
    addEvent() {
      this.params.parentParameters.push({
        key: '',
        value: ''
      })
    },
    delEvent(index) {
      if (this.params.parentParameters.length < 2) return
      this.params.parentParameters.splice(index, 1)
    }
  }
}
</script>
<style lang="scss" scoped>
.item-handle {
  display: flex;
  justify-content: center;
  color: #0075ff;
  .subitem {
    padding: 4px;
  }
  .subitem:hover {
    cursor: pointer;
    text-decoration: underline;
  }
}
::v-deep .el-input__icon {
  line-height: 28px !important;
}
::v-deep .el-dialog__body {
  padding: 0 20px;
}
</style>
