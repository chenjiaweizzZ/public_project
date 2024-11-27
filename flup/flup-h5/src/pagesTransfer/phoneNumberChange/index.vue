<template>
  <div class="login">
    <div class="login-info">
      <img class="login-info__img" v-if="headImgUrl" :src="headImgUrl" alt="" />
      <img class="login-info__img" v-else src="@/assets/images/core/headSculpture.png" alt="" />
      <span class="login-info__text">{{ nickName }}</span>
      <span class="login-info__introduce mt">亲爱的微信平台用户</span>
      <span class="login-info__introduce">为了修改原有手机号,请重新绑定手机号</span>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="0px" class="login-ruleForm">
      <!-- <el-form-item prop="name" class="login-ruleForm__item">
        <div @click.stop.prevent="inputPaentClick('inputName')">
          <el-input ref="inputName" v-model.trim="ruleForm.name" placeholder="姓名" class="login-ruleForm__input"></el-input>
        </div>
      </el-form-item> -->
      <!-- <el-form-item prop="idCard" class="login-ruleForm__item">
        <div @click.stop.prevent="inputPaentClick('inputIdCard')">
          <el-input ref="inputIdCard" v-model.trim="ruleForm.idCard" placeholder="身份证" class="login-ruleForm__input" @input="changeIdNo"></el-input>
        </div>
      </el-form-item> -->
      <el-form-item prop="phone" class="login-ruleForm__item">
        <div @click.stop.prevent="inputPaentClick('inputPhone')">
          <el-input ref="inputPhone" v-model.trim="ruleForm.phone" placeholder="请输入新的手机号" class="login-ruleForm__input"></el-input>
        </div>
      </el-form-item>
      <!-- <el-form-item prop="Oriphone" class="login-ruleForm__item">
        <div @click.stop.prevent="inputPaentClick('inputPhone')">
          <el-input ref="inputPhone" v-model.trim="ruleForm.Oriphone" placeholder="请输入原有的手机号" class="login-ruleForm__input" :disabled="true"></el-input>
        </div>
      </el-form-item> -->
      <el-form-item prop="code" class="login-ruleForm__item">
        <div @click.stop.prevent="inputPaentClick('inputCode')">
          <el-input ref="inputCode" v-model.trim="ruleForm.code" placeholder="请输入验证码" class="login-ruleForm__input" maxlength="6">
            <div slot="suffix" class="code">
              <span v-if="!isSuccess" class="code-text" @click.stop="handleCanvas">获取验证码</span>
              <span v-else class="code-textDisabled">重新获取({{ codeTime }})</span>
            </div>
          </el-input>
        </div>
      </el-form-item>
    </el-form>
    <div class="login-article">
      <van-checkbox v-model="isArticle" shape="square" checked-color="#32ae57" icon-size="16px">
        点击勾选即表示同意<span class="login-article__text" @click.stop="isUserAgreement = true">服务协议</span>和<span class="login-article__text" @click.stop="isProvision = true">隐私条款</span>
      </van-checkbox>
    </div>
    <div class="login-btnWrap">
      <div class="login-btn" @click="submitForm">提交</div>
    </div>
    <!-- 用户协议 -->
    <van-popup v-model="isUserAgreement" class="login-popup">
      <div class="login-userAgreement">
        <van-icon name="cross" class="login-userAgreement__icon" @click="isUserAgreement = false" />
        <div class="login-userAgreement__title">用户服务协议</div>
        <textarea class="login-userAgreement__text" readonly="readonly">
  健康管理用户须知
  
  欢迎使用健康管理服务。在使用服务前，请您仔细阅读本用户须知。使用服务即表示您已经阅读、理解并同意本用户须知的所有条款和条件。
  
  一、服务内容
  
  健康管理服务是一项个性化的健康管理服务，包括健康风险评估、健康干预计划、健康管理跟踪和健康咨询等内容。服务由专业医生、健康管理师等提供。
  
  二、服务对象
  
  服务对象包括但不限于以下人群：
  
  1. 有慢性疾病或慢性病病史的人群；
  
  2. 患有亚健康状况的人群；
  
  3. 需要进行健康风险评估的人群；
  
  4. 对自己的健康状况有所关注的人群。
  
  三、服务费用
  
  服务费用由服务机构根据服务内容和服务对象的具体情况进行定价，并在签订服务协议时告知服务对象。服务费用一般包括服务机构提供的健康管理服务、服务对象所需的检测、治疗等费用。
  
  四、服务流程
  
  1. 健康风险评估：服务对象提供基本信息、生活习惯、家族史、病史等资料，进行健康风险评估。
  
  2. 健康干预计划：根据健康风险评估结果，制定个性化的健康干预计划。
  
  3. 健康管理跟踪：定期对服务对象进行健康管理跟踪，评估健康干预计划的效果，并对计划进行适当调整。
  
  4. 健康咨询：为服务对象提供健康咨询服务，解答其关于健康的疑问。
  
  五、注意事项
  
  1. 服务对象应如实提供个人信息和健康状况，以便服务机构进行健康风险评估和制定健康干预计划。
  
  2. 服务对象应按照健康干预计划进行生活方式和行为的调整，并定期进行健康管理跟踪。
  
  3. 服务对象应在服务期限届满前一个月提出是否续约或终止服务的申请。
  
  4. 服务对象应妥善保管个人信息和健康状况，避免泄露给任何第三方。
  
  六、服务保密
  
  服务机构应对服务对象的个人信息和健康状况保密，未经允许下不得泄露给任何第三方。
  
  七、协议变更和终止
  
  1. 双方协商一致可以对服务协议进行变更。
  
  2. 服务对象可以在服务期限届满前一个月提出终止服务的申请。
  
  3. 因不可抗力等原因，服务协议无法继续履行的，双方应协商解决。
  
  八、争议解决
  
  服务协议的履行和解释均适用中华人民共和国法律。如发生争议，双方应协商解决；协商不成的，任何一方均有权向有管辖权的人民法院提起诉讼。
  
  
  服务机构：卓健数智
          </textarea>
      </div>
    </van-popup>
    <!-- 隐私条款 -->
    <van-popup v-model="isProvision" class="login-popup">
      <div class="login-Provision">
        <van-icon name="cross" class="login-Provision__icon" @click="isProvision = false" />
        <div class="login-Provision__title">隐私政策</div>
        <textarea class="login-Provision__text" readonly="readonly">
  一、隐私政策的适用范围
  
  本隐私政策适用于慢性病健康管理平台的所有用户。
  
  二、我们收集的信息
  
  为了提供更好的服务，我们可能会收集以下信息：
  
  1.个人信息：包括但不限于姓名、性别、年龄、身高、体重、血糖值、血压值、病历信息、收货地址等。
  
  1.1姓名、性别、年龄、身高、体重、血糖值、血压值等病历记录有助于健管师及时了解您的病程，及时做出跟踪和疾病干预。
  
  1.2收货地址用于您购买平台上商品时，邮寄至您家里。
  三、信息的使用
  
  我们可能会将收集的信息用于以下用途：
  
  1.为您提供更好的服务：我们可能会根据您提供的个人信息，为您提供更加个性化的健康管理服务。
  
  2.改进我们的服务：我们可能会根据您的反馈和评价，不断改进我们的服务。
  
  3.法律要求：我们可能会根据法律法规或政府部门的要求，披露您的个人信息。
  
  四、信息的保护
  
  我们承诺采取必要的技术和组织措施，保护您的个人信息不被未经授权的访问、使用或泄露。
  
  五、用户权利
  
  1.访问权：您有权访问、更正、删除您的个人信息。
  
  2.撤销权：您有权撤销您的个人信息。
  
  3.投诉权：如果您认为我们处理您的个人信息不当，您有权向相关监管机构投诉。
  
  六、隐私政策的更新
  
  我们可能会根据法律法规和产品升级，对本隐私政策进行更新。我们会在网站上公布最新的隐私政策，并在必要时向您发送通知。
  
  七、联系我们
  
  如果您对本隐私政策有任何疑问或意见，请通过我们的客服渠道联系我们。
          </textarea>
      </div>
    </van-popup>
    <!-- 验证码 -->
    <van-popup v-model="isCode" class="login-popup" @closed="resetInfo">
      <div class="login-codePopup">
        <van-icon name="cross" class="login-codePopup__icon" @click="isCode = false" />
        <div class="login-codePopup__title">请输入图形验证码</div>
        <div class="login-codePopup__err" v-if="isErr">
          {{ pointError }}
        </div>
        <div class="codePopup-info">
          <div class="codePopup-info__img">
            <img class="img" :src="isCaptcha" alt="">
          </div>
          <div class="codePopup-info__refurbish" @click="resetCode">
            <img class="img" src="@/assets/images/reset.png" alt="" />
          </div>
        </div>
        <verificaton-code :code.sync="code"></verificaton-code>
      </div>
    </van-popup>
  </div>
