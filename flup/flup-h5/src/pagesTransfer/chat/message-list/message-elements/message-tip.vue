<template>
  <div class="message-tip">
    <span>{{ tipContent }}</span>
  </div>
</template>
<script>
export default{
  props:{
    content: {
      type: Object,
      default: () => ({}),
    },
  },
  data(){
    return {

    }
  },
  computed:{
    tipContent(){
      return this.content.text || this.content.custom || "";
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/styles/common.scss";
.message-tip {
  margin: 0 auto;
  color: #999999;
  font-size: 12px;
  width: -webkit-fill-available;
  overflow-wrap: anywhere;
  display: flex;
  justify-content: center;
  align-content: center;
  align-items: center;
  text-align: center;
  &-highlight {
    animation: highlight 1000ms infinite;
    @-webkit-keyframes highlight {
      50% {
        color: #ff9c19;
      }
    }
    @keyframes highlight {
      50% {
        color: #ff9c19;
      }
    }
  }
}
</style>
