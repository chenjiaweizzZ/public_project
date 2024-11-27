<template>
  <section ref="section" class="healthmonitor">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      健康监测
    </div>-->
    <!-- 切换就诊人的模块 -->
    <div class="patientChoose">
      <span>就诊人</span>
      <span class="patientId" @click="choosePatient()">{{ patient.text }}</span>
    </div>
    <van-tabs v-model="active" color="#1C97FC" title-active-color="#1C97FC">
      <van-tab title="体温">
        <template v-if="!showUpload">
          <div class="bindDevices" @click="bindDevice()">
            <u></u>
            绑定设备
          </div>
          <div>
            <div class="item-title van-hairline--bottom">最近一次体温记录</div>
            <div class="item-content">
              <div class="healthNum">
                <div class="hnOne">
                  <p v-if="
                      temperatureList.temperature &&
                      temperatureList.temperature.length
                    ">
                    <span>{{ temperatureList.temperature ? temperatureList.temperature[ temperatureList.temperature.length - 1 ].bodyTemperature : "" }}</span>
                    {{ temperatureList.temperature ? temperatureList.temperature[ temperatureList.temperature.length - 1 ].temperatureUnit : "" }}
                  </p>
                  <p v-else>-</p>
                  <span>体温</span>
                </div>
              </div>
              <div class="hnBtn" @click="showUpload = true">录入数据</div>
            </div>
          </div>
          <div>
            <div class="item-title">健康趋势</div>
            <div class="table">
              <ve-line :data="chartDataTemperature" :settings="chartSettingsTemperature"></ve-line>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="fff">
            <div class="upload-header van-hairline--bottom">录入数据</div>
            <div class="upload-content">
              <div class="numArea">
                <span class="naTitle">体温</span>
                <p>
                  <span>{{ NumValue }}</span>
                  {{units.BodyTemperature}}
                </p>
              </div>
            </div>
            <cs-ruler
              @post-NumValue="rulerNum"
              :NowNum="
                temperatureList.temperature.length
                  ? temperatureList.temperature[temperatureList.temperature.length - 1].bodyTemperature * 10
                  : 0
              "
              :maxNum="500"
              :minNum="350"
              :numSize="24"
              :ruleWidth="80"
              ispoint
              pointerColor="#1C97FC"
            ></cs-ruler>
            <van-cell-group class="flex1 personalFilesTop">
              <van-field readonly clickable required label="测量日期" v-model="inputDate" placeholder="请选择" @click="chooseTime('date')" />
              <van-field readonly clickable required label="测量时间" v-model="currentTime" placeholder="请选择" @click="chooseTime('time')" />
              <van-popup v-model="showPicker" position="bottom">
                <div v-if="this.type == 'date'">
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
                </div>
                <div v-else>
                  <van-datetime-picker v-model="currentTime" type="time" title="选择时间" :min-hour="10" :max-hour="20" @confirm="confirmPickerB" />
                </div>
              </van-popup>
            </van-cell-group>
          </div>
          <div class="bottomBtn" @click="save('temperature')">保存</div>
        </template>
      </van-tab>
      <van-tab title="血压">
        <template v-if="!showUpload">
          <div class="bindDevices" @click="bindDevice()">
            <u></u>
            绑定设备
          </div>
          <div>
            <div class="item-title van-hairline--bottom">最近一次血压记录</div>
            <div class="item-content">
              <div class="healthNum">
                <div class="hnOne">
                  <p v-if="
                      bloodPressureList.bloodPressure &&
                      bloodPressureList.bloodPressure.length
                    ">
                    <span>{{ bloodPressureList.bloodPressure ? bloodPressureList.bloodPressure[ bloodPressureList.bloodPressure.length - 1 ].bloodPressureH : "" }}</span>
                    {{ bloodPressureList.bloodPressure ? bloodPressureList.bloodPressure[ bloodPressureList.bloodPressure.length - 1 ].bloodPressureUnit : "" }}
                  </p>
                  <p v-else>-</p>
                  <span>收缩压</span>
                </div>
                <div class="hnOne">
                  <p v-if="
                      bloodPressureList.bloodPressure &&
                      bloodPressureList.bloodPressure.length
                    ">
                    <span>{{ bloodPressureList.bloodPressure ? bloodPressureList.bloodPressure[ bloodPressureList.bloodPressure.length - 1 ].bloodPressureL : "" }}</span>
                    {{ bloodPressureList.bloodPressure ? bloodPressureList.bloodPressure[ bloodPressureList.bloodPressure.length - 1 ].bloodPressureUnit : "" }}
                  </p>
                  <p v-else>-</p>
                  <span>舒张压</span>
                </div>
                <div class="hnOne">
                  <p v-if="
                      bloodPressureList.bloodPressure &&
                      bloodPressureList.bloodPressure.length
                    ">
                    <span>{{ bloodPressureList.bloodPressure ? bloodPressureList.bloodPressure[ bloodPressureList.bloodPressure.length - 1 ].heartRate : "" }}</span>
                    {{ bloodPressureList.bloodPressure ? bloodPressureList.bloodPressure[ bloodPressureList.bloodPressure.length - 1 ].heartRateUnit : "" }}
                  </p>
                  <p v-else>-</p>
                  <span>心率</span>
                </div>
              </div>
              <div class="hnBtn" @click="showUpload = true">录入数据</div>
            </div>
          </div>
          <div>
            <div class="item-title">健康趋势</div>
            <div class="table">
              <ve-line :data="chartData" :settings="chartSettings"></ve-line>
              <ve-line :data="chartDataHeart" :settings="chartSettingsHeart"></ve-line>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="fff">
            <div class="upload-header van-hairline--bottom">录入数据</div>
            <div class="bpInputArea">
              <div class="block" v-show="!checkedA"></div>
              <van-switch v-model="checkedA" />
              <div class="upload-content">
                <div class="numArea">
                  <span class="naTitle">收缩压</span>
                  <p>
                    <span>{{ ssyNumValue }}</span>
                    {{units.BloodPressure}}
                  </p>
                </div>
              </div>
              <cs-ruler
                @post-NumValue="ssyRulerNum"
                :NowNum="
                  bloodPressureList.bloodPressure.length
                    ? bloodPressureList.bloodPressure[bloodPressureList.bloodPressure.length-1].bloodPressureH * 10
                    : 0
                "
                :maxNum="3000"
                :minNum="300"
                :numSize="24"
                :ruleWidth="80"
                ispoint
                pointerColor="#1C97FC"
              ></cs-ruler>
              <div class="upload-content">
                <div class="numArea">
                  <span class="naTitle">舒张压</span>
                  <p>
                    <span>{{ szyNumValue }}</span>
                    {{units.BloodPressure}}
                  </p>
                </div>
              </div>
              <cs-ruler
                @post-NumValue="szyRulerNum"
                :NowNum="
                  bloodPressureList.bloodPressure.length
                    ? bloodPressureList.bloodPressure[bloodPressureList.bloodPressure.length-1].bloodPressureL * 10
                    : 0
                "
                :maxNum="2000"
                :minNum="0"
                :numSize="24"
                :ruleWidth="80"
                ispoint
                pointerColor="#1C97FC"
              ></cs-ruler>
            </div>
            <div class="bpInputArea">
              <div class="block" v-show="!checkedB"></div>
              <van-switch v-model="checkedB" />
              <div class="upload-content">
                <div class="numArea">
                  <span class="naTitle">心率</span>
                  <p>
                    <span>{{ heartNumValue }}</span>次/分
                  </p>
                </div>
              </div>
              <cs-ruler
                @post-NumValue="heartRulerNum"
                :NowNum="
                  bloodPressureList.bloodPressure.length
                    ? bloodPressureList.bloodPressure[ bloodPressureList.bloodPressure.length-1].heartRate
                    : 0
                "
                :maxNum="230"
                :minNum="20"
                :numSize="24"
                :ruleWidth="80"
                pointerColor="#1C97FC"
              ></cs-ruler>
            </div>
            <van-cell-group class="flex1 personalFilesTop">
              <van-field readonly clickable required label="测量日期" v-model="inputDate" placeholder="请选择" @click="chooseTime('date')" />
              <van-field readonly clickable required label="测量时间" v-model="currentTime" placeholder="请选择" @click="chooseTime('time')" />
              <van-popup v-model="showPicker" position="bottom">
                <div v-if="this.type == 'date'">
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
                </div>
                <div v-else>
                  <van-datetime-picker v-model="currentTime" type="time" title="选择时间" :min-hour="10" :max-hour="20" @confirm="confirmPickerB" />
                </div>
              </van-popup>
            </van-cell-group>
          </div>
          <div class="bottomBtn" @click="save('bloodPressure')">保存</div>
        </template>
      </van-tab>
      <van-tab title="血糖">
        <template v-if="!showUpload">
          <div class="bindDevices" @click="bindDevice()">
            <u></u>
            绑定设备
          </div>
          <div>
            <div class="item-title van-hairline--bottom">最近一次血糖记录</div>
            <div class="item-content">
              <div class="healthNum">
                <div class="hnOne">
                  <p v-if="sugarList.bloodSugar && sugarList.bloodSugar.length">
                    <span>{{ sugarList.bloodSugar ? sugarList.bloodSugar[sugarList.bloodSugar.length - 1] .bloodSugarBeforeMeal : "" }}</span>
                    {{ sugarList.bloodSugar ? sugarList.bloodSugar[sugarList.bloodSugar.length - 1] .sugarUnit : "" }}
                  </p>
                  <p v-else>-</p>
                  <span>餐前</span>
                </div>
                <div class="hnOne">
                  <p v-if="sugarList.bloodSugar && sugarList.bloodSugar.length">
                    <span>{{ sugarList.bloodSugar ? sugarList.bloodSugar[sugarList.bloodSugar.length - 1] .bloodSugarAfterMeal : "" }}</span>
                    {{ sugarList.bloodSugar ? sugarList.bloodSugar[sugarList.bloodSugar.length - 1] .sugarUnit : "" }}
                  </p>
                  <p v-else>-</p>
                  <span>餐后</span>
                </div>
                <div class="hnOne">
                  <p v-if="sugarList.bloodSugar && sugarList.bloodSugar.length">
                    <span>{{ sugarList.bloodSugar ? sugarList.bloodSugar[sugarList.bloodSugar.length - 1] .bloodSugar : "" }}</span>
                    {{ sugarList.bloodSugar ? sugarList.bloodSugar[sugarList.bloodSugar.length - 1] .sugarUnit : "" }}
                  </p>
                  <p v-else>-</p>
                  <span>随机</span>
                </div>
              </div>
              <div
                class="hnBtn"
                @click="
                  showUpload = true;
                  sugarNowNum = sugarList.bloodSugar.length
                    ? sugarList.bloodSugar[sugarList.bloodSugar.length-1].bloodSugarAfterMeal * 10
                    : 0;
                "
              >录入数据</div>
            </div>
          </div>
          <div>
            <div class="item-title">健康趋势</div>
            <div class="table">
              <ve-line :data="chartDataSugar" :settings="chartSettingsSuger"></ve-line>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="fff">
            <div class="upload-header van-hairline--bottom">录入数据</div>
            <div class="upload-content">
              <div class="numArea">
                <p>
                  <span>{{ sugarNumValue }}</span>
                  {{units.BloodSugar}}
                </p>
              </div>
            </div>
            <cs-ruler @post-NumValue="sugarRulerNum" :NowNum="sugarNowNum" :maxNum="200" :minNum="10" :numSize="24" :ruleWidth="80" ispoint pointerColor="#1C97FC"></cs-ruler>
            <div class="sugarBtns">
              <div :class="{ hasClick: beforeDinner }" @click="swithDinner('before')">餐前</div>
              <div :class="{ hasClick: afterDinner }" @click="swithDinner('after')">餐后</div>
              <div :class="{ hasClick: randOm }" @click="swithDinner('random')">随机</div>
            </div>
            <!-- <div class="upload-content">
              <div class="numArea">
                <span class="naTitle">餐后血糖</span>
                <p>
                  <span>{{ chNumValue }}</span
                  >mmHg
                </p>
              </div>
            </div>
            <cs-ruler
              @post-NumValue="chRulerNum"
              :NowNum="
                sugarList.bloodSugar.length
                  ? sugarList.bloodSugar[0].bloodSugarAfterMeal * 10
                  : 0
              "
              :maxNum="200"
              :minNum="10"
              :numSize="24"
              :ruleWidth="80"
              ispoint
              pointerColor="#1C97FC"
            ></cs-ruler>-->
            <van-cell-group class="flex1 personalFilesTop">
              <van-field readonly clickable required label="测量日期" v-model="inputDate" placeholder="请选择" @click="chooseTime('date')" />
              <van-field readonly clickable required label="测量时间" v-model="currentTime" placeholder="请选择" @click="chooseTime('time')" />
              <van-popup v-model="showPicker" position="bottom">
                <div v-if="this.type == 'date'">
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
                </div>
                <div v-else>
                  <van-datetime-picker v-model="currentTime" type="time" title="选择时间" :min-hour="10" :max-hour="20" @confirm="confirmPickerB" />
                </div>
              </van-popup>
            </van-cell-group>
          </div>
          <div class="bottomBtn" @click="save('bloodSugar')">保存</div>
        </template>
      </van-tab>
      <van-tab title="血氧">
        <template v-if="!showUpload">
          <div class="bindDevices" @click="bindDevice()">
            <u></u>
            绑定设备
          </div>
          <div>
            <div class="item-title van-hairline--bottom">最近一次血氧记录</div>
            <div class="item-content">
              <div class="healthNum">
                <div class="hnOne">
                  <p v-if="spo2List.spo2 && spo2List.spo2.length">
                    <span>{{ spo2List.spo2 ? spo2List.spo2[spo2List.spo2.length - 1].spo2 : "" }}</span>
                    {{ spo2List.spo2 ? spo2List.spo2[spo2List.spo2.length - 1].spo2Unit : "" }}
                  </p>
                  <p v-else>-</p>
                  <span>浓度</span>
                </div>
              </div>
              <div class="hnBtn" @click="showUpload = true">录入数据</div>
            </div>
          </div>
          <div>
            <div class="item-title">健康趋势</div>
            <div class="table">
              <ve-line :data="chartDataSpo2" :settings="chartSettingsSpo2"></ve-line>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="fff">
            <div class="upload-header van-hairline--bottom">录入数据</div>
            <div class="upload-content">
              <div class="numArea">
                <span class="naTitle">血氧</span>
                <p>
                  <span>{{ spo2NumValue }}</span>
                  {{units.BloodSpo2}}
                </p>
              </div>
            </div>
            <cs-ruler
              @post-NumValue="spo2RulerNum"
              :NowNum="spo2List.spo2.length ? spo2List.spo2[spo2List.spo2.length-1].spo2 * 10 : 0"
              :maxNum="1000"
              :minNum="0"
              :numSize="24"
              :ruleWidth="80"
              ispoint
              pointerColor="#1C97FC"
            ></cs-ruler>
            <van-cell-group class="flex1 personalFilesTop">
              <van-field readonly clickable required label="测量日期" v-model="inputDate" placeholder="请选择" @click="chooseTime('date')" />
              <van-field readonly clickable required label="测量时间" v-model="currentTime" placeholder="请选择" @click="chooseTime('time')" />
              <van-popup v-model="showPicker" position="bottom">
                <div v-if="this.type == 'date'">
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
                </div>
                <div v-else>
                  <van-datetime-picker v-model="currentTime" type="time" title="选择时间" :min-hour="10" :max-hour="20" @confirm="confirmPickerB" />
                </div>
              </van-popup>
            </van-cell-group>
          </div>
          <div class="bottomBtn" @click="save('spo2')">保存</div>
        </template>
      </van-tab>
      <van-tab title="体重">
        <template v-if="!showUpload">
          <div class="bindDevices" @click="bindDevice()">
            <u></u>
            绑定设备
          </div>
          <div>
            <div class="item-title van-hairline--bottom">最近一次体重记录</div>
            <div class="item-content">
              <div class="healthNum">
                <div class="hnOne">
                  <p v-if="weightList.weight && weightList.weight.length">
                    <span>{{ weightList.weight ? weightList.weight[weightList.weight.length - 1] .weight : "" }}</span>
                    {{ weightList.weight ? weightList.weight[weightList.weight.length - 1] .resultUnit : "" }}
                  </p>
                  <p v-else>-</p>
                  <!-- <span>浓度</span> -->
                </div>
              </div>
              <div class="hnBtn" @click="showUpload = true">录入数据</div>
            </div>
          </div>
          <div>
            <div class="item-title">健康趋势</div>
            <div class="table">
              <ve-line :data="chartDataWeight" :settings="chartSettingsWeight"></ve-line>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="fff">
            <div class="upload-header van-hairline--bottom">录入数据</div>
            <div class="upload-content">
              <div class="numArea">
                <span class="naTitle">体重</span>
                <p>
                  <span>{{ weightNumValue }}</span>
                  {{units.Weight}}
                </p>
              </div>
            </div>
            <cs-ruler
              @post-NumValue="weightRulerNum"
              :NowNum="
                weightList.weight.length ? weightList.weight[weightList.weight.length-1].weight*10 : 0
              "
              :maxNum="3300"
              :minNum="0"
              :numSize="24"
              :ruleWidth="80"
              ispoint
              pointerColor="#1C97FC"
            ></cs-ruler>
            <van-cell-group class="flex1 personalFilesTop">
              <van-field readonly clickable required label="测量日期" v-model="inputDate" placeholder="请选择" @click="chooseTime('date')" />
              <van-field readonly clickable required label="测量时间" v-model="currentTime" placeholder="请选择" @click="chooseTime('time')" />
              <van-popup v-model="showPicker" position="bottom">
                <div v-if="this.type == 'date'">
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
                </div>
                <div v-else>
                  <van-datetime-picker v-model="currentTime" type="time" title="选择时间" :min-hour="10" :max-hour="20" @confirm="confirmPickerB" />
                </div>
              </van-popup>
            </van-cell-group>
          </div>
          <div class="bottomBtn" @click="save('weight')">保存</div>
        </template>
      </van-tab>
      <van-tab title="腰围">
        <template v-if="!showUpload">
          <div class="bindDevices" @click="bindDevice()">
            <u></u>
            绑定设备
          </div>
          <div>
            <div class="item-title van-hairline--bottom">最近一次腰围记录</div>
            <div class="item-content">
              <div class="healthNum">
                <div class="hnOne">
                  <p v-if="
                      waistLineList.waistLine && waistLineList.waistLine.length
                    ">
                    <span>{{ waistLineList.waistLine ? waistLineList.waistLine[ waistLineList.waistLine.length - 1 ].waistLine : "" }}</span>
                    {{ waistLineList.waistLine ? waistLineList.waistLine[ waistLineList.waistLine.length - 1 ].resultUnit : "" }}
                  </p>
                  <p v-else>-</p>
                </div>
              </div>
              <div class="hnBtn" @click="showUpload = true">录入数据</div>
            </div>
          </div>
          <div>
            <div class="item-title">健康趋势</div>
            <div class="table">
              <ve-line :data="chartDataWaistLine" :settings="chartSettingsWaistLine"></ve-line>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="fff">
            <div class="upload-header van-hairline--bottom">录入数据</div>
            <div class="upload-content">
              <div class="numArea">
                <span class="naTitle">腰围</span>
                <p>
                  <span>{{ waistLineNumValue }}</span>
                  {{units.WaistLine}}
                </p>
              </div>
            </div>
            <cs-ruler
              @post-NumValue="waistLineRulerNum"
              :NowNum="
                waistLineList.waistLine.length
                  ? waistLineList.waistLine[waistLineList.waistLine.length - 1].waistLine*10
                  : 0
              "
              :maxNum="2000"
              :minNum="0"
              :numSize="24"
              :ruleWidth="80"
              ispoint
              pointerColor="#1C97FC"
            ></cs-ruler>
            <van-cell-group class="flex1 personalFilesTop">
              <van-field readonly clickable required label="测量日期" v-model="inputDate" placeholder="请选择" @click="chooseTime('date')" />
              <van-field readonly clickable required label="测量时间" v-model="currentTime" placeholder="请选择" @click="chooseTime('time')" />
              <van-popup v-model="showPicker" position="bottom">
                <div v-if="this.type == 'date'">
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
                </div>
                <div v-else>
                  <van-datetime-picker v-model="currentTime" type="time" title="选择时间" :min-hour="10" :max-hour="20" @confirm="confirmPickerB" />
                </div>
              </van-popup>
            </van-cell-group>
          </div>
          <div class="bottomBtn" @click="save('waistLine')">保存</div>
        </template>
      </van-tab>
      <van-tab title="身高">
        <template v-if="!showUpload">
          <div class="bindDevices" @click="bindDevice()">
            <u></u>
            绑定设备
          </div>
          <div>
            <div class="item-title van-hairline--bottom">最近一次身高记录</div>
            <div class="item-content">
              <div class="healthNum">
                <div class="hnOne">
                  <p v-if="heightList.height && heightList.height.length">
                    <span>{{ heightList.height ? heightList.height[heightList.height.length - 1] .height : "" }}</span>
                    {{ heightList.height ? heightList.height[heightList.height.length - 1] .resultUnit : "" }}
                  </p>
                  <p v-else>-</p>
                </div>
              </div>
              <div class="hnBtn" @click="showUpload = true">录入数据</div>
            </div>
          </div>
          <div>
            <div class="item-title">健康趋势</div>
            <div class="table">
              <ve-line :data="chartDataHeight" :settings="chartSettingsHeight"></ve-line>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="fff">
            <div class="upload-header van-hairline--bottom">录入数据</div>
            <div class="upload-content">
              <div class="numArea">
                <span class="naTitle">身高</span>
                <p>
                  <span>{{ heightNumValue }}</span>
                  {{units.Height}}
                </p>
              </div>
            </div>
            <cs-ruler
              @post-NumValue="heightRulerNum"
              :NowNum="
                heightList.height.length ? heightList.height[heightList.height.length - 1].height*10 : 0
              "
              :maxNum="3000"
              :minNum="0"
              :numSize="24"
              :ruleWidth="80"
              ispoint
              pointerColor="#1C97FC"
            ></cs-ruler>
            <van-cell-group class="flex1 personalFilesTop">
              <van-field readonly clickable required label="测量日期" v-model="inputDate" placeholder="请选择" @click="chooseTime('date')" />
              <van-field readonly clickable required label="测量时间" v-model="currentTime" placeholder="请选择" @click="chooseTime('time')" />
              <van-popup v-model="showPicker" position="bottom">
                <div v-if="this.type == 'date'">
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
                </div>
                <div v-else>
                  <van-datetime-picker v-model="currentTime" type="time" title="选择时间" :min-hour="10" :max-hour="20" @confirm="confirmPickerB" />
                </div>
              </van-popup>
            </van-cell-group>
          </div>
          <div class="bottomBtn" @click="save('height')">保存</div>
        </template>
      </van-tab>
      <van-tab title="BMI">
        <template v-if="!showUpload">
          <div class="bindDevices" @click="bindDevice()">
            <u></u>
            绑定设备
          </div>
          <div>
            <div class="item-title van-hairline--bottom">最近一次BMI记录</div>
            <div class="item-content">
              <div class="healthNum">
                <div class="hnOne">
                  <p v-if="bmiList.bmi && bmiList.bmi.length">
                    <span>{{ bmiList.bmi ? bmiList.bmi[bmiList.bmi.length - 1].bmi : "" }}</span>
                    {{ bmiList.bmi ? bmiList.bmi[bmiList.bmi.length - 1].resultUnit : "" }}
                  </p>
                  <p v-else>-</p>
                </div>
              </div>
              <div class="hnBtn" @click="showUpload = true">录入数据</div>
            </div>
          </div>
          <div>
            <div class="item-title">健康趋势</div>
            <div class="table">
              <ve-line :data="chartDataBMI" :settings="chartSettingsBMI"></ve-line>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="fff">
            <div class="upload-header van-hairline--bottom">录入数据</div>
            <div class="upload-content">
              <div class="abc">
                最近身高:
                <van-stepper v-model.number="heightRecent" @change="updateBmi" min="0" step="0.1" :decimal-length="1" input-width="50px" button-size="26px" />最近体重:
                <van-stepper v-model.number="weightRecent" @change="updateBmi" min="0" max="300" step="0.1" input-width="50px" button-size="26px" />
              </div>
              <div class="numArea">
                <span class="naTitle">BMI指数</span>
                <p>
                  <span>{{ bmiLineNumValue }}</span>
                </p>
              </div>
            </div>
            <cs-ruler v-if="showBMI" @post-NumValue="bmiRulerNum" :NowNum="bmiRecent" :maxNum="1000" :minNum="0" :numSize="24" :ruleWidth="80" ispoint pointerColor="#1C97FC"></cs-ruler>
            <van-cell-group class="flex1 personalFilesTop">
              <van-field readonly clickable required label="测量日期" v-model="inputDate" placeholder="请选择" @click="chooseTime('date')" />
              <van-field readonly clickable required label="测量时间" v-model="currentTime" placeholder="请选择" @click="chooseTime('time')" />
              <van-popup v-model="showPicker" position="bottom">
                <div v-if="this.type == 'date'">
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
                </div>
                <div v-else>
                  <van-datetime-picker v-model="currentTime" type="time" title="选择时间" :min-hour="10" :max-hour="20" @confirm="confirmPickerB" />
                </div>
              </van-popup>
            </van-cell-group>
          </div>
          <div class="bottomBtn" @click="save('bmi')">保存</div>
        </template>
      </van-tab>
      <van-tab title="骨密度">
        <template v-if="!showUpload">
          <div class="bindDevices" @click="bindDevice()">
            <u></u>
            绑定设备
          </div>
          <div>
            <div class="item-title van-hairline--bottom">最近一次骨密度记录</div>
            <div class="item-content">
              <div class="healthNum">
                <div class="hnOne">
                  <p v-if="
                      boneDensityList.boneDensity &&
                      boneDensityList.boneDensity.length
                    ">
                    <span>{{ boneDensityList.boneDensity ? boneDensityList.boneDensity[ boneDensityList.boneDensity.length - 1 ].checkResult : "" }}</span>
                    {{ boneDensityList.boneDensity ? boneDensityList.boneDensity[ boneDensityList.boneDensity.length - 1 ].resultUnit : "" }}
                  </p>
                  <p v-else>-</p>
                </div>
              </div>
              <div class="hnBtn" @click="showUpload = true">录入数据</div>
            </div>
          </div>
          <div>
            <div class="item-title">健康趋势</div>
            <div class="table">
              <ve-line :data="chartDataboneDensity" :settings="chartSettingsBoneDensity"></ve-line>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="fff">
            <div class="upload-header van-hairline--bottom">录入数据</div>
            <div class="upload-content">
              <div class="numArea">
                <span class="naTitle">骨密度</span>
                <p>
                  <span>{{ boneDensityNumValue }}</span>
                </p>
              </div>
            </div>
            <cs-ruler
              @post-NumValue="boneDensityRulerNum"
              :NowNum="
                boneDensityList.boneDensity.length
                  ? boneDensityList.boneDensity[
                      boneDensityList.boneDensity.length - 1
                    ].checkResult*10
                  : 0
              "
              :maxNum="20"
              :minNum="-20"
              :numSize="24"
              :ruleWidth="50"
              ispoint
              pointerColor="#1C97FC"
            ></cs-ruler>
            <van-cell-group class="flex1 personalFilesTop">
              <van-field readonly clickable required label="测量日期" v-model="inputDate" placeholder="请选择" @click="chooseTime('date')" />
              <van-field readonly clickable required label="测量时间" v-model="currentTime" placeholder="请选择" @click="chooseTime('time')" />
              <van-popup v-model="showPicker" position="bottom">
                <div v-if="this.type == 'date'">
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
                </div>
                <div v-else>
                  <van-datetime-picker v-model="currentTime" type="time" title="选择时间" :min-hour="10" :max-hour="20" @confirm="confirmPickerB" />
                </div>
              </van-popup>
            </van-cell-group>
          </div>
          <div class="bottomBtn" @click="save('boneDensity')">保1存</div>
        </template>
      </van-tab>
    </van-tabs>
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
    this.chartSettings = {
      labelMap: {
        bloodPressureL: '舒张压',
        bloodPressureH: '收缩压',
      },
    };
    this.chartSettingsHeart = {
      labelMap: {
        heartRate: '心率',
      },
    };
    this.chartSettingsSuger = {
      labelMap: {
        bloodSugarBeforeMeal: '餐前',
        bloodSugarAfterMeal: '餐后',
        bloodSugar: '随机'
      },
    };
    this.chartSettingsSpo2 = {
      labelMap: {
        spo2: '血氧',
      },
    };
    this.chartSettingsTemperature = {
      labelMap: {
        bodyTemperature: '体温',
      },
    };
    this.chartSettingsWeight = {
      labelMap: {
        weight: '体重',
      },
    };
    this.chartSettingsHeight = {
      labelMap: {
        height: '身高',
      },
    };
    this.chartSettingsWaistLine = {
      labelMap: {
        waistLine: '腰围',
      },
    };
    this.chartSettingsBMI = {
      labelMap: {
        bmi: 'BMI',
      },
    };
    this.chartSettingsBoneDensity = {
      labelMap: {
        checkResult: '骨密度',
      },
    };
    return {
      showBMI: true,
      active: 0,
      showUpload: false,
      heartRate: '',
      bloodPressureH: '', //收缩压
      bloodPressureL: '', //舒张压
      bloodSugarBefore: '',
      bloodSugarAfter: '',
      spo2: '',
      list: [
        'temperature', //0
        'bloodPressure', //1
        'bloodSugar', //2
        'spo2', //3
        'bmi', //4
        'weight', //5
        'height', //6
        'waistLine', //7
        'boneDensity', //8
      ],
      upList: ['uploadBodyTemperatureData', 'uploadBloodPressureData', 'uploadBloodSugarDatas', 'uploadSpo2Data', 'uploadBmiData', 'uploadBoneDentisyData'],
      temperatureList: {},
      bloodPressureList: {},
      sugarList: {},
      spo2List: {},
      bmiList: {},
      heightList: {},
      weightList: {},
      waistLineList: {},
      boneDensityList: {},
      chartData: {
        columns: ['checkDatetime', 'bloodPressureL', 'bloodPressureH'],
        rows: [],
      },
      chartDataHeart: {
        columns: ['checkDatetime', 'heartRate'],
        rows: [],
      },
      chartDataSugar: {
        columns: ['checkDatetime', 'bloodSugarBeforeMeal', 'bloodSugarAfterMeal','bloodSugar'],
        rows: [],
      },
      chartDataSpo2: {
        columns: ['checkDatetime', 'spo2'],
        rows: [],
      },
      chartDataTemperature: {
        columns: ['checkDatetime', 'bodyTemperature'],
        rows: [],
      },
      chartDataBMI: {
        columns: ['checkDatetime', 'bmi'],
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
      chartDataWaistLine: {
        columns: ['checkDatetime', 'waistLine'],
        rows: [],
      },
      chartDataboneDensity: {
        columns: ['checkDatetime', 'checkResult'],
        rows: [],
      },
      NumValue: '0',
      ssyNumValue: '0',
      szyNumValue: '0',
      heartNumValue: '0',
      sugarNumValue: '0',
      sugarNowNum: '0',
      chNumValue: '0',
      spo2NumValue: '0',
      heightNumValue: '0',
      weightNumValue: '0',
      waistLineNumValue: '0',
      bmiLineNumValue: '0',
      heightRecent: '0',
      weightRecent: '0',
      bmiRecent: '0',
      boneDensityNumValue: '0',
      checkedA: true,
      checkedB: true,
      showPicker: false,
      isDate: true,
      inputDate: new Date().toISOString().slice(0, 10),
      currentDate: new Date(),
      currentTime: '12:00',
      minDate: new Date(2015, 0, 1),
      maxDate: new Date(2025, 10, 1),
      type: '',
      beforeDinner: false,
      afterDinner: false,
      randOm: false,
      units: {},
      patient: {},
      patientId: '',
      patientOption: [],
      showPatientPicker: false,
      pickerBindIndex: 0,
    };
  },
  watch: {
    active() {
      this.showUpload = false;
    },
    heightRecent() {
      this.updateBmi();
    },
    weightRecent() {
      this.updateBmi();
    },
  },
  async created() {
    // this.active = +this.$route.query.active;
    this.getPatientList();
    this.getBaseData();
    this.$apis
      .parameterQuery({
        pageNo: 1,
        pageSize: 1000,
      })
      .then((res) => {
        for (const key in res.retData.list) {
          this.units[res.retData.list[key].description] = res.retData.list[key].unit;
        }
      });
  },
  methods: {
    getPatientList() {
      let openId = localStorage.getItem('openId') || (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).openId || to.query.openId : '');
      this.$apis
        .getPatientList({
          openId: openId,
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
            this.getBaseData();
          } else {
            this.patientOption = [];
            this.funcsList = [];
          }
        });
    },
    onConfirm(selectedValues, index) {
      this.patient = selectedValues;
      sessionStorage.setItem('userInfo', JSON.stringify(this.patient));
      this.pickerBindIndex = index == -1 ? 0 : index;
      this.patientId = this.patient.value;
      this.getBaseData();
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
    getBaseData() {
      this.getOne(this.list[this.active]);
      this.getOne(this.list[0]);
      this.getOne(this.list[1]);
      this.getOne(this.list[2]);
      this.getOne(this.list[3]);
      this.getOne(this.list[4]);
      this.getOne(this.list[5]);
      this.getOne(this.list[6]);
      this.getOne(this.list[7]);
      this.getOne(this.list[8]);
    },
    getOne(type) {
      let patientId = this.patientId || JSON.parse(sessionStorage.getItem('userInfo')).userId;
      this.$apis.queryOne(patientId, type).then((res) => {
        if (res.retData) {
          switch (type) {
            case this.list[0]:
              this.temperatureList = res.retData;
              this.chartDataTemperature.rows = this.temperatureList.temperature;
              break;
            case this.list[1]:
              this.bloodPressureList = res.retData;
              this.chartData.rows = this.bloodPressureList.bloodPressure;
              this.chartDataHeart.rows = this.bloodPressureList.bloodPressure;
              break;
            case this.list[2]:
              this.sugarList = res.retData;
              this.chartDataSugar.rows = this.sugarList.bloodSugar;
              break;
            case this.list[3]:
              this.spo2List = res.retData;
              this.chartDataSpo2.rows = this.spo2List.spo2;
              break;
            case this.list[4]:
              this.bmiList = res.retData;
              this.chartDataBMI.rows = this.bmiList.bmi;
              break;
            case this.list[5]:
              this.weightList = res.retData;
              this.chartDataWeight.rows = this.weightList.weight;
              this.weightRecent = this.weightList.weight.length > 0 ? this.weightList.weight[this.weightList.weight.length - 1].weight : '0';
              break;
            case this.list[6]:
              this.heightList = res.retData;
              this.chartDataHeight.rows = this.heightList.height;
              this.heightRecent = this.heightList.height.length > 0 ? this.heightList.height[this.heightList.height.length - 1].height : '0';
              break;
            case this.list[7]:
              this.waistLineList = res.retData;
              this.chartDataWaistLine.rows = this.waistLineList.waistLine;
              break;
            case this.list[8]:
              this.boneDensityList = res.retData;
              this.chartDataboneDensity.rows = this.boneDensityList.boneDensity;
              break;
            default:
              break;
          }
        }
      });
    },
    rulerNum(value) {
      this.NumValue = value;
    },
    ssyRulerNum(value) {
      this.ssyNumValue = value;
    },
    szyRulerNum(value) {
      this.szyNumValue = value;
    },
    heartRulerNum(value) {
      this.heartNumValue = value;
    },
    sugarRulerNum(value) {
      this.sugarNumValue = value;
    },
    chRulerNum(value) {
      this.chNumValue = value;
    },
    spo2RulerNum(value) {
      this.spo2NumValue = value;
    },
    heightRulerNum(value) {
      this.heightNumValue = value;
    },
    weightRulerNum(value) {
      this.weightNumValue = value;
    },
    waistLineRulerNum(value) {
      this.waistLineNumValue = value;
    },
    bmiRulerNum(value) {
      this.bmiLineNumValue = value;
    },
    boneDensityRulerNum(value) {
      this.boneDensityNumValue = value;
    },
    bindDevice() {
      this.$router.push({
        path: '/devicesList',
      });
    },
    swithDinner(type) {
      // if ((this.beforeDinner && type == 'before') || (!this.beforeDinner && type == 'after')) {
      //   return;
      // }
      // console.log(type)
      this.beforeDinner = false;
      this.afterDinner = false;
      this.randOm = false;
      switch(type) {
        case 'before':
          this.beforeDinner = true
          break;
        case 'after':
          this.afterDinner = true
          break;
        case 'random':
          this.randOm = true
          break;
        default:
          break;
      }

      // this.beforeDinner = !this.beforeDinner;
      this.sugarNowNum =
        type == 'before'
          ? this.sugarList.bloodSugar.length
            ? this.sugarList.bloodSugar[0].bloodSugarBeforeMeal * 10
            : 0
          : this.sugarList.bloodSugar.length
          ? this.sugarList.bloodSugar[0].bloodSugarAfterMeal * 10
          : 0;
    },
    chooseTime(type) {
      this.type = type;
      this.showPicker = true;
      if (type == 'date') {
        this.currentDate = this.inputDate ? new Date(this.inputDate.slice(0, 4), this.inputDate.slice(5, 7) - 1, this.inputDate.slice(8, 10)) : new Date();
      }
    },
    confirmPicker(val) {
      let year = val.getFullYear();
      let month = val.getMonth() + 1;
      let day = val.getDate();
      if (month >= 1 && month <= 9) {
        month = `0${month}`;
      }
      if (day >= 1 && day <= 9) {
        day = `0${day}`;
      }
      this.inputDate = `${year}-${month}-${day}`;
      this.showPicker = false;
    },
    confirmPickerB(val) {
      this.showPicker = false;
    },
    formatter(type, value) {
      if (type === 'year') {
        return `${value}年`;
      } else if (type === 'month') {
        return `${value}月`;
      } else if (type === 'day') {
        return `${value}日`;
      } else if (type === 'hour') {
        return `${value}时`;
      } else if (type === 'minute') {
        return `${value}分`;
      } else if (type === 'second') {
        return `${value}秒`;
      }
      return value;
    },
    save(type) {
      if (!this.inputDate) {
        this.$toast('请选择测量日期');
        return;
      }
      console.log(123,window.globalURL.hospitalId);
      let params;
      switch (type) {
        case this.list[0]:
          params = {
            bodyTemperature: this.NumValue,
            temperatureUnit: '°C',
            userId: this.patientId || JSON.parse(sessionStorage.getItem('userInfo')).userId,
            isUploadByHand: '1',
            checkDatetime: this.inputDate + ' ' + this.currentTime + ':00',
            // hospitalId: JSON.parse(sessionStorage.getItem('userInfo')).hospitalId,
            hospitalId: window.globalURL.hospitalId,
          };
          this.$apis.saveHealth(this.upList[0], params).then((res) => {
            this.$toast(res.retInfo);
            this.showUpload = false;
            this.getOne(this.list[0]);
          });
          break;
        case this.list[1]:
          params = {
            bloodPressureH: this.checkedA ? this.ssyNumValue : 0,
            bloodPressureL: this.checkedA ? this.szyNumValue : 0,
            // bloodPressureUnit: "mmol/L",
            heartRate: this.checkedB ? this.heartNumValue : 0,
            heartRateUnit: '次/分',
            bloodPressureAverage: '0',
            userId: this.patientId || JSON.parse(sessionStorage.getItem('userInfo')).userId,
            checkDatetime: this.inputDate + ' ' + this.currentTime + ':00',
            // hospitalId: JSON.parse(sessionStorage.getItem('userInfo')).hospitalId,
            hospitalId: window.globalURL.hospitalId,
          };
          this.$apis.saveHealth(this.upList[1], params).then((res) => {
            this.$toast(res.retInfo);
            this.showUpload = false;
            this.getOne(this.list[1]);
            this.currentDate = new Date();
            this.currentTime = '12:00';
          });
          break;
        case this.list[2]:
          params = {
            bloodSugar: this.randOm ? this.sugarNumValue : 0,
            bloodSugarAfterMeal: this.afterDinner ? this.sugarNumValue : 0,
            bloodSugarBeforeMeal: this.beforeDinner ? this.sugarNumValue : 0,
            isUploadByHand: '1',
            state: 0,
            sugarType: '0',
            sugarUnit: 'mmol/L',
            userId: this.patientId || JSON.parse(sessionStorage.getItem('userInfo')).userId,
            checkDatetime: this.inputDate + ' ' + this.currentTime + ':00',
            // hospitalId: JSON.parse(sessionStorage.getItem('userInfo')).hospitalId,
            hospitalId: window.globalURL.hospitalId,
          };
          this.$apis.saveHealth(this.upList[2], params).then((res) => {
            this.$toast(res.retInfo);
            this.showUpload = false;
            this.getOne(this.list[2]);
            this.currentDate = new Date();
            this.currentTime = '12:00';
          });
          break;
        case this.list[3]:
          params = {
            heartRate: this.bloodSugar,
            spo2: this.spo2NumValue,
            // spo2Unit: "mmol/L",
            userId: this.patientId || JSON.parse(sessionStorage.getItem('userInfo')).userId,
            isUploadByHand: '1',
            checkDatetime: this.inputDate + ' ' + this.currentTime + ':00',
            // hospitalId: JSON.parse(sessionStorage.getItem('userInfo')).hospitalId,
            hospitalId: window.globalURL.hospitalId,
          };
          this.$apis.saveHealth(this.upList[3], params).then((res) => {
            this.$toast(res.retInfo);
            this.showUpload = false;
            this.getOne(this.list[3]);
            this.currentDate = new Date();
            this.currentTime = '12:00';
          });
          break;
        case this.list[4]:
          params = {
            type: 'bmi',
            height: this.heightRecent,
            weight: this.weightRecent,
            bmi: this.bmiLineNumValue,
            userId: this.patientId || JSON.parse(sessionStorage.getItem('userInfo')).userId,
            isUploadByHand: '1',
            checkDatetime: this.inputDate + ' ' + this.currentTime + ':00',
            // hospitalId: JSON.parse(sessionStorage.getItem('userInfo')).hospitalId,
            hospitalId: window.globalURL.hospitalId,
          };
          this.$apis.saveHealth(this.upList[4], params).then((res) => {
            this.$toast(res.retInfo);
            this.showUpload = false;
            this.getOne(this.list[4]);
            this.currentDate = new Date();
            this.currentTime = '12:00';
          });
          break;
        case this.list[5]:
          params = {
            type: 'weight',
            weight: this.weightNumValue,
            userId: this.patientId || JSON.parse(sessionStorage.getItem('userInfo')).userId,
            isUploadByHand: '1',
            checkDatetime: this.inputDate + ' ' + this.currentTime + ':00',
            // hospitalId: JSON.parse(sessionStorage.getItem('userInfo')).hospitalId,
            hospitalId: window.globalURL.hospitalId,
          };
          this.$apis.saveHealth(this.upList[4], params).then((res) => {
            this.$toast(res.retInfo);
            this.showUpload = false;
            this.getOne(this.list[5]);
            this.currentDate = new Date();
            this.currentTime = '12:00';
          });
          break;
        case this.list[6]:
          params = {
            type: 'height',
            height: this.heightNumValue,
            userId: this.patientId || JSON.parse(sessionStorage.getItem('userInfo')).userId,
            isUploadByHand: '1',
            checkDatetime: this.inputDate + ' ' + this.currentTime + ':00',
            // hospitalId: JSON.parse(sessionStorage.getItem('userInfo')).hospitalId,
            hospitalId: window.globalURL.hospitalId,
          };
          this.$apis.saveHealth(this.upList[4], params).then((res) => {
            this.$toast(res.retInfo);
            this.showUpload = false;
            this.getOne(this.list[6]);
            this.currentDate = new Date();
            this.currentTime = '12:00';
          });
          break;
        case this.list[7]:
          params = {
            type: 'waistLine',
            waistLine: this.waistLineNumValue,
            userId: this.patientId || JSON.parse(sessionStorage.getItem('userInfo')).userId,
            isUploadByHand: '1',
            checkDatetime: this.inputDate + ' ' + this.currentTime + ':00',
            // hospitalId: JSON.parse(sessionStorage.getItem('userInfo')).hospitalId,
            hospitalId: window.globalURL.hospitalId,
          };
          this.$apis.saveHealth(this.upList[4], params).then((res) => {
            this.$toast(res.retInfo);
            this.showUpload = false;
            this.getOne(this.list[7]);
            this.currentDate = new Date();
            this.currentTime = '12:00';
          });
          break;
        case this.list[8]:
          params = {
            checkResult: this.boneDensityNumValue,
            userId: this.patientId || JSON.parse(sessionStorage.getItem('userInfo')).userId,
            isUploadByHand: '1',
            checkDatetime: this.inputDate + ' ' + this.currentTime + ':00',
            // hospitalId: JSON.parse(sessionStorage.getItem('userInfo')).hospitalId,
            hospitalId: window.globalURL.hospitalId,
          };
          this.$apis.saveHealth(this.upList[5], params).then((res) => {
            this.$toast(res.retInfo);
            this.showUpload = false;
            this.getOne(this.list[8]);
            this.currentDate = new Date();
            this.currentTime = '12:00';
          });
          break;
        default:
          break;
      }
    },

    updateBmi(value) {
      this.showBMI = false;
      this.bmiRecent = (this.weightRecent / (this.heightRecent * this.heightRecent)) * 100000;
      this.bmiRecent = this.bmiRecent ? this.bmiRecent : 0;
      this.$nextTick(() => {
        this.showBMI = true;
      });
    },
  },
};
</script>
<style lang="scss">
.cs-rule {
  height: inherit !important;
}
.healthmonitor {
  .van-tabs {
    width: 100%;
    .van-tabs__wrap {
      width: 100%;
    }
  }
}
</style>
<style lang="scss" scoped>
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
    width: 100%;
    .van-tabs__wrap {
      width: 100%;
    }
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
  .abc {
    padding: 12px 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
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
</style>
