<template>
  <div class="orderList">
    <van-tabs v-model="tabActive" color="#00982D" title-active-color="#00982D" title-inactive-color="#111" :ellipsis="true" swipe-threshold="5" @change="changeTab">
      <van-tab v-for="item in tabList" :title="item.text" :key="item.id" :name="item.id" />
    </van-tabs>
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="getOrderList" class="orderList-list">
      <div class="orderList-list__item" @click="goDrderDetails(item.serialNo, item.flowStatus)" v-for="item in list" :key="item.serialNo">
        <div class="title">
          <div class="title-left">
            <img class="title-left__img" src="@/assets/images/icon/hospital.png" alt="">
            <span class="title-left__text">{{ item.sourceName }}</span>
          </div>
          <div class="title-right" :class="{'gray':item.flowStatus == 1 || item.flowStatus == 2 || item.flowStatus == 3 || item.flowStatus == 5 || item.flowStatus == 6 || item.flowStatus == 7}">
            <van-count-down v-if="item.flowStatus == 0" class="title-right__time" format="mm:ss" :time="item.countDown" @finish="downFinish(item.serialNo)" />
            <span v-if="item.flowStatus == 0">待支付</span>
            <span v-else-if="item.flowStatus == 1">待发货</span>
            <span v-else-if="item.flowStatus == 2">待收货</span>
            <span v-else-if="item.flowStatus == 3">待核销</span>
            <span v-else-if="item.flowStatus == 4 || item.flowStatus == 11">退款中</span>
            <span v-else-if="item.flowStatus == 5">完成</span>
            <span v-else-if="item.flowStatus == 6">已取消</span>
            <span v-else-if="item.flowStatus == 7">已退款</span>
            <span v-else-if="item.flowStatus == 8">退款失败</span>
            <span v-else-if="item.flowStatus == 12">咨询中</span>
            <span v-else-if="item.flowStatus == 13">待回复</span>
          </div>
        </div>
        <div class="info">
          <img class="info-img" :src="item.packagePreviewUrl ? item.packagePreviewUrl : defaultIntroduce" alt="">
          <div class="info-right">
            <div class="designation">
              <div class="designation-text">{{item.packageName }}</div>
              <div class="designation-money">￥ {{ item.specPrice | unit }}</div>
            </div>
            <div class="suggest">
              <div class="suggest-left">
                <span>{{ item.packageDiscription }}</span>
              </div>
              <div class="suggest-right">x {{ item.specName }}</div>
            </div>
          </div>
        </div>
        <div class="operate">
          <div class="operate-left">
            <span class="operate-left__text">订单金额</span>
            <div class="operate-left__num"><span class="text">¥</span><span>{{ item.fee | unit }}</span></div>
          </div>
          <div class="operate-btns" v-if="item.flowStatus == 0">
            <div class="btn" @click.stop="canceOrder(item.serialNo)">取消订单</div>
            <div class="btn orange" @click.stop="toPay(item.payUrl)">去支付</div>
          </div>
          <div class="operate-btns operate-btns-toright" v-if="item.flowStatus == 1 || item.flowStatus == 2 || item.flowStatus == 3 || item.flowStatus == 8 || item.flowStatus == 5 || item.flowStatus == 12 || item.flowStatus == 13">
            <div class="btn" @click.stop="invoicing(item.serialNo)">开具发票</div>
          </div>
          <div class="left-10px" :class="{'operate-spot':item.patientUnreadCount > 0}" v-if="item.flowStatus != 0 && item.flowStatus != 6 && item.flowStatus != 7 && !(item.serviceStatus == 2 && !item.roomId)" @click.stop="seek(item)">
            <img class="operate-img " src="@/assets/images/service.png" alt="" />
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>
<script>
import introduce from "@/assets/images/home/introduce.png";
import { CountDown } from "vant";
import { mapState, mapActions } from "vuex";
export default {
  filters: {
    unit(val) {
      if (!val) {
        return "0.00";
      }
      return (val / 100).toFixed(2);
    },
  },
  components: {
    [CountDown.name]: CountDown,
  },
  data() {
    return {
      tabActive: 10,
      tabList: [
        {
          id: 10,
          text: "全部",
        },
        {
          id: 0,
          text: "待支付",
        },
        {
          id: "3,12,13",
          text: "待使用",
        },
        {
          id: "1,2",
          text: "待收货",
        },
        {
          id: 5,
          text: "完成",
        },
        {
          id: "4,7,8,11",
          text: "退款",
        },
      ],
      list: [],
      loading: false,
      finished: false,
      pageNo: 1,
      pageSize: 10,
    };
  },
  computed: {
    ...mapState("chat", ["isLogin"]),
    defaultIntroduce() {
      return introduce;
    },
  },
  mounted() {
    // this.getOrderList();
  },
  methods: {
    ...mapActions("chat", ["getImInfo", "loginChat"]),
    //tab切换
    changeTab() {
      this.pageNo = 1;
      this.list = [];
      this.getOrderList();
    },
    //获取列表数据
    async getOrderList() {
      let params = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
      };
      if (this.tabActive != 10) {
        params.flowStatus = this.tabActive;
      }
      let { retData } = await this.$apis.getOrderList(params);
      retData.list.map((item) => {
        if (item.createTime) {
          let startTime = new Date(item.createTime).getTime() + 900000;
          let endTime = Date.now();
          if (startTime >= endTime) {
            item.countDown = startTime - endTime;
          }
        }
      });
      this.list.push(...retData.list);
      this.pageNo++;
      this.loading = false;
      if (retData.list.length != this.pageSize) {
        this.finished = true;
      } else {
        this.finished = false;
      }
    },
    //倒计时结束
    downFinish(val) {
      if (this.tabActive == 0) {
        this.list = this.list.filter((item) => item.serialNo != val);
      } else {
        this.list.forEach((item) => {
          if (item.serialNo == val) {
            item.flowStatus = 6;
          }
        });
      }
    },
    //去支付
    toPay(payUrl) {
      window.location.href = payUrl;
    },
    //开具发票
    invoicing(orderId) {
      this.$router.push({
        path: "/invoicing",
        query: {
          orderId,
        },
      });
    },
    //取消订单
    canceOrder(orderId) {
      this.$dialog
        .confirm({
          title: "提醒",
          message: "是否取消订单?",
        })
        .then(async () => {
          let params = {
            orderId,
            newStatus: 6,
            failReason: "患者取消",
          };
          await this.$apis.updateOrderStatus(params);
          this.list.forEach((item) => {
            if (item.serialNo == orderId) {
              item.flowStatus = 6;
            }
          });
        })
        .catch(() => {});
    },
    goDrderDetails(serialNo, flowStatus) {
      // if(flowStatus == 3){
      //     this.toast.fail('正在开发中');
      //     return false;
      // }
      this.$router.push({
        path: "/orderDetails",
        query: {
          serialNo,
          flowStatus,
        },
      });
    },
    async seek(info) {
    //   if (info.packageType == 1 && info.isCompleteQuestionnaire != 1) {
    //     this.sendConsultTemplateHome(info);
    //     return false;
    //   }
      let { serialNo, sourceId, patientId, patientName, serviceStatus, packageType } = info;
      try {
        let { retData } = await this.getImInfo({
          orderSerialNo: serialNo,
          hospitalId: sourceId,
        });
        // let imUrl = JSON.parse(retData.imUrl);
        let imData = await this.$apis.getIMData(retData.patientId);
        let imUrl = JSON.parse(imData.retData);
        if (imUrl) {
          let userSig = imUrl.userSig;
          let roomId = retData.roomId;
          localStorage.setItem("userId", patientId);
          localStorage.setItem("userSig", userSig);
          // localStorage.setItem('roomId',roomId);
          let consultId = retData.id;
          this.$router.push({
            path: "/chat",
            query: {
              consultId,
              serviceStatus,
              patientId,
              patientName,
              roomId,
              packageType
            },
          });
        }
      } catch (e) {
        this.$toast.fail(e);
      }
    },
    async sendConsultTemplateHome(info) {
      let {
        serialNo: newSerialNo,
        sourceId,
        patientId,
        patientName,
        serviceStatus,
      } = info;
      let { retData } = await this.$apis.sendConsultTemplateHome({
        userId: info.patientId,
        packageName: info.packageName,
        serialNo: info.serialNo,
      });
      this.$router.push({
        path: "/dcwj",
        query: {
          serialNo: retData,
          hospitalId: "1118033010334208499",
          mergingState: true,
          newSerialNo,
          sourceId,
          patientId,
          patientName,
          serviceStatus,
          isChat: true,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.orderList {
  &-list {
    height: calc(100vh - 44px);
    width: 100%;
    background-color: #f3f7f5;
    padding: 0 12px;
    overflow-y: auto;
    &__item {
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
}
</style>