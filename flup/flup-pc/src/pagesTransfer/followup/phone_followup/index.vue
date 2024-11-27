<template>
  <section class="phone-followup">
    <!-- <side-bar :phone="currentItem.phone" :idCard="currentItem.id_no" /> -->
    <div class="phone-followup_wrapper" v-on:click.stop="closeCur">
      <section style="padding-top:20px" class="phone-followup_aside">
        <el-row type="flex" class="over-xline">
          <span class="phone-followup_aside_title">任务开始日期</span>
          <el-date-picker class="margin-left20 " v-model="dateRange" clearable :editable="false" type="daterange"
            value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" @change="onSearch"></el-date-picker>

        </el-row>
        <el-row class="margin-top16" type="flex">
          <el-select v-model="planValue" placeholder="随访计划" clearable filterable @change="onSearch">
            <el-option v-for="(item, i) in planList" :key="i" :label="item.planName" :value="item.serialNo"></el-option>
          </el-select>
          <el-select class="margin-left20" v-model="followUpState" placeholder="随访状态" clearable @change="onSearch">
            <el-option v-for="(item, i) in followUpStateList" :key="i" :label="item.dictName"
              :value="item.dictCode"></el-option>
          </el-select>


          <el-button style="min-width:61px;width:61px;" class="margin-left10" @click="onSearch" type="primary"
            plain>查询</el-button>
        </el-row>
        <div v-if="hidden">
          <el-row class="margin-top16" type="flex">
            <el-col style="width: 215px">
              <el-input class="margin-top16 limiting" placeholder="请输入任务名称" v-model="flupContent" clearable>
              </el-input></el-col>
            <el-col style="width: 215px">
              <el-input class="margin-top16 limiting margin-left20" v-model="patientName" placeholder="请输入姓名"
                maxlength="20" show-word-limit></el-input>
            </el-col>
          </el-row>
          <el-row class="margin-top16" type="flex">
            <el-select v-model="deptId" placeholder="科室" clearable filterable @change="onSearch">
              <el-option v-for="item in deptList" :key="item.serialNo" :value="item.serialNo"
                :label="item.deptName"></el-option>
            </el-select>
            <el-select v-model="crowdType" class="margin-left20" placeholder="人群标签" @change="onSearch" clearable>
              <el-option v-for="item in crowdTypeList" :key="item.dict_code" :value="item.dict_code"
                :label="item.dict_name"></el-option>
            </el-select>
          </el-row>
          <el-row class="margin-top16" type="flex">
            <el-select v-model="followType" placeholder="随访类型" @change="onSearch" clearable>
              <el-option v-for="item in followTypeList" :key="item.name" :value="item.name"
                :label="item.name"></el-option>
            </el-select>
          </el-row>
        </div>

        <div class="butBox">
          <el-button type="text" @click="showOrHide">{{
            !hidden ? "高级筛选" : "收起"
          }}</el-button>
        </div>

        <div ref="phone-followup_list" class="phone-followup_list">
          <el-table ref="refTable" highlight-current-row @current-change="changePatient" :data="mainList" stripe border>
            <el-table-column v-if="mergeConfigColumns.length != 0" :min-width="120" :width="120" label="基本信息"
              show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-for="(item, index) in mergeConfigColumns" :key="index">{{ scope.row[item.fieldName] |
                  hideInfo(item.fieldName) }}
                  {{ index + 1 == mergeConfigColumns.length ? "" : "/" }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="flupType" label="随访任务" min-width="80"></el-table-column>
            <el-table-column prop="flupState" label="随访状态" min-width="80"></el-table-column>
            <!-- <el-table-column
              prop="flupContent"
              label="任务名称"
              show-overflow-tooltip
            ></el-table-column>
            <el-table-column
              prop="flupStartTime"
              label="随访时间"
              min-width="170"
            ></el-table-column> -->
            <el-table-column show-overflow-tooltip :min-width="item.displayName == '申请单编号' ? '300' : '120'"
              v-for="item in this.baseColumnsV2" :key="item.index" :prop="item.fieldName"
              :label="item.displayName"></el-table-column>
          </el-table>
          <el-pagination v-if="total != 0" class="page-custom" layout="prev, pager, next" :total="total"
            @current-change="handleCurrentChange" :page-size="pageSize" :pager-count="5" :current-page.sync="pageIndex"
            background small></el-pagination>
        </div>
      </section>
      <section v-if="show" class="phone-followup_main">
        <div v-if="mainList.length == 0" class="nonexistenceData">
          一条记录都没有
        </div>
        <template v-else>
          <div class="phone-followup_main_top">
              <el-row type="flex">
                <el-col class="flex-align">
                  <div class="color-333 font-size6 bold">
                    {{ currentItem.patientName | hideInfo("patientName") }}
                  </div>
                  <div class="margin-left20">{{ currentItem.sex }}</div>
                  <div class="margin-left20">{{ currentItem.age }}</div>
                </el-col>
                <!-- <el-col class="flex">
                  <div class="color-666 margin-right10">病人配合度</div>
                  <div class="margin-right20">
                    <el-rate
                      :value="currentItem.coordination"
                      disabled
                      v-if="hasComplete  && !disabledButton"
                    ></el-rate>
                    <el-rate v-model="form.coordination" v-else></el-rate>
                  </div>
                </el-col>-->
                <el-col class="flex"></el-col>
                <el-col class="flex"></el-col>
                <i style="margin-left: -120px; font-size: 20px; color: #409eff" class="el-icon-setting" @click="sz"></i>
  
                <el-button class="float-right check-plan" type="primary" @click="openPlan" plain
                  style="margin-left: 20px">查看计划</el-button>
                <el-button v-if="currentItem.flupType == '定期复诊'" class="float-right" type="primary" @click="promptMessage"
                  plain style="margin-left: 20px">预约挂号</el-button>
              </el-row>
              <el-row class="margin-top20" type="flex">
                <el-col class="flex" style="align-items: center;">
                  <div class="color-666 margin-right10">手机号码</div>
                  <div style="display: flex;align-items: center;" v-if="currentItem.mobile ||
                    currentItem.phone ||
                    currentItem.contactPhone
                    ">
                    {{
                      $utils.shield(
                        currentItem.mobile ||
                        currentItem.phone ||
                        currentItem.contactPhone,
                        2
                      )
                    }}
                    <i v-show="refresh" style="color:#32ae57;font-size: 21px;margin-left: 3px;cursor: pointer;"
                      class="el-icon-phone-outline" @click="
                        call(
                          currentItem.mobile ||
                          currentItem.phone ||
                          currentItem.contactPhone
                        )
                        "></i>
                    <img v-if="isVoiceChat" style="width: 25px;height: 25px;margin-left: 3px;cursor: pointer;"
                      src="@/assets/images/jqr.png" alt="语音随访" @click="
                        voiceFollowUpMakeCall(
                          currentItem.mobile ||
                          currentItem.phone ||
                          currentItem.contactPhone
                        )
                        " />
                  </div>
                </el-col>
                <el-col class="flex" style="align-items: center;">
                  <div class="color-666 margin-right10">家庭号码</div>
                  <div style="display: flex;align-items: center;" v-if="currentItem.mobile ||
                    currentItem.phone ||
                    currentItem.contactPhone
                    ">
                    {{
                      $utils.shield(
                        currentItem.phone ||
                        currentItem.mobile ||
                        currentItem.contactPhone,
                        2
                      )
                    }}
                    <i v-show="refresh" style="color:#32ae57;font-size: 21px;margin-left: 3px;cursor: pointer;"
                      class="el-icon-phone-outline" @click="
                        call(
                          currentItem.mobile ||
                          currentItem.phone ||
                          currentItem.contactPhone
                        )
                        "></i>
                    <img v-if="isVoiceChat" style="width: 25px;height: 25px;margin-left: 3px;cursor: pointer;"
                      src="@/assets/images/jqr.png" alt="语音随访" @click="
                        voiceFollowUpMakeCall(
                          currentItem.mobile ||
                          currentItem.phone ||
                          currentItem.contactPhone
                        )
                        " />
                  </div>
                </el-col>
                <el-col class="flex">
                  <div class="color-666 margin-right10">执行时间</div>
                  <div>{{ $utils.formatDate(currentItem.flupStartTime) }}</div>
                </el-col>
  
                <el-col class="flex"></el-col>
              </el-row>
              <el-row class="margin-top20" type="flex">
                <el-col class="flex">
                  <div class="color-666 margin-right10">完成时间</div>
                  <div>{{ $utils.formatDate(currentItem.flupTimeReal) }}</div>
                </el-col>
                <el-col class="flex">
                  <div class="color-666 margin-right10">入院时间</div>
                  <div>
                    {{ $utils.formatDate(currentItem.admissionDatetime) }}
                  </div>
                </el-col>
                <el-col class="flex">
                  <div class="color-666 margin-right10">出院时间</div>
                  <div>
                    {{ $utils.formatDate(currentItem.dischargeDatetime) }}
                  </div>
                </el-col>
                <el-col class="flex"></el-col>
              </el-row>
              <el-row class="margin-top20" type="flex">
                <el-col class="flex">
                  <div class="color-666 margin-right10">出院病区</div>
                  <div>{{ currentItem.dischargeWard }}</div>
                </el-col>
                <el-col class="flex">
                  <div class="color-666 margin-right10">患者医保卡号</div>
                  <div>{{ currentItem.medicalInsuranceCardNo }}</div>
                </el-col>
              </el-row>
              <el-row class="margin-top20">
                <el-col style="flex-wrap: wrap;align-items: center;" class="flex">
                  <div class="color-666 margin-right10">人群标签</div>
                  <div style="display: flex;flex-wrap: wrap;align-items: center;" v-if="showCrow">
                    <el-tag type="success" effect="plain" style="margin:4px;border-color:#32AE57;" closable
                      v-for="crowd in currentItem.crowdTypeList" :key="crowd.dict_code" @close="deleteCrow(crowd)">{{
                        crowd.dict_name }}</el-tag>
                    <i style="color: #0283ef; font-size: 17px; font-weight: 600" class="el-icon-circle-plus-outline"
                      @click.stop="filterCrow"></i>
                  </div>
                </el-col>
              </el-row>
              <div id="crowEnable" v-if="addCrowEnable">
                <el-input class="width200px value" v-model="keyValue" placeholder="请输入" clearable>
                  <el-button slot="append" icon="el-icon-search" @click="filterCrow"></el-button>
                </el-input>
                <div
                  style="width: 200px;background: #FFFFFF;box-shadow: 0 2px 4px 0 rgba(193,193,193,0.50);padding: 14px 0px;height: 150px;overflow: scroll; ">
                  <div>
                    <el-tag type="success" effect="plain" style="margin:4px;border-color:#32AE57;" @click="addCrow(crow)"
                      v-for="crow in crowdTypeCurList" :key="crow.dict_code">{{ crow.dict_name }}</el-tag>
                  </div>
                </div>
              </div>
              <el-row class="margin-top20" type="flex" justify="end">
                <el-button v-if="isVoiceChat" type="primary" :disabled="voiceChatShow" @click="setVoiceChatShow">
                  语音随访详情
                  <i class="el-icon-position"></i>
                </el-button>
                <el-button type="text" @click="showInfo = !showInfo">
                  个人详情
                  <i class="el-icon-arrow-down icon-transition" :class="{ rotate: showInfo }"></i>
                </el-button>
              </el-row>
              <el-collapse-transition>
                <div class="personalDetails" v-show="showInfo">
                  <table class="info-table">
                    <tr>
                      <td class="info-label">姓名</td>
                      <td class="info">
                        {{ currentItem.patientName | hideInfo("patientName") }}
                      </td>
                      <td class="info-label">性别</td>
                      <td class="info">{{ currentItem.sex }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">年龄</td>
                      <td class="info">{{ currentItem.age }}</td>
                      <td class="info-label">出生日期</td>
                      <td class="info">
                        {{ $utils.formatDate(currentItem.dateOfBirth) }}
                      </td>
                    </tr>
                    <tr>
                      <td class="info-label">联系电话</td>
                      <td class="info">
                        {{
                          $utils.shield(
                            currentItem.contactPhone ||
                            currentItem.mobile ||
                            currentItem.phone,
                            2
                          )
                        }}
                      </td>
                      <td class="info-label">身份证号</td>
                      <td class="info">
                        {{ $utils.shield(currentItem.idNo, 3) }}
                      </td>
                    </tr>
                    <tr>
                      <td class="info-label">籍贯</td>
                      <td class="info">{{ currentItem.nativePlace }}</td>
                      <td class="info-label">民族</td>
                      <td class="info">{{ currentItem.clan }}</td>
                    </tr>
                    <tr>
                      <td class="info-label">婚姻</td>
                      <td class="info">{{ currentItem.maritalStatus }}</td>
                      <td class="info-label">家庭住址</td>
                      <td class="info">
                        {{ $utils.shield(currentItem.homeAddrHouseNumber, 4) }}
                      </td>
                    </tr>
                  </table>
                </div>
              </el-collapse-transition>
              <div class="handle-line border-bottom1" v-show="!showInfo"></div>
              <el-row class="handle-box">
                <el-col style="flex-wrap: wrap;align-items: center;" class="flex">
                  <div class="margin-right10 remark" @click="openRemark">
                    <img style="width: 14px; height: 14px;position: relative;top: 2px;left: 3px;" src="~@/assets/images/icon/edit.png" alt @click="play(item.remarkUrl)"/>
                    <el-button type="text">备注</el-button>
                  </div>
                  <!-- <div
                    style="display: flex;flex-wrap: wrap;align-items: center;"
                    v-if="remarks.length && !remarkIsOpen"
                    class="remarkOne"
                  >
                    {{ remarks[0].createTime + " " + remarks[0].remarkContent }}
                  </div> -->
                  <el-upload ref="upload" :action="$baseURL.ICDMApiUrl + '/file/upload'" :show-file-list="false"
                    :on-success="(res) => handleAvatarSuccess(res)" :before-upload="beforeAvatarUpload"
                    class="list-btns__upload">
                    <img style="width: 14px; height: 14px;position: relative;top: 2px;left: 3px;" src="~@/assets/images/icon/audio-upload.png" alt/>
                    <el-button type="text" :title="types">上传文件</el-button>
                  </el-upload>
                  <span class="remark">
                    <img style="width: 14px; height: 14px;position: relative;top: 2px;left: 3px;" src="~@/assets/images/icon/op-log.png" alt/>
                    <el-button type="text" @click="getOperation">操作记录</el-button>
                  </span>
                </el-col>
              </el-row>
              <el-row class="remarkContent">
                <el-col style="flex-wrap: wrap;align-items: center;">
                  <el-input type="textarea" autosize placeholder="请输入内容" v-model="textareaRemark" @blur="newRemark"
                    v-show="remarkIsOpen">
                  </el-input>
                  <div class="remarkList" v-for="(item, index) in remarks" :key="index">
                    <section  v-if="remarkIsOpen || index == 0">
                      <div class="remarkTime">
                        <div class="remarkTime-fline">
                          <span class="remarkTime-time">{{ item.createTime }}</span>
                          <span class="remarkTime-btn">
                            <el-button type="text" @click="editRemark(item, index)">编辑</el-button>
                            <el-button type="text" @click="topRemark(item)" v-if="item.isTop">取消置顶</el-button>
                            <el-button type="text" @click="topRemark(item)" v-else>置顶</el-button>
                            <span @click="deleteRemark(item.remarkId)">删除</span>
                          </span>
                        </div>
                        <el-input type="textarea" autosize placeholder="请输入内容" v-model="item.remarkContent2"
                          @blur="editRemarkSave(item)" v-if="index === editIndex && item.remarkType == 1">
                        </el-input>
                        <div v-else-if="item.remarkType == 2" class="audio-line">
                        <!-- <audio  :src="item.remarkUrl" controls controlsList="nodownload noplaybackrate" @play="onPlay(item)" :ref="item.remarkId">
                              <source :src="item.remarkUrl" type="audio/Wav" />
                              <embed height="100" width="100" :src="item.remarkUrl" />
                        </audio> -->
                        <span :title="item.remarkContent" class="remark-content">{{ item.remarkContent }}</span>
                        <img style="width: 20px; height: 20px; margin-right: 10px" src="~@/assets/images/bf.png" alt @click="play(item.remarkUrl)"/>
                      </div>
                      <div v-else-if="item.remarkType == 3" class="audio-line audio-line2">
                    <div class="demo-image__preview">
                      <el-image style="width: 100px; height: 100px" :src="item.remarkUrl" :preview-src-list="srcList">
                      </el-image>
                    </div>
                    <div :title="item.remarkContent" class="remark-content">{{ item.remarkContent }}</div>
                    <!-- <el-button type="text" class="v1ew" @click="viewPic(item)">查看图片</el-button> -->
                    <!-- <img style="width: 20px; height: 20px; margin-right: 10px;position: relative;bottom: 5px;" src="~@/assets/images/bf.png" alt @click="play(item.remarkUrl)" /> -->
                  </div>
                  <div v-else-if="item.remarkType == 4" class="audio-line">
                    <span :title="item.remarkContent" class="remark-content">{{ item.remarkContent }}</span>
                    <img style="width: 20px; height: 20px; margin-right: 10px;position: relative;" src="~@/assets/images/v1ew.png" alt @click="viewFile(item)" />
                  </div>
                        <div class="remarkDetail" v-else>{{ item.remarkContent }}</div>
                      </div>
                    </section>
                  </div>
                </el-col>
              </el-row>
              <div class="more" v-if="remarks.length > 1">
                <span class="more-box" @click="openRemark"  v-if="remarkIsOpen">
                  <span class="more-text" >收起</span>
                  <i class="el-icon-arrow-up"></i>
                </span>
                <span class="more-box" @click="openRemark" v-else >
                  <span class="more-text" >更多</span>
                  <i class="el-icon-arrow-down"></i>
                </span>
              </div>
            </div>
          <el-row class="padding-top20 padding-bottom10 border-bottom1">
            <el-col :span="12" style="padding-top: 9px">
              随访结果
              <span v-if="currentItem.authState == 30" style="color:#999">(已作废)</span>
            </el-col>
            <el-col :span="2" :offset="10">
              <el-button type="success" style="width: 70px; height: 30px; line-height: 0" @click="showHistoryRecord" v-if="currentItem.flupType == '专科随访' ||
                currentItem.flupType == '调查问卷'
                ">导入</el-button>
            </el-col>
            <!-- :before-close="handleClose" -->
          </el-row>
          <el-row class="padding20" type="flex">
            <el-col>
              随访电话
              <el-input class="width200px margin-left10" :disabled="(hasComplete && !disabledButton) ||
                currentItem.flupType == '定期检查' ||
                currentItem.flupType == '定期检验' ||
                hasOverdue
                " :maxlength="11" v-model="form.editPhone" placeholder="请输入联系号码" @keyup.native="validateMobile"
                clearable></el-input>
            </el-col>
            <el-col>
              随访状态
              <el-select class="margin-left10 width200px" :disabled="(hasComplete && !disabledButton) ||
                currentItem.flupType == '定期检查' ||
                currentItem.flupType == '定期检验' ||
                hasOverdue
                " v-model="form.followupResult" placeholder="请选择随访结果">
                <el-option v-for="(item, i) in followupResultList" :key="i" :label="item.dict_name"
                  :value="Number(item.dict_code)" :disabled="item.enabled == 0"></el-option>
              </el-select>
              <el-button class="margin-left20" type="primary" v-if="currentItem.flupType === '专科随访' && hasComplete"
                :disabled="disabledButton" @click="onSwitch(true)">修改</el-button>
            </el-col>
          </el-row>
          <el-row style="padding:0px 20px 20px 20px" type="flex" v-if="(constructionReport == '0' &&
              (currentItem.flupType == '定期检查' ||
                currentItem.flupType == '定期检验')) ||
            currentItem.flupType == '定期复诊'
            ">
            <el-col>
              预约时间
              <el-date-picker v-model="form.appointmentTime" type="datetime" placeholder="选择日期时间"
                value-format="yyyy-MM-dd hh:mm:ss" :disabled="hasComplete || hasOverdue" :picker-options="pickerOptions"
                class="padding-left10 width210px"></el-date-picker>
            </el-col>
            <el-col>
              备注信息
              <el-input class="width200px margin-left10" :maxlength="200" v-model="form.remark2" show-word-limit
                :disabled="hasComplete || hasOverdue"></el-input>
            </el-col>
          </el-row>
          <el-row class="padding-bottom10 border-bottom1 margin-bottom20 ">随访内容
            <!-- <el-button style="width: 70px; height: 30px; line-height: 0; float: right" type="success" @click="print"
              v-if="printBtnShow">打印</el-button> -->
          </el-row>
          <FollowupContent v-if="(questionnaireRecordtrfa &&
              currentItem.flupType != '定期检验' &&
              currentItem.flupType != '定期检查') ||
            (questionnaireRecordtrfa &&
              constructionReport == '1' &&
              (currentItem.flupType == '定期检验' ||
                currentItem.flupType == '定期检查'))
            " ref="followupContent" :currentItem="currentItem" :form="form" :questionnaireRecord="questionnaireRecord"
            @refresh="getMainList" :item.sync="item" class="followup_content" @changeSuggestion="changeSuggestion">
          </FollowupContent>
          <iframe ref="printIframe" style="display: none;"></iframe>
          <el-table class="margin-top20" :data="showList" highlight-current-row stripe border v-if="constructionReport == '0' &&
            (currentItem.flupType == '定期检验' ||
              currentItem.flupType == '定期检查')
            ">
            <el-table-column type="index" label="序号" :width="50"></el-table-column>
            <template v-if="currentItem.flupType == '定期检查'">
              <el-table-column show-overflow-tooltip label="检查内容">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.checkType"
                    @change="switchType(scope.row, $event)">
                    <el-option v-for="(item, index) in checkTypeList" :key="index" :label="item.examTypeName"
                      :value="item.examTypeName"></el-option>
                  </el-select>
                  <div v-else>{{ scope.row.checkType }}</div>
                </template>
              </el-table-column>
              <el-table-column label="检查部位">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.checkPart"
                    @change="switchPart(scope.row, $event)">
                    <el-option v-for="(item, index) in checkPartList" :key="index" :label="item.examBodyName"
                      :value="item.examBodyName"></el-option>
                  </el-select>
                  <div v-else>{{ scope.row.checkPart }}</div>
                </template>
              </el-table-column>
              <el-table-column label="检查项目">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.checkItem"
                    @change="switchItem(scope.row, $event)">
                    <el-option v-for="(item, index) in checkItemList" :key="index" :label="item.examItemName"
                      :value="item.examItemName"></el-option>
                  </el-select>
                  <div v-else>{{ scope.row.checkItem }}</div>
                </template>
              </el-table-column>
            </template>
            <template v-else>
              <el-table-column show-overflow-tooltip label="检验名称">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.examItem" @change="switchInspect(scope.row)">
                    <el-option v-for="(item, inedx) in inspectionNameList" :key="inedx" :label="item.ylmc"
                      :value="item.ylmc"></el-option>
                  </el-select>
                  <span v-else>{{ scope.row.examItem }}</span>
                </template>
              </el-table-column>
              <el-table-column label="样本类型">
                <template slot-scope="scope">
                  <el-select v-if="scope.row.isEdit" v-model="scope.row.examType" @change="switchPiece(scope.row)">
                    <el-option v-for="(item, index) in inspectionTypeList" :key="index" :label="item.sampledescribe"
                      :value="item.sampledescribe"></el-option>
                  </el-select>
                  <div v-else>{{ scope.row.examType }}</div>
                </template>
              </el-table-column>
            </template>
            <el-table-column v-if="currentItem.authState == 10" label="操作" width="120">
              <template slot-scope="scope">
                <div v-if="scope.row.isEdit">
                  <el-button type="text" @click="onConfirmEdit(scope.row)">确定</el-button>
                  <el-button type="text" @click="onCancel">撤销</el-button>
                </div>
                <div v-else>
                  <el-button @click="deleteItem(scope)" type="text">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
          <el-row v-if="!hasComplete &&
            currentItem.flupType != '定期检查' &&
            currentItem.flupType != '定期检验'
            " class="padding-bottom10 border-bottom1 margin-bottom20">
            新增单次随访
            <el-switch v-model="nextFlupTimeSwitch"></el-switch>
          </el-row>
          <el-date-picker value-format="yyyy-MM-dd" v-if="nextFlupTimeSwitch && !hasComplete" v-model="nextFlupTime"
            type="date" placeholder="选择日期"></el-date-picker>
          <el-button icon="icon-add" class="margin-top20" v-if="!hasComplete &&
            constructionReport == '0' &&
            (currentItem.flupType == '定期检查' ||
              currentItem.flupType == '定期检验')
            " type="text" @click="onAdd">
            <span class="margin-left4 inline-middle">新增</span>
          </el-button>
          <el-row v-if="!hasComplete" class="margin-top20" type="flex" justify="center">
            <div v-if="currentItem.flupType == '定期检查' ||
              currentItem.flupType == '定期检验' ||
              currentItem.flupType == '慢病评估报告'
              ">
              <el-button class="width200px" type="primary" @click="onConstruction" v-if="(constructionReport == '1' &&
                  (currentItem.flupType == '定期检查' ||
                    currentItem.flupType == '定期检验')) ||
                (constructionPaper == '1' &&
                  currentItem.flupType == '慢病评估报告')
                ">去审核</el-button>
              <el-button v-if="(constructionReport == '0' &&
                  (currentItem.flupType == '定期检查' ||
                    currentItem.flupType == '定期检验')) ||
                (constructionPaper == '0' &&
                  currentItem.flupType == '慢病评估报告')
                " @click="onDelete(30)">作 废</el-button>
              <el-button v-if="(constructionReport == '0' &&
                  (currentItem.flupType == '定期检查' ||
                    currentItem.flupType == '定期检验')) ||
                (constructionPaper == '0' &&
                  currentItem.flupType == '慢病评估报告')
                " type="primary" @click="onAudit(20)">提 交</el-button>
            </div>
            <div v-else>
              <el-button v-if="(
                  currentItem.flupType == '消息提醒' ||
                  currentItem.flupType == '健康宣教' ||
                  currentItem.flupType == '调查问卷' ||
                  currentItem.flupType == '专科随访' ||
                  currentItem.flupType == '定期复诊'
                )
                " @click="onDelete(30)">作 废</el-button>
              <el-button v-if="currentItem.flupType == '专科随访'" class="width200px" type="primary" @click="onSave">保
                存</el-button>

              <el-button v-if="!hasOverdue && hiddenSubmit" class="width200px" type="primary" @click.once.stop.prevent="onSubmit">提
                交</el-button>
            </div>
          </el-row>
          <el-row v-else-if="disabledButton" type="flex" justify="center">
            <el-button @click="onSwitch(false)" type="primary">返回</el-button>
            <el-button type="primary" @click="onSubmit">提 交</el-button>
          </el-row>
        </template>
      </section>
    </div>
    <FollowupRecord v-if="mainList.length > 0" :patient-info="currentItem"></FollowupRecord>
    <el-dialog title="设置显示字段" :visible.sync="dialogField" width="90%" top="10vh" :close-on-click-modal="false"
      :close-on-press-esc="false">
      <div style="padding: 20px" class="flex">
        <div class="checklistbox" style="flex: 4">
          <h4 style="color: #666">可选字段</h4>
          <div>
            <div v-for="(item, index) in modules" :key="index">
              <h3 style="padding: 10px 0px">{{ item.moduleName }}</h3>
              <div class="checkxbox">
                <el-checkbox-group v-model="checkList">
                  <template v-for="(item2, index) in item.columns">
                    <el-checkbox v-if="isShowMerge
                        ? item2.displayName != '床号' &&
                        item2.displayName != '年龄' &&
                        item2.displayName != '患者性别' &&
                        item2.displayName != '患者姓名'
                        : true
                      " :key="index" :label="item2.id">{{ item2.displayName }}</el-checkbox>
                  </template>
                </el-checkbox-group>
              </div>
            </div>
          </div>
          <h4 class="margin-top20" style="color: #666; display: inline-block">
            首字段合并设置
          </h4>
          <el-switch class="margin-left10" v-model="isShowMerge"></el-switch>
          <div v-if="isShowMerge" class="checkxbox margin-top10">
            <el-checkbox-group v-model="mergeConfigList">
              <el-checkbox v-for="(item2, index) in mergeList" :key="index" :label="item2.id">{{ item2.displayName
              }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="xdzd" style="flex: 1">
          <h4 style="color: #666; text-align: center">当前选定字段</h4>
          <el-tree :data="baseColumns" node-key="id" default-expand-all draggable @node-drag-start="dragTheStart"
            @node-drop="dragTheEnter" :expand-on-click-node="false">
            <span style="width: 100%; padding: 5px 0px" class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.displayName }}</span>
              <span style="margin-bottom: 3px">
                <el-button icon="el-icon-close" type="text" @click="() => remove(node, data)"></el-button>
              </span>
            </span>
          </el-tree>
          <h4 style="color: #666; text-align: center; margin-top: 40px">
            首字段选定字段
          </h4>
          <el-tree :data="mergeConfigColumns" node-key="id" default-expand-all draggable
            @node-drag-start="dragTheStartMerge" @node-drop="dragTheEnterMerge" :expand-on-click-node="false">
            <span style="width: 100%; padding: 5px 0px" class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.displayName }}</span>
              <span style="margin-bottom: 3px">
                <el-button icon="el-icon-close" type="text" @click="() => remove(node, data)"></el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="dialogField = false">取 消</el-button>
        <el-button type="primary" @click="bc">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="历史填写导入" :visible.sync="dialogVisible" width="30%" :close-on-click-modal="false"
      :close-on-press-esc="false">
      <el-table :data="surveyRecordData" border highlight-current-row @current-change="selectRow">
        <el-table-column prop="flupContent" label="随访任务"></el-table-column>
        <el-table-column prop="flupTimeReal" label="填写时间"></el-table-column>
      </el-table>
      <!-- <div v-else style="text-align: center;min-height: 200px;padding: 50px 0;">
        <span style="color:gray;">暂无历史填写记录</span>
      </div>-->
      <span slot="footer" class="dialog-footer" style="border-top: 1px solid white">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="importHistoryRecord">确 定</el-button>
      </span>
    </el-dialog>
    <IPCC ref="ipccRef" v-if="refresh === true" :ipccPhone="ipccPhone"></IPCC>
    <VoiceChat ref="voiceChatRef" v-dragZoom v-if="voiceChatShow" :flupSerialNo="flupSerialNo"
      @viceChatShowFalse="voiceChatShow = false"></VoiceChat>
      <operation-log ref="dialogPackage" :tableData="tableData"></operation-log>
      <el-dialog title="编辑备注" :visible.sync="editFileName" width="30%" :before-close="handleClose" :close-on-click-modal="false">
      <div style="margin-top: 15px;">
        <el-input placeholder="请输入备注名称" v-model="filename">
          <!-- <template slot="append">{{ fileRemark.suffix }}</template> -->
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="editFileRemarkSave">确 定</el-button>
      </span>
    </el-dialog>
      <div class="audio-box" v-if="recordUrl">
      <audio :src="recordUrl" controls="controls" ref="recordAudio" controlsList="nodownload noplaybackrate">
          <source :src="recordUrl" type="audio/Wav" />
          <embed height="100" width="100" :src="recordUrl" />
    </audio>
    <span class="audio-close" @click="playClose">
        <i class="el-icon-close"></i>
      </span>
    </div>
  </section>
