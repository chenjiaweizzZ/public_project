<template>
  <section ref="section" class="healthTeach">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      健康宣教
    </div>-->
    <div class="chooseType">
      <span class="type" @click="chooseType">{{ planType.planName }}</span>
      <!-- <p @click="goUrl">去订阅</p> -->
    </div>
    <div class="allListChoose">
      <p>
        共
        <span>{{ funcsList.length }}</span> 份报告
      </p>
      <div class="chooseDate">
        <span @click="chooseTime('startDate')">{{ startDate }}</span>～
        <span @click="chooseTime">{{ endDate }}</span>
      </div>
      <van-popup v-model="showPicker" position="bottom">
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          title="选择年月日"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
          @cancel="showPicker = false"
          @confirm="confirmPicker"
        />
      </van-popup>
    </div>
    <div class="noData" v-if="!funcsList.length"></div>
    <div class="htList">
      <div class="htLi" v-for="(item, index) in funcsList" :key="index">
        <u></u>
        <div class="htContent" :class="{ overDate: item.state }">
          <p>{{ item.questionnaireName }}</p>
          <div class="reportChoose">{{ item.createTime }}</div>
          <div class="htButton" v-if="item.state">过 期</div>
          <div class="htButton" v-else @click="goToUrl(item.url)">查 看</div>
        </div>
      </div>
    </div>
    <van-popup v-model="show" position="bottom">
      <van-picker
        title="随访任务"
        show-toolbar
        :columns="typeList"
        value-key="planName"
        @cancel="show = false"
        @confirm="onConfirm"
      />
    </van-popup>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      active: 0,
      isOpen: true,
      showPicker: false,
      show: false,
      hospitalList: [],
      currentDate: new Date(),
      startDate: '',
      endDate: '',
      type: '',
      funcsList: [],
      typeList: [],
      minDate: new Date(2015, 0, 1),
      maxDate: new Date(),
      planType: '',
    }
  },
  created() {
    this.startDate = this.dateAdd(-30)
    this.endDate = new Date().toISOString().slice(0, 10)
    this.getPlanList()
    this.getList()
  },
  methods: {
    dateAdd(days) {
      var date = new Date()
      date.setDate(date.getDate() + days)
      var time = date.toISOString().slice(0, 10)
      return time
    },
    async getList() {
      let res = await this.$apis.current()
      this.$apis
        .queryQuestionnaireList(
          this.planType.serialNo,
          JSON.parse(sessionStorage.getItem('userInfo')).userId,
          JSON.parse(sessionStorage.getItem('userInfo')).hospitalId,
          this.startDate,
          this.endDate
        )
        .then((res) => {
          this.funcsList = res.retData
        })
    },
    chooseTime(type) {
      this.type = type
      this.showPicker = true
      if (type == 'startDate') {
        this.currentDate = this.startDate
          ? new Date(
              this.startDate.slice(0, 4),
              this.startDate.slice(5, 7) - 1,
              this.startDate.slice(8, 10)
            )
          : new Date()
      } else {
        this.currentDate = this.endDate
          ? new Date(
              this.endDate.slice(0, 4),
              this.endDate.slice(5, 7) - 1,
              this.endDate.slice(8, 10)
            )
          : new Date()
      }
    },
    confirmPicker(val) {
      let year = val.getFullYear()
      let month = val.getMonth() + 1
      let day = val.getDate()
      if (month >= 1 && month <= 9) {
        month = `0${month}`
      }
      if (day >= 1 && day <= 9) {
        day = `0${day}`
      }
      if (this.type == 'startDate') {
        this.startDate = `${year}-${month}-${day}`
      } else {
        this.endDate = `${year}-${month}-${day}`
      }

      let startDate = this.startDate.replace(/-/g, '')
      let endDate = this.endDate.replace(/-/g, '')
      if (startDate > endDate) {
        this.$toast('起始时间不可大于结束时间,已自动为您置换时间顺序')
        let startDateCopy = this.startDate
        this.startDate = this.endDate
        this.endDate = startDateCopy
      }

      this.showPicker = false
      this.getList()
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`
      } else if (type === 'month') {
        return `${value}月`
      } else if (type === 'day') {
        return `${value}日`
      } else if (type === 'hour') {
        return `${value}时`
      } else if (type === 'minute') {
        return `${value}分`
      } else if (type === 'second') {
        return `${value}秒`
      }
      return value
    },
    goToUrl(url) {
      window.open(url, '_self')
    },
    getPlanList() {
      this.typeList = []
      this.$apis
        .getPlanList(JSON.parse(sessionStorage.getItem('userInfo')).userId)
        .then((res) => {
          if (res.retData.length == 0) {
            this.$toast('暂无随访计划')
          } else {
            this.typeList = res.retData
          }
          this.typeList.push({ planName: '其他', serialNo: '' })
          this.planType = this.typeList[0]
          // this.getEvalList()
          this.getList()
        })
    },
    chooseType() {
      this.show = true
    },
    goUrl() {
      this.$router.push({
        path: '/SubscriptionManagement',
        query: {
          openId: this.$route.query.openId,
          manager: false,
        },
      })
    },
    onConfirm(value) {
      this.show = false
      this.planType = value ? value : ''
      this.getList()
    },
  },
}
</script>
<style lang="scss" scoped>
p {
  margin: 0;
}
.fff {
  background: #fff;
}
.healthTeach {
  position: relative;
  width: 100%;
  height: 100%;
  &::before {
    content: '';
    display: table;
  }
  .chooseType {
    // margin-top: 44px;
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    text-align: center;
    background: #fff;
    span {
      padding-right: 15px;
      font-size: 16px;
      color: #333;
      background: url('../assets/images/downArrowB.png') no-repeat right;
      background-size: 12px;
    }
    p {
      color: #1c97fc;
    }
  }
  .noData {
    height: 60%;
    background: url('../assets/images/noData.png') no-repeat center 40%;
    background-size: 42%;
  }
  .topMenu {
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 18px;
    color: #111111;
    letter-spacing: 0.2px;
    text-align: center;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
    u {
      position: absolute;
      left: 3.75%;
      top: 50%;
      transform: translate(0, -50%);
      display: block;
      width: 22px;
      height: 22px;
      background: #fff url('../assets/images/back.png') no-repeat;
      background-size: contain;
    }
  }
  .allListChoose {
    position: relative;
    // margin-top: 44px;
    padding: 10px 3.75%;
    font-size: 15px;
    color: #ffffff;
    letter-spacing: 0.18px;
    line-height: 21px;
    background: #1c97fc;
    p span {
      font-size: 24px;
      color: #ffd675;
      letter-spacing: 0.28px;
      line-height: 33px;
    }
    span {
      font-size: 14px;
    }
  }
  .chooseDate {
    position: absolute;
    right: 3.75%;
    top: 50%;
    transform: translate(0, -50%);
    padding-right: 18px;
    line-height: 28px;
    background: url('../assets/images/downArroww.png') no-repeat right;
    background-size: 12px;
  }
  .htList {
    background: #fff;
    .htLi {
      position: relative;
      padding-left: 12%;
      overflow: hidden;
      &::before {
        content: '';
        display: block;
        width: 1px;
        height: 100%;
        position: absolute;
        left: 6%;
        top: 0;
        background: #dfdfdf;
      }
      u {
        display: block;
        width: 9px;
        height: 9px;
        position: absolute;
        left: 6%;
        top: 50%;
        transform: translate(-4.5px, -50%);
        border-radius: 9px;
        background: #dfdfdf;
      }
      &:first-child {
        &::before {
          top: 50%;
        }
        u {
          padding: 5px;
          background: rgba($color: #1c97fc, $alpha: 0.15);
          transform: translate(-9.5px, -50%);
          &::before {
            content: '';
            width: 9px;
            height: 9px;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            border-radius: 9px;
            background: #1c97fc;
          }
        }
      }
      &:last-child {
        &::before {
          top: -50%;
        }
      }
      .htContent {
        position: relative;
        padding: 12px 0;
        padding-right: 80px;
        border-bottom: 1px solid #e2e2e2;
        &:last-child {
          border: none;
        }
        p {
          margin-bottom: 6px;
          line-height: 21px;
          font-size: 15px;
          color: #111111;
          letter-spacing: 0.2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .reportChoose {
          line-height: 14px;
          font-size: 12px;
          color: #111;
          letter-spacing: 0.2px;
        }
        .htButton {
          position: absolute;
          right: 4%;
          top: 50%;
          transform: translate(0, -50%);
          padding: 0 16px;
          border: 1px solid #1c98fc;
          border-radius: 4px;
          line-height: 26px;
          font-size: 14px;
          color: #1c98fc;
          letter-spacing: 0.2px;
          text-align: center;
        }
      }
      .overDate {
        p {
          color: #999;
        }
        .reportChoose {
          color: #999;
        }
        .htButton {
          border: 1px solid #cdcdcd;
          color: #333;
        }
      }
    }
  }
}
</style>
