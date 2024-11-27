<template>
  <div class="wapper">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane v-for="item in caseList" :label="item.diseaseName+ '(' + item.finishRate + ')'" :name="item.baseId"></el-tab-pane>
    </el-tabs>

    <div class="tool-box">
      <div class="func-tools">
        <el-button type="primary" @click="addCase">添加</el-button>
      </div>
    </div>
    <div class="case-contanier">
      <div class="left-box" v-if="curType == 1">
        <el-table ref="detailTable" :data="caseDetailList" border tooltip-effect="dark" style="width: 100%" :max-height="$tabelMaxHeight"
          v-loading="caseLoading" highlight-current-row @row-click="rowClick">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="content" label="病种" min-width="120">
            <template slot-scope="scope">
              <div class="actionplansty">
                <el-tooltip effect="light" :content="scope.row.content" placement="top">
                  <span>{{scope.row.content}}</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="要求例数" min-width="80"></el-table-column>
          <el-table-column prop="alreadyCheck" label="已审核例数" min-width="80"></el-table-column>
          <el-table-column prop="waiteCheck" label="待审核例数" min-width="80"></el-table-column>
        </el-table>
      </div>
      <div :class="[curType == 0 ? 'case-box': '','right-box']">
        <el-table ref="caseDetailTable" :data="patientDetailList" border tooltip-effect="dark" style="width: 100%" :max-height="$tabelMaxHeight"
          v-loading="patientLoading">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column v-for="(item, index) in itemLabel" :key="index" prop="iteminfo" :label="item.writeInfo" min-width="100">
            <template slot-scope="scope">
              <template v-for="(item, idx) in scope.row.iteminfo">
                <div class="actionplansty">
                  <el-tooltip effect="light" :content="item.content" placement="top">
                    <template v-if="idx == index">
                      <template v-if="item.type == 3">
                        <span v-if="item.content == '0'">否</span>
                        <span v-if="item.content == '1'">是</span>
                      </template>
                      <span v-else>{{item.content}}</span>
                    </template>
                  </el-tooltip>
                </div>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="userinfo" label="填写日期" min-width="150">
            <template slot-scope="scope">
              <div class="actionplansty">
                <el-tooltip effect="light" :content="scope.row.userinfo[0].createTime" placement="top">
                  <span>{{scope.row.userinfo[0].createTime}}</span>
                </el-tooltip>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="userinfo" label="状态" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.userinfo[0].checkName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userinfo" label="审核人" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.userinfo[0].userName}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="userinfo" label="审核日期" min-width="150">
            <template slot-scope="scope">
              <span>{{scope.row.userinfo[0].updateTime}}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" width="170" label="操作">
            <template slot-scope="scope">
              <el-button v-if="scope.row.userinfo[0].check != 1" @click="edit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
              <el-button v-if="scope.row.userinfo[0].check != 1" @click="del(scope.$index, scope.row)" type="text" size="small">删除</el-button>
              <el-button @click="check(scope.$index, scope.row)" type="text" size="small">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="pagenum" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"></el-pagination>
      </div>
    </div>

    <!-- 添加 编辑 dialog -->
    <el-dialog :title="dialogTitle" :visible.sync="addEditDialog" :close-on-click-modal="false" @close="resetForm('caseDialogRef')"
      class="addEdit-box">
      <el-form :model="dialogForm" ref="caseDialogRef" label-width="140px">
        <el-row :gutter="20" v-for="(submitArr, index) in dialogForm.submitArr" :key="index">
          <template v-if="submitArr.type == 1">
            <el-form-item v-if="submitArr.iswrite == 1" :label="submitArr.writeInfo" :prop="'submitArr.' + index + '.content'" :rules="{required: true, type: 'date', message: '不能为空', trigger: 'change'}">
              <el-date-picker v-model="submitArr.content" type="date" placeholder="选择日期" format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item v-else :label="submitArr.writeInfo" prop>
              <el-date-picker v-model="submitArr.content" type="date" placeholder="选择日期" format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
          </template>
          <template v-if="submitArr.type == 2">
            <el-form-item v-if="submitArr.iswrite == 1" :label="submitArr.writeInfo" :prop="'submitArr.' + index + '.content'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
              <el-input v-model="submitArr.content" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item v-else :label="submitArr.writeInfo" prop>
              <el-input v-model="submitArr.content" placeholder="请输入"></el-input>
            </el-form-item>
          </template>
          <template v-if="submitArr.type == 3">
            <el-form-item v-if="submitArr.iswrite == 1" :label="submitArr.writeInfo" :prop="'submitArr.' + index + '.content'" :rules="{required: true,  type: 'number', message: '不能为空', trigger: 'change'}">
              <el-radio-group v-model="submitArr.content">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-else :label="submitArr.writeInfo" prop>
              <el-radio-group v-model="submitArr.content">
                <el-radio :label="0">是</el-radio>
                <el-radio :label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </template>
          <template v-if="submitArr.type == 4">
            <el-form-item v-if="submitArr.iswrite == 1" :label="submitArr.writeInfo" :prop="'submitArr.' + index + '.content'" :rules="{required: true, message: '不能为空', trigger: 'blur'}">
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="submitArr.content"></el-input>
            </el-form-item>
            <el-form-item v-else :label="submitArr.writeInfo" prop>
              <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="submitArr.content"></el-input>
            </el-form-item>
          </template>
        </el-row>
        <el-row :gutter="20">
          <div class="fun-footer-box">
            <el-button @click="resetForm('caseDialogRef')">取消</el-button>
            <el-button type="primary" @click="submitForm('caseDialogRef')" :loading="saveStatus">保存</el-button>
          </div>
        </el-row>
      </el-form>
    </el-dialog>
    <!-- 查看 dialog -->
    <el-dialog :title="detailTitle" :visible.sync="detailDialog" :close-on-click-modal="false">
      <ul>
        <li class="item-box" v-for="(item, index) in dialogForm.submitArr" :key="item.id">
          <div v-if="item.type" :class="[item.iswrite == 1 ? 'required': '','item-name']">{{item.writeInfo}}:</div>
          <!-- time -->
          <div class="item-content" v-if="item.type == 1">{{item.content}}</div>
          <!-- radio -->
          <div class="item-content" v-if="item.type == 3 && item.content == '0'">否</div>
          <div class="item-content" v-if="item.type == 3 && item.content == '1'">是</div>
          <!-- input -->
          <div class="item-content" v-if="item.type == 2">
            <span>{{item.content}}</span>
          </div>
          <!-- textarea -->
          <div class="item-content" v-if="item.type == 4">
            <span>{{item.content}}</span>
          </div>
        </li>
        <li v-if="checkType == 1">
          <div class="suggest-content">
            <div class="suggest-box">
              <div class="item-name">审核意见:</div>
              <div class="item-content">
                <span>不通过</span>
              </div>
            </div>
            <div class="suggest-box">
              <div class="item-name">原因:</div>
              <div class="item-content">
                <span>{{suggest}}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </el-dialog>
  </div>
