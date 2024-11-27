<!-- 弹窗模板 -->
<template>
  <el-dialog
    title="提示"
    :visible.sync="realUseShow"
    width="800px"
    @closed="resetData"
    :close-on-click-modal="false"
  >
    <template slot="title">
      <BlueIconTitle :text="'自定义字段'" />
    </template>

    <main class="handle-data-panel">
      <div class="left-part">
        <div class="source-data-panel">
          <header class="source-panel-header">
            <BlueIconTitle :text="'获取的字段'" :title-font-size="14" :icon-height="16" />
          </header>
          <div style="height: 236px" ref="sData"></div>
        </div>
        <div class="handled-data-panel">
          <header class="handled-panel-header">
            <BlueIconTitle :text="'预处理结果'" :title-font-size="14" :icon-height="16" />
          </header>
          <div style="height: 236px" ref="hData"></div>
        </div>
      </div>
      <div class="right-part">
        <header class="right-part-header">
          <BlueIconTitle :text="'代码处理区'" :title-font-size="14" :icon-height="16" />
        </header>
        <div class="code-editor" ref="cEditor"></div>
      </div>
    </main>

    <span slot="footer" class="dialog-footer">
      <el-button @click="running" size="mini">运 行</el-button>
      <el-button type="primary" @click="transmission" size="mini">确 认</el-button>
    </span>
  </el-dialog>
</template>
<script>
import BlueIconTitle from '@/components/BlueIconTitle.vue'
import ace from '@/plugins/ace'
import 'object-visualizer/dist/index.css'
import { mount } from 'object-visualizer'
import _ from '@/utils'
import _bi from '@/utils/biUtils'
export default {
  name: '',
  components: {
    BlueIconTitle
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    sData: {
      type: Array | Object
    },
    handledCode: {
      type: String
    }
  },
  data() {
    return {
      realUseShow: false,
      cEditor: null,
      hData: []
    }
  },
  watch: {
    show(currentData) {
      this.realUseShow = currentData
    },
    realUseShow(currentData) {
      this.$emit('update:show', currentData)
      if (currentData) {
        this.$nextTick(() => {
          mount(this.sData, this.$refs.sData, {
            rootName: 'Source Data',
            expandOnCreatedAndUpdated(path) {
              /* path.length为层级 0为第一级 下面逻辑为只展开对象第一级 */
              if (path.length === 0) return true
              else return false
            }
          })

          if (!this.cEditor) {
            this.cEditor = ace.edit(this.$refs.cEditor, {
              maxLines: 514 / 18, // 最大行数，超过会自动出现滚动条
              minLines: 514 / 18, // 最小行数，还未到最大行数时，编辑器会自动伸缩大小
              fontSize: 12, // 编辑器内字体大小
              theme: 'ace/theme/chrome', // 默认设置的主题
              mode: 'ace/mode/javascript', // 默认设置的语言模式
              tabSize: 2, // 制表符设置为 4 个空格大小
              value: this.handledCode,
              highlightActiveLine: false,
              enableSnippets: true,
              enableLiveAutocompletion: true,
              enableBasicAutocompletion: true
            })
            /* 解决ace编辑器每行高度会根据屏幕变化的问题 */
            this.cEditor.container.style.lineHeight = 1.5
            this.cEditor.renderer.updateFontSize()
            this.running()
          } else {
            this.cEditor.setValue(this.handledCode)
            this.running()
          }
        })
      }
    }
  },
  methods: {
    resetData() {},
    running() {
      let codeStr = this.cEditor.getSession().getValue()
      let obj = _bi.dynamic(this.sData, codeStr)
      if (obj.status) {
        this.hData = obj.data
        mount(this.hData, this.$refs.hData, {
          rootName: 'Handled Data',
          expandOnCreatedAndUpdated(path) {
            // path.length为层级 0为第一级 下面逻辑为只展开对象第一级
            if (path.length === 0) return true
            else return false
          }
        })
      } else {
        console.error('dataHandleDia error', obj.msg)
        _.showMessage('error', obj.msg)
      }
    },
    transmission() {
      let isError = this.cEditor
        .getSession()
        .getAnnotations()
        .some(i => {
          return i.type === 'error'
        })
      if (isError)
        return _.showMessage('error', 'handleCode存在语法问题，保存失败。')

      this.running()
      this.hData
        ? this.$emit('dataTransmission', this.hData, this.cEditor.getSession().getValue())
        : _.showMessage('warning', '检测到数据不合法，代码不生效')
      this.realUseShow = false
    }
  }
}
</script>
<style lang="scss" scoped>
.handle-data-panel {
  display: flex;
  .left-part {
    margin-right: 10px;
    .source-data-panel {
      width: 301px;
      height: 268px;
      border: 1px solid #e6e6e6;
      margin-bottom: 10px;
      .source-panel-header {
        @extend .panel-header;
      }
    }
    .handled-data-panel {
      width: 301px;
      height: 268px;
      border: 1px solid #e6e6e6;
      .handled-panel-header {
        @extend .panel-header;
      }
    }
  }
  .right-part {
    width: 441px;
    height: 546px;
    border: 1px solid #e6e6e6;
    .right-part-header {
      @extend .panel-header;
    }
  }
}
.panel-header {
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  background: #fbfbfb;
  border-bottom: 1px solid #e6e6e6;
}
::v-deep .el-dialog__body {
  padding: 20px 24px;
  padding-top: 10px;
}
::v-deep .el-dialog__footer {
  padding: 0 24px;
  padding-bottom: 20px;
}
</style>
