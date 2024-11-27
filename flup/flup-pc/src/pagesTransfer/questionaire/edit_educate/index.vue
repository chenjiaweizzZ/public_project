<template>
  <div style="margin: 20px; margin-bottom: 160px">
    <el-form
      :model="form"
      :rules="rules"
      ref="form"
      label-width="100px"
      class="demo-form margin10X"
    >
      <el-row type="flex" justify="space-between">
        <el-col :span="15">
          <el-form-item label="封面" prop="file">
            <ImageEditor
              ref="image-editor"
              @on-change="onImageChange"
            ></ImageEditor>
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <div class="marginX20">
            <el-upload
              class="inline-block marginX10"
              :show-file-list="false"
              :before-upload="parseFile"
              action="/"
            >
              <el-button type="primary">导入模板</el-button>
            </el-upload>
            <el-button type="primary" @click="exportTempalte"
              >导出模板</el-button
            >
          </div>
          <el-form-item class="margin10X" label="选择科室" prop="flupDept">
            <el-select
              class="query-item"
              v-model="form.flupDept"
              placeholder="请选择科室"
            >
              <el-option
                v-for="item in deptOptions"
                :key="item.serialNo"
                :label="item.deptName"
                :value="item.serialNo"
              ></el-option>
            </el-select>
          </el-form-item>

          <!-- <el-form-item label="模板来源" prop="sourceType">
            <el-radio-group v-model="form.sourceType">
              <el-radio label="1">原创</el-radio>
              <el-radio label="2">转帖</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="转帖地址" prop="sourceUrl" v-if="form.sourceType == 2">
            <el-input v-model="form.sourceUrl"></el-input>
          </el-form-item>-->
        </el-col>
      </el-row>
      <el-form-item>
        <template slot="label" class="ceshi">
          <div class="flex">
            <el-tooltip
              class="item"
              effect="dark"
              content="根据宣教具体内容向患者展示该文概要，例如导管管理/移植前须知，给予用户精准的内容推荐感受。如不设置，将在患者端健康任务界面默认展示健康宣教。"
              placement="top-end"
            >
              <div class="explain">?</div>
            </el-tooltip>
            <span>名称</span>
          </div>
        </template>
        <el-input
          v-model.trim="form.questionnaireClass"
          show-word-limit
          :maxlength="10"
        ></el-input>
      </el-form-item>

      <el-form-item label="标题" prop="questionnaireName">
        <el-input
          v-model.trim="form.questionnaireName"
          show-word-limit
          :maxlength="20"
        ></el-input>
      </el-form-item>

      <el-form-item label="摘要" prop="content">
        <el-input
          type="textarea"
          v-model="form.content"
          show-word-limit
          :maxlength="150"
        ></el-input>
      </el-form-item>

      <el-form-item v-if="form.sourceType == 1" label="内容" prop="contentHtml">
        <!-- <Editor id="editor" v-model="form.contentHtml"></Editor> -->
        <QuillEditor v-model="form.contentHtml"></QuillEditor>
      </el-form-item>
    </el-form>
    <el-row class="footer flex-align">
      <el-col :offset="1" :span="6">
        <el-button class="marginX10" type="primary" @click="submitForm">{{
          componentValue == 1 || authState == 1 ? "提交审核" : "保存"
        }}</el-button>
        <el-button class="marginX10" @click="onCancel">取消</el-button>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { base64StringToBlob } from "blob-util";
import { blobToBase64String } from "blob-util";
import Editor from "./components/editor";
import ImageEditor from "./components/image_editor";
import QuillEditor from "@/components/quill_editor";
import axios from "axios";

