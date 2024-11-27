<template>
    <div class="wapper graduateExamine_student">
        <div class="tool-box">
            <div class="func-tools">
                <el-button type="primary" @click="queryAll">查询全部</el-button>
                <el-button type="primary" @click="exportData">批量导出</el-button>
            </div>
            <div class="search-input">
                <el-input style="width:200px" v-model="inputInfo" @keyup.enter.native="doInputQuery" placeholder="请输入考官姓名"></el-input>
                <el-button type="primary" @click="doInputQuery">搜索</el-button>
            </div>
        </div>
        <div class="top-tools">
            <el-row :gutter="20">
                <el-col :span="21">
                    <div class="query-tools">
                        <el-form :model="queryForm" :inline="true">
                            <el-form-item label="科室">
                                <el-select v-model="queryForm.deptid" placeholder="请选择" style="width: 100%" @change="changeDeptId" ref="depTree">
                                    <el-option value="" label="全部" />
                                    <el-option hidden key="id" :value="queryForm.deptid" :label="queryForm.deptidName" />
                                    <el-tree :data="deptInBaseList" node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClick"
                                        ref="treeDom" class="selfTree"></el-tree>
                                </el-select>
                            </el-form-item>

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
                            <el-form-item label="时间">
                                <el-date-picker v-model="queryForm.timeArr" type="daterange" range-separator="至" start-placeholder="选择时间" end-placeholder="选择时间">
                                </el-date-picker>
                            </el-form-item>
                        </el-form>
                    </div>
                </el-col>
                <el-col :span="2" class="btn-search-box">
                    <el-button class="btn-search" type="primary" @click="doSelectQuery">查询</el-button>
                </el-col>
            </el-row>
        </div>
        <div class="container">
            <el-table ref="detailTable" :data="tableData" border tooltip-effect="dark" v-loading="loadingShow" style="width: 100%">
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
                            <el-tooltip effect="light" :content="scope.row.deptName" placement="top">
                                <span>{{scope.row.deptName}}</span>
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
                <el-table-column fixed="right" min-width="120" label="操作">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.key == 2" @click="handleUpload(scope.$index, scope.row)" type="text" size="small">上传附件
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 上传附件 -->
        <el-dialog title="上传附件" :visible.sync="uploadfiledialog" v-if="uploadfiledialog">
            <upload-file ref="upload" :datalist="propfile" @uploadfile="submitfile" @closefile="closeUpload">
            </upload-file>
        </el-dialog>
    </div>
</template>

