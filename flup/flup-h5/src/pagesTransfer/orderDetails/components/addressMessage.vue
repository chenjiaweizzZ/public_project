<template>
  <div class="addressMessage">
    <div class="addressMessage-title">
      <div class="addressMessage-title__left">请将该订单退回如下地址：</div>
      <div class="addressMessage-title__right" @click="onCopy" v-if="content">复制地址</div>
    </div>
    <div class="addressMessage-address">
      {{ content }}
    </div>
    <div class="addressMessage-line"></div>
    <div class="addressMessage-info">
      <div class="addressMessage-info__left">物流信息</div>
      <div class="addressMessage-info__notFill" v-if="!platOrderRefundVo.expressCompanyCode"><div class="btn" @click="openLogistics">填写信息</div></div>
      <div class="addressMessage-info__fill" v-else>
        <div class="mail">
          <span class="mail-text">{{ platOrderRefundVo.expressCompanyName }}</span><span>{{ platOrderRefundVo.expressNo }}</span>
        </div>
        <div class="btn" @click="openLogistics">修改信息</div>
      </div>
    </div>
    <!-- 填写物流信息 -->
    <van-popup
      class="addressMessage-logistics"
      v-model="isLogistics"
      position="bottom"
      @close="closePopup"
    >
      <div class="addressMessage-logistics__title">
        <span>填写物流信息</span>
        <div class="addressMessage-logistics__imgWrap" @click="closePopup">
          <img class="img" src="@/assets/images/icon/cross.png" alt="" />
        </div>
      </div>
      <div class="addressMessage-logistics__info">
        <ul class="info">
            <li class="info-item">
                <span class="info-item__left">物流公司</span>
                <div class="info-item__right" @click="openCompany">
                    <span class="active" v-if="dict_name">{{ dict_name }}</span>
                    <span v-else>请选择</span>
                    <img class="img" src="@/assets/images/icon/arrow.png" alt="">
                </div>
            </li>
            <li @click.stop.prevent="inputPaentClick('input')">
                <van-field class="info-input" ref="input" v-model.trim="courieNumber" placeholder="请输入退款快递单号" />
            </li>
        </ul>
      </div>
      <div class="addressMessage-logistics__btn">
        <div class="btn" @click="updateRefundInfo">确认</div>
      </div>
    </van-popup>
    <!-- 选择物流公司 -->
    <van-popup class="addressMessage-company" v-model="isCompany" position="bottom" @close="closeLogistics">
        <div class="addressMessage-company__title">
            <span>选择快递公司</span>
            <div class="addressMessage-company__imgWrap" @click="closeLogistics">
            <img class="img" src="@/assets/images/icon/cross.png" alt="" />
            </div>
        </div>
        <div class="addressMessage-company__info">
            <ul class="info">
                <li class="info-item" :class="{'active':item.dict_code == serial_no}" v-for="item in companyList" :key="item.serial_no" @click="tabLogistics(item)">{{ item.dict_name }}</li>
            </ul>
        </div>
    </van-popup>
  </div>
