<template>
  <section ref="section" class="healthFileFuncList">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      {{ typeName[$route.query.index] }}
    </div>-->
    <!-- 切换就诊人的模块 -->
    <div class="patientChoose">
      <span>就诊人</span>
      <span class="patientId" @click="choosePatient()">{{ patient.text }}</span>
    </div>
    <div class="funcsList" v-if="funcsList.length">
      <div class="funcsLi" :class="{ choose: !index }" v-for="(item, index) in funcsList" :key="index" @click="goToDetail(item)">
        <p>
          <img src="@/assets/images/medicine.png" v-if="titieIndex==0" />
          <img src="@/assets/images/sport.png" v-if="titieIndex==1" />
          <img src="@/assets/images/diet.png" v-if="titieIndex==2" />
          {{ item.type }}
          <span>最新</span>
        </p>
        <span>{{ item.doctor }} {{ item.createTime.slice(0, 10) }}</span>
        <img class="detail" src="@/assets/images/jr.png" />
      </div>
    </div>
    <div class="nodata" v-if="!funcsList.length&&patientOption.length"></div>
    <div class="noPatient" v-show="patientOption.length==0">
      <div class="npContent">
        <img src="@/assets/images/noPatient.png" alt />
        <div class="noDataText">暂无就诊人</div>
        <div class="npBtn" @click="addPatient()">去新增</div>
      </div>
    </div>
    <van-popup v-model="showPatientPicker" round position="bottom">
      <van-picker title="切换就诊人" :columns="patientOption" @cancel="showPatientPicker = false" @confirm="onConfirm" show-toolbar :default-index="pickerBindIndex" />
    </van-popup>
  </section>
</template>

