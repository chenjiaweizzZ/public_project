<!-- 指标分类管理 -->
<template>
  <div class="content">
    <div class="top-select">
      <el-form class="form-style" :inline="true" :model="formInline">
        <el-form-item>
          <el-input
            class="input-style"
            v-model.trim="input"
            placeholder="请输入分类名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="search-button"
            type="primary"
            icon="el-icon-search"
            @click="searchClick"
            plain
          ></el-button>
        </el-form-item>
        <el-form-item class="module-select">
          <el-button type="success" plain size="mini" @click="showCreateDialog">新增</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="list">
      <div>
        <el-table
          class="table-style"
          :data="listData"
          :header-cell-style="{ 'text-align': 'center' }"
          :cell-style="{ height: '28px' }"
          border
          stripe
        >
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="showdeleteDialog(scope.row)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            label="序号"
            type="index"
            width="80"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="分类名称" prop="name" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-if="scope.row.editFlag === true">
                <el-input v-model="scope.row.name" @input="changeValue" maxlength="30">
                  <el-button
                    slot="append"
                    icon="el-icon-circle-close"
                    @click="cancelEvent(scope.row)"
                  ></el-button>
                  <el-button
                    :disabled="inputIsEnpty"
                    slot="append"
                    icon="el-icon-circle-check"
                    @click="submitEvent(scope.row)"
                  ></el-button>
                </el-input>
              </div>
              <div v-else class="editIcon-style">
                <span>{{ scope.row.name }}</span>
                <img src="~@/assets/svg/edit.svg" @click="editFlagEvent(scope.row)" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="pages-style">
      <el-pagination
        class="pages-left"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 30, 50, 100]"
        :page-size="this.pageSize"
        layout="total, sizes"
        :total="this.total"
      >
      </el-pagination>
      <el-pagination
        class="pages-right"
        background
        @current-change="handleCurrentChange"
        layout="prev, pager, next"
        :page-size="this.pageSize"
        :total="this.total"
      >
      </el-pagination>
    </div>
    <el-dialog :visible.sync="deleteDialogVisible" width="21%">
      <template>
        <div slot="title" class="title-style">
          <div class="blue-box"></div>
          <span class="title-text" v-if="isExistFlag === true">提醒</span>
          <span class="title-text" v-else>删除</span>
        </div>
      </template>
      <span v-if="isExistFlag === true">该分类已有指标，无法删除</span>
      <span v-else>确认删除分类吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button v-show="isExistFlag === false" size="mini" @click="deleteDialogVisible = false"
          >取 消</el-button
        >
        <el-button v-show="isExistFlag === false" type="primary" size="mini" @click="deleteEvent"
          >确 定</el-button
        >
        <el-button
          v-show="isExistFlag === true"
          type="primary"
          size="mini"
          @click="deleteDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog :visible.sync="createDialogVisible" :close-on-click-modal="false" width="34%">
      <template>
        <div slot="title" class="title-style">
          <div class="blue-box"></div>
          <span class="title-text">新增分类</span>
        </div>
      </template>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            maxlength="30"
            placeholder="请输入名称"
            show-word-limit
          ></el-input> </el-form-item
      ></el-form>
      <span slot="footer" class="dialog-footer">
        <el-button class="diaog-button-style" @click="resetForm" style="height: 28px" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')" style="height: 28px" size="mini">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getStatisticsClassList,
  addStatisticsClass,
  deleteStatisticsClass,
  updateStatisticsClass,
  isExistStatistics,
} from "@/service/biTools"
export default {
  name: "biTargetsClassified",
  components: {},
  data() {
    return {
      formInline: {},
      listData: [],
      input: "",
      activeRow: "",
      activeTitle: "",
      deleteRow: "",
      createDialogVisible: false,
      deleteDialogVisible: false,
      inputIsEnpty: false,
      isExistFlag: false,
      total: 0,
      pageSize: 10,
      ruleForm: { name: "" },
      rules: {
        name: [{ required: true, message: "请输入分类名称", trigger: "blur" }],
      },
      // loading: true,
    }
  },
  created() {
    this.searchClick()
  },
  methods: {
    //搜索
    searchClick() {
      let params = {
        pageNo: 1, //当前页为1
        pageSize: 10, //页面大小默认为10
        name: "",
      }
      params.name = this.input
      params.pageNo = this.pageNo
      params.pageSize = this.pageSize
      getStatisticsClassList(params)
        .then((res) => {
          this.listData = res.list
          this.total = res.total
        })
        .catch(() => {})
    },
    //点击编辑Icon
    editFlagEvent(row) {
      // row.editFlag = true
      this.$set(row, "editFlag", true)
      if (this.activeRow && this.activeRow !== row) {
        this.$set(this.activeRow, "editFlag", false)
      }
      if (this.activeTitle) {
        this.activeRow.name = this.activeTitle
      }
      this.activeRow = row
      this.activeTitle = row.name
    },
    //监听编辑输入框值得改变
    changeValue(val) {
      if (val === "") this.inputIsEnpty = true
      else this.inputIsEnpty = false
    },
    //点击编辑右侧的取消
    cancelEvent(row) {
      this.activeRow.name = this.activeTitle
      this.inputIsEnpty = false
      this.$set(row, "editFlag", false)
    },
    //点击编辑右侧的确定
    submitEvent(row) {
      let params = {
        oldName: "",
        newName: "",
      }
      params.oldName = this.activeTitle
      params.newName = row.name
      updateStatisticsClass(params)
        .then((res) => {
          if (res === "修改成功") {
            this.$message({
              message: "修改成功",
              type: "success",
            })
            console.log(params, "params")
            this.activeTitle = row.name
            this.inputIsEnpty = false
            this.$set(row, "editFlag", false)
          } else if (res === "修改分类失败, 该分类名称已存在") {
            this.$message({
              message: "分类名称不能重复",
              type: "warning",
            })
          } else {
            this.$message({
              message: "修改失败",
              type: "error",
            })
          }
        })
        .catch(() => {
          console.log(params, "params")
        })
    },
    //新增
    showCreateDialog() {
      if (this.$refs.ruleForm) {
        this.$refs.ruleForm.resetFields()
      }
      this.createDialogVisible = true
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {
            name: "",
          }
          console.log(this.ruleForm.name, "this.ruleForm.name")
          params.name = this.ruleForm.name
          addStatisticsClass(params)
            .then((res) => {
              console.log(res, "res")
              if (res === "新增成功") {
                this.$message({
                  message: "新增成功",
                  type: "success",
                })
                this.searchClick()
                this.createDialogVisible = false
              } else {
                this.$message({
                  message: "新增失败",
                  type: "error",
                })
              }
            })
            .catch((err) => {
              console.log(err)
            })
        } else {
          console.log("error submit!!")
        }
      })
    },

    //删除
    showdeleteDialog(row) {
      this.deleteRow = row
      let params = {
        name: "",
      }
      params.name = row.name
      isExistStatistics(params)
        .then((res) => {
          if (res === true) {
            this.isExistFlag = true
          } else {
            this.isExistFlag = false
          }
          this.deleteDialogVisible = true
        })
        .catch(() => {})
    },
    deleteEvent() {
      let params = {
        name: "",
      }
      params.name = this.deleteRow.name
      deleteStatisticsClass(params)
        .then(() => {
          this.$message({
            message: "删除成功",
            type: "success",
          })
          this.deleteDialogVisible = false
          this.searchClick()
        })
        .catch(() => {})
      this.searchClick()
    },

    resetForm() {
      this.createDialogVisible = false
    },

    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pageSize = val
      this.searchClick()
    },
    handleCurrentChange(val) {
      this.pageNo = val
      console.log(this.pageNo, "this.pageNo")
      this.searchClick()
    },
  },
}
</script>
<style lang="scss" scoped>
.content {
  margin: 10px;
  background-color: #ffffff;
  height: calc(100vh - 50px);
  min-width: 691px;
  .top-select {
    background-color: #ffffff;
    padding-left: 10px;
    padding-right: 10px;
    position: relative;
    .form-style {
      height: 48px;
      .input-style {
        padding: 10px 0px 10px 0px;
      }
      .search-button {
        width: 28px;
        height: 28px;
        margin: 10px;
        padding: 0;
        background: #ffffff;
      }
      .el-button--primary.is-plain {
        color: #0075ff;
      }
      .module-select {
        position: absolute;
        right: 10px;
        margin: 12px 0px 12px 4px;
      }
    }
  }
  .list {
    background-color: #ffffff;
    padding: 0px 0px 0px 10px;
    max-height: calc(100vh - 170px);
    overflow: scroll;
    .el-table {
      color: #111111;
    }

    .table-style {
      height: 100%;
      .editIcon-style {
        display: flex;
      }
      .el-button--text {
        padding: 5.5px;
      }
      .el-button--default {
        margin: 0;
        padding: 3px 5px 0px 5px;
      }
    }
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
  .title-style {
    display: flex;
    align-items: center;
    .blue-box {
      width: 4px;
      background: #0075ff;
      height: 16px;
      display: inline-block;
      margin-right: 10px;
    }
    .title-text {
      font-family: "Microsoft YaHei";
      font-size: 18px;
    }
  }
  .pages-style {
    display: flex;
    position: fixed;
    bottom: 10px;
    margin-left: 10px;
    margin-bottom: 30px;
    z-index: 2;
    .pages-left {
      background-color: #ffffff;
    }
    .pages-right {
      position: fixed;
      background-color: #ffffff;
      right: 10px;
    }
  }
}
::v-deep .el-input-group__append {
  padding: 0 !important;
}
::v-deep .el-dialog__body {
  padding: 20px 24px;
  height: 68px;
  line-height: 24px;
}
::v-deep .el-dialog__header {
  padding-bottom: 0px;
}

::v-deep .el-dialog__footer {
  padding-top: 0px;
}
::v-deep .el-form-item__label {
  line-height: 28px;
}
::v-deep .el-form-item__content {
  line-height: 0;
}
::v-deep .el-table th.el-table__cell > .cell {
  color: #666666;
}
::v-deep .el-input-group--append .el-input__inner {
  color: #111111;
}
::v-deep .el-icon-circle-close:before{
   content: url('../../../assets/svg/cancel.svg')
}
::v-deep .el-icon-circle-check:before{
   content: url('../../../assets/svg/accept.svg')
}
</style>
