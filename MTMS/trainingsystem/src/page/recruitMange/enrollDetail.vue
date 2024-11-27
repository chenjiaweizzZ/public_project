<template>
  <div class="detailK">
    <div class="pageTitle">
      <span>查看</span>
      <el-button @click="back()" size="small">返回</el-button>
    </div>
    <div class="seRow">
      <span class="seRowLeft">{{ stepInfo.title }}</span>
      <span class="seRowRight">招录时间：{{ stepInfo.startTime }} &nbsp; - &nbsp; {{ stepInfo.endTime }}</span>
    </div>
    <!-- 资料预审待审核 -->
    <!-- <h2>资料预审待审核</h2> -->

    <div class="tkaopt">
      <div class="thRow">
        <!-- <div class="thRowContent">
          <div v-for="(item,index) in lists">
            <div class="th-dahida">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" v-if="index < statusIndex && item.value"
              />
              <img src="../../assets/images/right-dis.png" style="width:16px;height:16px;margin-right: 6px;" v-else-if="index < statusIndex && !item.value"
              />
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" v-else/>
              <span :class="{'th-text-active': index< statusIndex, 'th-text':true}">{{item.text}}</span>
              <span class="arrowRight" v-if="index+1 != lists.length">
                <img src="../../assets/images/line6-active.png" style="width:11px;height:22px" v-if="index < statusIndex" />
                <img src="../../assets/images/line6.png" style="width:11px;height:22px" v-else />
              </span>
            </div>
          </div>
        </div> -->
        <div class="thRow" v-if="applyStatus == 1">
          <div class="thRowContent">
            <span class="th-dahida">
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text">资料预审</span>
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/line6.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text">现场审核</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/line6.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text">考试</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/line6.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text">录取</span>
            </span>
          </div>
        </div>
        <!-- 现场待审核 -->
        <!-- <h2>现场待审核</h2> -->
        <div class="thRow" v-if="applyStatus == 2">
          <div class="thRowContent">
            <span class="th-dahida">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">资料预审</span>
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/line6-active.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text">现场审核</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/line6.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text">考试</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/line6.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text">录取</span>
            </span>
          </div>
        </div>
        <!-- 资料预审不通过 -->
        <!-- <h2>资料预审不通过</h2> -->
        <div class="thRow" v-if="applyStatus == 3">
          <div class="thRowContent">
            <span class="th-dahida">
              <img src="../../assets/images/right-dis.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-dis">资料预审</span>
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/line6.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text">现场审核</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/line6.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text">考试</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/line6.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text">录取</span>
            </span>
          </div>
        </div>
        <!-- 现场审核不通过 -->
        <!-- <h2>现场审核不通过</h2> -->
        <div class="thRow" v-if="applyStatus == 4">
          <div class="thRowContent">
            <span class="th-dahida">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">资料预审</span>
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/line6-active.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/right-dis.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-dis">现场审核</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/line6.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text">考试</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/line6.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text">录取</span>
            </span>
          </div>
        </div>
        <!-- 待考试 -->
        <!-- <h2>待考试</h2> -->
        <div class="thRow" v-if="applyStatus == 5">
          <div class="thRowContent">
            <span class="th-dahida">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">资料预审</span>
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/line6-active.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">现场审核</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/line6-active.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">考试</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/line6.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text">录取</span>
            </span>
          </div>
        </div>
        <!-- 待录取 -->
        <!-- <h2>待录取</h2> -->
        <div class="thRow" v-if="applyStatus == 6">
          <div class="thRowContent">
            <span class="th-dahida">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">资料预审</span>
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/line6-active.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">现场审核</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/line6-active.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">考试</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/line6-active.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/right.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text">录取</span>
            </span>
          </div>
        </div>
        <!-- 录取通过 -->
        <!-- <h2>录取通过</h2> -->
        <div class="thRow" v-if="applyStatus == 7">
          <div class="thRowContent">
            <span class="th-dahida">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">资料预审</span>
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/line6-active.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">现场审核</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/line6-active.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">考试</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/line6-active.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">录取</span>
            </span>
          </div>
        </div>
        <!-- 录取不通过 -->
        <!-- <h2>录取不通过</h2> -->
        <div class="thRow" v-if="applyStatus == 8">
          <div class="thRowContent">
            <span class="th-dahida">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">资料预审</span>
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/line6-active.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">现场审核</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.sceneVerify == 1">
              <img src="../../assets/images/line6-active.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/right-active.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-active">考试</span>
            </span>
            <span class="th-dahida" v-if="stepInfo.entranceExam == 1">
              <img src="../../assets/images/line6-active.png" style="width:11px;height:22px" />
            </span>
            <span class="th-dahida">
              <img src="../../assets/images/right-dis.png" style="width:16px;height:16px;margin-right: 6px;" />
              <span class="th-text-dis">录取</span>
            </span>
          </div>
        </div>
      </div>
      <div class="hjdoad">
        <div class="hjdoad-title">审核记录</div>
        <div class="hjdoad-content">
          <span v-for="(item,index) in stepList" :key="index">
            <div class="hjdoad-content-first-line">
              <img src="../../assets/images/jfaojf.png" style="width:10px;height:10px;margin-right:6px" />
              <span class="step-time" v-if="item.recordTime">{{ item.recordTime }}</span>
              <span class="step-time" v-else>无</span>
              <span class="hjdoad-line" v-if="index != stepList.length - 1"></span>
            </div>
            <div class="hjdoad-content-second-line">
              <span class="step-status-dis" v-if="index == stepList.length - 1 && (stepInfo.applyStatus == 3 || stepInfo.applyStatus == 4 || stepInfo.applyStatus == 8)">{{
                item.statusTxt}}
              </span>
              <span v-else-if="index == stepList.length - 1 && stepInfo.applyStatus == 6">{{ item.statusTxt}}</span>
              <span class="step-status" v-else>{{ item.statusTxt}}</span>
            </div>
            <!-- <div v-if="index == stepList.length - 1 && stepInfo.showReapplyButton">
              <el-button type="primary" size="small" @click="addRecruit('add')">再次申请</el-button>
            </div> -->
          </span>
        </div>
      </div>
    </div>
    <div class="infRow">
      <!-- <span style="margin: 20px 0px">填报信息</span> -->
      <span class="infTitle">
        <span class="bluebox"></span>
        <span class="blueboxcontent">基础信息</span>
      </span>
      <div class="linejaf"></div>
      <div class="infon">
        <span class="infon-left">
          <el-form label-position="right" label-width="180px" :model="formLabelAlign">
            <el-form-item label="姓名">{{ userInfo.name ? userInfo.name : "无" }}</el-form-item>
            <el-form-item label="手机号">{{ userInfo.phone ? userInfo.phone : "无" }}</el-form-item>
            <el-form-item label="邮箱">{{ userInfo.email ? userInfo.email : "无" }}</el-form-item>
            <el-form-item label="性别">{{ userInfo.sexTxt ? userInfo.sexTxt : "无"}}</el-form-item>
            <el-form-item label="身份证号">{{ userInfo.idCard ? userInfo.idCard : "无"}}</el-form-item>
            <el-form-item label="出生年月">{{ userInfo.birthday? userInfo.birthday : "无" }}</el-form-item>
            <el-form-item label="国籍">{{ userInfo.nationalityTxt ? userInfo.nationalityTxt : "无"}}</el-form-item>
            <el-form-item label="民族">{{ userInfo.nationTxt ? userInfo.nationTxt : "无"}}</el-form-item>
            <el-form-item label="家庭住址">{{ userInfo.familyAddress? userInfo.familyAddress : "无" }}</el-form-item>
          </el-form>
        </span>
        <span class="infon-right">
          <span>头像</span>
          <img v-if="userInfo.photo" style="width: 120px;height: 120px;margin-left: 20px" :src="userInfo.photo" />
          <img v-else style="width: 120px;height: 120px;margin-left: 20px" src="../../assets/images/head.png" />
        </span>
      </div>
      <span class="infTitle">
        <span class="bluebox"></span>
        <span class="blueboxcontent">工作信息</span>
      </span>
      <div class="linejaf"></div>
      <div class="infon">
        <span class="infon-left">
          <el-form label-position="right" label-width="180px" :model="formLabelAlign">
            <el-form-item label="工作单位">{{ userInfo.workUnit ? userInfo.workUnit : "无"}}</el-form-item>
          </el-form>
        </span>
      </div>
      <span class="infTitle">
        <span class="bluebox"></span>
        <span class="blueboxcontent">教育信息</span>
      </span>
      <div class="linejaf"></div>
      <div class="infon">
        <span class="infon-left">
          <el-form label-position="right" label-width="180px" :model="formLabelAlign">
            <el-form-item label="最高学历">{{ userInfo.highestEducationTxt ? userInfo.highestEducationTxt : "无"}}</el-form-item>
            <el-form-item label="毕业院校">{{ userInfo.graduationSchool ? userInfo.graduationSchool : "无"}}</el-form-item>
            <el-form-item label="毕业年份">{{ userInfo.graduationYear ? userInfo.graduationYear : "无"}}</el-form-item>
            <el-form-item label="毕业专业">{{ userInfo.graduationMajor ? userInfo.graduationMajor : "无"}}</el-form-item>
            <el-form-item label="学位">{{ userInfo.degreeTxt ? userInfo.degreeTxt : "无"}}</el-form-item>
            <el-form-item label="学位类型">{{ userInfo.degreeTypeTxt ? userInfo.degreeTypeTxt : "无"}}</el-form-item>
          </el-form>
        </span>
      </div>
      <span class="infTitle">
        <span class="bluebox"></span>
        <span class="blueboxcontent">执业信息</span>
      </span>
      <div class="linejaf"></div>
      <div class="infon">
        <span class="infon-left">
          <el-form label-position="right" label-width="180px">
            <el-form-item label="执业资格证照片">
              <span v-if="userInfo.qualificationCertificateImg != null">
                <span v-for="(item,index) in userInfo.qualificationCertificateImg" :key="index">
                  <img style="width: 100px;height: 100px" :src="item.url" />
                </span>
              </span>
              <span v-else>
                无
              </span>
            </el-form-item>
            <el-form-item label="执业资格证号">{{ userInfo.qualificationCertificateNo ? userInfo.qualificationCertificateNo : "无"}}</el-form-item>
            <el-form-item label="执业资格证获取时间">{{ userInfo.qualificationCertificateObtainTime ? userInfo.qualificationCertificateObtainTime
              : "无"}}</el-form-item>
          </el-form>
        </span>
      </div>
    </div>
    <span class="line" v-if="isExam"></span>
    <el-form label-position="right" label-width="180px" :model="form" :rules="rules" ref="ruleForm" v-if="isExam">
      <el-form-item label="审核结果" prop="radio">
        <el-radio-group v-model="form.radio">
          <el-radio label="1">通过</el-radio>
          <el-radio label="0">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="理由:">
        <el-input type="textarea" v-model="form.reason" maxlength="250"></el-input>
      </el-form-item>
    </el-form>
    <div class="btnRow" v-if="isExam">
      <el-button @click="back()">取消</el-button>
      <el-button type="primary" @click="formConfirm()">提交</el-button>
    </div>
  </div>
