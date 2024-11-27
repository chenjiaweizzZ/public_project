//选择签约医生
<template>
  <section v-if="hide" ref="section" class="evalReport">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      签约管理
    </div>-->
    <div class="contentbox">
      <div class="title">
        <h3>
          {{servicePack.packageName}}
          <span>¥ {{servicePack.price}}/ {{servicePack.validityDay}}天</span>
        </h3>
      </div>
      <div v-if="doctorList.length !=0" class="doctorList">
        <van-radio-group style="display:block" v-model="radio">
          <div v-for="(item, index) in doctorList" :key="index" class="doctor">
            <img style="flex:none" src="../../assets/images/ystp.png" />
            <div style="margin-left: 10px;">
              <div>
                <h3>{{item.realName}}</h3>
                <van-radio :name="index"></van-radio>
              </div>
              <p>{{item.description}}</p>
            </div>
          </div>
        </van-radio-group>
      </div>
      <div v-else class="noDatabox">
        <img src="../../assets/images/zwsj.png" />
      </div>
    </div>
    <div style=" width:100%;height: 61px;"></div>
    <div v-if="doctorList.length !=0" class="but">
      <van-button type="primary" block color="#1C97FC" @click="push">下一步</van-button>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      hide: false,
      radio: 0,
      doctorList: [],
      servicePack: JSON.parse(this.$route.query.servicePack),
    }
  },
  created() {
    let _this = this
    this.$apis
      .getDoctorByPackageId({
        serialNo: JSON.parse(this.$route.query.servicePack).serialNo,
      })
      .then((res) => {
        this.doctorList = res.retData
        setTimeout(function () {
          _this.hide = true
        }, 100)
      })
  },
  methods: {
    push() {
      this.$router
        .push({
          path: 'pay',
          query: {
            servicePack: this.$route.query.servicePack,
            doctor: JSON.stringify(this.doctorList[this.radio]),
          },
        })
        .catch((err) => {
          err
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
.evalReport {
  position: relative;
  width: 100%;
  height: 100%;
  &::before {
    content: '';
    display: table;
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
      background: #fff url('../../assets/images/back.png') no-repeat;
      background-size: contain;
    }
  }
}
.contentbox {
  .title {
    height: 55px;
    padding: 15px 14px;
    border-bottom: 1px solid #e2e2e2;
    background: #ffffff;
    h3 {
      margin-block-start: 0px;
      margin-block-end: 0px;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
      font-size: 17px;
      color: #111111;
      letter-spacing: 0.2px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: 14px;
        color: #ff7b35;
        letter-spacing: 0.2px;
        line-height: 20px;
        font-weight: 500;
      }
    }
  }
  .doctorList {
    padding-left: 14px;
    background-color: #fff;
    border-bottom: 1px solid #e2e2e2;
    .doctor {
      width: 100%;
      padding: 14px 14px 14px 0;
      display: flex;
      border-bottom: 1px solid #e2e2e2;
      img {
        width: 50px;
        height: 50px;
      }
      > div {
        width: 100%;
        h3 {
          margin-block-start: 0px;
          margin-block-end: 8px;
          margin-inline-start: 0px;
          margin-inline-end: 0px;
        }
        div {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }
        p {
          width: 270px;
          font-size: 14px;
          color: #999999;
          letter-spacing: 0.2px;
          line-height: 20px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .doctor:last-child {
      border-bottom: 0;
    }
  }
}
</style>
