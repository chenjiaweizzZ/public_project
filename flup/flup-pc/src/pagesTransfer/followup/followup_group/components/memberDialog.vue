<template>
  <el-dialog
    title="编辑团队成员"
    :visible.sync="dialogVisible"
    width="60%"
    :close-on-click-modal="false"
    :close-on-press-esc="false"
    @close="$emit('update:show', false)"
  >
    <div class="dialog-member">
      <div class="dialog-member_header">
        <div>
          <span class="color-333">团队名称</span>
          <span class="margin-left20 color-111">{{$parent.item.groupName}}</span>
        </div>
        <div class="margin-top10">
          <span class="color-333">团队类型</span>
          <span class="margin-left20 color-111">{{$parent.item.groupType == 1?'慢病组':'随访组'}}</span>
        </div>
        <div class="margin-top10">
          <span class="color-333">团队成员</span>
          <span class="margin-left20 color-111">{{members}}</span>
        </div>
      </div>
      <el-row
        class="padding-top20 padding-bottom10 border-bottom1"
        type="flex"
        align="middle"
        justify="space-between"
      >
        <div class="font-size2 color-333">用户列表</div>
        <div>
          <el-select class="width200 value" v-model="dept" placeholder="科室" clearable filterable>
            <el-option
              v-for="item in deptOptions"
              :key="item.serialNo"
              :value="item.serialNo"
              :label="item.deptName"
            ></el-option>
          </el-select>
          <el-input
            class="width200px limiting"
            placeholder="请输入关键字"
            v-model="keyword"
            maxlength="15"
            show-word-limit
          ></el-input>
          <el-button type="primary" @click="onSearch" plain>查询</el-button>
        </div>
      </el-row>
      <el-table
        ref="table"
        class="margin-top20"
        :data="mainList"
        @select-all="selectAll"
        @select="changeSelect"
        border
        stripe
      >
        <el-table-column width="50" type="selection"></el-table-column>
        <el-table-column width="50" type="index" label="序号"></el-table-column>
        <!-- <el-table-column show-overflow-tooltip prop="userName" label="登录名"></el-table-column> -->
        <el-table-column show-overflow-tooltip prop="realName" label="姓名"></el-table-column>
        <el-table-column show-overflow-tooltip prop="mobilephone" label="手机号"></el-table-column>
      </el-table>
      <el-pagination
        v-if="mainList.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageIndex"
        :page-sizes="[5, 10, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        background
      ></el-pagination>
    </div>
    <span slot="footer">
      <el-button @click="dialogVisible=false">取消</el-button>
      <el-button type="primary" @click="onSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import pagination from '@/mixins/pagination'
export default {
  name: 'member-dialog',
  props: {
    data: [Object, Array],
    show: Boolean,
  },
  mixins: [pagination],
  watch: {
    show() {
      this.dialogVisible = this.show
    },
  },
  data() {
    return {
      dept: '',
      keyword: '',
      mainList: [],
      selectedList: [],
      dialogVisible: this.show,
      deptOptions: [],
    }
  },
  computed: {
    members() {
      // console.log(this.selectedList.map(item => item.realName).join('、'))
      // return this.selectedList.map((item) => item.realName).join('、')
      let arr = this.selectedList.map((item) => item.realName)
      return Array.from(new Set(arr)).join('、')
    },
  },
  async created() {
    this.pageSize = 5
    await this.$apis
      .groupgetFlupGroupMembersByGroupId({
        pageNo: 1,
        pageSize: 99999,
        groupId: this.$parent.item.serialNo,
      })
      .then((res) => {
        this.selectedList = res.list
      })
    await this.getDeptList()
    await this.getMainList()
  },
  methods: {
    getDeptList() {
      return this.$apis
        .departmentgetFlupDeptByHospitalId({
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.deptOptions = res || []
        })
    },
    onSubmit() {
      let data = [...this.selectedList].map((item) => {
        item.groupId = this.$parent.item.serialNo
        delete item.state
        return item
      })
      this.$apis
        .groupmodifyGroupMembers({
          serialNo: this.$parent.item.serialNo,
          groupMemberList: data,
          hospitalId: this.$global.hospital_id,
        })
        .then(() => {
          this.dialogVisible = false
          this.$parent.getMainList()
        })
    },
    selectAll(rows) {
      console.log(rows)
      if (rows.length == 0) {
        // this.selectedList = [];
        this.$apis
          .groupgetFlupGroupMembersByGroupId({
            groupId: this.$parent.item.serialNo,
          })
          .then((res) => {
            this.selectedList = res.list
          })
      }
      if (rows) {
        rows.forEach((v) => {
          if (!this.selectedList.includes(v)) {
            this.selectedList.push(v)
          }
        })
      }
    },
    changeSelect(selection, row) {
      if (selection.includes(row)) {
        this.$nextTick(() => {
          this.selectedList.push(row)
        })
      } else {
        this.$nextTick(() => {
          this.$_.pullAllBy(this.selectedList, [row], 'userId')
          this.selectedList = [...this.selectedList]
        })
      }
    },
    onSearch() {
      this.pageIndex = 1
      this.getMainList()
    },
    selectable() {
      this.mainList.forEach((val) => {
        let obj = this.selectedList.find((item) => {
          return item.userId === val.userId
        })
        if (obj) {
          // console.log(val)
          this.$refs.table.toggleRowSelection(val, true)
        }
      })
    },
    getMainList() {
      return this.$apis
        .groupgetFlupGroupMembersByGroupIdAll({
          groupId: this.$parent.item.serialNo,
          state: 0,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          hospitalId: this.$parent.item.hospitalId,
          keyword: this.keyword,
          secId: this.dept,
        })
        .then((res) => {
          console.log(res)
          this.mainList = res.list
          this.total = res.total
          this.$nextTick(() => {
            this.selectable()
          })
        })
    },
  },
}
</script>

<style lang="scss">
.dialog-member {
  &_header {
    padding: 20px;
    background-color: #f8f8f8;
  }
}
</style>