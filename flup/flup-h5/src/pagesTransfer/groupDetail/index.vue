<template>
  <div class="groupDetail">
    <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white" v-if="swipeList.length">
      <van-swipe-item v-for="(item, index) in swipeList" :key="index">
        <img :src="item" alt>
      </van-swipe-item>
    </van-swipe>
    <div class="groupDetail-content">
      <div class="title">
        <span class="title-text">医生团队</span>
        <span class="title-coll" v-if="doctorTeamMapLength > 1" @click="lanuch">
          {{ isLunch ? '收起' : '查看全部' }}
          <van-icon name="arrow-down" />
        </span>
      </div>
      <div class="team" v-if="teamShow">
        <div class="team-group" v-for="(value, key, index) in doctorTeamMap" :key="key">
          <div class="team-group-name" v-if="isLunch || index == 0">{{ key }}</div>
          <div class="scrollX" v-if="isLunch || index == 0">
            <div class="team-group-member" :class="computedClass(item.userTitle)" v-for="(item,index) in value" :key="index">
              <div class="team-group-member-top" v-if="item.userTitle">{{ item.userTitle }}</div>
              <div class="team-group-member-bottom">{{ item.userName }}</div>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <van-empty image="search" description="暂无医生团队" />
      </div>
      <div class="title">
        <span class="title-text">健康管理</span>
      </div>
      <package-list :packageList="packageInfoVos" :packageShow="packageShow"></package-list>
    </div>
  </div>
</template>

<script>
import packageList from "./components/packageList.vue"
export default {
  components: {
    packageList
  },
  data() {
    return {
      swipeList: [],
      doctorTeamMap: {},
      packageInfoVos: [],
      isLunch: false,
      teamShow: true,
      packageShow: true
    };
  },
  created() {
    this.getDocDetail(this.$route.query.doctorId);
  },
  computed: {
    doctorTeamMapLength() {
      if(!this.doctorTeamMap) return 0
      return Object.keys(this.doctorTeamMap).length;
    }
  },
  methods: {
    getDocDetail(doctorId) {
      this.$apis.getAppointDoctorGroupDetail({ doctorId }).then((res) => {
        let { retData } = res;
        this.doctorTeamMap = retData.doctorTeamMap;
        this.packageInfoVos = retData.packageInfoVos;
        retData.packageInfoVos.forEach((i) => {
          if (i.previewUrl) this.swipeList.push(i.previewUrl);
        });
        // console.log(1231311,Object.keys(JSON.parse(JSON.stringify(retData.doctorTeamMap))).length)
        this.teamShow = Object.keys(JSON.parse(JSON.stringify(retData.doctorTeamMap))).length
        if(this.packageInfoVos.length) {
          this.packageShow = true
        }else {
          this.packageShow = false
        }
      });
    },
    computedClass(userTitle) {
      if (!userTitle) return "typePink";
      if (userTitle.includes("医师")) {
        return "typeBlue";
      } else if (userTitle.includes("管理")) {
        return "typeGreen";
      } else {
        return "typePink";
      }
    },
    lanuch() {
      this.isLunch = !this.isLunch
    }
  },
};
</script>

<style scoped lang="scss">
.groupDetail {
  &-content {
    // height: 70vh;
    overflow-y: scroll;
    padding: 0 12px;
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin: 18px 0 12px;
      height: 32px;
      min-height: 32px;
      line-height: 32px;
      &-text {
        color: #111111;
        line-height: 22px;
        font-size: 17px;
        font-weight: 600;
        display: inline-block;
        background-image: url("../../assets/images/home/line.png");
        background-repeat: no-repeat;
        background-position: 0 13px;
        background-size: contain;
        line-height: 13px;
        height: 22px;
      }
      &-coll {
        font-size: 12px;
        font-weight: normal;
        line-height: 22px;
        letter-spacing: 0px;
        color: #666666;
      }
    }
    .team {
      background: #FFFFFF;
      border-radius: 8px;
      padding: 1px 14px 19px 14px;
      &-group {
        &-name {
          font-size: 15px;
          font-weight: 500;
          line-height: 22px;
          height: 22px;
          min-height: 22px;
          letter-spacing: 0.2px;
          color: #111111;
          margin: 15px 0;
        }
        .scrollX {
          display: flex;
          overflow-x: scroll;
          scrollbar-width: none;
          -ms-overflow-style: none;
          &::-webkit-scrollbar {
            display: none;
          }
        }
        &-member {
          width: 23%;
          min-width: 23%;
          height: 43px;
          border-radius: 4px;
          margin-right: 8px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          &-top {
            text-align: center;
            font-size: 13px;
            font-weight: normal;
            line-height: 17px;
            letter-spacing: 0.18px;
            color: #111111;
          }
          &-bottom {
            text-align: center;
          }
        }
        .b0ttom {
          font-size: 14px;
          font-weight: 500;
          line-height: 17px;
          letter-spacing: 0.18px;
          font-variation-settings: "opsz" auto;
        }
        .typeBlue {
          border: 1px solid #0079fd;
          background: #E3F0FF;
          .team-group-member-bottom {
            @extend .b0ttom;
            color: #0079FD;
          }
        }
        .typeGreen {
          border: 1px solid #49ad77;
          background: #EDFDEE;
          .team-group-member-bottom {
            @extend .b0ttom;
            color: #008941;
          }
        }
        .typePink {
          border: 1px solid #ff9999;
          background: #FFF8FA;
          .team-group-member-bottom {
            @extend .b0ttom;
            color: #F3405E;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
.groupDetail {
  .my-swipe {
    height: 250px;
  }
  .my-swipe .van-swipe-item {
    display: flex;
    justify-content: center;
    height: 100%;
    img {
      height: 100%;
    }
  }
}
</style>