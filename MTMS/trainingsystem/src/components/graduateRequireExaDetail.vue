<template>
  <div class="graduate-require-exa-detail" v-if="dialogVisibleCopy">
    <el-dialog width="45%" :title="onlyRead ? '审核详情' : '出科条件审核'" :visible.sync="isShow" @close="closeDialog">
      <div class="detail">
        <div class="detail-top">
          <el-row>
            <el-col :span="12">
              <div>学员:&nbsp;{{detail.name}}</div>
            </el-col>
            <el-col :span="12">
              <div>学号:&nbsp;{{ detail.code }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div>轮转科室:&nbsp;{{ detail.deptName }}</div>
            </el-col>
            <el-col :span="12">
              <div>培训专业:&nbsp;{{ detail.profIdTxt }}</div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <div>年级:&nbsp;{{ detail.turngradeTxt }}</div>
            </el-col>
          </el-row>
        </div>
        <div class="detail-table">
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column prop="content" label="审核项" show-overflow-tooltip>
            </el-table-column>
            <el-table-column prop="name" label="实际完成情况">
              <template slot-scope="scope">
                <span v-if="scope.row.associatedBusiness == 1">考勤签到率</span>
                <span v-if="scope.row.associatedBusiness == 2">教学活动签到率</span>
                <span v-if="scope.row.associatedBusiness == 3" @click="checkCaseDetail(scope.row)" :class="{'canlink': scope.row.completenessNum > 0}">已提交{{
                  scope.row.completeness | filterComplete }}份
                </span>
              </template>
            </el-table-column>
            <el-table-column label="审核意见">
              <template slot-scope="scope">
                <el-radio v-model="scope.row.auditRes" :label="1" :disabled="onlyRead">是</el-radio>
                <el-radio v-model="scope.row.auditRes" :label="0" :disabled="onlyRead">否</el-radio>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="detail-bottom" v-if="id">
        <div style="font-size: 16px">整体审核意见：</div>
        <el-row>
          <el-col :span="12">
            <div>是否符合出科条件</div>
          </el-col>
          <el-col :span="12">
            <div>
              <el-radio v-model="detail.auditStatus" :label="1" :disabled="onlyRead">是</el-radio>
              <el-radio v-model="detail.auditStatus" :label="0" :disabled="onlyRead">否</el-radio>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="detail-reviewer" v-if="onlyRead && id">
        <el-row>
          <el-col :span="12">
            <div>审核人:{{ detail.auditUser }}</div>
          </el-col>
          <el-col :span="12">
            <div>审核时间:{{ detail.auditTime }}</div>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
    <!-- 病历详情 -->
    <el-dialog title="病历详情" :visible.sync="showCaseDetail" class="caseDetailWidth">
      <case-detail :caseId="caseid"></case-detail>
    </el-dialog>
  </div>
</template>

<script>
  import { post, get, getCookie, setTitle, currentDate } from "../config/util";
  import caseDetail from "./caseDetail.vue";

  export default {
    name: "graduateRequireExaDetail",
    props: {
      id: {
        type: String,
        default() {
          return "";
        }
      },
      dialogVisible: {
        type: Boolean,
        default() {
          return false;
        }
      },
      onlyRead: {
        type: Boolean,
        default() {
          return true;
        }
      },
      infoWithoutId: {
        type: Object,
        default() {
          return {
            name: "",
            code: "",
            deptName: "",
            profIdTxt: "",
            turngradeTxt: ""
          };
        }
      }
    },
    components: { caseDetail },
    filters: {
      exam: function (data) {
        if (data === null) {
          return "待审核";
        } else if (data === 1) {
          return "审核通过";
        } else if (data === 0) {
          return "审核不通过";
        } else {
          return "无效状态";
        }
      },
      filterComplete(val) {
        val = val == 0 || val == null ? 0 : JSON.parse(val)
        return val.length
      },
    },
    data() {
      return {
        caseid: "",
        showCaseDetail: false,
        dialogVisibleCopy: false,
        isShow: false,
        detail: {},
        tableData: []
      };
    },
    watch: {
      dialogVisible(newVal, oldVal) {
        this.isShow = newVal;
        this.dialogVisibleCopy = newVal;
        if (newVal) {
          if (this.id) {
            get(`/base/turnexamaudit/detail?id=${this.id}`).then(res => {
              if (res && res.resCode == 200) {
                this.detail = res.model
                this.tableData = res.model.auditRes
                this.tableData.forEach(item => {
                  if (item.associatedBusiness == 3) {
                    item.completenessNum = item.completeness == 0 || item.completeness == null || JSON.parse(item.completeness).length == 0 ? 0 : JSON.parse(item.completeness).length
                  }
                })
              }
            });
          } else {
            console.log("infoWithoutId", this.infoWithoutId)
            this.detail = this.infoWithoutId
            this.tableData = []
          }

        }
      }
    },
    methods: {
      checkCaseDetail(row) {
        if (row.completeness === null || row.completenessNum == 0) {
          return false
        }
        this.caseid = JSON.parse(row.completeness)
        this.showCaseDetail = true
      },
      closeDialog() {
        this.$emit("update:dialogVisible", false);
      }
    }
  };
</script>

<style lang="scss" scoped>
  .canlink {
    color: #1989fa;
  }

  .graduate-require-exa-detail {
    ::-webkit-scrollbar {
      width: 5px;
      height: 10px;
    }
    ::-webkit-scrollbar-thumb {
      background-color: #c1c1c1;
      border-radius: 32px;
    }
    ::-webkit-scrollbar-track {
      border-radius: 32px;
    }
    .detail-table {
      height: 400px;
      overflow: scroll;
      overflow-x: hidden;
    }
    .detail-bottom {
      padding: 10px 0px;
    }
    .detail-btn {
      display: flex;
      flex-direction: row-reverse;
    }
  }
</style>

<style lang="scss">
  .graduate-require-exa-detail {
    .el-row {
      padding-bottom: 10px;
    }
  }
</style>