<template>
  <div class="sales-order">
    <div class="header">
      <!-- <i class="el-icon-setting header-setting" @click="setting"></i> -->
      <!-- <el-button class="margin-left20 more" type="text" @click="showOrHide">{{ !hidden ? "高级筛选" : "收起" }}</el-button>
      <i style="margin-left: 30px; font-size: 20px; color: #999" class="el-icon-s-tools header-setting" @click="setting"></i>-->
      <div class="flex search-time">
        <el-select class="margin-left10 width110px select-time-key" v-model="searchTimeKey" @change="Search">
          <el-option v-for="item in timeKeyList" :key="item.label" :value="item.value" :label="item.label" :disabled="item.disabled"></el-option>
        </el-select>
        <el-date-picker
          class="select-time-val"
          type="daterange"
          v-model="searchTimeVal"
          value-format="yyyy-MM-dd"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          range-separator="至"
          clearable
          @change="Search"
        ></el-date-picker>
      </div>
      <!-- <span>订单时间</span>
      <el-date-picker v-model="time" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="Search" clearable value-format="yyyy-MM-dd">
      </el-date-picker>-->
      <section v-if="hidden">
        <span>出售机构</span>
        <el-select v-model="sourceId" filterable clearable placeholder="请选择" @change="Search">
          <el-option v-for="item in options1" :key="item.serial_no" :value="item.serial_no" :label="item.hospital_name"></el-option>
        </el-select>
      </section>
      <section>
        <span>科室</span>
        <el-select v-model="packageDeptId" filterable clearable placeholder="请选择" @change="Search">
          <el-option v-for="item in deptList" :key="item.serialNo" :label="item.deptName" :value="item.serialNo"></el-option>
        </el-select>
      </section>
      <section v-if="hidden">
        <span>支付方式</span>
        <el-select v-model="payType" clearable placeholder="请选择" @change="Search">
          <el-option v-for="item in options3" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </section>
      <section>
        <span>订单状态</span>
        <el-select v-model="flowStatus" clearable placeholder="请选择" @change="Search">
          <el-option v-for="item in options2" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </section>
      <section v-if="hidden">
        <el-input style=" width: 380px; margin-left: 20px;" placeholder="请输入关键字查询" v-model="payNumber" clearable>
          <el-select style=" width: 120px;" v-model="payNumberType" slot="prepend" placeholder="请选择">
            <el-option label="平台流水号" :value="1"></el-option>
            <el-option label="渠道流水号" :value="2"></el-option>
            <el-option label="订单编号" :value="3"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="Search"></el-button>
        </el-input>
      </section>
      <section>
        <el-input style=" width: 380px; margin-left: 20px;" placeholder="请输入关键字查询" v-model="keywords" clearable>
          <el-select style=" width: 120px;" v-model="keywordsType" slot="prepend" placeholder="请选择">
            <el-option label="购买者姓名" :value="1"></el-option>
            <el-option label="手机号码" :value="2"></el-option>
            <el-option label="服务内容" :value="3"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="Search"></el-button>
        </el-input>
      </section>
      <section v-if="hidden">
        <span>服务类型</span>
        <el-select v-model="packageType" clearable placeholder="请选择" @change="Search">
          <el-option v-for="item in optionsType" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </section>
      <!-- <section>
        <span>发票申请时间</span>
        <el-date-picker v-model="time1" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" @change="Search" clearable value-format="yyyy-MM-dd"></el-date-picker>
      </section>-->
      <!-- <section>
        
      </section>-->
      <div class="butBox">
        <el-button class="margin-left20" type="text" @click="showOrHide">{{ !hidden ? "高级筛选" : "收起" }}</el-button>
        <el-button type="primary" plain @click="exportHospitalOrder">导出</el-button>
        <i style="margin-left: 30px; font-size: 20px; color: #999" class="el-icon-s-tools" @click="setting"></i>
      </div>
    </div>

    <div class="d-tree">
      <el-table :data="mainList" border stripe height="100%">
        <el-table-column type="index" width="60px" label="序号"></el-table-column>
        <!-- <el-table-column
          show-overflow-tooltip
          label="订单时间"
          prop="createTime"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="患者姓名"
          prop="patientName"
          width="100"
        ></el-table-column>-->
        <!-- <el-table-column
          show-overflow-tooltip
          label="平台流水号"
          prop="payOrderNo"
          width="120"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="渠道流水号"
          prop="thirdPartyNo"
          width="120"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="订单编号"
          prop="serialNo"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="售卖机构"
          prop="sourceName"
        >
        </el-table-column>
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
          label="订单状态"
          width="100"
          prop="flowStatusName"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="手机号码"
          width="130"
          prop="patientPhone"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="套餐"
          prop="packageName"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="规格"
          prop="specName"
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="价格">
          <template slot-scope="scope">
            {{ (scope.row.goodsFee / 100).toFixed(2) }}元
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="退款时间"
          width="120px"
          prop="reductionTime"
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="退款金额">
          <template slot-scope="scope">
            {{ (scope.row.reductionFee / 100).toFixed(2) }}元
          </template>
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="发票申请时间"
          width="120px"
          prop="invoiceCreateTime"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="备注"
          prop="remark"
        ></el-table-column>-->
        <el-table-column show-overflow-tooltip :min-width="120" v-for="item in this.baseColumnsV2" :key="item.index" :prop="item.fieldName" :label="item.displayName">
          <template slot-scope="scope">
            <span v-if="item.fieldName == 'specPrice' || item.fieldName == 'reductionFee'|| item.fieldName == 'fee'">{{ (scope.row[item.fieldName] / 100).toFixed(2) }}元</span>
            <span v-else-if="item.fieldName == 'lastReplyIntervalTime'">{{ scope.row[item.fieldName]?scope.row['packageType']==1?scope.row[item.fieldName]+'分钟前':'':'' }}</span>
            <span v-else-if="item.fieldName == 'flowStatusName'&&scope.row.flowStatus=='5'">已完成</span>
            <span v-else-if="item.fieldName == 'flowStatusName'&&scope.row.flowStatus=='12'">咨询中</span>
            <span v-else-if="item.fieldName == 'flowStatusName'&&scope.row.flowStatus=='13'">待回复</span>
            <span v-else>{{ scope.row[item.fieldName] }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="chatRecord(scope.row)" type="text" v-if="scope.row.packageType==1">聊天记录</el-button>
            <el-button @click="addClick(scope.row)" type="text">订单详情</el-button>
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
    <div class="statistics">
      <div>订单信息统计：</div>
      <div class="statistics-item">总金额：{{(orderStatistics.orderFee/ 100).toFixed(2)}}元</div>
      <div class="statistics-item">退款金额:{{(orderStatistics.refundedOrderFee/ 100).toFixed(2)}}元</div>
      <div class="statistics-item">有效金额: {{(orderStatistics.effectiveOrderFee/ 100).toFixed(2)}}元</div>
    </div>
    <el-dialog class="dialog" title="订单详情" width="800px" :close-on-click-modal="false" :visible.sync="dialogVisible" :before-close="hide">
      <span class="titles">买家信息</span>
      <div class="buyer-information">
        <div class="left">
          <p>
            <span class="key">患者姓名</span>
            <span>{{ form.patientName }}</span>
          </p>
          <p>
            <span class="key">患者年龄</span>
            <span>{{ form.patientAge }}</span>
          </p>
          <p>
            <span class="key">患者性别</span>
            <span>{{ form.patientSex }}</span>
          </p>
        </div>
        <div class="right">
          <p>
            <span class="key">收货姓名</span>
            <span class="value">
              {{
              form.platPayExpressVo ? form.platPayExpressVo.contactsName : "无"
              }}
            </span>
          </p>
          <p>
            <span class="key">收货地址</span>
            <span class="value">
              {{
              form.platPayExpressVo
              ? form.platPayExpressVo.district +
              form.platPayExpressVo.addresslocal
              : "无"
              }}
            </span>
          </p>
          <p>
            <span class="key">收货手机</span>
            <span class="value">
              {{
              form.platPayExpressVo ? form.platPayExpressVo.phone : "无"
              }}
            </span>
          </p>
        </div>
      </div>
      <div class="package-information">
        <span class="titles">服务内容信息</span>
        <el-button type="info" @click="writeOff" v-if="form.flowStatus == 3 && form.needExpress == 0">核销</el-button>
      </div>
      <el-table :data="form.packageList" border stripe>
        <el-table-column show-overflow-tooltip label="健康管理服务内容" prop="packageName"></el-table-column>
        <el-table-column show-overflow-tooltip label="购买规格" prop="specName"></el-table-column>
        <el-table-column show-overflow-tooltip label="价格" prop="price">
          <template slot-scope="scope">
            <div>{{ scope.row.price}}元</div>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="购买渠道" prop="sourceName"></el-table-column>
      </el-table>
      <el-form
        class="form"
        ref="form"
        :model="ruleForm"
        label-width="90px"
        label-position="left"
        :rules="rules"
        v-if="
          (form.flowStatus == 1 || form.flowStatus == 2) &&
            form.needExpress == 1
        "
      >
        <el-form-item label="物流公司" prop="expressCompanyCode">
          <el-select v-model="ruleForm.expressCompanyCode" style="width: 300px;" :disabled="isEdit">
            <el-option v-for="item in logisticsCompanyList" :key="item.dict_code" :label="item.dict_name" :value="item.dict_code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="logisticsOrders">
          <el-input v-model="ruleForm.logisticsOrders" style="width: 300px;" placeholder="请输入物流单号" :disabled="isEdit"></el-input>
          <el-button style="margin-left: 10px;" type="text" @click="sendOut" v-if="form.flowStatus == 1">发货</el-button>
          <el-button style="margin-left: 10px;" type="text" @click="Edit">修改</el-button>
        </el-form-item>
      </el-form>
      <!-- 患者订单备注 -->
      <div v-if="form.needExpress == 1" class="written-off">
        <div class="item">
          <span class="title">订单备注</span>
          <span class="content">
            {{
            form.remark ? form.remark : "暂无订单备注"
            }}
          </span>
        </div>
      </div>

      <!-- <el-form
        class="form"
        :model="form"
        label-position="left"
        label-width="90px"
        v-if="form.needExpress == 1"
      >
        <el-form-item label="订单备注">
          <el-input
            type="textarea"
            :rows="3"
            style="width: 400px;"
            v-model="form.remark"
            disabled
          >
          </el-input> </el-form-item
      ></el-form>-->
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
        <div class="dia-header">物流信息</div>
        <div class="item">
          <span class="title">物流公司</span>
          <span class="content">{{ form.platPayExpressVo.expressCompanyName }}</span>
        </div>
        <div class="item">
          <span class="title">物流单号</span>
          <span class="content">{{ form.platPayExpressVo.thirdPartyNo }}</span>
        </div>
      </div>
      <!-- 退款申请 退款中显示 -->
      <div
        class="logistics-information written-off"
        v-if="
          form.flowStatus == 4 ||
            form.flowStatus == 7 ||
            form.flowStatus == 8 ||
            form.flowStatus == 11
        "
      >
        <div class="dia-header">退款申请</div>
        <!-- <div class="item" style="margin-bottom: 10px;">
          <span class="title">退款原因</span>
          <span class="content">{{
            form.platOrderRefundVo ? form.platOrderRefundVo.refundReason : ""
          }}</span>
        </div>-->
        <div class="refund-detail" v-if="this.form.platOrderLogsVoList.length > 0">
          <p v-for="(item, index) in this.form.platOrderLogsVoList" :key="index">
            <template v-if="item.actionType == 1">
              【患者发起退款】退款原因：{{ item.remark }}。待退款人员审核。 ({{
              item.operateTime
              }})
            </template>
            <template v-if="item.actionType == 2">【患者取消退款】 ({{ item.operateTime }})</template>
            <template v-if="item.actionType == 3">【{{ item.operatorName }}同意退款申请】({{ item.operateTime }})</template>
            <template v-if="item.actionType == 4">
              【{{ item.operatorName }}拒绝退款申请】拒绝原因：{{
              item.remark
              }}
              ({{ item.operateTime }})
            </template>
            <template v-if="item.actionType == 5">
              【{{ item.operatorName }}同意退款请求】退款金额{{
              (form.reductionFee / 100).toFixed(2)
              }}元。退款备注：{{ item.remark.split(",")[0] }}。({{
              item.operateTime
              }})
            </template>
            <template v-if="item.actionType == 6">
              【{{ item.operatorName }}发起退款审核请求】{{
              item.remark.split(",")[0]
              }}。{{ item.remark.split(",")[1] }}。待审核人员审核。({{
              item.operateTime
              }})
            </template>
            <template v-if="item.actionType == 7">
              【{{ item.operatorName }}拒绝退款请求】拒绝原因：{{
              item.remark
              }}
              ({{ item.operateTime }})
            </template>
          </p>
        </div>
        <div class="buttons" v-if="form.flowStatus == 4 && isRefundAuthority">
          <el-button type="info" size="small" @click="agree" :disabled="
              form.platOrderRefundVo && form.platOrderRefundVo.refundStatus != 1
            ">同意退款申请</el-button>
          <el-button size="small" @click="refuse" :disabled="
              form.platOrderRefundVo && form.platOrderRefundVo.refundStatus != 1
            ">拒绝退款申请</el-button>
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
        <div class="dia-header">退款信息</div>
        <div class="item">
          <span class="title">退款单号</span>
          <span class="content">
            {{
            form.platOrderRefundVo.expressNo || "待上传"
            }}
          </span>
        </div>
        <div class="item">
          <span class="title">物流公司</span>
          <span class="content">
            {{
            form.platOrderRefundVo.expressCompanyName || "待上传"
            }}
          </span>
        </div>
        <div class="item">
          <span class="title">退款地址</span>
          <!-- <span class="content">{{
            form.platOrderRefundVo.returnAddress || "无需物流退货"
          }}</span>-->
        </div>
      </div>
      <!-- 发票信息 -->
      <div class="logistics-information written-off">
        <div class="dia-header">
          发票信息
          <div>
            <el-button @click="hideEditTitle" v-if="form.platOrderInvoiceTitleDto && isEdit2">取消</el-button>
            <el-button type="info" v-if="form.platOrderInvoiceTitleDto" @click="editInvoiceInformation">{{ isEdit2 ? "保存" : "修改" }}</el-button>
          </div>
        </div>
        <div v-if="form.platOrderInvoiceTitleDto && isEdit2 == false">
          <div class="item">
            <span class="title">抬头类型</span>
            <span class="content">
              {{
              form.platOrderInvoiceTitleDto.titleType == 1 ? "个人" : "单位"
              }}
            </span>
          </div>
          <div class="item">
            <span class="title">抬头名称</span>
            <span class="content">
              {{
              form.platOrderInvoiceTitleDto.titleName
              }}
            </span>
          </div>
          <div class="item" v-if="form.platOrderInvoiceTitleDto.titleType == 2">
            <span class="title">单位税号</span>
            <span class="content">
              {{
              form.platOrderInvoiceTitleDto.taxId
              }}
            </span>
          </div>
          <div class="item" v-if="form.platOrderInvoiceTitleDto.registerAddress">
            <span class="title">注册地址</span>
            <span class="content">
              {{
              form.platOrderInvoiceTitleDto.registerAddress
              }}
            </span>
          </div>
          <div class="item" v-if="form.platOrderInvoiceTitleDto.registerPhone">
            <span class="title">注册电话</span>
            <span class="content">
              {{
              form.platOrderInvoiceTitleDto.registerPhone
              }}
            </span>
          </div>
          <div class="item" v-if="form.platOrderInvoiceTitleDto.depositBank">
            <span class="title">开户银行</span>
            <span class="content">
              {{
              form.platOrderInvoiceTitleDto.depositBank
              }}
            </span>
          </div>
          <div class="item" v-if="form.platOrderInvoiceTitleDto.bankAccount">
            <span class="title">银行账号</span>
            <span class="content">
              {{
              form.platOrderInvoiceTitleDto.bankAccount
              }}
            </span>
          </div>
          <div class="item">
            <span class="title">收票邮箱</span>
            <span class="content">
              {{
              form.platOrderInvoiceTitleDto.email
              }}
            </span>
          </div>
          <div class="item">
            <span class="title">申请时间</span>
            <span class="content">
              {{
              form.platOrderInvoiceTitleDto.createTime
              }}
            </span>
          </div>
        </div>
        <div class="invoice-informationRef" v-else-if="form.platOrderInvoiceTitleDto && isEdit2 == true">
          <el-form ref="invoiceInformationRef" :model="invoiceInformation" :rules="rules" label-width="100px">
            <el-form-item label="抬头类型">
              <template>
                <el-radio-group v-model="invoiceInformation.titleType" disabled>
                  <el-radio :label="1">个人</el-radio>
                  <el-radio :label="2">单位</el-radio>
                </el-radio-group>
              </template>
            </el-form-item>
            <el-form-item label="抬头名称" prop="titleName">
              <el-input placeholder="请输入抬头名称" v-model="invoiceInformation.titleName"></el-input>
            </el-form-item>
            <el-form-item v-if="invoiceInformation.titleType == 2" label="单位税号" prop="taxId">
              <el-input placeholder="请输入单位税号" v-model="invoiceInformation.taxId"></el-input>
            </el-form-item>
            <el-form-item label="注册地址" v-if="invoiceInformation.registerAddress">
              <el-input placeholder="请输入注册地址" v-model="invoiceInformation.registerAddress"></el-input>
            </el-form-item>
            <el-form-item label="注册电话" v-if="invoiceInformation.registerPhone">
              <el-input placeholder="请输入注册电话" v-model="invoiceInformation.registerPhone"></el-input>
            </el-form-item>
            <el-form-item label="开户银行" v-if="invoiceInformation.depositBank">
              <el-input placeholder="请输入开户银行" v-model="invoiceInformation.depositBank"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" v-if="invoiceInformation.bankAccount">
              <el-input placeholder="请输入银行账号" v-model="invoiceInformation.bankAccount"></el-input>
            </el-form-item>
            <el-form-item label="收票邮箱" prop="email">
              <el-input placeholder="请输入收票邮箱" v-model="invoiceInformation.email"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-else class="item">
          <span>无需电子发票</span>
        </div>
      </div>
      <!-- 核销权益 -->
      <div class="logistics-information written-off">
        <div class="dia-header">权益信息</div>
        <div v-if="platOrderVerifyItemsList || platOrderVerifyLogsList">
          <div class="project">
            <div class="item" v-for="item in platOrderVerifyItemsList">
              <div class="li"></div>
              {{ item.verifiedTimes }}/{{ item.totalTimes }}次{{
              item.verifyItemName
              }}
            </div>
          </div>
          <div class="record" @click="SeeRecordList">
            权益使用记录
            <img :style="isShow ? ' transform: rotate(180deg);' : ''" src="../../assets/images/expand.png" alt />
          </div>
          <div v-show="isShow" class="project">
            <div v-if="platOrderVerifyLogsList && platOrderVerifyLogsList.length > 0">
              <div class="items" v-for="item in platOrderVerifyLogsList">
                <span>
                  {{ item.verifyTime || item.operateTime }}
                  {{ item.operatorUserName }}
                </span>
                {{ item.operateContents
                }}{{ item.remark ? `；备注 ${item.remark}；` : "" }}
              </div>
            </div>
            <div v-else>暂无数据</div>
          </div>
        </div>
        <div v-else class="item">
          <span>暂无权益信息</span>
        </div>
      </div>
      <!-- 订单备注 -->
      <div class="notes">
        <p class="title">订单备注</p>
        <el-input type="textarea" resize="none" :rows="6" placeholder="请输入订单备注" v-model="ruleForm.platRemark" maxlength="200" show-word-limit></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hide">取 消</el-button>
        <el-button
          @click="refund"
          v-if="
            isRefundAuthority &&
              ['1', '2', '3', '4', '5', '8', '9','12','13'].includes(form.flowStatus) &&
              (!form.platOrderRefundVo ||
                (form.platOrderRefundVo &&
                  form.platOrderRefundVo.refundStatus != 7))
          "
          :loading="isLoading"
        >退款</el-button>
        <el-button type="primary" @click="Determine">保存</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible1" :close-on-click-modal="false" :before-close="hide1" width="460px">
      <el-form ref="form1" :model="form1" :rules="rules">
        <el-form-item label="请输入退款地址、收货人信息" prop="address">
          <el-input type="textarea" :rows="4" resize="none" v-model="form1.address"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hide1">取 消</el-button>
        <el-button type="primary" @click="determine1">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible2" :close-on-click-modal="false" :before-close="hide2" width="460px">
      <el-form ref="form2" :model="form2" :rules="rules" label-position="left">
        <el-form-item label="拒绝理由" prop="reason">
          <el-input type="textarea" :rows="4" resize="none" v-model="form2.reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hide2">取 消</el-button>
        <el-button type="primary" @click="determine2">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="提示" :visible.sync="dialogVisible3" :close-on-click-modal="false" :before-close="hide3" width="460px">
      <el-form ref="refundRef" :model="refundObj" :rules="rules1" label-width="90px" label-position="left">
        <el-form-item label="退款金额" prop="refundAmount">
          <el-input-number
            v-model="refundObj.refundAmount"
            style="width: 260px;"
            controls-position="right"
            :precision="2"
            :step="0.01"
            :min="0"
            :max="(this.form.goodsFee / 100).toFixed(2) * 1"
          ></el-input-number>
          <span style="margin-left:10px">元</span>
        </el-form-item>
        <div class="refund-amount">请输入退款原因及相应权益使用情况，后续由审核人员进行审核</div>
        <el-form-item prop="reason" label-width="0px">
          <el-input type="textarea" :rows="4" resize="none" v-model="refundObj.reason"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hide3">取 消</el-button>
        <el-button type="primary" @click="determine3" :loading="isRefund2">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="设置显示字段" :visible.sync="dialogField" width="90%" top="10vh" :close-on-click-modal="false" :close-on-press-esc="false">
      <div style="padding: 20px" class="flex">
        <div class="checklistbox" style="flex: 4">
          <h4 style="color: #666">可选字段</h4>
          <div>
            <div v-for="(item, index) in modules" :key="index">
              <h3 style="padding: 10px 0px">{{ item.moduleName }}</h3>
              <div class="checkxbox">
                <el-checkbox-group v-model="checkList">
                  <template v-for="(item2, index) in item.columns">
                    <el-checkbox
                      v-if="isShowMerge
                        ? item2.displayName != '床号' &&
                        item2.displayName != '年龄' &&
                        item2.displayName != '患者性别' &&
                        item2.displayName != '患者姓名'
                        : true
                      "
                      :key="index"
                      :label="item2.id"
                    >{{ item2.displayName }}</el-checkbox>
                  </template>
                </el-checkbox-group>
              </div>
            </div>
          </div>
          <h4 class="margin-top20" style="color: #666; display: inline-block" v-show="false">首字段合并设置</h4>
          <el-switch class="margin-left10" v-model="isShowMerge" v-show="false"></el-switch>
          <div v-if="isShowMerge" class="checkxbox margin-top10" v-show="false">
            <el-checkbox-group v-model="mergeConfigList">
              <el-checkbox v-for="(item2, index) in mergeList" :key="index" :label="item2.id">
                {{ item2.displayName
                }}
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
        <div class="xdzd" style="flex: 1">
          <h4 style="color: #666; text-align: center">当前选定字段</h4>
          <el-tree :data="baseColumns" node-key="id" default-expand-all draggable @node-drag-start="dragTheStart" @node-drop="dragTheEnter" :expand-on-click-node="false">
            <span style="width: 100%; padding: 5px 0px" class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.displayName }}</span>
              <span style="margin-bottom: 3px">
                <el-button icon="el-icon-close" type="text" @click="() => remove(node, data)"></el-button>
              </span>
            </span>
          </el-tree>
          <h4 style="color: #666; text-align: center; margin-top: 40px" v-show="false">首字段选定字段</h4>
          <el-tree
            :data="mergeConfigColumns"
            node-key="id"
            default-expand-all
            draggable
            @node-drag-start="dragTheStartMerge"
            @node-drop="dragTheEnterMerge"
            :expand-on-click-node="false"
            v-show="false"
          >
            <span style="width: 100%; padding: 5px 0px" class="custom-tree-node" slot-scope="{ node, data }">
              <span>{{ data.displayName }}</span>
              <span style="margin-bottom: 3px">
                <el-button icon="el-icon-close" type="text" @click="() => remove(node, data)"></el-button>
              </span>
            </span>
          </el-tree>
        </div>
      </div>
      <span slot="footer">
        <el-button @click="dialogField = false">取 消</el-button>
        <el-button type="primary" @click="bc">确 定</el-button>
      </span>
    </el-dialog>
    <el-drawer :visible.sync="drawer" direction="rtl" :with-header="false" :before-close="handleClose" :destroy-on-close="true" class="drawer" size="774px">
      <div class="order-header">
        <div class="order-title">
          <span>聊天记录</span>
          <img @click="handleClose" src="../../assets/images/icon/close.png" alt />
        </div>
        <div class="order-info">
          <span class="title-name">{{ this.orderInfo.patientName }}</span>
          <span>订单时间：{{ this.orderInfo.createTime }}</span>
        </div>
      </div>
      <div class="message-list" ref="chatWindow" @scroll="handleScroll">
        <div v-if="isEnd" class="nomore">没有更多了</div>
        <div class="t-message" v-for="(message, index) in messageList" :key="index" :ref="message.ID">
          <satisfaction
            v-if="
                message.type == 'TIMCustomElem' && message.content.data.type == 11
              "
            :message="message"
            @seeSatisfactionDetail="$seeSatisfactionDetail"
          ></satisfaction>
          <!-- 自定义系统消息 -->
          <div
            class="custom-message"
            v-if="
                !message.isRevoked &&
                  message.type == 'TIMCustomElem' &&
                  message.content &&
                  message.content.data &&
                  message.content.data.type == 4&&!message.content.data.text.consultPurpose
              "
          >{{ message.content.data.text }}</div>
          <div class="custom-message" v-if="message.isRevoked">{{ message.name }}撤回了一条消息</div>
          <graphic-message v-if="
                    message.type == 'TIMCustomElem' &&
                    message.content.desc == '健康档案'" :message="message"></graphic-message>
          <!-- 左边消息 -->
          <div
            class="message-left"
            v-if="
                !message.isSend &&
                  !message.isRevoked &&
                  (message.type == 'TIMTextElem' ||
                    message.type == 'TIMImageElem' ||
                    message.type == 'TIMVideoFileElem' ||
                    message.type == 'TIMCustomElem' ||
                    message.type === 'TIMSoundElem' ||
                    (message.type === 'TIMVideoFileElem' &&
                      message.content.data.type == 3))
              "
          >
            <div style="display: flex;flex-direction: column;">
              <div class="name">{{ message.name }} {{ timestampToDate(message.time) }}</div>
              <div style="display: flex; flex-direction: row;">
                <!-- 头像 -->
                <img
                  v-if="
                      message.type != 'TIMCustomElem' ||
                        (message.type == 'TIMCustomElem' &&
                          (message.content.data.type == 12 ||
                            message.content.data.type == 13))
                    "
                  class="doctor-info-image-left"
                  src="../../assets/images/avatar-left.png"
                />
                <!-- 文字，自定义表情消息 -->
                <expressionMessage :isMine="message.isSend" v-if="message.type == 'TIMTextElem'" :message="message.content"></expressionMessage>
                <!-- 图片消息 -->
                <ImageMessage v-if="message.type == 'TIMImageElem'" class="image" :ImgUrl="message.bigImage" :messageList="messageList"></ImageMessage>
                <!-- 视频消息 -->
                <VideoMessage v-if="message.type == 'TIMVideoFileElem'" :message="message"></VideoMessage>
                <fileMessage
                  v-if="
                      message.type == 'TIMCustomElem' &&
                        message.content.data.type == 12
                    "
                  :message="message"
                  :isMine="message.isSend"
                ></fileMessage>
                <callMessage
                  v-if="
                      message.type == 'TIMCustomElem' &&
                        message.content.data.type == 13
                    "
                  :message="message"
                  :isMine="message.isSend"
                ></callMessage>
              </div>
            </div>
          </div>
          <!-- 右边消息 -->
          <div
            class="message-right"
            v-if="
                (message.isSend &&
                  !message.isRevoked &&
                  (message.type == 'TIMTextElem' ||
                    message.type == 'TIMImageElem' ||
                    message.type == 'TIMVideoFileElem' ||
                    message.type === 'TIMSoundElem')) ||
                  (message.type == 'TIMCustomElem' &&
                    message.isSend &&
                    !message.isRevoked &&
                    message.content &&
                    message.content.data &&
                    (message.content.data.type == 12 ||
                      message.content.data.type == 3 ||
                      message.content.data.type == 2 ||
                      message.content.data.type == 6 ||
                      message.content.data.type == 7 ||
                      message.content.data.type == 13))
              "
          >
            <div style="display: flex;flex-direction: column;">
              <div class="my-name">{{ message.name || "小雅" }} {{ timestampToDate(message.time) }}</div>
              <div style="display: flex; flex-direction: row-reverse;">
                <!-- 头像 -->
                <img
                  v-if="
                      message.type == 'TIMCustomElem' &&
                        message.content.data.type == 7
                    "
                  class="doctor-info-image-right"
                  src="../../assets/images/xiaoya.png"
                />
                <img v-else class="doctor-info-image-right" src="../../assets/images/avatar-right.png" />

                <!-- 文字，自定义表情消息 -->
                <expressionMessage :isMine="message.isSend" v-if="message.type == 'TIMTextElem'" :message="message.content"></expressionMessage>
                <!-- 图片消息 -->
                <ImageMessage v-if="message.type == 'TIMImageElem'" class="image" :ImgUrl="message.bigImage" :messageList="messageList"></ImageMessage>
                <!-- 视频消息 -->
                <VideoMessage v-if="message.type == 'TIMVideoFileElem'" :message="message"></VideoMessage>
                <!-- 问卷消息 -->
                <questionnaireMessage
                  v-if="
                      message.type == 'TIMCustomElem' &&
                        message.content.data.type == 3
                    "
                  :message="message"
                  @seeDetail="seeDetail"
                ></questionnaireMessage>
                <!-- 健康计划消息 -->
                <planMessage
                  v-if="
                      message.type == 'TIMCustomElem' &&
                        message.content.data.type == 2
                    "
                  @seeDetail="seeDetail"
                  :message="message"
                ></planMessage>
                <!-- 套餐推荐消息 -->
                <PackageRecommendations
                  v-if="
                      message.type == 'TIMCustomElem' &&
                        message.content.data.type == 6
                    "
                  :message="message"
                ></PackageRecommendations>
                <!-- 机器人消息 -->
                <robotMessage
                  v-if="
                      message.type == 'TIMCustomElem' &&
                        message.content.data.type == 7
                    "
                  :message="message"
                ></robotMessage>
                <fileMessage
                  v-if="
                      message.type == 'TIMCustomElem' &&
                        message.content.data.type == 12
                    "
                  :message="message"
                  :isMine="message.isSend"
                ></fileMessage>
                <callMessage
                  v-if="
                      message.type == 'TIMCustomElem' &&
                        message.content.data.type == 13
                    "
                  :message="message"
                  :isMine="message.isSend"
                ></callMessage>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="last-bottom">
        <el-button @click="getPhone(1)" type="success">提醒医生</el-button>
        <el-button @click="getPhone(2)" class="blue">提醒患者</el-button>
      </div>
      <div class="satisfaction-content" v-if="showSatisfaction">
        <div class="close" @click="showSatisfaction = false">
          <img src="../../assets/images/icon/close.png" mode />
        </div>
        <div class="header">满意度调查问卷</div>
        <div class="divider-line"></div>
        <div class="list">
          <div class="item">
            <div class="key">总体满意度</div>
            <div>
              <img v-for="item in satisfactionData.sumValue" :key="item" src="../../assets/images/select-star.png" mode />
              <img v-for="item in 5 - satisfactionData.sumValue" :key="item" src="../../assets/images/star.png" mode />
            </div>
          </div>
          <div class="item">
            <div class="key">流程满意度</div>
            <div>
              <img v-for="item in satisfactionData.procedureValue" :key="item" src="../../assets/images/select-star.png" mode />
              <img v-for="item in 5 - satisfactionData.procedureValue" :key="item" src="../../assets/images/star.png" mode />
            </div>
          </div>
          <div class="item">
            <div class="key">服务满意度</div>
            <div>
              <img v-for="item in satisfactionData.serviceValue" :key="item" src="../../assets/images/select-star.png" mode />
              <img v-for="item in 5 - satisfactionData.serviceValue" :key="item" src="../../assets/images/star.png" mode />
            </div>
          </div>
        </div>
        <div class="proposal">{{ satisfactionData.advice }}</div>
      </div>
    </el-drawer>
    <el-dialog :title="callType==1?'提醒医生':'提醒患者'" :visible.sync="callDialog" width="30%" top="10vh" :close-on-click-modal="false" :close-on-press-esc="false">
      <div
        style="padding: 20px"
        class="flex"
        v-if="callType==1"
      >{{orderInfo.consultDoctorInfoDtoList?orderInfo.consultDoctorInfoDtoList[0].doctorName:''}}医生的联系电话是{{ orderInfo.consultDoctorInfoDtoList?orderInfo.consultDoctorInfoDtoList[0].phone:'' }}</div>
      <div style="padding: 20px" class="flex" v-else>{{orderInfo.patientName}}患者的联系电话是{{orderInfo.patientPhone }}</div>
      <span slot="footer">
        <el-button type="primary" @click="callDialog=false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import expressionMessage from '../../pagesTransfer/qualityControlStatistics/components/expressionMessage';
