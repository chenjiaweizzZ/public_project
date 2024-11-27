<template>
  <div>
    <div class="wxMenu">
      <van-nav-bar :title="title" left-text left-arrow @click-left="back">
            <template #right>
              <van-icon name="scan" size="26" @click="sysK"/>
            </template>
      </van-nav-bar>
      <!-- <img src="../../assets/images/sys.png" alt class="img-sys" @click="sysK" /> -->
      <div class="application">
        <div v-for="(value,index) in menu" :key="index">
          <span class="firstLine">
            <p class="applicationTitle">{{value.name}}</p>
          </span>
          <ul class="applicationList">
            <li v-for="(item,indey) in value.children" :key="indey">
              <div class="applicationChild_item" @click="toPage(item)">
                <img :src="item.ico" alt class="img-responsive" />
                <span class="fsub">{{item.name}}</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery";
import methods from "../../methods";
export default {
  data() {
    return {
      title: "应用",
      toke: "",
      headerTitle: "应用",
      hiddenmenu: false,
      showback: true,
      todonum: 0,
      msgnum: 0,
      titlenum: 0,
      isactive: [false, false, true, false],
      //以上是头部和底部的配置
      menu: [],
      showaddlist: false
    };
  },
  created() {
    let self = this;
    self.getMenuList();
  },
  methods: {
    ...methods,
    back() {
      let self = this;
      self.$router.push({
        name: "wxIndex"
      });
    },
    sysK() {
      let self = this
      self.invokeNative("scanQRCode", {}, function(data) {
        var arr = JSON.parse(data);
        console.log(
          "输出type",
          JSON.parse(arr.result).type,
          JSON.parse(arr.result)
        );

        if (JSON.parse(arr.result).type == 1) {
          var data = {
            command: "course/studentsignbycode",
            loginid: getCookie("uid"),
            sessionid: getCookie("sid"),
            type: JSON.parse(arr.result).type,
            content: JSON.parse(arr.result).content,
            studentid: getCookie("uid")
          };
          function callback(res) {
            window.location.href =
              "interaction.html?from=saoyisao&&scheduleid=" + res.scheduleid;
          }
          function errcodefn1(res) {
            if (res.errcode == 300010) {
              window.location.href =
                "interaction.html?from=saoyisao&&scheduleid=" + res.scheduleid;
            } else {
              // layer.msg(res.errdesc)
              layer.open({
                content: res.errdesc,
                skin: "msg",
                time: 2
              });
            }
          }
          post("/course/studentsignbycode", data, callback, errcodefn1, errfn);
        } else if (JSON.parse(arr.result).type == 10) {
          var data = {
            command: "actionplan/actionplansign",
            loginid: getCookie("uid"),
            sessionid: getCookie("sid"),
            actionplanid: JSON.parse(arr.result).actionplanid,
            status: 10,
            uid: getCookie("uid")
          };
          function callback10(res) {
            layer.open({
              content: "签到成功",
              skin: "msg"
              // time: 2//2秒后自动关闭
            });
          }
          function errcodefn10(res) {
            if (res.errcode == 400902) {
              layer.open({
                content: "请勿重复签到",
                skin: "msg",
                time: 2 //2秒后自动关闭
              });
            } else if (res.errcode == 300009) {
              layer.open({
                content: "二维码已过期",
                skin: "msg",
                time: 2 //2秒后自动关闭
              });
            } else if (res.errcode == 400907) {
              layer.open({
                content: "二维码失效，不允许签到！",
                skin: "msg",
                time: 2 //2秒后自动关闭
              });
            } else if (res.errcode == 400908) {
              layer.open({
                content: "该活动计划尚未开始，不允许签到！",
                skin: "msg",
                time: 2 //2秒后自动关闭
              });
            } else if (res.errcode == 400909) {
              layer.open({
                content: "该教学活动计划已结束，不允许签到！",
                skin: "msg",
                time: 2 //2秒后自动关闭
              });
            }
          }
          post(
            "/actionplan/actionplansign",
            data,
            callback10,
            errcodefn10,
            errfn
          );
        }
      });
    },
    toPage(item) {
      let self = this;
      localStorage.setItem("menuId", item.id);
      localStorage.setItem("oprateMenu", JSON.stringify(item.children));
      if (item.url == "/advancedapp/trainingRotation/graduationAppraisal") {
        self.getHome(item);
      } else {
        if (item.url.indexOf("?") != -1) {
          location.href = localStorage.getItem("system") + item.url + "&token=" + localStorage.getItem("token") + "&stem=1";
        } else {
          location.href = localStorage.getItem("system") + item.url + "?token=" + localStorage.getItem("token") + "&stem=1";
        }
      }
    },
    getMenuList() {
      let self = this;
      self.get("/base/menu/listAppMenu?permission=1&status=0").done(res => {
        self.menu = res.model;
      });
    }
  }
};
</script>

