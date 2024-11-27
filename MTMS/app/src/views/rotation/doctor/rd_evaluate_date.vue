<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../../assets/images/icon_fanhui.png" />
        </a>
      </div>
      {{title}}
    </c-header>
    <c-tabs :bus="bus" @change-tab="changeTab">
      <c-tab title="带教老师" :active="type == 1" :bus="bus" data="1"></c-tab>
      <c-tab title="护士长" :active="type == 2" :bus="bus" data="2"></c-tab>
    </c-tabs>
    <div class="g-main">
      <div v-show="type == 1">
        <c-doctor :active="type == 1"></c-doctor>
      </div>
      <div v-show="type == 2">
        <c-nurse :active="type == 2"></c-nurse>
      </div>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import $ from "jquery";
import cHeader from "../../header";
import cTab from "../../../components/tab";
import cTabs from "../../../components/tabs";
import cDoctor from "./evaluate_doctor";
import cNurse from "./evaluate_nurse";
import methods from "../../../methods";
import { mapState, mapActions } from "vuex";
let bus = new Vue();
export default {
  name: "rotation_doctor_date",
  components: {
    cHeader,
    cTab,
    cTabs,
    cDoctor,
    cNurse
  },
  data() {
    return {
      title: "月度考核查看",
      showEvaluate: false,
      type: 1,
      bus: bus
    };
  },
  created() {
    this.type = !sessionStorage.getItem("urlFrom")
      ? 1
      : sessionStorage.getItem("urlFrom");
  },
  mounted() {
    let self = this;
    if (self.$route.query.booking == 1 && self.type == 1) {
      self.showEvaluate = true;
    }
    self.registerToNative("goBack", function(data) {
      self.back();
    });
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
      let self = this;
      if (self.$route.query.booking == 0) {
        this.$router.push({
          name: "fdRotation_doctor_exam",
          query: {
            type: self.$route.query.type,
            booking: self.$route.query.booking,
            where: self.$route.query.where,
            id: self.$route.query.id
          }
        });
      } else if (self.$route.query.booking == 1) {
        this.$router.push({
          name: "fdRotation_doctor_evaluate",
          query: {
            type: self.$route.query.type,
            id: self.$route.query.id
          }
        });
      }
    },
    changeTab(tab) {
      this.type = tab.data;
      sessionStorage.setItem("urlFrom", this.type);
      if (Number(this.type) !== 1) {
        this.showEvaluate = false;
      } else {
        this.showEvaluate = true;
      }
    }
  }
};
</script>
<style scoped>
.g-main {
  font-size: 0.26rem;
  background: #f8f7f9 !important;
  color: rgb(100, 100, 100);
}
/*.main{
        margin-top:0.2rem;
    }*/
.list {
  margin-top: 0.1rem;
  padding: 0.2rem 0.3rem;
  height: 0.8rem;
  line-height: 0.8rem;
  /*font-size: 0.3rem;*/
  /*color: #333333;*/
  display: flex;
  align-items: center;
  justify-content: space-between;
  /*border-bottom: solid 1px rgb(230,230,230);*/
}

/* .list:nth-last-of-type(1) {
         border: none;
     }*/

.list img {
  width: 0.2rem;
  height: 0.2rem;
}

.score {
  margin: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.score span {
  padding-right: 0.3rem;
}
</style>
