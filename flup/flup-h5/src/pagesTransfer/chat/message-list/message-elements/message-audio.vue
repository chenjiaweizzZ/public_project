<template>
  <div
    class="message-audio"
    :class="[olddata.message.flow === 'out' && 'reserve']"
    @click.stop="play"
  >
    <!-- <Icon
    :file="getvoice()"
    :class="[olddata.message.flow === 'out' && 'icon-reserve']"
    ></Icon> -->
    <template v-if="olddata.message.flow === 'out'">
      <img class="image" :class="[olddata.message.flow === 'out' && 'icon-reserve']" v-if="!show" src="@/assets/images/icon/suona3.png" alt="">
      <img class="image" :class="[olddata.message.flow === 'out' && 'icon-reserve']" v-else src="@/assets/images/icon/suona4.gif" alt="">
    </template>
    <template v-else>
      <img class="image" :class="[olddata.message.flow === 'out' && 'icon-reserve']" v-if="!show" src="@/assets/images/icon/suona.png" alt="">
      <img class="image" :class="[olddata.message.flow === 'out' && 'icon-reserve']" v-else src="@/assets/images/icon/suona2.gif" alt="">
    </template>
    <span class="text">{{olddata.second}}"</span>
    <audio ref="audio" :src="olddata.url" @pause="handpause"></audio>
  </div>
</template>
<script>
import Icon from "../../common/Icon.vue";
import voice from "../../assets/icon/voice.png";
export default {
  components:{
    Icon
  },
  props: {
    newData: {
      type: Object,
      default: () => ({}),
    },
  },
  watch: {
    newData: {
      handler(newValue) {
        this.olddata = newValue;
        console.log('语音',newValue)
      },
      immediate: true,
      deep: true,
    },
  },
  data() {
    return {
      olddata: {},
      show: false,
    };
  },
  methods: {
    play() {
      const audios = document.getElementsByTagName("audio");
      for (const audio of audios) {
        if (!audio.paused) {
          audio.pause();
          setTimeout(() => {
            audio.load();
          })
        }
      }
      const audioPlayer = this.$refs.audio;
      if (audioPlayer.paused) {
        audioPlayer.play();
        this.show = true;
      } else {
        audioPlayer.pause();
        audioPlayer.load();
        this.show = false;
      }
    },
    handpause(){
      this.show = false;
      console.log('播放暂停')
    },
    getvoice(){
      return voice;
    }
  },
};
</script>
</style>
<style lang="scss" scoped>
@import "../../assets/styles/common.scss";
.message-audio {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  max-width: 100%;
  overflow: hidden;
  background-color: #fff;
  padding:6px 12px;
  border-radius: 8px;
  .text{
    margin-left:4px;
  }
  .icon {
    margin: 0 4px;
  }
  audio {
    width: 0;
    height: 0;
  }
  .icon-reserve{
    transform: rotate(180deg);
  }
  .image{
    width: 11.5px;
    height: 17px;
  }
}
.reserve {
  flex-direction: row-reverse;
  background-color: #32ae57;
  .text{
    margin-right:4px;
    color: #fff;
  }
}
</style>
