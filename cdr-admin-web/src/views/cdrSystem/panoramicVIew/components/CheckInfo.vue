<template>
  <div
    class="card"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="title">
      <img src="~@/assets/images/abnormal.svg" class="title-icon" alt="" />
      <div class="title-text">异常检验情况</div>
    </div>
    <div v-if="checkData.length > 0" class="content">
      <div class="content-item" v-for="i in checkData" :checkData="i" :key="i.xmmc">
        <div class="item-text">{{ i.xmmc }}</div>
        <div>
          <img v-if="i.bj === 'H'" src="~@/assets/images/up.svg" class="item-img" alt="" />
          <img v-if="i.bj === 'L'" src="~@/assets/images/down.svg" class="item-img" alt="" />
          <img v-if="i.bj === '1'" src="~@/assets/images/yangxing.svg" class="item-img" alt="" />
        </div>
        <!-- </div> -->
      </div>
      <div class="line"><img src="~@/assets/images/line.png" alt="" /></div>
    </div>
    <div v-else class="no-records-style">
      暂无记录
    </div>

    <div class="botton-pages" v-if="checkData.length > 0">
      <el-pagination
        small
        layout="prev, pager, next"
        :total="this.total"
        :page-size="this.pageSize"
        @current-change="handleCurrentChange"
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
      checkData: [],
      total: 0,
      currentPage: 1, //当前页为1
      loading: true
    }
  },
  methods: {
    getDataList() {
      //表格页获取数据
      let params = {
        apiCode: 'JK30004',
        apiVersion: '1.0',
        pageNo: '',
        pageSize: '10',
        parameters: {
          patientId: ''
        },
        selectSon: 0
      }
      params.parameters.patientId = this.$route.query.hzid
      params.pageNo = this.currentPage
      selectDataList(params).then(res => {
        this.loading = false
        this.checkData = res.data
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
    flex-direction: column;
    max-height: 160px;
    flex-wrap: wrap;
    .content-item {
      display: flex;
      padding: 5px 18px;
      justify-content: space-between;
      width: 50%;
      .item-text {
        font-size: 14px;
        line-height: 22px;
        max-width: 130px;
        overflow: hidden; /*超出的文本隐藏*/
        text-overflow: ellipsis; /*溢出用省略号显示*/
        white-space: nowrap; /*溢出不换行*/
      }
      img {
        padding-top: 2px;
      }
    }
    .line {
      position: absolute;
      left: 50%;
      top: 20%;
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
