<template>
  <div class="flex-align-spacebetween header">
    <div class="cxbox">
      搜索&emsp;
      <el-input
        placeholder="请输入用户名/真实姓名"
        v-model="query.keyword"
        class="input-with-select limiting"
        maxlength="20"
        show-word-limit
      >
        <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: {
        keyword: '',
      },
    }
  },
  methods: {
    onClickLeftBtn() {
      this.$emit('onClickLeftBtn')
    },
    onSearch() {
      this.$emit('onSearch', this.query)
    },
  },
}
</script>

<style lang="scss" scoped>
.cxbox {
  width: 100%;
  padding: 15px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-bottom: 20px;
  background-color: #f8f8f8;
  .el-input--small {
    margin-right: 10px;
    width: 280px;
  }
}
</style>
