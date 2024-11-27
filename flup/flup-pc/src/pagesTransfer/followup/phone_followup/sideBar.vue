<template>
  <div class="wrapper" :class="isOpen?'transition-in':''">
    <div
      class="btn-side"
      @click.self="isOpen = !isOpen"
      :class="isOpen?'btn-side-close':'btn-side-open'"
    ></div>
    <iframe class="content-side" :src="decodeURIComponent(url)"></iframe>
  </div>
</template>

<script>
export default {
  name: 'side-bar',
  data() {
    return {
      isOpen: false,
    }
  },
  props: ['phone', 'idCard'],
  computed: {
    url() {
      return (
        this.$baseURL.FollowUp +
        '/PatientArchive/HealthRecord?' +
        qs.stringify({
          token: this.$cookie.get('token'),
          hospital_id: this.$global.hospital_id,
          phone: this.phone || '',
          id_no: this.idCard || '',
        })
      )
    },
  },
}
</script>

<style lang="scss" scoped>
.wrapper {
  position: fixed;
  right: -380px;
  top: 0px;
  height: 100vh;
  z-index: 3;
  transition: all 0.3s ease-in;
}
.transition-in {
  transform: translateX(-380px);
}

.content-side {
  width: 380px;
  background-color: #fff;
  border: 1px solid #e6e6e6;
  height: 100%;
  overflow: hidden;
}

.btn-side {
  height: 56px;
  width: 19px;
  position: absolute;
  left: -19px;
  top: calc(50vh - 19px);
  z-index: 3;
  transition: all 0.3s ease;
  background-size: cover;
}
</style>


