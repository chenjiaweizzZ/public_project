<template>
    <div class="wapper">
        <div class="tools">
            <div class="funcTools">
                <el-button type="primary" @click="addresult">添加</el-button>
                <el-button type="primary" @click="batchdelete()">批量删除</el-button>
                <el-button type="primary" @click="dialogTableVisible=true">批量导入</el-button>
                <el-button type="primary" @click="exportData()">批量导出</el-button>
            </div>
        </div>

        <!--批量导入-->
        <el-dialog title="" :visible.sync="dialogTableVisible">
            <div class="import-popup">
                <div>
                    <span class="tip-circle">1</span>
                    <span>下载请假管理模板，批量填写请假单</span>
                    <span>
                        <el-button type="primary" class="import-popup-btn" @click="downloadModel">下载</el-button>
                    </span>
                </div>
                <div>
                    <div>
                        <span class="tip-circle">2</span><span>上传填写好的请假单</span>
                    </div>
                    <div>
                        <el-upload style="display:inline-block;margin:10px 40px" action="/service-pub/import/importExcel" ref="upload" :file-list="fileList"
                            :data="uploadData" :show-file-list="true" :auto-upload="false" :before-upload='checkFile' :on-change="changeFile"
                            :on-success="uploadmodelSuccess" :on-progress="onProgress">
                            <el-button type="primary">选择文件</el-button>
                        </el-upload>
                        <!--
                         :on-change="changeFile"
                        -->
                    </div>
                </div>
                <div style="margin:10px auto;width:60px">
                    <el-button type="primary" @click="submitUpload">上传</el-button>
                </div>
            </div>
        </el-dialog>

        <div class="queryTools">
            <div class="queryAll">
                <el-button type="text" @click="queryAll">全部</el-button>
            </div>
            <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="70px" class="flexForm">
                <el-form-item label="专业基地">
                    <el-select v-model="hosBaseDeptName" placeholder="请选择基地" :popper-append-to-body="false" collapse-tags @clear="clearall" clearable>
                        <el-option label="全部" value="" @click.native="clearall"></el-option>
                        <el-option disabled class="baseOption" value=""></el-option>
                            <el-tree :data="hosBaseTree" :props="defaultProps" ref="tree" check-strictly node-key="id" @node-click="handleNodeClick"
                                class="hosWithNoCheckBox">
                            </el-tree>
                        
                    </el-select>
                </el-form-item>
                <el-form-item label="请假类型">
                    <el-select filterable v-model="queryForm.leavetype" placeholder="请选择请假类型">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item,index) in leavetypelist" :key="item.index" :label="item.name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="请假日期" style="width: 350px;">
                    <el-date-picker style="width: 133px" v-model="queryForm.startime" type="date" placeholder="请假开始日期" format="yyyy-MM-dd" @change="getstartime">
                    </el-date-picker>
                    -
                    <el-date-picker style="width: 133px" v-model="queryForm.endtime" type="date" placeholder="请假结束日期" format="yyyy-MM-dd" @change="getendtime">
                    </el-date-picker>
                </el-form-item>

                <el-input style="width:180px" v-model="queryForm.inputquery" placeholder="请输入姓名或学号" @keyup.enter.native="doSelectQuery"></el-input>

                <el-button class="querybtn" type="primary" @click="doSelectQuery">查询</el-button>
            </el-form>
        </div>

        <!--弹窗-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogfrom" :close-on-click-modal="false" @close="dialogfrom = false " class='dialogAdd'>
            <el-form :model="dialogForm" label-width="80px" v-loading.body="loading" element-loading-text="数据处理中">
                <el-row :gutter="23">
                    <el-col :span="12">
                        <div class="newandedit">
                            <label><span class="red">*</span>姓名 : </label>
                            <div v-if="dialogshow == 1 || dialogshow == 2">
                                <!--v-if="dialogshow == 1"增加 2编辑 3查看 -->
                                <el-select v-model="dialogseachname" :disabled="editdisabled" filterable remote placeholder="请输入姓名搜索" :remote-method="queryStuByMobile">
                                    <el-option v-for="item in stunumoptionlist" :key="item.id" :label="item.name + ' - ' + item.username " :value="item.id">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-if="dialogshow == 3">
                                {{detailname}}
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="newandedit">
                            <label><span class="red">*</span>考勤类型 : </label>
                            <div v-if="dialogshow == 1 || dialogshow == 2">
                                <el-select filterable v-model="dialogForm.leavetype" placeholder="请选择考勤类型">
                                    <el-option v-for="(item,index) in leavetypelist" :key="item.index" :label="item.name" :value="item.key">
                                    </el-option>
                                </el-select>
                            </div>
                            <div v-if="dialogshow == 3">{{detailForm.leavetypename}}</div>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="22">
                    <el-col :span="12">
                        <div class="newandedit">
                            <label><span class="red">*</span>请假开始时间 : </label>
                            <div v-if="dialogshow == 1 || dialogshow == 2">
                                <el-date-picker :disabled="startimedisabled" v-model="dialogForm.leavestardate" @change="getdialogstartime" type="date" placeholder="请选择请假开始日期"
                                    value-format="yyyy-MM-dd">
                                </el-date-picker><!-- 09-28 去除请假时间限制:picker-options="pickerOptions"-->
                            </div>
                            <div v-if="dialogshow == 3">{{detailForm.startdatestr}}</div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="newandedit">
                            <label><span class="red">*</span>请假结束时间 : </label>
                            <div v-if="dialogshow == 1 || dialogshow == 2">
                                <el-date-picker v-model="dialogForm.leaveenddate" @change="getdialogendtime" type="date" placeholder="请选择请假结束日期" value-format="yyyy-MM-dd">
                                </el-date-picker>
                            </div>
                            <div v-if="dialogshow == 3">{{detailForm.enddatestr}}</div>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="23">
                    <el-col :span="24">
                        <div class="newandedit">
                            <label>说明 : </label>
                            <div v-if="dialogshow == 1 || dialogshow == 2">
                                <el-input type="textarea" maxlength="200" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入请假原因" style="min-width: 510px;"
                                    v-model="dialogForm.remark">
                                </el-input>
                            </div>
                            <div v-if="dialogshow == 3">{{detailForm.remark}}</div>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-button v-if="dialogshow == 1" @click="addsaveform" type="primary" class="bottomBtnsSure">保存</el-button>
                    <el-button v-if="dialogshow == 2" @click="editsaveform" type="primary" class="bottomBtnsSure">保存</el-button>
                    <el-button v-if="dialogshow == 1 || dialogshow == 2" @click="dialogfrom = false" class="bottomBtns">取消</el-button>
                </el-row>

            </el-form>
        </el-dialog>

        <div class="dataTable">
            <el-table ref="detailTable" :data="rateList" border tooltip-effect="dark" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45"></el-table-column>
                <!--<el-table-column type ="index" width = "50" label = "序号" ></el-table-column>-->
                <el-table-column prop="name" label="姓名" width="120" fixed='left'>
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.name" placement="top">
                                <el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="username" width="110" label="学号"></el-table-column>
                <el-table-column prop="gradename" width="110" label="年级"></el-table-column>
                <el-table-column prop="stutypename" width="120" label="学员类型">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stutypename" placement="top">
                                <span>
                                    {{scope.row.stutypename}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="basename" width="120" label="专业基地">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.basename" placement="top">
                                <span>
                                    {{scope.row.basename}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sexname" label="性别"></el-table-column>
                <el-table-column prop="leavetypename" width="110" label="请假类型"></el-table-column>
                <el-table-column prop="remark" width="220" label="说明">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.remark" placement="top">
                                <span>
                                    {{scope.row.remark}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="rateList" width="230" label="日期">
                    <template slot-scope="scope">
                        <template>
                            {{scope.row.startdatestr}} - {{scope.row.enddatestr}}
                        </template>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" width="130" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.editflag == 1" @click="edit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="detail(scope.$index, scope.row)" type="text" size="small">查看</el-button>
                        <el-button v-if="scope.row.delflag == 1" @click="singledelete(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageno" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </div>
        <!-- 个人档案 -->
        <student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
    </div>
</template>
<script>
    import studentPersonalInfo from "../../components/studentPersonalInfo.vue"
    import { post, getCookie, setTitle, exportMouldExcel, exportExcel, importExcel, showErrorImport } from '../../config/util'
    import { mapState, mapActions } from 'vuex'
    import hospitalBaseDept from "../../components/hospitalBaseDept"
    import moment from 'moment'
    const _ = require('lodash');
    export default {
        data() {
            return {
                //导入
                hosBaseDeptName: "",
                hosBaseTree: [],
                defaultProps: {
                    children: "childrens",
                    label: "name"
                },
                showDeptTree: true,
                hasHospital: false,
                rightNowClear: 0,
                hasDept: false,
                dialogRecords: false,
                studentDetailId: "",
                hasFile: false,
                dialogTableVisible: false,
                uploadData: {
                    _upload_data: JSON.stringify({
                        "1": {
                            command: 'workattendance/importleaveinfo',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            sysType: 4
                        }
                    })
                },
                flag: 1,
                _uploadfilelist: [],
                fileList: [],  //增加弹窗上传的文件列表
                fileurltitle: '',//查看附件时候的拼接头部地址
                sucessfilelist: [],
                detail_filelist: [],//查看窗口文件列表


                pickerOptions: {	//开始和结束时间限制无法选择过期时间
                    minTime: '',
                    disabledDate(time) {
                        return time.getTime() < Date.now();     //- 8.64e7;
                    }
                },
                //筛选
                allvalue: '',
                newroomList: [],//基地列表
                turnplanlist: [],//轮转计划数组
                leavetypelist: [],//考勤类型列表
                queryForm: {
                    hospitalId: "",
                    newbaseid: '',
                    leavetype: '',
                    startime: '',
                    endtime: '',
                    inputquery: '',
                },

                //弹窗
                detailid: '',        //详情id
                dialogTitle: '',     //标题
                dialogfrom: false,       //
                dialogshow: '',//1增加；2编辑 3查看
                stunumoptionlist: [],//学号列表
                dialogForm: {        //弹窗
                    leavetype: '',       //考勤类型
                    leavestardate: '',   //请假开始时间
                    leaveenddate: '',    //请假结束时间
                    remark: '',          //备注
                },
                detailForm: {},
                dialogseachname: '',  //姓名，学号
                nameid: '',         //学员id
                editdisabled: false,
                startimedisabled: false,
                detailname: '',
                //列表
                rateList: [],
                //分页
                pageno: 1,
                pagesize: 10,
                totalCount: 0,
                usePage: false,
                loading: false,
                exportOptions: {}
            }
        },
        computed: {
            ...mapState([
                'sysTypeNum'
            ]),
        },
        created() {
            this.queryForm.startime = moment(new Date()).startOf("month").format("YYYY-MM-DD")
            this.queryForm.endtime = moment(new Date()).endOf("month").format("YYYY-MM-DD")
        },
        mounted() {
            this.getMyBaseTree()
            this.gethospitaltree();     //权限下的基地科室
            this.getleavetypelist();//考勤列表
        },
        components: {
            studentPersonalInfo,
            hospitalBaseDept
        },
        watch: {
            // 'queryForm.inputquery': function (newV, oldV) {
            //    if(newV!=oldV){
            //        let self=this;
            //        document.onkeydown = function (e) {
            //            let ev = document.all ? window.event : e
            //            if (ev.keyCode == 13) {
            //                self.doSelectQuery();
            //            }
            //        }
            //    }
            // }
        },
        methods: {
            getMyBaseTree() {
                let self = this
                post("/base/dept/getHosBaseTree", {}).then(res => {
                    if (res.resCode == 200) {
                        self.hosBaseTree = res.model;
                    }
                });
            },
            handleNodeClick(data, checked, node) {
                this.hosBaseDeptName = data.name
                if (data.deptlevel == 1) {
                    this.queryForm.hospitalId = data.id
                    this.queryForm.newbaseid = ""
                    this.queryForm.deptid = ""
                } else {
                    this.queryForm.hospitalId = ""
                    this.queryForm.newbaseid = data.id
                    this.queryForm.deptid = ""
                }
            },
            clearall() {
                this.queryForm.hospitalId = ""
                this.queryForm.newbaseid = ""
                this.queryForm.deptid = ""
            },
            setQueryFormOne(form) {
                this.queryForm.hospitalId = form.hospitalId
                this.queryForm.newbaseid = form.baseId
            },
            personalDetail(index, row) {
                this.dialogRecords = true;
                // textData-fix
                this.studentDetailId = row.uid
            },
            //顶部下载导入模板
            downloadModel() {
                let data = {
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    command: "workattendance/leaveinfomould",
                };
                exportMouldExcel(data);
            },
            changeFile(file, list) {

                if (list.length > 1) {
                    list.shift();
                }
                if (list.length > 0) {
                    this.hasFile = true;
                }

            },
            submitUpload() {//上传按钮
                if (!this.hasFile) {
                    this.$message({
                        showClose: true,
                        message: '请先选择上传的Excel文件！',
                        type: 'warning'
                    })
                }
                this.$refs.upload.submit();
            },
            checkFile(file) {           //上传文件之前 限制文件类型
                const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || file.type === 'application/vnd.ms-excel';
                if (!isExcel) {
                    this.$message.error('请上传.xls或.xlsx格式的Excel文件！');
                    this.hasFile = false;
                }
                return isExcel;
            },
            //顶部上传模板成功
            uploadmodelSuccess(res, file, fileList) {                   //上传成功
                if (res.errcode == 0) {
                    this.$message({
                        type: 'success',
                        message: '上传成功'
                    });
                } else if (res.errcode == 9903) {
                    showErrorImport(res.errorlist)
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.errdesc
                    });
                }
                this.$refs.upload.clearFiles();
                this.dialogTableVisible = false;
                this.hasFile = false;
                this.$loading().close();
            },
            onProgress(event, file, fileList) {          //文件上传时
                console.log('文件上传时', event, file, fileList)
                this.$loading();
            },


            //导出
            exportData() {
                let self = this;
                let data = {
                    command: 'workattendance/listleaveinfo',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    sysType: this.sysTypeNum,//1住培；2实习生
                    ...self.exportOptions
                }
                exportExcel(data);
            },

            //查询考勤类型列表
            getleavetypelist() {
                let self = this;
                post('/traineestudent/queryDictionaryList', {
                    command: 'traineestudent/queryDictionaryList',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    code: 'leavetype',
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.leavetypelist = data.dic_list;
                    }
                })
            },
            //打开新增
            addresult: function () {
                let self = this;
                self.dialogTitle = '添加';
                self.dialogshow = 1;
                self.editdisabled = false;//姓名不能编辑
                self.stunumoptionlist = []; //搜索的姓名列表
                // self.dialogForm = {};
                self.dialogseachname = '';  //姓名，学号
                self.dialogForm.leavetype = '';       //考勤类型
                self.dialogForm.leavestardate = '';   //请假开始时间
                self.dialogForm.leaveenddate = '';    //请假结束时间
                self.dialogForm.remark = '';       //备注
                self.dialogfrom = true;
                self.startimedisabled = false;
            },

            //学号改变  查询学号列表
            queryStuByMobile(query) {
                let self = this;
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        post('/workattendance/getleaveuserinfo', {
                            command: 'workattendance/getleaveuserinfo',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            sysType: this.sysTypeNum, // 1住院医；2实习生
                            name: query
                        }).then(function (data) {
                            if (data && data.errcode == 0) {
                                if (data.beanlist) {
                                    self.stunumoptionlist = data.beanlist;
                                } else {
                                    self.stunumoptionlist = [];
                                }

                            }
                        })
                    }, 200);
                } else {

                }
            },

            getstartime: function (time) {
                this.queryForm.startime = moment(new Date(time)).format("YYYY-MM-DD")
            },
            getendtime: function (time) {		//选取时间段
                this.queryForm.endtime = moment(new Date(time)).format("YYYY-MM-DD");//选取时间段
            },
            getdialogstartime: function (time) {
                this.dialogForm.leavestardate = time;
                let _startime = moment(this.dialogForm.leavestardate, 'YYYY-MM-DD HH:mm:ss').valueOf();
                let _endtime = moment(this.dialogForm.leaveenddate, 'YYYY-MM-DD HH:mm:ss').valueOf();
                if (this.dialogForm.leavestardate && _startime > _endtime) {
                    this.$message({
                        message: '请假结束时间不能小于开始时间',
                        type: 'warning'
                    });
                    this.dialogForm.leaveenddate = '';
                }
            },
            getdialogendtime: function (time) {
                this.dialogForm.leaveenddate = time;
                let _startime = moment(this.dialogForm.leavestardate, 'YYYY-MM-DD HH:mm:ss').valueOf();
                let _endtime = moment(this.dialogForm.leaveenddate, 'YYYY-MM-DD HH:mm:ss').valueOf();
                if (this.dialogForm.leavestardate && _startime > _endtime) {
                    this.$message({
                        message: '请假结束时间不能小于开始时间',
                        type: 'warning'
                    });
                    this.dialogForm.leaveenddate = '';
                }
            },
            //增加保存按钮
            addsaveform: function () {
                let self = this;
                if (self.dialogseachname == '' || !self.dialogseachname) {
                    self.$message({
                        message: '请输入姓名',
                        type: 'warning'
                    });
                } else if (self.dialogForm.leavetype == '') {
                    self.$message({
                        message: '请选择考勤类型',
                        type: 'warning'
                    });
                } else if (self.dialogForm.leavestardate == '') {
                    self.$message({
                        message: '请选择请假开始时间',
                        type: 'warning'
                    });
                } else if (self.dialogForm.leaveenddate == '') {
                    self.$message({
                        message: '请选择请假结束时间',
                        type: 'warning'
                    });
                } else {
                    self.loading = true;
                    console.log(self.dialogForm)
                    post('/workattendance/addleaveinfo', {
                        command: 'workattendance/addleaveinfo',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        sysType: this.sysTypeNum,
                        uid: self.dialogseachname,
                        leavetype: self.dialogForm.leavetype,
                        startdate: self.dialogForm.leavestardate,
                        enddate: self.dialogForm.leaveenddate,
                        remark: self.dialogForm.remark
                    }).then(function (data) {
                        self.loading = false;
                        if (data && data.errcode == 0) {
                            self.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            self.inittable(self.pageno, self.pagesize, '', '', '', '', '');
                            self.dialogfrom = false;
                        } else {
                            self.$message({
                                message: data.errdesc,
                                type: 'warning'
                            });
                        }
                    }).catch(function (error) {
                        //console.log(error)
                        self.loading = false;
                        this.$message.error('连接超时');
                    })
                }
            },

            queryAll: function () {
                let self = this;
                this.queryForm.hospitalId = "",
                    self.queryForm.newbaseid = '';
                self.queryForm.leavetype = '';
                self.queryForm.startime = '';
                self.queryForm.endtime = '';
                self.queryForm.inputquery = '';
                self.pageno = 1;
                this.rightNowClear = this.rightNowClear + 1;
                self.clearall();
                self.hosBaseDeptName = "";
                self.inittable(self.pageno, self.pagesize, '', '', '', '', '');
            },

            inittable: function (pageno, pagesize, base, leavetype, startime, endtime, inputquery) {
                let self = this;

                if (this.usePage) {
                    pageno = this.pageno;
                } else {
                    pageno = this.pageno = 1;
                }
                self.exportOptions = {
                    sysType: this.sysTypeNum,//1住培；2实习生
                    base: this.queryForm.newbaseid,//专业基地
                    hospitalId: this.queryForm.hospitalId,
                    leavetype: leavetype,//请假类型
                    startdate: startime || self.queryForm.startime,//请假开始时间
                    enddate: endtime || self.queryForm.endtime,//请假结束时间
                    usersearchinfo: inputquery
                }
                self.loading = true;
                post('/workattendance/listleaveinfo', {
                    command: 'workattendance/listleaveinfo',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    page: pageno,
                    hospitalId: this.queryForm.hospitalId,
                    reqnum: pagesize,
                    sysType: this.sysTypeNum,//1住培；2实习生 4护陪生
                    base: this.queryForm.newbaseid,//专业基地
                    leavetype: leavetype,//请假类型
                    startdate: startime || self.queryForm.startime,//请假开始时间
                    enddate: endtime || self.queryForm.endtime,//请假结束时间
                    usersearchinfo: inputquery,
                }).then(function (data) {
                    self.loading = false;
                    if (data && data.errcode == 0) {
                        self.rateList = data.result.doctorbeanlist;
                        self.totalCount = data.result.count;
                    }
                    self.usePage = false;
                }).catch(function (error) {
                    self.loading = false;
                    //console.log(error)
                })
            },

            //编辑区
            edit: function (index, row) {
                let self = this;
                self.hospitalnumber = '';
                self.dialogTitle = '编辑';
                self.dialogshow = 2;
                self.detailid = row.id;
                self.loading = true;
                post('/workattendance/getleaveinfodetail', {
                    command: 'workattendance/getleaveinfodetail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: row.id,
                }).then(function (data) {
                    self.loading = false;
                    if (data && data.errcode == 0) {
                        self.dialogseachname = row.name;
                        self.nameid = data.bean.uid;
                        self.dialogForm.leavetype = data.bean.leavetype;
                        self.dialogForm.leavestardate = data.bean.startdatestr;
                        self.dialogForm.leaveenddate = data.bean.enddatestr;
                        self.dialogForm.remark = data.bean.remark;
                        //    self.queryStuByMobile(data.bean.uid);
                        self.dialogfrom = true;
                        self.editdisabled = true;//姓名不能编辑
                        if (row.delflag != 1) {
                            self.startimedisabled = true;
                        } else {
                            self.startimedisabled = false;
                        }
                    } else {
                        this.$message.error('连接超时');
                    }
                }).catch(function (error) {
                    //console.log(error)
                    self.loading = false;
                    this.$message.error('连接失败');
                })

            },
            editsaveform: function () {
                let self = this;
                if (self.nameid == '') {
                    self.$message({
                        message: '请假人员丢失,请刷新重试',
                        type: 'warning'
                    });
                } if (self.dialogForm.leavetype == '') {
                    self.$message({
                        message: '请选择考勤类型',
                        type: 'warning'
                    });
                } else if (self.dialogForm.leavestardate == '') {
                    self.$message({
                        message: '请选择请假开始时间',
                        type: 'warning'
                    });
                } else if (self.dialogForm.leaveenddate == '') {
                    self.$message({
                        message: '请选择请假结束时间',
                        type: 'warning'
                    });
                } else {
                    self.loading = true;
                    post('/workattendance/editleaveinfo', {
                        command: 'workattendance/editleaveinfo',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        id: self.detailid,
                        systype: 1,
                        uid: self.nameid,
                        leavetype: self.dialogForm.leavetype,
                        startdate: self.dialogForm.leavestardate,
                        enddate: self.dialogForm.leaveenddate,
                        remark: self.dialogForm.remark
                    }).then(function (data) {
                        self.loading = false;
                        console.log('data', data)
                        if (data && data.errcode == 0) {
                            self.$message({
                                message: '编辑成功',
                                type: 'success'
                            });
                            self.usePage = true;
                            self.inittable(self.pageno, self.pagesize,
                                self.queryForm.newbaseid, self.queryForm.leavetype,
                                self.queryForm.startime, self.queryForm.endtime, self.queryForm.inputquery)
                            self.dialogfrom = false;
                        } else {
                            self.$message.error('连接超时');
                        }
                    }).catch(function (error) {
                        console.log('error', error)
                        self.loading = false;
                        this.$message.error('连接失败');
                    })

                }
            },

            //查看
            detail: function (index, row) {			//查看列表单个数据
                let self = this;
                post('/workattendance/getleaveinfodetail', {
                    command: 'workattendance/getleaveinfodetail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: row.id,
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.detailForm = data.bean;
                        self.detailname = row.name;
                        self.dialogshow = 3;
                        self.dialogfrom = true;
                        self.dialogTitle = '查看';
                        self.dialogseachname = '';  //姓名，学号
                    }
                }).catch(function (error) {
                    //console.log(error)
                })

            },

            //分页区
            handleSizeChange(size) {
                this.pagesize = size;
                this.inittable(this.pageno, this.pagesize,
                    this.queryForm.newbaseid, this.queryForm.leavetype,
                    this.queryForm.startime, this.queryForm.endtime, this.queryForm.inputquery);
            },
            handleCurrentChange(currentPage) {
                console.log(this.queryForm.newbaseid)
                this.pageno = currentPage;
                this.usePage = true;
                this.inittable(this.pageno, this.pagesize,
                    this.queryForm.newbaseid, this.queryForm.leavetype,
                    this.queryForm.startime, this.queryForm.endtime, this.queryForm.inputquery);
            },

            //查询方法
            doSelectQuery: function () {
                this.pageno = 1;
                this.inittable(this.pageno, this.pagesize,
                    this.queryForm.newbaseid, this.queryForm.leavetype,
                    this.queryForm.startime, this.queryForm.endtime, this.queryForm.inputquery);
            },

            //删除模块
            singledelete: function (index, row, batch) {	//单个删除
                let self = this;
                let _turnscoreid = [];
                _turnscoreid.push(row.id);

                this.$confirm('请确认是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/workattendance/delleaveinfo', {
                        command: 'workattendance/delleaveinfo',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        idlist: _turnscoreid,	//成绩id
                    }).then(function (data) {
                        if (data && data.errcode == 0) {
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.inittable(self.pageno, self.pagesize,
                                self.queryForm.newbaseid, self.queryForm.leavetype, self.queryForm.startime, self.queryForm.endtime, self.queryForm.inputquery);
                        }
                    }).catch(function (error) {
                        //console.log(error)
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });

            },
            handleSelectionChange: function (item) {//全选的方法
                let self = this;	//0未开始1进行中2已结束
                self.deletelist = [];
                for (let i = 0; i < item.length; i++) {
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
                    this.$confirm('是否删除选中数据?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        post('/workattendance/delleaveinfo', {
                            command: 'workattendance/delleaveinfo',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            idlist: self.deletelist,	//成绩id
                        }).then(function (data) {
                            if (data && data.errcode == 0) {
                                self.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                self.inittable(self.pageno, self.pagesize, '', '', '', '', '')
                            }
                        }).catch(function (error) {
                            //console.log(error)
                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });

                }
            },

            //带权限的基地科室和病区
            gethospitaltree: function () {
                let self = this;
                post('/turnbaseinfo/getusermanagerdepttree', {
                    command: 'turnbaseinfo/getusermanagerdepttree',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.newroomList = data.depttree.childlist
                        self.inittable(self.pageno, self.pagesize, '', '', '', '', '');
                    }
                }).catch(function (error) {
                    //console.log(error)
                })
            },
        }
    }
