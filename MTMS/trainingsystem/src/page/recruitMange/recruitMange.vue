<template>
  <div class="recruitMange">
    <el-radio-group v-model="tanIndex" style="margin-bottom: 30px;">
      <el-radio-button label="1">招录管理</el-radio-button>
      <el-radio-button label="2">资料预审</el-radio-button>
      <el-radio-button label="3">现场审核</el-radio-button>
      <el-radio-button label="4">招生考试</el-radio-button>
      <el-radio-button label="5">招生录取</el-radio-button>
    </el-radio-group>
    <recruit-mange v-if="tanIndex == 1"></recruit-mange>
    <information-examine v-if="tanIndex == 2"></information-examine>
    <examine-online v-if="tanIndex == 3"></examine-online>
    <recruit-student v-if="tanIndex == 4"></recruit-student>
    <enroll-student v-if="tanIndex == 5"></enroll-student>
  </div>


</template>
<script>
  import recruitMange from "../../components/recruitComponents/recruitMange.vue"
  import informationExamine from "../../components/recruitComponents/informationExamine.vue"
  import examineOnline from "../../components/recruitComponents/examineOnline.vue"
  import recruitStudent from "../../components/recruitComponents/recruitStudent.vue"
  import enrollStudent from "../../components/recruitComponents/enrollStudent.vue"
  export default {
    created() {
      console.log(this.$route.query)
      if(this.$route.query.tanIndex) {
        this.tanIndex = this.$route.query.tanIndex
      }
    },
    data() {
      return {
        tanIndex: "1"
      }
    },
    components: {
      recruitMange,
      informationExamine,
      examineOnline,
      recruitStudent,
      enrollStudent
    }
  }

</script>
<style  lang="scss" scoped>
.recruitMange {
  padding: 20px;
  padding-top: 0;
}
</style>