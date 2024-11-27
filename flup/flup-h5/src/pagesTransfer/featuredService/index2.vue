<template>
  <div class="featuredService">
    <div class="featuredService-title">
      <!-- <div class="featuredService-title__input" @click="goFeaturedSearch">
        <van-icon size="16" name="search" color="#B2B2B2" />
        <span class="text">请输入</span>
      </div> -->
      <van-search v-model="search" placeholder="请输入搜索关键词" input-align="center" shape="round" clearable @input="searchInput" />
    </div>
    <div class="featuredService-body">
      <div class="body-sidebar">
        <template v-if="packageType == 1">
          <div class="body-sidebar__item" :class="{ active: currentClassIndex == item.serialNo }" v-for="item in classList" :key="item.serialNo" @click="tabSwitch(item.serialNo)">
            {{ item.deptName }}
          </div>
        </template>
        <template v-else>
          <div class="body-sidebar__item" :class="{ active: currentClassIndex == item.classId }" v-for="item in classList" :key="item.classId" @click="tabSwitch(item.classId)">
            {{ item.className }}
          </div>
        </template>
      </div>
      <div class="body-right">
        <div class="body-listWrap">
          <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getListPackageInfo" class="body-list">
            <div class="item" v-for="item in packageList" :key="item.packageId" @click="goHealthControl(item)">
              <div class="item-line1">
                <img :src="item.url">
                <div class="item-line1-title">
                  <div class="item-line1-title-name">{{ item.doctorName }}</div>
                  <div class="item-line1-title-position">{{ item.title }}</div>
                </div>
              </div>
              <div class="item-line2">
                擅长: {{ item.excel ? item.excel : "暂无" }}
              </div>
            </div>
          </van-list>
        </div>
      </div>
    </div>
    <van-popup v-model="showPicker" round position="bottom">
      <van-picker ref="picker" show-toolbar :columns="groupList" @cancel="showPicker = false" @confirm="onConfirm">
        <template v-slot:option="item"><span>{{ item.groupName }}</span></template>
      </van-picker>
    </van-popup>
  </div>
</template>
  <script>
