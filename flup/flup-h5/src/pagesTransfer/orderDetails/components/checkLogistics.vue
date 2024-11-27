<template>
  <van-popup v-model="showLogistics" @open="open" position="bottom" class="checkLogistics" @close="close">
    <div class="checkLogistics-info">
      <div class="checkLogistics-info__title">
        <span>详细信息</span>
        <div class="checkLogistics-info__imgWrap" @click="close">
          <img class="img" src="@/assets/images/icon/cross.png" alt="" />
        </div>
      </div>
      <div class="checkLogistics-info__operate">
        <!-- <img
          class="img"
          src="https://img0.baidu.com/it/u=3021883569,1259262591&fm=253&fmt=auto&app=120&f=JPEG?w=1140&h=641"
        /> -->
        <div class="text">
          <span class="text-left">{{ expressCompanyName }}</span
          ><span class="text-right">{{ logisticCode }}</span>
        </div>
        <div class="copy" @click="onCopy" v-if="logisticCode">复制</div>
      </div>
      <div class="checkLogistics-steps" v-if="traces.length > 0">
        <div class="checkLogistics-steps__item">
          <div class="step" v-for="(item,idx) in traces" :key="item.acceptTime">
            <div class="step-title" :class="{'step-titleActive':idx == 0 && (state == 3 || state == 4)}">
              <span class="step-title__text" v-if="idx == 0 && state == 3">已签收</span >
                <span class="step-title__text" v-if="idx == 0 && state == 4">问题件</span >
              <span class="step-title__time">{{ item.acceptTime }}</span>
            </div>
            <div class="step-info" :class="{'step-infoAcitve':idx == 0 && (state == 3 || state == 4)}">
              {{ item.acceptStation }}
            </div>
            <div class="step-circle" :class="{'step-circleActive':idx == 0 && (state == 3 || state == 4)}"></div>
            <div class="step-line" v-if="idx != traces.length - 1"></div>
          </div>
        </div>
      </div>
      <div v-else class="checkLogistics-empty"><span>暂无数据</span></div>
      <!-- 收货地址 -->
      <div class="checkLogistics-addresWrap">
        <div class="checkLogistics-addres">
          <div class="checkLogistics-addres__left">收</div>
          <div class="checkLogistics-addres__right">
            <span>{{ platPayExpressVo.contactsName }}</span>，<span>{{ platPayExpressVo.phone }}</span>，<span>{{ platPayExpressVo.district }}{{ platPayExpressVo.addresslocal }}</span>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>
<script>
export default {
  props:{
    show:{
        type:Boolean,
        default:false
    },
    platPayExpressVo:{
        type:Object,
        default:() => {}
    }
  },
  data() {
    return {
        logisticCode:'',//物流单号
        state:2,//2-在途中,3-签收,4-问题件
        expressCompanyName:'',
        traces:[]
    };
  },
  computed:{
    showLogistics:{
        get(){
            return this.show;
        },
        set(newValue){
            this.$emit('update:show', newValue)
        }
    }
  },
  methods:{
    //打开弹窗
    async open(){
       try{
        let params = {
            LogisticCode:this.platPayExpressVo.thirdPartyNo,
            ShipperCode:this.platPayExpressVo.expressCompanyCode,
        }
        let {retData} =  await this.$apis.selectLogisticsInfo(params);
        this.traces = retData.traces;
        this.logisticCode = retData.logisticCode;
        this.expressCompanyName = retData.expressCompanyName;
        this.state = retData.state;
       }catch(e){
        this.$toast(e)
       }
    },
    //复制消息
    onCopy() {
      const textArea = document.createElement("textarea");
      textArea.value = this.logisticCode;
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
    //关闭弹窗
    close(){
       this.showLogistics = false; 
    }
  }
};
</script>
<style lang="scss" scoped>
.checkLogistics {
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  height: 80%;
  &-info {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    &__title {
      font-size: 18px;
      font-weight: 600;
      line-height: 22px;
      letter-spacing: 0.2px;
      color: #111111;
      position: relative;
      height: 50px;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(0deg, #ffffff 5%, #e6ffee 100%);
    }
    &__imgWrap {
      position: absolute;
      top: 11px;
      right: 13px;
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
    &__operate {
      display: flex;
      align-items: center;
      padding: 0 14px 0 12px;
      .img {
        width: 26px;
        height: 26px;
        border-radius: 13px;
        margin-right: 12px;
      }
      .text {
        flex: 1;
        font-size: 14px;
        font-weight: 600;
        line-height: 22px;
        color: #111111;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        &-left {
          margin-right: 8px;
        }
      }
      .copy {
        width: 40px;
        height: 20px;
        border-radius: 4px;
        border: 0.5px solid #999999;
        font-size: 12px;
        font-weight: normal;
        color: #333333;
        display: flex;
        align-items: center;
        justify-content: center;
        &:active {
          opacity: 0.7;
        }
      }
    }
  }
  &-steps {
    // height: 455px;
    height: 100%;
    flex: 1;
    padding: 31px 0 0 49px;
    overflow-y: auto;
    &__item {
      .step {
        padding: 10px 14px 10px 0;
        position: relative;
        &-title {
          display: flex;
          align-items: center;
          color: #999999;
          &__text {
            font-size: 16px;
            font-weight: 600;
            line-height: 19px;
            margin-right: 8px;
          }
          &__time {
            font-size: 14px;
            font-weight: normal;
            line-height: 19px;
          }
        }
        &-titleActive {
          color: #00982d;
        }
        &-info {
          margin-top: 4px;
          font-size: 14px;
          font-weight: normal;
          line-height: 19px;
          color: #999999;
        }
        &-infoAcitve {
          color: #111111;
        }
        &-circle {
          position: absolute;
          top: 19px;
          left: -21px;
          z-index: 1;
          font-size: 12px;
          line-height: 1;
          -webkit-transform: translate(-50%, -50%);
          transform: translate(-50%, -50%);
          background: #c6c9ce;
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }
        &-circleActive {
          background: #00982d;
          width: 11px;
          height: 11px;
        }
        &-line {
          position: absolute;
          background: #c6c9ce;
          top: 16px;
          left: -21px;
          width: 1px;
          height: 100%;
        }
      }
    }
  }
  &-empty{
    // height: 455px;
    height: 100%;
    flex: 1;
    padding: 31px 0 0;
    display: flex;
    justify-content: center;
  }
  &-addresWrap {
    height: 132px;
    padding: 17px 22px 0 12px;
    position: relative;
    &::before {
      content: "";
      position: absolute;
      left: 14px;
      right: 14px;
      top: 0px;
      height: 1px;
      background: #e7e7e7;
    }
  }
  &-addres {
    display: flex;
    align-items: center;
    &__left {
      width: 26px;
      height: 26px;
      border-radius: 13px;
      background: #eaf4ed;
      font-size: 14px;
      font-weight: 600;
      color: #00982d;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 11px;
    }
    &__right {
      flex: 1;
      font-size: 15px;
      font-weight: normal;
      line-height: 18px;
      color: #111111;
      text-overflow: ellopsis;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      overflow: hidden;
      word-break: break-all;
    }
  }
}
</style>