<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../assets/images/icon_fanhui.png" />
        </a>
      </div>查房老师搜索
    </c-header>
    <div class="search flex color">
      <div class="searchLeft flex" @click="selCourseShow = true">
        <img src="../../assets/images/bnt_shaixuan.png" alt />
      </div>
      <div class="searchRight flex">
        <input type="text" v-model="searchContent" placeholder="请输入老师名称查询" @input="search" />
        <span @click="search">搜索</span>
      </div>
    </div>
    <div class="g-main">
      <ul class="ulContent">
        <li v-for="item in teacherList" @click="peronData(item)">{{item.name}}</li>
      </ul>
    </div>
    <no-content v-if="teacherList.length==0"></no-content>
  </div>
</template>
<script>
import Vue from "vue";
import cHeader from "../header";
import methods from "../../methods";
import noContent from "../no_content";
import { mapState, mapActions } from "vuex";
let bus = new Vue({});
export default {
  name: "myTest",
  props: {
    deptid: {}
  },
  components: {
    cHeader,
    noContent
  },
  data() {
    return {
      searchName: "",
      noContent: false,
      roleflag: "",
      searchContent: "",
      teacherList: [],
      type: "" /*1看所有共享的，0。看指定共享的3.看自己上传的*/
    };
  },

  mounted() {
    let self = this;
    this.registerToNative("goBack", function(data) {
      self.back();
    });
    this.getTeacher();
  },
  methods: {
    ...methods,
    ...mapActions([
      "showAlert",
      "showConfirm",
      "showLoading",
      "hideLoading",
      "toast"
    ]),
    back() {
      this.$emit("getTeachers", { boolean: false });
    },
    getTeacher() {
      let self = this;
      this.post("/turnbaseinfo/queryteacherbydept", {
        command: "turnbaseinfo/queryteacherbydept",
        sessionid: $.cookie("sid"),
        loginid: $.cookie("uid"),
        searchinfo: self.searchContent,
        deptid: self.deptid,
        teachertype: 1
      }).done(res => {
        if (res && res.errcode) {
          if (res.errcode == 0) {
            self.teacherList = res.teacherinfolist;
          }
        } else {
          self.toast(res.errdesc);
        }
      });
    },
    search() {
      this.getTeacher();
    },
    //职称
    peronData(data) {
      this.$emit("getTeachers", data);
    },
    ok() {
      this.init();
      this.selCourseShow = false;
    }
  }
};
</script>
<style scoped lang="scss">
@import "../../scss/mixin.scss";

.flex {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.flex-between {
  display: flex;
  justify-content: flex-between;
  align-items: center;
}
.search {
  width: 100%;
  height: 0.88rem;
  /* border-bottom: solid 1px lightgray; */
  padding: 0 0.3rem;
  /* margin-bottom:.2rem; */
  background: rgb(255, 255, 255);
  margin-left: 0;
}
.searchLeft img {
  width: 0.35rem;
  margin-right: 0.3rem;
}
.searchRight {
  background: rgb(242, 242, 242);
  width: calc(100% - 0.35rem);
  height: 0.6rem;
  border-radius: 0.1rem;
  /* color:#999999; */
}
.searchRight span {
  padding-left: 0.18rem;
  color: rgb(140, 140, 140);
  border-left: solid 1px rgb(220, 220, 220);
}
.searchRight input {
  width: 80%;
  outline: none;
  padding-left: 0.1rem;
  background: transparent;
}
input::-webkit-input-placeholder {
  color: #c3c3c3;
  opacity: 1;
}
.ulContent {
  li {
    height: 0.6rem;
    line-height: 0.6rem;
    padding-left: 0.2rem;
    border-bottom: 1px solid $borderColor;
    background: #fff;
    color: $wordColor;
  }
}
.g-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
}
.g-main {
  background: #f2f2f2 !important;
}
</style>
