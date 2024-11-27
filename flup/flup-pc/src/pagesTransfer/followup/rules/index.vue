<template>
  <section class="rules">
    <top-bar
      ref="mychild"
      style="margin-bottom:20px"
      @add="onAdd"
      @search="onSearch"
      :right="ruleStore"
    ></top-bar>
    <el-table
      style="margin-bottom:60px"
      class="rules-table"
      :data="mainList"
      stripe
      border
    >
      <el-table-column width="50" type="index" label="序号"></el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="ruleName"
        label="规则名称"
      ></el-table-column>
      <el-table-column
        prop="relationDept"
        label="关联科室"
        :formatter="(row, col, v) => v && v.split('|').join('、')"
      ></el-table-column>
      <el-table-column
        prop="createTime"
        :formatter="(row, col, v) => v && v.replace('T', ' ')"
        label="创建时间"
      ></el-table-column>
      <el-table-column width="300" label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="storage(scope.row)"
            :disabled="!rightStore"
            >存入模板库</el-button
          >
          <el-button type="text" @click="onUpdate(scope.row)">修改</el-button>
          <el-button
            type="text"
            @click="onConfig(scope.row)"
            v-if="scope.row.sourceType == 2"
            >配置</el-button
          >
          <el-button
            type="text"
            @click="onConfig(scope.row)"
            v-if="scope.row.sourceType == 1"
            >查看</el-button
          >
          <el-button type="text" @click="openUpdateHistory(scope.row)"
            >修改记录</el-button
          >
          <el-button
            type="text"
            @click="onDelete(scope.row)"
            :disabled="scope.row.sourceType == 1"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      v-if="mainList.length"
      class="page-custom pageBottom"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="pageNo"
      :page-sizes="[10, 20, 30, 50]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next"
      :total="total"
      background
    ></el-pagination>

    <!-- 配置 -->
    <rule-config
      v-if="showConfig"
      :data="row"
      :show.sync="showConfig"
      @save="refresh"
      :ruleType="0"
    ></rule-config>
    <rule-add
      v-if="showAdd"
      :data="row"
      :show.sync="showAdd"
      @save="refresh"
    ></rule-add>
    <!-- 新增修改 -->
  </section>
</template>

<script>
import TopBar from "./components/top_bar";
import Pagination from "@/mixins/pagination.js";
import RuleConfig from "./components/rule";
import RuleAdd from "./components/add";

export default {
  components: { TopBar, RuleConfig, RuleAdd },
  mixins: [Pagination],
  data() {
    return {
      mainList: [{ name: "12133", dept: "123132", time: "2020" }],
      searchQuery: null,
      row: null,
      showAdd: false,
      showConfig: false,
      hospitalId: null,
      pageNo: 1,
      pageSize: 10,
      ruleStore: true,
      rightStore: true
    };
  },
  computed: {
    type() {
      if (this.$route.params.type === "specialist") {
        return 1;
      } else if (this.$route.params.type === "whole") {
        return 0;
      } else if (this.$route.params.type === "icdm") {
        return 2;
      }
    }
  },
  created() {
    this.hospitalId = JSON.parse(sessionStorage.getItem("global")).hospital_id;
    this.onSearch();
    this.getRight();
  },
  methods: {
    storage(row) {
      this.$confirm("是否将此条规则存入模板库?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          this.$apis
            .ruleAddQuRule({
              ruleId: row.serialNo
            })
            .then(res => {
              if (res) {
                this.$message({
                  message: "存入成功",
                  type: "success"
                });
              }
            });
        })
        .catch(() => {});
    },
    //根据用户中心权限控制导入和存模板
    getRight() {
      this.$apis.getPermissions({}).then(res => {
        if (res.ret_data.featureList) {
          let ruleIndex = res.ret_data.featureList.findIndex(i => {
            return i.feature_name == "允许规则库导入";
          });
          let rightIndex = res.ret_data.featureList.findIndex(i => {
            return i.feature_name == "允许存入模板";
          });
          if (ruleIndex != -1) {
            this.ruleStore = true;
          } else {
            this.ruleStore = false;
          }
          if (rightIndex != -1) {
            this.rightStore = true;
          } else {
            this.rightStore = false;
          }
        }
        // console.log(res, 'ffffffffffffffff');
      });
    },
    onAdd() {
      this.row = null;
      this.showAdd = true;
    },
    onSearch(query) {
      this.searchQuery = query || {};
      this.pageNo = 1;
      this.getMainList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNo = 1;
      this.$refs.mychild.onSearch();
    },
    handleCurrentChange(val) {
      this.pageNo = val;
      this.getMainList();
    },
    getMainList() {
      return this.$apis
        .flupRulequeryFollowUpRuleList({
          pageNo: this.pageNo,
          pageSize: this.pageSize,
          name: this.searchQuery.name || "",
          relationDept: this.searchQuery.relativeDept || "",
          ruleType: this.type,
          hospitalId: this.hospitalId,
          sourceType: this.searchQuery.resource || 0
        })
        .then(res => {
          this.mainList = res.list;
          this.total = res.total;
        });
    },
    onConfig(row) {
      this.row = row;
      this.showConfig = true;
    },
    onUpdate(row) {
      this.row = row;
      this.showAdd = true;
    },
    refresh() {
      // console.log('1111111111111');
      this.getMainList();
    },
    openUpdateHistory(row) {
      // location.href =
      // location.origin +
      // '/pc/#/newoperationlogV2?businessName=随访规则&serialNo=' +
      // row.serialNo
      // this.$router.push(
      //   '/newoperationlogV2?businessName=随访规则&serialNo=' + row.serialNo
      // )
      var urlx;
      if (location.pathname) {
        urlx = location.origin + location.pathname;
      } else {
        urlx = location.origin + "/pc";
      }
      window.parent.postMessage(
        JSON.stringify({
          method: "addTab",
          url:
            urlx +
            "/#/newoperationlogV2?businessName=随访规则&serialNo=" +
            row.serialNo,
          //  +
          // '&token=' +
          // this.$cookie.get('token')
          title: "随访规则修改记录"
        }),
        "*"
      );
      // window.open(
      //   location.origin +
      //     '/pc/#/newoperationlogV2?businessName=随访规则&serialNo=' +
      //     row.serialNo
      // )
      // window.parent.postMessage(
      //   JSON.stringify({
      //     method: 'addTab',
      //     url: this.$baseURL.Questionnaire + '/Common/Preview?serial_no=',
      //     title: `预览${this.type == 2 ? '问卷' : '宣教'}`
      //   }),
      //   '*'
      // )
    },
    onDelete(row) {
      this.$confirm("是否删除", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$apis.flupRuledelFollowRule(row.serialNo).then(res => {
          if (this.mainList.length == 1 && this.pageNo != 1) {
            this.pageNo = this.pageNo - 1;
          }
          this.getMainList();
        });
      });
    }
  }
};
</script>

<style lang="scss">
.rules {
  padding: 10px;
  &-table {
    margin-top: 10px;
    width: 100%;
  }
}
</style>
