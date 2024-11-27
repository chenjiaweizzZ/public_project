<!-- 高级模式编辑器 -->
<template>
  <div class="ace-container">
    <div class="ace-editor" ref="ace"></div>
  </div>
</template>
<script>
import ace from '@/plugins/ace'
import _bi from '@/utils/biUtils'
import _ from '@/utils'
export default {
  props: {
    handledData: {
      type: Array | Object
    },
    chartType: {
      type: Number
    },
    optionCode: {
      type: String
    }
  },
  data() {
    return {
      fullHeight: document.documentElement.clientHeight,
      aceEditor: null,
      extStr: '',
      timers: false
    }
  },
  watch: {
    fullHeight(currentData) {
      if (!this.timers) {
        this.fullHeight = currentData
        this.aceEditor.setOptions({
          maxLines: (this.fullHeight - 156) / 18 // 最大行数，超过会自动出现滚动条
        })
        this.timers = true
        let that = this
        setTimeout(function () {
          that.timers = false
        }, 10)
      }
    },
    optionCode(currentData) {
      console.log('this.aceEditor', this.aceEditor)
      if (!this.aceEditor) {
        this.initEditor(currentData)
      } else {
        this.aceEditor.setValue(currentData)
      }
    },
    handledData: {
      handler: function (currentData) {
        if (!this.aceEditor) {
          this.initEditor(this.optionCode)
        }
        currentData
          ? this.draw(true)
          : _.showMessage('error', 'error:Editor draw failed, handledData undefined.')
      },
      deep: true
    }
  },
  mounted() {
    const that = this
    window.onresize = () => {
      return (() => {
        window.fullHeight = document.documentElement.clientHeight
        that.fullHeight = window.fullHeight
      })()
    }
  },
  methods: {
    initEditor(code) {
      const that = this
      this.aceEditor = ace.edit(this.$refs.ace, {
        maxLines: (this.fullHeight - 156) / 18, // 最大行数，超过会自动出现滚动条
        minLines: 100, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
        fontSize: 12, // 编辑器内字体大小
        theme: 'ace/theme/chrome', // 默认设置的主题
        mode: 'ace/mode/javascript', // 默认设置的语言模式
        tabSize: 2, // 制表符设置为 4 个空格大小
        value: code,
        highlightActiveLine: false,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        enableBasicAutocompletion: true
      })
      /* 解决ace编辑器每行高度会根据屏幕变化的问题 */
      this.aceEditor.container.style.lineHeight = 1.5
      this.aceEditor.renderer.updateFontSize()
      this.aceEditor.getSession().on('changeAnnotation', function () {
        let annotations = that.aceEditor.getSession().getAnnotations()
        let isError = annotations.some(i => {
          return i.type === 'error'
        })
        isError ? '' : that.draw()
      })
    },
    draw(enforce = false) {
      let str = this.aceEditor.getSession().getValue()
      if ((!enforce && this.extStr === str) || this.chartType === 3) return
      this.extStr = str
      let obj = _bi.dynamic(this.handledData, str)
      if (obj.status) {
        this.$emit('getChartData', obj.data)
      } else {
        console.error('Editor error', obj.msg)
        _.showMessage('error', `echart Options dynamic代码执行失败，请检查OptionCode以及handledData。`)
        this.$emit('setOptionFailed')
      }
    },
    updatedOptionsStr(str, type) {
      let optStr = this.aceEditor.getSession().getValue()
      /* 得到最新的echart option字符串 */
      let newOptionStr = _bi.transferStation(type, optStr, str)
      newOptionStr
        ? this.aceEditor.setValue(newOptionStr)
        : _.showMessage('error', 'option CODE replace fail。')
    },
    refreshCode() {
      this.$nextTick(() => {
        this.aceEditor.resize()
      })
    },
    getOptionCode() {
      return this.aceEditor.getSession().getValue()
    },
    setValue() {
      // TODO
      if (this.aceEditor)
        this.aceEditor.setValue(this.optionCode)
    }
  }
}
</script>
<style lang="scss" scoped></style>
