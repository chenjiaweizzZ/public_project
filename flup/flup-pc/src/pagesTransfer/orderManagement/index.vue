<template>
  <div class="order_management">
    <div class="header">
      <div class="search">
        <section>
          <span class="title">日期</span>
          <el-date-picker
            v-model="time"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            @change="getOrderList(true)"
          >
          </el-date-picker>
        </section>
        <section>
          <span class="title">订单状态</span>
          <el-select
            v-model="flowStatus"
            placeholder="请选择"
            @change="getOrderList(true)"
            clearable
          >
            <el-option
              v-for="item in flowStatusList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </section>
        <section>
          <span class="title">宣教状态</span>
          <el-select
            v-model="educationStatus"
            placeholder="请选择"
            @change="getOrderList(true)"
            clearable
          >
            <el-option
              v-for="item in educationStatusList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            ></el-option>
          </el-select>
        </section>
        <section>
          <el-input
            placeholder="请输入关键字查询"
            v-model="keywords"
            clearable
            maxlength="20"
            show-word-limit
          >
            <el-select
              class="width120px"
              v-model="keywordsType"
              slot="prepend"
              placeholder="请选择"
            >
              <el-option label="患者姓名" :value="1"></el-option>
              <el-option label="服务内容名称" :value="3"></el-option>
              <el-option label="开单医生" :value="2"></el-option>
            </el-select>
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList(true)"
            ></el-button>
          </el-input>
        </section>
      </div>
      <el-button type="primary" plain @click="exportHospitalOrder"
        >导出</el-button
      >
    </div>
    <div class="order_main">
      <el-collapse v-if="mainList.length > 0" accordion>
        <el-collapse-item v-for="item in mainList" :key="item.serialNo">
          <template slot="title">
            <div class="collapse-item">
              <section v-if="item.patientName" @click.stop="registration(item)">
                <span class="value">{{ item.patientName }}</span>
              </section>
              <section v-if="item.patientSex">
                <span class="value">{{ item.patientSex }}</span>
              </section>
              <section v-if="item.patientAge">
                <span class="value">{{ item.patientAge }}岁</span>
              </section>
              <section v-if="item.patientPhone">
                <span class="value">{{ item.patientPhone }}</span>
              </section>
              <section class="button">
                <!-- 订单状态 -->
                <div class="taught">
                  {{ getName1(item.flowStatus, flowStatusList) }}
                </div>
                <!-- 宣教状态 -->
                <div class="enrollment" style="margin-left: 20px;">
                  {{ getName1(item.educationStatus, educationStatusList) }}
                </div>
              </section>
              <section class="identifying">
                <span class="key">开单时间：</span>
                <span>{{ item.orderTime }}</span>
              </section>
            </div>
          </template>
          <div class="collapse-item-main">
            <div class="list">
              <span class="key">服务内容名称</span>
              <span class="value">{{ item.packageName }}</span>
            </div>
            <div class="list">
              <span class="key">开单医生</span>
              <span>{{ item.orderDoctorName }}</span>
            </div>
            <div class="list">
              <span class="key">患者诊断</span>
              <span class="value">{{ item.clinicalDiagnosis }}</span>
            </div>
            <div class="list">
              <span class="key">医嘱</span>
              <span class="value">{{ item.doctorOrder }}</span>
            </div>
            <div class="list">
              <el-button type="success" @click="registration(item)"
                >患者登记</el-button
              >
              <el-button
                type="success"
                @click="education(item)"
                v-if="item.flowStatus == 0 && item.educationStatus == 0"
                >完成宣教</el-button
              >
              <el-button
                type="danger"
                @click="refuse(item)"
                v-if="item.flowStatus == 0 && item.educationStatus == 0"
                >患者拒绝</el-button
              >
              <el-button
                type="danger"
                @click="closeCase(item)"
                v-if="item.flowStatus == 9"
                >结案</el-button
              >
              <el-button
                v-if="item.flowStatus == 3"
                type="info"
                @click="enrollment(item)"
                >患者入组</el-button
              >
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
      <div class="fpimgbox" v-else>
        <img src="../../assets/images/zwsj.png" alt="暂无数据" />
      </div>
    </div>
    <el-pagination
      class="pageBottom"
      :page-sizes="[10, 20, 30, 50]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page.sync="pageNo"
      :page-size="pageSize"
      layout="total,sizes,prev, pager, next"
      :total="total"
    ></el-pagination>
    <el-dialog
      title="患者入组"
      width="500px"
      :visible.sync="dialogVisible"
      :before-close="handleClose"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      class="dialog"
    >
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        label-width="120px"
        :rules="rules"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form-item label="健康管理计划" prop="flupPlanId">
          <el-select
            v-model="ruleForm.flupPlanId"
            placeholder="请选择"
            @change="flupPlanIdChange"
          >
            <el-option
              v-for="item in planList"
              :key="item.serialNo"
              :value="item.serialNo"
              :label="item.planName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="执行科室">
          <el-select
            v-model="ruleForm.executiveDeptId"
            placeholder="请选择"
            disabled
          >
            <el-option
              v-for="item in deptlist"
              :key="item.serialNo"
              :value="item.serialNo"
              :label="item.deptName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="随访/慢病组">
          <el-select v-model="ruleForm.fuGroupId" placeholder="请选择" disabled>
            <el-option
              v-for="item in grouplist"
              :key="item.serialNo"
              :value="item.serialNo"
              :label="item.groupName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="慢病/随访人员" prop="userId">
          <el-select v-model="ruleForm.userId" placeholder="请选择">
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :value="item.userId"
              :label="item.realName"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="determine">确 定</el-button>
      </span></el-dialog
    >
  </div>
