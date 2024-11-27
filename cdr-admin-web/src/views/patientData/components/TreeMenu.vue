<!-- 树形菜单 -->
<template>
  <el-tree
    :node-key="nodeKey"
    :default-expanded-keys="defaultExpandedKeys"
    :data="menuList"
    ref="treeRef"
    :highlight-current="true"
    :props="defaultProps"
    :current-node-key="activeTableId"
    icon-class="el-icon-arrow-right"
    @node-click="handleNodeClick"
  >
    <span class="custom-tree-node" slot-scope="{ node, data }">
      <span class="table-name" :title="node.label">{{ node.label }}</span>
      <span style="color:#0075ff">
        {{ data.count }}
      </span>
    </span>
  </el-tree>
</template>
<script>
export default {
  name: '',
  props: {
    menuList: {
      type: Array,
      default() {
        return []
      }
    },
    defaultExpandedKeys: {
      type: Array
    },
    nodeKey: {
      type: String,
      default: ''
    },
    activeTableId: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      defaultProps: {
        children: 'list',
        label: 'name'
      }
    }
  },
  watch: {
    defaultExpandedKeys() {
      this.$nextTick(() => {
        this.$refs.treeRef.setCurrentKey(this.activeTableId) //一定要加这个选中了否则样式没有出来
      })
    }
  },
  created() {},
  methods: {
    handleNodeClick(data, obj, val) {
      //如果点击了有叶子节点的父节点
      if (!obj.isLeaf) return
      this.$emit('clickTable', data)
      console.log(data, 'data', obj, 'obj', val, 'val')
    }
  }
}
</script>
<style lang="scss" scoped>
.custom-tree-node {
  flex: 1;
  display: flex;
  width: 80%;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  .table-name {
    // width: 75%;
    overflow: hidden; /*超出的文本隐藏*/
    text-overflow: ellipsis; /*溢出用省略号显示*/
    white-space: nowrap; /*溢出不换行*/
  }
  .is-current {
    // background: #0075ff;
    border-left: 4px solid#0075FF;
    color: #0075ff;
    .custom-tree-node {
      .table-name {
        font-weight: bold;
      }
    }
  }
}

::v-deep .el-tree-node is-focusable {
  color: red;
}
::v-deep .el-tree-node__children {
  .el-tree-node__content {
    height: 34px;
    text-align: left;
  }
  .is-current {
    // background: #0075ff;
    border-left: 4px solid#0075FF;
    color: #0075ff;
    .custom-tree-node {
      .table-name {
        font-weight: bold;
      }
    }
  }
}
</style>
