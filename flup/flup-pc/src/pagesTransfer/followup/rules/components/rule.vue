<template>
  <el-dialog
    class="rule-route"
    :show-close="false"
    :visible="show"
    fullscreen
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    @close="onClose"
  >
    <section v-if="show" class="rule-route-wrapper">
      <div class="rule-route-header">{{ data.rule_name }}</div>
      <div class="rule-route-edit">
        <el-button
          icon="el-icon-back"
          @click="$emit('update:show', false)"
        ></el-button>
        <el-button
          type="primary"
          @click="onAdd"
          :disabled="$route.name == 'rulesWarehouse' || data.sourceType == 1"
          >新增节点</el-button
        >
        <el-tabs
          style="margin-top: 10px"
          v-model="active"
          type="card"
          @edit="handleTabsEdit"
          @tab-click="switchTab"
        >
          <el-tab-pane
            :closable="$route.name != 'rulesWarehouse'"
            :key="item.id"
            v-for="item in tabs"
            :label="
              `${item.interventionBenchmark}${item.interventionDay}${
                unitList[item.executeUnit]
              }`
            "
            :name="`${item.id}`"
          ></el-tab-pane>
        </el-tabs>
      </div>
      <!-- <el-dialog
        title="终身随访配置"
        :visible="showAlong"
        width="600px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        @close="showAlong = false"
      >
        <section style="padding: 20px">
          随访间隔
          <el-input-number
            class="width150px margin-left10"
            v-model="flup_interval"
            :min="0"
            :max="9999"
            controls-position="right"
          ></el-input-number>天
        </section>
        <span slot="footer">
          <el-button @click="showAlong = false">取 消</el-button>
          <el-button type="primary" @click="onConfirm">确 定</el-button>
        </span>
      </el-dialog>-->
      <el-dialog
        title="复制"
        :visible="copyDialog"
        width="650px"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
        append-to-body
        @close="copyDialog = false"
      >
        <section style="padding: 20px">
          <span class="margin-right10">选择规则</span>
          <br />
          <el-select
            class="value"
            style="margin:10px;"
            v-model="ruleId"
            placeholder="请选择"
            @change="changeTab"
            filterable
          >
            <el-option
              v-for="(item, index) in rulesList"
              :key="index"
              :label="item.ruleName"
              :value="item.serialNo"
            ></el-option>
          </el-select>
          <br />
          <span class="margin-right10">目标时间</span>
          <br />
          <el-radio
            style="min-width: 120px;margin: 10px 10px 0 10px;"
            v-for="item in rulesListTabs.filter(v => {
              return v.id != active;
            })"
            :key="item.id"
            v-model="copyTime"
            :label="item.id"
            border
            >{{
              `${item.interventionBenchmark}${item.interventionDay}${
                unitList[item.executeUnit]
              }`
            }}</el-radio
          >
        </section>
        <span slot="footer">
          <el-button @click="copyDialog = false">取 消</el-button>
          <el-button type="primary" @click="onCopy">确 定</el-button>
        </span>
      </el-dialog>
      <template v-if="tabs && tabs.length > 0">
        <div style="border: 1px solid #e6e6e6;padding: 20px; border-top: 0;">
          <normal-route
            ref="cancel1"
            :data="ruleType ? list : list.generalPathList"
            :relationDept="data.relationDept"
            :sourceType="data.sourceType"
            @getList="getTabList"
          ></normal-route>
          <check-route
            ref="cancel2"
            v-if="type !== 0 && examineShow"
            :data="(list && list.checkPathList) | analysisList"
            :sourceType="data.sourceType"
            @getList="getTabList"
          ></check-route>
          <inspect-route
            ref="cancel3"
            v-if="type !== 0 && checkout"
            :data="(list && list.examPathList) | analysisList"
            :sourceType="data.sourceType"
            @getList="getTabList"
          ></inspect-route>
          <ncd-route ref="cancel4" @getList="getTabList"></ncd-route>
        </div>
      </template>
      <div v-else>
        <div class="nonexistenceData">一条记录都没有</div>
      </div>
      <time-add
        v-if="showAddTime"
        :show.sync="showAddTime"
        :data="tabs"
        @save="getTimeList"
        :serialNo="data.serialNo"
        :patientType="patientType"
      ></time-add>
    </section>
  </el-dialog>
