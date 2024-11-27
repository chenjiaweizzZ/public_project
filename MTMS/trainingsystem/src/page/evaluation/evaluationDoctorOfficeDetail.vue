<template>
    <div class="wapper">
        <div class="tools graduationTools">
            <div class="funcTools">
                <el-button type="primary" @click='exportList'>批量导出</el-button>
            </div>
        </div>
        <div class="queryTools graduationQueryTools">
            <el-form ref="queryForm" label-width="70px" :model="queryForm">
                <div class="queryAll">
                    <!--查询-->
                    <el-button type="text" @click="queryAll">全部</el-button>
                </div>
                <div class="queryDoctorWrap">
                    <el-form-item label="基地">
                        <el-select filterable v-model="queryForm.baseid" placeholder="请选择基地" @change="newbasechange">
                            <el-option :key="0" label="全部" :value="allvalue"></el-option>
                            <el-option v-for="(item,index) in baseList" :key="index+1" :label="item.deptname" :value="item.id">
                                <!--turnplanid-->
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="科室">
                        <el-select filterable v-model="queryForm.doctoroffice" placeholder="请选择科室">
                            <el-option :key="0" label="全部" :value="allvalue"></el-option>
                            <el-option v-for="(item,index) in departmentList" :key="index+1" :label="item.deptname" :value="item.id">
                                <!--turnplanid-->
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年级">
                        <el-select filterable v-model="queryForm.turngrade" placeholder="请选择年级">
                            <el-option :key="0" label="全部" :value="allvalue"></el-option>
                            <el-option v-for="(item,index) in allOption.turngrade" :key="index+1" :label="item.name" :value="item.key">
                                <!--turnplanid-->
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="专业基地">
                        <el-select filterable v-model="queryForm.majorbaseid" placeholder="专业基地">
                            <el-option :key="0" label="全部" :value="allvalue"></el-option>
                            <el-option v-for="(item,index) in majorbaseList" :key="index+1" :label="item.name" :value="item.id">
                                <!--turnplanid-->
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学员类型">
                        <el-select filterable v-model="queryForm.stdtype" placeholder="请选择学员类型">
                            <el-option :key="0" label="全部" :value="allvalue"></el-option>
                            <el-option v-for="(item,index) in allOption.stud_type" :key="index+1" :label="item.name" :value="item.key">
                                <!--turnplanid-->
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="评分日期" style="width: 295px;" label-width="70px">
                        <el-date-picker style="width: 105px" v-model="queryForm.startdate" type="month" placeholder="选择日期" format="yyyy-MM" @change="gettime">
                        </el-date-picker>
                        -
                        <el-date-picker style="width: 105px" v-model="queryForm.enddate" type="month" placeholder="选择日期" format="yyyy-MM" @change="getendtime">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="护陪生">
                        <el-input placeholder="请输入姓名和学号" v-model="queryForm.stdsearchinfo" @keyup.enter.native="doSelectQuery"></el-input>
                    </el-form-item>
                    <el-form-item class="graduationQueryBtn">
                        <el-button type="primary" class="queryBtn" @click="doSelectQuery">查询</el-button>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="dataTable">
            <el-table ref="detailTable" border :data="dataList" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange"
                @sort-change="PercentileOrdering" v-loading="loading" :max-height="$tabelMaxHeight">
                <!--<el-table-column type ="selection" width = "45"  ></el-table-column>-->
                <el-table-column type="index" width="50" label="序号" fixed='left'></el-table-column>
                <el-table-column prop="deptname" label="科室名称" width="150" fixed='left'>
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.deptname" placement="top">
                                <span>
                                    {{scope.row.deptname}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="finishpointtable" v-for="(item,index) in tabletitlelist" :key="index" :width="item.title.length>=10?200:item.title.length*20"
                    :label="item.title" :render-header="renderHeader">
                    <template slot-scope="scope">
                        <template v-for="(item2,index2) in scope.row.finishpointtable">
                            <template v-if="index == index2">
                                {{item2.score}}
                            </template>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="advise" width="110" label="备注">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.advise" placement="top">
                                <span>
                                    {{scope.row.advise}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="hundredmarksystem" width="110" label="百分制得分" sortable="custom"></el-table-column>
                <el-table-column prop="doctorname" width="120" label="护陪生">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.doctorname" placement="top">
                                <el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{scope.row.doctorname}}</el-button>

                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="doctorcode" label="学号"></el-table-column>
                <el-table-column prop="turngrade" label="年级"></el-table-column>
                <el-table-column prop="majorbaseid" width="130" label="专业基地">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.majorbaseid" placement="top">
                                <span>
                                    {{scope.row.majorbaseid}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="stdtype" width="120" label="学员类型">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stdtype" placement="top">
                                <span>
                                    {{scope.row.stdtype}}
                                </span>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="evaluationmonth" width="120" label="评分日期"></el-table-column>
            </el-table>
            <el-pagination style="float:right;margin:10px 10px" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" :current-page="pagenum" :page-size="pagepersize" :total="totalCount">
            </el-pagination>
        </div>
        <!-- 个人档案 -->
        <student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
    </div>
</template>
<script>
    import { mapState, mapActions } from 'vuex';
    import studentPersonalInfo from "../../components/studentPersonalInfo.vue"
    import { post, getCookie, setTitle, exportMouldExcel, exportExcel, currentYear } from '../../config/util';
    export default {
        name: 'graduationExamination',
        data() {
            return {
                exportOptions: {},
                idList: [],
                allvalue: '',
                baseList: [],
                pagenum: 1,
                pagepersize: 10,
                totalCount: 0,
                majorbaseList: '',
                tabletitlelist: [],
                departmentList: [],
                postUrl: {
                    doctor: '/turnevaluate/queryevaluationdetail'
                },
                queryForm: {
                    turngrade: '',
                    baseid: '',
                    doctoroffice: '',
                    stdtype: '',
                    startdate: "",
                    enddate: '',
                    stdsearchinfo: '',
                    majorbaseid: '',
                    ordertype: 1

                },
                dataList: [],
                dialogshow: 1,
                loading: false,
                stunumoptionlist: [],//学号列表
                stunumoptioneditlist: [],//学生姓名
                hospitalnumber: '',//住培学号
                editTableVisible: false,
                addTableVisible: false,
                allValue: '',
                examyear: '',
                addForm: {
                    id: '',
                    stdid: "",
                    theorypassflag: '',
                    skillpassflag: '',
                    examyear: ''
                },
                rules: {
                    stdid: [{ required: true, message: '请输入您的姓名', trigger: 'blur', type: 'number' }],
                    theorypassflag: [{ required: true, message: '请选择通过或者不通过', trigger: 'blur' }],
                    skillpassflag: [{ required: true, message: '请选择通过或者不通过', trigger: 'blur' }],
                    examyear: [{ required: true, message: '年级', trigger: 'blur' }]
                },
                dialogRecords: false,
                studentDetailId: "",
            }
        },
        computed: {
            ...mapState(['allOption',]),
        },
        components: {
            studentPersonalInfo
        },
        methods: {
            ...mapActions(['initAllOptionListUG']),
            personalDetail(index, row) {
                this.dialogRecords = true;
                // textData-fix
                this.studentDetailId = row.uid
            },
            //表头扩展
            renderHeader(h, { column }) {
                return (
                    <el-tooltip
                        class="item"
                        effect="dark"
                        content={column.label}
                        placement="top"
                    >
                        <span>{column.label}</span>
                    </el-tooltip>
                )
            },
            getData(pagenum, pagepersize, baseid, doctoroffice, turngrade, majorbaseid, stdtype, stdsearchinfo, startdate, enddate, ordertype) {
                let self = this;
                self.exportOptions = {
                    baseid: baseid,
                    doctoroffice: doctoroffice,
                    turngrade: turngrade,
                    majorbaseid: majorbaseid,
                    stdtype: stdtype,
                    stdsearchinfo: stdsearchinfo,
                    type: 5,
                    startdate: startdate ? startdate : self.queryForm.startdate,
                    enddate: enddate ? enddate : self.queryForm.enddate,
                    ordertype: ordertype == 0 ? 0 : 1,
                }
                self.loading = true;
                post('/turnevaluate/queryevaluationdetail', {
                    command: 'turnevaluate/queryevaluationdetail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    pagenum: pagenum ? pagenum : 1,
                    pagepersize: self.pagepersize ? self.pagepersize : 10,
                    baseid: baseid,
                    doctoroffice: doctoroffice,
                    turngrade: turngrade,
                    majorbaseid: majorbaseid,
                    stdtype: stdtype,
                    stdsearchinfo: stdsearchinfo,
                    type: 5,
                    startdate: startdate ? startdate : self.queryForm.startdate,
                    enddate: enddate ? enddate : self.queryForm.enddate,
                    ordertype: ordertype == 0 ? 0 : 1,
                }).then(function (data) {
                    self.loading = false;
                    if (data && data.errcode == 0) {
                        self.dataList = data.detaillist;
                        self.totalCount = data.totalcount;
                        self.tabletitlelist = self.dataList[0].finishpointtable;
                    }
                }).catch(() => {
                    self.loading = false;
                })

            },
            newbasechange() {
                let self = this
                self.departmentList = [];
                self.queryForm.doctoroffice = '';
                self.baseList.map(item => {
                    if (self.queryForm.baseid == item.id) {
                        self.departmentList = item.childlist;
                    }
                });
            },
            //导出
            exportList() {
                let postUrl = this.postUrl.doctor;
                let self = this;
                let data = {
                    command: 'turnevaluate/queryevaluationdetail',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    type: 5,
                    startdate: self.queryForm.startdate,
                    enddate: self.queryForm.enddate,
                    ...this.exportOptions
                }
                exportExcel(data)
            },
            //获得参数
            getFilterData() {
                let params = { ...this.queryForm };
                params.type = 5;
                return params;
            },
            /*分页区*/
            handleSizeChange(size) {
                this.pagepersize = size;
                this.getData(this.pagenum, this.pagepersize, this.queryForm.baseid, this.queryForm.doctoroffice, this.queryForm.turngrade, this.queryForm.majorbaseid, this.queryForm.stdtype, this.queryForm.stdsearchinfo, this.queryForm.startdate, this.queryForm.enddate, this.queryForm.ordertype);
            },
            handleCurrentChange(currentPage) {
                this.pagenum = currentPage;
                this.getData(this.pagenum, this.pagepersize, this.queryForm.baseid, this.queryForm.doctoroffice, this.queryForm.turngrade, this.queryForm.majorbaseid, this.queryForm.stdtype, this.queryForm.stdsearchinfo, this.queryForm.startdate, this.queryForm.enddate, this.queryForm.ordertype);
            },
            handleSelectionChange(item) {
                let self = this	//0未开始1进行中2已结束
                self.idList = [];
                for (var i = 0; i < item.length; i++) {
                    //	//console.log(item)
                    self.idList.push(item[i].id)
                }
            },
            gettime: function (date) {		//选取时间段
                console.log(date)
                this.queryForm.startdate = date//选取时间段
            },
            getendtime: function (date) {		//选取时间段
                this.queryForm.enddate = date//选取时间段
            },
            //查询
            doSelectQuery() {
                this.getData(this.pagenum, this.pagepersize, this.queryForm.baseid, this.queryForm.doctoroffice, this.queryForm.turngrade, this.queryForm.majorbaseid, this.queryForm.stdtype, this.queryForm.stdsearchinfo, this.queryForm.startdate, this.queryForm.enddate, this.queryForm.ordertype);
            },
            add() {
                this.dialogshow = 1
                this.addTableVisible = true;
                for (let key in this.addForm) {
                    this.addForm[key] = '';
                }
            },
            edit(index, item) {
                let self = this;
                this.title = '编辑';
                this.dialogshow = 2;
                this.addTableVisible = true;
                this.addForm.stdid = item.stdid
                post('/turngraduexam/getgraduexam', {
                    command: 'turngraduexam/getgraduexam',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: item.id
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.stunumoptioneditlist = [
                            {
                                stdid: data.bean.stdid,
                                name: data.bean.stdname,
                                code: data.bean.examyear
                            }
                        ];
                        self.addForm.id = data.bean.id;
                        self.addForm.stdid = data.bean.stdid;
                        self.addForm.theorypassflag = String(data.bean.theorypassflag);
                        self.addForm.skillpassflag = String(data.bean.skillpassflag);
                        self.addForm.examyear = data.bean.examyear;
                    }
                });
            },
            editSubmit() {
                let self = this;
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        post('/turngraduexam/updategraduexam', {
                            command: 'turngraduexam/updategraduexam',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            id: self.addForm.id,
                            stdid: self.addForm.stdid,
                            theorypassflag: self.addForm.theorypassflag,
                            skillpassflag: self.addForm.theorypassflag,
                            examyear: self.addForm.examyear
                        }).then(function (data) {
                            if (data && data.errcode == 0) {
                                self.$message({
                                    message: '保存成功',
                                    type: 'success'
                                })
                                self.addTableVisible = false
                                //重新初始化数据
                                self.getData()
                            } else {
                                self.$message({
                                    message: data.errdesc,
                                    type: 'warning'
                                })
                                self.addTableVisible = false
                            }
                        })
                    } else {
                        return false
                    }
                });
            },
            getMajorbase() {
                let self = this
                post('/turnbaseinfo/getdeptchildbypid', {
                    command: 'turnbaseinfo/getdeptchildbypid',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: '99'
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        self.majorbaseList = data.beanlist;
                    }
                })
            },
            getbaseList() {
                let self = this;
                post('/turnbaseinfo/getusermanagerdepttree', {
                    command: 'turnbaseinfo/getusermanagerdepttree',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid')
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        self.baseList = data.depttree.childlist;
                    }
                });
            },
            queryAll() {
                for (let key in this.queryForm) {
                    this.queryForm[key] = ''
                }
                this.getData();
            },
            addSubmit() {
                let self = this;
                this.dialogshow = 1;
                this.title = '新增';
                this.$refs.addForm.validate((valid) => {
                    if (valid) {
                        post('/turngraduexam/addgraduexam', {
                            command: 'turngraduexam/addgraduexam',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            stdid: self.addForm.stdid,
                            theorypassflag: self.addForm.theorypassflag,
                            skillpassflag: self.addForm.theorypassflag,
                            examyear: self.addForm.examyear
                        }).then(function (data) {
                            if (data && data.errcode == 0) {
                                self.$message({
                                    message: "保存成功",
                                    type: 'success'
                                });
                                self.addTableVisible = false;
                                //重新初始化数据
                                self.getData();
                            } else {
                                self.$message({
                                    message: data.errdesc,
                                    type: 'warning'
                                })
                                self.addTableVisible = false;
                            }
                        });
                    } else {
                        console.log('error submit!!')
                        return false
                    }
                });
            },
            //升降序
            PercentileOrdering(column) {
                if (column && column.order == 'descending') {
                    this.queryForm.ordertype = 0
                } else if (column && column.order == 'ascending') {
                    this.queryForm.ordertype = 1
                } else {
                    this.queryForm.ordertype = ''
                }
                this.doSelectQuery();
            },
        },
        mounted() {
            //默认为当前的月份
            this.queryForm.startdate = currentYear();
            this.queryForm.enddate = currentYear();
            this.getData();
            this.initAllOptionListUG({ type: 'graduationexamyear' })//考试年度;
            this.initAllOptionListUG({ type: 'turngrade' })//年级;
            this.initAllOptionListUG({ type: 'stud_type' })//学员类型;
            this.getbaseList();//基地;
            this.getMajorbase()//专业基地;


        }

    }
