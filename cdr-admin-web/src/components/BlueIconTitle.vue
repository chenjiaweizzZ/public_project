<!-- 蓝色icon title -->
<template>
  <div class="blue-title">
    <div class="title-icon" :style="{ height: iconHeight + 'px' }"></div>
    <div class="title-text" :style="{ fontSize: titleFontSize + 'px' }">{{ text }}</div>
  </div>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: '标题'
    },
    titleFontSize: {
      type: Number,
      default: 18
    },
    iconHeight: {
      type: Number,
      default: 17
    }
  }
}
</script>
<style lang="scss" scoped>
.blue-title {
  display: flex;
  align-items: center;
  .title-icon {
    box-sizing: border-box;
    width: 4px;
    background: #0075ff;
    margin-top: 1px;
  }
  .title-text {
    margin-left: 5px;
  }
}
</style>
