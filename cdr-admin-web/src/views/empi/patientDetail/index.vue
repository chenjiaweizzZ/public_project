<!--  -->
<template>
  <div class="patientDetail">
    <div class="timeInfo">
      <label>注册时间</label>
      <span>{{baseInfo.createDate}}</span>
    </div>
    <div class="baseInfo">
      <div class="title">
        <span class="borderBlue"></span>患者基本信息
      </div>
      <div class="infoTable">
        <div class="row background">
          <span class="part">
            <label>姓名</label>
            <span class="text">{{baseInfo.name}}</span>
          </span>
          <span class="part">
            <label>性别</label>
            <span class="text">{{baseInfo.sex}}</span>
          </span>
          <span class="part">
            <label>身份证号</label>
            <span class="text">{{baseInfo.idcardNo}}</span>
          </span>
        </div>
        <div class="row">
          <span class="part">
            <label>出生日期</label>
            <span class="text">{{baseInfo.birthDate}}</span>
          </span>
          <span class="part">
            <label>联系电话</label>
            <span class="text">{{baseInfo.phoneHome}}</span>
          </span>
          <span class="part">
            <label>血型</label>
            <span class="text">{{baseInfo.bloodType}}</span>
          </span>
        </div>
        <div class="row background">
          <span class="part">
            <label>国籍</label>
            <span class="text">{{baseInfo.country}}</span>
          </span>
          <span class="part">
            <label>籍贯</label>
            <span
              class="text"
            >{{baseInfo.originPlace}}{{baseInfo.originPlace1}}{{baseInfo.originPlace2}}</span>
          </span>
          <span class="part">
            <label>民族</label>
            <span class="text">{{baseInfo.nation}}</span>
          </span>
        </div>
        <div class="row">
          <span class="part">
            <label>学历</label>
            <span class="text">{{baseInfo.culturalLevel}}</span>
          </span>
          <span class="part">
            <label>职业</label>
            <span class="text">{{baseInfo.occupation}}</span>
          </span>
          <span class="part">
            <label>婚姻状况</label>
            <span class="text">{{baseInfo.maritalStatus}}</span>
          </span>
        </div>
        <div class="row background">
          <span class="part">
            <label>出生地省</label>
            <span class="text">{{baseInfo.birthPlace}}</span>
          </span>
          <span class="part">
            <label>出生地市</label>
            <span class="text">{{baseInfo.birthPlace1}}</span>
          </span>
          <span class="part">
            <label>出生地县</label>
            <span class="text">{{baseInfo.birthPlace2}}</span>
          </span>
        </div>
        <div class="row">
          <span class="part">
            <label>工作单位代码</label>
            <span class="text">{{baseInfo.unitId}}</span>
          </span>
          <span class="part">
            <label>工作单位名称</label>
            <span class="text">{{baseInfo.workUnit}}</span>
          </span>
          <span class="part">
            <label>工作单位电话</label>
            <span class="text">{{baseInfo.phoneBusiness}}</span>
          </span>
        </div>
        <div class="row background">
          <span class="part">
            <label>联系人关系</label>
            <span class="text">{{baseInfo.relationship}}</span>
          </span>
          <span class="part">
            <label>联系人姓名</label>
            <span class="text">{{baseInfo.nextKin}}</span>
          </span>
          <span class="part">
            <label>联系人电话</label>
            <span class="text">{{baseInfo.nextKinPhone}}</span>
          </span>
        </div>
        <div class="row background">
          <label>户籍地址</label>
          <span class="text">{{baseInfo.householdAddress}}</span>
        </div>
        <div class="row">
          <label>现住址</label>
          <span class="text">{{baseInfo.currAddress}}</span>
        </div>
        <div class="row background">
          <label>单位地址</label>
          <span class="text">{{baseInfo.workAddress}}</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { patientInformationById } from "@/service/empi";
export default {
  name: "patientDetail",
  components: {},
  data() {
    return {
      id: "",
      baseInfo: {}
    };
  },
  created() {
    // this.id = this.$route.query.id;
    this.getData(this.$route.query.id);
  },
  watch: {
    "$route.query"() {
      if (this.$route.query.id) {
        this.loading = true;
        this.getData(this.$route.query.id);
      }
    }
  },
  methods: {
    getData(id) {
      // debugger;
      patientInformationById({
        id: id
      }).then(res => {
        this.baseInfo = res;
      });
    }
  }
};
</script>
<style lang='scss' scoped>
.patientDetail {
  background: #fff;
  margin: 10px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  position: absolute;
  top: 30px;
  bottom: 0;
  right: 0px;
  left: 0;
  .timeInfo {
    margin-bottom: 10px;
    color: #111111;
    font-weight: 400;
    font-size: 14px;
    line-height: 22px;
    label {
      color: #3b5370;
      margin-right: 10px;
    }
    span {
      margin-right: 20px;
    }
  }
  .baseInfo {
    margin-top: 10px;
    .title {
      color: #111111;
      font-size: 18px;
      .borderBlue {
        width: 4px;
        background: #0075ff;
        height: 17px;
        display: inline-block;
        margin-right: 10px;
      }
    }
    .infoTable {
      border-left: 1px solid #e6e6e6;
      border-top: 1px solid #e6e6e6;
      margin-top: 10px;
      .row {
        display: flex;
        font-size: 14px;
        line-height: 22px;
        border-bottom: 1px solid #e6e6e6;
        .part {
          width: 100%;
          display: inline-block;
          label {
            font-weight: 700;
            width: 128px;
            display: inline-block;
            height: 100%;
            vertical-align: top;
          }
          .text {
            color: #111111;
            display: inline-block;
            width: calc(100% - 128px);
            height: 100%;
          }
        }
        label {
          padding: 3px 5px;
          font-weight: 700;
          color: #666666;
          width: 128px;
          display: inline-block;
          border-right: 1px solid #e6e6e6;
        }
        .text {
          padding: 3px 5px;
          color: #111111;
          display: inline-block;
          width: calc(100% - 128px);
          border-right: 1px solid #e6e6e6;
        }
      }
      .background {
        .text {
          background: #fbfbfb;
        }
      }
    }
  }
}
</style>