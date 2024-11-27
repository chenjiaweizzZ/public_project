<template>
  <div>
    <template v-for="(item, index) in newData.text" >
      <span class="text-box" :class="{'text-out':messageItem.flow == 'out'}" v-if="item.name === 'text'" :key="index" style="vertical-align: middle;">{{ item.text }}</span>
      <img class="text-img" v-else :src="item.src" :key="index + 'z'" style="vertical-align: middle;"/>
    </template>
  </div>
</template>
<script>
export default {
  props: {
    content: {
      type: Object,
      default: () => ({}),
    },
    messageItem:{
      type: Object,
      default: () => ({}),
    }
  },
  data() {
    return {
      newData: {},
    };
  },
  watch: {
    content: {
      handler(newValue) {
        this.newData = newValue;
      },
      deep:true,
      immediate:true
    },
  },
};
</script>
<style lang="scss" scoped>
.text-img {
  width: 20px;
  height: 20px;
}
.text-box {
  white-space: pre-wrap;
  font-size: inherit;
  word-break: break-word;
  font-size: 14px;
  text-size-adjust: none;

}
.text-out{
  color: #fff;
}
</style>
