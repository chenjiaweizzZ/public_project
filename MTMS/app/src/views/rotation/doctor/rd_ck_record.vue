<template>
  <div class="rd-ck-record">
    <div class="record-list" v-if="recordList.length > 0">
      <div class="record" v-for="(item,index) in recordList" :key="index">
        <div class="record-name">{{ item.submitScoreTime }}</div>
        <div class="record-score">
          <div class="record-score-left">成绩:{{ item.score }}</div>
          <div class="record-score-right" @click="detail(item)" v-if="item.type !== 1">评分详情</div>
        </div>
        <div class="record-person" v-if="item.type == 1">变更人:{{ item.createBy }}</div>
        <div class="record-type">方式:{{ item.changeType }}</div>
      </div>
    </div>
      <div class="nodata" v-else>
        <img  src="../../../assets/images/noddata.png" />
        <div  class="nodataText">带教还未评分</div>
      </div>
  </div>
</template>
<script>
import methods from "../../../methods";
export default {
  data() {
    return {
      recordList: []
    };
  },
  computed: {},
  watch: {},
  created() {},

  mounted() {
    this.getRecord();
  },
  methods: {
    ...methods,
    getRecord() {
      let self = this;
      self
        .get(
          `/base/turnscorehistory/list?turnScoreId=${this.$route.query.id}&scoreType=${this.$route.query.type}&pageSize=999&pageNum=1`
        )
        .done(res => {
          this.recordList = res.rows;
        });
    },
    detail(item) {
      let self = this;
      if (this.$route.query.type == 4) {
        this.$router.push({
          name: "fdRotation_doctor_up_case",
          query: {
            businessid: this.$route.query.tpid
          }
        });
      } else {
        self
          // .post(`/base/turnscore/getScoreDetail/${item.turnScoreDetailId}`)
          .get(`/base/info/getSeiid?scoreDetailId=${item.turnScoreDetailId}&examId=${item.turnExamId}&stuId=${item.stuId}`)
          .then(res => {
            let typename;
            if (this.$route.query.type == 1) {
              typename = "出科考核（技能）";
            }
            if (this.$route.query.type == 2) {
              typename = "出科考核（综合）";
            }
            this.$router.push({
              // path: "/extranceExam/averagepagerelation",
              name: 'averagepagerelation',
              query: {
                seiid: res.model.id,
                stuid: this.$route.query.uid,
                typename: typename,
                type: this.$route.query.type,
                examId: item.turnExamId
              }
            });
          });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.rd-ck-record {
  .record-list {
    font-size: 16px;
    font-weight: normal;
    line-height: 19px;
    letter-spacing: 0.2px;
    color: #111111;
    margin-top: 10px;
    .record {
      margin: 10px 20px 0px 20px;
      padding-bottom: 10px;
      border-bottom: 1px solid #c3c3c3;
      .record-score {
        display: flex;
        justify-content: space-between;
        .record-score-right {
          color: #1989fa;
        }
      }
    }
  }
  .nodata {
  background: #ffffff;
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  img {
    height: 138px;
    width: 280px;
  }
  .nodataText {
    font-size: 17px;
    color: #868e97;
  }
}
}
</style>
