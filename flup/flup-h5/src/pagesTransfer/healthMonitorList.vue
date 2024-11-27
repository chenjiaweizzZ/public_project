<template>
  <section ref="section" class="healthMonitorList">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      健康监测
    </div>-->

    <div class="hmList">
      <div v-if="paraVisible.Weight" class="hmLi" @click="editAndDetail('weight')">
        <img src="../assets/images/tzIcon.png" alt />
        <p class="hmTitle">体重</p>
        <p class="hmNum">
          <span>{{ funcsList.weight && funcsList.weight.length ? funcsList.weight[funcsList.weight.length - 1].weight : "-" }}</span>
          {{funcsList.weight && funcsList.weight.length? funcsList.weight[funcsList.weight.length - 1].resultUnit:''}}
        </p>
        <span class="hmTip">{{ funcsList.weight ? "最近测量" : "暂无数据" }}</span>
      </div>
      <div v-if="paraVisible.BloodPressure" class="hmLi" @click="editAndDetail('bloodPressure')">
        <img src="../assets/images/xyIcon.png" alt />
        <p class="hmTitle">血压</p>
        <p class="hmNum">
          <span>
            <!-- {{ funcsList.bloodPressure && funcsList.bloodPressure.length ? funcsList.bloodPressure[funcsList.bloodPressure.length - 1] .bloodPressureH + "/" + funcsList.bloodPressure[funcsList.bloodPressure.length - 1] .bloodPressureL : "-" }} -->
            {{ funcsList.bloodPressure && funcsList.bloodPressure.length ? funcsList.bloodPressure[funcsList.bloodPressure.length - 1] .bloodPressureH: "-" }}
          </span>
          {{ funcsList.bloodPressure && funcsList.bloodPressure.length ? funcsList.bloodPressure[funcsList.bloodPressure.length - 1] .bloodPressureUnit : "" }}
        </p>
        <span class="hmTip">{{ funcsList.bloodPressure ? "最近测量" : "暂无数据" }}</span>
      </div>
      <div v-if="paraVisible.BloodSugar" class="hmLi" @click="editAndDetail('bloodSugar')">
        <img src="../assets/images/xtIcon.png" alt />
        <p class="hmTitle">血糖</p>
        <p class="hmNum">
          <span>
            {{ funcsList.bloodSugar && funcsList.bloodSugar.length ? (funcsList.bloodSugar[funcsList.bloodSugar.length - 1] .bloodSugarBeforeMeal == null ? "" : funcsList.bloodSugar[funcsList.bloodSugar.length - 1] .bloodSugarBeforeMeal) + "/" + (funcsList.bloodSugar[funcsList.bloodSugar.length - 1] .bloodSugarAfterMeal == null ? "" : funcsList.bloodSugar[funcsList.bloodSugar.length - 1] .bloodSugarAfterMeal) : "-" }}
            <!-- {{ funcsList.bloodSugar && funcsList.bloodSugar.length ? (funcsList.bloodSugar[funcsList.bloodSugar.length - 1] .bloodSugarAfterMeal == null ? "" : funcsList.bloodSugar[funcsList.bloodSugar.length - 1] .bloodSugarAfterMeal) : "-" }} -->
          </span>
          {{ funcsList.bloodSugar && funcsList.bloodSugar.length ? funcsList.bloodSugar[0].sugarUnit : "" }}
        </p>
        <span class="hmTip">{{ funcsList.bloodSugar ? "最近测量" : "暂无数据" }}</span>
      </div>
      <div v-if="paraVisible.BloodSpo2" class="hmLi" @click="editAndDetail('spo2')">
        <img src="../assets/images/xueyangIcon.png" alt />
        <p class="hmTitle">血氧</p>
        <p class="hmNum">
          <span>{{ funcsList.spo2 && funcsList.spo2.length ? funcsList.spo2[funcsList.spo2.length - 1].spo2 : "-" }}</span>
          {{ funcsList.spo2 && funcsList.spo2.length ? funcsList.spo2[funcsList.spo2.length - 1].spo2Unit : "" }}
        </p>
        <span class="hmTip">{{ funcsList.spo2 ? "最近测量" : "暂无数据" }}</span>
      </div>
      <div v-if="paraVisible.WaistLine" class="hmLi" @click="editAndDetail('waistLine')">
        <img src="../assets/images/ywIcon.png" alt />
        <p class="hmTitle">腰围</p>
        <p class="hmNum">
          <span>{{ funcsList.waistLine && funcsList.waistLine.length ? funcsList.waistLine[funcsList.waistLine.length - 1].waistLine : "-" }}</span>
          {{ funcsList.waistLine && funcsList.waistLine.length ? funcsList.waistLine[funcsList.waistLine.length - 1].resultUnit : "" }}
        </p>
        <span class="hmTip">{{ funcsList.waistLine ? "最近测量" : "暂无数据" }}</span>
      </div>
      <div v-if="paraVisible.Height" class="hmLi" @click="editAndDetail('height')">
        <img src="../assets/images/sgIcon.png" alt />
        <p class="hmTitle">身高</p>
        <p class="hmNum">
          <span>{{ funcsList.height && funcsList.height.length ? funcsList.height[funcsList.height.length - 1].height : "-" }}</span>
          {{ funcsList.height && funcsList.height.length ? funcsList.height[funcsList.height.length - 1].resultUnit : "" }}
        </p>
        <span class="hmTip">{{ funcsList.height ? "最近测量" : "暂无数据" }}</span>
      </div>
      <div v-if="paraVisible.BoneDensity" class="hmLi" @click="editAndDetail('boneDensity')">
        <img src="../assets/images/gmdIcon.png" alt />
        <p class="hmTitle">骨密度</p>
        <p class="hmNum">
          <span>{{ funcsList.boneDensity && funcsList.boneDensity.length ? funcsList.boneDensity[funcsList.boneDensity.length - 1] .checkResult : "-" }}</span>
          {{ funcsList.boneDensity && funcsList.boneDensity.length ? funcsList.boneDensity[funcsList.boneDensity.length - 1] .resultUnit : "-" }}
          <!-- {{ "" }} -->
        </p>
        <span class="hmTip">{{ funcsList.boneDensity ? "最近测量" : "暂无数据" }}</span>
      </div>
      <div v-if="paraVisible.BMI" class="hmLi" @click="editAndDetail('bmi')">
        <img src="../assets/images/bmiIcon.png" alt />
        <p class="hmTitle">BMI</p>
        <p class="hmNum">
          <span>{{ funcsList.bmi && funcsList.bmi.length ? funcsList.bmi[funcsList.bmi.length - 1].bmi : "-" }}</span>
          {{ funcsList.bmi && funcsList.bmi.length ? funcsList.bmi[funcsList.bmi.length - 1].resultUnit : "-" }}
          <!-- {{ "" }} -->
        </p>
        <span class="hmTip">{{ funcsList.bmi ? "最近测量" : "暂无数据" }}</span>
      </div>
      <div v-if="paraVisible.BodyTemperature" class="hmLi" @click="editAndDetail('temperature')">
        <img src="../assets/images/wdIcon.png" alt />
        <p class="hmTitle">体温</p>
        <p class="hmNum">
          <span>{{ funcsList.temperature && funcsList.temperature.length ? funcsList.temperature[funcsList.temperature.length - 1] .bodyTemperature : "-" }}</span>
          {{ funcsList.temperature && funcsList.temperature.length ? funcsList.temperature[funcsList.temperature.length - 1] .temperatureUnit : "" }}
        </p>
        <span class="hmTip">{{ funcsList.bloodSugar ? "最近测量" : "暂无数据" }}</span>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      isOpen: true,
      showPicker: false,
      hospitalList: [],
      type: '',
      funcsList: {},
      paraVisible: {
        Weight: 1,
        BloodPressure: 1,
        BloodSugar: 1,
        BloodSpo2: 1,
        WaistLine: 1,
        Height: 1,
        BoneDensity: 1,
        BMI: 1,
        BodyTemperature: 1,
      },
    };
  },
  created() {
    this.getList();

    this.$apis
      .getFlupConfigList({
        hospitalId: sessionStorage.getItem('hospitalId'),
        moduleCode: 'mobileViewMonitor',
      })
      .then((res) => {
        res.retData.forEach((element) => {
          this.paraVisible[element.componentKey] = parseInt(element.componentValue);
        });
      });
  },
  methods: {
    async getList() {
      this.$apis.queryTelemonitorDataByUserIdList(JSON.parse(sessionStorage.getItem('userInfo')).userId).then((res) => {
        this.funcsList = res.retData;
      });
    },
    editAndDetail(type) {
      switch (type) {
        case 'yw':
          this.$toast('暂时无法编辑');
          break;
        case 'bloodPressure':
          this.$router.push({
            path: 'healthmonitor',
            query: {
              active: 1,
            },
          });
          break;
        case 'bloodSugar':
          this.$router.push({
            path: 'healthmonitor',
            query: {
              active: 2,
            },
          });
          break;
        case 'spo2':
          this.$router.push({
            path: 'healthmonitor',
            query: {
              active: 3,
            },
          });
          break;
        case 'temperature':
          this.$router.push({
            path: 'healthmonitor',
            query: {
              active: 0,
            },
          });
          break;
        case 'weight':
          this.$router.push({
            path: 'healthmonitor',
            query: {
              active: 4,
            },
          });
          break;
        case 'waistLine':
          this.$router.push({
            path: 'healthmonitor',
            query: {
              active: 5,
            },
          });
          break;
        case 'height':
          this.$router.push({
            path: 'healthmonitor',
            query: {
              active: 6,
            },
          });
          break;
        case 'bmi':
          this.$router.push({
            path: 'healthmonitor',
            query: {
              active: 7,
            },
          });
          break;
        case 'boneDensity':
          this.$router.push({
            path: 'healthmonitor',
            query: {
              active: 8,
            },
          });
          break;
        default:
          break;
      }
    },
  },
};
</script>
<style lang="scss" scoped>
p {
  margin: 0;
}
.fff {
  background: #fff;
}
.healthMonitorList {
  position: relative;
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
  .hmList {
    padding: 20px 3.4%;
    // margin-top: 44px;
    background: #fff;
    overflow: hidden;
  }
  .hmLi {
    position: relative;
    float: left;
    width: 43.4%;
    margin: 0 3.3%;
    padding: 17px 16px 19px;
    margin-bottom: 20px;
    font-size: 0;
    box-shadow: 0 5px 25px 0 rgba(0, 0, 0, 0.08);
    border-radius: 8px;
    img {
      position: absolute;
      left: 16px;
      top: 16px;
      width: 24px;
      display: block;
    }
    .hmTitle {
      margin-bottom: 24px;
      text-align: right;
      line-height: 22px;
      font-size: 16px;
      color: #333333;
    }
    .hmNum {
      margin-bottom: 4px;
      line-height: 17px;
      font-size: 12px;
      color: #999999;
      span {
        margin-right: 2px;
        line-height: 22px;
        font-size: 16px;
        color: #111111;
      }
    }
    .hmTip {
      line-height: 17px;
      font-size: 12px;
      color: #999999;
    }
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
