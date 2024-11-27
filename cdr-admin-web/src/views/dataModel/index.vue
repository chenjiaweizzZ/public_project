<!-- 数据模型管理 -->
<template>
  <div class="dataModel-container">
    <!-- 左侧域菜单 -->
    <section v-loading="leftPartLoading" class="left-menu">
      <div class="create-class-btn">
        <el-button type="success" size="mini" @click="showCreateClassDialog" plain>
          新增域
        </el-button>
      </div>
      <!-- /搜索框 -->
      <div class="menu-body">
        <div class="search-input">
          <el-input v-model.trim="paramSearchValue" placeholder="请输入关键字搜索">
            <el-button slot="append" size="mini" icon="el-icon-search" />
          </el-input>
        </div>
        <!-- /域菜单主体 -->
        <ClassMenu
          v-if="showSearchResult"
          :menuList="classList"
          :activeMenuID="activeClassID"
          @clickItem="getClassDtail"
        />
        <tree-menu
          v-else
          :nodeKey="'id'"
          :defaultExpandedKeys="defaultExpandedKeys"
          :menuList="classList"
          :activeTableId="activeClassID"
          @clickTable="treeMenuClick"
        ></tree-menu>
      </div>
    </section>

    <!-- 右侧域详情 -->
    <section v-loading="rightPartLoading" class="right-detail">
      <div class="create-table-btn">
        <el-button type="success" size="mini" @click="showCreateTableEvent" plain>
          新增表
        </el-button>
        <el-button type="primary" size="mini" @click="importBtnClick" plain>
          导 入
        </el-button>
      </div>
      <div class="table-list">
        <TableCollapseList
          v-if="classTableList.length > 0"
          :tableList="classTableList"
          @showEditDialog="showEditTableEvent"
          @exportTable="exportTable"
        />
        <div v-else class="no-table">
          <div class="no-table-img">
            <img src="~@/assets/images/noTable.png" alt="" width="100%" />
          </div>
        </div>
      </div>
    </section>

    <!-- 新增域dialog -->
    <el-dialog
      :visible.sync="isShowClassCreate"
      :close-on-click-modal="false"
      @closed="classDialogClosed"
      width="500px"
    >
      <template slot="title">
        <div class="class-dialog-title">
          <div class="class-title-logo"></div>
          <div class="class-title-font">新增域</div>
        </div>
      </template>

      <el-form
        :model="formClassCreate"
        label-width="auto"
        ref="classDialog"
        :label-position="'right'"
      >
        <el-form-item
          prop="typeId"
          label="域类型"
          :rules="{
            required: true,
            message: '域类型不能为空',
            trigger: 'blur'
          }"
        >
          <el-select v-model="formClassCreate.typeId" placeholder="请选择" size="mini">
            <el-option
              v-for="item in classTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          prop="className"
          label="域 名"
          :rules="{
            required: true,
            message: '域名不能为空',
            trigger: 'blur'
          }"
        >
          <el-input v-model.trim="formClassCreate.className"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="isShowClassCreate = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="createClassOnsubmit">确 定</el-button>
      </div>
    </el-dialog>
    <TableHandleDialog
      :formData="tableFormData"
      :show.sync="isShowTableHandle"
      :model="tableHandleDModel"
      :fieldDictionary="fieldDictionary"
      :tableTypes="tableType"
      :metaDataList="metaDataList"
      @searchMetaData="searchMetaData"
      @editTable="editTableOnSubmit"
      @createTable="createTableOnSubmit"
      @loadMetaData="loadMetaData"
      @resetDic="resetDic"
      @tableTypeChange="tableTypeChange"
    />
    <ImportDialog
      :show.sync="isShowImport"
      :activeClassID="activeClassID"
      :tableTypes="tableType"
      @refresh="refreshTable"
    />
  </div>
