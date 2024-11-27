<template>
  <div class="manage">
    <div class="manage-goods" v-if="packageShow">
      <div class="item" v-for="item in packageList" :key="item.packageId" @click="goHealthControl(item.packageId, item.packageName)">
        <img class="item-img" :src="item.previewUrl ? item.previewUrl : defaultAvator" alt="">
        <div class="item-info">
          <div class="item-info__title">{{ item.packageName }}</div>
          <div class="item-info__suggest" v-if="item.packageDiscription">{{ item.packageDiscription }}</div>
          <div class="item-operate">
            <div class="item-operate__price">
              <span class="sign">¥</span><span>{{ item.floorPrice | unit }}</span><span class="text">起</span>
            </div>
            <img class="item-operate__img" src="@/assets/images/home/you.png" alt="">
          </div>
        </div>
      </div>
    </div>
    <div class="manage-emty" v-else>
      <img class="manage-emty__img" src="@/assets/images/bgNot.png" alt="">
      <span class="manage-emty__text">暂无服务内容</span>
    </div>
  </div>
</template>

<script>
import health from "@/assets/images/home/introduce.png";
export default {
  
  props: {
    packageList: {
      type: Array,
      default: [],
    },
    packageShow: {
      type: Boolean,
      default: true
    }
  },
  filters: {
    unit(val) {
      if (!val) {
        return "0.00";
      }
      return val / 100;
    },
  },
  computed: {
    defaultAvator() {
      return health;
    },
  },
  methods: {
    goHealthControl(packageId, packageName) {
      this.$router.push({
        path: "/healthControl",
        query: {
          packageId,
          packageName,
        },
      });
    },
  },
};
</script>

<style scoped lang="scss">
.manage {
  // margin-top: 13px;
  &-tab {
    display: flex;
    align-items: center;
    &__listWrap {
      flex: 1;
      height: 22px;
      overflow: hidden;
      position: relative;
    }
    &__list {
      &::-webkit-scrollbar {
        display: none;
      }
      overflow-x: auto;
      overflow-y: hidden;
      height: 100%;
      display: flex;
      user-select: none;
      .item {
        position: relative;
        padding: 4px 12px;
        display: flex;
        background: #ffffff;
        border-radius: 4px;
        color: #111111;
        font-size: 14px;
        line-height: 14px;
        // flex-shrink: 1;
        // flex: 0 0 22%;
        flex-shrink: 0;
      }
      .item + .item {
        margin-left: 8px;
      }
    }
    &__img {
      height: 100%;
      width: 20px;
      display: flex;
      justify-content: flex-end;
      img {
        width: 14px;
        height: 10px;
      }
    }
    .active {
      color: #00982d;
      background: #c9f6e2;
      font-weight: 600;
    }
  }
  &-goods {
    // margin: 12px 0 0;
    overflow: hidden;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .item {
      &:active {
        background-color: #eee;
      }
      &::after {
        content: "";
        position: absolute;
        left: 10px;
        top: 0;
        z-index: 1;
        height: 1px;
        width: 100%;
        background: rgba(255, 255, 255, 0.01);
        box-shadow: inset 0px 0.5px 0px 0px #e2e2e2;
      }
      background-color: #fff;
      padding: 14px 0 14px 10px;
      display: flex;
      align-items: center;
      position: relative;
      &-img {
        width: 80px;
        height: 80px;
        border-radius: 4px;
        object-fit: cover;
      }
      &-info {
        flex: 1;
        height: 100%;
        margin-left: 9px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &__title {
          padding-right: 22px;
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
          padding-right: 22px;
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
            margin-right: 8px;
          }
        }
      }
    }
    .item:first-child {
      &::after {
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        z-index: 1;
        height: 0px;
        width: 100%;
        background: #fff;
      }
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
    .item:last-child {
      border-bottom-left-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }
  &-emty {
    text-align: center;
    color: #999;
    margin-top: 12px;
    display: flex;
    align-items: center;
    flex-direction: column;
    &__img {
      width: 280px;
      height: 138px;
    }
    &__text {
      font-size: 17px;
      font-weight: normal;
      text-align: center;
      color: #6b8c75;
    }
  }
}
</style>