</template>

<script>
  import { post, getCookie, exportExcel } from "../../config/util";
  import { mapState, mapActions } from "vuex";
  import api from "../../config/common_data.js";
  const _ = require("lodash");
  import moment from "moment";
  export default {
    data() {
      return {
        pagenum: 1,
        pagesize: 10,
        totalCount: 0,
        // tab默认选择
        activeName: "",
        caseList: [],
        curItem: {},
        curType: 1, // 0无子项 1有子项
        curturnManualId: "", // 病例病种ID
        curBaseId: "", // 病例病种子项ID
        deptId: "", // 科室ID
        turnTrainId: "", // 轮转培训ID
        turnId: "", // 轮转ID
        stdId: "", // 学生ID
        stage: "", // 阶段
        turnManualId: "", // 添加查询添加信息列表 病例病种ID
        // 完成的病例病种情况
        caseLoading: false,
        caseDetailList: [],
        // 当前column
        firstLoad: true,
        currentRow: {},
        // 添加的病例信息列表
        patientLoading: false,
        patientDetailList: [],
        itemLabel: [],
        // 查看dialog
        detailDialog: false,
        detailTitle: "查看",
        // 审核意见
        suggest: "",
        checkType: 0,
        // 添加 编辑 dialog
        dialogTitle: "添加",
        dialogType: "", // 0 添加  1编辑
        detailId: "", // 编辑选中ID
        checkType: "", // 0待审核 1通过 2不通过
        saveStatus: false, // 按钮状态
        addEditDialog: false,
        dialogForm: {
          submitArr: [
            {
              iswrite: "",
              itemId: "",
              content: ""
            }
          ]
        }
      };
    },
    filters: {},
    methods: {
      // tab切换
      handleClick(tab) {
        this.patientDetailList = [];
        this.caseList.map(item => {
          if (item.baseId == tab.name) {
            this.curItem = item;
          }
        });
        this.activeName = this.curItem.baseId;
        this.curType = this.curItem.type;
        this.turnManualId = this.curItem.turnManualId;
        // 初始化
        this.firstLoad = true;
        // 有子项 查询病例病种表
        if (this.curType == 1) {
          this.curturnManualId = this.curItem.turnManualId;
          this.queryAllCase();
        } else {
          this.curturnManualId = this.curItem.baseId;
          this.queryList();
        }
      },

      // 查询轮转详情信息
      queryTurnDetail() {
        post("/turn/getturndetailbyid", {
          command: "turn/getturndetailbyid",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          plandetailid: this.$route.query.id
        }).then(data => {
          // *** 轮转手册 phase为null 传0, 有值阶段数加一 ***
          let phase = data.detailinfo.phase
            ? parseInt(data.detailinfo.phase) + 1
            : 0;
          this.deptId = data.detailinfo.deptid; // 科室ID
          this.turnTrainId = data.detailinfo.profId; // 轮转培训ID
          this.turnId = data.detailinfo.turnId;
          this.stdId = data.detailinfo.stdid; // 学生ID
          this.stage = phase; // 阶段
          this.getTurnManualData(
            data.detailinfo.turnId,
            data.detailinfo.deptid,
            data.detailinfo.stdid,
            phase
          );
        });
      },
      // 轮转手册数据
      getTurnManualData(turnId, deptId, stdId, phase) {
        post("/turnManual/queryTurnManualDiseaseDeptList", {
          command: "turnManual/queryTurnManualDiseaseDeptList",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          turnId: turnId,
          deptId: deptId,
          stdId: stdId,
          stage: phase,
          plandetailid: this.$route.query.id
        }).then(data => {
          if (data && data.errcode == 0) {
            data.result.map(
              item => (item.finishRate = parseInt(item.finishRate) + "%")
            );
            this.caseList = data.result;
            this.activeName = this.caseList[0].baseId;
            this.curType = this.caseList[0].type;
            this.turnManualId = this.caseList[0].turnManualId;
            // 有子项 查询病例病种表
            if (this.curType == 1) {
              this.curturnManualId = this.caseList[0].turnManualId;
              this.queryAllCase();
            } else {
              this.curturnManualId = this.caseList[0].baseId;
              this.queryList();
            }
          }
        });
      },
      // 查询所有病种完成情况信息
      queryAllCase() {
        this.caseLoading = true;
        post("/turnManual/queryTurnManualDiseaseStdDetail", {
          command: "turnManual/queryTurnManualDiseaseStdDetail",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          turnTrainId: this.turnTrainId,
          turnId: this.turnId,
          deptId: this.deptId,
          stdId: this.stdId,
          stage: this.stage,
          type: this.curType,
          turnManualId: this.curturnManualId
        })
          .then(data => {
            if (data && data.errcode == 0) {
              this.caseLoading = false;
              data.list.map((item, index) => (item.index = index));
              this.caseDetailList = data.list;
              // 是否是第一次加载
              if (this.firstLoad) {
                this.curBaseId = this.caseDetailList[0].baseId;
                this.$nextTick(() => {
                  this.$refs.detailTable.setCurrentRow(this.caseDetailList[0]);
                });
              } else {
                this.$nextTick(() => {
                  this.$refs.detailTable.setCurrentRow(
                    this.caseDetailList[this.currentRowIndex]
                  );
                });
                this.$set(this.caseDetailList, data.list);
              }
              this.queryList();
            }
          })
          .catch(error => {
            this.caseLoading = false;
          });
      },

      /**
       * 查询列表
       * check 0待审核 1审核通过 2未通过 全部不传
       * baseId 通过type值判断是否有子项  有子项就为子项Id, 无子项就为病种病例ID
       * stdId 学生ID
       * type 默认传0
       */
      queryList() {
        let baseId = this.curType == 0 ? this.curturnManualId : this.curBaseId;
        this.patientLoading = true;
        // 置空
        post("/turnManual/queryturnManualStdItemPcDetail", {
          command: "turnManual/queryturnManualStdItemPcDetail",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          type: 0,
          stdId: this.stdId,
          baseId: baseId,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        })
          .then(data => {
            if (data && data.errcode == 0) {
              this.patientLoading = false;
              this.patientDetailList = [];
              for (var i in data.list) {
                this.patientDetailList.push(data.list[i]);
              }
              if (this.patientDetailList.length > 0) {
                this.itemLabel = this.patientDetailList[0].iteminfo;
              }
              this.totalCount = data.count;
            }
          })
          .catch(error => {
            this.patientLoading = false;
          });
      },

      rowClick(row) {
        this.firstLoad = false;
        this.currentRowIndex = row.index;
        this.curBaseId = row.baseId;
        this.queryList();
      },

      /*分页区*/
      handleSizeChange(size) {
        this.pagesize = size;
        this.queryList();
      },
      handleCurrentChange(currentPage) {
        this.pagenum = currentPage;
        this.queryList();
      },

      /* 添加 */
      addCaseItem(deptId, turnManualId) {
        this.dialogForm.submitArr = [];
        post("/turnManual/queryTurnStdDisease", {
          command: "turnManual/queryTurnStdDisease",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid"),
          deptId: deptId,
          turnManualId: turnManualId
        })
          .then(data => {
            if (data && data.errcode == 0) {
              data.result.map(item => {
                this.dialogForm.submitArr.push({
                  iswrite: item.iswrite,
                  type: item.type,
                  writeInfo: item.writeInfo,
                  itemId: item.id, // 添加 信息item的ID
                  content: ""
                });
              });
            }
          })
          .catch(error => { });
      },

      /* 通过ID 查看详情 */
      queryDetailById(id, checkType) {
        return new Promise((resolve, reject) => {
          post("/turnManual/queryturnManualItemDetail", {
            command: "turnManual/queryturnManualItemDetail",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid"),
            detailId: id,
            check: checkType
          })
            .then(data => {
              if (data && data.errcode == 0) {
                resolve(data);
                this.dialogForm.submitArr = [];
                this.checkType = 0;
                /* 转换字段 */
                data.itemList.map(item => {
                  if (item.type == 3) {
                    item.content = parseInt(item.content); // radio 转换为int
                  }
                  if (item.type == 1 && item.content) {
                    if (this.dialogType == 1) {
                      item.content = new Date(item.content);
                    }
                  }
                  // 填写信息
                  if (item.type) {
                    this.dialogForm.submitArr.push({
                      iswrite: item.iswrite,
                      type: item.type,
                      writeInfo: item.writeInfo,
                      id: item.id, // 编辑 查看 数据的ID
                      content: item.content,
                      itemId: item.itemId
                    });
                  }
                  // 审核意见
                  if (item.checkType) {
                    this.checkType = item.checkType;
                    this.suggest = item.checksuggestion;
                  }
                });
              }
            })
            .catch(error => {
              reject(error);
            });
        });
      },

      /* form */
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.saveStatus = true;
            this.dialogForm.submitArr.forEach(item => {
              if (item.type == 1 && item.content != "") {
                item.content = moment(item.content).format("YYYY-MM-DD"); // 转换时间格式
              }
            });
            let arr = _.cloneDeep(this.dialogForm.submitArr);
            arr.forEach(item => {
              delete item.iswrite;
              delete item.type;
              delete item.writeInfo;
            });
            if (this.dialogType == 0) {
              let baseId =
                this.curType == 0 ? this.curturnManualId : this.curBaseId;
              post("/turnManual/turnStdAddDisease", {
                command: "turnManual/turnStdAddDisease",
                sessionid: getCookie("sid"),
                loginid: getCookie("uid"),
                deptId: this.deptId,
                stdId: this.stdId,
                baseId: baseId,
                detailList: arr
              })
                .then(data => {
                  if (data && data.errcode == 0) {
                    this.saveStatus = false;
                    this.addEditDialog = false;
                    this.$message({
                      type: "success",
                      message: "添加成功!"
                    });
                    if (this.curType == 0) {
                      this.queryList();
                    }

                    if (this.curType == 1) {
                      this.queryAllCase();
                    }
                  }
                })
                .catch(error => { });
            }
            if (this.dialogType == 1) {
              post("/turnManual/editTurnManualItemDetail", {
                command: "turnManual/editTurnManualItemDetail",
                sessionid: getCookie("sid"),
                loginid: getCookie("uid"),
                detailId: this.detailId,
                check: this.checkType,
                beanList: arr
              })
                .then(data => {
                  if (data && data.errcode == 0) {
                    this.saveStatus = false;
                    this.addEditDialog = false;
                    this.$message({
                      type: "success",
                      message: "编辑成功!"
                    });
                    this.queryList();
                  }
                })
                .catch(error => { });
            }
          } else {
            console.log("error submit!!");
            return false;
          }
        });
      },
      resetForm(formName) {
        this.addEditDialog = false;
        this.$refs[formName].resetFields();
      },

      // 添加 病例
      addCase() {
        this.addEditDialog = true;
        this.dialogType = 0;
        this.dialogTitle = "添加";
        this.addCaseItem(this.deptId, this.turnManualId);
      },
      // 编辑
      edit(index, row) {
        this.dialogType = 1;
        this.dialogTitle = "编辑";
        this.detailId = row.iteminfo[0].id;
        this.checkType = row.userinfo[0].check;
        this.queryDetailById(this.detailId, this.checkType).then(res => {
          this.addEditDialog = true;
        });
      },
      // 删除
      del(index, row) {
        this.$confirm("请确认是否删除?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            post("/turnManual/deleteTurnManualStdItem", {
              command: "turnManual/deleteTurnManualStdItem",
              sessionid: getCookie("sid"),
              loginid: getCookie("uid"),
              id: row.iteminfo[0].id
            })
              .then(data => {
                if (data && data.errcode == 0) {
                  this.$message({
                    message: "删除成功!",
                    type: "success"
                  });
                  this.queryAllCase();
                }
              })
              .catch(error => { });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除"
            });
          });
      },
      // 查看
      check(index, row) {
        let id = row.iteminfo[0].id;
        let checkType = row.userinfo[0].check;
        this.queryDetailById(id, checkType).then(res => {
          this.detailDialog = true;
        });
      }
    },
    mounted() {
      this.queryTurnDetail();
    }
  };
