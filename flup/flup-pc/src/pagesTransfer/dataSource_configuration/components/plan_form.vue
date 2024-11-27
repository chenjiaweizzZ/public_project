<template>
  <div>
    <div>
      <el-form
        class="padding20X paddingX20 padding-bottom10"
        ref="formBase"
        :model="formBase"
        label-width="110px"
        v-loading="loading"
        v-if="shoBase"
      >
        <el-form-item prop="baseId" label="上级">
          <el-select placeholder="请选择上级" v-model="formBase.baseId" @change="baseChange">
            <el-option
              v-for="item in menuList"
              :key="item.baseId"
              :label="item.baseName"
              :value="item.baseId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="baseName" label="数据源名称" :rules="[{required:true ,message: '请输入数据源名称'}]">
          <el-input placeholder="请输入名称" v-model="formBase.baseName"></el-input>
        </el-form-item>
        <el-form-item prop="baseCode" label="数据源编码" :rules="[{required:true ,message: '请输入数据源编码'}]">
          <el-input placeholder="请输入" v-model="formBase.baseCode"></el-input>
        </el-form-item>
      </el-form>

      <el-form
        class="padding20X paddingX20 padding-bottom10"
        ref="formSet"
        :model="formSet"
        label-width="110px"
        v-loading="loading"
        v-else
      >
        <el-form-item prop="baseId" label="上级">
          <el-select placeholder="请选择上级" v-model="formSet.baseId" @change="setChange">
            <el-option
              v-for="item in menuList"
              :key="item.baseId"
              :label="item.baseName"
              :value="item.baseId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="datasetName"
          label="数据源名称"
          :rules="[{required:true ,message: '请输入数据源名称'}]"
        >
          <el-input placeholder="请输入名称" v-model="formSet.datasetName"></el-input>
        </el-form-item>
        <el-form-item
          prop="datasetCode"
          label="数据源编码"
          :rules="[{required:true ,message: '请输入数据源编码'}]"
        >
          <el-input placeholder="请输入" v-model="formSet.datasetCode"></el-input>
        </el-form-item>
        <el-form-item prop="baseCode" label="请求接口">
          <el-input placeholder="请输入" v-model="formSet.datasetUrl"></el-input>
        </el-form-item>
        <el-form-item prop="baseCode" label="请求接口参数">
          <el-input placeholder="请输入" v-model="formSet.datasetParam"></el-input>
        </el-form-item>
        <el-form-item prop="requestMethod" label="请求方式">
          <el-select v-model="formSet.requestMethod">
            <el-option
              v-for="item in requestType"
              :key="item.key"
              :label="item.key"
              :value="item.key"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <el-row class="dialog-footer" type="flex" justify="end">
        <el-button @click="onCancel">取 消</el-button>
        <el-button type="primary" @click="onSubmit">确定</el-button>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  name: 'plan_form',
  props: ['menuId', 'serialNo'],
  data() {
    return {
      loading: false,
      shoBase: true,
      formBase: {
        baseCode: null,
        baseName: null,
        enabled: '1',
      },
      formSet: {
        datasetCode: null,
        datasetName: null,
        datasetUrl: null,
        datasetParam: null,
        enabled: null,
        requestMethod: 'GET',
        baseId: null,
      },
      requestType: [{ key: 'GET' }, { key: 'POST' }],
      menuList: [],
    }
  },
  created() {
    this.getDataBaseList()
    //判斷是一级目录还是二级目录
    if (this.menuId == '0') {
      this.formBase.baseId = '0'
      if (this.serialNo) {
        this.$apis.getDatasetBaseOne({ baseId: this.serialNo }).then((res) => {
          this.formBase = res
        })
        this.shoBase = true
      }
    } else {
      this.formSet.baseId = this.menuId
      // 判断是新增还是编辑
      if (this.serialNo) {
        this.$apis.getDatasetOne({ datasetId: this.serialNo }).then((res) => {
          this.formSet = res
        })
      }
      this.shoBase = false
    }
  },
  methods: {
    getDataBaseList() {
      this.$apis.getDatasetBaseList().then((res) => {
        this.menuList = res
        this.menuList.unshift({ baseId: '0', baseName: '父节点' })
      })
    },
    onCancel() {
      this.resetBase()
      this.$emit('onCancel')
    },
    onSubmit() {
      if (!this.shoBase) {
        this.$refs['formSet'].validate((valid) => {
          if (valid) {
            this.$emit('onSubmit', this.formSet, 'set')
          }
        })
      } else {
        this.$refs['formBase'].validate((valid) => {
          if (valid) {
            this.$emit('onSubmit', this.formBase, 'base')
            console.log(this)
          }
        })
      }
    },
    //上级切换，form切换
    baseChange() {
      this.resetBase()
      if (this.formBase.baseId != '0') {
        this.formSet.baseId = this.formBase.baseId
        this.shoBase = false
      }
    },
    setChange() {
      this.resetSet()
      if (this.formSet.baseId == '0') {
        this.formBase.baseId = '0'
        this.shoBase = true
      }
    },
    resetBase() {
      this.formBase.baseCode = ''
      this.formBase.baseName = ''
      this.formBase.enabled = '1'
    },
    resetSet() {
      this.formSet.datasetCode = ''
      this.formSet.datasetName = ''
      this.formSet.datasetUrl = ''
      this.formSet.datasetParam = ''
      this.formSet.enabled = ''
      this.formSet.requestMethod = 'GET'
      // this.formSet.baseId = ''
    },
  },
}
</script>

<style scoped>
</style>
