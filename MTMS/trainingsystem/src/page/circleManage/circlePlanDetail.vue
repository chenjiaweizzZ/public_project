<template>
    <div class="wapper circlePlanDetail">
        <div class="topTitle">
            <div class="backBtn">
                <el-button type="text" size="large" @click="backToCirclePlan">返回</el-button>
            </div>
            <div class="titleMessage">{{detailTitle}}</div>
        </div>
        <div class="zy-clear" style="min-height:50px;">
            <div class="btnTools" v-if="permission">
                <el-button type="primary" @click="openAddDialog">新增</el-button>
                <el-button type="primary" @click="editStu">编辑</el-button>
                <el-button type="primary" @click="delStus">删除</el-button>
                <el-button type="primary" @click="exportStus">批量导出</el-button>
                <el-button type="primary" @click="importStu">导入学员</el-button>
            </div>
            <div class="queryTools">
                <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="70px" class="flexForm">
                    <hospital-base-dept1 :clearAll="rightNowClear" :hasPermission="hasPermission" @updateSelectIds="setQueryFormOne" :hasHospital="hasHospital"
                        :showDeptTree="showDeptTree"></hospital-base-dept1>
                    <el-form-item label="学位" prop="degre_id">
                        <el-select v-model="queryForm.degre_id" placeholder="请选择">
                            <el-option label="全部" :value="-1"></el-option>
                            <el-option v-for="item in degreeList" :key="item.key" :label="item.name" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="学员类型" prop="type_id">
                        <el-select v-model="queryForm.type_id" placeholder="请选择">
                            <el-option label="全部" :value="-1"></el-option>
                            <el-option v-for="item in stuTypeList" :key="item.id" :label="item.name" :value="item.key">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-button type="primary" @click="selectQuery">查询</el-button>
                </el-form>
            </div>
            <!--<div class = "searchBtn">
    
                </div>-->
            <div class="searchTools">
                <el-input style="width:210px" v-model="input" placeholder="请输入学号/手机号或姓名"></el-input>
                <el-button type="primary" @click="doInputQuery">搜索</el-button>
            </div>
        </div>

        <div class="show-color">
            <div v-for="(item,index) in showcolorlist">
                <span :style="{'background':computeColor(item)}"></span>
                {{item.name}}
            </div>
        </div>
        <div class="detailTable zy-clear" style="position:relative;">
            <div style="width:100%;overflow-x: auto;position: static;" class="table-wrapper">
                <div id="plan-content" class="zy-clear" ref="plan-content">
                    <el-table ref="detailTable" :data="planDetailsDatas" border tooltip-effect="dark" class="custom-table" style="width:auto;overflow:hidden;float:left;position:static;"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" fixed="left" width="55"></el-table-column>
                        <!--<el-table-column type ="index" width = "65" label ="序号"></el-table-column>-->
                        <el-table-column prop="name" class="test2" fixed="left" width="200" label="姓名"></el-table-column>
                        <el-table-column prop="username" width="180" label="学号"></el-table-column>
                        <el-table-column prop="mobile" width="180" label="手机号"></el-table-column>
                        <el-table-column prop="period" width="150" label="年级"></el-table-column>
                        <el-table-column prop="degree" width="150" label="学位"></el-table-column>
                        <el-table-column prop="base" width="200" label="专业基地"></el-table-column>
                        <!-- <el-table-column prop="deptName" width="180" label="科室"></el-table-column> -->
                        <el-table-column prop="type" width="150" label="学员类型"></el-table-column>
                    </el-table>
                    <div style="float:left">
                        <circle-detail :alltime="alltime" :circleData="circleData"></circle-detail>
                    </div>
                </div>
            </div>
            <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="page" :page-sizes="[10, 20, 50, 100]" :page-size="reqnum" layout="total, sizes, prev, pager, next, jumper"
                :total="totalPages">
            </el-pagination>
        </div>

        <el-dialog title="导入学员" :visible.sync="dialogImportStu" size="tiny" :close-on-click-modal="false">
            <el-upload class="upload-demo" style="display:inline-block;margin-right:10px" action="/import/importExcel" ref="upload" :file-list="fileList"
                :data="uploadData" :show-file-list="true" :auto-upload="false" :before-upload='checkFile' :on-change="changeFile"
                :on-success="uploadSuccess" :on-progress="onProgress">
                <el-button type="primary" size="small">选择文件</el-button>
            </el-upload>
            <el-button type="primary" size="small" @click="submitImport">上传</el-button>
        </el-dialog>
        <circleAdjustDialog ref="adjustDialog" :selectItems="selectItems" @resertList="resertList"></circleAdjustDialog>

    </div>
