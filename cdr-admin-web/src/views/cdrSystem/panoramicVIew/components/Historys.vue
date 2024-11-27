<template>
  <div
    class="card"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="title">
      <img src="~@/assets/images/gmimg.svg" class="title-icon" alt="" />
      <div class="title-text">过敏史</div>
    </div>
    <div v-if="historyRecords.length > 0">
      <div class="content" v-for="item in historyRecords" :historyRecords="item" :key="item.gms">
        <div class="img-style"><img src="~@/assets/images/historyVector.png" alt="" /></div>
        <div class="detail-style">{{ item.gms }}</div>
        <div class="data-style">{{ item.jlsj }}</div>
      </div>
    </div>
    <div v-else class="no-records-style">
      暂无记录
    </div>
    <div class="botton-pages" v-if="historyRecords.length > 0">
      <el-pagination
        small
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :page-size="this.pageSize"
        :total="this.total"
      >
      </el-pagination>
    </div>
  </div>
</template>
<script>
import { selectDataList } from '@/service/patientView'
export default {
  created() {
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
  data() {
    return {
      historyRecords: [],
      total: 0,
      currentPage: 1, //当前页为1
      loading: true
    }
  },
  methods: {
    getDataList() {
      //表格页获取数据
      let params = {
        apiCode: 'JK30008',
        apiVersion: '1.0',
        pageNo: '',
        pageSize: '5',
        parameters: {
          patientId: ''
        }
      }
      params.parameters.patientId = this.$route.query.hzid
      params.pageNo = this.currentPage
      selectDataList(params).then(res => {
        this.loading = false
        this.historyRecords = res.data
        this.total = res.total
        this.pageSize=res.pageSize
        this.selectLabel = 'PID'
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
  height: 234px;
  margin-top: 10px;
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
    display: flex;
    margin-left: 17px;
    margin-top: 8px;
    align-items: center;
    .img-style {
      margin-right: 7.4px;
    }
    .detail-style {
      max-width: 286px;
      font-size: 14px;
      line-height: 22px;
      overflow: hidden; /*超出的文本隐藏*/
      text-overflow: ellipsis; /*溢出用省略号显示*/
      white-space: nowrap; /*溢出不换行*/
    }
    .data-style {
      position: absolute;
      right: 16px;
      font-size: 14px;
      line-height: 22px;
      color: #3b5370;
    }
  }
  .no-records-style {
    display: flex;
    justify-content: center;
    font-family: 'Microsoft YaHei';
    font-weight: 400;
    font-size: 18px;
    line-height: 26px;
    color: #3b5370;
    padding-top: 60px;
  }
  .botton-pages {
    position: absolute;
    bottom: 10px;
    right: 10px;
  }
}
</style>
