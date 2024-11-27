<template>
  <div class="rd-case-detail g-main">
    <div class="residentInfo">
      <p class="name">
        <span>{{ detail.stuName }}</span>
        <span class="stuNum">{{ detail.stuCode }}</span>
      </p>
      <p class="info">
        <span class="dept">{{ detail.turnDeptName }}</span>
        <span>{{ detail.createTime }}</span>
      </p>
    </div>
    <div class="recordDetail">
      <p class="recordTitle">{{ detail.name }}</p>
      <div class="imgBox">
        <img class="photo" :src="item" v-for="(item, index) in detail.fileList" :key="index" @click="viewPic(index)" />
      </div>
    </div>
    <div class="scoreInfo">
      <div class="tips">
        <p class="iconTitle"><img class="titleImg" src="../../../assets/images/100.png" />审核评分结果</p>
        <p class="noScore" v-if="detail.auditStatus == 0">待评分</p>
        <p class="score" v-else><span>{{ detail.score }}</span><span class="unit">分</span></p>
      </div>
      <div class="check-person">
        <span style="width: 80px;display:flex;justify-content: space-around;">
          <span>审</span>
          <span>核</span>
          <span>人：</span>
        </span>
        {{ detail.auditorName }}
      </div>
      <div class="check-time">
        <span style="width: 80px;display:flex;justify-content: space-around;">审核时间：</span>
        {{ detail.auditTime }}
      </div>
      <div class="scoreDetail" v-if="detail.auditStatus != 0" @click="checkDetail">评分详情</div>
    </div>


    <!-- <p> <span style="width: 94px;display:flex;justify-content: space-between;">
          <span>审</span>
          <span>核</span>
          <span>人：</span>
        </span>{{detail.auditorName || ""}}</p>
      <p><span class="spaceLetter">审核时间：</span>{{detail.auditTime || ""}}</p> -->

  <van-image-preview v-model="show" :images="detail.fileList" @change="onChange" :startPosition="index">
    <template v-slot:index>第{{ index + 1 }}张</template>
  </van-image-preview>
</div>
</template>

<script>
import { Toast, Dialog } from "vant";
import $ from "jquery";
import cHeader from "../../header";
import methods from "../../../methods";
import { mapState, mapActions } from "vuex";
import cProgress from "@/components/progress";
export default {
  components: {
    cHeader,
    cProgress
  },
  data() {
    return {
      detailId: "",
      detail: {}
    };
  },
  computed: {
    ...mapState(["turninfo"])
  },
  created() {
    this.detailId = this.$route.query.id
    this.getDetail()
  },
  mounted() { },
  methods: {
    ...methods,
    checkDetail() {
      this.$router.push({
        name: "fdRotation_medical_eva_detail",
        query: {
          id: this.detail.id,
        }
      });
    },
    getDetail() {
      this.get(`/base/largeMedicalRecord/detail/${this.detailId}`).done(res => {
        if (res && res.resCode == 200) {
          this.detail = res.model
        }
      })
    },
  }
};
</script>

<style scoped>
.rd-case-detail {
  background: linear-gradient(150deg, #628BB6 3%, #A2BCD8 82%) !important;
}

.residentInfo {
  padding: 15px 20px;
}

.residentInfo .name {
  font-size: 20px;
  line-height: 24px;
  color: #fff;
  letter-spacing: 0.24px;
  font-weight: bold;
}

.stuNum {
  margin-left: 8px;
  font-weight: bold;
}

.residentInfo .info {
  font-size: 13px;
  color: #fff;
  opacity: 0.7;
  margin-top: 8px;
  margin-bottom: 0;
  line-height: 22px;
}

.residentInfo .dept {
  position: relative;
  margin-right: 15px;
}

.residentInfo .dept::after {
  position: absolute;
  content: "";
  display: block;
  width: 1px;
  height: 13px;
  background: #fff;
  right: -9px;
  top: 0;
}

.recordDetail {
  margin: 0 10px;
  padding: 20px;
  border-radius: 8px;
  background: #fff;
  min-height: calc(100% - 94px);

}

.recordTitle {
  font-size: 17px;
  color: #333;
  line-height: 20px;
  margin-bottom: 17px;
  font-weight: bold;
}

.imgBox {
  display: flex;
  justify-content: flex-start;
  align-items: top;
  flex-wrap: wrap;
}

.imgBox .photo {
  width: 100px;
  height: 100px;
  border-radius: 6px;
  margin-bottom: 11px;
  object-fit: cover;
}

.imgBox .photo:nth-child(3n-1) {
  margin: 0 7px;
}

.scoreInfo {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: #fff;
  padding: 24px 14px;
  padding-bottom: 17px;
  border-top: 1px solid #E2E2E2;
}

.scoreInfo p {
  color: #666;
  font-size: 14px;
  line-height: 17px;
}

.scoreInfo .tips {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 16px;
  color: #333;
  line-height: 20px;
}

.scoreInfo p {
  margin-bottom: 7px;
}

.tips p {
  color: #333333;
  font-size: 16px;
  margin-bottom: 10px;
}

.tips .noScore {
  font-size: 14px;
  /* line-height: 17px; */
  color: #999;
}

.titleImg {
  height: 20px;
  width: 20px;
  margin-right: 8px;
  margin-top: -2px;
}

.tips .score {
  position: relative;
  left: 0;
  color: #2685D2;
  font-weight: bold;
  font-size: 20px;
}

.tips .unit {
  font-size: 14px;
  margin-left: 4px;
  font-weight: bold;
}

.scoreDetail {
  width: 100%;
  border-radius: 4px;
  height: 44px;
  line-height: 44px;
  text-align: center;
  border: 1px solid #2F7DCD;
  font-size: 17px;
  color: #2F7DCD;
  margin-top: 17px;
  font-weight: bold;
}

.iconTitle {
  margin: 0;
  line-height: 20px !important;
  font-weight: bold;
}

.spaceLetter {
  display: inline-block;
  width: 94px;
  text-align: justify;
  text-align-last: justify;
}

.check-person {
  height: 25px;
  font-size: 14px;
  font-weight: normal;
  line-height: 17px;
  letter-spacing: 0.2px;
  color: #666666;
  display: flex;
  align-items: center;
}

.check-time {
  height: 25px;
  font-size: 14px;
  font-weight: normal;
  line-height: 17px;
  letter-spacing: 0.2px;
  color: #666666;
  display: flex;
  align-items: center;
  /* margin-bottom: 23px; */
}
</style>

<style lang="scss"></style>
