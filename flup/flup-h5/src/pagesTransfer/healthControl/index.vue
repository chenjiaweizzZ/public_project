<template>
  <div class="healthControl">
    <div class="healthControl-Rich" :style="healthControlStyle">
      <img class="healthControl-Rich__img" @click="previewIMage(introduceUrl)" :src="introduceUrl" alt="" />
    </div>
    <div class="healthControl-floor" v-if="!isShow">
      <div class="healthControl-floor__protocol">
        <van-checkbox v-model="checked" shape="square" icon-size="1.25em" checked-color="#32AE57">我阅读同意<span
            @click.stop="show = true" class="floor-protocol__text">《全病程管理服务病友告知书》</span></van-checkbox>
        <!-- <el-checkbox v-model="checked">我阅读同意<span
            @click.stop="show = true"
            class="floor-protocol__text"
            border="false"
            >《全病程管理服务病友告知书》</span
          ></el-checkbox> -->
      </div>
      <div class="floor-operate">
        <div class="floor-operate__service" @click="seek">
          <img class="img" src="@/assets/images/service.png" alt="" />
          <span>人工咨询</span>
        </div>
        <div class="floor-operate__btns">
          <div class="floor-operate__btn btn-left" @click.stop="signContract(2)">
            <span>加入预选</span>
          </div>
          <div class="floor-operate__btn btn-right" @click.stop="signContract(1)">
            <span>签</span><span>约</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 协议弹窗 -->
    <van-popup v-model="show" closeable round position="bottom" :style="{ height: '80%' }">
      <div class="healthControl-popup">
        <div class="healthControl-popup__title">全病程管理服务病友告知书</div>
        <div class="healthControl-popup__info" v-html="info"></div>
      </div>
    </van-popup>
    <!-- 签约弹窗 -->
    <van-popup v-model="signShow" closeable round position="bottom" class="van-sign">
      <div class="healthControl-sign">
        <div class="healthControl-sign__top">
          <img class="img" :src="displayPicUrl" alt="" @click="previewIMage(displayPicUrl)" />
          <div class="info">
            <div class="info-money">
              <span class="info-money__sign">¥</span><span>{{ price | unit }}</span>
            </div>
            <div class="info-text">{{ packageName }}</div>
          </div>
        </div>
        <div class="healthControl-scroll">
          <!-- 规格 -->
          <div class="healthControl-sign__norms">
            <p class="norms-title">选择规格</p>
            <div class="norms-list">
              <div class="item" :class="{ active: currentSpecifications == item.specId }"
                v-for="item in platPackageSpecInfoDtoList" :key="item.specId" @click="changeSpecifications(item)">
                {{ item.specName }}
              </div>
            </div>
          </div>
          <!-- 富文本 -->
          <div class="healthControl-sign__rich" v-html="normsRich" @touchmove.stop="() => { }"
            @click="imageChgange($event)" v-if="normsRich"></div>
          <!-- 就诊人 -->
          <div class="healthControl-sign__visit">
            <div class="visit-info">
              <span class="visit-info__left">就诊人</span>
              <div class="visit-info__right">
                <span class="text">{{ currentPatient.patientName }}</span>
                <span>{{ currentPatient.idNo | hiddenCardId(4) }}</span>
              </div>
            </div>
            <div class="visit-person">
              <div class="visit-person__list">
                <div class="item" v-for="item in patientList" :key="item.userId" :class="{
      active: item.userId == currentPatient.userId,
      tacitly: item.isDefault == 1,
    }" @click="switchPatient(item)">
                  {{ item.patientName | alterName }}
                </div>
              </div>
              <div class="visit-person__add" @click="addPatient">
                <img src="@/assets/images/add.png" alt="" />
              </div>
            </div>
          </div>
        </div>
        <div class="healthControl-sign__btnWrap" @click="goPaymentCompleted">
          <div class="btn">{{ operation == 2 ? "加入预选方案" : "去支付" }}</div>
        </div>
      </div>
    </van-popup>
  </div>
