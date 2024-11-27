<!-- 列表详情 -->
<template>
  <div class="list-detail" :style="{ paddingBottom: !isTransferIn && !isAddTransferOut ? '0px' : '' }">
    <!-- 拒绝、同意按钮显示 -->
    <div v-if="isTransferIn" class="button">
      <el-button @click="Refuse" v-btn>拒绝</el-button>
      <el-button type="success" v-btn @click="Agree">同意</el-button>
    </div>
    <!-- 保存、提交 -->
    <div v-if="isAddTransferOut" class="button">
      <el-button type="success" v-btn plain @click="Save">保存</el-button>
      <el-button type="success" v-btn @click="submitForm">提交</el-button>
      <!-- <el-button type="success" v-btn @click="closePop">test</el-button> -->
    </div>
    <!-- 选择患者按钮显示 -->
    <div class="select-patient" v-if="isAddTransferOut && unitId == '1118033010334208499'  && !patientId">
      <el-button type="primary" v-btn plain @click="choosePatient">选择患者</el-button>
    </div>
    <!-- 拒绝理由按钮显示 -->
    <div class="warning" v-if="isRefuse">
      <img :src="warning" />
      {{ ruleForm.comments }}
    </div>
    <detailItem title="患者基本信息">
      <el-form ref="ruleFormRef1" :model="ruleForm" :rules="rules" label-width="120px">
        <template class="flex">
          <el-form-item class="flex-item" label="病人姓名" prop="patientName">
            <el-input
              v-model="ruleForm.patientName"
              :placeholder="isSee == 'true' || operateType == 4 ? '' : '病人姓名'"
              maxlength="20"
              :disabled="isDisabled"
            />
          </el-form-item>
          <el-form-item class="flex-item" label="证件类型" prop="idCardType">
            <el-select
              v-model="ruleForm.idCardType"
              :placeholder="isSee == 'true' || operateType == 4 ? '' : '请选择'"
              :disabled="isDisabled"
              @change="idCardTypeChange"
            >
              <el-option v-for="item in documentList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item class="flex-item" label="身份证号" prop="idNo">
            <el-input v-model="ruleForm.idNo" :placeholder="isSee == 'true' || operateType == 4 ? '' : '身份证号'" maxlength="18" :disabled="isDisabled" />
          </el-form-item>
        </template>
        <template class="flex">
          <el-form-item class="flex-item" label="性别" prop="sexCode">
            <el-radio-group v-model="ruleForm.sexCode" :disabled="isDisabled">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="flex-item" label="病人年龄" prop="patientAge">
            <el-input
              v-model.number="ruleForm.patientAge"
              @input="ruleForm.patientAge = String(ruleForm.patientAge).replace(/[^\d]/g, '')"
              :placeholder="isSee == 'true' || operateType == 4 ? '' : '病人年龄'"
              maxlength="20"
              :disabled="isDisabled"
              :pattern="[0 - 9]"
            />
          </el-form-item>
          <el-form-item class="flex-item" label="手机号码" prop="patientPhone">
            <el-input
              v-model.number="ruleForm.patientPhone"
              @input="ruleForm.patientPhone = String(ruleForm.patientPhone).replace(/[^\d]/g, '')"
              :placeholder="isSee == 'true' || operateType == 4 ? '' : '手机号码'"
              maxlength="11"
              :disabled="isDisabled"
            />
          </el-form-item>
        </template>
        <template class="flex">
          <el-form-item class="flex-item" label="电话归属地" prop="sexCode">
            <el-select v-model="ruleForm.patientPhoneHome" :placeholder="isSee == 'true' || operateType == 4 ? '' : '请选择'" :disabled="isDisabled">
              <el-option label="市内" :value="1" />
              <el-option label="长途" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item class="flex-item"> </el-form-item>
          <el-form-item class="flex-item"> </el-form-item>
        </template>
      </el-form>
    </detailItem>
    <detailItem title="转诊信息">
      <el-form ref="ruleFormRef2" :model="ruleForm" :rules="rules" label-width="120px">
        <template class="flex">
          <el-form-item class="flex-item" label="医保卡类型" prop="clinicCardType">
            <el-select v-model="ruleForm.clinicCardType" :placeholder="isSee == 'true' || operateType == 4 ? '' : '请选择'" :disabled="isDisabled">
              <el-option v-for="item in mitList" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <!-- prop="clinicCardNo" -->
          <el-form-item class="flex-item" label="医保卡卡号">
            <el-input
              v-model="ruleForm.clinicCardNo"
              :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请输入'"
              maxlength="20"
              :disabled="isDisabled"
            />
          </el-form-item>
          <el-form-item class="flex-item" label="申请人" prop="applyUserName">
            <el-input
              v-model="ruleForm.applyUserName"
              :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请输入'"
              maxlength="20"
              :disabled="isDisabled"
            />
          </el-form-item>
        </template>
        <template class="flex">
          <el-form-item class="flex-item" label="门诊卡号">
            <el-input v-model="ruleForm.visitNo" :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请输入'" maxlength="20" :disabled="isDisabled" />
          </el-form-item>
          <el-form-item class="flex-item" label="用户ID号">
            <el-input
              v-model="ruleForm.patientUserId"
              :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请输入'"
              maxlength="20"
              :disabled="isDisabled"
            />
          </el-form-item>
          <el-form-item class="flex-item" label="申请人电话" prop="applyPhone">
            <el-input
              v-model.number="ruleForm.applyPhone"
              @input="ruleForm.applyPhone = String(ruleForm.applyPhone).replace(/[^\d]/g, '')"
              :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请输入'"
              maxlength="11"
              :disabled="isDisabled"
            />
          </el-form-item>
        </template>
        <template class="flex">
          <el-form-item class="flex-item" label="转出医院" prop="sourceHospitalName">
            <el-input v-model="ruleForm.sourceHospitalName" disabled />
          </el-form-item>
          <el-form-item class="flex-item" label="转出科室" prop="sourceDeptId">
            <el-select
              v-model="ruleForm.sourceDeptId"
              allow-create
              filterable
              :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请选择'"
              :disabled="isDisabled"
              @change="Change1"
            >
              <el-option v-for="item in outDepartmentList" :key="item.SectionId" :label="item.SectionName" :value="item.SectionId" />
            </el-select>
          </el-form-item>
          <el-form-item class="flex-item" label="转入医院" prop="targetHospitalId">
            <el-select
              v-model="ruleForm.targetHospitalId"
              filterable
              :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请选择'"
              :disabled="isDisabled"
              @change="Change2"
            >
              <el-option v-for="item in hospitalList" :key="item.HospitalId" :label="item.allHosName" :value="item.HospitalId" />
            </el-select>
            <!-- <el-select
              v-model="ruleForm.targetHospitalId"
              filterable
              remote
              reserve-keyword
              placeholder="请选择"
              remote-show-suffix
              :disabled="isDisabled"
              :remote-method="remoteMethod"
              @change="Change2"
            >
              <el-option
                v-for="item in hospitalList"
                :key="item.HospitalId"
                :label="item.allHosName"
                :value="item.HospitalId"
              />
            </el-select>-->
          </el-form-item>
        </template>
        <template class="flex">
          <el-form-item class="flex-item" label="转入科室" prop="targetDeptId">
            <el-select
              v-model="ruleForm.targetDeptId"
              filterable
              :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请选择'"
              :disabled="isDisabled"
              @change="Change3"
            >
              <el-option v-for="item in departmentList" :key="item.SectionId" :label="item.SectionName" :value="item.SectionId" />
            </el-select>
          </el-form-item>
          <el-form-item class="flex-item" label="期望日期">
            <el-date-picker
              style="width: 100%"
              :disabled="isDisabled"
              v-model="ruleForm.time"
              type="date"
              :placeholder="isSee == 'true' || operateType == 4 ? '' : '选择日期'"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="flex-item" label="转诊目的" prop="referralPurpose">
            <el-input
              v-model="ruleForm.referralPurpose"
              :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请输入'"
              :disabled="isDisabled"
              autosize
              type="textarea"
            />
          </el-form-item>
        </template>
        <template class="flex">
          <el-form-item class="flex-item" label="其它备注">
            <el-input
              v-model="ruleForm.otherRemark"
              :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请输入'"
              maxlength="100"
              :disabled="isDisabled"
            />
          </el-form-item>
          <el-form-item class="flex-item"></el-form-item>
          <el-form-item class="flex-item"></el-form-item>
        </template>
      </el-form>
    </detailItem>
    <detailItem v-if="ruleForm.currentProcessStatus == 'DKSSH' || admissionForm.doctorName" title="审核信息">
      <el-form ref="ruleFormRef5" :model="admissionForm" :rules="rules" label-width="120px">
        <template class="flex">
          <el-form-item class="flex-item" label="医生姓名" prop="doctorName">
            <el-input
              v-model="admissionForm.doctorName"
              :placeholder="ruleForm.currentProcessStatus != 'DKSSH' ? ' ' : '请输入'"
              :disabled="ruleForm.currentProcessStatus != 'DKSSH'"
            />
          </el-form-item>
          <el-form-item class="flex-item" label="预交金" prop="prepayment">
            <el-input
              v-model="admissionForm.prepayment"
              @input="admissionForm.prepayment = String(admissionForm.prepayment).replace(/[^\d]/g, '')"
              :placeholder="ruleForm.currentProcessStatus != 'DKSSH' ? ' ' : '请输入'"
              :disabled="ruleForm.currentProcessStatus != 'DKSSH'"
            />
          </el-form-item>
          <el-form-item class="flex-item" label="病情" prop="diseaseCondition">
            <el-select
              v-model="admissionForm.diseaseCondition"
              :placeholder="ruleForm.currentProcessStatus != 'DKSSH' ? '' : '请选择'"
              :disabled="ruleForm.currentProcessStatus != 'DKSSH'"
            >
              <el-option v-for="item in admConditionInfoList" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>
        </template>
        <template class="flex">
          <el-form-item class="flex-item" label="填写日期" prop="writeDate">
            <el-date-picker
              style="width: 100%"
              :disabled="ruleForm.currentProcessStatus != 'DKSSH'"
              v-model="admissionForm.writeDate"
              type="date"
              :placeholder="ruleForm.currentProcessStatus != 'DKSSH' ? '' : '选择日期'"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="flex-item" label="院前记录人" prop="beforeRecorderName">
            <el-input
              v-model="admissionForm.beforeRecorderName"
              :placeholder="ruleForm.currentProcessStatus != 'DKSSH' ? ' ' : '请输入'"
              :disabled="ruleForm.currentProcessStatus != 'DKSSH'"
            />
          </el-form-item>
          <el-form-item class="flex-item" label="工号" prop="beforeRecorderNo">
            <el-input
              v-model="admissionForm.beforeRecorderNo"
              :placeholder="ruleForm.currentProcessStatus != 'DKSSH' ? ' ' : '请输入'"
              :disabled="ruleForm.currentProcessStatus != 'DKSSH'"
            />
          </el-form-item>
        </template>
        <template class="flex">
          <el-form-item class="flex-item" label="备注" prop="remark">
            <el-input
              v-model="admissionForm.remark"
              :placeholder="ruleForm.currentProcessStatus != 'DKSSH' ? ' ' : '请输入'"
              :disabled="ruleForm.currentProcessStatus != 'DKSSH'"
              maxlength="100"
            />
          </el-form-item>
          <el-form-item class="flex-item" label="记录日期" prop="recordDate">
            <el-date-picker
              style="width: 100%"
              :disabled="ruleForm.currentProcessStatus != 'DKSSH'"
              v-model="admissionForm.recordDate"
              type="date"
              :placeholder="ruleForm.currentProcessStatus != 'DKSSH' ? '' : '选择日期'"
              format="YYYY-MM-DD"
              value-format="YYYY-MM-DD"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="flex-item"></el-form-item>
        </template>
      </el-form>
    </detailItem>
    <detailCollapseItem title="主诊断" :disabled="true" :must="true">
      <!-- 表单 -->
      <el-form ref="ruleFormRef3" :model="ruleForm" :rules="rules">
        <el-form-item prop="mainDiagnosis">
          <el-input
            :disabled="isDisabled"
            v-model="ruleForm.mainDiagnosis"
            :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请输入'"
            type="textarea"
            rows="5"
            resize="none"
            maxlength="1000"
          />
        </el-form-item>
      </el-form>
    </detailCollapseItem>
    <detailCollapseItem
      :isShow="queryClinicReportList && queryClinicReportList.length > 0"
      title="就诊记录"
      :total="queryClinicReportList ? queryClinicReportList.length : 0"
      :must="true"
      :disabled="true"
    >
      <!-- 表单 -->
      <el-form v-if="!queryClinicReportList || queryClinicReportList.length < 1" ref="ruleFormRef4" :model="ruleForm" :rules="rules">
        <el-form-item prop="clinicReportList">
          <el-input
            :disabled="isDisabled"
            v-model="ruleForm.clinicReportList"
            :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请输入'"
            type="textarea"
            rows="5"
            resize="none"
            maxlength="1000"
          />
        </el-form-item>
      </el-form>
      <expandTable
        v-else
        type="1"
        :isRollOut="isRollOut"
        :isSee="isSee"
        :tableData="queryClinicReportList"
        :selectList="deselectClinicReportList"
        @seeList="seeList"
        @select-list="selectList"
      >
        <div class="table-detail">
          <div class="flex">
            <section class="flex-item flex">
              <span class="key">姓名</span>
              <span class="value">{{ basicInfo.patientName }}</span>
            </section>
            <section class="flex-item flex">
              <span class="key">性别</span>
              <span class="value">{{ basicInfo.sex }}</span>
            </section>
            <section class="flex-item flex">
              <span class="key">出生日期</span>
              <span class="value">
                {{ basicInfo.dateOfBirth ? _utils.formatDate(basicInfo.dateOfBirth) : "" }}
              </span>
            </section>
          </div>
          <section>
            <span class="key">诊断</span>
            <span class="value">{{ basicInfo.clinicalDiagnosis }}</span>
          </section>
          <section>
            <span class="key">检查</span>
            <span class="value">{{ basicInfo.examNames }}</span>
          </section>
          <section>
            <span class="key">检验</span>
            <span class="value">{{ basicInfo.labNames }}</span>
          </section>
          <section>
            <span class="key">处方</span>
            <span class="value">{{ basicInfo.prescribeShow }}</span>
          </section>
          <section>
            <span class="key">医生</span>
            <span class="value">{{ basicInfo.medicalDoctor }}</span>
          </section>
          <section>
            <span class="key">科室</span>
            <span class="value">{{ basicInfo.medicalDept }}</span>
          </section>
          <section>
            <span class="key">时间</span>
            <span class="value">
              {{ basicInfo.medicalDate ? _utils.formatDate(basicInfo.medicalDate) : "" }}
            </span>
          </section>
        </div>
      </expandTable>
      <!-- 暂无数据 -->
      <!-- <noData v-else></noData> -->
    </detailCollapseItem>
    <detailCollapseItem
      :isShow="queryEmrExamReportList && queryEmrExamReportList.length > 0"
      title="检查记录"
      :total="queryEmrExamReportList ? queryEmrExamReportList.length : 0"
    >
      <!-- 表单 -->
      <el-form v-if="!queryEmrExamReportList || queryEmrExamReportList.length < 1" :model="ruleForm" :rules="rules">
        <el-form-item prop="emrLabReportList">
          <el-input
            :disabled="isDisabled"
            v-model="ruleForm.emrLabReportList"
            :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请输入'"
            maxlength="1000"
            type="textarea"
            rows="5"
            resize="none"
          />
        </el-form-item>
      </el-form>
      <!-- 数据展示 -->
      <!-- v-else-if="
          isSelectPatient &&
          queryEmrExamReportList &&
          queryEmrExamReportList.length > 0
      "-->
      <expandTable
        v-else
        #default="params"
        type="2"
        :isRollOut="isRollOut"
        :isSee="isSee"
        :tableData="queryEmrExamReportList"
        :selectList="deselectExamReportList"
        @select-list="selectList"
      >
        <div class="table-detail">
          <section class="flex">
            <span class="key">影像所见</span>
            <span class="value">{{ params.data.imagingFindings }}</span>
          </section>
          <section class="flex">
            <span class="key">检查结果</span>
            <span class="value">{{ params.data.imagingDiagnosis }}</span>
          </section>
        </div>
      </expandTable>
      <!-- 暂无数据 -->
      <!-- <noData v-else></noData> -->
    </detailCollapseItem>
    <detailCollapseItem
      :isShow="queryEmrLabReportList && queryEmrLabReportList.length > 0"
      title="检验记录"
      :total="queryEmrLabReportList ? queryEmrLabReportList.length : 0"
    >
      <!-- 表单 -->
      <el-form v-if="!queryEmrLabReportList || queryEmrLabReportList.length < 1" :model="ruleForm" :rules="rules">
        <el-form-item prop="examReportList">
          <el-input
            :disabled="isDisabled"
            v-model="ruleForm.examReportList"
            maxlength="1000"
            :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请输入'"
            type="textarea"
            rows="5"
            resize="none"
          />
        </el-form-item>
      </el-form>
      <!-- 数据展示 -->
      <!-- v-else-if="
          isSelectPatient &&
          queryEmrLabReportList &&
          queryEmrLabReportList.length > 0
      "-->
      <expandTable
        v-else
        #default="params"
        type="3"
        :isRollOut="isRollOut"
        :isSee="isSee"
        :tableData="queryEmrLabReportList"
        :selectList="deselectEmrLabReportList"
        @select-list="selectList"
      >
        <div class="table-detail">
          <el-table :data="params.data.labReport" border stripe>
            <el-table-column show-overflow-tooltip prop="testName" label="检验项目"></el-table-column>
            <el-table-column show-overflow-tooltip prop="testResult" label="检验结果">
              <template slot-scope="{ row }">
                <div v-html="row.testResult"></div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="unit" label="单位"></el-table-column>
            <el-table-column show-overflow-tooltip prop="correctFlag" label="异常标志"></el-table-column>
            <el-table-column show-overflow-tooltip label="参考范围">
              <template slot-scope="{ row }">
                <div class="range" v-if="row.referenceMin && row.referenceMax">
                  {{ row.referenceMin + "~" + row.referenceMax }}
                </div>
                <div class="range" v-else-if="!row.referenceMin && !row.referenceMax && row.reference" v-html="row.reference"></div>
                <div
                  class="range"
                  v-else
                  v-html="row.referenceMin ? row.referenceMin : row.referenceMax ? row.referenceMax : row.reference ? row.reference : ''"
                ></div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </expandTable>
      <!-- 暂无数据 -->
      <!-- <noData v-else></noData> -->
    </detailCollapseItem>
    <detailCollapseItem
      :isShow="queryEmrAdmissionRecordList && queryEmrAdmissionRecordList.length > 0"
      :total="queryEmrAdmissionRecordList ? queryEmrAdmissionRecordList.length : 0"
      title="入院记录"
    >
      <!-- 表单 -->
      <el-form v-if="!isSelectPatient || (isSelectPatient && (!queryEmrAdmissionRecordList || queryEmrAdmissionRecordList.length < 1))" :model="ruleForm">
        <el-form-item>
          <el-input
            :disabled="isDisabled"
            v-model="ruleForm.admissionRecordList"
            maxlength="1000"
            :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请输入'"
            type="textarea"
            rows="5"
            resize="none"
          />
        </el-form-item>
      </el-form>
      <!-- 数据展示 -->

      <expandTable
        v-else-if="isSelectPatient && queryEmrAdmissionRecordList && queryEmrAdmissionRecordList.length > 0"
        #default="params"
        type="4"
        :isRollOut="isRollOut"
        :isSee="isSee"
        :tableData="queryEmrAdmissionRecordList"
        :selectList="deselectAdmissionRecordList"
        @select-list="selectList"
      >
        <div class="table-detail">
          <div class="flex">
            <section class="flex-item flex">
              <span class="key">姓名</span>
              <span class="value">{{ params.data.patientName }}</span>
            </section>
            <section class="flex-item flex">
              <span class="key">性别</span>
              <span class="value">{{ params.data.sex }}</span>
            </section>
            <section class="flex-item flex">
              <span class="key">出生日期</span>
              <span class="value">
                {{ params.data.dateOfBirth ? _utils.formatDate(params.data.dateOfBirth) : "" }}
              </span>
            </section>
          </div>
          <div class="flex">
            <section class="flex-item flex">
              <span class="key">住院号</span>
              <span class="value">{{ params.data.inpNo }}</span>
            </section>
            <section class="flex-item flex">
              <span class="key">入院病区</span>
              <span class="value">{{ params.data.admissionWard }}</span>
            </section>
            <section class="flex-item flex">
              <span class="key">入院时间</span>
              <span class="value">
                {{ params.data.admissionDatetime ? _utils.formatDate(params.data.admissionDatetime) : "" }}
              </span>
            </section>
          </div>
          <section class="flex">
            <span class="key">入院原因</span>
            <span class="value">{{ params.data.chiefComplaints }}</span>
          </section>
          <section class="flex">
            <span class="key">入院诊断</span>
            <span class="value">{{ params.data.presentHistory }}</span>
          </section>
        </div>
      </expandTable>
      <!-- 暂无数据 -->
      <noData v-else></noData>
    </detailCollapseItem>
    <detailCollapseItem
      :isShow="queryEmrDischargeRecordList && queryEmrDischargeRecordList.length > 0"
      title="出院记录"
      :total="queryEmrDischargeRecordList ? queryEmrDischargeRecordList.length : 0"
    >
      <!-- 表单 -->
      <el-form v-if="!isSelectPatient || (isSelectPatient && (!queryEmrDischargeRecordList || queryEmrDischargeRecordList.length < 1))" :model="ruleForm">
        <el-form-item>
          <el-input
            :disabled="isDisabled"
            v-model="ruleForm.dischargeRecordList"
            maxlength="1000"
            :placeholder="isSee == 'true' || operateType == 4 ? ' ' : '请输入'"
            type="textarea"
            rows="5"
            resize="none"
          />
        </el-form-item>
      </el-form>
      <!-- 数据展示 -->
      <!-- v-else-if="
          isSelectPatient &&
          queryEmrDischargeRecordList &&
          queryEmrDischargeRecordList.length > 0
      "-->
      <expandTable
        v-else-if="isSelectPatient && queryEmrDischargeRecordList && queryEmrDischargeRecordList.length > 0"
        #default="params"
        type="5"
        :isRollOut="isRollOut"
        :isSee="isSee"
        :tableData="queryEmrDischargeRecordList"
        :selectList="deselectDischargeRecordList"
        @select-list="selectList"
      >
        <div class="table-detail">
          <div class="flex">
            <section class="flex-item flex">
              <span class="key alignRight">姓名</span>
              <span class="value">{{ params.data.patientName }}</span>
            </section>
            <section class="flex-item flex">
              <span class="key alignRight">性别</span>
              <span class="value">{{ params.data.sex }}</span>
            </section>
            <section class="flex-item flex">
              <span class="key alignRight">出生日期</span>
              <span class="value">
                {{ params.data.dateOfBirth ? _utils.formatDate(params.data.dateOfBirth) : "" }}
              </span>
            </section>
          </div>
          <div class="flex">
            <section class="flex-item flex">
              <span class="key alignRight">住院号</span>
              <span class="value">{{ params.data.inpNo }}</span>
            </section>
            <section class="flex-item flex">
              <span class="key alignRight">入院病区</span>
              <span class="value">{{ params.data.admissionWard }}</span>
            </section>
            <section class="flex-item flex">
              <span class="key alignRight">住院天数</span>
              <span class="value">{{ params.data.admissionDays }}</span>
            </section>
          </div>
          <div class="flex">
            <section class="flex-item">
              <span class="key alignRight">入院时间</span>
              <span class="value">
                {{ params.data.admissionDatetime ? _utils.formatDate(params.data.admissionDatetime) : "" }}
              </span>
            </section>
            <section class="flex-item">
              <span class="key alignRight">出院时间</span>
              <span class="value">
                {{ params.data.dischargeDatetime ? _utils.formatDate(params.data.dischargeDatetime) : "" }}
              </span>
            </section>
            <section class="flex-item">
              <span class="key alignRight">主诊医生</span>
              <span class="value">{{ params.data.chiefPhysician }}</span>
            </section>
          </div>
          <section class="flex">
            <span class="key alignRight">入院原因</span>
            <span class="value">{{ params.data.admissionReason }}</span>
          </section>
          <section class="flex">
            <span class="key alignRight">入院诊断</span>
            <span class="value">{{ params.data.admittingDiagnosis }}</span>
          </section>
          <section class="flex">
            <span class="key alignRight">出院诊断</span>
            <span class="value">{{ params.data.dischargeDiagnosis }}</span>
          </section>
          <section class="flex">
            <span class="key alignRight">入院情况</span>
            <span class="value">{{ params.data.admissionSituation }}</span>
          </section>
          <section class="flex">
            <span class="key alignRight">住院治疗经过</span>
            <span class="value">{{ params.data.hospitalCourse }}</span>
          </section>
          <section class="flex">
            <span class="key alignRight">出院状况</span>
            <span class="value">{{ params.data.dischargeSituation }}</span>
          </section>
          <section class="flex">
            <span class="key alignRight">出院去向</span>
            <span class="value">{{ params.data.disposition }}</span>
          </section>
          <section class="flex">
            <span class="key alignRight">出院带药</span>
            <div class="value">
              <el-table class="width100" :data="params.data.medicalList" border>
                <el-table-column label="药品名称" :resizable="false" prop="drugName"></el-table-column>
                <el-table-column label="药品名称/数量" :resizable="false" prop="drugSpecQuantity"></el-table-column>
                <el-table-column label="单次量/用法" :resizable="false" prop="dosage"></el-table-column>
                <el-table-column label="备注" :resizable="false" prop="memo"></el-table-column>
              </el-table>
            </div>
          </section>
          <section class="flex">
            <span class="key alignRight">随访指导</span>
            <div class="value">
              <div>{{ params.data.tipsAcitivity }}</div>
              <div>{{ params.data.tipsDiet }}</div>
              <div>{{ params.data.tipsDrugs }}</div>
              <div>{{ params.data.tipsSelfCare }}</div>
            </div>
          </section>
          <section class="flex">
            <span class="key alignRight">手术部位目测性监测</span>
            <span class="value">{{ params.data.surgicalSiteMonitoring }}</span>
          </section>
          <section class="flex">
            <span class="key alignRight">复诊时间</span>
            <div class="value">
              <el-table class="width100" :data="params.data.subsequentVisitList" border>
                <el-table-column label="时间" :resizable="false" prop="followupTime"></el-table-column>
                <el-table-column label="地点" :resizable="false" prop="followupPlace"></el-table-column>
                <el-table-column label="复诊目的" :resizable="false" prop="followupPerpose"></el-table-column>
                <el-table-column label="科室" :resizable="false" prop="followupDept"></el-table-column>
              </el-table>
            </div>
          </section>
          <section class="flex">
            <span class="key alignRight">出院医嘱</span>
            <span class="value">{{ params.data.dischargeDoctorOrder }}</span>
          </section>
          <section style="text-align: right">
            <span class="key alignRight">书写医师签名：</span>
            <span class="value">{{ params.data.chiefPhysicianSignature }}</span>
          </section>
        </div>
      </expandTable>
      <!-- 暂无数据 -->
      <noData v-else></noData>
    </detailCollapseItem>
    <detailCollapseItem title="其它">
      <div class="table-detail" v-if="isRollOut || isSee == 'true'">
        <section class="flex">
          <span class="key">图片</span>
          <imageList v-if="ruleForm.fileList.length > 0" :imageList="ruleForm.fileList"></imageList>
          <span v-else class="value">暂无数据</span>
        </section>
        <section class="flex">
          <span class="key">附言</span>
          <el-input v-model="ruleForm.postscript" maxlength="1000" type="textarea" rows="5" resize="none" disabled />
        </section>
      </div>
      <el-form v-else :model="ruleForm" label-width="40px">
        <el-form-item>
          <template #label>
            <span @mouseenter="onMouseenter" @mouseleave="onMouseleave">图片</span>
          </template>
          <el-upload
            ref="uploadRefName"
            multiple
            :file-list="ruleForm.fileList"
            action
            list-type="picture-card"
            :before-upload="beforeUpload"
            :http-request="httpRequest"
            :on-preview="handlePictureCardPreview"
            :before-remove="beforeRemove"
            :disabled="isDisabled"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
          <div class="upload-dialog" v-if="isShowUpload">
            <div id="qrcode" ref="qrcode"></div>
            <div class="wrap"></div>
          </div>
        </el-form-item>
        <el-form-item label="附言">
          <el-input v-model="ruleForm.postscript" maxlength="1000" placeholder="请输入" type="textarea" rows="5" resize="none" :disabled="isDisabled" />
        </el-form-item>
      </el-form>
    </detailCollapseItem>
    <el-dialog v-model="dialogVisible" title="提示" width="30%" :before-close="handleClose">
      <el-form ref="refuseFormRef" :model="ruleForm1" :rules="rules" label-width="80px">
        <el-form-item label="拒绝原因" prop="reason">
          <el-input v-model="ruleForm1.reason" type="textarea" rows="5" resize="none" placeholder="请输入" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose" v-btn>取消</el-button>
          <el-button type="success" v-btn @click="Confirm(refuseFormRef)">确定</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="dialogVisible1">
      <img w-full width="100%" :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
    <el-dialog v-model="showPatientList" title="选择患者" width="90%">
      <patientList @close="closeDialog" @patientInfo="getPatientInfo" :showListDialog="showPatientList" :hospitalId="unitId"></patientList>
    </el-dialog>
  </div>
