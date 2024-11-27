<template>
    <div class="wapper">
        <div style="float: right;margin-bottom: 15px">
            <el-input style="width: 200px;" v-model="inputquery" placeholder="请输入学员名字" @keyup.enter.native="onlyqueryname"></el-input>
            <el-button class="querybtn" type="primary" @click="onlyqueryname"> 搜索 </el-button>
        </div>
        <div class="tools graduationTools">
            <div class="funcTools">
                <el-button type="primary" @click='exportList'>批量导出</el-button>
            </div>
        </div>
        <div class="queryTools newQueryTools">
            <el-row>
                <el-col :span="1">
                    <el-button type="text" @click="queryAll">全部</el-button>
                </el-col>
                <el-col :span="21" style="display:flex">
                    <div class="queryTools zy-clear">
                        <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="100px">
                            <div class="mainQuery">
                                <el-form-item label="年级">
                                    <el-select v-model="queryForm.grade" filterable placeholder="请选择">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option v-for="item in gradlistUG" :key="item.key" :label="item.name" :value="item.key">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="学员类型" prop="">
                                    <el-select filterable v-model="queryForm.studenttype" placeholder="请选择">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option v-for="item in selectOptions.stud_type" :key="item.key" :label="item.name" :value="item.key">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <!-- <el-form-item label="专业基地">
                                    <el-select v-model="queryForm.baseid" filterable placeholder="请选择">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option v-for="item in hospital.baselist" :key="item.id" :label="item.deptname" :value="item.id">
                                        </el-option>
                                    </el-select>
                                </el-form-item> -->
                                <!-- <hospital-base-dept :clearAll="rightNowClear" @updateSelectIds="setQueryFormOne" :hasDept="hasDept"></hospital-base-dept> -->
                                <el-form-item label="专业基地">
                                    <el-select v-model="hosBaseDeptName" placeholder="请选择基地" :popper-append-to-body="false" collapse-tags @clear="clearall" clearable>
                                        <el-option label="全部" value="" @click.native="clearall"></el-option>
                                        <el-option disabled class="baseOption" value> </el-option>
                                            <el-tree :data="hosBaseTree" :props="defaultProps" ref="tree" check-strictly node-key="id" @node-click="handleNodeClick"
                                                class="hosWithNoCheckBox">
                                            </el-tree>
                                       
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="年度考评">
                                    <el-select v-model="queryForm.yearreview" filterable placeholder="请选择">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option label="第一年度" value="1"></el-option>
                                        <el-option label="第二年度" value="2"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="通过执业医师" label-width="100px" style="width: 220px;">
                                    <el-select v-model="queryForm.ispass" filterable placeholder="请选择">
                                        <el-option label="全部" value=""></el-option>
                                        <el-option label="是" value="1"></el-option>
                                        <el-option label="否" value="0"></el-option>
                                    </el-select>
                                </el-form-item>
                            </div>
                            <!-- <div class="additionQuery">
                                
                            </div> -->
                        </el-form>
                    </div>
                </el-col>
                <el-col :span="2">
                    <div class="queryWrap" style="float:right">
                        <el-button type="primary" @click="query" class="new-el-button">查询</el-button>
                    </div>
                </el-col>
            </el-row>
        </div>

        <div style="width:100%;">
            <div class="dataTable">
                <el-table ref="detailTable" :data="rateList" border tooltip-effect="dark" style="width: 100%" v-loading="loading">
                    <!--<el-table-column type ="selection" width = "45"  >
                    </el-table-column>-->
                    <el-table-column type="index" fixed width="65" label="序号"></el-table-column>-->
                    <el-table-column prop="name" fixed with="120" label="姓名">
                        <template slot-scope="scope">
                            <div class="actionplansty">
                                <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.name" placement="top">
                                    <el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="username" label="学号"></el-table-column>
                    <el-table-column prop="gradename" label="年级"></el-table-column>
                    <el-table-column prop="stdtypename" label="学员类型">
                        <template slot-scope="scope">
                            <div class="actionplansty">
                                <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.stdtypename" placement="top">
                                    <span>
                                        {{scope.row.stdtypename}}
                                    </span>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="basename" label="专业基地" width="120">
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
                    <el-table-column prop="tutorname" label="硕士导师"></el-table-column>
                    <el-table-column prop="educationalname" label="最高学历"></el-table-column>
                    <el-table-column prop="degreename" label="最高学位"></el-table-column>
                    <el-table-column prop="degreetypename" label="学位类型">
                        <template slot-scope="scope">
                            <div class="actionplansty">
                                <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.degreetypename" placement="top">
                                    <span>
                                        {{scope.row.degreetypename}}
                                    </span>
                                </el-tooltip>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="sexname" label="性别"></el-table-column>
                    <el-table-column prop="teachingrounds" width="180" label="教学查房/次数"></el-table-column>
                    <el-table-column prop="casediscussioncount" width="150" label="病例讨论/次数"></el-table-column>
                    <el-table-column prop="lecturecount" width="150" label="小讲课/次数"></el-table-column>
                    <el-table-column prop="lecturecasediscussioncount" width="150" label="主讲病例讨论/次数"></el-table-column>
                    <el-table-column prop="comprehensiveevaluate" label="综合评价"></el-table-column>
                    <el-table-column prop="speciallectureflag" width="210" label="护培生培训专设讲座出勤率"></el-table-column>
                    <el-table-column prop="theoryscore" width="180" label="理论成绩"></el-table-column>
                    <el-table-column prop="basewritescore" width="180" label="病历书写成绩"></el-table-column>
                    <el-table-column prop="examstatusname" width="150" label="中期考核成绩"></el-table-column>
                    <el-table-column prop="absenteeismdays" label="旷工天数"></el-table-column>
                    <el-table-column prop="malpracticeflag" label="医疗事故"></el-table-column>
                    <el-table-column prop="medicaldisputescounts" width="180" label="医疗纠纷和投诉/次数"></el-table-column>
                    <el-table-column prop="clinicaloperationflag" width="200" label="管理病人数、病种数、临床操作是否达到要求？" :render-header="renderHeader" show-overflow-tooltip></el-table-column>

                    <el-table-column prop="descplist" label="SCI论文数" width="100">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 1 && item.detailtype == 1">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="descplist" width="180" label="统计源核心论文数">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 1 && item.detailtype == 2">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="descplist" width="200" label="其他（学术/非学术均可）论文数" :render-header="renderHeader" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 1 && item.detailtype == 3">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column prop="dplist" width="200" label="备注">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.dplist" v-if="item.type == 1">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" popper-class="zy-limit-width" :content="item.descp" placement="top">
                                        <span>
                                            {{item.descp}}
                                        </span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column prop="descplist" width="180" label="主持课题数国家级/次数">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 2 && item.detailtype == 1">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="descplist" width="180" label="主持课题数省级/次数">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 2 && item.detailtype == 2">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="descplist" width="180" label="主持课题数校级/次数">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 2 && item.detailtype == 3">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="descplist" width="180" label="主持课题数院级/次数">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 2 && item.detailtype == 4">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dplist" width="200" label="备注">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.dplist" v-if="item.type == 2">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" popper-class="zy-limit-width" :content="item.descp" placement="top">
                                        <span>
                                            {{item.descp}}
                                        </span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column prop="descplist" width="180" label="参与课题数国家级/次数">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 3 && item.detailtype == 1">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="descplist" width="180" label="参与课题数省级/次数">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 3 && item.detailtype == 2">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="descplist" width="180" label="参与课题数校级/次数">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 3 && item.detailtype == 3">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="descplist" width="180" label="参与课题数院级/次数">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 3 && item.detailtype == 4">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dplist" width="200" label="备注">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.dplist" v-if="item.type == 3">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" popper-class="zy-limit-width" :content="item.descp" placement="top">
                                        <span>
                                            {{item.descp}}
                                        </span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column prop="descplist" label="国家级奖励" width="100">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 4 && item.detailtype == 1">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="descplist" label="省级奖励">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 4 && item.detailtype == 2">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="descplist" label="校级奖励">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 4 && item.detailtype == 3">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="descplist" label="院级奖励">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.descplist" v-if="item.type == 4 && item.detailtype == 4">
                                {{item.content}}
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column prop="dplist" width="200" label="备注">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.dplist" v-if="item.type == 4">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" popper-class="zy-limit-width" :content="item.descp" placement="top">
                                        <span>
                                            {{item.descp}}
                                        </span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column prop="dplist" width="200" label="惩罚情况">
                        <template slot-scope="scope">
                            <template v-for="(item , index) in scope.row.dplist" v-if="item.type == 5">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" popper-class="zy-limit-width" :content="item.descp" placement="left">
                                        <span>
                                            {{item.descp}}
                                        </span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </template>
                    </el-table-column>

                    <el-table-column prop="practitionerflagname" width="180" label="是否通过执业医师"></el-table-column>
                    <el-table-column prop="yearflagname" label="年度考评"></el-table-column>

                </el-table>
                <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="pageno" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
                    :total="totalCount">
                </el-pagination>
            </div>
        </div>
        <!-- 个人档案 -->
        <student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
    </div>
