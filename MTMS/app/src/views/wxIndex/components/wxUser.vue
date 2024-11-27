<template>
  <div class="wxUser">
    <div id="personal" @click="person(this)">
      <div id="code" style="display: none">{{ stdtype }}</div>
      <img style="width:50px;height:50px" :src="imageurl" class="personaltouxiang" />
      <dl>
        <dt>{{ name }}</dt>
        <dd>工号:{{ code }}</dd>
      </dl>
      <img src="../../../assets/images/btn-youjiantou@3x.png" class="righticon" style="margin-top:16px" />
    </div>
    <div>
      <ul class="itemlist" @click="roleSwitch()">
        <li>
          <img src="../../../assets/images/w_tuichu.png" class="lefticon" />
          <span class="txtdesc">切换角色</span>
          <img src="../../../assets/images/btn-youjiantou@3x.png" class="righticon" />
        </li>
      </ul>
      <ul class="itemlist">
        <li @click="resetpwd()">
          <img src="../../../assets/images/w_xiuigaimima-.png" class="lefticon" />
          <span class="txtdesc">修改密码</span>
          <img src="../../../assets/images/btn-youjiantou@3x.png" class="righticon" />
        </li>
        <!-- <li @click="bindphone()">
          <img src="../../../assets/images/icon_bdsjh.png" class="lefticon" />
          <span class="txtdesc">绑定手机号</span>
          <img src="../../../assets/images/btn-youjiantou@3x.png" class="righticon" />
        </li> -->
        <!-- <li v-if="wechatlist.length == 0" @click="bindweixin()">
          <img src="../../../assets/images/icon_weixin.png" class="lefticon" />
          <span class="txtdesc">绑定微信</span>
          <img src="../../../assets/images/btn-youjiantou@3x.png" class="righticon" />
          <span style="float: right;margin-right: .3rem;" class="txtdesc">未绑定</span>
        </li> -->
        <!-- <li v-if="wechatlist.length != 0">
          <img src="../../../assets/images/icon_weixin.png" class="lefticon" />
          <span class="txtdesc">绑定微信</span>
          <span
            v-if="wechatlist.length != 0 && wechatlist[0].nickname"
            style="float: right;"
            class="txtdesc"
          >{{wechatlist[0].nickname}}</span>
        </li> -->
        <!-- <li style="margin-top:10px;">
          <img src="../../../assets/images/icon_bbh.png" class="lefticon" />
          <span class="txtdesc">版本号</span>
          <span class="righticon">{{ version }}</span>
        </li> -->
      </ul>
    </div>
    <ul class="itemlist" @click="logout()">
      <li>
        <img src="../../../assets/images/w_tuichu.png" class="lefticon" />
        <span class="txtdesc">退出登录</span>
      </li>
    </ul>
    <van-action-sheet v-model="roleSwitchShow" :actions="actions" cancel-text="取消" description="请选择角色"
      close-on-click-action />
    <van-dialog v-model="updatePwd" title="修改密码" show-cancel-button confirmButtonColor="#3499db" @confirm="sumbit">
      <van-field v-model="oldpassword" type="password" label="旧密码" />
      <van-field v-model="password1" type="password" label="新密码" />
      <van-field v-model="password2" type="password" label="确认新密码" />
    </van-dialog>
  </div>
