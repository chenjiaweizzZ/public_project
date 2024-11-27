<template>
  <div class="revoke">
    <!-- <label v-if="message.flow === 'in'">{{
      message.nick || message.from
    }}</label>
    <label v-else-if="message.from === message.revoker">
      您
    </label>
    <label v-else>{{ message.revoker }}</label> -->
    <span>{{ from }}撤回了一条消息</span>
    <span
      class="edit"
      v-if="message.flow === 'out' && isEditMsg"
      @click="messageEdit"
      >重新编辑</span
    >
  </div>
</template>
<script>
import { mapState } from 'vuex';
export default{
  props:{
    isEdit: {
      type: Boolean,
      default: () => false,
    },
    messageItem: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    ...mapState('chat',['groupUserInfoList']),
  },
  created() {
    this.$nextTick(() => {
      this.groupUserInfoList.forEach(i => {
        if(i.extendUserId == this.messageItem.from) this.from = i.userName
      })
    })
  },
  data(){
    return {
      message:{},
      isEditMsg:false,
      from: "您"
    }
  },
  watch:{
    isEdit:{
      handler(newVal){
        this.isEditMsg = newVal;
      }
    },
    messageItem:{
      handler(newVal){
        this.message = newVal;
      }
    }
  },
  methods:{
    messageEdit(){
      this.emit("messageEdit");
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../assets/styles/common.scss";
.revoke {
  display: flex;
  justify-content: center;
  color: #999999;
  width: 100%;
  font-size: 14px;
  .edit {
    padding: 0 5px;
    color: #006eff;
  }
}
</style>
