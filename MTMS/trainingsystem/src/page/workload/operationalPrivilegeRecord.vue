<template>
    <div class="wapper">
        <div class="tool-box">
            <el-button type="primary" @click="exportData">批量导出</el-button>
            <div class="search-input">
                <el-input style="width:200px" v-model="inputInfo" placeholder="请输入姓名/手机号/学号"></el-input>
                <el-button type="primary" @click="doInputQuery">搜索</el-button>
            </div>
        </div>
        <div class="queryTools">
            <div class="queryAll">
                <el-button type="text" @click="queryAll">全部</el-button>
            </div>
            <el-form class="search-form flexForm" :model="queryForm" :inline="true" ref="queryForm" label-width="70px">
                <el-form-item label="科室" prop="" style="width: 300px;" class="hosDeptBox">
                <el-select v-model="hosDeptName"  placeholder="请选择科室" :popper-append-to-body="false"  collapse-tags @clear="clearall" clearable >
                    <el-option  disabled   class="baseOption" value>  </el-option>
                        <el-tree 
                        :data="hosDeptTree" 
                        :props="defaultProps" 
                        ref="tree"
                        check-strictly  
                        node-key="id"
                        @node-click="handleNodeClick"
                         class="hosWithNoCheckBox">
                        </el-tree>
                  
                </el-select>
                </el-form-item>
                <el-form-item label="角色">
                    <el-select v-model="queryForm.roleid" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in roleDatas" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="">
                    <el-select v-model="queryForm.status" placeholder="请选择">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="item in [{name:'胜任中',id:0},{name:'离任',id:1}]" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="日期" style="width: 356px;">
                    <el-date-picker style="width: 133px" v-model="queryForm.startdate" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="gettime">
                    </el-date-picker>
                    -
                    <el-date-picker style="width: 133px" v-model="queryForm.enddate" type="date" placeholder="选择日期" format="yyyy-MM-dd" @change="getendtime">
                    </el-date-picker>
                </el-form-item>

                <el-button type="primary" @click="doSelectQuery">查询</el-button>
            </el-form>
        </div>
        <div class="dataTable">
            <el-table ref="detailTable" :data="roleList" border tooltip-effect="dark" style="width: 100%"
                v-loading="loading">
                <el-table-column label="序号" type="index" min-width="65"></el-table-column>
                <el-table-column label="姓名" prop="name" min-width="120">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.name" placement="top">
                                <el-button type="text" size="small" @click="employeeDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="工号/学号" prop="userName" min-width="120"></el-table-column>
                <el-table-column label="所属角色" prop="roleName" min-width="120"></el-table-column>
                <el-table-column label="所在科室" prop="deptName" min-width="120"></el-table-column>
                <el-table-column label="状态" prop="statusName" min-width="120"></el-table-column>
                <el-table-column label="开始时间" prop="startTime" min-width="150"></el-table-column>
                <el-table-column label="结束时间" prop="endTime" min-width="150"></el-table-column>
                <el-table-column label="任期月" prop="termMonth" min-width="120"></el-table-column>
                <el-table-column label="操作" width="150" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click="editRow(scope.$index, scope.row)" type="text" size="small">修改</el-button>
                        <el-button @click="delRow(scope.$index, scope.row)" type="text" size="small">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageNo" :page-sizes="[10, 20, 50, 100]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </div>

        <el-dialog title="修改" size="small" :visible.sync="modifyDialogVisible" @close="closeModifyDialog">
            <el-form :model="selectedItems">
                <el-form-item label="开始时间">
                    <el-date-picker style="width: 120px" v-model="selectedItems.startTime" type="date" placeholder="选择日期" format="yyyy-MM-dd"
                        @change="modifyStartTime" :picker-options="pickerOptions">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <el-row :gutter="20" style="text-align: right">
                <el-button type="primary" @click="handleSubmitDisable(selectedItems)" style="margin:0 10px 0 0;" class="bottomBtnsSure">确认</el-button>
                <el-button @click="modifyDialogVisible = false" class="bottomBtns" style="margin-right:10px">取消
                </el-button>
            </el-row>
        </el-dialog>
        <!-- 职工信息 -->
        <employee-info :dialogEmployee.sync="dialogEmployee" :currentDataId="currentDataId"></employee-info>
    </div>
</template>