export default {
  components: {
    ImageEditor,
    Editor,
    QuillEditor
  },
  async created() {
    this.$startLoading();
    let res = await this.$apis.queryFlupConfigOne({
      hospitalId: this.$global.hospital_id,
      moduleCode: "followUpSetting",
      componentKey: "xjTemplateCreateAuth"
    });
    if (res) {
      this.componentValue = res.componentValue;
    }
    await this.getDeptList();
    if (this.serialNo) {
      await this.getXJTemplate();
    }
    this.$stopLoading();
  },
  computed: {
    serialNo() {
      return this.$route.query.serialNo || "";
    },
    authState() {
      if (this.$route.query.authState) {
        return this.$route.query.authState;
      }
      return 0;
    }
  },
  data() {
    return {
      deptOptions: [],
      rules: {
        contentHtml: [
          { required: true, message: "请输入内容", trigger: "blur" }
        ],
        flupDept: [{ required: true, message: "请选择科室", trigger: "blur" }],
        sourceUrl: [
          { required: true, message: "请选择转帖地址", trigger: "blur" }
        ],
        file: [{ required: true, message: "请选择图片" }],
        questionnaireName: [
          { required: true, message: "请输入模板名称", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入内容摘要", trigger: "blur" }
        ]
      },
      // file: null,
      form: {
        sourceType: "1", // 1原创2转帖
        questionnaireName: "",
        flupDept: "ALL",
        sourceUrl: "",
        content: "",
        contentHtml: "",
        file: null,
        questionnaireClass: ""
      },
      isDialogShow: false,
      componentValue: 0 //0 不需要审核 1 需要审核
    };
  },
  methods: {
    onImageChange(blob) {
      this.form.file = blob;
    },
    editXJTemplate() {
      let submitForm = {
        createUser: this.$global.userName,
        questionnaireTypeId: 3, // 1问卷3宣教
        serialNo: this.serialNo || undefined,
        hospitalId: this.$global.hospital_id,
        // file: this.file,
        ...this.form,
        contentHtml: this.HTMLEncode(this.form.contentHtml)
          ? this.HTMLEncode(this.form.contentHtml)
          : "&lt;/p&gt;"
      };
      let formData = new FormData();
      for (let key in submitForm) {
        if (submitForm[key]) formData.append(key, submitForm[key]);
      }
      axios({
        method: "post",
        url: this.$baseURL.ICDMApiUrl + "/b/template/saveTemplateData",
        headers: {
          token: this.$route.query.token
            ? this.$route.query.token
            : sessionStorage.getItem("token"),
          "content-type": "multipart/form-data"
        },
        data: formData
      }).then(res => {
        if (res.data.retData) {
          this.$message({
            message: "保存成功",
            type: "success"
          });
          let url = "/newsendTemplateListV2/JKXJ";
          if (this.authState == 1) {
            url = "/auditManagement";
          }
          this.$router.push(url);
        } else {
          this.$message({
            message: res.data.retInfo,
            type: "warning"
          });
        }
      });
    },
    // 获取模板
    getXJTemplate() {
      return this.$apis
        .templatequeryTemplateContent({
          serialNo: this.serialNo
        })
        .then(res => {
          let data = res;
          let keys = Object.keys(this.form);
          for (let key of keys) {
            this.form[key] = data[key];
          }
          this.form.contentHtml = this.HTMLDecode(res.contentHtml);
          // this.form.contentHtml = res.contentHtml
          this.$refs["image-editor"].imgUrl =
            "data:image/jpg;base64," + res.cover;
          this.form.file = base64StringToBlob(res.cover);
          this.form.sourceType = this.form.sourceType || "1";
        });
    },
    // 获取科室
    getDeptList() {
      return this.$apis.systemManagequeryCurrentUserDept().then(res => {
        this.deptOptions = [{ serialNo: "ALL", deptName: "全院" }, ...res];
      });
    },
    async parseFile(file) {
      let data = await file.text();
      data = JSON.parse(data);
      this.form.questionnaireName = data.title;
      this.form.content = data.summary;
      this.form.contentHtml = data.content;
      this.$refs["image-editor"].imgUrl = "data:image/jpg;base64," + data.cover;
      this.form.file = base64StringToBlob(data.cover);
      return false;
      // console.log(f.text().then((v) => {
      //   let obj = JSON.parse(v)
      //   console.log(obj)
      //   this.form.sourceType = obj.sourceType
      //   this.form.questionnaireName = obj.title
      //   this.form.flupDept = obj.flupDept
      //   this.form.sourceUrl = obj.sourceUrl
      //   this.form.content = obj.summary
      //   this.form.contentHtml = obj.content
      //   this.$refs["image-editor"].imgUrl = 'data:image/jpg;base64,' + obj.file_base64;
      //   this.form.file = base64StringToBlob(obj.file_base64)
      // }))
      // return false
    },
    async exportTempalte() {
      function saveShareContent(content, fileName) {
        let downLink = document.createElement("a");
        downLink.download = fileName;
        //字符内容转换为blod地址
        let blob = new Blob([content]);
        downLink.href = URL.createObjectURL(blob);
        // 链接插入到页面
        document.body.appendChild(downLink);
        downLink.click();
        // 移除下载链接
        document.body.removeChild(downLink);
      }

      let cover = await blobToBase64String(this.form.file);
      let templateContent = {
        cover,
        title: this.form.questionnaireName,
        summary: this.form.content,
        content: this.form.contentHtml
      };
      saveShareContent(
        JSON.stringify(templateContent),
        this.form.questionnaireName
      );
      // this.$refs["form"].validate(async (valid) => {

      //   if (valid) {
      //     let submitForm = {
      //       ...this.form,
      //       file_base64: await blobToBase64String(this.form.file),
      //     }
      //     saveShareContent(JSON.stringify(submitForm), this.form.questionnaireName)
      //   } else {
      //     return false;
      //   }
      // });
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.editXJTemplate();
        } else {
          return false;
        }
      });
    },
    onCancel() {
      let url = "/newsendTemplateListV2/JKXJ";
      if (this.authState == 1) {
        url = "/auditManagement";
      }
      this.$router.push(url);
    },
    onAvatarChange(date) {
      this.form.fengmiantupian = date;
      this.isDialogShow = false;
    },
    HTMLEncode(html) {
      var temp = document.createElement("div");
      temp.textContent != null
        ? (temp.textContent = html)
        : (temp.innerText = html);
      var output = temp.innerHTML;
      temp = null;
      return output;
    },
    HTMLDecode(text) {
      var temp = document.createElement("div");
      temp.innerHTML = text;
      var output = temp.innerText || temp.textContent;
      temp = null;
      return output;
    }
  }
};
</script>
<style lang="scss" scoped>
.flex {
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: end;
  .explain {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    border: 1px solid rgb(153, 153, 153);
    border-radius: 50%;
    color: rgb(153, 153, 153);
    margin-right: 10px;
  }
}
</style>
