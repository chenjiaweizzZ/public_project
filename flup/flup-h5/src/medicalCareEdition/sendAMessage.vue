// 发送消息
<template>
  <div class="medicalcarebox15">
    <van-notice-bar
      wrapable
      :scrollable="false"
      :text="patientName + ' ' + age + ' 岁 ' + sex + ' ' + phone"
    />
    <h3 class="chattingtitle">{{ flupName }}</h3>

    <div class="chattingrecords">
      <div v-for="(item, index) in list" :key="index" class="chatting">
        <div class="timeTitlebox">
          <div>{{ item.createTime }}</div>
          <div class="titleContent">
            {{item.title}}
            <div v-if="item.title =='调查问卷' ||item.title =='健康宣教' ">
              <span v-for="(item2, index2) in item.content" :key="index2">{{index2+1}}.{{item2}};</span>
            </div>
          </div>
        </div>
        <p>{{ item.message }}</p>
      </div>
    </div>

    <div class="butbox">
      <van-button v-if="inpxx" type="info" size="large" @click="inpxx = false">发送信息</van-button>
      <div v-else>
        <!-- <div class="input">
          处理类型
          <select
            class="value width200px"
            clearable
            v-model="showPicker"
            placeholder="启用状态"
          >
            <option label="全部" value></option>
            <option label="未处理" value="1"></option>
            <option label="已处理" value="2"></option>
          </select>

          内容
          <select
            class="value width200px"
            clearable
            v-model="showPicker"
            placeholder="启用状态"
          >
            <option label="全部" value></option>
            <option label="未处理" value="1"></option>
            <option label="已处理" value="2"></option>
          </select>
        </div>-->
        <!-- <div style="border-bottom: 1px solid #d7dae0">
          <van-field
            style="padding: 4px; font-size: 14px"
            readonly
            clickable
            name="picker"
            :value="selectParam"
            label="处理类型"
            placeholder="请选择处理类型"
            @click="showPicker = true"
          />
          <van-popup v-model="showPicker" position="bottom">
            <van-picker
              show-toolbar
              :columns="columns"
              @confirm="onConfirm"
              @change="onChange"
              @cancel="showPicker = false"
            />
          </van-popup>
        </div>-->
        <div class="inpbox">
          <input placeholder="请输入..." type="text" v-model="text" />
          <van-button type="info" size="small" @click="send">发送</van-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import 'vant/lib/icon/local.css'
export default {
  data() {
    return {
      patientName: this.$route.query.patientName,
      age: this.$route.query.age,
      sex: this.$route.query.sex,
      phone: this.$route.query.phone,
      userId: this.$route.query.userId,
      flupName: this.$route.query.flupName,
      flupId: this.$route.query.flupId,
      list: [],
      inpxx: true,
      text: '',
      showPicker: false,
      wjList: [],
      xjList: [],
      columns: [{ values: ['调查问卷', '健康宣教'] }, { values: [] }],
      selectParam: '',
      title: '',
      contentId: '',
      contentName: '',
      isSend: false,
    }
  },
  watch: {},
  async mounted() {
    await this.$apis
      .flupPathqueryFollowUpContent({
        name: '调查问卷',
        hospitalId: sessionStorage.getItem('hospitalId'),
      })
      .then((res) => {
        // this.wjList = res.retData.map((x) => x.questionnaireName);
        this.wjList = res.retData
        this.$nextTick(() => {
          this.columns[1].values = this.wjList.map((x) => x.questionnaireName)
        })
      })
    await this.$apis
      .flupPathqueryFollowUpContent({
        name: '健康宣教',
        hospitalId: sessionStorage.getItem('hospitalId'),
      })
      .then((res) => {
        this.xjList = res.retData
      })
    this.userId = this.$route.query.userId
    this.getlist()
  },
  methods: {
    getlist() {
      this.$apis
        .chatqueryChat({
          patientId: this.userId,
          flupId: this.flupId,
          hospitalId: sessionStorage.getItem('hospitalId'),
        })
        .then((res) => {
          this.list = res.retData
          for (let i in this.list) {
            if (
              this.list[i].title == '调查问卷' ||
              this.list[i].title == '健康宣教'
            ) {
              this.list[i].content = this.list[i].content.split(',')
            }
          }
        })
    },
    send() {
      if (this.text.replace(/\s/g, '').length != 0) {
        //如果选择发送问卷或宣教
        if (this.selectParam) {
          var param = this.selectParam.split(',')
          this.title = param[0]
          this.contentName = param[1]
          switch (this.title) {
            case '调查问卷':
              this.contentId = this.wjList.filter(
                (x) => x.questionnaireName == param[1]
              )[0].serialNo
              break
            case '健康宣教':
              this.contentId = this.xjList.filter(
                (x) => x.questionnaireName == param[1]
              )[0].serialNo
              break
          }
          this.isSend = true
        }

        this.$apis
          .chatsend({
            flupId: this.flupId,
            message: this.text,
            receiver: this.userId,
            hospitalId: sessionStorage.getItem('hospitalId'),
            title: this.title,
            contentId: this.contentId,
            content: this.contentName,
            isSend: this.isSend,
          })
          .then((res) => {
            if (res.retData) {
              this.$toast.success('发送成功')
              this.getlist()
              this.text = ''
              this.title = ''
              this.selectParam = ''
              this.contentId = ''
              this.contentName = ''
              this.inpxx = true
              this.isSend = false
            }
          })
      } else {
        this.$toast.fail('不可发送空内容')
      }
    },
    onConfirm(value, index) {
      this.selectParam = value.join(',')
      this.showPicker = false
    },
    onChange(picker, value) {
      let list =
        value[0] == '调查问卷'
          ? this.wjList.map((x) => x.questionnaireName)
          : this.xjList.map((x) => x.questionnaireName)
      picker.setColumnValues(1, list)
    },
  },
}
</script>

<style lang="scss" >
.medicalcarebox15 {
  .van-notice-bar--wrapable .van-notice-bar__content {
    margin: 0 auto;
  }
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
    padding: 0 0 50px 3.7%;
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
    }
    .timeTitlebox {
      div {
        width: 155px;
      }
      display: flex;
      .titleContent {
        width: 192px;
        font-size: 14px;
        color: #666666;
        text-align: justify;
        span {
          line-height: 20px;
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


