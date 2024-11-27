<template>
  <div class="deptPicker"></div>
</template>

<script>
// import { Popup } from "vant-v2";
import { Tree } from "element-ui";
export default {
  name: "deptPicker",
  data() {
    return {};
  },
  props: {
    content: {
      type: String,
      default: "123"
    },
    popShow: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  mounted() {
    this.set();
  },
  methods: {
    set() {
      let self = this;
      console.log(11111, self.$refs.tree);
      self.$refs.tree.setCheckedKeys([10]);
    }
  }
};
</script>