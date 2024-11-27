<template>
  <el-dialog
    title="审核记录"
    :visible.sync="dialogVisible"
    width="680px"
    :before-close="handleClose"
    :close-on-click-modal="false"
  >
    <el-table :data="tableData" border style="width: 100%;" max-height="600">
        <el-table-column type="index" label="序号" width="70"></el-table-column>
      <el-table-column prop="operatorName" label="审核人"> </el-table-column>
      <el-table-column prop="actionTypeName" label="审核结果"> </el-table-column>
      <el-table-column prop="operateTime" label="审核时间"> </el-table-column>
      <el-table-column prop="remark" label="备注"> </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="handleClose">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialogVisible: false,
      tableData:[],
    };
  },
  methods: {
    async init(serialNo) {
      let params = {
        pageNum:1,
        pageSize:9999,
        serialNo,
      }
      let {list} = await this.$apis.queryAuthLog(params);
      this.dialogVisible = true;
      this.tableData = list;
    },
    handleClose() {
      this.dialogVisible = false;
      this.tableData = [];
    },
  },
};
</script>
<style lang="scss" scoped>
</style>