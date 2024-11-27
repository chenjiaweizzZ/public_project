<template>
  <div class="quill-editor-wrapper">
    <quill-editor
      class="quill"
      v-model="content"
      ref="myQuillEditor"
      :options="editorOption"
      :maxlength="100000"
      @blur="onEditorBlur($event)"
      @focus="onEditorFocus($event)"
      @change="onEditorChange($event,100000)"
    ></quill-editor>
    <input
      type="file"
      style="display: none"
      :id="imageId"
      name="file"
      accept="image/*"
      @change="changeImage()"
    />
    <input
      type="file"
      style="display:none"
      :id="videoId"
      name="file"
      accept="video/*"
      @change="changeVideo()"
    />
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import Quill from 'quill'
import { Video } from '../assets/js/quillVideo.js'
Quill.register({ 'formats/video': Video }, true)
export default {
  name: 'QuillEditor',
  components: {
    quillEditor,
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    events: {
      type: Object,
      default: () => ({}),
    },
    rootPageVm: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    return {
      editorOption: {},
      imageId: 'uploadImg',
      videoId: 'uploadVideo',
    }
  },
  computed: {
    content: {
      get() {
        return this.value || ''
      },
      set(value) {
        console.log(value)
        this.$emit('input', value)
      },
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.registerHander()
    })
  },
  methods: {
    registerHander() {
      let vm = this
      var imgHandler = async function (image) {
        // myQuillEditor
        vm.addImgRange = vm.$refs.myQuillEditor.quill.getSelection()
        if (image) {
          var fileInput = document.getElementById(vm.imageId)
          fileInput.click()
        }
      }
      vm.$refs.myQuillEditor.quill
        .getModule('toolbar')
        .addHandler('image', imgHandler)
      var videoHander = async function (video) {
        vm.addVideoRange = vm.$refs.myQuillEditor.quill.getSelection()
        if (video) {
          let videoInput = document.getElementById(vm.videoId)
          videoInput.click()
        }
      }
      vm.$refs.myQuillEditor.quill
        .getModule('toolbar')
        .addHandler('video', videoHander)
    },
    onEditorBlur() {},
    onEditorFocus() {},
    onEditorChange(e, decimalNum) {
      if (e.quill.getLength() > decimalNum + 1) {
        this.$message1('最多输入' + decimalNum + '个字符', 'warning')
        e.quill.setText(e.quill.getText(0, decimalNum))
        return
      }
      this.$emit('input', e.html)
    },
    changeImage() {
      var vm = this
      var suffix = 'image/jpg,image/jpeg,image/png,image/bmp'.toLowerCase()
      var file = document.getElementById(vm.imageId).files[0]
      if (suffix.indexOf(file.type.toLowerCase()) == -1) {
        return this.$message1('不支持该文件类型的上传！', 'error')
      }
      var formData = new FormData()
      formData.append('file', file)
      vm.addImgRange = vm.$refs.myQuillEditor.quill.getSelection()
      //调用cos上传文件编排
      this.$apis.upload(formData).then((res) => {
        let imageUrl = this.$baseURL.ICDMApiUrl + '/file/image/' + res.id
        this.content =
          this.content + "<img src='" + imageUrl + "' width='100%'/>"
        document.getElementById(vm.imageId).value = ''
        vm.$refs.myQuillEditor.quill.setSelection(
          parseInt(vm.addImgRange.index) + 2
        )
      })
    },
    changeVideo() {
      var vm = this
      var suffix = 'video/mp4'.toLowerCase()
      var file = document.getElementById(vm.videoId).files[0]
      var formData = new FormData()
      if (suffix.indexOf(file.type.toLowerCase()) == -1) {
        return this.$message1('不支持该文件类型的上传！', 'error')
      }
      formData.append('file', file)
      vm.addVideoRange = vm.$refs.myQuillEditor.quill.getSelection()
      this.$apis.upload(formData).then((res) => {
        let videoUrl = this.$baseURL.ICDMApiUrl + '/file/video/' + res.id
        this.content =
          this.content +
          "<video style='width:100%' src='" +
          videoUrl +
          "'controls autoplay=/>"
        document.getElementById(vm.videoId).value = ''
        vm.$refs.myQuillEditor.quill.insertEmbed(
          vm.addVideoRange != null ? parseInt(vm.addVideoRange.index) : 0,
          'video',
          videoUrl,
          Quill.sources.USER
        )
        vm.$refs.myQuillEditor.quill.setSelection(
          parseInt(vm.addVideoRange.index) + 2
        )
      })
    },
  },
}
</script>
<style lang="scss">
.quill-editor-wrapper {
  .quill {
    .ql-container {
      height: 375px;
    }
    .ql-snow {
      .ql-picker-label {
        display: flex;
      }
    }
  }
}
</style>