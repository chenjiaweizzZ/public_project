//健康监测
<template>
  <div class="medicalcarebox7">
    <van-notice-bar
      wrapable
      :scrollable="false"
      :text="patientName + ' ' + age + ' 岁 ' + sex + ' ' + phone"
    />
    <van-tabs v-model="active" color="#1C97FC" title-active-color="#1C97FC">
      <van-tab title="体温">
        <div>
          <div class="item-title van-hairline--bottom">最近一次体温记录</div>
          <div class="item-content">
            <div class="healthNum">
              <div class="hnOne">
                <p v-if="list.temperature.length">
                  <span>
                    {{
                    this.list.temperature
                    ? list.temperature[0].bodyTemperature
                    : ""
                    }}
                  </span>℃
                </p>
                <p v-else>-</p>
                <span>体温</span>
              </div>
            </div>
          </div>
        </div>
        <div class="location">
          <div class="locationx">
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="time1"
                :options="timelist"
                @change="timefu('temperature', time1)"
              />
            </van-dropdown-menu>
          </div>
          <div class="item-title">健康趋势</div>
          <div class="table">
            <ve-line :data="chartDataTemperature" :settings="chartSettingsTemperature"></ve-line>
          </div>
        </div>
        <div class="listbox">
          <div class="item-title van-hairline--bottom">体温数据列表</div>
          <div v-for="(item, index) in list.temperature" :key="index" class="list">
            <div>
              <p>{{ item.checkDatetime }}</p>
              <span v-if="item.state == 0" style="color: #32ae57">正常</span>
              <span v-else style="color: #ff5f4e">
                {{
                item.warningContent ? item.warningContent : "异常"
                }}
              </span>
            </div>
            <p>
              <span>体温(℃)</span>
              {{ item.bodyTemperature }}
            </p>
          </div>
        </div>
      </van-tab>
      <van-tab title="血压">
        <div>
          <div class="item-title van-hairline--bottom">最近一次血压记录</div>
          <div class="item-content">
            <div class="healthNum">
              <div class="hnOne">
                <p v-if="list.bloodPressure.length">
                  <span>
                    {{
                    list.bloodPressure
                    ? list.bloodPressure[0].bloodPressureH
                    : ""
                    }}
                  </span>mmHg
                </p>
                <p v-else>-</p>
                <span>收缩压</span>
              </div>
              <div class="hnOne">
                <p v-if="list.bloodPressure.length">
                  <span>
                    {{
                    list.bloodPressure
                    ? list.bloodPressure[0].bloodPressureL
                    : ""
                    }}
                  </span>mmHg
                </p>
                <p v-else>-</p>
                <span>舒张压</span>
              </div>
              <!-- <div class="hnOne">
                <p v-if="list.bloodPressure.length">
                  <span>
                    {{
                    list.bloodPressure ? list.bloodPressure[0].heartRate : ""
                    }}
                  </span>次/分
                </p>
                <p v-else>-</p>
                <span>心率</span>
              </div>-->
            </div>
          </div>
        </div>
        <div class="location">
          <div class="locationx">
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="time2"
                :options="timelist"
                @change="timefu('bloodPressure', time2)"
              />
            </van-dropdown-menu>
          </div>
          <div class="item-title">健康趋势</div>
          <div class="table">
            <ve-line :data="chartDataBloodPressure" :settings="chartSettingsBloodPressure"></ve-line>
            <!-- <ve-line :data="chartDataHeart" :settings="chartSettingsHeart"></ve-line> -->
          </div>
        </div>
        <div class="listbox">
          <div class="item-title van-hairline--bottom">血压数据列表</div>
          <div v-for="(item, index) in list.bloodPressure" :key="index" class="list">
            <div>
              <p>{{ item.checkDatetime }}</p>
              <span v-if="item.state == 0" style="color: #32ae57">正常</span>
              <span v-else style="color: #ff5f4e">
                {{
                item.warningContent ? item.warningContent : "异常"
                }}
              </span>
            </div>
            <p>
              <span>收缩压(mmHg)</span>
              {{ item.bloodPressureL }}
            </p>
            <p>
              <span>舒张压(mmHg)</span>
              {{ item.heartRate }}
            </p>
          </div>
        </div>
      </van-tab>
      <van-tab title="心率">
        <div>
          <div class="item-title van-hairline--bottom">最近一次心率记录</div>
          <div class="item-content">
            <div class="healthNum">
              <div class="hnOne">
                <p v-if="list.heartRate.length">
                  <span>
                    {{
                    list.heartRate ? list.heartRate[0].heartRate : ""
                    }}
                  </span>次/分
                </p>
                <p v-else>-</p>
                <span>心率</span>
              </div>
            </div>
          </div>
        </div>
        <div class="location">
          <div class="locationx">
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="time0"
                :options="timelist"
                @change="timefu('bloodPressure', time0)"
              />
            </van-dropdown-menu>
          </div>
          <div class="item-title">健康趋势</div>
          <div class="table">
            <ve-line :data="chartDataHeart" :settings="chartSettingsHeart"></ve-line>
          </div>
        </div>
        <div class="listbox">
          <div class="item-title van-hairline--bottom">心率数据列表</div>
          <div v-for="(item, index) in list.heartRate" :key="index" class="list">
            <div>
              <p>{{ item.checkDatetime }}</p>
              <span v-if="item.state == 0" style="color: #32ae57">正常</span>
              <span v-else style="color: #ff5f4e">
                {{
                item.warningContent ? item.warningContent : "异常"
                }}
              </span>
            </div>
            <p>
              <span>心率(次/分)</span>
              {{ item.heartRate }}
            </p>
          </div>
        </div>
      </van-tab>
      <van-tab title="血糖">
        <div>
          <div class="item-title van-hairline--bottom">最近一次血糖记录</div>
          <div class="item-content">
            <div class="healthNum">
              <div class="hnOne">
                <p v-if="list.bloodSugar.length">
                  <span>
                    {{
                    list.bloodSugar ? list.bloodSugar[0].bloodSugarBeforeMeal : ""
                    }}
                  </span>mmol/L
                </p>
                <p v-else>-</p>
                <span>餐前</span>
              </div>
              <div class="hnOne">
                <p v-if="list.bloodSugar.length">
                  <span>
                    {{
                    list.bloodSugar ? list.bloodSugar[0].bloodSugarAfterMeal : ""
                    }}
                  </span>mmol/L
                </p>
                <p v-else>-</p>
                <span>餐后</span>
              </div>
            </div>
          </div>
        </div>
        <div class="location">
          <div class="locationx">
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="time3"
                :options="timelist"
                @change="timefu('bloodSugar', time3)"
              />
            </van-dropdown-menu>
          </div>
          <div class="item-title">健康趋势</div>
          <div class="table">
            <ve-line :data="chartDataSugar" :settings="chartSettingsSuger"></ve-line>
          </div>
        </div>
        <div class="listbox">
          <div class="item-title van-hairline--bottom">血糖数据列表</div>
          <div v-for="(item, index) in list.bloodSugar" :key="index" class="list">
            <div>
              <p>{{ item.checkDatetime }}</p>
              <span v-if="item.state == 0" style="color: #32ae57">正常</span>
              <span v-else style="color: #ff5f4e">
                {{
                item.warningContent ? item.warningContent : "异常"
                }}
              </span>
            </div>
            <p>
              <span>餐前(mmol/L)</span>
              {{ item.bloodSugarBeforeMeal }}
            </p>
            <p>
              <span>餐后(mmol/L)</span>
              {{ item.bloodSugarAfterMeal }}
            </p>
          </div>
        </div>
      </van-tab>
      <van-tab title="血氧">
        <div>
          <div class="item-title van-hairline--bottom">最近一次血氧记录</div>
          <div class="item-content">
            <div class="healthNum">
              <div class="hnOne">
                <p v-if="this.list.spo2.length">
                  <span>{{ list.spo2 ? list.spo2[0].spo2 : "" }}</span>%
                </p>
                <p v-else>-</p>
                <span>浓度</span>
              </div>
            </div>
          </div>
        </div>
        <div class="location">
          <div class="locationx">
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="time4"
                :options="timelist"
                @change="timefu('spo2', time4)"
              />
            </van-dropdown-menu>
          </div>
          <div class="item-title">健康趋势</div>
          <div class="table">
            <ve-line :data="chartDataSpo2" :settings="chartSettingsSpo2"></ve-line>
          </div>
        </div>
        <div class="listbox">
          <div class="item-title van-hairline--bottom">血氧数据列表</div>
          <div v-for="(item, index) in list.spo2" :key="index" class="list">
            <div>
              <p>{{ item.checkDatetime }}</p>
              <span v-if="item.state == 0" style="color: #32ae57">正常</span>
              <span v-else style="color: #ff5f4e">
                {{
                item.warningContent ? item.warningContent : "异常"
                }}
              </span>
            </div>
            <p>
              <span>血氧(%)</span>
              {{ item.spo2 }}
            </p>
          </div>
        </div>
      </van-tab>
      <van-tab title="身高">
        <div>
          <div class="item-title van-hairline--bottom">最近一次身高记录</div>
          <div class="item-content">
            <div class="healthNum">
              <div class="hnOne">
                <p v-if="this.list.height.length">
                  <span>{{ list.height ? list.height[0].height : "" }}</span>cm
                </p>
                <p v-else>-</p>
                <span>身高</span>
              </div>
            </div>
          </div>
        </div>
        <div class="location">
          <div class="locationx">
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="time5"
                :options="timelist"
                @change="timefu('height', time5)"
              />
            </van-dropdown-menu>
          </div>
          <div class="item-title">健康趋势</div>
          <div class="table">
            <ve-line :data="chartDataHeight" :settings="chartSettingsHeight"></ve-line>
          </div>
        </div>
        <div class="listbox">
          <div class="item-title van-hairline--bottom">身高数据列表</div>
          <div v-for="(item, index) in list.height" :key="index" class="list">
            <div>
              <p>{{ item.checkDatetime }}</p>
              <span v-if="item.state == 0" style="color: #32ae57">正常</span>
              <span v-else style="color: #ff5f4e">
                {{
                item.warningContent ? item.warningContent : "异常"
                }}
              </span>
            </div>
            <p>
              <span>身高(cm)</span>
              {{ item.height }}
            </p>
          </div>
        </div>
      </van-tab>
      <van-tab title="体重">
        <div>
          <div class="item-title van-hairline--bottom">最近一次体重记录</div>
          <div class="item-content">
            <div class="healthNum">
              <div class="hnOne">
                <p v-if="this.list.weight.length">
                  <span>{{ list.weight ? list.weight[0].weight : "" }}</span>kg
                </p>
                <p v-else>-</p>
                <span>体重</span>
              </div>
            </div>
          </div>
        </div>
        <div class="location">
          <div class="locationx">
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="time6"
                :options="timelist"
                @change="timefu('weight', time6)"
              />
            </van-dropdown-menu>
          </div>
          <div class="item-title">健康趋势</div>
          <div class="table">
            <ve-line :data="chartDataWeight" :settings="chartSettingsWeight"></ve-line>
          </div>
        </div>
        <div class="listbox">
          <div class="item-title van-hairline--bottom">体重数据列表</div>
          <div v-for="(item, index) in list.weight" :key="index" class="list">
            <div>
              <p>{{ item.checkDatetime }}</p>
              <span v-if="item.state == 0" style="color: #32ae57">正常</span>
              <span v-else style="color: #ff5f4e">
                {{
                item.warningContent ? item.warningContent : "异常"
                }}
              </span>
            </div>
            <p>
              <span>体重(kg)</span>
              {{ item.weight }}
            </p>
          </div>
        </div>
      </van-tab>
      <van-tab title="BMI">
        <div>
          <div class="item-title van-hairline--bottom">最近一次BMI记录</div>
          <div class="item-content">
            <div class="healthNum">
              <div class="hnOne">
                <p v-if="this.list.bmi.length">
                  <span>{{ list.bmi ? list.bmi[0].bmi : "" }}</span>
                </p>
                <p v-else>-</p>
                <span>BMI</span>
              </div>
            </div>
          </div>
        </div>
        <div class="location">
          <div class="locationx">
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="time7"
                :options="timelist"
                @change="timefu('bmi', time7)"
              />
            </van-dropdown-menu>
          </div>
          <div class="item-title">健康趋势</div>
          <div class="table">
            <ve-line :data="chartDataBmi" :settings="chartSettingsBmi"></ve-line>
          </div>
        </div>
        <div class="listbox">
          <div class="item-title van-hairline--bottom">BMI数据列表</div>
          <div v-for="(item, index) in list.bmi" :key="index" class="list">
            <div>
              <p>{{ item.checkDatetime }}</p>
              <span v-if="item.state == 0" style="color: #32ae57">正常</span>
              <span v-else style="color: #ff5f4e">
                {{
                item.warningContent ? item.warningContent : "异常"
                }}
              </span>
            </div>
            <p>
              <span>BMI</span>
              {{ item.bmi }}
            </p>
          </div>
        </div>
      </van-tab>
      <van-tab title="腰围">
        <div>
          <div class="item-title van-hairline--bottom">最近一次腰围记录</div>
          <div class="item-content">
            <div class="healthNum">
              <div class="hnOne">
                <p v-if="this.list.waistLine.length">
                  <span>{{ list.waistLine ? list.waistLine[0].waistLine : "" }}</span>cm
                </p>
                <p v-else>-</p>
                <span>腰围</span>
              </div>
            </div>
          </div>
        </div>
        <div class="location">
          <div class="locationx">
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="time8"
                :options="timelist"
                @change="timefu('waistLine', time8)"
              />
            </van-dropdown-menu>
          </div>
          <div class="item-title">健康趋势</div>
          <div class="table">
            <ve-line :data="chartDataWaistLine" :settings="chartSettingsWaistLine"></ve-line>
          </div>
        </div>
        <div class="listbox">
          <div class="item-title van-hairline--bottom">腰围数据列表</div>
          <div v-for="(item, index) in list.waistLine" :key="index" class="list">
            <div>
              <p>{{ item.checkDatetime }}</p>
              <span v-if="item.state == 0" style="color: #32ae57">正常</span>
              <span v-else style="color: #ff5f4e">
                {{
                item.warningContent ? item.warningContent : "异常"
                }}
              </span>
            </div>
            <p>
              <span>腰围(cm)</span>
              {{ item.waistLine }}
            </p>
          </div>
        </div>
      </van-tab>
      <van-tab title="骨密度">
        <div>
          <div class="item-title van-hairline--bottom">最近一次骨密度记录</div>
          <div class="item-content">
            <div class="healthNum">
              <div class="hnOne">
                <p v-if="this.list.boneDensity.length">
                  <span>{{ list.boneDensity ? list.boneDensity[0].checkResult : "" }}</span>
                </p>
                <p v-else>-</p>
                <span>骨密度</span>
              </div>
            </div>
          </div>
        </div>
        <div class="location">
          <div class="locationx">
            <van-dropdown-menu>
              <van-dropdown-item
                v-model="time9"
                :options="timelist"
                @change="timefu('boneDensity', time9)"
              />
            </van-dropdown-menu>
          </div>
          <div class="item-title">健康趋势</div>
          <div class="table">
            <ve-line :data="chartDataBoneDensity" :settings="chartSettingsCheckResult"></ve-line>
          </div>
        </div>
        <div class="listbox">
          <div class="item-title van-hairline--bottom">骨密度数据列表</div>
          <div v-for="(item, index) in list.boneDensity" :key="index" class="list">
            <div>
              <p>{{ item.checkDatetime }}</p>
              <span v-if="item.state == 0" style="color: #32ae57">正常</span>
              <span v-else style="color: #ff5f4e">
                {{
                item.warningContent ? item.warningContent : "异常"
                }}
              </span>
            </div>
            <p>
              <span>骨密度</span>
              {{ item.checkResult }}
            </p>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    this.chartSettingsBloodPressure = {
      labelMap: {
        bloodPressureL: '舒张压',
        bloodPressureH: '收缩压',
      },
    }
    this.chartSettingsHeart = {
      labelMap: {
        heartRate: '心率',
      },
    }
    this.chartSettingsSuger = {
      labelMap: {
        bloodSugarBeforeMeal: '餐前',
        bloodSugarAfterMeal: '餐后',
      },
    }
    this.chartSettingsSpo2 = {
      labelMap: {
        spo2: '血氧',
      },
    }
    this.chartSettingsTemperature = {
      labelMap: {
        bodyTemperature: '体温',
      },
    }
    this.chartSettingsHeight = {
      labelMap: {
        height: '身高',
      },
    }
    this.chartSettingsWeight = {
      labelMap: {
        weight: '体重',
      },
    }
    this.chartSettingsBmi = {
      labelMap: {
        bmi: 'BMI',
      },
    }
    this.chartSettingsWaistLine = {
      labelMap: {
        waistLine: '腰围',
      },
    }
    this.chartSettingsCheckResult = {
      labelMap: {
        checkResult: '骨密度',
      },
    }
    return {
      time0: 0,
      time1: 0,
      time2: 0,
      time3: 0,
      time4: 0,
      time5: 0,
      time6: 0,
      time7: 0,
      time8: 0,
      time9: 0,
      timelist: [
        { text: '全部', value: 0 },
        { text: '近一周', value: 1 },
        { text: '近一月', value: 2 },
        { text: '近三月', value: 3 },
        { text: '近半年', value: 4 },
      ],
      chartDataTemperature: {
        columns: ['checkDatetime', 'bodyTemperature'],
        rows: [],
      },
      chartDataBloodPressure: {
        columns: ['checkDatetime', 'bloodPressureL', 'bloodPressureH'],
        rows: [],
      },
      chartDataHeart: {
        columns: ['checkDatetime', 'heartRate'],
        rows: [],
      },
      chartDataSugar: {
        columns: [
          'checkDatetime',
          'bloodSugarBeforeMeal',
          'bloodSugarAfterMeal',
        ],
        rows: [],
      },
      chartDataSpo2: {
        columns: ['checkDatetime', 'spo2'],
        rows: [],
      },
      chartDataHeight: {
        columns: ['checkDatetime', 'height'],
        rows: [],
      },
      chartDataWeight: {
        columns: ['checkDatetime', 'weight'],
        rows: [],
      },
      chartDataBmi: {
        columns: ['checkDatetime', 'bmi'],
        rows: [],
      },
      chartDataWaistLine: {
        columns: ['checkDatetime', 'waistLine'],
        rows: [],
      },
      chartDataBoneDensity: {
        columns: ['checkDatetime', 'checkResult'],
        rows: [],
      },
      active: 0,
      patientName: this.$route.query.patientName,
      age: this.$route.query.age,
      sex: this.$route.query.sex,
      phone: this.$route.query.phone,
      userId: this.$route.query.userId,
      flupName: this.$route.query.flupName,
      flupId: this.$route.query.flupId,
      serialNo: this.$route.query.serialNo,
      list: {
        spo2: [],
        bloodSugar: [],
        bloodPressure: [],
        heartRate: [],
        temperature: [],
        height: [],
        weight: [],
        bmi: [],
        waistLine: [],
        boneDensity: [],
      },
    }
  },
  watch: {},
  mounted() {
    this.$apis
      .queryTelemonitorDataByUserId({
        userId: this.userId,
        // planId: this.serialNo,
        // range: 'bloodPressure|spo2|bloodSugar|temperature' ,
        range:
          'bloodPressure|heartRate|spo2|bloodSugar|temperature|height|weight|bmi|waistLine|boneDensity',
        scope: this.time,
      })
      .then((res) => {
        this.list = res.retData
        this.chartDataTemperature.rows = this.list.temperature
        this.chartDataBloodPressure.rows = this.list.bloodPressure
        this.chartDataHeart.rows = this.list.heartRate
        this.chartDataSugar.rows = this.list.bloodSugar
        this.chartDataSpo2.rows = this.list.spo2
        this.chartDataHeight.rows = this.list.height
        this.chartDataWeight.rows = this.list.weight
        this.chartDataBmi.rows = this.list.bmi
        this.chartDataWaistLine.rows = this.list.waistLine
        this.chartDataBoneDensity.rows = this.list.boneDensity
      })
  },
  methods: {
    timefu(sort, timex) {
      this.$apis
        .queryTelemonitorDataByUserId({
          userId: this.userId,
          // range: 'bloodPressure|spo2|bloodSugar|temperature',
          range:
            'bloodPressure|heartRate|spo2|bloodSugar|temperature|height|weight|bmi|waistLine|boneDensity',
          scope: timex,
        })
        .then((res) => {
          switch (sort) {
            case 'temperature':
              this.list.temperature = res.retData.temperature
              this.chartDataTemperature.rows = this.list.temperature
              break
            case 'bloodPressure':
              this.list.bloodPressure = res.retData.bloodPressure
              this.chartDataBloodPressure.rows = this.list.bloodPressure
              break
            case 'heartRate':
              this.list.heartRate = res.retData.heartRate
              this.chartDataHeart.rows = this.list.heartRate
              break
            case 'bloodSugar':
              this.list.bloodSugar = res.retData.bloodSugar
              this.chartDataSugar.rows = this.list.bloodSugar
              break
            case 'spo2':
              this.list.spo2 = res.retData.spo2
              this.chartDataSpo2.rows = this.list.spo2
              break
            case 'height':
              this.list.height = res.retData.height
              this.chartDataHeight.rows = this.list.height
              break
            case 'weight':
              this.list.weight = res.retData.weight
              this.chartDataWeight.rows = this.list.weight
              break
            case 'bmi':
              this.list.bmi = res.retData.bmi
              this.chartDataBmi.rows = this.list.bmi
              break
            case 'waistLine':
              this.list.waistLine = res.retData.waistLine
              this.chartDataWaistLine.rows = this.list.waistLine
              break
            case 'boneDensity':
              this.list.boneDensity = res.retData.boneDensity
              this.chartDataBoneDensity.rows = this.list.boneDensity
              break
          }
        })
    },
  },
}
</script>

