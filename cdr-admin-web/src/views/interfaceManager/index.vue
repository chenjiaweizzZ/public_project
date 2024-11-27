<!--  -->
<template>
  <div class="container">
    <!-- 头部新增、查询 -->
    <section class="top-section">
      <!-- 查询部分 -->
      <el-form :inline="true" :model="formData" class="demo-form-inline">
        <el-form-item>
          <el-radio-group @change="getIList('cleanCondition')" v-model="formData.status" size="mini">
            <el-radio-button :label="0">未发布</el-radio-button>
            <el-radio-button :label="1">已发布</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="编码">
          <el-input v-model="formData.apiCode" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item label="版本">
          <el-input v-model="formData.apiVersion" placeholder="请输入"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getIList" size="mini" plain>查询</el-button>
        </el-form-item>
      </el-form>
      <!-- 新增按钮 -->
      <div class="btn-create">
        <el-button @click="createGroupEvent" size="mini" type="success" plain>新增</el-button>
      </div>
    </section>

    <!-- 中部主体表格 -->
    <main class="main-table">
      <el-table
        v-loading="loading"
        :data="tableData"
        row-key="id"
        style="width: 100%"
        lazy
        :load="loadChildren"
        :tree-props="{ children: 'sonList', hasChildren: 'hasSon' }"
        border
        :row-class-name="tableRowClassName"
      >
        <el-table-column prop="idNo" label="序号" width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="apiCode" label="编码" width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="apiVersion" label="版本" width="120"> </el-table-column>
        <el-table-column prop="apiNotes" label="说明" min-width="320" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="parentField" label="父字段名" width="180" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="parentParameter" label="关联" width="240" show-overflow-tooltip>
        </el-table-column>
        <el-table-column label="操作" :width="formData.status === 0 ? 280 : 140">
          <template slot-scope="scope">
            <div v-if="formData.status === 0" class="item-handle">
              <span @click="editGroupEvent(scope.row)" class="subitem">编辑</span>
              <span @click="toSQLconfig(scope.row)" class="subitem">构建</span>
              <span @click="debugging(scope.row)" class="subitem">调试</span>
              <span @click="releaseEvent(scope.row)" class="subitem">发布</span>
              <span @click="delEvent(scope.row)" class="subitem">删除</span>
              <span @click="createSonEvent(scope.row)" class="subitem">新增</span>
            </div>
            <div v-else class="item-handle">
              <span @click="debugging(scope.row)" class="subitem">调试</span>
              <span @click="checkSQLDetail(scope.row)" class="subitem">查看</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </main>

    <!-- 底部分页 -->
    <section>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formData.pageNo"
        :page-sizes="[10, 20, 50]"
        :page-size="formData.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
      >
      </el-pagination>
    </section>

    <!-- 弹窗 -->
    <el-dialog title="配置信息" :visible.sync="showSQLDialog">
      <div v-loading="loadSQL" class="sql-section">
        <span>{{ activeSQL }}</span>
      </div>
    </el-dialog>

    <el-dialog title="调试" :visible.sync="showDebugDialog" width="500px">
      <div class="debug-section" v-loading="loadDebug">
        <el-table :data="inParams.list" border>
          <el-table-column
            label="入参"
            align="center"
            prop="key"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="参数值" align="center">
            <template slot-scope="scope">
              <el-input v-model="scope.row.value" />
            </template>
          </el-table-column>
        </el-table>
        <div class="debug-result">
          <div class="d-title">调试结果</div>
          <div class="d-result">{{ debugRresult }}</div>
        </div>
        <el-row type="flex" justify="end" style="padding-top:20px">
          <el-button @click="showDebugDialog = false">取消</el-button>
          <el-button type="primary" @click="debugSQL">调试</el-button>
        </el-row>
      </div>
    </el-dialog>

    <GroupHandleDialog
      ref="groupDia"
      :show.sync="showGroupHandle"
      :formData="groupFormData"
      :classList="classList"
      :model="groupHandleDialogModel"
      @onSubmit="groupHandleOnSubmit"
    />
  </div>
</template>
<script>
import * as _api from '@/service/interfaceManager'
import { getTableClassTypeList } from '@/service/dataModel'

import GroupHandleDialog from './components/GroupHandleDialog'
import _ from '@/utils'
import constant from './constant'
import { mapMutations } from 'vuex'

