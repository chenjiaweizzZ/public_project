<template>
  <div class="paymentCompleted" v-show="isStatus">
    <div class="paymentCompleted-title">
      <img class="paymentCompleted-title__img" src="@/assets/images/gou.png" alt=""><span>支付成功</span>
    </div>
    <div class="paymentCompleted-suggest">{{ sug }}</div>
    <div v-if="batch" class="paymentCompleted-batch">
      <div v-for="(item,index) in cartList" :key="index" class="paymentCompleted-batch-item">
        <div class="indeX">{{ index + 1 | arabicToChinese }}</div>
        <div class="iTem packageName">
          <span class="iTem-title">
            商品信息
          </span>
          <span class="iTem-text">
            {{ item.packageName }}
          </span>
        </div>
        <div class="iTem specName">
          <span class="iTem-title">
            商品规格
          </span>
          <span class="iTem-text">
            {{ item.specName }}
          </span>
        </div>
        <div class="iTem specPrice">
          <span class="iTem-title">
            商品价格
          </span>
          <span class="iTem-text2">
            {{ item.specPrice | unit }}元
          </span>
        </div>
        <div class="iTem specName">
          <span class="iTem-title">
            商品数量
          </span>
          <span class="iTem-text">
            {{ item.buyNumber }}
          </span>
        </div>
        <div class="van-hairline--top l1ne" v-if="index + 1 !== cartList.length"></div>
        <div class="l2ne" v-else></div>
      </div>
    </div>
    <div v-else>
      <!-- <div class="paymentCompleted-code">
            <div class="contain">
                <img class="contain-img" src="@/assets/images/wx.png" alt="">
                <div class="contain-text">
                    <span>请你长按识别二维码</span>
                    <div class="contain-text__consultWrap">添加健康管理师好友，或点击<div class="contain-text__consult" @click="seek">咨询</div></div>
                </div>
            </div>
        </div> -->
      <!-- <ul class="paymentCompleted-info">
        <li class="item">
          <div class="item-left">商品信息</div>
          <div class="item-right">{{ packageName }}</div>
        </li>
        <li class="item">
          <div class="item-left">商品规格</div>
          <div class="item-right">{{ specName }}</div>
        </li>
        <li class="item">
          <div class="item-left">商品价格</div>
          <div class="item-right">{{price | unit}}元</div>
        </li>
        <li class="item">
          <div class="item-left">就诊人</div>
          <div class="item-right">{{ patientName }}</div>
        </li>
      </ul> -->
      <div class="paymentCompleted-batch batch2">
        <div class="paymentCompleted-batch-item">
          <div class="iTem packageName">
            <span class="iTem-title">
              商品信息
            </span>
            <span class="iTem-text">
              {{ packageName }}
            </span>
          </div>
          <div class="iTem specName">
            <span class="iTem-title">
              商品规格
            </span>
            <span class="iTem-text">
              {{ specName }}
            </span>
          </div>
          <div class="iTem specPrice">
            <span class="iTem-title">
              商品价格
            </span>
            <span class="iTem-text2">
              {{ price | unit }}元
            </span>
          </div>
          <div class="iTem specName">
            <span class="iTem-title">
              就诊人
            </span>
            <span class="iTem-text">
              {{ patientName }}
            </span>
          </div>
          <!-- <div class="van-hairline--top l1ne" v-if="index + 1 !== cartList.length"></div>
          <div class="l2ne" v-else></div> -->
        </div>
      </div>
    </div>
    <div class="paymentCompleted-tip">
      <img src="@/assets/images/paymentTip.png" alt="">
    </div>
    <div class="paymentCompleted-btnWrap" :class="{ bottomFix: batch }">
      <div class="paymentCompleted-btnWrap__btn" @click="goHome">返回首页</div>
    </div>
  </div>
