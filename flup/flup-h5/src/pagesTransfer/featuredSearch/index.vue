<template>
  <div class="featuredSearch">
    <div class="featuredSearch-title">
      <div @click.stop.prevent="inputPaentClick('field')" style="flex:1;">
        <van-field
          class="featuredSearch-title__search"
          left-icon="search"
          clearable
          v-model="text"
          placeholder="请输入"
          ref="field"
          @click-left-icon="changeInput"
          @input="changeInput"
        />
      </div>
      <span class="featuredSearch-title__text" @click="backspace">取消</span>
    </div>
    <div class="body-listWrap">
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="getListPackageInfo"
        class="body-list"
        :immediate-check="false"
      >
        <div class="item" v-for="item in packageList" :key="item.packageId" @click="goHealthControl(item.packageId, item.packageName)">
          <img class="item-img" :src="item.previewUrl" alt="" />
          <div class="item-info">
            <div class="item-info__title">
              {{ item.packageName }}
            </div>
            <div class="item-info__suggest" v-if="item.packageDiscription">
              {{ item.packageDiscription }}
            </div>
            <div class="item-operate">
              <div class="item-operate__price">
                <span class="sign">¥</span><span>{{ item.floorPrice | unit}}</span
                ><span class="text">起</span>
              </div>
              <img
                class="item-operate__img"
                src="@/assets/images/home/you.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </van-list>
    </div>
  </div>
</template>
<script>
import utils from "@/utils/utils";
export default {
  filters: {
    unit(val) {
      if (!val) {
        return "0.00";
      }
      return val / 100;
    },
  },
  data() {
    return {
      text: "", //搜索值
      packageList: [],
      loading: false,
      finished: false,
      pageNo: 1,
      pageSize: 10,
      packageType:1,
    };
  },
  mounted(){
    this.packageType = parseInt(this.$route.query.packageType);
    switch(this.packageType){
      case 1:
        document.title = '健康管理';
        break;
      case 2:
        document.title = '健康管理';
        break;
      default:
        document.title = '';
    }
  },
  methods: {
    changeInput: utils.debounce(function () {
      this.pageNo = 1;
      this.packageList = [];
      this.getListPackageInfo();
    }, 500),
    //获取服务包列表
    async getListPackageInfo() {
      let params = {
        isOnline: 1,
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        classId: "",
        keyWord: this.text,
        packageType:this.packageType
      };
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
    //获取输入框焦点
    inputPaentClick(refName) {
      this.$nextTick(() => {
        this.$refs[refName] && this.$refs[refName].focus();
      });
    },
    //去健康管理
    goHealthControl(packageId, packageName){
      this.$router.push({
        path:'/healthControl',
          query:{
            packageId,
            packageName
        }
      })
    },
    //取消
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
<style lang="scss" scoped>
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
  .body-listWrap {
    height: calc(100vh - 54px);
    //   flex: 1;
    width: 100%;
    overflow-y: auto;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    // .body-list {
    //   padding-left: 14px;
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
      &:active{
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
        margin-left:12px;
      }
      &-info {
        flex: 1;
        height: 100%;
        margin-left: 9px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &__title {
          padding-right: 20px;
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
          padding-right: 20px;
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
          &__img {
            width: 14px;
            height: 14px;
            margin-right: 14px;
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
</style>