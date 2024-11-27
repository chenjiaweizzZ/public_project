// 查看消息
<template>
  <div class="medicalcarebox">
    <h3 class="chattingtitle">{{flupName}}</h3>
    <div class="chattingrecords">
      <div v-for="(item, index) in list" :key="index" class="chatting">
        <p>
          {{item.senderName}}
          <span>{{item.createTime}}</span>
        </p>
        <div class="titleBox">
          <div>{{item.title}}</div>
          <div class="titleContent" v-if="item.title =='调查问卷'||item.title =='健康宣教' ">
            <span v-for="(item2, index2) in item.content" :key="index2" @click="goDetail(item,index2)">
              {{item2}} &emsp;
              <van-icon name="arrow" />
              <br />
            </span>
          </div>
        </div>
        <p>{{item.message}}</p>
      </div>
    </div>
  </div>
</template>

<script>
import 'vant/lib/icon/local.css'
export default {
  data() {
    return {
      realName: this.$route.query.realName,
      flupName: this.$route.query.flupName,
      doctorId: this.$route.query.doctorId,
      list: [],
    }
  },
  watch: {},
  mounted() {
    this.doctorId = this.$route.query.doctorId
    this.$apis.chatqueryChatDoctor({
      doctorId:this.doctorId,
      hospitalId :sessionStorage.getItem('hospitalId')
      }).then((res) => {
      this.list = res.retData
      for (let i in this.list) {
        if (
          this.list[i].title == '调查问卷' ||
          this.list[i].title == '健康宣教'
        ) {
          this.list[i].content = this.list[i].content.split(',')
          this.list[i].contentId = this.list[i].contentId.split(',')
        }
      }
      this.read()
    })
  },
  methods: {
    read() {
      let chatIds = []
      this.list.forEach((res) => {
        if (res.status == 0) {
          chatIds.push(res.id)
        }
      })
      if (chatIds.length != 0) {
        this.$apis.updateReadStatus({ chatIds: chatIds }).then((res) => {})
      }
    },
    goDetail(val, index) {
      this.$apis
        .queryChatUrl({
          id: val.id,
          title: val.title,
          contentId: val.contentId[index],
        })
        .then((res) => {
          if (res.retData) {
            window.open(res.retData, '_self')
          }
        })
    },
  },
}
</script>

<style lang="scss" >
.medicalcarebox {
  .chattingtitle {
    padding: 0 3.7% 2%;
    font-size: 17px;
    color: #111111;
    letter-spacing: 0.24px;
    margin-block-end: 0px;
    border-bottom: 1px solid #e2e2e2;
  }
  .chattingrecords {
    width: 100%;
    padding: 0 0 0 3.7%;
    margin-bottom: 80px;
    .chatting {
      padding: 3.7% 3.7% 3.7% 0;
      border-bottom: 1px solid #e2e2e2;
      span {
        font-size: 14px;
        color: #666666;
        line-height: 30px;
        letter-spacing: 0;
      }
      p {
        text-align: justify;
      }
      .titleBox {
        display: flex;
        color: #666666;
        > div {
          width: 100px;
        }
        span {
          line-height: 20px;
        }
        .titleContent {
          width: 245px;
        }
      }
    }
  }
  .butbox {
    width: 100%;
    padding: 1.2% 2%;
    position: fixed;
    bottom: 0;
    left: 0;
    border-top: 1px solid #e2e2e2;
    background-color: #fff;
    .inpbox {
      display: flex;
      align-items: center;
      justify-content: space-between;
      input {
        width: 80%;
        height: 36px;
        padding: 0 2%;
        border: 1px solid #e2e2e2;
      }
    }
  }
}
</style>


