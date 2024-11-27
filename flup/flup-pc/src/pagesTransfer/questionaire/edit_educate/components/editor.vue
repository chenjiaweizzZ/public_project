<template>
  <div>
    <!-- <SelectImg class="insert-btn-wrapper" text="插入图片" @on-select="onImgInsert"></SelectImg> -->
    <editor id="tinymce" ref="tinymce" v-model="content" :init="init" :baseUrl="baseUrl"></editor>
  </div>
</template>

<script>
import SelectImg from './select_img'
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver'

import 'tinymce/plugins/image' // 插入上传图片插件
import 'tinymce/plugins/media' //插入上传视频插件
import 'tinymce/plugins/table' // 插入表格插件
import 'tinymce/plugins/lists' // 列表插件
import 'tinymce/plugins/wordcount' // 字数统计插件
import 'tinymce/plugins/code' // html代码
import 'tinymce/plugins/searchreplace' // 查找替换插件
import 'tinymce/plugins/hr' // 分割线插件
import 'tinymce/plugins/link' // 链接插件
import 'tinymce/plugins/preview' // 预览插件
import 'tinymce/plugins/fullscreen' // 网页全屏插件
import 'tinymce/plugins/advlist' // 有序无序列表插件
import 'tinymce/plugins/autosave' // 自动保存插件

import path from 'path'
export default {
  props: ['value'],
  components: {
    Editor,
    SelectImg,
  },
  mounted() {
    let self = this
    tinymce.init({})
  },
  watch: {
    content(val) {
      this.$emit('input', val)
    },
    value(val) {
      this.content = val
    },
  },
  data() {
    return {
      content: this.value,
      baseUrl: this.$parent.$baseURL.ICDMApiUrl,
      init: {
        language_url: './static/tinymce/langs/zh_CN.js', // 语言包的路径
        language: 'zh_CN', //语言
        relative_urls: true,
        convert_urls: false,
        skin_url: './static/tinymce/skins/ui/oxide', // skin路径
        height: 500, //编辑器高度
        branding: false, //是否禁用“Powered by TinyMCE”
        menubar: false, //顶部菜单栏显示
        fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
        font_formats:
          '宋体=宋体;黑体=黑体;仿宋=仿宋_GB2312;楷体=楷体_GB2312;隶书=隶书;幼圆=幼圆;微软雅黑=microsoft yahei;Andale Mono=andale mono,monospace;Arial=arial,helvetica,sans-serif;Arial Black=arial black,sans-serif;Book Antiqua=book antiqua,palatino,serif;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier,monospace;Georgia=georgia,palatino,serif;Helvetica=helvetica,arial,sans-serif;Impact=impact,sans-serif;Symbol=symbol;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco,monospace;Times New Roman=times new roman,times,serif;Trebuchet MS=trebuchet ms,geneva,sans-serif;Verdana=verdana,geneva,sans-serif;Webdings=webdings;Wingdings=wingdings,zapf dingbats',
        toolbar: [
          'forecolor backcolor image media bold italic underline strikethrough removeformat subscript superscript searchreplace bullist numlist alignleft aligncenter alignright outdent indent blockquote undo redo code hr link preview table fullscreen',
          'fontsizeselect fontselect formatselect',
        ],
        plugins: [
          'image media code hr link preview table fullscreen wordcount searchreplace advlist autosave lists',
        ],
        image_uploadtab: true,
        images_upload_handler: function (blobInfo, success, failure) {
          let filename = blobInfo.filename()
          let index = filename.lastIndexOf('.')
          let type = filename.substring(index + 1, filename.length)
          success('data:image/' + type + ';base64,' + blobInfo.base64())
        },
        media_live_embeds: true,
        file_picker_types: 'media',
        file_picker_callback: function (cb, value, meta) {
          let baseUrl = document.getElementById('tinymce').attributes['baseurl']
            .value
          if (meta.filetype == 'media') {
            //创建一个隐藏的type=file的文件选择input
            let input = document.createElement('input')
            input.setAttribute('type', 'file')
            input.setAttribute('accept', 'video/*')
            input.onchange = function () {
              let file = this.files[0]

              var xhr, formData
              xhr = new XMLHttpRequest()
              xhr.open('POST', baseUrl + '/file/upload')
              xhr.withCredentials = self.credentials
              xhr.upload.onprogress = function (e) {}
              xhr.onerror = function () {
                console.log(xhr.status)
                return
              }
              xhr.onload = function () {
                let json
                if (xhr.status < 200 || xhr.status >= 300) {
                  console.log('HTTP 错误: ' + xhr.status)
                  return
                }
                json = JSON.parse(xhr.responseText)
                //假设接口返回JSON数据为{status: 0, msg: "上传成功", data: {location: "/localImgs/1546434503854.mp4"}}
                if (json.retCode == 0) {
                  //接口返回的文件保存地址
                  let mediaLocation = baseUrl + '/file/video/' + json.retData.id
                  //cb()回调函数，将mediaLocation显示在弹框输入框中
                  cb(mediaLocation, { title: file.name })
                  return
                } else {
                  console.log(json.msg)
                  return
                }
              }
              formData = new FormData()
              //假设接口接收参数为file,值为选中的文件
              formData.append('file', file)
              xhr.send(formData)
            }
            //触发点击
            input.click()
          }
        },
        media_url_resolver: function (data, resolve /*, reject*/) {
          let content =
            ' <video src="' +
            data.url +
            '" width="100%" height="100%" controls="controls">' +
            '<source src="' +
            data.url +
            '" /></video>'
          resolve({ html: content })
        },
      },
    }
  },
  methods: {
    // onImgInsert(data) {
    //   tinymce
    //     .get("tinymce")
    //     .insertContent(`<img class="wscnph" src="${data}" >`);
    // }
  },
}
</script>

<style lang="scss" scoped>
.insert-btn-wrapper {
  z-index: 2;
  position: absolute;
  top: 0;
  right: 5px;
}
</style>
