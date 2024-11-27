<template>
  <div class="card"
  v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading">
    <div class="title">
      <img src="~@/assets/images/yyjl.svg" class="title-icon" alt="" />
      <div class="title-text">用药记录</div>
    </div>
    <div class="content">
      <el-table :data="tableData" :header-cell-style="{ 'text-align': 'center' }" border stripe>
        <el-table-column prop="ypmc" label="药品名称" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="yplx" label="药品类型" width="78px"> </el-table-column>
        <el-table-column prop="yyff" label="用法"  width="78px"> </el-table-column>
        <el-table-column prop="jzsj" label="就诊时间" show-overflow-tooltip> </el-table-column>
      </el-table>
    </div>
    <div class="botton-pages" v-if="tableData.length > 0">
      <el-pagination small layout="prev, pager, next" :total="this.total" :page-size="this.pageSize" @current-change="handleCurrentChange"> </el-pagination>
    </div>
  </div>
</template>
<script>
import { selectDataList } from "@/service/patientView"
export default{
  data () {
    return {
      tableData:[],
      currentPage: 1, //当前页为1
      total:0,
      loading: true,
    }
  },
  created () {
    this.getDataList()
  },
    watch: {
    '$route.query'() {
      if (this.$route.query.hzid) {
        this.loading = true
        this.getDataList()
      }
    }
  },
  methods:{
     getDataList() {
      //表格页获取数据
      let params = {
        apiCode: "JK30006",
        apiVersion: "1.0",
        pageNo: "",
        pageSize: "",
        parameters: {
        },
      }
      params.parameters.patientId = this.$route.query.hzid
      params.pageNo = this.currentPage
      params.pageSize=8
      selectDataList(params).then((res) => {
        this.loading = false
        this.tableData = res.data
        this.total = res.total
        this.pageSize=res.pageSize
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getDataList()
    },
  }
}
</script>
<style lang="scss" scoped>
.card {
  height: 352px;
  margin: 10px 0 10px 10px;
  background: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 117, 255, 0.2);
  border-radius: 4px;
  position: relative;
  .title {
    width: 135px;
    padding-top: 16px;
    display: flex;
    margin-left: 16px;
    .title-icon {
      width: 16px;
      height: 16px;
      margin-top: 5px;
    }
    .title-text {
      font-size: 18px;
      line-height: 26px;
      margin-left: 8px;
      font-family: Microsoft YaHei;
    }
  }
  .content {
    margin:10px 16px 16px 16px;
    .img-style {
      width: 751px;
      height: 620px;
      margin-left: 78px;
    }
  }
  .botton-pages {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}
.el-table{
  color: #111111;
}
::v-deep .el-table__empty-text{
padding: 100px 0; 
font-size: 18px;
line-height: 26px;
color: #3B5370;
}
</style>
