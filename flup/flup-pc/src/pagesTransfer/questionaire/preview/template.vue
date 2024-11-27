<template>
  <QustionaireTemplate v-if="type == 1 && show" :content="content" :state="0" hideSubmit></QustionaireTemplate>
  <div class="img-auto" v-else-if="type == 2 && show" v-html="content"></div>
  <SpecialTemplate v-else-if="type == 3" :serial_no="serial_no"></SpecialTemplate>
  <MedicationReminder v-else-if="type == 4" :serial_no="serial_no"></MedicationReminder>
  <div v-else-if="type == 5 && show">{{ content }}</div>
</template>

<script>
import QustionaireTemplate from '@/components/questionaire_template'
import SpecialTemplate from '@/components/special_inspection_propaganda_template'
import MedicationReminder from '@/components/medication_reminder'
export default {
  name: 'preview-content',
  data() {
    return {
      content: '',
      show: false,
    }
  },
  components: {
    QustionaireTemplate,
    SpecialTemplate,
    MedicationReminder,
  },
  props: ['type', 'serial_no'],
  created() {
    if (this.type == 1 || this.type == 2) {
      this.getTemplate()
    } else if (this.type === 5) {
      this.getCYTX()
    }
  },
  methods: {
    getTemplate() {
      this.$apis[
        this.$route.query.source == 'library'
          ? 'getQuBaseTemplateNew'
          : 'templatequeryTemplateContent'
      ]({
        serialNo: this.serial_no,
      }).then((res) => {
        if (this.type == 1 || this.$route.query.source == 'library') {
          this.content = res.content
        } else {
          this.content = this.HTMLDecode(res.contentHtml)
        }
        this.show = true
      })
    },
    getCYTX() {
      this.$apis
        .getCYXT({
          serial_no: this.serial_no,
        })
        .then((res) => {
          this.content = res.message_content
          this.show = true
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
}
</script>

<style lang="scss" scoped>
/deep/.preview_left {
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
  img {
    max-width: 100%;
    height: auto;
  }
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