<template>
  <div class="verification-records">
    <el-table
      :data="orderList"
      border
      max-height="400"
      :row-class-name="tableRowClassName"
      @row-click="rowClickEv"
    >
      <el-table-column label="序号" type="index" width="80"></el-table-column>
      <el-table-column label="购买日期" prop="createTime"></el-table-column>
      <el-table-column label="服务内容名称" prop="packageName"></el-table-column>
      <el-table-column label="规格" prop="specName"></el-table-column>
      <el-table-column label="价格">
        <template slot-scope="scope">
          {{ (scope.row.specPrice / 100).toFixed(2) }}
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="flowStatusName"></el-table-column>
    </el-table>
    <div class="verification-information">
      <div class="header">
        <span class="title">权益信息</span>
        <div
          class="button"
          @click="Edit"
          v-if="
            form.flowStatusName == '待发货' ||
              form.flowStatusName == '待收货' ||
              form.flowStatusName == '待入组' ||
              form.flowStatusName == '退款失败'
          "
        >
          编辑
        </div>
      </div>
      <el-table
        v-if="
          form.platOrderVerifyItemsList &&
            form.platOrderVerifyItemsList.length > 0
        "
        :data="form.platOrderVerifyItemsList"
        border
        stripe
      >
        <el-table-column label="权益">
          <template slot-scope="scope">
            {{
              `${scope.row.verifiedTimes}/${scope.row.totalTimes} ${scope.row.verifyItemName}`
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              :disabled="
                scope.row.verifiedTimes == scope.row.totalTimes ||
                  form.flowStatusName == '待支付' ||
                  form.flowStatusName == '管理中' ||
                  form.flowStatusName == '已取消' ||
                  form.flowStatusName == '退款中' ||
                  form.flowStatusName == '已退款' ||
                  form.flowStatusName == '退款审核中' ||
                  form.flowStatusName == '完成'
              "
              type="text"
              @click="writeOff(scope.row)"
              >核销</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div
      class="verification-information"
      v-if="
        form.platOrderVerifyLogsList && form.platOrderVerifyLogsList.length > 0
      "
    >
      <div class="header">
        <span class="title">权益使用记录</span>
      </div>
      <div class="list">
        <div
          v-for="(item, index) in form.platOrderVerifyLogsList"
          :key="index"
          class="item"
        >
          <span class="key"
            >{{ item.verifyTime }} {{ item.operatorUserName }}</span
          >
          <span class="value">{{
            item.remark
              ? `${item.operateContents}；备注 ${item.remark}`
              : `${item.operateContents}`
          }}</span>
        </div>
      </div>
    </div>
    <div
      class="nodata"
      v-if="
        (!form.platOrderVerifyItemsList ||
          form.platOrderVerifyItemsList.length < 1) &&
          (!form.platOrderVerifyLogsList ||
            form.platOrderVerifyLogsList.length < 1)
      "
    >
      <img src="../../../../assets/images/empty.png" alt="" />
    </div>
    <el-dialog
      v-if="dialogVisible"
      title="编辑项目"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      :append-to-body="true"
    >
      <el-form ref="ruleFormRef" :model="form1">
        <el-table :data="form1.platOrderVerifyItemsList" border stripe>
          <el-table-column label="项目">
            <template slot-scope="scope">
              <el-form-item
                v-if="scope.row.isEdit"
                :prop="
                  `platOrderVerifyItemsList.${scope.$index}.verifyItemCode`
                "
                :rules="{
                  required: true,
                  message: '请选择项目',
                  trigger: 'change'
                }"
              >
                <el-select
                  v-model="scope.row.verifyItemCode"
                  placeholder="请选择"
                  @change="Change"
                >
                  <el-option
                    v-for="item in DictList"
                    :key="item.serial_no"
                    :label="item.dict_name"
                    :value="item.dict_code"
                    :disabled="item.disabled"
                  ></el-option>
                </el-select>
              </el-form-item>
              <span v-else>{{ scope.row.verifyItemName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="已使用/总数">
            <template slot-scope="scope">
              <span>{{ scope.row.verifiedTimes }}/</span>
              <span :style="scope.row.times != 0 ? 'color: red;' : ''">{{
                scope.row.totalTimes + scope.row.times
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="总次数">
            <template slot-scope="scope">
              <el-input-number
                v-if="scope.row.isEdit"
                v-model="scope.row.times"
                :step="1"
                step-strictly
                :min="0"
              ></el-input-number>
              <el-input-number
                v-else
                v-model="scope.row.times"
                :step="1"
                step-strictly
                :min="scope.row.verifiedTimes - scope.row.totalTimes"
              ></el-input-number>
              <el-button
                v-if="scope.row.isEdit"
                type="text"
                @click="Delete(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form>

      <div
        style="display: flex;margin: 12px 0;font-size: 14px;color: #0283ef;cursor: pointer;"
      >
        <div @click="Add">新增项目</div>
      </div>
      <el-input
        type="textarea"
        :rows="2"
        placeholder="请输入备注"
        v-model="form1.remark"
      >
      </el-input>
      <span slot="footer">
        <el-button @click="handleClose">取 消</el-button>
        <el-button type="primary" @click="Save">保存</el-button>
      </span>
    </el-dialog>
    <!-- v-if="dialogVisible1" -->
    <el-dialog
      v-if="dialogVisible1"
      title="核销项目"
      :visible.sync="dialogVisible1"
      width="30%"
      :before-close="handleClose1"
      :append-to-body="true"
    >
      <el-table
        :data="form1.platOrderVerifyItemsList"
        border
        stripe
        style="margin-bottom: 20px;"
      >
        <el-table-column label="项目">
          <template slot-scope="scope">
            {{ scope.row.verifyItemName }}
          </template>
        </el-table-column>
        <el-table-column label="已使用/总数">
          <template slot-scope="scope">
            <span :style="scope.row.times != 0 ? 'color: red;' : ''">{{
              scope.row.verifiedTimes + scope.row.times
            }}</span>
            /{{ scope.row.totalTimes }}
          </template>
        </el-table-column>
        <el-table-column label="使用次数">
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.times"
              :step="1"
              step-strictly
              :min="1"
              :max="scope.row.totalTimes - scope.row.verifiedTimes"
            ></el-input-number>
          </template>
        </el-table-column>
      </el-table>
      <div class="time">
        <span>核销日期</span>
        <el-date-picker
          v-model="form1.verifyDate"
          type="date"
          placeholder="选择日期"
          format="yyyy-MM-dd"
          value-format="yyyy-MM-dd"
          :clearable="false"
        >
        </el-date-picker>
      </div>
      <el-input
        type="textarea"
        :rows="3"
        placeholder="请输入备注"
        v-model="form1.remark"
      >
      </el-input>
      <span slot="footer">
        <el-button @click="handleClose1">取 消</el-button>
        <el-button type="primary" @click="Save1">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "verificationRecords",
  props: {
    idNo: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      form: {},
      dialogVisible: false,
      dialogVisible1: false,
      DictList: [],
      information: [
        {
          name: "线上咨询"
        }
      ],
      orderList: [],
      form1: {},
      selectIndex: 0
    };
  },
  watch: {
    idNo: {
      handler(newVal) {
        if (!newVal) return;
        this.getAllPackageVerifyList();
      }
    }
  },
  methods: {
    /**
     * 获取订单列表
     */
    getAllPackageVerifyList() {
      this.$apis
        .getAllPackageVerifyList({
          IdNo: this.idNo
        })
        .then(res => {
          this.orderList = res;
          this.form = res[this.selectIndex];
        });
    },
    /**
     * 获取字典
     */
    getBaseDictGetDictItems() {
      this.$apis
        .BaseDictGetDictItems({
          parentId: "20240418000000000001"
        })
        .then(res => {
          this.DictList = res;
          this.Change();
        });
    },
    /**
     * 取消编辑项目
     */
    handleClose() {
      this.$refs.ruleFormRef.resetFields();
      this.dialogVisible = false;
    },
    handleClose1() {
      this.dialogVisible1 = false;
    },
    Add() {
      if (this.form1.platOrderVerifyItemsList.length >= this.DictList.length) {
        this.$message({
          type: "warning",
          message: "没有更多项目了"
        });
        return;
      }
      this.form1.platOrderVerifyItemsList.push({
        isEdit: true,
        totalTimes: 0,
        verifiedTimes: 0,
        times: 0,
        verifyItemCode: "",
        verifyItemName: "",
        verifyItemId: ""
      });
    },
    Save() {
      this.$refs.ruleFormRef.validate(valid => {
        if (valid) {
          let payOrderId = this.form.payOrderId;
          let remark = this.form1.remark;
          let platOrderVerifyItemsList = this.form1.platOrderVerifyItemsList.map(
            item => {
              console.log(item);
              return {
                times: item.times,
                verifyItemCode: item.verifyItemCode,
                verifyItemId: item.verifyItemId,
                verifyItemName: item.verifyItemName
                  ? item.verifyItemName
                  : this.getName(item.verifyItemCode)
              };
            }
          );
          this.$apis
            .updateOrInsertOrderEquity(
              platOrderVerifyItemsList,
              payOrderId,
              remark
            )
            .then(res => {
              this.handleClose();
              this.getAllPackageVerifyList();
            });
        }
      });
    },
    Save1() {
      let params = {
        times: this.form1.platOrderVerifyItemsList[0].times,
        verifyDate: this.form1.verifyDate,
        remark: this.form1.remark,
        verifyItemId: this.form1.platOrderVerifyItemsList[0].verifyItemId
      };
      this.$apis.verifyOrderEquity(params).then(res => {
        this.handleClose1();
        this.getAllPackageVerifyList();
      });
    },
    /**
     * 核销权益
     */
    writeOff(row) {
      let obj = {
        platOrderVerifyItemsList: [
          JSON.parse(
            JSON.stringify({
              ...row,
              times: 1
            })
          )
        ],
        remark: "",
        verifyDate: new Date().toISOString().slice(0, 10)
      };
      this.form1 = obj;
      this.dialogVisible1 = true;
    },
    /**
     * 编辑项目
     */
    Edit() {
      let obj = {};
      if (
        this.form &&
        this.form.platOrderVerifyItemsList &&
        this.form.platOrderVerifyItemsList.length > 0
      ) {
        obj = {
          platOrderVerifyItemsList: JSON.parse(
            JSON.stringify(
              this.form.platOrderVerifyItemsList.map(item => {
                return {
                  ...item,
                  times: 0
                };
              })
            )
          ),
          remark: ""
        };
      } else {
        obj = {
          platOrderVerifyItemsList: [
            {
              isEdit: true,
              totalTimes: 0,
              verifiedTimes: 0,
              times: 0,
              verifyItemCode: "",
              verifyItemName: "",
              verifyItemId: ""
            }
          ],
          remark: ""
        };
      }

      this.form1 = obj;
      this.getBaseDictGetDictItems();
      this.dialogVisible = true;
    },
    rowClickEv(row, column, event) {
      this.form = row;
      this.selectIndex = row.index;
    },
    tableRowClassName({ row, rowIndex }) {
      row.index = rowIndex;
      if (this.selectIndex == rowIndex) {
        return "highlight-row";
      }
    },
    Change() {
      this.DictList.forEach((item1, index) => {
        let result = this.form1.platOrderVerifyItemsList.some(item2 => {
          return item1.dict_code == item2.verifyItemCode;
        });
        if (result) {
          this.$set(this.DictList[index], "disabled", true);
          // item1.disabled = true;
          return;
        }
        // item1.disabled = false;
        this.$set(this.DictList[index], "disabled", false);
      });
    },
    getName(id) {
      let arr = this.DictList.filter(item => {
        return item.dict_code == id;
      });
      return arr[0].dict_name;
    },
    Delete(index) {
      console.log(111, this.form1.platOrderVerifyItemsList);
      if (this.form1.platOrderVerifyItemsList.length == 1) {
        this.$set(this.form1.platOrderVerifyItemsList[0], "times", 0);
        this.$set(this.form1.platOrderVerifyItemsList[0], "verifyItemCode", "");
        this.$set(this.form1.platOrderVerifyItemsList[0], "verifyItemName", "");
        this.Change();
      } else {
        this.form1.platOrderVerifyItemsList.splice(index, 1);
        this.Change();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.verification-records {
  .nodata {
    display: flex;
    justify-content: center;
  }
  .verification-information {
    margin-top: 20px;
    .header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 18px;
      .title {
        font-size: 16px;
        font-weight: bold;
        color: #333333;
      }
      .button {
        width: 60px;
        height: 32px;
        line-height: 32px;
        text-align: center;
        background: #32ae57;
        box-sizing: border-box;
        border: 1px solid #00982d;
        color: #ffffff;
        font-size: 14px;
        border-radius: 5px;
        cursor: pointer;
      }
    }
    .list {
      border: 1px solid #e6e6e6;
      .item {
        background: #ffffff;
        padding: 11px 20px;
        .key {
          margin-right: 40px;
        }
      }
      .item:nth-child(2n) {
        background: #f7f7f7;
      }
    }
  }

  .time {
    margin-bottom: 20px;
    span {
      color: #333333;
      font-size: 14px;
      margin-right: 14px;
    }
  }
}
</style>
<style lang="scss">
.verification-records {
  //.el-input-number--small {
  //  height: 32px !important;
  //}
  .el-input__inner {
    height: 40px !important;
  }
  // .el-input-number {
  //   .is-disabled {
  //     margin-top: 1px;
  //     height: 28px !important;
  //   }
  // }
  .highlight-row {
    background-color: #d9f6e1 !important;
  }
  .adds {
    display: flex;
    margin: 12px 0;
    font-size: 14px;
    color: #0283ef;
    cursor: pointer;
  }
}
</style>
