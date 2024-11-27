<template>
  <div class="previewRecrit">
    <div class="pageTitle">
      <span>预览</span>
      <el-button @click="back" size="mini">返回</el-button>
    </div>
    <div class="detailInfo">
      <p><span>招录名称：</span>{{name}}</p>
      <p><span>招录时间：</span>{{time}}</p>
    </div>
    <el-form ref="form" :model="form" label-width="150px" class="formContent" :rules="rules">
      <div v-for="(item,index) in pageList" class="content">
        <p class="title ">{{item.title}}</p>
        <el-form-item v-for="(citem,cindex) in item.form" :key="cindex" v-if="citem.isShow" :class="citem.key">
          <span slot="label" :class="{'requiredDot': citem.required}">{{citem.label}}</span>
          <el-input disabled :placeholder="citem.placeholder" v-if="citem.type=='input'"></el-input>
          <el-select disabled :placeholder="citem.placeholder" v-if="citem.type=='select'"></el-select>
          <el-date-picker disabled type="date" :placeholder="citem.placeholder" v-if="citem.type=='date'">
          </el-date-picker>
          <el-radio-group disabled v-if="citem.type=='radio'">
            <el-radio label="男"></el-radio>
            <el-radio label="女"></el-radio>
          </el-radio-group>
          <el-upload disabled action="" list-type="picture-card" v-if="citem.type == 'img'" :class="citem.key">
            <i class="el-icon-plus"></i>
            <div class="el-upload__tip" slot="tip">{{citem.placeholder}}</div>
          </el-upload>
        </el-form-item>
      </div>
      <el-form-item>
        <el-button class="blueBtn" type="primary" disabled>提交申报</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import { post, getCookie } from '../../config/util'
  export default {
    data() {
      return {
        disabled: true,
        form: {
          name: "",
          radio: "",
          brithday: "",
          radio: ""
        },
        pageList: [
          { title: "基础信息", form: [] },
          { title: "工作信息", form: [] },
          { title: "教育信息", form: [] },
          { title: "职业信息", form: [] },
        ],
        recruitForm: [
          { label: "姓名", isShow: false, placeholder: "请输入姓名", required: true, type: "input", key: "name" },
          { label: "上传照片", isShow: false, placeholder: "上传一寸本人照片，照片大小2M", required: false, type: "img", key: "photo" },
          { label: "手机号", isShow: false, placeholder: "请输入手机号", required: true, type: "input", key: "phone" },
          { label: "邮箱", isShow: false, placeholder: "请输入邮箱", required: false, type: "input", key: "email" },
          { label: "性别", isShow: false, placeholder: "", required: false, type: "radio", key: "sex" },
          { label: "身份证号", isShow: false, placeholder: "请输入身份证", required: true, type: "input", key: "idCard" },
          { label: "出生年月", isShow: false, placeholder: "请选择", required: false, type: "date", key: "birthday" },
          { label: "国籍", isShow: false, placeholder: "关键字搜索，无搜索结果可填写", required: false, type: "input", key: "nationality" },
          { label: "民族", isShow: false, placeholder: "请选择", required: false, type: "select", key: "nation" },
          { label: "家庭地址", isShow: false, placeholder: "请输入家庭地址", required: false, type: "input", key: "familyAddress" },
        ],
        workInfo: [
          { label: "工作单位", isShow: false, placeholder: "请输入工作单位", required: false, type: "input", key: "workUnit" },
        ],
        educationInfo: [
          { label: "最高学历", isShow: false, placeholder: "请选择", required: false, type: "select", key: "highestEducation" },
          { label: "毕业院校", isShow: false, placeholder: "关键字搜索，无搜索结果可填写", required: false, type: "input", key: "graduationSchool" },
          { label: "毕业年份", isShow: false, placeholder: "选择年份", required: false, type: "date", key: "graduationYear" },
          { label: "毕业专业", isShow: false, placeholder: "关键字搜索，无搜索结果可填写", required: false, type: "input", key: "graduationMajor" },
          { label: "学位", isShow: false, placeholder: "请选择", required: false, type: "select", key: "degree" },
          { label: "学位类型", isShow: false, placeholder: "请选择", required: false, type: "select", key: "degreeType" },
        ],
        openInfo: [
          { label: "执业资格证照片", isShow: false, placeholder: "只能上传jpg/png文件，且不超过2M，最多上传5张", required: false, type: "img", key: "qualificationCertificateImg" },
          { label: "执业资格证号", isShow: false, placeholder: "执业资格证号", required: false, type: "input", key: "qualificationCertificateNo" },
          { label: "执业资格证获取时间", isShow: false, placeholder: "选择执业资格证获取时间", required: false, type: "date", key: "qualificationCertificateObtainTime" }
        ],
        detail: {},
        editId: "",
        name: "",
        time: ""
      }
    },

    created() {
      this.initPage()
      this.getDetail()
      this.editId = this.$route.query.id
      this.name = this.$route.query.name
      this.time = this.$route.query.time
    },
    methods: {
      setForms() {
        this.pageList.forEach(item => {
          item.form.forEach(citem => {
            this.detail.forEach(val => {
              if (val == citem.key) {
                citem.isShow = true;
              }
            })
          })
        })
        this.$set(this, "pageList", this.pageList)
      },
      getDetail() {
        post(`/base/commpara/getListByCode?code=enroll_field_template`).then(res => {
          if (res && res.resCode == 200) {
            console.log(res.model[0])
            this.detail = JSON.parse(res.model[0].param1)
            console.log(this.detail)
            this.setForms()
          } else {
            this.$message({
              type: "error",
              message: "获取招录预览字段报错！"
            })
          }
        })
      },
      initPage() {
        this.pageList.forEach((item, index) => {
          switch (index) {
            case 0:
              item.form = this.recruitForm
              break;
            case 1:
              item.form = this.workInfo
              break;
            case 2:
              item.form = this.educationInfo
              break;
            case 3:
              item.form = this.openInfo
              break;
            default:
              break;
          }
        })
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
  .previewRecrit .formContent .el-input {
    width: 357px
  }

  .previewRecrit .qualificationCertificateObtainTime .el-upload {
    width: 360px;
  }

  .previewRecrit .el-form-item.photo {
    position: absolute;
    top: 70px;
    left: 55%;
    display: inline-block;

  }
</style>
<style scoped>
  .previewRecrit {
    padding: 20px;
    padding-top: 0;
  }

  .content {
    position: relative;
    border: 1px solid #ebebeb;
    margin-bottom: 20px;
  }

  .content .title {
    background: #f4f4f5;
    height: 50px;
    line-height: 50px;
    padding-left: 20px;
    margin-bottom: 20px;
  }

  .pageTitle {
    font-size: 15px;
    margin-bottom: 20px;
  }

  .pageTitle span {
    margin-right: 10px;
  }

  .blueBtn {
    width: 100%;
  }

  .detailInfo {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom: 15px;
    font-size: 14px;
  }
  .detailInfo p:last-child {
    margin-left:150px;
  }

  .requiredDot {
    position: relative;
  }

  .requiredDot::before {
    position: absolute;
    display: block;
    top: -1px;
    left: -9px;
    content: "*";
    color: red;
    font-size: 16px;

  }
</style>