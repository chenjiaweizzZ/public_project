<template>
  <div class="wapper">
    <div class="func-tools">
      <el-button type="primary" @click="handleAdd">添加</el-button>
    </div>
    <div class="content">
      <el-table :data="caseList" border tooltip-effect="dark" style="width: 100%" v-loading="loadingShow.table">
        <el-table-column label="内容名称" prop="content" min-width="150"></el-table-column>
        <el-table-column label="适用科室" prop="deptName" min-width="200">
          <template slot-scope="scope">
            <div class="actionplansty">
              <el-tooltip effect="light" :content="scope.row.deptName" placement="top">
                <span>{{scope.row.deptName}}</span>
              </el-tooltip>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="statusName" min-width="100"></el-table-column>
        <el-table-column label="最后操作人" prop="operatorName" min-width="120"></el-table-column>
        <el-table-column label="最后操作时间" prop="updateTime" min-width="150"></el-table-column>
        <el-table-column fixed="right" min-width="160" label="操作">
          <template slot-scope="scope">
            <el-button @click="editRow(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
            <el-button @click="deleteRow(scope.$index, scope.row)" type="text" size="small">删除</el-button>
            <el-button v-if="scope.row.status == 0" @click="enabledRow(scope.$index, scope.row)" type="text" size="small">启用</el-button>
            <el-button v-if="scope.row.status == 1" @click="disabledRow(scope.$index, scope.row)" type="text" size="small">禁用</el-button>
            <el-button @click="settingRow(scope.$index, scope.row)" type="text" size="small">设置</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 添加dialog -->
    <el-dialog :title="addEditDialogTitle" :visible.sync="addEditDialog" :close-on-click-modal="false" @close="resetForm('caseDialogRef')"
      class="add-case-dialog">
      <el-form class="addEdit-box" :model="dialogForm" :rules="rules" ref="caseDialogRef" label-width="120px">
        <el-form-item label="内容名称:" prop="caseId">
          <el-select v-model="dialogForm.caseId" placeholder="请选择" :disabled="disabled" @change="changeCase">
            <el-option v-for="(item, index) in turnCaseList" :key="index" :label="item.content" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否启用:" prop="caseDisabled">
          <el-radio-group v-model="dialogForm.caseDisabled">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用科室" prop="deptIdList">
          <el-input class="left-top" placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
          <el-tree ref="deptList" :default-expanded-keys="expandedKeys" v-loading="loadingShow.tree" :highlight-current="true" node-key="id"
            :data="deptData" @check-change="handleCheckChange1" style="height: 400px; overflow: auto;" :check-strictly="true"
            :props="defaultProps" show-checkbox></el-tree>
        </el-form-item>
        <div class="fun-footer-box">
          <el-button type="primary" @click="submitForm('caseDialogRef')" :loading="saveStatus">保存</el-button>
          <el-button @click="resetForm('caseDialogRef')">取消</el-button>
        </div>
      </el-form>
    </el-dialog>
    <!-- 病种设置 dialog -->
    <el-dialog title="病种设置" :visible.sync="caseSettingDialog" :close-on-click-modal="false">
      <el-button type="primary" @click="addCase">添加</el-button>
      <el-table class="caseInfo-box" :data="caseSettingInfoList" border tooltip-effect="dark" style="width: 100%" v-loading="caseInfoTable">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="需要填写信息" prop="writeInfo" min-width="130"></el-table-column>
        <el-table-column label="是否显示在列表中" min-width="140" prop="isdisplay">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.isdisplay" true-label="1" false-label="0" v-bind="{'checked': scope.row.isdisplay == 1 ? true : false}"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="学员是否必填" min-width="120" prop="iswrite">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row.iswrite" true-label="1" false-label="0" v-bind="{'checked': scope.row.iswrite == 1 ? true : false}"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <el-button size="mini" :disabled="scope.$index===0" @click="moveUp(scope.$index,scope.row)">
              <i class="el-icon-arrow-up"></i>
            </el-button>
            <el-button size="mini" :disabled="scope.$index===(caseSettingInfoList.length-1)" @click="moveDown(scope.$index,scope.row)">
              <i class="el-icon-arrow-down"></i>
            </el-button>
          </template>
        </el-table-column>
        <el-table-column min-width="100" label="操作">
          <template slot-scope="scope">
            <el-button @click="deleteCaseInfo(scope.$index, scope.row)" type="text" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="case-func-box">
        <el-button @click="cancelCaseInfo">取消</el-button>
        <el-button type="primary" @click="saveCaseInfo">保存</el-button>
      </div>
    </el-dialog>
    <!-- 病种信息 dialog -->
    <el-dialog title="选择" :visible.sync="caseInfoDialog" :close-on-click-modal="false">
      <el-table ref="multipleTable" class="caseInfo-box" :data="allCaseInfo" border tooltip-effect="dark" style="width: 100%" v-loading="caseInfoTable"
        @selection-change="handleSelectionChange">
        <el-table-column label="序号" type="index"></el-table-column>
        <el-table-column label="需要填写信息" prop="write_info" min-width="150"></el-table-column>
        <el-table-column type="selection"></el-table-column>
      </el-table>
      <div class="case-func-box">
        <el-button @click="cancelCase">取消</el-button>
        <el-button type="primary" @click="saveCase">保存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { post, getCookie, exportMouldExcel, exportExcel } from "../../config/util";
  import { mapState, mapActions } from "vuex";
  import api from "../../config/common_data.js";
  var _ = require("lodash");
  export default {
    data() {
      return {
        turnCaseList: [], // 病例病种管理列表
        caseList: [],
        // 添加 编辑 dialog
        addEditDialog: false,
        addEditDialogType: 0, // 0 添加 1 编辑
        addEditDialogTitle: "添加",
        saveStatus: false,
        currentCaseId: "",
        dialogForm: {
          caseId: "",
          caseDisabled: "",
          deptIdList: []
        },
        disabled: false,
        selectDeptList: [],
        // 添加 tree 数据
        deptData: [],
        filterText: "",
        expandedKeys: [99], // 默认展开节点的Key的数组
        // 配置项、展示子节点，禁用节点等
        defaultProps: {
          label: "name",
          children: "childrens"
        },
        loadingShow: {
          table: false,
          tree: false
        },
        // 病种设置 dialog
        caseSettingDialog: false,
        caseInfoTable: false,
        caseSettingInfoList: [],
        selectItems: [],
        // 病种信息
        allCaseInfo: [],
        caseInfoDialog: false,
        // 验证规则
        rules: {
          caseId: [{ required: true, message: "请选择", trigger: "change" }],
          caseDisabled: [
            {
              type: "number",
              required: true,
              message: "请选择是否启用",
              trigger: "change"
            }
          ],
          deptIdList: [
            {
              type: "array",
              required: true,
              message: "请至少选择一个科室"
            }
          ]
        }
      };
    },
    computed: {},
    watch: {
      filterText(val) {
        this.$refs.deptList.filter(val);
      }
    },
    methods: {
      // 病种管理列表查询
      queryCaseManageList() {
        api.queryCases().then(data => {
          this.turnCaseList = data.list;
        });
      },
      // 添加
      handleAdd() {
        this.dialogForm = {
          caseId: "",
          caseDisabled: "",
          deptIdList: []
        };
        this.addEditDialog = true;
        this.disabled = false;
        this.addEditDialogType = 0;
        this.addEditDialogTitle = "添加";
        this.loadingShow.tree = false;
        this.$nextTick(() => {
          this.$refs.caseDialogRef.resetFields()
        })

      },
      handleCheckChange1(data, dataObj) {
        if (data.havePermission != 1) {
          return false;
        }
        // this.dialogForm.deptIdList = []
        this.dialogForm.deptIdList = this.$refs.deptList.getCheckedKeys();
      },
      // 病种切换 只有在添加时才会切换
      changeCase(data) {
        if (this.addEditDialogType == 0) {
          this.loadingShow.tree = true;
          this.resetTreeData();
          this.disabledDept(data, "");
        }
      },

      // 根据病种ID来disabled选过的科室根据病种ID来disabled选过的科室
      disabledDept(manageId, id) {
        // 添加 直接disabled,不选中
        if (this.addEditDialogType == 0) {
          api.getCheckDeptList(manageId, "").then(data => {
            this.$nextTick(() => {
              data.used.forEach(item => {
                this.deptData.forEach((val, idx) => {
                  val.childrens = val.childrens != null ? val.childrens : []
                  val.childrens.map(v => {
                    v.childrens = v.childrens != null ? v.childrens : []
                    v.childrens.map(value => {
                      if (item == value.id) {
                        value.disabled = true;
                        // if(value.children) {
                        //     value.children.map(v2 => {
                        //         v2.disabled = true;
                        //     })
                        // }
                      }
                      // if(value.children) {
                      //     value.children.map(v2 => {
                      //         if(item == v2.id){
                      //             v2.disabled = true;
                      //         }
                      //     })
                      // }
                    });
                  });
                });
              });
              this.loadingShow.tree = false;
            });
          });
        }

        // 编辑 选中状态下disabled
        if (this.addEditDialogType == 1) {
          this.loadingShow.tree = false;
          api.getCheckDeptList(manageId, id).then(data => {
            // 当前病种选中过的科室ID列表
            let selectDeptIDList = data.useing;
            // 设置选中
            this.dialogForm.deptIdList = data.useing
            this.$refs.deptList.setCheckedKeys(data.useing);
            // 使用过的置灰不能选中
            data.used.forEach(item => {
              this.deptData.forEach((val, idx) => {
                val.childrens = val.childrens != null ? val.childrens : []
                val.childrens.map(v => {
                  v.childrens = v.childrens != null ? v.childrens : []
                  v.childrens.map(value => {
                    if (item == value.id) {
                      value.disabled = true;
                      // if(value.children) {
                      //     value.children.map(v2 => {
                      //         v2.disabled = true;
                      //     })
                      // }
                    }
                    // if(value.children) {
                    //     value.children.map(v2 => {
                    //         if(item == v2.id){
                    //             v2.disabled = true;
                    //         }
                    //     })
                    // }
                  });
                });
              });
            });
          });
        }
      },

      // 病种列表查询
      queryCaseList() {
        this.loadingShow.table = true;
        post("/turnManual/queryTurnManualDisease", {
          command: "turnManual/queryTurnManualDisease",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid")
        })
          .then(data => {
            if (data && data.errcode == 0) {
              this.loadingShow.table = false;
              this.caseList = data.list;
            }
          })
          .catch(() => { });
      },
      // tree树形控件
      initTree() {
        let self = this;
        this.loadingShow.tree = true;
        post('/base/dept/getMyDeptTree', {
          showHospital: 1,
          showNoDeptHospital: 0,
          needBaseDept: false,
          // hospitalId: this.formInline.hospitalId,
          // menusId: this.menuId
        }).then((data) => {
          if (data && data.resCode == 200) {
            self.deptData = data.model
            this.loadingShow.tree = false;
          }
        }).catch(() => {
          this.loadingShow.tree = false;
        });
      },
      // filterNode(value, data) {
      //   if (!value) return true;
      //   return data.name.indexOf(value) !== -1;
      // },
      // 重置tree
      resetTreeData() {
        // 取消tree置灰
        this.deptData.map(item => {
          if (item.childrens != null) {
            item.childrens.map(v => {
              v.disabled = false;
              if (v.childrens != null) {
                v.childrens.map(value => {
                  value.disabled = false;
                  // if(value.children) {
                  //     value.children.map(v2 => {
                  //         v2.disabled = false;
                  //     })
                  // }
                });
              }
            });
          }

        });
      },
      // 提交表单
      submitForm(form) {
        // 获取所选科室列表

        this.selectDeptList = this.$refs.deptList.getCheckedNodes();
        this.selectDeptIDList = [];
        this.dialogForm.deptIdList = this.$refs.deptList.getCheckedKeys()
        // console.log(this.dialogForm.deptIdList);
        console.log(this.$refs.deptList.getCheckedKeys(), this.dialogForm, "------")
        this.$refs[form].validate(valid => {
          if (valid) {
            // 提交按钮loading状态
            this.saveStatus = true;
            let option = {};
            // 添加
            if (this.addEditDialogType == 0) {
              option = {
                turnManualId: this.dialogForm.caseId,
                status: String(this.dialogForm.caseDisabled),
                operator: getCookie("uid"),
                deptIdList: this.dialogForm.deptIdList
              };
            }
            // 编辑
            if (this.addEditDialogType == 1) {
              option = {
                id: this.currentCaseId,
                turnManualId: this.dialogForm.caseId,
                status: String(this.dialogForm.caseDisabled),
                operator: getCookie("uid"),
                deptIdList: this.dialogForm.deptIdList
              };
            }
            post("/turnManual/saveOrUpdateTurnManualDisease", {
              command: "turnManual/saveOrUpdateTurnManualDisease",
              sessionid: getCookie("sid"),
              loginid: getCookie("uid"),
              ...option
            })
              .then(data => {
                if (data && data.errcode == 0) {
                  this.$message({
                    message:
                      this.addEditDialogType == 0 ? "添加成功!" : "编辑成功",
                    type: "success"
                  });
                  this.addEditDialog = false;
                  this.saveStatus = false;
                  // 查询列表
                  this.queryCaseList();
                } else {
                  this.$message({
                    message: data.errdesc,
                    type: "warning"
                  });
                  this.saveStatus = false;
                }
              })
              .catch(() => {
                this.saveStatus = false;
              });
          } else {
            return false;
          }
        });
      },
      // 重置表单
      resetForm(form) {
        this.addEditDialog = false;
        this.disabled = false;
        this.resetTreeData();
        // 置空
        this.selectDeptList = [];
        // 清空科室选中
        this.$refs.deptList.setCheckedKeys([]);
        // 关键字搜索
        this.filterText = "";
        try {
          this.$refs[form].resetFields();
        } catch (e) { }
      },

      // table 操作
      editRow(index, row) {
        this.addEditDialog = true;
        this.disabled = true;
        this.addEditDialogType = 1;
        this.addEditDialogTitle = "编辑";
        this.currentCaseId = row.id;
        this.dialogForm.caseDisabled = parseInt(row.status);
        // 病例病种管理列表ID
        this.dialogForm.caseId = String(row.manageId);
        this.disabledDept(this.dialogForm.caseId, this.currentCaseId);
      },
      deleteRow(index, row) {
        if (row.deleteFlag == 0) {
          this.$message({
            type: "warning",
            message: "已被引用，不能删除，请先解除引用，再进行操作"
          });
        } else {
          this.$confirm("确认删除该条记录?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              api
                .disabledOrDelCase(row.id, 1)
                .then(data => {
                  if (data && data.errcode == 0) {
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });
                    this.queryCaseList();
                  }
                })
                .catch(() => {
                  this.$message({
                    type: "success",
                    message: "删除失败!"
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除"
              });
            });
        }
      },
      disabledRow(index, row) {
        this.$confirm("确认禁用该条记录吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            api
              .disabledOrDelCase(row.id, 0)
              .then(data => {
                if (data && data.errcode == 0) {
                  this.$message({
                    type: "success",
                    message: "禁用成功!"
                  });
                  this.queryCaseList();
                } else {
                  this.$message({
                    type: "warning",
                    message: "已被引用，不能禁用，请先解除引用，再进行操作"
                  });
                }
              })
              .catch(() => {
                this.$message({
                  type: "success",
                  message: "禁用失败,联系管理员!"
                });
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消禁用"
            });
          });
      },
      enabledRow(index, row) {
        this.$confirm("确认启用该条记录吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            api
              .disabledOrDelCase(row.id, 2)
              .then(data => {
                if (data && data.errcode == 0) {
                  this.$message({
                    type: "success",
                    message: "启用成功!"
                  });
                  this.queryCaseList();
                }
              })
              .catch(() => {
                this.$message({
                  type: "success",
                  message: "启用失败,联系管理员!"
                });
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消启用"
            });
          });
      },
      settingRow(index, row) {
        this.caseSettingInfoList = [];
        this.caseSettingDialog = true;
        this.caseInfoTable = true;
        this.currentCaseId = row.id;
        // 查询当前病例病种的填写信息列表
        this.queryCaseInfoList(this.currentCaseId);
      },
      // 查询病例设置列表
      queryCaseInfoList(id) {
        api.getCaseSettingList(id).then(data => {
          this.caseInfoTable = false;
          this.caseSettingInfoList = data.list;
        });
      },
      // 排序
      // 上升
      moveUp(index, row) {
        if (index > 0) {
          let upData = this.caseSettingInfoList[index - 1];
          this.caseSettingInfoList.splice(index - 1, 1);
          this.caseSettingInfoList.splice(index, 0, upData);
        } else {
          this.$message({
            message: "已经是第一条,不可上移",
            type: "warning"
          });
        }
      },
      // 下降
      moveDown(index, row) {
        if (index + 1 === this.caseSettingInfoList.length) {
          this.$message({
            message: "已经是最后一条,不可下移",
            type: "warning"
          });
        } else {
          let downData = this.caseSettingInfoList[index + 1];
          this.caseSettingInfoList.splice(index + 1, 1);
          this.caseSettingInfoList.splice(index, 0, downData);
        }
      },
      // 删除
      deleteCaseInfo(index, row) {
        if (row.id) {
          this.$confirm("确认删除该条记录?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              post("/turnManual/deleteTurnManualDiseaseItem", {
                command: "turnManual/deleteTurnManualDiseaseItem",
                sessionid: getCookie("sid"),
                loginid: getCookie("uid"),
                id: row.id
              })
                .then(data => {
                  if (data && data.errcode == 0) {
                    this.$message({
                      type: "success",
                      message: "删除成功!"
                    });
                    this.caseInfoTable = true;
                    this.caseSettingInfoList = [];
                    this.queryCaseInfoList(this.currentCaseId);
                  }
                })
                .catch(error => {
                  this.$message({
                    type: "warning",
                    message: "删除失败!"
                  });
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消删除!"
              });
            });
        } else {
          this.caseSettingInfoList.splice(index, 1);
        }
      },
      cancelCaseInfo() {
        this.caseSettingDialog = false;
      },
      saveCaseInfo() {
        let flag = false;
        // 重置排序
        this.caseSettingInfoList.map((item, index) => {
          item.order = index;
        });
        // 在app中显示必须有一个
        var idx = 0;
        for (var i = 0, len = this.caseSettingInfoList.length; i < len; i++) {
          if (this.caseSettingInfoList[i].isdisplay == 1) {
            idx++;
            flag = true;
            if (idx > 4) {
              flag = false;
              break;
            }
          }
        }
        if (flag) {
          // 保存当前病例病种的信息列表
          post("/turnManual/turnManualSeting", {
            command: "turnManual/turnManualSeting",
            sessionid: getCookie("sid"),
            loginid: getCookie("uid"),
            manualId: this.currentCaseId,
            beanList: this.caseSettingInfoList
          })
            .then(data => {
              if (data && data.errcode == 0) {
                this.caseSettingDialog = false;
                this.$message({
                  message: "保存成功!",
                  type: "success"
                });
              }
            })
            .catch(error => { });
        } else {
          this.$message({
            type: "warning",
            message: "是否显示在列表中,必须勾选至少一个,最多显示4个"
          });
        }
      },

      // 病历设置 添加
      addCase() {
        this.caseInfoDialog = true;
        this.caseInfoTable = true;
        post("/turnManual/queryTurnManualItem", {
          command: "turnManual/queryTurnManualItem",
          sessionid: getCookie("sid"),
          loginid: getCookie("uid")
        })
          .then(data => {
            if (data && data.errcode == 0) {
              this.caseInfoTable = false;
              this.allCaseInfo = data.itemList;
              // 选过的切换为选中状态
              if (this.caseSettingInfoList.length > 0) {
                let selectItems = [];
                this.caseSettingInfoList.map(item => {
                  this.allCaseInfo.map(val => {
                    if (item.itemId == val.id) {
                      selectItems.push(val);
                    }
                  });
                });
                this.$nextTick(() => {
                  selectItems.forEach(value => {
                    this.$refs.multipleTable.toggleRowSelection(value);
                  });
                });
              }
            }
          })
          .catch(error => { });
      },
      handleSelectionChange(val) {
        let len = this.caseSettingInfoList.length;
        let itemLists = _.cloneDeep(val);
        itemLists.forEach((item, index) => {
          item.itemId = item.id;
          item.writeInfo = item.write_info;
          item.iswrite = 0;
          item.isdisplay = 0;
          item.order = len + index;
          delete item.id;
          delete item.write_info;
        });
        this.selectItems = itemLists;
      },
      // 病种信息列表
      cancelCase() {
        this.caseInfoDialog = false;
      },
      saveCase() {
        if (this.selectItems.length > 0) {
          this.caseInfoDialog = false;
          this.caseSettingInfoList = _.uniqBy(
            _.concat(this.caseSettingInfoList, this.selectItems),
            "itemId"
          );
        } else {
          this.$message({
            type: "warning",
            message: "请至少选择一项"
          });
        }
      }
    },
    mounted() {
      this.initTree();
      this.queryCaseManageList(); // 病例病种管理列表
      this.queryCaseList(); // 病例病种设置列表
    }
  };
</script>

<style lang="scss" scoped>
  .wapper {
    padding: 0 20px 90px 20px;
  }
  .content {
    margin-top: 10px;
  }

  .add-case-dialog /deep/ .el-dialog--small {
    top: 5% !important;
  }

  .addEdit-box {
    width: 80%;
    margin: 0 auto;
  }

  .fun-footer-box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }

  .fun-footer-box button {
    margin-right: 5px;
  }

  .caseInfo-box {
    margin-top: 10px;
  }

  .case-func-box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    margin-top: 10px;
  }
</style>