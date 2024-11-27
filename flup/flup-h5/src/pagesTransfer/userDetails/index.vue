<template>
  <div class="userDetails">
    <div class="userDetails-list">
      <div class="userDetails-list__code">
        <!-- <img class="img" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fsafe-img.xhscdn.com%2Fbw1%2Fb5dc61c3-468a-4154-876b-9057f587f5d7%3FimageView2%2F2%2Fw%2F1080%2Fformat%2Fjpg&refer=http%3A%2F%2Fsafe-img.xhscdn.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1691130280&t=0ba36c0b33237b8de7219fba9544edd4" alt=""> -->
        <div class="img">
          <qrcode :text="idNo" v-if="idNo" />
        </div>
      </div>
      <ul class="userDetails-list__info">
        <li class="item">
          <span class="item-left">姓名</span>
          <div class="item-right">{{ patientName }}</div>
        </li>
        <li class="item">
          <span class="item-left">身份证</span>
          <div class="item-right">{{ idNo | hiddenCardId(4) }}</div>
        </li>
        <li class="item">
          <span class="item-left">性别</span>
          <div class="item-right">{{ sex }}</div>
        </li>
        <li class="item">
          <span class="item-left">年龄</span>
          <div class="item-right">{{ age }}</div>
        </li>
        <li class="item">
          <span class="item-left">设为默认就诊人</span>
          <div class="item-right">
            <van-switch
              v-model="checked"
              @change="changeDefaultPatient"
              active-color="#32AE57"
              class="item-right__switch"
              inactive-value="0"
              active-value="1"
            />
          </div>
        </li>
      </ul>
    </div>
    <div class="userDetails-btnWrap">
      <div class="userDetails-btnWrap__btn" @click="unbindPatient">
        解绑就诊人
      </div>
    </div>
  </div>
</template>
<script>
import qrcode from "../userManagement/components/qrcode.vue";
export default {
  components: {
    qrcode,
  },
  filters: {
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
      checked: false, //是否为默认就诊人
      userId: "",

      patientName: "",
      sex: "",
      idNo: "",
      age: "",
      checked: "0",
    };
  },
  mounted() {
    this.userId = this.$route.query.userId;
    this.getInfo();
  },
  methods: {
    //改变默认就诊人
    async changeDefaultPatient() {
      await this.$apis.changeDefaultPatient({
        userId: this.userId,
        isDefault: this.checked,
      });
    },
    //获取就诊人信息
    async getInfo() {
      let { retData } = await this.$apis.getInfo({
        userId: this.userId,
      });
      this.patientName = retData.patientName;
      this.sex = retData.sex;
      this.idNo = retData.idNo;
      this.age = retData.age;
      this.checked = retData.isDefault + "";
    },
    //解绑就诊人
    unbindPatient() {
      this.$dialog
        .confirm({
          title: "提醒",
          message: "是否解绑就诊人?",
        })
        .then(async () => {
          await this.$apis.unbindPatient({
            userId: this.userId,
          });
          this.$router.go(-1);
        })
        .catch(() => {});
    },
  },
};
</script>
<style lang="scss" scoped>
.userDetails {
  &-list {
    width: 100%;
    height: calc(100vh - 75px);
    background-color: #fff;
    background-image: url("../../assets/images/bgUser.png");
    background-size: 100%;
    background-repeat: no-repeat;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    &__code {
      border-radius: 20px;
      background: linear-gradient(0deg, #ffffff 88%, #e6ffee 100%);
      box-shadow: 0px 7px 9px 0px rgba(72, 138, 76, 0.28);
      padding: 40px 60px;
      margin-top: 30px;
      .img {
        width: 200px;
        height: 200px;
      }
    }
    &__info {
      width: 100%;
      padding: 40px 12px 10px;
      .item {
        display: flex;
        align-items: center;
        font-size: 16px;
        font-weight: normal;
        line-height: 16px;
        color: #333333;
        &-right {
          flex: 1;
          margin-left: 10px;
          display: flex;
          justify-content: flex-end;
          color: #111111;
          &__switch {
            font-size: 20px;
          }
        }
      }
      .item + .item {
        margin-top: 11px;
      }
    }
  }
  &-btnWrap {
    position: fixed;
    left: 0;
    bottom: 0px;
    z-index: 100;
    width: 100%;
    height: 75px;
    padding: 8px 14px;
    background-color: #fff;
    &__btn {
      height: 42px;
      border-radius: 23px;
      background: #32ae57;
      font-size: 16px;
      font-weight: 500;
      line-height: 42px;
      text-align: center;
      color: #ffffff;
      &:active{
        opacity: .8;
      }
    }
  }
}
</style>