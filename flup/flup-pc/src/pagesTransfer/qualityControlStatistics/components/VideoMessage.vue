<template>
  <div class="video-message">
    <!-- bindfullscreenchange="showVideoFullScreenChange"
      bind:longpress="handleLongPress" -->
    <video
      :class="isMine ? 'my-video video-box' : 'video-box'"
      :src="message.videoUrl"
      controls
    ></video>
  </div>
</template>
<script>
export default {
  props: {
    message: {
      type: Object,
      value: {}
    },
    isMine: {
      type: Boolean,
      value: true
    }
  }
};
</script>
<style lang="scss" scoped>
.video-message {
  width: 150px;
  height: 110px;
  max-width: 60vw;
  .video-box {
    width: 100%;
    height: 100%;
  }
  .my-video {
    border-radius: 10px;
  }
}
</style>
