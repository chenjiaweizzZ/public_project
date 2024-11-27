<template>
  <section class="page-wrapper">
    <OperationHeader>
      <el-button @click="goBack">返回</el-button>
      <template v-slot:right>
        <!-- <treeselect
          class="width200px"
          v-model="category"
          :options="categoryList"
          placeholder="请选择分类"
        />-->
        <el-input
          class="width200px margin-left10"
          v-model="templateName"
          :placeholder="`${label}名称`"
          clearable
        ></el-input>
        <el-button class="margin-left10" type="primary" @click="onSearch">查询</el-button>
      </template>
    </OperationHeader>
    <el-row class="margin-top10 margin-bottom10" type="flex" align="middle">
      <el-button type="primary" @click="onImport">批量导入</el-button>
      <label class="margin-left10">导入科室：</label>
      <el-select v-model="dept" placeholder="请选择科室">
        <el-option
          v-for="(item, index) in newDeptOptions"
          :key="index"
          :label="item.deptName"
          :value="item.serialNo"
        ></el-option>
      </el-select>
    </el-row>
    <el-table class="margin-top10" border stripe :data="mainList" @selection-change="changeSelect">
      <el-table-column type="selection" :width="50"></el-table-column>
      <el-table-column type="index" label="序号" :width="50"></el-table-column>
      <el-table-column prop="templateClass" label="名称"></el-table-column>
      <el-table-column prop="templateName" :label="`${label}标题`"></el-table-column>
      <el-table-column prop="categoryName" :label="`${label}分类`" :formatter="formatCategory"></el-table-column>
      <el-table-column label="操作" :width="150">
        <template slot-scope="scope">
          <el-button type="text" @click="onPreview(scope.row)">预览</el-button>
          <el-button type="text" @click="onImportSingle(scope.row)">导入</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="mainList !== 0"
      class="page-custom"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageIndex"
      :page-sizes="[5, 10, 20, 50]"
      :page-size="pageSize"
      :pager-count="5"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
    ></el-pagination>
  </section>
</template>

<script>
import deptList from '@/mixins/deptList'
import templateType from '@/mixins/templateType'
import templateCategory from '@/mixins/templateCategory'
import pagination from '@/mixins/pagination'
export default {
  name: 'template-library',
  mixins: [templateType, templateCategory, deptList, pagination],
  data() {
    return {
      mainList: [],
      templateName: '',
      selection: [],
      hospitalId: null,
    }
  },
  async created() {
    this.$startLoading()
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id
    await this.getCategoryV2(this.type)
    await this.getAllNewDept()
    await this.getMainList()
    this.$stopLoading()
  },
  methods: {
    changeSelect(val) {
      this.selection = val
    },
    goBack() {
      this.$router.go('-1')
    },
    saveImport(val) {
      if (val.length === 0) {
        this.$message({
          type: 'warning',
          message: '请选择一条数据导入',
        })
        return
      }
      this.$apis
        .templateimportTemplate({
          serialNo: val,
          flupDept: this.dept,
          createUser: this.$global.real_name,
          hospitalId: this.hospitalId,
        })
        .then(() => {
          this.$message({
            type: 'success',
            message: '导入成功',
          })
          this.$router.go('-1')
        })
    },
    onImport() {
      let selection = this.selection.map((item) => {
        return item.serialNo
      })
      this.saveImport(selection)
    },
    onImportSingle(val) {
      this.saveImport([val.serialNo])
    },
    onSearch() {
      this.pageIndex = 1
      this.getMainList()
    },
    onPreview(row) {
      var urlx
      if (location.pathname) {
        urlx = location.origin + location.pathname
      } else {
        urlx = location.origin + '/pc'
      }
      if (this.$isProduction) {
        window.parent.postMessage(
          JSON.stringify({
            method: 'addTab',
            url:
              urlx +
              '/#/newpreview?serial_no=' +
              row.serialNo +
              '&source=library',
            title: `预览${this.label}`,
          }),
          '*'
        )
      } else {
        window.open(
          urlx + '/#/newpreview?serial_no=' + row.serialNo + '&source=library'
        )
      }
    },
    getMainList() {
      return this.$apis
        .baseTemplatequeryQuBaseTemplateList({
          type: this.type - 1,
          categoryCode: this.category || '',
          templateName: this.templateName,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.mainList = res.list
          this.total = res.total
        })
    },
    formatCategory(row) {
      // if (row.parentDictName) {
      //   return `${row.parentDictName}/${row.categoryName}`
      // } else {
      //   return row.categoryName
      // }
      return row.categoryName
    },
  },
}
</script>