</template>

<script>
import "@/assets/js/ipcc/Math.uuid.js";
import IPCC from "@/components/ipcc.vue";
import VoiceChat from "@/components/voiceChat.vue";
import FollowupContent from "@/components/followup_content";
import Pagination from "@/mixins/pagination.js";
import tableEdit from "@/mixins/tableEdit.js";
import FollowupRecord from "@/pagesTransfer/components/followup_record";
import operationLog from '@/pages/chronic_disease/health_archives/components/operationLog';
import { Base64 } from "js-base64";
export default {
  name: "routine",
  mixins: [Pagination],
  data() {
    return {
      item: {},
      nextFlupTimeSwitch: false,
      nextFlupTime: null,
      dateRange: [],
      planList: [],
      flupContent: '',
      currentItem: {},
      mainList: [],
      showInfo: false,
      hidden: false,
      followUpStateList: [],
      planList: [],
      followUpState: "",
      planValue: "",
      //从未回复管理调过来添加筛选
      patientName: this.$route.query.patientName
        ? this.$route.query.patientName
        : "",
      followupResultList: [],
      form: {
        editPhone: "",
        followupResult: "1",
        coordination: 0,
        appointmentTime: null,
        remark2: null
      },
      hasComplete: false,
      hasOverdue: false,
      show: false,
      disabledButton: false,
      alllist: [],
      baseColumns: [],
      baseColumnsV2: [],
      modules: [],
      zc: [],
      dialogField: false,
      checkList: [],
      isShowMerge: false,
      mergeConfigList: [],
      mergeList: [],
      mergeConfigColumns: [],
      // patientTypeTc: '',
      dialogVisible: false,
      // hasHistoryRecord: true,
      retCode: "",
      surveyRecordData: [], //历史问卷数组
      currentRow: null,
      questionnaireRecord: {}, //
      questionnaireRecordtrfa: true,
      flupAddress: "",
      queryserialNo: this.$route.query.serial_no,
      currentSerialNo: null,
      userId: null,
      flupContentId: null,
      showPhoneIcon: false,
      printBtnShow: false,
      deptId: "",
      deptList: [],
      crowdType: "",
      crowdTypeList: [],
      crowTypes: [],
      // crowdTypeCurList: [],
      showCrow: true,
      addCrowEnable: false,
      updateCrow: false,
      keyValue: "",
      refresh: false,
      ipccPhone: null,
      voiceChatShow: false,
      isVoiceChat: false,
      flupSerialNo: null,
      constructionReport: "1", //检查检验是否需要审核系统配置
      constructionPaper: "1", //慢病报告是否需要审核系统配置
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 3600 * 1000 * 24;
        }
      },
      checkTypeList: [],
      checkPartList: [],
      checkItemList: [],
      inspectionNameList: [],
      inspectionTypeList: [],
      remarkIsOpen: false,
      remarks: [],
      textareaRemark: "",
      editIndex: '',
      tableData: [],
      recordUrl: '',
      followTypeList: [],
      followType: "",
      hiddenSubmit: true,
      url: "",
      srcList: [],
      editFileName: false,
      filename: "",
      fileRemark: {
        suffix: ""
      },
      types: '.mp3 .wav .jpeg .jpg .png .pdf .docx .doc .xlsx .xls'
    };
  },
  components: { FollowupContent, FollowupRecord, IPCC, VoiceChat, operationLog },

  watch: {
    checkList() {
      this.baseColumns = [];
      for (let i in this.checkList) {
        for (let j in this.alllist) {
          if (this.checkList[i] == this.alllist[j].id) {
            this.baseColumns.push(this.alllist[j]);
          }
        }
      }
    },
    mergeConfigList() {
      this.mergeConfigColumns = [];
      for (let i in this.mergeConfigList) {
        for (let j in this.mergeList) {
          if (this.mergeConfigList[i] == this.mergeList[j].id) {
            this.mergeConfigColumns.push(this.mergeList[j]);
          }
        }
      }
    },
    crowTypes: {
      handler() {
        this.showCrow = false;
        this.currentItem.crowdTypeList = this.crowdTypeList.filter(x =>
          this.crowTypes.includes(x.dict_code)
        );
        this.crowdTypeCurList = this.crowdTypeList.filter(
          x => !this.crowTypes.includes(x.dict_code)
        );
        this.showCrow = true;
        if (this.updateCrow) {
          this.$apis
            .editPatientCrowdType({
              userId: this.currentItem.userId,
              crowdType: this.crowTypes.join(",")
            })
            .then(res => {
              if (res) {
                this.$message({
                  type: "success",
                  message: "人群标签更新成功"
                });
                if (this.addCrowEnable) this.addCrowEnable = false;
              }
            });
        }
      },
      deep: true,
      immediate: false
    }
  },
  // mixins: [pagination, tableEdit, inspection],
  async created() {
    //语音随访开关
    // this.$apis
    //   .queryFlupConfigOne({
    //     hospitalId: this.$global.hospital_id,
    //     moduleCode: 'followUpSetting',
    //     componentKey: 'voiceFollowUp',
    //   })
    //   .then((res) => {
    //     this.isVoiceChat = res.componentValue == 0 ? false : true
    //   })
    this.initSearch()
    this.$apis
      .queryFlupConfigOne({
        hospitalId: this.$global.hospital_id,
        moduleCode: "followUpSetting",
        componentKey: "voiceFollowUp"
      })
      .then(res => {
        this.isVoiceChat = res.componentValue == 1 ? true : false;
      });

    this.$apis
      .queryDictByCode({
        grandParentDictCode: "Flup",
        parentDictCode: "SmartFlupStatus"
      })
      .then(res => {
        this.followUpStateList = res;
      });

    // ipcc 配置 开关
    // this.$apis
    //   .ParameterselectParametersByParameterKey({
    //     parameterKey: 'ipccEnable',
    //     hospitalId: this.$global.hospital_id,
    //   })
    //   .then((res) => {
    //     this.refresh = res.enabled == 1 ? true : false
    //   })
    this.$apis
      .queryFlupConfigOne({
        hospitalId: this.$global.hospital_id,
        moduleCode: "followUpSetting",
        componentKey: "ipccEnable"
      })
      .then(res => {
        this.refresh = res.componentValue == 1 ? true : false;
      });

    this.$apis
      .flupPlanqueryCurrentUserFlupPlanList({
        pageNo: 1,
        pageSize: 100,
        hospitalId: this.$global.hospital_id,
        enable: 1
      })
      .then(res => {
        this.planList = res.list;
      });

    // await this.$apis.systemManagequeryCurrentUserDept().then((res) => {
    //   this.deptList = res;
    // });
    ///原权限内科室换为所有随访科室
    // await this.$apis
    //   .departmentquery({
    //     flupDepartment: 1,
    //     hospitalId: this.$global.hospital_id,
    //     pageNo: 1,
    //     pageSize: 1000
    //   })
    //   .then(res => {
    //     this.deptList = res.list;
    //   });
    await this.$apis.selectDeptByUserGroup({
          hospitalId: this.$global.hospital_id,
          userId: JSON.parse(sessionStorage.getItem('global')).userId || ''
        }).then(res => {
          this.deptList = res;
        })
    await this.$apis
      .BaseDictGetDictItems({
        keyWord: "",
        parentId: "20170915191220011928"
      })
      .then(res => {
        this.crowdTypeList = res;
      });
    var ro = new ResizeObserver(this.$_.debounce(this.setPageSize, 300));
    this.$nextTick(() => {
      ro.observe(this.$refs["phone-followup_list"]);
    });
    this.$apis
      .BaseDictGetDictItems({
        parentId: "20170912160321211c4f"
      })
      .then(res => {
        this.followupResultList = res;
      });
    //审核开关
    this.$apis
      .queryFlupConfigAllByGroup({
        hospitalId: this.$global.hospital_id
      })
      .then(res => {
        let list = res.find(i => {
          return i.moduleName == "随访配置";
        });
        let report = list.childList.find(i => {
          return i.componentDescription == "检查检验审核";
        });
        let paper = list.childList.find(i => {
          return i.componentDescription == "评估报告审核";
        });
        this.constructionReport = report.componentValue;
        this.constructionPaper = paper.componentValue;
      });
    //检查检验数据集
    this.$apis.ExaminegetCheckTypeList().then(res => {
      this.checkTypeList = res.examTypeList;
    });
    this.$apis.ExaminegetExamineList().then(res => {
      this.inspectionNameList = res.list;
    });
    this.$apis.ExaminegetSampleList().then(res => {
      this.inspectionTypeList = res.list;
    });
    this.getTypeList()
  },
  methods: {
    initSearch() {
      if(this.$route.query.time && this.$route.query.followType) {
        // console.log(this.$route.query.time, this.$route.query.followType)
        this.dateRange = [this.$route.query.time,this.$route.query.time]
        this.followType = this.$route.query.followType
      }
    },
    getTypeList() {
      this.$apis.queryFollowTypeList(JSON.parse(sessionStorage.getItem('global')).hospital_id).then((res) => {
        this.followTypeList = res.list.filter((item) => {
          return item.enable != 0;
        });
      });
    },
    promptMessage() {
      this.$message({
        message: "预约挂号暂未对接号源！",
        type: "warning"
      });
    },
    voiceFollowUpMakeCall(phone) {
      this.$confirm("此操作将会进行语音随访, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$apis
            .voiceFollowUpMakeCall({
              phone,
              call_id: this.currentItem.serialNo,
              flup_content_id: this.currentItem.flupContentId,
              patient_name: this.currentItem.patientName
            })
            .then(res => {
              this.$message({
                message: "操作成功!",
                type: "success"
              });
            });
        })
        .catch(() => { });
    },
    setVoiceChatShow() {
      this.flupSerialNo = this.currentItem.serialNo;
      this.voiceChatShow = true;
    },
    async play(url) {
      this.recordUrl = await this.$apis.getAudio(url)
      this.$nextTick(() => {
        let audio = this.$refs.recordAudio
        audio.currentTime = 0
        audio.play()
      })
    },
    deleteCrow(crow) {
      this.updateCrow = true;
      this.crowTypes.splice(this.crowTypes.indexOf(crow.dict_code), 1);
    },
    addCrow(crow) {
      this.updateCrow = true;
      this.crowTypes.push(crow.dict_code);
    },
    call(Phone) {
      this.$message({
        type: "warning",
        message: "网络异常，电话无法呼出!"
      });
      return;
      if (Phone) {
        this.ipccPhone = Phone;
        this.$nextTick(() => {
          this.$refs.ipccRef.callOut();
        });
      }
    },
    async setPageSize(entries) {
      for (let entry of entries) {
        if (entry.target.clientHeight != 0 && entry.target.clientWidth != 0) {
          const cr = entry.contentRect;
          let oldPageSize = this.pageSize;
          this.pageSize = Math.floor(
            (cr.height - (this.hidden ? 110 : 75)) / 40
          );
          if (this.pageSize <= 0) {
            this.pageSize = 1;
          }
          if (oldPageSize !== this.pageSize || this.mainList.length == 0) {
            await this.getMainList();
            // this.$stopLoading()
          }
        }
      }
    },
    async openPlan() {
      let row = this.currentItem;

      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + "/pc";
      }
      window.parent.postMessage(
        JSON.stringify({
          method: "addTab",
          url: decodeURIComponent(
            urlx +
            `#/viewPatientPlanV2?user_id=${row.userId}&serialNo=${row.serialNo}&patient_name=${row.patientName}&discharge_datetime=${row.dischargeDatetime}&recordSerialNo=${row.recordSerialNo}&joinPlanPatientType=${row.joinPlanPatientType}`
          ),
          title: "患者随访计划"
        }),
        "*"
      );
    },
    onSubmit() {
      // if (this.form.editPhone.length != 11 && this.form.editPhone.length > 0) {
      //   this.$message.warning('请输入正确的随访电话!')
      //   return
      // }
      let params = {
        serialNo: this.currentItem.serialNo,
        flupState: this.form.followupResult,
        flupPhone: this.form.editPhone,
        appointmentTime: this.form.appointmentTime,
        remark2: this.form.remark2,
        nextFlupTime: this.nextFlupTimeSwitch ? this.nextFlupTime : null,
        coordination: parseInt(this.form.coordination),
        crowdType: this.crowTypes.join(","),
        bToken: this.$cookie.get("token") || this.$route.query.token
      };
      if (this.currentItem.flupType === "专科随访") {
        params.modifyStatus = this.disabledButton;
        this.$refs.followupContent.$refs.iframe.contentWindow.postMessage(
          {
            params: {
              user_id: this.currentItem.userId,
              old_flup_phone:
                this.currentItem.mobile ||
                this.currentItem.phone ||
                this.currentItem.contactPhone,
              flup_phone: this.form.editPhone,
              flup_status: this.form.followupResult,
              flup_time_real: this.completeDate
            }
          },
          "*"
        );
      } else if (this.currentItem.flupType === "调查问卷") {
        if (this.form.followupResult === 1) {
          let data = this.$refs.followupContent.getAnswerContent();
          if (!data) {
            return;
          }
          // let questionnaire = {
          //   master_id: this.currentItem.master_id,
          //   target_ext_user_id: this.currentItem.id_no,
          //   version_number: this.currentItem.version_number,
          //   answer_content_json: JSON.stringify(data),
          //   serial_no: this.currentItem.master_id==null?this.currentItem.detail_serial_no:this.currentItem.flup_content_id,
          //   hospital_id: this.$global.hospital_id,
          //   taskid:this.currentItem.serial_no
          // }
          params.answerContentJson = JSON.stringify(data);
        }
      }
      this.$apis.savePhoneFlupRecord(params).then(res => {
        this.$message({
          message: "提交成功",
          type: "success"
        });
        if (this.$route.query.serial_no) {
          window.parent.postMessage(
            JSON.stringify({
              method: "closeTab"
            }),
            "*"
          );
        }
        this.getMainList();
      });
    },
    validateMobile(v) {
      this.form.editPhone = this.form.editPhone.replace(/[^\d]/gi, "");
    },
    changePatient(v) {
      if (this.voiceChatShow) {
        this.$refs.voiceChatRef.setFlg();
      }
      this.remarkIsOpen = false;
      this.editIndex = '';
      this.questionnaireRecord = {};
      this.disabledButton = false;
      this.show = false;
      this.nextFlupTimeSwitch = false;
      this.nextFlupTime = null;
      if (!v) {
        this.currentItem = {};
        return;
      }
      console.log(12138,v)
      this.patientObject = v;
      this.hasComplete =  v.flupState === "已作废";
      this.hasOverdue = v.flupState === "已过期";
      this.hiddenSubmit = v.flupState == "已完成" ? false : true
      this.getInfo(v.serialNo); //这里取到选中行的serialNo
      this.$apis.getPatientRemark({ userId: v.userId }).then(res => {
        this.remarks = res.map(i => ({
          ...i,
          edit: false,
          remarkContent2: i.remarkContent
        }));
        this.remarks.forEach((i) => {
          if (i.remarkType == 3) {
            this.srcList.push(i.remarkUrl);
          }
        });
      });
    },
    getInfo(serialNo) {
      this.$apis
        .getFollowupTaskInfoForJava({
          serialNo: serialNo
        })
        .then(res => {
          this.show = true;
          this.currentItem = res || {};
          this.currentItem.coordination = this.currentItem.coordination
            ? parseInt(this.currentItem.coordination)
            : 0;
          this.form.coordination = this.currentItem.coordination;
          this.form.editPhone = this.currentItem.flupPhone;
          this.form.followupResult = this.currentItem.flupState;
          this.form.appointmentTime = this.currentItem.appointmentTime;
          this.form.remark2 = this.currentItem.remark2;

          this.userId = res.userId; //获取导入按钮需要的userId
          this.flupContentId = res.flupContentId; //获取导入按钮需要的flupContentId
          // this.clickTimes = 0
          this.updateCrow = false;
          // this.hasComplete = res.authState === 20 || res.authState === 30;
          this.crowTypes = this.currentItem.crowdType
            ? this.currentItem.crowdType.split(",")
            : [];
          if (
            this.currentItem.flupType === "定期检查" ||
            this.currentItem.flupType === "定期检验"
          ) {
            if (this.currentItem.flupType === "定期检查") {
              this.editItem = {
                checkType: "",
                checkPart: "",
                checkItem: "",
                isEdit: true
              };
            } else {
              this.editItem = {
                examType: "",
                examItem: "",
                isEdit: true
              };
            }
            this.getDataList(this.currentItem);
          }
          if (res.flupType == '调查问卷' && res.flupTimeReal) {
            this.printBtnShow = true
          } else {
            this.printBtnShow = false
          }
        });
    },
    getDataList(res) {
      // console.log(res);
      this.showList = res.flupContent
        ? res.flupContent.split(",").map(item => {
          if (this.currentItem.flupType === "定期检查") {
            return {
              checkType: item.split("|")[0],
              checkTypeCode: item.split("|")[1],
              checkPart: item.split("|")[2],
              checkPartCode: item.split("|")[3],
              checkItem: item.split("|")[4],
              checkItemCode: item.split("|")[5]
            };
          } else {
            return {
              examItem: item.split("|")[0],
              examItemCode: item.split("|")[1],
              examType: item.split("|")[2],
              examTypeCode: item.split("|")[3]
            };
          }
        })
        : [];
      // console.log(this.showList);
      this.showList.forEach(item => {
        this.$set(item, "isEdit", false);
      });
    },
    onSearch() {
      this.pageIndex = 1;
      this.queryserialNo = null;
      this.getMainList();
    },
    formatPersonInfo(row) {
      return `${this.$utils.shield(row.patientName, 1)}/${row.sex}/${row.age}`;
    },
    getMainList(param) {
      this.getlists();
      return this.$apis
        .getFolloupListInTelephoneForJava({
          flupType: this.followType,
          serialNo: this.queryserialNo,
          flupPlanId: this.planValue,
          flupState: this.followUpState,
          flupContent: this.flupContent,
          patientName: this.patientName,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          dischargeStartTime: (this.dateRange && this.dateRange[0]) || "",
          dischargeEndTime: (this.dateRange && this.dateRange[1]) || "",
          hospitalId: this.$global.hospital_id,
          deptId: this.deptId,
          crowdType: this.crowdType
        })
        .then(res => {
          this.mainList = res.list;
          this.total = res.total;
          // for (var i = 0; i < res.list.length; i++) {
          //   this.serialNo.push({
          //     name: res.list[i].userId,
          //     serialNo: res.list[i].serialNo,
          //     flupType: res.list[i].flupType,
          //     userId: res.list[i].userId,
          //   }) //这里获取userId和serialNo，userId用来和后面的oldSerialNo匹配
          // } //获取serialNo
          if (this.$refs.refTable) {
            this.$refs.refTable.setCurrentRow(this.mainList[0]);
          }
          // if (this.mainList.length) {
          //   this.$apis
          //     .getPatientRemark({ userId: this.mainList[0].userId })
          //     .then(res => {
          //       this.remarks = res.map(i => ({
          //         ...i,
          //         edit: false,
          //         remarkContent2: i.remarkContent
          //       }));
          //     });
          // }
        });
    },
    onSave() {
      if (
        this.currentItem.flupType === "专科随访" &&
        this.currentItem.flupAddress
      ) {
        this.$refs.followupContent.$refs.iframe.contentWindow.postMessage(
          {
            params: {
              user_id: this.currentItem.userId,
              old_flup_phone:
                this.currentItem.mobile ||
                this.currentItem.phone ||
                this.currentItem.contactPhone,
              flup_phone: this.form.editPhone,
              flup_status: this.form.followupResult,
              IsSubmit: 0
            }
          },
          "*"
        );
        this.$message({
          message: "保存成功",
          type: "success"
        });
      }
    },
    onSwitch(isUpdate) {
      this.disabledButton = !this.disabledButton;
      this.$refs.followupContent.$refs.iframe.contentWindow.postMessage(
        {
          message: isUpdate ? "update" : "back"
        },
        "*"
      );
      if (!isUpdate) {
        this.getMainList();
      }
    },
    dragTheStart() {
      this.zc = JSON.parse(JSON.stringify(this.baseColumns));
    },
    dragTheEnter(before, after) {
      if (after.childNodes.length != 0) {
        this.baseColumns = this.zc;
      }
    },
    dragTheStartMerge() {
      this.zc = JSON.parse(JSON.stringify(this.mergeConfigColumns));
    },
    dragTheEnterMerge(before, after) {
      if (after.childNodes.length != 0) {
        this.mergeConfigColumns = this.zc;
      }
    },
    sz() {
      this.getlists();
      this.dialogField = true;
    },
    bc() {
      let arr = [];
      for (let i in this.baseColumns) {
        let a = {
          columnId: this.baseColumns[i].id,
          page: "电话随访",
          sortOrder: Number(i) + 1
          // type: this.patientTypeTc,
          // userId: this.userId
        };
        arr.push(a);
      }
      if (this.isShowMerge) {
        for (let i in this.mergeConfigColumns) {
          let a = {
            columnId: this.mergeConfigColumns[i].id,
            page: "电话随访",
            sortOrder: Number(i) + 1,
            isMerged: true,
            mergeDisplayName: "基本信息"
            // type: this.patientTypeTc,
            // userId: this.userId
          };
          arr.push(a);
        }
      }
      if (arr.length != 0) {
        this.$apis.columnsavePageColumns(arr).then(res => {
          if (res) {
            this.$message({
              message: "操作成功",
              type: "success"
            });
            this.dialogField = false;
            this.getMainList();
          }
        });
      } else {
        this.$message({
          message: "至少配置一个显示字段",
          type: "warning"
        });
      }
    },
    remove(node, data) {
      for (let i in this.checkList) {
        if (this.checkList[i] == data.id) {
          this.checkList.splice(i, 1);
        }
      }
      for (let j in this.mergeConfigList) {
        if (this.mergeConfigList[j] == data.id) {
          this.mergeConfigList.splice(j, 1);
        }
      }
    },
    getlists() {
      this.$apis
        .columnqueryPageColumnConfigDisplay({
          page: "电话随访"
          // type: this.patientTypeTc
        })
        .then(res => {
          this.modules = res.modules;
          this.alllist = res.baseColumns;
          this.mergeList = res.mergeColumns;
        });
      this.$apis
        .columnqueryPageColumnDisplay({
          page: "电话随访"
          // type: this.patientTypeTc
        })
        .then(res => {
          this.checkList = [];
          this.mergeList = res.mergeColumns;
          this.baseColumns = res.baseColumns;
          this.baseColumnsV2 = res.baseColumns;
          this.baseColumns.forEach(element => {
            this.checkList.push(element.id);
          });
          this.mergeConfigList = [];
          if (res.mergeConfigColumns) {
            this.isShowMerge = true;

            this.mergeConfigColumns =
              res.mergeConfigColumns && res.mergeConfigColumns[0].columnDetails;

            res.mergeConfigColumns &&
              res.mergeConfigColumns[0] &&
              res.mergeConfigColumns[0].columnDetails.forEach(element => {
                this.mergeConfigList.push(element.id);
              });
          }
        });
    },
    //导入按钮事件
    showHistoryRecord() {
      this.surveyRecordData = [];
      let _this = this;
      this.currentRow = null;
      this.dialogVisible = true;
      this.$apis
        .getFilledFlupContent({
          userId: this.userId,
          flupContentId: this.flupContentId
        })
        .then(res => {
          if (res.length != 0) {
            this.surveyRecordData = res;
          }
        });
    },
    //将选择行对象传递给importHistoryRecord导入函数
    selectRow(val) {
      this.currentRow = val;
    },

    isJsonString(str) {
      //判断是否是JSON
      try {
        if (typeof JSON.parse(str) == "object") {
          return true;
        }
      } catch (e) { }
      return false;
    },
    //点击导入表格行的事件
    importHistoryRecord() {
      if (!this.currentRow) {
        this.$message({
          message: "请选择一条记录",
          type: "warning"
        });
        return;
      }
      this.questionnaireRecordtrfa = false;
      // this.val = JSON.parse(JSON.stringify(this.currentRow)) //这里的val就是之前传入的surveyRecordData中的对象，含有了userId用来匹配oldSerialNo和serialNo

      this.$apis
        .importFilledFlupContent({
          serialNo: this.currentItem.serialNo,
          oldSerialNo: this.currentRow.serialNo,
          flupContentId: this.currentRow.flupContentId,
          flupType: this.currentRow.flupType
        })
        .then(res => {
          // this.currentItem.flupAddress = this.val.flupAddress
          if (res.length != 0) {
            //判断返回的res是否为JSON，如果不是，则是专科随访的返回值
            if (this.isJsonString(res)) {
              this.questionnaireRecord = JSON.parse(res);
              // this.questionnaireRecordtrfa = true
            } else {
              this.$nextTick(_ => {
                this.currentItem.flupAddress = res;
                this.questionnaireRecordtrfa = true;
              });
            }
          }
          this.questionnaireRecordtrfa = true;
        });

      this.dialogVisible = false;
      this.surveyRecordData = [];
    },

    // handleClose() {
    //   this.surveyRecordData = []
    //   this.dialogVisible = false
    // },
    filterCrow() {
      this.addCrowEnable = false;
      this.crowdTypeCurList = this.crowdTypeList.filter(
        x =>
          !this.crowTypes.includes(x.dict_code) &&
          x.dict_name.search(this.keyValue) > -1
      );
      this.addCrowEnable = true;
    },
    playClose() {
      this.recordUrl = null
    },
    closeCur(e) {
      var sp = document.getElementById("crowEnable");
      if (sp) {
        if (!sp.contains(e.target)) {
          this.keyValue = "";
          if (
            e.target.classList.length > 0 &&
            e.target.classList.contains("el-input__clear")
          ) {
            this.filterCrow();
          } else {
            this.addCrowEnable = false;
          }
        }
      }
    },
    showOrHide() {
      this.hidden = !this.hidden;
    },
    onConstruction() {
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + "/pc";
      }
      window.parent.postMessage(
        JSON.stringify({
          method: "addTab",
          url:
            urlx +
            "/#/SingleConstruction?serialNo=" +
            this.currentItem.serialNo,
          title: `随访任务审核`
        }),
        "*"
      );
      // this.$router.push(`/SingleConstruction?serialNo=${this.currentItem.serialNo}`);
    },
    onAdd() {
      // console.log(this.editItem);
      let length = this.showList.length;
      if (this.showList[length - 1].isEdit === true) {
        this.$message({
          type: "warning",
          message: "请保存后再编辑!"
        });
        return;
      } else {
        this.showList.push({ ...this.editItem });
      }
    },

    ///检查检验的数据获取
    switchType(val) {
      val.checkItem = "";
      val.checkPart = "";
      val.checkItemCode = "";
      val.checkPartCode = "";
      let typeID = this.checkTypeList.find(item => {
        return item.examTypeName == val.checkType;
      }).examTypeId;
      val.checkTypeCode = typeID;
      this.$apis
        .ExaminegetCheckPartsList({
          examTypeId: typeID
        })
        .then(res => {
          this.checkPartList = res.examBodyInfoList;
        });
    },
    switchPart(val) {
      // console.log(val, 'valvalval');
      val.checkItem = "";
      val.checkItemCode = "";
      let bodyID = this.checkPartList.find(item => {
        return item.examBodyName == val.checkPart;
      }).examBodyId;
      val.checkPartCode = bodyID;
      this.$apis
        .ExaminegetCheckItemList({
          examItemLike: "",
          examBodyId: bodyID
        })
        .then(res => {
          this.checkItemList = res.examItemInfos;
        });
    },
    switchItem(val) {
      let itemID = this.checkItemList.find(item => {
        return item.examItemName == val.checkItem;
      }).examItemId;
      val.checkItemCode = itemID;
    },
    // switchInspect(val) {
    //   console.log(val, 'valvalval22222');
    //   let itemID = this.inspectionNameList.find((item) => {
    //     return item.ylmc == val.examItem;
    //   }).autoid;
    //   val.examItemCode = itemID;
    // },
    // switchPiece(val) {
    //   let typeID = this.inspectionTypeList.find((item) => {
    //     return item.sampledescribe == val;
    //   }).autoid;
    //   val.examTypeCode = typeID;
    // },
    changeSuggestion(val) {
      // console.log(val, 'dddd');
      this.item.suggestionContent = val;
    },
    onDelete() {
      this.$confirm('确定要将该随访任务作废吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() => {
        if (this.currentItem.flupType == "慢病评估报告") {
          this.iframeSave();
          // 发送慢病评估报告
          this.item.type = 2;
          this.$apis.reportpushAndSend(this.item).then(() => {
            // this.$notify({
            //   title: '成功',
            //   message: '生成发送成功',
            //   type: 'success',
            // })
          });
        }
        this.$apis.deleteFuFlupPatientPlan(this.currentItem.serialNo).then(() => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getMainList();
          this.getInfo(this.currentItem.serialNo);
        });
      }).catch(() => {
        return
      });

    },
    /////////审核与作废
    async onAudit(state) {
      // if(this.currentItem.flupType == "慢病评估报告") {
      //   this.iframeSave();
      //   // 发送慢病评估报告
      //   this.item.type = 2;
      //   this.$apis.reportpushAndSend(this.item).then(() => {
      //     // this.$notify({
      //     //   title: '成功',
      //     //   message: '生成发送成功',
      //     //   type: 'success',
      //     // })
      //   });
      // }
      // this.$apis.deleteFuFlupPatientPlan(this.currentItem.serialNo).then(() => {
      //     this.$message({
      //       message: "操作成功",
      //       type: "success"
      //     });
      //     this.getMainList();
      //     this.getInfo(this.currentItem.serialNo);
      // });
      //````````````````````````````````````````````````````````````````````````````````````````````
      let params;
      if (this.currentItem.flupType == "定期检查") {
        params = {
          serialNo: this.currentItem.serialNo,
          changeType: "apply",
          authState: state,
          userId: this.currentItem.userId,
          appointmentTime: this.form.appointmentTime,
          remark2: this.form.remark2
        };
      } else if (this.currentItem.flupType == "定期检验") {
        params = {
          serialNo: this.currentItem.serialNo,
          changeType: "change",
          authState: state,
          content: this.currentItem.flupContent, //this.convertData(),
          openId: this.currentItem.openId,
          userId: this.currentItem.userId,
          appointmentTime: this.form.appointmentTime,
          remark2: this.form.remark2
        };
      } else if (this.currentItem.flupType == "定期复诊") {
        params = {
          serialNo: this.currentItem.serialNo,
          authState: state,
          changeType: "change",
          userId: this.currentItem.userId,
          appointmentTime: this.form.appointmentTime,
          remark2: this.form.remark2
        };
        // this.iframeSave();
      } else if (this.currentItem.flupType == "慢病评估报告") {
        params = {
          serialNo: this.currentItem.serialNo,
          authState: state,
          changeType: "chronicDisease",
          userId: this.currentItem.userId,
          appointmentTime: this.appointmentTime,
          remark2: this.remark2,
          suggestionContent: this.item.suggestionContent //健康建议
        };
        this.iframeSave();

        // 发送慢病评估报告
        this.item.type = 2;
        this.$apis.reportpushAndSend(this.item).then(() => {
          // this.$notify({
          //   title: '成功',
          //   message: '生成发送成功',
          //   type: 'success',
          // })
        });
      } else {
        params = {
          serialNo: this.currentItem.serialNo,
          authState: state
          // userId: this.currentItem.patientId
        };
      }
      this.$apis
        .flupPatientPlanChangePatientPlanAuthState(params)
        .then(async res => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getMainList();
          await this.getInfo(this.currentItem.serialNo);
        });
    },
    iframeSave() {
      if (this.$refs.followupContent.$refs.iframex) {
        // console.log(1111111111111111);
        this.$refs.followupContent.$refs.iframex.contentWindow.postMessage(
          {
            params: {
              flup_phone: this.form.editPhone,
              flup_status: this.form.followupResult,
              IsSubmit: 0
            }
          },
          "*"
        );
      } else {
        // console.log(222222222222222);
      }
    },
    convertData() {
      return this.showList
        .map(element => {
          if (this.currentItem.flupType === "定期检查") {
            return `${element.checkType}|${element.checkTypeCode}|${element.checkPart}|${element.checkPartCode}|${element.checkItem}|${element.checkItemCode}`;
          } else {
            return `${element.examItem}|${element.examItemCode}|${element.examType}|${element.examTypeCode}`;
          }
        })
        .join(",");
    },
    onConfirmEdit(row) {
      if (this.currentItem.flupType === "定期检查") {
        if (!row.checkType) {
          this.$message({
            type: "warning",
            message: "请选择检查内容"
          });
          return;
        } else if (!row.checkPart) {
          this.$message({
            type: "warning",
            message: "请选择检查部位"
          });
          return;
        } else if (!row.checkItem) {
          this.$message({
            type: "warning",
            message: "请输入检查项目"
          });
          return;
        }
      } else {
        if (!row.examType) {
          this.$message({
            type: "warning",
            message: "请选择样本类型"
          });
          return;
        } else if (!row.examItem) {
          this.$message({
            type: "warning",
            message: "请输入检验名称"
          });
          return;
        }
      }
      this.$apis
        .flupPatientPlansaveSendCheckContent({
          serialNo: this.currentItem.serialNo,
          flupContent: this.convertData()
        })
        .then(() => {
          this.$message({
            type: "success",
            message: "保存成功"
          });
          row.isEdit = false;
          this.getDetail();
        });
    },
    deleteItem({ row, $index }) {
      if (this.showList.find(item => item.isEdit)) {
        this.$message({
          message: "请保存后再操作",
          type: "warning"
        });
        return;
      }
      if (this.showList.length === 1) {
        this.$message({
          message: "请保留一条检查项目",
          type: "warning"
        });
        return;
      }
      this.$confirm("是否删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.showList.splice($index, 1);
        this.$apis
          .flupPatientPlansaveSendCheckContent({
            serialNo: this.currentItem.serialNo,
            flupContent: this.convertData()
          })
          .then(() => {
            this.$message({
              type: "success",
              message: "保存成功"
            });
            this.getDetail();
          });
      });
    },
    print() {
      this.$print(this.$refs['followupContent'].$el);
    },
    onCancel() {
      this.showList.forEach(item => {
        this.$set(item, "isEdit", false);
      });
      this.showList.splice(this.showList.length - 1, 1);
    },
    openRemark() {
      this.remarkIsOpen = !this.remarkIsOpen;
    },
    deleteRemark(id) {
      this.$confirm(`确定要删除该备注吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$apis
            .deletePatientRemark(id)
            .then(res => {
              this.$notify({
                title: "删除成功",
                type: "success"
              });
              this.$apis
                .getPatientRemark({
                  userId: this.currentItem.userId
                })
                .then(res => {
                  this.remarks = res.map(i => ({
                    ...i,
                    edit: false,
                    remarkContent2: i.remarkContent
                  }));
                });
            });
        })
        .catch(() => { });
    },
    newRemark() {
      if (this.textareaRemark) {
        this.$confirm(`确定保存备注吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.$apis
              .insertPatientRemark({
                userId: this.userId,
                remarkContent: this.textareaRemark,
                remarkType: 1,
                remark_url: ''
              })
              .then(res => {
                this.$notify({
                  title: "保存成功",
                  type: "success"
                });
                this.textareaRemark = "";
                this.getRemarkList()
              });
          })
          .catch(() => { });
      }
    },
    getRemarkList() {
      this.$apis.getPatientRemark({ userId: this.userId }).then(res => {
        this.remarks = res.map(i => ({
          ...i,
          edit: false,
          remarkContent2: i.remarkContent
        }));
        this.remarks.forEach((i) => {
          if (i.remarkType == 3) {
            this.srcList.push(i.remarkUrl);
          }
        });
      });
    },
    beforeAvatarUpload(file) {
      let audioFileType = [
        "audio/mpeg",
        "audio/x-wav",
        "image/jpeg",
        "image/png",
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "text/plain"
      ];
      const isAudio = audioFileType.includes(file.type);
      if (!isAudio) {
        this.$message.error("请上传正确的文件类型(.mp3 .wav .jpeg .jpg .png .pdf .docx .doc .xlsx .xls)");
      }
      return isAudio;
    },
    handleAvatarSuccess(res) {
      let { retData } = res
      if (retData.suffix == ".mp3" || retData.suffix == ".wav") {
        this.$apis
          .insertPatientRemark({
            userId: this.userId,
            remarkContent: retData.originalFilename,
            // remark_url: this.$baseURL.ICDMApiUrl + "/file/audio/" + retData.id,
            remark_url: retData.id,
            remarkType: 2,
          })
          .then((res) => {
            this.$notify({
              title: "保存成功",
              type: "success",
            });
            this.getRemarkList();
          });
      } else if (
        retData.suffix == ".pdf" ||
        retData.suffix == ".docx" ||
        retData.suffix == ".doc" ||
        retData.suffix == ".xlsx" ||
        retData.suffix == ".xls" ||
        retData.suffix == ".txt"
      ) {
        this.$apis
          .insertPatientRemark({
            userId: this.userId,
            remarkContent: retData.originalFilename,
            // remark_url: this.$baseURL.ICDMApiUrl + "/file/other/" + retData.id,
            remark_url: retData.id,
            remarkType: 4,
          })
          .then((res) => {
            this.$notify({
              title: "保存成功",
              type: "success",
            });
            this.getRemarkList();
          });
      } else if (
        retData.suffix == ".png" ||
        retData.suffix == ".PNG" ||
        retData.suffix == ".jpeg" ||
        retData.suffix == ".jpg"
      ) {
        this.$apis
          .insertPatientRemark({
            userId: this.userId,
            remarkContent: retData.originalFilename,
            // remark_url: this.$baseURL.ICDMApiUrl + "/file/image/" + retData.id,
            remark_url: retData.id,
            remarkType: 3,
          })
          .then((res) => {
            this.$notify({
              title: "保存成功",
              type: "success",
            });
            this.getRemarkList();
          });
      }
    },
    editRemark(item,index) {
      if (item.remarkType == 1) {
        this.editIndex = index;
        this.remarks[index].remarkContent2 = item.remarkContent;
      } else {
        this.editFileName = true;
        this.fileRemark = item;
        // let name = this.splitFilenameAndExtension(item.remarkContent)
        this.filename = item.remarkContent
        // this.fileRemark.suffix = name.extension
      }
    },
    splitFilenameAndExtension(filePath) {
      let lastDotIndex = filePath.lastIndexOf(".");
      if (lastDotIndex == -1) {
        return {
          filename: filePath,
          extension: "",
        };
      }
      let filename = filePath.substring(0, lastDotIndex);
      let extension = filePath.substring(lastDotIndex + 1);
      return {
        filename: filename,
        extension: extension,
      };
    },
    onPlay(item) {
      console.log(item)
      console.log(this.$refs[item.remarkId])
    },
    editRemarkSave(item) {
      console.log(item)
      if(item.remarkContent2) {
        this.$confirm(`确定保存备注吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        })
          .then(() => {
            console.log(item)
                  this.$apis.editPatientRemark({
                    remarkId: item.remarkId,
                    remarkContent: item.remarkContent2
                  }).then(res => {
                    this.$notify({
                    title: "编辑成功",
                    type: "success"
                  });
                  this.getRemarkList()
                  this.editIndex = ''
                  })
          })
          .catch(() => {
            this.editIndex = ''
          });
      }else {
        this.editIndex = ''
      }
    },
    topRemark(item) {
      let isTop 
      let message
      if(item.isTop) {
        isTop = 0
        message = "取消置顶"
      }else {
        isTop = 1
        message = "置顶"
      }
      this.$confirm(`确定${message}吗?`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(res => {
          this.$apis.topPatientRemark(item.remarkId, isTop).then(res => {
            this.$notify({
              title: `${message}成功`,
              type: "success"
            });
          this.getRemarkList()
      })
      })
      .catch(() => {
          });
    },
    editFileRemarkSave() {
      if(!this.filename) {
        this.$message.error('请输入备注名称');
        return
      }
      this.$confirm(`确定保存备注吗？`, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
        }).then(res => {
          this.$apis
              .editPatientRemark({
                remarkId: this.fileRemark.remarkId,
                remarkContent: `${this.filename}`,
              })
              .then((res) => {
                this.$notify({
                  title: "编辑成功",
                  type: "success",
                });
                this.editFileName = false
                this.filename = ""
                this.fileRemark = {
                  suffix: ""
                }
                this.getRemarkList();
              });
        })
        .catch(() => {
          this.editFileName = false
          this.filename = ""
          this.fileRemark = {
            suffix: ""
          }
        })
    },
    getOperation() {
      this.$apis.getPatientRemarkLog({
        userId: this.userId
      }).then(res => {
        this.tableData = res
      })
      console.log(this.$refs.dialogPackage)
      this.$refs.dialogPackage.add()
    },
    viewDischarge() {
      if (this.dischargeList && this.dischargeList.length) {
        window.open(
          `http://192.168.0.145/CDR/tongyist/ShiJianZhou?bingrenid=${this.dischargeList[0].inpNo}&bingrenlx=2&sysid=1253309348403257344&userid=1043&token=072c0a0fb13949dca3457002784bacb7#ShiJianZhou`
        );
      } else {
        this.$message("暂无出院记录");
      }
    },
    viewFile(item) {
      let encodedUrl
      if(this.containsFileExtension(item.remarkContent)) {
        encodedUrl = encodeURIComponent(Base64.encode(`${item.remarkUrl}?fullfilename=${item.remarkContent}`));
      }else {
        encodedUrl = encodeURIComponent(Base64.encode(`${item.remarkUrl}?fullfilename=${item.remarkContent}${item.remarkFormat}`));
      }
      let previewUrl = `${this.$baseURL.onlineViewUrl}?url=${encodedUrl}`;
      window.open(previewUrl);
    },
    containsFileExtension(str) {
      const fileExtensions = [".pdf", ".docx", ".doc", ".xlsx", ".xls"];
      return fileExtensions.some((extension) => str.endsWith(extension));
    },
    handleClose() {
      this.editFileName = false
                this.filename = ""
                this.fileRemark = {
                  suffix: ""
                }
    },
  }
};
</script>