</template>
<script>
export default {
  props:{
    platPayExpressVo:{
      type:Object,
      default:()=>{}
    },
    platOrderRefundVo:{
      type:Object,
      default:()=>{}
    },
    serialNo:{
      type:String,
      default:''
    },
  },
  data() {
    return {
      isLogistics: false, //物流弹窗
      isCompany:false,//物流公司弹窗
      courieNumber:'',//快递单号
      companyList:[],//物流列表
      serial_no:"",//选中的物流公司
      dict_name:'',
    };
  },
  computed:{
    content(){
      if(this.platOrderRefundVo.returnAddress){
        return this.platOrderRefundVo.returnAddress;
      }
      return '';
    }
  },
  mounted(){
    this.getCompany();
  },
  methods: {
    //获取物流公司
    async getCompany(){
      let { retData } = await this.$apis.getFastMail();
      this.companyList = retData;
    },
    //获取输入框焦点
    inputPaentClick(refName) {
      this.$nextTick(() => {
        this.$refs[refName] && this.$refs[refName].focus();
      });
    },
    //复制消息
    onCopy() {
      const textArea = document.createElement("textarea");
      textArea.value = this.content;
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      return new Promise((resolve, reject) => {
        document.execCommand("copy") ? resolve() : reject(new Error("出错了"));
        textArea.remove();
      }).then(
        () => {
          this.$toast.success("复制成功");
        },
        () => {
          this.$toast.fail("出错了");
        }
      );
    },
    //打开物流弹窗
    openLogistics(){
        this.isLogistics = true;
        this.serial_no = this.platOrderRefundVo.expressCompanyCode;
        this.dict_name = this.platOrderRefundVo.expressCompanyName;
        this.courieNumber = this.platOrderRefundVo.expressNo;
    },
    //关闭物流弹窗
    closePopup() {
      this.isLogistics = false;
      this.courieNumber = '';
      this.serial_no = '';
      this.dict_name = '';
    },
    //更新物流信息
    async updateRefundInfo(){
      if(!this.serial_no){
        this.$toast('请选择物流公司');
        return false;
      }
      if(!this.courieNumber){
        this.$toast('请输入快递单号');
        return false;
      }
      try{
        await this.$apis.updateRefundInfo({
          expressCompanyCode:this.serial_no,
          expressCompanyName:this.dict_name,
          expressNo:this.courieNumber,
          refundId:this.platOrderRefundVo.refundId,
          refundReason:this.platOrderRefundVo.refundReason
        });
        this.closePopup();
        this.$emit('updateList')
      }catch(e){
        console.log(e);
      }
    },
    //打开物流公司弹窗
    openCompany(){
        this.isCompany = true;
    },
    //关闭物流公司弹窗
    closeLogistics(){
        this.isCompany = false;
    },
    //选择物流公司
    tabLogistics(item){
      this.serial_no = item.dict_code;
      this.dict_name = item.dict_name;
      this.closeLogistics();
    }
  },
};
</script>
<style lang="scss">
.addressMessage{
    &-logistics{
        &__info{
            .info{
                &-input{
                    .van-field__body{
                        height: 100%;
                        padding:0 12px;
                        .van-field__control{
                            font-size: 16px;
                            font-weight: normal;
                            line-height: 19px;
                            color: #333;
                            &::placeholder{
                                color: #999;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
<style lang="scss" scoped>
.addressMessage {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
  margin-top: 12px;
  padding: 14px 12px 19px;
  &-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    &__left {
      font-size: 15px;
      font-weight: normal;
      line-height: 22px;
      color: #111111;
    }
    &__right {
      width: 60px;
      height: 20px;
      border-radius: 4px;
      border: 0.5px solid #999999;
      font-size: 12px;
      font-weight: normal;
      line-height: 20px;
      text-align: center;
      color: #333333;
      &:active {
        opacity: 0.7;
      }
    }
  }
  &-address {
    font-size: 15px;
    font-weight: 600;
    line-height: 22px;
    color: #568163;
    padding: 10px 0 14px;
  }
  &-line {
    width: 100%;
    height: 1px;
    background-image: url("../../../assets/images/line2.png");
  }
  &-info {
    margin-top: 16px;
    display: flex;
    align-items: center;
    &__left {
      font-size: 14px;
      font-weight: normal;
      line-height: 19px;
      color: #333333;
      margin-right: 13px;
    }
    &__notFill {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }
    &__fill {
      flex: 1;
      display: flex;
      align-items: center;
      font-size: 14px;
      font-weight: normal;
      line-height: 19px;
      color: #111111;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      .mail {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &-text {
          margin-right: 6px;
        }
      }
    }
    .btn {
      width: 60px;
      height: 20px;
      border-radius: 4px;
      border: 0.5px solid #999999;
      font-size: 12px;
      font-weight: normal;
      line-height: 20px;
      text-align: center;
      color: #333333;
      margin-left: 10px;
      &:active {
        opacity: 0.7;
      }
    }
  }
  &-logistics {
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    background: linear-gradient(0deg, #f9f9f9 64%, #e6ffee 100%);
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.02);
    display: flex;
    flex-direction: column;
    &__title {
      font-size: 20px;
      font-weight: 600;
      line-height: 22px;
      letter-spacing: 0.2px;
      color: #111111;
      margin-top: 13px;
      text-align: center;
      position: relative;
    }
    &__imgWrap {
      position: absolute;
      top: 0;
      right: 8px;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      .img {
        width: 12px;
        height: 12px;
      }
    }
    &__info{
        flex: 1;
        width: 100%;
        padding:15px 14px 11px;
        .info{
            width: 100%;
            height: 100%;
            background-color: #fff;
            border-radius: 8px;
            padding:32px 12px 28px;
            &-item{
                display: flex;
                align-items: center;
                &__left{
                    font-size: 16px;
                    font-weight: normal;
                    line-height: 19px;
                    color: #333333;
                }
                &__right{
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    color: #999;
                    font-size: 16px;
                    font-weight: normal;
                    line-height: 19px;
                    .active{
                        color: #333;
                    }
                    .img{
                        width: 13px;
                        height: 13px;
                        margin-left:6px;
                    }
                }
            }
            &-input{
                height: 38px;
                margin-top:25px;
                border: 1px solid #D4D4D4;
                padding:0px;
            }
        }
    }
    &__btn{
        height: 65px;
        background: #FFFFFF;
        padding:8px 14px 0;
        .btn{
            height: 34px;
            border-radius: 17px;
            background: linear-gradient(104deg, #FF9035 31%, #FF7B35 70%);
            text-align: center;
            line-height: 34px;
            font-size: 15px;
            font-weight: 600;
            color: #FFFFFF;
            &:active{
                opacity: .7;
            }
        }
    }
  }
  &-company{
    background: linear-gradient(0deg, #F9F9F9 64%, #E6FFEE 100%);
    box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.02);
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
    &__title {
      font-size: 20px;
      font-weight: 600;
      line-height: 22px;
      letter-spacing: 0.2px;
      color: #111111;
      margin-top: 13px;
      text-align: center;
      position: relative;
    }
    &__imgWrap {
      position: absolute;
      top: 0;
      right: 8px;
      width: 22px;
      height: 22px;
      display: flex;
      align-items: center;
      justify-content: center;
      .img {
        width: 12px;
        height: 12px;
      }
    }
    &__info{
        padding:15px 14px 0;
        .info{
            height: 350px;
            background: #FFFFFF;
            overflow-y: auto;
            padding:0 6px;
            &-item{
                font-size: 16px;
                font-weight: normal;
                line-height: 19px;
                color: #111111;
                padding:12px 20px;
                &:active{
                  background: #F3F7F4;
                }
                &:last-child{
                  margin-bottom: 10px;
                }
            }
            .active{
              background: #F3F7F4;
            }
        }
    }
  }
}
</style>