<template>
  <div class="page-container">
    <!-- 这里的高度实际上不是设置死的，根据高度自动撑开然后获取到这个高度，怕数据没有请求好或者其他原因导致没有完全撑开，所以这里设置一个高度 -->
    <div :style="{ height: Array.isArray(swiperList) && swiperList.length > 0 ? '321px' : '148px' }">
      <person-detail ref="userInfoRef" @choicePatient="choicePatient"></person-detail>
      <!-- 搜索条件 -->
      <el-row class="search-container" type="flex" justify="space-between" align="middle">
        <el-button-group class="search-btn-group">
          <el-button size="mini" class="bluemyself" :type="searchData.type == 1 ? 'primary' : ''" @click="choiceSearchType(1)">全部</el-button>
          <el-button class="bluemyself" size="mini" :type="searchData.type == 2 ? 'primary' : ''" @click="choiceSearchType(2)">门诊</el-button>
          <el-button class="bluemyself" size="mini" :type="searchData.type == 3 ? 'primary' : ''" @click="choiceSearchType(3)">住院</el-button>
        </el-button-group>
        <el-row type="flex" align="middle">
          <span style="color: #3B5370;font-size: 14px;margin-right:12px">选择日期</span>

          <el-date-picker
            @change="changeTimeRange"
            v-model="searchData.timeRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :clearable="false"
          ></el-date-picker>
          <el-radio-group v-model="searchData.pickerTime" @change="changePickerTime" style="margin-left:35px">
            <el-radio :label="12">一年</el-radio>
            <el-radio :label="6">半年</el-radio>
            <el-radio :label="3">三个月</el-radio>
          </el-radio-group>
        </el-row>
      </el-row>
      <!-- 走马灯 -->
      <el-row class="section-swiper" v-if="Array.isArray(swiperList) && swiperList.length > 0" type="flex" justify="space-between" align="bottom">
        <el-row class="left-indicator">
          <el-button class="indicator-btn" :style="{ background: swiperIndex == 0 ? '#FBFBFB' : '' }" @click="handleSwiper('pre')" :disabled="swiperIndex == 0">
            <img src="@svg/leftarrow.svg" alt />
          </el-button>
        </el-row>
        <el-row style="flex-grow:1;">
          <el-row type="flex" class="progress-bar" align="middle">
            <template v-for="(item, index) in swiperList[swiperIndex]">
              <div :key="index + '' + jiazaiSwiper" class="circle" :class="{ 'active-circle': index == acriveCircleIndex }"></div>
              <div class="line"></div>
            </template>
          </el-row>
          <el-carousel
            ref="swiper"
            :initial-index="swiperIndex"
            @change="changeSwiper"
            trigger="click"
            indicator-position="none"
            :loop="false"
            :autoplay="false"
            height="123px"
            arrow="never"
          >
            <el-carousel-item v-for="(item, index) in swiperList" :key="index + '' + jiazaiSwiper">
              <el-row type="flex" class="swpier-item" justify="space-between">
                <el-row v-for="(item2, index2) in item" :key="index2 + '' + jiazaiSwiper" style="flex-grow:1;padding:10px 0">
                  <!-- <el-row> -->
                  <div
                    class="card-time"
                  >{{ item2.jzfs == "门诊" && item2.ksjzrq ? item2.ksjzrq.slice(0, 10) : `${item2.ryrqsj && item2.ryrqsj.slice(0, 10)}至${item2.cyrqsj && item2.cyrqsj.slice(0, 10)}` }}</div>
                  <div class="card-container" :class="{ active: swiperItemActiveId == item2.id }" @click="choicedCard(item2, index2)">
                    <el-row type="flex" class="card-head" justify="space-between" align="middle" style="font-size:12px">
                      <span class="title">{{ item2.jzks && item2.jzks.length <= 8 ? item2.jzks : item2.jzks.slice(0, 8)+'...' }}</span>
                      <div class="card-tag" :class="{ inhospital: item2.jzfs == '住院', gate: item2.jzfs == '门诊' }">{{ item2.jzfs }}</div>
                      <!-- <div class="card-tag" >{{ item2.jzfs }}</div> -->
                    </el-row>
                    <el-row class="card-descirption">{{ item2.zzd || "无" }}</el-row>
                    <el-row type="flex" align="middle" class="card-bottom">
                      <div style="width:50%;flex-grow:1" class="doctorhu">
                        <img src="@svg/defaultDoctorAvator.svg" alt style="margin-right:4px" />
                        {{ formatStr(item2.jzfs == "门诊" ? item2.jzys : item2.zzys, item2.jzfs) }}
                        <!-- {{ () }} -->
                      </div>

                      <template v-if="item2.jzfs == '住院'">
                        <div style="width:50%;flex-grow:1" class="doctorhu">
                          <img src="@svg/defaultNurseAvator.svg" alt v-if="item2.jzfs == '住院'" style="margin-right:4px" />
                          {{ item2.zrhs && item2.zrhs.length <= 4 ? item2.zrhs : item2.zrhs.slice(0, 4) + "..." }}
                        </div>
                      </template>
                    </el-row>
                  </div>
                  <!-- </el-row> -->
                </el-row>
              </el-row>
            </el-carousel-item>
          </el-carousel>
        </el-row>
        <el-row class="right-indicator">
          <el-button
            @click="handleSwiper('next')"
            class="indicator-btn"
            :style="{ background: swiperIndex == swiperList.length - 1 ? '#FBFBFB' : '' }"
            :disabled="swiperIndex == swiperList.length - 1"
          >
            <img src="@svg/rightarrow.svg" alt />
          </el-button>
        </el-row>
      </el-row>
      <!-- <div v-else class="no-data" style="height: 162px">
        <img style="height:162px" src="@/assets/images/noTable.png" alt="" />
      </div>-->
    </div>

    <main class="main-container" :style="{ height: Array.isArray(swiperList) && swiperList.length > 0 ? 'calc(100% - 321px)' : 'calc(100% - 148px)' }">
      <template v-if="hasMainData">
        <!-- 门诊 -->
        <el-row v-if="!isInHospital" class="outpatient-server" type="flex">
          <div class="left-main">
            <PatientMedicalRecords v-if="!(JSON.stringify(bingliData) == '{}')" :medicalInfo="bingliData" mode="timeLine"></PatientMedicalRecords>
            <!-- <PatientMedicalRecords v-if="false" :medicalInfo="bingliData" mode="timeLine"></PatientMedicalRecords> -->
            <div v-else class="no-data no-data-back">
              <img style="height:162px" src="@/assets/images/noTable.png" alt />
              <!-- <div>暂无数据</div> -->
            </div>
          </div>
          <div class="right-main">
            <ul>
              <!-- 用药记录 -->
              <li>
                <el-row type="flex" align="middle" class="one-level-title">
                  <div class="blue-line"></div>
                  <span class="one-level-text">用药记录</span>
                  <span v-if="Array.isArray(menZhengData.yyjl) && menZhengData.yyjl.length > 0" @click="openDialog({ type: 'yyjl', title: '用药记录' })" class="detail-btn">详情</span>
                </el-row>
                <div>
                  <el-row type="flex" v-for="(item, index) in menZhengData.yyjl" :key="index" align="middle" justify="space-between" class="content-item">
                    <el-row type="flex" align="middle" style="flex-grow:1">
                      <img src="@svg/file.svg" alt style="flex-shrink:0" />
                      <div class="text">药品名称：{{ item.ypmc }}</div>
                    </el-row>
                  </el-row>
                </div>
              </li>
              <li>
                <el-row type="flex" align="middle" class="one-level-title">
                  <div class="blue-line"></div>
                  <span class="one-level-text">治疗</span>
                  <span v-if="Array.isArray(menZhengData.zl) && menZhengData.zl.length > 0" @click="openDialog({ type: 'zl', title: '治疗' })" class="detail-btn">详情</span>
                </el-row>
                <div>
                  <el-row v-for="(item, index) in menZhengData.zl" :key="index" type="flex" align="middle" justify="space-between" class="content-item">
                    <el-row type="flex" align="middle" style="flex-grow:1">
                      <img src="@svg/file.svg" alt style="flex-shrink:0" />
                      <div class="text">操作名称：{{ item.czmc }}</div>
                    </el-row>
                  </el-row>
                </div>
              </li>
              <li>
                <el-row type="flex" align="middle" class="one-level-title">
                  <div class="blue-line"></div>
                  <span class="one-level-text">诊断</span>
                  <span v-if="Array.isArray(menZhengData.zd) && menZhengData.zd.length > 0" @click="openDialog({ type: 'zd', title: '诊断' })" class="detail-btn">详情</span>
                </el-row>
                <div class>
                  <el-row v-for="(item, index) in menZhengData.zd" :key="index" type="flex" align="middle" justify="space-between" class="content-item">
                    <el-row type="flex" align="middle" style="flex-grow:1">
                      <img src="@svg/file.svg" alt style="flex-shrink:0" />
                      <div class="text">诊断名称：{{ item.zdmc }}</div>
                    </el-row>
                    <!-- <el-row @click="openDialog({type:'zd',title:'诊断',item})"  style="flex-shrink:0;width:40px" class="detail-btn">
                    详情
                    </el-row>-->
                  </el-row>
                </div>
              </li>
              <!-- 检验报告 -->
              <li>
                <el-row type="flex" align="middle" class="one-level-title">
                  <div class="blue-line"></div>
                  <span class="one-level-text">检验报告</span>
                </el-row>
                <div>
                  <el-row v-for="(item, index) in menZhengData.jybg" :key="index" type="flex" align="middle" justify="space-between" class="content-item">
                    <el-row type="flex" align="middle" style="flex-grow:1">
                      <img src="@svg/file.svg" alt style="flex-shrink:0" />
                      <div class="text">检验项目：{{ item.jyxm }}</div>
                    </el-row>
                    <el-row @click.native="openDialog({ type: 'jybg', title: '检验报告', index })" style="flex-shrink:0;width:40px" class="detail-btn">详情</el-row>
                  </el-row>
                </div>
              </li>
              <li>
                <el-row type="flex" align="middle" class="one-level-title">
                  <div class="blue-line"></div>
                  <span class="one-level-text">检查报告</span>
                </el-row>
                <div>
                  <el-row v-for="(item, index) in menZhengData.jcbg" :key="index" type="flex" align="middle" justify="space-between" class="content-item">
                    <el-row type="flex" align="middle" style="flex-grow:1">
                      <img src="@svg/file.svg" alt style="flex-shrink:0" />
                      <div class="text">检查项目：{{ item.jcxmmc }}</div>
                    </el-row>
                    <el-row @click.native="openDialog({ type: 'jcbg', title: '检查报告', index })" style="flex-shrink:0;width:40px" class="detail-btn">详情</el-row>
                  </el-row>
                </div>
              </li>
              <li>
                <el-row type="flex" align="middle" class="one-level-title">
                  <div class="blue-line"></div>
                  <span class="one-level-text">手术记录</span>
                </el-row>
                <div>
                  <el-row v-for="(item, index) in menZhengData.ssjl.ssjl" :key="index" type="flex" align="middle" justify="space-between" class="content-item">
                    <el-row type="flex" align="middle" style="flex-grow:1">
                      <img src="@svg/file.svg" alt style="flex-shrink:0" />
                      <div class="text">手术名称: {{ item.ssmc }}</div>
                    </el-row>
                    <el-row @click.native="openDialog({ type: 'ssjl', title: '手术记录', listData:item })" style="flex-shrink:0;width:40px" class="detail-btn">详情</el-row>
                  </el-row>
                  <el-row v-for="(item, index) in menZhengData.ssjl.mzjl" :key="index" type="flex" align="middle" justify="space-between" class="content-item">
                    <el-row type="flex" align="middle" style="flex-grow:1">
                      <img src="@svg/file.svg" alt style="flex-shrink:0" />
                      <div class="text">麻醉方法: {{ item.mzff }}</div>
                    </el-row>
                    <el-row @click.native="openDialog({ type: 'mzjl', title: '麻醉记录', listData:item })" style="flex-shrink:0;width:40px" class="detail-btn">详情</el-row>
                  </el-row>
                </div>
              </li>
            </ul>
          </div>
        </el-row>
        <!-- 住院 -->
        <section v-else class="inhospital-server">
          <el-row class="title" type="flex" align="middle" style="margin-bottom:16px">
            <div class="blue-line"></div>
            <span class="title-text">住院记录</span>
          </el-row>
          <!-- table -->
          <el-row class="row first-line" type="flex">
            <div class="headline col">
              <div class="text">
                <!-- 时间 -->
              </div>
            </div>

            <div class="col" v-for="(item, index) in inhospitalData" :key="`${index}${getTableKey}`">
              <el-button v-if="index == 0" class="pre-page" @click="changeTablePage('pre')" :disabled="tableData.index == 1">
                <img src="@svg/leftarrow.svg" alt />
              </el-button>
              <span>{{ item.date }}</span>
              <el-button v-if="index == inhospitalData.length - 1" @click="changeTablePage('next')" class="next-page" :disabled="tableData.index == tableData.maxIndex">
                <img src="@svg/rightarrow.svg" alt />
              </el-button>
            </div>
          </el-row>

          <div id="table">
            <!-- 病历 -->

            <el-row class="row" type="flex">
              <div class="headline col">
                <div class="text">病历</div>
              </div>

              <div class="col" v-for="(item, index) in inhospitalData" :key="`${index}${getTableKey}`">
                <ul style="position:relative;padding-bottom:30px">
                  <div class="more" v-if="item.blList.length > 5">
                    <el-popover placement="top-start" title popper-class="case-history-pop" width="200" trigger="click">
                      <!-- <li
                        v-for="(item2, index2) in item.blList"
                        @click="openDialog({ type: item2.type, zyh: item2.zyh, title: item2.type == 1 ? '入院记录' : item2.type == 0 ? '出院小结' : '' })"
                        :style="{ cursor: item2.type === null ? 'auto' : 'pointer' }"
                        :key="`${index2}${getTableKey}`"
                        class="case-history-item "
                        :class="item2.jllx == 1 ? 'orange' : 'blue'"
                      >-->
                      <li
                        v-for="(item2, index2) in item.blList"
                        @click="openDialog({ type: item2.type, zyh: item2.zyh, title: item2.jlmc,jlid:item2.jlid})"
                        :style="{ cursor: item2.type === null ? 'auto' : 'pointer' }"
                        :key="`${index2}${getTableKey}`"
                        class="case-history-item"
                        :class="item2.jllx == 1 ? 'orange' : 'blue'"
                      >
                        <div class="line" :class="item2.jllx == 1 ? 'orange' : 'blue'"></div>
                        <div class="case-history-head">
                          <div class="case-history-title">{{ item2.jlmc }}</div>
                          <div class="case-history-time">{{ item2.jlsj }}</div>
                        </div>
                        <img class="exclamation" v-if="item2.jllx == 1" src="@svg/exclamation.svg" alt />
                      </li>
                      <span slot="reference" style="position:absolute;bottom:0;width:100%;left:0;background:white">更多</span>
                    </el-popover>
                  </div>
                  <!-- <li
                    @click="openDialog({ type: item2.type, zyh: item2.zyh, title: item2.type == 1 ? '入院记录' : item2.type == 0 ? '出院小结' : '' })"
                    :style="{ cursor: item2.type === null ? 'auto' : 'pointer' }"
                    v-for="(item2, index2) in item.blList.slice(0, 5)"
                    :key="`${index2}${getTableKey}`"
                    class="case-history-item clearfix"
                    :class="item2.jllx == 1 ? 'orange' : 'blue'"
                  >-->
                  <li
                    @click="openDialog({ type: item2.type, zyh: item2.zyh, title: item2.jlmc,jlid:item2.jlid})"
                    :style="{ cursor: item2.type === null ? 'auto' : 'pointer' }"
                    v-for="(item2, index2) in item.blList.slice(0, 5)"
                    :key="`${index2}${getTableKey}`"
                    class="case-history-item clearfix"
                    :class="item2.jllx == 1 ? 'orange' : 'blue'"
                  >
                    <div class="line" :class="item2.jllx == 1 ? 'orange' : 'blue'"></div>
                    <div class="case-history-head">
                      <div class="case-history-title">{{ item2.jlmc }}</div>
                      <div class="case-history-time">{{ item2.jlsj }}</div>
                    </div>
                    <img class="exclamation" v-if="item2.jllx == 1" src="@svg/exclamation.svg" alt />
                  </li>
                </ul>
              </div>
            </el-row>
            <el-row class="row" style="overflow:hidden;" type="flex">
              <div class="headline col">
                <div class="text">药嘱</div>
              </div>
              <div class="col" v-for="(item, index) in inhospitalData" :key="`${index}${getTableKey}`">
                <ul class="yz-ul" style="position:relative;max-height:255px;padding-bottom:30px;">
                  <div class="more" v-if="item.yzList.length > 5">
                    <el-popover placement="top-start" title popper-class="case-history-pop" width="250" trigger="click">
                      <template v-for="(item2, index2) in item.yzList">
                        <template v-if="item2.kssj.slice(0, 10) == item2.tzsj.slice(0, 10)">
                          <li @click="openDialog({ type: 'yz', zyh: item2.zyh, title: '药嘱' })" :key="`${index2}${getTableKey}kai`" class="medicine-item">
                            <div class="medicine-name">{{ item2.ypmc }}</div>
                            <div>
                              <img v-if="item2.clbs == 1" src="@svg/long.svg" alt />
                              <img v-if="item2.clbs == 0" src="@svg/temp.svg" alt />
                              <img class="marginleft4" src="@svg/open.svg" alt />
                            </div>
                          </li>
                          <li @click="openDialog({ type: 'yz', zyh: item2.zyh, title: '药嘱' })" :key="`${index2}${getTableKey}ting`" class="medicine-item">
                            <div class="medicine-name">{{ item2.ypmc }}</div>
                            <div>
                              <img v-if="item2.clbs == 1" src="@svg/long.svg" alt />
                              <img v-if="item2.clbs == 0" src="@svg/temp.svg" alt />
                              <img class="marginleft4" src="@svg/stop.svg" alt />
                            </div>
                          </li>
                        </template>
                        <template v-else>
                          <li @click="openDialog({ type: 'yz', zyh: item2.zyh, title: '药嘱' })" :key="`${index2}${getTableKey}ting`" class="medicine-item">
                            <div class="medicine-name">{{ item2.ypmc }}</div>
                            <div>
                              <img v-if="item2.clbs == 1" src="@svg/long.svg" alt />
                              <img v-if="item2.clbs == 0" src="@svg/temp.svg" alt />
                              <img class="marginleft4" v-if="item2.flag == 1" src="@svg/open.svg" alt />
                              <img class="marginleft4" v-if="item2.flag == 0" src="@svg/stop.svg" alt />
                            </div>
                          </li>
                        </template>
                      </template>
                      <span slot="reference" style="position:absolute;bottom:0;height:30px;padding-top:5px;width:100%;left:0;background:white">更多</span>
                    </el-popover>
                  </div>

                  <template v-for="(item2, index2) in item.yzList.slice(0, 5)">
                    <template v-if="item2.kssj.slice(0, 10) == item2.tzsj.slice(0, 10)">
                      <li @click="openDialog({ type: 'yz', zyh: item2.zyh, title: '药嘱' })" :key="`${index2}${getTableKey}kai`" class="medicine-item">
                        <div class="item-span">{{ item2.ypmc }}</div>
                        <div style="flex-shrink: 0;">
                          <img v-if="item2.clbs == 1" src="@svg/long.svg" alt />
                          <img v-if="item2.clbs == 0" src="@svg/temp.svg" alt />
                          <img class="marginleft4" src="@svg/open.svg" alt />
                        </div>
                      </li>
                      <li @click="openDialog({ type: 'yz', zyh: item2.zyh, title: '药嘱' })" :key="`${index2}${getTableKey}ting`" class="medicine-item">
                        <div class="item-span">{{ item2.ypmc }}</div>
                        <div style="flex-shrink: 0;">
                          <img v-if="item2.clbs == 1" src="@svg/long.svg" alt />
                          <img v-if="item2.clbs == 0" src="@svg/temp.svg" alt />
                          <img class="marginleft4" src="@svg/stop.svg" alt />
                        </div>
                      </li>
                    </template>
                    <template v-else>
                      <li @click="openDialog({ type: 'yz', zyh: item2.zyh, title: '药嘱' })" :key="`${index2}${getTableKey}ting`" class="medicine-item">
                        <div class="item-span">{{ item2.ypmc }}</div>
                        <div style="flex-shrink: 0;">
                          <img v-if="item2.clbs == 1" src="@svg/long.svg" alt />
                          <img v-if="item2.clbs == 0" src="@svg/temp.svg" alt />
                          <img class="marginleft4" v-if="item2.flag == 1" src="@svg/open.svg" alt />
                          <img class="marginleft4" v-if="item2.flag == 0" src="@svg/stop.svg" alt />
                        </div>
                      </li>
                    </template>
                  </template>
                </ul>
              </div>
            </el-row>
            <!-- 检验 -->
            <el-row class="row" type="flex" style="overflow:hidden">
              <div class="headline col">
                <div class="text">检验报告</div>
              </div>
              <div class="col" v-for="(item, index) in inhospitalData" :key="`${index}${getTableKey}`" style="position:relative;padding-bottom:20px">
                <div class="more" v-if="item.jybgList.length > 5">
                  <el-popover placement="top-start" title popper-class="case-history-pop" width="250" trigger="click">
                    <div
                      @click="openDialog({ type: 'zyjybg', title: '检验报告', index, index2 })"
                      v-for="(item2, index2) in item.jybgList"
                      :key="`${index2}${getTableKey}`"
                      class="common-item"
                    >{{ item2.data[0].jyxm }}</div>
                    <span slot="reference" style="position:absolute;bottom:0;width:100%;left:0;background:white">更多</span>
                  </el-popover>
                </div>

                <div
                  @click="openDialog({ type: 'zyjybg', title: '检验报告', index, index2 })"
                  v-for="(item2, index2) in item.jybgList.slice(0, 5)"
                  :key="`${index2}${getTableKey}`"
                  class="common-item"
                >{{ item2.data[0].jyxm }}</div>
              </div>
            </el-row>
            <!-- 检查 -->
            <el-row class="row" type="flex">
              <div class="headline col">
                <div class="text">检查报告</div>
              </div>
              <div class="col" v-for="(item, index) in inhospitalData" :key="`${index}${getTableKey}`" style="position:relative;padding-bottom:20px">
                <div class="more" v-if="item.jcbgList.length > 5">
                  <el-popover placement="top-start" title popper-class="case-history-pop" width="250" trigger="click">
                    <div
                      @click="openDialog({ type: 'zyjcbg', title: '检查报告', index, index2 })"
                      v-for="(item2, index2) in item.jcbgList"
                      :key="`${index2}${getTableKey}`"
                      class="common-item"
                    >{{ item2.jcxmmc }}</div>
                    <span slot="reference" style="position:absolute;bottom:0;width:100%;left:0;background:white">更多</span>
                  </el-popover>
                </div>

                <div
                  v-for="(item2, index2) in item.jcbgList.slice(0, 5)"
                  @click="openDialog({ type: 'zyjcbg', title: '检查报告', index, index2 })"
                  :key="`${index2}${getTableKey}`"
                  class="common-item"
                >{{ item2.jcxmmc }}</div>
              </div>
            </el-row>
            <!-- 手术记录 -->
            <el-row class="row" type="flex">
              <div class="headline col">
                <div class="text">手术记录</div>
              </div>
              <div class="col" v-for="(item, index) in inhospitalData" :key="`${index}${getTableKey}`" style="position:relative;padding-bottom:20px">
                <div class="more" v-if="(item.ssjlList.length +item.mzjlList.length+item.pgcssjlList.length) > 5">
                  <el-popover placement="top-start" title popper-class="case-history-pop" width="250" trigger="click">
                    <div
                      @click="openDialog({ type: 'zyssjl', title: '手术记录', index, index2 ,listData:item2})"
                      v-for="(item2, index2) in item.ssjlList"
                      :key="`${index2}${getTableKey}`"
                      class="common-item"
                    >{{ item2.ssmc }}</div>
                    <div
                      @click="openDialog({ type: 'mzjl', title: '麻醉记录', index, index2 ,listData:item2})"
                      v-for="(item2, index2) in item.mzjlList"
                      :key="`${index2}${getTableKey}`"
                      class="common-item"
                    >麻醉方法: {{ item2.mzff }}</div>
                    <div
                      @click="openDialog({ type: 'pgcjl', title: '剖宫产记录', index, index2 ,listData:item2})"
                      v-for="(item2, index2) in item.pgcssjlList"
                      :key="`${index2}${getTableKey}`"
                      class="common-item"
                    >剖宫产手术</div>
                    <span slot="reference" style="position:absolute;bottom:0;width:100%;left:0;background:white">更多</span>
                  </el-popover>
                </div>

                <div
                  @click="openDialog({ type: 'zyssjl', title: '手术记录', index, index2,listData:item2})"
                  v-for="(item2, index2) in item.ssjlList.slice(0, 5)"
                  :key="`${index2}${getTableKey}`"
                  class="common-item"
                >{{ item2.ssmc }}</div>
                <div
                  @click="openDialog({ type: 'mzjl', title: '麻醉记录', index, index2,listData:item2})"
                  v-for="(item2, index2) in item.mzjlList.slice(0, 5-item.ssjlList.length)"
                  :key="`${index2}${getTableKey}`"
                  class="common-item"
                >麻醉方法: {{ item2.mzff }}</div>
                <div
                  @click="openDialog({ type: 'pgcjl', title: '剖宫产记录', index, index2,listData:item2 })"
                  v-for="(item2, index2) in item.pgcssjlList.slice(0, 5-item.ssjlList.length-item.mzjlList.length)"
                  :key="`${index2}${getTableKey}`"
                  class="common-item"
                >剖宫产手术</div>
              </div>
            </el-row>

            <!-- 输血记录 -->
            <el-row class="row" type="flex">
              <div class="headline col">
                <div class="text">输血记录</div>
              </div>
              <div class="col" v-for="(item, index) in inhospitalData" :key="`${index}${getTableKey}`" style="position:relative;padding-bottom:20px">
                <div class="more" v-if="item.sxjlList.length > 5">
                  <el-popover placement="top-start" title popper-class="case-history-pop" width="250" trigger="click">
                    <div
                      @click="openDialog({ type: 'sxjl', title: '输血记录', index, index2 })"
                      v-for="(item2, index2) in item.sxjlList"
                      :key="`${index2}${getTableKey}`"
                      class="common-item"
                    >输血记录</div>
                    <span slot="reference" style="position:absolute;bottom:0;width:100%;left:0;background:white">更多</span>
                  </el-popover>
                </div>

                <div
                  @click="openDialog({ type: 'sxjl', title: '输血记录', index, index2 })"
                  v-for="(item2, index2) in item.sxjlList.slice(0, 5)"
                  :key="`${index2}${getTableKey}`"
                  class="common-item"
                >输血记录</div>
              </div>
            </el-row>

            <!-- 诊断 -->
            <el-row class="row" type="flex">
              <div class="headline col">
                <div class="text">诊断</div>
              </div>
              <div class="col" v-for="(item, index) in inhospitalData" :key="`${index}${getTableKey}`" style="position:relative;padding-bottom:20px">
                <div class="more" v-if="item.zdjlList.length > 5">
                  <el-popover placement="top-start" title popper-class="case-history-pop" width="250" trigger="click">
                    <div
                      @click="openDialog({ type: 'zyzd', title: '诊断' })"
                      v-for="(item2, index2) in item.zdjlList"
                      :key="`${index2}${getTableKey}`"
                      class="common-item"
                    >{{ item2.zdmc }}</div>
                    <span slot="reference" style="position:absolute;bottom:0;width:100%;left:0;background:white">更多</span>
                  </el-popover>
                </div>
                <div
                  @click="openDialog({ type: 'zyzd', title: '诊断' })"
                  v-for="(item2, index2) in item.zdjlList.slice(0, 5)"
                  :key="`${index2}${getTableKey}`"
                  class="common-item"
                >{{ item2.zdmc }}</div>
              </div>
            </el-row>
          </div>
          <!-- charts -->
          <div>
            <div id="chart" style="width: 100%;height:350px;margin-top:10px"></div>
          </div>
        </section>
      </template>

      <div v-else class="no-data">
        <img style="height:162px" src="@/assets/images/noTable.png" alt />
      </div>
    </main>
    <img class="fixed-bottom" src="@svg/360shitu.svg" draggable="true" @click="goTo360view" @dragend="dragendImg($event)" @dragstart="dragstartImg($event)" />
    <el-dialog :visible.sync="dialog.show" width="70%" custom-class="shujudialog" v-if="dialog.show">
      <div slot="title">
        <el-row type="flex" align="middle">
          <div class="blue-line"></div>
          <span class="dialog-title">{{ dialog.title }}</span>

          <el-radio-group @change="changeShortRoLong" v-if="dialog.type == 'yz'" style="margin-left:20px" v-model="yzlx" size="mini">
            <el-radio-button label="2">全部</el-radio-button>
            <el-radio-button label="0">临时</el-radio-button>
            <el-radio-button label="1">长期</el-radio-button>
          </el-radio-group>
        </el-row>
      </div>
      <div v-if="dialog.type == 'yz'">
        <case-history-table :columns="yztableColumns" :data="yzTableData"></case-history-table>
      </div>
      <!-- 用药记录 -->
      <CaseHistoryTable v-if="dialog.type == 'yyjl'" :data="yyjlData" :columns="yyjlLabelData"></CaseHistoryTable>

      <CaseHistoryTable v-if="dialog.type == 'zl'" :data="menZhengData.zl" :columns="zlLabelData"></CaseHistoryTable>

      <!-- 诊断 -->
      <CaseHistoryTable v-if="dialog.type == 'zd'" :data="menZhengData.zd" :columns="zdLabelData"></CaseHistoryTable>

      <!-- 住院诊断 -->
      <CaseHistoryTable v-if="dialog.type == 'zyzd'" :data="zhuyuanZdTableData" :columns="zhuyuanZdLabelData"></CaseHistoryTable>

      <!-- 输血记录 -->
      <div class="dialogbordercontainer" v-if="dialog.type == 'sxjl'">
        <TransfusionRecord mode="2" :formData="inhospitalData[dialog.index].sxjlList[dialog.index2]"></TransfusionRecord>
      </div>

      <CaseHistoryTable v-if="dialog.type == 'jybg'" :data="menZhengData.jybg[dialog.index].list || []" :columns="jybgLabelData"></CaseHistoryTable>

      <!-- 住院检验报告 -->
      <CaseHistoryTable v-if="dialog.type == 'zyjybg'" :data="inhospitalData[dialog.index].jybgList[dialog.index2].data" :columns="jybgLabelData"></CaseHistoryTable>

      <!-- <i v-slot: class="el-icon-eleme"></i> -->

      <!-- 检查报告 -->
      <InspectionReport v-if="dialog.type == 'jcbg'" :formData="menZhengData.jcbg[dialog.index]"></InspectionReport>

      <!-- 住院检查报告 -->
      <InspectionReport v-if="dialog.type == 'zyjcbg'" :formData="inhospitalData[dialog.index].jcbgList[dialog.index2]"></InspectionReport>
      <!-- 手术记录 -->
      <OperationRecord v-if="dialog.type == 'ssjl'" mode="0" :formData="paperData"></OperationRecord>
      <!-- 住院手术记录 -->
      <OperationRecord mode="1" v-if="dialog.type == 'zyssjl'" :formData="inhospitalData[dialog.index].ssjlList[dialog.index2]"></OperationRecord>
      <DocumQJJL v-if="dialog.type == 'qjjl'"></DocumQJJL>
      <DocumHZJL v-if="dialog.type == 'hzjl'"></DocumHZJL>
      <DocumSQXJ v-if="dialog.type == 'sqxj'"></DocumSQXJ>
      <DocumSQTL v-if="dialog.type == 'sqtl'"></DocumSQTL>
      <DocumCYJL v-if="dialog.type == 'cyjl'"></DocumCYJL>
      <DocumSWJL v-if="dialog.type == 'swjl'"></DocumSWJL>
      <DocumSWBLTLJL v-if="dialog.type == 'swbltljl'"></DocumSWBLTLJL>
      <DocumPGCSSJL v-if="dialog.type == 'pgcssjl'"></DocumPGCSSJL>
      <!-- <transfusion-record></transfusion-record> -->
      <!-- <Navigation> -->
      <!-- <DischargeAbstract /> -->
      <div class="dialogbordercontainer" v-if="dialog.type == 1">
        <InhospitalAbstract :formData="ryjlData"></InhospitalAbstract>
      </div>

      <div class="dialogbordercontainer" v-if="dialog.type == 0">
        <DischargeAbstract :formData="cyxjData"></DischargeAbstract>
      </div>
      <!-- 部分住院新文书 -->
      <DocumQJJL :formData="paperData" v-if="dialog.type =='JK5017'"></DocumQJJL>
      <DocumHZJL :formData="paperData" v-if="dialog.type =='JK5018'"></DocumHZJL>
      <DocumSQXJ :formData="paperData" v-if="dialog.type =='JK5019'"></DocumSQXJ>
      <DocumSQTL :formData="paperData" v-if="dialog.type =='JK5020'"></DocumSQTL>
      <DocumSWBLTLJL :formData="paperData" v-if="dialog.type =='JK5021'"></DocumSWBLTLJL>
      <DocumSWJL :formData="paperData" v-if="dialog.type =='JK5024'"></DocumSWJL>
      <DocumCYJL :formData="paperData" v-if="dialog.type =='JK5025'"></DocumCYJL>
      <DocumMZJL :formData="paperData" v-if="dialog.type =='mzjl'" :mode="isInHospital?'1':'0'"></DocumMZJL>
      <DocumPGCSSJL :formData="paperData" v-if="dialog.type =='pgcjl'"></DocumPGCSSJL>
      <DocumZZJL :formData="paperData" v-if="dialog.type == 'JK5022'"></DocumZZJL>

      <DocumDCJL :listData="paperData" v-if="dialog.type == 'JK5009'"></DocumDCJL>
      <DocumRCYJL :listData="paperData" v-if="dialog.type == 'JK5010'"></DocumRCYJL>
      <DocumRYSWJL :listData="paperData" v-if="dialog.type == 'JK5011'"></DocumRYSWJL>
      <DocumSJYSCFJL :listData="paperData" v-if="dialog.type == 'JK5012'"></DocumSJYSCFJL>
      <DocumYNBLTLJL :listData="paperData" v-if="dialog.type == 'JK5013'"></DocumYNBLTLJL>
      <DocumJJBJL :listData="paperData" v-if="dialog.type == 'JK5014'"></DocumJJBJL>
      <DocumZKJL :listData="paperData" v-if="dialog.type == 'JK5015'"></DocumZKJL>
      <DocumJDXJ :listData="paperData" v-if="dialog.type == 'JK5016'"></DocumJDXJ>

      <DocumMZSHFGJL :formData="paperData" v-if="dialog.type == 'JK5008'"></DocumMZSHFGJL>
      <DocumMZSQFGJL :formData="paperData" v-if="dialog.type == 'JK5007'"></DocumMZSQFGJL>
      <DocumRCBCJL :formData="paperData" v-if="dialog.type == 'JK5005'"></DocumRCBCJL>
      <DocumSHSCBC :formData="paperData" v-if="dialog.type == 'JK5006'"></DocumSHSCBC>
      <DocumSCBC :formData="paperData" v-if="dialog.type == 'JK5004'"></DocumSCBC>
      <DocumYDFMJL :formData="paperData" v-if="dialog.type == 'JK5003'"></DocumYDFMJL>
      <DischargeAbstract :formData="paperData" v-if="dialog.type == 'JK5026'"></DischargeAbstract>
      <InhospitalAbstract :formData="paperData" v-if="dialog.type == 'JK5032'"></InhospitalAbstract>
      <!-- </Navigation> -->
    </el-dialog>
    <!-- <button @click="openDialog({ type: 'qjjl', title: '病历' })">抢救记录</button> -->
    <!-- <button @click="openDialog({ type: 'hzjl', title: '病历' })">会诊记录</button> -->
    <!-- <button @click="openDialog({ type: 'sqxj', title: '病历' })">术前小结</button> -->
    <!-- <button @click="openDialog({ type: 'sqtl', title: '病历' })">术前讨论</button> -->
    <!-- <button @click="openDialog({ type: 'cyjl', title: '病历' })">出院记录</button> -->
    <!-- <button @click="openDialog({ type: 'swjl', title: '病历' })">死亡记录</button> -->
    <!-- <button @click="openDialog({ type: 'swbltljl', title: '病历' })">死亡病例讨论记录</button> -->
    <!-- <button @click="openDialog({ type: 'zzjl', title: '病历' })">转院记录</button> -->
    <!-- <button @click="openDialog({ type: 'pgcssjl', title: '病历' })">剖宫产手术记录</button> -->
  </div>
</template>
<script src="./timelineMode.js"></script>

<style lang="scss" src="./timelineMode.scss" scoped></style>