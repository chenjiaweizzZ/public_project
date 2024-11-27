<!-- 导入弹出框 -->
<template>
  <el-dialog
    :visible.sync="realUseShow"
    :close-on-click-modal="false"
    @closed="tableDialogClosed"
    width="500px"
  >
    <template slot="title">
      <div class="table-dialog-title">
        <div class="table-title-logo"></div>
        <div class="table-title-font">导 入</div>
      </div>
    </template>
    <el-form :inline="false" ref="formData" :rules="rules" :model="formData" label-width="80px">
      <el-form-item
        label="表名"
        prop="name"
        :rules="{
          required: true,
          message: '请输入表名',
          trigger: 'blur'
        }"
      >
        <el-input v-model="formData.name" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item
        label="表中文名"
        prop="nameCn"
        :rules="{
          required: true,
          message: '请输入表中文名',
          trigger: 'blur'
        }"
      >
        <el-input v-model="formData.nameCn" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item
        label="类型"
        prop="type"
        :rules="{
          required: true,
          message: '请选择类型',
          trigger: 'blur'
        }"
      >
        <el-select size="mini" v-model="formData.type" placeholder="请选择">
          <el-option
            v-for="item in tableTypes"
            :key="item.id"
            :label="item.typeName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :rows="3"
          placeholder="请输入内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="文件地址" prop="fileList">
        <el-upload
          class="avatar-uploader"
          ref="upload"
          :action="url"
          accept=".xls,.xlsx"
          :before-upload="beforeUpload"
          :on-change="onChange"
          :on-remove="handleRemove"
          :file-list="formData.fileList"
          :auto-upload="false"
          :multiple="false"
          :on-success="onSuccess"
          :on-error="onError"
        >
          <div class="uploader-box">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </div>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button size="mini" @click="realUseShow = false">取 消</el-button>
      <el-button size="mini" type="primary" @click="onSubmit">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
import _ from '@/utils'
const conUrl = process.env.VUE_APP_UPLOAD_API + '/importTable'
export default {
  name: '',
  components: {},
  props: {
    show: {
      type: Boolean,
      default: false
    },
    activeClassID: {
      type: Number,
      require: true
    },
    tableTypes: {
      type: Array
    }
  },
  data() {
    return {
      realUseShow: false,
      formData: {
        type: 1,
        name: '',
        nameCn: '',
        fileList: [],
        remark: ''
      },
      rules: {
        fileList: [{ required: true, message: '请选择文件', trigger: 'change' }]
      },
      url: ''
    }
  },
  watch: {
    show(currentData) {
      this.realUseShow = currentData
    },
    realUseShow(currentData) {
      this.$emit('update:show', currentData)
    }
  },
  created() {},
  methods: {
    beforeUpload(file) {
      let FileExt = file.name.replace(/.+\./, '')
      if (['xls', 'xlsx'].indexOf(FileExt.toLowerCase()) === -1) {
        return !!_.showMessage('warning', '文件类型必须是xls或xlsx格式')
      }
    },
    //onChange这里我根据我的业务需求进行修改替换上一次的上传文件了
    onChange(file, fileList) {
      //文件状态改变时的钩子函数
      // this.formData.fileList = fileList;
      if (fileList.length > 0) {
        this.formData.fileList = [file] // 这一步，是 展示最后一次选择的文件
      }
    },
    handleRemove(file, fileList) {
      this.formData.fileList = []
    },
    onError() {
      _.showMessage('error', '表格导入失败，请联系管理员。')
      this.$refs['upload'].clearFiles()
      this.formData.fileList = []
    },
    onSuccess(response) {
      if (response.errCode === 0) {
        _.showMessage('success', '表格导入成功')
        this.$emit('refresh')
        this.realUseShow = false
      } else {
        _.showMessage('error', response.returnMsg || '表格导入失败，请联系管理员。')
        this.$refs['upload'].clearFiles()
        this.formData.fileList = []
      }
    },
    onSubmit() {
      //导入提交
      this.$refs.formData.validate(valid => {
        if (valid) {
          // 触发组件的action
          this.url =
            conUrl +
            _.queryEquipment({
              tableClassId: this.activeClassID,
              type: this.formData.type,
              name: this.formData.name,
              nameCn: this.formData.nameCn,
              remark: this.formData.remark || ''
            })
          this.equipDone = true
          this.$nextTick(() => {
            this.$refs.upload.submit()
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    tableDialogClosed() {
      this.equipDone = false
      this.$refs.formData.resetFields()
      this.$refs['upload'].clearFiles()
      this.formData.fileList = []
    }
  }
}
</script>
<style lang="scss" scoped>
.uploader-box {
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
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
</style>