export default {
  name: '',
  components: {
    GroupHandleDialog
  },
  data() {
    return {
      formData: {
        status: 0,
        apiCode: '',
        apiVersion: '',
        pageNo: 1,
        pageSize: 20
      },
      total: 0,
      tableData: [],
      loading: true,

      showSQLDialog: false,
      activeSQL: '',
      loadSQL: false,

      showDebugDialog: false,
      inParams: {
        id: '',
        list: []
      },
      loadDebug: false,
      debugRresult: '',

      showGroupHandle: false,
      groupFormData: {},
      groupHandleDialogModel: 'create',
      classList: []
    }
  },
  watch: {},
  created() {
    this.getIList()
    getTableClassTypeList().then(res => {
      if (_.isNEArray(res)) {
        res.forEach(i => {
          let obj = {
            name: i.name,
            value: i.id + '&' + i.dbName
          }
          this.classList.push(obj)
        })
      }
    })
  },
  methods: {
    ...mapMutations('SQLConfig', ['SETAPIDATA']),

    /* 查询接口列表 */
    getIList(type = 'normal') {
      if (type === 'cleanCondition') {
        this.formData.apiCode = ''
        this.formData.apiVersion = ''
      }
      this.loading = true
      this.tableData = []
      _api.getSelectConfigList(this.formData).then(res => {
        if (_.isNEArray(res.list)) {
          // 0无子 1有子
          res.list.forEach(i => {
            i.hasSon === '0' ? (i.hasSon = false) : (i.hasSon = true)
          })
          this.tableData = res.list
        }
        this.total = res.total
        this.loading = false
      })
    },

    /* 新增接口 */
    createGroupEvent() {
      this.groupHandleDialogModel = 'create'
      this.groupFormData = _.deepCopy(constant.IGroupCreate, {})
      this.groupFormData.typeIdAndDbname = this.classList[0].value
      this.showGroupHandle = true
    },
    /* 编辑 */
    editGroupEvent(data) {
      data.parentCode
        ? (this.groupHandleDialogModel = 'editSon')
        : (this.groupHandleDialogModel = 'edit')
      console.log('data', data)
      this.groupFormData = _.deepCopy(data, {})
      if (this.groupFormData.typeId && this.groupFormData.dbName) {
        this.groupFormData.typeIdAndDbname =
          this.groupFormData.typeId + '&' + this.groupFormData.dbName
      }
      this.showGroupHandle = true
    },
    /* 新增子 */
    createSonEvent(data) {
      // console.log('data', data)
      this.groupHandleDialogModel = 'createSon'
      this.groupFormData = _.deepCopy(constant.IGroupCreate, {})
      this.groupFormData.parentCode = data.apiCode
      this.groupFormData.parentVersion = data.apiVersion
      this.groupFormData.typeIdAndDbname = this.classList[0].value
      this.showGroupHandle = true
    },
    /* 发布 */
    releaseEvent(data) {
      this.$confirm('确定要发布该接口吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _api
            .releaseSelectSql({
              id: data.id
            })
            .then(res => {
              this.$message({
                type: 'success',
                message: '发布成功!'
              })
              this.getIList()
            })
            .catch(err => {
              console.log('releaseSelectSql err', err)
              this.$message({
                type: 'error',
                message: '发布失败!'
              })
            })
        })
        .catch(() => {})
    },
    /* 删除 */
    delEvent(data) {
      this.$confirm('确定要删除该接口吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _api
            .deleteSelectSql({
              id: data.id
            })
            .then(res => {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.getIList()
            })
            .catch(err => {
              console.log('deleteSelectSql err', err)
              this.$message({
                type: 'error',
                message: '删除失败!'
              })
            })
        })
        .catch(() => {})
    },
    /* 加载子节点 */
    loadChildren(tree, treeNode, resolve) {
      if (tree.sonList && tree.sonList.length > 0) {
        resolve(tree.sonList)
        return
      }
      _api
        .getSelectConfigDetail({
          id: tree.id
        })
        .then(res => {
          resolve(res.sonList)
        })
    },

    /* 调试 */
    debugging(data) {
      this.showDebugDialog = true
      this.loadDebug = true
      this.inParams = {
        id: '',
        list: []
      }
      this.debugRresult = ''
      _api
        .getSelectParam({
          id: data.id
        })
        .then(res => {
          let obj = res.inParam
          this.inParams.id = data.id
          Object.keys(obj).forEach(key => {
            let item = {
              key: key,
              value: obj[key]
            }
            this.inParams.list.push(item)
          })
          this.loadDebug = false
        })
    },

    /* 点击调试按钮事件 */
    debugSQL() {
      let parameters = {}
      this.inParams.list.forEach(i => {
        parameters[i.key] = i.value
      })
      _api
        .debugSQL({
          id: this.inParams.id,
          selectSon: 1,
          parameters
        })
        .then(res => {
          this.debugRresult = res
        })
    },

    /* 查看 */
    checkSQLDetail(data) {
      this.showSQLDialog = true
      this.loadSQL = true
      this.activeSQL = ''
      _api
        .getSelectConfigSql({
          id: data.id
        })
        .then(res => {
          this.activeSQL = res
          this.loadSQL = false
        })
    },
    /* submit回调 */
    groupHandleOnSubmit(obj) {
      let data = this.formattedData(obj)
      switch (this.groupHandleDialogModel) {
        case 'create':
          _api
            .creatSelectSql(data)
            .then(() => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.closeWindow()
            })
            .catch(() => {
              this.$refs.groupDia.stopBtnLoading()
            })
          break
        case 'edit':
          _api
            .updateSelectSql(data)
            .then(() => {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
              this.closeWindow()
            })
            .catch(() => {
              this.$refs.groupDia.stopBtnLoading()
            })
          break
        case 'createSon':
          _api
            .creatSelectSql(data)
            .then(() => {
              this.$message({
                message: '新增成功',
                type: 'success'
              })
              this.closeWindow()
            })
            .catch(() => {
              this.$refs.groupDia.stopBtnLoading()
            })
          break
        case 'editSon':
          _api
            .updateSelectSql(data)
            .then(() => {
              this.$message({
                message: '更新成功',
                type: 'success'
              })
            })
            .catch(() => {
              this.$refs.groupDia.stopBtnLoading()
            })
          this.closeWindow()
          break
      }
    },

    closeWindow() {
      this.getIList()
      this.showGroupHandle = false
    },

    formattedData(data) {
      let obj = { ...data }
      let arr = obj.typeIdAndDbname.split('&')
      obj.typeId = parseInt(arr[0])
      obj.dbName = arr[1]
      delete obj.typeIdAndDbname
      return obj
    },

    tableRowClassName({ row, rowIndex }) {
      let len = row.idNo.split('-')
      if (len.length === 1) {
        return ''
      } else if (len.length % 2 === 0) {
        return 'o-row'
      } else {
        return 'g-row'
      }
    },

    /* 分页 */
    handleSizeChange(v) {
      this.formData.pageSize = v
      this.getIList()
    },
    handleCurrentChange(v) {
      this.formData.pageNo = v
      this.getIList()
    },

    toSQLconfig(data) {
      this.SETAPIDATA(data)
      this.$router.push('/SQLConfig')
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: calc(100vw - 20px);
  height: calc(100vh - 50px);
  padding: 10px;
  padding-left: 18px;
  background: white;
  margin: 10px 10px;
  overflow-y: auto;
  .top-section {
    display: flex;
    justify-content: space-between;
    .btn-create {
      height: 40px;
      display: flex;
      align-items: center;
    }
  }
  .main-table {
    flex: 1;
    min-height: 420px;
    overflow-y: auto;
    .item-handle {
      display: flex;
      justify-content: center;
      color: #0075ff;
      .subitem {
        padding: 4px;
      }
      .subitem:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
  }
  .sql-section {
    width: 100%;
    min-height: 100px;
    padding-bottom: 10px;
  }
  .debug-section {
    width: 100%;
    .debug-result {
      margin-top: 10px;
      .d-title {
        height: 28px;
        display: flex;
        align-items: center;
      }
      .d-result {
        width: 100%;
        min-height: 200px;
        border: 1px solid #e2e2e2;
        border-radius: 4px;
        max-height: 500px;
        overflow-y: auto;
        user-select: text;
        -moz-user-select: text;
        -moz-user-select: text;
        -ms-user-select: text;
      }
    }
  }
}
::v-deep .el-table .o-row {
  background: oldlace;
}

::v-deep .el-table .g-row {
  background: #f0f9eb;
}
</style>