<style scoped>
.img-responsive {
  display: block;
    max-width: 100%;
    height: auto;
}
body {
  background-color: #f2f2f2;
}

.container {
  padding-left: 0px;
  padding-right: 0px;
  padding-top: 50px;
}

.trunmessage {
  background: #fff;
  margin: 6px;
  border-radius: 6px;
  box-shadow: 0 0 3px #ccc;
  padding: 0.35rem;
  position: relative;
}

.trunmessage h4 {
  font-weight: bold;
}

.trunmessage p {
  padding: 0;
  margin: 0;
}

.trunmessage p.warnmessgae {
  color: #3499db;
  padding: 0.1rem 0;
}

.trunmessage a {
  color: #3499db;
  border: 1px solid #3499db;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
}

.trunmessage s {
  text-decoration: none;
  display: inline-block;
  padding: 0.2rem;
  background: #aaa;
  color: #fff;
  border-bottom-left-radius: 0.2rem;
  border-top-left-radius: 0.2rem;
  background-size: 100% 100%;
  position: absolute;
  top: 0.3rem;
  right: 0;
}

.trunmessage-button {
  height: 1.6rem;
}

.trunmessage-button a {
  color: #3499db;
  border: 1px solid #3499db;
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  bottom: 0.5rem;
  right: 0.5rem;
  float: right;
  position: initial;
  margin-left: 0.5rem;
}

.overLine {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.showreason {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.4);
}

.showreason-content {
  position: absolute;
  margin: auto;
  top: 2px;
  right: 0;
  bottom: 0;
  left: 2px;
  width: 12rem;
  height: 9rem;
  background: #fff;
  border-radius: 10px;
  border: 1px solid #e0e0e0;
  padding: 0.2rem 0.4rem;
}

.showreason-content p {
  line-height: 1.5rem;
  text-align: center;
  margin: 0;
  padding: 0;
}

.showreason-content textarea {
  width: 11.2rem;
  height: 5rem;
  background: #fff;
}

.oneProject > div {
  padding: 0;
}

.oneProject {
  padding: 8px 10px;
  margin: 0;
  border-bottom: 1px solid #f2f2f2;
}

#header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
}

#todoList {
  background-color: transparent;
  padding-bottom: 5rem;
  margin-top: -40px;
}

#todoList .detaillist {
  position: relative;
  background: #fff;
  margin: 6px 6px;
  border-radius: 6px;
  box-shadow: 0 0 3px #ccc;
  padding: 15px 14px 15px 70px;
}

#todoList .detaillist .tag {
  position: absolute;
  width: 50px;
  height: 32px;
  padding-right: 10px;
  top: 50%;
  left: 0;
  /* background:#6ad969; */
  color: #fff;
  border-radius: 0 20px 20px 0;
  font-size: 16px;
  font-weight: normal;
  line-height: 32px;
  font-style: normal;
  text-align: center;
  -webkit-transform: translate3d(0, -55%, 0);
  -moz-transform: translate3d(0, -55%, 0);
  -ms-transform: translate3d(0, -55%, 0);
  -o-transform: translate3d(0, -55%, 0);
  transform: translate3d(0, -55%, 0);
  /* box-shadow: 3px 3px 6px #bae4b9; */
}

#todoList .detaillist .tag1 {
  position: absolute;
  width: 50px;
  height: 32px;
  line-height: 12px;
  top: 50%;
  left: 0;
  background: #6ad969;
  color: #fff;
  border-radius: 0 20px 20px 0;
  font-weight: bold;
  font-style: normal;
  text-align: center;
  -webkit-transform: translate3d(0, -55%, 0);
  -moz-transform: translate3d(0, -55%, 0);
  -ms-transform: translate3d(0, -55%, 0);
  -o-transform: translate3d(0, -55%, 0);
  transform: translate3d(0, -55%, 0);
  box-shadow: 3px 3px 6px #bae4b9;
}

