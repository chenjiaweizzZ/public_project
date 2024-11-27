<template>
  <div class="caseDetaolInfo">
    <div class="left">
      <el-table :data="caseList" border style="width: 100%" ref="singleTable" @current-change="handleCurrentChange">
        <el-table-column type="index" label="序号" width="50" align="center">
        </el-table-column>
        <el-table-column prop="name" label="病历名称" width="180" align="center">
        </el-table-column>
        <el-table-column prop="auditStatus" label="评分结果" width="90" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.auditStatus == 1 ? scope.row.score + "分" : "待评分" }}
            </span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="right">
      <p class="lineInfo">
        <span class="labelTitlt">文件名称：</span>
        <span>{{ caseDetail.name }}</span>
      </p>
      <div class="photo">
        <el-image :src="item" v-for="(item, index) in caseDetail.fileList" :preview-src-list="caseDetail.fileList" :z-index="index"
          fit style="width: 100px; height: 100px; margin-right: 10px"></el-image>
      </div>
      <div class="caseInfo" v-if="scoreResult">
        <p>
          审核评分结果：{{ caseDetail.auditStatus == 1 ? caseDetail.score + "分" : "待评分" }}
        </p>
        <p>审核人：{{ caseDetail.auditorName || "" }}</p>
        <p>审核时间：{{ caseDetail.auditTime || "" }}</p>
      </div>
      <scoring-table :id="caseDetail.scoringSubmitRecordId" :isAnswer="isAnswer" :noScoreTips="noScoreTips" :needHeader="needHeader"
        v-if="caseDetail.scoringSubmitRecordId !== null && scoreResult"></scoring-table>
    </div>
  </div>
</template>
<script>
  import { post, get } from "../config/util";
  import scoringTable from "./scoringTable";
  export default {
    props: {
      caseId: {
        type: "Array",
        default: [],
      },
    },
    data() {
      return {
        noScoreTips: true,
        caseList: [],
        previewId: "687",
        isAnswer: true,
        needHeader: true,
        caseDetail: {},
        scoreResult: false,
        tableData: [],
      };
    },
    watch: {
      caseId(newVal, oldVal) {
        this.caseId = newVal;
        this.caseList = [];
        this.caseDetail = {};
        this.getCaseList();
      },
    },
    components: { scoringTable },
    mounted() {
      this.getCaseList();
    },
    methods: {
      getCaseList() {
        post(`/base/largeMedicalRecord/listByIds`, {
          ids: this.caseId.map((i) => i.id),
        }).then((res) => {
          if (res && res.resCode == 200) {
            this.caseList = res.model;
            if (res.model.length > 0) {
              res.model.forEach((i) => {
                this.caseId.forEach((j) => {
                  if (i.id == j.id) {
                    i.auditStatus = j.auditStatus;
                  }
                });
              });
              this.getCaseDetail(this.caseList[0].id);
              this.scoreResult = !!this.caseList[0].auditStatus;
            } else {
              this.caseDetail = {};
            }
          }
        });
      },
      getCaseDetail(id) {
        if (id == null || id == "") {
          return false;
        }
        get(`/base/largeMedicalRecord/detail/${id}`).then((res) => {
          if (res && res.resCode == 200) {
            this.caseDetail = res.model;
            // this.tableData = res.model.auditRes;
            res.model.auditRes.forEach((item) => {
              if (item.associatedBusiness == 3) {
                this.tableData = JSON.parse(item.completeness)
              }
            });
          }
        });
      },
      handleCurrentChange(val) {
        if (val === null || val === "") {
          return false;
        }
        this.scoreResult = !!val.auditStatus;
        this.getCaseDetail(val.id);
      },
    },
  };
</script>
<style scoped>
  scrollbar {
    /*滚动条整体样式*/
    width: 10px;
    /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  body::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 20px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #535353;
  }

  body::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    background: #ededed;
  }

  .caseDetaolInfo {
    max-height: 800px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .right {
    width: calc(100% - 321px);
    max-height: 740px;
    overflow-y: scroll;
    border: 1px solid #ebeef5;
    padding: 15px 20px;
  }

  .photo {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 20px 0;
    border-bottom: 1px solid #ebeef5;
  }

  .caseInfo {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 20px;
  }
</style>