</template>

<script>
import TimeAdd from "./time_add";
import NormalRoute from "./normal";
import CheckRoute from "./check";
import NcdRoute from "./ncd.vue";
import InspectRoute from "./inspect";
import Prescription from "./prescription";
export default {
  name: "rule-content",
  props: {
    data: {
      type: Object,
      default() {
        return null;
      },
      patientType: null
    },
    ruleType: {
      type: Number,
      default: 0
    },
    show: Boolean
  },
  components: {
    TimeAdd,
    NormalRoute,
    CheckRoute,
    InspectRoute,
    Prescription,
    NcdRoute
  },
  data() {
    return {
      tabs: [],
      active: "0",
      showAddTime: false,
      unitList: ["天", "周", "月"],
      list: null,
      isAlong: false,
      showAlong: false,
      flup_interval: 0,
      copyDialog: false,
      copyFlag: 0,
      copyTime: "",
      precition: "1",
      examineShow: true,
      checkout: true,
      recipe: true,
      ruleId: "",
      rulesList: [],
      rulesListTabs: []
      // showPre: null,
    };
  },

  computed: {
    type() {
      if (this.$route.params.type === "specialist") {
        return 1;
      } else if (this.$route.params.type === "whole") {
        return 0;
      } else if (this.$route.params.type === "icdm") {
        return 2;
      } else {
        return this.data.ruleType;
      }
    }
  },
  watch: {
    active() {
      // console.log(this.data);
      if (this.ruleType) {
        this.$apis
          .ruleGetQuRulePath({
            nodeId: this.active,
            ruleId: this.data.serialNo
          })
          .then(res => {
            // console.log(res);
            this.list = res;
            if (!this.list.checkPathList) {
              this.list.checkList = [];
            }
            if (!this.list.examPathList) {
              this.list.examList = [];
            }
            if (!this.list.generalPathList) {
              this.list.generalPathList = [];
            }
            // this.isAlong = res.fu_period === 1
          });
      } else {
        this.$apis
          .flupPathqueryFlupPathListNew({
            timeconfigId: this.active,
            ruleType: this.type
          })
          .then(res => {
            // console.log(res);
            this.list = res;
            if (!this.list.checkPathList) {
              this.list.checkList = [];
            }
            if (!this.list.examPathList) {
              this.list.examList = [];
            }
            if (!this.list.generalPathList) {
              this.list.generalPathList = [];
            }
            // this.isAlong = res.fu_period === 1
          });
      }
    }
  },
  async created() {
    this.patientType = JSON.parse(this.data.enrollmentConfig).patientType;
    this.$apis
      .flupTypequeryFollowTypeList({
        keyWord: "",
        enable: this.type,
        hospitalId: this.$global.hospital_id
      })
      .then(res => {
        res.list.forEach(item => {
          if (item.name == "定期检查" && item.enable == 0) {
            this.examineShow = false;
          }
          if (item.name == "定期检验" && item.enable == 0) {
            this.checkout = false;
          }
          // if (item.name == '处方提醒' && item.enable == 0) {
          //   this.recipe = false
          // }
        });
      });
    // 处方配置            --注释隐藏
    // this.$apis
    //   .ParameterselectParametersByParameterKey({
    //     parameterKey: 'PrescriptionConfig',
    //     hospitalId: this.$global.hospital_id,
    //   })
    //   .then((res) => {
    //     if (res) {
    //       this.showPre = res.enabled
    //     }
    //   })
    await this.getTimeList();
    if (this.tabs && this.tabs.length > 0) {
      this.active = `${this.tabs[0].id}`;
    }
    this.ruleId = this.data.serialNo;
    this.rulesListTabs = this.tabs;
    this.$apis
      .queryAllFollowUpRuleList({
        hospitalId: this.$global.hospital_id
      })
      .then(res => {
        this.rulesList = res;
      });
  },
  methods: {
    onClose() {
      this.$emit("update:show", false);
    },
    getPathList() {
      if (this.ruleType) {
        this.$apis
          .ruleGetQuRulePath({
            nodeId: this.active,
            ruleId: this.data.serialNo
          })
          .then(res => {
            this.list = res;

            if (!this.list.checkPathList) {
              this.list.checkList = [];
            }
            if (!this.list.examPathList) {
              this.list.examList = [];
            }
            if (!this.list.generalPathList) {
              this.list.generalPathList = [];
            }
            // console.log(res)
            // this.list = res.this.isAlong = res.fu_period === 1
          });
      } else {
        this.$apis
          .flupPathqueryFlupPathListNew({
            timeconfigId: this.active,
            ruleType: this.type
          })
          .then(res => {
            this.list = res;

            if (!this.list.checkPathList) {
              this.list.checkList = [];
            }
            if (!this.list.examPathList) {
              this.list.examList = [];
            }
            if (!this.list.generalPathList) {
              this.list.generalPathList = [];
            }
            // console.log(res)
            // this.list = res.this.isAlong = res.fu_period === 1
          });
      }
    },
    handleTabsEdit(targetName, action) {
      this.$confirm("是否删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$apis
          .timeconfigdelFlupTimeconfig(parseInt(targetName))
          .then(res => {
            if (targetName === this.active) {
              let index = this.tabs.findIndex(item => {
                return item.id == targetName;
              });
              let nextTab = this.tabs[index + 1] || this.tabs[index - 1];
              // console.log(nextTab);
              if (nextTab) {
                this.active = `${nextTab.id}`;
              } else {
                this.active = "0";
              }
            }
            this.getTimeList();
          });
      });
    },
    onAdd() {
      this.showAddTime = true;
    },
    getTimeList() {
      this.tabs = [];
      if (this.$route.name == "rulesWarehouse") {
        this.$apis
          .ruleGetQuRuleNode({
            ruleId: this.data.serialNo
          })
          .then(res => {
            let obj = {};
            res.forEach(element => {
              let k = obj[element.interventionBenchmark.slice(0, 2)];
              if (k) {
                if (element.interventionBenchmark.indexOf("前") != -1) {
                  k.前.push(element);
                  k.前.sort((a, b) => {
                    return (
                      Number(b.interventionDay) *
                        (b.executeUnit == 0 ? 1 : b.executeUnit == 1 ? 7 : 30) -
                      Number(a.interventionDay) *
                        (a.executeUnit == 0 ? 1 : a.executeUnit == 1 ? 7 : 30)
                    );
                  });
                } else {
                  k.后.push(element);
                  k.后.sort((a, b) => {
                    return (
                      Number(a.interventionDay) *
                        (a.executeUnit == 0 ? 1 : a.executeUnit == 1 ? 7 : 30) -
                      Number(b.interventionDay) *
                        (b.executeUnit == 0 ? 1 : b.executeUnit == 1 ? 7 : 30)
                    );
                  });
                }
              } else {
                k = obj[element.interventionBenchmark.slice(0, 2)] = {
                  前: [],
                  后: []
                };

                if (element.interventionBenchmark.indexOf("前") != -1) {
                  k.前.push(element);
                  k.前.sort((a, b) => {
                    return (
                      Number(b.interventionDay) *
                        (b.executeUnit == 0 ? 1 : b.executeUnit == 1 ? 7 : 30) -
                      Number(a.interventionDay) *
                        (a.executeUnit == 0 ? 1 : a.executeUnit == 1 ? 7 : 30)
                    );
                  });
                } else {
                  k.后.push(element);
                  k.后.sort((a, b) => {
                    return (
                      Number(a.interventionDay) *
                        (a.executeUnit == 0 ? 1 : a.executeUnit == 1 ? 7 : 30) -
                      Number(b.interventionDay) *
                        (b.executeUnit == 0 ? 1 : b.executeUnit == 1 ? 7 : 30)
                    );
                  });
                }
              }
            });

            for (const key in obj) {
              for (const k in obj[key]) {
                this.tabs.push(...obj[key][k]);
              }
            }
            if (this.tabs.length == 0) {
              this.active = "0";
            } else if (!this.tabs.find(item => item.id == this.active)) {
              this.active = this.tabs[0].id.toString();
            }
          });
      } else {
        this.$apis
          .timeconfigqueryTimeconfigListByRuleId({
            ruleId: this.data.serialNo
          })
          .then(res => {
            let obj = {};
            res.forEach(element => {
              let k = obj[element.interventionBenchmark.slice(0, 2)];
              if (k) {
                if (element.interventionBenchmark.indexOf("前") != -1) {
                  k.前.push(element);
                  k.前.sort((a, b) => {
                    return (
                      Number(b.interventionDay) *
                        (b.executeUnit == 0 ? 1 : b.executeUnit == 1 ? 7 : 30) -
                      Number(a.interventionDay) *
                        (a.executeUnit == 0 ? 1 : a.executeUnit == 1 ? 7 : 30)
                    );
                  });
                } else {
                  k.后.push(element);
                  k.后.sort((a, b) => {
                    return (
                      Number(a.interventionDay) *
                        (a.executeUnit == 0 ? 1 : a.executeUnit == 1 ? 7 : 30) -
                      Number(b.interventionDay) *
                        (b.executeUnit == 0 ? 1 : b.executeUnit == 1 ? 7 : 30)
                    );
                  });
                }
              } else {
                k = obj[element.interventionBenchmark.slice(0, 2)] = {
                  前: [],
                  后: []
                };

                if (element.interventionBenchmark.indexOf("前") != -1) {
                  k.前.push(element);
                  k.前.sort((a, b) => {
                    return (
                      Number(b.interventionDay) *
                        (b.executeUnit == 0 ? 1 : b.executeUnit == 1 ? 7 : 30) -
                      Number(a.interventionDay) *
                        (a.executeUnit == 0 ? 1 : a.executeUnit == 1 ? 7 : 30)
                    );
                  });
                } else {
                  k.后.push(element);
                  k.后.sort((a, b) => {
                    return (
                      Number(a.interventionDay) *
                        (a.executeUnit == 0 ? 1 : a.executeUnit == 1 ? 7 : 30) -
                      Number(b.interventionDay) *
                        (b.executeUnit == 0 ? 1 : b.executeUnit == 1 ? 7 : 30)
                    );
                  });
                }
              }
            });

            for (const key in obj) {
              for (const k in obj[key]) {
                this.tabs.push(...obj[key][k]);
              }
            }
            if (this.tabs.length == 0) {
              this.active = "0";
            } else if (!this.tabs.find(item => item.id == this.active)) {
              this.active = this.tabs[0].id.toString();
            }
          });
      }
    },
    switchTab() {
      // this.$refs.cancel1.onCancel();
      // this.$refs.cancel2.onCancel();
      // this.$refs.cancel3.onCancel();
    },
    changeType(v) {
      this.flup_interval = 0;
      if (this.isAlong) {
        this.$apis
          .timeconfigsaveFlupTimeconfig({
            id: parseInt(this.active),
            flag: v ? 1 : 0,
            intervalDay: 0
          })
          .then(() => {
            this.$message({
              type: "warning",
              message: "设置成功"
            });
            this.getPathList();
            this.isAlong = false;
            this.isAlong = v;
          })
          .catch(() => {
            this.$message({
              type: "warning",
              message: "设置失败"
            });
          });
      } else {
        this.showAlong = true;
      }
    },
    changeTab() {
      this.$apis
        .timeconfigqueryTimeconfigListByRuleId({
          ruleId: this.ruleId
        })
        .then(res => {
          let obj = {};
          res.forEach(element => {
            let k = obj[element.interventionBenchmark.slice(0, 2)];
            if (k) {
              if (element.interventionBenchmark.indexOf("前") != -1) {
                k.前.push(element);
                k.前.sort((a, b) => {
                  return (
                    Number(b.interventionDay) *
                      (b.executeUnit == 0 ? 1 : b.executeUnit == 1 ? 7 : 30) -
                    Number(a.interventionDay) *
                      (a.executeUnit == 0 ? 1 : a.executeUnit == 1 ? 7 : 30)
                  );
                });
              } else {
                k.后.push(element);
                k.后.sort((a, b) => {
                  return (
                    Number(a.interventionDay) *
                      (a.executeUnit == 0 ? 1 : a.executeUnit == 1 ? 7 : 30) -
                    Number(b.interventionDay) *
                      (b.executeUnit == 0 ? 1 : b.executeUnit == 1 ? 7 : 30)
                  );
                });
              }
            } else {
              k = obj[element.interventionBenchmark.slice(0, 2)] = {
                前: [],
                后: []
              };

              if (element.interventionBenchmark.indexOf("前") != -1) {
                k.前.push(element);
                k.前.sort((a, b) => {
                  return (
                    Number(b.interventionDay) *
                      (b.executeUnit == 0 ? 1 : b.executeUnit == 1 ? 7 : 30) -
                    Number(a.interventionDay) *
                      (a.executeUnit == 0 ? 1 : a.executeUnit == 1 ? 7 : 30)
                  );
                });
              } else {
                k.后.push(element);
                k.后.sort((a, b) => {
                  return (
                    Number(a.interventionDay) *
                      (a.executeUnit == 0 ? 1 : a.executeUnit == 1 ? 7 : 30) -
                    Number(b.interventionDay) *
                      (b.executeUnit == 0 ? 1 : b.executeUnit == 1 ? 7 : 30)
                  );
                });
              }
            }
          });
          this.rulesListTabs = [];
          for (const key in obj) {
            for (const k in obj[key]) {
              this.rulesListTabs.push(...obj[key][k]);
            }
          }
        });
    },
    onConfirm() {
      this.$apis
        .timeconfigsaveFlupTimeconfig({
          id: parseInt(this.active),
          flag: this.isAlong ? 1 : 0,
          intervalDay: this.flup_interval
        })
        .then(() => {
          this.$message({
            type: "warning",
            message: "设置成功"
          });
          this.isAlong = !this.isAlong;
          this.showAlong = false;
        })
        .catch(() => {
          this.$message({
            type: "warning",
            message: "设置失败"
          });

          this.showAlong = false;
        });
    },
    onCancelSetAlong() {
      // console.log(this.isAlong)
      // this.isAlong = !this.isAlong
      // this.showAlong = false
    },
    onCopy() {
      if (!this.copyTime) {
        this.$message({
          type: "warning",
          message: "请选择目标时间"
        });
        return;
      }
      let list = [];
      if (this.copyFlag == 1) {
        list = this.list.generalPathList;
      } else if (this.copyFlag == 2) {
        list = this.list.checkPathList;
      } else if (this.copyFlag == 3) {
        list = this.list.examPathList;
      } else if (this.copyFlag == 4) {
        list = this.list.prescriptionPathList;
      }
      list.forEach(element => {
        element.copyDetail = element.pathDetail;
      });
      this.$apis
        .flupPathcopyFlupPath({
          flupTimeconfigId: this.copyTime,
          generalList: list
        })
        .then(() => {
          this.copyDialog = false;
          this.$message({
            type: "success",
            message: "复制成功"
          });
        });
    },
    // 处方配置            --注释隐藏
    // changePreConfig() {
    //   // this.$confirm("是否修改处方配置项？", "提示", {
    //   //   confirmButtonText: "确定",
    //   //   cancelButtonText: "取消",
    //   // }).then((res) => {
    //   this.$apis
    //     .editRulePrescriptionState({
    //       serialNo: this.data.serialNo,
    //       prescriptionConfig: this.data.prescriptionConfig,
    //     })
    //     .then((res) => {
    //       if (res) {
    //         this.$message({
    //           type: 'success',
    //           message: '修改成功',
    //         })
    //       }
    //     })
    //   // });
    // },
    getTabList(copyFlag) {
      // console.log(copyFlag, 'copyFlagcopyFlagcopyFlagcopyFlag');
      // if (this.tabs.length == 1) {
      //   this.$message({
      //     type: "warning",
      //     message: "单个节点无法复制，需先增加随访节点!"
      //   });
      //   return;
      // } else {
      this.copyFlag = copyFlag;
      this.copyDialog = true;
      // }
    }
  }
};
</script>

<style lang="scss">
.rule-route {
  .el-dialog {
    &.is-fullscreen {
      max-width: 100%;
      position: relative;
    }
  }
  .el-dialog__body {
    border: 0;
  }
  .el-tabs__header {
    margin: 0;
  }
  &-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    padding: 20px;
  }
  &-header {
    padding: 0 0 15px 0;
    border-bottom: 1px solid #e6e6e6;
    margin-bottom: 10px;
  }
  .title {
    font-weight: bold;
    font-size: 15px;
  }
  .normal,
  .check,
  .inspect {
    .tips {
      background: orange;
      border-radius: 16px;
      width: 16px;
      height: 16px;
      color: #fff;
      display: inline-block;
      line-height: 16px;
      text-align: center;
      font-size: 12px;
    }
  }
}
</style>