</template>
<script setup name="beInHospital">
import { ref, reactive, computed, inject, nextTick, onMounted, onBeforeUnmount } from "vue";
import QRCode from "qrcodejs2-fix";
import { v4 as uuidv4 } from "uuid";
import { ElMessageBox, ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { storage } from "@/utils/storage";
import { userInfoStore } from "@/stores/userInfo";
import imgUpload from "./hooks/imgUpload";
import transferTn from "./hooks/transferTn";
import dataInterface from "./hooks/dataInterface";
import healthRecords from "./hooks/healthRecords";
import warning from "@/assets/image/warning.png";
import detailItem from "./components/detailItem.vue";
import detailCollapseItem from "./components/detailCollapseItem.vue";
import patientList from "./components/patientList.vue";
import noData from "@/components/noData.vue"; // 暂无数据
import expandTable from "./components/expandTable.vue";
import imageList from "./components/imageList.vue";
// 校验手机号
const checkPhone = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入手机号码"));
  }
  const reg = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
  if (!reg.test(value)) {
    callback(new Error("手机号码格式错误"));
  } else {
    callback();
  }
};
// 校验身份证号
const checkIdNo = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入证件号码"));
  }
  if (ruleForm.idCardType == "01") {
    const reg = /(^\d{8}(0\d|10|11|12)([0-2]\d|30|31)\d{3}$)|(^\d{6}(18|19|20)\d{2}(0[1-9]|10|11|12)([0-2]\d|30|31)\d{3}(\d|X|x)$)/;
    if (!reg.test(value)) {
      callback(new Error("证件号码格式错误"));
    } else {
      getIdCardInfo(value);
      callback();
    }
  } else {
    callback();
  }
};

