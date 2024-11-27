<template>
  <div>
    <van-search v-model="value" @input="onSearch" placeholder="请输入医院名称" />
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="(item,index) in list" :key="index" @click="go(item,index)">
        <img style="margin-right:14px" src="../../assets/images/yiyuan.png" />
        {{item.hospital_name}}
      </van-cell>
    </van-list>
  </div>
</template>

<script>
export default {
  data() {
    return {
      value: '',
      list: [],
      loading: false,
      finished: false,
      user: null,
      hospitalId: null,
    }
  },
  mounted() {
    this.user = JSON.parse(sessionStorage.getItem('userInfo'))
    this.getHospitalList()
  },
  methods: {
    getHospitalList() {
      this.$apis
        .getAllHospitals({
          hospitalName: null || this.value,
        })
        .then((res) => {
          this.list = res.retData
          if (this.list.length == 0) {
            this.$toast('平台暂无医院接入，请联系管理员！')
          }
        })
    },
    go(item, index) {
      let userInfo = Object.assign({}, this.user, {
        hospitalId: item.serial_no,
        hospitalName: item.hospital_name,
      })
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo))
      sessionStorage.setItem('hospitalId', item.serial_no)
      console.log(userInfo)
      this.$router.replace(
        this.$route.query.redirect ||
          `/healthFileS?openId=${this.$route.query.openId}&hospitalId=${item.serial_no}&hospitalName=${item.hospital_name}&conceal=${this.$route.query.conceal}`
      )
    },
    onSearch() {
      console.log(1)
      this.$apis
        .getAllHospitals({
          hospitalName: this.value,
        })
        .then((res) => {
          this.list = res.retData
          if (this.list.length == 0) {
            this.$toast('请确认您所输入的医院名是否正确！')
          }
        })
    },

    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求

      // 加载状态结束
      this.loading = false

      // 数据全部加载完成
      if (this.list.length >= 1) {
        this.finished = true
      }
    },
  },
}
</script>

<style lang="scss" scoped>
</style>