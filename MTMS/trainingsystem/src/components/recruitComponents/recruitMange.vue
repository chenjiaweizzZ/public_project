<template>
  <div class="recruiComponents">
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item label="招录时间">
        <el-date-picker v-model="formInline.recruitTime" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="招录状态：">
        <el-select v-model="formInline.status" placeholder="全部">
          <el-option :label="item.label" :value="item.value" v-for="(item,index) in statusList" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="招录名称：">
        <el-input v-model="formInline.recruitName" placeholder=""></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">搜索</el-button>
        <el-button @click="onReset">重置</el-button>
      </el-form-item>
    </el-form>
    <el-button @click="addRecruit('add')" type="primary" class="addBtn">发起招录</el-button>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="title" label="招录名称" width="300px" align="center">
        <template slot-scope="scope">
          <el-tooltip placement="top" effect="light">
            <div slot="content">
              <span>{{scope.row.title}}</span>
            </div>
            <p class="overTwoLines">{{scope.row.title}}</p>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="enrollStatus" label="招录状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.enrollStatus == 1">{{scope.row.enrollStatusTxt}}</span>
          <span class="greenText" v-if="scope.row.enrollStatus == 2">{{scope.row.enrollStatusTxt}}</span>
          <span class="redText" v-if="scope.row.enrollStatus == 3">{{scope.row.enrollStatusTxt}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startTime" label="招录时间" width="300px" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.startTime}}-{{scope.row.endTime}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center">
      </el-table-column>
      <el-table-column prop="address" label="录取人数/报名人数" align="center">
        <template slot-scope="scope">
          <p>{{scope.row.enrollNumber}}/{{scope.row.applyNumber}}</p>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" fixed="right" width="200px" align="center">
        <template slot-scope="scope">
          <el-button @click="addRecruit('edit',scope.row)" type="text" size="small">管理</el-button>
          <el-button type="text" size="small" @click="preview(scope.row)">预览</el-button>
          <el-button type="text" size="small" @click="deleteRecruit(scope.$index,scope.row)" v-if="scope.row.enrollStatus == 1">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageNum" :page-sizes="[10, 20, 30, 40]"
      :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total" class="pagination">
    </el-pagination>
  </div>
</template>
<script>
  import { post, getCookie, getStorage } from '../../config/util'
  import moment from 'moment';
  export default {
    data() {
      return {
        total: 0,
        pageSize: 10,
        pageNum: 1,
        tableData: [],
        formInline: {
          recruitTime: [],
          status: "",
          recruitName: ""
        },
        statusList: [
          { label: "全部", value: "" },
          { label: "草稿", value: "1" },
          { label: "已发布", value: "2" },
          { label: "已结束", value: "3" },
        ]
      }
    },
    created() {
      this.formInline.recruitTime[0] = moment(new Date()).startOf("month").format("YYYY-MM-DD")
      this.formInline.recruitTime[1] = moment(new Date()).endOf("month").format("YYYY-MM-DD")
      this.getTableData()
    },
    methods: {
      deleteRecruit(index, row) {
        this.$confirm('确认删除该招录计划吗？', '提示', {
          confirmButtonText: '确定删除',
          cancelButtonText: '取消'
        }).then(() => {
          post(`/enrolltrain/enroll/remove/${row.id}`).then(res => {
            if (res && res.resCode == 200) {
              this.$message({
                type: "success",
                message: "删除成功！"
              })
              this.getTableData()
            } else {
              this.$message({
                type: "error",
                message: "删除失败！"
              })
            }
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },
      onSearch() {
        this.getTableData()
      },
      getTableData() {
        post(`/enrolltrain/enroll/enrollList?pageSize=${this.pageSize}&pageNum=${this.pageNum}`, {
          startTime: moment(new Date(this.formInline.recruitTime[0])).format("YYYY-MM-DD"),
          endTime: moment(new Date(this.formInline.recruitTime[1])).format("YYYY-MM-DD"),
          enrollStatus: this.formInline.status,
          title: this.formInline.recruitName
        }).then(res => {
          if (res && res.resCode == 200) {
            this.tableData = res.rows
            this.total = res.total
          } else {
            this.$message({
              type: "error",
              message: res.resMsg || "获取招录列表错误！"
            })
          }
        })
      },
      onReset() {
        this.formInline = {
          recruitTime: [moment(new Date()).startOf("month").format("YYYY-MM-DD"), moment(new Date()).endOf("month").format("YYYY-MM-DD")],
          status: "",
          recruitName: ""
        }
      },
      handleSizeChange(val) {
        this.pageSize = val
        this.getTableData()
      },
      handleCurrentChange(val) {
        this.pageNum = val
        this.getTableData()
      },
      addRecruit(type, row) {
        this.$router.push({
          name: "addRecruit",
          query: {
            type: type,
            id: row ? row.id : false
          }
        })
      },
      preview(row) {
        this.$router.push({
          name: "previewRecrit",
          query: {
            name: row.title,
            time: row.startTime + "-" + row.endTime,
            id: row.id
          }
        })
      },
    }
  }
</script>
<style></style>
<style scoped>
  .greenText {
    color: green;
  }

  .redText {
    color: red;
  }

  .overTwoLines {
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
    text-align: center;
  }

  .pagination {
    padding-top: 20px;
    text-align: right;
  }

  .addBtn {
    margin-bottom: 20px;
  }
</style>