const checksprint52 = (rule, value, callback) => {
  if (!value) {
    return callback(new Error("请输入预交金"));
  }
  if (value <= 1000) {
    callback(new Error("预交金必须大于1000元"));
  } else {
    callback();
  }
};
// 公共方法
const _utils = inject("utils");
const _http = inject("http");
const _apiUrl = inject("apiUrl");
const store = userInfoStore();
const route = useRoute();
const { type, recordId, isSee, operateType, patientId, hospitalId } = route.query;
const ruleFormRef1 = ref();
const ruleFormRef2 = ref();
const ruleFormRef3 = ref();
const ruleFormRef4 = ref();
const ruleFormRef5 = ref();
const refuseFormRef = ref();
const uploadRefName = ref();
const showPatientList = ref(false);
const isSelectPatient = ref(false);
let deselectAdmissionRecordList = ref([]);
let deselectClinicReportList = ref([]);
let deselectDischargeRecordList = ref([]);
let deselectEmrLabReportList = ref([]);
let deselectExamReportList = ref([]);
let qrcode = ref();
let qrcodes = ref({});
let isShowUpload = ref(false);
let timer = ref(null);
// 医保类型列表
const mitList = [
  {
    value: "1",
    label: "长沙市医保",
  },
  {
    value: "2",
    label: "长沙居民医保",
  },
  {
    value: "3",
    label: "省直医保",
  },
  {
    value: "4",
    label: "铁路医保",
  },
  {
    value: "5",
    label: "长沙县医保",
  },
  {
    value: "6",
    label: "新农合",
  },
  {
    value: "7",
    label: "异地联网",
  },
  {
    value: "8",
    label: "外省医保",
  },
  {
    value: "9",
    label: "无医保",
  },
];
// 证件类型
const documentList = [
  {
    value: "01",
    label: "身份证",
  },
  {
    value: "03",
    label: "护照",
  },
  {
    value: "06",
    label: "港澳居民内地通行证",
  },
  {
    value: "07",
    label: "台湾居民内地通行证",
  },
];
// 医生列表
let ruleForm = reactive({
  patientId: "", // 患者ID
  patientName: "", // 患者姓名
  idNo: "", // 患者身份证号
  sexCode: 1, // 患者性别 1男、2女
  patientAge: null, // 患者年龄
  patientPhone: "", // 患者联系方式
  idCardType: "01", // 证件类型
  patientUserId: "", // 用户 ID 号
  visitNo: "", // 门诊卡号
  mainDiagnosis: null, // 主诊断
  clinicCardType: "", // 医保卡类型
  clinicCardNo: "", // 医保卡卡号
  applyUserId: "", // 申请人ID
  applyUserName: "", // 申请人名字
  applyPhone: "", // 申请人电话
  sourceHospitalId: "", // 转出医院ID
  sourceHospitalName: "", // 转出医院名字
  sourceDeptId: "", // 转出科室id
  sourceDeptName: "", // 转出科室名称
  targetHospitalId: "", // 转入医院id
  targetHospitalName: "", // 转入医院名称
  targetDeptId: "", // 转入科室id
  targetDeptName: "", // 转入科室名称
  time: "", // 期望日期
  otherRemark: "", // 其它备注
  postscript: "", // 附言
  fileList: [], // 图片列表
  targetDoctorId: "", // 医生ID
  targetDoctorName: "", // 医生姓名
  patientPhoneHome: 1, // 电话归属地
  referralPurpose: null,
  clinicReportList: "",
  emrLabReportList: "",
  examReportList: "",
  admissionRecordList: "",
  dischargeRecordList: "",
});
let admissionForm = reactive({
  doctorName: "",
  prepayment: "",
  diseaseCondition: "",
  writeDate: "",
  beforeRecorderName: "",
  beforeRecorderNo: "",
  remark: "",
  recordDate: "",
});

