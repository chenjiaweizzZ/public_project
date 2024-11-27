<template>
  <div class="statistical">
    <div class="left">
      <el-menu :default-active="activeIndex" class="el-menu-vertical-demo" @select="selectMenu" background-color="#fff">
        <el-menu-item index="1">
          <span slot="title">入科进度报表</span>
        </el-menu-item>
        <el-menu-item index="2">
          <span slot="title">出科进度报表</span>
        </el-menu-item>
        <el-menu-item index="3">
          <span slot="title">带教分配报表</span>
        </el-menu-item>
        <el-menu-item index="4">
          <span slot="title">出科考核报表</span>
        </el-menu-item>
        <el-menu-item index="5">
          <span slot="title">轮转过程报表</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="right">
        <statistical-table v-if="activeIndex != 5" :activeIndex="activeIndex" :key="activeIndex"></statistical-table>
        <!-- <statistical-table v-if="activeIndex != 5" :activeIndex="activeIndex"></statistical-table> -->
        <circle-process v-else></circle-process>
    </div>
  </div>
</template>
<script>
  import statisticalTable from "../../components/statisticalTable.vue"
  import circleProcess from "../../components/circleProcess.vue"
  
  export default {
    components: {
      statisticalTable,
      circleProcess
    },
    data() {
      return {
        activeIndex: "1",
      }
    },
    methods: {
      selectMenu(index) {
        console.log(index)
        this.activeIndex = index
      }
    }
  }
</script>
<style>
.statistical .el-menu {
  background-color: #fff;
  border-right: 1px solid #e6e6e6;
}
.statistical .el-menu-item {
  height: 37px;
  line-height: 37px;
}
.statistical .el-menu-item.is-active {
  position: relative;
  /* border-right: 1px solid #20a0ff; */
}

.statistical .el-menu-item.is-active::after {
  content: "";
  display: inline-block;
  position: absolute;
  width: 2px;
  height: 33px;
  top: 0;
  right: -2px;
  background-color: #20a0ff;
}

</style>
<style scoped lang="scss">
  .statistical {
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 0 20px;
    .right {
      width: calc(100% - 170px);
      padding-left: 20px;
    }
    .left {
      width: 150px;
    }
    
  }
</style>