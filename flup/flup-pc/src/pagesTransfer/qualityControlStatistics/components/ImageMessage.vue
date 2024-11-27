<template>
  <div>
    <div class="TUI-ImageMessage">
      <el-image
        class="image-message"
        mode="widthFix"
        :src="ImgUrl"
        :preview-src-list="getImgList(messageList)"
      />
    </div>
    <!-- <div v-if="isFullScreen" class="fullscreen-image-container">
      <img :src="ImgUrl" alt="全屏图片" />
    </div> -->
  </div>
</template>
<script>
export default {
  props: {
    ImgUrl: {
      type: String,
      default: ""
    },
    messageList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      isFullScreen: false,
      imageList: []
    };
  },
  // watch: {
  //   messageList: {
  //     handler() {
  //       this.getImgList;
  //     }
  //   }
  // },
  methods: {
    // toggleFullScreen() {
    //   this.enterFullScreen();
    // },
    // enterFullScreen() {
    //   if (this.$el.requestFullscreen) {
    //     this.$el.requestFullscreen();
    //   } else if (this.$el.mozRequestFullScreen) {
    //     /* Firefox */
    //     this.$el.mozRequestFullScreen();
    //   } else if (this.$el.webkitRequestFullscreen) {
    //     /* Chrome, Safari & Opera */
    //     this.$el.webkitRequestFullscreen();
    //   } else if (this.$el.msRequestFullscreen) {
    //     /* IE/Edge */
    //     this.$el.msRequestFullscreen();
    //   }
    //   this.isFullScreen = true;
    // }
    getImgList(arr) {
      let newArr = arr
        .filter(item => {
          return item.type == "TIMImageElem" && !item.isRevoked;
        })
        .map(item => {
          return item.bigImage;
        });
      return newArr;
    }
  }
};
</script>
<style lang="scss" scoped>
.TUI-ImageMessage {
  min-width: 100px;
  max-width: calc(100vw - 180px);
}

.image-message {
  width: 100%;
  border-radius: 10px 10px 10px 10px;
}

.fullscreen-image-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #000;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.fullscreen-image-container img {
  max-width: 100%;
  max-height: 100%;
}
</style>
