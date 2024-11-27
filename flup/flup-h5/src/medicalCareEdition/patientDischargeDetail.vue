<template>
  <div class="medicalcarebox18">
    <div class="bluebackground">
      <div class="businesscard">
        <div class="businessTitle">
          <h3>{{ discharge.patientName }}</h3>
          <span>{{ discharge.age }}</span>
          <span>{{ discharge.sex }}</span>
          <span>{{ discharge.phone }}</span>
        </div>
        <div class="businessBasic">
          <div class="reportConent">
            <p>出生日期</p>
            <p>{{ discharge.dateOfBirth }}</p>
          </div>
          <div class="reportConent">
            <p>入院病区</p>
            <p>{{ discharge.admissionWard }}</p>
          </div>
          <div v-if="flexiblex" class="reportConent">
            <p>入院时间</p>
            <p>{{ discharge.admissionDatetime }}</p>
          </div>
          <div v-if="flexiblex" class="reportConent">
            <p>出院时间</p>
            <p>{{ discharge.dischargeDatetime }}</p>
          </div>
          <p style="text-align: center" @click="flexiblex = !flexiblex">
            <van-icon
              v-if="flexiblex"
              style="ta"
              name="arrow-down"
              color="#0880E3"
              size="16"
            />
            <van-icon
              v-else
              style="ta"
              name="arrow-up"
              color="#0880E3"
              size="16"
            />
          </p>
        </div>
        <div class="businessBody">
          <div class="basicTile">
            <p>出院带药</p>
          </div>
          <div
            class="businessName"
            v-for="item in discharge.medicationList"
            :key="item.serialNo"
          >
            <div class="c1">
              <span>{{ item.drugName }}</span>
              <span>{{ item.drugSpecQuantity }}</span>
            </div>
            <div style="display: flex; margin-bottom: 6px">
              <p>用法用量: {{ item.dosage }}</p>
            </div>
            <div style="display: flex; margin-bottom: 6px">
              <p>用药备注: {{ item.memo }}</p>
            </div>
          </div>
        </div>
        <div class="businessBody">
          <div class="basicTile">
            <p>随访指导</p>
          </div>
          <div class="contentBody">
            <p>{{ discharge.surgicalSiteMonitoring }}</p>
          </div>
        </div>
        <div class="businessBody">
          <div class="basicTile">
            <p>复诊时间</p>
          </div>
          <div
            class="businessName"
            v-for="item in discharge.followupList"
            :key="item.serialNo"
          >
            <div style="display: flex; margin: 6px 0">
              <p>时间地点: {{ item.followupTime }} |{{ item.followupPlace }}</p>
            </div>
            <div style="display: flex; margin-bottom: 6px">
              <p>复诊目的: {{ item.followupPerpose }}</p>
            </div>
          </div>
        </div>
        <div class="businessBody">
          <div class="basicTile">
            <p>出院医嘱</p>
          </div>
          <div class="contentBody">
            <p>{{ discharge.dischargeDoctorOrder }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      discharge: {
        phone: "",
        medicationList: [],
        followupList: [],
      },
      flexiblex: false,
    };
  },
  created() {
    let serialNo = this.$route.query.serialNo;

    this.$apis
      .getEmrDischargeRecordDetail({ serialNo: serialNo })
      .then((res) => {
        this.discharge = res.retData;
        if (this.discharge) {
          this.discharge.age = this.$utils.getAgeBybirthday(
            this.discharge.dateOfBirth
          );
          this.discharge.phone = this.$route.query.phone;
        }
      });
  },

  methods: {
    formatDate(value) {
      // 过滤输入的数字
      return this.$utils.formatDate();
    },
    formatNull(value) {
      return value == "null" ? "" : value;
    },
  },
};
</script>
<style lang="scss">
.medicalcarebox18 {
  h3 {
    margin-block-start: 0;
    margin-block-end: 0px;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
    font-weight: 600;
    color: #111;
  }
  .bluebackground {
    width: 100%;
    min-height: 140px;
    background-color: #1c97fc;
    position: relative;
    top: 0;
    left: 0;
    border-radius: 0 0 16px 16px;
    .businesscard {
      background-color: #f3faff;
      width: 92.5%;
      min-height: 148px;
      padding: 0% 0% 1%;
      border-radius: 8px 8px 0 0;
      position: absolute;
      z-index: 999;
      top: 20%;
      left: 3.7%;
      // background-color: #fff;
      border-bottom: 3px solid rgba($color: #333, $alpha: 0.05);
      margin-bottom: 10px;

      .businessTitle {
        padding: 12px 14px;
        border-radius: 8px 8px 0 0;
        height: 46px;
        background-color: #f3faff;
        display: flex;
        align-items: center;
        h3 {
          margin-right: 3.2%;
        }
        span {
          margin-right: 2.1%;
        }
      }
      .businessBasic {
        padding: 14px;
        margin-bottom: 8px;
        background: #fff;
        border-radius: 0 0 8px 8px;
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
            font-size: 15px;
            color: #111111;
            letter-spacing: 0.2px;
            text-align: right;
            width: 242vw;
          }
          :first-child {
            width: 82vw;
            font-size: 15px;
            color: #666666;
            letter-spacing: 0.2px;
          }
          .hideP {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
      .businessBody {
        background-color: #fff;
        margin-bottom: 8px;
        padding-bottom: 11px;
        .basicTile {
          background: #ffffff;
          height: 45px;
          border-bottom: 1px solid #e2e2e2;
          p {
            font-weight: 600;
            padding: 11px 0 10px 0;
            font-size: 17px;
            color: #111111;
            letter-spacing: 0.2px;
          }
        }
        .businessName {
          opacity: 0.8;
          border-bottom: 1px dashed #e2e2e2;
          .c1 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 6px;
            span {
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              padding: 12px 14px 0 0;
              font-weight: 300;
              font-size: 15px;
              color: #111111;
              letter-spacing: 0.2px;
            }
          }
        }
        .businessName:last-child {
          border-bottom: 0;
        }
        .contentBody {
          height: 124px;
          p {
            padding-top: 12px;
            font-size: 16px;
            color: #111111;
            letter-spacing: 0.2px;
            line-height: 24px;
          }
        }
      }
    }
  }
}
</style>