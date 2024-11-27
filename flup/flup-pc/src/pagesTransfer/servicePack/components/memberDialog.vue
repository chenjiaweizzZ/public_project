<template>
  <el-dialog
    title="添加签约负责人员"
    :visible.sync="dialogVisible"
    width="60%"
    :close-on-click-modal="false"
    :close-on-press-esc="false"
    @close="$emit('update:show', false)"
  >
    <div class="dialog-member">
      <div class="dialog-member_header">
        <div>
          <span class="color-333">服务内容名称</span>
          <span class="margin-left20 color-111">{{$parent.item.packageName}}</span>
        </div>
        <div class="margin-top10">
          <span class="color-333">签约负责人员</span>
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
          <el-input class="width240px" placeholder="请输入关键字" v-model="keyWord"></el-input>
          <el-button type="primary" @click="onSearch" plain>查询</el-button>
        </div>
      </el-row>
      <el-table
        ref="table"
        class="margin-top20"
        :data="mainList"
        @select="changeSelect"
        border
        stripe
      >
        <el-table-column width="50" type="selection"></el-table-column>
        <el-table-column width="50" type="index" label="序号"></el-table-column>
        <el-table-column show-overflow-tooltip prop="userName" label="登录名"></el-table-column>
        <el-table-column show-overflow-tooltip prop="realName" label="姓名"></el-table-column>
        <el-table-column show-overflow-tooltip prop="phone" label="电话"></el-table-column>
        <el-table-column show-overflow-tooltip prop="groupName" label="组名称"></el-table-column>
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
      keyWord: '',
      mainList: [],
      selectedList: [],
      dialogVisible: this.show,
      backupList: [],
    }
  },
  computed: {
    members() {
      // console.log(this.selectedList.map((item) => item.realName).join('、'))
      return this.selectedList.map((item) => item.realName).join('、')
    },
  },
  async created() {
    console.log(this.$parent.item)
    this.pageSize = 5
    await this.$apis
      .getSignMember({
        packageSerialNo: this.$parent.item.serialNo,
        pageNo: 1,
        pageSize: 1000,
      })
      .then((res) => {
        this.selectedList = res.list
        this.backupList = JSON.parse(JSON.stringify(res.list))
      })
    await this.getMainList()
  },
  methods: {
    onSubmit() {
      let _this = this
      let data = [...this.selectedList].map((item) => {
        item.packageSerialNo = this.$parent.item.serialNo
        delete item.stateCheck
        return item
      })

      let deletemodel = null
      if (this.backupList.lenght != 0) {
        deletemodel = _this.backupList.filter(function (val) {
          if (JSON.stringify(data).indexOf(val.serialNo) == -1) {
            return val
          }
        })
      }
      let insertmodel = data.filter(function (val) {
        if (JSON.stringify(_this.backupList).indexOf(val.serialNo) == -1) {
          return val
        }
      })
      this.$apis
        .saveSignMember({
          insertmodel: insertmodel,
          deletemodel: deletemodel,
        })
        .then(() => {
          this.dialogVisible = false
          this.$parent.getMainList()
        })
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
          console.log(val)
          this.$refs.table.toggleRowSelection(val, true)
        }
      })
    },
    getMainList() {
      return this.$apis
        .getSignMemberByPackageNo({
          packageSerialNo: this.$parent.item.serialNo,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          hospitalId: this.$parent.item.hospitalId,
          keyWord: this.keyWord,
        })
        .then((res) => {
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