<template>
  <div class="feed-container">
    <div v-if="feedbackInfo">
      <div class="feedback-content" v-if="feedbackInfo.feedbackContents">
        <div class="feedback-content-left">回复</div>
        <div class="feedback-content-right">{{ feedbackInfo.feedbackTime }}</div>
      </div>
      <div class="bOr"></div>
      <div class="feedback-advice" v-if="feedbackInfo.feedbackContents">
        {{ feedbackInfo.feedbackContents }}
      </div>
      <div class="feedback-sat">
        <div class="feedback-sat-left">满意度</div>
        <div class="feedback-sat-right">
          <van-rate v-model="feedbackInfo.satisfactionValue" :size="25" void-icon="star" void-color="#eee" readonly />
          <span class="feedback-sat-right-text">{{ getRateText(feedbackInfo.satisfactionValue) }}</span>
        </div>
      </div>
      <div class="feedback-content" v-if="feedbackInfo.advice">
        <div class="feedback-content-left">反馈与建议</div>
        <div class="feedback-content-right">{{ feedbackInfo.createTime }}</div>
      </div>
      <div class="bOr"></div>
      <div class="feedback-advice marB10" v-if="feedbackInfo.advice">
          {{ feedbackInfo.advice }}
      </div>
      <div class="feedback-content" v-if="imageList.length > 0">
        <div class="feedback-content-left">图片信息</div>
      </div>
      <div class="bOr" v-if="imageList.length > 0"></div>
      <div class="img-box" v-if="imageList.length > 0">
        <img v-for="(item, index) in imageList" :src="item" :key="index" @click="viewImg(index)">
      </div>
      <div class="feedback-content" v-if="feedbackInfo.orderDetail">
        <div class="feedback-content-left">订单信息</div>
      </div>
      <div class="bOr"></div>
      <div class="orderList-list__item" v-if="feedbackInfo.orderDetail">
        <div class="title">
          <div class="title-left">
            <img class="title-left__img" src="@/assets/images/icon/hospital.png" alt="">
            <span class="title-left__text">{{ feedbackInfo.orderDetail.sourceName }}</span>
          </div>
          <div class="title-right" :class="{ 'gray': feedbackInfo.orderDetail.flowStatus == '1' || feedbackInfo.orderDetail.flowStatus == '2' || feedbackInfo.orderDetail.flowStatus == '3' || feedbackInfo.orderDetail.flowStatus == '5' || feedbackInfo.orderDetail.flowStatus == '6' || feedbackInfo.orderDetail.flowStatus == '7' }">
            <span v-if="feedbackInfo.orderDetail.flowStatus == '0'">待支付</span>
            <span v-else-if="feedbackInfo.orderDetail.flowStatus == '1'">待发货</span>
            <span v-else-if="feedbackInfo.orderDetail.flowStatus == '2'">待收货</span>
            <span v-else-if="feedbackInfo.orderDetail.flowStatus == '3'">待核销</span>
            <span v-else-if="feedbackInfo.orderDetail.flowStatus == '4' || feedbackInfo.orderDetail.flowStatus == '11'">退款中</span>
            <span v-else-if="feedbackInfo.orderDetail.flowStatus == '5'">完成</span>
            <span v-else-if="feedbackInfo.orderDetail.flowStatus == '6'">已取消</span>
            <span v-else-if="feedbackInfo.orderDetail.flowStatus == '7'">已退款</span>
            <span v-else-if="feedbackInfo.orderDetail.flowStatus == '8'">退款失败</span>
          </div>
        </div>
        <div class="info">
          <img class="info-img" :src="feedbackInfo.orderDetail.previewUrl" alt="">
          <div class="info-right">
            <div class="designation">
              <div class="designation-text">{{ feedbackInfo.orderDetail.packageName }}</div>
              <div class="designation-money">￥ {{ feedbackInfo.orderDetail.specPrice | unit }}
              </div>
            </div>
            <div class="suggest">
              <div class="suggest-left">
                <span>{{ feedbackInfo.orderDetail.packageDiscription }}</span>
              </div>
              <div class="suggest-right">x {{ feedbackInfo.orderDetail.specName }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div class="cent3r margTop144">
        <img src="@/assets/images/bgNot.png">
      </div>
      <div class="cent3r">
        暂无记录
      </div>
    </div>
  </div>
</template>

<script>
import { ImagePreview } from "vant";
export default {
  props: {
    feedbackInfo: Object,
    imageList: Array,
  },
  filters: {
    unit(val) {
      if (!val) {
        return "0.00";
      }
      return (val / 100).toFixed(2);
    },
  },
  methods: {
    getRateText(rate) {
      switch (rate) {
        case 1:
          return "非常不满意";
        case 2:
          return "不满意";
        case 3:
          return "一般";
        case 4:
          return "满意";
        case 5:
          return "非常满意";
        default:
          return "未评分";
      }
    },
    viewImg(index) {
      ImagePreview({
        images: this.imageList,
        startPosition: index,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.cent3r {
  display: flex;
  justify-content: center;
  font-size: 17px;
  font-weight: normal;
  line-height: 20px;
  text-align: center;
  letter-spacing: 0px;
  color: #6b8c75;
}
.margTop144 {
  margin-top: 144px;
}
.feedback {
  &-line {
    display: flex;
  }

  &-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    font-weight: normal;
    line-height: 46px;
    height: 46px;
    letter-spacing: 0.2px;
    color: #333333;
    background: #ffffff;
    padding: 0px 14px;
    &-left {
      font-size: 16px;
      font-weight: 500;
      line-height: 19px;
      letter-spacing: 0.2px;
      color: #333333;
    }
    &-right {
      font-size: 14px;
      font-weight: normal;
      line-height: 19px;
      text-align: right;
      letter-spacing: 0.2px;
      color: #333333;
    }
  }

  &-advice {
    // margin: 12px 12px 0px;
    padding: 12px 14px;
    // box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
    background: #ffffff;
    font-size: 16px;
    font-weight: normal;
    line-height: 24px;
    letter-spacing: 0.2px;
    color: #111111;
    word-break: break-all
  }

  &-sat {
    display: flex;
    height: 54px;
    line-height: 54px;
    background: #ffffff;
    font-size: 16px;
    align-items: center;
    padding: 12px 14px;
    justify-content: space-between;
    margin: 10px 0 10px;
    &-left {
      font-size: 16px;
      font-weight: 500;
      line-height: 19px;
      letter-spacing: 0.2px;
      color: #333333;
    }
    &-right {
      line-height: 54px;
      height: 54px;
      &-text {
        font-size: 14px;
        font-weight: 500;
        line-height: 19px;
        letter-spacing: 0.2px;
        color: #999999;
        margin-left: 20px;
      }
    }
  }

  .marB10 {
    margin-bottom: 10px;
  }

  .mmg {
    margin: 56px 0px 0px;
  }

  .bOr {
    background: rgba(255, 255, 255, 0.01);
    box-shadow: inset 0px 0.5px 0px 0px #e2e2e2;
    height: 1px;
  }

  .img-box {
    background: #ffffff;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-around;
    padding-top: 12px;
    margin-bottom: 10px;
    img {
      width: 33vw;
      height: 33vw;
      // margin-right: 1vw;
      margin-bottom: 1vw;
    }
  }

  // img {
  //     width: 30vw;
  //     height: 30vw;
  // }

  .feed-container {
    // margin-top: 44px;
    padding-bottom: 60px;
  }

  &-list {
    margin: 12px 12px 0px;
    padding: 0 0 10px 10px;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
    background: #ffffff;

    // height: 60px;
    &-time {
      height: 30px;
      line-height: 30px;
      font-size: 14px;
      font-weight: normal;
      letter-spacing: 0.2px;
      color: #999999;
    }

    &-advice {
      font-size: 15px;
      font-weight: normal;
      line-height: 19px;
      letter-spacing: 0.2px;
      color: #111111;
    }
  }


  .orderList-list__item {
    padding: 7px 12px 14px;
    // border-radius: 8px;
    background: #ffffff;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
    // margin: 0 10px;

    .title {
      display: flex;

      &-left {
        flex: 1;
        display: flex;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;

        &__img {
          width: 14px;
          height: 14px;
        }

        &__text {
          flex: 1;
          margin: 0 6px;
          font-size: 12px;
          font-weight: normal;
          line-height: 22px;
          color: #111111;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      &-right {
        font-size: 15px;
        font-weight: 600;
        line-height: 22px;
        color: #dc8f13;
        display: flex;
        align-items: center;

        &__time {
          font-size: 15px;
          line-height: 22px;
          margin-right: 6px;
          color: #dc8f13;
        }
      }

      .gray {
        color: #999999;
      }
    }

    .info {
      margin-top: 13px;
      display: flex;

      &-img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        margin-right: 10px;
      }

      &-right {
        // flex:1;
        width:68vw;

        .designation {
          margin-top: 4px;
          display: flex;
          align-items: center;
          font-weight: 600;
          line-height: 22px;
          color: #111111;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;

          &-text {
            flex: 1;
            font-size: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 6px;
          }

          &-money {
            flex-shrink: 0;
            font-size: 14px;
          }
        }

        .suggest {
          width: 100%;
          color: #666666;
          display: flex;
          margin-top: 9px;

          &-left {
            flex: 1;
            font-size: 15px;
            margin-right: 6px;

            span {
              font-size: 12px;
              line-height: 16px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 3;
              -webkit-box-orient: vertical;
              word-break: break-all;
            }
          }

          &-right {
            max-width: 100px;
            flex-shrink: 0;
            font-size: 12px;
            font-weight: normal;
            line-height: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            word-break: break-all;
          }
        }
      }
    }

    .operate {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 9px;

      &-left {
        font-weight: 600;
        display: flex;
        align-items: flex-end;

        &__text {
          font-size: 12px;
          color: #111111;
          margin-right: 5px;
          line-height: 16px;
        }

        &__num {
          display: flex;
          align-items: baseline;
          font-size: 18px;
          color: #ff5500;

          .text {
            font-size: 14px;
            line-height: 14px;
            margin-right: 2px;
          }

          span {
            line-height: 18px;
            vertical-align: bottom;
          }
        }
      }

      &-btns {
        display: flex;
        align-items: center;

        .btn {
          padding: 4px 12px;
          font-size: 14px;
          font-weight: normal;
          line-height: 18px;
          color: #333333;
          border: 1px solid #bebebe;
          border-radius: 13px;

          &:active {
            opacity: 0.8;
          }
        }

        .orange {
          border-color: #ff5500;
          color: #ff5500;
        }

        .btn + .btn {
          margin-left: 9px;
        }
      }

      &-btns-toright {
        margin-left: auto;
      }

      &-img {
        width: 20px;
        height: 20px;
      }

      &-spot {
        position: relative;

        &::before {
          content: "";
          position: absolute;
          right: 0px;
          top: 0px;
          z-index: 10;
          width: 6px;
          height: 6px;
          background-color: #f00;
          border-radius: 50%;
        }
      }

      .left-10px {
        margin-left: 10px;
      }
    }
  }
}
</style>

<style lang="scss">
.feedback {
  .van-tab--active {
    color: rgb(0, 152, 45);
  }

  .van-tabs__line {
    background-color: rgb(0, 152, 45);
  }

  .van-button {
    height: 44px;
  }

  .van-tabs__wrap {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
  }
  .van-rate__icon--full {
      color: transparent;
      background: linear-gradient(164deg, #FFD55F 27%, #FE8C00 94%);
      -webkit-background-clip: text;
      background-clip: text;
  }
}
</style>
