<template>
  <div class="addRecruit">
    <div class="pageTitle">
      <span>{{type == 'add' ? '发起招录' : '管理'}}</span>
      <el-button @click="back" size="mini">返回</el-button>
    </div>
    <div class="content">
      <p class="title">招录管理</p>
      <el-form :model="form" label-width="150px" class="formContent" :rules="rules" ref="addRecruitForm">
        <el-form-item label="招录名称：" prop="title">
          <el-input v-model="form.title" maxlength="20" :disabled="enrollStatus >= 2"></el-input>
        </el-form-item>
        <el-form-item label="招录时间：" prop="time">
          <el-date-picker :disabled="enrollStatus >= 2" v-model="form.time" type="datetimerange" range-separator="至" start-placeholder="开始日期"
            end-placeholder="结束日期" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="现场审核：" prop="sceneVerify">
          <el-radio-group v-model="form.sceneVerify" :disabled="enrollStatus >= 2">
            <el-radio label="1">需要</el-radio>
            <el-radio label="0">不需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="招生考试：" prop="entranceExam">
          <el-radio-group v-model="form.entranceExam" :disabled="enrollStatus >= 2">
            <el-radio label="1">需要</el-radio>
            <el-radio label="0">不需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核结果短信通知：" prop="verifyMsg">
          <el-radio-group v-model="form.verifyMsg" :disabled="enrollStatus >= 2">
            <el-radio label="1">需要</el-radio>
            <el-radio label="0">不需要</el-radio>
          </el-radio-group>
        </el-form-item>
        <div class="tipsSet" v-if="form.verifyMsg == 1">
          <el-form-item>
            <el-form-item prop="preAuditPassMsg">
              <div class="info">
                <span slot="label">资料预审通过：</span>
                <el-input type="textarea" v-model="form.preAuditPassMsg" :disabled="enrollStatus >= 2"></el-input>
              </div>
            </el-form-item>
          </el-form-item>
          <el-form-item prop="preAuditFailMsg">
            <div class="info">
              <span slot="label">资料预审不通过：</span>
              <el-input type="textarea" v-model="form.preAuditFailMsg" :disabled="enrollStatus >= 2"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="sceneAuditPassMsg" v-if="form.sceneVerify == 1">
            <div class="info">
              <span slot="label">现场审核通过：</span>
              <el-input type="textarea" v-model="form.sceneAuditPassMsg" :disabled="enrollStatus >= 2"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="sceneAuditFailMsg" v-if="form.sceneVerify == 1">
            <div class="info">
              <span slot="label">现场审核不通过：</span>
              <el-input type="textarea" v-model="form.sceneAuditFailMsg" :disabled="enrollStatus >= 2"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="entranceExamMsg" class="allLine" v-if="form.entranceExam == 1">
            <div class="info">
              <span slot="label">招生考试通知：</span>
              <el-input type="textarea" v-model="form.entranceExamMsg" :disabled="enrollStatus >= 2"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="enrollPassMsg">
            <div class="info">
              <span slot="label">录取通知：</span>
              <el-input type="textarea" v-model="form.enrollPassMsg" :disabled="enrollStatus >= 2"></el-input>
            </div>
          </el-form-item>
          <el-form-item prop="enrollFailMsg">
            <div class="info">
              <span slot="label">未录取通知：</span>
              <el-input type="textarea" v-model="form.enrollFailMsg" :disabled="enrollStatus >= 2"></el-input>
            </div>
          </el-form-item>
        </div>
        <el-form-item prop="description" label="招录简介：">
          <quill-editor v-model="form.description" ref="myQuillEditor" :disabled="enrollStatus >= 2" :options="editorOption" @blur="onEditorBlur($event)"
            @focus="onEditorFocus($event)" @change="onEditorChange($event)">
          </quill-editor>
          <span class="wordNumber">{{editorText.length}}/2000</span>
        </el-form-item>
        <el-form-item prop="intro1" label="附件：">
          <el-upload class="upload-demo" action="/file/upload" :on-preview="clickthisfile" multiple :limit="limit" :on-exceed="handleExceed"
            :on-remove="handleRemove" :on-success="uploadsuccess" :file-list="fileList" :before-upload="beforeAvatarUpload">
            <el-button size="small" type="primary" :disabled="enrollStatus >= 2 || fileList.length >= 10">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">支持pdf、doc、xlsx格式，最大100M，最多10个</div>
          </el-upload>
        </el-form-item>
        <el-form-item class="centerContent">
          <el-button @click="keepRescruit(1)" :disabled="enrollStatus >= 2">保存</el-button>
          <el-button type="primary" @click="keepRescruit(2)" :disabled="enrollStatus >= 2">发布</el-button>
        </el-form-item>
      </el-form>
    </div>

  </div>
