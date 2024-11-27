<template>
  <section class="padding20">
    <div class="padding20">
      <span>患者类型</span>
      <el-select class="margin-left14" style="width: 200px" v-model="patientTypeCode" placeholder="患者类型" @change="changePatientType">
        <el-option
          v-for="item in patientTypeList"
          :key="item.patientTypeCode"
          :value="item.patientTypeCode"
          :label="item.patientTypeName"
          :disabled="item.enabled == 0 ||item.patientTypeCode==patientModel.sign  ||item.patientTypeCode==patientModel.family ||item.patientTypeCode==patientModel.transfer"
        ></el-option>
      </el-select>
    </div>
    <el-form label-position="right" label-width="110px" ref="form" :rules="rules" :model="form">
      <div class="title">基本信息</div>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="患者姓名" prop="patientName">
            <el-input class="width100" show-word-limit :maxlength="15" v-model="form.patientName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item v-alphanumeric label="病案号" prop="patientId">
            <el-input class="width100" show-word-limit :maxlength="20" v-model="form.patientId"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="身份证号" prop="idNo">
            <el-input v-alphanumeric class="width100" v-model="form.idNo" show-word-limit :maxlength="18"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="getBasicInfo">获取基本信息</el-button>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="出生日期" prop="dateOfBirth">
            <el-date-picker style="width: 100%" v-model="form.dateOfBirth" type="date" value-format="yyyy-MM-dd" placeholder="选择日期" disabled></el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="性别" prop="sex">
            <el-select class="width100" v-model="form.sex" disabled>
              <el-option v-for="item in sexList" :key="item.dict_name" :label="item.dict_name" :value="item.dict_name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="手机号" prop="phone">
            <el-input class="width100" show-word-limit :maxlength="15" @input="form.phone = form.phone.replace(/[^\d]/gi, '')" v-model="form.phone"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="民族">
            <el-select class="width100" v-model="form.clan">
              <el-option v-for="item in clanList" :key="item.dict_name" :label="item.dict_name" :value="item.dict_name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="6">
          <el-form-item label="文化程度">
            <el-select class="width100" v-model="form.educationLevel">
              <el-option v-for="item in educationList" :key="item.dict_name" :label="item.dict_name" :value="item.dict_name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="婚姻状况">
            <el-select class="width100" v-model="form.maritalStatus">
              <el-option v-for="item in maritalList" :key="item.dict_name" :label="item.dict_name" :value="item.dict_name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系人姓名" prop="contactName">
            <el-input class="width100" show-word-limit :maxlength="15" v-model="form.contactName"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="联系人手机号" prop="contactPhone">
            <el-input class="width100" show-word-limit :maxlength="15" v-model="form.contactPhone" @input="form.contactPhone = form.contactPhone.replace(/[^\d]/gi, '')"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="其他资料">
            <el-input class="width100" show-word-limit :maxlength="40" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="form.remark"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="家庭地址">
            <el-input class="width100" show-word-limit :maxlength="50" type="textarea" :autosize="{ minRows: 2, maxRows: 6 }" v-model="form.homeAddress"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="title" v-if="patientTypeCode!='EXAMINATION_PATIENT'">{{ patientTypeCode == patientModel.admission || patientType == patientModel.discharge? "住院资料" : "就诊信息" }}</div>
      <!-- <div class="title">就诊信息</div> -->

      <template v-if="patientTypeCode === patientModel.internet">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="就诊科室" prop="medicalDept">
              <el-select v-model="form.medicalDept" allow-create default-first-option filterable clearable placeholder="就诊科室" @change="labelChangeEvent">
                <el-option v-for="item in deptList" :key="item.deptName" :label="item.deptName" :value="item.deptName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="就诊时间" prop="medicalDate">
              <el-date-picker style="width: 100%" v-model="form.medicalDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="主治医生">
              <el-input class="width100" show-word-limit :maxlength="15" v-model="form.physicianName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="就诊诊断" prop="clinicalDiagnosis">
              <el-input class="width100" show-word-limit :maxlength="40" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="form.clinicalDiagnosis"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template v-else-if="patientTypeCode === patientModel.discharge || patientTypeCode === patientModel.admission">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="住院号" prop="inpNo">
              <el-input class="width100" v-alphanumeric show-word-limit :maxlength="20" v-model="form.inpNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col v-if="patientTypeCode == patientModel.discharge" :span="6">
            <el-button type="primary" @click="getAdmissionInfo">获取住院信息</el-button>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="入院时间" prop="admissionDatetime">
              <el-date-picker style="width: 100%" v-model="form.admissionDatetime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="入院病区" prop="admissionWardCode">
              <el-select class="width100" filterable v-model="form.admissionWardCode">
                <el-option v-for="(item, index) in wardList" :key="index" :label="item.dischargeWard" :value="item.dischargeWardCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="床号" prop="bedNo">
              <el-input class="width100" show-word-limit :maxlength="5" v-model="form.bedNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="主治医生">
              <el-input class="width100" show-word-limit :maxlength="15" v-model="form.physicianName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="入院原因">
            <el-input class="width100" v-model="form.chiefComplaints" show-word-limit :maxlength="100"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="入院诊断" prop="presentHistory">
            <el-input class="width100" v-model="form.presentHistory" show-word-limit :maxlength="100"></el-input>
          </el-form-item>
        </el-row>
      </template>
      <template v-else-if="(patientTypeCode === patientModel.examination || patientTypeCode === patientModel.out)&&patientTypeCode!='EXAMINATION_PATIENT'">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="门诊号" prop="inpNo">
              <el-input class="width100" show-word-limit :maxlength="20" v-model="form.inpNo"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="就诊时间" prop="medicalDate">
              <el-date-picker style="width: 100%" v-model="form.medicalDate" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="就诊科室" prop="medicalDept">
              <el-select v-model="form.medicalDept" allow-create default-first-option filterable clearable placeholder="就诊科室" @change="labelChangeEvent">
                <el-option v-for="item in deptList" :key="item.deptName" :label="item.deptName" :value="item.deptName"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="主治医生">
              <el-input class="width100" show-word-limit :maxlength="15" v-model="form.physicianName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="门诊诊断" prop="clinicalDiagnosis">
              <el-input class="width100" show-word-limit :maxlength="40" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="form.clinicalDiagnosis"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
      <template v-if="patientTypeCode === patientModel.discharge">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item label="出院时间" prop="dischargeDatetime">
              <el-date-picker style="width: 100%" v-model="form.dischargeDatetime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出院病区" prop="dischargeWardCode">
              <el-select class="width100" filterable v-model="form.dischargeWardCode">
                <el-option v-for="(item, index) in wardList" :key="index" :label="item.dischargeWard" :value="item.dischargeWardCode"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="病理号">
              <el-input class="width100" v-alphanumericSymbol v-model.trim="form.pathologyNo" show-word-limit :maxlength="20"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-form-item label="出院诊断" prop="dischargeDiagnosis">
            <el-input class="width100" v-model="form.dischargeDiagnosis" show-word-limit :maxlength="100"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="出院状况">
            <el-input class="width100" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="form.dischargeSituation" show-word-limit :maxlength="150"></el-input>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item label="出院医嘱">
            <el-input class="width100" type="textarea" :autosize="{ minRows: 2, maxRows: 4 }" v-model="form.dischargeDoctorOrder" show-word-limit :maxlength="150"></el-input>
          </el-form-item>
        </el-row>
      </template>

      <template v-if="patientTypeCode == patientModel.admission">
        <div class="title">
          <span>手术信息</span>
          <el-switch v-model="opeShow" @change="setOpeShow"></el-switch>
        </div>
        <template v-if="opeShow">
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="手术记录编码" prop="operationNo">
                <el-input class="width100" show-word-limit :maxlength="15" v-model="form.operationNo"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="科室名称" prop="deptName">
                <el-select class="width100" filterable v-model="form.deptName">
                  <el-option v-for="(item, index) in wardList" :key="index" :label="item.dischargeWard" :value="item.dischargeWardCode"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手术开始时间" prop="startDatetime">
                <el-date-picker style="width: 100%" v-model="form.startDatetime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="手术结束时间" prop="endDatetime">
                <el-date-picker style="width: 100%" v-model="form.endDatetime" type="date" value-format="yyyy-MM-dd" placeholder="选择日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="主刀医生" prop="surgeon">
                <el-input key="surgeon" class="width100" show-word-limit :maxlength="15" v-model="form.surgeon"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手术名称" prop="operativeName">
                <el-input class="width100" show-word-limit :maxlength="15" v-model="form.operativeName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="手术I助">
                <el-input class="width100" show-word-limit :maxlength="15" v-model="form.firstAssistant"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手术II助">
                <el-input class="width100" show-word-limit :maxlength="15" v-model="form.secondAssistant"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="麻醉方式" prop="anesthesiaMethod">
                <el-input class="width100" show-word-limit :maxlength="15" v-model="form.anesthesiaMethod"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="麻醉医生" prop="anesthesiaDoctor">
                <el-input class="width100" show-word-limit :maxlength="15" v-model="form.anesthesiaDoctor"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item label="术前诊断" prop="preoperativeDiagnosis">
              <el-input class="width100" v-model="form.preoperativeDiagnosis" show-word-limit :maxlength="100"></el-input>
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item label="术后诊断" prop="postoperativeDiagnosis">
              <el-input class="width100" v-model="form.postoperativeDiagnosis" show-word-limit :maxlength="100"></el-input>
            </el-form-item>
          </el-row>
        </template>
      </template>
    </el-form>
    <div class="margin-top20" style="text-align: center">
      <el-button class="width100px" type="primary" @click="onSubmit" :disabled="pdsubmit">提交</el-button>
    </div>
  </section>
