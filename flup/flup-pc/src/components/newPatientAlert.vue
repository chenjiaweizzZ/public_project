<template>
  <div class="newPatientAlert">
    <div class="sketch">
      <p>部分患者入组失败(共计：{{errorList.length}})</p>
      <el-button type="text" v-if="!unfold" @click="unfold=true">
        展开
        <i class="el-icon-arrow-down"></i>
      </el-button>
      <el-button type="text" v-else @click="unfold=false">
        收起
        <i class="el-icon-arrow-up"></i>
      </el-button>
    </div>
    <el-table
      v-if="unfold"
      :data="errorList"
      border
      stripe
      style="width: 100%"
      max-height="300"
      :header-cell-style="{'text-align': 'center'}"
    >
      <el-table-column prop="patientName" label="姓名" width="80"></el-table-column>
      <el-table-column prop="groupInfo" label="失败原因"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'NewPatientAlert',
  props: ['errorList'],
  data() {
    return {
      unfold: false,
    }
  },
}
</script>

<style lang="scss">
.newPatientAlert {
  .sketch {
    width: 100%;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
</style>