</template>
  <script>
import "element-ui/lib/theme-chalk/index.css";
import verificatonCode from "../login/components/verificatonCode.vue";
import { Form, FormItem, Input } from "element-ui";
export default {
  components: {
    [Form.name]: Form,
    [FormItem.name]: FormItem,
    [Input.name]: Input,
    verificatonCode,
  },
  data() {
    let validateIdCard = (rule, value, callback) => {
      let info = this.$utils.getInfoByIdCard(value);
      if (!info) {
        callback(new Error("身份证信息有误"));
      }
      callback();
    };
    let validatePhone = (rule, value, callback) => {
      let info = this.$utils.checkPhone(value);
      if (!info) {
        callback(new Error("手机号信息有误"));
      }
      callback();
    };
    return {
      time: null,
      codeTime: 60,
      isUserAgreement: false, //用户协议
      isProvision: false, //隐私条款
      isArticle: false, //是否同意协议
      isCode: false, //验证码
      isErr: false, //验证码错误
      pointError: "", //验证码错误提示
      isSuccess: false, //验证码成功
      showKeyboard: false,
      nickName: "", //用户名
      headImgUrl: "", //头像
      code: "", //验证码
      isCaptcha: "", //图形验证地址
      ruleForm: {
        name: "",
        idCard: "",
        phone: "",
        code: "",
        Oriphone: ""
      },
      openId: "",
      rules: {
        name: [{ required: true, message: "请输入姓名", trigger: "change" }],
        idCard: [
          { required: true, message: "请输入身份证", trigger: "change" },
          { validator: validateIdCard, trigger: "change" },
        ],
        phone: [
          { required: true, message: "请输入手机号", trigger: "change" },
          { validator: validatePhone, trigger: "change" },
        ],
        code: [{ required: true, message: "请输入验证码", trigger: "change" }],
      },
    };
  },
  watch: {
    code: {
      handler(newValue) {
        if (newValue && newValue.length == 4) {
          this.getCode();
        } else {
          this.isErr = false;
        }
      },
    },
  },
  created() {
    this.getOriPhone()
  },
  mounted() {
    if (
      localStorage.getItem("openId") ||
      JSON.parse(localStorage.getItem("userInfo"))
    ) {
      console.log(111);
      document.title = "绑定手机";
      this.$once("hook:beforeDestroy", this.onBeforeDestroy);
      let userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        this.nickName = JSON.parse(userInfo).nickName;
        this.headImgUrl = JSON.parse(userInfo).headImgUrl;
      }
      this.openId =
        this.$route.query.openId ||
        this.openId ||
        localStorage.getItem("openId") ||
        (localStorage.getItem("userInfo")
          ? JSON.parse(localStorage.getItem("userInfo")).openId
          : "");
    } else {
      let url = window.location.href;
      let name = window.location.href.split("/#/")[0] + "/#/transportV2?url=";
      let newUrl = name + url;
      let redirect_uri = encodeURIComponent(newUrl);
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${window.globalURL.APPID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${window.globalURL.hospitalId}&connect_redirect=1#wechat_redirect`;
    }
  },
  methods: {
    getOriPhone() {
        try {
            this.ruleForm.Oriphone = this.$route.query.phone
        }catch(error) {
            console.log(error)
        }
    },
    //获取输入框焦点
    inputPaentClick(refName) {
      this.$nextTick(() => {
        this.$refs[refName] && this.$refs[refName].focus();
      });
    },
    //销毁
    onBeforeDestroy() {
      if (this.codeTime) {
        clearInterval(this.time);
        this.time = null;
      }
    },
    //获取验证码
    async getCode() {
      try {
        let res = await this.$apis.getSendVerifyCode({
          phoneNo: this.ruleForm.phone,
          purpose: 99,
          captchaCode: this.code,
        });
        this.isSuccess = true;
        this.time = setInterval(() => {
          this.codeTime--;
          if (this.codeTime <= 0) {
            this.isSuccess = false;
            clearInterval(this.time);
            this.time = null;
            this.codeTime = 60;
          }
          console.log(`----${this.codeTime}-----`);
        }, 1000);
        this.resetInfo();
      } catch (e) {
        this.pointError = e;
        this.isErr = true;
      }
    },
    //表单提交
    submitForm() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (!this.isArticle) {
          this.$toast("请同意协议");
          return false;
        }
        if (valid) {
            this.$apis.editPatientInfo({
                msgCode: this.ruleForm.code,
                newPhone: this.ruleForm.phone
            }).then(res => {
                console.log(res)
                    this.$toast("修改成功");
                    this.$router.go(-1)
            }).catch(err => {
                console.log("error")
                this.$toast(err);
            }) 
        //   try {
        //     let userId = sessionStorage.getItem("userId");
        //     await this.$apis.savePatientInfo({
        //       headImgUrl: this.headImgUrl,
        //       nickName: this.nickName,
        //       idNo: this.ruleForm.idCard,
        //       patientName: this.ruleForm.name,
        //       phone: this.ruleForm.phone,
        //       msgCode: this.ruleForm.code,
        //       openId: this.openId,
        //       cpExternalUserId: userId,
        //     });
        //     let res = await this.$apis.getPatientInfo({ openId: this.openId });
        //     await localStorage.setItem("userInfo", JSON.stringify(res.retData));
        //     await sessionStorage.removeItem("userId");
        //     let url = JSON.parse(sessionStorage.getItem("path"));
        //     if (url && url.path == "/chat") {
        //       let { retData } = await this.$apis.preSalesConsultation({});
        //       // let imUrl = JSON.parse(retData.imUrl);
        //       let imData = await this.$apis.getIMData(retData.userId);
        //       let imUrl = JSON.parse(imData.retData);
        //       let userSig = imUrl.userSig;
        //       let roomId = retData.roomId;
        //       let patientId = retData.userId;
        //       localStorage.setItem("userId", patientId);
        //       localStorage.setItem("userSig", userSig);
        //       let consultId = retData.id;
        //       this.$router.replace({
        //         path: "/chat",
        //         query: {
        //           consultId,
        //           serviceStatus: 0,
        //           patientId,
        //           patientName: JSON.parse(localStorage.getItem("userInfo"))
        //             .patientName,
        //           roomId,
        //           preSales: 1, //1售前
        //           ...url.query,
        //         },
        //       });
        //     } else if (url) {
        //       sessionStorage.removeItem("path");
        //       if (
        //         Object.keys(url.query).includes("openId") &&
        //         !url.query.openId
        //       ) {
        //         url.query.openId = this.openId;
        //       }
        //       this.$router.replace({
        //         path: url.path,
        //         query: url.query,
        //       });
        //     } else {
        //       this.$router.go(-1);
        //     }
        //   } catch (e) {
        //     this.$toast.fail(e);
        //   }
        }
      });
    },
    //canvas点击刷新
    handleCanvas() {
      this.$refs.ruleForm.validateField(["phone"], async (val) => {
        if (val) {
          return false;
        }
        this.$nextTick(() => {
          this.getCaptcha();
          this.isCode = true;
        });
      });
    },
    //获取图形验证码
    async getCaptcha() {
      let { retData } = await this.$apis.getCaptcha({
        phone: this.ruleForm.phone,
        length: 4,
      });
      this.isCaptcha = retData;
    },
    //重置验证码
    resetCode() {
      this.getCaptcha();
      this.code = "";
      this.isErr = false;
    },
    //重置验证弹窗
    resetInfo() {
      this.isCode = false;
      this.isErr = false;
      this.code = "";
    },
    changeIdNo(idNo) {
      if (idNo.length == 18) {
        this.$apis.getPatientPhone(idNo).then((res) => {
          if (!this.ruleForm.phone) {
            this.ruleForm.phone = res.retData;
          }
        });
      }
    },
  },
};
</script>
  <style lang="scss">
