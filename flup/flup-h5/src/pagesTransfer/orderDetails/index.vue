<template>
  <div class="orderDetails">
    <div
      class="orderDetails-contain orderDetails-bgOrange"
      :class="{
        'orderDetails-bgOrange': status == 0 || status == 4 || status == 11 || status == 12 || status == 13,
        'orderDetails-bgBlue': status == 1 || status == 2,
        'orderDetails-bgCyan': status == 5,
        'orderDetails-bgGray': status == 6 || status == 7 || status == 8,
        'orderDetails-bgGreen': status == 3,
      }"
    >
      <div class="orderDetails-contain__unpaid" v-if="status == 0">待支付</div>
      <div class="orderDetails-contain__unpaid" v-if="status == 1">待发货</div>
      <div class="orderDetails-contain__unpaid" v-if="status == 2">待收货</div>
      <div class="orderDetails-contain__unpaid" v-if="status == 3">待核销</div>
      <div class="orderDetails-contain__finish" v-if="status == 5">已完成</div>
      <div class="orderDetails-contain__finish" v-if="status == 12">咨询中</div>
      <div class="orderDetails-contain__finish" v-if="status == 13">待回复</div>
      <div
        class="orderDetails-contain__theRefund"
        v-if="status == 4 || status == 11"
      >
        <div class="title">退款中...</div>
        <div class="cause">取消原因：{{ platOrderRefundVo.refundReason }}</div>
      </div>
      <div class="orderDetails-contain__refund" v-if="status == 7">
        <div class="title">
          <img
            class="title-icon"
            src="@/assets/images/orderDetails/warn.png"
            alt=""
          />
          <span class="title-text">已退款</span>
        </div>
        <div class="cause">取消原因：{{ platOrderRefundVo.refundReason }}</div>
      </div>
      <div class="orderDetails-contain__refund" v-if="status == 8">
        <div class="title">
          <img
            class="title-icon"
            src="@/assets/images/orderDetails/warn.png"
            alt=""
          />
          <span class="title-text">退款失败</span>
        </div>
        <div class="cause">取消原因：{{ platOrderRefundVo.refundReason }}</div>
      </div>
      <div class="orderDetails-contain__refund" v-if="status == 6">
        <div class="title">
          <img
            class="title-icon"
            src="@/assets/images/orderDetails/warn.png"
            alt=""
          />
          <span class="title-text">已取消</span>
        </div>
        <div class="cause">取消原因：{{ failReason }}</div>
      </div>
      <!-- 退款进度 -->
      <div
        class="orderDetails-contain__schedule"
        v-if="status == 4 || status == 7 || status == 8 || status == 11"
      >
        <div class="icons">
          <img
            class="icons-icon"
            src="@/assets/images/orderDetails/gou.png"
            alt=""
          />
          <div class="icons-line"></div>
          <img
            class="icons-icon"
            src="@/assets/images/orderDetails/dot.png"
            alt=""
            v-if="status == 4 || status == 11"
          />
          <img
            class="icons-icon"
            src="@/assets/images/orderDetails/gou.png"
            alt=""
            v-else
          />
          <div class="icons-line"></div>
          <img
            v-if="status == 4 || status == 11"
            class="icons-icon"
            src="@/assets/images/orderDetails/gou2.png"
            alt=""
          />
          <img
            v-else-if="status == 8"
            class="icons-icon"
            src="@/assets/images/orderDetails/error.png"
            alt=""
          />
          <img
            v-else
            class="icons-icon"
            src="@/assets/images/orderDetails/gou.png"
            alt=""
          />
        </div>
        <div class="info">
          <div>申请退款</div>
          <div class="info-text">
            <div
              v-if="status == 4 || status == 11"
            >
              审核中
            </div>
            <div v-else>审核完成</div>
            <!-- <div class="info-text__time">23:12:23</div> -->
          </div>
          <div v-if="status == 8" style="color: #ff0202">退款失败</div>
          <div v-else>退款完成</div>
        </div>
      </div>    
      <!-- 收获地址 -->
      <div class="orderDetails-contain__address" v-if="platPayExpressVo && platPayExpressVo.district">
        <div class="address">{{ platPayExpressVo.district }}{{ platPayExpressVo.addresslocal }}</div>
        <div class="user">
          <span class="user-name">{{ platPayExpressVo.contactsName }}</span>
          <span class="user-phone">{{ platPayExpressVo.phone }}</span>
        </div>
      </div>
      <!-- 订单介绍 -->
      <div class="orderDetails-item">
        <div class="title">
          <div class="title-left">
            <img
              class="title-left__img"
              src="@/assets/images/icon/hospital.png"
              alt=""
            />
            <span class="title-left__text">{{ sourceName }}</span>
          </div>
        </div>
        <div class="info">
          <img class="info-img" :src="previewUrl ? previewUrl : defaultIntroduce" alt="" />
          <div class="info-right">
            <div class="designation">
              <div class="designation-text">{{ packageName }}</div>
              <div class="designation-money">￥ {{ price | unit }}</div>
            </div>
            <div class="suggest">
              <div class="suggest-left">
                <span>{{ packageDiscription }}</span>
              </div>
              <div class="suggest-right">x {{ specName }}</div>
            </div>
          </div>
        </div>
      </div>
      <!-- 待支付时间 -->
      <div class="orderDetails-contain__time" v-if="status == 0">
        <div class="text">
          剩余支付时间：<van-count-down
            class="text-countDown"
            :time="countDown"
            format="mm : ss"
            @finish="getOrderInfo"
          />
        </div>
        <div class="btn" @click="toPay">去支付</div>
      </div>
      <!-- 地址信息 -->
      <address-message
        v-if="(status == 4 || status == 11) && needExpress == 1"
        :platPayExpressVo="platPayExpressVo"
        :platOrderRefundVo="platOrderRefundVo"
        :serialNo="serialNo"
        @updateList="getOrderInfo"
      ></address-message>
      <!-- 二维码 -->
      <!-- <div class="orderDetails-code" v-if="status == 3">
        <div class="orderDetails-code__img">
          <qrcode :text="serialNo" v-if="serialNo"></qrcode>
        </div>
        <span class="orderDetails-code__text">{{ serialNo }}</span>
      </div> -->
      <!-- 已退款物流信息 -->
      <ul
        class="orderDetails-contain__info orderDetails-contain__pd"
        v-if="status == 7 && platOrderRefundVo && platOrderRefundVo.expressNo"
      >
        <li class="item">
          <span class="item-left">物流公司</span
          ><span class="item-right">{{
            platOrderRefundVo.expressCompanyName
          }}</span>
        </li>
        <li class="item">
          <span class="item-left">退款单号</span
          ><span class="item-right">{{ platOrderRefundVo.expressNo }}</span>
        </li>
      </ul>
      <!-- 退款金额和备注 -->
      <ul v-if="status == 7" class="orderDetails-contain__info orderDetails-contain__pd">
        <li class="item">
          <span class="item-left">退款金额</span
          ><span class="item-right"
            >{{ (reductionFee / 100).toFixed(2) }}元</span
          >
        </li>
        <li class="item">
          <span class="item-left">退款备注</span
          ><span class="item-right">{{ platOrderRefundVo.remark }}</span>
        </li>
      </ul>
      <!-- 商家回复 -->
      <ul
        class="orderDetails-contain__info orderDetails-contain__pd"
        v-if="status == 8 && platOrderRefundVo"
      >
        <li class="item">
          <span class="item-left">商家回复</span
          ><span class="item-right">{{ platOrderRefundVo.rejectReason }}</span>
        </li>
      </ul>
      <!-- 个人信息 -->
      <ul class="orderDetails-contain__info">
        <li class="item">
          <span class="item-left">就诊人</span
          ><span class="item-right">{{ patientName }}</span>
        </li>
        <li class="item">
          <span class="item-left">订单编号</span
          ><span class="item-right">{{ serialNo }}</span>
        </li>
        <li class="item">
          <span class="item-left">下单时间</span
          ><span class="item-right">{{ createTime }}</span>
        </li>
        <li class="item">
          <span class="item-left">支付方式</span
          ><span class="item-right">{{ payTypeName }}</span>
        </li>
        <li class="item" v-if="needExpress == 1">
          <span class="item-left">配送方式</span
          ><span class="item-right">快递</span>
        </li>
        <li class="item" v-if="needExpress == 1">
          <span class="item-left">订单备注</span
          ><span class="item-right" v-if="remark">{{ remark }}</span>
        </li>
        <!-- <li class="item">
            <span class="item-left">退款单号</span><span class="item-right">82374823794029</span>
        </li> -->
        <li class="item">
          <span class="item-left">实付款</span
          ><span class="item-right item-money"
            ><span class="text">¥</span>{{ fee | unit }}</span
          >
        </li>
      </ul>
      <div @click="viewEquity()" v-if="status !== '6' && status !== '0'">
        <equity :equityList="equityList" :padd="true"  :entry="true"></equity>
      </div>
    </div>
    <div class="orderDetails-floor">
      <!-- <div class="orderDetails-floor__left" @click="seek">
        <img class="img" src="@/assets/images/service.png" alt="" />
        <span class="text">客服</span>
      </div> -->
      <div class="orderDetails-floor__right">
        <div
          class="item"
          v-if="
            status == 7 ||
            status == 5 ||
            status == 4 ||
            status == 6 ||
            status == 11
          "
          @click="goHealthControl(packageId, packageName)"
        >
          重新购买
        </div>
        <div class="item" v-if="status == 0" @click="canceOrder">取消订单</div>
        <div
          class="item"
          v-if="status == 4 || status == 8 || status == 11"
          @click="cancelRefundment"
        >
          取消退款
        </div>
        <div
          class="item"
          :class="{ pd: status == 2 }"
          v-if="status == 1 || status == 2 || status == 3 || status == 5 || status == 12 || status == 13"
          @click="startRefundment"
        >
          发起退款
        </div>
        <div
          class="item"
          :class="{ pd: status == 2 }"
          v-if="status == 2"
          @click="openLogistics"
        >
          查看物流
        </div>
        <div
          class="item"
          :class="{ pd: status == 2 }"
          v-if="status == 1 || status == 2"
          @click="confirm"
        >
          确认收货
        </div>
      </div>
    </div>
    <van-popup
      class="orderDetails-refundment"
      v-model="isRefundment"
      position="bottom"
      @close="closeRefundment"
    >
      <div class="orderDetails-refundment__title">
        <span>发起退款</span>
        <div class="close" @click="closeRefundment">
          <img class="img" src="@/assets/images/icon/cross.png" alt="" />
        </div>
      </div>
      <div class="orderDetails-refundment__info">
        <div class="info">
          <div class="info-title">
            <span class="info-title__left">退款金额：</span>
            <div class="info-title__right">
              <span class="unit">¥</span
              ><span class="text">{{ fee | unit }}</span>
            </div>
          </div>
          <div class="info-explain">
            <!-- 退款发起后，48小时内商家未确定，将会自动为您进行退款所退的款项，将会在3-5个工作日内返回您支付的账号。 -->
            我们将会为您尽快处理，请耐心等待。如有疑问请联系您的个案管理师。
          </div>
          <equity :equityList="equityList"></equity>
          <div
            @click.stop.prevent="inputPaentClick('textarea')"
            style="height: 100%"
          >
            <van-field
              v-model.trim="refundmentMessage"
              type="textarea"
              ref="textarea"
              placeholder="请输入退款原因"
              class="info-message"
            />
          </div>
        </div>
      </div>
      <div class="orderDetails-refundment__btn">
        <div class="btn" @click="confirmRefundment">发起退款</div>
      </div>
    </van-popup>
    <checkLogistics
      v-if="status == 2"
      :show.sync="showLogistics"
      :platPayExpressVo="platPayExpressVo"
    ></checkLogistics>
  </div>
