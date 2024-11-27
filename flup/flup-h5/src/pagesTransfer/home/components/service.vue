<template>
  <div>
    <div class="service-goods">
      <div class="item" v-for="item in orderList" :key="item.serialNo">
        <img class="item-img" :src="item.packagePreviewUrl ? item.packagePreviewUrl : defaultIntroduce" alt="" />
        <div class="item-info">
          <div class="item-info__title">{{ item.packageName }}</div>
          <div class="item-info__suggest">
            {{ item.packageDiscription }}
          </div>
          <div class="item-operate">
            <div class="item-operate__tag">
              {{ item.specName }}
            </div>
          </div>
        </div>
        <div class="item-seek">
          <div class="item-seek__btn" @click.stop="seek(item)">
            <span>咨询</span>
            <div class="item-seek__unread" :class="{ 'more': item.patientUnreadCount > 10 }" v-if="item.patientUnreadCount">{{ item.patientUnreadCount > 10 ? '10+' : item.patientUnreadCount }}</div>
          </div>
          <div class="item-seek__text">{{ overplusTime(item.serviceEndTime) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import introduce from "@/assets/images/home/introduce.png";
import { mapActions } from 'vuex';
export default {
  props: {
    orderList: {
      default: () => [],
      type: Array,
    },
  },
  data() {
    return {};
  },
  computed: {
    defaultIntroduce() {
      return introduce;
    },
  },
  methods: {
    ...mapActions('chat', ['getImInfo', 'loginChat']),
    async seek(info) {
      // let { retData } = await this.$apis.preSalesConsultation({})
      // this.$apis.personalReadMessageCallback({
      //   personalConsultId: retData.id
      // })
      if (!localStorage.getItem("userInfo")) {
                let openId =
                    localStorage.getItem("openId") ||
                    (localStorage.getItem("userInfo")
                        ? JSON.parse(localStorage.getItem("userInfo")).openId
                    || this.$route.query.openId
                        : "");
                let res = await this.$apis.getPatientInfo({ openId: openId });
                if (res.retData && res.retData.openId) {
                localStorage.setItem("userInfo", JSON.stringify(res.retData));
                }
            }
      // if (info.packageType == 1 && info.isCompleteQuestionnaire != 1) {
      //   this.sendConsultTemplateHome(info);
      //   return false;
      // }
      let { serialNo, sourceId, patientId, patientName, serviceStatus, activeState, packageType } = info;
      try {
        let { retData } = await this.getImInfo({
          orderSerialNo: serialNo,
          hospitalId: sourceId,
        });
        // let imUrl = JSON.parse(retData.imUrl);
        let imData = await this.$apis.getIMData(retData.patientId)
        let imUrl = JSON.parse(imData.retData)
        if (imUrl) {
          let userSig = imUrl.userSig;
          let roomId = retData.roomId;
          localStorage.setItem("userId", retData.patientId);
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
      let { serialNo: newSerialNo, sourceId, patientId, patientName, serviceStatus } = info;
      let { retData } = await this.$apis.sendConsultTemplateHome({
        userId: info.patientId,
        packageName: info.packageName,
        serialNo: info.serialNo
      });
      this.$router.push({
        path: '/dcwj',
        query: {
          serialNo: retData,
          hospitalId: '1118033010334208499',
          mergingState: true,
          newSerialNo,
          sourceId,
          patientId,
          patientName,
          serviceStatus,
          isChat: true
        }
      })
    },
    overplusTime(value) {
      console.log(444, value)
      let startTime = new Date().getTime();
      let endTime = new Date(value).getTime();
      let time = endTime - startTime;
      if (time < 0) {
        return '已到期'
      }
      let { days, hours } = this.convertTimestamp(time);
      if (days > 0) {
        return `剩余${days}天`;
      } else if (hours > 0) {
        return `剩余${hours}小时`;
      } else {
        return '不足1小时'
      }

    },
    convertTimestamp(timestamp) {
      const seconds = Math.floor(timestamp / 1000);
      const days = Math.floor(seconds / (3600 * 24));
      const hours = Math.floor((seconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((seconds % 3600) / 60);
      const remainingSeconds = seconds % 60;

      return {
        days: days,
        hours: hours,
        minutes: minutes,
        seconds: remainingSeconds
      };
    }
  },
};
</script>
<style lang="scss" scoped>
.service {
  &-goods {
    margin: 12px 7px 12px 0;
    overflow: hidden;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;

    .item {

      // &:active {
      //   background-color: #eee;
      // }
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
          //   padding-right: 22px;
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
          //   padding-right: 22px;
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

          &__tag {
            height: 18px;
            border-radius: 2px;
            border: 0.5px solid #6bc586;
            padding: 0px 4px;
            font-size: 12px;
            font-weight: normal;
            line-height: 18px;
            letter-spacing: 0.2px;
            color: #00982d;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }

      &-seek {
        padding: 0 10px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        &__btn {
          width: 52px;
          height: 25px;
          border-radius: 12.5px;
          background: #e7f9ec;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.2px;
          color: #00982d;
          position: relative;
        }

        &__unread {
          position: absolute;
          right: -5px;
          top: -2px;
          min-width: 16px;
          min-height: 16px;
          line-height: 16px;
          background-color: #FF5500;
          border-radius: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: #FFF;
          font-size: 12px;
          font-weight: 500;
        }

        .more {
          right: -10px;
        }

        &__text {
          margin-top: 8px;
          font-size: 12px;
          font-weight: normal;
          line-height: 12px;
          letter-spacing: 0.2px;
          color: #ed9e00;
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
}</style>