</template>
<script>
import { mapMutations } from "vuex";
export default {
  data() {
    return {
      time: [],
      billingDoctor: null,
      flowStatus: null,
      payStatus: null,
      educationStatus: null,
      team: null,
      keywordsType: 1,
      keywords: "",
      dialogVisible: false,
      flowStatusList: [
        {
          value: 0,
          name: "待支付"
        },
        {
          value: 3,
          name: "待入组"
        },
        {
          value: 4,
          name: "退款中"
        },
        {
          value: 5,
          name: "已完成"
        },
        {
          value: 6,
          name: "已取消"
        },
        {
          value: 7,
          name: "已退款"
        },
        {
          value: 9,
          name: "管理中"
        }
      ],
      payStatusList: [
        {
          value: 0,
          name: "待支付"
        },
        {
          value: 1,
          name: "支付成功"
        },
        {
          value: 4,
          name: "退款申请成功"
        }
      ],
      educationStatusList: [
        {
          value: 0,
          name: "待宣教"
        },
        {
          value: 1,
          name: "已宣教"
        },
        {
          value: 2,
          name: "患者拒绝"
        }
      ],
      ruleForm: {
        flupPlanId: "",
        executiveDeptId: "",
        fuGroupId: "",
        userId: ""
      },
      rules: {
        flupPlanId: [
          { required: true, message: "请选择健康管理计划", trigger: "change" }
        ],
        userId: [
          { required: true, message: "请选择慢病/随访人员", trigger: "change" }
        ]
      },
      mainList: [],
      planList: [],
      deptlist: [],
      grouplist: [],
      userList: [],
      hospitalId: "",
      editObj: {},
      pageNo: 1,
      pageSize: 10,
      total: 0
    };
  },
  created() {
    this.hospitalId = JSON.parse(sessionStorage.getItem("global")).hospital_id;
    this.getOrderList();
  },
  methods: {
    ...mapMutations("ipcc", ["setIsTube"]),
    // 获取订单列表
    getOrderList(refresh) {
      if (refresh) {
        this.pageNo = 1;
      }
      this.$apis
        .orderListEmrHospitalOrder({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          keywordsType: this.keywordsType,
          keywords: this.keywords,
          startTime: this.time && this.time[0] ? this.time[0] : null,
          endTime: this.time && this.time[1] ? this.time[1] : null,
          flowStatus: this.flowStatus,
          payStatus: this.payStatus,
          educationStatus: this.educationStatus
        })
        .then(res => {
          this.mainList = res.list || [];
          this.total = res.total;
        });
    },
    // 获取健康管理计划
    getPlanList(item) {
      this.$apis
        .queryFlupPlanBySpecId({
          // specId: item.specId,
          hospitalId: this.hospitalId,
          patientType: item.patientType
        })
        .then(res => {
          this.planList = res || [];
        });
    },
    // 获取科室列表
    getEmrHospitalOrderList() {
      this.$apis
        .departmentquery({
          flupDepartment: 1,
          hospitalId: this.$global.hospital_id,
          pageNo: 1,
          pageSize: 1000
        })
        .then(res => {
          this.deptlist = res.list;
        });
    },
    // 根据科室id获取随访/慢病组
    getSystemManagequeryFlupGroupList(id) {
      this.$apis
        .systemManagequeryFlupGroupByDeptId({
          deptId: id
        })
        .then(res => {
          this.grouplist = res;
        });
    },
    // 根据组id查随访/慢病医生
    getQueryFlupGroupMembersByGroupList(id) {
      this.$apis
        .systemManagequeryFlupGroupMembersByGroupId({
          groupId: id
        })
        .then(res => {
          this.userList = res;
        });
    },
    // 取消
    handleClose() {
      this.ruleForm.executiveDeptId = "";
      this.ruleForm.fuGroupId = "";
      this.$refs.ruleFormRef && this.$refs.ruleFormRef.resetFields();
      this.dialogVisible = false;
    },
    // 完成宣教
    education(row) {
      this.$confirm("确定已完成宣教？", "完成宣教", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$apis
            .orderCompleteTheMission({
              platOrderNo: row.serialNo
            })
            .then(res => {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.getOrderList();
            });
        })
        .catch(() => {});
    },
    // 患者拒绝
    refuse(row) {
      this.$confirm("确定患者已拒绝吗？", "患者拒绝", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$apis
            .orderPatientRejection({
              platOrderNo: row.serialNo
            })
            .then(res => {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.getOrderList();
            });
        })
        .catch(() => {});
    },
    // 手动结案
    closeCase(row) {
      this.$confirm("确定已完成全部健康管理服务？", "结案", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$apis
            .closeCase({
              platOrderNo: row.serialNo
            })
            .then(res => {
              this.$message({
                message: "操作成功",
                type: "success"
              });
              this.getOrderList();
            });
        })
        .catch(() => {});
    },
    // 登记
    registration(row) {
      let urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + "/pc";
      }
      localStorage.setItem("activeName", 9);
      window.parent.postMessage(
        JSON.stringify({
          method: "addTab",
          url:
            urlx +
            `/#/healtharchives?userId=${row.patientId}&name=${
              row.patientName
            }&sex=${row.patientSex}&age=${
              row.patientAge
            }岁&dateTime=${this.$utils.formatDate(
              row.flupPlanCreateTime
            )}&phone=${row.patientPhone}&serialNo=${
              row.patientPlanSerialNo
            }&flupPlanId=${row.flupPlanId}&activeName=9&recordSerialNo=${
              row.recordSerialNo
            }`,
          title: "健康档案"
        }),
        "*"
      );
    },
    // 入组
    enrollment(item) {
      if (item.planCondition) {
        this.$confirm(
          "患者：" +
            item.patientName +
            "已入组" +
            item.planCondition +
            "计划，继续执行入组操作？",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.getPlanList(item);
            this.editObj = item;
            this.dialogVisible = true;
          })
          .catch(() => {
            return false;
          });
      } else {
        this.getPlanList(item);
        this.editObj = item;
        this.dialogVisible = true;
      }
    },
    determine() {
      this.$refs.ruleFormRef.validate(valid => {
        if (valid) {
          // 根据入组患者记录id 获取用户信息
          this.$apis
            .getPatientInfoBySerialNo({
              serialNo: this.editObj.recordSerialNo,
              patientTypeCode:
                this.editObj.patientType == 1
                  ? "DISCHARGE_PATIENT"
                  : "OUT_PATIENT"
            })
            .then(res => {
              this.$apis
                .orderPatientEnrollment(this.editObj.serialNo, {
                  patientTypeCode:
                    this.editObj.patientType == 1
                      ? "DISCHARGE_PATIENT"
                      : "OUT_PATIENT",
                  hospitalId: this.hospitalId,
                  flupPlanId: this.ruleForm.flupPlanId,
                  fuDoctorId: this.ruleForm.userId,
                  fuDoctorName: this.getName(
                    this.ruleForm.userId,
                    this.userList
                  ),
                  groupPatients: [
                    {
                      deptName: res.deptName, // 科室名称
                      deptCode: res.deptCode, // 科室代码
                      dateOfBirth: res.dateOfBirth, // 出生日期
                      idNo: res.idNo, // ？
                      packageCode: res.packageCode, //
                      userId: res.userId, // 患者userID
                      patientName: res.patientName, // 患者姓名
                      groupPatientRecordSerialNo: res.serialNo,
                      groupPatientRecordTime: res.recordDatetime
                    }
                  ]
                })
                .then(res => {
                  let succeedCount = 0;
                  let errorList = [];
                  for (let i in res) {
                    if (res[i].groupCount == 0) {
                      errorList.push(res[i]);
                    } else {
                      succeedCount += res[i].groupCount;
                    }
                  }
                  if (succeedCount > 0) {
                    this.$message({
                      message: "操作成功，共生成 " + succeedCount + " 条任务",
                      type: "success"
                    });
                    this.handleClose();
                    this.getOrderList();
                  }
                  if (errorList.length > 0) {
                    const h = this.$createElement;
                    this.$notify.error({
                      title: "失败",
                      duration: 0,
                      message: h("NewPatientAlert", {
                        props: {
                          errorList
                        }
                      })
                    });
                  }
                });
            });
        }
      });
    },
    flupPlanIdChange(v) {
      if (v) {
        // 获取随访计划详情
        this.$apis.queryFlupPlanDetail(v).then(res => {
          this.ruleForm.executiveDeptId = res.executiveDeptId; // 执行科室id
          this.ruleForm.fuGroupId = res.fuGroupId; // 随访id
          this.ruleForm.userId = res.fuDoctorId; // 随访医生ID
          this.getEmrHospitalOrderList();
          this.getSystemManagequeryFlupGroupList(res.executiveDeptId);
          this.getQueryFlupGroupMembersByGroupList(res.fuGroupId);
        });
      }
    },
    // 导出
    exportHospitalOrder(event) {
      event.target.blur();
      if (event.target.nodeName == "SPAN") {
        event.target.parentNode.blur();
      }
      this.$apis
        .exportHospitalOrder({
          keywordsType: this.keywordsType,
          keywords: this.keywords,
          startTime: this.time && this.time[0] ? this.time[0] : null,
          endTime: this.time && this.time[1] ? this.time[1] : null,
          flowStatus: this.flowStatus,
          payStatus: this.payStatus,
          educationStatus: this.educationStatus
        })
        .then(res => {
          let url = window.URL.createObjectURL(
            // data为后端返回的文件流,type 属性值根据下载文件的格式进行定义
            new Blob([res], { type: "application/ms-excel" })
          );
          // 进行基本思路的操作
          let link = document.createElement("a");
          link.href = url;
          link.download = "医院订单.xlsx";
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    },
    /**
     * 分页查询
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.getOrderList(true);
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getOrderList();
    },
    getName(id, arr) {
      let newArr = arr.filter(item => {
        return item.userId == id;
      });
      if (newArr.length === 1) return newArr[0].realName;
      return null;
    },
    getName1(id, arr) {
      let newArr = arr.filter(item => {
        return item.value == id;
      });
      if (newArr.length === 1) return newArr[0].name;
      return null;
    }
  }
};
</script>
<style lang="scss" scoped>
.order_management {
  margin: 0 24px 62px;
  display: flex;
  flex-direction: column;
  .header {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: #f2f2f2;
    padding-right: 20px;
    margin-bottom: 10px;
    .search {
      display: flex;
      flex-wrap: wrap;
    }
    section {
      display: flex;
      align-items: center;
      margin: 10px 0 10px 20px;
      .title {
        margin-right: 14px;
      }
    }
  }
  .order_main {
    flex: 1;
    .fpimgbox {
      width: 100%;
      padding-top: 50px;
      img {
        width: 300px;
        height: 350px;
        display: block;
        margin: 0 auto;
      }
    }
    .collapse-item {
      flex: 1;
      display: flex;
      section {
        margin-left: 20px;
        .value {
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.2px;
          color: #333333;
        }
      }

      .button {
        display: flex;
        align-items: center;
        div {
          font-size: 12px;
          height: 20px;
          line-height: 20px;
          border-radius: 10px;
          padding: 0 5px;
          background: #f1f1f1;
          color: #999999;
        }
        .taught {
          background: #e8f2fd;
          color: #0075ff;
        }
        .enrollment {
          background: #e9f7f0;
          color: #00982d;
        }
      }

      .identifying {
        flex: 1;
        text-align: right;
        color: #333333;
        margin-right: 20px;
      }
    }
    .collapse-item-main {
      .list {
        margin-bottom: 14px;
        display: flex;
        .key {
          flex-shrink: 0;
          display: inline-block;
          width: 60px;
          text-align: right;
          margin-right: 20px;
        }
      }
      .flex {
        display: flex;
      }
    }
  }
}
</style>
<style lang="scss">
.order_management {
  .dialog {
    .el-select {
      width: 300px !important;
    }
  }
  .el-collapse-item__header {
    border: 0;
    background: #fbfbfb;
    height: 44px;
    line-height: 44px;
  }
  .order_main {
    .el-collapse {
      border: 0 !important;
      .el-collapse-item {
        margin-bottom: 20px;
        .el-collapse-item__header {
          border: 1px solid #ccc;
          // padding: 0 20px;
        }
        .el-collapse-item__wrap {
          border-left: 1px solid #ccc;
          border-right: 1px solid #ccc;
          padding: 20px;
          .el-collapse-item__content {
            padding-bottom: 0px !important;
          }
        }
      }
    }
  }
}
</style>