import { mapState, mapMutations } from "vuex";
// import docSelect from "./components/docSelect.vue";
import teamSelect from "./components/teamSelect.vue";
export default {
  filters: {
    unit(val) {
      if (!val) {
        return "0.00";
      }
      return val / 100;
    },
  },
  components: {
    // docSelect,
    teamSelect,
  },
  computed: {
    ...mapState("tabs", ["featuredServiceTab", "featuredServiceCurrentIndex2"]),
  },
  data() {
    return {
      currentClassIndex: "",
      classList: [], //服务包分类接口
      packageList: [],
      loading: false,
      finished: true,
      pageNo: 1,
      pageSize: 10,
      packageType: 1, //1：健康咨询 2：健康服务
      showPicker: false,
      groupList: [],
      fuGroupId: "",
      active: "1",
      search: "",
      timer: null,
    };
  },
  mounted() {
    this.active = this.featuredServiceTab;
    this.setFeaturedServiceTab("1");
    this.packageType = parseInt(this.$route.query.packageType);
    switch (this.packageType) {
      case 1:
        document.title = "在线咨询";
        break;
      case 2:
        document.title = "健康管理";
        break;
      default:
        document.title = "";
    }
    if (this.packageType == 1) {
      this.selectAllPackageDept();
    } else {
      this.getClassList();
    }
  },
  methods: {
    ...mapMutations("tabs", [
      "setFeaturedServiceTab",
      "setFeaturedServiceCurrentIndex2",
    ]),
    //获取咨询科室
    async selectAllPackageDept() {
      let { retData } = await this.$apis.selectAllPackageDept({});
      this.classList = retData;
      if (retData && retData.length > 0) {
        this.currentClassIndex = this.featuredServiceCurrentIndex2
          ? this.featuredServiceCurrentIndex2
          : retData[0].serialNo;
        this.finished = false;
      }
    },
    //获取服务包分类
    async getClassList() {
      let { retData } = await this.$apis.getAllPackageClassList({
        mobileOnly: 1,
        pageNo: 1,
        pageSize: 9999,
      });
      this.classList = retData.list;
      if (retData.list && retData.list.length > 0) {
        this.currentClassIndex = retData.list[0].classId;
        this.finished = false;
        this.getFlupGroupList();
      }
    },
    //分类切换
    tabSwitch(val) {
      this.packageList = [];
      this.groupList = [];
      this.currentClassIndex = val;
      this.setFeaturedServiceCurrentIndex2(val);
      this.pageNo = 1;
      this.fuGroupId = "";
      if (this.packageType != 1) {
        this.getFlupGroupList();
      }
      this.getListPackageInfo();
    },
    //获取组
    async getFlupGroupList() {
      let { retData } = await this.$apis.getFlupGroupList({
        classId: this.currentClassIndex,
      });
      retData.unshift({ serialNo: "", groupName: "全部" });
      this.groupList = retData;
    },
    //获取服务包列表
    // async getListPackageInfo() {
    //   let params = {
    //     isOnline: 1,
    //     pageNo: this.pageNo,
    //     pageSize: this.pageSize,
    //     packageType: this.packageType,
    //   };
    //   if (this.packageType == 1) {
    //     params.deptId = this.currentClassIndex;
    //   } else {
    //     params.classId = this.currentClassIndex;
    //     params.fuGroupId = this.fuGroupId;
    //   }

    //   let { retData } = await this.$apis.getListPackageInfo(params);
    //   this.packageList.push(...retData.list);
    //   this.pageNo++;
    //   this.loading = false;
    //   if (retData.list.length != this.pageSize) {
    //     this.finished = true;
    //   } else {
    //     this.finished = false;
    //   }
    // },
    getListPackageInfo(doctorName = "") {
      let params = {
        deptId: this.currentClassIndex,
        doctorName,
        doctorId: ""
      };
      this.$apis.selectPackageDoctorsByDept(params).then((res) => {
        this.packageList = res.retData;
        this.loading = false;
        this.finished = true;
      });
    },
    searchInput(value) {
      clearTimeout(this.timer);
      this.timer = setTimeout(() => {
        this.getListPackageInfo(value);
      }, 500);
    },
    //去健康管理
    // goHealthControl(packageId, packageName) {
    //   this.$router.push({
    //     path: "/healthControl",
    //     query: {
    //       packageId,
    //       packageName,
    //     },
    //   });
    // },
    goHealthControl(item) {
      this.$router.push({
        path: "/doctorDetail",
        query: {
          doctorId: item.doctorId,
          deptId: this.currentClassIndex
        },
      });
    },
    //选择组
    tapSelect() {
      this.showPicker = true;
      this.$nextTick(() => {
        let idx = 0;
        idx = this.groupList.findIndex(
          (item) => item.serialNo == this.fuGroupId
        );
        this.$refs.picker.setColumnIndex(0, idx);
      });
    },
    getGroupName() {
      var item = this.groupList.find((item) => item.serialNo == this.fuGroupId);
      if (item) {
        return item.groupName;
      }
      return "";
    },
    //去搜索
    goFeaturedSearch() {
      if (this.active == "1") {
        this.$router.push({
          path: "/featuredSearch",
          query: {
            packageType: this.packageType,
          },
        });
      } else {
        this.$router.push({
          path: "/featureDocSearch",
        });
        this.setFeaturedServiceTab("2");
      }
    },
    onConfirm(value, index) {
      this.showPicker = false;
      if (value) {
        this.fuGroupId = value.serialNo;
        this.packageList = [];
        this.pageNo = 1;
        this.getListPackageInfo();
      }
    },
    onCancel() {
      this.showPicker = false;
    },
    tabChange(name) {
      this.setFeaturedServiceTab(name);
    },
  },
};
</script>
  <style scoped lang="scss">
