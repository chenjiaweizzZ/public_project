<!-- 顶部标签页 -->
<template>
  <div v-loading="loading" element-loading-spinner="el-icon-loading" v-if="labelArr.length > 0" class="top-label">
    <div :class="['label-item', item.isActive ? 'item-active' : '']" v-for="(item, index) in labelArr" :key="index" @click="go(item)">
      <span>{{ item.title }}</span>
      <i v-show="item.isActive && labelArr.length > 1" class="el-icon-close" style="padding-left: 6px" @click.stop="close(index)"></i>
    </div>
  </div>
</template>
<script>
import { mapState, mapMutations } from 'vuex';
import _ from '@/utils';
import { EventBus } from '@/event-bus';
export default {
  name: '',
  computed: {
    ...mapState('menu', {
      labelArr: (state) => state.labelArr,
      acitveMenuPath: (state) => state.acitveMenuPath,
    }),
  },
  data() {
    return {};
  },
  props: {
    loading: {
      type: Boolean,
      default: true,
    },
  },
  created() {},
  methods: {
    ...mapMutations('menu', ['removeLabel']),

    close(index) {
      this.removeLabel(index);
      /* 删除 */
      if (index === 0) {
        this.$router.push(this.labelArr[0].fullPath);
      } else {
        this.$router.push(this.labelArr[index - 1].fullPath);
      }
    },
    go(item) {
      if (!item.isActive && this.$route.name == 'biScreensEditor') {
        return EventBus.$emit('changeLabel', item.fullPath);
      } else {
        if (this.$route.name == 'biTargetsEditor') {
          return EventBus.$emit('goOtherLabel', item.fullPath);
        }
        if (this.acitveMenuPath === item.fullPath) return;
        this.$router.push(item.fullPath);
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.top-label {
  width: 100%;
  min-width: 1280px;
  height: 30px;
  background: white;
  display: flex;
  align-items: center;
  .label-item {
    height: 22px;
    border: 1px solid #d7dae0;
    font-size: 14px;
    padding: 0 8px;
    margin-left: 10px;
    border-radius: 2px;
    display: flex;
    align-items: center;
    font-size: 600;
  }
  .item-active {
    background: #0075ff;
    color: #fff;
    border: 0;
    padding-right: 6px;
  }
}
::v-deep .el-loading-spinner {
  margin-top: -12px;
}
</style>
