<template>
  <div>
      <el-upload
          class="upload-demo"
          action="/file/upload"
          :on-preview="clickvideo"
          :on-remove="handleRemove"
          :on-success="handleVideoSuccess"
          :before-upload="beforeUploadVideo"
          :file-list="fileList"
      >
          <el-button  type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">请点击上传附件。</div>
      </el-upload>
      <div>
          <div
              class="main-upload-video"
              v-for="(item, index) in uploadlist"
              :key="index"
          >
              <video
                  width="100%"
                  height="100%"
                  :src="
                      '/file/download2?file=' +
                      item.url +
                      '&name=' +
                      item.name
                  "
                  class="avatar"
                  controls="controls"
              ></video>
          </div>
      </div>
      <div class="upload-submit" v-if="noButton">
          <el-button type="primary" @click="submit">确定</el-button>
          <el-button @click="close">取消</el-button>
      </div>
  </div>
</template>
<script>
import { post, getCookie } from "../config/util";
export default {
  props: {
      datalist: {
          default() {
              return [];
          },
      },
      noButton: {
          default() {
             return true
          },
      },
  },
  data() {
      return {
          uploadlist: [], //展示的视频列表
          isuploadempty: false,
          fileList: [], //
      };
  },
  watch: {
      datalist: function (val, oldval) {
          console.log(val);
          // this.init()
      },
  },
  mounted() {
      this.init();
  },
  methods: {
      init() {
          if (this.datalist.length > 0) {
              this.isuploadempty = true;
          }
          this.uploadlist = this.datalist;
          this.fileList = this.datalist;
      },
      //移除文件
      handleRemove(file, fileList) {
          let _list = [];
          if (fileList.length > 0) {
              fileList.map((item) => {
                  //this.uploadlist = fileList;
                  if (item.response) {
                      _list.push({
                          url: item.response.data.url,
                          uri: item.response.data.uri,
                          name: item.response.data.fullname,
                      });
                  } else {
                      _list.push({
                          url: item.url,
                          uri: item.uri,
                          name: item.name,
                      });
                  }
              });
              this.uploadlist = _list;
          } else {
              this.uploadlist = [];
          }
      },
      //点击视频
      clickvideo(file) {},
      //上传成功
      handleVideoSuccess(res, filelist) {
          //获取上传图片地址
          this.videoUploadPercent = 0;
          let _list = [];
          if (res.code == 200) {
              this.uploadlist.push({
                  url: res.data.url,
                  uri: res.data.uri,
                  name: res.data.fullname,
              });
              this.$emit("videoUrl",this.uploadlist)
              this.$message({
                  type: "success",
                  message: "上传成功",
              });
          } else {
              this.$message.error("视频上传失败，请重新上传！");
              let _list = this.uploadlist;
              if (_list.length > 1) {
                  // for(let i = 0 ; i<_list.length ; i++){
                  //     if(_list[i].url == filelist.response.data.url){
                  //         _list.splice(i,1)
                  //     }
                  // }
              } else {
                  this.uploadlist = [];
              }
          }
      },
      //格式验证
      beforeUploadVideo(file) {
          //const isLt10M = file.size / 1024 / 1024  < 10;
          //, 'video/ogg', 'video/flv','video/avi','video/wmv','video/rmvb' //
          if (["video/mp4"].indexOf(file.type) == -1) {
              this.$message.error("请上传正确的视频格式");
              return false;
          }
          //                if (!isLt10M) {
          //                    this.$message.error('上传视频大小不能超过10MB哦!');
          //                    return false;
          //                }
      },

      submit() {
          if (this.uploadlist.length > 0 || this.isuploadempty) {
              this.$emit("uploadvideo", this.uploadlist);
          } else {
              this.$message({
                  type: "warning",
                  message: "请上传附件",
              });
          }
      },
      close() {
          this.$emit("closevideo", false);
      },
  },
};
</script>
<style scoped lang="scss">
.uploadvideostyle {
  .el-upload--picture-card {
      min-width: 330px;
      min-height: 200px;
  }
}
.main-upload-video {
  width: 45%;
  height: 240px;
  margin: 5px;
  display: inline-block;
  border: 1px dashed #d9d9d9;
  border-radius: 5px;
  padding: 5px;
}
.main-upload-video:hover {
  border-color: #409eff;
}
.upload-submit {
  clear: both;
  margin: 15px;
  float: right;
}
</style>
