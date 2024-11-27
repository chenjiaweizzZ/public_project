<template>
  <div class="manageTeam">
    <van-search v-model="value" shape="round" background="#F3F7F5" placeholder="请输入查询的内容" input-align="center" clearable @input="searchInput" />
    <!-- <div class="manageTeam-list">
      <div class="manageTeam-list-item" v-for="(item,index) in teamList" :key="index" @click="toDetail(item.serialNo)">
        <div class="item-head">
          <img :src="item.introduceUrl ? item.introduceUrl : defaultIntroduce">
        </div>
        <div class="item-title">
          <div class="item-title-name">{{ item.groupName }}</div>
        </div>
        <div class="item-desc">
          <div class="item-desc-introduce">{{ item.groupIntroduce }}</div>
          <img src="@/assets/images/home/you.png">
        </div>
      </div>
    </div> -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad()" class="manageTeam-l1st">
      <div class="manageTeam-l1st-item" v-for="(item,index) in teamList" :key="index" @click="toDetail(item.serialNo)">
        <div class="item-head"><img :src="item.introduceUrl ? item.introduceUrl : defaultIntroduce"></div>
        <div class="item-title">
          <div class="item-title-top">
            {{ item.groupName }}
          </div>
          <div class="item-title-bottom">
            {{ item.groupIntroduce }}
          </div>
        </div>
        <div class="item-you"><img src="@/assets/images/home/you.png"></div>
      </div>
    </van-list>
  </div>
</template>

<script>
import health from "@/assets/images/home/introduce.png";
export default {
  data() {
    return {
      value: "",
      teamList: [],
      timer: null,
      loading: false,
      finished: false,
      pageSize: 5,
      pageNo: 0
    };
  },
  computed: {
    defaultIntroduce() {
      return health;
    },
  },
  methods: {
    getDocList(teamName = '') {
      this.pageNo = 1
      let { pageSize, pageNo } = this
      this.$apis
        .getHomeDoctorTeamList({ teamName, pageSize, pageNo })
        .then((res) => {
          this.teamList = res.retData.list || [];
          if(res.retData.list && res.retData.list.length < pageSize) {
            this.finished = true
          }
          this.loading = false
         });
    },
    searchInput(value) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.finished = false
        this.getDocList(value);
      }, 500);
    },
    onLoad() {
      this.pageNo += 1
      let { value, pageSize, pageNo } = this
      this.$apis
        .getHomeDoctorTeamList({ teamName: value, pageSize, pageNo })
        .then((res) => {
          this.teamList.push(...res.retData.list)
          if(res.retData.list.length < pageSize) {
            this.finished = true
          }
          this.loading = false
         });
    },
    toDetail(groupId) {
      this.$router.push({
        path: "/teamDetail",
        query: { groupId },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.manageTeam {
  &-l1st {
    border-radius: 8px;
    background: #fff;
    padding: 0 10px;
    &-item {
      display: flex;
      // align-items: center;
      padding: 12px 0px 15px;
      .item-head {
        width: 80px;
        height: 80px;
        img {
          width: 100%;
          height: 100%;
        }
      }
      .item-title {
        flex: 1;
        display: flex;
        flex-direction: column;
        margin: 5px 10px 0;
        &-top {
          font-size: 15px;
          font-weight: 500;
          line-height: 22px;
          letter-spacing: 0.2px;
          color: #111111;
        }
        &-bottom {
          font-size: 12px;
          font-weight: normal;
          letter-spacing: 0.2px;
          color: #666666;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .item-you {
        height: 14px;
        width: 14px;
        line-height: 80px;
        img {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
  &-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    &-item {
      width: 45vw;
      background-color: #fff;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 1vw 10px;
      border-radius: 8px;
      box-shadow: 0px 2px 6px 0px rgba(103, 158, 133, 0.2);
      .item-head {
        width: 40vw;
        height: 40vw;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-top: 10px;
        img {
          width: 100%;
        }
      }
      .item-title {
        display: flex;
        width: 100%;
        padding-left: 3vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: 15px;
        font-weight: 500;
        line-height: 22px;
        letter-spacing: 0.2px;
        color: #111111;
        &-name {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .item-desc {
        display: flex;
        align-items: center;
        width: 100%;
        padding: 5px 10px 10px;
        font-size: 12px;
        font-weight: 500;
        line-height: 22px;
        letter-spacing: 0.2px;
        color: #666666;
        &-introduce {
          flex: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        img {
          height: 14px;
          width: 14px;
        }
      }
    }
  }
}
</style>

<style lang="scss">
.manageTeam {
  .van-search {
    position: sticky;
    top: 125px;
  }
  .van-search__content {
    border-radius: 20px;
    background-color: #fff;
  }
  .van-field__control {
    text-indent: -50px;
  }
}
</style>


