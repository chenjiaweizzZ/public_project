<template>
  <section>
    <OperationHeader>
      <template v-slot:right>
        <!-- <treeselect
          class="width200px"
          v-model="category"
          :options="categoryList"
          placeholder="请选择分类"
        />-->
        <el-select class="width150px margin-left10" placeholder="请选择科室" v-model="dept" clearable filterable>
          <el-option v-for="(item, i) in newDeptOptions" :key="i" :label="item.deptName" :value="item.serialNo"></el-option>
        </el-select>
        <el-input class="width150px margin-left10" :placeholder="`请输入${label}名称`" v-model="templateName" clearable></el-input>
        <el-button class="margin-left10" type="primary" @click="onSearch">查询</el-button>
      </template>
    </OperationHeader>
    <el-table class="margin-top10" :data="mainList" stripe border>
      <el-table-column width="55">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.selected" :key="`${pageIndex}${scope.$index}`" @change="changeSelect(scope.row, $event)"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号" width="55"></el-table-column>
      <template v-if="type == 3">
        <el-table-column show-overflow-tooltip prop="questionnaireName" label="宣教名称"></el-table-column>
        <el-table-column width="200" :formatter="formatDept" label="科室"></el-table-column>
        <el-table-column width="200" :formatter="formatSource" label="文章来源"></el-table-column>
      </template>
      <template v-else-if="type == 2">
        <el-table-column show-overflow-tooltip prop="questionnaireName" label="问卷名称"></el-table-column>
        <el-table-column width="200" :formatter="formatDept" label="科室"></el-table-column>
      </template>
      <el-table-column width="200" label="操作">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-view" @click.stop="onPreview(scope.row)">点击预览</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="total !== 0"
      class="page-custom"
      style="margin-bottom:20px"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageIndex"
      :page-sizes="[10, 20, 30]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
    ></el-pagination>
  </section>
</template>

<script>
import deptList from '@/mixins/deptList';
import templateType from '@/mixins/templateType';
import templateCategory from '@/mixins/templateCategory';
import pagination from '@/mixins/pagination';
export default {
  name: 'select-template',
  mixins: [deptList, templateType, templateCategory, pagination],
  data() {
    return {
      mainList: [],
      selectedList: [],
      templateName: '',
      hospitalId: null,
    };
  },
  async created() {
    this.hospitalId = JSON.parse(sessionStorage.getItem('global')).hospital_id;
    this.$startLoading();
    await this.getAllNewDept();
    this.dept = '';
    await this.getCategoryV2(this.type);
    await this.getMainList();
    this.$stopLoading();
  },
  methods: {
    onSearch() {
      this.pageIndex = 1;
      this.selectedList = [];
      this.getMainList();
    },
    onPreview(item) {
      if (this.$isProduction) {
        var urlx;
        if (location.pathname) {
          urlx = location.origin + location.pathname;
        } else {
          urlx = location.origin + '/pc';
        }
        window.parent.postMessage(
          JSON.stringify({
            method: 'addTab',
            url: urlx + '/#/newpreview?serial_no=' + item.serialNo,
            title: `预览${this.type == 2 ? '问卷' : '宣教'}`,
          }),
          '*'
        );
      } else {
        window.open(location.origin + '/#/newpreview?serial_no=' + item.serialNo);
      }
    },
    formatSource(row) {
      return row.sourceType == 1 ? '原创' : row.sourceUrl;
    },
    formatDept(row) {
      let arr = this.newDeptOptions.filter((element) => {
        return row.flupDept.includes(element.serialNo);
      });
      arr = arr.map((element) => {
        return element.deptName;
      });
      return arr.join(';');
    },
    changeSelect(item, value) {
      if (value) {
        this.selectedList.push(item);
        this.selectedList = this.$_.uniqWith(this.selectedList, (arrval, othval) => {
          return arrval.serial_no == othval.serialNo;
        });
      } else {
        this.$_.remove(this.selectedList, (element) => {
          return element.serialNo === item.serialNo;
        });
      }
      console.log(this.mainList, 'this.mainList');
      this.$emit('selected', this.selectedList);
    },
    //清空所有选择
    clearSelection() {
      this.mainList.forEach((i) => {
        i.selected = false;
      });
      this.selectedList = [];
      this.$emit('selected', this.selectedList);
    },
    getMainList() {
      return this.$apis
        .templatequeryTemplateList({
          type: this.type,
          deptId: this.dept,
          templateName: this.templateName,
          categoryCode: this.category,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          hospitalId: this.hospitalId,
        })
        .then((res) => {
          this.mainList = res.list;
          this.total = res.total;
          this.mainList.forEach((element) => {
            if (
              this.selectedList.find((e) => {
                return e.serial_no === element.serialNo;
              })
            ) {
              this.$set(element, 'selected', true);
            }
          });
        });
    },
  },
};
</script>