</template>
<script>
export default {
  filters: {
    unit(val) {
      if (!val) {
        return "0.00";
      }
      return val / 100;
    },
    arabicToChinese(num) {
      const chineseNums = [
        "零",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六",
        "七",
        "八",
        "九",
      ];
      const units = ["", "十", "百", "千", "万"];
      let result = "";
      let zeroFlag = false;
      for (let i = 0; num > 0; i++) {
        const digit = num % 10;
        num = Math.floor(num / 10);
        if (digit === 0) {
          if (
            !zeroFlag &&
            result &&
            result[result.length - 1] !== chineseNums[0]
          ) {
            result += chineseNums[0];
            zeroFlag = true;
          }
        } else {
          result = chineseNums[digit] + units[i] + result;
          zeroFlag = false;
        }
      }
      return `套餐${result}:`;
    },
  },
  data() {
    return {
      serialNo: "",
      outTradeNo: "",
      openId: "",
      specName: "", //服务包规格描述
      price: "", //单价
      patientName: "", //就诊人
      packageName: "", //名称
      packageDiscription: "", //商品信息
      isStatus: false,
      batch: false,
      cartList: [],
      sug: "",
    };
  },
  async created() {
    if (this.$route.query.serialNo) {
      let value = this.$route.query.serialNo.split("openId");
      this.serialNo = value[0];
      this.openId = value[1];
      localStorage.setItem("openId", this.openId);
      await this.getOrderInfo();
    }
    if (this.$route.query.outTradeNo) {
      let value = this.$route.query.outTradeNo.split("openId");
      this.outTradeNo = value[0];
      this.openId = value[1];
      localStorage.setItem("openId", this.openId);
      this.batch = true;
      this.getBatchPlayListInfo();
    }
  },
  mounted() {
    document.title = "完成";
  },
  methods: {
    async getOrderInfo() {
      let { retData } = await this.$apis.getOrderInfo({
        orderId: this.serialNo,
      });
      if (retData.flowStatus != 1 && retData.flowStatus != 3) {
        this.$router.replace("/payAbnormal");
        return false;
      }
      this.isStatus = true;
      this.$nextTick(() => {
        this.specName = retData.specName;
        this.price = retData.price;
        this.patientName = retData.patientName;
        this.packageName = retData.packageName;
        this.packageDiscription = retData.packageDiscription;
        this.sug = `你已购买「${packageName}」`;
      });
    },
    getBatchPlayListInfo() {
      this.$apis.getBatchPlayListInfo(this.outTradeNo).then((res) => {
        this.isStatus = true;
        this.batch = true;
        let arr = [];
        res.retData.shoppingCartList.forEach((i) => {
          i.shoppingCartList.forEach((j) => {
            arr.push(j);
          });
        });
        this.cartList = arr;
        this.sug = `你已购买「${arr[0].packageName}」等${arr.length}种方案`;
      });
    },
    goHome() {
      this.$router.replace("/home");
    },
    //咨询
    seek() {
      window.location.href =
        "https://work.weixin.qq.com/kfid/kfc75560626fc9b02d3";
    },
  },
};
</script>
<style lang="scss" scoped>
.paymentCompleted {
  height: 100%;
  width: 100%;
  background-color: #fff;
  position: relative;
  background-image: url("../../assets/images/bgaccomplish.png");
  background-repeat: no-repeat;
  background-size: 100%;
  padding-top: 28px;
  &-title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    font-weight: 600;
    color: #ffffff;
    &__img {
      width: 22px;
      height: 22px;
      margin-right: 11px;
    }
  }
  &-suggest {
    padding: 0 16px;
    text-align: center;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    color: #ffffff;
    margin-top: 15px;
  }
  &-code {
    display: flex;
    justify-content: center;
    .contain {
      margin-top: 8px;
      padding: 30px 60px 15px;
      border-radius: 20px;
      background: linear-gradient(0deg, #ffffff 88%, #e6ffee 100%);
      box-shadow: 0px 7px 9px 0px rgba(72, 138, 76, 0.28);
      &-img {
        width: 200px;
        height: 200px;
        object-fit: cover;
      }
      &-text {
        margin-top: 12px;
        color: #111111;
        font-size: 12px;
        font-weight: 600;
        line-height: 18px;
        text-align: center;
        &__consultWrap {
          display: flex;
          align-content: center;
        }
        &__consult {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 16px;
          border: 1px solid #32ae57;
          border-radius: 8px;
          margin-left: 4px;
          color: #32ae57;
        }
      }
    }
  }
  .batch2 {
    padding-bottom: 2px;
  }
  &-batch {
    background: linear-gradient(
      164deg,
      #ffffff 53%,
      rgba(255, 255, 255, 0.6) 100%
    );
    box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.03);
    border-radius: 8px;
    margin: 17px 12px;
    &-item {
      padding: 10px 16px 0;
      .indeX {
        height: 30px;
        font-size: 16px;
        font-weight: normal;
        line-height: 22px;
        letter-spacing: 0.2px;
        color: #111111;
      }
      .iTem {
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
        &-title {
          font-size: 16px;
          font-weight: normal;
          letter-spacing: 0.2px;
          color: #666666;
        }
        &-text {
          font-size: 16px;
          font-weight: 500;
          letter-spacing: 0.23px;
          color: #111111;
        }
        &-text2 {
          font-size: 18px;
          font-weight: 500;
          letter-spacing: 0.32px;
          color: #ff5500;
        }
        .batch-line {
          border: 1px dashed #d8d8d8;
          height: 1px;
        }
      }
      //   .specPrice {
      //     margin-bottom: 0px;
      //   }
    }
  }
  &-info {
    padding: 43px 16px 54px;
    .item {
      display: flex;
      align-items: flex-start;
      &-left {
        font-size: 16px;
        font-weight: normal;
        color: #666666;
        line-height: 16px;
      }
      &-right {
        flex: 1;
        font-size: 16px;
        font-weight: normal;
        text-align: right;
        color: #111111;
        line-height: 16px;
        margin-left: 10px;
        // overflow: hidden;
        // text-overflow: ellipsis;
        // white-space: nowrap;
      }
    }
    .item + .item {
      margin-top: 12px;
    }
  }
  &-tip {
    width: 100vw;
    padding: 0 10px;
    padding-bottom: 70px;
    img {
      width: 100%;
    }
  }
  &-btnWrap {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 16px 20px;
    &__btn {
      width: 343px;
      height: 42px;
      border-radius: 21px;
      background: #32ae57;
      font-size: 16px;
      font-weight: 600;
      color: #ffffff;
      text-align: center;
      line-height: 42px;
      &:active {
        opacity: 0.8;
      }
    }
  }
  .bottomFix {
    position: fixed;
    bottom: 0px;
    right: 0px;
    left: 0px;
  }
  .l2ne {
    height: 5px;
  }
}
</style>