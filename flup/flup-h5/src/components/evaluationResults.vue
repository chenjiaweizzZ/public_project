<template>
  <section ref="section" class="taskDetail">
    <div class="taskTop">
      <p>患者{{ patientName }}{{ title }}得分结果</p>
    </div>
    <div class="taskContent">
      <div class="tableBox">
        <div class="tableTitle">
          <p>序号</p>
          <p>维度名称</p>
          <p>分数</p>
        </div>
        <template v-if="questionnaireScoringList.length">
          <div v-for="(item, index) in questionnaireScoringList" :key="index">
            <p>{{ index + 1 }}</p>
            <p>{{ item.dimensionName }}</p>
            <p>{{ item.scoring }}</p>
          </div>
        </template>
        <div v-else style="padding: 10px;justify-content: center;">
          暂无数据
        </div>
      </div>
      <div v-if="showModule.indexOf('result') != -1" class="resultBox">
        <div
          class="resultOne"
          v-for="(item, index) in questionnaireResultList"
          :key="index"
        >
          <p class="evalResultsTitle">
            评测结果{{ questionnaireResultList.length == 1 ? "" : index + 1 }}
          </p>
          <p class="evalResultsIns">由【 {{ item.dimensionList }}】得出</p>
          <div class="evalResults">{{ item.description }}</div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
export default {
  data() {
    return {
      title: null,
      patientName: null,
      showModule: [],
      questionnaireScoringList: [],
      questionnaireResultList: [],
      totalPoints: {}
    };
  },
  created() {
    this.title = this.$route.query.title;
    this.patientName = this.$route.query.patientName;
    this.showModule = JSON.parse(this.$route.query.showModule);
    this.questionnaireResultList = JSON.parse(
      this.$route.query.questionnaireResultList
    );
    this.questionnaireScoringList = JSON.parse(
      this.$route.query.questionnaireScoringList
    ).filter(element => {
      if (this.showModule.indexOf("dimension") != -1) {
        return element;
      } else if (this.showModule.indexOf("score") != -1) {
        return element;
      }
    });
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.taskDetail {
  position: relative;
  .taskTop {
    padding: 0 20px;
    padding-bottom: 43px;
    background: url("../assets/images/taskTopBg.png") no-repeat;
    background-size: cover;
    overflow: hidden;
    p {
      margin: 24px 0 12px;
      font-size: 20px;
      line-height: 24px;
      letter-spacing: 0.25px;
      color: #ffffff;
      text-align: center;
    }
  }
  .taskContent {
    margin-top: -43px;
    padding-top: 23px;
    padding-bottom: 50px;
    border-radius: 24px 24px 0px 0px;
    background: #ffffff;
    .tableBox {
      margin-bottom: 26px;
      padding: 0 20px;
      > div {
        display: flex;
        border: 1px solid #e6e6e6;
        border-top: 0;
        font-size: 14px;
        line-height: 22px;
        letter-spacing: 0.2px;
        color: #111111;
        p {
          padding: 4px 12px;
        }
        p:nth-child(1) {
          width: 20%;
          border-right: 1px solid #e6e6e6;
        }
        p:nth-child(2) {
          width: 55%;
          border-right: 1px solid #e6e6e6;
        }
        p:nth-child(3) {
          width: 25%;
        }
      }
      div:nth-child(1) {
        border: 1px solid #e6e6e6;
        background: #e8f4ec;
        p {
          color: #396947;
        }
      }
    }
    .resultBox {
      .resultOne {
        margin-bottom: 10px;
        padding: 0 20px;
        font-size: 15px;
        line-height: 22px;
        letter-spacing: 0.2px;
        color: #111111;
        .evalResultsIns {
          margin-bottom: 5px;
          font-size: 12px;
          color: #999999;
        }
        .evalResults {
          padding: 4px;
          border: 1px solid #d0d4d1;
          font-size: 15px;
          line-height: 22px;
          text-align: center;
          letter-spacing: 0.2px;
          color: #111111;
        }
      }
    }
  }
}
</style>