</template>
<script>
  import { quillRedefine } from 'vue-quill-editor-upload'
  import { quillEditor } from 'vue-quill-editor'
  import { post, getCookie } from '../../config/util'
  import moment from 'moment';
  export default {
    components: { quillEditor, quillRedefine },
    data() {
      var checkIntro = (rule, value, callback) => {
        console.log(this.editorText.length, "------")
        if (this.editorText.length > 2000) {
          callback(new Error('已超过2000字'));
        } else {
          callback()
        }
      };
      var checkTime = (rule, value, callback) => {
        if (value.length < 2) {
          callback(new Error('请选择开始时间和结束时间！'));
        } else {
          callback()
        }
      };
      return {
        //富文本编辑
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 8.64e7
          }
        },
        formflag: true,
        limit: 10,
        enrollStatus: 1, // 1草稿 2发布
        editorText: "",
        editorOption: {},
        form: {
          enrollPassMsg: "",
          enrollFailMsg: "",
          sceneAuditFailMsg: "",
          sceneAuditPassMsg: "",
          entranceExamMsg: "",
          preAuditPassMsg: "",
          preAuditFailMsg: "",
          title: "",
          time: [],
          sceneVerify: "1",
          entranceExam: "1",
          verifyMsg: "1",
          description: ""
        },
        fileList: [],
        editId: "",
        type: "add",
        detail: {},
        flag: 1,
        sucessfilelist: [],
        rules: {
          title: [
            { required: true, message: '请输入招录名称', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          time: [
            { type: 'array', required: true, message: '请选择招录时间', trigger: 'blur' },
            { validator: checkTime, trigger: 'blur' }
          ],
          sceneVerify: [
            { required: true, trigger: 'change' }
          ],
          entranceExam: [
            { required: true, trigger: 'change' }
          ],
          verifyMsg: [
            { required: true, trigger: 'change' }
          ],
          description: [
            { required: true, message: '请输入招录简介', trigger: 'blur' },
            { validator: checkIntro, trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.editorOption = quillRedefine(
        {
          placeholder: "请输入招录简介",
          // 图片上传的设置
          uploadConfig: {
            action: '/file/upload',  // 必填参数 图片上传地址
            // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
            // 你必须把返回的数据中所包含的图片地址 return 回去
            res: (respnse) => {
              return respnse.data.url
            },
            methods: 'POST',  // 可选参数 图片上传方式  默认为post
            token: sessionStorage.token,  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
            name: 'file',  // 可选参数 文件的参数名 默认为img
            size: 500,  // 可选参数   图片限制大小，单位为Kb, 1M = 1024Kb
            accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon',  // 可选参数 可上传的图片格式
            start: () => {
            },  // 可选参数 接收一个函数 开始上传数据时会触发
            end: () => {
            },  // 可选参数 接收一个函数 上传数据完成（成功或者失败）时会触发
            success: () => {
            },  // 可选参数 接收一个函数 上传数据成功时会触发
            error: () => {
            }  // 可选参数 接收一个函数 上传数据中断时会触发
          },
        }
      )
    },
    mounted() {
      this.type = this.$route.query.type
      this.editId = this.$route.query.id || ""
      if (this.editId != "") {
        this.getDetail()
      } else {
        this.getSmsTemplate();
      }

    },
    methods: {
      beforeAvatarUpload(file) {
        const isdocment = file.type.indexOf("pdf") > -1 || file.type.indexOf("document") > -1;
        const isLt2M = file.size / 1024 / 1024 < 100;

        if (!isdocment) {
          this.$message.error('上传文件类型只能为pdf、doc格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传文件大小不能超过 100MB!');
        }
        return isdocment && isLt2M;
      },
      getSmsTemplate() {
        post("/base/commpara/getListByCode?code=turnEnrollSmsTemplate").then(res => {
          if (res && res.resCode == 200) {
            let tempArr = JSON.parse(res.model[0].paramValue)
            tempArr.forEach(item => {
              if (item.type == "passPreAudit") {
                this.form.preAuditPassMsg = item.smsTemplate
              } else if (item.type == "notPreAudit") {
                this.form.preAuditFailMsg = item.smsTemplate
              } else if (item.type == "passSceneAudit") {
                this.form.sceneAuditPassMsg = item.smsTemplate
              } else if (item.type == "notSceneAudit") {
                this.form.sceneAuditFailMsg = item.smsTemplate
              } else if (item.type == "examNotify") {
                this.form.entranceExamMsg = item.smsTemplate
              } else if (item.type == "enroll") {
                this.form.enrollPassMsg = item.smsTemplate
              } else if (item.type == "notPassEnroll") {
                this.form.enrollFailMsg = item.smsTemplate
              }
              this.$set(this, "form", this.form)
            })
          }
        })
      },
      onEditorBlur() { },
      onEditorFocus() { },
      handleExceed(file, fileList) {  //文件超出限制
        this.$message({
          showClose: true,
          message: '最多能一次上传3个文件！',
          type: 'warning'
        });
        this.$message.warning(`当前限制选择 10 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
      },
      handleRemove(file, fileList) {      //  文件列表移除文件时的钩子
        let self = this;
        self.flag = 0;
        self.sucessfilelist = fileList;
        this.$set(this, 'sucessfilelist', fileList)
      },
      uploadsuccess: function (file, fileList) {
        let self = this;
        if (file && file.code && file.code == 200) {
          if (self.flag) {
            self.sucessfilelist.push(fileList);
          } else {
            self.sucessfilelist.push(fileList);
            for (let i = 0; i < self.sucessfilelist.length; i++) {
              if (self.sucessfilelist[i].url == fileList.url) {
                self.sucessfilelist.splice(i, 1);
                return
              }
            }
          }
        } else {
          this.$message({
            message: '文件上传失败,请重新上传！',
            type: 'warning'
          })
        }
      },
      getDetail() {
        post(`/enrolltrain/enroll/${this.editId}`).then(res => {
          if (res && res.resCode == 200) {
            this.detail = res.model
            this.form = {
              enrollPassMsg: this.detail.enrollPassMsg,
              enrollFailMsg: this.detail.enrollFailMsg,
              sceneAuditFailMsg: this.detail.sceneAuditFailMsg,
              sceneAuditPassMsg: this.detail.sceneAuditPassMsg,
              entranceExamMsg: this.detail.entranceExamMsg,
              preAuditPassMsg: this.detail.preAuditPassMsg,
              preAuditFailMsg: this.detail.preAuditFailMsg,
              title: this.detail.title,
              time: [this.detail.startTime, this.detail.endTime],
              sceneVerify: String(this.detail.sceneVerify),
              entranceExam: String(this.detail.entranceExam),
              verifyMsg: String(this.detail.verifyMsg),
              description: this.detail.description,
            }
            if (this.detail.enrollFileList) {
              let querythisfile = this.detail.enrollFileList;
              for (let i = 0; i < querythisfile.length; i++) {
                if (querythisfile[i].fileType == 1) {
                  this.fileList.push(
                    {
                      'name': querythisfile[i].fileName,
                      'url': querythisfile[i].fileUrl
                    }
                  )
                }
              }
              this.sucessfilelist = this.fileList;
            };
            this.enrollStatus = this.detail.enrollStatus
          } else {
            this.$message({
              type: "error",
              message: "获取招录详情失败！"
            })
          }
        })
      },
      checkMoulidNotice() {
        let checkMouild = []
        if (this.form.verifyMsg == 1 && this.form.sceneVerify == 1) {
          checkMouild = checkMouild.concat(["sceneAuditPassMsg", "sceneAuditFailMsg"])
        }
        if (this.form.verifyMsg == 1 && this.form.entranceExam == 1) {
          checkMouild = checkMouild.concat(["entranceExamMsg"])
        }
        if (this.form.verifyMsg == 1) {
          checkMouild = checkMouild.concat(["preAuditPassMsg", "preAuditFailMsg", "enrollFailMsg", "enrollPassMsg"])
        }
        let flag = true
        checkMouild.forEach(item => {
          if (this.form[item].trim() == "") {
            flag = false
          }
        })
        if (!flag) {
          this.$message({
            type: "warning",
            message: "模版内容不可为空！"
          })
        }
        return flag
      },
      keepRescruit(enrollStatus) {
        if (!this.formflag) {
          return false;
        }
        this.formflag = false
        this.$refs["addRecruitForm"].validate((valid) => {
          if (valid && this.checkMoulidNotice()) {
            //处理附件列表
            let fileList = [];
            for (let i = 0; i < this.sucessfilelist.length; i++) {
              if (this.sucessfilelist[i].response) {
                this.sucessfilelist[i] = {
                  url: this.sucessfilelist[i].response.data.url,
                  name: this.sucessfilelist[i].response.data.fullname,
                }
              }
              fileList.push(
                {
                  fileUrl: this.sucessfilelist[i].url,
                  fileName: this.sucessfilelist[i].name,
                  fileType: 1
                }
              )
            };
            let params = {
              ...this.form,
              enrollStatus: enrollStatus,
              startTime: moment(new Date(this.form.time[0])).format("YYYY-MM-DD HH:mm:ss"),
              endTime: moment(new Date(this.form.time[1])).format("YYYY-MM-DD HH:mm:ss"),
              enrollFileList: fileList
            }
            delete params.time
            params.entranceExam = Number(this.form.entranceExam)
            params.sceneVerify = Number(this.form.sceneVerify)
            params.verifyMsg = Number(this.form.verifyMsg)
            let url = "/enrolltrain/enroll/add"
            if (this.editId) {
              params.id = this.editId
              url = "/enrolltrain/enroll/edit"
            }
            let startTime = new Date(this.form.time[0]).getTime()
            let endTemp = new Date(this.form.time[1]).getTime()
            let nowTemp = new Date().getTime()
            if (startTime - nowTemp < 0 || endTemp - nowTemp < 0) {
              this.$message({
                type: "warning",
                message: "请选择正确的招录时间"
              })
              this.formflag = true
              return false;
            }
            post(url, params).then(res => {
              if (res.resCode == 200) {
                this.$message({
                  type: "success",
                  message: enrollStatus == 2 ? '发布成功！' : "保存成功！"
                })
                if (enrollStatus == 2) {
                  this.$router.replace({
                    name: "recruitMange"
                  })
                  this.enrollStatus = 2
                  this.editId = res.model || this.editId
                } else {
                  this.enrollStatus = 1
                  this.editId = res.model || this.editId
                }
                this.formflag = true
              } else {
                this.$message({
                  type: "error",
                  message: enrollStatus == 2 ? res.resMsg || '发布失败！' : res.resMsg || "保存失败！"
                })
                this.formflag = true
              }
            }).catch(err=>{
              this.formflag = true
            })
          }
          this.formflag = true
        })
      },
      onEditorChange() {
        this.editorText = this.getContent(this.form.description).trim()
        if (this.editorText.length > 2000) {
          this.$message({
            type: "warning",
            message: "招录简介字数不可以超过2000"
          })
        }
      },
      getContent(richText) {
        return this.$refs.myQuillEditor.quill.container.innerText
      },
      back() {
        // window.history.go(-1)
        this.$router.push({
          name: "recruitMange",
          query: {
            tanIndex: 1
          }
        });
      }
    }
  }
</script>
<style>
  .addRecruit .formContent .el-input {
    width: 400px
  }

  .formContent .tipsSet .el-form-item {
    margin-bottom: 15 !important;

  }

  .formContent .el-form-item.allLine {
    width: 100%;
  }

  .formContent .tipsSet .el-form-item .info {
    width: 261px;
  }

  .addRecruit .ql-editor {
    padding-bottom: 20px;
  }
</style>
<style scoped>
  .addRecruit {
    padding: 20px;
    padding-top: 0;
  }

  .content {
    border: 1px solid #ebebeb;
    padding-bottom: 20px;
  }

  .content .title {
    background: #f4f4f5;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
  }

  .formContent {
    /* padding-top: 20px; */
    padding: 20px;
    padding-bottom: 0;
  }

  .tipsSet {
    width: 1000px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
  }

  .info {
    width: 315px;
  }

  .info span {
    margin-bottom: 2px;
  }

  .allLine .info {
    width: 400px
  }

  .centerContent {
    text-align: center;
  }

  .pageTitle {
    font-size: 15px;
    margin-bottom: 20px;
  }

  .pageTitle span {
    margin-right: 10px;
  }

  .wordNumber {
    width: 100%;
    text-align: right;
    display: inline-block;
    /* margin-top: -20px; */
    position: relative;
    top: -30px;
    right: 10px;
  }
</style>