<!-- 指标列表 -->
<template>
  <div class="container-style">
    <div class="header-box">
      <el-form ref="form" :model="searchObj" inline label-width="80px">
        <el-form-item label="指标分类">
          <el-select v-model="searchObj.classId" clearable placeholder="请选择">
            <!-- <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option> -->
            <el-option
              v-for="item in targetTypeAllList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指标类型">
          <el-select v-model="searchObj.typeId" clearable placeholder="请选择">
            <el-option
              v-for="item in viewStatisticsList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属大屏">
          <el-select v-model="searchObj.largeScreenId" clearable placeholder="请选择">
            <el-option
              v-for="item in largeScreenList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="指标名称">
          <el-input v-model="searchObj.name"></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button
            type="primary"
            plain
            style="margin-top:6px"
            class="search_btn search-style"
            @click="getStatisticsList(true)"
          >
            <img src />
          </el-button>
        </el-form-item>
      </el-form>
      <el-button
        type="success"
        plain
        size="mini"
        style="height:24px;line-height:24px;margin-right:10px"
        @click="showAddTarget"
        >新增</el-button
      >
    </div>
    <div v-loading="loading" class="targetItem-box">
      <div v-if="targetAllList.length" style="width:100%">
        <el-col
          :span="6"
          v-for="(item, index) in targetAllList"
          :key="index"
          class="targetItem-container"
        >
          <target-item
            :obj="item"
            :targetTypeAllList="targetTypeAllList"
            @showCopyEditTargetEvent="showCopyEditTargetEvent"
            @reviewTarget="reviewTarget"
            @gotoEdit="gotoEdit"
            style="margin:0px 10px 10px 0px"
          ></target-item>
        </el-col>
      </div>
      <div v-else class="nodata-style">
        <img :src="targetListNodata" />
        <div class="nodataText-style">暂无记录</div>
      </div>
    </div>
    <add-target-dialog
      :show="showAddTargetDialog"
      :targetTypeAllList="targetTypeAllList"
      :viewStatisticsList="viewStatisticsList"
      @closeAddTargetDialog="closeAddTargetDialog"
      @addTypeConfirm="getStatisticsClassList"
      @addTargetConfirm="addTargetConfirm"
    ></add-target-dialog>
    <copy-edit-target
      :show="showCopyEditDialog"
      :activeTarget="activeTarget"
      :model="copyEditModel"
      :targetTypeAllList="targetTypeAllList"
      :copyEditModel="copyEditModel"
      @closeCopyEditTarget="closeCopyEditTarget"
      @copyEditConfirm="copyEditConfirm"
    ></copy-edit-target>
    <el-dialog title="查看" :visible.sync="showReviewDialog" class="chakan-style">
      <div class="echarts-box">
        <div>{{ activeTarget.name }}</div>
        <div class="echarts-style">
          <div v-show="!previewNodata">
            <div
              v-show="activeTarget.typeId != 3"
              id="echartsId"
              ref="echarts_ref"
              style="width:400px;height:400px"
            ></div>
            <img v-show="activeTarget.typeId === 3" :src="activeTarget.thumbnail" />
          </div>
          <div v-show="previewNodata" class="preview-nodata">
            <img :src="targetRreviewNodata" style="width:320px;height:197px" />
            <div class="preview-nodataText">数据异常</div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer" style="display:flex;flex-direction:row-reverse">
        <el-button type="primary" style="margin-top:10px" @click="gotoEdit(activeTarget)">编辑</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="删除"
      :visible.sync="showDeleteDialog"
      width="30%"
      class="shanchu-dialog"
      :before-close="handleCloseDeleteDialog"
    >
      <span>删除指标后不可恢复，确认删除吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="showDeleteDialog = false">取 消</el-button>
        <el-button type="primary" @click="deleteConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <el-pagination
      align="right"
      background
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="searchObj.pageNo"
      :page-sizes="[8, 16]"
      :page-size="searchObj.pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>
