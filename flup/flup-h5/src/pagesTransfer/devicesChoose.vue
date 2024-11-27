<template>
  <section ref="section" class="devicesChoose">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      设备列表
    </div>-->
    <van-cell-group class="flex1 personalFilesTop">
      <van-field readonly clickable required label="设备类型" v-model="device.deviceType" placeholder="请选择" @click="show = true" />
      <van-field v-model="device.deviceSerialNumber" required label="设备编号" placeholder="请输入设备编号" />
      <van-popup v-model="show" position="bottom">
        <van-picker show-toolbar :columns="smList" value-key="deviceType" @cancel="show = false" @confirm="onConfirm" />
      </van-popup>
    </van-cell-group>
    <div class="bottomBtn" :class="{ bottomTwo: edit }">
      <div v-if="edit" @click="removeDevice()">删除该设备</div>
      <div @click="addDevice()">保存</div>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      active: 0,
      isOpen: true,
      hospitalList: [],
      currentDate: new Date(),
      startDate: '',
      endDate: '',
      device: {
        deviceType: null,
        deviceSerialNumber: null,
        userId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
        deviceTypeId: null,
      },
      funcsList: [],
      typeList: [],
      show: false,
      type: '',
      flupPlanId: '',
      planType: '',
      smList: [],
      device: {},
      edit: false,
    }
  },
  async created() {
    if (sessionStorage.getItem('device')) {
      this.edit = true
      this.device = JSON.parse(sessionStorage.getItem('device'))
    }
    this.GetDictsByDictCode()
  },
  methods: {
    GetDictsByDictCode() {
      this.$apis.GetDictsByDictCode().then((res) => {
        this.smList = res.retData
      })
    },
    getEvalList() {
      this.$apis
        .getEvalList({
          patientId: JSON.parse(sessionStorage.getItem('userInfo')).userId,
          hospitalId: JSON.parse(sessionStorage.getItem('userInfo')).hospitalId,
          flupPlanId: this.planType.serialNo,
          startDate: this.startDate,
          endDate: this.endDate,
          recordSerialNo: this.recordSerialNo,
        })
        .then((res) => {
          this.funcsList = res.retData
        })
    },
    goToUrl(flupAddress) {
      window.open(flupAddress, '_self')
    },
    chooseType() {
      this.show = true
    },
    onConfirm(value) {
      console.log(11, value)
      console.log(22, JSON.parse(sessionStorage.getItem('userInfo')).userId)

      if (this.device.deviceType == value.deviceType) {
        this.show = false
        return
      }
      // this.device = value
      this.device.deviceType = value.deviceType
      this.device.deviceTypeId = value.deviceTypeId
      // this.device.deviceSerialNumber = null
      this.show = false
    },
    removeDevice() {
      if (JSON.stringify(this.device) == '{}') {
          this.$dialog.alert({
          message: '请选择设备！',
        })
        return
      }
      this.$dialog
        .alert({
          message: '确定要删除该设备绑定么？',
        })
        .then(() => {
          this.$apis.deleteBinding(this.device).then((res) => {
            this.$dialog
              .alert({
                message: '设备删除成功',
              })
              .then(() => {
                // this.$router.push({
                //   path: 'devicesList',
                // })
                this.$router.go(-1)
              })
          })
        })
    },
    addDevice() {
      if (JSON.stringify(this.device) == '{}') {
        this.$dialog.alert({
          message: '请选择设备！',
        })
        return
      }
      if (!this.device.deviceType) {
        this.$dialog.alert({
          message: '请选择设备！',
        })
        return
      }
      if (!this.device.deviceSerialNumber) {
        this.$dialog.alert({
          message: '请输入设备编号！',
        })
        return
      }
      // console.log(11, this.device)
      let params = this.device
      params.userId = JSON.parse(sessionStorage.getItem('userInfo')).userId
      // console.log(params)
      this.$apis
        .binding(params)
        .then((res) => {
          console.log(111,res)
          this.$dialog
            .alert({
              message: res.retInfo,
            })
            .then(() => {
              // this.$router.push({
              //   path: 'devicesList',
              // })
              this.$router.go(-1)
            })
        })
        .catch((err) => {
          this.$dialog
            .alert({
              message: err,
            })
            .then(() => {
              // this.$router.push({
              //   path: 'devicesList',
              // })
              this.$router.go(-1)
            })
        })
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
.devicesChoose {
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

  .personalFilesTop {
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
  .bottomTwo {
    position: fixed;
    left: 5%;
    bottom: 6%;
    width: 90%;
    background: none;
    line-height: 46px;
    font-size: 17px;
    color: #ffffff;
    letter-spacing: 0.2px;
    text-align: center;
    div {
      float: left;
      width: 45%;
      background: #1c97fc;
      border: 1px solid #1c97fc;
      border-radius: 4px;
      &:first-child {
        margin-right: 10%;
        color: #333333;
        border: 1px solid #cdcdcd;
        background: #ffffff;
      }
    }
  }
}
</style>
