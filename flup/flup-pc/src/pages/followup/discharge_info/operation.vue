<template>
  <div class="discharge-info">
    <el-row class="margin-top16" type="flex">
      <div class="label">术前诊断</div>
      <div class="value">{{operationInfo.preoperativeDiagnosis }}</div>
    </el-row>

    <el-row class="margin-top16" type="flex">
      <div class="label">术后诊断</div>
      <div class="value">{{operationInfo.postoperativeDiagnosis }}</div>
    </el-row>

    <el-row class="margin-top16" type="flex">
      <div class="label">手术名称</div>
      <div class="value">{{operationInfo.operativeName }}</div>
    </el-row>

    <el-row class="margin-top16" type="flex">
      <el-col class="flex">
        <div class="label">手术开始时间</div>
        <div class="value">{{ operationInfo.startDatetime.slice(0,10) }}</div>
      </el-col>
      <el-col class="flex">
        <div class="label">手术结束时间</div>
        <div class="value">{{ operationInfo.endDatetime.slice(0,10) }}</div>
      </el-col>
    </el-row>

    <el-row class="margin-top16" type="flex">
      <el-col class="flex">
        <div class="label">主刀医生</div>
        <div class="value">{{operationInfo.surgeon }}</div>
      </el-col>

      <el-col class="flex">
        <div class="label">第一助手</div>
        <div class="value">{{operationInfo.firstAssistant }}</div>
      </el-col>

      <el-col class="flex">
        <div class="label">第二助手</div>
        <div>{{operationInfo.secondAssistant }}</div>
      </el-col>
    </el-row>

    <el-row class="margin-top16" type="flex">
      <el-col class="flex">
        <div class="label">麻醉医生</div>
        <div class="value">{{operationInfo.anesthesiaDoctor }}</div>
      </el-col>

      <el-col class="flex">
        <div class="label">麻醉方式</div>
        <div class="value">{{operationInfo.anesthesiaMethod }}</div>
      </el-col>
    </el-row>
    <el-row class="margin-top16" type="flex">
      <div class="label">手术经过</div>
      <div class="value">{{operationInfo.operativeProcess }}</div>
    </el-row>
  </div>
</template>

<script>
export default {
  props: {
    operationInfo: Object,
  },
  data() {
    return {}
  },
}
</script>

<style lang="scss">
.discharge-info {
  padding: 0px 20px 20px 20px;
  .label {
    margin-right: 10px;
    min-width: 130px;
    text-align: right;
    color: #333333;
  }
  .value {
    color: #111111;
    white-space: pre-wrap;
  }
}
</style>