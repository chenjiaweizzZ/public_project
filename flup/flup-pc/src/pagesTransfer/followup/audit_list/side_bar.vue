<template>
  <div :class="isOpen?'transition-in':''" class="wrapper">
    <div
      class="btn-side2"
      :class="isOpen ? 'btn-side-close':'btn-side-open'"
      @click.self="isOpen = !isOpen"
    ></div>

    <div class="wrap-side">
      <div class="bg" type="flex" style="padding:10px 20px 10px">
        <el-row type="flex">
          <div>个人信息</div>
          <div
            style="margin-left:10px"
          >{{`${userInfo.patient_name || ''}，${userInfo.sex || ''}，${$utils.getAge($utils.formatDate(new Date(userInfo.date_of_birth)))}`}}</div>
        </el-row>
        <el-row type="flex" style="margin-top:10px">
          <div>联系电话</div>
          <div style="margin-left:10px">{{userInfo.phone || userInfo.contact_phone || ''}}</div>
        </el-row>
        <el-row type="flex" style="margin-top:10px">
          <div>身份证号</div>
          <div style="margin-left:10px">{{userInfo.id_no}}</div>
        </el-row>
      </div>
      <iframe :src="decodeURIComponent(url)" style="border:none; width:100%;height:100%"></iframe>
    </div>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  name: 'side-bar-patient',
  data() {
    return {
      keyWords: '',
      url: '',
      userInfo: {},
      isOpen: false,
    }
  },
  props: ['userID'],
  created() {
    this.$apis
      .getPatientInfo({
        user_id: this.userID,
      })
      .then((res) => {
        this.userInfo = res
        this.$nextTick(() => {
          this.url =
            this.$baseURL.FollowUp +
            '/PatientArchive/HealthRecord?&type=1&' +
            qs.stringify({
              token: this.$cookie.get('token'),
              hospital_id: this.$global.hospital_id,
              phone: this.userInfo.phone || this.userInfo.contact_phone || '',
              id_no: this.userInfo.id_no || '',
            })
        })
      })
  },
  watch: {
    userID() {
      this.$apis
        .getPatientInfo({
          user_id: this.userID,
        })
        .then((res) => {
          this.userInfo = res
          this.$nextTick(() => {
            this.url =
              this.$baseURL.FollowUp +
              '/PatientArchive/HealthRecord?&type=1&' +
              qs.stringify({
                token: this.$cookie.get('token'),
                hospital_id: this.$global.hospital_id,
                phone: this.userInfo.phone || this.userInfo.contact_phone || '',
                id_no: this.userInfo.id_no || '',
              })
          })
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  right: -380px;
  top: 0px;
  height: 100%;
  z-index: 3;
  transition: all 0.3s ease-in;
}
.transition-in {
  transform: translateX(-380px);
}
.wrap-side {
  width: 380px;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  height: 100%;
  z-index: 2;
}
.btn-side2 {
  height: 56px;
  width: 19px;
  position: absolute;
  left: -19px;
  top: calc(50vh - 19px);
  z-index: 3;
  transition: all 0.3s ease;
}
</style>