</script>

<style scoped>
    .graduationTools>div {
        float: left;
    }

    .graduationQueryTools .queryAll {
        float: left;
        padding: 0 5px;
        font-size: 13px;
    }

    .queryDoctorWrap {
        margin-left: 50px;
    }

    .queryDoctorWrap /deep/ .el-form-item__label {
        text-align: right;
    }

    .graduationFormItem>/deep/ label {
        width: 100px !important;
    }

    .graduationFormItem {
        text-align: left;
    }

    .graduationFormItem>/deep/.el-form-item__content {
        margin-left: 100px !important;
    }

    .graduationQueryBtn>/deep/.el-form-item__content {
        margin-left: 40px !important;
    }

    .graduationQueryTools .el-form {
        float: left;
    }

    .graduationQueryTools .queryAll>button {
        float: left;
        margin-right: 5px;
    }

    .graduationQueryTools .el-form .el-form-item {
        display: inline-block;
    }

    .graduationQueryTools .el-select {
        width: 120px;
    }

    .editForm {
        width: 400px;
        margin: 0 auto;
    }

    .editForm .el-input {
        width: 217px;
    }

    .editForm .el-radio {
        margin-right: 30px;
    }

    .actionBtn {
        position: absolute;
        right: 20px;
        bottom: 0px;
    }

    .graduationSearch {
        margin-top: -20px;
    }

    .graduationSearch>.el-input,
    .graduationSearch>button {
        display: inline-block;
    }

    .graduationSearch>.el-input {
        width: 220px;
    }

    .detailFont {
        font-size: 10px;
    }

    .el-table .caret-wrapper {
        position: absolute;
    }

    .el-table /deep/ th>.cell {
        font-size: 13px !important;
    }
</style>