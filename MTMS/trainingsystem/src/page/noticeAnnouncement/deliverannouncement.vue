<template>
    <div class="wapper">
        <div class="tools">
            <div class="funcTools">
                <el-button type="primary" @click="addresult">添加</el-button>
                <el-button type="primary" @click="batchdelete()">批量删除</el-button>
            </div>

        </div>
        <div calss="seachleft">
            <div style="text-align: left;float: left">
                <label>公告类型 </label>
                <el-select filterable v-model="queryForm.seachdelivetype" placeholder="请选择" style="width: 180px;">
                    <el-option key="-1" label="全部" value=""></el-option>
                    <el-option v-for="(item, index) in delivetypelist" :key="index" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
            </div>
        </div>
        <div class="search">

            <el-input style="width:200px" v-model="queryForm.inputquery" placeholder="请输入通知公告标题">
            </el-input>
            <el-button class="querybtn" type="primary" @click="doSelectQuery">查询</el-button>
        </div>
        <!--弹窗（上传附件）-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogAdd" :close-on-click-modal="false" @close="closeDialog('addStudentFormRef')"
            class='dialogAdd'>
            <el-form :model="dialogForm" ref="addStudentFormRef" label-width="80px">
                <el-row :gutter="22">
                    <el-col :span="23">
                        <div class="_newandedit">
                            <label><span class="red">*</span>公告标题 : </label>
                            <div>
                                <el-input style="width: 505px" v-model="noticetitle" placeholder="请输入公告标题" maxlength="20"></el-input>
                            </div>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="24">
                    <el-col :span="12">
                        <div class="_newandedit">
                            <label><span class="red">*</span>是否发布 : </label>
                            <div style="padding: 10px 0px">
                                <el-radio class="radio" v-model="isradio" label="1">启用</el-radio>
                                <el-radio class="radio" v-model="isradio" label="0">禁用</el-radio>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="_newandedit">
                            <label style="text-align: right"><span class="red">*</span>类型 : </label>
                            <div style="width: 180px;">
                                <el-select filterable v-model="delivetype" placeholder="请选择" style="width: 180px;">
                                    <el-option v-for="(item, index) in delivetypelist" :key="index" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </div>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="22">
                    <el-col :span="22">
                        <div class="_newandedit">
                            <label><span class="red">*</span>发布时间 : </label>
                            <div>
                                <el-date-picker v-model="releasetime" type="datetime" placeholder="选择日期" format="yyyy-MM-dd HH:mm:ss" @change="gettime">
                                </el-date-picker>
                            </div>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="23">
                    <el-col :span="23">
                        <div class="_newandedit" style="display: flex;">
                            <label style="width:85px;flex:0 0 auto;"><span class="red">*</span>公告内容 : </label>
                            <div style="margin-left:5px;width:calc(100% - 85px);flex:1 1 auto;">
                                <quill-editor v-model="text_content" ref="myQuillEditor" :options="editorOption" @blur="onEditorBlur($event)" @focus="onEditorFocus($event)"
                                    @change="onEditorChange($event)">
                                </quill-editor>

                            </div>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter='23'>
                    <el-col>
                        <div class="text_upload">
                            附件( 支持.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.等类型文件，200M以内 )
                        </div>
                    </el-col>
                    <el-col :span='23'>
                        <el-upload class="upload-demo" action="/file/upload" :on-preview="clickthisfile" multiple :limit="3" :on-exceed="handleExceed"
                            :on-remove="handleRemove" :before-remove="beforeRemove" :on-progress="progressFunVideo" :on-success="uploadsuccess"
                            :file-list="fileList">
                            <el-button type="primary">上传</el-button>
                        </el-upload>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-button :disabled="disabledFlag" v-if="dialogshow == 1" @click="addsave" type="primary" class="bottomBtnsSure">保存</el-button>
                    <el-button :disabled="disabledFlag" v-if="dialogshow == 2" @click="editsave" type="primary" class="bottomBtnsSure">保存</el-button>
                    <el-button :disabled="disabledFlag" @click="dialogAdd = false" class="bottomBtns">取消</el-button>
                </el-row>

            </el-form>
        </el-dialog>

        <el-dialog title="通知公告详情" :visible.sync="dialogdetail" :close-on-click-modal="false" class='dialogAdd'>
            <div style="text-align: center;">
                {{ text_title }}
            </div>
            <div style="text-align: center;">发布时间:{{ text_time }}</div>
            <div class="ql-container ql-snow">
                <div class="ql-editor">
                    <div id="text">
                    </div>
                </div>
            </div>
            <div class="fillclass">附件 : </div>
            <div v-if="item" class="fillist" v-for="(item, index) in attachs">
                <div>
                    <a target="_blank" :href="'/file/download2?file=' + fileurltitle + item.url + '&name=' + item.name">
                        {{ item.name }}
                    </a>
                </div>
            </div>

        </el-dialog>

        <div class="dataTable">
            <el-table ref="detailTable" :data="rateList" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45"></el-table-column>
                <!--<el-table-column type ="index" width = "65" label = "序号" ></el-table-column>-->
                <el-table-column prop="title" width="350" label="通知公告标题">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.title" placement="top">
                                <span>
                                    {{ scope.row.title }}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="type" label="公告类型" width="110">
                    <template slot-scope="scope">
                        <template v-if="scope.row.type == 2">通知公告</template>
                        <template v-if="scope.row.type == 3">政策文件</template>
                        <template v-if="scope.row.type == 7">下载专区</template>
                        <template v-if="scope.row.type == 8">教学活动安排</template>
                        <template v-if="scope.row.type == 9">招录通知</template>

                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <template v-if="scope.row.status == 1">启用</template>
                        <template v-if="scope.row.status == 0">禁用</template>
                    </template>
                </el-table-column>
                <el-table-column prop="publisher" label="发布人"></el-table-column>
                <el-table-column prop="release_time" width="160" label="发布时间"></el-table-column>
                <el-table-column width="200" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="detail(scope.$index, scope.row)" type="text" size="small">查看</el-button>
                        <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">修改</el-button>
                        <el-button @click="singledelete(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                        <el-button @click="disableRole(scope.$index, scope.row)" type="text" size="small" v-if='scope.row.status == "0"'>启用</el-button>
                        <el-button @click="disableRole(scope.$index, scope.row)" type="text" size="small" v-if='scope.row.status == "1"'>禁用</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageno" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import { post, getCookie } from '../../config/util'
    import { mapState, mapActions } from 'vuex'
    import moment from 'moment'
    import { quillRedefine } from 'vue-quill-editor-upload'
    import { quillEditor } from 'vue-quill-editor'
    const _ = require('lodash');

    export default {
        components: { quillEditor, quillRedefine },
        data() {
            return {
                //上传文件
                fileurltitle: '',
                fileSize: 200,
                videoFlag: false,//进度条显示隐藏;
                flag: 1,
                fileList: [],
                sucessfilelist: [],
                videoUploadPercent: 0,
                uploadData: {
                    _upload_data: JSON.stringify({
                        "1": {
                            command: 'turntrain/importteachertrainedlist',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                        }
                    })
                },
                //筛选
                queryForm: {
                    seachdelivetype: '',
                    inputquery: '',
                },
                delivetype: '',
                delivetypelist: [
                    {
                        label: '通知公告',
                        value: 2
                    },
                    {
                        label: '政策文件',
                        value: 3
                    },
                    {
                        label: '教学活动安排',
                        value: 8
                    },
                    {
                        label: "下载专区",
                        value: 7
                    },
                    {
                        label: "招录通知",
                        value: 9
                    }
                ],
                text_title: '',
                text_time: '',
                //弹窗
                dialogTitle: '',
                dialogAdd: false,
                noticetitle: '', //公告标题
                isradio: '',		//是否启用
                releasetime: '',	//发布时间
                text_content: '',//发布内容
                editid: '',
                dialogForm: {		//知道

                },
                attachs: '',//附件
                dialogshow: '',//1增加；2编辑
                turnplanflag: true,
                dialogdetail: false,//通知公告详情
                //富文本编辑
                editorOption: {},  // 必须初始化为对象 init  to Object,
                rateList: [],
                pageno: 1,
                pagesize: 10,
                totalCount: 0,
                deletelist: [],
                content: '',
                usePage: false,
                systype: '',//1住院医；2实习生
                disabledFlag: false,
            }
        },
        computed: {
        },
        created() {
            this.editorOption = quillRedefine(
                {
                    // 图片上传的设置
                    uploadConfig: {
                        action: '/file/upload',  // 必填参数 图片上传地址
                        // 必选参数  res是一个函数，函数接收的response为上传成功时服务器返回的数据
                        // 你必须把返回的数据中所包含的图片地址 return 回去
                        res: (respnse) => {
                            //	//console.log('255',respnse)
                            return respnse.data.url
                        },
                        methods: 'POST',  // 可选参数 图片上传方式  默认为post
                        token: sessionStorage.token,  // 可选参数 如果需要token验证，假设你的token有存放在sessionStorage
                        name: 'file',  // 可选参数 文件的参数名 默认为img
                        size: 500,  // 可选参数   图片限制大小，单位为Kb, 1M = 1024Kb
                        accept: 'image/png, image/gif, image/jpeg, image/bmp, image/x-icon',  // 可选参数 可上传的图片格式
                        // start: function (){}
                        start: () => {
                        },  // 可选参数 接收一个函数 开始上传数据时会触发
                        end: () => {
                        },  // 可选参数 接收一个函数 上传数据完成（成功或者失败）时会触发
                        success: () => {
                        },  // 可选参数 接收一个函数 上传数据成功时会触发
                        error: () => {
                        }  // 可选参数 接收一个函数 上传数据中断时会触发
                    },
                    /*  // 以下所有设置都和vue-quill-editor本身所对应
                      placeholder: '',  // 可选参数 富文本框内的提示语
                      theme: '',  // 可选参数 富文本编辑器的风格
                      toolOptions: [],  // 可选参数  选择工具栏的需要哪些功能  默认是全部
                      handlers: {}  // 可选参数 重定义的事件，比如link等事件*/

                }
            )
        },
        mounted() {
            this.systype = this.$route.query.type;
            this.inittable(1, 10, '', '')
        },
        watch: {

        },
        methods: {
            //附件进度条
            progressFunVideo(event, file, fileList) {
                this.videoFlag = true;
                this.videoUploadPercent = Number(file.percentage.toFixed(0));
            },
            onEditorBlur() {//失去焦点事件
                ////console.log('失焦')
            },
            onEditorFocus() {//获得焦点事件
                //	//console.log('获取焦点')
            },
            onEditorChange() {//内容改变事件
                let self = this;
            },

            //上传附件
            /*文件上传区域*/
            handleRemove(file, fileList) {		//	文件列表移除文件时的钩子
                let self = this;
                self.flag = 0;
                if (fileList.length > 0) {
                    self.sucessfilelist = fileList;
                } else {
                    self.sucessfilelist = [];
                    self.fileList = [];
                }

            },
            beforeRemove(file, fileList) {		//移除文件之前的钩子
                return this.$confirm(`确定移除 ${file.name}？`);
            },
            clickthisfile: function (file) {		//点击已上传的文件
                //console.log(file);
            },
            handleExceed(file, fileList) {	//文件超出限制
                let isLt2M = file.size / 1024 / 2014 < this.fileSize;
                if (!isLt2M) {
                    this.$message({
                        message: "上传文件大小不能超过 " + this.fileSize + " MB!",
                        type: "warning"
                    });
                    return isLt2M;
                }

                this.$message({
                    showClose: true,
                    message: '最多能一次上传3个文件！',
                    type: 'warning'
                });
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            uploadsuccess: function (response, file, fileList) {
                //    console.log(response)
                var self = this;
                this.videoFlag = false;
                if (response.code == 200) {
                    self.sucessfilelist = fileList;
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请上传文件'
                    })
                }
                /*if(self.flag){
                    self.sucessfilelist.push(fileList);
                }else {
                    self.sucessfilelist.push(fileList);
                    for(var i = 0;i<self.sucessfilelist.length;i++){
                        if(self.sucessfilelist[i].url == fileList.url){
                            self.sucessfilelist.splice(i,1);
                        //	//console.log('成功后处理过',self.sucessfilelist)
                            return
                        }
                    }
                }*/
            },

            //启动禁用
            disableRole: function (index, row) {
                let self = this;
                if (row.status == 0) {
                    var rolestatus = 1
                } else if (row.status == 1) {
                    var rolestatus = 0
                }
                self.$confirm('确定更改公告状态吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/consult/updatestatus', {
                        command: 'consult/updatestatus',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        status: rolestatus,//0禁1启
                        id: row.id,
                        type: row.type,
                        systemtype: self.systype,   //1-技能中心，2-住陪轮转，3-实习轮转
                    }).then(function (data) {
                        if (data && data.errcode == 0) {
                            self.$message({
                                message: '修改成功',
                                type: 'success'
                            });
                            self.inittable(self.pageno, self.pagesize, '', '');
                            self.dialogAdd = false;
                        } else {
                            self.$message({
                                message: data.errdesc,
                                type: 'warning'
                            });
                        }
                    }).catch(function (error) {
                        //console.log(error)
                    })
                }).catch(() => {
                    /*self.$message({
                        type: 'info',
                        message: '已取消更改'
                    });*/
                });

            },

            addresult: function () {			//增加成绩
                let self = this;
                self.dialogAdd = true;
                self.turnplanflag = true;
                self.dialogTitle = '添加';
                self.dialogshow = 1;
                self.flag = 1;
                self.noticetitle = '';   //公告标题
                self.isradio = '';		//是否启用
                self.releasetime = '';	//发布时间
                self.text_content = '';  //发布内容
                self.delivetype = '';
                self.fileList = [];
            },
            closeDialog(formName) {
                this.$refs[formName].resetFields();
            },
            detailcloseDialog(formName) {
                this.$refs[formName].resetFields();
            },

            gettime: function (date) {			//选取时间段
                //	let self = this;
                //	self.time = date;
                //	self.releasetime = this.time;
                //	//console.log(self.releasetime)
            },

            //增加保存提交
            addsave: function () {
                let self = this;
                var _uploadfilelist = [];
                if (self.sucessfilelist.length > 0) {
                    for (var i = 0; i < self.sucessfilelist.length; i++) {
                        _uploadfilelist.push(
                            {
                                'url': self.sucessfilelist[i].response.data.uri,
                                'name': self.sucessfilelist[i].response.data.fullname
                            }
                        )
                    }
                }

                if (self.noticetitle == '') {
                    self.$message({
                        message: '请输入公告标题!',
                        type: 'warning'
                    });
                } else if (self.isradio == '') {
                    self.$message({
                        message: '请选择是否启用!',
                        type: 'warning'
                    });
                } else if (!self.delivetype) {
                    self.$message({
                        message: '请选择公告类型!',
                        type: 'warning'
                    });
                } else if (self.releasetime == '') {
                    self.$message({
                        message: '请选择发布时间!',
                        type: 'warning'
                    });
                } else if (self.text_content == '') {
                    self.$message({
                        message: '请输入发布内容!',
                        type: 'warning'
                    });
                } else {
                    self.disabledFlag = true;
                    post('/consult/add', {
                        command: 'consult/add',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        title: self.noticetitle,
                        status: self.isradio,//0禁1启
                        release_time: moment(self.releasetime).format('YYYY-MM-DD HH:mm:ss'),
                        content: self.text_content,
                        attachs: _uploadfilelist,//附件
                        publisher: getCookie('uid'),//发布人 创建人
                        type: self.delivetype,//公告类型
                        systemtype: this.systype,   //1-技能中心，2-住陪轮转，3-实习轮转
                        if_link: 1,
                    }).then(function (data) {
                        if (data && data.errcode == 0) {
                            //		//console.log(data)
                            self.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            self.inittable(self.pageno, self.pagesize, '', '');
                            self.dialogAdd = false;
                            setTimeout(function () {
                                self.disabledFlag = false;
                            }, 500)
                        } else {
                            self.$message({
                                message: data.errdesc,
                                type: 'warning'
                            });
                            self.disabledFlag = false;
                        }
                    }).catch(function (error) {
                        //console.log(error)
                        //self.disabledFlag = false;
                    })
                }
            },

            doSelectQuery: function () {//查询方法
                let self = this;
                self.pageno = 1;//使每次搜索都是从第一页开始
                self.inittable(self.pageno, self.pagesize, self.queryForm.seachdelivetype, self.queryForm.inputquery)
            },
            inittable: function (pageno, pagesize, delivetype, inputquery) {
                let self = this;
                let page = 1;
                if (this.usePage) {
                    page = this.pageno;
                } else {
                    this.pageno = 1;
                }
                post('/consult/list', {
                    command: 'consult/list',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    pageno: page,
                    pagesize: this.pagesize,
                    type: delivetype,//公告类型
                    title: inputquery,
                    flag: 1,
                    systemtype: self.systype//1-技能中心，2-住陪轮转，3-实习轮转
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.rateList = data.consultlist;
                        self.totalCount = data.allcount;
                        //请求成功后，
                        self.usePage = false;
                    }
                }).catch(function (error) {
                    //请求失败
                    self.usePage = false;
                })
            },

            detail: function (index, row) {
                let self = this;
                self.dialogdetail = true;
                post('/consult/detail', {
                    command: 'consult/detail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: row.id,
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.fileurltitle = data.web_domain;
                        document.getElementById('text').innerHTML = ""
                        self.text_title = data.title
                        self.text_time = data.release_time
                        document.getElementById('text').innerHTML = data.content
                        self.attachs = data.attachs;
                    }
                }).catch(function (error) {
                    //console.log(error)
                })
            },
            /*编辑区*/
            edit: function (index, row) {
                let self = this;
                self.dialogAdd = true;
                self.hospitalnumber = '';
                self.turnplanflag = false;
                self.dialogTitle = '编辑';
                self.dialogshow = 2;
                self.fileList = [];
                post('/consult/detail', {
                    command: 'consult/detail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: row.id,
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.noticetitle = data.title; //公告标题
                        self.isradio = String(data.status);		//是否启用
                        self.delivetype = data.type;
                        self.releasetime = moment(data.release_time).format();	//发布时间
                        self.text_content = data.content;//发布内容
                        self.editid = data.id;		//编辑id
                        self.fileList = data.attachs;	//附件
                        //	//console.log('编辑时查看的附件',self.fileList)
                    }
                }).catch(function (error) {
                    //console.log(error)
                })

            },

            editsave: function () {
                let self = this;
                let _uploadfilelist = [];
                if (self.noticetitle == '') {
                    self.$message({
                        message: '请输入公告标题!',
                        type: 'warning'
                    });
                } else if (self.isradio == '') {
                    self.$message({
                        message: '请选择是否启用!',
                        type: 'warning'
                    });
                } else if (self.releasetime == '' || !self.releasetime) {
                    self.$message({
                        message: '请选择发布时间!',
                        type: 'warning'
                    });
                } else if (self.text_content == '') {
                    self.$message({
                        message: '请输入发布内容!',
                        type: 'warning'
                    });
                } else {
                    self.disabledFlag = true;
                    if (self.sucessfilelist.length > 0) {
                        for (var i = 0; i < self.sucessfilelist.length; i++) {
                            if (self.sucessfilelist[i].response) {
                                _uploadfilelist.push(
                                    {
                                        'url': self.sucessfilelist[i].response.data.uri,
                                        'name': self.sucessfilelist[i].response.data.fullname
                                    }
                                )
                            } else {
                                _uploadfilelist.push(
                                    {
                                        'url': self.sucessfilelist[i].url,
                                        'name': self.sucessfilelist[i].name
                                    }
                                )
                            }
                        }

                    } else {
                        _uploadfilelist = self.fileList
                    };
                    post('/consult/edit', {
                        command: 'consult/edit',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        id: self.editid,
                        title: self.noticetitle,
                        status: self.isradio,//0禁1启
                        release_time: moment(self.releasetime).format('YYYY-MM-DD HH:mm:ss'),
                        content: self.text_content,
                        attachs: _uploadfilelist,//附件
                        updater: getCookie('uid'),//修改人
                        type: self.delivetype,
                        if_link: 1,
                        systemtype: this.systype,   //1-技能中心，2-住陪轮转，3-实习轮转
                    }).then(function (data) {
                        if (data && data.errcode == 0) {
                            self.$message({
                                message: '编辑成功',
                                type: 'success'
                            });
                            self.usePage = true;
                            self.inittable(self.pageno, self.pagesize, '', '');
                            self.dialogAdd = false;
                            setTimeout(function () {
                                self.disabledFlag = false;
                            }, 500)
                        } else {
                            self.$message({
                                message: data.errdesc,
                                type: 'warning'
                            });
                            setTimeout(function () {
                                self.disabledFlag = false;
                            }, 800)
                        }
                    }).catch(function (error) {
                        self.disabledFlag = false;
                    })
                }
            },

            /*分页区*/
            handleSizeChange(size) {
                this.pagesize = size;
                this.inittable(this.pageno, this.pagesize, this.queryForm.seachdelivetype, this.queryForm.inputquery);
            },
            handleCurrentChange(currentPage) {
                this.pageno = currentPage;
                this.usePage = true;
                this.inittable(this.pageno, this.pagesize, this.queryForm.seachdelivetype,
                    this.queryForm.inputquery);
            },
            //删除和批量删除
            singledelete: function (index, row, batch) {	//单个删除
                let self = this;
                self.$confirm('确定删除吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/consult/delete', {
                        command: 'consult/delete',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        ids: row.id,
                    }).then(function (data) {
                        if (data && data.errcode == 0) {
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.inittable(self.pageno, self.pagesize, '', '')
                        }
                    }).catch(function (error) {
                        //console.log(error)
                    })
                }).catch(() => {
                    self.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            handleSelectionChange: function (item) {//全选的方法
                let self = this;	//0未开始1进行中2已结束
                self.deletelist = [];
                for (var i = 0; i < item.length; i++) {
                    //	//console.log(item)
                    self.deletelist.push(item[i].id)
                }
            },
            batchdelete: function () {		//批量删除
                let self = this;
                if (self.deletelist.length == 0) {
                    self.$message({
                        showClose: true,
                        message: '请先勾选多项需要删除的数据！',
                        type: 'warning'
                    });
                    return;
                } else if (self.deletelist.length < 2) {
                    self.$message({
                        showClose: true,
                        message: '请最少选择两条数据！',
                        type: 'warning'
                    });
                    return;
                } else {
                    self.$confirm('确定批量删除数据吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        post('/consult/delete', {
                            command: 'consult/delete',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            ids: self.deletelist.toString(),	//成绩id
                        }).then(function (data) {
                            if (data && data.errcode == 0) {
                                self.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                self.inittable(self.pageno, self.pagesize, '', '')
                            }
                        }).catch(function (error) {
                            //console.log(error)
                        })
                    }).catch(() => {
                        self.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });

                }
            }
        }
    }