let formIds = ref(uuidv4());
let backups = ref([]);

const { unitName, unitId, userName, userId, phone } = store.userInfo;
if (type == 1 && !recordId) {
  ruleForm.sourceHospitalName = unitName;
  ruleForm.sourceHospitalId = unitId;
  ruleForm.applyUserName = userName;
  ruleForm.applyUserId = userId;
  ruleForm.applyPhone = phone;
}

const ruleForm1 = reactive({
  reason: "",
});
const rules = reactive({
  patientName: [{ required: true, message: "请输入病人姓名", trigger: "change" }],
  idNo: [
    {
      required: true,
      validator: checkIdNo,
      trigger: "change",
    },
  ],
  sexCode: [{ required: true, message: "请选择性别", trigger: "change" }],
  patientAge: [{ required: true, message: "请输入病人年龄", trigger: "change" }],
  patientPhone: [{ required: true, validator: checkPhone, trigger: "change" }],
  clinicCardType: [{ required: true, message: "请选择医保卡类型", trigger: "change" }],
  idCardType: [{ required: true, message: "请选择证件类型", trigger: "change" }],
  applyUserName: [{ required: true, message: "请输入申请人姓名", trigger: "change" }],
  applyPhone: [{ required: true, validator: checkPhone, trigger: "change" }],
  sourceHospitalName: [{ required: true, message: "请输入转出医院", trigger: "change" }],
  sourceDeptId: [{ required: true, message: "请选择转出科室", trigger: "change" }],
  targetHospitalId: [{ required: true, message: "请选择转入医院", trigger: "change" }],
  targetDeptId: [{ required: true, message: "请选择转入科室", trigger: "change" }],
  time: [{ required: true, message: "请选择期望日期", trigger: "change" }],
  patientPhoneHome: [{ required: true, message: "请选择电话归属地", trigger: "change" }],
  targetDoctorId: [{ required: true, message: "请选择接诊医生", trigger: "change" }],
  reason: [{ required: true, message: "请输入拒绝原因", trigger: "change" }],
  clinicReportList: [{ required: true, message: "请输入", trigger: "change" }],
  emrLabReportList: [{ required: true, message: "请输入", trigger: "change" }],
  examReportList: [{ required: true, message: "请输入", trigger: "change" }],
  mainDiagnosis: [{ required: true, message: "请输入", trigger: "change" }],
  referralPurpose: [{ required: true, message: "请输入转诊目的", trigger: "change" }],
  doctorName: [{ required: true, message: "请输入医生姓名", trigger: "change" }],
  prepayment: [{ required: true, validator: checksprint52, trigger: "change" }],
  diseaseCondition: [{ required: true, message: "请选择病情", trigger: "change" }],
  writeDate: [{ required: true, message: "请选择填写日期", trigger: "change" }],
  beforeRecorderName: [{ required: true, message: "请输入院前记录人", trigger: "change" }],
  beforeRecorderNo: [{ required: true, message: "请输入工号", trigger: "change" }],
  remark: [{ required: true, message: "请输入备注", trigger: "change" }],
  recordDate: [{ required: true, message: "请选择记录日期", trigger: "change" }],
});

