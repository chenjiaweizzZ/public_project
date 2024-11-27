<template>
    <div class="wapper">
        <div class="tools">
            <el-button type="primary" @click="exportData()">批量导出</el-button>
        </div>
        <div class="queryTools selecthun">
            <div class="queryAll">
                <el-button type="text" @click="queryAll">全部</el-button>
            </div>
            <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="70px" class="flexForm">
                <el-form-item label="基地" prop="" style="width: 300px;">
                    <el-select v-model="hosBaseName" placeholder="请选择科室" :popper-append-to-body="false" collapse-tags
                        @clear="clearall" clearable>
                        <el-option disabled class="baseOption" value></el-option>
                        <el-tree :data="hosBaseTree" :props="defaultProps" ref="tree" check-strictly node-key="id"
                            @node-click="handleNodeClick2" class="hosWithNoCheckBox">
                        </el-tree>

                    </el-select>
                </el-form-item>
                <el-form-item label="科室" prop="" style="width: 300px;">
                    <el-select v-model="hosDeptName" placeholder="请选择科室" :popper-append-to-body="false" collapse-tags
                        @clear="clearall" clearable>
                        <el-option disabled class="baseOption" value> </el-option>
                        <el-tree :data="hosDeptTree" :props="defaultProps" ref="tree" check-strictly node-key="id"
                            @node-click="handleNodeClick" class="hosWithNoCheckBox">
                        </el-tree>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期" style="width: 350px;">
                    <el-date-picker style="width: 133px" v-model="queryForm.startime" type="date" placeholder="开始日期"
                        format='yyyy-MM-dd' @change="getstartime">
                    </el-date-picker>

                    -

                    <el-date-picker style="width: 133px" v-model="queryForm.endtime" type="date" placeholder="结束日期"
                        format='yyyy-MM-dd' @change="getendtime">
                    </el-date-picker>
                </el-form-item>

                <el-input style="width:200px" v-model="queryForm.inputquery" placeholder="请输入姓名或学号"
                    @keyup.enter.native="doSelectQuery"></el-input>

                <el-button class="querybtn" type="primary" @click="doSelectQuery">查询</el-button>
            </el-form>
        </div>

        <!--弹窗-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogfrom" :close-on-click-modal="false" @close="dialogfrom = false"
            class='dialogAdd'>
            <el-form :model="dialogForm" label-width="80px">

                <el-row :gutter="23">
                    <el-col :span="12">
                        <div class="newandedit">
                            <label><span class="red">*</span>姓名 : </label>
                            <div v-if="dialogshow == 1 || dialogshow == 2">
                                {{ dialogForm.name }}
                            </div>
                            <div v-if="dialogshow == 3">
                                {{ dialogForm.name }}
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="newandedit">
                            <label><span class="red">*</span>轮转科室 : </label>
                            <div v-if="dialogshow == 1 || dialogshow == 2">
                                {{ dialogForm.turnofficename }}
                            </div>
                            <div v-if="dialogshow == 3">
                                {{ dialogForm.turnofficename }}
                            </div>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="23">
                    <el-col :span="12">
                        <div class="newandedit">
                            <label><span class="red">*</span>考勤类别 : </label>
                            <div>
                                <el-select filterable v-model="dialogForm.workattendancetype" placeholder="请选择计划">
                                    <el-option v-for="(item, index) in attendance_type_list" :key="item.index"
                                        :label="item.name" :value="item.key">
                                    </el-option>
                                </el-select>
                                <div v-if="dialogForm.workattendancetype == 3">
                                    <el-select v-model="dialogForm.workattendanceTypeDay" filterable placeholder="请选择">
                                        <el-option v-for="item in attendanceTypeDay" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <span>天</span>
                                </div>
                                <div v-if="dialogForm.workattendancetype == 4 || dialogForm.workattendancetype == 5">
                                    <el-select v-model="dialogForm.workattendanceTypeDay" filterable placeholder="请选择"
                                       >
                                        <el-option v-for="item in attendanceTypeMin" :key="item.value" :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </el-select>
                                    <span>分钟</span>
                                </div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="newandedit">
                            <label><span class="red">*</span>考勤日期 : </label>
                            <div>
                                {{ dialogForm.workdatestr }}
                            </div>
                        </div>
                    </el-col>

                </el-row>

                <!--<el-row :gutter ="23">
                    <el-col :span = "24">
                        <div class="newandedit">
                            <label>说明 : </label>
                            <div v-if="dialogshow == 1 || dialogshow == 2">
                                <el-input type="textarea" :autosize="{ minRows: 3, maxRows: 6}" placeholder="请输入说明" style="width: 520px;"
                                          v-model="dialogForm.remark">
                                </el-input>
                            </div>
                            <div v-if="dialogshow == 3">{{dialogForm.remark}}</div>
                        </div>
                    </el-col>
                </el-row>-->

                <el-row :gutter="20">
                    <el-button v-if="dialogshow == 2" @click="editsaveform" type="primary"
                        class="bottomBtnsSure">保存</el-button>
                    <el-button v-if="dialogshow == 1 || dialogshow == 2" @click="dialogfrom = false"
                        class="bottomBtns">取消</el-button>
                </el-row>

            </el-form>
        </el-dialog>

        <div class="dataTable">
            <el-table ref="detailTable" v-loading="loading" :data="rateList" border tooltip-effect="dark"
                style="width: 100%">
                <!--<el-table-column type ="selection" width = "45"  ></el-table-column>-->
                <!--<el-table-column type ="index" width = "50" label = "序号" ></el-table-column>-->
                <el-table-column prop="name" label="姓名" fixed='left'>
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.name"
                                placement="top">
                                <el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{
                                    scope.row.name }}</el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="username" width="110" label="学号"></el-table-column>
                <el-table-column prop="gradename" label="年级"></el-table-column>
                <el-table-column prop="stutypename" label="学员类型">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stutypename"
                                placement="top">
                                <span>
                                    {{ scope.row.stutypename }}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="basename" width="120" label="专业基地">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.basename"
                                placement="top">
                                <span>
                                    {{ scope.row.basename }}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="sexname" label="性别"></el-table-column>
                <el-table-column prop="turnofficename" width="120" label="轮转科室">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.turnofficename"
                                placement="top">
                                <span>
                                    {{ scope.row.turnofficename }}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="workusername" label="分带教">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.workusername"
                                placement="top">
                                <span>
                                    {{ scope.row.workusername }}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="workattendancename" width="110" label="考勤"></el-table-column>
                <!--<el-table-column prop = "remark" width = "220" label ="说明"></el-table-column>-->
                <el-table-column prop="workdatestr" width="110" label="考勤日期">
                </el-table-column>
                <el-table-column fixed="right" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.editflag == 1" @click="edit(scope.$index, scope.row)" type="text"
                            size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page="pageno" :page-sizes="[10, 20, 50, 100]"
                :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
            </el-pagination>
        </div>
        <!-- 个人档案 -->
        <student-personal-Info :studentDetailId="studentDetailId"
            :dialogRecords.sync="dialogRecords"></student-personal-Info>
    </div>
