<template>
    <div class="teachingrounds-page teachingrounds">
        <el-tabs type="card" v-model="activeName">
            <el-tab-pane label="教学巡查" name="first">
                <patrolevaluate></patrolevaluate>
            </el-tab-pane>
            <el-tab-pane label="教学查房（现场打分）" name="second">
                <div class="wapper">
                    <div class="tools">
                        <div class="funcTools">
                            <el-button type="primary" @click='exportList'>批量导出</el-button>
                        </div>
                    </div>

                    <div class="queryTools graduationQueryTools">
                        <div class="queryAll">
                            <el-button type="text" @click="queryAll">全部</el-button>
                        </div>
                        <el-form ref="queryForm" label-width="80px" :model="queryForm">
                            <div class="queryTeacgingWrap">
                                <el-form-item label="科室" prop="" style="width: 300px;" class="hosDeptBox">
                                    <el-select v-model="hosDeptName" placeholder="请选择科室" multiple collapse-tags @remove-tag="removeNode">
                                        <el-option disabled style="height: auto;" value="">
                                            <el-tree ref="tree" :data="hosDeptTree" node-key="id" :check-strictly="true" :check-on-click-node="true" :expand-on-click-node="true"
                                                :props="defaultProps" @check-change="handleCheckChange1" class="selfTree" show-checkbox></el-tree>
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="评分日期" style="width: 295px;" label-width="70px">

                                    <el-date-picker v-model="queryForm.dateArr" type="monthrange" range-separator="至" start-placeholder="选择日期" end-placeholder="选择日期">
                                    </el-date-picker>
                                </el-form-item>
                                <el-button type="primary" class="queryBtn" @click="doSelectQuery">查询</el-button>
                            </div>
                        </el-form>
                    </div>
                    <div class="dataTable">
                        <el-table ref="detailTable" border :data="dataList" tooltip-effect="dark" style="width: 100%" v-loading.body="loading" @selection-change="handleSelectionChange"
                            @sort-change="scoreOrder">
                            <el-table-column type="index" min-width="50" label="序号" fixed="left"></el-table-column>
                            <el-table-column prop="name" label="查房老师" min-width="150" fixed='left'>
                                <template slot-scope="scope">
                                    <el-button type="text" size="small" @click="employeeDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column prop="username" min-width="110" label="工号"></el-table-column>
                            <el-table-column prop="deptname" min-width="110" label="科室 "></el-table-column>
                            <el-table-column prop="techtitle" min-width="110" label="技术职称 "></el-table-column>
                            <el-table-column prop="admissionnum" min-width="110" label="患者护培生号 "></el-table-column>
                            <el-table-column prop="diseasename" min-width="110" label="疾病名称 "></el-table-column>
                            <el-table-column prop="finishpointtable" v-for="(item,index) in tabletitlelist" :key="index" :width="item.title.length>=10?200:item.title.length*20"
                                :label="item.title">
                                <template slot-scope="scope">
                                    <template v-for="(item2,index2) in scope.row.finishpointtable">
                                        <template v-if="index == index2">
                                            {{item2.evascore}}
                                        </template>
                                    </template>
                                </template>
                            </el-table-column>
                            <el-table-column prop="advise" width="110" label="意见和建议">
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
                            <el-table-column prop="totalscore" width="110" label="得分" sortable="custom"></el-table-column>
                            <el-table-column prop="teachername" width="130" label="评分人"></el-table-column>
                            <el-table-column prop="evaluationmonth" width="110" label="评分日期"></el-table-column>
                        </el-table>
                        <el-pagination style="float:right;margin:10px 10px" layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange"
                            @current-change="handleCurrentChange" :current-page="pagenum" :page-size="pagepersize" :total="totalCount">
                        </el-pagination>
                    </div>
                    <!-- 职工信息 -->
                    <employee-info :dialogEmployee.sync="dialogEmployee" :currentDataId="currentDataId"></employee-info>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>