</template>
<script>
  import { post, getCookie, getStorage, get } from "../../config/util";
  export default {
    methods: {
      initStatus() {
        if (this.stepInfo.sceneVerify != 1) {
          this.lists.splice(1, 1, false)
        }
        if (this.stepInfo.entranceExam != 1) {
          this.lists.splice(2, 1, false)
        }
        this.lists = this.lists.filter(item => { return item })
        this.statusIndex = 0;
        if (this.stepInfo.applyStatus == 1) {
          this.statusIndex = this.statusIndex
          let temp = this.stepInfo.applyStatus == 1 ? true : false
          this.lists[0].value = temp
          this.$set(this.lists, 0, this.lists[0])
        } else if (this.stepInfo.applyStatus == 3) {
          this.statusIndex = this.statusIndex + 1
          let temp = this.stepInfo.applyStatus == 1 ? true : false
          this.lists[0].value = temp
          this.$set(this.lists, 0, this.lists[0])
        } else if (this.stepInfo.applyStatus == 2 || this.stepInfo.applyStatus == 4) {
          this.statusIndex = this.stepInfo.sceneVerify == 1 ? 2 : 1
          let temp = this.stepInfo.applyStatus == 2 ? true : false
          this.lists[1].value = temp
          this.$set(this.lists, 1, this.lists[1])
        } else if (this.stepInfo.applyStatus == 5 || this.stepInfo.applyStatus == 6 || this.stepInfo.applyStatus == 8) {
          this.statusIndex = this.stepInfo.sceneVerify == 1 ? (this.stepInfo.entranceExam == 1 ? 3 : 2) : (this.stepInfo.entranceExam != 1 ? 2 : 3)
          let temp = this.stepInfo.applyStatus == 8 ? false : true
          this.lists[2].value = temp
          this.$set(this.lists, 2, this.lists[2])
        } else if (this.stepInfo.applyStatus == 7) {
          this.statusIndex = this.lists.length
        }
      },
      back() {
        this.$router.push({
          name: "recruitMange",
          query: {
            tanIndex: this.tanIndex
          }
        });
      },
      init() {
        this.id = this.$route.query.id;
        this.isExam = this.$route.query.isExam;
        this.tanIndex = this.$route.query.tanIndex;
        this.getList();
        if (this.tanIndex == 2) {
          this.applyType = "1";
        } else if (this.tanIndex == 3) {
          this.applyType = "2";
        }
      },
      addRecruit(type, row) {
        this.$router.push({
          name: "addRecruit",
          query: {
            type: type,
            id: row ? row.id : false
          }
        })
      },
      getList() {
        get(`/enrolltrain/enrollApply/applyStatus/${this.id}`, {}).then(res => {
          if (res && res.resCode == 200) {
            this.stepInfo = res.model;
            this.stepList = res.model.statusList;
            this.applyStatus = res.model.applyStatus;
            // this.initStatus()
          } else {
            this.$message({
              message: res.resMsg || "请求错误",
              type: "error"
            });
          }
        });
        post(`/enrolltrain/enrollApply/viewInformation/${this.id}`, {}).then(
          res => {
            if (res && res.resCode == 200) {
              this.userInfo = res.model;
            } else {
              this.$message({
                message: res.resMsg || "请求错误",
                type: "error"
              });
            }
          }
        );
      },
      formConfirm() {
        this.$refs["ruleForm"].validate(valid => {
          if (this.form.radio == "") {
            this.$message({
              message: "请选择审核结果",
              type: "warning"
            });
          }
          if (valid) {
            if (this.form.radio == "0") {
              if (this.form.reason == "") {
                this.$message({
                  message: "不通过请填写理由",
                  type: "warning"
                });
              } else {
                post(`/enrolltrain/enrollApply/updateStatus`, {
                  status: 3,
                  applyType: this.applyType,
                  reason: this.form.reason,
                  idList: [this.id]
                }).then(res => {
                  if (res.resCode == 200) {
                    this.$message({
                      message: '批量审核成功',
                      type: 'success'
                    });
                  } else {
                    this.$message.error(res.resMsg);
                  }
                  this.back();
                });
              }
            } else {
              post(`/enrolltrain/enrollApply/updateStatus`, {
                status: 2,
                applyType: this.applyType,
                reason: this.form.reason,
                idList: [this.id]
              }).then(res => {
                this.$message({
                  message: '审核通过',
                  type: 'success'
                });
                this.back();
              });
            }
          } else {
          }
        });
      }
    },
    created() {
      this.init();
    },
    data() {
      return {
        formLabelAlign: {},
        form: {
          radio: "",
          reason: ""
        },
        rules: {
          radio: [
            { required: true, message: "请选择审核结果", trigger: "change" }
          ]
        },
        applyStatus: 1,
        id: 0,
        applyType: "1",
        isExam: false,
        tanIndex: 2,
        resource: "",
        desc: "",
        active: 0,
        stepInfo: {},
        stepList: [],
        userInfo: [],
        // lists: ["资料预审", "现场审核", "考试", "录取"],
        lists: [
          { text: "资料预审", value: true },
          { text: "现场审核", value: true },
          { text: "考试", value: true },
          { text: "录取", value: true }
        ],
        statusIndex: 0,
      };
    }

  };
