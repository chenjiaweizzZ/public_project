//版本号
<template>
  <div class="mainbody">
    <div class="title">
      <img height="44" width="44" class="logo" src="~@/assets/images/logo1.png" alt />
      <div class="word">卓健科技智能随访平台</div>
    </div>
    <div class="main">
      <div class="main-top">
        <div>
          <h3>{{internalSystems.product_name}}</h3>
          <p>版本号：{{internalSystems.version}}</p>
          <p>代码提交ID：{{internalSystems.submit_id}}</p>
          <p>更新时间：{{internalSystems.update_time}}</p>
        </div>
      </div>
      <div class="line"></div>
      <div class="main-bootom">
        <div v-for="(item, index) in externalSystem" :key="index">
          <h3>{{item.product_name}}</h3>
          <p>
            版本号：
            <a :href="item.about_url" target="_blank" style="color: blue;">{{item.version}}</a>
          </p>
          <p>更新时间：{{item.update_time}}</p>
        </div>
      </div>
    </div>
    <div class="footer">© 2020 杭州卓健信息科技有限公司，保留所有权利</div>
  </div>
</template>

<script>
export default {
  name: 'about',
  data() {
    return {
      internalSystems: [], //内部系统
      externalSystem: [] //外部系统
    }
  },
  mounted() {
    console.log("pint new debug info")
    this.$apis.getVersionList().then(res => {
      this.externalSystem = res.external
      this.internalSystems = res.inter
    })
  }
}
</script>
<style>
body {
  min-width: 100px !important;
}
</style>

<style scoped>
* {
  box-sizing: border-box;
  line-height: 1;
}

body {
  width: 100px !important;
}

.mainbody {
  position: relative;
  margin: 0;
  min-height: 100vh;
}

.title {
  text-align: center;
  font-size: 30px;
  line-height: 42px;
  padding-top: 50px;
  margin-bottom: 50px;
  color: #111111;
  font-family: PingFangSC-Medium;
  display: flex;
  align-items: center;
  justify-content: center;
}

.title h1 {
  font-size: 30px;
  display: inline-block;
  margin: 0;
  margin-left: 5px;
}

.main-bootom {
  margin-bottom: 20px;
}

.main {
  width: 70%;
  margin: 0 auto;
  position: relative;
  padding-bottom: 40px;
}

.main h3 {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: #111111;
  margin-left: 100px;
  margin: 0;
  margin-top: 20px;
}

.main p {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #111111;
  line-height: 22px;
  margin-left: 100px;
  margin: 0;
  margin-top: 10px;
  word-break: break-all;
}

.line {
  width: 100%;
  height: 1px;
  background: #eaeaea;
  margin-top: 30px;
  margin-bottom: 30px;
}

.footer {
  height: 40px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: #232d48;
  line-height: 40px;
  color: #ffffff;
  text-align: center;
  font-size: 12px;
}

@media screen and (max-width: 480px) {
  .main {
    width: 100%;
    padding: 0 14px;
    padding-bottom: 40px;
  }

  .main h3 {
    margin-left: 0;
    font-size: 16px;
  }

  .main p {
    margin-left: 0;
  }

  .title {
    padding-top: 20px;
    margin-bottom: 30px;
  }

  .title h1 {
    font-size: 20px;
  }

  .main-bootom {
    margin-bottom: 14px;
  }

  .logo {
    width: 30px;
    height: 30px;
  }
}
</style>
