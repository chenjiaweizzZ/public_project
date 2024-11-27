<template>

        <div class="wapper graduateExamine">
            <div class="tool-box">
                <div class="func-tools">
                    <el-button type="primary" v-if="roleAuthority['dms:addOutDeptTest']" @click="handleAdd">添加</el-button>
                    <el-button type="primary" @click="handleDel">删除</el-button>
                    <el-button type="primary" @click="exportData">导出</el-button>
                </div>
                <div class="search-input">
                    <el-input style="width:200px" v-model="inputInfo" @keyup.enter.native="doInputQuery" placeholder="请输入考官或者学员姓名"></el-input>
                    <el-button type="primary" @click="doInputQuery">搜索</el-button>
                </div>
            </div>
            <div class="top-tools">
                <el-row :gutter="20">
                    <el-col :span="1">
                        <el-button type="text" @click="queryAll">全部</el-button>
                    </el-col>
                    <el-col :span="16">
                        <div class="query-tools">
                            <el-form :model="queryForm" :inline="true">
                                <el-form-item label="考核类型">
                                    <el-select filterable v-model="queryForm.examType" value-key="key" placeholder="请选择">
                                        <el-option :key="0" label="全部" value=""></el-option>
                                        <el-option v-for="(item,index) in examTypeList" :key="item.key" :label="item.name" :value="item">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="状态">
                                    <el-select filterable v-model="queryForm.status" placeholder="请选择">
                                        <el-option :key="0" label="全部" value=""></el-option>
                                        <el-option v-for="(item,index) in statusList" :key="index.value" :label="item.name" :value="item.value">
                                        </el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="时间" style="min-width:300px; margin-left: -20px;">
                                    <el-date-picker v-model="queryForm.timeArr" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                                    </el-date-picker>
                                </el-form-item>
                            </el-form>
                        </div>
                    </el-col>
                    <el-col :span="2" class="btn-search-box">
                        <el-button class="btn-search" type="primary" @click="querySeach">查询</el-button>
                    </el-col>
                </el-row>
            </div>
            <div class="container">
                <div class="left-box">
                    <el-tree :default-expanded-keys="expandedKeys" :current-node-key="currentDeptId" v-loading="loadingShow.tree" :highlight-current="true"
                        node-key="id" :data="deptData" style="height:100%" :props="defaultProps" @node-click="handleNodeClick"
                        ref="treeLeft">
                    </el-tree>
                </div>
                <div class="right-box">
                    <el-table ref="detailTable" :data="tableData" border tooltip-effect="dark" v-loading="loadingShow.table" style="width: 100%"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="selection" min-width="45"></el-table-column>
                        <el-table-column label="状态" prop="statusName" min-width="100" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column label="出科考核类型" prop="examTypeName" min-width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" :content="scope.row.examTypeName" placement="top">
                                        <span>{{scope.row.examTypeName}}</span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="科室" prop="deptName" min-width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" :content="scope.row.deptNamesStr" placement="top">
                                        <span>{{scope.row.deptNamesStr}}</span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="考核时间" prop="turnTime" min-width="180" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" :content="scope.row.turnTime" placement="top">
                                        <span>{{scope.row.turnTime}}</span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="考核地点" prop="place" min-width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" :content="scope.row.place" placement="top">
                                        <span>{{scope.row.place}}</span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="考官" prop="turnExamTeachers" min-width="120" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" :content="scope.row.turnExamTeachers" placement="top">
                                        <span>{{scope.row.turnExamTeachers}}</span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="被考核学员" prop="students" min-width="180" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" :content="scope.row.students" placement="top">
                                        <span>{{scope.row.students}}</span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="创建人" prop="creator" min-width="120" :show-overflow-tooltip="true">
                        </el-table-column>
                        <el-table-column label="最后操作时间" prop="updateTime" min-width="180" :show-overflow-tooltip="true">
                            <template slot-scope="scope">
                                <div class="actionplansty">
                                    <el-tooltip effect="light" :content="scope.row.updateTime" placement="top">
                                        <span>{{scope.row.updateTime}}</span>
                                    </el-tooltip>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" min-width="180" label="操作">
                            <template slot-scope="scope">
                                <el-button v-if="scope.row.adminEdit == 1" @click="editrow(scope.$index, scope.row)" type="text" size="small">编辑
                                </el-button>
                                <el-button v-if="scope.row.adminEdit == 1 && scope.row.editFlag == 1" @click="deleterow(scope.$index, scope.row)" type="text"
                                    size="small">删除
                                </el-button>
                                <el-button @click="detailrow(scope.$index, scope.row)" type="text" size="small">查看详情
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="pageno" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
                        :total="totalCount">
                    </el-pagination>
                </div>
            </div>
            <!-- 新增和编辑出科考核 -->
            <el-dialog :title="dialogTitle" :visible.sync="addEditDialog" :close-on-click-modal="false" @close="resetForm('examDialogRef')">
                <el-form :model="dialogForm" :rules="rules" ref="examDialogRef" label-width="90px">
                    <el-row :gutter="20">
                        <el-col :span="12">
                            <el-form-item label="考核级别:" prop="examCategory">
                                <el-radio-group @change="examCategoryChange" v-model="dialogForm.examCategory">
                                    <el-radio v-for="(item,index) in examCategoryList" :disabled="disabled" :key="index" :label="item.levelcode">
                                        {{item.levelname}}
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12" style="margin-left: -34px;">
                            <el-form-item :label='categoryTitle' prop="categoryName">
                                <el-select :disabled="disabled" v-model="dialogForm.categoryName" multiple placeholder="请选择" style="width: 100%" v-if="dialogForm.examCategory == 'hospital'">
                                    <el-option v-for="(item,index) in categoryNameList" :key="item.id" :label="item.name" :value="item.id">
                                    </el-option>
                                </el-select>
                                <el-select :disabled="disabled" collapse-tags v-model="dialogForm.categoryNameStr" multiple @clear="baseClear" @remove-tag="baseRemove"
                                    placeholder="请选择" style="width: 100%" v-else>
                                    <el-option hidden key="id" :value="dialogForm.categoryName" :label="dialogForm.categoryNameStr" />
                                    <el-tree :data="categoryNameList" show-checkbox node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps"
                                        @check-change="nodeClick" ref="treeDom" class="selfTree"></el-tree>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="10" class="exam-type">
                            <el-form-item label="考核类型:" prop="examType">
                                <el-select :disabled="disabled" style="width:193px;" filterable v-model="dialogForm.examType" value-key="key" placeholder="请选择"
                                    @change="clearExamItemList">
                                    <el-option v-for="(item,index) in examTypeList" :key="item.key" :label="item.name" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="14" style="padding-left: 40px;">
                            <el-form-item class="tip" label="考核项目:" prop="examItemList">
                                <div class="items">
                                    <div class="items-box">
                                        <div v-for="(item, index) in examItemList" :key="item.key" class="flexBox">
                                            <el-tag type="primary" :key="index" v-for="(val, index) in values" v-if="item.key == val">
                                                {{item.label}}
                                            </el-tag>
                                        </div>
                                    </div>
                                    <el-button :disabled="disabled" type="primary" @click="selectExamItem">选择
                                    </el-button>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="11">
                            <el-form-item label="开始时间:" prop="startTime">
                                <el-date-picker style="width: 200px;" v-model="dialogForm.startTime" :disabled="disabled" type="datetime" format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="13">
                            <el-form-item label="结束时间:" prop="endTime">
                                <el-date-picker style="width: 200px;" :disabled="disabled  && currentFlag == 1" v-model="dialogForm.endTime" type="datetime"
                                    :picker-options="pickerOptions" format="yyyy-MM-dd HH:mm:ss" @change="dialoggetendtime"></el-date-picker>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="11">
                            <el-form-item label="考官:" prop="examiner">
                                <el-select :disabled="disabled" filterable v-model="dialogForm.examiner" multiple style="width:193px" @change="selectExaminer"
                                    :filter-method="remoteMethod">
                                    <el-option v-for="(item,index) in examinerList" :key="item.id" :label="item.name + '-' + item.username" :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="11">
                            <el-form-item label="考核地点:" prop="examPlace">
                                <el-input style="width: 202px;" :disabled="disabled" v-model="dialogForm.examPlace" placeholder="请输入考核地点" maxlength="120">
                                </el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter='20'>
                        <el-col :span="20">
                            <el-form-item label="被考核学员" prop="examStudents" label-width="92px">
                                <el-button type="primary" :disabled="disabled  && currentFlag == 1" @click="queryExamStudents">选择</el-button>
                                <div class="items">
                                    <div class="student-box">
                                        <el-tag type="primary" :closable="!item.noRemove" @close="handleClose(item)" :key="'stu-' + index" v-for="(item, index) in selectStudentList"
                                            class="tagDept">
                                            {{item.name}}
                                        </el-tag>
                                    </div>
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <el-form-item label="备注:" prop="remark">
                                <el-input type="textarea" :disabled="disabled" :rows="4" v-model="dialogForm.remark" maxlength="100"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <div class="fun-footer-box">
                            <el-button type="primary" :disabled="disabled && currentFlag == 1" @click="submitForm('examDialogRef')" :loading="saveStatus">保存
                            </el-button>
                            <el-button @click="resetForm('examDialogRef')">取消</el-button>
                        </div>
                    </el-row>
                </el-form>
            </el-dialog>
            <!-- 考核项目选择 -->
            <el-dialog title="选择考核项目" :visible.sync="selectItemDialog" :close-on-click-modal="false">
                <el-transfer class="transfer-select-box" v-model="values" filterable :data="examItemList" :titles="['考核项列表', '已选考核项']" ref="selectItemTrans"
                    :button-texts="['删除', '添加']">
                </el-transfer>
                <div class="transfer-footer-box">
                    <el-button @click="cancelSelectItems">取消</el-button>
                    <el-button type="primary" @click="saveSelectItems">保存</el-button>
                </div>
            </el-dialog>
            <!-- end -->
            <!-- 考核学员选择 -->
            <el-dialog title="选择被考核学员" :visible.sync="selectStudents" :close-on-click-modal="false" class="selectStudentDailog">
                <el-form :inline="true" :model="stuFormInline" class="demo-form-inline">
                    <el-form-item label="轮转科室" v-if="dialogForm.examCategory == 'office'">
                        <el-select v-model="stuFormInline.deptid" placeholder="活动区域" multiple @change="changeSelectDept">
                            <el-option :label="item.name" :value="item.id" v-for="item in baseIdSelect"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="轮转结束日期" v-if="dialogForm.examCategory == 'office'">
                        <el-date-picker v-model="stuFormInline.trunDate" type="daterange" range-separator="至" start-placeholder="请选择" end-placeholder="请选择">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="">
                        <el-input v-model="stuFormInline.search" placeholder="输入姓名、学号搜索"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="stuSearch">查询</el-button>
                    </el-form-item>
                </el-form>
                <div class="selectBox">
                    <div class="leftMiddle">
                        <div class="left">
                            <el-table ref="leftmultipleTable" max-height="600" :data="studentList" border tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectStudent">
                                <el-table-column label="姓名" prop="name" min-width="100"></el-table-column>
                                <el-table-column label="学号" prop="username" min-width="100"></el-table-column>
                                <el-table-column label="专业基地" prop="basename" min-width="150"></el-table-column>
                                <el-table-column label="轮转科室" prop="deptName" min-width="150" v-if="dialogForm.examCategory == 'office'"></el-table-column>
                                <el-table-column label="计划轮转周期" prop="planBeginTime" min-width="150" v-if="dialogForm.examCategory == 'office'">
                                    <template slot-scope="scope">
                                        {{scope.row.planBeginTime}}-{{scope.row.planEndTime}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="" type="selection" :selectable="setSelectTable"></el-table-column>
                            </el-table>
                        </div>
                        <div class="middle">
                            <div>
                                <el-button type="primary" @click="deleteSelect"><i class="el-icon-arrow-left"></i></el-button>
                                <el-button type="primary" @click="addSelect"><i class="el-icon-arrow-right"></i></el-button>
                            </div>
                        </div>
                    </div>

                    <div class="right">
                        <el-table ref="multipleTable" max-height="600" :data="selectStudentData" border tooltip-effect="dark" style="width: 100%"
                            @selection-change="handleSelectedStudent">
                            <el-table-column label="" type="selection" :selectable="setSelectedTable"></el-table-column>
                            <el-table-column label="姓名" prop="name" min-width="100"></el-table-column>
                            <el-table-column label="学号" prop="username" min-width="120"></el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="select-studnet-box">
                    <el-button @click="cancelSelectStudents">取消</el-button>
                    <el-button type="primary" @click="saveSelectStudents">保存</el-button>
                </div>
            </el-dialog>
        </div>
</template>

<script>
    import { post, getCookie, exportMouldExcel, exportExcel, getStorage } from '../../config/util';
    import { mapState, mapActions } from 'vuex';
    import api from '../../config/common_data.js';
    var _ = require('lodash');
    import moment from 'moment';
    export default {
        name: 'graduateExamine',
        data() {
            var checkItems = (rule, value, callback) => {
                if (this.dialogForm.examiner == '') {
                    callback(new Error('请选择'));
                } else {
                    callback();
                }
            };
            var checkDept = (rule, value, callback) => {
                if (this.dialogForm.categoryName == '') {
                    callback(new Error('请选择'));
                } else {
                    callback();
                }
            };
            var checkExam = (rule, value, callback) => {
                if (this.dialogForm.examType == '') {
                    callback(new Error('请选择'));
                } else {
                    callback();
                }
            };
            var checkstartTime = (rule, value, callback) => {
                if (this.dialogForm.startTime == '') {
                    callback(new Error('请选择时间'));
                } else {
                    callback();
                }
            };
            var checkendTime = (rule, value, callback) => {
                if (this.dialogForm.endTime == '') {
                    callback(new Error('请选择时间'));
                } else {
                    callback();
                }
            }
            return {
                selectStudentData: [],
                stuFormInline: {
                    search: "",
                    trunDate: [],
                    deptid: []
                },
                baseIdSelect: [],
                currentLevel: 1,
                // 是否是搜索列表
                exportInput: false,
                inputInfo: '',
                /* 筛选区域 */
                queryForm: {
                    examType: {},   //活动类型
                    status: '',      //状态
                    startTime: '',  //开始时间
                    endTime: '',   //结束时间
                    timeArr: ["", ""]
                },
                examTypeList: '',
                // 状态列表
                statusList: [
                    { name: '待考核', value: '0' },
                    { name: '已考核', value: '1' }
                ],

                // 展示树的数据
                deptData: [],
                expandedKeys: [99], // 默认展开节点的Key的数组
                currentDeptId: '',
                // 配置项、展示子节点，禁用节点等
                defaultProps: {
                    label: 'name',
                    children: 'childrens',
                    disabled: function (data, node) {
                        // 禁用回收站选项
                        if (data.deptlevel == 1 || data.havePermission != 1) {
                            return true;
                        } else {
                            return false;
                        }
                    }
                },
                loadingShow: {
                    table: false,
                    tree: false,
                },
                /*右边列表区域*/
                selectItems: [], // 表格勾选id列表
                deletelist: [],  // 批量勾选
                tableData: [],   // 表格数据
                currentFlag: "",
                // 导出数据
                exportOptions: {},
                //分页
                pageno: 1,
                pagesize: 10,
                totalCount: 0,
                usePage: false,
                examItemListCopy: [],
                // dialog 编辑添加出科考核
                addEditDialog: false,
                dialogTitle: '',
                disabled: false,
                // 选择考核项目
                selectItemDialog: false,
                // 是否显示新增按钮
                showBtnAdd: false,
                // 新增 编辑
                dialogFormType: 0, // 0 新增  1 编辑
                flag: false,
                // 是否可以编辑
                disabled: false,
                // 出科考核id 用于编辑下
                currentExamId: '',
                // 保存按钮状态
                saveStatus: false,
                dialogForm: {
                    examCategory: '',     // 考核级别 0院级 1基地级 2科室级
                    categoryName: [],     // 科室
                    categoryNameStr: [],
                    examType: {},         // 考核类型
                    examItems: [],        // 考核项目
                    examiner: [],         // 考官
                    examPlace: '',        // 考核地点
                    examStudents: [],     // 被考核学员
                    remark: '',           // 备注
                    startTime: '',         // 开始时间
                    endTime: ''         // 结束时间
                },
                examCategoryList: [],
                categoryTitle: '科室:',
                categoryNameList: [],
                allCategoryNameList: {},
                examItemList: [],
                values: [],
                //开始和结束时间限制无法选择过期时间
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                // 考官
                examinerList: [],
                // 编辑状态下选择的考官
                examiners: [],
                // 出科考核进行中的编辑
                addExaminer: [],
                delExaminer: [],

                // 考核学员
                studentList: [],
                // 编辑状态下选中的学员数据
                stuRowData: [],
                addStudents: [],
                delStudents: [],
                menuId: "",
                selectStudents: false,
                selectStudentList: [],
                selectStudentsTemp: [],
                selectStudentsTemp2: [],

                // 验证规则
                rules: {
                    examCategory: [{ required: true, message: '请选择考核级别', trigger: 'change' }],
                    // categoryName: [{ type: 'number', required: true, message: '请选择', trigger: 'change' }],
                    categoryName: [{ validator: checkDept, required: true, message: '请选择', trigger: 'change' }],
                    examType: [{ validator: checkExam, required: true, message: '请选择', trigger: 'change' }],
                    startTime: [{ type: 'string', validator: checkstartTime, required: true, message: '请选择时间', trigger: 'change' }],
                    endTime: [{ type: 'string', validator: checkendTime, required: true, message: '请选择时间', trigger: 'change' }],
                    examiner: [{ validator: checkItems, required: true, trigger: 'change' }],
                    examStudents: [{ required: true, message: '请选择被考核学员' }],
                    examPlace: [{ required: true, message: '请输入', trigger: 'blur' }]
                },
                // canEdit:"0"
            }
        },
        watch: {
        },
        computed: {
            ...mapState(['roleAuthority']),
        },
        components: {
        },
        methods: {
            ...mapActions(['getRoleAuthority']),
            changeSelectDept(val) {
                if (val.length > 0 && val[0] == "") {
                    this.stuFormInline.deptid = []
                }
            },
            stuSearch() {

                this.queryExamStudents(1)
            },
            setSelectTable(row) {
                return row.disabledSelect !== true
            },
            setSelectedTable(row) {
                return row.disabledSelect !== true || !row.noRemove
            },
            changeDept(val) {
                let checkArr = this.$refs.treeDom.getCheckedNodes()
                this.dialogForm.categoryName = []
                this.dialogForm.categoryNameStr = val
                checkArr.forEach(item => {
                    this.dialogForm.categoryName.push(item.id)
                    this.dialogForm.categoryNameStr.push(item.name)
                })
                this.seachExaminer();
            },
            baseClear() {
                this.dialogForm.categoryName = []
                this.dialogForm.categoryNameStr = []
                this.$refs.treeDom.setCheckedNodes([])
            },
            baseRemove(val) {
                this.baseIdSelect.shift()
                let arr = this.baseIdSelect.map(i => i.id)
                this.$refs.treeDom.setCheckedKeys(arr)
            },
            nodeClick(node, nodeObj) {
                if (node.deptlevel == 1 || (node.deptlevel == 2 && this.dialogForm.examCategory == "office")) {
                    return false;
                }
                if (node.havePermission != 1) {
                    return false;
                }
                let checkArr = this.$refs.treeDom.getCheckedNodes()
                this.dialogForm.categoryName = []
                this.dialogForm.categoryNameStr = []
                this.baseIdSelect = []
                checkArr.forEach(item => {
                    this.dialogForm.categoryName.push(item.id)
                    this.dialogForm.categoryNameStr.push(item.name)
                    this.baseIdSelect.push(item)
                })
                this.dialogForm.examiner = []
                // 考核项
                this.examItemList = [];
                this.queryExamItems()
                this.values = [];
                // 考官
                this.dialogForm.examiner = []
                this.examinerList = [];
                this.seachExaminer()
                // 考核学员
                this.studentList = [];
                this.selectStudentList = []
            },
            remoteMethod(query) {
                let params = {}
                if (this.dialogForm.examCategory == 'office') {
                    params = {
                        deptIdList: this.dialogForm.categoryName
                    }
                }
                params.teachingType = 4
                params.keyword = query
                post("/base/teachers/listExaminer", params).then(res => {
                    if (res && res.resCode == 200) {
                        this.examinerList = res.model;
                    }
                })
            },

            handleAdd() {
                this.dialogTitle = '新增出科考核';
                this.dialogFormType = 0;
                this.addEditDialog = true;
                this.disabled = false;
                this.dialogForm.categoryName = []
                this.dialogForm.categoryNameStr = []
                this.categoryNameList = []
                this.$nextTick(() => {
                    this.$refs.treeDom.setCheckedKeys([])
                })
            },
            handleDel() {
                if (this.deletelist.length == 0) {
                    this.$message({
                        message: '请先勾选需要删除的出科考核',
                        type: 'warning'
                    });
                } else {
                    this.$confirm('请确认是否删除选中的出科考核?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        post('/turnExamInfo/deleteturnexambatch', {
                            command: 'turnExamInfo/deleteturnexambatch',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            idlist: this.deletelist
                        }).then((data) => {
                            if (data && data.errcode == 0) {
                                this.$message({
                                    message: '出科考核删除成功!',
                                    type: 'success'
                                });
                                if (this.exportInput) {
                                    this.doInputQuery();
                                } else {
                                    this.querySeach();
                                }
                            }
                        }).catch((error) => {

                        })
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });
                    });
                }
            },
            exportData() {
                let data = {
                    command: 'turnExamInfo/queryTurnExamInfo',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    ...this.exportOptions
                }
                exportExcel(data);
            },
            // 搜索
            doInputQuery() {
                this.queryForm.examType = {};
                this.queryForm.status = '';
                this.queryForm.startTime = '';
                this.queryForm.timeArr = ["", ""]
                this.queryForm.endTime = '';
                this.exportInput = true;
                this.queryExamList(this.pageno, this.pagesize, this.inputInfo, this.queryForm);
            },
            // 全部
            queryAll() {
                this.queryForm.examType = {};
                this.queryForm.status = '';
                this.queryForm.startTime = '';
                this.queryForm.endTime = '';
                this.queryForm.timeArr = ["", ""]
                this.inputInfo = '';
                this.currentDeptId = ""
                this.queryExamList(this.pageno, this.pagesize, '', '');
            },
            // 条件查询
            querySeach() {
                this.inputInfo = '';
                this.exportInput = false;
                this.queryExamList(this.pageno, this.pagesize, '', this.queryForm);
            },
            /*分页区*/
            handleSizeChange(size) {
                this.pagesize = size;
                if (this.exportInput) {
                    this.doInputQuery();
                } else {
                    this.querySeach();
                }
            },
            handleCurrentChange(currentPage) {
                this.pageno = currentPage;
                this.usePage = true;
                if (this.exportInput) {
                    this.doInputQuery();
                } else {
                    this.querySeach();
                }
            },
            // 筛选条件
            getStartTime(value) {
                this.queryForm.startTime = value;
            },
            getEndTime(value) {
                this.queryForm.endTime = value;
            },
            dialoggetendtime(value) {
                let _time = moment(this.dialogForm.startTime).format('YYYY-MM-DD HH:mm:ss')
                if (this.dialogForm.endTime && this.dialogForm.startTime == '') {
                    this.$message({
                        showClose: true,
                        message: '请先选择活动开始时间！',
                        type: 'warning'
                    });
                    this.dialogForm.endTime = '';
                } else {
                    if (value && _time) {
                        if (Date.parse(value.replace('-', '/').replace('-', '/')) < Date.parse(_time.replace('-', '/').replace('-', '/'))
                            || Date.parse(value.replace('-', '/').replace('-', '/')) == Date.parse(_time.replace('-', '/').replace('-', '/'))
                        ) {
                            this.$message({
                                showClose: true,
                                message: '活动结束时间必须大于活动开始时间！',
                                type: 'warning'
                            });
                            this.dialogForm.startTime = '';
                        }
                    }
                }
            },
            // tree树形控件
            initleftTree() {
                this.deptData = [];
                this.loadingShow.tree = true;
                post('/base/dept/getMyDeptTree', {
                    showHospital: 1,
                    showBase: true,
                    menusId: this.menuId
                }).then((data) => {
                    if (data && data.resCode == 200) {
                        this.deptData = data.model;
                    } else {
                        this.$message({
                            type: "error",
                            message: res.resMsg
                        })
                    }
                    this.loadingShow.tree = false;
                }).catch(err => {
                    this.loadingShow.tree = false;
                })
            },
            handleNodeClick(data) {
                // 节点ID
                if (data.havePermission != 1) {
                    return false;
                }
                this.currentDeptId = data.id
                this.currentLevel = data.deptlevel
                this.inputInfo = ''
                this.exportInput = false
                this.queryExamList(this.pageno, this.pagesize, '', this.queryForm)
            },
            // 出科考核列表查询,根据节点ID
            queryExamList(pageno, pagesize, inputInfo, queryForm) {
                this.tableData = [];
                this.loadingShow.table = true;
                if (!this.usePage) {
                    pageno = 1;
                }
                let option = {
                    examType: queryForm.examType ? queryForm.examType.key : '',
                    examTypeId: queryForm.examType ? queryForm.examType.key : '',
                    status: queryForm.status,
                    startTime: this.queryForm.timeArr != null && this.queryForm.timeArr[0] ? moment(this.queryForm.timeArr[0]).format('YYYY-MM-DD') : "",
                    endTime: this.queryForm.timeArr != null && this.queryForm.timeArr[1] ? moment(this.queryForm.timeArr[1]).format('YYYY-MM-DD') : "",
                }
                if (this.currentLevel == 1) {
                    option.hospital = this.currentDeptId
                } else if (this.currentLevel == 2) {
                    option.base = this.currentDeptId
                } else {
                    option.deptId = this.currentDeptId
                }
                // 导出
                this.exportOptions = option;
                post('/turnExamInfo/queryTurnExamInfo', {
                    command: 'turnExamInfo/queryTurnExamInfo',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    "uid": getCookie('uid'),
                    pagenum: pageno,
                    pagesize: pagesize,
                    serchInfo: inputInfo,
                    ...option
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.tableData = data.beanlist || [];
                        this.totalCount = data.count;
                        // this.canEdit = data.canEdit
                    } else {
                        this.tableData = [];
                        this.totalCount = 0;
                    }
                    if (this.tableData.length > 0) {
                        let t = Date.now()
                        this.tableData.forEach(item => {
                            let temp = moment(item.endTime).valueOf()
                            if (item.createUid == getCookie('uid')) {
                                item.adminEdit = '1'
                            }
                            if (item.deptIdNameVoList !== null) {
                                let deptNamesStr = []
                                item.deptIdNameVoList.forEach(citem => {
                                    deptNamesStr.push(citem.deptName)
                                })
                                item.deptNamesStr = deptNamesStr.join(",")
                            } else {
                                item.deptNamesStr = ""
                            }

                        })
                    }
                    this.usePage = false;
                    this.loadingShow.table = false;
                }).catch(() => {
                    this.loadingShow.table = false;
                })
            },

            // table 勾选项
            handleSelectionChange(items) {
                // 删除
                this.deletelist = [];
                let tempArr = []
                let flag = true
                for (var item of items) {
                    if (item.deleteFlag == 0) {
                        flag = false

                    } else {
                        this.deletelist.push(item.id);
                        tempArr.push(item)
                    }
                }
                if (!flag) {
                    this.$refs.detailTable.clearSelection()
                    if (tempArr.length > 0) {
                        tempArr.forEach(item => {
                            this.$refs.detailTable.toggleRowSelection(item, true);
                        })
                    }

                    this.$message({
                        showClose: true,
                        message: '请注意只能删除未开始的出科考核',
                        type: 'warning'
                    });
                }

            },

            // table 操作
            editrow(index, row) {
                // console.log(row);
                // 出科考试是否结束还是考核中
                if (row.editFlag == 1) {
                    this.disabled = false;
                } else {
                    this.disabled = true;
                    // 重置
                    this.addStudents = [];
                    this.delStudents = [];
                    this.addExaminer = [];
                    this.addExaminer = [];
                }
                this.currentFlag = row.editFlag
                // 当前出科考核ID
                this.currentExamId = row.id;
                this.dialogTitle = '出科考核编辑';
                this.dialogFormType = 1;
                let deptIdList = row.deptId;
                // 切换科室置空 flag
                this.flag = true;
                Promise.all([api.getExamDetails(this.currentExamId), api.getExamItems(deptIdList)]).then((val) => {
                    let data = val[0];
                    // 考核级别
                    this.exam_level = data.examlevel;
                    // 科室, 基地

                    if (data.examlevel == 0) {
                        this.dialogForm.examCategory = 'office'
                    } else if (data.examlevel == 1) {
                        this.dialogForm.examCategory = 'base'
                    }
                    this.getCategoryList(this.dialogForm.examCategory)

                    // 考核类型
                    this.examTypeList.map(item => {
                        if (item.key == data.exam_typeid) {
                            this.dialogForm.examType = item;
                        }
                    });

                    // 时间
                    this.dialogForm.startTime = moment(data.starttime).format();
                    this.dialogForm.endTime = moment(data.endtime).format();
                    // 备注,地点
                    this.dialogForm.examPlace = data.place;
                    this.dialogForm.remark = data.remark;

                    this.$nextTick(() => {
                        // 科室id
                        this.dialogForm.categoryName = []
                        this.dialogForm.categoryNameStr = []
                        this.baseIdSelect = []
                        if (data.deptIdNameVoList !== null) {
                            data.deptIdNameVoList.forEach(item => {
                                this.dialogForm.categoryName.push(item.deptId)
                                this.dialogForm.categoryNameStr.push(item.deptName)
                                this.baseIdSelect.push({
                                    id: item.deptId,
                                    name: item.deptName
                                })
                            })
                            this.$refs.treeDom.setCheckedKeys(this.dialogForm.categoryName)
                        }
                        // 学生
                        data.studentlist.map(item => {
                            this.selectStudentList.push({
                                name: item.studentname,
                                username: item.username,
                                studentid: item.studentid,
                                seiid: item.seiid,
                                deptid: item.deptId || "",
                                noRemove: row.editFlag == 1 ? false : true
                            });

                            // 学生列表
                            this.dialogForm.examStudents.push({
                                name: item.studentname,
                                username: item.username,
                                studentid: item.studentid,
                                seiid: item.seiid,
                                deptid: item.deptId || "",
                                noRemove: row.editFlag == 1 ? false : true
                            });

                            // 编辑中保存已选择的考生
                            this.stuRowData.push({
                                studentid: item.studentid,
                                seiid: item.seiid,
                                deptid: item.deptId || "",
                                name: item.studentname,
                                noRemove: row.editFlag == 1 ? false : true
                            });
                        });

                        // 考官
                        data.teacherlist.map(item => {
                            this.dialogForm.examiner.push(String(item.teacherid));
                        });
                        this.dialogForm.examiner = _.uniq(this.dialogForm.examiner);
                        // 编辑状态下保存添加时选择的考官列表
                        this.examiners = this.dialogForm.examiner;
                        // this.examinerList = val[2].dept_teach_list;

                        // 考核项目
                        if (data.examitemlist.length > 0) {
                            data.examitemlist.map(item => {
                                this.values.push(item.examitemid);
                            });
                        }

                        let _data = [];
                        // 置空,避免重复
                        this.examItemList = [];
                        for (var item of val[1].examitemlist) {
                            _data.push({
                                label: item.examitemname,
                                key: item.examitemid
                            })
                        }
                        _data.map(val => {
                            this.examItemList.push(val);
                        });
                        this.seachExaminer();
                    });

                    // 编辑状态改变异步
                    setTimeout(() => {
                        this.flag = false;
                    }, 500);

                    this.addEditDialog = true;


                }).catch((error) => {
                    this.$message({
                        message: '网络繁忙,稍后重试!',
                        type: 'warning'
                    });
                })
            },

            deleterow(index, row) {
                this.$confirm('请确认是否删除选中的出科考核?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/turnExamInfo/deleteturnexam', {
                        command: 'turnExamInfo/deleteturnexam',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        id: row.id
                    }).then((data) => {
                        if (data && data.errcode == 0) {
                            this.$message({
                                message: '出科考核删除成功!',
                                type: 'success'
                            });
                            if (this.exportInput) {
                                this.doInputQuery();
                            } else {
                                this.querySeach();
                            }
                        }
                    }).catch((error) => {

                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            detailrow(index, row) {
                this.$router.push({
                    name: 'graduateExamDetail',
                    query: {
                        id: row.id
                    }
                });
            },

            // dialog
            // 表单
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.values.length == 0) {
                            this.$message({
                                message: '请先选择考核项目!',
                                type: 'warning'
                            });
                            return
                        } if (this.selectStudentList.length == 0) {
                            this.$message({
                                message: '请先选择被考核学员!',
                                type: 'warning'
                            });
                            return
                        } else {
                            this.saveStatus = true;
                            if (this.dialogFormType == 0) {
                                let tempStudents = []
                                this.dialogForm.examStudents.forEach(item => {
                                    let temp = {
                                        stdid: item.studentid || item.uid,
                                        seiid: item.seiid,
                                    }
                                    if (this.dialogForm.examCategory != 'base') {
                                        temp.turnDeptId = item.deptid || ""
                                    }
                                    tempStudents.push(temp)
                                })
                                post('/turnExamInfo/addturnexam', {
                                    command: 'turnExamInfo/addturnexam',
                                    sessionid: getCookie('sid'),
                                    loginid: getCookie('uid'),
                                    examLevel: String(this.exam_level),
                                    deptIdList: this.dialogForm.categoryName,
                                    startTime: moment(this.dialogForm.startTime).format('YYYY-MM-DD HH:mm:ss'),
                                    endTime: moment(this.dialogForm.endTime).format('YYYY-MM-DD HH:mm:ss'),
                                    examType: parseInt(this.dialogForm.examType.key),
                                    examTypeId: parseInt(this.dialogForm.examType.key),
                                    place: this.dialogForm.examPlace,
                                    remark: this.dialogForm.remark,
                                    stdlist: tempStudents,
                                    teclist: this.dialogForm.examiner,
                                    examitemlist: this.values
                                }).then((data) => {
                                    if (data && data.errcode == 0) {
                                        this.$message({
                                            message: '添加出科考试成功!',
                                            type: 'success'
                                        });
                                        this.addEditDialog = false;
                                        this.saveStatus = false;
                                        this.usePage = false;
                                        this.$refs.treeLeft.setCurrentKey(null)
                                        this.queryAll();
                                    } else {
                                        this.$message({
                                            message: data.errdesc,
                                            type: 'warning'
                                        });
                                        this.saveStatus = false;
                                    }
                                }).catch(() => {
                                    this.saveStatus = false;
                                })
                            } else {
                                if (this.currentFlag != 1) {
                                    let tempStudent = []
                                    this.dialogForm.examStudents.forEach(item => {
                                        if (item.noRemove !== true) {
                                            let temp = {
                                                stdid: item.studentid || item.uid,
                                                seiid: item.seiid,
                                            }
                                            if (this.dialogForm.examCategory != 'base') {
                                                temp.turnDeptId = item.deptid || ""
                                            }
                                            tempStudent.push(temp)
                                        }
                                    })
                                    post('/turnExamInfo/tempmodifyturnexam', {
                                        command: 'turnExamInfo/tempmodifyturnexam',
                                        sessionid: getCookie('sid'),
                                        loginid: getCookie('uid'),
                                        id: this.currentExamId,
                                        addstdlist: tempStudent,
                                        endtime: moment(this.dialogForm.endTime).format('YYYY-MM-DD HH:mm:ss'),
                                    }).then((data) => {
                                        if (data && data.errcode == 0) {
                                            this.$message({
                                                message: '编辑出科考试成功!',
                                                type: 'success'
                                            });
                                            this.addEditDialog = false;
                                            this.saveStatus = false;
                                            this.usePage = false;
                                            this.queryAll();
                                        } else {
                                            this.$message({
                                                message: data.errdesc,
                                                type: 'warning'
                                            });
                                            this.saveStatus = false;
                                        }
                                    }).catch(() => {
                                        this.saveStatus = false;
                                    })
                                } else {
                                    let tempStudent = []
                                    this.dialogForm.examStudents.forEach(item => {
                                        let temp = {
                                            stdid: item.studentid || item.uid,
                                            seiid: item.seiid,
                                        }
                                        if (this.dialogForm.examCategory != 'base') {
                                            temp.turnDeptId = item.deptid || ""
                                        }
                                        tempStudent.push(temp)
                                    })
                                    post('/turnExamInfo/modifyturnexam', {
                                        command: 'turnExamInfo/modifyturnexam',
                                        sessionid: getCookie('sid'),
                                        loginid: getCookie('uid'),
                                        id: this.currentExamId,
                                        examLevel: String(this.exam_level),
                                        deptIdList: this.dialogForm.categoryName,
                                        startTime: moment(this.dialogForm.startTime).format('YYYY-MM-DD HH:mm:ss'),
                                        endTime: moment(this.dialogForm.endTime).format('YYYY-MM-DD HH:mm:ss'),
                                        examType: parseInt(this.dialogForm.examType.key),
                                        examTypeId: parseInt(this.dialogForm.examType.key),
                                        place: this.dialogForm.examPlace,
                                        remark: this.dialogForm.remark,
                                        stdlist: tempStudent,
                                        teclist: this.dialogForm.examiner,
                                        examitemlist: this.values
                                    }).then((data) => {
                                        if (data && data.errcode == 0) {
                                            this.$message({
                                                message: '编辑出科考试成功!',
                                                type: 'success'
                                            });
                                            this.addEditDialog = false;
                                            this.saveStatus = false;
                                            this.usePage = false;
                                            this.queryAll();
                                        } else {
                                            this.$message({
                                                message: data.errdesc,
                                                type: 'warning'
                                            });
                                            this.saveStatus = false;
                                        }
                                    }).catch(() => {
                                        this.saveStatus = false;
                                    })
                                }
                            }
                        }
                    } else {
                        return false;
                    }
                });
            },

            resetForm(formName) {
                this.addEditDialog = false;

                this.saveStatus = false;
                this.values = [];
                this.selectStudentList = [];
                this.examinerList = [];
                this.stuRowData = [];
                this.dialogForm = {
                    examCategory: '',     // 考核级别 0院级 1基地级 2科室级
                    categoryName: '',     // 科室
                    examType: {},         // 考核类型
                    examItems: [],        // 考核项目
                    examiner: [],         // 考官
                    examPlace: '',        // 考核地点
                    examStudents: [],     // 被考核学员
                    remark: '',           // 备注
                    startTime: '',         // 开始时间
                    endTime: '',          // 结束时间
                }
                try {
                    this.$refs[formName].resetFields();
                } catch (e) {

                }
            },

            // 考核项目选择
            selectExamItem() {
                if (!this.dialogForm.examCategory) {
                    this.$message({
                        message: '请先选择考核级别!',
                        type: 'warning'
                    });
                } else if (!this.dialogForm.categoryName) {
                    this.$message({
                        message: '请先选择科室!',
                        type: 'warning'
                    })
                } else {

                    this.selectItemDialog = true;
                    this.examItemListCopy = JSON.parse(JSON.stringify(this.values))
                    this.examItemList = [];
                    this.queryExamItems();
                    this.$nextTick(() => {
                        this.$refs.selectItemTrans.clearQuery("left")
                        this.$refs.selectItemTrans.clearQuery("right")
                    })
                }
            },
            // 考核项目查询,根据科室ID
            queryExamItems() {
                api.getExamItems(this.dialogForm.categoryName, Number(this.dialogForm.examType.key)).then((data) => {
                    let _data = [];
                    // 置空,避免重复
                    this.examItemList = [];
                    for (var item of data.examitemlist) {
                        _data.push({
                            label: item.examitemname,
                            key: item.examitemid,
                            disabled: !item.status
                        })
                    }
                    _data.map(val => {
                        this.examItemList.push(val);
                    });
                });
            },
            // 取消
            cancelSelectItems() {
                this.selectItemDialog = false;
                this.values = [];
                this.values = this.examItemListCopy

            },
            // 保存
            saveSelectItems() {
                this.selectItemDialog = false;
            },

            // 搜索全员考官
            seachExaminer() {
                let params = {}
                if (this.dialogForm.examCategory == 'office') {
                    params = {
                        deptIdList: this.dialogForm.categoryName
                    }
                }
                params.teachingType = 4
                params.keyword = ""
                post("/base/teachers/listExaminer", params).then(res => {
                    if (res && res.resCode == 200) {
                        this.examinerList = res.model;
                    }
                })
            },
            clearExamItemList() {
                this.examItemList = []
                this.selectStudentList = []
                this.values = [];
                this.dialogForm.examStudents = []
            },
            // 科室变化,考官选择变化
            selectExaminer(val) {
                // 在编辑出科考试进行中的状态下
                if (this.dialogFormType == 1 && this.disabled) {
                    // 已选择的考官
                    let examiners = this.examiners;
                    // 添加的新考官
                    this.addExaminer = _.difference(val, examiners);
                    // 删除的考官
                    this.delExaminer = _.difference(examiners, val);
                }
            },

            examinerChange(flag) {
                if (!flag && this.dialogForm.examCategory && this.dialogForm.categoryName) {
                    // api.getExamer(this.dialogForm.categoryName, '').then((data) => {
                    //     this.examinerList = data.dept_teach_list;
                    // });
                    this.seachExaminer()
                }
            },

            // 切换科室, 数据置空
            // queryExaminerList() {
            //     if (this.flag) {
            //         console.log('1');
            //     } else {
            //         console.log('2');
            //         // 考核项清空,科室切换
            //         this.examItemList = [];
            //         this.values = [];
            //         // 考官
            //         // this.dialogForm.examiner = [];
            //         // 考核学员
            //         this.selectStudentList = [];
            //     }
            //     this.seachExaminer()
            // },

            // 考核学员查询
            queryExamStudents(type) {
                if (!this.selectStudents) {
                    if (!this.dialogForm.examCategory) {
                        this.$message({
                            message: '请先选择考核级别!',
                            type: 'warning'
                        });
                        return false
                    } else if (!this.dialogForm.categoryName) {
                        this.$message({
                            message: '请先选择科室!',
                            type: 'warning'
                        })
                        return false
                    } else if (JSON.stringify(this.dialogForm.examType) == "{}") {
                        this.$message({
                            message: '请先选择考核类型!',
                            type: 'warning'
                        });
                        return false
                    }
                    this.selectStudentData = []
                    this.stuFormInline.deptid = []
                    this.stuFormInline.search = ""
                    this.stuFormInline.trunDate = []
                }
                // this.baseIdSelect = []
                let Addparams = {
                    planBeginTime: this.stuFormInline.trunDate != null && this.stuFormInline.trunDate.length > 1 ? moment(this.stuFormInline.trunDate[0]).format('YYYY-MM-DD') : "",
                    planEndTime: this.stuFormInline.trunDate != null && this.stuFormInline.trunDate.length > 1 ? moment(this.stuFormInline.trunDate[1]).format('YYYY-MM-DD') : "",
                    keyword: this.stuFormInline.search,
                    deptIdList: this.stuFormInline.deptid,
                    turnExamId: this.currentExamId
                }
                api.getExamStudents(this.dialogForm.categoryName, this.dialogForm.examType.key, this.exam_level, Addparams).then((data) => {
                    this.studentList = data.dept_stu_list;
                    this.selectStudents = true;
                    // 获取选中学生的考生数据
                    let selectItems = []
                    if (type == 1) {
                        selectItems = this.selectStudentData;
                    }

                    // let tempArr = JSON.parse(JSON.stringify(this.studentList))
                    if (this.studentList.length > 0) {
                        this.studentList.map((val, index) => {
                            if (type == 1 && this.selectStudentData.length > 0) {
                                this.selectStudentData.forEach(citem => {
                                    citem.studentid = citem.studentid || citem.uid
                                    if (val.uid == citem.studentid) {
                                        if (this.dialogForm.examCategory == 'base') {
                                            val.disabledSelect = true
                                        } else if (this.dialogForm.examCategory == 'office' && citem.deptid == val.deptid) {
                                            val.disabledSelect = true
                                        }

                                    }
                                })
                            }
                            this.dialogForm.examStudents.forEach(item => {
                                item.studentid = item.studentid || item.uid
                                if (val.uid == item.studentid && item.noRemove !== false) {
                                    if (this.dialogForm.examCategory == 'base') {
                                        val.noRemove = item.noRemove
                                    } else if (this.dialogForm.examCategory == 'office' && item.deptid == val.deptid) {
                                        val.noRemove = item.noRemove
                                    }
                                } else {
                                    val.noRemove = val.noRemove !== undefined ? val.noRemove : false
                                }


                                if ((val.uid == item.studentid && this.dialogForm.examCategory == 'base') || (val.uid == item.studentid && this.dialogForm.examCategory == 'office' && item.deptid == val.deptid)) {
                                    val.disabledSelect = true
                                    let flag = true
                                    if (selectItems.length > 0) {
                                        selectItems.forEach(resData => {
                                            resData.studentid = resData.studentid || resData.uid
                                            if (resData.studentid == item.studentid) {
                                                if (this.dialogForm.examCategory == 'base' || (this.dialogForm.examCategory == 'office' && resData.deptid == item.deptid)) {
                                                    flag = false
                                                }
                                            }
                                        })
                                    }
                                    if (flag) {
                                        selectItems.push(val)
                                    }
                                } else {
                                    if (item.noRemove === true) {
                                        let flag = true
                                        if (selectItems.length > 0) {
                                            selectItems.forEach(resData => {
                                                resData.studentid = resData.studentid || resData.uid
                                                if (resData.studentid == item.studentid) {
                                                    if (this.dialogForm.examCategory == 'base' || (this.dialogForm.examCategory == 'office' && resData.deptid == item.deptid)) {
                                                        flag = false
                                                    }
                                                }
                                            })
                                        }
                                        if (flag) {
                                            selectItems.push({
                                                ...item,
                                                disabledSelect: true
                                            })
                                        }
                                    }
                                    val.disabledSelect = val.disabledSelect === true || val.disabledSelect === false ? val.disabledSelect : false
                                }
                            })
                        });
                    } else {
                        this.dialogForm.examStudents.forEach(item => {
                            if (item.noRemove === true) {
                                item.disabledSelect = true
                                selectItems.push(item)
                            }

                        })
                    }



                    this.selectStudentData = selectItems
                    // 选中已选择的考生
                    this.$nextTick(() => {
                        if (selectItems) {
                            selectItems.forEach(row => {
                                this.$refs.leftmultipleTable.toggleRowSelection(row, true);
                            });
                        } else {
                            this.$refs.leftmultipleTable.clearSelection();
                        }
                    });

                    // this.stuFormInline.deptid = type == 1 ? this.stuFormInline.deptid : this.dialogForm.categoryName
                });

            },
            deleteSelect() {
                let tempArr = JSON.parse(JSON.stringify(this.studentList))
                // let tempArr1 = JSON.parse(JSON.stringify(this.selectStudentData))
                this.selectedTemp.forEach((citem) => {
                    this.studentList.forEach((item, cindex) => {
                        if (citem.uid == item.uid && citem.noRemove !== true) {
                            if (this.dialogForm.examCategory == 'base') {
                                tempArr[cindex].disabledSelect = false
                            } else if (this.dialogForm.examCategory == 'office' && citem.deptid == item.deptid) {
                                tempArr[cindex].disabledSelect = false
                            }
                        }
                    })
                    this.selectStudentData.forEach((litem, index) => {
                        litem.uid = litem.studentid || litem.uid
                        if (citem.uid == litem.uid && citem.noRemove !== true) {
                            if (this.dialogForm.examCategory == 'base') {
                                litem.delete = true
                            } else if (this.dialogForm.examCategory == 'office' && citem.deptid == litem.deptid) {
                                litem.delete = true
                            }
                        }
                    })
                })

                this.selectStudentData = this.selectStudentData.filter(item => { return item.delete !== true })
                this.studentList = tempArr
                this.selectedTemp = []
            },
            addSelect() {
                // console.log(this.selectStudentsTemp, "this.selectStudentsTemp")
                let tempArr = JSON.parse(JSON.stringify(this.studentList))
                this.studentList.forEach((item, index) => {
                    this.selectStudentsTemp.forEach(citem => {
                        if (item.uid == citem.uid) {
                            if (this.dialogForm.examCategory == 'base') {
                                tempArr[index].disabledSelect = true
                            } else if (this.dialogForm.examCategory == 'office' && item.deptid == citem.deptid) {
                                tempArr[index].disabledSelect = true
                            }
                        }

                    })
                })
                let tempArrList = []
                let tempArrListStr = ""
                if (this.selectStudentsTemp.length > 0) {
                    this.selectStudentData.forEach(item => {
                        item.studentid = item.studentid || item.uid
                        if (this.dialogForm.examCategory == 'base') {
                            tempArrList.push(item.studentid)
                        } else {
                            tempArrList.push(item.studentid + "*" + item.deptid)
                        }

                    })
                    tempArrListStr = tempArrList.join("/")
                    this.selectStudentsTemp.forEach(resData => {
                        resData.studentid = resData.studentid || resData.uid
                        if (this.dialogForm.examCategory == 'base') {
                            if (tempArrListStr.indexOf(String(resData.studentid)) <= -1) {
                                this.selectStudentData.push(resData)
                            }
                        } else {
                            if (tempArrListStr.indexOf(String(resData.studentid + "*" + resData.deptid)) <= -1) {
                                this.selectStudentData.push(resData)
                            }
                        }

                    })
                }

                // this.selectStudentData = this.selectStudentData.concat(tempArrList)
                this.studentList = tempArr
                this.selectStudentsTemp = []
                this.selectStudentsTemp2 = []
            },
            handleSelectedStudent(value) {
                this.selectedTemp = []
                value.forEach(item => {
                    this.selectedTemp.push({
                        ...item,
                        disabledSelect: false
                    })
                })
            },
            // 学生选择(只能添加未参加出科考核的学生)
            handleSelectStudent(item) {
                // console.log(item, "----选项更改")
                this.selectStudentsTemp = [];
                this.selectStudentsTemp2 = [];
                for (var i = 0; i < item.length; i++) {
                    this.selectStudentsTemp.push({
                        ...item[i],
                        noRemove: item[i].noRemove !== undefined ? item[i].noRemove : false
                    });
                    this.selectStudentsTemp2.push({
                        studentid: item[i].uid,
                        seiid: item[i].seiid,
                        noRemove: item[i].noRemove !== undefined ? item[i].noRemove : false
                    })
                }
                // this.selectStudentsTemp = _.uniq(this.selectStudentsTemp, 'stdid');
                // this.selectStudentsTemp2 = _.uniq(this.selectStudentsTemp2, 'stdid');

            },

            // 删除学生
            handleClose(item) {
                this.selectStudentList.forEach(citem => {
                    if (citem.studentid == item.studentid && item.deptid == citem.deptid) {
                        citem.delete = true
                    }
                })
                this.selectStudentList = this.selectStudentList.filter(val => { return val.delete !== true })
                this.dialogForm.examStudents = this.selectStudentList

                if (this.disabled) {
                    this.delStudents.push({
                        studentid: item.studentid,
                        seiid: item.seiid,
                        deptid: item.deptid || ""
                    })
                }
            },

            cancelSelectStudents() {
                this.selectStudents = false;
            },
            saveSelectStudents() {
                this.selectStudents = false;
                this.dialogForm.examStudents = this.selectStudentData;
                this.selectStudentList = this.selectStudentData;
            },
            // 考核级别对应 医院 基地 科室
            getCategoryList(value) {
                let params = {
                    menusId: this.menuId
                }
                let url = ""
                this.categoryNameList = [];
                if (value == 'hospital') {
                    this.categoryTitle = '医院:';
                    url = "/base/dept/listMyHospital"
                    params.type = 0
                } else if (value == 'base') {
                    this.categoryTitle = '基地:';
                    url = "/base/dept/getHosBaseTree"
                } else if (value == 'office') {
                    this.categoryTitle = '科室:';
                    params = {
                        ...params,
                        showHospital: 1,
                        showNoDeptHospital: 0,
                        needBaseDept: false,
                    }
                    url = "/base/dept/getMyDeptTree"
                }
                post(url, params).then(data => {
                    if (data.resCode == 200) {
                        this.categoryNameList = data.model
                    } else {
                        this.$message({
                            type: "error",
                            message: data.resMsg
                        })
                    }
                })
            },
            // 考核级别切换
            examCategoryChange(val) {
                // 考核级别切换
                // 科室
                this.dialogForm.categoryName = '';
                this.dialogForm.categoryNameStr = ""
                this.dialogForm.examiner = []
                // 考核项
                this.examItemList = [];
                this.values = [];
                // 考官
                this.examinerList = [];
                // 考核学员
                this.studentList = [];
                this.selectStudentList = []
                if (val) {
                    if (val == 'base') {
                        this.exam_level = 1
                    } else if (val == 'office' || val == 'inpatientarea' || val == 'thirdDept') {
                        this.exam_level = 0
                    }
                    this.getCategoryList(val);
                }
            },
            // 查询新增按钮是否显示权限(获取级别)
            queryAddExam() {
                post('/turnExamInfo/getturnexamlevel', {
                    command: 'turnExamInfo/getturnexamlevel',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid')
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        if (data.turnexamlevellist.length > 0) {
                            // this.showBtnAdd = true;
                            this.examCategoryList = data.turnexamlevellist;
                        }
                    }
                }).catch((error) => {

                })
            },
            // 获取考核类型
            queryExamType() {
                return new Promise((resolve, reject) => {
                    post('/traineestudent/queryDictionaryList', {
                        command: 'traineestudent/queryDictionaryList',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        code: "turnexam_type"
                    }).then((data) => {
                        if (data && data.errcode == 0) {
                            resolve(data);
                        }
                    }).catch((error) => {
                        reject(error);
                    })
                });
            },
        },
        created() {
            this.menuId = getStorage("menuId")
        },
        mounted() {

            this.getRoleAuthority();
            // 默认节点ID 中南医院
            this.currentDeptId = "";
            this.initleftTree();
            // 考核数据关联科室数据
            // api.getCategoryList().then((data) => {
            //     this.allCategoryNameList = data;
            // });
            // 出科考核列表查询
            this.queryExamType().then((data) => {
                this.examTypeList = data.dic_list;
                this.queryExamList(this.pageno, this.pagesize, '', this.queryForm);
            });
            this.queryAddExam();
        }
    }
