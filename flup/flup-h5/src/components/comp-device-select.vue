<template>
  <div class="select-container">
    <div class="option" @click="sw1tch">
      <div class="option">
        <img :src=microphoneUrl alt v-if="deviceType == 'microphone'">
        <img :src=cameraUrl alt v-if="deviceType == 'camera'">
        <span class="option-text" v-if="deviceType == 'camera'">翻转摄像头</span>
        <span class="option-text" v-if="deviceType == 'microphone'">切换麦克风</span>
      </div>

    </div>
  </div>
</template>

<script>
import microphoneUrl from "@/assets/images/call/microphone.png";
import cameraUrl from "@/assets/images/call/camera.png";
import TRTC from "trtc-js-sdk";
import { Dropdown, DropdownMenu, DropdownItem } from "element-ui";
export default {
  name: "compDeviceSelect",
  props: {
    deviceType: {
      type: String,
    },
  },
  components: {
    [Dropdown.name]: Dropdown,
    [DropdownMenu.name]: DropdownMenu,
    [DropdownItem.name]: DropdownItem,
  },
  computed: {
    microphoneUrl() {
      return microphoneUrl;
    },
    cameraUrl() {
      return cameraUrl;
    },
  },
  data() {
    return {
      deviceList: [],
      deviceIndex: 0,
      activeDeviceId: "",
      showPopover: false,
    };
  },
  methods: {
    onSelect(item) {
      console.log(item);
    },
    async getDeviceList() {
      switch (this.deviceType) {
        case "camera":
          this.deviceList = await TRTC.getCameras();
          break;
        case "microphone":
          this.deviceList = await TRTC.getMicrophones();
          break;
        case "speaker":
          this.deviceList = await TRTC.getSpeakers();
          console.log('speaker',this.deviceList)
          break;
        default:
          break;
      }
      console.log(this.deviceList)
      this.activeDeviceId = this.deviceList[this.deviceIndex].deviceId;
      this.$emit("change", this.activeDeviceId);
    },
    handleChange() {
      this.$emit("change", this.activeDeviceId);
    },
    sw1tch() {
      if (this.deviceList.length == 1) {
        return;
      } else {
        // if (this.deviceList.length == this.deviceIndex + 1) {
        //   this.deviceIndex = 0;
        //   this.activeDeviceId = this.deviceList[this.deviceIndex].deviceId;
        // } else {
        //   this.deviceIndex += 1;
        //   this.activeDeviceId = this.deviceList[this.deviceIndex].deviceId;
        // }
        if (this.deviceIndex == 0) {
          this.deviceIndex = 1;
          this.activeDeviceId = this.deviceList[this.deviceIndex].deviceId;
        } else {
          this.deviceIndex = 0;
          this.activeDeviceId = this.deviceList[this.deviceIndex].deviceId;
        }
        this.$emit("change", this.activeDeviceId);
        console.log(this.activeDeviceId);
      }
      this.$toast("切换媒体设备成功");
    },
  },
  mounted() {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then(() => {
        this.getDeviceList();
        this.$emit("call");
      });
    navigator.mediaDevices.addEventListener("devicechange", this.getDeviceList);
  },
  beforeDestroy() {
    navigator.mediaDevices.removeEventListener(
      "devicechange",
      this.getDeviceList
    );
  },
};
</script>

<style lang="scss" scoped>
.select-container {
  display: flex;
  .option {
      // height: 18vw;
      // width: 18vw;
      border-radius: 50%;
      // background: #111111;
      transition: background-color 0.3s ease;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      // &:active {
      //   background: #111111;
      // }
      img {
        width: 15vw;
        height: 15vw;
      }
      &-text {
        margin-top: 10px;
        color: #fff;
      }
    }
}
</style>