</template>
<script>
import studentPersonalInfo from "../../components/studentPersonalInfo.vue"
import { post, getCookie, setTitle, exportMouldExcel, exportExcel } from '../../config/util'
import { mapState, mapActions } from 'vuex'
import hospitalBaseDept from "../../components/hospitalBaseDept"
import moment from 'moment'
const _ = require('lodash');

export default {
    data() {
        return {
            rightNowClear: 0,
            dialogRecords: false,
            studentDetailId: "",
            loading: false,
            //筛选
            newroomList: [],//基地列表
            attendance_type_list: [],//考勤类型列表
            attendanceTypeDay: [
                { lable: 1, value: 0.5, },
                { lable: 2, value: 1 },
            ],
            attendanceTypeMin: [],
            queryForm: {
                hospitalId: "",
                hospitalId2: "",
                newbaseid: '',
                leavetype: '',
                startime: '',
                endtime: '',
                inputquery: '',
                turnoffice: '',
            },
            turnofficelist: [],  //科室列表
            //弹窗
            detailid: '',        //详情id
            dialogTitle: '',     //标题
            dialogfrom: false,
            dialogshow: '',      //1增加；2编辑 3查看
            dialogForm: {        //弹窗
                workattendancetype: '',       //活动类型
                //remark:'',          //备注
            },
            //列表
            rateList: [],
            //分页
            pageno: 1,
            pagesize: 10,
            totalCount: 0,
            usePage: false,
            exportOptions: {},
            loading: false,
            hosDeptTree: [],
            hosBaseTree: [],
            defaultProps: {
                children: 'childrens',
                label: 'name'
            },
            hosDeptName: "",
            hosBaseName: ""
        }
    },
    computed: {},
    mounted() {
        this.gethospitaltree();     //权限下的基地科室
        this.getattendancetype();   //活动类型列表
        this.getMyDeptTree();
        this.getMyBaseTree();
        this.minuteNumber();//旷工或早退时间

    },
    created() {
        this.queryForm.startime = new Date(new Date().getFullYear(), new Date().getMonth() - 1)//上一个月的一号
        this.queryForm.endtime = moment(new Date()).format('YYYY-MM-DD')//当天

    },
    components: {
        studentPersonalInfo,
        hospitalBaseDept
    },
    watch: {},
    methods: {
        minuteNumber() {
            var TypeMin = [];
            for (var i = 1; i <= 120; i++) {
                var minTime = {
                    lable: i,
                    value: i
                }
                    TypeMin.push(minTime)
                }
                this.attendanceTypeMin=TypeMin;
            },
            getMyDeptTree() {
                post("/base/dept/getMyDeptTree", {
                    showHospital: 1,
                    showNoDeptHospital: 0,
                    needBaseDept: 0,
                    hospitalId: "",
                }).then(res => {
                    if (res && res.resCode == 200) {
                        if (Array.isArray(res.model) && res.model.length > 0) {
                            this.hosDeptTree = res.model
                        }
                    }
                })
            },
            getMyBaseTree() {
                let self = this
                post("/base/dept/getHosBaseTree", {}).then(res => {
                    if (res.resCode == 200) {
                        self.hosBaseTree = res.model;
                    }
                });
            },
            handleNodeClick(data, checked, node) {
                if (data.deptlevel == 1) {
                    if (data.havePermission) {
                        this.hosDeptName = data.name
                        this.queryForm.hospitalId = data.id
                        // this.queryForm.newbaseid = ""
                        this.queryForm.turnoffice = ""
                    } else {
                        this.$message({
                            message: '无院区管辖权限',
                            type: 'warning'
                        });
                    }
                } else {
                    if (data.havePermission) {
                        this.hosDeptName = data.name
                        this.queryForm.hospitalId = ""
                        // this.queryForm.newbaseid = ""
                        this.queryForm.turnoffice = data.id
                    } else {
                        this.$message({
                            message: '无科室管辖权限',
                            type: 'warning'
                        });
                    }

                }
            },
            handleNodeClick2(data, checked, node) {
                this.hosBaseName = data.name
                if (data.deptlevel == 1) {
                    this.queryForm.hospitalId2 = data.id
                    this.queryForm.newbaseid = ""
                    // this.queryForm.turnoffice = ""
                } else {
                    this.queryForm.hospitalId2 = ""
                    this.queryForm.newbaseid = data.id
                    // this.queryForm.turnoffice = ""
                }
            },
            clearall() {
                this.queryForm.hospitalId = ""
                this.queryForm.newbaseid = ""
                this.queryForm.turnoffice = ""
            },
            setQueryFormOne(form) {
                this.queryForm.hospitalId = form.hospitalId
                this.queryForm.newbaseid = form.baseId
                this.queryForm.turnoffice = form.deptId

            },
            personalDetail(index, row) {
                this.dialogRecords = true;
                // textData-fix
                this.studentDetailId = row.uid
            },
            exportData() {
                let self = this;
                let data = {
                    command: 'workattendance/listworkattendance',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    // systype: 1, //1住培；2实习生
                    ...self.exportOptions
                }
                exportExcel(data);
            },
            //查活动类型列表
            getattendancetype() {
                let self = this;
                post('/traineestudent/queryDictionaryList', {
                    command: 'traineestudent/queryDictionaryList',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    code: 'workattendancetype_pub',
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.attendance_type_list = data.dic_list;
                    }
                })
            },

            getstartime: function (time) {
                this.queryForm.startime = time;
            },
            getendtime: function (time) {		//选取时间段
                this.queryForm.endtime = time;//选取时间段
            },

            //查询方法
            doSelectQuery: function () {
                let self = this;
                this.pageno = 1;
                self.inittable(self.pageno, self.pagesize,
                    self.queryForm.newbaseid, self.queryForm.turnoffice,
                    self.queryForm.startime, self.queryForm.endtime, self.queryForm.inputquery)
            },
            queryAll: function () {
                let self = this;
                this.queryForm.hospitalId = "",
                    self.queryForm.newbaseid = '';
                self.queryForm.turnoffice = '';
                self.queryForm.startime = '';
                self.queryForm.endtime = '';
                self.queryForm.inputquery = '';
                self.pageno = 1;
                this.rightNowClear = this.rightNowClear + 1
                self.inittable(self.pageno, self.pagesize, '', '', '', '', '', '');
            },

            inittable: function (pageno, pagesize, base, office, startime, endtime, inputquery) {
                let self = this;
                this.loading = true;
                if (this.usePage) {
                    pageno = this.pageno;
                } else {
                    pageno = this.pageno = 1;
                }
                self.exportOptions = {
                    systype: 1, //1住培；2实习生
                    base: base, //专业基地
                    office: office,
                    hospitalId: this.queryForm.hospitalId,
                    workattendancetype: '', //考勤类型
                    startdate: startime || this.queryForm.startime, // 开始时间
                    enddate: endtime || this.queryForm.endtime, // 结束时间
                    usersearchinfo: inputquery
                }
                self.loading = true;
                post('/workattendance/listworkattendance', {
                    command: 'workattendance/listworkattendance',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    page: pageno,
                    reqnum: pagesize,
                    hospitalIdForBase: this.queryForm.hospitalId2,
                    hospitalId: this.queryForm.hospitalId,
                    // systype: 1, //1住培；2实习生
                    base: base, //专业基地
                    office: office,
                    workattendancetype: '', //考勤类型
                    startdate: startime || this.queryForm.startime, // 开始时间
                    enddate: endtime || this.queryForm.endtime, // 结束时间
                    usersearchinfo: inputquery,
                }).then(function (data) {
                    self.loading = false;
                    if (data && data.errcode == 0) {
                        self.rateList = data.result.workattendancefordoctor;
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
                self.dialogTitle = '编辑';
                self.dialogshow = 2;
                self.detailid = row.id;
             
                post('/workattendance/getworkattendancedetail', {
                    command: 'workattendance/getworkattendancedetail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: row.id,
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.dialogForm.workattendancetype = data.bean.workattendancetype;
                        self.dialogfrom = true;
                        self.dialogForm.workattendanceTypeDay=data.bean.timeLength 
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
            editsaveform: function () {
                let self = this;
                let timeUnitType="" //时间单位 1、秒 2、分 3、时 4、天 5、月 6、周 7、年
                if (self.dialogForm.workattendancetype == 3) {
                    timeUnitType = 4
                } else if (self.dialogForm.workattendancetype == 4 || self.dialogForm.workattendancetype == 5) {
                    timeUnitType = 2
                };
                if (self.dialogForm.workattendancetype == '') {
                    self.$message({
                        message: '请选择活动类型',
                        type: 'warning'
                    });
                } else {
                    post('/workattendance/updateworkattendance', {
                        command: 'workattendance/updateworkattendance',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        id: self.detailid,
                        workattendancetype: self.dialogForm.workattendancetype,
                        timeLength: self.dialogForm.workattendanceTypeDay, //时长
                        timeUnit: timeUnitType
                        //remark: self.dialogForm.remark
                    }).then(function (data) {
                        if (data && data.errcode == 0) {
                            self.$message({
                                message: '编辑成功',
                                type: 'success'
                            });
                            self.usePage = true;
                            self.inittable(self.pageno, self.pagesize,
                                self.queryForm.newbaseid, self.queryForm.turnoffice,
                                self.queryForm.startime, self.queryForm.endtime, self.queryForm.inputquery)
                            self.dialogfrom = false;
                        } else {
                            self.$message({
                                message: data.errdesc,
                                type: 'warning'
                            });
                        }
                    }).catch(function (error) {
                        //console.log(error)
                    })

                }
            },

            //分页区
            handleSizeChange(size) {
                this.pagesize = size;
                this.inittable(this.pageno, this.pagesize,
                    this.queryForm.newbaseid, this.queryForm.turnoffice,
                    this.queryForm.startime, this.queryForm.endtime, this.queryForm.inputquery)
            },
            handleCurrentChange(currentPage) {
                this.pageno = currentPage;
                this.usePage = true;
                this.inittable(this.pageno, this.pagesize,
                    this.queryForm.newbaseid, this.queryForm.turnoffice,
                    this.queryForm.startime, this.queryForm.endtime, this.queryForm.inputquery)
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
                        self.inittable(self.pageno, self.pagesize, '', '', '', '', '', '');
                    }
                }).catch(function (error) {
                    //console.log(error)
                })
            },
            //选择基地后的轮转科室
            getturnoffice: function () {
                let self = this;
                self.newroomList.map(function (item, index) {
                    if (self.queryForm.newbaseid == item.id) {
                        self.turnofficelist = item.childlist;
                    }
                })
            },
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

<style lang="scss">
.selecthun {
    .el-select {
        width: 100%;
    }
}
</style>
