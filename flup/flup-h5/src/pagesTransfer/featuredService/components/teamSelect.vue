<template>
  <div class="teamSelect">
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad()">
      <team-list :teamList="teamList"></team-list>
    </van-list>
  </div>
</template>


<script>
import teamList from "../../featuredSearch/components/teamList.vue";
export default {
  components: { teamList },
  data() {
    return {
      teamList: [],
      loading: false,
      finished: false,
      pageSize: 5,
      pageNo: 0
    };
  },
  // created() {
  //   this.getTeamList();
  // },
  methods: {
    getTeamList(teamName = "") {
      this.$apis
        .getHomeDoctorTeamList({ teamName, pageSize: 999, pageNo: 1 })
        .then((res) => {
          this.teamList = res.retData.list || [];
        });
    },
    onLoad() {
      this.pageNo += 1
      let { pageSize, pageNo } = this
      this.$apis
        .getHomeDoctorTeamList({ pageSize, pageNo, doctorId: "" })
        .then((res) => {
          this.teamList.push(...res.retData.list)
          if(res.retData.list.length < pageSize) {
            this.finished = true
          }
          this.loading = false
        });
    }
  },
};
</script>

<style scoped lang="scss">
.teamSelect {
  height: calc(100vh - 88px);
  overflow: scroll;
}
</style>