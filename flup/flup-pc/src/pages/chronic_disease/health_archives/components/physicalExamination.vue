<template>
  <div class="physicalExamination">
    <div class="healthCheck">
      <!-- <div class="baseInfo">
        <div class="baseItem">
          <div class="label">体检编号: {{healthCheckInfo.tijianBm}}</div>
          <div class="label">姓名: {{healthCheckInfo.name}}</div>
        </div>
        <div class="baseItem">
          <div class="label">性别: {{healthCheckInfo.sex}}</div>
          <div class="label">年龄: {{healthCheckInfo.age}}</div>
        </div>
        <div class="baseItem">
          <div class="label">单位: {{healthCheckInfo.union}}</div>
          <div class="label">部门: {{healthCheckInfo.dept}}</div>
        </div>
        <div class="baseItem">
          <div class="label">体检时间: {{healthCheckInfo.tijianRq}}</div>
          <div class="label">报告时间: {{healthCheckInfo.zongjianRq}}</div>
        </div>
      </div>-->
      <div class="result">
        <div>
          <div class="title">总检结论</div>
          <div class="line"></div>
          <div class="content">
            <div>
              <div class="item-title" v-if="healthCheckInfo.zongShu">
                <span>检查综述</span>
              </div>
              <div class="item-text">{{healthCheckInfo.zongShu}}</div>
            </div>
            <div>
              <div class="item-title" v-if="healthCheckInfo.suggestion">
                <span>防治意见</span>
              </div>
              <div class="item-text">{{healthCheckInfo.suggestion}}</div>
            </div>
          </div>
        </div>
        <div>
          <div class="title">体检明细指标</div>
          <div class="line"></div>
          <div class="content">
            <div v-for="(m,index) in healthCheckInfo.list" :key="index" class="item">
              <div class="little-title">
                <div class="name">{{m.zuheXmmc}}</div>
                <div class="doc">体检医生:{{m.doctor}}</div>
              </div>
              <el-table class="margin-top20" :data="m.subItems" border stripe>
                <el-table-column show-overflow-tooltip prop="xiangMuMC" label="检查项目名称"></el-table-column>
                <el-table-column show-overflow-tooltip prop="tijianJg" label="检查结果"></el-table-column>
                <el-table-column prop="unit" label="单位"></el-table-column>
                <el-table-column prop="reference" label="正常值范围"></el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'report',
  components: {},
  props: {
    contentJson: String,
    healthCheckInfo: Object,
  },
  data() {
    return {};
  },
  watch: {},
  computed: {},
  mounted() {},
  methods: {},
};
</script>

<style lang="scss">
.physicalExamination {
  padding: 20px;
  .result {
    .title {
      text-align: center;
      font-family: 思源黑体;
      font-size: 18px;
      font-weight: 900;
      text-align: center;
      letter-spacing: 0.1em;
      color: #000000;
    }
    .line {
      border: 1px solid #111111;
    }
    .content {
      .item-title {
        height: 24px;
        background: linear-gradient(270deg, #cfcfcf 0%, #f5f5f5 100%);
        span {
          font-weight: bold;
          letter-spacing: 0em;
          color: #000000;
          margin-left: 34px;
        }
      }
      .item-text {
        padding: 10px 0;
        white-space: pre-wrap;
      }
      .item {
        margin-top: 20px;
        .little-title {
          display: flex;
          background: #f3f3f3;
          height: 24px;
          box-sizing: border-box;
          border: 1px solid #e2e2e2;
          border-bottom: none;
          line-height: 24px;
          .name {
            width: 70%;
            border-right: 1px solid #e2e2e2;
            padding-left: 14px;
            font-family: 思源黑体;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 0em;
            color: #000000;
          }
          .doc {
            width: 30%;
            padding-left: 14px;
          }
        }
      }
    }
  }
}
</style>
