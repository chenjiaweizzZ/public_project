<template>
  <section ref="section" class="report"></section>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      openId:'',
      userInfo: {
        userId: '',
        sex: '',
        phone: '',
        patientName: '',
        nickName: '',
        headImgUrl: '',
      },
    };
  },
  created() {},
  mounted() {
    this.openId =
      this.$route.query.openId ||
      this.openId ||
      localStorage.getItem('openId') ||
      (localStorage.getItem('userInfo')
        ? JSON.parse(localStorage.getItem('userInfo')).openId
        : '')
        if (!this.openId) {
      if (location.search.indexOf('openId=') != -1) {
        let openIdRule = new RegExp('(^|&)openId=([^&]*)(&|$)')
        let openIdValue = window.location.search.substr(1).match(openIdRule)
        if (openIdValue[2]) {
          this.openId = openIdValue[2]
        }
      } else {
        if (this.$route.query.code) {
          this.getOpenId(this.$route.query.code)
        } else if (location.search.indexOf('code=') != -1) {
          let code = new RegExp('(^|&)code=([^&]*)(&|$)')
          let codeValue = window.location.search.substr(1).match(code)
          this.getOpenId(codeValue[2])
        }
      }
    }else {
      localStorage.setItem('openId', this.openId)
      this.getInfo(this.openId,false);
    }
    // var redirect = this.getPara('url');
    // var code = this.getPara('code');
    // console.log(redirect, code, '1234455555555555555');
    // location.href = redirect + '?code=' + code;
  },
  methods: {
    //获取openid
    async getOpenId(id) {
      let res = await this.$apis.getOpenIdByCode({ code: id});
        if (res.retData && res.retData.openId) {
            this.openId = res.retData.openId;
            this.userInfo.nickName = res.retData.nickName;
            this.userInfo.headImgUrl = res.retData.headImgUrl;
            // localStorage.setItem('openId', this.openId);
            localStorage.setItem('userInfo', JSON.stringify({
              nickName:res.retData.nickName,
              headImgUrl:res.retData.headImgUrl
            }));
            this.getInfo(this.openId);
        }
    },
    //获取用户信息
    async getInfo(id) {
      try{
        let res = await this.$apis.getPatientInfo({ openId: id });
        if (res.retData && res.retData.openId) {
          localStorage.setItem('userInfo', JSON.stringify(res.retData));
          if((!res.retData.cpExternalUserId) && sessionStorage.getItem('userId')){
            await this.bindCpUser(sessionStorage.getItem('userId'));
          }
          let url = JSON.parse(sessionStorage.getItem('path'));
          if(url && url.path == '/chat'){
            let { retData } = await this.$apis.preSalesConsultation({
            })
            // let imUrl = JSON.parse(retData.imUrl);
            let imData = await this.$apis.getIMData(retData.userId)
            let imUrl = JSON.parse(imData.retData)
            let userSig = imUrl.userSig;
            let roomId = retData.roomId;
            // let patientId = JSON.parse(localStorage.getItem('userInfo')).userId;
            localStorage.setItem('userId',retData.userId);
            localStorage.setItem('userSig',userSig);
            let consultId = retData.id;
            this.$router.replace({
              path:'/chat',
                query:{
                  consultId,
                  serviceStatus:0,
                  patientId,
                  patientName:JSON.parse(localStorage.getItem('userInfo')).patientName,
                  roomId,
                  preSales:1,//1售前
                  ...url.query
                }
            })
          }else if(url){
            sessionStorage.removeItem('path');
            if(Object.keys(url.query).includes('openId') && !url.query.openId){
              url.query.openId = res.retData.openId;
            }
            this.$router.replace({
              path:url.path,
              query:url.query
            })
          }else{
            // let list = window.location.href.split('url=');
            // let redirect = list[list.length - 1];
            // window.location.replace(decodeURIComponent(redirect));
            this.$router.go(-1);
          }
        }
      }catch(e){
        this.$router.replace({
          path:'/login',
          query:{
            openId:this.openId
          }
        })
      }
    },
    //绑定企业微信userId
    async bindCpUser(userId){
      await this.$apis.bindCpUser({ userId});
      sessionStorage.removeItem("userId");
    },
    getPara(name) {
      var reg = new RegExp('(^|\\?|&)' + name + '=([^&]*)(\\s|&|$)', 'i');
      if (reg.test(location.href)) return unescape(RegExp.$2.replace(/\+/g, ' '));
      return '';
    },
  },
};
</script>
<style lang="scss">
</style>
<style lang="scss" scoped>
</style>
