<template>
  <div class="caseManagement">
    <el-tabs tab-position="left">
      <el-tab-pane label="电话随访" lazy class="caseManagement-tab">
        <phone-followup></phone-followup>
      </el-tab-pane>
      <el-tab-pane label="短信随访" lazy class="caseManagement-tab">
        <phone-followup></phone-followup>
      </el-tab-pane>
      <el-tab-pane label="问卷随访" lazy class="caseManagement-tab-noscroll">
        <iframe :src="iframeUrl('WJDC')" frameborder="0" class="iframe" ref="iframe" scrolling="auto"></iframe>
      </el-tab-pane>
      <el-tab-pane label="宣教发送" lazy class="caseManagement-tab-noscroll">
        <iframe :src="iframeUrl('JKXJ')" frameborder="0" class="iframe" ref="iframe" scrolling="auto"></iframe>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import baseURL from "@/mixins/baseURL";
import phoneFollowup from "@/pagesTransfer/followup/phone_followup/index.vue";
export default {
  components: { phoneFollowup },
  mixins: [baseURL],
  created() {
    this.getBaseUrl("/flup/web");
  },
  methods: {
    iframeUrl(type) {
      return `${this.baseURL}/pc/#/newsendV2/${type}?token=${this.$route.query.token}`
    },
  },
};
</script>

<style scoped lang="scss">
.caseManagement {
  &-tab {
    height: 100vh;
    position: relative;
    overflow: scroll;
  }
  &-tab-noscroll {
    height: 100vh;
    overflow: hidden;
  }
  .iframe {
    height: 100%;
    width: 100%;
  }
}
</style>