<script>
import _ from '@/utils'
import _bi from '@/utils/biUtils'
import * as echarts from 'echarts'
import targetListNodata from '@/assets/images/bi/targetListNodata.png'
import targetRreviewNodata from '@/assets/images/bi/targetRreviewNodata.png'
import targetItem from './component/targetItem.vue'
import addTargetDialog from './component/addTargetDialog.vue'
import copyEditTarget from './component/copyEditTarget.vue'
import {
  getStatisticsClassList,
  addStatistics,
  viewStatistics,
  getStatisticsList,
  getLargeScreenList,
  copyStatistics,
  updateStatistics,
  getStatisticsDetail,
  deleteStatistics
} from '@/service/biTools'
export default {
  name: 'biTargetsList',
  components: {
    targetItem,
    addTargetDialog,
    copyEditTarget
  },
  data() {
    return {
      searchObj: {
        classId: null,
        typeId: null,
        largeScreenId: null,
        name: '',
        pageNo: 1,
        pageSize: 8
      },
      total: 0,
      targetRreviewNodata,
      loading: false,
      showDeleteDialog: false,
      obj: {
        apiCode: '',
        apiJson: '',
        classId: '',
        configCode: '',
        createTime: '',
        id: '',
        isDelete: '',
        name: '',
        remark: '',
        thumbnail: '',
        typeId: '',
        updateTime: ''
      },
      targetListNodata,
      copyEditModel: null,
      showAddTargetDialog: false,
      showCopyEditDialog: false,
      showReviewDialog: false,
      targetTypeAllList: [],
      viewStatisticsList: [],
      largeScreenList: [],
      targetAllList: [],
      isNodata: false,
      activeTarget: {},
      myEcharts: null,
      previewNodata: false
    }
  },
  created() {
    this.getStatisticsClassList() //获取指标分类
    this.viewStatistics() //获取指标类型
    this.getStatisticsList(true) //获取指标列表
    this.getLargeScreenList() //获取大屏列表
  },
  activated() {
    this.getStatisticsClassList() //获取指标分类
    this.getLargeScreenList() //获取大屏列表
  },
  watch: {
    'searchObj.classId': {
      handler: function() {
        this.getStatisticsList(true)
      }
    },
    'searchObj.typeId': {
      handler: function() {
        this.getStatisticsList(true)
      }
    },
    'searchObj.largeScreenId': {
      handler: function() {
        this.getStatisticsList(true)
      }
    },
    $route(to, from) {
      if (from.name === 'biTargetsEditor') {
        this.getStatisticsList(true)
      }
    }
  },
  methods: {
    addTarget() {},
    handleCloseDeleteDialog() {
      this.showDeleteDialog = false
    },
    gotoEdit(item) {
      console.log(item, 'yuyyuuuuu')
      this.showReviewDialog = false
      this.$router.push({
        name: 'biTargetsEditor',
        query: { id: item.id, screenList: JSON.stringify(item.list) }
      })
    },
    getLargeScreenList() {
      getLargeScreenList({
        pageNo: 1,
        pageSize: 1000,
        status: 0
      }).then(res => {
        console.log(res, '大屏')
        if (res.list) {
          this.largeScreenList = res.list
        }
      })
    },
    reviewTarget(obj) {
      this.activeTarget = _.deepCopy(obj, {})
      this.showReviewDialog = true

      getStatisticsDetail({ id: obj.id })
        .then(res => {
          console.log(res, '9999999999')
          // this.myEcharts=null
          // step 1 初始化init echarts dom
          // let _this=this
          if (this.activeTarget.typeId != 3) {
            this.$nextTick(() => {
              if (!this.myEcharts) {
                this.myEcharts = echarts.init(document.getElementById('echartsId'), 'dark', {
                  renderer: 'svg'
                })
              }
              // step 2 解析指标option
              let result = _bi.getOption(res)
              console.log(result, '4555')
              if (result && result.status) {
                // step 3 setOption
                // _this.$set(this, 'previewNodata', false)
                this.previewNodata = false
                console.log(this.previewNodata, 'previewNodata哈哈哈')

                this.myEcharts.setOption(result.data, true)
              } else {
                this.previewNodata = true
              }
            })
          }

          // let newPromise =new Promise((resolve)=>{
          //   resolve()
          // })
          // newPromise.then(()=>{
          //   this.myEcharts = echarts.init(document.getElementById('echartsId'))
          //     let result = _bi.getOption(res)
          //               if (result.status) {
          //     // step 3 setOption
          //     this.myEcharts.setOption(result.data)
          //   }
          // })
        })
        .catch(err => {
          this.previewNodata = true
        })
    },
    showCopyEditTargetEvent(item, obj) {
      console.log('99999888833333')
      this.copyEditModel = item.value
      this.activeTarget = _.deepCopy(obj, {})
      item.value === '3' ? (this.showDeleteDialog = true) : (this.showCopyEditDialog = true)
      console.log(this.activeTarget, 'active', this.copyEditModel)
    },
    deleteConfirm() {
      deleteStatistics({ id: this.activeTarget.id }).then(res => {
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        this.showDeleteDialog = false
        this.getStatisticsList()
      })
    },
    viewStatistics() {
      viewStatistics({
        pageNo: 1,
        pageSize: 1000
      }).then(res => {
        console.log('sss', res)
        if (res.list) {
          this.viewStatisticsList = res.list
        }
      })
    },
    showAddTarget() {
      this.showAddTargetDialog = true
      this.getStatisticsClassList()
    },
    closeCopyEditTarget() {
      this.showCopyEditDialog = false
    },
    closeAddTargetDialog() {
      this.showAddTargetDialog = false
    },
    addTargetConfirm(item) {
      addStatistics(item).then(res => {
        console.log('新增指标', res)
        this.showAddTargetDialog = false
        this.getStatisticsList()
      })
    },
    getStatisticsList(flag) {
      this.loading = true
      if (flag) {
        this.searchObj.pageNo = 1
        this.searchObj.pageSize = 8
      }
      getStatisticsList(this.searchObj).then(res => {
        console.log(res, '指标列表')
        if (res.list) {
          this.targetAllList = res.list
          this.total = res.total
          this.loading = false
          if (this.targetTypeAllList.length === 0) this.isNodata = true
        } else {
          this.isNodata = true
        }
      })
    },
    getStatisticsClassList() {
      getStatisticsClassList({
        pageNo: 1,
        pageSize: 1000
      }).then(res => {
        console.log(res, '分类res')
        if (res.list) {
          this.targetTypeAllList = res.list
        }
      })
    },
    copyStatistics(item) {
      copyStatistics(item).then(res => {
        console.log(res, '复制指标res')
        this.showCopyEditDialog = false
        this.$message({
          message: '复制成功',
          type: 'success'
        })
        this.getStatisticsList()
      })
    },
    updateStatistics(item) {
      updateStatistics(item).then(res => {
        this.showCopyEditDialog = false
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        this.getStatisticsList()
      })
    },
    copyEditConfirm(item) {
      console.log(item, 'test Iten', this.copyEditModel, this.activeTarget)
      switch (this.copyEditModel) {
        case '1':
          this.copyStatistics({ ...item, id: this.activeTarget.id })
          break
        case '2':
          this.updateStatistics(item)
          break
      }
    },
    handleSizeChange(val) {
      this.searchObj.pageSize = val
      this.getStatisticsList()
    },
    handleCurrentChange(val) {
      this.searchObj.pageNo = val
      this.getStatisticsList()
    }
  }
}
</script>
<style lang="scss" scoped>
.container-style {
  background-color: #fff;
  margin: 10px;
  padding: 10px 0px 10px 0px;
  width: calc(100vw - 20px);
  height: calc(100vh - 20px - 30px);
  .header-box {
    display: flex;
    justify-content: space-between;
  }
  .targetItem-box {
    display: flex;
    flex-wrap: wrap;
    height: calc(100vh - 40px - 50px - 90px);
    overflow-y: scroll;
    .targetItem-container{
      padding:0 0px 10px 10px;
      height:calc((100vh - 185px)/2)
    }
    .nodata-style {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;

      img {
        width: 320px;
        height: 198px;
      }
      .nodataText-style {
        text-align: center;
        font-weight: 400;
        font-size: 18px;
        color: #3b5370;
      }
    }
  }
}
.echarts-box {
  border: 1px solid #e6e6e6;
  box-sizing: border-box;
  padding: 10px;
  height: 100%;
  .echarts-style {
    background-color: #fbfbfb;
    border: 1px solid #e6e6e6;
    width: 100%;
    height: 94%;
    margin: 10px auto;
    border: 1px solid #e6e6e6;
    display: flex;
    align-items: center;
    justify-content: center;
    .preview-nodata {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      .preview-nodataText {
        font-size: 18px;
        font-weight: 400;
      }
    }
  }
}

::v-deep .el-pagination__total {
  float: left;
}
::v-deep .el-pagination__sizes {
  float: left;
}
.chakan-style {
  ::v-deep .el-dialog__title {
    border-left: 4px solid #0075ff;
    padding-left: 5px;
  }
  ::v-deep .el-dialog {
    height: 70%;
  }
  ::v-deep .el-dialog__body {
    padding: 0px 20px;
    height: 80%;
  }
}
.shanchu-dialog {
  ::v-deep .el-dialog__body {
    padding: 5px 20px;
  }
}
::v-deep .el-form-item {
  margin-bottom: 10px;
}
::v-deep .el-form-item__label {
  color: #3b5370;
}
::v-deep .el-dialog__footer{
  padding-top: 0px;
}
::v-deep .el-dialog__body{
  padding-bottom: 10px;
  padding-top: 10px;
}
::v-deep .el-button--default{
  height: 28px;
  line-height: 0;
}
::v-deep .el-button--primary{
  height: 28px;
  line-height: 0;
}
::v-deep .el-pagination{
   margin-top: 10px;
}
</style>
