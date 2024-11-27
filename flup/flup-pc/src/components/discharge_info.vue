<template>
  <div>
    <el-row type="flex">
      <div class="label">姓名</div>
      <div></div>
      <div class="label">性别</div>
      <div></div>
      <div class="label">出生日期</div>
      <div></div>
    </el-row>
    <el-row type="flex">
      <div class="label">病理号</div>
      <div></div>
      <div class="label">入院病区</div>
      <div></div>
      <div class="label">住院天数</div>
      <div></div>
    </el-row>
    <el-row type="flex">
      <div class="label">入院时间</div>
      <div></div>
      <div class="label">出院时间</div>
      <div></div>
      <div class="label">主诊医生</div>
      <div></div>
    </el-row>
    <el-row type="flex">
      <div class="label">入院原因</div>
      <div></div>
    </el-row>
    <el-row type="flex">
      <div class="label">入院诊断</div>
      <div></div>
    </el-row>
    <el-row type="flex">
      <div class="label">出院诊断</div>
      <div></div>
    </el-row>
    <el-row type="flex">
      <div class="label">入院情况</div>
      <div></div>
    </el-row>
    <el-row type="flex">
      <div class="label">住院治疗经过</div>
      <div></div>
    </el-row>
    <el-row type="flex">
      <div class="label">出院状况</div>
      <div></div>
    </el-row>
    <el-row type="flex">
      <div class="label">出院去向</div>
      <div></div>
    </el-row>
    <el-row type="flex">
      <div class="label">出院带药</div>
      <div></div>
    </el-row>
    <el-row type="flex">
      <div class="label">随访指导</div>
      <div></div>
    </el-row>
    <el-row type="flex">
      <div class="label">手术部位目测性监测</div>
      <div></div>
    </el-row>
    <el-row type="flex">
      <div class="label">复诊时间</div>
      <div></div>
    </el-row>
    <el-row type="flex">
      <div class="label">出院医嘱</div>
      <div></div>
    </el-row>
    <div class="text-align-right">
      {{`书写医师签名：${s}`}}
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return {
      data: this.$router.params
    }
  }
}
</script>