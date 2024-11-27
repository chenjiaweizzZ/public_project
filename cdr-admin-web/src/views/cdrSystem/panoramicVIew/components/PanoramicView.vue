<template>
  <div
    class="card"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div class="title">
      <img src="~@/assets/images/circular-icon.png" class="title-icon" alt="" />
      <div class="title-text">全景视图</div>
    </div>
    <div class="content">
      <!-- <img class="img-style" src="~@/assets/images/bodyimg.png" alt="" /> -->
      <ul class="cicle-ul">
        <li class="cicle-li">
          <img src="~@/assets/images/xinzang.png" width="80" height="80" />
        </li>
        <li class="cicle-li">
          <img src="~@/assets/images/pi.png" width="80" height="80" />
        </li>
        <li class="cicle-li">
          <img src="~@/assets/images/yixian.png" width="80" height="80" />
        </li>
        <li class="cicle-li">
          <img src="~@/assets/images/dachang.png" width="80" height="80" />
        </li>
        <li class="cicle-li">
          <img src="~@/assets/images/zigong.png" width="80" height="80" />
        </li>
        <li class="cicle-li">
          <img src="~@/assets/images/fei.png" width="80" height="80" />
        </li>
        <li class="cicle-li">
          <img src="~@/assets/images/yanjing.png" width="80" height="80" />
        </li>
        <li class="cicle-li">
          <img src="~@/assets/images/wei.png" width="80" height="80" />
        </li>
        <li class="cicle-li">
          <img src="~@/assets/images/sheng.png" width="80" height="80" />
        </li>
        <li class="cicle-li">
          <img src="~@/assets/images/gaowan.png" width="80" height="80" />
        </li>
      </ul>
      <div class="infinite-list" style="overflow: auto">
        <el-button
          plain
          v-for="item in datalist"
          :datalist="item"
          :key="item.jbsmc"
          class="infinite-list-item"
        >
          <el-tooltip
            class="item"
            effect="dark"
            :content="item.jbsmc"
            placement="right-end"
            v-if="item.jbsmc.length > 6"
          >
            <div class="over-span">{{ item.jbsmc }}</div>
          </el-tooltip>
          <div v-else >{{ item.jbsmc }}</div>
        </el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { selectDataList } from '@/service/patientView'
export default {
  data() {
    return {
      datalist: [],
      loading: true
    }
  },
  created() {
    this.getDataList()
  },
  watch: {
    '$route.query'() {
      if (this.$route.query.hzid) {
        this.loading = true
        this.getDataList()
      }
    }
  },
  methods: {
    getDataList() {
      //表格页获取数据
      let params = {
        apiCode: '',
        apiVersion: '',
        pageNo: '1',
        pageSize: '10',
        parameters: {
          patientId: ''
        },
        selectSon: 1
      }
      params.apiCode = 'JK30011'
      params.apiVersion = '1.0'
      params.parameters.patientId = this.$route.query.hzid
      selectDataList(params).then(res => {
        this.loading = false
        this.datalist = res.data
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.el-button {
  color: #111111;
}
.card {
  height: 694px;
  margin-left: 10px;
  background: #ffffff;
  box-shadow: 0px 4px 10px rgba(0, 117, 255, 0.2);
  border-radius: 4px;
  position: relative;
  li:nth-of-type(1) {
    transform: rotate(-70deg);
    transform-origin: 0px 310px;
  }
  li:nth-of-type(2) {
    transform: rotate(60deg);
    transform-origin: 0px 310px;
  }
  li:nth-of-type(3) {
    transform: rotate(-130deg);
    transform-origin: 0px 310px;
  }
  li:nth-of-type(4) {
    transform: rotate(120deg);
    transform-origin: 0px 310px;
  }
  li:nth-of-type(5) {
    transform: rotate(-100deg);
    transform-origin: 0px 310px;
  }
  li:nth-of-type(6) {
    transform: rotate(90deg);
    transform-origin: 0px 310px;
  }

  li:nth-of-type(7) {
    transform: rotate(-40deg);
    transform-origin: 0px 310px;
  }
  li:nth-of-type(8) {
    transform: rotate(30deg);
    transform-origin: 0px 310px;
  }
  li:nth-of-type(9) {
    transform: rotate(150deg);
    transform-origin: 0px 310px;
  }
  li:nth-of-type(10) {
    transform: rotate(-160deg);
    transform-origin: 0px 310px;
  }
  .title {
    width: 135px;
    padding-top: 16px;
    display: flex;
    margin-left: 16px;
    .title-icon {
      width: 16px;
      height: 16px;
      margin-top: 5px;
    }
    .title-text {
      font-size: 18px;
      line-height: 26px;
      margin-left: 8px;
      font-family: Microsoft YaHei;
    }
  }
  .content {
    display: flex;
    justify-content: center;
    .img-style {
      margin-left: 78px;
    }
    .cicle-ul {
      width: 620px;
      height: 620px;
      background-image: url(~@/assets/images/bodyImg.png);
      position: relative;
      .cicle-li {
        position: absolute;
        left: 50%;
        /* background-color: red; */
      }
    }
    .infinite-list {
      position: absolute;
      right: 10px;
      top: 30px;
      overflow: auto;
      max-height: 500px;
      .infinite-list-item {
        min-width: 100px;
        max-width: 100px;
        height: 28px;
        margin: 8px;
        background: #ffffff;
        box-sizing: border-box;
        box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.12), inset 0px -1px 0px #e6e6e6;
        border-radius: 4px;
        display: flex;
        align-items: center;
        line-height: 22px;
        padding: 3px 10px 3px 10px;
        font-size: 14px;
        .over-span {
          max-width: 85px;
          overflow: hidden; /*超出的文本隐藏*/
          text-overflow: ellipsis; /*溢出用省略号显示*/
          white-space: nowrap; /*溢出不换行*/
        }
      }
    }
  }
}
</style>
