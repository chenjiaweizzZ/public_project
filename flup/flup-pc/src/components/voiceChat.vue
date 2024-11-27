//语音随访聊天记录组件
<template >
  <div class="voiceChatBox">
    <el-button class="btn" @click="setFlg">X</el-button>
    <div class="dialogueList">
      <el-table
        ref="singleTable"
        :data="dialogueList"
        border
        style="width: 100%;height:100%;max-height:100%"
        highlight-current-row
        @current-change="setMain"
      >
        <el-table-column prop="customerName" label="姓名"></el-table-column>
        <el-table-column prop="finisAnswer" label="结束方式"></el-table-column>
        <el-table-column prop="statusText" label="呼叫状态"></el-table-column>
        <el-table-column prop="beginTime" label="呼叫时间" width="200"></el-table-column>
      </el-table>
    </div>
    <div class="main" style="flex: 1;">
      <div v-if="mp3" class="mp3">
        <audio
          ref="audio"
          :src="mp3"
          @pause="onPause"
          @play="onPlay"
          @timeupdate="onTimeupdate"
          @loadedmetadata="onLoadedmetadata"
          controls="controls"
        ></audio>
        音频播放控件
        <div class="audio-com-box">
          <div class="audio-icont-div" @click="startPlayOrPause">
            <i v-if="audio.playing" class="el-icon-video-pause"></i>
            <i v-else class="el-icon-video-play"></i>
          </div>
          <div class="progress-box">
            <el-slider
              class="slider"
              v-model="sliderTime"
              :show-tooltip="false"
              @change="changeCurrentTime"
            ></el-slider>
            <span class="current-time">{{ audio.currentTime | formatSecond}}</span>
            <span class="total-time">{{ audio.maxTime | formatSecond}}</span>
          </div>
        </div>
      </div>
      <!-- <div v-if="mp3" class="mp3">
          <audio style="width:95%" controls="controls" height="100" width="100">
            <source :src="mp3" type="audio/mp3" />
            <source :src="mp3" type="audio/ogg" />
            <embed height="100" width="100" :src="mp3" />
          </audio>
      </div>-->
      <div v-if="recordsText.length > 0" class="dialogBox">
        <div>
          <div v-if="time" class="chat-notice">
            <span>{{time}}</span>
          </div>
          <template v-for="(item, index) in recordsText">
            <div v-if="item.type == 0" :key="index" class="chat-sender">
              <div>
                <img src="~@/assets/images/jqr.png" />
              </div>
              <div>随访机器人</div>
              <div>
                <div class="chat-left_triangle"></div>
                <span>{{item.text}}</span>
              </div>
            </div>
            <div v-else-if="item.type == 1" :key="index" class="chat-receiver">
              <div>
                <img src="~@/assets/images/yhtx.png" />
              </div>
              <div>{{$route.query.patientName}}</div>
              <div>
                <div class="chat-right_triangle"></div>
                <span>{{item.text}}</span>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