</template>
<script>
    import patrolevaluate from "./patrolevaluate.vue"
    import { mapActions, mapState } from 'vuex'
    import { currentYear, getCookie, post, exportExcel } from '../../config/util'
    import employeeInfo from "../../components/employeeInfo.vue"
    import moment from 'moment';

    export default {
        name: 'graduationExamination',
        data() {
            return {
                hosDeptTree: [],
                defaultProps: {
                    label: 'name',
                    children: 'childrens',
                    disabled: function (data, node) {
                        if (data.havePermission != 1) {
                            return true
                        }
                    }
                },
                hosDeptName: [],
                activeName: 'first',
                currentDataId: "", // 当前点击职工详情信息
                dialogEmployee: false, //职工详情弹窗
                allvalue: '',
                baseList: [],
                pagenum: 1,
                pagepersize: 10,
                totalCount: 0,
                majorbaseList: '',
                tabletitlelist: [],
                departmentList: [],
                queryForm: {
                    hospitalId: "",
                    baseid: '',
                    doctoroffice: '',
                    startdate: "",
                    enddate: '',
                    ordertype: '',
                    dateArr: ['', ''],

                },
                dataList: [],
                loading: true,
                allValue: '',
                exportOptions: {}
            }
        },
        components: {
            employeeInfo,
            patrolevaluate,
        },
        computed: {
            ...mapState(['allOption',]),
        },
        methods: {
            ...mapActions(['initAllOptionListUG']),
            initDeptTree() {
                post('/base/dept/getMyDeptTree', {
                    showBase: 1
                }).then((data) => {
                    if (data && data.resCode == 200) {
                        this.hosDeptTree = data.model
                    } else {
                        this.$message({
                            type: "error",
                            message: data.resMsg
                        })
                    }
                }).catch(() => {
                    this.$message({
                        type: "error",
                        message: data.resMsg
                    })
                })
            },
            removeNode(e) {
                this.queryForm.deptId = []
                this.hosDeptName = []
                this.hospitalIdList = []
                this.baseIdlist = []
                this.deptIdList = []
                let response = this.$refs.tree.getCheckedNodes();
                response.forEach(item => {
                    if (e != item.name) {
                        this.hosDeptName.push(item.name)
                        this.queryForm.deptId.push(item.id)
                        if (item.deptlevel == 1 && item.type == 0) {
                            this.hospitalIdList.push(item.id)
                        } else if (item.deptlevel == 2 && item.type == 0) {
                            this.baseIdlist.push(item.id)
                        } else if (item.type == 1) {
                            this.deptIdList.push(item.id)
                        }
                    }
                })
                this.$refs.tree.setCheckedKeys(this.queryForm.deptId);
            },
            handleCheckChange1(data, dataObj) {
                if (data.havePermission != 1) {
                    return false;
                }
                this.hosDeptName = []
                this.hospitalIdList = []
                this.baseIdlist = []
                this.deptIdList = []
                let response = this.$refs.tree.getCheckedNodes();
                response.forEach(item => {
                    this.hosDeptName.push(item.name)
                    if (item.deptlevel == 1 && item.type == 0) {
                        this.hospitalIdList.push(item.id)
                    } else if (item.deptlevel == 2 && item.type == 0) {
                        this.baseIdlist.push(item.id)
                    } else if (item.type == 1) {
                        this.deptIdList.push(item.id)
                    }
                })
            },
            employeeDetail(index, row) {
                this.dialogEmployee = true
                this.currentDataId = row.teacherid;
            },
            queryAll() {
                this.pagenum = 1;
                this.queryForm.baseid = '';
                this.queryForm.doctoroffice = '';
                this.queryForm.turngrade = '';
                this.queryForm.majorbaseid = '';
                this.queryForm.stdtype = '';
                this.queryForm.tecsearchinfo = '';
                this.queryForm.stdsearchinfo = '';
                this.queryForm.startdate = '';
                this.queryForm.dateArr = ['', ''];
                this.queryForm.enddate = '';
                this.queryForm.ordertype = '';
                this.hosDeptName = []
                this.hospitalIdList = []
                this.baseIdlist = []
                this.deptIdList = []
                this.getData(this.pagenum, this.pagepersize, this.queryForm.baseid, this.queryForm.doctoroffice, this.queryForm.turngrade, this.queryForm.majorbaseid, this.queryForm.stdtype, this.queryForm.tecsearchinfo, this.queryForm.stdsearchinfo, this.queryForm.startdate, this.queryForm.enddate, this.queryForm.ordertype);
            },
            getData(pagenum, pagepersize, baseid, doctoroffice, startdate, enddate, ordertype) {
                let self = this;
                self.loading = true;
                post('/turn/queryevaluatedlist', {
                    command: 'turn/queryevaluatedlist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    pagenum: pagenum ? pagenum : 1,
                    pagepersize: self.pagepersize ? self.pagepersize : 10,
                    hospitalIdList: self.hospitalIdList,
                    deptIdList: self.deptIdList,
                    baseIdlist: self.baseIdlist,
                    type: 14,
                    startdate: this.queryForm.dateArr != null && this.queryForm.dateArr[0] ? moment(this.queryForm.dateArr[0]).format('YYYY-MM') : "",
                    enddate: this.queryForm.dateArr != null && this.queryForm.dateArr[1] ? moment(this.queryForm.dateArr[1]).format('YYYY-MM') : "",
                    ordertype: ordertype !== '' ? ordertype : ''
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.dataList = data.evaluatedlist;
                        self.totalCount = data.totalcount;
                        self.tabletitlelist = self.dataList[0] && self.dataList[0].finishpointtable;
                        self.loading = false;
                    } else {
                        self.loading = false;
                    }
                });

            },
            newbasechange() {
                let self = this;
                self.queryForm.doctoroffice = '';
                self.departmentList = [];
                self.baseList.map(item => {
                    if (self.queryForm.baseid == item.id) {
                        self.departmentList = item.childlist;
                    }
                });
            },
            //导出
            exportList() {
                let data = {
                    command: 'turn/queryevaluatedlist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    type: 14,
                    ...this.exportOptions
                }
                exportExcel(data)
            },
            //获得参数
            getFilterData() {
                let params = { ...this.queryForm };
                params.type = 1;
                return params;
            },
            /*分页区*/
            handleSizeChange(size) {
                this.pagepersize = size;
                this.getData(this.pagenum, this.pagepersize, this.queryForm.baseid, this.queryForm.doctoroffice, this.queryForm.turngrade, this.queryForm.majorbaseid, this.queryForm.stdtype, this.queryForm.tecsearchinfo, this.queryForm.stdsearchinfo, this.queryForm.startdate, this.queryForm.enddate, this.queryForm.ordertype);
            },
            handleCurrentChange(currentPage) {
                this.pagenum = currentPage;
                this.getData(this.pagenum, this.pagepersize, this.queryForm.baseid, this.queryForm.doctoroffice, this.queryForm.turngrade, this.queryForm.majorbaseid, this.queryForm.stdtype, this.queryForm.tecsearchinfo, this.queryForm.stdsearchinfo, this.queryForm.startdate, this.queryForm.enddate, this.queryForm.ordertype);
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
                this.queryForm.startdate = date//选取时间段

            },
            getendtime: function (date) {		//选取时间段
                this.queryForm.enddate = date//选取时间段
            },
            //查询
            doSelectQuery() {
                this.exportOptions = { ...this.queryForm };
                this.getData(this.pagenum, this.pagepersize, this.queryForm.baseid, this.queryForm.doctoroffice, this.queryForm.startdate, this.queryForm.enddate, this.queryForm.ordertype);
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
            //升降序
            scoreOrder(column) {
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
            this.getData();
            this.getbaseList();//基地;
            this.initDeptTree()


        }

    }
</script>

<style scoped>
    .teachingrounds-page {
        padding: 0 20px;
    }

    .wapper {
        padding: 0;
    }

    .graduationTools>div {
        float: left;
    }

    .graduationQueryTools .queryAll {
        float: left;
        padding: 0 5px;
        font-size: 13px;
    }

    .graduationQueryTools /deep/ .el-form-item__label {
        text-align: left;
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

    .graduationQueryBtn {
        width: 210px;
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

    .el-table /deep/ th>.cell {
        font-size: 13px !important;
    }

    .el-form>.queryTeacgingWrap>.el-form-item {
        margin-bottom: 12px;
        margin-right: 15px;
    }
</style>
<style>
    .teachingrounds .queryTools .el-date-editor--monthrange {
        width: 215px;
    }
    .teachingrounds .el-input  {
		width: 200px;
	}
</style>