const init = () => {
  let WEBURL = window.globalURL.WEBURL
  if (operateType == 3 || operateType == 1) {
    const width = 160;
    const token = JSON.parse(storage.getSessionStorage("userInfo")).token;
    // 此处可以根据业务进行异步处理，动态获取二维码参数，刷新二维码
    // 先清除二维码再重新生成
    if (qrcodes.value.clear) {
      // this.qrcode.clear()
      qrcode.value.innerHTML = "";
    }
    // ${window.globalURL.WEBURL}
    qrcodes.value = new QRCode(qrcode.value, {
      text: `${WEBURL}/#/upLoadH5?formId=${formIds.value}&token=${token}`, //二维码内容字符串
      width: width, //图像宽度
      height: width, //图像高度
      colorDark: "#000000", //二维码前景色
      colorLight: "#ffffff", //二维码背景色
      correctLevel: QRCode.CorrectLevel.H, //容错级别
    });
    // console.log(
    //   `http://127.0.0.1:5173/#/upLoadH5?formId=${formIds.value}&token=${token}`
    // );
    uploadImg();
  }
};
let departmentList = ref([]);
// remoteMethod,
let { hospitalList, admConditionInfoList, getSelectAllDeptByHospital, getHospitalList, getCurrentUserDept } = dataInterface();
// 获取转出科室的医院
let outDepartmentList = ref([]);

if (type == 1 && isSee == "false" && (!ruleForm.currentProcessStatus || ruleForm.currentProcessStatus == "DTJ")) {
  await getHospitalList({
    pageNo: 1,
    pageSize: 999,
    keyWords: "",
  });
  outDepartmentList.value = await getCurrentUserDept();
}

onMounted(() => {
  if (patientId && hospitalId) fillPatient(patientId)
})
const fillPatient = (patientId) => {
  _http.get(_apiUrl.getPatientInfoByUserId,{
      params: {
        patientId
      }
    }).then(res => {
      let patientInfo = {}
      if(res.retCode == 0) {
        patientInfo = { ...res.retData }
        patientInfo.age = res.retData.dateOfBirth ? _utils.calculateAge(res.retData.dateOfBirth) : ''
        patientInfo.hospitalId = hospitalId
        getPatientInfo(patientInfo)
      }
    })
}

