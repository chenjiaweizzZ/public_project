<template>
    <div class="rd-case-eva">
      <van-nav-bar
        title="标题"
        left-text="返回"
        right-text="按钮"
        left-arrow
        @click-left="onClickLeft"
        @click-right="onClickRight"
      />
       rd-case-eva
    </div>
</template>

<script>
import { Toast,Dialog } from "vant";
import $ from "jquery";
import cHeader from "../../header";
import methods from "../../../methods";
import { mapState, mapActions } from "vuex";
import cProgress from "@/components/progress";
export default {
  name: "rotation_doctor_exam",
  components: {
    cHeader,
    cProgress
  },
  data() {
    return {
        
    };
  },
  computed: {
    ...mapState(["turninfo"])
  },
  created() {
    
  },
  mounted() {
    
  },
  methods: {
    ...methods,
    ...mapActions(["setTurninfo", "setTurnManual"]),
  }
};
</script>

<style scoped lang="scss">

</style>

<style lang="scss">

</style>