</template>
<script>
    import studentPersonalInfo from "../../components/studentPersonalInfo.vue"
    import { post, getCookie, exportExcel } from '../../config/util';
    import { mapState, mapActions } from 'vuex';
    import hospitalBaseDept from "../../components/hospitalBaseDept"

    export default {
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
                queryForm: {
                    hospitalId: "",
                    grade: '',
                    baseid: '',
                    studenttype: '',
                    yearreview: '',
                    ispass: '',
                },
                inputquery: '',
                pageno: 1,
                pagesize: 10,
                totalCount: 0,
                rateList: [],
                usePage: false,
                loading: false,
                showAdditionQuery: false
            }
        },
        computed: {
            ...mapState(['gradlistUG', 'hospital', 'selectOptions',])
        },
        mounted() {
            this.getMyBaseTree()
            this.fillGradListUG();
            this.toinitHospitalInfour();
            this.initSelectList({ type: 'degree,stud_type' })
            this.inittable(this.pageno, this.pagesize, '', '', '', '', '', '');
        },
        components: {
            studentPersonalInfo,
            hospitalBaseDept
        },
        methods: {
            ...mapActions(['initSelectList']),
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
                    this.queryForm.baseid = ""
                    this.queryForm.deptid = ""
                } else {
                    this.queryForm.hospitalId = ""
                    this.queryForm.baseid = data.id
                    this.queryForm.deptid = ""
                }
            },
            clearall() {
                this.queryForm.hospitalId = ""
                this.queryForm.baseid = ""
                this.queryForm.deptid = ""
            },
            setQueryFormOne(form) {
                this.queryForm.hospitalId = form.hospitalId
                this.queryForm.baseid = form.baseId
            },
            personalDetail(index, row) {
                this.dialogRecords = true;
                // textData-fix
                this.studentDetailId = String(row.uid)
            },
            ...mapActions(['initAllOptionListUG', 'fillGradListUG', 'toinitHospitalInfour']),
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
            handleSizeChange(size) {
                this.pagesize = size;
                this.inittable(
                    this.pageno, this.pagesize,
                    this.queryForm.grade, this.queryForm.baseid,
                    this.queryForm.studenttype, this.queryForm.yearreview,
                    this.queryForm.ispass, this.inputquery,
                )
            },
            handleCurrentChange(currentPage) {
                this.pageno = currentPage;
                this.usePage = true;
                this.inittable(
                    this.pageno, this.pagesize,
                    this.queryForm.grade, this.queryForm.baseid,
                    this.queryForm.studenttype, this.queryForm.yearreview,
                    this.queryForm.ispass, this.inputquery,
                )
            },
            //导出
            exportList() {
                let data = {
                    command: 'turnedoctormain/getstdperevadetaillist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    ...this.getFilterData()
                }
                exportExcel(data)
            },
            //获得参数
            getFilterData() {
                let params = {
                    command: 'turnedoctormain/getstdperevadetaillist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    turngrade: this.queryForm.grade,
                    base: this.queryForm.baseid,
                    stdtype: this.queryForm.studenttype,
                    yearflag: this.queryForm.yearreview,
                    practitionerflag: this.queryForm.ispass,
                    usersearchinfo: this.inputquery,
                }
                return params;
            },
            inittable(pagenum, pagesize, grade, baseid, studenttype, yearreview, ispass, inputquery) {
                let self = this;
                self.loading = true;
                post('/turnedoctormain/getstdperevadetaillist', {
                    command: 'turnedoctormain/getstdperevadetaillist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    turngrade: grade,
                    base: baseid,
                    hospitalId: this.queryForm.hospitalId,
                    stdtype: studenttype,
                    yearflag: yearreview,
                    practitionerflag: ispass,
                    usersearchinfo: inputquery,
                    page: pagenum,//1
                    pagesize: pagesize,//10
                }).then(function (data) {
                    self.loading = false;
                    if (data && data.errcode == 0) {
                        if (data.result) {
                            self.rateList = data.result.list;
                            self.totalCount = data.result.count;
                        } else {
                            //接口无返回值
                            self.rateList = [];
                            self.totalCount = 0;
                        };
                    }
                    self.usePage = false;
                }).catch(function (error) {
                    self.loading = false;
                    //console.log(error)
                })
            },

            queryAll: function () {
                let self = this;
                self.queryForm.grade = '';
                self.queryForm.baseid = '';
                self.queryForm.studenttype = '';
                self.queryForm.yearreview = '';
                self.queryForm.ispass = '';
                self.inputquery = '';
                this.rightNowClear = this.rightNowClear + 1
                self.clearall();
                self.hosBaseDeptName = ""
                self.pageno = 1
                self.inittable(self.pageno, self.pagesize, '', '', '', '', '', '');
            },

            query: function () {			//按条件查询，查询按钮
                let self = this;
                self.inputquery = '';
                self.pageno = 1
                self.inittable(
                    self.pageno, self.pagesize,
                    self.queryForm.grade, self.queryForm.baseid,
                    self.queryForm.studenttype, self.queryForm.yearreview,
                    self.queryForm.ispass, ''
                )

            },

            onlyqueryname() {
                let self = this;
                self.queryForm.grade = '';
                self.queryForm.baseid = '';
                self.queryForm.studenttype = '';
                self.queryForm.yearreview = '';
                self.queryForm.ispass = '';
                self.inittable(self.pageno, self.pagesize, '', '', '', '', '', self.inputquery);
            },
        }
    }

</script>
<style scoped>
    .wapper {
        padding: 0 20px 90px 20px;
    }
    .topTools {
        min-height: 50px;
    }

    .topTools:after {
        content: '';
        display: table;
        clear: both;
    }

    .funcTools {
        margin: 15px 0px;
    }

    .queryTools {
        float: left;
        width: 100%;
    }

    .queryAll {
        display: inline-block;
    }

    .queryTools .el-form-item {
        margin-bottom: 10px;
    }

    .queryTools .el-select {
        width: 120px;
    }

    .search {
        float: right;
    }

    .querybtn {
        margin-left: 20px;
    }

    .el-from>.el-form-item {
        width: 230px;
    }
    .el-select-dropdown__item {
        overflow: visible;
        height: auto;
    }

</style>