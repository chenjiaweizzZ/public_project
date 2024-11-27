<template>
  <div class="left-nav">
    <div
      v-for="item in menuList"
      :key="item.value"
      :class="['nav-item', activeValue === item.value ? 'active-item' : '']"
      @click="itemClick(item)"
    >
      <img :src="item.url" />
      <span>{{ item.label }}</span>
    </div>
  </div>
</template>
<script>
export default {
  name: '',
  props: {
    menuList: {
      type: Array
    },
    leftNavActive: {
      type: String
    }
  },
  watch: {
    leftNavActive(val) {
      this.activeValue = val
    }
  },
  data() {
    return {
      activeValue: '0'
    }
  },

  created() {},
  methods: {
    itemClick(val) {
      this.$emit('leftNavClick', val)
    }
  }
}
</script>
<style lang="scss" scoped>
.left-nav {
  .nav-item {
    height: 48px;
    font-weight: 700;
    font-size: 14px;
    color: #333;
    justify-content: space-around;
    background-color: #f9fbfe;
    padding: 14px 18px;
    img {
      vertical-align: middle;
    }
    span {
      margin-left: 13px;
    }
  }
  .active-item {
    background-color: #e3eafc;
    border-right: 3px solid #0075ff;
    color: #0075ff;
  }
}
</style>