.login {
  &-ruleForm {
    &__input {
      input {
        height: 100%;
        font-size: 16px;
        border-radius: 6px;
        color: #111111;
      }
      input[type="text"]:focus,
      select:focus {
        border: 1px solid #32ae57;
        outline: none;
      }
      .el-input__inner {
        border-color: #cdcdcd;
      }
      .el-input__inner::placeholder {
        color: #b2b2b2;
      }
    }
    .el-form-item__error {
      font-size: 12px;
      padding-top: 1px;
    }
    &__item {
            .el-input__inner {
                border-color: #cdcdcd;
                background-color: #FFF;
                color: #111;
            }
    }
  }
}
</style>
  <style lang="scss" scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #fff;
  background-image: url("../../assets/images/bgLogin.png");
  background-repeat: no-repeat;
  background-size: 100%;
  overflow-y: auto;
  &-info {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0 10px;
    &__img {
      width: 90px;
      height: 90px;
      border-radius: 50px;
      object-fit: cover;
      margin-top: 37px;
    }
    &__text {
      font-size: 18px;
      font-weight: 600;
      line-height: 19px;
      color: #111111;
      margin-top: 23px;
    }
    &__introduce {
      font-size: 14px;
      font-weight: normal;
      line-height: 19px;
      color: #264f32;
    }
    .mt {
      margin: 16px 0 4px;
    }
  }
  &-ruleForm {
    padding: 16px 15px 18px;
    &__input {
      height: 47px;
      .code {
        height: 100%;
        display: flex;
        align-items: center;
        &-text {
          margin-right: 16px;
          font-size: 16px;
          font-weight: normal;
          color: #00982d;
        }
        &-textDisabled {
          margin-right: 16px;
          font-size: 16px;
        }
      }
    }
    &__item {
      margin-bottom: 20px;
    }
  }
  &-article {
    .van-checkbox {
      justify-content: center;
    }
    text-align: center;
    font-size: 13px;
    font-weight: normal;
    line-height: 16px;
    color: #333333;
    &__text {
      color: #00982d;
    }
  }
  &-btnWrap {
    padding: 42px 15px 20px;
    .login-btn {
      height: 42px;
      border-radius: 21px;
      background: #32ae57;
      font-size: 16px;
      font-weight: 500;
      line-height: 42px;
      text-align: center;
      color: #ffffff;
      &:active {
        opacity: 0.8;
      }
    }
  }
  &-popup {
    border-radius: 8px;
  }
  &-userAgreement,
  &-Provision {
    padding: 20px 0px 11px;
    width: 320px;
    position: relative;
    &__icon {
      position: absolute;
      top: 14px;
      right: 12px;
      z-index: 1;
      font-size: 22px;
      color: #999999;
    }
    &__title {
      font-size: 18px;
      font-weight: 600;
      line-height: 22px;
      text-align: center;
      color: #111111;
      margin-bottom: 19px;
    }
    &__text {
      padding: 0 20px;
      width: 100%;
      height: 528px;
      overflow-y: auto;
      border: none;
      background-color: transparent;
    }
  }
  &-codePopup {
    width: 290px;
    height: 236px;
    padding: 24px 20px;
    position: relative;
    &__icon {
      position: absolute;
      top: 14px;
      right: 12px;
      z-index: 1;
      font-size: 22px;
      color: #999999;
    }
    &__title {
      font-size: 16px;
      font-weight: 600;
      line-height: 19px;
      text-align: center;
      color: #333333;
      margin-bottom: 15px;
    }
    &__err {
      font-size: 14px;
      font-weight: normal;
      line-height: 17px;
      text-align: center;
      color: #ff5500;
      padding-bottom: 11px;
    }
    .codePopup-info {
      display: flex;
      align-items: center;
      &__img {
        flex: 1;
        height: 58px;
        position: relative;
        .img {
          width: 100%;
          height: 100%;
        }
      }
      &__refurbish {
        width: 58px;
        height: 58px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f6f6f6;
        .img {
          width: 30px;
          height: 30px;
        }
      }
    }
    .van-password-input {
      margin: 0px;
    }
    &__input {
      & > li {
        border: 1px solid #cdcdcd;
        border-radius: 4px;
      }
      margin-top: 24px;
      height: 56px;
    }
    &__passwordInnputWrap {
      width: 0;
      height: 0;
      position: relative;
      overflow: hidden;
      .login-codePopup__passwordInnput {
        position: absolute;
        left: -750px;
        top: 0px;
        width: 0;
        height: 0;
        z-index: -1;
      }
    }
  }
}
</style>
  