<style lang="scss">
.phone-followup {
  padding: 0 20px 20px 20px;
  
  .audio-line {
    display: flex;
    align-items: center;
    .remark-content {
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    img {
      cursor: pointer;
      margin-left: 10px;
    }
  }
  .audio-line2 {
    display: flex;
    flex-wrap: wrap;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    img {
      cursor: pointer;
      margin-left: 10px;
    }
    .demo-image__preview {
      margin-right: 20px;
    }
  }
  &_wrapper {
    display: flex;
  }

  &_aside {
    width: 565px;
    display: flex;
    flex-direction: column;
    background: #f8f8f8;
    padding: 0px 20px 16px;
    position: sticky;
    top: 20px;
    height: calc(100vh - 50px);
  }

  &_list {
    flex: 1;
    margin-top: 20px;
    margin-bottom: 10px;
    overflow: hidden;
    overflow-y: scroll;
  }

  &_main {
    flex: 1;
    margin-left: 20px;
  }

  &_main_header {
    padding: 20px;
    background-color: #f8f8f8;
  }

  &_aside_title {
    line-height: 40px;
    min-width: 90px;
    display: flex
  }

  &_main_top {
    padding: 20px;
    background-color: #f8f8f8;
  }

  .over-xline {
    padding-right: 75px;

    .el-range-input {
      width: 100% !important
    }
  }

  .handle-line {
    padding-top:10px
  }

  .handle-box {
    .el-button--text:hover {
          text-decoration: none;
    }
    .el-upload button {
      padding: 7px 15px 0px 0px;
  }
    .list-btns__upload {
      line-height: 27px;
      .el-upload--text {
        position: relative;
        bottom: 1px;
      }
    }
    .el-upload--text {
      background-color: transparent;
    }
  }

  .info-label {
    width: 140px;
    font-weight: bold;
    background-color: #f8f8f8;
  }

  .info {
    width: 200px;
  }

  .info-label,
  .info {
    padding: 10px 0;
    border: 1px solid #e6e6e6;
    padding-left: 10px;
  }

  .info-table {
    width: 100%;
    margin-top: 20px;
    border: 1px solid #e6e6e6;
    border-collapse: collapse;
  }

  .color-666 margin-right10 {
    color: #666666;
    margin-right: 10px;
  }

  .rotate {
    transform: rotate(-180deg);
  }

  .icon-transition {
    transition: all 0.5s ease;
  }

  .dialog-footer {
    border-top: 1px solid white;
  }

  .phone-followup_main {
    .phone-followup_main_top {
      .el-row--flex {

        //查看计划按钮样式
        .check-plan {
          color: #409eff;
          background: #ecf5ff;
          border-color: #b3d8ff;
        }

        .check-plan:focus {
          color: #fff;
          background-color: #409eff;
          border-color: #409eff;
        }

        .check-plan:hover {
          color: #fff;
          background: #66b1ff;
          border-color: #66b1ff;
        }
      }
    }
  }
}


.xdzd {
  padding: 10px 30px 10px 30px;
  border: 1px solid #ccc;

  span,
  i {
    color: #32ae57;
  }
}

.checkxbox {
  .el-checkbox {
    padding: 5px 0px;
    min-width: 150px;
  }
}

.phone-followup_main_top {
  .el-row {
    align-items: center;
    // margin-top: 16px;
  }

  .personalDetails {
    .info-label {
      color: #666666;
    }
  }
}

.piList {
  display: flex;

  span:first-child {
    flex-shrink: 0;
  }
}

.remark {
  color: rgb(2, 131, 239);
  cursor: pointer;
  position: relative;
  bottom: 1px
}
.audio-box {
    position: fixed;
    bottom: 20px;
    right: 20px;
    display: flex;
    align-items: center;
    audio {
      width: 250px;
    }
    .audio-close {
      cursor: pointer;
      display: inline-block;
      height: 28px;
      width: 28px;
      background-color: #F1F3F4;
      border-radius: 50%;
      margin: 0 10px 0 0;
      font-size: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .audio-close:hover {
        background-color: #E5E7E8;
      }
      .audio-close::after {
      content: "";
      display: inline-block;
      height: 100%;
      width: 100%;
      border-radius: 100px;
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      transition: all .4s;
      }
      .audio-close::after {
      background-color: #F1F3F4;
      }
  }

.remarkContent {
  .el-textarea {
    margin-bottom: 10px;
  }

  .v1ew {
          margin-bottom: 8px;
        }

  .remarkOne {
    word-break: break-all;
  }

  .remarkList {
    margin-bottom: 10px;

    .remarkDetail {
      word-break: break-all;
      margin-left: 10px
    }
  }

  .remarkTime {
    background-color: #EEF7FF;
    padding-top: 8px;
    padding-bottom: 8px;
    audio {
      height: 35px;
    }
    .remarkTime-fline {
      display: flex;
      justify-content: space-between;
      .remarkTime-btn {
        margin-right: 10px
      }
      .remarkTime-time {
        color: #666666;
      }
      .remarkTime-btn span{
      cursor: pointer;
    }
    }
    
  }
  .remarkTime span {
    display: inline-block;
    margin-left: 10px;
    // color: #999;
    // cursor: pointer;
    // &:hover {
    //   color: #666;
    // }
  }
  
}
.more {
    display: flex;
    justify-content: center;
    align-items: center;
    .more-box {
      cursor: pointer;
        .more-text {
          color: #606266;
        }
    }
  }
</style>
