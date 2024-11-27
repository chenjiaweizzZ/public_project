<template>
  <div>
    <div class="preview_left">
      <ul class="tab">
        <li :class="{'current':isTel}" @click="isTel = true">
          <i class="tel"></i>
        </li>
        <li :class="{'current':!isTel}" @click="isTel = false">
          <i class="computer"></i>
        </li>
      </ul>
    </div>
    <div class="content">
      <div class="tel-bg" v-if="isTel">
        <div class="tel-pane">
          <div class="tel-content" v-html="content"></div>
        </div>
      </div>
      <div class="computer-pane" v-else v-html="content"></div>
    </div>
  </div>
</template>

<script>
export default {
  created() {
    this.getXJTemplate()
  },
  methods: {
    // 获取模板
    getXJTemplate() {
      this.$apis
        .getXJTemplate({
          serial_no: this.$route.query.serial_no,
        })
        .then((res) => {
          this.content = res.contentHtml
        })
    },
    HTMLDecode(text) {
      var temp = document.createElement('div')
      temp.innerHTML = text
      var output = temp.innerText || temp.textContent
      temp = null
      return output
    },
  },
  data() {
    return {
      isTel: true,
      content: '',
    }
  },
}
</script>
<style lang="scss">
.content {
  img {
    max-width: 100%;
    height: auto;
  }
}
</style>

<style lang="scss" scoped>
.preview_left {
  width: 60px;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 9;
  background: #fff;
  .tab {
    border: 1px solid #e6e9ed;
    padding: 0 5px;
    margin-bottom: 0;
    li {
      background: #f5f7fa;
      border-radius: 4px;
      line-height: 60px;
      height: 60px;
      width: 100%;
      margin: 5px 0;
      cursor: pointer;
      text-align: center;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      &.current {
        background: #00bc9c;
        .tel {
          background-position: 0 0;
        }
        .computer {
          background-position: -49px 0;
        }
      }
      .tel {
        background: url('../../../assets/images/ico.png');
        background-position: -24px 0;
        display: block;
        width: 23px;
        height: 31px;
      }
      .computer {
        background: url('../../../assets/images/ico.png');
        background-position: -82px 0;
        width: 32px;
        display: block;
        height: 31px;
      }
    }
  }
}
.content {
  padding-top: 10px;
  padding-right: 10px;
  display: flex;
  flex-direction: row-reverse;
  .tel-bg {
    width: 388px;
    height: 790px;
    background: url('../../../assets/images/bg-tel.png');
    margin: auto;
    position: relative;
    .tel-pane {
      position: absolute;
      top: 89px;
      left: 19px;
      overflow: hidden;
      height: 570px;
      width: 320px;
      .tel-content {
        overflow-y: scroll;
        overflow-x: hidden;
        height: 570px;
        width: 330px;
        padding: 10px;
        img {
          max-width: 100% !important;
        }
      }
    }
  }
  .computer-pane {
    width: calc(100vw - 110px);
    overflow-x: scroll;
    min-height: calc(100vh - 20px);
    border: 1px solid #999;
    padding: 10px;
  }
}
</style>
