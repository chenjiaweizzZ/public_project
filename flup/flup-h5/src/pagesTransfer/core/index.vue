<template>
  <div class="core">
    <div class="core-head">
      <div class="mine">
        <img v-if="userInfo.phone && userInfo.headImgUrl" class="mine-image" :src="userInfo.headImgUrl" alt />
        <img v-else class="mine-image" src="@/assets/images/core/headSculpture.png" alt />
        <div class="mine-logOut" @click="authorize" v-if="!userInfo.phone">
          <span>点击登录</span>
          <img class="mine-logOut__icon" src="@/assets/images/core/you.png" alt />
        </div>
        <div class="mine-successLog" v-else>
          <div class="mine-successLog__info">
            <span class="successLog-info__text">{{ userInfo.nickName }}</span>
            <img v-if="userInfo.sex == '男'" class="successLog-info__icon" src="@/assets/images/core/boy.png" alt />
            <img v-else class="successLog-info__icon" src="@/assets/images/core/girl.png" alt />
          </div>
          <div class="mine-successLog__phone">
            <span class="mine-successLog__phone__left">{{ userInfo.phone | hiddenCardId }}</span>
            <img @click="changePhone" src="@/assets/images/core/edit.png" alt>
          </div>
          <span class="mine-successLog-logouT" @click="goLogin"><img src="@/assets/images/core/logout.png" alt /></span>
        </div>
      </div>
      <div class="menuList">
        <div class="menuList-item" v-for="item in menuList" :key="item.id" @click="jump(item.path)">
          <div class="menuList-item__imgWrap">
            <img class="menuList-item__img" :src="item.imageUrl" alt />
            <img class="menuList-item__bgImg" :src="item.bgImg" alt />
          </div>
          <span class="menuList-item__text">{{ item.label }}</span>
        </div>
      </div>
    </div>
    <div class="core-barList">
      <div class="item" v-for="item in barList" :key="item.id" @click.stop="jump(item.path, item.query)">
        <div class="item-info">
          <img class="item-info__image" :src="item.imageUrl" alt />
          <span class="item-info__text">{{ item.label }}</span>
          <img class="item-info__icon" src="@/assets/images/core/you2.png" alt />
        </div>
      </div>
    </div>
    <!-- <div class="core-btn" v-if="userInfo.phone">退出登陆</div> -->
  </div>
</template>
<script>
import { mapActions } from 'vuex';
import myOrder from '@/assets/images/core/myOrder.png';
import portrait from '@/assets/images/core/portrait.png';
import task from '@/assets/images/core/task.png';
import manage from '@/assets/images/core/manage.png';
import myOrder2 from '@/assets/images/core/myOrder2.png';
import portrait2 from '@/assets/images/core/portrait2.png';
import task2 from '@/assets/images/core/task2.png';
import manage2 from '@/assets/images/core/manage2.png';