.featuredService {
  width:100vw;
  height: 100vh;
  &-title {
    padding: 6px 14px;
    background-color: #fff;
    height: 66px;
    &__input {
      width: 100%;
      height: 32px;
      border-radius: 16px;
      background: #f6f6f6;
      display: flex;
      align-items: center;
      justify-content: center;
      .text {
        font-size: 14px;
        font-weight: normal;
        line-height: 17px;
        color: #b2b2b2;
        margin-left: 8px;
      }
    }
  }
  &-body {
    width: 100%;
    height: calc(100vh - 66px);
    background-color: #fff;
    display: flex;
    .body-sidebar {
      height: 100%;
      width: 120px;
      background: #f3f7f5;
      overflow-y: auto;
      overflow-x: hidden;
      flex-shrink: 0;
      &__item {
        padding: 0 5px 0 18px;
        height: 54px;
        font-size: 16px;
        font-weight: normal;
        line-height: 54px;
        color: #111111;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .active {
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          height: 100%;
          width: 4px;
          background: #32ae57;
        }
        font-weight: 600;
        color: #00982d;
        background-color: #fff;
        position: relative;
      }
    }
    .body-right {
      width: calc(100vw - 120px);
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      display: flex;
      flex-direction: column;
      .body-select {
        padding: 10px 14px 0;
        &__text {
          font-size: 15px;
          font-weight: normal;
          line-height: 18px;
          letter-spacing: 0.2px;
          color: #333333;
        }
        &__img {
          width: 10px;
          height: 10px;
          margin-left: 6px;
        }
        &__active {
          font-weight: 600;
          color: #00982d;
        }
      }
    }
    .body-listWrap {
      height: 100%;
      flex: 1;
      width: 100%;
      overflow-y: auto;
      // .body-list {
      //   padding-left: 12px;
      // }
      .item {
        height: 117px;
        padding: 12px 14px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        border-radius: 8px;
        border: 0.5px solid #e1e1e1;
        margin: 0px 8px 8px;
        // &::before {
        //   content: "";
        //   position: absolute;
        //   left: 12px;
        //   top: 0;
        //   z-index: 1;
        //   height: 1px;
        //   width: 100%;
        //   background: rgba(255, 255, 255, 0.01);
        //   box-shadow: inset 0px 0.5px 0px 0px #e1e1e1;
        // }
        // &:active {
        //   background-color: #eee;
        // }

        // &-img {
        //   width: 80px;
        //   height: 80px;
        //   border-radius: 4px;
        //   object-fit: cover;
        //   margin-left: 12px;
        // }
        &-line1 {
          display: flex;
          img {
            height: 52px;
            width: 52px;
            border-radius: 50%;
          }
          &-title {
            display: flex;
            flex-direction: column;
            margin-left: 20px;
            &-name {
              font-size: 18px;
              font-weight: 500;
              letter-spacing: 0.2px;
              color: #111111;
              margin-bottom: 5px;
            }
            &-position {
              font-size: 14px;
              font-weight: normal;
              letter-spacing: 0.17px;
              color: #111111;
            }
          }
        }
        &-line2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 12px;
          font-weight: normal;
          letter-spacing: 0.21px;
          color: #666666;
        }
        &-info {
          flex: 1;
          height: 100%;
          margin-left: 9px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &__title {
            padding-right: 8px;
            color: #111111;
            font-weight: 600;
            line-height: 22px;
            font-size: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          &__suggest {
            margin-top: 2px;
            padding-right: 8px;
            color: #666666;
            line-height: 22px;
            font-size: 12px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .item-operate {
            display: flex;
            align-items: center;
            margin-top: 4px;
            &__price {
              flex: 1;
              font-weight: 600;
              line-height: 22px;
              font-size: 18px;
              color: #ff5500;
              .sign {
                font-size: 14px;
                margin-right: 2px;
              }
              .text {
                font-size: 12px;
                color: #666666;
                margin-left: 4px;
              }
            }
          }
        }
      }
      .item:first-child {
        &::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          height: 0px;
          width: 100%;
          background: #fff;
        }
      }
    }
  }
}
</style>