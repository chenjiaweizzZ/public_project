<template>
  <div>
    <el-row
      class="padding-top20 padding-bottom10 border-bottom1"
      type="flex"
      justify="space-between"
      align="middle"
    >
      <div class="font-size2 color-333">签约负责人员</div>
      <div>
        <el-button type="primary" @click="onEditMember" plain>编辑</el-button>
      </div>
    </el-row>
    <el-table class="margin-top20" :data="memberList" border stripe>
      <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip prop="userName" label="登录名"></el-table-column>
      <el-table-column prop="realName" label="姓名"></el-table-column>
      <el-table-column show-overflow-tooltip prop="phone" label="电话"></el-table-column>
      <el-table-column show-overflow-tooltip prop="description" label="医生介绍"></el-table-column>
      <el-table-column show-overflow-tooltip prop="stateCheck" label="是否可签约">
        <template slot-scope="scope">
          <el-switch @change="getupdateSignMemberStatus(scope.row)" v-model="scope.row.signState"></el-switch>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :width="100" fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row)" type="text">编辑</el-button>
          <el-button @click="onDeleteMember(scope.row)" type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="memberList.length"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageIndex"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
    ></el-pagination>
    <MemberDialog v-if="dialogVisible" :show.sync="dialogVisible"></MemberDialog>
    <el-dialog title="编辑负责人员信息" :visible.sync="doctor" width="50%" :before-close="doctorfalse">
      <div class="doctorbox">
        <div>
          <p>医生姓名</p>
          {{doctorInformation.realName}}
        </div>
        <div>
          <p>是否可签约</p>
          <el-switch v-model="doctorInformation.signState"></el-switch>
        </div>
        <div>
          <p>医生介绍</p>
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="doctorInformation.description"
            maxlength="100"
            show-word-limit
          ></el-input>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="doctorfalse">取 消</el-button>
        <el-button type="primary" @click="getsaveSignMemberDetail">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import pagination from '@/mixins/pagination'
import MemberDialog from './memberDialog'
import { Row } from 'element-ui'
export default {
  name: 'member-list',
  props: {
    item: Object,
    default() {
      return null
    },
  },
  data() {
    return {
      doctor: false,
      memberList: [],
      dialogVisible: false,
      doctorInformation: {},
      signStateBackup: null,
    }
  },
  watch: {
    item() {
      if (this.item) {
        this.getMainList()
      } else {
        this.memberList = []
        this.total = 0
      }
    },
  },
  mixins: [pagination],
  components: { MemberDialog },
  methods: {
    doctorfalse() {
      this.doctor = false
      this.doctorInformation.signState = this.signStateBackup
    },
    getupdateSignMemberStatus(row) {
      this.$apis
        .updateSignMemberStatus({
          serialNo: row.serialNo,
          signState: row.signState,
        })
        .then((res) => {
          if (res) {
            this.$message({
              message: '操作成功',
              type: 'success',
            })
          } else {
            row.signState = !row.signState
            this.$message({
              message: '操作失败',
              type: 'warning',
            })
          }
        })
    },
    getsaveSignMemberDetail() {
      this.$apis
        .saveSignMemberDetail({
          description: this.doctorInformation.description,
          signState: this.doctorInformation.signState,
          serialNo: this.doctorInformation.serialNo,
        })
        .then((res) => {
          if (res) {
            this.$message({
              message: '提交成功',
              type: 'success',
            })
          } else {
            this.$message({
              message: '操作失败',
              type: 'warning',
            })
          }
          this.doctor = false
          this.getMainList()
        })
    },
    edit(row) {
      this.signStateBackup = JSON.parse(JSON.stringify(row.signState))
      this.doctor = true
      this.doctorInformation = JSON.parse(JSON.stringify(row))
    },
    onDeleteMember(item) {
      this.$confirm(`是否删除?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$apis.delSignMember({ serialNo: item.serialNo }).then(() => {
            this.$message.success('删除成功')
            this.getMainList()
          })
        })
        .catch()
    },
    onEditMember() {
      this.dialogVisible = true
    },
    getMainList(item) {
      this.$apis
        .getSignMember({
          packageSerialNo: this.item.serialNo,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          hospitalId: this.item.hospitalId,
        })
        .then((res) => {
          this.memberList = res.list
          this.total = res.total
        })
    },
  },
}
</script>
<style lang="scss">
.doctorbox {
  div {
    padding-bottom: 20px;
    display: flex;
    align-items: flex-start;
    p {
      width: 100px;
      // line-height: 30px;
      padding-right: 20px;
      text-align: right;
    }
    .el-textarea {
      width: 80%;
    }
  }
  .el-textarea .el-input__count {
    bottom: 21px;
  }
}
</style>