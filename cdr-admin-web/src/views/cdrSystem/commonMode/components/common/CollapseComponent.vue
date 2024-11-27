<!-- 普通模式公用的折叠组件 -->
<template>
  <div>
    <el-collapse @change="getTableDtail" class="container-style">
      <el-collapse-item v-for="(item, index) in list" :key="item.id" :name="index">
        <template slot="title">
          <img
            v-if="!item.isActive"
            src="@svg/patientCommonMode/collapseUnfold.svg"
            width="20px"
            height="20px"
            alt=""
            style="margin-right:14px"
          />
          <img
            v-else
            src="@svg/patientCommonMode/collapseFold.svg"
            width="20px"
            height="20px"
            alt=""
            style="margin-right:14px"
          />
          <slot name="title" :data="item"></slot>
        </template>
        <!-- 检验报告需要 :list="list"  -->
        <slot name="content" :obj="item" :list="list"></slot>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script>
import _ from '@/utils'
export default {
  name: '',
  props: {
    title: {
      type: String
    },
    list: {
      type: Array
    }
  },
  data() {
    return {
      realUseList: []
    }
  },
  watch: {
    list: {
      handler: function(currentData) {
       console.log(currentData,"currentData");
      },
      deep: true,
    }
  },
  methods: {
    editTable(item) {
      this.$emit('showEditDialog', item)
    },
    getTableDtail(item) {
      console.log("myItem",item);
      this.$emit('changeCollapse',item)
    }
  }
}
</script>
<style lang="scss" scoped>
.container-style {
  width: 100%;
}
/* icon-arrow-right */
::v-deep .el-icon-arrow-right:before {
  background: linear-gradient(180deg, rgba(185, 226, 255, 0.25) 0%, rgba(32, 157, 248, 0.25) 100%);
  border: 0.5px solid #3284e6;
  box-sizing: border-box;
  border-radius: 2px;
  content: '\e6df' !important; //TODO
}
::v-deep .el-collapse-item__arrow {
  margin: 0 20px 0 auto !important;
  color: #0075ff;
  font-size: 16px;
}
::v-deep .el-collapse-item__arrow.is-active {
  transform: rotate(180deg) !important;
}
::v-deep .el-collapse-item__header {
  padding: 16px 20px;
  height: 56px !important;
}
::v-deep .el-collapse-item__header.el-collapse-item__header.is-active {
  background-color: #d6efdd !important;
}
::v-deep .el-collapse-item__content{
border: 1px solid #E6E6E6;
}
</style>
