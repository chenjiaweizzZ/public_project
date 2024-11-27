<template>
  <div class="g-main">
    <div class="rd-up-case">
      <diV class="scoreTitle">
        <p>得分 (平均分) ：{{avaerage}}分</p>
      </diV>
      <div class="listBox" v-if="caseList.length > 0">
        <div class="listItem" @click="goDetail(item.id)" v-for="(item,index) in caseList" :key="index">
          <div class="title">
            <p class="intro">{{item.name}}</p>
            <p class="noScore" v-if="item.auditStatus == 0">待评分</p>
            <p class="score" v-else><span>{{item.score}}</span><span class="unit">分</span></p>
          </div>
          <p class="time">{{item.auditTime ? item.auditTime : item.createTime }}</p>
        </div>
      </div>
      <div class="no-content" v-else>
        <img src="../../../assets/images/rd-no-content.png" alt />
      </div>
    </div>
  </div>
</template>

<script>
  import methods from "../../../methods";
  export default {
    data() {
      return {
        caseList: [],
        avaerage: ""
      };
    },
    computed: {
    },
    created() {
      this.getCaseList()
      this.getAverage()
    },
    mounted() {
    },
    methods: {
      ...methods,
      goDetail(id) {
        this.$router.push({
          name: "fdRotation_doctor_case_detail",
          query: {
            id: id
          }
        })
      },
      getAverage() {
        this.get(`/base/largeMedicalRecord/getAverageScore/${this.$route.query.businessid}`).done(res => {
          if (res && res.resCode == 200) {
            this.avaerage = res.model
          } else {
            this.$message({
              type: "error",
              message: "请求病历列表失败！"
            })
          }

        })
      },
      getCaseList() {
        this.get(`/base/largeMedicalRecord/list?turnPlanDetailId=${this.$route.query.businessid}`).done(res => {
          if (res && res.resCode == 200) {
            this.caseList = res.model
          } else {
            this.$message({
              type: "error",
              message: "请求病历列表失败！"
            })
          }

        })
      }
    }
  };
</script>
<style scoped>
  .rd-up-case {
    height: 100%;
  }

  .no-content {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 120px;
  }

  .scoreTitle {
    width: 100%;
    height: 44px;
    background: #fff;
    font-size: 14px;
    color: #666;
  }

  .scoreTitle p {
    line-height: 44px;
    padding: 0 20px;
  }

  .listBox {
    margin: 0 12px;
    margin-bottom: 15px;
  }

  .listItem {
    width: 100%;
    border-radius: 6px;
    background: #fff;
    padding: 16px 14px;
    margin-top: 12px;
  }

  .title {
    display: flex;
    justify-content: space-between;
    align-items: top;
  }

  .title .intro {
    width: calc(100% - 80px);
    color: #111;
    line-height: 19px;
    font-size: 16px;
    line-height: 19px;
  }

  .title .score {
    position: relative;
    bottom: -5px;
    left: 0;
    color: #2685D2;
    font-weight: bold;
    font-size: 20px;
  }

  .title .score::after {
    position: absolute;
    width: 100%;
    height: 1px;
    background-color: #2685D2;
    display: block;
    content: "";
  }

  .title .unit {
    font-size: 14px;
    margin-left: 4px;
    font-weight: normal;
  }

  .noScore {
    font-size: 14px;
    color: #999;
  }

  .time {
    color: #999;
    font-size: 12px;
    margin-top: 16px;
  }
</style>