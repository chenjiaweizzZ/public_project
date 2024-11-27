<template>
  <div class="featuredSearch">
    <div class="featuredSearch-title">
      <div @click.stop.prevent="inputPaentClick('field')" style="flex:1;">
        <van-field class="featuredSearch-title__search" left-icon="search" clearable v-model="text" placeholder="请输入" ref="field" @click-left-icon="changeInput" @input="changeInput" />
      </div>
      <span class="featuredSearch-title__text" @click="backspace">取消</span>
    </div>
    <div class="featuredSearch-content">
      <!-- <doctor-list :docList="docList"></doctor-list> -->
       <team-list :teamList="teamList"></team-list>
    </div>
  </div>
</template>

<script>
import utils from "@/utils/utils";
// import doctorList from './components/doctorList.vue'
import teamList from './components/teamList.vue'
export default {
  components: { 
    // doctorList
    teamList
   },
  data() {
    return {
      text: "",
      docList: [],
      teamList: []
    };
  },
  methods: {
    getDocList(teamName = "") {
      // this.$apis.getAppointDoctorInfo({ doctorName }).then((res) => {
      //   this.docList = res.retData || [];
      // });
      this.$apis.getHomeDoctorTeamList({ teamName,pageSize:999,pageNo:1 }).then((res) => {
        this.teamList = res.retData.list || []
      });
    },
    inputPaentClick(refName) {
      this.$nextTick(() => {
        this.$refs[refName] && this.$refs[refName].focus();
      });
    },
    changeInput: utils.debounce(function () {
      this.docList = [];
      this.getDocList(this.text);
    }, 500),
    backspace() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss">
.featuredSearch {
  .featuredSearch-title__search {
    height: 32px;
    padding: 0px 13px;
    flex: 1;
    background: #f6f6f6;
    border-radius: 16px;
    line-height: 32px;
    font-size: 14px;
    .van-field__control {
      &::-webkit-input-placeholder {
        color: #b2b2b2;
      }
      color: #111111;
    }
    .van-field__left-icon {
      margin-right: 11px;
      color: #cdcdcd;
    }
  }
}
</style>

<style scoped lang="scss">
.featuredSearch {
  height: 100%;
  background-color: #fff;
  &-title {
    height: 44px;
    padding: 0 14px;
    display: flex;
    align-items: center;
    &__text {
      font-weight: 400;
      font-size: 16;
      color: #333333;
      font-weight: normal;
      margin-left: 12px;
    }
  }
  &-content {
    height: calc(100vh - 44px);
    overflow: scroll;
  }
}
</style>