<!-- 表折叠板 -->
<template>
  <el-collapse @change="getTableDtail">
    <el-collapse-item v-for="(item, index) in realUseList" :key="item.id" :name="index">
      <template slot="title">
        <div class="collapse-title">
          <div class="title-icon">
            <img src="~@/assets/images/tableIcon.svg" width="24px" height="24px" alt="" />
          </div>
          <div class="title-name">
            <div class="cn">{{ item.tableData.nameCn }}</div>
            <div class="en">{{ item.tableData.name }}</div>
          </div>
          <div class="edit-icon">
            <img
              src="~@/assets/images/export.svg"
              alt=""
              @click.stop="exportTable(item.tableData)"
            />
            <img src="~@/assets/images/edit.svg" alt="" @click.stop="editTable(item)" />
          </div>
        </div>
      </template>
      <div class="table-body">
        <el-table
          v-if="item.isShow"
          :data="item.tableFieldList"
          border
          stripe
          :height="
            28 * item.tableFieldList.length + 32 <= 312 ? 28 * item.tableFieldList.length + 32 : 312
          "
        >
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="nameCn" label="字段中文名" width="180"></el-table-column>
          <el-table-column prop="name" label="字段名" width="180"></el-table-column>
          <el-table-column prop="type" label="字段类型" width="120"></el-table-column>
          <el-table-column prop="length" label="长度" width="120"></el-table-column>
          <el-table-column prop="remark" label="说明" show-overflow-tooltip> </el-table-column>
          <el-table-column prop="isPrimary" label="主键" width="80">
            <template slot-scope="scope">
              {{ scope.row.isPrimary ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column prop="isIndex" label="索引" width="80">
            <template slot-scope="scope">
              {{ scope.row.isIndex ? '是' : '否' }}
            </template>
          </el-table-column>
          <el-table-column prop="isDefaultSelect" label="默认查询" width="120">
            <template slot-scope="scope">
              {{ scope.row.isDefaultSelect ? '是' : '否' }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>
<script>
import _ from '@/utils'
export default {
  name: '',
  props: {
    tableList: {
      type: Array
    }
  },
  data() {
    return {
      realUseList: []
    }
  },
  watch: {
    tableList: {
      handler: function(currentData) {
        this.realUseList = _.deepCopy(currentData, [])
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    editTable(item) {
      this.$emit('showEditDialog', item)
    },
    getTableDtail(activeNames) {
      if (activeNames.length === 0) return
      let index = activeNames[activeNames.length - 1]
      this.$set(this.realUseList[index], 'isShow', true)
    },
    exportTable(data) {
      this.$emit('exportTable', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.collapse-title {
  width: 100%;
  display: flex;
  align-content: center;
  .title-icon {
    display: flex;
    align-items: center;
    padding-left: 8px;
  }
  .title-name {
    flex: 1;
    display: flex;
    padding-left: 13px;
    .cn {
      padding-right: 13px;
      max-width: 300px;
      overflow: hidden; /*超出的文本隐藏*/
      text-overflow: ellipsis; /*溢出用省略号显示*/
      white-space: nowrap; /*溢出不换行*/
    }
    .en {
      max-width: 300px;
      overflow: hidden; /*超出的文本隐藏*/
      text-overflow: ellipsis; /*溢出用省略号显示*/
      white-space: nowrap; /*溢出不换行*/
    }
  }
  .edit-icon {
    width: 40px;
    margin-right: 25px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
}
.table-body {
  overflow: hidden;
  overflow-y: auto;
  max-height: 312px;
}
/* icon-arrow-right */
::v-deep .el-icon-arrow-right:before {
  background: linear-gradient(180deg, rgba(185, 226, 255, 0.25) 0%, rgba(32, 157, 248, 0.25) 100%);
  border: 0.5px solid #3284e6;
  box-sizing: border-box;
  border-radius: 2px;
  content: '\e6df' !important;
}
::v-deep .el-collapse-item__arrow {
  margin: 0 20px 0 auto !important;
  color: #0075ff;
  font-size: 16px;
}
::v-deep .el-collapse-item__arrow.is-active {
  transform: rotate(180deg) !important;
}
</style>