</template>
<script>
    import circleDetail from '../../components/circleDetailLayout.vue'
    import moment from 'moment'
    import { post, get, getCookie, exportExcel, showErrorImport } from '../../config/util'
    import { mapState, mapActions } from 'vuex'
    import selectTree from "../../components/selectTree.vue"
    import hospitalBaseDept1 from "../../components/hospitalBaseDept1"
    import circleAdjustDialog from "../../components/circleAdjustDialog.vue"
    const _ = require('lodash');
    export default {
        data() {
            return {
                fileList: [],
                editDisabled: false,
                degreeList: [],
                stuTypeList: [],
                permission: false,
                dialogImportStu: false,
                hasPermission: 1,
                showDeptTree: true,
                hasHospital: false,
                rightNowClear: 0,
                hasBase: true,
                single: true,
                value1: '',
                loading: false,
                exportOptions: {},
                showcolorlist: [
                    {
                        id: 1,
                        name: '已轮转'
                    },
                    {
                        id: 2,
                        name: '轮转中'
                    },
                    {
                        id: 3,
                        name: '待轮转'
                    },
                    {
                        id: 4,
                        name: '未轮转'
                    }
                ],

                value: '',
                input: '',
                exportInput: false,
                loading: false,
                detailTitle: '',
                dialogAddNewStu: false,
                isstage: { sign: 0, disabled: false },
                //分阶段数据
                stageListData: {
                    stageList: [],
                },
                stagesignarr: [{ name: '否', value: 0 }, { name: '是', value: 1 }],
                addStuForm: {
                    mobile: '',
                    name: '',
                    detail: [{ deptname: '', deptid: '', dateRange: [], turnstarttime: '', turnendtime: '', }]
                },
                mode: 0,//添加状态
                turnstartdate: '',
                selectItems: [],
                planDetailsDatas: [],
                planyearmontlist: [],
                page: 1,
                reqnum: 10,
                exportOptions: {},
                totalPages: 0,
                rowHeight: 0,
                rules: {
                    name: [{ required: true, message: '请输入姓名', trigger: 'change' },],
                    mobile: [{ required: true, message: '请输入学号', trigger: 'change' }],
                },
                mobileOptions: [],
                rooms: [],
                queryForm: {
                    hospitalId: "",
                    plan_id: '',
                    base_id: '',
                    stud_dept_id: '',
                    degre_id: '',
                    type_id: '',
                    turn_dept_id: '',
                    dateRange: '',

                    newbaseid: [],
                    newdepartment: [],
                    newarea: [],
                    hospitalIdForBase: ""
                },
                //全部
                isnewbaseid: '',
                isnewdepartment: '',
                isnewarea: '',

                baseidlist: [],
                officeidlist: [],
                areaidlist: [],

                newroomList: [],
                deptListTree: [],
                newdeptList: [],
                newareaList: [],
                defaultProps: {
                    label: 'name',
                    children: 'childrens'
                },
                pickerOptions: {
                    minTime: '',
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                usePage: false,
                studentDegreeList: [],
                hasFile: false,
            }
        },
        components: {
            circleDetail,
            hospitalBaseDept1,
            selectTree,
            circleAdjustDialog
        },
        computed: {
            ...mapState(['deptList', 'gradeList', 'deptBaseList', 'professionList', 'allOption']),
            circleData() {
                return this.planDetailsDatas.map((item) => item.detail);
            },
            alltime() {
                return this.planyearmontlist;
            },
            uploadData() {
                return {
                    _upload_data: JSON.stringify({
                        "1": {
                            command: 'turn/importturnplandetail',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            planId: this.$route.params.plan_id,
                        }
                    })
                }
            }

        },
        watch: {

        },
        methods: {
            ...mapActions(['initGradeList', 'initDeptBaseList', 'initOptionList', 'initAllOptionListUG', 'initStagecount']),
            //=================================
            searchDept(val, index) {
                if (this.$refs.treeDom == undefined || this.$refs.treeDom.length == 0) {
                    return false
                }
                this.$refs.treeDom[index].filter(val);
            },
            searchDeptCopy(val, index, cinedx) {
                let str = `treeDom_${index}_${cinedx}`
                console.log(this.$refs, str)
                this.$refs[str][0].filter(val);
            },
            visibleChange(e, index, cindex = null) {
                if (!e) {
                    if (cindex !== null) {
                        let str = `treeDom_${index}_${cindex}`
                        this.$refs[str][0].filter()
                    } else {
                        this.$refs.treeDom[index].filter()
                    }
                }
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            getSelect() {
                get(`/base/level/getByCodes?codes=stud_type,degree`).then(res => {
                    if (res.resCode == 200) {
                        res.model.forEach(item => {
                            if (item.code == 'degree') {
                                this.degreeList.push(item)
                            }
                            if (item.code == 'stud_type') {
                                this.stuTypeList.push(item)
                            }
                        })
                    } else {
                        this.$message({
                            message: '请求查询信息失败',
                            type: 'error'
                        });
                    }

                })
            },
            onProgress() {
                this.$loading();
            },
            importStu() {
                if (this.$route.params.progress == '已结束') {
                    this.$message({
                        type: 'warning',
                        message: '该轮转计划方案已结束，不能导入学员'
                    });
                    return;
                }
                this.dialogImportStu = true;
            },
            uploadSuccess(res) {
                //上传失败
                res = res || res[1]
                console.log(res, "-----")
                if (res.errcode == 0) {
                    this.$message({
                        type: 'success',
                        message: '上传成功'
                    });
                    this.doInputQuery(self.page);
                } else if (res.errcode == 9903) {
                    showErrorImport(res.errorlist)
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.errdesc || "上传失败！"
                    });
                }
                this.$refs.upload.clearFiles();
                this.dialogImportStu = false;
                this.hasFile = false;
                this.$loading().close();
            },
            changeFile(file, list) {
                if (list.length > 1) {
                    list.shift();
                }
                if (list.length > 0) {
                    this.hasFile = true;
                }

            },
            submitImport() {
                if (!this.hasFile) {
                    this.$message({
                        showClose: true,
                        message: '请先选择上传的Excel文件！',
                        type: 'warning'
                    });
                }
                this.$refs.upload.submit();
            },
            checkFile(file) {
                const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || file.type === 'application/vnd.ms-excel';

                if (!isExcel) {
                    this.$message.error('请上传.xls或.xlsx格式的Excel文件！');
                }
                this.hasFile = false;
                return isExcel;
            },
            getTurnPlanPermission() {
                post(`/base/turnplan/getTurnPlanPermission?id=${this.$route.params.plan_id}`).then(res => {
                    if (res && res.resCode == 200) {
                        if (res.model.isBaseDoctorEdit == 0 && res.model.isTurnManager == true) {
                            this.permission = true
                        }
                        if (res.model.isBaseDoctorEdit == 1 && (res.model.isTurnBaseManager == true || res.model.isTurnManager == true)) {
                            this.permission = true
                        }
                    } else {
                        this.$message({
                            type: "warning",
                            message: "获取权限报错！"
                        })
                    }
                })
            },
            getDeptList() {
                this.deptList = []
                post("/base/dept/getMyDeptTree", {
                    showHospital: 1,
                    showNoDeptHospital: 0,
                    needBaseDept: false
                    // menusId: this.menuId
                }).then((data) => {
                    if (data && data.resCode == 200) {
                        this.deptListTree = data.model;
                    }
                });
            },
            nodeClick(node, index) {
                if (node.deptlevel == 1 || node.havePermission != 1) {
                    return false;
                }
                let temp = this.addStuForm.detail[index]
                temp.deptid = node.id
                temp.deptname = node.name
                this.$set(this.addStuForm.detail, index, temp)
            },
            nodeClickStage(val, index, stagIndex) {
                if (val.deptlevel == 1 || val.havePermission != 1) {
                    return false;
                }
                let temp = this.stageListData.stageList[stagIndex]
                let ctemp = temp.detail[index]
                ctemp.deptid = val.id
                ctemp.deptname = val.name
                temp.detail.splice(index, index + 1, ctemp)
                this.$set(this.stageListData.stageList, stagIndex, temp)
            },
            updateDept(val, index) {
                let temp = this.addStuForm.detail[index]
                temp.deptid = val.id
                this.$set(this.addStuForm.detail, index, temp)
            },
            setQueryFormOne(form) {
                if (form.hospitalIdForBase == "") {
                    this.queryForm.newbaseid = form.baseId
                    this.queryForm.hospitalIdForBase = ""
                } else {
                    this.queryForm.hospitalIdForBase = form.hospitalIdForBase
                    this.queryForm.newbaseid = ""
                }
                if (form.hospitalId == "") {
                    this.queryForm.hospitalId = ""
                    this.queryForm.newdepartment = form.deptId
                } else {
                    this.queryForm.hospitalId = form.hospitalId
                    this.queryForm.newdepartment = ""
                }
            },
            //阶段默认配置
            swichStage(index) {
                if (index == 1) {
                    this.getStageCount();
                }
            },
            getStageCount() {
                post('/commparaconf/querycommparaconflist', {
                    command: 'commparaconf/querycommparaconflist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    paramcode: 'turn_phase'
                }).then(res => {
                    if (res && res.errcode == 0) {
                        let data = res.commparaconflist;
                        this.stagecount = Number(data[0].paramvalue);
                        this.stageListData.stageList = [];
                        //初始化默认几个阶段
                        for (let i = 0; i < this.stagecount; i++) {
                            this.stageListData.stageList.push({
                                detail: []
                            })
                        }
                        this.initStagecount({ k: 'stagecount', v: this.stagecount })
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.errdesc
                        })
                    }
                })
            },

            //12-17  增加遗失的接口
            initdegraee() {
                //studentDegreeList
                post('/', {
                    command: '',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                }).then( (data) =>{
                    if (data && data.errcode == 0) {

                    }
                }).catch(function (error) {
                    console.log(error)
                })
            },

            computeColor(item) {
                if (item.id == 1) {
                    return '#d3dce6';
                } else if (item.id == 2) {
                    return '#20db9a';
                } else if (item.id == 3) {
                    return '#f99e1c';
                } else if (item.id == 4) {
                    return '#F56C6C'
                } else {
                    return '#d3dce6';
                }
            },

            gethospitaltree: function () {         //带权限的基地科室和病区
                let self = this;
                post('/turnbaseinfo/getusermanagerdepttree', {
                    command: 'turnbaseinfo/getusermanagerdepttree',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        // newroomList  newdeptList  newareaList
                        self.newroomList = data.depttree.childlist
                        let treeidlist = data.depttree.childlist
                        treeidlist.map(function (index, item) {
                            self.baseidlist.push(item.id)
                            item.childlist.map(function (index2, item2) {
                                self.officeidlist.push(item2.id)
                                item2.childlist.map(function (index3, item3) {
                                    self.areaidlist.push(item3.id)
                                })
                            })
                        })
                        // self.initPlanDetailList();
                    }
                }).catch(function (error) {
                    console.log(error)
                })
            },
            newbasechange: function () {
                let self = this;
                self.queryForm.newdepartment = '';
                self.queryForm.newarea = '';
                self.newdeptList = [];
                self.newareaList = [];
                self.newroomList.map(function (index, item) {
                    if (self.queryForm.newbaseid == item.id) {
                        self.newdeptList = item.childlist
                    }
                })
            },
            newdepartmentChange: function () {
                let self = this;
                self.queryForm.newarea = '';
                self.newareaList = [];
                self.newdeptList.map(function (index, item) {
                    if (self.queryForm.newdepartment == item.id) {
                        self.newareaList = item.childlist
                    }
                })
            },

            checkDept(rule, value, callback) {
                console.log(value, "value")
                if (value === '') {
                    callback(new Error('请选择轮转科室'));
                } else {
                    callback();
                }
            },
            checkDateRange(rule, value, callback) {
                if (!value) {
                    callback(new Error('请选择轮转开始时间'));
                } else {
                    callback();
                }
            },
            turnendtimeRange(rule, value, callback) {
                if (!value) {
                    callback(new Error('请选择轮转结束时间'));
                } else {
                    callback();
                }
            },

            openAddDialog() {
                this.$refs.adjustDialog.init(0)
            },
            closeAddStu() {
                this.$refs.addStuForm.resetFields();
            },
            handleSubmitAddStu() {
                if (!this.isstage.sign) {
                    // 不分阶段
                    this.$refs.addStuForm.validate((valid) => {

                        if (valid) {
                            let self = this;
                            let option = { ...this.addStuForm };
                            option.detail = self.addStuForm.detail.map((item, index) => {
                                if (moment(item.turnstarttime, 'YYYY-MM-DD HH:mm:ss').valueOf() > moment(item.turnendtime, 'YYYY-MM-DD HH:mm:ss').valueOf()) {
                                    self.$message({
                                        type: 'warning',
                                        message: '轮转计划第' + (index + 1) + '行，轮转结束时间不能小于轮转开始时间'
                                    });
                                    return
                                }
                                if (item.turnstarttime) {
                                    return {
                                        deptid: item.deptid, deptname: item.deptname, turnstatus: item.status,
                                        begintime: moment(item.turnstarttime).format('YYYY-MM-DD'),
                                        endtime: moment(item.turnendtime).format('YYYY-MM-DD'),
                                    }
                                } else {
                                    return { deptid: item.deptid, deptname: item.deptname, turnstatus: item.status, begintime: '', endtime: '' }
                                }

                            });
                            if (this.selectItems[0] && this.selectItems[0].interId) {
                                post('/turn/updateturnplandetail', {
                                    command: 'turn/updateturnplandetail',
                                    sessionid: getCookie('sid'),
                                    loginid: getCookie('uid'),
                                    ...option,
                                }).then((data) => {
                                    if (data && data.errcode == 0) {
                                        self.$message({
                                            type: 'success',
                                            message: '编辑成功!'
                                        });
                                        self.dialogAddNewStu = false;
                                        self.usePage = true;
                                        if (self.exportInput) {
                                            self.doInputQuery(self.page);
                                        } else {
                                            self.selectQuery(self.page);
                                        }
                                    } else if (data.errdesc && data.errdesc != "" && (data.errorlist == undefined || data.errorlist.length == "")) {
                                        self.$message({
                                            type: "warning",
                                            message: data.errdesc
                                        })

                                    } else {
                                        console.log("111111111111")
                                        const h = self.$createElement;
                                        self.$msgbox({
                                            title: '错误提示',
                                            message: h('p', null, self.createElement(data.errorlist)),
                                            type: 'error',
                                            confirmButtonText: '确定',
                                        });
                                    }
                                }).catch(() => {
                                    console.log("22222222")
                                    self.$message({
                                        type: 'error',
                                        message: '编辑失败!'
                                    });
                                })
                            } else {
                                post('/turn/addturnplandetail', {
                                    command: 'turn/addturnplandetail',
                                    sessionid: getCookie('sid'),
                                    loginid: getCookie('uid'),
                                    plandetaillist: [{ ...option, planId: self.$route.params.plan_id }]
                                }).then((data) => {
                                    if (data && data.errcode == 0) {
                                        self.$message({
                                            type: 'success',
                                            message: '新增成功!'
                                        });
                                        self.dialogAddNewStu = false;
                                        if (self.exportInput) {
                                            self.doInputQuery(self.page);
                                        } else {
                                            self.selectQuery(self.page);
                                        }
                                    } else if (data.errdesc && data.errdesc != "" && (data.errorlist == undefined || data.errorlist.length == "")) {
                                        self.$message({
                                            type: "warning",
                                            message: data.errdesc
                                        })

                                    } else {
                                        const h = self.$createElement;
                                        self.$msgbox({
                                            title: '错误提示',
                                            message: h('p', null, self.createElement(data.errorlist)),
                                            type: 'error',
                                            confirmButtonText: '确定',
                                        });
                                    }
                                }).catch(() => {
                                    self.$message({
                                        type: 'error',
                                        message: '新增失败!'
                                    });
                                })
                            }
                        }
                    });
                } else {
                    // 分阶段
                    this.$refs.isstageform.validate((isstagevalid) => {
                        if (isstagevalid) {
                            this.$refs.stageform.validate((valid) => {
                                if (valid) {
                                    let self = this;
                                    let isempty = this.stageListData.stageList.some(item => {
                                        if (item.detail.length > 0) {
                                            return true;
                                        }
                                    })
                                    if (!isempty) {
                                        this.$message({
                                            type: "warning",
                                            message: "请填写阶段信息 "
                                        })
                                    }
                                    let stageForm = { mobile: this.addStuForm.mobile, name: this.addStuForm.name, detail: [] };
                                    this.stageListData.stageList.map((item, count) => {
                                        item.detail.map(innerItem => {
                                            if (innerItem.turnstarttime) {
                                                this.$set(innerItem, 'turnstarttime', moment(innerItem.turnstarttime).format('YYYY-MM-DD'));
                                                this.$set(innerItem, 'turnendtime', moment(innerItem.turnendtime).format('YYYY-MM-DD'));
                                                this.$set(innerItem, 'phase', count);
                                                stageForm.detail.push({
                                                    deptid: innerItem.deptid || innerItem.dept_id,
                                                    deptname: innerItem.dept_name || innerItem.deptname,
                                                    begintime: innerItem.turnstarttime,
                                                    endtime: innerItem.turnendtime,
                                                    phase: innerItem.phase,
                                                    turnstatus: innerItem.status
                                                })

                                            } else {
                                                this.$set(innerItem, 'turnstarttime', moment(innerItem.turnstarttime).format('YYYY-MM-DD'));
                                                this.$set(innerItem, 'turnendtime', moment(innerItem.turnendtime).format('YYYY-MM-DD'));
                                                this.$set(innerItem, 'phase', count);
                                                stageForm.detail.push({
                                                    deptid: innerItem.deptid || innerItem.dept_id,
                                                    deptname: innerItem.dept_name || innerItem.deptname,
                                                    begintime: innerItem.turnstarttime,
                                                    endtime: innerItem.turnendtime,
                                                    phase: innerItem.phase,
                                                    turnstatus: 0
                                                })
                                            }

                                        })
                                    })
                                    if (this.selectItems[0] && this.selectItems[0].interId) {
                                        post('/turn/updateturnplandetail', {
                                            command: 'turn/updateturnplandetail',
                                            sessionid: getCookie('sid'),
                                            loginid: getCookie('uid'),
                                            interId: this.selectItems[0].interId,
                                            ...stageForm
                                        }).then((data) => {
                                            if (data && data.errcode == 0) {
                                                self.$message({
                                                    type: 'success',
                                                    message: '编辑成功!'
                                                });
                                                self.dialogAddNewStu = false;
                                                self.usePage = true;
                                                if (self.exportInput) {
                                                    self.doInputQuery(self.page);
                                                } else {
                                                    self.selectQuery(self.page);
                                                }
                                            } else if (data.errdesc && data.errdesc != "" && (data.errorlist == undefined || data.errorlist.length == "")) {
                                                self.$message({
                                                    type: "warning",
                                                    message: data.errdesc
                                                })

                                            } else {
                                                const h = self.$createElement;
                                                self.$msgbox({
                                                    title: '错误提示',
                                                    message: h('p', null, self.createElement(data.errorlist)),
                                                    type: 'error',
                                                    confirmButtonText: '确定',
                                                });

                                            }
                                        }).catch(() => {
                                            self.$message({
                                                type: 'error',
                                                message: '编辑失败!'
                                            });
                                        })
                                    } else {
                                        let plandetaillist = [{ ...stageForm, planId: self.$route.params.plan_id }]
                                        post('/turn/addturnplandetail', {
                                            command: 'turn/addturnplandetail',
                                            sessionid: getCookie('sid'),
                                            loginid: getCookie('uid'),
                                            plandetaillist: plandetaillist

                                        }).then((data) => {
                                            if (data && data.errcode == 0) {
                                                self.$message({
                                                    type: 'success',
                                                    message: '新增成功!'
                                                });
                                                self.dialogAddNewStu = false;
                                                if (self.exportInput) {
                                                    self.doInputQuery(self.page);
                                                } else {
                                                    self.selectQuery(self.page);
                                                }
                                            } else if (data.errdesc && data.errdesc != "" && (data.errorlist == undefined || data.errorlist.length == "")) {
                                                self.$message({
                                                    type: "warning",
                                                    message: data.errdesc
                                                })

                                            } else {
                                                const h = self.$createElement;
                                                self.$msgbox({
                                                    title: '错误提示',
                                                    message: h('p', null, self.createElement(data.errorlist)),
                                                    type: 'error',
                                                    confirmButtonText: '确定',
                                                });
                                            }
                                        }).catch(() => {
                                            self.$message({
                                                type: 'error',
                                                message: '新增失败!'
                                            });
                                        })
                                    }

                                }
                            })
                        }
                    });
                }
                this.$refs.adjustDialog.init(0)

            },

            createElement(errlist) {
                const h = this.$createElement;
                let res = [];
                let err4008 = [];
                let err4007 = [];
                let err9903 = [];
                for (let i = 0; i < errlist.length; i++) {
                    if (errlist[i][4008]) {
                        err4008.push(errlist[i][4008]);
                    }
                    if (errlist[i][4007]) {
                        err4007.push(errlist[i][4007]);
                    }
                    if (errlist[i][9903]) {
                        err9903.push(errlist[i][9903]);
                    }

                }
                err4008.length > 0 && res.push(h('p', null, err4008.join('、') + '设置的轮转时间有冲突'));
                err4007.length > 0 && res.push(h('p', null, err4007.join('、') + '轮转时间超出轮转计划时间'));
                err9903.length > 0 && res.push(h('p', null, err9903.join('、')));
                return res;
            },
            editStu() {
                this.$refs.adjustDialog.init(1, this.selectItems)
            },

            delStus() {
                let self = this;
                if (this.selectItems.length === 0) {
                    this.$message({
                        showClose: true,
                        message: '请先勾选删除项！',
                        type: 'warning'
                    });
                    return;
                }
                this.$confirm('是否要删除选中学员?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/turn/deleteturnplandetail', {
                        command: 'turn/deleteturnplandetail',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        plandetailidlist: this.selectItems.map((item) => {
                            return item.interId;
                        })
                    }).then((data) => {
                        if (data && data.errcode == 0) {
                            self.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            if (self.exportInput) {
                                self.doInputQuery();
                            } else {
                                self.selectQuery();
                            }
                        } else {
                            self.$message({
                                type: 'success',
                                message: '删除失败!'
                            });
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            exportStus() {
                let self = this;
                this.exportOptions.starttime = this.$route.query.begintime;
                this.exportOptions.endtime = this.$route.query.endtime;
                this.exportOptions.plan_id = self.$route.params.plan_id;
                let data = {
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    command: "turn/queryTurnPlanDetailList",
                    ...this.exportOptions
                };
                exportExcel(data);
            },
            addStageRoomInfo(index) {
                this.stageListData.stageList[index].detail.push({ deptid: '', dateRange: [], turnstarttime: '', turnendtime: '', status: 0 });
            },
            delStageRoomInfo(stageIndex, index) {
                this.stageListData.stageList[stageIndex].detail.splice(index, 1);
            },
            addRoomInfo(index) {
                //20181008 轮转中的时侯在中间添加轮转科室
                if (this.mode == 1) {
                    this.addStuForm.detail.splice((index + 1), 0, { deptid: '', deptname: '', dateRange: [], turnstarttime: '', turnendtime: '', status: 0, addflag: true })
                } else {
                    this.addStuForm.detail.push({ deptid: '', deptname: '', dateRange: [], turnstarttime: '', turnendtime: '', status: 0 })
                }
            },
            //编辑状态科室之间的添加
            addstageRoomInfoL(stageIndex, index) {
                this.stageListData.stageList[stageIndex].detail.splice(index + 1, 0, { deptid: '', dateRange: [], turnstarttime: '', turnendtime: '', status: 0, addflag: true });
            },
            handleSelectionChange(r) {
                console.log(r)
                this.selectItems = r;
            },
            backToCirclePlan() {
                this.$router.push({ name: 'circlePlan' })
            },
            initPlanDetailList() {
                this.queryPlanDetailList({ plan_id: this.$route.params.plan_id })
            },
            doInputQuery(page) {
                let self = this;
                this.exportInput = true;
                this.queryForm = {
                    plan_id: '',
                    base_id: '',
                    stud_dept_id: '',
                    degre_id: '',
                    type_id: '',
                    turn_dept_id: '',
                    dateRange: ''
                };
                this.rightNowClear = this.rightNowClear + 1
                let option = { search_info: this.input, plan_id: this.$route.params.plan_id };
                this.exportOptions = { search_info: this.input, plan_id: this.$route.params.plan_id };
                page && (option.page = page)
                this.queryPlanDetailList(option);
            },
            selectQuery(page) {
                let self = this;
                self.exportInput = false;
                self.input = '';
                if (self.queryForm.newbaseid == 0 || self.queryForm.newbaseid == '') {
                    self.isnewbaseid = '';
                    if (self.queryForm.newdepartment == 0 || self.queryForm.newdepartment == '') {
                        self.isnewdepartment = '';
                    }
                    self.isnewarea = '';
                } else {
                    if (self.queryForm.newbaseid && self.queryForm.newbaseid != 0) {
                        self.baseidlist = [];
                        self.baseidlist.push(self.queryForm.newbaseid);
                    };
                    if (self.queryForm.newdepartment && self.queryForm.newdepartment != 0) {
                        self.officeidlist = [];
                        self.officeidlist.push(self.queryForm.newdepartment);
                    };
                    if (self.queryForm.newarea && self.queryForm.newarea != 0) {
                        self.areaidlist = [];
                        self.areaidlist.push(self.queryForm.newarea);
                    };

                    self.isnewbaseid = self.queryForm.newbaseid;
                    self.isnewdepartment = self.queryForm.newdepartment;
                    //  self.isnewarea = self.queryForm.newarea;


                };
                let option = {
                    ...self.queryForm, plan_id: self.$route.params.plan_id,
                    baseidlist: self.baseidlist,
                    officeidlist: self.officeidlist,
                };
                option.base_id = self.isnewbaseid;
                option.stud_dept_id = self.isnewdepartment;
                page && (option.page = page);
                if (option.dateRange != '' && option.dateRange[0] !== null) {
                    option.begin_time = moment(option.dateRange[0]).format('YYYY-MM-DD');
                    option.end_time = moment(option.dateRange[1]).format('YYYY-MM-DD');
                }
                delete option.dateRange;
                for (let key in option) {
                    if (option[key] === -1) delete option[key];
                }
                self.queryPlanDetailList(option);
                self.exportOptions = option;
                delete self.exportOptions['page'];
                ///self.gethospitaltree();
            },
            queryPlanDetailList(option) {
                let self = this;
                option.page = 1;
                if (this.usePage) {
                    option.page = this.page;
                } else {
                    this.page = 1;
                }
                let opt = {
                    command: 'turn/queryTurnPlanDetailList',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    starttime: self.$route.query.begintime,
                    endtime: self.$route.query.endtime,
                    reqnum: this.reqnum,
                    ...option,
                };
                opt.stud_dept_id = opt.newdepartment
                self.loading = true;
                post('/turn/queryTurnPlanDetailList', opt).then(function (data) {
                    self.loading = false;
                    if (data && data.errcode == 0) {
                        self.planDetailsDatas = data.turn_plan_detail;
                        self.planyearmontlist = data.planyearmontlist;
                        self.totalPages = data.count;
                        self.usePage = false;
                        self.$nextTick(function () {
                            self.rowHeight = document.getElementsByTagName('tr')[0].offsetHiehgt + (2.25 / self.planDetailsDatas.length);
                        });
                        document.querySelectorAll(".el-table__header-wrapper table")[0].cssText = `"position", "static"`
                        document.getElementsByClassName("monthHeader")[0].cssText = `"position", "static"`
                        self.$nextTick(() => {
                            let height = (self.planDetailsDatas.length + 1) * (document.getElementsByTagName('tr')[0].offsetHiehgt)
                            let width = (document.getElementsByClassName('custom-table')[0].offsetWidth) + (document.getElementsByClassName('monthHeader')[0].offsetWidth + 10)
                            document.getElementsByClassName("custom-table")[0].style.width = height + "px"
                            document.getElementById("plan-content").style.width = width + "px"

                            let tableWrapper = document.getElementsByClassName("table-wrapper")[0]
                            let h = tableWrapper.offsetTop
                            let fixed = document.querySelectorAll(".custom-table .el-table__fixed")[0]
                            let s = document.querySelectorAll(".el-table__header-wrapper table")[0]
                            let m = document.querySelectorAll('.monthHeader')[0]
                            let f = document.querySelectorAll('.el-table__fixed-header-wrapper')[0]
                            let t = document.querySelectorAll('.el-table__header-wrapper')[0]
                            let b = document.querySelectorAll('.el-table__body-wrapper')[0]
                            let d = document.querySelectorAll('.el-table__fixed-body-wrapper')[0]
                            let c = document.querySelectorAll('.circleDetailRow')[0]
                            let flag = true
                            let th = document.getElementsByTagName('tr')[0].offsetHiehgt
                            b.addEventListener('mouseover', function () {
                                flag = false
                                let Myfunction = () => {
                                    if (!flag) {
                                        let len = tableWrapper.scrollTop
                                        let w = document.getElementsByClassName('custom-table')[0].offsetWidth
                                        let left = tableWrapper.scrollLeft
                                        fixed.scrollTop = len
                                        if (len > 0) {
                                            s.setAttribute('style', `"position": "absolute"; "left": -${left}; "top": "0", "z-index": "4"`)
                                            m.setAttribute('style', `"position": "absolute", "top": "0", "left": ${w - left}, "z-index": "2"`)
                                            f.setAttribute('style', `"top": ${len}, "z-index": "4"`)
                                            b.setAttribute('style', `"top": ${th}`)
                                            d.setAttribute('style', `"top": ${th}`)
                                            c.setAttribute('style', `"position": "relative", "top": ${th}`)
                                        } else {
                                            s.setAttribute('style', `"position": "static", "left": "0", "top": "0", "z-index": "4"`)
                                            m.setAttribute('style', `"position": "static", "top": "0", "left": -${w}, "z-index": "2"`)
                                            f.setAttribute('style', `"top": 0, "z-index": "3"`)
                                            b.setAttribute('style', `top", ""`)
                                            d.setAttribute('style', `"top", ${th}`)
                                            c.setAttribute('style', `"position": "static", "top": "0"`)
                                        }
                                    }
                                }
                                tableWrapper.removeEventListener('scroll', Myfunction)
                                tableWrapper.addEventListener('scroll', Myfunction)
                            })
                            fixed.addEventListener('mouseover', function (e) {
                                flag = true
                                fixed.addEventListener('scroll', function () {
                                    if (flag) {
                                        tableWrapper.scrollTop = fixed.scrollTop
                                    }
                                })
                                e.stopPropagation()
                            })
                        })
                    }
                })
            },
            queryStuByMobile(query) {
                let self = this;
                if (query !== '') {
                    self.mobileOptions = []
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        post('/turn/queryturndoctorinfo', {
                            command: 'turn/queryturndoctorinfo',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            username: query,
                        }).then(function (data) {
                            if (data && data.errcode == 0) {
                                self.mobileOptions = data.doctorinfolist;
                            }
                        })
                    }, 200);
                } else {

                }
            },
            delRoomInfo(index) {
                this.addStuForm.detail.splice(index, 1);
            },
            setName(val) {
                this.mobileOptions.forEach((item) => {
                    if (item.username === val) {
                        this.addStuForm.name = item.name;
                    }
                })
            },

            handleSizeChange(size) {
                this.reqnum = size;
                if (this.exportInput) {
                    this.doInputQuery();
                } else {
                    this.selectQuery();
                }
            },
            handleCurrentChange(page) {
                this.page = page;
                this.usePage = true;
                if (this.exportInput) {
                    this.doInputQuery(this.page);
                } else {
                    this.selectQuery(this.page);
                }
            },
            resertList(val) {
                let self = this
                if (val == true) {
                    self.usePage = true;
                }
                if (self.exportInput) {
                    self.doInputQuery(self.page);
                } else {
                    self.selectQuery(self.page);
                }
            }
        },
        filters: {

        },
        mounted() {
            this.getTurnPlanPermission();
            this.gethospitaltree();
            this.detailTitle = this.$route.query.turnplanname;
            this.queryForm.plan_id = +this.$route.params.plan_id;
            this.initPlanDetailList();
            this.initGradeList();
            this.initDeptBaseList();
            this.getSelect();
            this.getStageCount();
        }
    }
