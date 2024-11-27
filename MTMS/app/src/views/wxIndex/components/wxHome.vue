<template>
  <div class="wxHome">
    <div class="userInfoStudent" v-show="role == 9">
      <img src="../../../assets/images/index-bg4.png" class="bgImg" />
    </div>
    <home-teach-chart v-if="role == 1" />
    <home-stu-chart v-if="role == 2" />
    <home-menu :appList="appList" />
    <home-assign />
    <home-teach-activities :appList="appList" />
    <div style="height: 50px"></div>
  </div>
</template>
<script>;  
import $ from "jquery";
import methods from "../../../methods";
import homeMenu from "./components/homeMenu";
import homeAssign from "./components/homeAssign";
import homeTeachActivities from "./components/homeTeachActivities.vue";
import homeTeachChart from "./components/homeTeachChart.vue";
import homeStuChart from "./components/homeStuChart.vue";
export default {
  name: "wxHome",
  components: {
    homeMenu,
    homeAssign,
    homeTeachActivities,
    homeTeachChart,
    homeStuChart,
  },
  data() {
    return {
      role: 0,
      appList: [],
    };
  },
  created() {
    let self = this;
    self.getWxHomeMenusid();
    if ($.cookie("url")) {
      let url = decodeURIComponent($.cookie("url"));
      $.cookie("url", "", { expires: 30, path: "/" });
      if (url.indexOf("?") != -1) {
        window.location.href = localStorage.setItem("system") + url + "&token=" + localStorage.getItem("token");
      } else {
        window.location.href = localStorage.setItem("system") + url + "?token=" + localStorage.getItem("token");
      }
    }
    self.getMenuList();
  },
  methods: {
    ...methods,
    getWxHomeMenusid() {
      let self = this;
      self
        .get(
          "/base/commpara/getListByCode?code=queryTurnManageDefaultMenusId"
        )
        .done((res) => {
          localStorage.setItem("menuId", res.model[0].param1);
          self.getRole();
        });
    },
    getMenuList() {
      let self = this;
      self
        .get("/base/menu/listAppMenu?status=0&permission=1&order=1")
        .done((res) => {
          let list = [];
          res.model.forEach((i) => {
            list.push(...i.children);
          });
          self.appList = list;
        });
    },
    deterRole(roles) {
      let roleList = [6, 7, 53, 54, 51, 25, 8, 49, 203];
      let i = 9;
      let { roleDTOList, roleType } = roles;
      if (roleType == 1) {
        roleDTOList.forEach((item) => {
          if (roleList.includes(item.roleId)) {
            i = 1;
          }
        });
      } else if (roleType == 2) {
        roleDTOList.forEach((item) => {
          if (roleList.includes(item.roleId)) {
            i = 2;
          }
        });
      }
      return i;
    },
    getRole() {
      let self = this;
      self.get("/base/role/getUserRole").done((res) => {
        self.role = self.deterRole(res.model);
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../css/wxIndex.scss";
</style>

<style lang="scss">
.rotationc {
  .van-popup {
    height: 350px;
    transform: translate3d(0%, 0%, 0);
    overflow: hidden;
  }
  .popCK {
    display: flex;
    height: 350px;
  }
  .van-sidebar {
    width: 100%;
    height: 350px;
    padding-bottom: 48px;
  }
  .van-sidebar-item--select:before {
    background-color: #0079fd;
  }
}
.popCK {
  .van-sidebar {
    padding-bottom: 40px;
  }
}

.container {
  width: 100%;
}
.van-tabs__wrap {
  width: 100%;
}
.actContent .el-tag {
  height: 20px;
  line-height: 20px;
}

.van-nav-bar__content {
  height: 46px;
  width: 100%;
  .van-icon {
    line-height: 46px;
  }
}

.van-nav-bar__left {
  height: 46px;
}

.supervise-grade {
  .van-nav-bar__content {
    height: 46px;
    width: 100%;
  }
}

.wxHome {
  .van-list {
    .van-list__finished-text {
      display: none;
    }
  }
  .van-tag {
    flex-shrink: 0;
    padding: 0;
    margin-left: 6px;
  }
  .van-progress {
    margin-top: 6px;
  }

  .van-popup {
    height: 250px;
  }
}
</style>