let {
  queryClinicReportList,
  selectClinicReportList,
  selectEmrLabReportList,
  selectExamReportList,
  selectAdmissionRecordList,
  selectDischargeRecordList,
  queryEmrAdmissionRecordList,
  queryEmrDischargeRecordList,
  queryEmrExamReportList,
  queryEmrLabReportList,
  getQueryClinicReportListExt,
  getQueryEmrAdmissionRecordList,
  getQueryEmrDischargeRecordList,
  getQueryEmrExamReportList,
  getQueryEmrLabReportList,
  selectList,
} = healthRecords();
// 如果存在转诊记录id，就要获取详情数据
if (recordId) {
  _http
    .post(
      _apiUrl.selectReferralApply,
      {},
      {
        recordId,
      }
    )
    .then(async (res) => {
      let obj = res.retData;
      admissionForm = Object.assign(admissionForm, obj.admissionForm);
      ruleForm = Object.assign(ruleForm, obj.referralRecordVo);
      admissionForm.remark = ruleForm.otherRemark
      ruleForm.fileList =
        obj.fileInfoVoList && obj.fileInfoVoList.length > 0
          ? obj.fileInfoVoList.map((item) => {
              return {
                mediaType: item.attachmentType,
                url: item.fileUrl,
              };
            })
          : [];
      backups.value = JSON.parse(JSON.stringify(ruleForm.fileList));
      ruleForm.time = ruleForm.expectedDateFrom || ruleForm.expectedDateTo;

      if (obj.recordTextListVo) {
        ruleForm = Object.assign(ruleForm, obj.recordTextListVo);
      }
      if (obj.referralRecordVo.patientId) {
        isSelectPatient.value = true;
      }
      if (obj.referralRecordVo.patientId && operateType == 3) {
        // 获取门诊列表......等数据
        let params = {
          userId: obj.referralRecordVo.patientId,
          hospitalId: obj.referralRecordVo.sourceHospitalId,
        };
        await getQueryClinicReportListExt(params);
        await getQueryEmrAdmissionRecordList(params);
        await getQueryEmrDischargeRecordList(params);
        await getQueryEmrExamReportList(params);
        await getQueryEmrLabReportList(params);
        selectClinicReportList.value = obj.recordJsonListVo.clinicReportList;
        selectAdmissionRecordList.value = obj.recordJsonListVo.admissionRecordList;
        selectExamReportList.value = obj.recordJsonListVo.examReportList;
        selectEmrLabReportList.value = obj.recordJsonListVo.emrLabReportList;
        selectDischargeRecordList.value = obj.recordJsonListVo.dischargeRecordList;
        deselectClinicReportList.value = obj.recordJsonListVo.clinicReportList;
        deselectAdmissionRecordList.value = obj.recordJsonListVo.admissionRecordList;
        deselectExamReportList.value = obj.recordJsonListVo.examReportList;
        deselectEmrLabReportList.value = obj.recordJsonListVo.emrLabReportList;
        deselectDischargeRecordList.value = obj.recordJsonListVo.dischargeRecordList;
      }
      if ((obj.referralRecordVo.patientId && isSee == "true") || operateType == 4 || operateType == 2) {
        queryClinicReportList.value = obj.recordJsonListVo ? obj.recordJsonListVo.clinicReportList : [];
        queryEmrAdmissionRecordList.value = obj.recordJsonListVo ? obj.recordJsonListVo.admissionRecordList : [];
        queryEmrExamReportList.value = obj.recordJsonListVo ? obj.recordJsonListVo.examReportList : [];
        queryEmrLabReportList.value = obj.recordJsonListVo ? obj.recordJsonListVo.emrLabReportList : [];
        queryEmrDischargeRecordList.value = obj.recordJsonListVo ? obj.recordJsonListVo.dischargeRecordList : [];
      }
      if (type == 2 || (type == 1 && isSee == "true")) {
        outDepartmentList.value = [
          {
            SectionId: ruleForm.sourceDeptId,
            SectionName: ruleForm.sourceDeptName,
          },
        ];
        hospitalList.value = [
          {
            HospitalId: ruleForm.targetHospitalId,
            allHosName: ruleForm.targetHospitalName,
          },
        ];
        departmentList.value = [
          {
            SectionId: ruleForm.targetDeptId,
            SectionName: ruleForm.targetDeptName,
          },
        ];
      }
      // 获取转出医院科室
      if (type == 1 && isSee == "false" && ruleForm.targetHospitalId) {
        departmentList.value = await getSelectAllDeptByHospital({
          hospitalId: ruleForm.targetHospitalId,
          sectionClass: "802",
        });
      }
    });
}
/**
 * 保存、提交转出申请的数据
 */
const Save = () => {
  clearFormValidate();
  ruleFormRef2.value.validateField("sourceDeptId", (valid) => {
    if (valid) {
      setInsertReferralApply(1);
    }
  });
};
const setInsertReferralApply = (type) => {
  let params = {
    referralRecord: {
      patientId: ruleForm.patientId, // 患者ID
      patientName: ruleForm.patientName, // 患者姓名
      idNo: ruleForm.idNo, // 患者身份证号
      sexCode: ruleForm.sexCode, // 患者性别 1男、2女
      patientAge: ruleForm.patientAge, // 患者年龄
      patientPhone: ruleForm.patientPhone, // 患者联系方式
      clinicCardType: ruleForm.clinicCardType, // 医保卡类型
      clinicCardNo: ruleForm.clinicCardNo, // 医保卡卡号
      applyUserId: ruleForm.applyUserId, // 申请人ID
      applyUserName: ruleForm.applyUserName, // 申请人名字
      applyPhone: ruleForm.applyPhone, // 申请人电话
      sourceHospitalId: ruleForm.sourceHospitalId, // 转出医院ID
      sourceHospitalName: ruleForm.sourceHospitalName, // 转出医院名字
      sourceDeptId: ruleForm.sourceDeptId, // 转出科室id
      sourceDeptName: ruleForm.sourceDeptName, // 转出科室名称
      targetHospitalId: ruleForm.targetHospitalId, // 转入医院id
      targetHospitalName: ruleForm.targetHospitalName, // 转入医院名字
      targetDeptId: ruleForm.targetDeptId, // 转入科室id
      targetDeptName: ruleForm.targetDeptName, // 转入科室名字
      idCardType: ruleForm.idCardType, // 证件类型
      patientUserId: ruleForm.patientUserId, // 用户 ID 号
      visitNo: ruleForm.visitNo, // 门诊卡号
      mainDiagnosis: ruleForm.mainDiagnosis, // 主诊断,
      currentProcessStatus: ruleForm.currentProcessStatus ? ruleForm.currentProcessStatus : "", // 当前流程状态
      expectedDateFrom: ruleForm.time ? ruleForm.time : "",
      expectedDateTo: ruleForm.time ? ruleForm.time : "",
      otherRemark: ruleForm.otherRemark, // 其它备注
      postscript: ruleForm.postscript, // 附言
      transferType: "ZY", // 住院
      recordId: recordId ? recordId : "", // 转诊记录id
      targetDoctorId: ruleForm.targetDoctorId, // 医生ID
      targetDoctorName: ruleForm.targetDoctorName, // 医生姓名
      referralPurpose: ruleForm.referralPurpose,
      patientPhoneHome: ruleForm.patientPhoneHome,
    },
    recordTextListVo: {
      clinicReportList: ruleForm.clinicReportList,
      emrLabReportList: ruleForm.emrLabReportList,
      examReportList: ruleForm.examReportList,
      admissionRecordList: ruleForm.admissionRecordList,
      dischargeRecordList: ruleForm.dischargeRecordList,
      // clinicReportList: ruleForm.clinicReportList
      //   ? ruleForm.clinicReportList
      //   : null,
      // emrLabReportList: ruleForm.emrLabReportList
      //   ? ruleForm.emrLabReportList
      //   : null,
      // examReportList: ruleForm.examReportList ? ruleForm.examReportList : null,
      // admissionRecordList: ruleForm.admissionRecordList
      //   ? ruleForm.admissionRecordList
      //   : null,
      // dischargeRecordList: ruleForm.dischargeRecordList
      //   ? ruleForm.dischargeRecordList
      //   : null,
    },
    recordJsonListVo: {
      // && selectClinicReportList.value.length > 0
      //     ? selectClinicReportList.value
      //     : null
      clinicReportList: selectClinicReportList.value,
      // && selectEmrLabReportList.value.length > 0
      //   ? selectEmrLabReportList.value
      //   : null
      emrLabReportList: selectEmrLabReportList.value,
      // && selectEmrLabReportList.value.length > 0
      //   ? selectEmrLabReportList.value
      //   : null
      examReportList: selectExamReportList.value,
      // &&
      // selectAdmissionRecordList.value.length > 0
      //   ? selectAdmissionRecordList.value
      //   : null
      admissionRecordList: selectAdmissionRecordList.value,
      // &&
      // selectDischargeRecordList.value.length > 0
      //   ? selectDischargeRecordList.value
      //   : null
      dischargeRecordList: selectDischargeRecordList.value,
    },
    // fileInfoVoList: fileList.value
    fileInfoVoList: fileList.value.map((item) => {
      let index = item.fileUrl.lastIndexOf("/");
      return {
        attachmentType: item.attachmentType,
        fileUrl: item.fileUrl.slice(index + 1),
      };
    }),
  };
  _http
    .post(
      _apiUrl.insertReferralApply,
      {
        params,
      },
      {
        type,
        isReWrite: operateType == 5 ? 1 : 0
      }
    )
    .then((res) => {
      if (res.retCode == 0) {
        ElMessage({
          type: "success",
          message: "操作成功",
        });
        if(patientId && hospitalId) {
          closePop()
          return
        }
        // 删除该tab页
        let beforeTitle = "";
        beforeTitle = operateType == 1 ? "住院转出申请" : operateType == 2 ? "住院转出查看" : operateType == 5 ? "重新填写" : "住院转出编辑";
        window.parent.postMessage(
          JSON.stringify({
            method: "removeTab",
            url: "",
            title: "",
            beforeTitle,
          }),
          "*"
        );
        // 跳转到列表tab页
        let urlx = "";
        // console.log(location)
        if (location.pathname) {
          urlx = location.origin + location.pathname;
        } else {
          urlx = location.origin + "/pc";
        }
        // console.log(urlx);
        let url = `${urlx}#/beinHospitalLeave?isBack=true`;

        let title = "住院转出列表";
        window.parent.postMessage(
          JSON.stringify({
            method: "addTab",
            url,
            title,
          }),
          "*"
        );
      }
    });
};
const closePop = () => {
  window.parent.postMessage(
          JSON.stringify({
            method: "closePop",
            type: 1
          }),
          "*"
          );
}
const submitForm = () => {
  let p1 = new Promise((reslove, reject) => {
    ruleFormRef1.value.validate((valid) => {
      if (valid) {
        return reslove();
      } else {
        return reject();
      }
    });
  });
  let p2 = new Promise((reslove, reject) => {
    ruleFormRef2.value.validate((valid) => {
      if (valid) {
        return reslove();
      } else {
        return reject();
      }
    });
  });
  let p3 = new Promise((reslove, reject) => {
    if (!ruleFormRef3.value) return reslove();
    ruleFormRef3.value.validate((valid) => {
      if (valid) {
        return reslove();
      } else {
        return reject();
      }
    });
  });
  let p4 = new Promise((reslove, reject) => {
    if (!ruleFormRef4.value) return reslove();
    ruleFormRef4.value.validate((valid) => {
      if (valid) {
        return reslove();
      } else {
        return reject();
      }
    });
  });
  Promise.all([p1, p2, p3, p4]).then(() => {
    if (queryClinicReportList.value && queryClinicReportList.value.length > 0 && selectClinicReportList.value.length == 0) {
      ElMessage({
        type: "warning",
        message: "请选择就诊记录",
      });
    } else {
      ElMessageBox.confirm("是否确认提交？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
      }).then(() => {
        setInsertReferralApply(2);
      });
    }
  });
};

