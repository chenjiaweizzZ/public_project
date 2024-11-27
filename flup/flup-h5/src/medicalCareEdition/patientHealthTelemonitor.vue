<template>
  <div class="medicalcarebox19">
    <van-notice-bar
      wrapable
      :scrollable="false"
      :text="
        patientInfo.patientName +
        ' ' +
        patientInfo.age +
        ' 岁 ' +
        patientInfo.sex +
        ' ' +
        patientInfo.phone
      "
    />
    <van-tabs>
      <van-tab title="基本信息">
        <div class="checkList1">
          <div class="reportList">
            <div class="clinicBody">
              <div class="reportConent">
                <p>姓名</p>
                <p>{{ patientInfo.patientName }}</p>
              </div>
              <div class="reportConent">
                <p>身份证号</p>
                <p>{{ patientInfo.idNo }}</p>
              </div>
              <div class="reportConent">
                <p>性别</p>
                <p>{{ patientInfo.sex }}</p>
              </div>
              <div class="reportConent">
                <p>年龄</p>
                <p>{{ patientInfo.age }}</p>
              </div>
              <div class="reportConent">
                <p>出生日期</p>
                <p>{{ patientInfo.dateOfBirth }}</p>
              </div>
              <div class="reportConent">
                <p>国籍</p>
                <p>{{ patientInfo.nationality }}</p>
              </div>
              <div class="reportConent">
                <p>民族</p>
                <p>{{ patientInfo.clan }}</p>
              </div>
              <div class="reportConent">
                <p>婚姻</p>
                <p>{{ patientInfo.maritalStatus }}</p>
              </div>
              <div class="reportConent">
                <p>家庭住址</p>
                <p>{{ patientInfo.homeAddrHouseNumber }}</p>
              </div>
            </div>
          </div>
          <div class="reportList">
            <div class="clinicBody">
              <div class="reportConent">
                <p>既往史</p>
                <p>{{ patientInfo.pastHistory }}</p>
              </div>
              <div class="reportConent">
                <p>婚育史</p>
                <p>{{ patientInfo.marriageChildbirthHistory }}</p>
              </div>
              <div class="reportConent">
                <p>过敏史</p>
                <p>{{ patientInfo.allergyHistory }}</p>
              </div>
              <div class="reportConent">
                <p>家族史</p>
                <p>{{ patientInfo.familyHistory }}</p>
              </div>
            </div>
          </div>
          <div class="basicMain">
            <div class="reportTitle">上传报告记录</div>
            <div v-for="(item, index) in reportList" :key="index" class="reportLi">
              <div class="checkTitle">
                {{ item.reportTypeEnum }}
                <span>{{ item.createTime.slice(0, 10) }}</span>
              </div>
              <div class="checkList">
                <img
                  v-show="jitem"
                  v-for="(jitem, jindex) in item.fileIds"
                  :key="jindex"
                  :src="$baseURL.ICDMApiUrl + `/file/thumbnail/` + jitem"
                />
              </div>
            </div>
            <div class="tip">
              <p class="tipTitle">温馨提示</p>
              <span>只展示最近半年的数据</span>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="出院记录">
        <div class="checkList1">
          <div
            class="reportList"
            v-for="(item, index) in dischargeList"
            :key="index"
            @click="goToUrl('discharge', item.serialNo)"
          >
            <div class="dischargeTitle">
              <div class="titleLeft">
                <p>
                  <span>{{ item.dischargeWard }}</span>
                  {{ item.dischargeDept }}
                </p>
              </div>
              <van-icon name="arrow" color="#999" size="18" />
            </div>
            <div class="clinicBody">
              <div class="reportConent">
                <p>入院时间</p>
                <p>{{ item.admissionDatetime }}</p>
              </div>
              <div class="reportConent">
                <p>出院时间</p>
                <p>{{ item.dischargeDatetime }}</p>
              </div>
              <div class="reportConent">
                <p>住院天数</p>
                <p>{{ item.admissionDays }}</p>
              </div>
              <div class="reportConent">
                <p>住院诊断</p>
                <p>{{ item.dischargeDiagnosis }}</p>
              </div>
              <div class="reportConent">
                <p>主诊医生</p>
                <p>{{ item.chiefPhysician }}</p>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="检查记录">
        <div class="noData" v-if="!inspectList.length"></div>
        <div class="checkList1">
          <div class="reportList" v-for="item in inspectList" :key="item.serialNo">
            <div class="reportTitle" @click="goToUrl('exam', item.serialNo)">
              <p>{{ item.examModality }}</p>
              <van-icon name="arrow" color="#999" size="18" />
            </div>
            <div class="clinicBody">
              <div class="reportConent">
                <p>审核时间</p>
                <p>{{ item.examDatetime }}</p>
              </div>
              <div class="reportConent">
                <p>审核医生</p>
                <p>{{ item.examPhysician }}</p>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="检验记录">
        <div class="noData" v-if="!examineList.length"></div>
        <div class="checkList1">
          <div class="reportList" v-for="item in examineList" :key="item.serialNo">
            <div class="reportTitle" @click="goToUrl('lab', item.labSn)">
              <p>{{ item.testName }}</p>
              <van-icon name="arrow" color="#999" size="18" />
            </div>
            <div class="clinicBody">
              <div class="reportConent">
                <p>审核时间</p>
                <p>{{ item.applyingDatetime }}</p>
              </div>
              <div class="reportConent">
                <p>审核医生</p>
                <p>{{ item.testPhysician }}</p>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
      <van-tab title="门诊记录">
        <div class="noData" v-if="!clinicList.length"></div>
        <div class="checkList1">
          <div class="reportList" v-for="item in clinicList" :key="item.serialNo">
            <div class="clinicBody">
              <div class="reportConent">
                <p>就诊时间</p>
                <p>{{ item.medicalDate }}</p>
              </div>
              <div class="reportConent">
                <p>临床诊断</p>
                <p>{{ item.clinicalDiagnosis }}</p>
              </div>
              <div class="reportConent">
                <p>就诊医生</p>
                <p>{{ item.medicalDoctor }}</p>
              </div>
            </div>
          </div>
        </div>
      </van-tab>
    </van-tabs>
  </div>
