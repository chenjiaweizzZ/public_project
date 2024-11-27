<template>
  <van-popup v-model="showFlag" :close-on-click-overlay="false">
    <div class="popup-box">
      <div class="popup-title">不通过原因</div>
      <div class="popup-content">
        <div class="reason-list">
          <van-button
            :class="[type == 0 ? 'current' : '']"
            plain
            hairline
            type="primary"
            @click="reason(0)"
          >与事实不符</van-button>
          <van-button
            :class="[type == 1 ? 'current' : '']"
            plain
            hairline
            type="primary"
            @click="reason(1)"
          >填写不规范</van-button>
          <van-button
            :class="[type == 2 ? 'current' : '']"
            plain
            hairline
            type="primary"
            @click="reason(2)"
          >其他</van-button>
        </div>
        <div class="reason-box self-style">
          <!-- <van-cell-group> -->
          <van-field
            v-model="message"
            :disabled="disabled"
            label="不通过原因:"
            type="textarea"
            placeholder="请输入不通过理由"
            rows="3"
            autosize
          />
          <!-- </van-cell-group> -->
        </div>
      </div>
      <div class="popup-footer">
        <van-button class="cancel-btn" type="primary" @click="cancelBtn">取消</van-button>
        <van-button plain hairline type="primary" @click="saveBtn">确认</van-button>
      </div>
    </div>
  </van-popup>
</template>

<script>
export default {
  name: "noPassReason",
  props: {
    showFlag: Boolean
  },
  data() {
    return {
      message: "",
      disabled: false,
      type: 4
    };
  },
  methods: {
    reason(type) {
      this.disabled = true;
      if (type == 0) {
        this.type = type;
        this.message = "与事实不符";
      }

      if (type == 1) {
        this.type = type;
        this.message = "填写不规范";
      }

      if (type == 2) {
        this.type = type;
        this.message = "";
        this.disabled = false;
      }
    },

    cancelBtn() {
      this.message = "";
      this.$emit("cancel", "");
    },

    saveBtn() {
      this.$emit("save", this.message);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../../scss/mixin.scss";

.van-button--primary {
  background: #fff;
  color: #3499db;
  border: 1px solid #3499db;
  border-radius: 5px;
  height: 30px;
  line-height: 30px;
  box-sizing: border-box;
  margin: 0.4px 0.1rem 0 0;
}

.popup-box {
  width: 300px;
  height: 200px;
}

.popup-title {
  background: #f2f2f2;
  width: 100%;
  height: torem(30px);
  line-height: torem(30px);
  text-align: center;
  font-size: torem(14px);
}

.reason-list {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: torem(14px) 0 0.1rem 0;
}

.reason-list /deep/ .van-button--primary {
  border: 1px solid #323232;
  color: #323232;
  font-size: torem(12px);
}

.popup-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: torem(4px);
  height: torem(35px);
  /* padding: 0 torem(3px); */
}

.cancel-btn {
  border: 1px solid #323232;
  color: #323232;
  font-size: torem(12px);
}

.reason-box {
  border: 1px solid #a9a9a9;
  height: 76px;
}

.reason-box /deep/ textarea {
  color: #323232 !important;
}

.current {
  border: 1px solid #3499db !important;
  color: #3499db !important;
}
</style>
<style>
.reason-box.self-style .van-field__body textarea {
  height: 54px !important;
  overflow: scroll;
}
</style>