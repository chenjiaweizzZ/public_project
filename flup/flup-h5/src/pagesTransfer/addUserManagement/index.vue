<template>
    <div class="addUserManagement">
        <van-form @submit="onSubmit" error-message-align="right" ref="vantForm">
            <div @click.stop.prevent="inputPaentClick('username')">
                <van-field
                    v-model.trim="username"
                    name="username"
                    label="姓名"
                    placeholder="请输入"
                    input-align="right"
                    :rules="[{ required: true, message: '请输入姓名', trigger:'onChange'}]"
                    class="field"
                    ref="username"
                />
            </div>
            <van-field
                readonly
                clickable
                name="papers"
                :value="papers"
                label="证件类型"
                input-align="right"
                placeholder="请选择"
                @click="showPapers = true"
                class="field"
                right-icon="arrow"
            />
            <div @click.stop.prevent="inputPaentClick('idCard')">
                <van-field
                    v-model.trim="idCard"
                    name="idCard"
                    label="证件号"
                    placeholder="请输入"
                    input-align="right"
                    :rules="[{ required: true, message: '请输入证件号',trigger:'onChange'},{ validator:validatorIdCard, message: '身份信息有误',trigger:'onChange' }]"
                    class="field"
                    ref="idCard"
                />
            </div>
            <div @click.stop.prevent="inputPaentClick('phone')">
                <van-field
                    v-model.trim="phone"
                    name="phone"
                    label="手机号"
                    placeholder="请输入"
                    input-align="right"
                    :rules="[{ required: true, message: '请输入手机号',trigger:'onChange' },{ validator:validatorPhone, message: '手机号信息有误',trigger:'onChange' }]"
                    class="field"
                    ref="phone"
                />
            </div>
            <div @click.stop.prevent="inputPaentClick('newCode')">
                <van-field
                    v-model.trim="newCode"
                    name="newCode"
                    label="验证码"
                    placeholder="请输入"
                    input-align="right"
                    :rules="[{ required: true, message: '请输入验证码',trigger:'onChange' }]"
                    class="field"
                    ref="newCode"
                    maxlength="6"
                >
                    <template #button>
                        <div>
                            <van-button class="code-btn" size="small" type="primary" plain round v-if="!isSuccess" @click.stop="handleCanvas" native-type="button">获取验证码</van-button>
                            <span v-else>重新获取（{{ num }}s）</span>
                        </div>
                    </template>
                </van-field>
            </div>
            <van-field class="field switch" name="switch" label="设为默认就诊人" label-width="200px" input-align="right" >
                <template #input>
                    <van-switch v-model="switchChecked" size="30px" active-color="#32AE57" inactive-value="0" active-value="1"/>
                </template>
            </van-field>
            <div class="addUserManagement-btn">
                <van-button round block type="info" native-type="submit" color="#32AE57">保存</van-button>
            </div>
        </van-form>
        <!-- 证件类型 -->
        <van-popup v-model="showPapers" position="bottom">
            <van-picker
                show-toolbar
                :columns="columns"
                @confirm="onPapers"
                @cancel="showPapers = false"
            >
            </van-picker>
        </van-popup>
        <!-- 验证码弹窗 -->
        <van-popup v-model="isCode" class="addUserManagement-popup" @closed="resetInfo">
            <div class="addUserManagement-codePopup">
                <van-icon
                name="cross"
                class="addUserManagement-codePopup__icon"
                @click="isCode = false"
                />
                <div class="addUserManagement-codePopup__title">请输入图形验证码</div>
                <div class="addUserManagement-codePopup__err" v-if="isErr">
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
import { Form  } from 'vant';
import verificatonCode from "../login/components/verificatonCode.vue";
export default{
    components:{
        [Form.name]: Form,
        verificatonCode,
    },
    data(){
        return {
            showPapers:false,//证件类型选择器
            columns: ['身份证'],
            username: '',//姓名
            papers:'身份证',//证件类型
            idCard:'',//证件号
            phone:'',//手机号
            newCode:'',//验证码
            switchChecked:'0',
            isSuccess:false,//是否发送验证码
            num:60,//倒计时间
            codeTime:null,//定时器

            isCode:false,
            isCaptcha:'',
            code:'',
            isErr:false,
            pointError:'',//验证码错误提示
        }
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
    mounted(){
        this.$once('hook:beforeDestroy',this.onBeforeDestroy);
    },
    methods:{
        //获取输入框焦点
        inputPaentClick(refName) {
            this.$nextTick(() => {
                this.$refs[refName] && this.$refs[refName].focus();
            });
        },
        //绑定就诊人
       async onSubmit(){
            let info = this.$utils.getInfoByIdCard(this.idCard);
            try{
                await this.$apis.saveBindPatient({
                    patientName:this.username,
                    phone:this.phone,
                    idNo:this.idCard,
                    idTypeCode:'01',
                    sex:info.sex,
                    isDefault:this.switchChecked,
                    msgCode:this.newCode
                })
                this.$router.go(-1);
            }catch(e){
                this.$toast.fail(e);
            }
        },
        //销毁
        onBeforeDestroy(){
            if(this.codeTime){
                clearInterval(this.codeTime);
                this.codeTime = null;
            }
        },
        //身份证校验
        validatorIdCard(val){
            let info = this.$utils.getInfoByIdCard(val);
            if(!info){
                return false
            }
            return true;
        },
        //手机号校验
        validatorPhone(val){
            let info = this.$utils.checkPhone(val);
            if(!info){
                return false
            }
            return true;
        },
        // 确认证件选择器
        onPapers(val){
            this.papers = val;
            this.showPapers = false;
        },
        handleCanvas(){
            this.$refs.vantForm.validate(['phone']).then(async()=>{
                this.$nextTick(() => {
                    this.getCaptcha();
                    this.isCode = true;
                });
            })
        },
        //获取验证码
        async getCode(){
            try{
                await this.$apis.getSendVerifyCode(
                    {
                        phoneNo:this.phone,
                        purpose:99,
                        captchaCode:this.code
                    }
                );
                this.isSuccess = true;
                this.codeTime = setInterval(()=>{
                    this.num --;
                    if(this.num <= 0){
                        this.isSuccess = false;
                        clearInterval(this.codeTime);
                        this.codeTime = null;
                        this.num = 60;
                    }
                },1000)
                this.resetInfo();
            }catch(e){
                this.pointError = e;
                this.isErr = true;
            }
        },
        //获取图形验证码
        async getCaptcha(){
            let { retData } = await this.$apis.getCaptcha({
                phone:this.phone,
                length:4,
            })
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
    }
}
</script>
<style lang="scss">
.addUserManagement{
    .field{
        font-size: 16px;
        padding:15px;
        .van-cell__title{
            color: #333333;
        }
        .van-field__control::placeholder{
            font-weight: normal;
            color: #B2B2B2;
        }
        .van-field__control{
            color: #111;
        }
        .van-field__button>div{
            display: flex;
            align-items: center;
        }
        .code-btn{
            height: 26px;
            color: #00982D;
            border: 1px solid #32AE57;
        }
    }
    .switch{
        .van-field__label{
            display: flex;
            align-items: center;
        }
    }
    .van-cell:not(:last-child)::after{
        border-bottom: 0px solid #fff;
    }
}
</style>
<style lang="scss" scoped>
.addUserManagement{
    height: 100%;
    background: #F3F7F5;
    .switch{
        margin-top:12px;
    }
    &-btn{
        margin-top:70px;
        padding:0 14px 20px;
    }
    &-popup {
        border-radius: 8px;
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
        .img{
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