<script>
    import { post, getCookie, setTitle, exportMouldExcel, exportExcel, getStorage } from '../../config/util';
    import { mapState, mapActions } from 'vuex';
    import api from '../../config/common_data.js';
    import uploadFile from '../../components/upload_one_file.vue';
    import moment from 'moment';
    export default {
        name: 'graduateExamine',
        data() {
            return {
                defaultProps: {
                    label: 'name',
                    children: 'childrens'
                },
                // 上传文件
                uploadfiledialog: false,
                propfile: [],
                baseUrl: '',

                loadingShow: false,
                inputInfo: '',
                // 是否是搜索列表
                exportInput: false,
                // 基地
                baseidList: [],
                // 科室
                deptInBaseList: [],
                /* 筛选区域 */
                queryForm: {
                    deptid: '',
                    deptidName: "",
                    examType: {},   //活动类型
                    status: '',      //状态
                    startTime: '',  //开始时间
                    endTime: '',   //结束时间
                    timeArr: ["", ""]
                },
                // 状态列表
                statusList: [
                    { name: '待考核', value: '0' },
                    { name: '已考核', value: '1' }
                ],
                examTypeList: [],
                tableData: [],   // 表格数据
                turnId: '',
                trunType: '',

                //分页
                pageno: 1,
                pagesize: 10,
                totalCount: 0,
                usePage: false,

                // 导出数据
                exportOptions: {},
                menuId: ""
            }
        },
        computed: {

        },
        components: {
            uploadFile
        },
        methods: {
            changeDeptId(val) {
                this.queryForm.deptidName = val == "" || val == undefined ? "全部" : this.queryForm.deptidName
                this.queryForm.deptid = val == "" || val == undefined ? "" : val
            },
            nodeClick(node) {
                if (node.deptlevel == 1 || node.havePermission != 1) {
                    return false;
                }
                this.$refs.depTree.handleClose()
                this.queryForm.deptid = node.id
                this.queryForm.deptidName = node.name
            },
            closeUpload() {
                this.uploadfiledialog = false;
            },

            // 上传
            submitfile(data) {
                let _fileUrl = '';
                let _fileName = '';
                data.map((item, index) => {
                    _fileUrl = item.url;
                    _fileName = item.name;
                });
                post('/turnExamInfo/uploadEnclosure', {
                    command: 'turnExamInfo/uploadEnclosure',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    turnType: this.turnType,
                    turnId: this.turnId,
                    fileUrl: _fileUrl,
                    fileName: _fileName
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.$message({
                            message: '上传成功！',
                            type: 'success'
                        });
                        this.uploadfiledialog = false;
                    } else {
                        this.$message({
                            message: data.errdesc,
                            type: 'warning'
                        });
                    }
                })
            },
            // 判断是否有上传附件权限
            judgeUpload(id, type) {
                return new Promise((resolve, reject) => {
                    post('/turnExamInfo/validuploadEnclosure', {
                        command: 'turnExamInfo/validuploadEnclosure',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        uid: getCookie('uid'),
                        turnId: id,
                        turnType: type,
                    }).then((data) => {
                        if (data && data.errcode == 0) {
                            resolve(data);
                        } else {
                            this.$message({
                                message: data.errdesc,
                                type: 'warning'
                            });
                        }
                    }).catch((error) => {
                        reject(error)
                    })
                })
            },

            // 上传附件
            handleUpload(index, row) {
                this.turnId = row.id;
                this.turnType = row.key;
                this.judgeUpload(this.turnId, row.key).then((data) => {
                    this.baseUrl = data.fdfsurl;
                    this.uploadfiledialog = true;
                });
            },

            // 导出
            exportData() {
                let self = this;
                let data = {
                    command: 'turnExamInfo/queryTurnExamStudentInfo',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    ...self.exportOptions
                }
                exportExcel(data);
            },
            // 搜索
            doInputQuery() {
                this.queryForm.deptid = '';
                this.queryForm.examType = {};
                this.queryForm.status = '';
                this.queryForm.startTime = '';
                this.queryForm.timeArr = ['', ''];
                this.queryForm.endTime = '';
                this.exportInput = true;
                this.queryExamList(this.pageno, this.pagesize, this.inputInfo, this.queryForm);
            },
            // 查询全部
            queryAll() {
                this.inputInfo = '';
                this.queryForm.deptid = '';
                this.queryForm.examType = {};
                this.queryForm.status = '';
                this.queryForm.startTime = '';
                this.queryForm.timeArr = ['', ''];
                this.queryForm.endTime = '';
                this.queryExamList(this.pageno, this.pagesize, '', '');
            },
            // 条件查询
            doSelectQuery() {
                this.exportInput = false;
                this.queryExamList(this.pageno, this.pagesize, this.inputInfo, this.queryForm)
            },
            /*分页区*/
            handleSizeChange(size) {
                this.pagesize = size;
                if (this.exportInput) {
                    this.doInputQuery();
                } else {
                    this.doSelectQuery();
                }
            },
            handleCurrentChange(currentPage) {
                this.pageno = currentPage;
                this.usePage = true;
                if (this.exportInput) {
                    this.doInputQuery();
                } else {
                    this.doSelectQuery();
                }
            },

            // 出科考核列表查询
            queryExamList(pageNo, pageSize, inputInfo, queryForm) {
                this.loadingShow = true;
                if (this.usePage) {
                    pageNo = this.pageno;
                } else {
                    pageNo = this.pageno = 1;
                }
                let option = {
                    deptId: queryForm.deptid,
                    examType: queryForm.examType ? queryForm.examType.key : '',
                    examTypeId: queryForm.examType ? queryForm.examType.id : '',
                    status: queryForm.status,
                    startTime: this.queryForm.timeArr != null && this.queryForm.timeArr[0] ? moment(this.queryForm.timeArr[0]).format('YYYY-MM-DD') : "",
                    endTime: this.queryForm.timeArr != null && this.queryForm.timeArr[1] ? moment(this.queryForm.timeArr[1]).format('YYYY-MM-DD') : "",
                }
                // 导出数据
                this.exportOptions = option;
                post('/turnExamInfo/queryTurnExamStudentInfo', {
                    command: 'turnExamInfo/queryTurnExamStudentInfo',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    pagenum: pageNo,
                    pagesize: pageSize,
                    serchInfo: inputInfo,
                    ...option
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.usePage = false;
                        this.totalCount = data.count;
                        this.tableData = data.beanlist || [];
                    }
                    this.loadingShow = false;
                }).catch(() => {
                    this.loadingShow = false;
                })
            },

            // 筛选条件
            getStartTime(value) {
                this.queryForm.startTime = value;
            },
            getEndTime(value) {
                this.queryForm.endTime = value;
            },

            // 科室列表
            getDeptList() {
                this.deptInBaseList = [];
                post('/base/dept/getMyDeptTree', {
                    menusId: this.menuId
                }).then((data) => {
                    if (data && data.resCode == 200) {
                        this.deptInBaseList = data.model;
                    } else {
                        this.$message({
                            type: "error",
                            message: res.resMsg
                        })
                    }
                })

            },

            getExamTypeList() {
                // 考核类型
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
            }
        },
        mounted() {
            this.menuId = getStorage("menuId")
            this.getExamTypeList().then((data) => {
                this.examTypeList = data.dic_list;
            });
            this.getDeptList();
            this.queryExamList(this.pageno, this.pagesize, '', '');
        }
    }
</script>

<style scoped>
    .wapper {
        padding: 0 20px 90px 20px;
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
        margin-bottom: 10px;
    }

    .query-tools .el-select {
        width: 120px;
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
</style>
<style>
    .graduateExamine_student .query-tools .el-date-editor--daterange {
        width: 250px;
    }
</style>