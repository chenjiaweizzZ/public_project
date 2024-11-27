<template>
  <div class="wxIndex">
    <img
      src="../../assets/images/index-created.png"
      style="position: fixed;top: 0;right: 0;bottom: 0;left: 0;
      height: 100%;width: 100%"
    />
  </div>
</template>
<script>
import $ from "jquery";
import methods from "../../methods";
export default {
  name: "wxLoginByToken",
  created() {
    let self = this;
    self.loginByToken();
  },
  methods: {
    ...methods,
    loginByToken() {
      let goToUrl='';
      var after = window.location.hash.split('?');
      if (after.length>1) {
        var reg = new RegExp("(^|&)" + 'goToUrl' + "=([^&]*)(&|$)", "i");
        let r= after[1].match(reg)
        if (r != null) {
          goToUrl = r[2]
        }else{
          goToUrl = ''
        }
      }
      let self = this;
      // console.log(window.location.href);
      if ($.cookie("token")) {
        self
          .post("/usr/loginByToken", {
            command: "usr/loginByToken",
            token: $.cookie("token")
          })
          .done(res => {
            if (res.errcode && res.errcode == 0) {
              $.cookie("uid", res.userid, { expires: 30, path: "/" });
              $.cookie("sid", res.sessionid, { expires: 30, path: "/" });
              $.cookie("name", res.name, { expires: 30, path: "/" });
              self.getrole();
              if (goToUrl) {
                console.log(decodeURIComponent(goToUrl));
                if (decodeURIComponent(goToUrl).indexOf("?") != -1) {
                  location.href = decodeURIComponent(goToUrl)+ '&token='+$.cookie("token")
                } else {
                  location.href = decodeURIComponent(goToUrl)+ '?token='+$.cookie("token")
                }
                
              }else{
                self.$router.push({
                  name: "wxIndex"
                });
              }
            } else {
              self.$router.push({
                name: "wxLogin",
                query: {
                  goToUrl: decodeURIComponent(goToUrl)
                }
              });
            }
          })
          .fail(res => {
            self.$router.push({
              name: "wxLogin",
              query: {
                goToUrl: decodeURIComponent(goToUrl)
              }
            });
          });
      } else {
        self.$router.push({
          name: "wxLogin",
          query: {
            goToUrl: decodeURIComponent(goToUrl)
          }
        });
      }
    },
    getrole() {
      let self = this;
      this.post("/user/queryuserdetail", {
        command: "user/queryuserdetail",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        uid: $.cookie("uid")
      }).done(function(data) {
        if (data && data.errcode == 0) {
          $.cookie("role", data.users[0].roleid, { expires: 30, path: "/" });
        }
      });
    }
  }
};
</script>

