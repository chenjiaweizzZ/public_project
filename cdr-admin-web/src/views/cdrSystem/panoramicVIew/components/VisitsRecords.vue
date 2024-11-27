<template>
  <div
    class="card"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="title">
      <img src="~@/assets/images/visiticon.svg" class="title-icon" alt="" />
      <div class="title-text">就诊记录</div>
    </div>
    <div class="content">
      <el-table :data="recordData" :header-cell-style="{ 'text-align': 'center' }" border stripe>
        <el-table-column prop="jzfs" label="就诊方式" width="78px"> </el-table-column>
        <el-table-column prop="jzks" label="就诊科室" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="jzsj" label="就诊时间" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="zzd" label="主诊断" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="zrys" label="责任医师" show-overflow-tooltip> </el-table-column>
      </el-table>
    </div>
    <div class="botton-pages" v-if="recordData.length > 0">
      <el-pagination
        small
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :total="this.total"
        :page-size="this.pageSize"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { selectDataList } from '@/service/patientView'
export default {
  data() {
    return {
      total: 0,
      currentPage: 1, //当前页为1
      recordData: [],
      loading: true
    }
  },
  watch: {
    '$route.query'() {
      if (this.$route.query.hzid) {
        this.loading = true
        this.getDataList()
      }
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      //表格页获取数据
      let params = {
        apiCode: '',
        apiVersion: '',
        pageNo: '',
        pageSize: '8',
        parameters: {}
      }
      params.apiCode = 'JK30005'
      params.apiVersion = '1.0'
      params.parameters.patientId = this.$route.query.hzid
      params.pageNo = this.currentPage
      selectDataList(params).then(res => {
        this.loading = false
        this.recordData = res.data
        this.total = res.total
        this.pageSize=res.pageSize
      })
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getDataList()
    }
  }
}
</script>
<style lang="scss" scoped>
.card {
  height: 352px;
  margin: 10px 0 10px 0;
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
    margin: 10px 16px 16px 16px;
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
.el-table thead {
  color: #666666;
}
.el-table {
  color: #111111;
}
::v-deep .el-table__empty-text {
  padding: 100px 0;
  font-size: 18px;
  line-height: 26px;
  color: #3b5370;
}
</style>
