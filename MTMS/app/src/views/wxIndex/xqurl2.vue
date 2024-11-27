<template>
  <div id="container" class="container" v-cloak>
    <div class="header">
      <div class="headerLeft" @click="back">
        <img src="../../assets/images/icon_fanhui.png" class="pageLeft" />
      </div>
      <div>消息详情</div>
      <div class="headerRight"></div>
    </div>
    <iframe :src="link" class="link"></iframe>
  </div>
</template>

<script>
var _str = "?";
import $ from "jquery";
import cHeader from "@/views/header";
import methods from "@/methods";
import { mapState, mapActions } from "vuex";
export default {
  name: "xqurl2",
  data() {
    return {
      headerTitle: "消息详情",
      _str: "?",
      link:
        $.cookie("link") +
        _str +
        "studentid=" +
        $.cookie("uid") +
        "&&uid=" +
        $.cookie("uid") +
        "&&sessionid=" +
        $.cookie("sid") +
        "&&examinerid=" +
        $.cookie("uid") +
        "&&managerid=" +
        $.cookie("uid")
    };
  },
  created() {
    if ($.cookie("link").indexOf("?") != -1) {
      _str = "&&";
    }
  },
  methods: {
    ...methods,
    back() {
      this.$router.push({
        name: "wxIndex",
        query: {
          view: "message"
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.header {
  box-sizing: border-box;
  text-align: center;
  font-size: 20px;
  color: #fff;
  padding-left: 20px;
  padding-right: 20px;
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
  display: flex;
  justify-content: space-between;
}
.headerLeft {
  width: 10px;
  height: 100%;
  display: flex;
  align-items: center;
}
.pageLeft {
  height: 18px;
  width: 10px;
}
.headerRight {
  width: 10px;
}
#container {
  margin: 0;
  padding: 0;
}
#header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
}
.link {
  border: none;
  /*margin-top:50px;*/
  width: 100%;
  height: 100%;
  padding-top: 50px;
  padding-bottom: 10px;
}
</style>