<script>
    import { post, getCookie, setTitle, exportMouldExcel, exportExcel } from '../../config/util'
    import { mapState, mapActions } from 'vuex'
    import employeeInfo from "../../components/employeeInfo.vue"
    import selectTree from "../../components/selectTree.vue"
    import hospitalBaseDept from "../../components/hospitalBaseDept"
    import moment from 'moment'
    export default {
        data() {
            return {
                rightNowClear1: 0,
                rightNowClear: 0,
                currentDataId: "", // 当前点击职工详情信息
                dialogEmployee: false, //职工详情弹窗
                loading: false,
                pageNo: 1,
                pageSize: 10,
                totalCount: 0,
                usePage: false,
                inputInfo: '',
                // 是否是搜索列表
                exportInput: false,
                // 角色
                roleDatas: [],
                // 基地
                baseidList: [],
                // 科室
                deptInBaseList: [],
                // 查询字段
                queryForm: { baseid: '', deptid: '', roleid: '', status: '', startdate: '', enddate: '', hospitalId: "" },
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    }
                },
                // 记录列表
                roleList: [],
                // 修改弹窗
                modifyDialogVisible: false,
                selectedItems: [],
                hosDeptTree: [],
                defaultProps:{
					children: 'childrens',
					label: 'name'
                },
                hosDeptName: "",
                role: "turn"
            }
        },
        components: {
            employeeInfo,
            selectTree,
            hospitalBaseDept
        },
        computed: {
            ...mapState(['systemType']),
        },
        methods: {
            getMyDeptTree() {
                post("/base/dept/getMyDeptTree", {
                    showHospital: 1,
                    showNoDeptHospital: 0,
                    needBaseDept: 0,
                    hospitalId: "",
                }).then(res => {
                    if(res && res.resCode == 200) {
                    if(Array.isArray(res.model) && res.model.length > 0) {
                        this.hosDeptTree = res.model
                    }
                    }
                })
            },
            handleNodeClick(data, checked, node) {
                this.hosDeptName = data.name
                if(data.deptlevel == 1) {
                    this.queryForm.hospitalId = data.id
                    this.queryForm.baseid = ""
                    this.queryForm.deptid = ""
                }else {
                    this.queryForm.hospitalId = ""
                    this.queryForm.baseid = ""
                    this.queryForm.deptid = data.id
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
                this.queryForm.deptid = form.deptId

            },
            setSelectDept({ selectDeptIds, selectDeptName }) {
                this.queryForm.deptid = selectDeptIds.length == 0 ? [] : selectDeptIds
            },
            employeeDetail(index, row) {
                this.dialogEmployee = true
                this.currentDataId = row.uid;
            },
            // 导出
            exportData() {
                let data = {
                    command: 'role/exportRoleRecordView',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    baseId: this.queryForm.baseid,
                    deptId: this.queryForm.deptid,
                    roleId: this.queryForm.roleid,
                    status: this.queryForm.status,
                    startTime: this.queryForm.startdate,
                    endTime: this.queryForm.enddate,
                    searchinfo: this.inputInfo,
                    // 区分住培和实习生
                    systemType: this.systemType
                }
                if (this.systemType == 0) {
                    data.hospitalId = this.queryForm.hospitalId
                }

                exportExcel(data);
            },
            // init
            initQuery(pageNo, pageSize, inputInfo, queryForm) {
                this.loading = true;
                if (this.usePage) {
                    pageNo = this.pageNo;
                } else {
                    pageNo = this.pageNo = 1;
                }
                let self = this;
                let params = {
                    command: 'role/queryRoleRecordView',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    pagenum: pageNo,
                    baseId: this.queryForm.baseid,
                    pagepersize: pageSize,
                    roleId: queryForm.roleid,
                    status: queryForm.status,
                    startTime: queryForm.startdate,
                    endTime: queryForm.enddate,
                    searchinfo: inputInfo,
                    // 区分住培和实习生
                    systemType: self.systemType
                }
                if (this.systemType == 1) {
                    params.deptList = this.queryForm.deptid || []
                }
                if (this.systemType == 0) {
                    params.hospitalId = this.queryForm.hospitalId
                    params.deptId = this.queryForm.deptid
                }
                post('/role/queryRoleRecordView', params).then((data) => {
                    self.loading = false;
                    if (data && data.errcode == 0) {
                        self.usePage = false;
                        self.totalCount = data.totalcount;
                        self.roleList = data.roleList;
                    }
                }).catch(() => {
                    self.loading = false;
                })
            },
            // 搜索
            doInputQuery() {
                this.queryForm.hospitalId = '';
                this.queryForm.baseid = '';
                this.queryForm.deptid = '';
                this.queryForm.roleid = '';
                this.queryForm.status = '';
                this.queryForm.startdate = '';
                this.queryForm.enddate = '';
                this.exportInput = true;
                this.initQuery(this.pageNo, this.pageSize, this.inputInfo, this.queryForm);
            },
            // 查询全部
            queryAll() {
                this.inputInfo = '';
                this.queryForm.hospitalId = ""
                this.queryForm.baseid = '';
                this.queryForm.deptid = '';
                this.queryForm.roleid = '';
                this.queryForm.status = '';
                this.queryForm.startdate = '';
                this.queryForm.enddate = '';
                this.rightNowClear1 = this.rightNowClear1 + 1
                this.rightNowClear = this.rightNowClear + 1
                this.initQuery(this.pageNo, this.pageSize, this.inputInfo, this.queryForm);
            },
            // 条件查询
            doSelectQuery() {
                this.exportInput = false;
                this.initQuery(this.pageNo, this.pageSize, this.inputInfo, this.queryForm)
            },
            /*分页区*/
            handleSizeChange(size) {
                this.pageSize = size;
                if (this.exportInput) {
                    this.doInputQuery();
                } else {
                    this.doSelectQuery();
                }
            },
            handleCurrentChange(currentPage) {
                this.pageNo = currentPage;
                this.usePage = true;
                if (this.exportInput) {
                    this.doInputQuery();
                } else {
                    this.doSelectQuery();
                }
            },

            // 修改弹出窗
            closeModifyDialog() {
                this.modifyDialogVisibl = false;
            },
            // 确认修改
            handleSubmitDisable(selectedItems) {
                let option = JSON.parse(JSON.stringify(selectedItems));
                delete option.name;
                delete option.roleName;
                delete option.deptName;
                delete option.statusName;
                delete option.loginid;
                post('/role/editRecordView', {
                    command: 'role/editRecordView',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    ...option
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.$message({
                            type: 'success',
                            message: '修改成功！'
                        });
                        this.modifyDialogVisible = false;
                        if (this.inputInfo != '') {
                            this.doInputQuery(this.pageNo);
                        } else {
                            this.doSelectQuery(this.pageNo);
                        }
                    } else if (data && data.errcode == 9903) {
                        this.$message({
                            type: 'warning',
                            message: '开始时间不能超过结束时间'
                        })
                    }
                }).catch(() => {
                    this.$message({
                        type: 'success',
                        message: '修改失败,稍后重试!！'
                    });
                })
            },
            modifyStartTime(value) {
                this.selectedItems.startTime = value;
            },
            // 操作
            editRow(index, row) {
                this.selectedItems = JSON.parse(JSON.stringify(row));
                this.modifyDialogVisible = true;
            },
            delRow(index, row) {
                this.$confirm('是否要删除选中的学生?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/role/invalidRecordView', {
                        command: 'role/invalidRecordView',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        id: row.id
                    }).then((data) => {
                        if (data && data.errcode == 0) {
                            this.$message({
                                type: 'success',
                                message: '删除成功！'
                            });
                            this.usePage = true;
                            if (this.inputInfo != '') {
                                this.doInputQuery();
                            } else {
                                this.doSelectQuery();
                            }
                        } else {
                            this.$message({
                                type: 'error',
                                message: data.errdesc,
                            });
                        }
                    }).catch(() => {
                        this.$message({
                            type: 'error',
                            message: '删除失败！'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },

            // time
            gettime: function (date) {
                this.queryForm.startdate = moment(new Date(date)).format("YYYY-MM-DD");;
            },
            getendtime: function (date) {
                this.queryForm.enddate = moment(new Date(date)).format("YYYY-MM-DD");;
            },
            // role
            queryRoles(option) {
                let self = this;
                self.loading = true;
                post('/role/searchrole', {
                    command: 'role/searchrole',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    syscode: this.role,
                    filteredinfo: option
                }).then(function (data) {
                    self.loading = false;
                    if (data && data.errcode == 0) {
                        self.roleDatas = data.roleList;
                    }
                }).catch(() => {
                    self.loading = false;
                })
            },
            //基地
            getbaseidList: function () {
                var self = this;
                post('/turnbaseinfo/getusermanagerdepttree', {
                    command: 'turnbaseinfo/getusermanagerdepttree',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.baseidList = data.depttree.childlist;
                    }
                }).catch(function (error) {
                    //console.log(error)
                })
            },
            // 科室
            initDeptInBaseList() {
                this.queryForm.deptid = '';
                this.deptInBaseList = [];
                this.baseidList.map(item => {
                    if (this.queryForm.baseid == item.id) {
                        this.deptInBaseList = item.childlist;
                    }
                });
            },
            judgesearchrole() {
                let routeName = this.$route.name
                if (routeName.includes("UG")) {
                    this.role = "trainee"
                } else {
                    this.role = "turn"
                }
            }
        },
        mounted() {
            // 获取基地列表
            // this.getbaseidList();
            // 获取角色列表
            this.judgesearchrole()
            this.queryRoles({});
            // 获取列表
            this.initQuery(this.pageNo, this.pageSize, '', '');
            this.getMyDeptTree()
        },
    }
</script>

<style scoped>
    .wapper {
        padding: 0 20px;
    }
    .tool-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .queryTools {
        margin-bottom: 10px !important;
    }

    .queryAll {
        float: left;
        margin-right: 24px;
    }

    .queryTools .el-form-item {
        /* width: 170px; */
        margin-bottom: 10px;
    }

    .search-form {
        margin-left: 50px;
    }

    .el-select {
        width: 120px;
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