<template>
   <div style="height:170px">
    <div  v-if="onlyone">
        <el-upload class="upload-demo" action="/file/upload" :on-preview="clickthisfile" multiple :on-remove="handleRemove"
            :on-success="uploadsuccess" :before-upload="beforeUploadfile" :file-list="fileList">
            <el-button type="primary">上传附件</el-button>
            <div slot="tip" class="el-upload__tip">PPT、EXCEL、WORD、PDF、TXT、JPG和压缩包格式，单个附件大小限制在200M以内，最多上传3个附件。</div>
        </el-upload>
    </div>
    <div  v-else>
        <el-upload class="upload-demo" action="/file/upload" :on-preview="clickthisfile" multiple :on-remove="handleRemove"
            :on-success="uploadsuccess" :on-change="handleChange" :before-upload="beforeUploadfile1" :file-list="fileList" :limit="limit">
            <el-button type="primary">上传活动记录</el-button>
            <div slot="tip" class="el-upload__tip">PPT、EXCEL、WORD、PDF、TXT、JPG和压缩包格式，单个附件大小限制在200M以内，最多上传1个附件。</div>
        </el-upload>
    </div>
    <div class="upload-submit" v-if="noButton">
        <el-button type="primary" @click="submit">确定</el-button>
        <el-button @click="close">取消</el-button>
    </div>
  </div>
</template>
<script>
import { post, getCookie } from '../config/util'
export default {
    props: {
        datalist: {
            default() {
                return []
            }
        },
        noButton: {
            default() {
                return true
            },
        },
        onlyone: {
            default() {
                return true
            },
        },
        limit: {
            default() {
                return 99
            },
        }
    },
    data() {
        return {
            videoUploadPercent: 0,
            videoFlag: false,
            uploadlist: [], //展示的视频列表
            fileList: [],   //
            fileSize: 200,
            isuploadempty: false,
        }
    },
    watch: {
        'datalist': function (val, oldval) {
            this.fileList = []
            this.init()
        }
    },
    mounted() {
        this.init();
    },
    methods: {
        handleChange(file, fileList) {      
            fileList = fileList.length > 1 ? fileList.slice(1) : fileList
            this.fileList = [file]
            console.log(file,fileList)
        
        },
        init() {
            if (this.datalist.length > 0) {
                this.isuploadempty = true;
            }
            this.uploadlist = this.datalist;
            this.fileList = this.datalist;
        },
        //附件进度条
        progressFunVideo(event, file, fileList) {
            this.videoFlag = true;
            this.videoUploadPercent = Number(file.percentage.toFixed(0));
        },
        //移除文件
        handleRemove(file, fileList) {
            this.fileList = fileList;
        },
        //点击文件
        clickthisfile(file) {
        },
        //上传成功
        uploadsuccess(res, filelist) {                               //获取上传图片地址
            
            this.videoUploadPercent = 0;
            let _list = [];
            if (res.code == 200) {
                this.videoFlag = false;
                if (this.limit == 2) {
                    this.uploadlist = []
                }
                this.uploadlist.push(
                    {
                        url: res.data.url,
                        uri: res.data.uri,
                        name: res.data.fullname
                    },
                );
                console.log(111,this.uploadlist)
                this.$emit("fileUrl", this.uploadlist);
                this.$message({
                    type: 'success',
                    message: '上传成功'
                });
            } else {
                this.$message.error('文件上传失败，请重新上传！');
                this.videoFlag = false;
            }
        },
        //格式验证
        beforeUploadfile(file) {
            let initCount = this.fileList.length;
            if (initCount > 2) {
                this.$message({
                    message: "附件最多只能上传三张",
                    type: "warning"
                });
                return false;
            }
            // accept=".doc,.docx,.jpg,.jpeg,.png,.PNG,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.dps,.dpt,.pptx,.ppt,.pot,.pps,
            // .xlsx,.xlsm,.xml,.xlr,.mp4,.mov,.mpg,.avi,.rm"
            const supportTypes = ['xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf', 'zip', 'txt', 'jpg', 'wps'];
            let extName = _.toLower(file.name.substring(file.name.lastIndexOf(".") + 1));
            let isLt2M = file.size / 1024 / 2014 < this.fileSize;

            if (_.indexOf(supportTypes, extName) < 0) {
                this.$message({
                    message: "上传文件只能是 xls、doc、ppt、pdf、zip等格式!",
                    type: "warning"
                });
                return false;
            }

            if (!isLt2M) {
                this.$message({
                    message: "上传文件大小不能超过 " + this.fileSize + " MB!",
                    type: "warning"
                });
                return isLt2M;
            }
        },
        beforeUploadfile1(file) {
            // let newfileList=[]
            // if( this.fileList.length>1 ){
            //     newfileList=this.fileList.splice(0,1);
            //     }
            //     this.fileList=newfileList;    
            // accept=".doc,.docx,.jpg,.jpeg,.png,.PNG,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDF,.dps,.dpt,.pptx,.ppt,.pot,.pps,
            // .xlsx,.xlsm,.xml,.xlr,.mp4,.mov,.mpg,.avi,.rm"
            const supportTypes = ['xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf', 'zip', 'txt', 'jpg', 'wps'];
            let extName = _.toLower(file.name.substring(file.name.lastIndexOf(".") + 1));
            let isLt2M = file.size / 1024 / 2014 < this.fileSize;

            if (_.indexOf(supportTypes, extName) < 0) {
                this.$message({
                    message: "上传文件只能是 xls、doc、ppt、pdf、zip等格式!",
                    type: "warning"
                });
                return false;
            }

            if (!isLt2M) {
                this.$message({
                    message: "上传文件大小不能超过 " + this.fileSize + " MB!",
                    type: "warning"
                });
                return isLt2M;
            }
        },
        //   changeFile1(file,fileList){
        //     if( fileList.length>1 ){
        //         fileList.splice(0,1);
        //         }
        //         this.fileList=fileList;
        // },

        submit() {
            if (this.fileList.length > 0 || this.isuploadempty) {
                
                this.$emit('uploadfile', this.fileList)
            } else {
                this.$message({
                    type: 'warning',
                    message: '请上传附件'
                });
            }

        },
        close() {
            this.$emit("closefile", false)
        }
    },
}
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
