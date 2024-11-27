<template>
    <div class="wapper">
        <div class="tools">
            <div class="funcTools">
                <el-button type="primary" @click="exportList()">批量导出</el-button>
            </div>
        </div>

        <div class="queryTools newQueryTools">
            <el-row>
                <el-col :span="1">
                    <el-button type="text" @click="queryAll">全部</el-button>
                </el-col>
                <el-col :span="20">
                    <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="70px">
                        <!-- <el-form-item label="专业基地">
                            <el-select filterable v-model="queryForm.base" placeholder="请选择">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item,index) in hospital.baselist" :key="item.index" :label="item.deptname" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item> -->
                        <el-form-item label="专业基地">
                            <el-select v-model="hosBaseDeptName" placeholder="请选择基地" :popper-append-to-body="false" collapse-tags @clear="clearall" clearable>
                                <el-option label="全部" value="" @click.native="clearall"></el-option>
                                <!-- <el-option disabled class="baseOption" value></el-option> -->
                                    <el-tree :data="hosBaseTree" :props="defaultProps" ref="tree" check-strictly node-key="id" @node-click="handleNodeClick"
                                        class="hosWithNoCheckBox">
                                    </el-tree>
                                
                            </el-select>
                        </el-form-item>
                        <el-form-item label="年级">
                            <el-select filterable v-model="queryForm.greade" placeholder="请选择">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="item in gradlistUG" :key="item.key" :label="item.name" :value="item.key">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="年度考核">
                            <el-select filterable v-model="queryForm.yearcode" placeholder="请选择">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item,index) in yearList" :key="item.index" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="学生状态">
                            <el-select filterable v-model="queryForm.stdstatus" placeholder="请选择">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item,index) in stdstatusList" :key="item.index" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="基地状态" v-show="showAdditionQuery">
                            <el-select filterable v-model="queryForm.basestatus" placeholder="请选择">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item,index) in basestatusList" :key="item.index" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="教办状态" v-show="showAdditionQuery">
                            <el-select filterable v-model="queryForm.teachofficestatus" placeholder="请选择">
                                <el-option label="全部" value=""></el-option>
                                <el-option v-for="(item,index) in teachofficestatusList" :key="item.index" :label="item.name" :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>

                        <el-input style="width:200px" v-model="queryForm.inputquery" placeholder="请输入学员姓名/学号/手机号" @keyup.enter.native="doSelectQuery"
                            v-show="showAdditionQuery"></el-input>

                    </el-form>
                </el-col>
                <el-col :span="3">
                    <div class="queryWrap" style="float:right;display:flex">
                        <el-button type="text" @click="showAdditionQuery=!showAdditionQuery" :class="{'retract':showAdditionQuery,'open':!showAdditionQuery}">
                            <label for="">{{showAdditionQuery===false?'展开':'收起'}}</label>

                        </el-button>
                        <el-button class="querybtn" type="primary" @click="doSelectQuery">查询</el-button>
                    </div>
                </el-col>
            </el-row>

        </div>

        <!--弹窗-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogfrom" :close-on-click-modal="false" size="large" class='dialogAdd' v-if="dialogfrom">
            <pEva :personalData="personalData" :urltitle="urltitle" @submit1="submit" @close1="closepeva" @funshowbigpic="showbigpic"></pEva>
        </el-dialog>

        <el-dialog title="查看大图" size="small" :visible.sync="bigpicture" :modal-append-to-body="false" :close-on-click-modal="false">
            <el-carousel trigger="click">
                <el-carousel-item v-for="(item,index) in personalData.uploadlist" :key="item.id" v-if="item.type == showbigtype">
                    <img class="bigpic" :src="urltitle + item.fileurl" />
                </el-carousel-item>
            </el-carousel>
        </el-dialog>

        <div class="dataTable">
            <el-table ref="detailTable" :data="rateList" border tooltip-effect="dark" style="width: 100%" v-loading="loading">
                <el-table-column prop="name" label="姓名" fixed='left' width="120">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.name" placement="top">
                                <el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="username" width="110" label="学号"></el-table-column>
                <el-table-column prop="gradename" label="年级"></el-table-column>
                <el-table-column prop="studtypename" label="学员类型" width="100">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.studtypename" placement="top">
                                <span>
                                    {{scope.row.studtypename}}
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
                <el-table-column label="年度考核">
                    <template slot-scope="scope">
                        {{scope.row.yearflag | fyearflage}}
                    </template>
                </el-table-column>
                <el-table-column prop="stdstatusname" label="学员完成情况" width="120"></el-table-column>
                <el-table-column prop="basestatusname" label="基地完成情况" width="120"></el-table-column>
                <el-table-column prop="teachofficestatusname" label="护培办完成情况" width="120"></el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">鉴定</el-button>
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
    import { post, getCookie, exportExcel } from '../../config/util'
    import { mapState, mapActions } from 'vuex'
    import pEva from '../../components/personalEvaluation'
    import hospitalBaseDept from "../../components/hospitalBaseDept"
    export default {
        components: {
            pEva,
            studentPersonalInfo,
            hospitalBaseDept
        },
        data() {
            return {
                hosBaseDeptName: "",
                hosBaseTree: [],
                defaultProps: {
                    children: "childrens",
                    label: "name"
                },
                hasDept: false,
                rightNowClear: 0,
                dialogRecords: false,
                studentDetailId: "",
                //筛选
                queryForm: {
                    hospitalId: "",
                    greade: '',
                    base: '',
                    yearcode: '',
                    stdstatus: '',
                    basestatus: '',
                    teachofficestatus: '',
                    inputquery: '',
                },
                yearList: [
                    {
                        id: 1,
                        name: '第一年'
                    },
                    {
                        id: 2,
                        name: '第二年'
                    }
                ],
                stdstatusList: [
                    {
                        id: 0,
                        name: '学生未完成'
                    },
                    {
                        id: 5,
                        name: '学生已完成'
                    },
                ],
                basestatusList: [
                    {
                        id: 0,
                        name: '基地未完成'
                    },
                    {
                        id: 5,
                        name: '基地不通过'
                    },
                    {
                        id: 10,
                        name: '基地通过'
                    },
                ],
                teachofficestatusList: [
                    {
                        id: 0,
                        name: '教办未完成'
                    },
                    {
                        id: 5,
                        name: '教办不通过'
                    },
                    {
                        id: 10,
                        name: '教办通过'
                    },
                ],
                //弹窗
                dialogfrom: false,
                dialogTitle: '',
                personalData: {},// 传递给弹窗的值
                urltitle: '',
                //列表
                rateList: [],
                //分页
                pageno: 1,
                pagesize: 10,
                totalCount: 0,
                usePage: false,
                bigpicture: false,
                showbigtype: '',
                modelfalse: false,
                loading: false,
                showAdditionQuery: false,
                allOption1: []
            }
        },
        filters: {
            'fyearflage': function (str) {
                if (str) {
                    return ((str == 1 || str == 2) ? `第 ${str} 年度` : `未知`)
                } else {
                    return '未知'
                }
            }
        },
        computed: {
            ...mapState(['gradlistUG', 'hospital', 'allOption']),
        },
        mounted() {
            this.getMyBaseTree()
            this.initAllOptionListUG({ type: 'grade' });       //年级//年级
            this.toinitHospitalInfour();//基地
            this.inittable(this.pageno, this.pagesize, '', '', '', '', '', '', '');
            this.fillGradListUG();
        },
        watch: {},
        complens: {

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
                    this.queryForm.base = ""
                    this.queryForm.deptid = ""
                } else {
                    this.queryForm.hospitalId = ""
                    this.queryForm.base = data.id
                    this.queryForm.deptid = ""
                }
            },
            clearall() {
                this.queryForm.hospitalId = ""
                this.queryForm.base = ""
                this.queryForm.deptid = ""
            },
            setQueryFormOne(form) {
                this.queryForm.hospitalId = form.hospitalId
                this.queryForm.base = form.baseId
            },
            personalDetail(index, row) {
                this.dialogRecords = true;
                // textData-fix
                this.studentDetailId = String(row.uid)
            },
            ...mapActions(['toinitHospitalInfour', "fillGradListUG", 'initAllOptionListUG',]),
            //查询方法
            doSelectQuery: function () {
                let self = this;
                this.pageno = 1;
                self.inittable(self.pageno, self.pagesize,
                    self.queryForm.greade, self.queryForm.base,
                    self.queryForm.yearcode,
                    self.queryForm.stdstatus,
                    self.queryForm.basestatus, self.queryForm.teachofficestatus,
                    self.queryForm.inputquery)
            },
            queryAll: function () {
                let self = this;
                this.rightNowClear = this.rightNowClear + 1
                this.queryForm.hospitalId = ""
                self.queryForm.greade = '';
                self.queryForm.base = '';
                self.queryForm.yearcode = '';
                self.queryForm.stdstatus = '';
                self.queryForm.basestatus = '';
                self.queryForm.teachofficestatus = '';
                self.queryForm.inputquery = '';
                self.pageno = 1;
                self.clearall();
                self.hosBaseDeptName = "";
                self.inittable(self.pageno, self.pagesize, '', '', '', '', '', '', '');
            },
            //导出
            exportList() {
                let data = {
                    command: 'turnedoctormain/getuserpersonalevaluatepc',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    requestflag: 2,//老师的请求
                    ...this.getFilterData()
                }
                exportExcel(data)
            },
            //获得参数
            getFilterData() {
                let params = {
                    command: 'turnedoctormain/getuserpersonalevaluatepc',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    requestflag: 2, //老师请求
                    grade: this.queryForm.greade,
                    baseid: this.queryForm.base,
                    yearflag: this.queryForm.yearcode,  //年度考核
                    stdstatus: this.queryForm.stdstatus,//学生状态
                    basestatus: this.queryForm.basestatus,//基地状态
                    teachofficestatus: this.queryForm.teachofficestatus,//教办状态
                    usersearchinfo: this.queryForm.inputquery,
                };
                return params;
            },
            inittable: function (pageno, pagesize, gradeid, baseid, yearflag, stdstatus, basestatus, teachofficestatus, inputquery) {
                let self = this;
                if (this.usePage) {
                    pageno = this.pageno;
                } else {
                    pageno = this.pageno = 1;
                }
                self.loading = true;
                post('/turnedoctormain/getuserpersonalevaluatepc', {
                    command: 'turnedoctormain/getuserpersonalevaluatepc',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    requestflag: 2, //老师请求
                    page: pageno,
                    pagesize: pagesize,
                    grade: gradeid,
                    hospitalId: this.queryForm.hospitalId,
                    baseid: baseid,
                    yearflag: yearflag,  //年度考核
                    stdstatus: stdstatus,//学生状态
                    basestatus: basestatus,//基地状态
                    teachofficestatus: teachofficestatus,//教办状态
                    usersearchinfo: inputquery,
                }).then(function (data) {
                    self.loading = false;
                    if (data && data.errcode == 0) {
                        self.rateList = data.result.beanlist;
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
                self.dialogTitle = '个人综合考评表鉴定';
                self.dialogshow = 2;
                self.detailid = row.id;
                post('/turnedoctormain/personalevasubinit', {
                    command: 'turnedoctormain/personalevasubinit',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: row.id,
                    stdid: row.stdid,
                    yearflag: row.yearflag,
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.personalData = data.bean;
                        self.personalData.baseJustics = row.baseJustics;
                        self.personalData.hospitalJustics = row.hospitalJustics;
                        self.urltitle = data.fdfsurl ? data.fdfsurl : 'http://whu.misrobot.com/'
                        self.dialogfrom = true;
                    } else {
                        self.$message({
                            message: data.errdesc,
                            type: 'warning'
                        });
                    }
                }).catch(function (error) {
                    //console.log(error)
                })

            },
            showbigpic(type) {
                this.showbigtype = type;
                this.bigpicture = true;
            },
            submit(data, incommand) {
                //基地提交
                let self = this;
                post('/' + incommand, {
                    command: incommand,
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    ...data
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.$message({
                            message: '审核成功！',
                            type: 'success'
                        });
                        self.dialogfrom = false;
                        self.inittable(self.pageno, self.pagesize,
                            self.queryForm.greade, self.queryForm.base,
                            self.queryForm.yearcode, self.queryForm.stdstatus,
                            self.queryForm.basestatus, self.queryForm.teachofficestatus,
                            self.queryForm.inputquery)
                    } else {
                        self.$message({
                            message: data.errdesc,
                            type: 'warning'
                        });
                    }
                }).catch(function (error) {
                    //console.log(error)
                })
            },
            closepeva(data) {
                this.dialogfrom = data;
            },

            //分页区
            handleSizeChange(size) {
                this.pagesize = size;
                this.inittable(this.pageno, this.pagesize,
                    this.queryForm.greade, this.queryForm.base,
                    this.queryForm.yearcode, this.queryForm.stdstatus,
                    this.queryForm.basestatus, this.queryForm.teachofficestatus,
                    this.queryForm.inputquery)
            },
            handleCurrentChange(currentPage) {
                this.pageno = currentPage;
                this.usePage = true;
                this.inittable(this.pageno, this.pagesize,
                    this.queryForm.greade, this.queryForm.base,
                    this.queryForm.yearcode, this.queryForm.stdstatus,
                    this.queryForm.basestatus, this.queryForm.teachofficestatus,
                    this.queryForm.inputquery)
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

    .bigpic {
        width: 500px;
        height: 350px;
        margin-left: 73px;
    }
</style>