import evaluate from '@/assets/images/core/evaluate.png';
import pharmacy from '@/assets/images/core/pharmacy.png';
import sports from '@/assets/images/core/sports.png';
import diet from '@/assets/images/core/diet.png';
import caseReporting from '@/assets/images/core/case.png';
import address from '@/assets/images/core/address.png';
export default {
  filters: {
    hiddenCardId(str, frontLen = 3, endLen = 4) {
      if (!str) {
        return str;
      }
      let len = str.length - frontLen - endLen;
      let start = '';
      for (let i = 0; i < len; i++) {
        start += '*';
      }
      return str.substring(0, frontLen) + start + str.substring(str.length - endLen);
    },
  },
  data() {
    return {
      sex: 1, //0男 1女
      menuList: [
        {
          id: 0,
          imageUrl: myOrder,
          bgImg: myOrder2,
          label: '我的订单',
          path: '/orderList',
        },
        {
          id: 1,
          imageUrl: portrait,
          bgImg: portrait2,
          label: '健康监测', //"健康画像",
          path: '/healthMonitor',
        },
        {
          id: 2,
          imageUrl: task,
          bgImg: task2,
          label: '健康计划',
          path: '/FollowUp',
        },
        {
          id: 3,
          imageUrl: manage,
          bgImg: manage2,
          label: '用户管理',
          path: '/userManagement',
        },
      ],
      barList: [
        {
          id: 0,
          imageUrl: evaluate,
          label: '评估报告',
          path: '/ncdReport',
        },
        {
          id: 1,
          imageUrl: pharmacy,
          label: '用药指导',
          path: '/healthFileFuncList',
          query: {
            index: 0,
          },
        },
        {
          id: 2,
          imageUrl: sports,
          label: '运动方案',
          path: '/healthFileFuncList',
          query: {
            index: 1,
          },
        },
        {
          id: 3,
          imageUrl: diet,
          label: '饮食建议',
          path: '/healthFileFuncList',
          query: {
            index: 2,
          },
        },
        // {
        //   id: 4,
        //   imageUrl: caseReporting,
        //   label: '病历报告',
        //   path: '',
        // },
        {
          id: 5,
          imageUrl: address,
          label: '收货地址',
          path: '/address',
        },
        {
          id: 6,
          imageUrl: address,
          label: '反馈与建议',
          path: '/feedback',
        },
      ],
      userInfo: {
        userId: '',
        sex: '',
        phone: '',
        patientName: '',
        nickName: '',
        headImgUrl: '',
      },
      openId: '',
    };
  },
  mounted() {
    // document.body.addEventListener('touchstart', function(){}, true);
    document.title = '我的';
    this.openId =
      this.$route.query.openId || this.openId || localStorage.getItem('openId') || (localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')).openId : '');
    if (this.openId) {
      this.getInfo(this.openId);
    }
    if (this.$route.query.userId) {
      sessionStorage.setItem('userId', this.$route.query.userId);
    } else if (location.search.indexOf('userId=') != -1) {
      let code = new RegExp('(^|&)userId=([^&]*)(&|$)');
      let codeValue = window.location.search.substr(1).match(code);
      sessionStorage.setItem('userId', codeValue[2]);
    }
  },
  methods: {
    ...mapActions('chat', ['getUnreadMessage']),
    authorize() {
      if (this.openId) {
        localStorage.setItem('openId', this.openId);
        this.getInfo(this.openId);
        return false;
      }
      let url = window.location.href;
      let name = window.location.href.split('/#/')[0] + '/#/transportV2?url=';
      let newUrl = name + url;
      let redirect_uri = encodeURIComponent(newUrl);
      window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${window.globalURL.APPID}&redirect_uri=${redirect_uri}&response_type=code&scope=snsapi_userinfo&state=${window.globalURL.hospitalId}&connect_redirect=1#wechat_redirect`;
    },
    //获取用户信息
    async getInfo(id) {
      try {
        let res = await this.$apis.getPatientInfo({ openId: id });
        this.getUnreadMessage()
        if (res.retData && res.retData.openId) {
          this.userInfo.userId = res.retData.userId;
          this.userInfo.sex = res.retData.sex;
          this.userInfo.phone = res.retData.phone;
          this.userInfo.patientName = res.retData.patientName;
          this.userInfo.nickName = res.retData.nickName;
          this.userInfo.headImgUrl = res.retData.headImgUrl;
          localStorage.setItem('userInfo', JSON.stringify(res.retData));
          if (!res.retData.cpExternalUserId && sessionStorage.getItem('userId')) {
            this.bindCpUser(sessionStorage.getItem('userId'));
          }
        }
      } catch (e) {
        this.$router.push({
          path: '/login',
        });
      }
    },
    jump(path, query = {}) {
      if (!path) {
        this.$toast('正在开发中');
        return false;
      }
      let params = {
        path,
      };
      if (path == '/FollowUp') {
        sessionStorage.setItem('defaultClientNew', true);
      }
      if (path == '/healthFileFuncList' || path == '/FollowUp') {
        query.openId = this.openId;
        params.query = query;
      } else if ((path = '/ncdReport' || path == '/report')) {
        query.openId = this.openId;
        params.query = query;
      }
      this.$router.push(params);
    },
    //绑定企业微信userId
    async bindCpUser(userId) {
      await this.$apis.bindCpUser({ userId });
      sessionStorage.removeItem('userId');
    },
    //前往登陆
    goLogin() {
      this.$dialog
          .confirm({
            title: "提醒",
            message: "确定退出当前账号吗?",
          })
          .then(async () => {
            localStorage.removeItem('openId')
            localStorage.removeItem('userInfo')
            this.$router.push({
              path: '/login',
          });
          })
          .catch(() => {});
    },
    changePhone() {
      this.$router.push({
              path: '/phoneNumberChange',
              query: {
                phone: this.userInfo.phone
              }
      });
    }
  },
};
</script>
<style scoped lang="scss">
.core {
  height: calc(100vh -69px);
  background-color: #f3f7f5;
  overflow-y: auto;
  &-head {
    width: 100%;
    background-image: url('../../assets/images/core/bgImage.png');
    background-repeat: no-repeat;
    background-size: cover;
    .mine {
      display: flex;
      align-items: center;
      padding: 20px 12px;
      &-image {
        width: 80px;
        height: 80px;
        margin-right: 15px;
        border-radius: 40px;
      }
      &-logOut {
        font-size: 18px;
        font-weight: 500;
        &__icon {
          width: 12px;
          height: 12px;
          margin-left: 5px;
        }
      }
      &-successLog {
        font-weight: 500;
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        position: relative;
        &__info {
          width: 100%;
          font-size: 18px;
          line-height: 22px;
          display: flex;
          align-items: center;
          color: #111;
          .successLog-info__icon {
            width: 15px;
            height: 15px;
            margin-left: 10px;
          }
          .successLog-info__text {
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
        &__phone {
          font-size: 16px;
          color: #333;
          line-height: 22px;
          margin-top: 5px;
          display: flex;
          align-items: center;
          &__left {
            margin-right: 10px;
          }
          img {
            height: 18px;
            width: 18px;
          }
        }
        &-logouT {
          position: absolute;
          right: 14px;
          top: 10px;
          img {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
    .menuList {
      // height: 100px;
      border-radius: 8px;
      background-color: #fff;
      margin: 0 12px;
      display: flex;
      padding: 13px 17px 18px;
      justify-content: space-between;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
      &-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        &:active {
          .menuList-item__bgImg {
            opacity: 1;
          }
        }
        &__imgWrap {
          width: 50px;
          height: 50px;
          position: relative;
        }
        &__img {
          width: 50px;
          height: 50px;
        }
        &__bgImg {
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
        &__text {
          font-weight: 600;
          color: #444444;
          font-size: 14px;
          line-height: 14px;
          margin-top: 5px;
        }
      }
    }
  }
  &-barList {
    margin: 12px 12px 33px;
    border-radius: 8px;
    overflow: hidden;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    .item {
      width: 100%;
      height: 54px;
      background-color: #fff;
      padding-left: 13px;
      &:active {
        background-color: #eee;
      }
      &-info {
        position: relative;
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          height: 1px;
          width: 100%;
          background: rgba(255, 255, 255, 0.01);
          box-shadow: inset 0px 0.5px 0px 0px #e2e2e2;
        }
        height: 100%;
        display: flex;
        align-items: center;
        // border-bottom:1px solid rgb(0,0,0,);
        padding-right: 17px;
        &__image {
          width: 22px;
          height: 22px;
        }
        &__text {
          flex: 1;
          font-size: 14px;
          font-weight: normal;
          line-height: 19px;
          color: #333;
          margin: 0 12px;
        }
        &__icon {
          width: 13px;
          height: 13px;
        }
      }
      &:first-child > .item-info {
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          z-index: 1;
          height: 0px;
          width: 100%;
          background: #fff;
        }
      }
    }
  }
  &-btn {
    margin: 0 15px 30px;
    height: 42px;
    box-sizing: border-box;
    border: 1px solid #32ae57;
    border-radius: 21px;
    text-align: center;
    line-height: 42px;
    color: #00982d;
    font-weight: 500;
  }
}
</style>

<!-- <style lang="scss">
.core {
  .core-head {
    
  }
}
</style> -->