</template>
<script>
import { format } from 'url'
export default {
  data() {
    return {
      patientInfo: {
        patientName: '',
        idNo: '',
        sex: '',
        age: '',
        dateOfBirth: '',
        nationality: '',
        clan: '',
        maritalStatus: '',
        homeAddrHouseNumber: '',
      },
      emAdmissionSimpleRecord: {
        familyHistory: '',
        inpNo: '',
        obstetricalHistory: '',
        pastHistory: '',
        patientId: '',
        personalHistory: '',
        presentHistory: '',
      },
      reportList: [],
      dischargeList: [],
      inspectList: [],
      examineList: [],
      clinicList: [],
      flexiblex: false,
      isShow: [],
    }
  },
  created() {
    let userId = this.$route.query.userId
    let hospitalId = sessionStorage.getItem('hospitalId')
    this.$apis.getEmrPatientBaseInfo({ userId }).then((res) => {
      this.patientInfo = res.retData
      if (res.retData.emAdmissionSimpleRecord) {
        this.emAdmissionSimpleRecord = res.retData.emAdmissionSimpleRecord
      }
      let info = this.$utils.getInfoByIdCard(this.patientInfo.idNo)
      this.patientInfo.age = info.age
      this.patientInfo.dateOfBirth = info.birthday
    })

    this.$apis
      .patientReportQuery({
        patientId: userId,
        hospitalId: sessionStorage.getItem('hospitalId'),
      })
      .then((res) => {
        this.reportList = res.retData
      })

    this.$apis.getEmrDischargeRecordList({ userId }).then((res) => {
      this.dischargeList = res.retData
      // this.recordPdfUrl = res
    })
    this.$apis.getEmrExamReportList({ userId }).then((res) => {
      this.inspectList = res.retData
    })
    this.$apis.getEmrEmrLabReportList({ userId }).then((res) => {
      this.examineList = res.retData
    })
    this.$apis.getClinicReportListExt({ userId }).then((res) => {
      this.clinicList = res.retData
    })
  },
  methods: {
    formatDate(value) {
      // 过滤输入的数字
      return this.$utils.formatDate()
    },
    formatNull(value) {
      return value == 'null' ? '' : value
    },
    goToUrl(type, val) {
      switch (type) {
        case 'discharge':
          this.$router.push({
            path: '/Doctor-patientDischargeDetail',
            query: {
              serialNo: val,
              phone: this.patientInfo.phone,
            },
          })
          break
        case 'exam':
          this.$router.push({
            path: '/Doctor-emrExamDetail',
            query: {
              userId: this.$route.query.userId,
              examId: val,
            },
          })
          break
        case 'lab':
          this.$router.push({
            path: '/Doctor-emrLabDetail',
            query: {
              userId: this.$route.query.userId,
              labSn: val,
            },
          })
          break
      }
    },
    changeShow(index) {
      this.$set(this.isShow, index, !this.isShow[index])
    },
  },
}
</script>