#todoList .detaillist .tag.course {
  background: #29a7ff !important;
  box-shadow: 0px 2px 6px -1px rgba(41, 167, 255, 0.9);
}

#todoList .detaillist .tag.train {
  background: #bae4b9 !important;
  box-shadow: 0px 2px 6px -1px rgba(186, 288, 185, 0.9);
}

#todoList .detaillist .tag.evaluate {
  background: #03cdf9 !important;
  box-shadow: 0px 2px 6px -1px rgba(3, 205, 249, 0.9);
}

#todoList .detaillist .tag.survey {
  background: #f8cf31 !important;
  box-shadow: 0px 2px 6px -1px rgba(248, 207, 49, 0.9);
}

#todoList .detaillist .tag.personal {
  background: #eff816 !important;
  box-shadow: 0px 2px 6px -1px rgba(239, 248, 22, 0.9);
}

#todoList .detaillist .tag.classes {
  background: #33f825 !important;
  box-shadow: 0px 2px 6px -1px rgba(51, 248, 37, 0.9);
}

#todoList .detaillist .tag.others {
  background: #8470ff !important;
  box-shadow: 0px 2px 6px -1px rgba(132, 112, 255, 0.9);
}

#todoList .detaillist .tag.chuke {
  background: #33f825 !important;
  box-shadow: 0px 2px 6px -1px rgba(51, 248, 37, 0.9);
}

#todoList .detaillist .tag.check {
  background: #0c91e5 !important;
  box-shadow: 0px 2px 6px -1px rgba(12, 145, 229, 0.9);
}

#todoList .detaillist .tag.register {
  background: #edbf08 !important;
  box-shadow: 0px 2px 6px -1px rgba(237, 191, 8, 0.9);
}

#todoList .detaillist .tag1.layout {
  font-size: 12px;
  background: #21dfc8 !important;
  /* box-shadow: 0px 2px 3px #21DFC8; */
  box-shadow: 0px 2px 6px -1px rgba(33, 223, 200, 0.9);
  padding: 5px 2px 5px 1px;
}

#todoList .detaillist .tag1.review {
  font-size: 12px;
  background: #f99e1c !important;
  /* box-shadow: 0px 2px 3px #f99e1c;
             */
  box-shadow: 0px 2px 6px -1px rgba(249, 158, 28, 0.9);
  padding: 5px 2px 5px 1px;
}

#todoList .detaillist .tag1.test {
  font-size: 12px;
  background-color: #11b95c !important;
  /* box-shadow: 0px 2px 3px #f99e1c;
             */
  box-shadow: 0px 2px 6px -1px rgba(17, 185, 92, 0.9);
  padding: 5px 8px;
}

#todoList .remind {
  font-family: "Microsoft Yahei";
  font-size: 12px;
  text-align: center;
  line-height: 16px;
  color: #fff;
  display: inline-block;
  width: 25px;
  height: 16px;
  border-radius: 10px 10px 10px 10px;
  background-color: red;
  position: absolute;
  /*top:1rem;*/
  margin-left: 0.5rem;
}

#todoList .course {
  position: absolute;
  width: 55px;
  top: 50%;
  left: 0.1rem;
  /*margin-top: 5px;*/
  -webkit-transform: translate3d(0, -55%, 0);
  -moz-transform: translate3d(0, -55%, 0);
  -ms-transform: translate3d(0, -55%, 0);
  -o-transform: translate3d(0, -55%, 0);
  transform: translate3d(0, -55%, 0);
}

#todoList .detaillist p {
  color: #999999;
  margin-bottom: 0;
  font-size: 13px;
}

#todoList h4 {
  font-size: 16px;
  color: #333333;
  margin-top: 0;
  margin-bottom: 5px;
}

#todoList .m-date,
#todoList .m-time {
  float: right;
  color: #999999;
  font-size: 14px;
}

#noTodo {
  width: 20%;
  margin: 24% auto;
  text-align: center;
}

#noTodo img {
  display: block;
  width: 100%;
}

.noToDoText {
  font-size: 16px;
  color: #999999;
}

.headerbox b {
  font-size: 18px;
}

.ggqf {
  height: 42px;
  width: 100%;
  background: #ffffff;
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #e8e8e8;
}

