<template>
  <div class="preview-main">
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
    <div v-if="isShow" class="content margin10X">
      <div class="tel-bg" v-if="isTel">
        <div class="tel-pane">
          <Preview :content="content"></Preview>
        </div>
      </div>
      <div class="computer-pane flex-column-align" v-else>
        <Preview class="width75" :content="content"></Preview>
      </div>
    </div>
  </div>
</template>

<script>
import Preview from '@/components/questionaire_template'

export default {
  props: ['totalQuestionList'],
  data() {
    return {
      isTel: true,
      questionList: [],
      title: '',
      description: '',
      isShow: false,
    }
  },
  components: {
    Preview,
  },
  computed: {
    serial_no() {
      return this.$route.query.serial_no || ''
    },
    content() {
      return JSON.stringify({
        questionList: this.questionList,
        title: this.title,
        description: this.description,
      })
    },
  },
  created() {
    if (this.totalQuestionList) {
      this.isShow = true
      this.questionList = JSON.parse(
        JSON.stringify(this.totalQuestionList.questionList)
      )
      this.title = JSON.parse(JSON.stringify(this.totalQuestionList.title))
      this.description = JSON.parse(
        JSON.stringify(this.totalQuestionList.description)
      )
    } else if (this.serial_no) {
      this.toGetXJTemplate()
    }
  },
  methods: {
    toGetXJTemplate() {
      this.$apis
        .getXJTemplate({
          serial_no: this.serial_no,
        })
        .then((res) => {
          this.isShow = true
          let list = JSON.parse(res.contentHtml)
          this.questionList = list.questionList
          this.title = list.title
          this.description = list.description
        })
    },
  },
}
</script>

<style lang="scss">
.content {
  .el-textarea__inner {
    resize: none;
  }

  .el-form-item {
    display: flex;
    flex-direction: column;
  }

  .el-form-item__label {
    text-align: left;
  }

  img {
    max-width: 100%;
    height: auto;
  }
}
</style>

<style lang="scss" scoped>
.page-button {
  margin-top: 20px;

  .el-button {
    width: 45%;
  }
}

.preview-main {
  background-color: #fff;
  width: 100%;
}

.preview_left {
  width: 60px;
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 9;
  background: #fff;

  .tab {
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
    border: 1px dashed #999;
    padding: 10px;
  }
}

.questionTitle {
  font-size: 22px;
  text-align: center;
  margin-top: 20px;
}

.questionDescription {
  font-size: 14px;
  margin-top: 10px;
}

.question {
  .el-radio-group,
  .el-checkbox-group {
    display: flex;
    flex-direction: column;
  }

  .el-radio + .el-radio {
    margin-top: 10px;
    margin-left: 0;
  }

  .el-checkbox + .el-checkbox {
    margin-left: 0;
  }
}
</style>
