<template>
  <el-menu @open="handleMenu" @close="handleMenu" @select="handleMenu" text-color="#425B77">
    <el-submenu v-for="(item,index) in menuList" :key="index" :index="JSON.stringify(item)">
      <template slot="title">
        <div class="flex-align left-aside-display">
          <span class="bold">{{item.text == ''?'&emsp;':item.text}}</span>
          <div class="left-aside-button">
            <el-buttons style="padding:0px !important" icon="el-icon-plus" @click="handleAdd(item)"></el-buttons>
            <el-button
              style="padding:0px !important"
              icon="el-icon-edit-outline"
              @click="handleEdit(item)"
            ></el-button>
            <el-button
              style="padding:0px !important"
              icon="el-icon-delete"
              @click="handleDelete(item)"
            ></el-button>
          </div>
        </div>
      </template>
      <el-menu-item
        v-for="(jitem,jindex) in item.childNodes"
        :key="jindex"
        :index="JSON.stringify(jitem)"
      >
        <div class="flex-align left-aside-display">
          <span>{{jitem.text}}</span>
          <div class="left-aside-button">
            <el-button style="padding:0px !important" icon="el-icon-plus" @click="handleAdd(jitem)"></el-button>
            <el-button
              style="padding:0px !important"
              icon="el-icon-edit-outline"
              @click="handleEdit(jitem)"
            ></el-button>
            <el-button
              style="padding:0px !important"
              icon="el-icon-delete"
              @click="handleDelete(jitem)"
            ></el-button>
          </div>
        </div>
      </el-menu-item>
    </el-submenu>
  </el-menu>
</template>

<script>
export default {
  name: 'left_aside',
  props: ['menuList'],
  methods: {
    handleMenu(key) {
      let menu = JSON.parse(key)
      this.$emit('handleMenu', menu.id, menu.text)
    },
    handleAdd(item) {
      this.$emit('handleAdd', item)
    },
    handleEdit(item) {
      this.$emit('handleEdit', item)
    },
    handleDelete(item) {
      this.$emit('handleDelete', item)
    },
  },
}
</script>
<style lang="scss">
.left-aside-button {
  display: none;
  position: absolute;
  right: 0;
  z-index: 1;
  background-color: #ecf5ff;

  .el-button {
    padding: 5px 2px;
  }

  .el-button + .el-button {
    margin-left: 0;
  }

  .el-icon-plus,
  .el-icon-edit-outline,
  .el-icon-delete {
    margin-right: 0;
    font-size: 12px;
  }
}

.left-aside-display:hover {
  .left-aside-button {
    display: block;
  }
}
</style>
