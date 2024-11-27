<template>
  <el-dialog
    title="获取规则设置"
    width="60%"
    :visible.sync="dialogVisible"
    @close="$emit('update:show',false)"
  >
    <el-form :model="form" ref="form" label-width="200px">
      <el-form-item label="当前计划" prop="planName">
        <el-input placeholder="请输入" v-model="form.planName" :disabled="true" class="limiting"></el-input>
      </el-form-item>
      <el-form-item label="自动获取人群周期（天）" prop="fuPeriod">
        <el-input-number v-model="form.fuPeriod " :min="1" :max="100" label="描述文字"></el-input-number>
      </el-form-item>
      <el-form-item label="自动获取人群" prop="crowdType">
        <el-select
          multiple
          style="width:100%;min-width:300px;display: inline-block;"
          v-model="form.crowdType"
          placeholder="人群标签"
        >
          <el-option
            v-for="item in crowdTypeList"
            :key="item.dict_code"
            :value="item.dict_code"
            :label="item.dict_name"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="启用" prop="enable">
        <el-switch v-model="form.enable" active-value="1" inactive-value="0"></el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="ruleSetting">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'rule-setting',
  props: {
    show: Boolean,
    planId: String,
    data: Object,
  },
  data() {
    return {
      crowdTypeList: [],
      form: {
        planId: this.planId,
        planName: this.planName,
        fuPeriod: 1,
        crowdType: [],
      },
      dialogVisible: this.show,
    }
  },

  async created() {
    this.$apis.getFlupPlanRule({ planId: this.planId }).then((res) => {
      if (res) {
        //从待入组队列页面跳转
        this.form = res
        this.form.crowdType = res.crowdType ? res.crowdType.split(',') : []
        this.form.enable = res.enable.toString()
      } else {
        //从计划页面跳转
        this.form.planSerialNo = this.data.serialNo
        this.form.hospitalId = this.data.hospitalId
        this.form.planName = this.data.planName
        this.form.enable = this.data.enable.toString()
        this.form.isDelete = 0
      }
    })

    await this.$apis
      .BaseDictGetDictItems({
        keyWord: '',
        parentId: '20170915191220011928',
      })
      .then((res) => {
        this.crowdTypeList = res
      })
  },
  watch: {
    show() {
      this.dialogVisible = this.show
    },
  },
  methods: {
    ruleSetting() {
      let param = { ...this.form }
      param.crowdType = this.form.crowdType ? this.form.crowdType.join(',') : ''
      param.enable = parseInt(param.enable)
      this.$apis.saveFlupPlanRule(param).then((res) => {
        if (res) {
          this.$message.success('设置成功')
          this.dialogVisible = false
        }
      })
    },
  },
}
</script>