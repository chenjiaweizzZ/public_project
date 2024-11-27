<template>
  <div class="featuredService">
    <van-tabs v-model="active" color="#00982D" title-active-color="#00982D" title-inactive-color="#111" :ellipsis="true">
      <div class="featuredService-title">
        <div class="featuredService-title__input" @click="goFeaturedSearch">
          <van-icon size="16" name="search" color="#B2B2B2" />
          <span class="text">请输入</span>
        </div>
      </div>
      <van-tab title="科室选择" name="1">
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
            <div class="body-select" @click="tapSelect" v-if="packageType != 1">
              <template v-if="fuGroupId == ''">
                <span class="body-select__text">全部</span><img class="body-select__img" src="@/assets/images/icon/dowm.png" alt="">
              </template>
              <template v-else>
                <span class="body-select__text body-select__active">{{ getGroupName() }}</span><img class="body-select__img" src="@/assets/images/icon/dowm2.png" alt="">
              </template>
            </div>
            <div class="body-listWrap">
              <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getListPackageInfo" class="body-list">
                <div class="item" v-for="item in packageList" :key="item.packageId" @click="goHealthControl(item.packageId, item.packageName)">
                  <img class="item-img" :src="item.previewUrl" alt="" />
                  <div class="item-info">
                    <div class="item-info__title">{{ item.packageName }}</div>
                    <div class="item-info__suggest" v-if="item.packageDiscription">
                      {{ item.packageDiscription }}
                    </div>
                    <div class="item-operate">
                      <div class="item-operate__price">
                        <span class="sign">¥</span><span>{{ item.floorPrice | unit }}</span><span class="text">起</span>
                      </div>
                    </div>
                  </div>
                </div>
              </van-list>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="团队选择" name="2">
        <!-- <doc-select></doc-select> -->
         <team-select></team-select>
      </van-tab>
    </van-tabs>
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
import teamSelect from "./components/teamSelect.vue"
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
    teamSelect
  },
  computed: {
    ...mapState("tabs", ["featuredServiceTab","featuredServiceCurrentIndex"]),
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
    };
  },
  mounted() {
    this.active = this.featuredServiceTab
    this.setFeaturedServiceTab("1")
    this.packageType = parseInt(this.$route.query.packageType);
    switch (this.packageType) {
      case 1:
        document.title = "健康管理";
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
    ...mapMutations("tabs",["setFeaturedServiceTab","setFeaturedServiceCurrentIndex"]),
    //获取咨询科室
    async selectAllPackageDept() {
      let { retData } = await this.$apis.selectAllPackageDept({});
      this.classList = retData;
      if (retData && retData.length > 0) {
        this.currentClassIndex = this.featuredServiceCurrentIndex ? this.featuredServiceCurrentIndex : retData[0].serialNo;
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
        this.currentClassIndex = this.featuredServiceCurrentIndex ? this.featuredServiceCurrentIndex : retData.list[0].classId;
        this.finished = false;
        this.getFlupGroupList();
      }
    },
    //分类切换
    tabSwitch(val) {
      this.packageList = [];
      this.groupList = [];
      this.currentClassIndex = val;
      this.setFeaturedServiceCurrentIndex(val)
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
    async getListPackageInfo() {
      let params = {
        isOnline: 1,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        packageType: this.packageType,
      };
      if (this.packageType == 1) {
        params.deptId = this.currentClassIndex;
      } else {
        params.classId = this.currentClassIndex;
        params.fuGroupId = this.fuGroupId;
      }

      let { retData } = await this.$apis.getListPackageInfo(params);
      this.packageList.push(...retData.list);
      this.pageNo++;
      this.loading = false;
      if (retData.list.length != this.pageSize) {
        this.finished = true;
      } else {
        this.finished = false;
      }
    },
    //去健康管理
    goHealthControl(packageId, packageName) {
      this.$router.push({
        path: "/healthControl",
        query: {
          packageId,
          packageName,
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
      }else {
        this.$router.push({
          path: "/featureDocSearch",
        });
        this.setFeaturedServiceTab("2")
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
      this.setFeaturedServiceTab(name)
    }
  },
};
</script>
<style scoped lang="scss">
.featuredService {
  &-title {
    padding: 6px 14px;
    background-color: #fff;
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
    height: calc(100vh - 88px);
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
        width: 100%;
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
        &::before {
          content: "";
          position: absolute;
          left: 12px;
          top: 0;
          z-index: 1;
          height: 1px;
          width: 100%;
          background: rgba(255, 255, 255, 0.01);
          box-shadow: inset 0px 0.5px 0px 0px #e2e2e2;
        }
        &:active {
          background-color: #eee;
        }
        width: 100%;
        padding: 14px 0;
        display: flex;
        align-items: center;
        position: relative;
        overflow: hidden;
        &-img {
          width: 80px;
          height: 80px;
          border-radius: 4px;
          object-fit: cover;
          margin-left: 12px;
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