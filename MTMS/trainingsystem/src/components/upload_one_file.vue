<template>
    <div>
        <el-upload ref="upload" class="upload-demo" action="/file/upload" :on-preview="clickthisfile"
            :on-change="changeFile" :on-remove="handleRemove" :on-success="uploadsuccess"
            :before-upload="beforeUploadfile" :file-list="fileList" :on-progress="progressFile">
            <el-button type="primary">上传附件</el-button>
            <div slot="tip" class="el-upload__tip">PPT、EXCEL、WORD、PDF、TXT、JPG和压缩包格式，单个附件大小限制在500M以内，最多上传1个附件。</div>
        </el-upload>
        <div class="upload-submit">
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
            }
        },
        data() {
            return {
                uploadlist: [],
                fileList: [],
                fileSize: 500,
            }
        },
        watch: {
            'datalist': function (val, oldval) {
                this.init()
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.uploadlist = this.datalist;
                this.fileList = this.datalist;
            },
            //附件进度条
            progressFile(event, file, fileList) {
               
            },
            //移除文件
            handleRemove(file, fileList) {
                if (file && file.status==="success") {
                    //删除
                    this.fileList.splice(-1);
                }
            },
            //点击文件
            clickthisfile(file) {
                var tempwindow=window.open('_blank');
                tempwindow.location=file.url;
            },

            changeFile(file, list) {
                
            },
            //上传成功
            uploadsuccess(res, filelist) {
                if (res.code == 200) {
                    this.uploadlist.push(
                        {
                            url: res.data.url,
                            uri: res.data.uri,
                            name: res.data.fullname
                        }
                    );
                    this.$message({
                        type: 'success',
                        message: '上传成功'
                    });
                } else {
                    this.$message.error('文件上传失败，请重新上传！');
                }
            },
            //格式验证
            beforeUploadfile(file) {
                let initCount = this.fileList.length;
                if (initCount > 0) {
                    this.$message({
                        message: "附件最多只能上传1个",
                        type: "warning"
                    });
                    return false;
                }

                const supportTypes = ['xls', 'xlsx', 'doc', 'docx', 'ppt', 'pptx', 'pdf', 'zip', 'rar', 'txt', 'jpg', 'png', 'wps'];
                let extName = _.toLower(file.name.substring(file.name.lastIndexOf(".") + 1));
                let isLt5M = file.size / 1024 / 1024 < this.fileSize;

                if (_.indexOf(supportTypes, extName) < 0) {
                    this.$message({
                        message: "上传文件只能是 xls、doc、ppt、pdf、zip等格式!",
                        type: "warning"
                    });
                    return false;
                }

                if (!isLt5M) {
                    this.$message({
                        message: "上传文件大小不能超过 " + this.fileSize + " MB!",
                        type: "warning"
                    });
                    return isLt5M;
                }
            },
            submit() {
                if (this.fileList.length > 0) {
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