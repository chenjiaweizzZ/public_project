<template>
  <section ref="section" class="devicesList">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      设备列表
    </div>-->
    <div class="noData" v-if="!funcsList.length"></div>
    <div class="funcsList">
      <div
        class="funcsLi"
        v-for="(item, index) in funcsList"
        :key="index"
        @click="goToDetail(item)"
      >
        <span class="idNum">设备编号:{{ item.deviceSerialNumber }}</span>
        <p>{{ item.deviceType }}</p>
        <span class="userInfo">{{ item.createTime.slice(0, 10) }}</span>
      </div>
    </div>
    <div class="bottomBtn" @click="bindDevice()">添加绑定</div>
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
      hospitalList: [],
      currentDate: new Date(),
      startDate: '',
      endDate: '',
      funcsList: [],
      typeList: [],
      show: false,
      type: '',
      flupPlanId: '',
      planType: '',
    }
  },
  async created() {
    this.bindingDevices()
  },
  methods: {
    bindingDevices() {
      this.$apis.bindingDevices(JSON.parse(sessionStorage.getItem('userInfo')).userId).then((res) => {
        this.funcsList = res.retData
      })
    },
    bindDevice() {
      sessionStorage.setItem('device', '')
      this.$router.push({
        path: '/devicesChoose',
      })
    },
    goToDetail(item) {
      sessionStorage.setItem('device', JSON.stringify(item))
      this.$router.push('/devicesChoose')
    },
    goToUrl(flupAddress) {
      window.open(flupAddress, '_self')
    },
    chooseType() {
      this.show = true
    },
    onConfirm(value) {
      this.planType = value
      this.show = false
      this.getEvalList()
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
.devicesList {
  position: relative;
  width: 100%;
  height: 100%;
  &::before {
    content: '';
    display: table;
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

  .funcsList {
    position: relative;
    // margin-top: 44px;
    margin-bottom: 100px;
    background: #fff;
    overflow: hidden;
    :last-child {
      &::before {
        display: none;
      }
    }
    .funcsLi {
      position: relative;
      padding: 14px 0;
      padding-left: 3.75%;
      background: url('../assets/images/enter.png') no-repeat 94% 70%;
      background-size: 16px;
      overflow: hidden;
      &::before {
        content: '';
        position: absolute;
        left: 3.75%;
        bottom: 0;
        width: 96.25%;
        height: 1px;
        background: #e2e2e2;
      }
      .idNum {
        position: absolute;
        right: 3.75%;
        top: 12px;
      }
      p {
        margin-bottom: 6px;
        line-height: 24px;
        font-size: 17px;
        color: #111;
        letter-spacing: 0.2px;
        span {
          display: inline-block;
          padding: 2px 6px;
          margin-left: 3px;
          border-radius: 8.5px;
          border: 1px solid #1c97fc;
          line-height: 14px;
          font-size: 10px;
          color: #1c97fc;
          letter-spacing: 0.13px;
          transform: scale(0.9);
        }
      }
      span {
        font-size: 14px;
        color: #999999;
        letter-spacing: 0.2px;
        text-align: left;
        line-height: 20px;
      }
    }
  }
  .bottomBtn {
    position: fixed;
    left: 5%;
    bottom: 6%;
    width: 90%;
    background: #1c97fc;
    border-radius: 4px;
    line-height: 46px;
    font-size: 17px;
    color: #ffffff;
    letter-spacing: 0.2px;
    text-align: center;
  }
}
</style>
