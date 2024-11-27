<template>
  <div class="firmOrder">
    <div class="firmOrder-container">
      <div class="firmOrder-container__title">确认订单</div>
      <div class="address" v-if="isAddress" @click="jumpAddres">
        <div class="address-text">
          {{ addressInfo.district }}{{ addressInfo.addresslocal }}
        </div>
        <div class="address-info">
          <span>{{ addressInfo.contactsName }}</span><span class="mt">{{ addressInfo.phone }}</span>
        </div>
      </div>
      <div class="addAddress" v-else @click="jumpAddres">
        <img class="addAddress-img" src="@/assets/images/add2.png" alt="">
        <span class="addAddress-text">点击添加收货地址</span>
      </div>
      <div class="firmOrder-item">
        <!-- <div class="title">
          <div class="title-left">
            <img
              class="title-left__img"
              src="@/assets/images/icon/hospital.png"
              alt=""
            />
            <span class="title-left__text">橄榄云平台</span>
          </div>
        </div> -->
        <div class="info">
          <img class="info-img" :src="info.introduceUrl" alt="" />
          <div class="info-right">
            <div class="designation">
              <div class="designation-text">{{ info.packageName }}</div>
              <div class="designation-money">￥ {{ info.price | unit}}</div>
            </div>
            <div class="suggest">
              <div class="suggest-left">
                <span>{{ info.packageDiscription }}</span>
              </div>
              <div class="suggest-right">x {{ info.specName }}</div>
            </div>
          </div>
        </div>
      </div>
      <ul class="firmOrder-container__operate">
        <li class="item">
            <span class="item-name">就诊人</span>
            <div class="item-text">{{ info.patientName }}</div>
        </li>
        <li class="item">
            <span class="item-name">配送服务</span>
            <div class="item-text">快递 免邮</div>
        </li>
        <li class="item">
            <span class="item-name">订单备注</span>
            <div class="item-btn" @click="openPopup">
              <span v-if="newRemarks" class="item-btn__text">{{ newRemarks }}</span>
              <span v-else>无备注</span>
              <img class="item-btn__img" src="@/assets/images/icon/arrow.png" alt="">
            </div>
        </li>
      </ul>
    </div>
    <div class="firmOrder-floor">
      <div class="firmOrder-floor__info">
        <div class="text">
          <span class="text-title">合计：</span><span class="text-dan">¥</span
          ><span class="text-money">{{ info.price | unit}}</span>
        </div>
        <div class="btn" @click="submitOrder">提交订单</div>
      </div>
    </div>
    <van-popup v-model="show" class="firmOrder-popup" position="bottom" @close="closePopup">
        <div class="firmOrder-popup__title">
            <span>订单备注</span>
            <div class="firmOrder-popup__imgWrap" @click="closePopup">
                <img class="img" src="@/assets/images/icon/cross.png" alt="">
            </div>
        </div>
        <div @click.stop.prevent="inputPaentClick('textarea')" class="firmOrder-popup__textareaWrap">
          <el-input
            class="firmOrder-popup__textarea"
            type="textarea"
            placeholder="请输入内容"
            v-model.trim="remarks"
            maxlength="200"
            show-word-limit
            resize="none"
            ref="textarea"
            >
          </el-input>
        </div>
        <div class="firmOrder-popup__btnWrap">
            <div class="btn" @click="confirmPopup">确认</div>
        </div>
    </van-popup>
  </div>