</script>

<style scoped>
    .wapper {
        padding: 0 20px;
    }
    ::-webkit-scrollbar {
        width: 5px;
        height: 10px;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #c1c1c1;
        border-radius: 32px;
    }

    ::-webkit-scrollbar-track {
        border-radius: 32px;
    }

    .tools {
        height: 50px;
    }

    .funcTools {
        float: left;
    }

    .search {
        float: right;
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

    .right {
        margin-left: 10px;
    }

    .elRowStyle {
        overflow-x: hidden;
    }

    .upload-demo {
        display: inline-block;
        margin: 0px 15px;
    }

    /*弹窗内容样式*/
    .red {
        color: red;
    }

    .newandedit {
        margin: 8px 0px;
    }

    .newandedit .row {
        display: flex;
        margin-top: 10px;
    }

    .newandedit label {
        width: 100px;
        text-align: right;
        display: inline-block;
    }

    .newandedit>.el-input {
        display: inline-block;
    }

    .newandedit>div>.el-select {
        width: 192px;
    }

    .newandedit>div {
        display: inline-block;
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

    .circleRoomInfo {
        padding: 10px 0px 30px 0px;
        margin-bottom: 15px;
    }

    .detailcircleRoomInfo {
        padding: 15px;
    }

    .circleRoomInfo>.el-col-10>.el-select {
        width: 100% !important;
    }

    .querybtn {
        margin-left: 20px;
    }

    .flexForm {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
    }
    .el-select-dropdown__item {
        overflow: visible;
        height: auto;
    }
</style>