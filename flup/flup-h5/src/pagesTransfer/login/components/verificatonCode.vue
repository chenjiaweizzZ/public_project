<template>
  <div class="verify-code-div" @click="codeInputFun">
    <ul class="verify-code-num-list">
      <li>
        <span>{{ codeArr[0] }}</span>
        <span v-if="isFocus && !codeArr[0]" class="caret"></span>
      </li>
      <li>
        <span>{{ codeArr[1] }}</span>
        <span v-if="isFocus && !codeArr[1] && codeArr[0]" class="caret"></span>
      </li>
      <li>
        <span>{{ codeArr[2] }}</span>
        <span
          v-if="isFocus && !codeArr[2] && codeArr[0] && codeArr[1]"
          class="caret"
        ></span>
      </li>
      <li>
        <span>{{ codeArr[3] }}</span>
        <span
          v-if="
            isFocus && !codeArr[3] && codeArr[0] && codeArr[1] && codeArr[2]
          "
          class="caret"
        ></span>
      </li>
    </ul>
    <input
      @focus="focus"
      @blur="blur"
      ref="codeInput"
      type="text"
      class="verify-code-input"
      unselectable="on"
      maxlength="4"
      v-model="newCode"
    />
  </div>
</template>
<script>
export default {
  name: "verificatonCode",
  props:{
    code:{
        type:String,
        default:'',
    }
  },
  data() {
    return {
    //   code: "",
      codeArr: [],
      isFocus: false,
    };
  },
  computed:{
    newCode:{
        get(){
            return this.code;
        },
        set(newValue){
            this.$emit('update:code',newValue);
        }
    }
  },
  watch: {
    code(newVal) {
      this.codeArr = String(newVal).split("");
    },
  },
  methods: {
    focus() {
      this.isFocus = true;
    },
    blur() {
      this.isFocus = false;
    },
    codeInputFun() {
      this.$refs.codeInput.focus();
    },
  },
};
</script>
<style scoped lang="scss">
@keyframes shan {
  to {
    opacity: 0;
  }
  from {
    opacity: 1;
  }
}

.verify-code-div {
  width: 100%;
  margin:18.5px auto 0;
//   margin-bottom: 20px;
  position: relative;
  .verify-code-input {
    width: 100%;
    height: 50px;
    // border:1px solid #ccc;
    outline: none;
    color: transparent;
    caret-color: transparent;
    border: none;
  }
  .verify-code-num-list {
    width: 100%;
    height: 56px;
    background: #fff;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    text-align: center;
    &:after {
      content: "";
      display: block;
      clear: both;
    }
    li {
      float: left;
      width: 56px;
      height: 56px;
      text-align: center;
      line-height: 57px;
      display: inline-block;
      border: 1px solid #CDCDCD;
      box-sizing: border-box;
      border-radius: 4px;
      margin-right: 8.5px;
      font-size: 28px;
      overflow: hidden;
      font-weight: 600;
      .caret {
        margin-top: 15px;
        display: inline-block;
        min-width: 2px;
        max-width: 2px;
        width: 2px;
        height: 30px;
        background: rgba(0, 0, 0, 0.4);
        animation: shan 0.8s infinite;
      }
      &:last-child {
        margin-right: 0px;
      }
    }
  }
}
</style>