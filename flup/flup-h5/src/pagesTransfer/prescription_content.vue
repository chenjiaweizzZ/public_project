<template>
  <div class="preDrug">
    <div style="background-color: #1c97fc; padding-bottom: 14px">
      <div class="title1">
        <p style="font-size: 20px">{{ obj.patientName }}</p>
        <span style="margin-left: 10px">{{ obj.sex }}/{{ obj.age }}</span>
      </div>
      <div class="title1">
        <p>
          <span>科室</span>
          {{ obj.deptName }}
        </p>
        <p style="margin-left: 60px">
          <span>病人ID</span>
          {{ obj.userId }}
        </p>
      </div>

      <div class="title1">
        <p><span>临床诊断</span> {{ obj.diagnosis }}</p>
      </div>
    </div>
    <div class="progress">
      <div
        style="
          background-color: #1c97fc;
          width: 3px;
          height: 16px;
          margin-left: 15px;
          margin-right: 10px;
        "
      ></div>
      <p style="font-weight: 600">当前发送进度 （{{ obj.sendProgress }}）</p>
    </div>
    <div
      style="
        background: #fafafa;
        border-bottom: 1px solid #e2e2e2;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 14px;
      "
    >
      <p style="font-size: 15px; color: #111111; letter-spacing: 0.2px">
        任务时间
      </p>
      <span
        style="
          font-size: 14px;
          color: #999999;
          letter-spacing: 0.2px;
          text-align: right;
        "
        >{{ obj.taskTime }}</span
      >
    </div>

    <div class="main">
      <div>
        <p>药物名称</p>
        <span>{{ obj.drugName }}</span>
      </div>
      <div>
        <p>药物剂量</p>
        <span>{{ obj.drugDose }}{{ obj.drugDoseUnit }}</span>
      </div>
      <div>
        <p>数量</p>
        <span>{{ obj.drugNum }}{{ obj.drugNumUnit }}</span>
      </div>
      <div>
        <p>天数(天)</p>
        <span>{{ obj.drugDays }}</span>
      </div>
      <div>
        <p>用法</p>
        <span>{{ obj.usageAndDosage }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      obj: {},
    };
  },
  created() {
    this.$apis
      .getPrescriptionDrugByPlanSerialNo({
        serialNo: this.$route.query.serialNo,
      })
      .then((res) => {
        this.obj = res.retData;
      });
  },
  methods: {},
};
</script>
<style lang="scss" scoped>
.preDrug {
  font-family: PingFangSC-Regular;
  background-color: #fff;
  .title {
    width: 100%;
    height: 48px;
    padding: 14px;
    background-color: #1c97fc;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #fff;
    font-size: 15px;
  }
  .title1 {
    width: 100%;
    height: 30px;
    padding: 14px 0px 0px 14px;
    // margin-top: 14px;
    background-color: #1c97fc;
    display: flex;
    align-items: center;
    color: #fff;
    font-size: 16px;
    span {
      opacity: 0.8;
      margin-right: 16px;
    }
  }
  .main {
    padding: 10px 14px;
    div {
      display: flex;
      padding-bottom: 8px;
      align-items: center;
      justify-content: space-between;
      p {
        font-size: 16px;
        color: #666666;
        letter-spacing: 0.2px;
      }
      span {
        font-size: 16px;
        color: #111111;
        letter-spacing: 0.2px;
        text-align: right;
      }
    }
  }
  .progress {
    height: 48px;
    display: flex;
    align-items: center;
    p {
      font-size: 17px;
      color: #111111;
      letter-spacing: 0.2px;
      line-height: 24px;
    }
  }
  .listbox {
    > div {
      padding: 12px 14px 11px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #e2e2e2;
      p {
        width: 30%;
        font-size: 15px;
        color: #666666;
      }
    }
    > p {
      padding: 12px 14px 11px;
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      span {
        width: 30%;
        display: inline-block;
        font-size: 16px;
        color: #333333;
      }
    }
  }
}
</style>