</template>
<script>
const md5 = require("md5");
// import md5 from 'md5'
import $ from "jquery";
import methods from "../../../methods";
import { mapState, mapActions } from "vuex";
import { Dialog, Toast } from "vant";
export default {
  name: "wxUser",
  data() {
    return {
      oldpassword: "",
      password1: "",
      password2: "",
      updatePwd: false,
      roleSwitchShow: false,
      active: 0,
      headerTitle: "我的",
      todonum: 0,
      msgnum: 0,
      titlenum: 0,
      isactive: [false, false, false, true],
      name: "",
      code: "",
      version: "",
      imageurl: require("../../../assets/images/icon-wode-touxiang.png"),
      wechatlist: [],
      stdtype: "", //   1：留学生，2：本科生，3：外院，4：住培生
      actions: [{ name: '住培生' }, { name: '进修生' }]
    };
  },
  created: function () {
    this.show_my();
    // this.invokeNative("GetCurrentVersion", {}, this.getappversion);
    // jump_msxxq();
  },
  mounted: function () {
    // this.getWeChatInfo();
  },
  methods: {
    ...methods,
    person() {
      // location.href = "/pages/futuredoctorapp/myinf.html";
      // window.location.href = "myinf.html";
      this.$router.push({
        name: "wxInfo"
      });
    },
    sumbit() {
      let self = this
      console.log(this.oldpassword, this.password1, this.password2)
      if (this.oldpassword == "" || this.password1 == "" || this.password2 == "") {
        Toast("请输入完整信息");
        self.updatePwd = false;
          self.oldpassword = "";
          self.password1 = "";
          self.password2 = "";
        return;
      }
      if (this.password1 !== this.password2) {
        Toast("两次输入的密码不一致");
        self.updatePwd = false;
          self.oldpassword = "";
          self.password1 = "";
          self.password2 = "";
        return;
      }
      if (this.oldpassword === this.password1) {
        Toast("新密码不能与旧密码相同");
        self.updatePwd = false;
          self.oldpassword = "";
          self.password1 = "";
          self.password2 = "";
        return;
      }
      self.post('/usr/changepassword', {
        command: 'usr/changepassword',
        loginid: $.cookie("uid"),
        sessionid: $.cookie("sid"),
        oldpassword: md5(this.oldpassword),
        newpassword: md5(this.password1),
        uid: $.cookie('uid')
      }).done(res => {
        if(res.errcode == 0) {
          Toast("修改成功");
          $.removeCookie("sid", { path: "/" });
          $.removeCookie("uid", { path: "/" });
          $.removeCookie("name", { path: "/" });
          $.removeCookie("token", { path: "/" });
          self.$router.push({
            name: "wxLogin"
          });
        }else {
          self.updatePwd = false;
          self.oldpassword = "";
          self.password1 = "";
          self.password2 = "";
          Toast(res.errdesc)
        }
      })
    },
    resetpwd() {
      // location.href = "/pages/futuredoctorapp/resetpwd.html";
      // window.location.href = "resetpwd.html";
      this.updatePwd = true;
    },
    bindphone() {
      location.href = "/pages/futuredoctorapp/bindphone.html";
      // window.location.href = "bindphone.html";
    },
    roleSwitch() {
      this.roleSwitchShow = true
    },
    bindweixin() {
      let sle = this;
      this.invokeNative("GetWeChatInfo", { weChat: "weChat" }, function (data) {
        console.log(data);
        if (typeof data == "object") {
          self.wechatobj = data;
        } else {
          self.wechatobj = JSON.parse(data);
        }
        self.bindWeChat();
      });
    },
    bindWeChat: function () {
      let self = this;
      self
        .post("/weixin/bindappuser", {
          command: "weixin/bindappuser",
          loginid: $.cookie("uid"),
          sessionid: $.cookie("sid"),
          nickname: self.wechatobj.nickname,
          sex: self.wechatobj.sex,
          language: self.wechatobj.language,
          city: self.wechatobj.city,
          province: self.wechatobj.province,
          country: self.wechatobj.country,
          headimgurl: self.wechatobj.headimgurl,
          unionid: self.wechatobj.unionid
        })
        .done(function (res) {
          if (res.errcode == 0) {
            // alert('微信绑定成功！')
            // window.location.href = "todo.html?view=my";
            self.$router,
              push({
                name: "wxIndex",
                query: {
                  view: my
                }
              });
          } else {
            // alert('绑定失败！')
          }
        });
    },
    logout() {
      let self = this;
      Dialog.confirm({
        title: "提醒",
        message: "是否退出智慧医教",
        confirmButtonColor: "#1989fa"
      })
        .then(() => {
          console.log(window.location.host)
          $.removeCookie("sid", { path: "/" });
          $.removeCookie("uid", { path: "/" });
          $.removeCookie("name", { path: "/" });
          $.removeCookie("token", { path: "/" });
          self.$router.push({
            name: "wxLogin"
          });
        })
        .catch(() => {
        });
    },
    getappversion: function (res) {
      let self = this;
      self.version = "V " + res;
    },
    show_my: function () {
      var self = this;
      var data = {
        command: "user/queryuserdetail", //接口地址
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid")
      };
      self.post("/user/queryuserdetail", data).done(function (res) {
        self.stdtype = res.users[0].stdtype;
        self.name = res.users[0].name;
        self.code = res.users[0].code;
        if (res.users[0].imageurl) {
          self.imageurl = res.users[0].imageurl;
        }
      });
    },
    // getWeChatInfo: function() {
    //   var self = this;
    //   var data = {
    //     command: "weixin/getweixininfo",
    //     sessionid: $.cookie("sid"),
    //     loginid: $.cookie("uid")
    //   };
    //   self.post("/weixin/getweixininfo", data).done(function(res) {
    //     if (res.errcode == 0) {
    //       self.wechatlist = res.list;
    //     }
    //   });
    // }
  }
};
</script>



