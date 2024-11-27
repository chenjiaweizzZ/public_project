//检查检验
<template>
  <div class="medicalcarebox17">
    <van-notice-bar
      wrapable
      :scrollable="false"
      :text="basicInformation.patientName + ' ' + basicInformation.age+' 岁 '  + basicInformation.sex +' '+ basicInformation.phone"
    />
    <div class="basicInformation">
      <div>
        <h3>
          {{basicInformation.flupPlan}}
          <span>{{basicInformation.fuWay==0?'全院随访':basicInformation.fuWay==1?'专科随访':'慢病随访'}}</span>
        </h3>
        <p>{{basicInformation.status}}</p>
      </div>
      <!-- <p>
        随访内容
        <span
          v-for="(item, index) in list"
          :key="index"
        >{{ flupType == '定期检查'? item[4] :item[0]}}</span>
      </p>-->
      <p>
        随访类型
        <span>{{basicInformation.flupType}}</span>
      </p>
      <p>
        执行时间
        <span>{{basicInformation.flupStartTime}}</span>
      </p>
      <p>
        完成时间
        <span>{{basicInformation.flupTimeReal}}</span>
      </p>
    </div>
    <div v-if="flupType == '定期检查'" class="listbox">
      <p>
        <span>检查分类</span>
        <span v-for="(item, index) in list" :key="index">{{item[0]}}</span>
      </p>
      <p>
        <span>检查部位</span>
        <span v-for="(item, index) in list" :key="index">{{item[2]}}</span>
      </p>
      <p>
        <span>检查项目</span>
        <span v-for="(item, index) in list" :key="index">{{item[4]}}</span>
      </p>
    </div>
    <div v-else-if="flupType == '定期检验'" class="listbox">
      <p>
        <span>检查名称</span>
        <span v-for="(item, index) in list" :key="index">{{item[0]}}</span>
      </p>
      <p>
        <span>样本类型</span>
        <span v-for="(item, index) in list" :key="index">{{item[2]}}</span>
      </p>
    </div>
    <div v-else-if="flupType == '消息提醒'">
      <template v-for="(item,index) in list.flat()">
        <p :key="index">{{item}}</p>
      </template>
    </div>
    <div v-else-if="flupType == '定期复诊'">
      <template v-for="(item,index) in list.flat()">
        <p :key="index">{{item}}</p>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      serialNo: this.$route.query.serialNo,
      flupType: this.$route.query.flupType,
      basicInformation: {},
      list: [],
    }
  },
  watch: {},
  mounted() {
    this.$apis.getPatientPlanDetail({ serialNo: this.serialNo }).then((res) => {
      this.basicInformation = res.retData
      this.list = res.retData.flupContent.split(',')
      for (let i in this.list) {
        this.list[i] = this.list[i].split('|')
      }
    })
  },
  methods: {},
}
</script>

<style lang="scss" >
.medicalcarebox17 {
  height: 100%;
  .van-notice-bar--wrapable .van-notice-bar__content {
    margin: 0 auto;
  }

  .basicInformation {
    width: 100%;
    // height: 135px;
    padding: 3.7%;
    background: #1c97fc;
    > div {
      display: flex;
      align-items: center;
      justify-content: space-between;
      h3 {
        margin-block-start: 0px;
        margin-block-end: 5px;
        margin-inline-start: 0px;
        margin-inline-end: 20px;
        font-size: 16px;
        color: #ffffff;
        letter-spacing: 0.2px;
        span {
          display: inline-block;
          font-size: 10px;
          color: #ffffff;
          letter-spacing: 0.13px;
          padding: 0 5px;
          border: 0.5px solid #fff;
          border-radius: 10px;
        }
      }
      p {
        font-size: 15px;
        color: #ffffff;
        letter-spacing: 0.2px;
      }
    }
    > p {
      span {
        margin-left: 20px;
      }
      line-height: 28px;
      font-size: 14px;
      color: #ffffff;
      letter-spacing: 0.19px;
      opacity: 0.9;
    }
  }
  .listbox {
    width: 100%;
    padding: 3.7%;
    font-size: 15px;
    line-height: 30px;
    color: #111;
    span {
      margin-right: 10px;
    }
    span:first-child {
      width: 100px;
      display: inline-block;
      color: #999;
      margin-right: 0;
    }
  }
}
</style>