.weidu {
  float: left;
  width: 50%;
  text-align: center;
  margin-top: 11px;
  border-width: 0 1px 0 0;
  border-style: solid;
  border-color: #e8e8e8;
}

.yidu {
  float: right;
  width: 50%;
  text-align: center;
  margin-top: 11px;
}

.ggneirong {
  border-width: 0 0 1px 0;
  border-style: solid;
  border-color: #e8e8e8;
  background-color: #ffffff;
  overflow: hidden;
  padding: 10px;
}

.fbtx {
  width: 25px;
  height: 25px;
  flex-shrink: 0;
}

.fbz {
  font-size: 12px;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 10px;
  color: #999;
}

.fbz div {
  /* font-size: 12px; */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  /* padding: 0 10px;
            color: #999; */
}

.fbsj {
  font-size: 12px;
  color: #999;
  flex-grow: 1;

  margin-left: 10px;
}

.fbbt {
  float: left;
  margin-left: 10px;
  margin-right: 10px;
  color: #333;
  font-size: 16px;
}

.shangbu {
  overflow: hidden;
  position: relative;
  display: flex;
}

#header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 99;
}

.redTab {
  position: absolute;
  top: 0;
  left: 25px;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
}

.application {
  background-color: white;
  min-height: 100%;
  padding-bottom: 2rem;
  margin-top: 46px;
}

.applicationTitle {
  padding: 8px 16px 0 16px;
  font-size: 17px;
  font-weight: 600;
  line-height: 20px;
  letter-spacing: 0px;
  color: #444444;
}

.ftitle {
  font-size: 14px;
  color: #676767;
  font-weight: normal;
}

.firstLine {
  display: flex;
  justify-content: space-between;
  margin-right: 10px;
  align-items: center;
  height: 37px;
}

.img-sys {
  width: 87px;
  height: 37px;
  position: fixed;
  right: 10px;
  top: 58px;
  /* box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.16); */
  filter: drop-shadow(0px 2px 5px rgba(0, 0, 0, 0.16));
}

/* .firstLineSys {
            margin-right: 20px;
        } */

.fsub {
  font-size: 12px;
  font-weight: normal;
  line-height: 14px;
  text-align: center;
  letter-spacing: 0px;
  color: #222222;
  margin-top: 8px;
}

.applicationList {
  overflow: hidden;
  padding: 0 14px 4px;
  display: flex;
  flex-wrap: wrap;
  margin-top: 10px;
}

.applicationList > li {
  width: 25%;
  text-align: center;
  padding-bottom: 8px;
}

.applicationList > li > .applicationChild_item {
  display: block;
  width: 65%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.applicationList > li > .applicationChild_item:hover {
  text-decoration: none;
}

.headerdropdown {
  height: 100%;
  width: 100%;
  min-width: 100%;
  min-height: 100%;
  background-color: rgba(0, 0, 0, 0.2);
  position: absolute;
  top: 0;
  left: 0;
  z-index: 99999;
}

.headerdropdown li:nth-child(1) {
  position: absolute;
  top: 60px;
  right: 10px;
}

.headerdropdown li:nth-child(1) img:nth-child(1) {
  position: absolute;
  top: -9px;
  right: 0;
  width: 150px;
}

.headerdropdown li:nth-child(1) img:nth-child(2) {
  position: absolute;
  top: 10px;
  left: -126px;
  width: 20px;
}

.headerdropdown li:nth-child(1) span:nth-child(3) {
  position: absolute;
  top: 11px;
  left: -85px;
}

.app-btm {
  padding-bottom: 50px;
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
  padding: 10px 16px;
}

#personal > dl {
  float: left;
  margin-left: 10px;
  margin-bottom: 0;
  width: 70%;
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
</style>

<style lang="scss">
.wxMenu {
  .van-nav-bar {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    background: #fff;
    .van-nav-bar__left {
      bottom: auto;
      .van-icon {
        color: #111111;
        font-size: 24px;
      }
    }
    .van-nav-bar__title {
      font-size: 18px;
      font-weight: 550;
    }

    .van-nav-bar__right {
      bottom: auto;
      height: 46px;
      .van-nav-bar__text {
        color: #111111;
        font-size: 18px;
      }
      i {
        color: #111;
      }
    }
  }
}
</style>