//选择患者
const choosePatient = () => {
  showPatientList.value = true;
};
//关闭选择患者弹窗
const closeDialog = () => {
  showPatientList.value = false;
};
//患者信息
const getPatientInfo = (val) => {
  // console.log(val);
  isSelectPatient.value = true;
  // 数据填入
  ruleForm.patientName = val.patientName;
  ruleForm.idCardType = "01";
  ruleForm.idNo = val.idNo;
  ruleForm.sexCode = val.sex == "男" ? 1 : 2;
  ruleForm.patientAge = val.age;
  ruleForm.patientPhone = val.phone;
  ruleForm.patientId = val.userId;
  // 重置数据
  ruleForm.clinicReportList = "";
  ruleForm.emrLabReportList = "";
  ruleForm.examReportList = "";
  ruleForm.admissionRecordList = "";
  ruleForm.dischargeRecordList = "";
  selectClinicReportList.value = [];
  selectEmrLabReportList.value = [];
  selectExamReportList.value = [];
  selectAdmissionRecordList.value = [];
  selectDischargeRecordList.value = [];
  // 获取门诊列表......等数据
  let params = {
    userId: val.userId,
    hospitalId: val.hospitalId,
  };
  getQueryClinicReportListExt(params);
  getQueryEmrAdmissionRecordList(params);
  getQueryEmrDischargeRecordList(params);
  getQueryEmrExamReportList(params);
  getQueryEmrLabReportList(params);
  // 关闭弹窗
  closeDialog();
};
/**
 * 转入拒绝同意操作相关
 */
let { dialogVisible, Refuse, handleClose, refuseConfirm, InAgree } = transferTn(refuseFormRef);
const Confirm = (formEl) => {
  refuseConfirm(
    formEl,
    {
      recordId: ruleForm.recordId,
      action: "BACKWARD",
      remark: ruleForm1.reason,
    },
    "ZY",
    operateType
  );
};
const Agree = () => {
  if (ruleForm.currentProcessStatus == "DKSSH") {
    if (!ruleFormRef5.value) return;
    ruleFormRef5.value.validate((valid) => {
      if (valid) {
        InAgree(
          {
            recordId: ruleForm.recordId,
            action: "AGREE",
          },
          "ZY",
          operateType,
          {
            doctorName: admissionForm.doctorName,
            prepayment: admissionForm.prepayment,
            diseaseCondition: admissionForm.diseaseCondition,
            writeDate: admissionForm.writeDate,
            beforeRecorderName: admissionForm.beforeRecorderName,
            beforeRecorderNo: admissionForm.beforeRecorderNo,
            remark: admissionForm.remark,
            recordDate: admissionForm.recordDate,
            recordId: ruleForm.recordId,
          }
        );
      }
    });
  } else {
    InAgree(
      {
        recordId: ruleForm.recordId,
        action: "AGREE",
      },
      "ZY",
      operateType
    );
  }
};
/**
 * 图片上传相关
 */
let { Plus, dialogVisible1, dialogImageUrl, beforeUpload, handlePictureCardPreview } = imgUpload();
// 自定义文件上传
const httpRequest = async (v) => {
  const formDataFile = new FormData();
  formDataFile.append("file", v.file);
  await _http
    .uploadFile(_apiUrl.uploadFile, {
      formData: formDataFile,
    })
    .then((res) => {
      let obj = {
        mediaType: res.retData.mediaType,
        url: `${window.globalURL.SRFApiUrl}/file/image/${res.retData.id}`,
        uid: v.file.uid,
        status: "success",
      };
      ruleForm.fileList.push(obj);
      backups.value.push(obj);
      // console.log(ruleForm.fileList)
    })
    .catch(() => {
      uploadRefName.value.handleRemove(v);
    });
};
// 删除文件的钩子
const beforeRemove = (uploadFile, uploadFiles) => {
  // console.log(uploadFiles)
  if (uploadFile.formId) {
    _http
      .post(
        _apiUrl.deletePic,
        {},
        {
          formId: uploadFile.formId,
          address: uploadFile.url,
        }
      )
      .then((res) => {
        if (res.retCode == 0) {
          let index = ruleForm.fileList.findIndex((item) => {
            return item.uid == uploadFile.uid;
          });
          if (index > -1) {
            ruleForm.fileList.splice(index, 1);
          }
        }
      });
  } else {
    let index = ruleForm.fileList.findIndex((item) => {
      return item.uid == uploadFile.uid;
    });
    if (index > -1) {
      backups.value.splice(index, 1);
    }
  }
};
// 根据科室、医院ID获取科室、医院姓名
const Change1 = () => {
  if (!ruleForm.sourceDeptId) {
    ruleForm.sourceDeptName = "";
    return;
  }
  let arr = outDepartmentList.value.filter((item) => {
    return item.SectionId == ruleForm.sourceDeptId;
  });
  if (arr.length < 1) {
    ruleForm.sourceDeptName = ruleForm.sourceDeptId;
    return;
  }
  ruleForm.sourceDeptName = arr[0].SectionName;
};
const Change2 = async (v) => {
  if (!v) {
    targetHospitalName.value = "";
    return;
  }
  ruleForm.time = "";
  ruleForm.targetDeptId = "";
  ruleForm.targetDeptName = "";
  // 医生
  ruleForm.targetDoctorId = "";
  ruleForm.targetDoctorName = "";

  let arr = hospitalList.value.filter((item) => {
    return item.HospitalId == ruleForm.targetHospitalId;
  });
  ruleForm.targetHospitalName = arr[0].allHosName;

  departmentList.value = await getSelectAllDeptByHospital({
    hospitalId: v,
    sectionClass: "802",
  });

  nextTick(() => {
    ruleFormRef2.value.clearValidate(["targetDeptId"]);
  });
};
const Change3 = () => {
  if (!ruleForm.targetDeptId) {
    ruleForm.targetDeptName = "";
    return;
  }
  let arr = departmentList.value.filter((item) => {
    return item.SectionId == ruleForm.targetDeptId;
  });
  ruleForm.targetDeptName = arr[0].SectionName;
};
// 就诊记录数据详情展示
let basicInfo = reactive({});
const seeList = (v) => {
  basicInfo = Object.assign(basicInfo, v);
};
// true转出、false转入
const isRollOut = computed(() => {
  return type == 2 ? true : false;
});
// 是否禁止输入
const isDisabled = computed(() => {
  if(operateType == 5) return false
  if (
    type == 2 ||
    (recordId && ruleForm.currentProcessStatus != "DTJ" && ruleForm.currentProcessStatus != "YQX" && ruleForm.currentProcessStatus != "YJJ") ||
    isSee == "true"
  ) {
    return true;
  } else {
    return false;
  }
});
// 新增患者、保存、提交按钮显示
const isAddTransferOut = computed(() => {
  if(operateType == 5) return true
  if (
    type == 1 &&
    isSee != "true" &&
    (!ruleForm.currentProcessStatus ||
      ruleForm.currentProcessStatus == "DTJ" ||
      ruleForm.currentProcessStatus == "YQX" ||
      ruleForm.currentProcessStatus == "YJJ")
  ) {
    return true;
  } else {
    return false;
  }
});
// 拒绝、同意按钮显示
const isTransferIn = computed(() => {
  if (
    type == 2 &&
    isSee != "true" &&
    (ruleForm.currentProcessStatus == "DYYSH" ||
      ruleForm.currentProcessStatus == "DKSSH" ||
      ruleForm.currentProcessStatus == "DYQZBSH" ||
      ruleForm.currentProcessStatus == "DXJYYSH")
  ) {
    return true;
  } else {
    return false;
  }
});
// 拒绝理由元素显示
const isRefuse = computed(() => {
  if (ruleForm.currentProcessStatus == "YJJ") {
    return true;
  } else {
    return false;
  }
});
const fileList = computed(() => {
  return ruleForm.fileList.map((item) => {
    return {
      attachmentType: item.mediaType,
      fileUrl: item.url,
    };
  });
});