</template>
<script>
import ClassMenu from './components/ClassMenuList.vue'
import TreeMenu from '../patientData/components/TreeMenu.vue'
import TableCollapseList from './components/TableCollapseList.vue'
import TableHandleDialog from './components/TableHandleDialog.vue'
import ImportDialog from './components/ImportDialog.vue'
import _ from '@/utils'
import * as _api from '@/service/dataModel'
import PinyinMatch from 'pinyin-match'
import * as constant from './constant'

export default {
  name: 'dataModel',
  components: {
    ClassMenu: ClassMenu,
    TreeMenu: TreeMenu,
    TableCollapseList,
    TableHandleDialog,
    ImportDialog
  },
  data() {
    return {
      paramSearchValue: '',
      classList: [],
      allClassList: [],
      isShowClassCreate: false,
      isShowTableHandle: false,
      formClassCreate: {
        typeId: 1,
        className: ''
      },
      tableHandleDModel: 'create',
      classTableList: [],
      tableFormData: constant.IClassformer,
      activeClassID: 0,
      defaultExpandedKeys: [],
      fieldDictionary: [],
      ClassListDictionary: [],
      tableType: [],
      leftPartLoading: true,
      rightPartLoading: true,
      showSearchResult: false,
      classTypeList: [],

      /* 导入导出 */
      isShowImport: false,

      /* 元数据 */
      metaDataList: [],
      mDcurPageNo: 1,
      mDPageSize: 20,
      isLoadMetaData: true
    }
  },
  watch: {
    paramSearchValue: {
      handler: function(currentData) {
        this.debounceSearch(currentData)
      }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    /* 页面数据初始化 */
    initData() {
      Promise.all([
        _api.getDictionaryByType({ dictionaryType: 0 }),
        _api.getDictionaryByType({ dictionaryType: 2 }),
        _api.getTableClassList(),
        _api.getTableClassTypeList(),
        _api.getTableDictionaryList({
          pageNo: this.mDcurPageNo,
          pageSize: this.mDPageSize
        })
      ])
        .then(result => {
          _.isNEArray(result[0])
            ? (this.fieldDictionary = result[0])
            : _.showMessage('warning', '字段类型字典获取异常')
          _.isNEArray(result[1])
            ? this.setTableType(result[1])
            : _.showMessage('warning', '表格类型获取异常')
          _.isNEArray(result[2])
            ? this.setClassList(result[2])
            : _.showMessage('warning', '获取域列表异常')
          _.isNEArray(result[3])
            ? (this.classTypeList = result[3])
            : _.showMessage('warning', '获取域类型异常')
          if (_.isNEArray(result[4].list)) {
            this.metaDataListDic = result[4].list
            this.metaDataList = _.deepCopy(this.metaDataListDic, [])
            if (!Array.isArray(this.metaDataList) || this.metaDataList.length < this.mDPageSize) {
              this.isLoadMetaData = false
            }
          } else {
            Array.isArray(result[4].list) && result[4].list.length === 0
              ? // ? _.showMessage('warning', '暂无字段，请前往元数管理添加')
                ''
              : _.showMessage('error', '获取元数据列表异常')
          }
        })
        .catch(err => {
          console.log('initData error', err)
        })
    },
    /* 加载元数据 */
    loadMetaData() {
      if (!this.isLoadMetaData) return
      _api
        .getTableDictionaryList({
          pageNo: ++this.mDcurPageNo,
          pageSize: this.mDPageSize
        })
        .then(res => {
          let metaArr = res.list
          if (!Array.isArray(metaArr) || metaArr.length < this.mDPageSize) {
            this.isLoadMetaData = false
          }
          if (_.isNEArray(metaArr)) {
            this.metaDataListDic.push(...metaArr)
            this.metaDataList = _.deepCopy(this.metaDataListDic, [])
          }
        })
    },
    searchMetaData(v) {
      _api
        .getTableDictionaryList({
          deCodeName: v,
          pageNo: 1,
          pageSize: this.mDPageSize
        })
        .then(res => {
          this.metaDataList = res.list
        })
    },
    resetDic() {
      this.metaDataList = _.deepCopy(this.metaDataListDic, [])
    },
    setTableType(arr) {
      arr.forEach(i => {
        if (i.id === 41) i.id = 1
      })
      this.tableType = arr
    },
    setClassList(arr) {
      if (Array.isArray(arr)) {
        let result = arr.filter(i => {
          if (_.isNEArray(i.list)) {
            i.list.forEach(h => {
              h.name = h.className
            })
          }
          return _.isNEArray(i.list)
        })
        this.allClassList = result
        /* step.1 更新字典 */
        let dic = []
        result.forEach(i => {
          dic.push(...i.list)
        })

        this.ClassListDictionary = dic
        /* step.2 搜索值是否为空 */
        this.paramSearchValue
          ? this.debounceSearch(this.paramSearchValue)
          : (this.classList = _.deepCopy(result, []))
        /* step.2 是否已有激活的Class */
        !this.activeClassID ? (this.activeClassID = this.classList[0].list[0].id) : ''
        this.defaultExpandedKeys = [this.activeClassID]
        this.getClassDtail(this.activeClassID, true)
      }
      this.leftPartLoading = false
    },

    /* 获取域列表 */
    getClassList() {
      this.leftPartLoading = true
      _api.getTableClassList().then(res => {
        this.setClassList(res)
      })
    },

    /* 新增域dialog显示关闭逻辑 */
    showCreateClassDialog() {
      this.isShowClassCreate = true
    },
    classDialogClosed() {
      this.$refs.classDialog.resetFields()
    },

    /* 新增编辑表格dialog显示关闭逻辑 */
    showCreateTableEvent() {
      this.tableHandleDModel = 'create'
      this.tableFormData = _.deepCopy(constant.IClassformer, {})
      this.tableFormData.tableData.tableClassId = this.activeClassID
      this.isShowTableHandle = true
    },
    showEditTableEvent(data) {
      this.tableHandleDModel = 'edit'
      this.tableFormData = _.deepCopy(data, {})
      this.isShowTableHandle = true
    },

    /* 点击树节点菜单 */
    treeMenuClick(obj) {
      this.getClassDtail(obj.id)
    },
    /* 导入后 */
    refreshTable() {
      // console.log('this.activeClassID', this.activeClassID)
      this.getClassDtail(this.activeClassID, true)
    },
    /* 获取域中table List */
    getClassDtail(id, isGet = false) {
      if (this.activeClassID === id && !isGet) return
      this.rightPartLoading = true
      if (id) {
        _api
          .getDataAndFieldList({
            classId: id
          })
          .then(res => {
            if (Array.isArray(res)) {
              res.forEach(i => {
                i.isShow = false
              })
              this.classTableList = res
              this.activeClassID = id
              this.rightPartLoading = false
            }
          })
      }
    },

    /* 导入导出相关 */
    importBtnClick() {
      this.isShowImport = true
    },
    exportTable(data) {
      _api
        .handleExportTable({
          tableDataId: data.id
        })
        .then(res => {
          const link = document.createElement('a')
          link.style.display = 'none'
          link.href = window.URL.createObjectURL(
            new Blob([res], { type: 'application/vnd.ms-excel' })
          )
          const fileName = `${data.nameCn}${data.name}`
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
        })
    },

    /* 新建域submit */
    createClassOnsubmit() {
      if (!this.formClassCreate.className) {
        return _.showMessage('warning', '域名不可为空！')
      } else if (!this.formClassCreate.typeId) {
        return _.showMessage('warning', '请选择域类型')
      }
      this.isShowClassCreate = false
      this.leftPartLoading = true
      _api
        .addTableClass(this.formClassCreate)
        .then(res => {
          _.showMessage('success', '域新增成功')
          this.getClassList()
        })
        .catch(res => {
          /* 重复名字 */
          if (res.errCode === 20002) {
            this.leftPartLoading = false
            _.showMessage('warning', res.returnMsg)
          }
        })
    },
    /* 编辑表格submit */
    editTableOnSubmit(data) {
      delete data.isShow
      _api.updateTable(data).then(() => {
        this.isShowTableHandle = false
        this.getClassDtail(this.activeClassID, true)
        _.showMessage('success', '保存成功')
      })
    },
    /* 新建表格submit */
    createTableOnSubmit(data) {
      _api.addTable(data).then(() => {
        this.isShowTableHandle = false
        this.getClassDtail(this.activeClassID, true)
        this.classList.some(i => {
          let item = i.list.find(h => {
            return h.id === this.activeClassID
          })
          if (item) return item.count++
        })
        _.showMessage('success', '表格新增成功')
      })
    },

    // 防抖搜索
    debounceSearch: _.debounce(function(v) {
      if (!v) {
        this.classList = this.allClassList
        this.showSearchResult = false
        return
      }

      let memmber = []
      this.ClassListDictionary.forEach(i => {
        if (PinyinMatch.match(i.className, v)) {
          memmber.push(i)
        }
      })
      this.classList = memmber
      this.showSearchResult = true
    }, 100),

    tableTypeChange(id) {
      if (this.tableHandleDModel === 'edit') return
      id === 1
        ? (this.tableFormData = _.deepCopy(constant.IClassformer, {}))
        : (this.tableFormData = constant.getFormData(id))
      this.tableFormData.tableData.tableClassId = this.activeClassID
    }
  }
}
</script>
<style lang="scss" scoped>
/* 20 = padding = 10*2*/
$container-h: calc(100vh - 50px);
.dataModel-container {
  display: flex;
  padding: 10px;
  overflow-x: auto; /*x轴超出后可滚动*/
  min-width: 1280px;
  .left-menu {
    width: 314px;
    display: flex;
    flex-direction: column;
    height: $container-h;
    margin-right: 10px;
    background-color: #fff;
    padding: 10px;
    .create-class-btn {
      margin-bottom: 10px;
    }
    .menu-body {
      flex: 1;
      border: 1px solid #e6e6e6;
      width: 100%;
      padding-left: 10px;
      padding-top: 10px;
      .search-input {
        width: 274px;
        margin-bottom: 10px;
      }
    }
  }
  .right-detail {
    height: $container-h;
    background-color: #fff;
    flex: 1;
    padding: 10px;
    .create-table-btn {
      display: flex;
      margin-bottom: 10px;
    }
    .table-list {
      max-height: calc(100vh - 110px);
      min-height: calc(100vh - 110px);
      overflow: hidden;
      overflow-y: auto;
      .no-table {
        position: relative;
        top: 20vh;
        width: 100%;
        display: flex;
        justify-content: center;
        .no-table-img {
          width: 28%;
          min-width: 320px;
        }
      }
    }
  }
  .class-dialog-title {
    display: flex;
    align-items: center;
    .class-title-logo {
      width: 4px;
      height: 17px;
      margin-top: 1px;
      background: #0075ff;
    }
    .class-title-font {
      font-size: 18px;
      padding-left: 5px;
    }
  }
}
::v-deep .el-input__inner {
  height: 32px;
}
/* dialog */
::v-deep .el-dialog__header {
  padding-bottom: 20px;
}
::v-deep .el-dialog__body {
  padding: 0 20px !important;
}
::v-deep .el-dialog__footer {
  padding-top: 0;
}
::v-deep .el-form-item {
  margin-bottom: 14px;
  & .el-form-item__label {
    color: #3b5370;
  }
}
::v-deep .el-tree {
  color: #111;
}
::v-deep .el-table {
  color: #111;
  &.el-table thead {
    color: #666;
  }
}
</style>