</script>
<style scoped lang="scss">
    .wapper {
        padding: 0 20px;
    }

    th {
        box-sizing: border-box
    }

    .scrollFixed {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 4;
    }

    .table-wrapper {
        /* height: 460px; */
        overflow-y: auto;
    }

    .custom-table /deep/ .el-table__fixed {
        /* height: 442px !important; */
        overflow-y: auto;
    }

    .custom-table /deep/ .el-table__fixed::-webkit-scrollbar {
        display: none;
    }

    // .table-wrapper /deep/ .el-table__header{
    // position: absolute;
    // top: 0;
    // left: 0;
    // z-index: 999;
    // }
    .topTitle {
        width: 100%;
        height: 30px;
    }

    .backBtn {
        width: 100px;
        float: left;
    }

    .titleMessage {
        float: left;
        width: 1000px;
        text-align: center;
        font-size: 20px;
        line-height: 30px;
        margin-bottom: 20px;
    }

    .btnTools {
        padding: 10px 0px;
        margin: 10px 0px;
        border-top: 1px solid #d3dce6;
        border-bottom: 1px solid #d3dce6;
        clear: both;
    }

    .queryTools {
        /* float:left; */
        /* width: 74%; */
    }

    .searchBtn {
        float: left;
        margin-left: 10px;
        margin-top: 26px;
    }

    .searchTools {
        float: right;
        margin-bottom: 15px;
    }

    .queryTools .el-form-item {
        width: 200px;
        margin-bottom: 10px;
    }

    .el-select {
        width: 120px;
    }

    .detailTable {
        width: 100%;
        overflow: hidden;
    }

    .el-dialog .el-select {
        width: 196px;
    }

    .circleRoomInfo {
        padding-top: 20px;
        padding-bottom: 10px;
        border-top: 1px solid #d3dce6;
    }

    .circleRoom {
        margin-right: 300px;
    }

    .selectDate .el-date-editor {
        width: 196px;
    }

    .addBtn {
        padding-top: 20px;
        border-top: 1px solid #d3dce6;
    }

    .rowHeight {
        height: 40px;
    }

    .el-table__body-wrapper {
        overflow-x: hidden;
    }

    .custom-table {
        position: static !important;
    }

    .show-color {
        width: 100%;
        margin: 15px 0px;
    }

    .show-color div {
        display: inline-block;
        margin-right: 20px;
        line-height: 20px;
    }

    .show-color span {
        display: inline-block;
        width: 40px;
        height: 15px;
        margin-right: 10px;
    }

    #plan-content {
        width: 6000px;
    }

    .inline {
        text-align: center;
        margin: 0px 0px 10px 0px;
    }

    .el-table /deep/ td {
        height: 40px;
    }

    .tjxy-dialog {
        & /deep/ .el-dialog {
            width: 900px;
        }
    }

    .stageitem {
        & /deep/ .el-form-item__content {
            margin-left: 0 !important;
        }
    }

    .flexForm {
        width: 100%;
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
    }
</style>
<style>
    .circlePlanDetail .ishasStage .el-form-item__content {
        margin-left: 0 !important;
    }
</style>