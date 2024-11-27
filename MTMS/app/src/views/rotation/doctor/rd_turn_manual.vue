<template>
  <div class="g-wrapper">
    <c-header>
      <div slot="headerLeft">
        <a @click="back()" class="header-back-btn">
          <img src="../../../assets/images/icon_fanhui.png" />
        </a>
      </div>轮转手册
    </c-header>
  </div>
</template>
<script>
import $ from "jquery";
import cHeader from "../../header";
import methods from "../../../methods";
import { mapState, mapActions } from "vuex";
export default {
  name: "rotation_doctor_turn_manual",
  components: {
    cHeader
  },
  data() {
    return {
      detailinfo: ""
    };
  },
  computed: {
    ...mapState(["turninfo"])
  },
  mounted() {
    let self = this;
    this.registerToNative("goBack", function(data) {
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
      this.$router.push({
        name: "fdRotation_doctor_exam",
        query: {
          type: self.$route.query.type,
          id: self.$route.query.id
        }
      });
    }
  }
};
</script>
<style scoped>
.g-main {
  font-size: 0.24rem;
  background: #f8f7f9 !important;
  color: rgb(100, 100, 100);
}
.g-main div {
  width: 100%;
  background: white;
  /*height: 1rem;*/
  /*line-height: 1rem;*/
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.1rem 0.3rem;
  margin-top: 0.1rem;
}

.left {
  margin: 0;
  /*color: #333333;*/
  /*font-size: .3rem;*/
  display: flex;
  align-items: center;
}

.left img {
  width: 0.66rem;
  height: 0.66rem;
  margin-right: 0.2rem;
}

.right {
  width: 0.2rem;
  height: 0.2rem;
}
</style>