</script>

<style scoped>
    .wapper {
        padding: 0 20px;
    }
    .selectBox {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
    }

    .selectBox .left {
        width: 75%;
        /* max-height: 600px; */
        /* overflow: scroll; */
    }

    .selectBox .right {
        width: 25%;
        /* max-height: 600px;
        overflow: scroll; */
    }

    .selectBox .middle {
        width: 25%;
        text-align: center;
    }

    .leftMiddle {
        width: 75%;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .tool-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
    }

    .top-tools {
        margin-left: 2px;
    }

    .query-tools .el-form-item {
        width: 210px;
        margin-bottom: 10px;
    }

    .query-tools .el-select {
        width: 140px;
    }

    .btn-search {
        margin-left: -30px;
    }


    .container {
        display: flex;
        width: 100%;
        align-items: flex-start;
        justify-content: space-around;
    }

    .left-box {
        width: 22%;
        overflow-y: scroll;
        max-height: 688px;
    }


    .right-box {
        width: 76%;
    }

    .tip>>>.el-form-item__label::before {
        content: '*';
        color: #ff4949;
        margin-right: 4px;
    }

    /* dialog */
    .exam-type {
        padding-left: 30px;
    }

    .transfer-select-box {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
    }

    .transfer-select-box>>>.el-transfer-panel {
        width: 40%;
    }

    .transfer-select-box>>>.el-input__inner {
        height: 30px;
    }

    .transfer-select-box>>>.el-transfer-panel__list {
        margin-top: 4px;
    }

    .transfer-select-box>>>.el-transfer-panel__list {
        padding: 10px 0;
    }

    .transfer-footer-box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 20px 10px 0 0;
    }

    .items {
        display: flex;
        align-items: flex-start;
    }

    .items-box {
        display: flex;
        align-items: center;
        width: 200px;
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        height: 36px;
        padding: 0 10px;
        margin-right: 5px;
        overflow: hidden;
    }

    .flexBox {
        display: flex;
        flex-wrap: nowrap;
    }

    .student-box {
        width: 100%;
        min-height: 100px;
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #bfcbd9;
        box-sizing: border-box;
        padding: 0 10px;
        margin-right: 5px;
        margin-top: 10px;
    }

    .tagDept {
        margin-right: 10px;
    }

    .fun-footer-box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin-right: 30px;
    }

    .select-studnet-box {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        margin: 10px 10px 0 0;
    }
</style>
<style>
    .graduateExamine .query-tools .el-date-editor--daterange {
        width: 250px;
    }

    .selectStudentDailog .el-dialog {
        width: 85%;
    }
</style>
<style>
    /* 新增出科考核弹框设置最小宽度 */
    .el-dialog__wrapper .el-dialog {
        min-width: 638px !important;
    }
</style>