</template>
<script>
import { ImagePreview } from "vant";
import wx from "weixin-js-sdk";
import "element-ui/lib/theme-chalk/index.css";
import {
  Checkbox,
} from "element-ui";
export default {
  name: "healthControl",
  components: {
    [Checkbox.name]: Checkbox,
  },
  filters: {
    unit(val) {
      if (!val) {
        return "0.00";
      }
      return val / 100;
    },
    alterName(val) {
      if (val.length > 2) {
        return val.slice(-2);
      }
      return val;
    },
    hiddenCardId(str, frontLen = 3, endLen = 4) {
      if (!str) {
        return str;
      }
      let len = str.length - frontLen - endLen;
      let start = "";
      for (let i = 0; i < len; i++) {
        start += "*";
      }
      return (
        str.substring(0, frontLen) + start + str.substring(str.length - endLen)
      );
    },
  },
  data() {
    return {
      isShow: false,
      packageId: "", //服务包id
      introduceUrl: "", //服务包详细预览图
      packageName: "", //服务包名称
      displayPicUrl: "", //服务包预览图片
      price: "", //单价
      platPackageSpecInfoDtoList: "", //规格
      currentSpecifications: "", //选中的规格
      needExpress: 0, //是否需要发货0 不需要 1需要
      normsRich: "", //富文本
      patientList: [], //就诊人列表
      currentPatient: {}, //选中就诊人
      checked: false,
      show: false, //协议弹窗
      signShow: false, //签约弹窗
      openId: "",
      isStatus: true,
      operation: "",
      packageDiscription: "", //服务包介绍

      info: `尊敬的病友：
    为了保障您得到连续有效的全病程院后健康管理服务，请仔细阅读知晓以下内容，希望理解并配合。
一、全病程院后健康管理服务介绍
    全病程院后健康管理服务是由湘雅医院医护团队和医院合作的第三方公司协同给您提供“院内+院外”、“线上+线下”一体化全病程精细化连续性健康管理服务。
二、注意事项
    院后健康管理主要以日常咨询、复诊提醒、慢病管理、健康管理为主;医护团队基于患者自述病情所提供的建议仅供参考。因疾病的特殊性、病情变化快等因素，尤其是危急重症、婴幼儿、孕产妇等，如有病情变化，建议尽快于就近医疗机构就诊。
    院后健康管理服务实行病友自愿原则，由病友直接与医院合作的第三方公司办理相关手续。如选择院后健康管理将涉及到服务费用，请详细阅读并自愿选择。在自愿接受院后健康管理的过程中如有疑问，由医院合作的第三方公司负责主要的协调及解决工作，中南大学湘雅医院只承担湘雅医院医护团队服务职责范国内的相关责任。为了实现连续性的院后期护，病友的部分资料（如相关检查数据等） 将转介至相应的照护机构。
三、数据授权
    本项目服务管理过程中，需要调取患者在我院及离院后的产生的院内外数据，以便根据病情数据提供精准的个性化的管理服务。如患者参加此服务项目，视为同意授权全病程院后健康管理服务调用其相关院内外数据。
    <span style="color:red;">如果您选择购买此项服务，代表您已知晓并同意以上告知内容。</span>
    谢谢您的信任、理解、支持与配合，祝您生活愉快！`,
    };
  },
  computed: {
    healthControlStyle() {
      return !this.isShow ? "height: calc(100vh - 95px)" : "height: 100%";
    },
  },
  mounted() {
    document.title = this.$route.query.packageName || "";
    this.packageId = this.$route.query.packageId;
    this.isShow = this.$route.query.isShow ? this.$route.query.isShow : false;
    this.getPackageInfo();
    this.openId =
      this.$route.query.openId ||
      this.openId ||
      localStorage.getItem("openId") ||
      (localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")).openId
        : "");
    if (this.openId) {
      setTimeout(() => {
        this.getInfo(this.openId);
      }, 50);
    }
  },
  activated() {
    if (this.openId) {
      this.getPatientList();
    }
  },
  methods: {
    async init(packageName, introduceUrl) {
      let res = await this.$apis.getWxConfigParam({
        url: window.location.href.split("#")[0],
      });
      let info = res.retData;
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: info.appId, // 必填，公众号的唯一标识
        timestamp: info.timestamp, // 必填，生成签名的时间戳
        nonceStr: info.nonceStr, // 必填，生成签名的随机串
        signature: info.signature, // 必填，签名
        jsApiList: [
          "updateAppMessageShareData",
          "updateTimelineShareData",
          "onMenuShareTimeline",
          "onMenuShareAppMessage",
        ], // 必填，需要使用的JS接口列表
      });
      wx.ready(function () {
        //分享到朋友圈”及“分享到QQ空间”
        wx.updateTimelineShareData({
          title: packageName, // 分享标题
          link: window.location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
          imgUrl: introduceUrl, // 分享图标
          success: function (res) {
            // 设置成功
            console.log("分享成功返回的信息为:", res);
          },
        });
        //“分享给朋友”及“分享到QQ”
        wx.updateAppMessageShareData({
          title: packageName, // 分享标题
          desc: "专家团队,助您恢复健康!\n科学管理,省时省心省力!", // 分享描述
          link: window.location.href, // 分享链接
          imgUrl: introduceUrl, // 分享图标
          success: function (res) {
            console.log("分享成功返回的信息为:", res);
          },
        });
      });
      wx.error(function (res) {
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
        console.log("验证失败返回的信息:", res);
      });
    },
    //获取服务包详情
    async getPackageInfo() {
      let { retData } = await this.$apis.getPackageInfo({
        packageId: this.packageId,
        flag: false,
      });
      if(retData.packageType == 1) {
        if(retData.platPackageSpecInfoDtoList.length > 0) {
          if (retData.platPackageSpecInfoDtoList[0].specId) {
                let { price, specId } = retData.platPackageSpecInfoDtoList[0];
                let unitPrice = price / 100;
                this.$router.push({
                  path: "/imageTextForm",
                  query: {
                    specId,
                    price: unitPrice,
                  },
                });
              } else {
                this.$toast("医生未开通图文咨询服务");
                this.$router.push({
                  path: "/home"
                })
              }
        }else {
          this.$toast("医生未开通图文咨询服务");
            this.$router.push({
            path: "/home"
          })
        }
      }
      this.introduceUrl = retData.introduceUrl;
      this.packageDiscription = retData.packageDiscription;
      this.platPackageSpecInfoDtoList =
        retData.platPackageSpecInfoDtoList.filter(
          (item) => item.showOnCloud == 1
        );
      this.packageName = retData.packageName;
      if (
        this.platPackageSpecInfoDtoList &&
        this.platPackageSpecInfoDtoList.length > 0
      ) {
        this.currentSpecifications = this.platPackageSpecInfoDtoList[0].specId;
        this.normsRich =
          this.platPackageSpecInfoDtoList[0].specPackageDiscription;
        this.price = this.platPackageSpecInfoDtoList[0].price;
        this.displayPicUrl = this.platPackageSpecInfoDtoList[0].displayPicUrl;
        this.needExpress = this.platPackageSpecInfoDtoList[0].needExpress;
      }
      this.init(retData.packageName, retData.previewUrl);
    },
    //获取就诊人列表
    async getPatientList() {
      let { retData } = await this.$apis.getPatientList({
        pageNo: 1,
        pageSize: 9999,
      });
      this.patientList = retData.list;
      if (this.patientList && this.patientList.length > 0) {
        if (retData.list.some((item) => item.isDefault == 1)) {
          let obj = retData.list.find((item) => item.isDefault == 1) || {};
          this.patientList = this.patientList.filter(
            (item) => item.isDefault != 1
          );
          this.patientList.unshift(obj);
          if (!this.currentPatient.userId) {
            this.currentPatient = obj;
          }
        } else {
          if (!this.currentPatient.userId) {
            this.currentPatient = retData.list[0];
          }
        }
      }
    },
    //选择规格
    changeSpecifications(val) {
      this.currentSpecifications = val.specId;
      this.normsRich = val.specPackageDiscription;
      this.price = val.price;
      this.displayPicUrl = val.displayPicUrl;
      this.needExpress = val.needExpress;
    },
    //切换默认人
    async switchPatient(val) {
      this.currentPatient = this.patientList.find(
        (item) => item.userId == val.userId
      );
    },
    //图片预览
    imageChgange(e) {
      if (e.target.nodeName == "IMG") {
        ImagePreview({
          images: [e.target.currentSrc], //e.target.currentSrc  当前图片src
          showIndex: false,
          loop: false,
        });
      } else {
        return;
      }
    },
    previewIMage(val) {
      if (!val) {
        return false;
      }
      ImagePreview({
        images: [val], //e.target.currentSrc  当前图片src
        showIndex: false,
        loop: false,
      });
    },
    //签约
    async signContract(operation = 1) {
      if (!this.checked) {
        this.$toast("请勾选协议");
        return false;
      }
      if (!this.openId) {
        let url = window.location.href;
        let name = window.location.href.split("/#/")[0] + "/#/transportV2?url=";
        let newUrl = name + url;
        let redirect_uri = encodeURIComponent(newUrl);
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${window.globalURL.APPID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${window.globalURL.hospitalId}&connect_redirect=1#wechat_redirect`;
      } else {
        await this.getInfo(this.openId);
        // this.getPatientList();
        this.operation = operation;
        this.signShow = true;
      }
    },
    addCart() {
      let params = {
        buyNumber: 1,
        specId: this.currentSpecifications
      }
      this.$apis.shoppingCartSave(params).then(res => {
        if(res && res.retCode == 0) {
          this.$toast("预选方案添加成功");
          this.signShow = false;
        }else {
          
        }
      }).catch(error => {
        this.$toast(error);
      })
    },
    //添加就诊人
    addPatient() {
      this.$router.push({
        path: "/userManagement",
      });
    },
    //支付完成
    async goPaymentCompleted() {
      if (!this.currentSpecifications) {
        this.$toast.fail("请选择规格!");
        return false;
      }
      if (!this.currentPatient.userId) {
        this.$toast.fail("请选择就诊人!");
        return false;
      }
      if (!this.isStatus) {
        return false;
      }
      try {
        if (this.operation == 2) {
          this.addCart()
        } else {
          if (this.needExpress == 1) {
            let obj = this.platPackageSpecInfoDtoList.find(
              (item) => item.specId == this.currentSpecifications
            );
            let data = {
              packageName: this.packageName,
              packageDiscription: this.packageDiscription,
              price: this.price,
              patientId: this.currentPatient.userId, //就诊人id
              patientName: this.currentPatient.patientName, //就诊人姓名
              specId: this.currentSpecifications, //规格id
              specName: obj.specName, //规格名称
              introduceUrl: this.introduceUrl, //预览图
            };
            this.$router.push({
              path: "/firmOrder",
              query: {
                data: JSON.stringify(data),
              },
            });
            return false;
          }
          this.isStatus = false;
          let { retData } = await this.$apis.createOrders({
            needInvoice: 0,
            patientId: this.currentPatient.userId,
            payType: 0,
            specId: this.currentSpecifications,
            sourceType: 0,
          });
          this.isStatus = true;
          if (retData) {
            window.location.href = retData.payUrl;
          }
        }
      } catch (e) {
        this.$toast(e);
      }
    },
    test() {
      console.log(this.checked)
    },
    //获取用户信息
    async getInfo(id) {
      try {
        let res = await this.$apis.getPatientInfo({ openId: id });
        if (res.retData && res.retData.openId) {
          localStorage.setItem("userInfo", JSON.stringify(res.retData));
          if (
            !res.retData.cpExternalUserId &&
            sessionStorage.getItem("userId")
          ) {
            this.bindCpUser(sessionStorage.getItem("userId"));
          }
        }
      } catch (e) {
        this.$router.push({
          path: "/login",
        });
      }
    },
    //绑定企业微信userId
    async bindCpUser(userId) {
      await this.$apis.bindCpUser({ userId });
      sessionStorage.removeItem("userId");
    },
    //咨询
    seek() {
      this.$router.push({
        name: 'consult'
      })
    }
    // async seek() {
    //   if (!this.openId) {
    //     this.$router.push({
    //       path: "/chat",
    //     });
    //     return false;
    //   }
    //   if (!localStorage.getItem("userInfo")) {
    //     let res = await this.$apis.getPatientInfo({ openId: this.openId });
    //     if (res.retData && res.retData.openId) {
    //       localStorage.setItem("userInfo", JSON.stringify(res.retData));
    //     }
    //   }
    //   try {
    //     let { retData } = await this.$apis.preSalesConsultation({
    //       packageId: this.packageId,
    //     });
    //     let result = await this.$apis.getIMData(retData.userId)
    //     let imUrl = JSON.parse(result.retData)
    //     // let imUrl = JSON.parse(retData.imUrl);
    //     if (imUrl) {
    //       let userSig = imUrl.userSig;
    //       let roomId = retData.roomId;
    //       let patientId = retData.userId;
    //       localStorage.setItem("userId", patientId);
    //       localStorage.setItem("userSig", userSig);
    //       let consultId = retData.id;
    //       this.$router.push({
    //         path: "/chat",
    //         query: {
    //           consultId,
    //           serviceStatus: 0,
    //           patientId,
    //           patientName: JSON.parse(localStorage.getItem("userInfo"))
    //             .patientName,
    //           roomId,
    //           preSales: 1, //1售前
    //         },
    //       });
    //     }
    //   } catch (e) {
    //     this.$toast.fail(e);
    //   }
    // },
  },
};
</script>
<style lang="scss">
.healthControl {
  &-floor {
    &__protocol {
      padding-left: 10px;
      padding-right: 10px;

      .van-checkbox__icon .van-icon {
        border-color: #32ae57;
        border-radius: 3px;
      }

      .van-checkbox__label {
        font-size: 13px;
        font-weight: normal;
        line-height: 18px;
        color: #666666;
        margin-left: 9px;
      }
    }
  }

  .van-popup__close-icon--top-right {
    top: 15px;
    right: 18px;
    font-size: 16px;
    color: #32ae57;
  }
}
</style>
<style lang="scss" scoped>
.healthControl {
  &-scroll {
    height: 370px;
    overflow-y: auto;
    padding: 0 15px;
  }

  &-Rich {
    width: 100%;
    overflow-y: auto;

    // padding-bottom:95px;
    &__img {
      width: 100%;
      object-fit: contain;
    }
  }

  &-floor {
    position: fixed;
    left: 0;
    bottom: 0;
    z-index: 10;
    // height: 95px;
    width: 100%;
    background: #fff;

    &__protocol {
      margin-top: 13px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding-left: 30px;
      padding-right: 30px;

      .floor-protocol__text {
        color: #32ae57;
      }
    }

    .floor-operate {
      margin-top: 10px;
      margin-bottom: 20px;
      padding: 0 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      &__btns {
        display: flex;
      }

      &__btn {
        width: 100px;
        height: 34px;
        font-weight: 600;
        color: #ffffff;
        display: flex;
        align-items: center;
        justify-content: center;

        span+span {
          margin-left: 6px;
        }

        &:active {
          opacity: 0.8;
        }
      }

      .btn-left {
        border-top-left-radius: 17px;
        border-bottom-left-radius: 17px;
        background: linear-gradient(116deg, #ff9035 30%, #ff7b35 72%);
      }

      .btn-right {
        border-top-right-radius: 17px;
        border-bottom-right-radius: 17px;
        background: linear-gradient(116deg, #ff9035 30%, #ff7b35 72%);
      }

      &__service {
        font-size: 14px;
        font-weight: 600;
        color: #00982d;
        display: flex;
        align-items: center;
        padding-left: 4px;

        .img {
          width: 20px;
          height: 20px;
          margin-right: 7.5px;
        }
      }
    }
  }

  &-popup {
    height: 100%;
    width: 100%;
    background: linear-gradient(0deg, #ffffff 64%, #e6ffee 100%);
    padding: 23px 0px 40px;
    overflow: hidden;

    &__title {
      font-size: 18px;
      font-weight: 600;
      line-height: 22px;
      color: #111111;
      text-align: center;
      margin-bottom: 16px;
    }

    &__info {
      height: 100%;
      width: 100%;
      padding: 0 20px;
      overflow: auto;
      font-size: 15px;
      font-weight: normal;
      line-height: 24px;
      color: #333333;
      padding-bottom: 40px;
      background-color: transparent;
      border: none;
      white-space: pre-wrap;
    }
  }

  &-sign {
    height: 100%;
    width: 100%;
    background: linear-gradient(0deg, #f9f9f9 64%, #e6ffee 100%);
    padding: 20px 0px 0;

    &__top {
      display: flex;
      align-items: center;
      margin-bottom: 17px;
      padding: 0 15px;

      .img {
        width: 60px;
        height: 60px;
        object-fit: cover;
        border-radius: 4px;
        margin-right: 24px;
      }

      .info {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &-money {
          font-size: 28px;
          font-weight: 500;
          line-height: 32px;
          color: #ff5500;

          &__sign {
            font-size: 22px;
          }
        }

        &-text {
          font-size: 15px;
          font-weight: 600;
          line-height: 22px;
          color: #111111;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    &__norms {
      padding: 14px 14px 15px;
      background-color: #fff;
      border-radius: 8px;

      .norms-title {
        font-size: 15px;
        line-height: 22px;
        font-weight: 600;
        color: #111111;
        margin-bottom: 15px;
      }

      .norms-list {
        display: flex;
        flex-wrap: wrap;

        .item {
          height: 24px;
          border-radius: 12px;
          padding: 0 12px;
          font-size: 14px;
          font-weight: normal;
          line-height: 24px;
          letter-spacing: 0.2px;
          color: #111111;
          background: #f6f6f6;
          margin: 0 10px 6px 0;
        }

        .active {
          // font-weight: 600;
          color: #ffffff;
          background: #00982d;
        }
      }
    }

    &__rich {
      margin-top: 8px;
      padding: 14px;
      background-color: #fff;
      border-radius: 8px;
      max-height: 140px;
      overflow-y: auto;
    }

    &__visit {
      padding: 14px;
      border-radius: 8px;
      background-color: #fff;
      margin: 8px 0px 6px;

      .visit-info {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &__left {
          font-size: 15px;
          font-weight: 600;
          line-height: 22px;
          color: #111111;
        }

        &__right {
          flex: 1;
          font-size: 14px;
          font-weight: 600;
          color: #333333;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          margin-left: 10px;
          display: flex;
          align-items: center;
          justify-content: flex-end;

          .text {
            flex: 1;
            margin-right: 5px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            text-align: right;
          }
        }
      }

      .visit-person {
        margin-top: 16px;
        display: flex;
        align-items: center;

        &__list {
          &::-webkit-scrollbar {
            display: none;
          }

          flex: 1;
          display: flex;
          align-items: center;
          overflow: auto;

          .item {
            width: 46px;
            height: 46px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #edfdee;
            border-radius: 23px;
            font-size: 14px;
            font-weight: normal;
            color: #111111;
            flex-shrink: 0;
            border: 1px solid #edfdee;
          }

          .item+.item {
            margin-left: 16px;
          }

          .active {
            position: relative;
            box-sizing: border-box;
            border-color: #00982d;
            color: #00982d;
            font-weight: 600;
          }

          .tacitly {
            &::before {
              content: "";
              position: absolute;
              left: 21px;
              bottom: -1px;
              z-index: 1;
              width: 22px;
              height: 10px;
              background-image: url("../../assets/images/silent.png");
              background-size: cover;
            }

            position: relative;
          }
        }

        &__add {
          width: 46px;
          height: 46px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid #9ebba6;
          background: #f3f7f4;
          border-radius: 23px;
          color: #79b88b;
          margin-left: 16px;

          img {
            width: 16px;
            height: 16px;
          }
        }
      }
    }

    &__btnWrap {
      position: fixed;
      left: 0;
      bottom: 0;
      z-index: 100;
      height: 65px;
      width: 100%;
      background-color: #fff;
      padding: 8px 14px 0;

      .btn {
        width: 100%;
        height: 34px;
        border-radius: 17px;
        background: linear-gradient(104deg, #ff9035 31%, #ff7b35 70%);
        font-size: 15px;
        font-weight: 600;
        line-height: 34px;
        text-align: center;
        letter-spacing: 0.2px;
        color: #ffffff;

        &:active {
          opacity: 0.8;
        }
      }
    }
  }

  .van-sign {
    height: 532px;
  }
}
</style>

<style lang="scss">
.healthControl {
  &-floor {
    .van-checkbox__label {
      margin-left: 15px
    }

    .van-checkbox__icon .van-icon {
      height: 1.25em;
      line-height: 1.25em;
    }
  }
}
</style>
