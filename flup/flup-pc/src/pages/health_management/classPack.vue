<template>
  <div class="class-pack">
    <div class="header">
      <el-button type="primary" @click="addClick" plain>新增分类</el-button>
    </div>
    <div class="d-table">
      <el-table :data="mainList" border stripe height="100%">
        <el-table-column
          type="index"
          width="80px"
          label="序号"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="服务内容分类名称"
          prop="className"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="创建人"
          prop="creatorName"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="服务内容分类排序"
          prop="showOrder"
        ></el-table-column>
        <el-table-column show-overflow-tooltip label="手机端展示"
          ><template slot-scope="scope">
            <el-switch
              @input="Change($event, scope.row)"
              v-model="scope.row.showOnMobile"
              active-color="#13ce66"
              inactive-color="#f2f2f2"
              :active-value="1"
              :inactive-value="0"
            >
            </el-switch> </template
        ></el-table-column>
        <el-table-column :width="140" label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="Edit(scope.row)">编辑</el-button>
            <el-button type="text" @click="Delete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination
      class="pageBottom"
      :page-sizes="[10, 20, 30, 50]"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      background
      :current-page.sync="pageNum"
      :page-size="pageSize"
      layout="total,sizes,prev, pager, next"
      :total="total"
    ></el-pagination>
    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      :before-close="hide"
      width="460px"
    >
      <el-form ref="form" :model="form" :rules="rules" label-width="140px">
        <el-form-item label="分类名称" prop="className">
          <el-input
            v-model="form.className"
            maxlength="6"
            placeholder="请输入分类名称，不超过6个字"
          ></el-input>
        </el-form-item>
        <el-form-item label="服务内容分类排序" prop="showOrder">
          <el-input-number
            style="width: 272px;max-width: 272px;"
            v-model="form.showOrder"
            controls-position="right"
            placeholder="请输入服务内容分类序号，越大越靠前"
            :min="0"
            :max="2147483647"
          ></el-input-number>
        </el-form-item>
        <el-form-item label="手机端展示">
          <el-switch
            v-model="form.showOnMobile"
            active-color="#13ce66"
            inactive-color="#f2f2f2"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="hide">取 消</el-button>
        <el-button type="primary" @click="Determine">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      pageNum: 1,
      pageSize: 10,
      total: 0,
      title: "新增分类",
      dialogVisible: false,
      form: {
        className: "",
        showOnMobile: 0,
        showOrder: ""
      },
      mainList: [],
      rules: {
        className: [
          { required: true, message: "请输入分类名称", trigger: "change" }
        ],
        showOrder: [
          {
            required: true,
            message: "请输入服务内容分类序号，越大越靠前",
            trigger: "change"
          }
        ]
      }
    };
  },
  created() {
    this.getAllPackageClassList();
  },
  methods: {
    /**
     * 获取分类列表数据
     */
    getAllPackageClassList() {
      this.$apis
        .getAllPackageClassList({
          pageNum: this.pageNum,
          pageSize: this.pageSize
        })
        .then(res => {
          if (res.total > 0 && res.list.length == 0) {
            this.pageNum = this.pageNum - 1;
            this.getAllPackageClassList();
          } else {
            this.total = res.total;
            this.mainList = res.list;
          }
        });
    },
    /**
     * 新增分类
     */
    addClick() {
      this.dialogVisible = true;
      this.title = "新增分类";
    },
    /**
     * 编辑分类
     * @param {object} row 编辑回显数据
     */
    Edit(row) {
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
      this.title = "编辑分类";
    },
    /**
     * 删除分类
     */
    Delete(row) {
      // 判断分类下是否有健康管理包，有则提示不可删除。
      this.$confirm("确认要删除吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        customClass: "hm-width"
      })
        .then(() => {
          this.$apis
            .deletePackageClass({
              classId: row.classId
            })
            .then(res => {
              this.$message({
                message: "删除成功",
                type: "success"
              });
              this.getAllPackageClassList();
            });
        })
        .catch(() => {});
    },
    /**
     * 新增、编辑分类确定
     */
    Determine() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.title === "编辑分类") {
            this.$confirm("确认要保存修改吗？", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.Util();
              })
              .catch(() => {});
          } else {
            this.Util();
          }
        }
      });
    },
    /**
     * 取消新增、编辑分类
     */
    hide() {
      this.dialogVisible = false;
      this.form = this.$options.data.call(this).form;
      this.$refs.form && this.$refs.form.resetFields();
    },
    /**
     * 分页查询
     */
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNum = 1;
      this.getAllPackageClassList();
    },
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getAllPackageClassList();
    },
    Change(callback, obj) {
      // 调用保存接口
      if (callback == 1) {
        obj.showOnMobile = 0;
      } else {
        obj.showOnMobile = 1;
      }
      this.$apis
        .saveOrEditPackageClassInfo({
          classId: obj.classId,
          className: obj.className,
          showOnMobile: callback,
          showOrder: Number(obj.showOrder)
        })
        .then(res => {
          obj.showOnMobile = callback;
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.getAllPackageClassList();
        });
    },
    Util() {
      this.$apis
        .saveOrEditPackageClassInfo({
          classId: this.title === "编辑分类" ? this.form.classId : null,
          className: this.form.className,
          showOnMobile: this.form.showOnMobile,
          showOrder: Number(this.form.showOrder)
        })
        .then(res => {
          this.$message({
            message: "操作成功",
            type: "success"
          });
          this.hide();
          this.getAllPackageClassList();
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.class-pack {
  height: calc(100% - 82px);
  margin: 0 24px 20px;
  display: flex;
  flex-direction: column;
  .header {
    display: flex;
    margin-bottom: 20px;
    flex-direction: row-reverse;
    align-items: center;
  }
  .d-table {
    overflow-y: auto;
    flex: 1;
  }
}
</style>