</template>

<script>
import { patientModel } from '@/mixins/enum.js';
const form = {
  patientName: '',
  patientId: '', //病案号
  idNo: '', //身份证号
  dateOfBirth: '',
  sex: '',
  phone: '',
  clan: '', //民族
  educationLevel: '',
  maritalStatus: '', //婚姻状态
  contactName: '',
  contactPhone: '',
  remark: '',
  homeAddress: '',
  inpNo: '', // 住院号
  operationNo: '', //手术记录编号
  deptId: '', //科室id
  deptName: '', //科室名称
  serialNo: '', //序列号
  admissionDatetime: '', //住院时间
  admissionWardCode: '', //入院病区
  ward: '', //病区
  bedNo: '', //床号
  physicianName: '', //主治医师
  chiefComplaints: '', //入院原因
  startDatetime: '', //手术开始时间
  endDatetime: '', //手术结束时间
  surgeon: '', //主刀医生
  firstAssistant: '', //手术I助
  secondAssistant: '', //手术II助
  anesthesiaMethod: '', //麻醉方式
  anesthesiaDoctor: '', //麻醉医生
  preoperativeDiagnosis: '', //术前诊断
  postoperativeDiagnosis: '', //术后诊断
  operativeName: '', //手术名称
  presentHistory: '',
  dischargeDatetime: '',
  dischargeWardCode: '',
  pathologyNo: '',
  dischargeSituation: '',
  dischargeDoctorOrder: '',
  dischargeDiagnosis: '',
  medicalDate: '',
  clinicalDiagnosis: '',
  medicalDept: '',
  medicalDeptCode: '',
};
export default {
  name: 'booked',
  mixins: [patientModel],
  // props: ['type'],
  data() {
    var validateId = (rule, value, callback) => {
      if (!this.$utils.getInfoByIdCard(value)) {
        callback(new Error('无效身份证号'));
      } else {
        callback();
      }
    };
    var validatePhone = (rule, value, callback) => {
      if (!value) {
        callback();
      }
      if (!(/^1[3456789]\d{9}$/.test(value) || /0\d{2}\d{7,8}/.test(value))) {
        callback(new Error('无效手机号'));
      } else {
        callback();
      }
    };
    return {
      opeShow: false,
      pdsubmit: false,
      hospitalId: null,
      userId: '',
      sexList: [],
      maritalList: [], //婚姻状况列表
      clanList: [], //民族
      educationList: [], //文化程度
      wardList: [], //病区列表
      patientTypeCode: this.$route.query.type,
      deptList: [], //就诊科室列表
      patientTypeList: [],
      rules: {
        patientName: [{ required: true, message: '请输入患者姓名', trigger: 'blur' }],
        contactName: [{ required: true, message: '请输入联系人姓名', trigger: 'blur' }],
        patientId: [{ required: true, message: '请输入病案号', trigger: 'blur' }],
        idNo: [
          { required: true, message: '请输入身份证号', trigger: 'blur' },
          { validator: validateId, trigger: 'blur' },
        ],
        // dateOfBirth: [
        //   { required: true, message: '请输入出生日期', trigger: 'blur' }
        // ],
        // sex: [
        //   { required: true, message: '请选择性别', trigger: 'blur' }
        // ],
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' },
        ],
        contactPhone: [
          { required: true, message: '请输入联系人手机号', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' },
        ],
        admissionDatetime: [{ required: true, message: '请选择住院时间', trigger: 'blur' }],
        admissionWardCode: [{ required: true, message: '请选择入院病区', trigger: 'change' }],
        inpNo: [{ required: true, message: '请选择住院号/门诊号', trigger: 'change' }],
        bedNo: [{ required: true, message: '请输入床号', trigger: 'blur' }],
        presentHistory: [{ required: true, message: '请输入入院诊断', trigger: 'blur' }],
        dischargeDatetime: [{ required: true, message: '请选择出院时间', trigger: 'change' }],
        dischargeWardCode: [{ required: true, message: '请选择出院病区', trigger: 'change' }],
        dischargeDiagnosis: [{ required: true, message: '请输入出院诊断', trigger: 'blur' }],
        medicalDate: [{ required: true, message: '请选择日期', trigger: 'change' }],
        medicalDept: [{ required: true, message: '请输入科室', trigger: 'change' }],
        clinicalDiagnosis: [{ required: true, message: '请输入诊断', trigger: 'blur' }],
        operationNo: [{ required: true, message: '请输入手术记录编号', trigger: 'blur' }],
        deptName: [{ required: true, message: '请选择科室名称', trigger: 'change' }],
        // ward: [{ required: true, message: '请选择病区', trigger: 'change' }],
        startDatetime: [{ required: true, message: '请选择手术开始时间', trigger: 'change' }],
        endDatetime: [{ required: true, message: '请选择手术结束时间', trigger: 'change' }],
        surgeon: [{ required: true, message: '请输入主刀医生', trigger: 'blur' }],
        anesthesiaMethod: [{ required: true, message: '请输入麻醉方式', trigger: 'blur' }],
        anesthesiaDoctor: [{ required: true, message: '请输入麻醉医生', trigger: 'blur' }],
        preoperativeDiagnosis: [{ required: true, message: '请输入术前诊断', trigger: 'blur' }],
        postoperativeDiagnosis: [{ required: true, message: '请输入术后诊断', trigger: 'blur' }],
        operativeName: [{ required: true, message: '请输入手术名称', trigger: 'blur' }],
      },
      form: { ...form },
      patientType: null,
    };
  },
  // computed:{
  //   type () {
  //     return this.$route.query.type
  //   }
  // },
  created() {
    // switch (this.patientType) {
    //   case '4':
    //     this.rules.
    //     break;
    //   case '5':

    //     break;
    //   default:
    //     break;
    // }
    this.$apis.queryPatientTypeAll().then((res) => {
      this.patientTypeList = res.filter((x) => x.enabled);
    });
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id;
    this.$startLoading();
    let a = this.$apis.BaseDictGetDictItems({
      parentId: '201707131413454942d2',
    });
    let b = this.$apis.BaseDictGetDictItems({
      parentId: '20170715204542322572',
    });
    let c = this.$apis.BaseDictGetDictItems({
      parentId: '20170801134705422abb',
    });
    let d = this.$apis.BaseDictGetDictItems({
      parentId: '20170805142523175c4e',
    });
    let e = this.$apis.flupPlanqueryDischargeWard({
      hospitalId: this.hospitalId,
      type: 1,
    });
    // let f = this.$apis.systemManagequeryCurrentUserDept()
    //换成随访科室
    let f = this.$apis.departmentgetFlupDeptByHospitalId({
      hospitalId: this.hospitalId,
    });
    this.$http.all([a, b, c, d, e, f]).then(
      this.$http.spread((res1, res2, res3, res4, res5, res6) => {
        this.sexList = res1;
        this.maritalList = res2;
        this.clanList = res3;
        this.educationList = res4;
        this.wardList = res5;
        this.deptList = res6;
        this.$stopLoading();
      })
    );
  },
  methods: {
    // getDeptByHospitalId() {
    //   return this.$apis.getDeptByHospitalId().then((res)=>{
    //     this.deptList = res.rows
    //   })
    // },
    setOpeShow() {
      this.form = Object.assign({}, this.form, {
        operationNo: '', //手术记录编号
        deptId: '', //科室id
        deptName: '', //科室名称
        startDatetime: '', //手术开始时间
        endDatetime: '', //手术结束时间
        surgeon: '', //主刀医生
        firstAssistant: '', //手术I助
        secondAssistant: '', //手术II助
        anesthesiaMethod: '', //麻醉方式
        anesthesiaDoctor: '', //麻醉医生
        preoperativeDiagnosis: '', //术前诊断
        postoperativeDiagnosis: '', //术后诊断
        operativeName: '', //手术名称
      });
    },
    labelChangeEvent() {
      for (var i = 0; i < this.deptList.length; i++) {
        if (this.deptList[i].deptName == this.form.medicalDept) {
          this.form.medicalDeptCode = this.deptList[i].serialNo;
        }
      }
    },
    changePatientType() {
      this.form = { ...form };
      this.$refs.form.resetFields();
    },
    getInfo(v) {
      if (v) {
        let info = this.$utils.getInfoByIdCard(v);
        if (info) {
          this.form.dateOfBirth = info.birthday;
          this.form.sex = info.sex;
        } else {
          this.form.dateOfBirth = '';
          this.form.sex = '';
        }
      } else {
        this.form.dateOfBirth = '';
        this.form.sex = '';
      }
    },
    getBasicInfo() {
      if (this.form.idNo) {
        let info = this.$utils.getInfoByIdCard(this.form.idNo);
        if (info) {
          this.form.dateOfBirth = info.birthday;
          this.form.sex = info.sex;
        } else {
          this.form.dateOfBirth = '';
          this.form.sex = '';
        }
      } else {
        this.form.dateOfBirth = '';
        this.form.sex = '';
      }
      if (this.form.patientName || this.form.patientId || this.form.idNo) {
        this.$apis
          .bgetPatientInfoByUserId({
            patientName: this.form.patientName,
            patientId: this.form.patientId,
            idNo: this.form.idNo,
          })
          .then((res) => {
            if (!res) {
              this.$message({
                type: 'warning',
                message: '未找到相关信息',
              });
              return;
            }
            this.form.patientName = res.patientName;
            this.form.patientId = res.userId;
            this.form.idNo = res.idNo;
            this.form.dateOfBirth = res.dateOfBirth;
            this.form.sex = res.sex;
            this.form.phone = res.phone;
            this.form.clan = res.clan;
            this.form.educationLevel = res.educationLevel;
            this.form.maritalStatus = res.maritalStatus;
            this.form.contactName = res.contactName;
            this.form.contactPhone = res.contactPhone;
            this.form.remark = res.otherDatum;
            this.form.homeAddress = res.homeAddrHouseNumber;
            this.userId = res.userId;
            this.$refs.form.validateField(['patientName', 'patientId', 'idNo', 'dateOfBirth', 'sex', 'phone']);
          });
      } else {
        this.$message({
          type: 'warning',
          message: '请输入患者姓名、病案号',
        });
      }
    },
    getAdmissionInfo() {
      if (this.form.inpNo) {
        this.$apis
          .bgetEmrAdmissionRecord({
            patientId: this.form.patientId,
            inpNo: this.form.inpNo,
            hospitalId: this.hospitalId,
          })
          .then((res) => {
            if (!res) {
              this.$message({
                type: 'warning',
                message: '未找到相关信息',
              });
              return;
            }
            this.form.admissionDatetime = res.admissionDatetime;
            this.form.admissionWardCode = res.admissionWardCode;
            this.form.bedNo = res.bedNo;
            this.form.physicianName = res.physicianName;
            this.form.chiefComplaints = res.chiefComplaints;
            this.form.presentHistory = res.presentHistory;
            this.$refs.form.validateField(['inpNo', 'admissionDatetime', 'admissionWardCode', 'bedNo', 'presentHistory']);
          });
      } else {
        this.$message({
          type: 'warning',
          message: '请输入住院号',
        });
      }
    },
    onSubmit() {
      this.pdsubmit = true;
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.patientTypeCode == this.patientModel.admission && this.opeShow) {
            if (this.form.startDatetime && this.form.endDatetime) {
              if (this.form.endDatetime < this.form.startDatetime) {
                this.$message({
                  type: 'warning',
                  message: '手术结束时间不可先于手术开始时间!',
                });
                this.pdsubmit = false;
                return;
              }
            }
            let body = { ...this.form };
            body.deptId = ''; //科室ID
            body.ward = ''; //病区名称
            let obj1 = this.wardList.find((item) => {
              return item.dischargeWardCode === this.form.deptName;
            });
            if (obj1) {
              body.deptId = obj1.dischargeWardCode;
              body.ward = obj1.dischargeWard;
              body.deptName = obj1.dischargeWard;
            }
            body.userId = this.userId == '' ? '' : this.userId;
            body.patientTypeCode = this.patientTypeCode;
            this.$apis
              .PatientaddRegistInfo({
                ...body,
                hospitalId: this.hospitalId,
                patientTypeCode: this.patientTypeCode,
              })
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '提交成功',
                });
                setTimeout(() => {
                  window.history.go(0);
                }, 1000);
              });
          } else {
            if (this.form.dischargeDatetime && this.form.admissionDatetime) {
              if (this.form.dischargeDatetime < this.form.admissionDatetime) {
                this.$message({
                  type: 'warning',
                  message: '出院时间不可先于入院时间!',
                });
                this.pdsubmit = false;
                return;
              }
            }
            let body = { ...this.form };
            body.admissionWard = '';
            body.dischargeWard = '';
            let obj1 = this.wardList.find((item) => {
              return item.dischargeWardCode === this.form.admissionWardCode;
            });
            if (obj1) {
              body.admissionWard = obj1.dischargeWard;
            }
            let obj2 = this.wardList.find((item) => {
              return item.dischargeWardCode === this.form.dischargeWardCode;
            });
            if (obj2) {
              body.dischargeWard = obj2.dischargeWard;
            }
            // body.regist_type = "emr_discharge_record"
            // body.regist_type = this.patientType
            if (this.patientTypeCode === this.patientModel.admission) {
              body = { ...this.form };
              body.admissionWard = '';
              let obj = this.wardList.find((item) => {
                return item.dischargeWardCode === this.form.admissionWardCode;
              });
              if (obj) {
                body.admissionWard = obj.dischargeWard;
              }
              // body.regist_type = "emr_admission_record"
              delete body.dischargeDatetime;
              delete body.dischargeWardCode;
              delete body.pathologyNo;
              delete body.dischargeSituation;
              delete body.dischargeDoctorOrder;
            }
            body.patientTypeCode = this.patientTypeCode;

            this.$apis
              .PatientaddRegistInfo({
                ...body,
                hospitalId: this.hospitalId,
                patientTypeCode: this.patientTypeCode,
              })
              .then(() => {
                this.$message({
                  type: 'success',
                  message: '提交成功',
                });
                setTimeout(() => {
                  window.history.go(0);
                }, 1000);
                // window.parent.postMessage('refresh-data')
                // window.parent.postMessage(
                //   JSON.stringify({
                //     method: 'closeTab',
                //   }),
                //   '*'
                // )
                // this.$emit('confirm')
              });
          }
        } else {
          this.pdsubmit = false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.title {
  font-size: 20px;
  line-height: 50px;
  font-weight: bold;
  border-bottom: 1px solid #cccccc;
  margin-bottom: 20px;
}
</style>
