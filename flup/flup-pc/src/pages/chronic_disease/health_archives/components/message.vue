<template>
  <div class="sendMessage">
    <div class="historySend">
      <div class="hsTitle">
        <h4>消息列表</h4>
      </div>
      <div class="hsInfo">
        <div class="hsBlock" v-for="(item, index) in historyList" :key="index">
          <div class="hsbTitle">
            <span class="leftDisplay">
              {{ item.senderName }}
              <span style="opacity: 0.8">{{ item.createTime }}</span>
            </span>
            <span v-if="item.title" class="hsbType">{{ item.title }}</span>
            <span v-if="['调查问卷', '健康宣教'].includes(item.title)" class="hsbh3">
              <span :key="xindex" v-for="(x, xindex) in item.content.split(',')">{{ xindex + 1 + " ：" + x + ";" }}</span>
            </span>
          </div>

          <div class="hsbContent">{{ item.message }}</div>
        </div>
      </div>
    </div>
    <div class="hsSend">消息发送</div>
    <div class="sendBox">
      <el-form :model="ruleForm" ref="ruleForm" label-width="100px" class="demo-ruleForm" :inline="true">
        <!-- <el-form-item label="处理类型" prop="title">
          <el-select v-model="ruleForm.title" @change="switchFollowupType" clearable>
            <el-option
              v-for="(item, index) in followupTypeList"
              :key="index"
              :label="item.name"
              :value="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="内容" prop="contentId">
          <el-select style="display: inline-block;" multiple v-model="ruleForm.contentId" clearable>
            <el-option
              v-for="(item, index) in followupContentList"
              :key="index"
              :label="item.questionnaireName"
              :value="item.serialNo"
            ></el-option>
          </el-select>
        </el-form-item>-->
        <el-form-item label="处理措施" prop="message">
          <el-input type="textarea" :autosize="{ minRows: 5, maxRows: 10 }" size="large" placeholder="请输入内容" v-model="ruleForm.message" maxlength="150" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <div class="butBox">
        <el-button type="primary" @click="sendChat" :disabled="!ruleForm.message||ruleForm.message.length==0">发送消息</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      historyList: [],
      ruleForm: {
        receiver: this.$route.query.userId,
        hospitalId: this.$global.hospital_id,
        isSend: false,
      },
      rules: {
        title: [{ required: true, message: '请选择处理类型', trigger: 'blur' }],
        message: [
          { required: true, message: '请输入处理措施', trigger: 'change' },
        ],
        contentId: [
          { required: true, message: '请选择你内容', trigger: 'blur' },
        ],
      },
      followupTypeList: [{ name: '健康宣教' }, { name: '调查问卷' }],
      followupContentList: [],
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.$apis
        .queryChat({ patientId: this.$route.query.userId,hospitalId: this.$global.hospital_id, })
        .then((res) => {
          this.historyList = res
        })
    },
    switchFollowupType(val) {
      this.ruleForm.contentId = ''
      this.$apis
        .flupPathqueryFollowUpContent({
          name: val,
          hospitalId: this.$global.hospital_id,
        })
        .then((res) => {
          this.followupContentList = res
        })
    },
    sendChat() {
      // this.$refs["ruleForm"].validate((valid) => {
      //   if (valid) {
      if (this.ruleForm.contentId) {
        var contentId = Array.from(this.ruleForm.contentId)
        var contentName = ''
        contentId.forEach(
          (x) =>
            (contentName +=
              this.followupContentList.filter((y) => y.serialNo == x)[0]
                .questionnaireName + ',')
        )
        this.ruleForm.content = contentName.substring(0, contentName.length - 1)
        this.ruleForm.contentId = this.ruleForm.contentId.join(',')
        this.ruleForm.isSend = true
      }
      this.$apis.sendChat(this.ruleForm).then((res) => {
        if (res) {
          this.$message({
            type: 'success',
            message: '发送成功',
          })

          this.getList()
          this.ruleForm.contentId = ''
          this.ruleForm.content = ''
          this.ruleForm.title = ''
          this.ruleForm.message = ''
          this.ruleForm.isSend = false
        }
      })
      // }
      // });
    },
  },
}
</script>
<style lang="scss">
.sendMessage {
  .historySend {
    max-height: 400px;
    overflow-y: auto;
    padding: 20px;
    background: #fbfbfb;
    .hsTitle {
      padding-bottom: 12px;
      line-height: 21px;
      font-size: 16px;
      color: #333333;
      border-bottom: 1px solid #d7dae0;
    }
    .hsInfo {
      padding-top: 20px;
      font-size: 14px;
      color: #111111;
      overflow: hidden;

      .hsInfoLi {
        display: block;
        float: left;
        width: 50%;
        margin-bottom: 16px;
        span {
          margin-right: 20px;
          color: #333333;
        }
      }
    }
    .hsBlock {
      margin-bottom: 16px;
      padding: 16px 14px;
      background: #ffffff;
      border-bottom: 1px solid #d7dae0;

      .hsbTitle {
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-radius: 10px;
        .hsbType {
          border-radius: 10px;
          padding: 0 8px;
          margin: 0px 10px;
          font-size: 12px;
          color: #00982d;
          border: 1px solid #32ae57;
        }
        .hsbh3 {
          display: inline-block;
          max-width: 50%;
          vertical-align: middle;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .leftDisplay {
          float: left;
        }
      }
      .hsbContent {
        font-size: 14px;
        color: #333333;
      }
    }
  }
  .sendBox {
    .el-form {
      display: flex;
      flex-wrap: wrap;
      > div {
        min-width: 40%;
        .el-select {
          min-width: 300px;
        }
        .el-textarea {
          min-width: 750px;
        }
      }
    }
    .butBox {
      width: 100%;
      padding-right: 30%;
      .el-button {
        float: right;
      }
    }
  }
}
</style>