<style lang="scss" >
.medicalcarebox19 {
  font-weight: 500;
  .van-notice-bar--wrapable .van-notice-bar__content {
    margin: 0 auto;
  }
  .van-tabs__line {
    background-color: #1c97fc;
  }
  .van-tab--active {
    color: #1c97fc;
  }
  .van-cell {
    padding: 1px 1px;
  }
  .noData {
    padding: 50%;
    height: 80%;
    background: url('../assets/images/noData.png') no-repeat center 40%;
    background-size: 42%;
  }
  .basicMain {
    background-color: #fff;
    padding: 18px 14px 8px 14px;
    border-bottom: 1px solid #e2e2e2;
    margin-bottom: 8px;
    .reportTitle {
      font-size: 15px;
      color: #333333;
      letter-spacing: 0.2px;
      padding-bottom: 11px;
      border-bottom: 1px solid #e2e2e2;
    }
    .checkTitle {
      padding: 0 3.75%;
      line-height: 44px;
      font-size: 15px;
      color: #333333;
      letter-spacing: 0.2px;
      background: #fff;
      border-bottom: 1px solid #e2e2e2;
      span {
        float: right;
        font-size: 14px;
        color: #999999;
      }
    }
    .checkList {
      margin-bottom: 8px;
      padding: 12px 3.75%;
      font-size: 0;
      background: #fff;
      img {
        width: 80px;
        height: 80px;
        margin-right: 10px;
        object-fit: cover;
      }
    }
    .tip {
      padding: 16px 3.75%;
      background: #fff9f5;
      font-size: 14px;
      color: #666666;
      letter-spacing: 0.2px;
      line-height: 21px;
      p {
        margin-bottom: 8px;
        font-size: 16px;
        color: #ff7b35;
        letter-spacing: 0.2px;
        line-height: 22px;
      }
    }
  }

  .checkList1 {
    background-color: #f6f6f6;
    .reportList {
      margin-bottom: 8px;
      .reportTitle {
        background-color: #fff;
        height: 50px;
        padding: 18px 14px 8px 14px;
        border-bottom: 1px solid #e2e2e2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        &:last-child {
          border: none;
        }
        p {
          font-family: PingFangSC-Medium;
          font-size: 17px;
          color: #111111;
          letter-spacing: 0.24px;
          margin-bottom: 2px;
          width: 100%;
          line-height: 22px;
          font-weight: bold;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .p1 {
          font-weight: normal;
          font-size: 16px;
          color: #4185f3;
          letter-spacing: 0.2px;
          text-align: right;
        }
      }
      .reportConent {
        margin-bottom: 8px;
        background-color: #fff;
        font-size: 16px;
        color: #999;
        letter-spacing: 0.2px;
        display: flex;
        align-items: top;
        justify-content: space-between;
        :last-child {
          font-size: 16px;
          color: #111111;
          letter-spacing: 0.2px;
          text-align: right;
          width: 242vw;
        }
        :first-child {
          width: 82vw;
        }
        .hideP {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .reportInfo {
        padding: 16px 3.75% 16px 14px;
        background-color: #ffffff;
      }
      .clinicBody {
        background-color: #ffffff;
        padding: 16px 14px;
        .content1 input {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        :last-child {
          margin-bottom: 0;
        }
        // .content2 textarea {
        //   overflow: hidden;
        // }
      }
      .dischargeTitle {
        background-color: #fff;
        height: 50px;
        padding: 18px 14px 8px 14px;
        border-bottom: 1px solid #e2e2e2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 22px;
        text-align: center;
        .titleLeft {
          display: flex;
          align-items: center;
          p {
            font-size: 14px;
            color: #333333;
            letter-spacing: 0.2px;
            span {
              font-size: 17px;
              color: #111111;
              letter-spacing: 0.24px;
              margin-right: 10px;
            }
          }
        }
      }
      .dischargeBody {
        background-color: #ffffff;
        padding: 16px 14px;
      }
    }
  }
  .clinicRepot {
    background-color: #fff;
    padding: 18px 14px;
    margin-bottom: 8px;
    border-bottom: 1px solid #e2e2e2;
  }
}
</style>