</template>
<script>
import { Input } from "element-ui";
export default {
  name:'firmOrder',
    components:{
        [Input.name]: Input,
    },
    filters:{
      unit(val) {
        if (!val) {
          return "0.00";
        }
        return (val / 100).toFixed(2);
      },
    },
  data() {
    return {
        show:false,
        remarks:'',//备注
        newRemarks:'',//确认备注
        info:{},
        addressInfo:{},//地址信息
        isStatus:true,
        addressId:'',
    };
  },
  mounted(){
    let info = this.$route.query.data;
    if(info){
      this.info = JSON.parse(info);
    }
    sessionStorage.removeItem('addressId');
  },
  activated(){
    this.getList();
    let addressId = sessionStorage.getItem('addressId');
    if(addressId){
      this.addressId = addressId;
      sessionStorage.removeItem('addressId');
    }
  },
  computed:{
    //判断是否有地址
    isAddress(){
      let list = Object.keys(this.addressInfo);
      if(list.length > 0){
        return true
      }
      return false
    }
  },
  methods:{
    //去添加地址
    jumpAddres(){
      this.$router.push({
        path:'/address',
        query:{
          isSelect:true
        }
      })
    },
    //提交订单
    async submitOrder(){
      if(!this.isAddress){
        this.$toast('请选择地址');
        return false
      }
      if(!this.isStatus){
        return false;
      }
      try{
        this.isStatus = false;
        let { retData } = await this.$apis.createOrders({
          needInvoice: 0,
          patientId: this.info.patientId,
          payType: 0,
          specId: this.info.specId,
          sourceType: 0,
          remark:this.newRemarks,
          addressId:this.addressInfo.addressId
        });
        this.isStatus = true;
        if (retData) {
          window.location.href = retData.payUrl;
        }
      }catch(e){
        this.isStatus = true;
        console.log(e)
      }
    },
    //获取地址列表
    async getList() {
      try {
        let { retData } = await this.$apis.selectReceiptList();
        if(this.addressId){
          let addressInfo = retData.find(item => item.addressId == this.addressId);
          if(addressInfo){
            this.addressInfo = addressInfo;
          }else{
            this.addressInfo = {};
          }
        }else{
          let addressInfo = retData.find(item => item.isDefault == 1);
          if(addressInfo){
            this.addressInfo = addressInfo;
          }else if(retData && retData.length){
            this.addressInfo = retData[0];
          }
        }
      } catch (e) {
        this.$toast.fail(e);
      }
    },
    //获取输入框焦点
    inputPaentClick(refName) {
      this.$nextTick(() => {
        this.$refs[refName] && this.$refs[refName].focus();
      });
    },
    //打开弹窗
    openPopup(){
        this.remarks = this.newRemarks;
        this.show = true;
    },
    //关闭弹窗
    closePopup(){
        this.show = false;
    },
    //确认弹窗
    confirmPopup(){
        this.newRemarks = this.remarks;
        this.closePopup();
    }
  }
};
</script>
<style lang="scss">
.firmOrder{
    .van-popup{
        border-top-left-radius: 20px;
        border-top-right-radius: 20px;
        background: linear-gradient(0deg, #F9F9F9 64%, #E6FFEE 100%);
        box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.02);
        padding:0 14px;
    }
    &-popup{
      display: flex;
      flex-direction: column;
        &__title{
            font-size: 20px;
            font-weight: 600;
            line-height: 22px;
            letter-spacing: 0.2px;
            color: #111111;
            margin-top:17px;
            text-align: center;
            position: relative;
        }
        &__imgWrap{
            position: absolute;
            top:0;
            right: 0;
            width: 22px;
            height: 22px;
            display: flex;
            align-items: center;
            justify-content: center;
            .img{
                width: 12px;
                height: 12px;
            }
        }
        &__textareaWrap{
          margin-top:17px;
            flex: 1;
            margin-bottom: 75px;
        }
        &__textarea{
            height: 100%;
            .el-textarea__inner{
                // height: 100%;
                height: 300px;
                border: 0px solid #fff;
                padding:14px;
                font-size: 15px;
                font-weight: normal;
                line-height: 22px;
                letter-spacing: 0.2px;
                color: #333;
            }
            .el-textarea__inner::placeholder{
                color: #999999;
            }
            .el-input__count{
                font-size: 14px;
                font-weight: 500;
                line-height: 22px;
                letter-spacing: 0.2px;
                color: #999999;
                right: 14px;
                bottom: 14px;
            }
        }
    }
}
</style>
<style lang="scss" scoped>
.firmOrder {
  &-container {
    height: calc(100vh - 60px);
    background-color: #f3f7f5;
    overflow-y: auto;
    background-image: url("../../assets/images/orderDetails/bgGreen.png");
    background-size: 100%;
    background-repeat: no-repeat;
    padding: 0px 12px;
    &__title {
      font-size: 20px;
      font-weight: 600;
      line-height: 24px;
      letter-spacing: 0.24px;
      color: #ffffff;
      margin-top: 16px;
    }
    .address {
      padding: 16px 20px;
      background-color: #fff;
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
      border-radius: 8px;
      margin-top: 12px;
      &-text {
        font-size: 15px;
        font-weight: 600;
        line-height: 22px;
        letter-spacing: 0.2px;
        color: #111111;
      }
      &-info {
        display: flex;
        align-items: center;
        font-size: 14px;
        font-weight: normal;
        line-height: 16px;
        letter-spacing: 0.2px;
        color: #666666;
        margin-top: 8px;
        .mt {
          margin-left: 10px;
        }
      }
    }
    &__operate{
        padding: 20px 12px;
        border-radius: 8px;
        background-color: #fff;
        margin-top:12px;
        .item{
            display: flex;
            align-items: center;
            &-name{
                font-size: 14px;
                font-weight: normal;
                line-height: 19px;
                color: #666666;
            }
            &-text{
                flex: 1;
                font-size: 14px;
                font-weight: normal;
                line-height: 19px;
                text-align: right;
                color: #111111;
            }
            &-btn{
                flex: 1;
                display: flex;
                align-items: center;
                justify-content: flex-end;
                font-size: 14px;
                font-weight: normal;
                line-height: 19px;
                letter-spacing: 0.2px;
                color: #999999;
                overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                &__img{
                    width: 13px;
                    height: 13px;
                    margin-left:6px;
                    margin-top:2px;
                }
                &__text{
                  flex: 1;
                  color: #111111;
                  margin-left:10px;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                  text-align: end;
                }
            }
        }
        .item + .item{
            margin-top:10px;
        }
    }
    .addAddress{
      margin-top:12px;
      width: 100%;
      height: 100px;
      border-radius: 8px;
      background: #FFFFFF;
      box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
      display: flex;
      align-items: center;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      &:active{
        opacity: .9;
      }
      &-img{
        width: 40px;
        height: 40px;
        margin-left:20px;
      }
      &-text{
        font-size: 15px;
        font-weight: 600;
        line-height: 22px;
        color: #111111;
        margin-left:20px;
      }
    }
  }
  &-floor {
    height: 60px;
    background-color: #fff;
    padding: 7px 20px 0;
    &__info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .btn {
        width: 100px;
        height: 34px;
        text-align: center;
        line-height: 34px;
        box-sizing: border-box;
        border: 1px solid #cdcdcd;
        border-radius: 17px;
        font-size: 15px;
        font-weight: 500;
        color: #666666;
        &:active{
            opacity: .7;
        }
      }
      .text {
        &-title {
          font-size: 14px;
          font-weight: normal;
          line-height: 19px;
          color: #111111;
        }
        &-dan {
          font-size: 14px;
          font-weight: 600;
          line-height: 22px;
          color: #ff5500;
          margin-right: 2px;
        }
        &-money {
          font-size: 18px;
          font-weight: 600;
          line-height: 22px;
          letter-spacing: 0.2px;
          color: #ff5500;
        }
      }
    }
  }
  &-item {
    padding: 7px 12px 14px;
    border-radius: 8px;
    background: #ffffff;
    box-shadow: 0px 1px 6px 0px rgba(0, 0, 0, 0.04);
    margin-top: 12px;
    .title {
      display: flex;
      &-left {
        flex: 1;
        display: flex;
        align-items: center;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &__img {
          width: 14px;
          height: 14px;
        }
        &__text {
          flex: 1;
          margin: 0 6px;
          font-size: 12px;
          font-weight: normal;
          line-height: 22px;
          color: #111111;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .info {
      margin-top: 12px;
      display: flex;
      &-img {
        width: 80px;
        height: 80px;
        object-fit: cover;
        border-radius: 4px;
        margin-right: 10px;
      }
      &-right {
        // flex:1;
        width: 237px;
        .designation {
          margin-top: 4px;
          display: flex;
          align-items: center;
          font-weight: 600;
          line-height: 22px;
          color: #111111;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          &-text {
            flex: 1;
            font-size: 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            margin-right: 6px;
          }
          &-money {
            flex-shrink: 0;
            font-size: 14px;
          }
        }
        .suggest {
          width: 100%;
          color: #666666;
          display: flex;
          margin-top: 9px;
          &-left {
            flex: 1;
            font-size: 15px;
            margin-right: 6px;
            span {
              font-size: 12px;
              line-height: 16px;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-all;
            }
          }
          &-right {
            max-width: 100px;
            flex-shrink: 0;
            font-size: 12px;
            font-weight: normal;
            line-height: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            word-break: break-all;
          }
        }
      }
    }
  }
  &-popup{
    &__btnWrap{
        position: absolute;
        left: 0;
        bottom: 0;
        z-index: 10;
        width: 100%;
        height: 65px;
        padding: 8px 14px 0;
        background-color: #fff;
        .btn{
            width: 347px;
            height: 34px;
            border-radius: 100px;
            background: linear-gradient(104deg, #FF9035 31%, #FF7B35 70%);
            font-size: 15px;
            font-weight: 600;
            line-height: 34px;
            text-align: center;
            letter-spacing: 0.2px;
            color: #FFFFFF;
            &:active{
                opacity: .7;
            }
        }
    }
  }
}
</style>