<template>
    <div class="wapper">
        <div class="tools">
            <div class="funcTools">
                <el-button type="primary" @click="addresult">添加</el-button>
                <el-button type="primary" @click="dialogTableVisible=true">批量导入</el-button>
                <el-button type="primary" @click="is_export()">批量导出</el-button>
                <el-button type="primary" @click="batchdelete()">批量删除</el-button>
            </div>
        </div>


        <!--批量导入-->
        <el-dialog title="成绩导入" :visible.sync="dialogTableVisible" @open="queryexamList">
            <div class="import-popup">
                <template>
                    <div class="grade_btn">
                        <el-radio class="radio" v-model="grade_radio" label="1"> 从OSCE系统导入</el-radio>
                        <el-radio class="radio" v-model="grade_radio" label="2"> excel表格导入</el-radio>
                    </div>
                </template>
                <!--osce导入-->
                <el-form :model="gradeForm" :rules="grade_rules" ref="gradeForm" label-width="100px" class="demo-ruleForm demo-ruleForm-grade"
                    v-if="grade_radio==1">
                    <el-form-item label="考试名称" prop='name'>
                        <el-select filterable v-model="gradeForm.name" placeholder="请选择考试名称">
                            <el-option :label="item.name" :value="item.id" :key="item.index" v-for="(item,index) in gradeForm.examList">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="年度考核" prop="examyear">
                        <el-select filterable v-model="gradeForm.examyear" placeholder="请选择年度考核">
                            <el-option :label="item.name" :value="item.key" v-for="(item,index) in yearassessmentlist" :key="item.index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <!--excel表格导入-->
                <div v-if="grade_radio==2">
                    <ul class="excelTemplateWrap">
                        <li>
                            <div class="excelTemplate">
                                <span>1、</span>
                                <p>下载第一年度考试成绩模板，批量导入年度考试成绩</p>
                                <el-button type="primary" size="mini" @click="downloadModelYear(0)">下载</el-button>
                            </div>
                        </li>
                        <li>
                            <div class="excelTemplate">
                                <span>2、</span>
                                <p>下载第二年度考试成绩模板，批量导入年度考试成绩</p>
                                <el-button type="primary" size="mini" @click="downloadModelYear(1)">下载</el-button>
                            </div>
                        </li>
                        <li>
                            <div class="excelTemplate">
                                <span>3、</span>
                                <p> 上传填写好的年度考试成绩表</p>
                            </div>
                        </li>
                        <li>
                            <div class="excelTemplate">
                                <div style="float: left">
                                    <el-upload action="/import/importExcel" ref="upload" :file-list="fileList" :data="uploadData" :show-file-list="true" :auto-upload="false"
                                        :before-upload='checkFile' :on-change="changeFile" :on-success="uploadSuccess" :on-progress="onProgress">
                                        <el-button type="primary" size="small">选择文件</el-button>
                                    </el-upload>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="funTools" align="right">
                    <el-button type="primary" v-if="grade_radio == 1" @click="submitGradeForm">上传</el-button>
                    <el-button type="primary" v-if="grade_radio == 2" @click="submitUpload">上传</el-button>
                    <el-button type="primary" @click="dialogTableVisible=false">取消</el-button>
                </div>

            </div>
        </el-dialog>

        <div class="queryTools">
            <div class="queryAll">
                <el-button type="text" @click="queryAll">全部</el-button>
            </div>
            <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="70px">
                <el-form-item label="专业基地" label-width="80px">
                    <el-select v-model="queryForm.newbaseidName" placeholder="全部" @change="changeDept">
                        <el-option label="全部" value=""></el-option>
                        <el-tree :data="baseList" node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps" @node-click="nodeClick"
                            ref="treeDom" class="selfTree"></el-tree>
                    </el-select>
                </el-form-item>
                <!-- <hospital-base-dept @updateSelectIds="setQueryFormOne" :hasDept="hasDept"></hospital-base-dept> -->

                <el-form-item label="计划年级">
                    <el-select filterable v-model="queryForm.turnplanid" placeholder="请选择计划">
                        <el-option :key="0" label="全部" :value="allvalue"></el-option>
                        <el-option v-for="(item,index) in turnplanlist" :key="item.index" :label="item.period" :value="item.period">
                            <!--turnplanid-->
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="学员类型">
                    <el-select filterable v-model="queryForm.peopletype" placeholder="请选择计划">
                        <el-option :key="0" label="全部" :value="allvalue"></el-option>
                        <el-option v-for="(item,index) in peopletypelist" :key="item.index" :label="item.name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="年度考核">
                    <el-select filterable v-model="queryForm.yearasment" placeholder="请选择计划">
                        <el-option :key="0" label="全部" :value="allvalue"></el-option>
                        <el-option v-for="(item,index) in yearassessmentlist" :key="item.index" :label="item.name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="合格状态">
                    <el-select filterable v-model="queryForm.qualifiedstate" placeholder="请选择计划">
                        <el-option :key="0" label="全部" :value="allvalue"></el-option>
                        <el-option v-for="(item,index) in qualifiedstatelist" :key="item.index" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="年份">
                    <el-date-picker style="width: 105px" v-model="queryForm.queryyear" type="year" placeholder="选择年份" format="yyyy" @change="getyeartime">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="" style="align-content: 200px;">
                    <el-input style="width:200px" v-model="queryForm.inputquery" placeholder="请输入姓名或学号" @keyup.enter.native="doSelectQuery"></el-input>
                </el-form-item>

                <el-button class="querybtn" type="primary" @click="doSelectQuery">查询</el-button>
            </el-form>
        </div>

        <!--弹窗-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogAdd" :close-on-click-modal="false" @close="closeDialog('addStudentFormRef')"
            class='dialogAdd'>
            <el-form :model="dialogForm" ref="addStudentFormRef" label-width="80px">
                <el-row :gutter="23">
                    <el-col :span="12">
                        <div class="newandedit">
                            <label><span class="red">*</span>姓名 : </label>
                            <div>
                                <!--v-if="dialogshow == 1"增加 2编辑 3查看 -->
                                <el-select v-if="dialogshow == 1" v-model="hospitalnumber" filterable remote placeholder="请输入姓名或学号搜索" :remote-method="queryStuByMobile">
                                    <el-option v-for="(item,index) in stunumoptionlist" :key="index" :label="item.name + ' - ' + item.code " :value="item.id">
                                    </el-option>
                                </el-select>

                                <el-select filterable v-if="dialogshow == 2" disabled v-model="hospitalnumber">
                                    <el-option v-for="item in stunumoptioneditlist" :key="item.id" :label="item.name + ' - ' + item.code " :value="item.code">
                                    </el-option>
                                </el-select>

                                <div v-if="dialogshow == 3">{{ dialogForm.name + ' - ' + dialogForm.username}}</div>
                            </div>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="22">
                    <el-col :span="12">
                        <div class="newandedit">
                            <label><span class="red">*</span>年度考核 : </label>
                            <div>
                                <el-select filterable v-if="dialogshow == 1 || dialogshow == 2" v-model="yearassessment" @change="getprojectlist" placeholder="请选择">
                                    <el-option v-for="(item,index) in yearassessmentlist" :key="item.index" :label="item.name" :value="item.key">
                                    </el-option>
                                </el-select>
                                <div v-if="dialogshow == 3">{{dialogForm.examyearname}}</div>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="newandedit">
                            <label><span class="red">*</span>考核日期 : </label>
                            <div v-if="dialogshow == 1 || dialogshow == 2">
                                <el-date-picker v-model="assessmentdate" type="date" @change="gettime" placeholder="选择考核日期" format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                                </el-date-picker>
                            </div>
                            <div v-if="dialogshow == 3">{{dialogForm.examdate}}</div>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="22">
                    <el-col :span="12">
                        <div class="newandedit">
                            <label>理论成绩 : </label>
                            <div v-if="dialogshow == 1 || dialogshow == 2">
                                <el-input v-model="theoryachievement" placeholder="请输入理论成绩"></el-input>
                            </div>
                            <div v-if="dialogshow == 3">{{dialogForm.theoryscore}}</div>
                        </div>
                    </el-col>
                    <el-col :span="12" v-if="dialogForm.againflag == 1">
                        <div class="newandedit">
                            <label>补考成绩 : </label>
                            <div v-if="dialogshow == 1 || dialogshow == 2">
                                <el-input v-model="secondtheoryscore" placeholder="请输入理论补考成绩"></el-input>
                            </div>
                            <div v-if="dialogshow == 3">{{dialogForm.secondtheoryscore}}</div>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="22">
                    <el-col :span="12">
                        <div class="newandedit">
                            <label>病历书写 : </label>
                            <div v-if="dialogshow == 1 || dialogshow == 2">
                                <el-input v-model="medicalwritingscore" placeholder="请输入书写成绩"></el-input>
                            </div>
                            <div v-if="dialogshow == 3">{{dialogForm.medicalwritingscore}}</div>
                        </div>
                    </el-col>
                    <el-col :span="12" v-if="dialogForm.medagainflag == 1">
                        <div class="newandedit">
                            <label>补考成绩 : </label>
                            <div v-if="dialogshow == 1 || dialogshow == 2">
                                <el-input v-model="medicalwritingresit" placeholder="请输入病历书写补考成绩"></el-input>
                            </div>
                            <div v-if="dialogshow == 3">{{dialogForm.medicalwritingresit}}</div>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="23" v-if="dialogshow == 1 || dialogshow == 2">
                    <el-col :span="23">
                        <div class="newandedit">
                            <el-form-item class="circleRoom" label="技能成绩 :">
                                <el-col :span="6">
                                    <div>&ensp;&ensp;考站</div>
                                </el-col>
                                <el-col :span="7">
                                    <div>考核项</div>
                                </el-col>
                                <el-col :span="5" style="text-align: center;">
                                    <div>得分</div>
                                </el-col>
                                <el-col :span="5" v-if="showagainflag == 1" style="text-align: center;">
                                    <div>补考得分</div>
                                </el-col>

                                <el-col :span='23'>
                                    <div v-for="(item,index) in assessmentlist" class="circleRoomInfo">
                                        <el-col :span="4">
                                            <div>{{item.name}}</div>
                                        </el-col>

                                        <el-col :span="10">
                                            <el-select v-show="item.name" style="width: 100%; margin-bottom:15px;" filterable v-model="selectList[index]" placeholder="请选择考核项">
                                                <el-option v-for="item in asmtprojectlist" :key="item.examitemid" :label="item.examitemname" :value="item.examitemid">
                                                </el-option>
                                            </el-select>
                                        </el-col>

                                        <el-col :span="5">
                                            <el-input v-show="item.name" v-model='scoreList[index]'></el-input>
                                        </el-col>

                                        <el-col :span="5" v-if="dialogshow == 2 && item.againflag == 1">
                                            <el-input v-show="item.name" v-model='secondscorelist[index]'></el-input>
                                        </el-col>
                                    </div>
                                </el-col>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>

                <el-row :gutter="10" v-if="dialogshow == 3" style="text-align: center;">
                    <el-col :span='24'>
                        <el-col :span="4">
                            <div>技能成绩 :</div>
                        </el-col>
                        <el-col :span="5">
                            <div>考站</div>
                        </el-col>
                        <el-col :span="5">
                            <div>考核项</div>
                        </el-col>
                        <el-col :span="5">
                            <div>得分</div>
                        </el-col>
                        <el-col :span="5" v-if="remedialScore == 1">
                            <div>补考得分</div>
                        </el-col>
                    </el-col>
                    <el-col :span='24' v-for="(item,index) in dialogForm.detaillist" :key="index" class="detailcircleRoomInfo">
                        <el-col :span="4">&emsp;&emsp;
                        </el-col>
                        <el-col :span="5">
                            <div>&ensp;{{item.teststationname}}</div>
                        </el-col>
                        <el-col :span="5">
                            <div>&ensp;{{item.examitemname}}</div>
                        </el-col>
                        <el-col :span="5" style="text-align: center;">
                            <div>&ensp;{{item.score}}</div>
                        </el-col>
                        <el-col :span="5" style="text-align: center;" v-if="item.againflag == 1">
                            <div>&ensp;{{item.secondscore}}</div>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-button v-if="dialogshow == 1" @click="addsave" type="primary" class="bottomBtnsSure">保存</el-button>
                    <el-button v-if="dialogshow == 2" @click="editsave" type="primary" class="bottomBtnsSure">保存</el-button>
                    <el-button v-if="dialogshow == 1 || dialogshow == 2" @click="dialogAdd = false" class="bottomBtns">取消</el-button>
                </el-row>

            </el-form>
        </el-dialog>

        <div class="dataTable">
            <el-table ref="detailTable" :data="rateList" border tooltip-effect="dark" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45"></el-table-column>
                <!--<el-table-column type ="index" width = "50" label = "序号" ></el-table-column>-->
                <el-table-column prop="name" label="姓名" width="150" fixed='left'>
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="username" width="110" label="学号"></el-table-column>
                <el-table-column prop="sex" label="性别"></el-table-column>
                <el-table-column prop="mobile" width="110" label="手机号码"></el-table-column>
                <el-table-column prop="stugradename" width="110" label="年级"></el-table-column>
                <el-table-column prop="stutypename" width="140" label="学员类型"></el-table-column>
                <el-table-column prop="basename" width="200" label="专业基地"></el-table-column>
                <!-- <el-table-column prop="officename" width="200" label="科室"></el-table-column> -->
                <el-table-column prop="turngradename" width="110" label="计划年级"></el-table-column>
                <el-table-column prop="examyearname" width="110" label="年度考核"></el-table-column>
                <el-table-column prop="examdate" width="110" label="考核日期"></el-table-column>
                <el-table-column prop="examstatus" width="110" label="合格状态">
                    <template slot-scope="scope">
                        <template v-if="scope.row.examstatus == 1">合格</template>
                        <template v-if="scope.row.examstatus == 0">不合格</template>
                        <template v-if="scope.row.examstatus == 2">补考合格</template>
                        <template v-if="scope.row.examstatus == 3">补考不合格</template>
                    </template>
                </el-table-column>
                <el-table-column prop="theoryscore" width="110" label="理论成绩">
                    <template slot-scope="scope">
                        {{scope.row.secondtheoryscore?scope.row.secondtheoryscore:scope.row.theoryscore}}
                    </template>
                </el-table-column>
                <el-table-column prop="medicalwritingscore" width="110" label="病历书写">
                    <template slot-scope="scope">
                        {{scope.row.medicalwritingresit?scope.row.medicalwritingresit:scope.row.medicalwritingscore}}
                    </template>
                </el-table-column>

                <el-table-column prop="detaillist" v-for="(item,index) in tabletitlelist" :key="index" width="80" :label="item.teststationname">
                    <template slot-scope="scope">
                        <template v-for="(item2,index2) in scope.row.detaillist">
                            <template v-if="item.teststationname == item2.teststationname">
                                {{item2.secondscore?item2.secondscore:item2.score}}
                            </template>
                        </template>
                    </template>
                </el-table-column>

                <el-table-column fixed="right" width="170" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                        <el-button @click="detail(scope.$index, scope.row)" type="text" size="small">查看</el-button>
                        <el-button @click="singledelete(scope.$index, scope.row)" type="text" size="small">删除</el-button>
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
    import { post, getCookie, setTitle, exportMouldExcel, exportExcel, showErrorImport } from '../../config/util'
    import { mapState, mapActions } from 'vuex'
    import moment from 'moment'
    const _ = require('lodash');

    export default {
        data() {
            return {
                baseList: [],
                dialogRecords: false,
                studentDetailId: "",
                selectList: [],       // 考核项
                scoreList: [],       //  分数
                secondscorelist: [], // 补考分数
                //成绩导入
                fileList: [],
                gradeForm: { name: '', examyear: '', examList: [], examdate: '' },
                grade_rules: {
                    name: [{ required: true, message: '请选择考试名称', trigger: 'change', type: 'number' }],
                    examyear: [{ required: true, message: '请选择年度考核', trigger: 'change', type: 'number' }]
                },
                selectValue: '',
                grade_radio: '1',
                hasFile: false,
                dialogTableVisible: false,
                uploadData: {
                    _upload_data: JSON.stringify({
                        "1": {
                            command: 'turnannualresult/importturnannualscorelist',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                        }
                    })
                },

                //筛选
                allvalue: '',
                turnplanlist: [],//轮转计划数组
                studentturnplanlist: [],
                studentturnplanlist_edit: [],
                peopletypelist: [],
                queryForm: {
                    turnplanid: '',
                    inputquery: '',
                    newbaseid: '',
                    newdepartment: '',
                    yearasment: '',
                    qualifiedstate: '',
                    queryyear: '',
                    peopletype: '',
                    newbaseidName: ''
                },
                tabletitlelist: [],
                //弹窗
                dialogTitle: '',
                dialogAdd: false,
                stunumoptionlist: [],//学号列表
                hospitalnumber: '',//住培学号
                name: '',        //姓名
                yearassessment: '',  //年度考核
                assessmentdate: '',          //考核日期
                theoryachievement: '',       //理论成绩
                medicalwritingscore: '',     //病例书写
                medicalwritingresit: '',     //病历书写补考成绩
                updetaillist: [],
                defaultProps: {
                    label: 'name',
                    children: 'childrens'
                },
                qualifiedstatelist: [    //合格状态
                    {
                        name: '不合格',
                        id: 0
                    },
                    {
                        name: '合格',
                        id: 1
                    },
                    {
                        name: '补考合格',
                        id: 2
                    },
                    {
                        name: '补考不合格',
                        id: 3
                    }
                ],
                yearassessmentlist: [],//年度考核列表
                addinputlist: [],
                assessmentlist: [
                    {
                        asmtproject: [],
                        paojectscore: [],
                    }
                ],//考站列表
                asmtprojectlist: [],
                allturnplanlist: [],

                dialogturnplanid: '',//
                editupdetaillist: [],
                editid: '',
                dialogForm: {},      //知道
                dialogshow: '',//1增加；2编辑 3查看
                editturnplanid: '',//编辑提交的轮转计划id
                turnplanflag: true,
                editassessmentlist: [],//编辑的考站数组
                stunumoptioneditlist: [],//学生姓名
                //全部
                isnewbaseid: '',
                isnewdepartment: '',
                isnewarea: '',
                baseidlist: [],
                officeidlist: [],
                areaidlist: [],
                newroomList: [],
                newdeptList: [],
                newareaList: [],

                rateList: [],
                pageno: 1,
                pagesize: 10,
                totalCount: 0,
                againflagtheory: '',//理论成绩是否有补考
                medagainflag: '',//病历书写是否有补考
                secondtheoryscore: '',//理论补考成绩
                showagainflag: '',//osce是否有补考成绩

                remedialScore: 0,//展示补考得分
                stdid: '',//保存学生id
                deletelist: [],
                usePage: false,
                loading: false
            }
        },
        created() { },
        computed: {},
        components: {
            studentPersonalInfo,
        },
        //下载excel模板
        downloadModel() {
            let data = {
                sessionid: getCookie('sid'),
                loginid: getCookie('uid'),
                command: 'turnscore/turnscoremould'
            }
            exportMouldExcel(data)
        },
        mounted() {
            this.inittable(this.pageno, this.pagesize, '', '', '', '', '', '', '');
            this.gethospitaltree();
            this.getpeopletypelist();
            this.getallturnplanlist();
            this.getallexamyearlist();
            this.getBaseList()
        },
        watch: {
            'gradeForm': {
                handler(newV, oldV) {
                    if (newV.name) {
                        for (let item of newV.examList) {
                            if (newV.name == item.id) {
                                this.gradeForm.examdate = item.endtime;
                            }
                        }
                    }

                },
                deep: true
            },
            'dialogturnplanid': function (value, oldvalue) {
                if (oldvalue) {
                    if (oldvalue != value) {
                        this.turnplanflag = true;
                    }
                }
            },
            'yearassessment': function (val, oldval) {
                if (oldval && oldval != val) {
                    this.selectList = [];      // 考核项
                    this.scoreList = [];       //  分数
                    this.secondscorelist = []; // 补考分数
                }
            },

            winChips: {
                'selectList': function (val, oldval) {
                    val.map((item, index) => {
                        this.scoreList[index] == ''
                    })
                }

            },
        },
        methods: {
            ...mapActions(['showErrorImport']),
            nodeClick(node) {
                if (node.deptlevel == 1) {
                    this.queryForm.hospitalId = node.id
                    this.queryForm.newbaseid = ""
                } else {
                    this.queryForm.hospitalId = ""
                    this.queryForm.newbaseid = node.id
                }
                this.queryForm.newbaseidName = node.name
            },
            changeDept(val) {
                if (val == undefined || val == null || val == "") {
                    this.queryForm.hospitalId = ""
                    this.queryForm.newbaseid = ""
                    this.queryForm.newbaseidName = ""
                }
            },
            getBaseList() {
                post("/base/dept/getHosBaseTree").then(res => {
                    if (res && res.resCode == 200) {
                        this.baseList = res.model
                    } else {
                        this.$message({
                            type: "error",
                            message: res.resMsg || "请求基地列表报错"
                        })
                    }
                })
            },
            personalDetail(index, row) {
                this.dialogRecords = true;
                this.studentDetailId = row.uid
            },
            //OSCE导入按钮
            submitGradeForm() {
                let self = this;
                this.$refs['gradeForm'].validate((valid) => {
                    post('/turnannualresult/importannualscorefromosce', {
                        command: 'turnannualresult/importannualscorefromosce',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        examid: self.gradeForm.name,
                        examdate: self.gradeForm.examdate,
                        examyear: self.gradeForm.examyear
                    }).then(function (data) {
                        if (data && data.errcode == 0) {
                            self.$message({
                                type: 'success',
                                message: '提交成功'
                            });
                            self.dialogTableVisible = false;
                        } else if (data && data.errcode == '400006') {
                            self.$message({
                                type: 'warning',
                                message: data.errdesc
                            });
                        } else if (data && data.errcode == '400005') {
                            self.$message({
                                type: 'warning',
                                message: "本次导入成绩已存在，请确认后再操作"
                            });
                        }
                    }).catch(() => {
                        self.$message({
                            type: 'warning',
                            message: '网络错误,请联系管理员'
                        })
                    })
                });
            },
            //导入
            submitUpload() {
                if (!this.hasFile) {
                    this.$message({
                        showClose: true,
                        message: '请先选择上传的Excel文件！',
                        type: 'warning'
                    });
                }
                this.$refs.upload.submit();
            },
            //下载导入模板
            downloadModelYear: function (index) {
                let self = this;
                let data = {
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    examyearname: self.yearassessmentlist[0].name,
                    examyearid: self.yearassessmentlist[0].key,
                    command: "turnannualresult/turnannualscoremould",
                };
                exportMouldExcel(data);
            },
            //文件状态改变
            changeFile(file, list) {
                if (list.length > 1) {
                    list.shift();
                }
                if (list.length > 0) {
                    this.hasFile = true;
                }
            },
            //上传文件之前 限制文件类型
            checkFile(file) {
                const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || file.type === 'application/vnd.ms-excel';
                if (!isExcel) {
                    this.$message.error('请上传.xls或.xlsx格式的Excel文件！');
                }
                this.hasFile = false;
                return isExcel;
            },
            //上传成功
            uploadSuccess(res) {
                if (res.errcode == 0) {
                    this.$message({
                        type: 'success',
                        message: '上传成功'
                    })
                } else if (res.errcode == 9903) {
                    this.showErrorImport(res.errorlist)
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.errdesc
                    })
                }
                this.$refs.upload.clearFiles()
                this.dialogTableVisible = false
                this.hasFile = false
                this.$loading().close()
            },
            //文件上传时-显示进度条
            onProgress() {
                this.$loading();
            },
            //导出
            is_export: function () {
                let data = {
                    command: 'turnannualresult/listannualresult',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    baseId: this.isnewbaseid,
                    officeId: this.isnewdepartment,
                    turngradename: this.queryForm.turnplanid,
                    stutype: this.queryForm.peopletype,
                    examyear: this.queryForm.yearasment,
                    examstatus: this.queryForm.qualifiedstate,
                    queryyear: this.queryForm.queryyear,
                    nameOrCode: this.queryForm.inputquery,
                };
                exportExcel(data);
            },
            //增加成绩
            addresult: function () {
                let self = this;
                self.dialogAdd = true;
                self.dialogTitle = '添加';
                self.dialogshow = 1;
                self.hospitalnumber = '';
                self.name = '';
                self.nameid == ''
                self.yearassessment = '';   //年度考核
                self.assessmentdate = '';           //考核日期
                self.theoryachievement = '';        //理论成绩
                self.medicalwritingscore = '';      //病历书写
                self.showagainflag = '';
                self.dialogForm.medagainflag = '';
                self.dialogForm.againflag = '';

                self.getteststationlist();
                self.assessmentlist.map(item => {
                    if (item.modelasmtprojectlist) {
                        item.modelasmtprojectlist = '';
                    };
                    if (item.paojectscorelist) {
                        item.paojectscorelist = '';
                    };
                })
                self.stunumoptionlist = [];
                self.studentturnplanlist = [];
                self.asmtprojectlist = [];          //考核项列表
                self.turnplanflag = true;
            },
            //学号改变  查询学号列表
            queryStuByMobile(query) {
                let self = this;
                if (query !== '') {
                    this.loading = true;
                    setTimeout(() => {
                        this.loading = false;
                        post('/student/queryturnstudent', {
                            command: 'student/queryturnstudent',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            searchinfo: query,
                            systemtype: 2,   //2住院医3实习生
                        }).then(function (data) {
                            if (data && data.errcode == 0) {
                                self.stunumoptionlist = data.studentlist;
                                if (self.turnplanflag == false) {
                                    self.nameid = data.studentlist[0].id
                                }
                            }
                        })
                    }, 200);
                } else {

                }
            },
            //选取时间段
            gettime: function (date) {
                this.assessmentdate = date;//选取时间段
            },
            getyeartime: function (date) {
                this.queryForm.queryyear = date;
            },

            //改变年度查询属于该年度的考核项
            getprojectlist: function () {
                let self = this;
                if (self.yearassessment && self.yearassessment != '') {
                    post('/turnannualresult/queryexamitemlist', {
                        command: 'turnannualresult/queryexamitemlist',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        annualtype: self.yearassessment,   // 选择的考核项
                        status: 1,                        //启用的考核项
                        sysType: 1
                    }).then(function (data) {
                        if (data && data.errcode == 0) {
                            self.asmtprojectlist = data.examitemlist;
                            self.asmtprojectlist.unshift({ examitemid: -1, examitemname: "请选择" })
                            self.selectValue = -1;
                        }
                    })
                };

            },

            closeDialog(formName) {
                this.$refs[formName].resetFields();
            },
            //查询考试列表
            queryexamList() {
                let self = this;
                post('/oscenewexamquery2/examlist', {
                    command: 'oscenewexamquery2/examlist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    uid: getCookie('uid'),
                    exammold: 4,
                    status: 4
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.gradeForm.examList = data.resultlist;
                    }
                })
            },
            //增加保存按钮
            addsave: function () {
                let self = this;
                let _flag = true;
                if (self.hospitalnumber == '' || !self.hospitalnumber) {
                    self.$message({
                        message: '请输入正确的姓名或学号！',
                        type: 'warning'
                    });
                } else if (self.yearassessment == '' || !self.yearassessment) {
                    self.$message({
                        message: '请选择年度考核！',
                        type: 'warning'
                    });
                } else if (self.assessmentdate == '' || !self.assessmentdate) {
                    self.$message({
                        message: '请选择考核日期！',
                        type: 'warning'
                    });
                } else {
                    self.updetaillist = [];
                    self.assessmentlist.map((item, index) => {
                        if (self.selectList[index] == -1) {
                            self.selectList[index] = ''
                        };
                        if ((self.selectList[index] && !self.scoreList[index]) || (!self.selectList[index] && self.scoreList[index])) {
                            self.$message({
                                message: '同一考站的考核项和分数必须同时填写！',
                                type: 'warning'
                            });
                            _flag = false;
                            return
                        } else {
                            self.updetaillist.push(
                                {
                                    teststation: item.key,                    //考站
                                    examitem: self.selectList[index],        //技能项
                                    score: self.scoreList[index]             //分数
                                }
                            )
                        }

                    })

                    if (_flag) {
                        post('/turnannualresult/addannualresult', {
                            command: 'turnannualresult/addannualresult',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            stdid: self.hospitalnumber,
                            examyear: self.yearassessment,   //年度考核
                            examdate: self.assessmentdate,           //考核日期
                            theoryscore: self.theoryachievement,     //理论成绩
                            medicalwritingscore: self.medicalwritingscore,//病历书写
                            detaillist: self.updetaillist,
                        }).then(function (data) {
                            if (data && data.errcode == 0) {
                                self.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                self.clearSelect();
                                self.inittable(self.pageno, self.pagesize, '', '', '', '', '', '', '');
                                self.dialogAdd = false;
                            } else if (data && data.errcode == 400001) {
                                self.$message({
                                    message: '该学生成绩已存在',
                                    type: 'success'
                                });
                            } else if (data && data.errcode == 400002) {
                                self.$message({
                                    message: '该学生关联轮转计划错误',
                                    type: 'success'
                                });
                            } else if (data && data.errcode == 400003) {
                                self.$message({
                                    message: '该学生成绩不存在',
                                    type: 'success'
                                });
                            } else if (data && data.errcode == 400004) {
                                self.$message({
                                    message: '该学生关联轮转计划成绩已存在',
                                    type: 'success'
                                });
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

                }
            },

            queryAll: function () {
                let self = this;
                self.queryForm.base = '';
                self.queryForm.docoroffcie = '';
                self.queryForm.hospitalId = '';
                self.queryForm.newbaseid = '';
                self.queryForm.newdepartment = '';
                self.queryForm.turnplanid = '';
                self.queryForm.inputquery = '';
                self.queryForm.yearasment = '';
                self.queryForm.qualifiedstate = '';
                self.queryForm.peopletype = '';
                self.queryForm.queryyear = '';
                self.queryForm.newbaseidName = '';
                self.pageno = 1;
                self.inittable(self.pageno, self.pagesize, '', '', '', '', '', '', '', '');
            },
            inittable: function (pageno, pagesize, base, docoroffcie, turnplan, peopletype, yearasment, quastate, year, inputquery) {
                let self = this;
                if (this.usePage) {
                    pageno = this.pageno;
                } else {
                    pageno = this.pageno = 1;
                }
                self.loading = true;
                post('/turnannualresult/listannualresult', {
                    command: 'turnannualresult/listannualresult',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    page: pageno,
                    reqnum: pagesize,
                    hospitalId: this.queryForm.hospitalId,
                    baseId: base,
                    turngradename: turnplan,
                    stutype: peopletype,
                    examyear: yearasment,
                    examstatus: quastate,
                    queryyear: year,
                    nameOrCode: inputquery,
                }).then(function (data) {
                    self.loading = false;
                    if (data && data.errcode == 0) {
                        self.rateList = data.result.list;
                        if (data.result.list.length > 0) {
                            self.tabletitlelist = data.result.list[0].detaillist;
                        }
                        self.totalCount = data.result.count;
                    }
                    self.usePage = false;
                }).catch(function (error) {
                    self.loading = false;
                    //console.log(error)
                })
            },

            /*编辑区*/
            edit: function (index, row) {
                let self = this;
                self.hospitalnumber = '';
                self.showagainflag = '';
                self.turnplanflag = false;
                self.dialogTitle = '编辑';
                self.dialogshow = 2;
                self.yearassessment = '';
                self.assessmentlist = [];
                post('/turnannualresult/getuserannualresultbyid', {
                    command: 'turnannualresult/getuserannualresultbyid',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: row.id,
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.editid = data.bean.id;     //编辑id
                        self.stunumoptioneditlist = [
                            {
                                'id': data.bean.id,
                                'name': data.bean.name,
                                'code': data.bean.username
                            }
                        ];
                        self.hospitalnumber = data.bean.username;       //住培学号
                        self.yearassessment = data.bean.examyearname;   //年度考核
                        self.assessmentdate = data.bean.examdate;           //考核日期
                        self.theoryachievement = data.bean.theoryscore;     //理论成绩
                        self.secondtheoryscore = data.bean.secondtheoryscore //理论补考成绩
                        self.dialogForm.againflag = data.bean.againflag;         //理论成绩是否补考0否1是
                        self.medicalwritingscore = data.bean.medicalwritingscore;   //
                        self.medicalwritingresit = data.bean.medicalwritingresit;   //
                        self.dialogForm.medagainflag = data.bean.medagainflag;     //病历书写是否补考
                        self.nameid = data.bean.stdid;
                        self.stdid = data.bean.stdid;
                        data.bean.detaillist.map(item => {
                            self.assessmentlist.push(
                                {
                                    id: item.teststation,
                                    name: item.teststationname,
                                    detailid: item.detailid,
                                    againflag: item.againflag,
                                }
                            )
                            self.selectList.push(item.examitem);      // 考核项
                            self.scoreList.push(item.score);      //  分数
                            self.secondscorelist.push(item.secondscore); // 补考分数
                            if (item.againflag == 1) {
                                self.showagainflag = item.againflag;
                                return
                            }
                        })
                        let a = data.bean.username;
                        self.queryStuByMobile(a);
                        self.getprojectlist();
                        self.dialogAdd = true;
                    }
                }).catch(function (error) {
                    //console.log(error)
                })
            },
            editsave: function () {
                let self = this;
                let _flag = true;
                if (self.hospitalnumber == '' || !self.hospitalnumber) {
                    self.$message({
                        message: '请输入正确的姓名或学号！',
                        type: 'warning'
                    });
                } else if (self.yearassessment == '' || !self.yearassessment) {
                    self.$message({
                        message: '请选择年度考核',
                        type: 'warning'
                    });
                } else if (self.assessmentdate == '' || !self.assessmentdate) {
                    self.$message({
                        message: '请选择考核日期',
                        type: 'warning'
                    });
                } else {
                    self.editupdetaillist = [];
                    self.assessmentlist.map((item, index) => {
                        if (self.selectList[index] == -1) {
                            self.selectList[index] = ''
                        };
                        if ((self.selectList[index] && !self.scoreList[index]) || (!self.selectList[index] && self.scoreList[index])) {
                            self.$message({
                                message: '同一考站的考核项和分数必须同时填写！',
                                type: 'warning'
                            });
                            _flag = false;
                            return
                        } else {
                            self.editupdetaillist.push(
                                {
                                    detailid: item.detailid,
                                    teststation: item.key,                    //考站
                                    examitem: self.selectList[index],        //技能项
                                    score: self.scoreList[index],                //分数
                                    secondscore: self.secondscorelist[index]     // 补考分数
                                }
                            )
                        }
                    });
                    if (_flag) {
                        post('/turnannualresult/updateuserannualresult', {
                            command: 'turnannualresult/updateuserannualresult',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            id: self.editid,
                            stdid: self.stdid,
                            examyear: self.yearassessment,   //年度考核
                            examdate: self.assessmentdate,           //考核日期
                            theoryscore: self.theoryachievement,     //理论成绩
                            detaillist: self.editupdetaillist,
                            secondtheoryscore: self.secondtheoryscore,//理论补考成绩
                            medicalwritingscore: self.medicalwritingscore,//病历书写
                            medicalwritingresit: self.medicalwritingresit,//病历书写补考
                        }).then(function (data) {
                            if (data && data.errcode == 0) {
                                self.$message({
                                    message: '编辑成功',
                                    type: 'success'
                                });
                                // self.dialogturnplanid = '';
                                self.usePage = true;
                                self.inittable(self.pageno, self.pagesize,
                                    self.isnewbaseid, self.isnewdepartment,
                                    self.queryForm.turnplanid,
                                    self.queryForm.peopletype, self.queryForm.yearasment, self.queryForm.qualifiedstate,
                                    self.queryForm.queryyear, self.queryForm.inputquery)
                                self.dialogAdd = false;
                            } else if (data && data.errcode == 400001) {
                                self.$message({
                                    message: '该学生成绩已存在',
                                    type: 'success'
                                });
                            } else if (data && data.errcode == 400002) {
                                self.$message({
                                    message: '该学生关联轮转计划错误',
                                    type: 'success'
                                });
                            } else if (data && data.errcode == 400003) {
                                self.$message({
                                    message: '该学生成绩不存在',
                                    type: 'success'
                                });
                            } else if (data && data.errcode == 400004) {
                                self.$message({
                                    message: '该学生关联轮转计划成绩已存在',
                                    type: 'success'
                                });
                            } else {
                                self.$message({
                                    message: data.errdesc,
                                    type: 'warning'
                                });
                            }
                        }).catch(function (error) {
                            //console.log(error)
                        })
                    };
                }
            },
            //查看列表单个数据
            detail: function (index, row) {
                let self = this;
                self.dialogshow = 3;
                self.dialogTitle = '查看';
                post('/turnannualresult/getuserannualresultbyid', {
                    command: 'turnannualresult/getuserannualresultbyid',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    id: row.id,
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.dialogForm = data.bean;
                        self.dialogAdd = true;
                        let arr = [...self.dialogForm.detaillist];
                        for (let val of arr) {
                            if (val.againflag == 1) {
                                return self.remedialScore = 1;
                            }
                        };
                        //展示补考得分
                        return self.remedialScore = 0;
                    }
                }).catch(function (error) {
                    //console.log(error)
                })

            },
            /*分页区*/
            handleSizeChange(size) {
                this.pagesize = size;
                this.inittable(this.pageno, this.pagesize, this.isnewbaseid, this.isnewdepartment,
                    this.queryForm.turnplanid,
                    this.queryForm.peopletype, this.queryForm.yearasment, this.queryForm.qualifiedstate, this.queryForm.queryyear,
                    this.queryForm.inputquery);
            },
            handleCurrentChange(currentPage) {
                this.pageno = currentPage;
                this.usePage = true;
                this.inittable(this.pageno, this.pagesize, this.isnewbaseid, this.isnewdepartment,
                    this.queryForm.turnplanid,
                    this.queryForm.peopletype, this.queryForm.yearasment, this.queryForm.qualifiedstate, this.queryForm.queryyear,
                    this.queryForm.inputquery);
            },
            //查询方法
            doSelectQuery: function () {
                let self = this;
                if (self.queryForm.newbaseid == 0 || self.queryForm.newbaseid == '') {
                    self.isnewbaseid = '';
                    if (self.queryForm.newdepartment == 0 || self.queryForm.newdepartment == '') {
                        self.isnewdepartment = '';
                    }
                    self.isnewarea = '';
                } else {
                    if (self.queryForm.newbaseid && self.queryForm.newbaseid != 0) {
                        self.baseidlist.push(self.queryForm.newbaseid);
                    };
                    if (self.queryForm.newdepartment && self.queryForm.newdepartment != 0) {
                        self.officeidlist.push(self.queryForm.newdepartment);
                    };
                    /*if(self.queryForm.newarea && self.queryForm.newarea != 0 ){
                        self.areaidlist.push(self.queryForm.newarea);
                    };*/

                    self.isnewbaseid = self.queryForm.newbaseid;
                    self.isnewdepartment = self.queryForm.newdepartment;
                    //self.isnewarea = self.queryForm.newarea;
                };
                this.pageno = 1;
                self.inittable(self.pageno, self.pagesize,
                    self.isnewbaseid, self.isnewdepartment,
                    self.queryForm.turnplanid,
                    self.queryForm.peopletype, self.queryForm.yearasment, self.queryForm.qualifiedstate,
                    self.queryForm.queryyear, self.queryForm.inputquery)
            },
            //单个删除
            singledelete: function (index, row, batch) {
                let self = this;
                let _turnscoreid = [];
                _turnscoreid.push(row.id);

                this.$confirm('请确认是否删除该学生成绩, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/turnannualresult/deleteuserannualresult', {
                        command: 'turnannualresult/deleteuserannualresult',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        idlist: _turnscoreid,    //成绩id
                    }).then(function (data) {
                        if (data && data.errcode == 0) {
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.inittable(self.pageno, self.pagesize,
                                self.isnewbaseid, self.isnewdepartment,
                                self.queryForm.turnplanid,
                                self.queryForm.peopletype, self.queryForm.yearasment, self.queryForm.qualifiedstate,
                                self.queryForm.queryyear, self.queryForm.inputquery);
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
                let self = this;    //0未开始1进行中2已结束
                self.deletelist = [];
                for (var i = 0; i < item.length; i++) {
                    self.deletelist.push(item[i].id)
                }
            },
            //批量删除
            batchdelete: function () {
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
                    this.$confirm('是否删除选中的学生成绩?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        post('/turnannualresult/deleteuserannualresult', {
                            command: 'turnannualresult/deleteuserannualresult',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                            idlist: self.deletelist, //成绩id
                        }).then(function (data) {
                            if (data && data.errcode == 0) {
                                self.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                self.clearSelect();
                                self.inittable(self.pageno, self.pagesize, '', '', '', '', '', '', '')
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

            //查询全部的轮转计划
            getallturnplanlist: function () {
                let self = this;
                post('/turn/queryPeriodList', {
                    command: 'turn/queryPeriodList',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.turnplanlist = data.period_list;
                    }
                })
            },

            //考核年
            getallexamyearlist: function () {
                let self = this;
                post('/hr/querylevellist', {
                    command: 'hr/querylevellist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    code: 'examyear',   // 考核年
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.yearassessmentlist = data.levellist;

                    }
                })
            },
            //查询考站
            getteststationlist: function () {
                let self = this;
                self.assessmentlist = [];
                post('/hr/querylevellist', {
                    command: 'hr/querylevellist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    code: 'teststation',   // 考站
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.assessmentlist = data.levellist;
                        self.assessmentlist.map((item, index) => {
                            self.selectList[index] = '';       // 考核项
                            self.scoreList[index] = '';     //  分数
                            self.secondscorelist[index] = '';    // 补考分数
                        })
                    }
                })
            },

            //人员类型
            getpeopletypelist() {
                let self = this;
                post('/hr/querylevellist', {
                    command: 'hr/querylevellist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    code: 'stud_type',
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.peopletypelist = data.levellist;
                    }
                })
            },
            //带权限的基地科室和病区
            gethospitaltree: function () {
                var self = this;
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
                        treeidlist.map(item => {
                            self.baseidlist.push(item.id)
                            item.childlist.map(item2 => {
                                self.officeidlist.push(item2.id)
                            })
                        })
                        self.clearSelect();
                    }
                }).catch(function (error) {
                    //console.log(error)
                })
            },
            //清空筛选条件
            clearSelect() {
                this.isnewbaseid = '';
                this.isnewdepartment = '';
                for (let key of Object.keys(this.queryForm)) {
                    this.queryForm[key] = '';
                }
            }
        }
    }
</script>

<style scoped lang="scss">
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
        width: 200px;
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
        text-align: center;
    }

    .import-popup {
        .grade_btn {
            text-align: center;
            margin-bottom: 20px;
        }
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
        width: 85px;
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

    .grade_btn {
        margin-bottom: 30px;
    }

    .demo-ruleForm-grade {
        .el-select {
            width: 230px;
        }
        .el-form-item {
            padding-left: 130px;
        }
    }

    .excelTemplateWrap {
        .excelTemplate {
            width: 450px;
            margin: 0 auto;
            margin-bottom: 10px;
            line-height: 22px;
            >span {
                display: inline-block;
                width: 12px;
                height: 12px;
                border-radius: 50%;
            }
            >p {
                display: inline-block;
                margin-right: 10px;
            }
            font-size:14px;
        }
    }
</style>