</script>
<style lang="scss" scoped>
  .pageTitle {
    font-size: 15px;
    margin-bottom: 20px;
  }

  .steps {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .circle-line-1 {
      height: 1px;
      width: 200px;
      background-color: #e6e6e6;
    }
    .circle-line-2 {
      height: 1px;
      width: 200px;
      background-color: #00982d;
    }
    .circle-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      .circle-content-1 {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background: #e6e6e6;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 22px;
        margin-top: 20px;
      }
      .circle-content-2 {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background: #00982d;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 22px;
        margin-top: 20px;
      }
      .circle-content-3 {
        height: 50px;
        width: 50px;
        border-radius: 50%;
        background: #ff0000;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 22px;
        margin-top: 20px;
      }
      .circle-txt-1 {
        color: #e6e6e6;
      }
      .circle-txt-2 {
        color: #111;
      }
    }
  }

  .infTitle {
    height: 30px;
    // background: #e6e6e6;
    width: 100%;
    display: flex;
    align-items: center;
    // margin-bottom: 11px;
  }

  .infon {
    display: flex;
    justify-content: space-between;
  }

  .infon-left-row {
    margin: 20px 0px 0px 0px;
  }

  .infon-right {
    display: flex;
    align-items: flex-start;
    margin: 20px 100px 0px 0px;
  }

  .line {
    width: 100%;
    height: 1px;
    background-color: #e6e6e6;
    margin: 10px 0px;
  }

  .btnRow {
    display: flex;
    justify-content: center;
  }

  .hjdoad-content-first-line {
    display: flex;
    align-items: center;
  }

  .step-circle {
    width: 15px;
    height: 15px;
    background-color: #e6e6e6;
    border-radius: 50%;
  }

  .step-line {
    height: 25px;
    width: 1px;
    background-color: #e6e6e6;
    margin-left: 7px;
  }

  // .step-time {
  //   margin-left: 10px;
  // }
  .step-status {
    margin-left: 10px;
    color: #00982d;
    font-size: 14px;
    margin-top: 6px;
  }

  .seRow {
    height: 58px;
    background: linear-gradient(93deg, #0072ee 0%, #1c97fc 100%);
    display: flex;
    align-items: center;
    .seRowLeft {
      font-size: 20px;
      font-weight: normal;
      line-height: 24px;
      letter-spacing: 0.25px;
      color: #ffffff;
      margin-right: 20px;
      margin-left: 20px;
    }
    .seRowRight {
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      letter-spacing: 0.17px;
      color: #ffffff;
    }
  }

  .step-status-dis {
    color: #ff5500;
  }

  .tkaopt {
    border: 1px solid #e8e8e8;
    margin: 10px;
  }

  .thRow {
    height: 66px;
    background-color: #e8f5ff;
    display: flex;
    justify-content: center;
    padding-left: 60px;
  }

  .thRowContent {
    display: flex;
    align-items: center;
  }

  .hjdoad {
    // height: 111px;
    background: #fafafa;
    // margin: 0px 15px;
    padding-bottom: 22px;
    padding: 14px 15px;
  }

  .hjdoad-line {
    width: 120px;
    height: 2px;
    opacity: 1;
    background: #e6e6e6;
    margin: 0px 15px;
  }

  .hjdoad-title {
    padding-bottom: 16px;
    font-size: 16px;
    line-height: 19px;
    letter-spacing: 0.2px;
    color: #333333;
    font-weight: bold;
  }

  .bluebox {
    width: 4px;
    height: 18px;
    opacity: 1;
    background: #0079fd;
    margin-right: 10px;
  }

  .blueboxcontent {
    font-size: 18px;
    font-weight: bold;
    line-height: 28px;
    letter-spacing: 0.13px;
    color: #111111;
  }

  .hjdoad-content {
    display: flex;
    margin: 0px 14px;
  }

  .linejaf {
    width: calc(100% - 10px);
    height: 2px;
    opacity: 1;
    background: #E1E1E1;
    margin: 10px 0px;
  }

  .demo2 {
    width: 40px;
    height: 40px;
    border-radius: 40px;
    background: white;
    display: block;
    position: relative;
  }

  .th-text {
    font-size: 16px;
    font-weight: normal;
    line-height: 21px;
    letter-spacing: 0.2px;
    color: #C0C4CC;
    margin-right: 60px;
    font-weight: bold;
  }

  .th-text-active {
    font-size: 16px;
    font-weight: bold;
    line-height: 21px;
    letter-spacing: 0.2px;
    color: #0079fd;
  }

  .th-text-dis {
    font-size: 16px;
    font-weight: normal;
    line-height: 21px;
    letter-spacing: 0.2px;
    color: #FF5500;
  }

  .text-active {
    font-size: 16px;
    font-weight: normal;
    line-height: 21px;
    letter-spacing: 0.2px;
    color: #c0c4cc;
  }

  .th-dahida {
    height: 26px;
    display: flex;
    align-items: center;
    margin-right: 60px;
  }

  .demo2:before,
  .demo2::after {
    content: "";
    height: 28px;
    width: 6px;
    border-radius: 10px;
    display: block;
    background: #0079fd;
    position: absolute;
    top: 6px;
    /*40-6=34*/
    left: 20px;
    /*make the two rects in the middle of the cycle */
    transform: rotate(45deg);
    -ms-transform: rotate(45deg);
  }

  .demo2::before {
    height: 15px;
    transform: rotate(-45deg);
    -ms-transform: rotate(-45deg);
    position: absolute;
    top: 18px;
    /*40-18=12  */
    left: 8px;
  }

  .arrowRight {
    img {
      width: 11px;
      height: 22px;
    }
  }
</style>
<style lang="scss">
  .detailK {
    padding: 20px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: 10;
    .el-step__line-inner:after {
      width: 0% !important;
    }
  }
</style>