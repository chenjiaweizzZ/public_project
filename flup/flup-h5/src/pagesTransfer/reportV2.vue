<template>
  <section ref="section" class="report">
    <div class="imgArea" v-show="imgUrl">
      <img :src="$baseURL.ICDMApiUrl + `/file/image/` + imgUrl" @click="closeImg" />
    </div>
    <van-tabs v-model="active">
      <van-tab title="上传病历报告">
        <div class="checkTitle">
          检查报告
          <span>{{ fileInspect.length }}/9</span>
        </div>
        <div class="uploaderbox">
          <van-uploader
            v-model="fileInspect"
            :max-count="9"
            :max-size="8000 * 1024"
            @oversize="onOversize"
            :before-read="beforeRead"
            :after-read="afterReadtor"
          />
        </div>

        <div class="checkTitle">
          检验报告
          <span>{{ fileTest.length }}/9</span>
        </div>
        <div class="uploaderbox">
          <van-uploader
            v-model="fileTest"
            :max-count="9"
            :max-size="8000 * 1024"
            @oversize="onOversize"
            :before-read="beforeRead"
            :after-read="afterReadtor"
          />
        </div>
        <van-row class="marginX20 margin20X" type="flex" justify="center">
          <van-button
            :disabled="submitText=='上传中'"
            @click="submit"
            type="info"
            size="large"
          >{{submitText}}</van-button>
        </van-row>
      </van-tab>
      <van-tab title="历次病历报告">
        <div v-for="(item, index) in reportList" :key="index">
          <div class="checkTitle">
            {{ item.reportTypeEnum }}
            <span>{{ item.createTime.slice(0, 10) }}</span>
          </div>
          <div class="checkList">
            <img
              v-show="jitem"
              v-for="(jitem, jindex) in item.fileIds"
              :key="jindex"
              @click="openImg(jitem)"
              :src="$baseURL.ICDMApiUrl + `/file/thumbnail/` + jitem"
            />
          </div>
        </div>
        <div class="tip">
          <p class="tipTitle">温馨提示</p>
          <span>只展示最近半年的数据</span>
        </div>
      </van-tab>
    </van-tabs>
    <div v-if="show">
      <van-overlay :show="show">
        <div class="wrapper" @click.stop>
          <van-circle
            v-model="currentRate"
            :stroke-width="60"
            size="150px"
            :rate="rate"
            :speed="speed"
            color="#07c160"
            layer-color="#ebedf0"
            :text="'上传中('+currentRate+'%)'"
          />
        </div>
      </van-overlay>
    </div>
  </section>
</template>

<script>
import axios from 'axios'
export default {
  data() {
    return {
      rate: 99, //最大进度
      speed: '2', //速度
      submitText: '保存',
      currentRate: 0,
      show: false,
      fileInspect: [], //检查
      fileTest: [], //检验
      active: 0,
      reportList: [],
      jcList: [],
      jyList: [],
      jcData: [],
      jyData: [],
      imgUrl: '',
      bEnable: true,
    }
  },
  created() {
    this.getReportQuery()
  },
  methods: {
    afterReadtor(file) {
      console.log(file)
    },
    onOversize(file) {
      this.$toast('图片大小不能超过 8M')
    },
    async getReportQuery() {
      await this.$apis
        .reportQuery({
          hospitalId: sessionStorage.getItem('hospitalId'),
        })
        .then((res) => {
          this.reportList = res.retData
        })
    },
    // 返回布尔值
    beforeRead(file) {
      const isType =
        file.type === 'image/jpeg' ||
        file.type === 'image/png' ||
        file.type === 'image/jpg'
      const isLt1M = file.size / 1024 / 1024 < 8
      if (!isType) {
        this.$toast('上传图片只能是 JPG/PNG/JPEG 格式!')
      }
      if (!isLt1M) {
        this.$toast('上传图片大小不能超过 8M!')
      }
      return isType && isLt1M
    },
    openImg(jitem) {
      this.imgUrl = jitem
    },
    closeImg() {
      this.imgUrl = ''
    },
    submit() {
      if (this.fileInspect.length != 0 || this.fileTest.length != 0) {
        this.show = true
        this.submitText = '上传中'
        let form = new FormData()
        for (let i in this.fileInspect) {
          form.append('fileInspect', this.fileInspect[i].file)
        }
        for (let i in this.fileTest) {
          form.append('fileTest', this.fileTest[i].file)
        }
        axios({
          method: 'post',
          url: `${
            this.$baseURL.ICDMApiUrl
          }/c/patient/report/uploadReport?hospitalId=${sessionStorage.getItem(
            'hospitalId'
          )}`,
          headers: {
            'content-type': 'multipart/form-data',
            openId: this.$route.query.openId,
          },
          data: form,
        }).then((res) => {
          if (res) {
            this.speed = 50
            this.rate = 100
            setTimeout(() => {
              this.show = false
              this.$toast.success('上传成功')
              setTimeout(() => {
                location.reload(true)
              }, 500)
            }, 2000)
          }
        })
      } else {
        this.$toast('请选择图片后再保存!')
      }
    },
  },
}
</script>
<style lang="scss">
.report {
  .van-tab {
    font-size: 15px;
  }
  .van-tab--active {
    color: #1c97fc;
  }
  .van-tabs__line {
    background-color: #1c97fc;
  }
  // .van-tabs__wrap:before {
  //   content: '';
  //   display: block;
  //   width: 1px;
  //   height: 20px;
  //   z-index: 9;
  //   position: absolute;
  //   left: 50%;
  //   top: 50%;
  //   transform: translate(-50%, -50%);
  //   background: #e2e2e2;
  // }
}
</style>
<style lang="scss" scoped>
p {
  margin: 0;
}
.report {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #fff;
  &::before {
    content: '';
    display: table;
  }
  .van-tabs {
    position: relative;
    // margin-top: 44px;
  }
  .imgArea {
    z-index: 90;
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    font-size: 0;
    background-color: rgba(0, 0, 0, 0.9);
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }
  .checkTitle {
    padding: 0 3.75%;
    margin-bottom: 10px;
    line-height: 44px;
    font-size: 15px;
    color: #333333;
    letter-spacing: 0.2px;
    background: #fff;
    border-bottom: 1px solid #e2e2e2;
    span {
      float: right;
      font-size: 14px;
      color: #999999;
    }
  }
  .uploaderbox {
    padding: 0 10px;
    background: #fff;
  }
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .tip {
    padding: 16px 3.75%;
    background: #fff9f5;
    font-size: 14px;
    color: #666666;
    letter-spacing: 0.2px;
    line-height: 21px;
    p {
      margin-bottom: 8px;
      font-size: 16px;
      color: #ff7b35;
      letter-spacing: 0.2px;
      line-height: 22px;
    }
  }
  .checkList {
    background: #fff;
  }
}
</style>
