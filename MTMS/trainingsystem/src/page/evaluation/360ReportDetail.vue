<template>
  <div class="reportDetail">
    <el-breadcrumb separator=">">
      <el-breadcrumb-item :to="{ name: '360Report' }">报告列表</el-breadcrumb-item>
      <el-breadcrumb-item>个人评估报告</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="姓名/手机号">
        <el-input v-model="searchKey" placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <el-button type="primary" class="exportStyle" @click="exportReport">导出</el-button>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column type="index" width="50" label="序号"></el-table-column>
      <el-table-column prop="targetName" label="评估对象" width="180"></el-table-column>
      <el-table-column prop="targetPhone" label="手机号" width="180"></el-table-column>
      <el-table-column prop="targetRole" label="角色"></el-table-column>
      <el-table-column prop="score" label="综合得分（平均分）"></el-table-column>
      <el-table-column prop="reportTime" label="报告生成时间"></el-table-column>
      <el-table-column prop="address" label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="previewPdf(scope.row)">预览报告</el-button>
          <el-button type="text" size="mini" @click="downloadPdf(scope.row)">下载报告</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination class="pageStyle" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum"
      :page-sizes="[10, 20, 30, 40]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
    <!-- <pdf :src="currentPdfUrl" v-if="showPdf" ref="myPdfComponent"></pdf> -->
  </div>
</template>
<script>
  import { post, get, getCookie, downloadExcelHeader } from '../../config/util'
  import pdf from 'vue-pdf'
  export default {
    data() {
      return {
        formInline:{},
        id: "",
        searchKey: "",
        tableData: [],
        pageSize: 10,
        pageNum: 1,
        total: 0,
        currentPdfUrl: "",
        showPdf: false
      }
    },
    components: { pdf },
    created() {
      this.id = this.$route.query.id
      this.getTableDate()
    },
    methods: {
      previewPdf(row) {
        if (row.reportStatus == 3) {
          this.$message({
            message: '报告已过期，预览失败',
            type: 'warning'
          });
          return false;
        }
        this.currentPdfUrl = row.pdfUrl
        window.open(this.currentPdfUrl)
      },
      downloadPdf(row) {
        if (row.reportStatus == 3) {
          this.$message({
            message: '报告已过期，下载失败',
            type: 'warning'
          });
          return false;
        }
        var oA = document.createElement('a');
        oA.download = row.targetName + "-360评估报告" + ".pdf";
        oA.href = row.pdfUrl;
        document.body.appendChild(oA);
        oA.click();
        oA.remove(); // 下载之后把创建的元素删除
      },
      onSubmit() {
        this.pageNum = 1
        this.getTableDate();
      },
      serlizeParams(url, params) {
        let paramsStr = "";
        for (let key in params) {
          paramsStr = paramsStr + "&" + key + "=" + params[key];
        }
        paramsStr = paramsStr.substring(1);
        return url + "?" + paramsStr;
      },
      exportReport() {
        let param = {
          keyWord: this.searchKey,
          pageSize: this.pageSize,
          pageNum: this.pageNum,
          reportId: this.id 
        }
        let url = this.serlizeParams("/base/evaluateReportUser/export", param);
        downloadExcelHeader(url, "个人评估报告").then(res => {
        });
      },
      getTableDate() {
        get(`/base/evaluateReportUser/list?reportId=${this.id}&keyWord=${this.searchKey}&pageSize=${this.pageSize}&pageNum=${this.pageNum}`).then(res => {
          if (res && res.resCode == 200) {
            this.tableData = res.rows
            this.total = res.total
          } else {
            this.$message({
              type: "error",
              message: res.resMsg || "请求列表错误"
            })
          }
        })
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getTableDate()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getTableDate()
      },
    }
  }
</script>
<style scoped>
  .reportDetail {
    padding: 0 20px;
  }

  .pageStyle {
    margin-top: 20px;
    text-align: right;
  }

  .demo-form-inline {
    margin-top: 20px;
  }

  .exportStyle {
    margin-bottom: 20px;
  }
</style>