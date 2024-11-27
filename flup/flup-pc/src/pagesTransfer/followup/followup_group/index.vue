<template>
  <div class="followup-group">
    <operationHeader class="margin-bottom20 tabWrap">
      <div class="tab">
        <section>
          <div class="label">所属医院</div>
          <el-select class="width200 value" v-model="query.hospitalId" placeholder="所属医院" @change="changeHospital" clearable>
            <el-option v-for="item in hospitalList" :key="item.serial_no" :value="item.serial_no" :label="item.hospital_name" :disabled="item.serial_no !== $global.hospital_id"></el-option>
          </el-select>
        </section>
        <section>
          <div class="label">科室</div>
          <el-select class="width200 value" v-model="query.dept" placeholder="科室" @change="getMainList" clearable filterable>
            <el-option v-for="item in deptOptions" :key="item.serialNo" :value="item.serialNo" :label="item.deptName"></el-option>
          </el-select>
        </section>
        <section>
          <div class="label">团队类型</div>
          <el-select class="width200 value" v-model="query.groupType" placeholder="团队类型" @change="getMainList" clearable>
            <el-option v-for="item in groupTypeList" :key="item.value" :value="item.value" :label="item.label"></el-option>
          </el-select>
        </section>
        <section v-if="componentValue == 1">
          <div class="label">状态</div>
          <el-select class="width200 value" v-model="query.authState" placeholder="请选择" @change="getMainList" clearable>
            <el-option label="待审核" value="0"></el-option>
            <el-option label="审核通过" value="1"></el-option>
            <el-option label="审核未通过" value="2"></el-option>
            <el-option label="已撤回" value="3"></el-option>
          </el-select>
        </section>
        <section>
          <div class="label">搜索</div>
          <el-input class="width280px value limiting" v-model="query.keyword" placeholder="请输入组名称" maxlength="30" show-word-limit>
            <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
            <!-- <el-button
              slot="append"
              icon="el-icon-search"
              @click="onSearch"
              onclick="MtaH5.clickStat('group2')"
            ></el-button>-->
          </el-input>
        </section>
      </div>
      <template v-slot:right>
        <el-button type="primary" @click="onAddGroup" plain :disabled="query.hospitalId != $global.hospital_id">新增</el-button>
      </template>
    </operationHeader>
    <div class="tables-box">
      <div class="tables-box-left"><el-table ref="table" class="margin-top20" :data="mainList" @current-change="onChangeCurrentGroup" highlight-current-row border stripe>
          <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
          <el-table-column show-overflow-tooltip prop="groupName" label="团队名称"></el-table-column>
          <el-table-column prop="deptName" label="科室"></el-table-column>
          <el-table-column show-overflow-tooltip prop="groupType" :formatter="formatGroupType" label="组类型"></el-table-column>
          <el-table-column show-overflow-tooltip prop="showOnMobile" label="手机端展示">
            <template slot-scope="scope">
              <el-switch  v-model="scope.row.showOnMobile" active-color="#13ce66" inactive-color="#f2f2f2" :active-value="1" :inactive-value="0" @input="change(scope.row)">
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="note" label="备注"></el-table-column>
          <!-- <el-table-column show-overflow-tooltip :formatter="$utils.formatTableDate('YYYY-MM-DD hh:mm:ss')" width="200" prop="createTime" label="创建时间"></el-table-column> -->
          <el-table-column prop="authState" width="130" label="状态" v-if="componentValue == 1">
            <template slot-scope="{row}">
              <span v-if="row.authState == 0">待审核</span>
              <span v-else-if="row.authState == 1">审核通过</span>
              <span v-else-if="row.authState == 2">审核不通过</span>
              <span v-else>已撤回</span>
            </template>
          </el-table-column>
          <!-- <el-table-column show-overflow-tooltip width="200" prop="createTime" label="创建时间"></el-table-column> -->
          <el-table-column show-overflow-tooltip :min-width="100" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button @click.stop="onEditGroup(scope.row)" type="text" :disabled="query.hospitalId != $global.hospital_id">编辑</el-button>
              <el-button @click="onDeleteGroup(scope.row)" type="text" :disabled="query.hospitalId != $global.hospital_id">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination v-if="mainList.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background></el-pagination>
      </div>
      <div class="tables-box-right">
        <MemberList ref="memberList" :item="currentGroup" :hospitalId="query.hospitalId" @refresh="refresh"></MemberList>
      </div>
    </div>
    <GroupDialog v-if="dialogVisible" :show.sync="dialogVisible" :data="dailogData" :componentValue="componentValue">
    </GroupDialog>
  </div>
</template>