import ImageMessage from '../../pagesTransfer/qualityControlStatistics/components/ImageMessage';
import graphicMessage from '../../pagesTransfer/qualityControlStatistics/components/graphicMessage';
import questionnaireMessage from '../../pagesTransfer/qualityControlStatistics/components/questionnaireMessage';
import planMessage from '../../pagesTransfer/qualityControlStatistics/components/planMessage';
import robotMessage from '../../pagesTransfer/qualityControlStatistics/components/robotMessage';
import PackageRecommendations from '../../pagesTransfer/qualityControlStatistics/components/PackageRecommendations';
import VideoMessage from '../../pagesTransfer/qualityControlStatistics/components/VideoMessage';
import satisfaction from '../../pagesTransfer/qualityControlStatistics/components/satisfaction';
import fileMessage from '../../pagesTransfer/qualityControlStatistics/components/fileMessage';
import callMessage from '../../pagesTransfer/qualityControlStatistics/components/callMessage';
export default {
  data() {
    return {
      pageNo: 1,
      pageSize: 10,
      total: 0,
      sourceId: null,
      flowStatus: null,
      payType: null,
      keywordsType: 1,
      payNumberType: 1,
      keywords: '',
      payNumber: '',
      dialogVisible: false,
      dialogVisible1: false,
      dialogVisible2: false,
      dialogVisible3: false,
      form: {},
      form1: {
        address: '',
      },
      form2: {
        reason: '',
      },
      rules: {
        address: [
          {
            required: true,
            message: '请输入退款地址、收货人信息',
            trigger: 'change',
          },
        ],
        reason: [{ required: true, message: '请输入拒绝理由', trigger: 'change' }],
        logisticsOrders: [{ required: true, message: '请输入物流单号', trigger: 'change' }],
        expressCompanyCode: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
        titleName: [{ required: true, message: '请输入抬头名称', trigger: 'change' }],
        taxId: [{ required: true, message: '请输入单位税号', trigger: 'change' }],
        email: [{ required: true, message: '请输入收票邮箱', trigger: 'change' }],
      },
      rules1: {
        refundAmount: [{ required: true, message: '请输入退款金额', trigger: 'change' }],
        reason: [
          {
            required: true,
            message: '请输入退款原因及相应权益使用情况',
            trigger: 'change',
          },
        ],
      },
      mainList: [],
      mainList1: [],
      options1: [],
      options2: [
        {
          label: '待支付',
          value: 0,
        },
        {
          label: '待发货',
          value: 1,
        },

        {
          label: '待收货',
          value: 2,
        },
        {
          label: '待入组',
          value: 3,
        },
        {
          label: '退款中',
          value: 4,
        },
        {
          label: '已完成',
          value: 5,
        },
        {
          label: '已取消',
          value: 6,
        },
        {
          label: '已退款',
          value: 7,
        },
        {
          label: '退款失败',
          value: 8,
        },
        {
          label: '管理中',
          value: 9,
        },
        {
          label: '退款审核中',
          value: 11,
        },
        {
          label: '咨询中',
          value: 12,
        },
        {
          label: '待回复',
          value: 13,
        },
      ],
      options3: [
        {
          label: '微信支付',
          value: 0,
        },
        {
          label: '支付宝支付',
          value: 1,
        },
        {
          label: '院内收款',
          value: 2,
        },
      ],
      optionsType: [
        {
          label: '健康咨询',
          value: 1,
        },
        {
          label: '健康服务',
          value: 2,
        },
      ],
      packageType: null,
      platRemark: '',
      isRefund: false,
      logisticsCompanyList: [],
      ruleForm: {
        platRemark: '',
        remark: '',
        logisticsOrders: '',
        expressCompanyName: '',
        expressCompanyCode: '',
      },
      isEdit: false,
      isLoading: false,
      packageDeptId: '',
      deptList: [],
      time: null,
      time1: null,
      isEdit2: false,
      invoiceInformation: {
        titleType: '', // 抬头类型
        titleName: '', // 抬头名称
        taxId: '', // 单位税号
        registerAddress: '', // 注册地址
        registerPhone: '', // 注册电话
        depositBank: '', // 开户银行
        bankAccount: '', // 银行账号
        email: '', // 收票邮箱
      },
      refundObj: {
        refundAmount: 0, // 退款金额
        reason: '', // 备注
      },
      isRefundAuthority: false,
      platOrderVerifyItemsList: [],
      platOrderVerifyLogsList: [],
      isShow: false,
      modules: [],
      alllist: [],
      mergeList: [],
      checkList: [],
      mergeList: [],
      baseColumns: [],
      baseColumnsV2: [],
      mergeConfigList: [],
      mergeConfigColumns: [],
      isShowMerge: false,
      dialogField: false,
      zc: [],
      isRefund2: false,
      searchTimeKey: 'orderTime',
      timeKeyList: [
        { label: '订单时间', value: 'orderTime' },
        { label: '退款时间', value: 'reductionTime' },
        { label: '发票申请时间', value: 'billApplyTime' },
      ],
      searchTimeVal: null,
      hidden: false,
      orderStatistics: {
        orderFee: '',
        effectiveOrderFee: '',
        refundedOrderFee: '',
      },
      drawer: false,
      pageNo2: 1,
      isEnd: false,
      arr: [],
      messageList: [],
      ceshi: false,
      memberList: [],
      roomId: '',
      orderInfo: {},
      patientId: '',
      showSatisfaction: false,
      satisfactionData: {
        sumValue: 0,
        procedureValue: 0,
        serviceValue: 0,
        advice: '',
      },
      callDialog: false,
      callType: null,
    };
  },
  components: {
    expressionMessage,
    ImageMessage,
    graphicMessage,
    questionnaireMessage,
    planMessage,
    robotMessage,
    PackageRecommendations,
    VideoMessage,
    satisfaction,
    fileMessage,
    callMessage,
    graphicMessage,
  },
  created() {
    this.time = this.getLastMonth(1);
    this.searchTimeVal = this.getLastMonth(1);
    this.getOrderList();
    this.getDeptList();
    this.getAllHospitalList();
    this.GetHMDictItems();
    this.getPermissions();
  },
  watch: {
    checkList() {
      this.baseColumns = [];
      for (let i in this.checkList) {
        for (let j in this.alllist) {
          if (this.checkList[i] == this.alllist[j].id) {
            this.baseColumns.push(this.alllist[j]);
          }
        }
      }
    },
    mergeConfigList() {
      this.mergeConfigColumns = [];
      for (let i in this.mergeConfigList) {
        for (let j in this.mergeList) {
          if (this.mergeConfigList[i] == this.mergeList[j].id) {
            this.mergeConfigColumns.push(this.mergeList[j]);
          }
        }
      }
    },
  },
  methods: {
    showOrHide() {
      this.hidden = !this.hidden;
      // this.search.flupType = '';
      // this.search.flupStateId = 'All';
      // this.search.smartFlupMethodId = '';
      // this.getMainList();
    },
    SeeRecordList() {
      this.isShow = !this.isShow;
    },
    /**
     * 获取退款权限
     */
    getPermissions() {
      this.$apis.getPermissions({}).then((res) => {
        if (res.ret_data.featureList) {
          this.isRefundAuthority = res.ret_data.featureList.some((item) => {
            return item.feature_id == '678930';
          });
        }
      });
    },
    /**
     * 获取医院列表
     */
    getAllHospitalList() {
      this.$apis.getAllHospitalList().then((res) => {
        this.options1 = res;
      });
    },
    /**
     * 获取科室列表
     */
    getDeptList() {
      this.$apis
        .departmentgetFlupDeptByHospitalId({
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.deptList = res || [];
        });
    },
    /**
     * 获取订单列表
     */
    getOrderList() {
      let param = {
        pageNo: this.pageNo,
        pageSize: this.pageSize,
        payType: !!this.payType || this.payType === 0 ? this.payType : null,
        flowStatus: !!this.flowStatus || this.flowStatus === 0 ? this.flowStatus : null,
        sourceId: this.sourceId ? this.sourceId : null,
        startTime: this.searchTimeKey == 'orderTime' ? (this.searchTimeVal && this.searchTimeVal[0] ? this.searchTimeVal[0] : '') : '',
        endTime: this.searchTimeKey == 'orderTime' ? (this.searchTimeVal && this.searchTimeVal[1] ? this.searchTimeVal[1] : '') : '',
        // startTime: this.time && this.time[0] ? this.time[0] : null,
        // endTime: this.time && this.time[1] ? this.time[1] : null,
        keywordsType: this.keywords ? this.keywordsType : null,
        keywords: this.keywords,
        payNumberType: this.payNumber ? this.payNumberType : null,
        payNumber: this.payNumber,
        invoiceStartTime: this.searchTimeKey == 'billApplyTime' ? (this.searchTimeVal && this.searchTimeVal[0] ? this.searchTimeVal[0] : '') : '',
        invoiceEndTime: this.searchTimeKey == 'billApplyTime' ? (this.searchTimeVal && this.searchTimeVal[1] ? this.searchTimeVal[1] : '') : '',
        // invoiceStartTime: this.time1 && this.time1[0] ? this.time1[0] : null,
        // invoiceEndTime: this.time1 && this.time1[1] ? this.time1[1] : null,
        packageDeptId: this.packageDeptId,
        reductionStartTime: this.searchTimeKey == 'reductionTime' ? (this.searchTimeVal && this.searchTimeVal[0] ? this.searchTimeVal[0] : '') : '',
        reductionEndTime: this.searchTimeKey == 'reductionTime' ? (this.searchTimeVal && this.searchTimeVal[1] ? this.searchTimeVal[1] : '') : '',
        packageType: this.packageType,
      };
      this.$apis.getOrderList(param).then((res) => {
        this.total = res.total;
        this.mainList = res.list;
        this.getlists();
      });
      this.$apis.getTotalOrderStatistics(param).then((res) => {
        // console.log(res, 'getTotalOrderStatisticsgetTotalOrderStatistics');
        this.orderStatistics = res;
      });
    },
    /**
     * 查询
     */
    Search() {
      // if (!this.time && !this.time1) {
      //   this.$message.warning('请选择订单时间或发票申请时间');
      //   return;
      // }
      if (!this.searchTimeVal) {
        this.$message.warning('请选择时间');
        return;
      }
      this.pageNo = 1;
      this.getOrderList();
    },
    /**
     * 获取订单详情
     */
    async addClick(row) {
      await this.$apis
        .getOrderDetail({
          orderId: row.serialNo,
        })
        .then((res) => {
          this.dialogVisible = true;
          this.platRemark = res.platRemark;
          this.form = res;
          this.form.packageList = [
            {
              packageName: res.packageName,
              specName: res.specName,
              price: (res.goodsFee / 100).toFixed(2),
              sourceName: res.sourceName,
            },
          ];
          this.ruleForm.remark = this.form.remark;
          this.ruleForm.platRemark = this.form.platRemark;
          this.ruleForm.logisticsOrders = this.form.platPayExpressVo ? this.form.platPayExpressVo.thirdPartyNo : '';
          this.ruleForm.expressCompanyCode = this.form.platPayExpressVo ? this.form.platPayExpressVo.expressCompanyCode : '';
          this.ruleForm.expressCompanyName = this.form.platPayExpressVo ? this.form.platPayExpressVo.expressCompanyName : '';
          this.isEdit = this.ruleForm.logisticsOrders ? true : false;
        });
      await this.$apis
        .getOnePackageVerifyList({
          orderId: row.serialNo,
        })
        .then((res) => {
          this.platOrderVerifyItemsList = res.platOrderVerifyItemsList;
          this.platOrderVerifyLogsList = res.platOrderVerifyLogsList;
        });
    },
    /**
     * 分页查询
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.getOrderList();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getOrderList();
    },
    /**
     * hide
     */
    hide() {
      this.dialogVisible = false;
      this.isEdit = false;
      this.form = {};
      this.isLoading = false;
      this.isShow = false;
      // 重新获取列表数据
      this.getOrderList();
    },
    Determine() {
      if (this.$refs.form) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.$apis
              .updateOrder({
                orderId: this.form.serialNo,
                platRemark: this.ruleForm.platRemark,
                remark: this.ruleForm.remark,
                logisticsOrders: this.ruleForm.logisticsOrders, // 物流单号
                expressCompanyCode: this.ruleForm.expressCompanyCode,
                expressCompanyName: this.GetExpressCompanyName(this.ruleForm.expressCompanyCode),
              })
              .then((res) => {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                });
                this.hide();
              });
          }
        });
      } else {
        this.$apis
          .updateOrder({
            orderId: this.form.serialNo,
            platRemark: this.ruleForm.platRemark,
            remark: this.ruleForm.remark,
            logisticsOrders: this.ruleForm.logisticsOrders, // 物流单号
            expressCompanyCode: this.ruleForm.expressCompanyCode,
            expressCompanyName: this.GetExpressCompanyName(this.ruleForm.expressCompanyCode),
          })
          .then((res) => {
            this.$message({
              message: '操作成功',
              type: 'success',
            });
            this.hide();
          });
      }
    },
    /**
     * 订单号编辑
     */
    Edit() {
      this.isEdit = false;
    },
    /**
     * 发货
     */
    sendOut() {
      this.$refs.form.validate(async (valid) => {
        if (valid) {
          await this.$apis
            .sendOutGoods({
              orderId: this.form.serialNo,
              logisticsOrders: this.ruleForm.logisticsOrders,
              expressCompanyCode: this.ruleForm.expressCompanyCode,
              expressCompanyName: this.GetExpressCompanyName(this.ruleForm.expressCompanyCode),
            })
            .then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
              });
              this.addClick(this.form);
              // this.hide()
            });
        }
      });
    },
    /**
     * 核销
     */
    writeOff() {
      // 无需发货核销点完之后状态变成已完成
      this.$confirm('确定核销该笔订单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'hm-width',
      })
        .then(async () => {
          await this.$apis
            .writeOff({
              orderId: this.form.serialNo,
            })
            .then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
              });
              this.addClick(this.form);
            });
        })
        .catch(() => {});
    },

    /**
     * 退款
     */
    async refund() {
      this.isLoading = true;
      this.isRefund2 = false;
      if (this.form.flowStatus == 4 && this.form.platOrderRefundVo && this.form.platOrderRefundVo.refundStatus == 1) {
        // 没有点击同意退款申请操作退款
        if (this.form.needExpress == 1 && this.form.platPayExpressVo.thirdPartyNo) {
          // 有设备的话，需要用户寄回设备
          this.dialogVisible1 = true;
          this.isRefund = true;
        } else {
          this.dialogVisible3 = true;
        }
      } else {
        // 同意退款申请后在点击退款
        this.dialogVisible3 = true;
      }
    },
    /**
     * 同意退款
     */
    async agree() {
      if (this.form.needExpress == 1 && this.form.platPayExpressVo.thirdPartyNo) {
        // 需要回收设备,并且设备已发出
        this.dialogVisible1 = true;
      } else {
        // 不需要设备或者需要设备但设备还没有发出
        await this.reviewRefund({
          refundId: this.form.platOrderRefundVo.refundId,
          status: 1,
          reason: null,
          address: null,
        }).then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          this.addClick(this.form);
        });
      }
    },
    hide1() {
      this.$refs.form1 && this.$refs.form1.resetFields();
      this.dialogVisible1 = false;
      this.isLoading = false;
    },
    // 填写收货地址确认
    determine1() {
      this.$refs.form1.validate(async (valid) => {
        if (valid) {
          if (this.isRefund) {
            this.dialogVisible3 = true;
          } else {
            await this.reviewRefund({
              refundId: this.form.platOrderRefundVo.refundId,
              status: 1,
              reason: '',
              address: this.form1.address,
            }).then((res) => {
              this.$message({
                message: '操作成功',
                type: 'success',
              });
              this.addClick(this.form);
              this.hide1();
            });
          }
        }
      });
    },
    /**
     * 拒绝退款申请
     */
    refuse() {
      this.dialogVisible2 = true;
    },
    hide2() {
      this.$refs.form2 && this.$refs.form2.resetFields();
      this.dialogVisible2 = false;
    },
    determine2() {
      this.$refs.form2.validate(async (valid) => {
        if (valid) {
          await this.reviewRefund({
            refundId: this.form.platOrderRefundVo.refundId,
            status: 0,
            reason: this.form2.reason,
            address: '',
          }).then((res) => {
            this.dialogVisible2 = false;
            // 重新回去订单详情数据
            this.addClick(this.form);
            this.hide2();
          });
        }
      });
    },
    /**
     * 状态变更
     */
    stateChange(status) {
      // (0待支付,1:待发货,2:待收货,3:待使用,4:退款中,5:完成,6:已取消,7:已退款)
      this.$apis
        .orderUpdateStatus({
          orderId: this.form.serialNo,
          newStatus: status,
        })
        .then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          this.addClick(this.form);
          this.getOrderList();
        });
    },
    /**
     * 同意退款申请接口封装
     */
    reviewRefund(data) {
      return new Promise((reslove, reject) => {
        this.$apis
          .reviewRefund(data)
          .then((res) => {
            reslove(res);
          })
          .catch((err) => {
            reslove(err);
          });
      });
    },
    /**
     * 退款接口封装
     */
    async postConfirmRefund() {
      await this.$apis
        .refundRequest({
          serialNo: this.form.serialNo,
          ...this.refundObj,
        })
        .then((res) => {
          this.$message({
            message: '操作成功',
            type: 'success',
          });
          this.hide3();
          this.hide2();
          this.isRefund2 = false;
          // 退款成功 状态变成已退款
          this.addClick(this.form);
          this.isRefund = false;
        });
      this.isLoading = false;
    },
    /**
     * 获取物流公司列表
     */
    GetHMDictItems() {
      this.$apis
        .GetHMDictItems({
          parentId: '20230816000000000002',
        })
        .then((res) => {
          this.logisticsCompanyList = res;
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
      dateArr[1] = year + '-' + month + '-' + day;
      let nowMonthDay = new Date(year, month, 0).getDate(); //当前月的总天数
      if (i == 12) {
        //如果是12月，年数往前推一年<br>
        dateArr[0] = year - 1 + '-' + month + '-' + day;
      } else if (month - i <= 0) {
        // 如果前推i月小于0，年数往前推一年<br>
        dateArr[0] = year - 1 + '-' + 12 + '-' + day;
      } else {
        let endTimeMonthDay = new Date(year, parseInt(month) - i, 0).getDate();
        if (endTimeMonthDay < day) {
          // i个月前所在月的总天数小于现在的天日期
          if (day < nowMonthDay) {
            // 当前天日期小于当前月总天数
            dateArr[0] = year + '-' + (month - i) + '-' + (endTimeMonthDay - (nowMonthDay - day));
          } else {
            dateArr[0] = year + '-' + (month - i) + '-' + endTimeMonthDay;
          }
        } else {
          dateArr[0] = year + '-' + (month - i) + '-' + day;
        }
      }
      return dateArr;
    },
    /**
     * 获取物流公司名称
     */
    GetExpressCompanyName(code) {
      let arr = this.logisticsCompanyList.filter((item) => {
        return item.dict_code == code;
      });
      return arr[0] ? arr[0].dict_name : '';
    },
    /**
     * 获取需要显示的操作记录
     */
    getOperateList() {
      return this.form.platOrderLogsVoList.filter((item) => {
        return [3, 4, 5].includes(item.actionType);
      });
    },
    /**
     * 修改发票信息
     */
    editInvoiceInformation() {
      if (this.isEdit2) {
        this.$refs.invoiceInformationRef.validate((valid) => {
          if (valid) {
            // 接口请求
            this.$apis.updateInvoice(this.invoiceInformation).then((res) => {
              this.$message.success('保存成功');
              // 重新获取订单详情
              this.addClick(this.form);
              this.isEdit2 = false;
            });
          }
        });
      } else {
        this.invoiceInformation = JSON.parse(JSON.stringify(this.form.platOrderInvoiceTitleDto));
        this.isEdit2 = true;
      }
    },
    /**
     * 取消修改发票信息
     */
    hideEditTitle() {
      // 重置表单数据
      this.$refs.invoiceInformationRef.resetFields();
      this.isEdit2 = false;
    },
    /**
     *
     */
    hide3() {
      this.refundObj.reason = '';
      this.$refs.refundRef && this.$refs.refundRef.resetFields();
      this.dialogVisible3 = false;
      if (!this.isRefund) {
        this.isLoading = false;
      }
    },
    determine3() {
      this.$refs.refundRef.validate(async (valid) => {
        if (valid) {
          this.isRefund2 = true;
          if (this.form.platOrderRefundVo && this.form.platOrderRefundVo.refundStatus == 2) {
            // 手动进行了同意退款操作
            this.postConfirmRefund();
          } else {
            if (this.form.flowStatus == 4) {
              await this.reviewRefund({
                refundId: this.form.platOrderRefundVo && this.form.platOrderRefundVo.refundId ? this.form.platOrderRefundVo.refundId : null,
                status: 1,
                reason: '',
                address: this.form1.address ? this.form1.address : '',
              })
                .then((res) => {
                  // 退款
                  this.postConfirmRefund();
                })
                .catch(() => {
                  this.isLoading = false;
                });
            } else {
              this.postConfirmRefund();
            }
          }
        }
      });
    },
    exportHospitalOrder(event) {
      event.target.blur();
      if (event.target.nodeName == 'SPAN') {
        event.target.parentNode.blur();
      }
      this.$apis
        .exportOrder({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          payType: !!this.payType || this.payType === 0 ? this.payType : null,
          flowStatus: !!this.flowStatus || this.flowStatus === 0 ? this.flowStatus : null,
          sourceId: this.sourceId ? this.sourceId : null,
          // startTime: this.time && this.time[0] ? this.time[0] : null,
          // endTime: this.time && this.time[1] ? this.time[1] : null,
          startTime: this.searchTimeKey == 'orderTime' ? (this.searchTimeVal && this.searchTimeVal[0] ? this.searchTimeVal[0] : '') : '',
          endTime: this.searchTimeKey == 'orderTime' ? (this.searchTimeVal && this.searchTimeVal[1] ? this.searchTimeVal[1] : '') : '',
          keywordsType: this.keywords ? this.keywordsType : null,
          keywords: this.keywords,
          payNumberType: this.payNumber ? this.payNumberType : null,
          payNumber: this.payNumber,
          // invoiceStartTime: this.time1 && this.time1[0] ? this.time1[0] : null,
          // invoiceEndTime: this.time1 && this.time1[1] ? this.time1[1] : null,
          invoiceStartTime: this.searchTimeKey == 'billApplyTime' ? (this.searchTimeVal && this.searchTimeVal[0] ? this.searchTimeVal[0] : '') : '',
          invoiceEndTime: this.searchTimeKey == 'billApplyTime' ? (this.searchTimeVal && this.searchTimeVal[1] ? this.searchTimeVal[1] : '') : '',
          packageDeptId: this.packageDeptId,
          reductionStartTime: this.searchTimeKey == 'reductionTime' ? (this.searchTimeVal && this.searchTimeVal[0] ? this.searchTimeVal[0] : '') : '',
          reductionEndTime: this.searchTimeKey == 'reductionTime' ? (this.searchTimeVal && this.searchTimeVal[1] ? this.searchTimeVal[1] : '') : '',
          packageType: this.packageType,
        })
        .then((res) => {
          let url = window.URL.createObjectURL(
            // data为后端返回的文件流,type 属性值根据下载文件的格式进行定义
            new Blob([res], { type: 'application/ms-excel' })
          );
          // 进行基本思路的操作
          let link = document.createElement('a');
          link.href = url;
          link.download = '售卖订单.xlsx';
          link.style.display = 'none';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        });
    },
    remove(node, data) {
      for (let i in this.checkList) {
        if (this.checkList[i] == data.id) {
          this.checkList.splice(i, 1);
        }
      }
      for (let j in this.mergeConfigList) {
        if (this.mergeConfigList[j] == data.id) {
          this.mergeConfigList.splice(j, 1);
        }
      }
    },
    setting() {
      this.getlists();
      this.dialogField = true;
    },
    getlists() {
      this.$apis
        .columnqueryPageColumnConfigDisplay({
          page: '订单列表',
          // type: this.patientTypeTc
        })
        .then((res) => {
          this.modules = res.modules;
          this.alllist = res.baseColumns;
          this.mergeList = res.mergeColumns;
        });
      this.$apis
        .columnqueryPageColumnDisplay({
          page: '订单列表',
          // type: this.patientTypeTc
        })
        .then((res) => {
          this.checkList = [];
          this.mergeList = res.mergeColumns;
          this.baseColumns = res.baseColumns;
          this.baseColumnsV2 = res.baseColumns;
          this.baseColumns.forEach((element) => {
            this.checkList.push(element.id);
          });
          this.mergeConfigList = [];
          if (res.mergeConfigColumns) {
            this.isShowMerge = true;

            this.mergeConfigColumns = res.mergeConfigColumns && res.mergeConfigColumns[0].columnDetails;

            res.mergeConfigColumns &&
              res.mergeConfigColumns[0] &&
              res.mergeConfigColumns[0].columnDetails.forEach((element) => {
                this.mergeConfigList.push(element.id);
              });
          }
          this.baseColumnsV2.push({ checked: true, displayName: '最近咨询时间', fieldName: 'lastReplyIntervalTime', id: '', module: '医疗相关', sortOrder: null });
          // console.log('baseColumnsV2', this.baseColumnsV2);
        });
    },
    bc() {
      let arr = [];
      for (let i in this.baseColumns) {
        let a = {
          columnId: this.baseColumns[i].id,
          page: '订单列表',
          sortOrder: Number(i) + 1,
          // type: this.patientTypeTc,
          // userId: this.userId
        };
        arr.push(a);
      }
      if (this.isShowMerge) {
        for (let i in this.mergeConfigColumns) {
          let a = {
            columnId: this.mergeConfigColumns[i].id,
            page: '订单列表',
            sortOrder: Number(i) + 1,
            isMerged: true,
            mergeDisplayName: '基本信息',
            // type: this.patientTypeTc,
            // userId: this.userId
          };
          arr.push(a);
        }
      }
      if (arr.length != 0) {
        this.$apis.columnsavePageColumns(arr).then((res) => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
            });
            this.dialogField = false;
            this.getOrderList();
          }
        });
      } else {
        this.$message({
          message: '至少配置一个显示字段',
          type: 'warning',
        });
      }
    },
    dragTheStart() {
      this.zc = JSON.parse(JSON.stringify(this.baseColumns));
    },
    dragTheEnter(before, after) {
      if (after.childNodes.length != 0) {
        this.baseColumns = this.zc;
      }
    },
    dragTheStartMerge() {
      this.zc = JSON.parse(JSON.stringify(this.mergeConfigColumns));
    },
    dragTheEnterMerge(before, after) {
      if (after.childNodes.length != 0) {
        this.mergeConfigColumns = this.zc;
      }
    },
    // titleTypeChange(){
    //   this.invoiceInformation.taxId = ""
    // }
    //获取聊天记录
    chatRecord(row) {
      if (!row.roomId) {
        this.$message({
          type: 'warning',
          message: '该订单没有聊天记录',
        });
        return;
      }
      this.showSatisfaction = false;
      this.orderInfo = row;
      this.patientId = row.patientId;
      this.roomId = row.roomId;
      this.getGroupUserInfoList();
      // this.getChatHistory();
      // this.drawer = true;
    },
    /**
     * 获取群成员列表
     */
    getGroupUserInfoList() {
      this.$apis
        .selectGraphicGroupUserInfoList({
          roomId: this.roomId,
        })
        .then((res) => {
          this.memberList = res;
          this.getChatHistory();
          this.drawer = true;
        });
    },
    /**
     * 获取消息列表
     */
    getChatHistory() {
      this.$apis
        .getHistoryQuery({
          enddate: this.getCurrentDateWithHyphens(),
          pagesize: 30,
          currentpage: this.pageNo2,
          roomId: this.roomId,
        })
        .then(async (res) => {
          let resObj = JSON.parse(res);
          if (resObj.ErrorCode == 0) {
            let serviceMessageList = JSON.parse(resObj.Data);
            if (serviceMessageList.length < 30) {
              this.isEnd = true;
            }
            let messageList = this.formatHistoryMessageList(serviceMessageList);

            this.arr = [...messageList.reverse(), ...this.arr];
            if (this.arr.length >= 30 || this.isEnd) {
              this.messageList = [...this.arr, ...this.messageList];
              let arr = JSON.parse(JSON.stringify(this.arr));
              if (!this.ceshi) {
                this.$nextTick(() => {
                  this.$refs.chatWindow.scrollTop = this.$refs.chatWindow.scrollHeight;
                  this.arr = [];
                });
              } else {
                this.$nextTick(() => {
                  let ID = arr[arr.length - 1].ID;
                  const container = this.$refs.chatWindow;
                  const element = this.$refs[ID][0];
                  const rect = element.getBoundingClientRect();
                  const top = rect.top - container.getBoundingClientRect().top;
                  this.$refs.chatWindow.scrollTop = top;
                  this.arr = [];
                });
              }
            } else {
              this.pageNo2 += 1;
              this.getChatHistory();
            }
          }
          console.log(this.arr, ' this.arr', this.messageList, ' this.messageList ');
        });
    },
    getCurrentDateWithHyphens() {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const day = now.getDate().toString().padStart(2, '0');
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const seconds = now.getSeconds().toString().padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },

    /**
     * 格式化数据
     */
    formatHistoryMessageList(list) {
      let messageList = [];
      list.forEach((item) => {
        // console.log(item);
        let localMsg = {
          fromAccount: item.from_account,
          fromAccountNick: '',
          random: 0,
          seq: item.msg_seq,
          time: new Date(item.msg_timestamp).getTime() / 1000,
          subType: 0,
          sessId: item.group_id,
          sessType: 'Group',
          ID: `ID-${item.from_account}-${new Date(item.msg_timestamp).getTime() / 1000}`,
          isRevoked: item.c_id,
        };
        item.chats_detail.forEach((elem) => {
          switch (elem.msg_type) {
            case 'TIMTextElem':
              localMsg['type'] = 'TIMTextElem';
              localMsg['content'] = elem.chat_text;
              break;
            case 'TIMImageElem':
              localMsg['type'] = 'TIMImageElem';
              elem.image_list.forEach((imageItem) => {
                if (imageItem.image_type == 3) {
                  localMsg['smallImage'] = imageItem.image_url;
                } else if (imageItem.image_type == 2) {
                  localMsg['bigImage'] = imageItem.image_url;
                } else {
                  localMsg['oriImage'] = imageItem.image_url; //原图
                }
              });
              break;
            case 'TIMCustomElem':
              if (elem.location_desc == 'TIMImageElem') {
                localMsg['type'] = 'TIMImageElem';
                localMsg['bigImage'] = JSON.parse(elem.look_data).imageUrl;
              } else if (elem.location_desc == 'TIMVideoFileElem') {
                localMsg['type'] = 'TIMVideoFileElem';
                localMsg['videoUrl'] = JSON.parse(elem.look_data).videoUrl;
              } else {
                localMsg['type'] = 'TIMCustomElem';
                var contentobj = {};
                contentobj.desc = elem.location_desc;
                contentobj.ext = elem.define_ext;
                if (typeof elem.look_data == 'string') {
                  try {
                    contentobj.data = JSON.parse(elem.look_data);
                    contentobj.data.text = JSON.parse(contentobj.data.text);
                  } catch (e) {}
                } else {
                  contentobj.data = elem.look_data;
                }
                localMsg['content'] = contentobj;
              }
              break;
            case 'TIMSoundElem':
              localMsg['type'] = 'TIMTextElem';
              let content1 = '语音消息请在手机上查看';
              localMsg['content'] = content1;
              break;
            default:
              localMsg['type'] = 'TIMTextElem';
              let content2 = '消息已过期';
              localMsg['content'] = content2;
              break;
          }
        });
        messageList.push(localMsg);
      });
      // 过滤出需要展示的数据
      messageList = messageList.filter((item) => {
        let bool1 = true;
        if (item.type == 'TIMCustomElem' && item.content.data.type == 4 && !item.content.data.text.consultPurpose) {
          // console.log(item.content.data, 'item.content.data.text');
          let j = item.content.data.text.indexOf('订单剩余');
          if (j > -1) bool1 = false;
        }
        if (bool1) return true;
        return false;
      });
      console.log(this.memberList, 'this.memberList');
      // 姓名显示
      messageList.forEach((item) => {
        let newArr = this.memberList.filter((items) => {
          return item.fromAccount == items.extendUserId;
        });
        if (newArr.length > 0) {
          item.name = newArr[0].userName;
        }
      });
      // 患者的消息显示在左边，其它人发的消息显示在右边
      messageList.forEach((item) => {
        if (item.fromAccount == this.patientId) {
          item.isSend = false;
          return;
        }
        item.isSend = true;
      });
      return messageList;
    },
    handleClose() {
      this.pageNo2 = 1;
      this.isEnd = false;
      this.ceshi = false;
      this.drawer = false;
      this.arr = [];
      this.messageList = [];
    },
    /**
     * 聊天记录加载更多数据
     */
    handleScroll(event) {
      this.ceshi = true;
      const { scrollTop } = event.target;
      // 检查是否滚动到顶部
      if (scrollTop === 0) {
        if (!this.isEnd) {
          this.pageNo2 += 1;
          this.getChatHistory();
        }
      }
    },
    $seeSatisfactionDetail(e) {
      this.$apis.satisfaction(e).then((res) => {
        if (res && res.procedureValue != null) {
          this.showSatisfaction = true;
          this.satisfactionData = res;
        } else {
          this.$message({
            message: '患者未填写',
            type: 'warning',
          });
        }
      });
    },
    timestampToDate(timestamp) {
      const date = new Date(timestamp * 1000);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    },
    getPhone(call) {
      this.callType = call;
      this.callDialog = true;
    },
  },
};
</script>
<style lang="scss" scoped>
.sales-order {
  height: calc(100% - 82px);
  margin: 0 24px 20px;
  display: flex;
  flex-direction: column;

  .header {
    padding: 10px 30px 10px 10px;
    margin-bottom: 20px;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    background-color: #fbfbfb;
    position: relative;
    .search-time {
      .el-select {
        border-radius: 5px 0 0 5px;
        .el-input__inner {
          border-radius: 5px 0 0 5px;
          background-color: #f9f9f9;
        }
      }
      .el-date-editor {
        border-radius: 0px 5px 5px 0px;
        border-left: none;
      }
    }
    section {
      display: flex;
      align-items: center;
      margin: 10px 0 10px 30px;
    }
    span {
      margin-right: 14px;
    }
    .header-setting {
      position: absolute;
      right: 10px;
      top: 30px;
      font-size: 26px;
      cursor: pointer;
      display: inline-block;
    }
    .butBox {
      margin-left: auto;
    }
  }
  .d-tree {
    overflow-y: auto;
    flex: 1;
  }
  .statistics {
    display: flex;
    padding: 15px;
    background: #fbfbfb;
    margin: 10px 0;
    .statistics-item {
      margin-left: 20px;
    }
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
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 16px;
        color: #333333;
        position: relative;
        width: 100%;
        padding-bottom: 14px;
        border-bottom: 1px solid #d7dae0;
      }
      .buttons {
        margin-top: 10px;
      }

      .invoice-informationRef {
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
    margin-top: 10px;
    background-color: #fbfbfb;
    padding: 10px;
    p {
      margin-bottom: 16px;
    }

    p:last-child {
      margin-bottom: 0;
    }
  }
  .refund-amount {
    color: #333333;
    font-size: 14px;
    margin-bottom: 13px;
  }
  .project {
    background: #fbfbfb;
    margin-top: 14px;
    padding: 10px;
    box-sizing: border-box;
    color: #111111;
    .item {
      display: flex;
      align-items: center;
      .li {
        margin-right: 10px;
        width: 6px;
        height: 6px;
        border-radius: 3px;
        background: #32ae57;
      }
    }
    .items {
      color: #111111;
      font-size: 14px;
      margin-bottom: 14px;
      span {
        margin-right: 20px;
        color: #666666;
      }
    }
  }
  .record {
    display: flex;
    align-items: center;
    margin-top: 10px;
    color: #0283ef;
    img {
      width: 14px;
      height: 14px;
      margin-left: 6px;
    }
  }
  .drawer {
    .order-header {
      .order-title {
        color: #333333;
        font-size: 18px;
        margin: 24px 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .order-info {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fbfbfb;
        padding: 18px;
        .title-name {
          color: #111111;
          font-weight: 700;
          font-size: 14px;
        }
      }
    }

    .message-list {
      border: 1px solid #e6e6e6;
      flex: 1;
      overflow-y: auto;
      margin: 20px 0;
      padding: 10px 0;
    }
    .last-bottom {
      margin: 0 0 20px 0;
    }
    .enter {
      transform: translate3d(0, 0, 0);
      transform-origin: right;
      animation: pageEnter 0.3s ease-in-out;
    }

    .t-message {
      margin-top: 20px;
      position: relative;
    }

    .time {
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: #999;
      text-align: center;
      line-height: 14px;
      padding-top: 10px;
      padding-bottom: 5px;
    }

    .content-left {
      max-width: 250px;
      background-color: white;
      border-bottom-color: white;
      /*为了给after伪元素自动继承*/
      padding: 10px 12px 10px 12px;
      box-sizing: border-box;
      border-radius: 6px;
      position: relative;
      align-self: flex-start;
      color: white;
      margin-left: 10px;
      margin-top: 5px !important;
    }

    .text {
      /* font-family: PingFangSC-Regular; */
      font-size: 16px;
      font-family: Arial;
      line-height: 18px;
      word-break: break-word;
      min-height: 14px;
    }

    .textleft {
      color: #111;
    }

    .textright {
      border-radius: 10px 2px 10px 10px;
      border: 1px solid rgba(0, 110, 255, 0.3);
      background: rgba(0, 110, 255, 0.1);
      max-width: 60vw;
      line-height: 26px;
      padding: 6px 12px;
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      white-space: pre-wrap;
    }

    .content-left::before {
      content: '';
      position: absolute;
      width: 8px;
      height: 5px;
      right: 0px;
      left: -5px;
      top: 10px;
      border-width: 0 10px 10px 0px;
      border-style: solid;
      border-left-color: transparent;
      border-bottom-color: inherit;
      border-bottom-left-radius: 30px;
    }

    .content-right {
      max-width: 250px;
      background-color: #bbe7ff;
      border-bottom-color: #bbe7ff;
      /*为了给after伪元素自动继承*/
      padding: 10px 12px 10px 12px;
      box-sizing: border-box;
      border-radius: 6px;
      position: relative;
      align-self: flex-end;
      margin: 8px;
    }

    .content-right::after {
      content: '';
      position: absolute;
      width: 8px;
      height: 5px;
      right: -5px;
      top: 2px;
      border-width: 0 0 10px 10px;
      border-style: solid;
      border-left-color: transparent;
      border-bottom-color: inherit;
      border-bottom-right-radius: 30px;
    }

    .message-left {
      display: flex;
      flex-direction: column;
      margin: 10px 0;
    }

    .message-right {
      display: flex;
      flex-direction: column-reverse;
      margin: 10px 0;
    }

    .doctor-info {
      display: flex;
      flex-direction: column;
    }

    .doctor-info-image-left {
      margin-left: 10px;
      margin-right: 14px;
      border-radius: 5px;
      width: 40px;
      height: 40px;
      margin-top: 4px;
    }

    .doctor-info-image-right {
      margin-left: 14px;
      margin-right: 10px;
      border-radius: 5px;
      width: 40px;
      height: 40px;
      margin-top: 4px;
    }

    .doctor-info text {
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #000000;
      letter-spacing: 0;
      line-height: 20px;
      font-size: 14px;
      line-break: anywhere;
    }

    .image {
      width: 150px;
      border-radius: 10px 10px 10px 10px;
    }

    .voice-left {
      max-width: 139px;
      height: 21px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 6px;
      justify-content: flex-start;
    }

    .voice-left .voice-text {
      padding-left: 10px;
      font-size: 14px;
      color: #111111;
    }

    .voice-right {
      max-width: 139px;
      height: 21px;
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 0 6px;
      justify-content: flex-end;
    }

    .voice-right .voice-text {
      padding-right: 10px;
      font-size: 14px;
      color: #111111;
    }

    .customer-msg-text {
      width: 100%;
      box-sizing: border-box;
      font-size: 14px;
      color: #999;
      flex: 1;
      text-align: center;
      display: flex;
      flex-direction: column;
      padding: 6px 12px 20px 12px;
    }

    .customer-msg-whitebg {
      background-color: #fff;
      border: 1px solid #ddd;
      border-radius: 4px;
      text-align: left;
      margin: 8px 0;
      padding: 8px 12px;
    }

    .appraise-text {
      flex: 1;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: #333333;
      align-self: flex-start;
      margin-top: 8px;
      word-break: break-all;
    }

    .link-info.content-left {
      border-bottom-color: #4185f3;
      color: #4185f3;
      padding: 12px 12px 17px;
    }

    .link-info {
      background: #4185f3;
    }

    .link-info .top {
      font-size: 14px;
      color: #fff;
      margin-bottom: 8px;
    }

    .link-info img {
      border-radius: 4px;
      width: 40px;
      height: 40px;
      margin-right: 12px;
    }

    .doctorInfo {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      padding-top: 12px;
      border-top: 1px solid rgba(255, 255, 255, 0.3);
    }

    .doctorInfo .bottom-info view,
    .doctorInfo .bottom-info text {
      font-size: 14px;
      color: #fff;
    }

    .left10 {
      margin-right: 10px;
    }

    .doctorInfo .doctor-name {
      margin-bottom: 5px;
    }

    .revoke-message {
      text-align: center;
      font-size: 14px;
      color: #999;
    }

    /****************** 播放闪烁 ******************/
    .playing-voice {
      animation: fadeInOut 2s linear infinite;
    }

    @keyframes fadeInOut {
      0% {
        opacity: 0;
        /*初始状态 透明度为0*/
      }

      100% {
        opacity: 1;
        /*结尾状态 透明度为1*/
      }
    }

    .video-icon {
      width: 18px;
      height: 18px;
      margin-right: 10px;
    }

    .row {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }

    .message-body-span {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      outline: none;
      font-size: 14px;
      color: #333333;
      position: relative;
      max-width: 60vw;
    }

    .message-body-span-text {
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: #000000;
      letter-spacing: 0;
      line-height: 20px;
      font-size: 14px;
      line-break: anywhere;
    }

    .custom-message {
      display: flex;
      justify-content: center;
      font-size: 14px;
      padding: 7px 0;
      color: #428d58;
    }

    .my-name {
      display: flex;
      justify-content: flex-end;
      font-size: 12px;
      font-weight: normal;
      letter-spacing: 0.2px;
      color: #333333;
      margin-right: 60px;
      margin-bottom: 4px;
    }

    .name {
      display: flex;
      font-size: 12px;
      font-weight: normal;
      letter-spacing: 0.2px;
      color: #333333;
      margin-left: 60px;
      margin-bottom: 4px;
    }
    .nomore {
      text-align: center;
    }
  }
  .satisfaction-content {
    z-index: 100;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 319px;
    border-radius: 8px;
    background: #ffffff;
  }

  .satisfaction-content .header {
    color: #111111;
    font-size: 18px;
    font-weight: 700;
    margin-top: 28px;
    margin-bottom: 24px;
    text-align: center;
  }
  .divider-line {
    border: 1px dashed #e2e2e2;
    margin: 0 20px;
  }

  .satisfaction-content .list {
    margin: 34px 20px 0;
    text-align: left;
    color: #111111;
    font-size: 16px;
    font-weight: 700;
  }

  .list .item {
    margin-bottom: 30px;
    display: flex;
  }

  .list .item .key {
    margin-right: 27px;
    flex-shrink: 0;
  }

  .item img {
    width: 22px;
    height: 22px;
    margin-right: 10px;
  }

  .close {
    position: absolute;
    top: 12px;
    right: 12px;
  }

  .close img {
    width: 22px;
    height: 22px;
  }
}
</style>
<style lang="scss">
.sales-order {
  .header {
    .search-time {
      .el-select {
        border-radius: 5px 0 0 5px;
        .el-input__inner {
          border-radius: 5px 0 0 5px;
          background-color: #f9f9f9;
        }
      }
      .el-date-editor {
        border-radius: 0px 5px 5px 0px;
        border-left: none;
      }
    }
  }
}
.sales-order {
  .el-button--small {
    height: auto !important;
  }
  // .el-form-item--small.el-form-item {
  //   margin-bottom: 10px !important;
  // }
  .xdzd {
    padding: 10px 30px 10px 30px;
    border: 1px solid #ccc;
    span,
    i {
      color: #32ae57;
    }
  }
  .el-drawer__body {
    background-color: #ffffff !important;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .message-list {
      flex: 1;
      overflow-y: auto;
    }
  }
  .last-bottom {
    .blue {
      background-color: #409eff !important;
      border-color: #409eff !important;
      color: #fff;
    }
  }
}
</style>
