<!-- 域菜单列表 -->
<template>
  <div class="class-list">
    <section
      :class="['menu-item', realUseActiveID === i.id ? 'active-menu-item' : '']"
      v-for="(i, index) in menuList"
      @click="changeActiver(i.id)"
      :key="index"
    >
      <div :class="['class-name', realUseActiveID === i.id ? 'active-class-name' : '']">
        {{ i.className }}
      </div>
      <div class="table-number">{{ i.count }}</div>
    </section>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    menuList: {
      type: Array
    },
    activeMenuID: {
      type: Number
    }
  },
  data() {
    return {
      realUseActiveID: ''
    }
  },
  watch: {
    activeMenuID: {
      handler: function(currentData) {
        this.realUseActiveID = currentData
      },
      immediate: true
    }
  },
  created() {},
  methods: {
    changeActiver(activeID) {
      this.realUseActiveID = activeID
      this.$emit('clickItem', activeID)
    }
  }
}
</script>
<style lang="scss" scoped>
.class-list {
  width: 100%;
  height: calc(100vh - 160px);
  overflow: hidden;
  overflow-y: scroll;
  .menu-item {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 10px;
    .class-name {
      width: 65%;
      font-size: 14px;
      overflow: hidden; /*超出的文本隐藏*/
      text-overflow: ellipsis; /*溢出用省略号显示*/
      white-space: nowrap; /*溢出不换行*/
    }
    .active-class-name {
      color: #0075ff;
      font-weight: 600;
    }
    .table-number {
      color: #0075ff;
      font-size: 14px;
      padding-right: 10px;
    }
  }
  .menu-item:hover {
    background-color: #e4f1ff;
  }
  .active-menu-item {
    background-color: #e4f1ff;
    border-left: 4px solid #0075ff;
  }
}
</style>
