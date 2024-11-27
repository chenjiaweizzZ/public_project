<template>
  <OperationHeader class="rule-top-bar">
    <el-button type="primary" @click="onAdd" plain>新增</el-button>
    <el-button type="info" plain @click="goRulesWarehouse" :disabled="!right">从规则库导入</el-button>
    <template v-slot:right>
      <ul>
        <li>
          <span class="margin-left10">规则来源</span>
          <el-select v-model="resource" @change="onSearch">
            <el-option v-for="item in resourceList" :key="item.value" :value="item.resourceCode" :label="item.resourceName"></el-option>
          </el-select>
        </li>
        <li>
          <span class="margin-left10">关联科室</span>
          <el-select v-model="dept" clearable @change="onSearch" filterable>
            <el-option v-for="item in newDeptOptions" :key="item.Value" :value="item.deptName" :label="item.deptName"></el-option>
          </el-select>
        </li>
        <li>
          <!-- <el-input
            placeholder="请输入名称"
            v-model="name"
            clearable
          ></el-input>-->
          <el-input placeholder="请输入名称" v-model="name" class="input-with-select limiting" maxlength="20" show-word-limit>
            <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
          </el-input>
        </li>
      </ul>
      <!-- <el-button class="margin-left10" @click="onSearch">查询</el-button> -->
    </template>
  </OperationHeader>
</template>

<script>
import deptMixin from '@/mixins/deptList.js';
export default {
  mixins: [deptMixin],
  data() {
    return {
      name: '',
      resource: 0,
      resourceList: [
        { resourceCode: 0, resourceName: '全部' },
        { resourceCode: 2, resourceName: '自主创建' },
        { resourceCode: 1, resourceName: '系统开通' },
      ],
    };
  },
  props: {
    right: {
      type: Boolean,
      default: true,
    },
  },
  created() {
    this.getNewDeptList();
  },
  methods: {
    goRulesWarehouse() {
      this.$router.push('/rulesWarehouse');
    },
    onAdd() {
      this.$emit('add');
    },
    onSearch() {
      this.$emit('search', {
        name: this.name,
        relativeDept: this.dept,
        resource: this.resource,
      });
    },
  },
};
</script>

<style lang="scss">
.rule-top-bar {
  ul {
    display: flex;
    align-items: center;
    margin: 0;
    padding: 0;
  }
  li + li {
    margin-left: 10px;
  }
}
</style>