<style lang="scss" >
.medicalcarebox7 {
  .location {
    position: relative;
    .locationx {
      position: absolute;
      top: 0;
      right: 20px;
      z-index: 99;
    }
  }
  .van-notice-bar--wrapable .van-notice-bar__content {
    margin: 0 auto;
  }
  .fff {
    background-color: #fff;
    padding-bottom: 80px;
  }
  .healthmonitor {
    position: relative;
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
        background: #fff url('../assets/images/back.png') no-repeat;
        background-size: contain;
      }
    }
    .van-tabs {
      // margin-top: 44px;
    }
  }
  .item-title {
    position: relative;
    height: 46px;
    font-size: 17px;
    color: #333;
    background-color: #fff;
    margin-top: 8px;
    padding-left: 25px;
    line-height: 46px;
    &::before {
      position: absolute;
      left: 14px;
      top: 15px;
      bottom: 15px;
      width: 4px;
      background-color: #1c97fc;
      border-radius: 1.5px;
      content: '';
    }
  }
  .item-content {
    margin-bottom: 10px;
    padding-top: 18px;
    background-color: #fff;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    .value {
      font-size: 28px;
      color: #1c97fc;
    }
    type {
      font-size: 14px;
      color: #333;
    }
  }
  .healthNum {
    display: flex;
    margin-bottom: 20px;
    width: 100%;
  }
  .hnOne {
    flex-grow: 1;
    text-align: center;
    p {
      margin-bottom: 6px;
      line-height: 20px;
      font-size: 14px;
      color: #666666;
      letter-spacing: 0.17px;
      span {
        margin-right: 3px;
        line-height: 34px;
        font-size: 28px;
        color: #1c97fc;
        letter-spacing: 0.35px;
      }
    }
    span {
      margin-bottom: 10px;
      line-height: 20px;
      font-size: 14px;
      color: #333333;
      letter-spacing: 0.2px;
    }
  }
  .table {
    background: #fff;
  }
  .bpInputArea {
    position: relative;
    .block {
      z-index: 9;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      background: rgba($color: #fff, $alpha: 0.7);
    }
    .van-switch {
      z-index: 90;
      position: absolute;
      right: 3.75%;
      top: 20px;
    }
  }
  .hnBtn {
    margin-bottom: 16px;
    padding: 7px 14px;
    padding-left: 34px;
    border: 1px solid #1c97fc;
    border-radius: 4px;
    line-height: 20px;
    font-size: 15px;
    color: #1c97fc;
    letter-spacing: 0.2px;
    background: #fff url('../assets/images/edit.png') no-repeat 14px;
    background-size: 14px;
  }
  .upload-header {
    color: #333;
    font-size: 17px;
    line-height: 46px;
    padding: 0 14px;
    background-color: #fff;
  }
  .upload-content {
    background-color: #fff;
  }
  .bindDevices {
    position: relative;
    padding: 12px 12%;
    line-height: 22px;
    font-size: 16px;
    color: #333333;
    background: #fff url('../assets/images/bindDevices.png') no-repeat 3.75%;
    background-size: 20px;
    u {
      position: absolute;
      right: 3.75%;
      top: 50%;
      transform: translate(0, -50%);
      display: block;
      width: 16px;
      height: 16px;
      background: url('../assets/images/enter.png') no-repeat;
      background-size: contain;
    }
  }
  .numArea {
    position: relative;
    padding: 30px 0 15px;
    .naTitle {
      position: absolute;
      left: 3.75%;
      bottom: 15px;
      line-height: 20px;
      font-size: 14px;
      color: #666666;
    }
    p {
      line-height: 20px;
      font-size: 14px;
      color: #666666;
      text-align: center;
      span {
        font-size: 28px;
        color: #111111;
        letter-spacing: 0.35px;
        line-height: 34px;
      }
    }
  }
  .bottomBtn {
    position: fixed;
    bottom: 40px;
    left: 5%;
    background: #1c97fc;
    border-radius: 4px;
    width: 90%;
    padding: 11px;
    line-height: 24px;
    font-size: 17px;
    color: #ffffff;
    letter-spacing: 0.2px;
    text-align: center;
  }
  .sugarBtns {
    margin: 15px 0;
    text-align: center;
    overflow: hidden;
    div {
      display: inline-block;
      margin: 0 15px;
      padding: 5px 30px;
      line-height: 24px;
      font-size: 14px;
      color: #666;
      border: 1px solid #ccc;
      border-radius: 50px;
    }
    .hasClick {
      color: #1c97fc;
      border: 1px solid #1c97fc;
    }
  }
  .listbox {
    width: 100%;
    .list {
      width: 100%;
      padding: 3.7%;
      background-color: #fff;
      border-bottom: 5px solid #f2f2f2;
      > div {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      p {
        font-size: 15px;
        color: #666666;
        letter-spacing: 0.2px;
        line-height: 35px;
        span {
          width: 120px;
          display: inline-block;
          color: #666666;
        }
      }
      > p {
        color: #111;
      }
    }
  }
}
</style>