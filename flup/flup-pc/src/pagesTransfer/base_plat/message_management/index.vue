<template>
  <div class="audit_manager paddingX20 width1-height1 boxSize">
    <el-tabs
      class="full-tab_content height100p flex-column"
      style="overflow: auto"
      v-model="currentTab"
      @tab-click="handleClick"
    >
      <el-tab-pane v-for="(item, index) in tabs" :key="index" :label="item.label" :name="item.name">
        <!-- 使用动态组件渲染tab标签页, 每次切换时重新渲染达到重新请求数据目的 -->
        <component v-if="item.name===currentTab" :is="currentTab"></component>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import messageTemplate from '../message_management/messageTemplate.vue'
import messageTemplateRecord from '../message_management/messageTemplateRecord.vue'
const renderTabs = [
  {
    label: '消息模板',
    name: 'messageTemplate', // name与 import 变量对应, 使component标签( 动态组件能够正确解析 )
  },
  {
    label: '消息记录',
    name: 'messageTemplateRecord',
  },
]
export default {
  components: {
    messageTemplate,
    messageTemplateRecord,
  },
  data() {
    return {
      currentTab: 'messageTemplate',
      tabs: renderTabs,
    }
  },
  methods: {
    handleClick(tab, event) {},
  },
}
</script>

<style lang="scss">
</style>