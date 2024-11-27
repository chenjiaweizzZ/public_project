<template>
  <div v-loading="loading">
    <el-row class="padding-bottom20 border-bottom1" type="flex" justify="space-between" align="middle">
      <div class="font-size2 color-333">团队成员</div>
      <div class="tar-right">
        <div class="member-manger">健康管理师</div>
        <div class="manger-check">
          <el-select v-model="manageId" placeholder="请选择" @change="managerSelected" @visible-change="checkManage">
            <el-option v-for="item in managerList" :key="item.userId" :label="item.realName" :value="item.userId"></el-option>
          </el-select>
          <div class="right-tip" v-if="!manageId">
            请配置对应健康管理师
          </div>
        </div>
        <el-button type="primary" @click="batchSet" plain :disabled="hospitalId != $global.hospital_id">批量设置权限</el-button>
        <el-button type="primary" @click="onEditMember" plain :disabled="hospitalId != $global.hospital_id">编辑</el-button>
      </div>
    </el-row>
    <el-table class="margin-top20" :data="memberList" border stripe>
      <el-table-column show-overflow-tooltip width="50" type="index" label="序号"></el-table-column>
      <!-- <el-table-column show-overflow-tooltip prop="userName" label="登录名"></el-table-column> -->
      <el-table-column prop="realName" label="姓名"></el-table-column>
      <el-table-column show-overflow-tooltip prop="mobilephone" label="手机号"></el-table-column>
      <el-table-column width="100" label="聊天室成员">
        <template slot-scope="scope">
          <div class="check-box">
            <el-checkbox :true-label="1" :false-label="0" v-model="scope.row.isChatMember" @change="setMember(scope.row)"></el-checkbox>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="100" label="成员展示">
        <template slot-scope="scope">
          <div class="check-box">
            <el-checkbox :true-label="1" :false-label="0" v-model="scope.row.isShowChat" @change="setShowChat(scope.row)"></el-checkbox>
          </div>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip :width="190" fixed="right" label="操作" align="center">
        <template slot-scope="scope">
          <el-button @click="onDeleteMember(scope.row)" type="text" :disabled="hospitalId != $global.hospital_id">删除</el-button>
          <el-button @click="action(scope.row,'upper')" type="text" :disabled="hospitalId != $global.hospital_id || (scope.$index == 0 && pageIndex == 1)">上移</el-button>
          <el-button @click="action(scope.row,'below')" type="text" :disabled="hospitalId != $global.hospital_id || (scope.$index == memberList.length - 1 && total - pageSize * pageIndex <= pageIndex)">下移</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination v-if="memberList.length" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pageIndex" :page-sizes="[10, 20, 30, 50]" :page-size="pageSize" layout="total, sizes, prev, pager, next" :total="total" background></el-pagination>
    <MemberDialog v-if="dialogVisible" :show.sync="dialogVisible"></MemberDialog>
  </div>
</template>

<script>
import pagination from "@/mixins/pagination";
import MemberDialog from "./memberDialog";
import { stringify } from "qs";
export default {
  name: "member-list",
  props: {
    item: Object,
    hospitalId: String,
    default() {
      return null;
    },
  },
  data() {
    return {
      memberList: [],
      dialogVisible: false,
      userId: "",
      checked: false,
      manageId: "",
      managerList: [],
      loading: false,
    };
  },
  watch: {
    item() {
      if (this.item) {
        this.pageIndex = 1;
        this.getMainList();
        this.getAllMainList();
      } else {
        this.memberList = [];
        this.total = 0;
      }
    },
  },
  mixins: [pagination],
  components: { MemberDialog },
  methods: {
    setManageId(manageId) {
      this.$nextTick(() => {
        this.manageId = manageId;
      });
    },
    onDeleteMember(item) {
      this.$confirm(`是否删除?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$apis.groupdelFlupGroupMember(item.serialNo).then(() => {
            if (this.manageId == item.userId && !item.isChatMember) {
              this.manageId = "";
              this.$emit("refresh");
            }
            this.total--;
            this.$message.success("删除成功");
            this.getMainList();
          });
        })
        .catch();
    },
    onEditMember() {
      this.dialogVisible = true;
    },
    getMainList(item) {
      // if (this.pageIndex > 1 && this.total % this.pageSize == 0) {
      //   --this.pageIndex
      // }
      this.$apis
        .groupgetFlupGroupMembersByGroupId({
          groupId: this.item.serialNo,
          state: 1,
          pageNo: this.pageIndex,
          pageSize: this.pageSize,
          hospitalId: this.item.hospitalId,
        })
        .then((res) => {
          this.memberList = res.list;
          // this.managerList = res.list.filter(i => i.isChatMember == 1)
          this.total = res.total;
        });
    },
    getAllMainList() {
      this.$apis
        .groupgetFlupGroupMembersByGroupId({
          groupId: this.item.serialNo,
          state: 1,
          pageNo: this.pageIndex,
          pageSize: 0,
          hospitalId: this.item.hospitalId,
        })
        .then((res) => {
          this.managerList = res.list.filter((i) => i.isChatMember == 1);
        });
    },
    batchSet() {
      this.$router.push("/newjurisdictionV2");
      // if (this.$isProduction) {
      //   window.parent.postMessage(
      //     JSON.stringify({
      //       method: 'addTab',
      //       url: this.$baseURL.FollowUp + '/FlupGroup/BatchHandleByUser',
      //       title: `批量设置权限`
      //     }),
      //     '*'
      //   )
      // } else {
      //   window.open(this.$baseURL.FollowUp + '/FlupGroup/BatchHandleByUser')
      // }
    },
    managerSelected(userId) {
      this.$apis
        .setGroupManager({
          userId,
          serialNo: this.item.serialNo,
        })
        .then((res) => {
          this.$emit("refresh");
        });
    },
    setMember(row) {
      this.loading = true;
      this.$apis
        .setGroupChatMember({
          userId: row.userId,
          serialNo: this.item.serialNo,
          selected: row.isChatMember,
        })
        .then((res) => {
          this.getAllMainList();
          if (this.manageId == row.userId && !row.isChatMember) {
            this.manageId = "";
          }
          this.$emit("refresh");
        });
    },
    setShowChat(row) {
      this.loading = true;
      this.$apis
        .setGroupShowMember({
          userId: row.userId,
          serialNo: this.item.serialNo,
          selected: row.isShowChat,
        })
        .then((res) => {
          if (this.manageId == row.userId && !row.isChatMember) {
            this.manageId = "";
          }
          this.$emit("refresh");
        });
    },
    action(row, action) {
      this.loading = true;
      this.$apis
        .moveGroupMemberOrder({
          serialNo: row.serialNo,
          action,
        })
        .then((res) => {
          if (this.manageId == row.userId && !row.isChatMember) {
            this.manageId = "";
          }
          this.$emit("refresh");
        });
    },
    setLoading(state) {
      this.loading = state;
    },
    checkManage(es) {
      if (es && this.managerList.length == 0) {
        this.$message({
          message: "请配置本组现有成员",
          type: "warning",
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.tar-right {
  display: flex;
  align-items: center;
}
.manger-check {
  margin-right: 10px;
  position: relative;
}
.right-tip {
  font-size: 10px;
  color: #e6a23c;
  position: absolute;
  bottom: -14px;
}
</style>

<style lang="scss">
.member-manger {
  font-size: 16px;
  margin-right: 10px;
}
.check-box {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>