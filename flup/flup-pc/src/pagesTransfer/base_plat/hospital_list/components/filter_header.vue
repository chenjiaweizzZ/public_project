<template>
  <div class="flex-align-spacebetween header">
    <div class="cxbox">
      搜索&emsp;
      <el-input
        placeholder="请输入医院名称"
        v-model="query.hospitalName"
        class="input-with-select limiting"
        maxlength="20"
        show-word-limit
      >
        <el-button slot="append" icon="el-icon-search" @click="onSearch"></el-button>
      </el-input>
      <el-button
        style="margin-left:50px"
        type="info"
        icon="el-icon-refresh"
        @click="getsynchospital"
      >同步</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      levelList: [],
      query: {
        hospitalName: '',
        hospitalLevel: '',
      },
      toGetLevel: {
        dictCode: 'HospitalLevel',
      },
    }
  },
  created() {
    // this.getLevel()
  },
  methods: {
    getsynchospital() {
      this.$apis.synchospital().then((res) => {
        if (Number(res) >= 0) {
          this.$message({
            message: '同步成功,已同步' + res + '数据',
            type: 'success',
          })
          this.$emit('onSearch', this.query)
        }
      })
    },
    getLevel() {
      this.$apis
        .getLevelList({
          ...this.toGetLevel,
          _: +new Date(),
        })
        .then((res) => {
          this.levelList = res
          this.levelList.unshift({ dict_code: '', dict_name: '全部等级' })
        })
    },
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

