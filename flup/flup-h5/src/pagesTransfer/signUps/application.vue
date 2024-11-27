//申请签约
<template>
  <section v-if="hide" ref="section" class="evalReport">
    <!-- <div class="topMenu">
      <u @click="$router.go(-1)"></u>
      签约管理
    </!-->
    <van-collapse v-if="packageList.length != 0" v-model="activeNames">
      <van-collapse-item v-for="(item, index) in packageList" :key="index" :name="index">
        <template #title>
          <div style=" display: flex;align-items: center;justify-content: space-between;">
            <span style=" color: #111;font-size: 17px;	font-weight: 600;">{{item.packageName}}</span>
            <span
              style="font-size: 14px;color: #FF7B35;"
            >¥{{item.price }}/{{item.validityDay}}天&ensp;</span>
          </div>
        </template>
        <div class="service">
          <div>
            <div class="title">
              <div>
                <img src="../../assets/images/fwbnr.png" />
                服务包内容：
              </div>
              <van-button type="info" size="small" @click="push(item)">去签约</van-button>
            </div>
            <p
              style="white-space:pre-wrap; word-wrap:break-word;"
            >{{item.packageContent?item.packageContent:''}}</p>
          </div>
          <div>
            <div class="title">
              <div>
                <img src="../../assets/images/yxq.png" />
                服务包有效期：
              </div>
            </div>
            <p>生效日起{{item.validityDay}}天</p>
          </div>
          <div>
            <div class="title">
              <div>
                <img src="../../assets/images/wj.png" />
                服务包价格：
              </div>
            </div>
            <p>¥{{item.price }}</p>
          </div>
          <span class="prompt">如对本服务包内容有疑问请致电0571-XXXXXXX</span>
        </div>
      </van-collapse-item>
    </van-collapse>
    <div v-else class="noDatabox">
      <img src="../../assets/images/zwsj.png" />
    </div>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      hide: false,
      activeNames: ['1'],
      packageList: [],
    }
  },
  created() {
    let _this = this
    this.$apis.getAllPackageList().then((res) => {
      this.packageList = res.retData
      setTimeout(function () {
        _this.hide = true
      }, 100)
    })
  },
  methods: {
    push(item) {
      this.$router
        .push({
          path: 'chooseADoctor',
          query: {
            servicePack: JSON.stringify(item),
          },
        })
        .catch((err) => {
          err
        })
    },
  },
}
</script>
<style lang="scss" scoped>
p {
  margin: 0;
}
.fff {
  background: #fff;
}
.evalReport {
  position: relative;
  width: 100%;
  height: 100%;
  &::before {
    content: '';
    display: table;
  }
  .topMenu {
    z-index: 99;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 44px;
    line-height: 44px;
    font-size: 18px;
    color: #111111;
    letter-spacing: 0.2px;
    text-align: center;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
    u {
      position: absolute;
      left: 3.75%;
      top: 50%;
      transform: translate(0, -50%);
      display: block;
      width: 22px;
      height: 22px;
      background: #fff url('../../assets/images/back.png') no-repeat;
      background-size: contain;
    }
  }
}
.service {
  > div {
    margin-bottom: 10px;
    .title {
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #333;
      font-size: 15px;
      > div {
        display: flex;
        align-items: center;
        color: #666;
        img {
          width: 20px;
          height: 20px;
          margin-right: 10px;
        }
      }
    }
    p {
      margin-left: 30px;
      font-size: 15px;
      color: #333;
      line-height: 25px;
    }
    > span {
      font-size: 14px;
      color: #b2b2b2;
      letter-spacing: 0.2px;
      line-height: 21px;
    }
  }
  .van-button--small {
    min-width: 70px;
  }
  .prompt {
    width: 375px;
    display: block;
    padding: 16px 30px;
    margin-left: -16px;
    font-size: 14px;
    color: #b2b2b2;
    letter-spacing: 0.2px;
    line-height: 21px;
    background: #fff9f5;
    font-weight: 300;
    // border-bottom: 18px solid #f2f2f2;
  }
}
</style>
