//发送宣教大tab
<template>
  <el-tabs
    style="padding-top:0"
    v-model="active"
    class="container-wrapper paddingX20 padding20X margin-bottom66"
    type="card"
  >
    <el-tab-pane label="按患者发送" name="patient">
      <br />
      <SendByPatient v-if="active === 'patient'"></SendByPatient>
    </el-tab-pane>
    <el-tab-pane
      :label="`按${this.$route.params.type.toLowerCase() == 'jkxj' ? '宣教' : '问卷'}发送`"
      name="template"
    >
      <br />
      <SendByTemplate v-if="active === 'template'"></SendByTemplate>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
import SendByPatient from './send_by_patient'
import SendByTemplate from './send_by_template'
export default {
  data() {
    return {
      active: 'patient',
    }
  },
  components: {
    SendByTemplate,
    SendByPatient,
  },
}
</script>