<style  lang="scss" scoped>
@import "../css/common.css";

.wxUser {
  font-size: 14px;

  .header {
    box-sizing: border-box;
    text-align: center;
    font-size: 20px;
    color: #fff;
    padding-left: 0.2rem;
    padding-right: 0.2rem;
    height: 50px;
    position: relative;
    background: #3499db;
    -ms-flex-flow: row;
    flex-flow: row;
    display: flex;
    -ms-flex-align: center;
    -moz-align-items: center;
    align-items: center;
    justify-content: center;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 99;
  }

  .container {
    padding-left: 0px;
    padding-right: 0px;
    background-color: #f2f2f2;
  }

  .personaltouxiang {
    float: left;
  }

  .personalxinxi {
    margin-top: 15px;
    margin-left: 3px;
    height: 60px;
  }

  .personaljiantou {
    float: right;
    padding-right: 19px;
    margin-top: 31px;
  }

  #personal {
    background-color: #ffffff;
    overflow: hidden;
    margin-bottom: 10px;
    padding: 20px 16px 10px 16px;
  }

  #personal>dl {
    float: left;
    margin-left: 10px;
    margin-bottom: 0;
  }

  .gy {
    background-color: #ffffff;
    height: 47px;
    border-width: 0 0 1px 0;
    border-style: solid;
    border-color: #e8e8e8;
  }

  .gytu {
    float: left;
    margin-top: 10px;
    margin-left: 20px;
  }

  .gywenzi {
    float: left;
    margin-top: 16px;
    margin-left: 12px;
  }

  .gyjiantou {
    float: right;
    margin-top: 16px;
    margin-right: 19px;
  }

  .tj {
    background-color: #ffffff;
    height: 47px;
  }

  .tjtu {
    float: left;
    margin-top: 10px;
    margin-left: 20px;
  }

  .tjwenzi {
    float: left;
    margin-top: 16px;
    margin-left: 12px;
  }

  .tjjiantou {
    float: right;
    margin-top: 16px;
    margin-right: 19px;
  }

  .out {
    height: 47px;
    background: #ffffff;
    margin-top: 10px;
    text-align: center;
    line-height: 47px;
  }

  .lefticon {
    float: left;
    width: 30px;
    vertical-align: bottom;
  }

  .txtdesc {
    float: left;
    height: 30px;
    line-height: 30px;
    padding-left: 20px;
  }

  .righticon {
    float: right;
    vertical-align: bottom;
    margin-top: 6px;
    height: 18px;
  }

  .itemlist li {
    overflow: hidden;
    background-color: white;
    padding: 10px 16px;
    border-bottom: 1px solid #f2f2f2;
  }
}
</style>

<style lang="scss">
.wxUser {
  .van-cell {
    align-items: center;
  }
}

.van-dialog .van-dialog__confirm,
.van-dialog__confirm:active {
  color: #1989fa
}
</style>