</template>
<script>
import introduce from "@/assets/images/home/introduce.png";
import { CountDown } from "vant";
import addressMessage from "./components/addressMessage.vue";
import qrcode from "../userManagement/components/qrcode.vue";
import checkLogistics from "./components/checkLogistics.vue";
import equity from "./components/equity.vue"
import { mapActions, mapState } from "vuex";
export default {
  components: {
    [CountDown.name]: CountDown,
    addressMessage,
    qrcode,
    checkLogistics,
    equity
  },
  filters: {
    unit(val) {
      if (!val) {
        return "0.00";
      }
      return (val / 100).toFixed(2);
    },
  },
  data() {
    return {
      orderId: "", //订单id
      status: 0, //0待支付 1待发货 2待收货 3待核销 4退款中 5已完成 7已退款 6已取消 8退款失败 9管理中 10 退款审核中
      sourceName: "", //渠道名称
      previewUrl: "",
      packageName: "",
      price: "",
      specName: "",
      packageDiscription: "", //描述
      fee: 0, //交易金额

      patientName: "", //就诊人
      serialNo: "", //订单编号
      createTime: "", //下单时间
      payTypeName: "", //支付方式
      remark: "", //订单备注
      failReason: "", //取消原因
      platOrderRefundVo: {}, //退款原因
      platPayExpressVo: {}, //地址
      countDown: 0, //待支付时间
      payUrl: "", //支付地址
      updateTime: "", //退款时间
      needExpress: 0, //是否需要配送

      packageId: "", //服务包id
      packageIsOnline: 0, //0未上架 1上架

      isRefundment: false, //是显示退款弹窗
      refundmentMessage: "", //退款信息

      showLogistics: false, //是否打开查看物流
      sourceId: "",
      reductionFee: "", // 退款金额
      equityList: []
    };
  },
  computed: {
    ...mapState("chat", ["isLogin"]),
    defaultIntroduce() {
      return introduce;
    },
  },
  mounted() {
    this.orderId = this.$route.query.serialNo;
    this.status = this.$route.query.flowStatus;
    this.getOrderInfo();
  },
  methods: {
    ...mapActions("chat", ["getImInfo", "loginChat"]),
    //获取输入框焦点
    inputPaentClick(refName) {
      this.$nextTick(() => {
        this.$refs[refName] && this.$refs[refName].focus();
      });
    },
    viewEquity() {
      this.$router.push({
        path: '/equityDetail',
        query: {
          serialNo: this.$route.query.serialNo
        }
      })
    },
    async getOrderInfo() {
      let { retData } = await this.$apis.getOrderInfo({
        orderId: this.orderId,
      });
      this.equityList = retData.platOrderVerifyItemsList
      this.sourceName = retData.sourceName;
      this.previewUrl = retData.previewUrl;
      this.packageName = retData.packageName;
      this.price = retData.price;
      this.specName = retData.specName;
      this.packageDiscription = retData.packageDiscription;
      this.patientName = retData.patientName;
      this.serialNo = retData.serialNo;
      this.createTime = retData.createTime;
      this.payTypeName = retData.payTypeName;
      this.remark = retData.remark;
      this.failReason = retData.failReason;
      this.platOrderRefundVo = retData.platOrderRefundVo
        ? retData.platOrderRefundVo
        : {};
      this.platPayExpressVo = retData.platPayExpressVo
        ? retData.platPayExpressVo
        : {};
      this.payUrl = retData.payUrl;
      this.fee = retData.fee;
      this.status = retData.flowStatus;
      this.updateTime = retData.updateTime;
      this.packageId = retData.packageId;
      this.packageIsOnline = retData.packageIsOnline;
      this.needExpress = retData.needExpress;
      this.sourceId = retData.sourceId;
      this.reductionFee = retData.reductionFee;
      if (this.status == 0 && retData.createTime) {
        let startTime = new Date(retData.createTime).getTime() + 900000;
        let endTime = Date.now();
        if (startTime >= endTime) {
          this.countDown = startTime - endTime;
        }
      }
    },
    //去健康管理
    goHealthControl(packageId, packageName) {
      if (this.packageIsOnline == 0) {
        this.$dialog
          .confirm({
            title: "提醒",
            message: "该商品已经下架，请选购其他商品!",
          })
          .then(async () => {
            this.$router.push({
              path: "/featuredService",
            });
          })
          .catch(() => {});
      } else {
        this.$router.push({
          path: "/healthControl",
          query: {
            packageId,
            packageName,
          },
        });
      }
    },
    //去支付
    toPay() {
      window.location.href = this.payUrl;
    },
    //取消订单
    canceOrder() {
      this.$dialog
        .confirm({
          title: "提醒",
          message: "是否取消订单?",
        })
        .then(async () => {
          let params = {
            orderId: this.serialNo,
            newStatus: 6,
            failReason: "患者取消",
          };
          await this.$apis.updateOrderStatus(params);
          this.getOrderInfo();
        })
        .catch(() => {});
    },
    //确认收货
    confirm() {
      this.$dialog
        .confirm({
          title: "提醒",
          message: "是否确认收货?",
        })
        .then(async () => {
          let params = {
            orderId: this.serialNo,
            newStatus: 5,
          };
          await this.$apis.updateOrderStatus(params);
          this.getOrderInfo();
        })
        .catch(() => {});
    },
    //咨询
    async seek() {
      // window.location.href = "https://work.weixin.qq.com/kfid/kfc75560626fc9b02d3";
      let { retData } = await this.getImInfo({
        orderSerialNo: this.orderId,
        hospitalId: this.sourceId,
      });
      // let imUrl = JSON.parse(retData.imUrl);
      let imData = await this.$apis.getIMData(retData.patientId)
      let imUrl = JSON.parse(imData.retData)
      if (imUrl) {
        let userId = imUrl.userId;
        let userSig = imUrl.userSig;
        let roomId = retData.roomId;
        localStorage.setItem("userId", retData.patientId);
        localStorage.setItem("userSig", userSig);
        localStorage.setItem("roomId", roomId);
        if (!this.isLogin) {
          await this.loginChat({ userID: userId, userSig: userSig });
        }
        this.$router.push({
          path: "/chat",
        });
      }
    },
    //取消退款
    cancelRefundment() {
      this.$dialog
        .confirm({
          message: "确认取消退款?",
        })
        .then(async () => {
          try {
            this.$toast.loading({
              duration: 0,
              forbidClick: true,
            });
            await this.$apis.refundDeal({
              serialNo: this.orderId,
              status: 0,
            });
            await this.getOrderInfo();
          } catch (e) {
            this.$toast(e);
          } finally {
            this.$toast.clear();
          }
        })
        .catch(() => {
          // on cancel
        });
    },
    //发起退款
    startRefundment() {
      this.isRefundment = true;
    },
    //关闭退款
    closeRefundment() {
      this.isRefundment = false;
      this.refundmentMessage = "";
    },
    //确认退款
    async confirmRefundment() {
      if (!this.refundmentMessage) {
        this.$toast("请输入退款原因");
        return false;
      }
      try {
        this.$toast.loading({
          duration: 0,
          forbidClick: true,
        });
        await this.$apis.refundDeal({
          serialNo: this.orderId,
          status: 1,
          reason: this.refundmentMessage,
        });
        this.closeRefundment();
        await this.getOrderInfo();
      } catch (e) {
        this.$toast(e);
      } finally {
        this.$toast.clear();
      }
    },
    //查看物流
    openLogistics() {
      this.showLogistics = true;
    },
  },
};
</script>
<style lang="scss">
.orderDetails {
  &-refundment {
    &__info {
      .info {
        &-message {
          padding: 0px;
          .van-field__body {
            height: 100%;
            .van-field__control {
              height: 100%;
              padding: 12px 14px;
              font-size: 16px;
              font-weight: normal;
              line-height: 19px;
              color: #111111;
              &::placeholder {
                font-size: 16px;
                font-weight: normal;
                line-height: 19px;
                color: #999999;
              }
            }
          }
        }
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.orderDetails {
  width: 100%;
  &-contain {
    height: calc(100vh - 60px);
    width: 100%;
    overflow-y: auto;
    background-color: #f3f7f5;
    padding: 0 12px;
    &__unpaid {
      font-size: 20px;
      font-weight: 600;
      line-height: 24px;
      color: #ffffff;
      margin-top: 16px;
    }
    &__finish {
      font-size: 20px;
      font-weight: 600;
      line-height: 24px;
      color: #333333;
      margin-top: 16px;
    }
    &__theRefund {
      margin-top: 16px;
      color: #ffffff;
      font-weight: normal;
      .title {
        font-size: 20px;
        font-weight: 600;
        line-height: 24px;
      }
      .cause {
        font-size: 13px;
        line-height: 22.5px;
        margin-top: 3px;
      }
    }
    &__address {
      padding: 14px 12px 14px;
      border-radius: 8px;
      background: #ffffff;
      margin: 12px 0;
      .address {
        font-size: 15px;
        font-weight: 550;
        line-height: 22px;
        letter-spacing: 0.2px;
        color: #111111;
      }
      .user {
        font-size: 14px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: 0.2px;
        color: #111111;
        margin-top: 8px;
      }
    }
    &__refund {
      margin-top: 16px;
      color: #333333;
      .title {
        display: flex;
        align-items: center;
        &-icon {
          width: 26px;
          height: 26px;
          margin-right: 6px;
        }
        &-text {
          font-size: 20px;
          font-weight: 600;
          line-height: 24px;
        }
      }
      .cause {
        font-size: 13px;
        line-height: 22.5px;
        margin-top: 3px;
      }
    }
    &__time {
      width: 100%;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      background-color: #fff;
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
      border-radius: 8px;
      margin-top: 12px;
      padding: 0 12px;
      .text {
        font-size: 16px;
        font-weight: 400;
        color: #111111;
        display: flex;
        align-items: center;
        &-countDown {
          font-weight: 600;
          font-size: 16px;
        }
      }
      .btn {
        padding: 3px 12px;
        background: linear-gradient(134deg, #ff9035 24%, #ff7b35 77%);
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
        text-align: center;
        color: #ffffff;
        border-radius: 13px;
      }
    }
    &__info {
      padding: 20px 12px 14px;
      border-radius: 8px;
      background: #ffffff;
      margin: 12px 0;
      .item {
        display: flex;
        align-items: flex-start;
        font-size: 14px;
        font-weight: normal;
        &-left {
          color: #666666;
        }
        &-right {
          flex: 1;
          text-align: right;
          color: #111111;
          margin-left: 10px;
        }
        &-money {
          font-size: 18px;
          font-weight: 600;
          color: #ff5500;
          .text {
            font-size: 14px;
            margin-right: 2px;
          }
        }
      }
      .item + .item {
        margin-top: 10px;
      }
    }
    &__pd {
      padding: 20px 12px;
    }
    &__schedule {
      width: 100%;
      // height: 80px;
      border-radius: 8px;
      background: #ffffff;
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
      margin-top: 11px;
      padding-bottom: 10px;
      .icons {
        padding-top: 12px;
        padding-left: 50px;
        display: flex;
        align-items: center;
        &-icon {
          width: 20px;
          height: 20px;
        }
        &-line {
          width: 80px;
          height: 2px;
          background: #32ae57;
          margin: 0 8px;
        }
      }
      .info {
        display: flex;
        justify-content: space-between;
        padding: 0 30px 0;
        font-size: 14px;
        font-weight: 600;
        line-height: 24px;
        color: #333333;
        margin-top: 4px;
        &-text {
          display: flex;
          flex-direction: column;
          align-items: center;
          &__time {
            font-size: 12px;
            font-weight: 600;
            line-height: 12px;
            color: #333333;
          }
        }
      }
    }
  }
  &-bgOrange {
    background-image: url("../../assets/images/orderDetails/bgOrange.png");
    background-repeat: no-repeat;
    background-size: 100%;
  }
  &-bgCyan {
    background-image: url("../../assets/images/orderDetails/bgCyan.png");
    background-repeat: no-repeat;
    background-size: 100%;
  }
  &-bgGray {
    background-image: url("../../assets/images/orderDetails/bgGray.png");
    background-repeat: no-repeat;
    background-size: 100%;
  }
  &-bgBlue {
    background-image: url("../../assets/images/orderDetails/bgBlue.png");
    background-repeat: no-repeat;
    background-size: 100%;
  }
  &-bgGreen {
    background-image: url("../../assets/images/orderDetails/bgGreen.png");
    background-repeat: no-repeat;
    background-size: 100%;
  }
  &-floor {
    height: 60px;
    width: 100%;
    background-color: #fff;
    padding: 7px 14px 0 20px;
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 100;
    display: flex;
    &__left {
      display: flex;
      align-items: center;
      height: 34px;
      .img {
        width: 17px;
        height: 17.5px;
      }
      .text {
        font-size: 12px;
        font-weight: 500;
        line-height: 12px;
        color: #00982d;
        margin-left: 8px;
      }
    }
    &__right {
      flex: 1px;
      height: 34px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .item {
        height: 100%;
        // padding: 0px 20px;
        width: 100px;
        font-size: 15px;
        font-weight: 500;
        text-align: center;
        color: #666666;
        border-radius: 17px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 1px solid #cdcdcd;
        &:active {
          opacity: 0.8;
        }
      }
      .pd {
        width: 90px;
      }
      .item + .item {
        margin-left: 6px;
      }
    }
  }
  &-item {
    padding: 7px 12px 14px;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
    margin-top: 12px;
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
        width: 237px;
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
              -webkit-line-clamp: 2;
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
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
          }
        }
      }
    }
  }
  &-refundment {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background: linear-gradient(0deg, #f9f9f9 64%, #e6ffee 100%);
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: column;
    &__title {
      font-size: 20px;
      font-weight: 600;
      line-height: 22px;
      color: #111111;
      text-align: center;
      margin-top: 13px;
      position: relative;
      .close {
        position: absolute;
        top: 0;
        right: 18px;
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        .img {
          width: 12px;
          height: 12px;
        }
      }
    }
    &__info {
      flex: 1;
      width: 100%;
      padding: 18px 14px 11px;
      .info {
        width: 100%;
        height: 100%;
        background-color: #fff;
        border-radius: 8px;
        padding: 19px 14px 16px;
        display: flex;
        flex-direction: column;
        &-title {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &__left {
            font-size: 16px;
            font-weight: 600;
            line-height: 19px;
            color: #111111;
          }
          &__right {
            font-size: 18px;
            font-weight: 600;
            line-height: 22px;
            color: #ff5500;
            .text {
              margin-left: 2px;
            }
            .unit {
              font-size: 14px;
            }
          }
        }
        &-explain {
          font-size: 14px;
          font-weight: normal;
          line-height: 19px;
          color: #666666;
          padding: 11px 0 15px;
        }
        &-message {
          width: 100%;
          height: 142px;
          border: 1px solid #d4d4d4;
        }
      }
    }
    &__btn {
      height: 65px;
      width: 100%;
      background-color: #fff;
      padding: 8px 14px 0;
      .btn {
        width: 100%;
        height: 34px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 17px;
        background: linear-gradient(104deg, #ff9035 31%, #ff7b35 70%);
        font-size: 15px;
        font-weight: 600;
        line-height: 20px;
        color: #ffffff;
        &:active {
          opacity: 0.7;
        }
      }
    }
  }
  &-code {
    padding: 20px 10px 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
    margin-top: 12px;
    &__img {
      width: 150px;
      height: 150px;
    }
    &__text {
      width: 100%;
      margin-top: 6px;
      font-size: 18px;
      font-weight: 600;
      line-height: 24px;
      color: #333333;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      text-align: center;
    }
  }
}
</style>