<script>
export default {
  data() {
    return {
      typeName: ['用药指导', '运动方案', '饮食建议'],
      funcsList: [],
      patientId: '123456784',
      patientOption: [],
      titieIndex: null,
      patient: {},
      showPatientPicker: false,
      pickerBindIndex: 0,
    };
  },
  created() {
    this.titieIndex = this.$route.query.index;
    this.title(this.typeName[this.$route.query.index]);
    this.getPatientList();
  },
  methods: {
    getPatientList() {
      this.$apis
        .getPatientList({
          openId: this.$route.query.openId,
          pageNo: 1,
          pageSize: 100,
        })
        .then((res) => {
          this.patientOption = [];
          if (res.retData.list.length != 0) {
            this.patientOption = res.retData.list;
            this.patientOption.forEach((i) => {
              //脱敏
              // var a = i.patientName.substring(0, 1) + '*' + i.patientName.substring(i.patientName.length - 1, 1);
              var b = i.idNo.substring(0, 4) + '***********' + i.idNo.substring(i.idNo.length - 4);
              i.text = i.patientName + '  ' + b;
              i.value = i.userId;
            });
            let index = null;
            if (sessionStorage.getItem('currentPatientId')) {
              index = this.patientOption.findIndex((i) => {
                return i.userId == sessionStorage.getItem('currentPatientId');
              });
            } else {
              index = this.patientOption.findIndex((i) => {
                return i.isDefault == 1;
              });
            }
            if (index != -1) {
              this.patient = this.patientOption[index];
            } else {
              this.patient = this.patientOption[0];
            }
            sessionStorage.setItem('userInfo', JSON.stringify(this.patient));
            this.pickerBindIndex = index == -1 ? 0 : index;
            this.patientId = this.patient.value;
            this.getFuncsList();
          } else {
            this.patientOption = [];
            this.funcsList = [];
          }
        });
    },
    onConfirm(selectedValues, index) {
      this.patient = selectedValues;
      this.pickerBindIndex = index == -1 ? 0 : index;
      this.patientId = this.patient.value;
      this.getFuncsList();
      this.showPatientPicker = false;
    },
    choosePatient() {
      if (this.patient.value) {
        this.showPatientPicker = true;
      } else {
        this.$router.push({
          path: ' ',
        });
      }
    },
    addPatient() {
      this.$router.push({
        path: '/userManagement',
      });
    },
    getPatientRecord() {
      this.getFuncsList();
    },
    getFuncsList() {
      let patientId = this.patientId || JSON.parse(sessionStorage.getItem('userInfo')).userId;
      let hospitalId = '';
      this.$apis.queryHistory(patientId, this.typeName[this.$route.query.index], hospitalId).then((res) => {
        this.funcsList = res.retData;
      });
    },
    goToDetail(item) {
      this.$router.push({
        path: '/healthFileFuncDetail',
        query: {
          index: this.$route.query.index,
          openId: this.$route.query.openId,
          id: item.id,
          patientId: this.patientId,
        },
      });
    },
  },
  destroyed() {
    if (sessionStorage.getItem('currentPatientId')) {
      sessionStorage.removeItem('currentPatientId');
    }
  },
};
</script>
<style lang="scss" scoped>
p {
  margin: 0;
}
.healthFileFuncList {
  position: relative;
  width: 100%;
  height: 100%;
  background: #f3f7f5;
  &::before {
    content: '';
    display: table;
  }
  .patientChoose {
    padding: 0 14px 0 24px;
    height: 44px;
    background: linear-gradient(277deg, #32ae57 1%, #46cd6e 96%);
    font-size: 16px;
    line-height: 46px;
    color: #ffffff;
    .patientId {
      padding-right: 18px;
      float: right;
      font-size: 15px;
      background: url('../assets/images/right-arrow-icon.png') no-repeat right;
    }
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
    // position: relative;
    // // margin-top: 1px;
    // // background: #fff;
    // overflow: hidden;
    margin: 0 12px;
    position: absolute;
    left: 0;
    right: 0;
    top: 12.267vw;
    bottom: 0;
    overflow-y: scroll;
    :last-child {
      &::before {
        display: none;
      }
    }
    .funcsLi {
      position: relative;
      padding: 14px 0;
      padding-left: 3.75%;
      background-size: 16px;
      overflow: hidden;
      margin-top: 16px;
      background: #fff;
      border-radius: 8px;
      box-shadow: 0px 1px 4px 0px rgba(26, 33, 44, 0.08);
      // &::before {
      //   content: '';
      //   position: absolute;
      //   left: 3.75%;
      //   bottom: 0;
      //   width: 96.25%;
      //   height: 1px;
      //   background: #e2e2e2;
      // }
      .detail {
        width: 16px;
        height: 16px;
        display: inline-block;
        position: absolute;
        top: 33px;
        right: 12px;
      }
      p {
        font-family: 苹方-简;
        font-size: 16px;
        font-weight: 500;
        line-height: 19px;
        letter-spacing: 0.2px;
        color: #111111;
        margin-bottom: 11px;
        display: flex;
        img {
          width: 20px;
          height: 20px;
          display: inline-block;
          margin-right: 8px;
        }
        span {
          display: none;
          padding: 2px 6px;
          margin-left: 3px;
          border-radius: 8.5px;
          // border: 1px solid #1c97fc;
          line-height: 14px;
          font-size: 10px;
          color: #fff;
          letter-spacing: 0.13px;
          transform: scale(0.9);
          background: #ff7b35;
          border-radius: 0 8px 8px 8px;
        }
      }
      span {
        font-family: 苹方-简;
        font-size: 14px;
        font-weight: normal;
        line-height: 17px;
        letter-spacing: 0.2px;
        color: #999999;
        margin-left: 28px;
      }
    }
    .choose {
      p {
        color: #111;
        font-family: 苹方-简;
        font-size: 16px;
        font-weight: 500;
        line-height: 19px;
        letter-spacing: 0.2px;
        color: #111111;
        span {
          display: inline-block;
        }
      }
    }
  }
  .nodata {
    position: absolute;
    left: 0;
    top: 50px;
    width: 100%;
    height: 100%;
    background: #fff url('../assets/images/noData.png') no-repeat center 30%;
    background-size: 42%;
  }
  .noPatient {
    .npContent {
      width: 74%;
      margin-left: 13%;
      margin-top: 40%;
      text-align: center;
      img {
        display: block;
        width: 100%;
      }
      .noDataText {
        font-family: 苹方-简;
        font-size: 17px;
        font-weight: normal;
        line-height: 20px;
        text-align: center;
        letter-spacing: 0px;
        color: #6b8c75;
      }
      .npBtn {
        display: inline-block;
        margin: 20px;
        padding: 0 23px;
        line-height: 26px;
        border-radius: 18px;
        border: 1px solid #32ae57;
        font-size: 15px;
        letter-spacing: 0.2px;
        color: #00982d;
      }
    }
  }
}
</style>
