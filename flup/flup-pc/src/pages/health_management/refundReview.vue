<template>
  <div class="refund-review">
    <div class="header">
      <span>退款申请时间</span>
      <el-date-picker
        v-model="time"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="Search"
        :clearable="false"
        value-format="yyyy-MM-dd"
      >
      </el-date-picker>
      <section>
        <span>出售机构</span>
        <el-select
          v-model="sourceId"
          filterable
          clearable
          placeholder="请选择"
          @change="Search"
        >
          <el-option
            v-for="item in options1"
            :key="item.serial_no"
            :value="item.serial_no"
            :label="item.hospital_name"
          >
          </el-option>
        </el-select>
      </section>
      <section>
        <span>科室</span>
        <el-select
          v-model="packageDeptId"
          clearable
          placeholder="请选择"
          @change="Search"
        >
          <el-option
            v-for="item in deptList"
            :key="item.serialNo"
            :label="item.deptName"
            :value="item.serialNo"
          >
          </el-option>
        </el-select>
      </section>
      <section>
        <span>支付方式</span>
        <el-select
          v-model="payType"
          clearable
          placeholder="请选择"
          @change="Search"
        >
          <el-option
            v-for="item in options3"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </section>
      <section>
        <el-input
          style=" width: 380px; margin-left: 20px;"
          placeholder="请输入关键字查询"
          v-model="payNumber"
          clearable
        >
          <el-select
            style=" width: 120px;"
            v-model="payNumberType"
            slot="prepend"
            placeholder="请选择"
          >
            <el-option label="平台流水号" :value="1"></el-option>
            <el-option label="渠道流水号" :value="2"></el-option>
            <el-option label="订单编号" :value="3"></el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="Search"
          ></el-button>
        </el-input>
      </section>
      <section>
        <el-input
          style=" width: 380px; margin-left: 20px;"
          placeholder="请输入关键字查询"
          v-model="keywords"
          clearable
        >
          <el-select
            style=" width: 120px;"
            v-model="keywordsType"
            slot="prepend"
            placeholder="请选择"
          >
            <el-option label="购买者姓名" :value="1"></el-option>
            <el-option label="手机号码" :value="2"></el-option>
            <el-option label="服务内容" :value="3"></el-option>
          </el-select>
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="Search"
          ></el-button>
        </el-input>
      </section>
      <section>
        <span>审核状态</span>
        <el-select
          v-model="refundStatus"
          clearable
          placeholder="请选择"
          @change="Search"
        >
          <el-option
            v-for="item in options4"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </section>
      <section>
        <el-button type="primary" plain @click="exportHospitalOrder"
          >导出</el-button
        >
      </section>
    </div>
    <div class="d-tree">
      <el-table :data="mainList" border stripe height="100%">
        <el-table-column
          type="index"
          width="80px"
          label="序号"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="退款申请时间"
          width="140"
          prop="refundRequestTime"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="订单时间"
          prop="orderTime"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="平台流水号"
          prop="payOrderNo"
          width="120"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="渠道流水号"
          prop="thirdPartyNo"
          width="130"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="订单编号"
          prop="orderNo"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="售卖机构"
          prop="sourceName"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="科室"
          prop="packageDeptName"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="支付方式"
          width="100"
          prop="payTypeName"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="患者姓名"
          prop="patientName"
          width="120"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="手机号码"
          width="130"
          prop="patientPhone"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="服务内容"
          prop="packageName"
        ></el-table-column>

        <el-table-column show-overflow-tooltip label="规格" prop="specName">
        </el-table-column>
        <el-table-column show-overflow-tooltip label="价格">
          <template slot-scope="scope">
            {{ scope.row.orderAmount }}元
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="备注" prop="remark">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="审核状态"
          prop="flowStatusName"
        >
        </el-table-column>
        <el-table-column :width="140" label="操作">
          <template slot-scope="scope">
            <el-button @click="addClick(scope.row)" type="text"
              >订单详情</el-button
            >
          </template>
        </el-table-column>
      </el-table>
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
      class="dialog"
      title="订单详情"
      width="800px"
      :close-on-click-modal="false"
      :visible.sync="dialogVisible"
      :before-close="hide"
    >
      <!-- 买家信息 -->
      <span class="titles">买家信息</span>
      <div class="buyer-information">
        <div class="left">
          <p>
            <span class="key">患者姓名</span><span>{{ form.patientName }}</span>
          </p>
          <p>
            <span class="key">患者年龄</span><span>{{ form.patientAge }}</span>
          </p>
          <p>
            <span class="key">患者性别</span><span>{{ form.patientSex }}</span>
          </p>
        </div>
        <div class="right">
          <p>
            <span class="key">收货姓名</span
            ><span class="value">{{
              form.platPayExpressVo ? form.platPayExpressVo.contactsName : "无"
            }}</span>
          </p>
          <p>
            <span class="key">收货地址</span
            ><span class="value">{{
              form.platPayExpressVo
                ? form.platPayExpressVo.district +
                  form.platPayExpressVo.addresslocal
                : "无"
            }}</span>
          </p>
          <p>
            <span class="key">收货手机</span
            ><span class="value">{{
              form.platPayExpressVo ? form.platPayExpressVo.phone : "无"
            }}</span>
          </p>
        </div>
      </div>
      <!-- 套餐信息 -->
      <div class="package-information">
        <span class="titles">服务内容信息</span>
      </div>
      <el-table :data="form.packageList" border stripe>
        <el-table-column
          show-overflow-tooltip
          label="健康管理内容"
          prop="packageName"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="购买规格"
          prop="specName"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="价格"
          prop="price"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="购买渠道"
          prop="sourceName"
        ></el-table-column>
      </el-table>
      <!-- 订单备注 -->
      <div class="written-off" v-if="form.needExpress == 1">
        <div class="item">
          <span class="title">订单备注</span>
          <span class="content">{{ form.remark || "暂无订单备注" }}</span>
        </div>
      </div>
      <!-- 核销相关信息 -->
      <div class="written-off" v-if="form.verifyUser">
        <div class="item">
          <span class="title">核销时间</span>
          <span class="content">{{ form.verifyTime }}</span>
        </div>
        <div class="item">
          <span class="title">核销人员</span>
          <span class="content">{{ form.verifyUser }}</span>
        </div>
      </div>
      <!-- 物流信息 -->
      <div
        class="logistics-information written-off"
        v-if="
          form.needExpress == 1 &&
            form.platPayExpressVo &&
            form.platPayExpressVo.thirdPartyNo
        "
      >
        <div class="dia-header">
          物流信息
        </div>
        <div class="item">
          <span class="title">物流公司</span>
          <span class="content">
            {{ form.platPayExpressVo.expressCompanyName }}
          </span>
        </div>
        <div class="item">
          <span class="title">物流单号</span>
          <span class="content">{{ form.platPayExpressVo.thirdPartyNo }}</span>
        </div>
      </div>
      <!-- 退款申请（退款中显示）  -->
      <div
        class="logistics-information written-off"
        v-if="
          form.flowStatus == 4 ||
            form.flowStatus == 7 ||
            form.flowStatus == 8 ||
            form.flowStatus == 11
        "
      >
        <div class="dia-header">
          退款申请
        </div>
        <div
          class="refund-detail"
          v-if="this.form.platOrderLogsVoList.length > 0"
        >
          <p
            v-for="(item, index) in this.form.platOrderLogsVoList"
            :key="index"
          >
          <template v-if="item.actionType == 1">
              【患者发起退款】退款原因：{{ item.remark }}。待退款人员审核。 ({{
                item.operateTime
              }})
            </template>
            <template v-if="item.actionType == 2">
              【患者取消退款】 ({{ item.operateTime }})
            </template>
            <template v-if="item.actionType == 3">
              【{{item.operatorName}}同意退款申请】({{ item.operateTime }})
            </template>
            <template v-if="item.actionType == 4">
              【{{item.operatorName}}拒绝退款申请】拒绝原因：{{ item.remark }} ({{
                item.operateTime
              }})
            </template>
            <template v-if="item.actionType == 5">
              【{{item.operatorName}}同意退款请求】退款金额{{
                (form.reductionFee/100).toFixed(2)
              }}元。退款备注：{{ item.remark.split(",")[0] }}。({{
                item.operateTime
              }})
            </template>
            <template v-if="item.actionType == 6">
              【{{item.operatorName}}发起退款审核请求】{{ item.remark.split(",")[0] }}。{{
                item.remark.split(",")[1]
              }}。待审核人员审核。({{ item.operateTime }})
            </template>
            <template v-if="item.actionType == 7">
              【{{item.operatorName}}拒绝退款请求】拒绝原因：{{ item.remark }} ({{
                item.operateTime
              }})
            </template>
          </p>
        </div>
      </div>
      <!-- 退款信息 -->
      <div
        class="logistics-information written-off"
        v-if="
          form.needExpress == 1 &&
            form.platOrderRefundVo &&
            form.platOrderRefundVo.returnAddress
        "
      >
        <div class="dia-header">
          退款信息
        </div>
        <div class="item">
          <span class="title">退款单号</span>
          <span class="content">{{
            form.platOrderRefundVo.expressNo || "待上传"
          }}</span>
        </div>
        <div class="item">
          <span class="title">物流公司</span>
          <span class="content">{{
            form.platOrderRefundVo.expressCompanyName || "待上传"
          }}</span>
        </div>
        <div class="item">
          <span class="title">退款地址</span>
          <span class="content">{{
            form.platOrderRefundVo.returnAddress || "无需物流退货"
          }}</span>
        </div>
      </div>
      <!-- 发票信息 -->
      <div class="logistics-information written-off">
        <div class="dia-header">
          发票信息
        </div>
        <div v-if="form.platOrderInvoiceTitleDto">
          <div class="item">
            <span class="title">抬头类型</span>
            <span class="content">{{
              form.platOrderInvoiceTitleDto.titleType == 1 ? "个人" : "单位"
            }}</span>
          </div>
          <div class="item">
            <span class="title">抬头名称</span>
            <span class="content">{{
              form.platOrderInvoiceTitleDto.titleName
            }}</span>
          </div>
          <div class="item" v-if="form.platOrderInvoiceTitleDto.titleType == 2">
            <span class="title">单位税号</span>
            <span class="content">{{
              form.platOrderInvoiceTitleDto.taxId
            }}</span>
          </div>
          <div
            class="item"
            v-if="form.platOrderInvoiceTitleDto.registerAddress"
          >
            <span class="title">注册地址</span>
            <span class="content">{{
              form.platOrderInvoiceTitleDto.registerAddress
            }}</span>
          </div>
          <div class="item" v-if="form.platOrderInvoiceTitleDto.registerPhone">
            <span class="title">注册电话</span>
            <span class="content">{{
              form.platOrderInvoiceTitleDto.registerPhone
            }}</span>
          </div>
          <div class="item" v-if="form.platOrderInvoiceTitleDto.depositBank">
            <span class="title">开户银行</span>
            <span class="content">{{
              form.platOrderInvoiceTitleDto.depositBank
            }}</span>
          </div>
          <div class="item" v-if="form.platOrderInvoiceTitleDto.bankAccount">
            <span class="title">银行账号</span>
            <span class="content">{{
              form.platOrderInvoiceTitleDto.bankAccount
            }}</span>
          </div>
          <div class="item">
            <span class="title">收票邮箱</span>
            <span class="content">{{
              form.platOrderInvoiceTitleDto.email
            }}</span>
          </div>
          <div class="item">
            <span class="title">申请时间</span>
            <span class="content">{{
              form.platOrderInvoiceTitleDto.createTime
            }}</span>
          </div>
        </div>
        <div v-else class="item">
          <span>无电子发票</span>
        </div>
      </div>
      <div class="notes">
        <p class="title">订单备注</p>
        <el-input
          type="textarea"
          resize="none"
          :rows="6"
          v-model="ruleForm.platRemark"
          maxlength="200"
          show-word-limit
          disabled
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button
          v-if="this.form.flowStatus == 11"
          type="info"
          @click="AgreeRefund"
          >同意退款</el-button
        >
        <el-button
          v-if="this.form.flowStatus == 11"
          type="danger"
          @click="RefusalRefund"
          >拒绝退款</el-button
        >
        <el-button @click="hide">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 同意退款弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible1"
      :close-on-click-modal="false"
      :before-close="hide1"
      width="460px"
    >
      <el-form ref="form1" :model="form1" :rules="rules" label-width="90px">
        <el-form-item label="退款金额" prop="refundAmount">
          <el-input-number
            v-model="form1.refundAmount"
            style="width: 260px;"
            controls-position="right"
            :precision="2"
            :step="0.01"
            :min="0"
            :max="(this.form.goodsFee / 100).toFixed(2) * 1"
          ></el-input-number>
          <!-- <el-input
            v-model="form1.refundAmount"
            style="width: 180px"
            placeholder="请输入退款金额"
          >
          </el-input> -->
          <span class="unit">元</span>
        </el-form-item>
        <el-form-item label="退款备注">
          <el-input
            type="textarea"
            :rows="4"
            resize="none"
            v-model="form1.remark"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hide1">取 消</el-button>
        <el-button type="primary" @click="determine1">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 拒绝退款弹窗 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible2"
      :close-on-click-modal="false"
      :before-close="hide2"
      width="460px"
    >
      <el-form ref="form2" :model="form2" :rules="rules">
        <el-form-item label="拒绝原因" prop="reason">
          <el-input
            type="textarea"
            :rows="4"
            resize="none"
            v-model="form2.reason"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hide2">取 消</el-button>
        <el-button type="primary" @click="determine2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      time: "",
      sourceId: null,
      payType: null,
      refundStatus: null,
      keywordsType: 1,
      keywords: "",
      payNumberType: 1,
      payNumber: "",
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      form: {},
      form1: {
        refundAmount: "", // 退款备注
        remark: "" // 退款金额
      },
      form2: {
        reason: ""
      },
      rules: {
        refundAmount: [
          { required: true, message: "请输入退款金额", trigger: "change" }
        ],
        reason: [
          { required: true, message: "请输入拒绝理由", trigger: "change" }
        ],
        logisticsOrders: [
          { required: true, message: "请输入物流单号", trigger: "change" }
        ],
        expressCompanyCode: [
          { required: true, message: "请选择物流公司", trigger: "change" }
        ]
      },
      mainList: [],
      mainList1: [],
      options1: [],
      options3: [
        {
          label: "微信支付",
          value: 0
        },
        {
          label: "支付宝支付",
          value: 1
        },
        {
          label: "院内收款",
          value: 2
        }
      ],
      options4: [
        {
          label: "已拒绝",
          value: 8
        },
        {
          label: "已同意",
          value: 5
        },
        {
          label: "待审核",
          value: 7
        }
      ],
      platRemark: "",
      isRefund: false,
      ruleForm: {
        platRemark: "",
        remark: "",
        logisticsOrders: "",
        expressCompanyName: "",
        expressCompanyCode: ""
      },
      deptList: [],
      packageDeptId: ""
    };
  },
  created() {
    this.time = this.getLastMonth(1);
    this.getRefundExamineList();
    this.getAllHospitalList();
    this.getDeptList();
  },
  methods: {
    /**
     * 获取医院列表
     */
    getAllHospitalList() {
      this.$apis.getAllHospitalList().then(res => {
        this.options1 = res;
      });
    },
    /**
     * 获取科室列表
     */
    getDeptList() {
      this.$apis
        .departmentgetFlupDeptByHospitalId({
          hospitalId: this.$global.hospital_id
        })
        .then(res => {
          this.deptList = res || [];
        });
    },
    /**
     * 获取退款申请审核列表
     */
    getRefundExamineList() {
      this.$apis
        .refundExamineList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          payType: !!this.payType || this.payType === 0 ? this.payType : null,
          sourceId: this.sourceId ? this.sourceId : null,
          startTime: this.time[0],
          endTime: this.time[1],
          keywordsType: this.keywords ? this.keywordsType : null,
          keywords: this.keywords,
          payNumberType: this.payNumber ? this.payNumberType : null,
          payNumber: this.payNumber,
          packageDeptId: this.packageDeptId,
          refundStatus: this.refundStatus
        })
        .then(res => {
          this.total = res.total;
          this.mainList = res.list;
        });
    },
    /**
     * 查询
     */
    Search() {
      this.pageNo = 1;
      this.getRefundExamineList();
    },
    /**
     * 获取订单详情
     */
    async addClick(row) {
      await this.$apis
        .getOrderDetail({
          orderId: row.orderNo
        })
        .then(res => {
          this.dialogVisible = true;
          this.platRemark = res.platRemark;
          this.form = res;
          this.form.packageList = [
            {
              packageName: res.packageName,
              specName: res.specName,
              price: (res.price / 100).toFixed(2),
              sourceName: res.sourceName
            }
          ];
          this.ruleForm.remark = this.form.remark;
          this.ruleForm.platRemark = this.form.platRemark;
          this.ruleForm.logisticsOrders = this.form.platPayExpressVo
            ? this.form.platPayExpressVo.thirdPartyNo
            : "";
          this.ruleForm.expressCompanyCode = this.form.platPayExpressVo
            ? this.form.platPayExpressVo.expressCompanyCode
            : "";
          this.ruleForm.expressCompanyName = this.form.platPayExpressVo
            ? this.form.platPayExpressVo.expressCompanyName
            : "";
        });
    },
    /**
     * 分页查询
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.getRefundExamineList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getRefundExamineList();
    },
    /**
     * hide
     */
    hide() {
      this.dialogVisible = false;
      this.form = {};
      // 重新获取列表数据
      this.getRefundExamineList();
    },
    /**
     * 同意退款
     */
    AgreeRefund() {
      this.dialogVisible1 = true;
      this.form1.refundAmount = this.form.platOrderRefundVo.refundAmount;
    },
    hide1() {
      this.$refs.form1.resetFields();
      this.form1.remark = ""
      this.dialogVisible1 = false;
    },
    determine1() {
      this.$refs.form1.validate(async valid => {
        if (valid) {
          this.$apis
            .confirmRefund({
              refundId: this.form.platOrderRefundVo.refundId,
              orderId: this.form.serialNo,
              refundAmount: this.form1.refundAmount,
              remark: this.form1.remark
            })
            .then(res => {
              this.$message.success("退款成功");
              this.hide1();
              this.hide();
            });
        }
      });
    },
    /**
     * 拒绝退款
     */
    RefusalRefund() {
      this.dialogVisible2 = true;
    },
    hide2() {
      this.$refs.form2.resetFields();
      this.dialogVisible2 = false;
    },
    determine2() {
      this.$refs.form2.validate(async valid => {
        if (valid) {
          this.$apis
            .rejectRefund({
              refundId: this.form.platOrderRefundVo.refundId,
              orderId: this.form.serialNo,
              reason: this.form2.reason
            })
            .then(res => {
              this.$message.success("操作成功");
              this.hide2();
              this.hide();
            });
        }
      });
    },
    /**
     * 获取近n个月的时间范围
     */
    getLastMonth(i) {
      let now = new Date();
      let year = now.getFullYear();
      let month = now.getMonth() + 1;
      let day = now.getDate();
      let dateArr = new Array(2);
      dateArr[1] = year + "-" + month + "-" + day;
      let nowMonthDay = new Date(year, month, 0).getDate(); //当前月的总天数
      if (i == 12) {
        //如果是12月，年数往前推一年<br>
        dateArr[0] = year - 1 + "-" + month + "-" + day;
      } else if (month - i <= 0) {
        // 如果前推i月小于0，年数往前推一年<br>
        dateArr[0] = year - 1 + "-" + 12 + "-" + day;
      } else {
        let endTimeMonthDay = new Date(year, parseInt(month) - i, 0).getDate();
        if (endTimeMonthDay < day) {
          // i个月前所在月的总天数小于现在的天日期
          if (day < nowMonthDay) {
            // 当前天日期小于当前月总天数
            dateArr[0] =
              year +
              "-" +
              (month - i) +
              "-" +
              (endTimeMonthDay - (nowMonthDay - day));
          } else {
            dateArr[0] = year + "-" + (month - i) + "-" + endTimeMonthDay;
          }
        } else {
          dateArr[0] = year + "-" + (month - i) + "-" + day;
        }
      }
      return dateArr;
    },
    /**
     * 订单导出
     */
    exportHospitalOrder(event) {
      event.target.blur();
      if (event.target.nodeName == "SPAN") {
        event.target.parentNode.blur();
      }
      this.$apis
        .exportExamineRefundOrders({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          payType: !!this.payType || this.payType === 0 ? this.payType : null,
          sourceId: this.sourceId ? this.sourceId : null,
          startTime: this.time && this.time[0] ? this.time[0] : null,
          endTime: this.time && this.time[1] ? this.time[1] : null,
          keywordsType: this.keywords ? this.keywordsType : null,
          keywords: this.keywords,
          payNumberType: this.payNumber ? this.payNumberType : null,
          payNumber: this.payNumber,
          packageDeptId: this.packageDeptId,
          refundStatus: this.refundStatus
        })
        .then(res => {
          let url = window.URL.createObjectURL(
            // data为后端返回的文件流,type 属性值根据下载文件的格式进行定义
            new Blob([res], { type: "application/ms-excel" })
          );
          // 进行基本思路的操作
          let link = document.createElement("a");
          link.href = url;
          link.download = "订单退款审核.xlsx";
          link.style.display = "none";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.refund-review {
  height: calc(100% - 82px);
  margin: 0 24px 20px;
  display: flex;
  flex-direction: column;
  .header {
    padding: 10px;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background-color: #fbfbfb;
    section {
      display: flex;
      align-items: center;
      margin: 10px 0 10px 30px;
    }
    span {
      margin-right: 14px;
    }
  }
  .d-tree {
    overflow-y: auto;
    flex: 1;
  }
  .dialog {
    .titles {
      display: inline-block;
      font-family: MicrosoftYaHei;
      font-size: 16px;
      font-weight: normal;
      margin-bottom: 11px;
      color: #333333;
    }
    .buyer-information {
      display: flex;
      border: 1px solid #d7dae0;
      margin-bottom: 21px;
      .left {
        width: 239px;
        background: #fbfbfb;
        border-right: 1px solid #d8d8d8;
      }
      .right {
        flex: 1;
      }
      .left,
      .right {
        padding: 19px;
        p {
          margin-bottom: 19px;
          display: flex;
        }
        p:last-child {
          margin-bottom: 0px;
        }
        .key {
          margin-right: 20px;
          width: 58px;
        }
        .value {
          flex: 1;
        }
      }
    }
    .form {
      margin-top: 20px;
    }
    .package-information {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 10px;
    }

    .written-off {
      .item {
        margin-top: 10px;
        display: flex;
        .title {
          display: inline-block;
          width: 80px;
          font-size: 14px;
          color: #333333;
        }
        .content {
          font-size: 14px;
          color: #111;
          flex: 1;
        }
      }
    }

    .logistics-information {
      margin-top: 20px;
      .dia-header {
        font-size: 16px;
        color: #333333;
        position: relative;
        width: 100%;
        padding-bottom: 14px;
        border-bottom: 1px solid #d7dae0;
      }
      // .item {
      //   margin-top: 10px;
      //   display: flex;
      //   .title {
      //     display: inline-block;
      //     width: 80px;
      //   }
      //   .content {
      //     flex: 1;
      //   }
      // }
      .buttons {
        margin-top: 10px;
      }
    }

    .notes {
      margin-top: 20px;
      .title {
        font-size: 16px;
        color: #333333;
        margin-bottom: 10px;
      }
    }
  }
  .refund-detail {
    background-color: #fbfbfb;
    padding: 10px;
    p {
      margin-bottom: 16px;
    }

    p:last-child {
      margin-bottom: 0;
    }
  }
  .unit {
    margin-left: 10px;
  }
}
</style>
<style lang="scss">
.refund-review {
  .el-button--small {
    height: auto !important;
  }
}
</style>
