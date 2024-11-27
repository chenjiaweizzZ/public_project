<template>
  <div class="flex-align-spacebetween margin-bottom20 header">
    <el-button type="primary" @click="onClickLeftBtn">新增</el-button>
    <div class="flex-align-end query">
      <el-select
        class="query-item"
        clearable
        v-model="query.moduleId"
        placeholder="所属模块"
      >
        <el-option
          v-for="item in moduleList"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        class="query-input"
        clearable
        v-model="query.roleName"
        placeholder="名称"
        @keyup.enter.native="onSearch"
      ></el-input>
      <el-button class="query-item" type="primary" @click="onSearch">查询</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props:['moduleList'],
  data() {
    return {
      query: {
        roleName: '',
        moduleId:''
      }
    };
  },
  methods: {
    onClickLeftBtn(){
      this.$emit('onClickLeftBtn')
    },
    onSearch() {
      this.$emit("onSearch", this.query);
    }
  },
};
</script>

<style lang="scss" scoped>
.header {
  background-color: #eee;
  padding: 20px 10px;
}
.query {
  // width: 600px;
  // flex-wrap: wrap;
  .query-item,
  .query-input {
    margin-left: 10px;
  }
  .query-input {
    flex: 0 0 130px;
  }
}
</style>