</script>

<style lang='scss' scoped>
  .tool-box {
    margin-bottom: 16px;
  }

  .case-contanier {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
  }

  .left-box {
    width: 38%;
  }

  .right-box {
    width: 60%;
  }

  .case-box {
    width: 100% !important;
  }

  /* 查看 */
  .item-box {
    background: #fff;
    position: relative;
    color: #666;
    font-size: 14px;
    display: flex;
    align-items: flex-start;
    padding: 10px 0;
  }

  .item-box textarea {
    display: inline-block;
  }

  .required::before {
    content: "*";
    color: red;
    margin-right: 4px;
  }

  .item-content {
    margin-left: 20px;
    width: 40%;
    white-space: normal;
  }

  .item-content span {
    display: inline;
  }

  .item-name {
    width: 38%;
    text-align: right;
  }

  .suggest-content {
    width: 100%;
    border-top: 1px solid #e2e2e2;
  }

  .suggest-box {
    display: flex;
    align-items: flex-start;
    width: 100%;
    padding: 4px 0;
  }

  /* 编辑 添加 */
  .addEdit-box /deep/ .el-form {
    width: 500px;
    margin: 0 auto;
  }

  .fun-footer-box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 12px;
  }

  .fun-footer-box button {
    margin: 0 20px;
  }
</style>