<script>
import MemberList from "./components/memberList";
import pagination from "@/mixins/pagination";
// import dept from '@/mixins/deptList'
import GroupDialog from "./components/groupDialog";
import MemberDialog from "./components/memberDialog";
export default {
  name: "followup-group",
  mixins: [pagination],
  components: { GroupDialog, MemberDialog, MemberList },
  data() {
    return {
      index: 0,
      query: {
        hospitalId: this.$global.hospital_id,
        groupType: "",
        keyword: "",
        dept: "",
        authState: "",
      },
      deptOptions: [],
      memberList: [],
      mainList: [],
      hospitalList: [],
      groupTypeList: [
        { label: "随访组", value: 0 },
        { label: "慢病组", value: 1 },
      ],
      currentDialog: "",
      dialogVisible: false,
      dailogData: "",
      currentGroup: null,
      componentValue: "0", //0 不需要审核 1 需要审核
    };
  },
  async created() {
    this.$startLoading();
    let obj = await this.$apis.queryFlupConfigOne({
      hospitalId: this.$global.hospital_id,
      moduleCode: "followUpSetting",
      componentKey: "flupGroupCreateAuth",
    });
    if (obj) {
      this.componentValue = obj.componentValue;
    }
    await this.$apis.hospitalgetAllHospitals().then((res) => {
      this.hospitalList = res || [];
    });
    await this.getDeptList();
    await this.getMainList();
    this.$stopLoading();
  },
  methods: {
    getDeptList() {
      return this.$apis
        .departmentgetFlupDeptByHospitalId({
          hospitalId: this.query.hospitalId,
        })
        .then((res) => {
          this.deptOptions = res || [];
        });
    },
    changeHospital() {
      this.query.dept = "";
      this.getDeptList();
      this.getMainList();
    },
    onSearch() {
      this.pageIndex = 1;
      this.getMainList();
    },
    onChangeCurrentGroup(item) {
      // if (!item) {
      //   this.memberList = [];
      // }
      let index = 0;
      if (item) {
        this.currentGroup = item;
        this.mainList.forEach((i) => {
          if (i.serialNo == item.serialNo) {
            this.index = index;
          } else {
            index += 1;
          }
        });
        this.$refs.memberList.setManageId(item.manageUserId);
      }
    },
    onDeleteGroup(item) {
      this.$confirm(`是否删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$apis
            .groupdeleteFlupGroup({ serialNo: item.serialNo })
            .then(() => {
              this.$message.success("删除成功");
              this.total--;
              this.getMainList();
            });
        })
        .catch();
    },
    onAddGroup() {
      this.dialogVisible = true;
      this.currentDialog = this.$options.components.GroupDialog;
      this.dailogData = null;
    },
    onEditGroup(item) {
      this.dialogVisible = true;
      this.currentDialog = this.$options.components.GroupDialog;
      this.dailogData = item;
    },
    formatGroupType(row, col, value) {
      let obj = this.groupTypeList.find((item) => {
        return item.value === value;
      });
      return obj && obj.label;
    },
    getMainList() {
      // if (this.pageIndex > 1 && this.total % this.pageSize == 0) {
      //   --this.pageIndex
      // }
      return this.$apis
        .groupgetFlupGroupList({
          ...this.query,
          // dept_id: this.dept,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.mainList = res.list;
          this.total = res.total;
          this.$refs.table.setCurrentRow(this.mainList[0]);
        });
    },
    refresh() {
      return this.$apis
        .groupgetFlupGroupList({
          ...this.query,
          // dept_id: this.dept,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
        })
        .then((res) => {
          this.mainList = res.list;
          this.total = res.total;
          this.$refs.table.setCurrentRow(this.mainList[this.index]);
          this.$refs.memberList.setLoading(false);
        });
    },
    change(row) {
      this.$apis.updateShowOnMobile(row.serialNo).then(res => {
        console.log(res)
      })
    }
  },
};
</script>

<style lang="scss">
.followup-group {
  padding: 0px 20px 20px 20px;
}
</style>
<style lang="scss" scoped>
.followup-group {
  .tabWrap {
    padding-bottom: 0px;
  }

  .tables-box {
    display: flex;
    justify-content: space-between;
    &-left {
      flex: 1;
      margin-right: 20px;
      padding-right: 20px;
      border-right: 1px solid rgba(216, 216, 216, 0.3);
    }
    &-right {
      flex: 1;
    }
  }

  .tab {
    display: flex;
    flex-wrap: wrap;

    & > section {
      display: flex;
      align-items: center;
      margin-right: 10px;
      margin-bottom: 16px;
      flex-shrink: 0;
    }
  }
}
</style>