</script>
<style scoped>
    .wapper {
        padding: 0 20px;
    }

    .tools {
        height: 50px;
    }

    .funcTools {
        float: left;
    }

    .seachleft {
        float: left;

    }

    .search {
        float: right;
        margin-bottom: 15px;
    }

    .queryTools {
        float: left;
        width: 100%;
    }

    .queryAll {
        float: left;
        margin-right: 12px;
    }

    .queryTools .el-form-item {
        width: 190px;
        margin-bottom: 10px;
    }

    .funcBtns {
        width: 80px;
        float: left;
    }

    .el-select {
        width: 120px;
    }

    .import-popup {
        font-size: 20px;
    }

    .footerBtn {
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .tip-circle {
        display: inline-block;
        margin-right: 10px;
        width: 30px;
        height: 30px;
        font-size: 28px;
        text-align: center;
        color: white;
        background-color: #58b7ff;
        border-radius: 30px;
    }

    .import-popup-btn {
        position: relative;
        left: 10px;
        top: -2px;
    }

    .import-popup-btn a {
        color: #fff;
    }

    .right {
        margin-left: 10px;
    }

    .elRowStyle {
        overflow-x: hidden;
    }

    .upload-demo {
        margin: 0px 15px;
    }

    /*弹窗内容样式*/
    .red {
        color: red;
    }

    ._newandedit {
        width: 100%;
        margin: 8px 0px;
    }

    ._newandedit .row {
        display: flex;
        margin-top: 10px;
    }

    ._newandedit label {
        width: 85px;
        text-align: left;
        display: inline-block;
    }

    ._newandedit>.el-input {
        display: inline-block;
    }

    ._newandedit>div>.el-select {
        width: calc(100% - 100px);
    }

    ._newandedit>div {
        display: inline-block;
        /*width:80%;*/
    }

    .row label {
        flex: 3;
        display: flex;
        justify-content: flex-end;
        align-items: center;
    }

    .row>div {
        flex: 7;
    }

    .bottomBtnsSure {
        margin-left: 69%;
    }

    .text_upload {
        margin: 10px 85px;
    }

    .upload-demo {
        margin: 10px 85px;
    }

    .querybtn {
        margin-left: 20px;
        display: inline-block;
    }

    .fillclass {
        margin: 10px 0px;
    }

    .fillist>div>a {
        color: #20a0ff;
        margin: 0px 0px 5px 0px;
    }
</style>