// 清除校验
const clearFormValidate = () => {
  ruleFormRef1.value && ruleFormRef1.value.clearValidate();
  ruleFormRef2.value && ruleFormRef2.value.clearValidate();
  ruleFormRef3.value && ruleFormRef3.value.clearValidate();
  ruleFormRef4.value && ruleFormRef4.value.clearValidate();
  ruleFormRef5.value && ruleFormRef5.value.clearValidate();
};
const idCardTypeChange = () => {
  ruleForm.idNo = "";
  // nextTick(() => {
  //   ruleFormRef1.value.clearValidate(["targetDeptId"]);
  // });
};
// 根据身份证号反填性别和年龄
const getIdCardInfo = (idCard) => {
  if (ruleForm.idCardType != "01") return;
  let birthday = "";
  if (idCard.length == 15) {
    birthday = "19" + idCard.charAt(6) + idCard.charAt(7) + "-" + idCard.charAt(8) + idCard.charAt(9) + "-" + idCard.charAt(10) + idCard.charAt(11);
    //获取性别
    if (parseInt(idCard.charAt(14)) % 2 == 0) {
      ruleForm.sexCode = 2;
    } else {
      ruleForm.sexCode = 1;
    }
  } else if (idCard.length == 18) {
    birthday =
      idCard.charAt(6) +
      idCard.charAt(7) +
      idCard.charAt(8) +
      idCard.charAt(9) +
      "-" +
      idCard.charAt(10) +
      idCard.charAt(11) +
      "-" +
      idCard.charAt(12) +
      idCard.charAt(13);
    //获取性别
    if (parseInt(idCard.charAt(16)) % 2 == 0) {
      ruleForm.sexCode = 2;
    } else {
      ruleForm.sexCode = 1;
    }
  }
  const birthDate = new Date(birthday);
  const nowDate = new Date();
  let age = nowDate.getFullYear() - birthDate.getFullYear();
  if (nowDate.getMonth() < birthDate.getMonth() || (nowDate.getMonth() == birthDate.getMonth() && nowDate.getDate() < birthDate.getDate())) {
    age--;
  }
  if (age) {
    ruleForm.patientAge = age;
  } else {
    ruleForm.patientAge = null;
    nextTick(() => {
      ruleFormRef1.value && ruleFormRef1.value.resetFields(["patientAge"]);
    });
  }
};

// 合并数组，并去重
const mergeUniqueObjects = (arr1, arr2) => {
  return [...arr1, ...arr2].reduce((acc, current) => {
    const existIndex = acc.findIndex((item) => item.url === current.url);
    if (existIndex === -1) {
      acc.push(current);
    } else {
      acc[existIndex] = { ...acc[existIndex], ...current };
    }
    return acc;
  }, []);
};

const uploadImg = () => {
  timer.value = setInterval(() => {
    _http.post(_apiUrl.getPic, { showLoading: false }, { formId: formIds.value }).then((res) => {
      let data = res.retData;
      let arr = [];
      if (data && data.length > 0) {
        arr = data.map((item) => {
          return {
            mediaType: "image/jpeg",
            url: item,
            formId: formIds.value,
          };
        });
      }
      ruleForm.fileList = mergeUniqueObjects(backups.value, arr);
    });
  }, 5000);
};

const onMouseenter = () => {
  if (operateType != 3 && operateType != 1) {
    return;
  }
  isShowUpload.value = true;
  if (timer.value) {
    clearInterval(timer.value);
  }
  nextTick(() => {
    init();
  });
};

const onMouseleave = () => {
  isShowUpload.value = false;
};

onBeforeUnmount(() => {
  timer.value && clearInterval(timer.value);
});
</script>
<style lang="scss" scoped>
.list-detail {
  width: 100%;
  height: 100%;
  overflow-y: auto;
  padding: 0px 20px 66px;
  box-sizing: border-box;
  .button {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 0 40px;
    display: flex;
    align-items: center;
    justify-content: end;
    height: 66px;
    background: #ffffff;
    box-shadow: 0px -2px 6px 0px rgba(0, 0, 0, 0.1819);
    z-index: 1000;
  }

  .select-patient {
    margin-top: 4px;
    display: flex;
    align-items: top;
    justify-content: end;
    height: 50px;
    margin-bottom: 10px;
  }
  .warning {
    height: 36px;
    display: flex;
    align-items: center;
    background: #fff7f3;
    border-radius: 4px;
    color: #ff7b35;
    margin-bottom: 20px;
    img {
      width: 16px;
      height: 16px;
      margin: 0 10px 0 24px;
    }
  }
  .table-detail {
    padding: 12px 20px;
    .list-header {
      display: flex;
      .title {
        font-size: 14px;
        font-weight: 700;
        letter-spacing: 0.2px;
        color: #666666;
      }
    }
    .list-item {
      display: flex;
    }
    .alignRight {
      display: inline-block;
      width: 130px;
      text-align: right;
    }
    .width100 {
      width: 100%;
    }
    .key {
      flex-shrink: 0;
      font-size: 14px;
      letter-spacing: 0.2px;
      color: #333333;
      margin-right: 20px;
    }
    .value {
      flex: 1;
      font-size: 14px;
      letter-spacing: 0.2px;
      color: #111111;
    }
    .marginR40 {
      margin-right: 40px;
    }
  }
}
.flex {
  display: flex;
  margin-bottom: 5px;
  .flex-item {
    flex: 1;
    align-items: center;
  }
}
.upload-dialog {
  position: absolute;
  width: 200px;
  height: 200px;
  top: 40px;
  background-color: #dedfe0;
  left: -50px;
  z-index: 100;
  padding: 20px;
  .wrap {
    position: absolute;
    top: -16px;
    left: 16px;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 16px solid #dedfe0;
  }
}
</style>
<style lang="scss">
.list-detail {
  .el-select {
    flex: 1;
  }
  .el-form-item__label {
    font-size: 14px;
    color: #333333 !important;
  }
  .el-input.is-disabled .el-input__inner {
    color: #111111 !important;
    -webkit-text-fill-color: #111111 !important;
  }
  .el-textarea.is-disabled .el-textarea__inner {
    color: #111111 !important;
  }
  .el-range-editor.is-disabled {
    color: #111111 !important;
    input,
    .el-range-separator {
      color: #111111 !important;
    }
  }
  .el-radio__input.is-disabled + span.el-radio__label {
    color: #111111 !important;
  }
  .el-button {
    width: 92px;
    height: 36px;
    background: #ffffff;
    border: 1px solid #cccccc;
    color: #666666;
  }
  .el-button--success {
    background: #32ae57;
    border: 1px solid #2aa44e;
    color: #ffffff;
  }
  .el-button.is-plain {
    border: 1px solid #00982d;
    background-color: #f7fcf8;
    color: #00982d;
  }
  .el-dialog {
    .el-button {
      width: 60px;
      height: 32px;
    }
  }
  .el-upload-list__item {
    transition: none !important;
  }
}
</style>