function realFormatSecond(second) {
  var secondType = typeof second
  if (secondType === 'number' || secondType === 'string') {
    second = parseInt(second)
    var hours = Math.floor(second / 3600)
    second = second - hours * 3600
    var mimute = Math.floor(second / 60)
    second = second - mimute * 60
    return (
      hours + ':' + ('0' + mimute).slice(-2) + ':' + ('0' + second).slice(-2)
    )
  } else {
    return '0:00:00'
  }
}
export default {
  name: 'voiceChat',
  props: ['flupSerialNo'],
  data() {
    return {
      dialogueList: [],
      mp3: '',
      recordsText: [],
      time: '',
      audio: {
        playing: false, // 该字段是音频是否处于播放状态的属性
        currentTime: 0, // 音频当前播放时长
        maxTime: 0, // 音频最大播放时长
      },
      sliderTime: [],
    }
  },
  filters: {
    // 将整数转化成时分秒
    formatSecond(second = 0) {
      return realFormatSecond(second)
    },
  },
  mounted() {
    this.goVoiceChat()
  },
  methods: {
    setFlg() {
      //控件
      if (this.mp3) {
        this.onPause()
        this.pause()
        this.changeCurrentTime(0)
        this.mp3 = null
      }
      this.$emit('viceChatShowFalse')
    },
    goVoiceChat() {
      this.dialogueList = []
      this.mp3 = null
      this.recordsText = []
      this.$apis
        .queryVoiceFollowUpRecordBySn({
          flupSn: this.flupSerialNo,
        })
        .then((res) => {
          this.dialogueList = res
          if (res.length > 0) {
            this.$refs.singleTable.setCurrentRow(res[0])
          }
        })
    },
    setMain(val) {
      if (this.mp3) {
        this.onPause()
        this.pause()
        this.mp3 = null
        this.changeCurrentTime(0)
      }
      this.$nextTick(() => {
        this.recordsText = JSON.parse(val.records)
        this.time = val.connTime
        this.mp3 = val.audioUrl
      })
    },
    // 拖动进度条，改变当前时间，index是进度条改变时的回调函数的参数0-100之间，需要换算成实际时间
    changeCurrentTime(index) {
      this.$refs.audio.currentTime = parseInt(
        (index / 100) * this.audio.maxTime
      )
    },
    // 当音频当前时间改变后，进度条也要改变
    onTimeupdate(res) {
      this.audio.currentTime = res.target.currentTime
      this.sliderTime = parseInt(
        (this.audio.currentTime / this.audio.maxTime) * 100
      )
    },
    // 控制音频的播放与暂停
    startPlayOrPause() {
      return this.audio.playing ? this.pause() : this.play()
    },
    // 播放音频
    play() {
      this.$refs.audio.play()
    },
    // 暂停音频
    pause() {
      this.$refs.audio.pause()
    },
    // 当音频播放
    onPlay() {
      this.audio.playing = true
    },
    // 当音频暂停
    onPause() {
      this.audio.playing = false
    },
    // 当timeupdate事件大概每秒一次，用来更新音频流的当前播放时间
    onTimeupdate(res) {
      this.audio.currentTime = res.target.currentTime
      this.sliderTime = parseInt(
        (this.audio.currentTime / this.audio.maxTime) * 100
      )
    },
    // 当加载语音流元数据完成后，会触发该事件的回调函数
    // 语音元数据主要是语音的长度之类的数据
    onLoadedmetadata(res) {
      this.audio.maxTime = parseInt(res.target.duration)
    },
  },
}
</script>
<style lang="scss">
.voiceChatBox {
  position: fixed;
  top: 50px;
  left: 50px;
  min-width: 50%;
  min-height: 50vh;
  padding: 20px;
  display: flex;
  background-color: #f8f8f8;
  border: 2px solid #32ae57;
  cursor: move;
  .btn {
    position: absolute;
    top: 0;
    right: 0;
    border: 0;
    color: #d8d8db;
    font-size: 18px;
  }
  p {
    margin: 0;
    padding: 0;
  }
  /deep/ .el-table__body tr.current-row > td.el-table__cell {
    background-color: #b1f5e9;
  }
  .dialogueList {
    margin-right: 20px;
    background-color: #f8f8f8;
  }
  .main {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    .mp3 {
      height: 71px;
      audio {
        display: none;
      }
      .audio-com-box {
        border-bottom: 1px solid #e5e5e5;
        border-radius: 10px;
        padding: 15px 25px;
        display: flex;
        align-items: center;
        /*音频图标*/
        > .audio-icont-div {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 40px;
          height: 40px;
          border: 2px solid #17ce88;
          border-radius: 50%;
          text-align: center;
          line-height: 40px;
          cursor: pointer;
          > i {
            font-size: 46px;
            color: #17ce88;
          }
        }
        /*进度条*/
        > .progress-box {
          flex: 1;
          margin-left: 15px;
          position: relative;
          > .slider {
            > .el-slider__runway {
              height: 3px;
              > .el-slider__bar {
                height: 3px;
                background-color: #17ce88;
              }
              .el-slider__button {
                width: 10px;
                height: 10px;
                border: 2px solid #17ce88;
              }
            }
          }
          > .current-time,
          > .total-time {
            position: absolute;
            bottom: -15px;
            color: #aaaaaa;
          }
          > .current-time {
            left: 0;
          }
          > .total-time {
            right: 0;
          }
        }
      }
    }
    .dialogBox {
      flex: 1;
      padding: 10px;
      font-family: -apple-system;
      font-family: '-apple-system', 'Helvetica Neue', 'Roboto', 'Segoe UI',
        'sans-serif';
      overflow-y: scroll;
      > div {
        height: 100%;
        > div {
          padding-top: 10px;
          position: relative;
        }
        .chat-sender {
          clear: both;
          font-size: 80%;
        }
        .chat-sender > div:nth-of-type(1) {
          position: absolute;
          top: 20px;
          left: 0;
        }
        .chat-sender > div:nth-of-type(2) {
          margin: 0 50px 2px 50px;
          padding: 0px;
          color: #848484;
          font-size: 70%;
          text-align: left;
        }
        .chat-sender > div:nth-of-type(3) {
          position: relative;
          width: fit-content;
          background-color: #ebebeb;
          margin: 0 50px 10px 50px;
          padding: 10px 20px;
          border-radius: 7px;
          text-indent: -12px;
          > div {
            position: absolute;
            top: 12px;
            left: -12px;
          }
        }

        .chat-receiver {
          clear: both;
          font-size: 80%;
        }
        .chat-receiver div:nth-of-type(1) {
          position: absolute;
          top: 20px;
          right: 0;
        }
        .chat-receiver div:nth-of-type(2) {
          margin: 0px 50px 2px 50px;
          padding: 0px;
          color: #848484;
          font-size: 70%;
          text-align: right;
        }
        .chat-receiver > div:nth-of-type(3) {
          position: relative;
          left: 100%;
          transform: translateX(-100%);
          width: fit-content;
          display: inline-block;
          background-color: #b2e281;
          margin-left: -50px;
          padding: 10px 10px 10px 10px;
          border-radius: 7px;
          > div {
            position: absolute;
            top: 12px;
            right: -12px;
          }
        }

        .chat-receiver div:first-child img,
        .chat-sender div:first-child img {
          width: 40px;
          height: 40px;
        }

        .chat-left_triangle {
          height: 0px;
          width: 0px;
          border-width: 6px;
          border-style: solid;
          border-color: transparent #ebebeb transparent transparent;
          position: relative;
          left: -22px;
          top: 3px;
        }
        .chat-right_triangle {
          height: 0px;
          width: 0px;
          border-width: 6px;
          border-style: solid;
          border-color: transparent transparent transparent #b2e281;
          position: relative;
          right: -22px;
          top: 3px;
        }

        .chat-notice {
          clear: both;
          font-size: 70%;
          color: white;
          text-align: center;
          margin-top: 15px;
          margin-bottom: 15px;
        }
        .chat-notice span {
          background-color: #cecece;
          line-height: 25px;
          border-radius: 5px;
          padding: 5px 10px;
        }
      }
    }
  }
}
</style>