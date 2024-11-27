<template>
  <div class="message-prescription" @click="viewPrescription">
    <div class="message-prescription-back">
      <div class="message-prescription-border">
        <div class="message-prescription-container">
          <div class="message-prescription-left">
            <img src="@/assets/images/chat/prescription.png">
            <div class="patient-info">
                <div class="patient-info-name">{{ patientName }}-开单信息</div>
                <div class="patient-info-tips"><i class="el-icon-warning-outline"></i>点击查看后可进行支付</div>
            </div>
          </div>
          <div class="message-prescription-right">
            <span><i class="el-icon-arrow-right"></i></span>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
  props: {
    message: Object,
  },
  computed: {
    ...mapState('chat', ['groupUserInfoList']),
    patientName() {
        let patient = this.groupUserInfoList.find(i => i.roleName == "患者")
        return patient.userName || "患者"
    }
  },
  methods: {
    viewPrescription() {
      let orderId = JSON.parse(this.message.payload.extension).orderId || ""
      orderId ? this.$emit("viewPrescription", orderId) : ""
    },
  },
};
</script>

<style scoped lang="scss">
.message-prescription {
  padding: 3px;
  &-grade {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &-text {
    display: flex;
    justify-content: center;
    color: #333;
    margin-bottom: 10px;
    padding: 0 20px;
  }

  &-back {
    display: flex;
    justify-content: center;
    border-radius: 6px;
  }

  &-border {
    padding: 3px;
    background-color: #fff;
    border-radius: 6px;
  }

  &-container {
    width: 70vw;
    display: flex;
    background-color: #fff;
    // box-shadow: 0px 1px 2px 0px rgba(0, 0, 0, 0.2);
    justify-content: space-between;
    align-items: center;
    border: 1px solid #a7d8b5;
    padding: 10px;
    border-radius: 6px;
    position: relative;
  }

  &-left {
    font-size: 16px;
    font-weight: 500;
    line-height: 19px;
    letter-spacing: 0.5px;
    font-variation-settings: "opsz" auto;
    color: #111111;
    display: flex;
    align-items: center;
    img {
      width: 42px;
      height: 30px;
      margin-right: 10px;
    }
    .patient-info {
      display: flex;
      flex-direction: column;
      &-tips {
        font-size: 11px;
        font-weight: normal;
        line-height: 17px;
        text-align: center;
        letter-spacing: 0.2px;
        color: #ff0000;
      }
    }
  }

  &-right {
    font-size: 12px;
    font-weight: 500;
    line-height: 19px;
    letter-spacing: 0.2px;
    color: #017925;
    display: flex;
    align-items: center;
  }
}
</style>