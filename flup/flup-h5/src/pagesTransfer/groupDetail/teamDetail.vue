<template>
  <div class="teamDetail">
    <div class="teamDetail-introduce">
      <img :src="introduceUrl ? introduceUrl : health" v-if="imgShow">
    </div>
    <div class="teamDetail-title teamDetail-title-equ">
      <span class="teamDetail-title-text">团队介绍</span>
      <span class="teamDetail-title-more" v-if="introduceExpand" @click="expand()">收起<van-icon name="arrow-up" /></span>
      <span class="teamDetail-title-more" v-else @click="expand()">查看全部<van-icon name="arrow-down" /></span>
    </div>
    <div class="teamDetail-desc">
      <div class="teamDetail-desc-content" :class="{ allexpand : introduceExpand }">
        {{ groupIntroduce ? groupIntroduce : '暂无团队介绍' }}
      </div>
    </div>
    <div class="teamDetail-title">
      <span class="teamDetail-title-text">团队成员</span>
    </div>
    <div class="teamDetail-docList">
      <doctor-swiper :teamList="teamList"></doctor-swiper>
    </div>
    <div class="teamDetail-title">
      <span class="teamDetail-title-text">团队服务</span>
    </div>
    <div class="teamDetail-package">
      <package-list :packageList="packageList" :packageShow="packageShow"></package-list>
    </div>
    <!-- <div style="height:72px"></div> -->
    <!-- <div class="teamDetail-btnGroup">
      <div class="teamDetail-btnGroup-btn" @click="consult()">咨询团队</div>
    </div> -->
  </div>
</template>

<script>
import doctorSwiper from "./components/doctorSwiper.vue";
import packageList from "./components/packageList.vue";
import health from "@/assets/images/home/introduce.png";
export default {
  data() {
    return {
      teamList: [],
      packageList: [],
      groupIntroduce: "",
      introduceUrl: "",
      introduceExpand: false,
      packageShow: true,
      imgShow: false
    };
  },
  components: {
    doctorSwiper,
    packageList,
  },
  created() {
    this.getAppointGroupDetail(this.$route.query.groupId);
  },
  computed: {
    health() {
      return health;
    },
  },
  methods: {
    getAppointGroupDetail(groupId) {
      this.$apis.getAppointGroupDetail({ groupId }).then((res) => {
        let { doctorTeamMap, packageInfoVos, groupIntroduce, introduceUrl } =
          res.retData;
        let doctorTeam = Object.values(doctorTeamMap).flat();
        // this.teamList = this.getTeamList(doctorTeam);
        this.teamList = doctorTeam
        this.packageList = packageInfoVos;
        this.introduceUrl = introduceUrl;
        this.groupIntroduce = groupIntroduce;
        if (packageInfoVos.length == 0) this.packageShow = false;
        this.imgShow = true
      });
    },
    getTeamList(doctorTeamMap, chunkSize = 8) {
      let result = [];
      for (let i = 0; i < doctorTeamMap.length; i += chunkSize) {
        let chunk = doctorTeamMap.slice(i, i + chunkSize);
        result.push(chunk);
      }
      return result;
    },
    expand() {
      this.introduceExpand = !!!this.introduceExpand;
    },
    consult() {
      this.$router.push({
        name: "consult",
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.teamDetail {
  background-color: #f3f7f5;
  height: 100%;
  width: 100%;
  &-title {
    color: #111111;
    line-height: 52px;
    height: 52px;
    font-size: 17px;
    font-weight: 600;
    z-index: 1000;
    padding: 0 12px;
    &-text {
      display: inline-block;
      background-image: url("../../assets/images/home/line.png");
      background-repeat: no-repeat;
      background-position: 0 13px;
      background-size: contain;
      line-height: 17px;
      height: 22px;
    }
    &-more {
      font-size: 12px;
      font-weight: normal;
      line-height: 22px;
      letter-spacing: 0px;
      color: #666666;
    }
  }
  &-title-equ {
    display: flex;
    justify-content: space-between;
    align-items: center;
    line-height: 52px;
    height: 52px;
  }
  &-introduce {
    width: 100%;
    img {
      width: 100%;
    }
  }
  &-desc {
    background: #fff;
    margin: 0px 14px;
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0.2px;
    color: #666666;
    word-break: break-all;
    overflow: hidden;
    border-radius: 8px;
    &-content {
      background: #fff;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      margin: 17px 14px;
    }
    .allexpand {
      display: block;
    }
  }
  &-package {
    margin: 0px 14px;
  }
  &-btnGroup {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    height: 65px;
    background: #fff;
    &-btn {
      height: 34px;
      background: linear-gradient(104deg, #ff9035 31%, #ff7b35 70%);
      border-radius: 100px;
      margin: 8px 14px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
      font-weight: 600;
      line-height: 20px;
      text-align: center;
      letter-spacing: 0.2px;

      color: #ffffff;
    }
  }
}
</style>

