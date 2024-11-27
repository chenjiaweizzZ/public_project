<template>
    <div class="wapper">
        <div class="tools" v-if="1">
            <div class="funcTools">
                <el-button type="primary" @click="addresult" v-if="isSignup">添加</el-button>
                <el-button type="primary" @click="dialogTableVisible=true">批量导入</el-button>
                <el-button type="primary" @click="is_export()">批量导出</el-button>
                <!-- <el-button type="primary" @click="batchdelete()">批量删除</el-button> -->
            </div>
        </div>

        <!--批量导入-->
        <el-dialog title="" :visible.sync="dialogTableVisible">
            <div class="import-popup">
                <div>
                    <span class="tip-circle">1</span>
                    <span>下载出科考试成绩模板，批量填写出科考试成绩信息</span>
                    <span>
                        <el-button type="primary" class="import-popup-btn" @click="downloadModel">下载</el-button>
                    </span>
                </div>
                <div>
                    <div>
                        <span class="tip-circle">2</span><span>上传填写好的出科考试成绩表</span>
                    </div>
                    <div>
                        <el-upload style="display:inline-block;margin:10px 40px" action="/import/importExcel" ref="upload" :file-list="fileList"
                            :data="uploadData" :show-file-list="true" :auto-upload="false" :before-upload='checkFile' :on-change="changeFile"
                            :on-success="uploadSuccess" :on-progress="onProgress">
                            <el-button type="primary">选择文件</el-button>
                        </el-upload>
                    </div>
                </div>
                <div style="margin:10px auto;width:60px">
                    <el-button type="primary" @click="submitUpload">上传</el-button>
                </div>
            </div>
        </el-dialog>

        <!--筛选条件-->
        <div class="queryTools">
            <el-form :model="queryForm" :inline="true" ref="queryForm" label-width="70px">
                <div class="queryAll">
                    <el-button type="text" @click="queryAll">全部</el-button>
                </div>
                <hospital-base-dept1 :clearAll="rightNowClear" :hasHospital="hasHospital" @updateSelectIds="setQueryFormOne"></hospital-base-dept1>

                <el-form-item label="计划年级">
                    <el-select filterable v-model="queryForm.turnplanid" placeholder="请选择计划">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item,index) in turnplanlist" :key="item.index" :label="item.period" :value="item.period">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="学员类型">
                    <el-select filterable v-model="queryForm.peopletype" placeholder="请选择计划">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="(item,index) in peopletypelist" :key="item.index" :label="item.name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="轮转结束日期" label-width="100px" style="width: 460px">
                    <el-date-picker v-model="queryForm.examdateArr" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"
                        @change="changeDateTime">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="合格状态">
                    <el-select filterable v-model="queryForm.outdeptstate" placeholder="请选择">
                        <el-option v-for="(item,index) in outdeptstatelist" :key="item.index" :label="item.name" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-input style="width:200px" v-model="queryForm.inputquery" placeholder="请输入姓名或学号" @keyup.enter.native="doSelectQuery"></el-input>
                <el-button class="querybtn" type="primary" @click="doSelectQuery">查询</el-button>
            </el-form>
        </div>

        <!--添加,编辑 弹窗-->
        <el-dialog :title="dialogTitle" :visible.sync="dialogAdd" :close-on-click-modal="false" @close="closeDialog(dialogshow === 1?'addStudentFormRef':'editStudentFormRef')"
            class='dialogAdd selfFommter' custom-class="custom-minwidth">
            <el-form v-if="dialogshow === 1" :model="dialogForm" ref="addStudentFormRef" :rules="rules">
                <el-row :gutter="23">
                    <el-col :span="12">
                        <div class="newandedit custom-form">
                            <el-form-item label="姓名" prop="hospitalnumber">
                                <el-select v-if="dialogshow == 1" v-model="dialogForm.hospitalnumber" filterable remote placeholder="请输入姓名或学号搜索" :remote-method="queryStuByMobile"
                                    @change="setName">
                                    <el-option v-for="(item,index) in stunumoptionlist" :key="index" :label="item.name + '-' + item.code" :value="item.id">
                                    </el-option>
                                </el-select>
                                <div v-if="dialogshow == 2" class="custom-show">
                                    {{showDetail.hospitalnumber}}
                                </div>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="22">
                    <el-col :span="12">
                        <div class="newandedit custom-form">
                            <el-form-item label="出科科室" prop="godept">
                                <el-select v-model="dialogForm.godept" placeholder="请选择" style="width: 100%" v-if="dialogshow == 1" @change="outdeptchange">
                                    <el-option hidden key="id" :value="dialogForm.godept" :label="dialogForm.godeptName" />
                                    <el-tree :data="alldeptofficelist" node-key="id" :check-strictly="true" :expand-on-click-node="true" :props="defaultProps"
                                        @node-click="nodeClick" ref="treeDom" class="selfTree"></el-tree>
                                </el-select>
                                <div v-if="dialogshow == 2" class="custom-show">
                                    {{showDetail.godept}}
                                </div>

                            </el-form-item>

                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="newandedit custom-form">
                            <el-form-item label="出科日期" prop="outdepttime">
                                <el-select filterable v-model="dialogForm.outdepttime" placeholder="请选择出科时间">
                                    <el-option v-for="(item,index) in outdeptlist" :key="index" :label="item" :value="item">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row class="custom-line-parent">
                    <div class="custom-line"></div>
                </el-row>
                <el-row :gutter="22">
                </el-row>
            </el-form>
            <el-form v-if="dialogshow === 2" ref="editStudentFormRef" :model="turnDetailAll">
                <el-row :gutter="23">
                    <el-col :span="12">
                        <div class="newandedit custom-form">
                            <el-form-item label="姓名 :">
                                <div v-if="dialogshow == 2" class="custom-show">
                                    {{showDetail.hospitalnumber}}
                                </div>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="22">
                    <el-col :span="12">
                        <div class="newandedit custom-form">
                            <el-form-item label="出科科室 :">
                                <div class="custom-show">
                                    {{showDetail.godept}}
                                </div>
                            </el-form-item>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="newandedit custom-form">
                            <el-form-item label="出科日期 :">
                                <div class="custom-show">
                                    {{showDetail.outdepttime}}
                                </div>
                            </el-form-item>
                        </div>
                    </el-col>
                </el-row>
                <div>
                    <el-row class="custom-line-parent">
                        <div class="custom-line"></div>
                    </el-row>
                    <el-row :gutter="22">
                        <el-col :span="12">
                            <div class="newandedit custom-form">
                                <el-form-item :label="precentSetting.thoryTitle">
                                    <el-input-number v-model="turnDetailAll.theoryscore" @change="changeScore" :precision="2" :step="1" :min="0"></el-input-number>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="newandedit custom-form">
                                <el-form-item :label="precentSetting.skillTitle">
                                    <el-input-number v-model="turnDetailAll.skillscore" @change="changeScore" :precision="2" :step="1" :min="0"></el-input-number>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="newandedit custom-form">
                                <el-form-item :label="precentSetting.comperTitle">
                                    <el-input-number v-model="turnDetailAll.comprescore" @change="changeScore" :precision="2" :step="1" :min="0"></el-input-number>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="newandedit custom-form">
                                <el-form-item :label="precentSetting.bigCaseTitle">
                                    <el-input-number v-model="turnDetailAll.bigCaseScore" @change="changeScore" :precision="2" :step="1" :min="0"></el-input-number>
                                </el-form-item>
                            </div>
                        </el-col>
                        <el-col :span="12" v-if="precentSetting.scoreConfType == 1">
                            <div class="newandedit custom-form">
                                <el-form-item label="总分">
                                    <el-input v-model="precentSetting.totalScore" disabled>
                                    </el-input>
                                </el-form-item>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-form>

            <el-row :gutter="20" type="flex" justify="end" style="padding-right:27px;padding-top:16px;">
                <el-button v-if="dialogshow === 1" @click="addsave('addStudentFormRef')" type="primary">保存</el-button>
                <el-button v-if="dialogshow === 2" @click="editsave('editStudentFormRef')" type="primary">保存</el-button>
                <el-button @click="dialogAdd = false">取消</el-button>
            </el-row>
        </el-dialog>

        <!-- 查看弹窗 -->
        <el-dialog :title="dialogTitle" size="small" :visible.sync="dialogCheck" :close-on-click-modal="false" class="check-dialog">
            <div class="base-info-box underline">
                <ul>
                    <li>
                        <span>姓名:</span>
                        <span>{{infoDetail.name}}-{{infoDetail.code}}</span>
                    </li>
                </ul>
                <ul>
                    <li>
                        <span>出科科室:</span>
                        <span>{{infoDetail.deptname}}</span>
                    </li>
                    <li>
                        <span>出科日期:</span>
                        <span>{{infoDetail.ckdate}}</span>
                    </li>
                </ul>
            </div>
            <div class="check-table-box underline">
                <div class="check-title">理论成绩</div>
                <div>
                    <el-table :data="theoryScoreData" v-loading="scoreLoading" border tooltip-effect="dark" style="width: 100%">
                        <el-table-column label="成绩" prop="theoryscore" min-width="200"></el-table-column>
                        <el-table-column label="获取日期" prop="examdate" min-width="200"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="check-table-box underline">
                <div class="check-title">技能成绩</div>
                <div class="skill-score-table" v-for="(item, index) in skillScores" :key="index">
                    <el-table :data="[item]" v-loading="scoreLoading" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                        <el-table-column label="考次" prop="enlisttype" min-width="100">
                            <template slot-scope="scope">
                                <span>{{scope.row.enlisttype == 1 ? '首次' : '补考'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="技能平均成绩" prop="score" min-width="100"></el-table-column>
                        <el-table-column v-for="(item2, index2) in item.itemscorelist" :key="index2" :label="item2.examitemname" prop="itemscorelist"
                            min-wdth="150">
                            <span>{{item2.score}}</span>
                        </el-table-column>
                        <el-table-column label="评分日期" prop="gradedate" min-width="120"></el-table-column>
                    </el-table>
                    <el-table :data="item.itemGradeScoreList" v-loading="scoreLoading" border tooltip-effect="dark" style="width: 100%;">
                        <el-table-column label="考官" prop="examinername" min-width="200">
                            <template slot-scope="scope">
                                <span>{{scope.row.examinername}}({{scope.row.examinercode}})</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="考核项目" prop="examitemname" min-width="200"></el-table-column>
                        <el-table-column label="成绩" prop="score" min-width="200"></el-table-column>
                        <el-table-column label="评分表" prop="status" min-width="100">
                            <template slot-scope="scope">
                                <span @click="queryScoreSheet(scope.row)" :class="scope.row.status == 1 ? 'tip': ''">{{scope.row.status
                                    == 1 ? '查看' : '未评'}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="check-table-box underline">
                <div class="check-title">综合成绩</div>
                <div class="skill-score-table" v-for="(item, index) in compreScores" :key="index">
                    <el-table :data="[item]" v-loading="scoreLoading" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                        <el-table-column label="考次" prop="enlisttype" min-width="100">
                            <template slot-scope="scope">
                                <span>{{scope.row.enlisttype == 1 ? '首次' : '补考'}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column v-for="(item2, index2) in item.itemscorelist" :key="index2" :label="item2.examitemname" prop="itemscorelist"
                            min-width="120">
                            <span>{{item2.score}}</span>
                        </el-table-column>
                        <el-table-column label="评分日期" prop="gradedate" min-width="150"></el-table-column>
                    </el-table>
                    <el-table :data="item.itemGradeScoreList" v-loading="scoreLoading" border tooltip-effect="dark" style="width: 100%;">
                        <el-table-column label="考官" prop="examinername" min-width="200">
                            <template slot-scope="scope">
                                <span>{{scope.row.examinername}}({{scope.row.examinercode}})</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="考核项目" prop="examitemname" min-width="200"></el-table-column>
                        <el-table-column label="成绩" prop="score" min-width="200"></el-table-column>
                        <el-table-column label="评分表" prop="status" min-width="100">
                            <template slot-scope="scope">
                                <span @click="queryScoreSheet(scope.row)" :class="scope.row.status == 1 ? 'tip': ''">{{scope.row.status
                                    == 1 ? '查看' : '未评'}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div>
                    <el-table :data="comprescoreTemp" v-if="comprescoreTemp.length > 0" v-loading="scoreLoading" border tooltip-effect="dark"
                        style="width: 100%">
                        <el-table-column label="考次" prop="examTimes" min-width="200"></el-table-column>
                        <el-table-column label="成绩" prop="comprescore" min-width="200"></el-table-column>
                        <el-table-column label="报名日期" prop="examdate" min-width="200"></el-table-column>
                    </el-table>
                </div>
            </div>
            <div class="check-table-box underline">
                <div class="check-title">病历书写</div>
                <div class="skill-score-table" v-if="bigCaseScore.score != ''">
                    <el-table :data="[bigCaseScore]" v-loading="scoreLoading" border tooltip-effect="dark" style="width: 100%; margin-bottom: 20px;">
                        <el-table-column label="成绩" prop="score" min-width="200"></el-table-column>
                        <el-table-column label="评分日期" prop="submitTime" min-width="200"></el-table-column>
                        <el-table-column label="评分表" prop="status" min-width="100">
                            <template slot-scope="scope">
                                <!-- <span :class="scope.row.status == 1 ? 'tip': ''">{{scope.row.status == 1 ? '' : '未评'}}</span> -->
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-dialog>
        <el-dialog title="预览" :visible.sync="showPreview" width="80%" class="selfComp">
            <scoring-table :id="previewId" :isAnswer="isAnswer" :needHeader="needHeader"></scoring-table>
        </el-dialog>
        <!-- 评分表 -->
        <el-dialog :title="scoreSheetTitle" :visible.sync="dialogScoreSheet" size="small">
            <el-table :data="scoreItem" style="width:100%;" border>
                <el-table-column label="评分项" prop="opstepcontent" min-width="200"></el-table-column>
                <el-table-column label="评分细则" prop="rightoperation" min-width="340"></el-table-column>
                <el-table-column label="分数" prop="score" min-width="60"></el-table-column>
            </el-table>
            <div class="teacher-info" v-if="scoreItem.length > 0">
                <div class="comment-box">
                    <div class="comment">评语:</div>
                    <div class="comment-content">{{comment}}</div>
                </div>
                <div class="signature-box">
                    <div class="comment">考官签名:</div>
                    <img :src="signature" />
                </div>
            </div>
        </el-dialog>

        <div class="dataTable">
            <el-table ref="detailTable" :data="rateList" border tooltip-effect="dark" style="width: 100%" v-loading="loading" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="45"></el-table-column>
                <!--<el-table-column type ="index" width = "50" label = "序号" ></el-table-column>-->
                <el-table-column prop="name" fixed="left" width="120" label="姓名">
                    <template slot-scope="scope">
                        <div class="actionplansty">
                            <el-tooltip effect="light" popper-class="zy-limit-width" :content="scope.row.name" placement="top">
                                <el-button type="text" size="small" @click="personalDetail(scope.$index, scope.row)">{{scope.row.name}}</el-button>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="code" width="110" label="学号"></el-table-column>
                <el-table-column prop="stdtype" width="110" label="学员类型">
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
                <el-table-column prop="sex" label="性别"></el-table-column>
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
                <el-table-column prop="mobile" width="110" label="手机号码"></el-table-column>
                <el-table-column prop="turngrade" label="年级"></el-table-column>
                <el-table-column prop="deptname" width="120" label="出科科室">
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
                <el-table-column prop="techName" width="110" label="带教老师"></el-table-column>
                <el-table-column width="200" label="轮转周期">
                    <template slot-scope="scope">
                        {{scope.row.rkdate}}-{{scope.row.ckdate}}
                    </template>
                </el-table-column>
                <el-table-column prop="planturngrade" width="110" label="计划年级"></el-table-column>
                <el-table-column prop="theoryscore" width="110" label="理论成绩">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showHistory(scope.row,3)">{{scope.row.theoryscore}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="skillscore" width="110" label="技能考试成绩">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.skillscore >= 0" @click="showHistory(scope.row,1)">{{scope.row.skillscore}}</el-button>
                        <span v-else>缺考</span>
                    </template>
                </el-table-column>
                <el-table-column prop="comprescore" width="110" label="出科综合成绩">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.comprescore >= 0" @click="showHistory(scope.row,2)">{{scope.row.comprescore}}</el-button>
                        <span v-else>缺考</span>
                    </template>
                </el-table-column>
                <el-table-column prop="bigCaseScore" width="110" label="病历书写成绩">
                    <template slot-scope="scope">
                        <el-button type="text" @click="showHistory(scope.row,4)">{{scope.row.bigCaseScore}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="scoreSum" width="110" label="总分">
                    <template slot-scope="scope">
                        <span v-if="scope.row.scoreType == 1">{{scope.row.scoreSum}}</span>
                        <span v-else>——</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ckstatusStr" width="110" label="合格状态"></el-table-column>
                <el-table-column fixed="right" width="140" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="edit(scope.$index, scope.row)" type="text" size="small">编辑</el-button>
                        <!-- <el-button @click="check(scope.$index, scope.row)" type="text" size="small">查看</el-button> -->
                        <!-- <el-button @click="singledelete(scope.$index, scope.row)" type="text" size="small">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination style="float:right;margin:10px 10px" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                :current-page="pageno" :page-sizes="[10, 20, 50, 100]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
                :total="totalCount">
            </el-pagination>
        </div>
        <case-history :currentRow="currentRow" :showCaseHistory="showCaseHistory" :scoreType="scoreType" @closeHistory="closeHistory"></case-history>

        <!-- 个人档案 -->
        <student-personal-Info :studentDetailId="studentDetailId" :dialogRecords.sync="dialogRecords"></student-personal-Info>
    </div>
</template>
<script>
    import studentPersonalInfo from "../../components/studentPersonalInfo.vue"
    import caseHistory from "../../components/caseHistory.vue"
    import { post, getCookie, exportMouldExcel, exportExcel, filterEmpty, showErrorImport, getStorage } from '../../config/util'
    import moment from 'moment'
    import { mapState, mapActions } from 'vuex'
    import hospitalBaseDept1 from "../../components/hospitalBaseDept1"
    var _ = require('lodash');
    import scoringTable from "../../components/scoringTable.vue"

    export default {
        data() {
            let someRules = (option, txt, type) => (rule, value, callback) => {
                if (!value) {
                    callback(new Error(`请${option}${txt}!`));
                } else if (typeof value !== 'object' && type === '数字' && isNaN(Number(value))) {
                    callback(new Error(`请${option}${type}!`));
                }
                else {
                    callback();
                }
            };
            let someRules2 = (rule, value, callback) => {
                if (value && isNaN(Number(value))) {
                    callback(new Error('请输入数字！'))
                }
                else {
                    callback();
                }
            };
            let commonOption = [{ required: true, validator: someRules('选择', '该必选项', '文本'), trigger: 'blur,change' }];
            let commonNum = [{ required: true, validator: someRules('输入', '分数', '数字'), trigger: 'blur,change' }];
            let commonNum2 = [{ validator: someRules2, trigger: 'blur,change' }];
            return {
                currentRow: {},
                scoreType: 0,
                showCaseHistory: false,
                bigCaseScore: {
                    score: "",
                    submitTime: ""
                },
                showPreview: false,
                previewId: "",
                isAnswer: true,
                needHeader: true,
                hasHospital: false,
                defaultProps: {
                    label: 'name',
                    children: 'childrens'
                },
                rightNowClear: 0,
                dialogRecords: false,
                studentDetailId: "",
                fileList: [],
                hasFile: false,
                dialogTableVisible: false,
                uploadData: {
                    _upload_data: JSON.stringify({
                        "1": {
                            command: 'turnscore/importturnscorelist',
                            sessionid: getCookie('sid'),
                            loginid: getCookie('uid'),
                        }
                    })
                },
                dialogTitle: '',
                dialogAdd: false,

                hospitalnumber: '',
                name: '',
                nameid: '',//提交的学生id
                alldeptofficelist: [],
                deptofficeid: '',
                areaid: '',
                outdepttime: '',//出科日期
                examinationtime: '',//考试日期
                theoreticalscore: '',//理论成绩
                skillscore: '',//技能成绩
                comprehensivescore: '',//综合成绩
                dialogoutdeptstate: '',
                editflag: true,
                editid: '',
                editdeptofficeid: '',//编辑的科室id
                editareaid: '',//编辑的病区id

                dialogshow: '',//1增加；2编辑
                isaddoredit: false,
                stunumoptionlist: [],//学号列表
                stunumoptioneditlist: [], //编辑学号列表
                editdeptoffice: {
                    deptname: '',
                    id: ''
                },
                //  缺考，报名未考，合格，不合格，补考合格，补考不合格  分别对应 0，1,2,3,4,5
                outdeptstatelist: [		//出科状态
                    { name: '全部', value: '', },
                    { name: '成绩未录', value: 1, },
                    { name: '合格', value: 2, },
                    { name: '不合格', value: 3, },
                    { name: '补考合格', value: 4, },
                    { name: '补考不合格', value: 5, },
                ],
                queryForm: {
                    hospitalIdForBase: "",
                    hospitalId: "",
                    newbaseid: '',
                    startime: '',
                    endtime: '',
                    outdeptstate: '',
                    inputquery: '',
                    deptid: '',
                    turnplanid: '',
                    peopletype: '',
                    examstartdate: '',
                    examdateArr: [],
                    examenddate: '',
                },
                //全部
                isnewbaseid: '',
                isnewdepartment: '',
                isnewarea: '',

                officeidlist: [],
                areaidlist: [],

                newroomList: [],
                newdeptList: [],
                newareaList: [],

                deletelist: [],//批量删除

                arealist: [],
                rateList: [],
                pageno: 1,
                pagesize: 10,
                totalCount: 0,

                //2018-04-26
                make_up: {
                    status: 1,
                    theory: 1,
                    skill: 1,
                    multiple: 1,
                },
                dialogForm: {
                    examitemtype: '',
                    hospitalnumber: '',
                    deptofficeid: '',
                    godept: '',
                    outdepttime: '',//出科日期
                    outStart: '',
                    outEnd: '',
                    theoreticalscore: '',
                    skillscore: '',
                    bigCaseScore: "",
                    comprehensivescore: '',
                    examinationtime: '',//报名日期
                    examinationTimeStr: '',
                    exam_theory: '',
                    exam_skill: '',
                    exam_multiple: '',
                    exam_time: '',//补考如期
                    exam_timeStr: '',
                },
                rules: {
                    hospitalnumber: commonOption,
                    //    deptofficeid:commonOption,
                    godept: commonOption,
                    outdepttime: commonOption,
                    theoreticalscore: commonNum2,
                    skillscore: commonNum2,
                    comprehensivescore: commonNum2,
                    examinationtime: commonOption,
                    exam_theory: commonNum,
                    exam_skill: commonNum,
                    exam_multiple: commonNum,
                    exam_time: commonOption,
                },
                ports: {
                    addturnscore: '/turnscore/addturnscore',
                    updateturnscore: "/turnscore/updateturnscore",
                    ckdate: '/turnscore/getckdate',
                },
                showDetail: {
                    hospitalnumber: '',
                    deptoffice: '',
                    outdepttime: '',
                    godept: '',
                },
                turnscorelist: {
                    theoryscore: '',
                    skillscore: '',
                    comprescore: '',
                    examdate: '',
                },
                turnDetailAll: {
                    bigCaseScore: "",
                    theoryscore: "",
                    turnscoredetaillist: [],
                    turnscoreid: '',
                    skillscore: "",
                    comprescore: ""
                },
                editDialogForm: {},
                editRules: [
                    { type: 'number', message: '分数必须为数字值', trigger: 'blur,change' }
                ],
                turnplanlist: [],//轮转年级
                peopletypelist: [],//学员类型
                outdeptlist: [],
                loading: false,

                // 2019-05-27
                scoreLoading: false,
                // 查看弹窗
                dialogCheck: false,
                // 个人信息
                infoDetail: '',
                // old 老成绩展示
                skillScoresTemp: [],
                comprescoreTemp: [],
                // 理论成绩
                theoryScoreData: [],
                // 技能成绩
                skillScores: [],
                // 综合成绩
                compreScores: [],
                // 评分表
                scoreItem: [],
                dialogScoreSheet: false,
                // 查看评分表标题
                scoreSheetTitle: '',
                // 评语
                comment: '',
                // 签名
                signature: '',
                missExam: '缺考',
                menuId: "",
                isSignup: true,
                precentSetting: {
                    thoryTitle: "理论成绩：",
                    skillTitle: "技能成绩：",
                    comperTitle: "综合成绩：",
                    bigCaseTitle: "病历书写：",
                    totalScore: 0,
                }
            }
        },
        computed: {
        },
        created() {
            this.menuId = getStorage("menuId")
            this.queryForm.examdateArr = [moment(new Date()).startOf("month").format("YYYY-MM-DD"), moment(new Date()).endOf("month").format("YYYY-MM-DD")];
            this.signupJudge()
        },
        mounted() {
            this.inittable(self.pageno, self.pagesize, '', '', '', '', '', '', '');
            this.getallturnplanlist();//轮转年级
            this.getpeopletypelist();//学员类型
        },
        components: {
            studentPersonalInfo,
            hospitalBaseDept1,
            caseHistory
        },
        methods: {
            closeHistory() {
                this.showCaseHistory = false
            },
            showHistory(row, type) {
                this.scoreType = type
                this.currentRow = row
                this.showCaseHistory = true
            },
            changeScore() {
                if (this.precentSetting.scoreConfType == 2) {
                    return false;
                }
                let total = 0
                total = Number(this.precentSetting.theoryScoreProportion) * Number(this.turnDetailAll.theoryscore)
                total = total + Number(this.precentSetting.skillScoreProportion) * Number(this.turnDetailAll.skillscore)
                total = total + Number(this.precentSetting.compreScoreProportion) * Number(this.turnDetailAll.comprescore)
                total = total + Number(this.precentSetting.bigCaseScoreProportion) * Number(this.turnDetailAll.bigCaseScore)
                this.precentSetting.totalScore = total.toFixed(2)
            },
            getPrecentSetting(id) {
                post(`/base/turnscoreconf/getLatestConf?deptId=${id}`).then(res => {
                    if (res && res.resCode == 200) {
                        this.precentSetting = {
                            ...res.model,
                            ...this.precentSetting
                        }
                        if (res.model.scoreConfType == 1) {
                            // 按比例
                            this.precentSetting.thoryTitle = `理论成绩（${res.model.theoryScoreProportion * 100}%）`
                            this.precentSetting.skillTitle = `技能成绩（${res.model.skillScoreProportion * 100}%）`
                            this.precentSetting.comperTitle = `综合成绩（${res.model.compreScoreProportion * 100}%）`
                            this.precentSetting.bigCaseTitle = `病历书写（${res.model.bigCaseScoreProportion * 100}%）`
                            this.precentSetting.theoryScoreProportion = res.model.theoryScoreProportion
                            this.precentSetting.skillScoreProportion = res.model.skillScoreProportion
                            this.precentSetting.bigCaseScoreProportion = res.model.bigCaseScoreProportion
                            this.precentSetting.compreScoreProportion = res.model.compreScoreProportion
                            this.changeScore()
                        }

                    }
                })
            },
            signupJudge() {
                post('/commparaconf/queryCommparaConfList', {
                    command: "commparaconf/queryCommparaConfList",
                    sessionid: getCookie("sid"),
                    loginid: getCookie("uid"),
                    paramcode: 'ck_settings'
                }).then(data => {
                    if (data && data.errcode == "0") {
                        if (data.commparaConfList.length > 0) {
                            data.commparaConfList.forEach(item => {
                                if (item.paramvalue == 8) {
                                    this.isSignup = Number(item.param1)
                                }
                            })

                        }
                    }
                })
            },
            setQueryFormOne(form) {
                // this.queryForm.hospitalId = form.hospitalId
                // this.queryForm.newbaseid = form.baseId
                // this.queryForm.deptid = form.deptId

                if (form.hospitalIdForBase == "") {
                    this.queryForm.newbaseid = form.baseId
                    this.queryForm.hospitalIdForBase = ""
                } else {
                    this.queryForm.newbaseid = ""
                    this.queryForm.hospitalIdForBase = form.hospitalIdForBase
                }
                if (form.hospitalId == "") {
                    this.queryForm.hospitalId = ""
                    this.queryForm.deptid = form.deptId
                } else {
                    this.queryForm.hospitalId = form.hospitalId
                    this.queryForm.deptid = ""
                }
            },
            nodeClick1(node) {
                if (node.deptlevel == 1 || node.deptlevel == 2) {
                    return false;
                }
                this.dialogForm.deptofficeid = node.id
                this.dialogForm.deptofficeidName = node.name
            },
            nodeClick(node) {
                if (node.deptlevel == 1 || node.deptlevel == 2) {
                    return false;
                }
                this.dialogForm.godept = node.id
                this.dialogForm.godeptName = node.name
                this.checkTime()
            },
            personalDetail(index, row) {
                this.dialogRecords = true;
                this.studentDetailId = row.uid
            },
            changeInput(ele, i) {
                this.turnDetailAll[ele] = this.$refs[ele][0].currentValue
            },
            //2018-04-26
            //封装请求
            ...mapActions(['showErrorImport']),
            _ajax(port, option) {
                port = this.ports[port];
                return post(port, {
                    command: port.substr(1),
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    ...option,
                })
            },
            _alert(message = '成功', type = 'success') {
                this.$message({
                    type,
                    message,
                    showClose: true,
                })
            },
            changeDateTime(val) {
                if (val == undefined || val == null) {
                    this.queryForm.examdateArr = []
                }
                if (val.length > 1) {
                    this.queryForm.examdateArr[0] = moment(new Date(val[0])).format("YYYY-MM-DD")
                    this.queryForm.examdateArr[1] = moment(new Date(val[1])).format("YYYY-MM-DD")
                }
            },
            handleTime(time) {
                this.dialogForm.examinationtime = time;
            },
            //得到下拉出科时间
            getCKDate(option) {
                let port = '/turnscore/getckdate';
                this._ajax('ckdate', option).then((data) => {
                    this.outdeptlist = [];
                    this.dialogForm.outdepttime = '';
                    let type = 'warning';
                    let message = '';
                    if (data && data.errcode == 0) {
                        this.outdeptlist = data.ckdate;
                        type = 'success';
                        message = '已搜索到' + data.ckdate.length + '条出科时间记录';
                    } else if (data.errcode == 400003) {
                        message = '该学生在此科室下没有轮转计划，不能添加成绩！';
                    }
                    this.$message({
                        showClose: true,
                        message,
                        type
                    })
                })
            },
            //验证获取出科时间的
            checkTime() {
                let uid = this.dialogForm.hospitalnumber;
                let deptid = this.dialogForm.godept;
                if (uid && deptid) {
                    //发送请求
                    this.getCKDate({ uid, deptid });
                }
            },
            //表单验证
            validateForm(form) {
                let result = false;
                this.$refs[form].validate(valid => {
                    if (valid) result = true;
                });
                return result;
            },

            //新增 点击保存
            addsave: function (form) {				//增加保存按钮
                let self = this;
                if (this.validateForm(form)) {
                    this.dialogAdd = false;
                    post('/turnscore/addturnscore', {
                        command: 'turnscore/addturnscore',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        uid: self.nameid,
                        deptid: self.dialogForm.godept,//出科科室
                        ckdate: self.dialogForm.outdepttime,//出科日期
                        turndeptid: self.dialogForm.deptofficeid,//轮转科室
                        examdate: self.dialogForm.examinationtime,//考试日期
                        theoryscore: self.dialogForm.theoreticalscore,//理论成绩
                        skillscore: self.dialogForm.skillscore,//技能成绩
                        bigCaseScore: self.dialogForm.bigCaseScore,//病历书写成绩
                        comprescore: self.dialogForm.comprehensivescore,//综合成绩
                    }).then(function (data) {
                        if (data && data.errcode == 0) {
                            self.$message({
                                message: '添加成功',
                                type: 'success'
                            });
                            self.inittable(self.pageno, self.pagesize, '', '', '', '', '', '');
                            self.dialogAdd = false;
                        } else if (data && data.errcode == 400001) {
                            self.$message({
                                message: '该学生成绩已存在',
                                type: 'warning'
                            });

                        } else if (data && data.errcode == 400002) {
                            self.$message({
                                message: '该学生关联轮转计划错误',
                                type: 'warning'
                            });


                        } else if (data && data.errcode == 400003) {
                            // self.$message({
                            //     message: data.errdesc,
                            //     type: 'success'
                            // });
                            self.$message({
                                message: data.errdesc,
                                type: 'warning'
                            });
                        } else if (data && data.errcode == 400004) {
                            self.$message({
                                message: '该学生关联轮转计划成绩已存在',
                                type: 'warning'
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
                } else {
                    self.$message({
                        message: '必填项未填写或填写错误！！',
                        type: 'error'
                    });
                }
            },

            //带权限的基地科室和病区
            // gethospitaltree: function () {
            //     let self = this;
            //     self.alldeptofficelist = [];
            //     post('/turnbaseinfo/getusermanagerdepttree', {
            //         command: 'turnbaseinfo/getusermanagerdepttree',
            //         sessionid: getCookie('sid'),
            //         loginid: getCookie('uid'),
            //         uid: getCookie('uid'),
            //     }).then(function (data) {
            //         if (data && data.errcode == 0) {
            //             self.newroomList = data.depttree.childlist
            //             self.inittable(self.pageno, self.pagesize, '', '', '', '', '', '', '');
            //         }
            //     }).catch(function (error) {
            //         //console.log(error)
            //     })
            // },

            outdeptchange() {
                this.checkTime();
            },

            submitUpload() {				//导入
                if (!this.hasFile) {
                    this.$message({
                        showClose: true,
                        message: '请先选择上传的Excel文件！',
                        type: 'warning'
                    });
                }
                this.$refs.upload.submit();
            },
            downloadModel: function () {		//下载导入模板
                let data = {
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    command: "turnscore/turnscoremould",
                };
                exportMouldExcel(data);
            },

            changeFile(file, list) {		//文件状态改变
                if (list.length > 1) {
                    list.shift();
                }
                if (list.length > 0) {
                    this.hasFile = true;
                }
            },
            submitUpload() {						//上传按钮
                if (!this.hasFile) {
                    this.$message({
                        showClose: true,
                        message: '请先选择上传的Excel文件！',
                        type: 'warning'
                    });
                }
                this.$refs.upload.submit();
            },
            checkFile(file) {			//上传文件之前 限制文件类型
                const isExcel = (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') || file.type === 'application/vnd.ms-excel';

                if (!isExcel) {
                    this.$message.error('请上传.xls或.xlsx格式的Excel文件！');
                }
                this.hasFile = false;
                return isExcel;
            },
            uploadSuccess(res) {					//上传成功
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
                this.$loading().close();
            },
            onProgress() {			//文件上传时-显示进度条
                this.$loading();
            },

            is_export: function () {			//导出
                let self = this;
                let data = {
                    command: 'turnscore/queryturnscorelist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    base: self.queryForm.newbaseid,
                    ckstartdate: self.queryForm.startime,
                    ckenddate: self.queryForm.endtime,
                    ckstatus: self.queryForm.outdeptstate,//合格状态
                    searchinfo: self.queryForm.inputquery,
                    deptid: self.queryForm.deptid,
                    planturngrade: self.queryForm.turnplanid,//计划年级
                    stdtype: self.queryForm.peopletype,//学员类型
                    examstartdate: self.queryForm.examdateArr.length > 1 ? self.queryForm.examdateArr[0] : "",    //报名开始日期
                    examenddate: self.queryForm.examdateArr.length > 1 ? self.queryForm.examdateArr[1] : ""    //报名结束日期,
                };
                exportExcel(data);
            },
            addresult: function () {			//增加成绩
                let self = this;
                self.dialogTitle = '添加';
                self.dialogshow = 1;
                self.dialogForm.hospitalnumber = '';
                self.name = '';
                this.dialogForm.deptofficeid = ""
                self.dialogForm.deptofficeid = '';
                self.arealist = [];
                self.areaid = '';
                self.outdepttime = '';//出科日期
                self.examinationtime = '';//考试日期
                self.dialogForm.theoreticalscore = '';//理论成绩
                self.dialogForm.skillscore = '';//技能成绩
                self.dialogForm.bigCaseScore = '';//技能成绩
                self.dialogForm.comprehensivescore = '';//综合成绩
                self.dialogoutdeptstate = '';
                self.stunumoptionlist = [];
                self.alldeptofficelist = [];
                self.dialogForm.godept = "";
                self.dialogForm.godeptName = "";
                self.outdeptlist = [];
                self.dialogAdd = true;
                self.editflag = true;
                self.showDetail.godept = ""
            },
            queryStuByMobile(query) {		//学号改变  查询学号列表
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
                            systemtype: 2, //2住院医3实习生
                        }).then(function (data) {
                            if (data && data.errcode == 0) {
                                self.stunumoptionlist = data.studentlist;
                            }
                        })
                    }, 200);
                } else {

                }
            },
            setName(val) {
                console.log(val)
                this.checkTime();
                this.stunumoptionlist.forEach((item) => {
                    if (item.id === val) {
                        this.name = item.name;
                        this.nameid = item.id;
                        this.getturndept(item.id)
                    }
                });
            },

            //已经轮转和正在轮转的科室
            getturndept(studentid) {
                this.alldeptofficelist = [];
                post('/base/dept/getMyDeptTree', {
                    menusId: this.menuId,
                    showHospital: 1,
                    showNoDeptHospital: 0,
                }).then((data) => {
                    if (data && data.resCode == 200) {
                        this.alldeptofficelist = data.model;
                    }
                }).catch(function (error) {
                    //console.log(error)
                })
            },

            closeDialog(formName) {
                try {
                    this.$refs[formName].resetFields();
                } catch (e) {

                }
            },

            queryAll: function () {
                let self = this;
                self.queryForm.hospitalId = '';
                self.queryForm.newbaseid = '';
                self.queryForm.startime = '';
                self.queryForm.outdeptstate = '';
                self.queryForm.endtime = '';
                self.queryForm.examstartdate = '',
                    self.queryForm.examenddate = '',
                    self.queryForm.inputquery = '';
                self.queryForm.deptid = '';
                self.queryForm.turnplanid = '';
                self.queryForm.peopletype = '';
                self.pageno = 1;
                this.rightNowClear = this.rightNowClear + 1
                self.inittable(self.pageno, self.pagesize, '', '', '', '', '', '', '');
            },

            inittable: function (pageno, pagesize, base, startime, endtime, examstartdate, examenddate, outdeptstate, inputquery) {
                let self = this;
                if (this.usePage) {
                    pageno = this.pageno;
                } else {
                    // pageno=this.pageno=1;
                    pageno = this.pageno;
                }
                self.loading = true;
                return post('/turnscore/queryturnscorelist', {
                    command: 'turnscore/queryturnscorelist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    pagenum: pageno,
                    pagepersize: self.pagesize,
                    hospitalId: this.queryForm.hospitalId,
                    base: this.queryForm.newbaseid,
                    ckstartdate: startime,
                    ckenddate: endtime,
                    ckstatus: outdeptstate,//出科状态
                    searchinfo: inputquery,
                    examstartdate: self.queryForm.examdateArr.length > 1 ? self.queryForm.examdateArr[0] : "",    //报名开始日期
                    examenddate: self.queryForm.examdateArr.length > 1 ? self.queryForm.examdateArr[1] : "",    //报名结束日期,
                    deptid: self.queryForm.deptid,//科室
                    stdtype: self.queryForm.peopletype,//人员类型
                    planturngrade: self.queryForm.turnplanid,//轮转年级
                    hospitalIdForBase: self.queryForm.hospitalIdForBase
                }).then(function (data) {
                    self.loading = false;
                    if (data && data.errcode == 0) {
                        self.rateList = data.turnscorelist;//trunscorelist;
                        self.totalCount = data.totalcount;
                        self.isaddoredit = false;
                    } else {
                        self.rateList = [];//trunscorelist;
                        self.totalCount = 0;
                        self.isaddoredit = false;
                    }
                    self.usePage = false;
                }).catch(function (error) {
                    self.loading = false;
                    //console.log(error)
                })
            },

            getStr(index, str) {
                return 'turnscoredetaillist[' + index + '].' + str;
            },

            // 2019-05-27
            // 查看
            check(index, row) {
                console.log(row)
                this.skillScoresTemp = [];
                this.comprescoreTemp = [];
                // 理论
                this.theoryScoreData = [];
                // 技能
                this.skillScores = [];
                // 综合
                this.compreScores = [];

                this.infoDetail = row;
                this.dialogCheck = true;
                this.dialogTitle = '查看';

                // 考试场数
                let seiid = '';

                let data = _.uniqBy(row.turnscoredetaillist, 'examid');
                this.getBigCaseScore(row.turnscoreid)
                data.map((item, index) => {
                    // 首次, 补考
                    item.examTimes = index == 0 ? '首次' : '补考';
                    // 理论成绩
                    console.log(item)
                    if (item.examtype == 0 || item.examtype == 1) {
                        item.theoryscore = row.theoryscore
                        item.examdate = row.examdate
                        this.theoryScoreData.push(item);
                    }

                    // 兼容以前的成绩展示 通过 turnexamid 判断 0全部 1理论 2技能 3综合 
                    // 通过时间戳判断 6月前显示以前成绩(按理论成绩模式显示)
                    var time = new Date(item.examdate).getTime();
                    if (item.turnexamid == null && time < 1559318400000) {
                        this.skillScoresTemp.push(item);
                    }

                    if (item.turnexamid == null && time < 1559318400000) {
                        this.comprescoreTemp.push(item);
                    }

                    // 出科考核学生 seiid  补考一次seiid变一次,查一下成绩
                    seiid = item.examid;
                    // 查看技能成绩
                    post('/turnExamInfo/querystuscorebyseiid', {
                        command: 'turnExamInfo/querystuscorebyseiid',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        seiid: seiid
                    }).then((data) => {
                        if (data && data.errcode == 0) {
                            data.stuscores.forEach((item) => {
                                // 技能 1
                                if (item.examtype == 1) {
                                    this.skillScores.push(item);
                                }
                                // 综合 2
                                if (item.examtype == 2) {
                                    this.compreScores.push(item);
                                }
                            });
                        }
                    }).catch(function (error) {
                    })

                });
            },
            getBigCaseScore(seiid) {
                post(`/base/turnscoredetail/getBigCaseScore?turnScoreId=${seiid}`).then(res => {
                    if (res && res.resCode == 200) {
                        this.bigCaseScore = {
                            score: res.model == null ? "" : res.model.score,
                            submitTime: res.model == null ? "" : res.model.submitTime
                        }
                    }
                })
            },

            // 查看评分表
            queryScoreSheet(val) {
                // 查看评分表
                if (val.status == 1) {
                    this.scoreItem = [];
                    post('/turnExamInfo/queryturnexamscore', {
                        command: 'turnExamInfo/queryturnexamscore',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        turnexamscoreid: val.turnexamscoreid
                    }).then((data) => {
                        if (data && data.errcode == 0) {
                            this.dialogScoreSheet = true;
                            if (data.itemlist) {
                                data.itemlist.forEach((item, index) => {
                                    item.value.map(val => {
                                        this.scoreItem.push(val);
                                    })
                                });
                            }
                            // 标题 评语 签名 
                            this.scoreSheetTitle = this.infoDetail.name + val.examitemname + '的考核详情';
                            this.comment = val.comment;
                            this.signature = val.signature;
                        }
                    }).catch((error) => {

                    })
                }
            },

            /*编辑区*/
            edit: function (index, rowOld) {
                this.handleCurrentChange(this.pageno).then(() => {
                    if (!this.rateList || this.rateList.length == 0) {
                        return;
                    }
                    let row = this.rateList[index];
                    this.showDetail.godept = row.deptname;//出科科室
                    this.showDetail.deptoffice = row.turndeptname;	//轮转科室
                    this.showDetail.hospitalnumber = row.name + ' - ' + row.code;//姓名学号
                    if (row.ckdate) {
                        this.showDetail.outdepttime = row.ckdate;//轮转时间段
                    } else {
                        this.showDetail.outdepttime = '';
                    }
                    //赋值给编辑对话框
                    let arr = [...row.turnscoredetaillist];
                    let arr2 = JSON.parse(JSON.stringify(arr));
                    // for(let i=0,len=arr2.length;i<len;i++){
                    //     arr2[i].theoryscore &&  (arr2[i].theoryscore=parseFloat(arr2[i].theoryscore));
                    //     arr2[i].skillscore && (arr2[i].skillscore=parseFloat(arr2[i].skillscore));
                    //     arr2[i].comprescore && (arr2[i].comprescore=parseFloat(arr2[i].comprescore));
                    // }
                    this.turnDetailAll.turnscoredetaillist = arr2;
                    this.turnDetailAll.turnscoreid = row.turnscoreid;
                    this.turnDetailAll.bigCaseScore = row.bigCaseScore;
                    this.turnDetailAll.skillscore = row.skillscore;
                    this.turnDetailAll.theoryscore = row.theoryscore;
                    this.turnDetailAll.comprescore = row.comprescore;
                    this.dialogAdd = true;
                    this.dialogshow = 2;
                    this.dialogTitle = '编辑';
                    this.getPrecentSetting(this.rateList[index].deptid)
                });

            },
            //编辑区保存按钮
            editsave(form) {
                this.$refs[form].validate(bool => {
                    let type = 'error', message = '验证失败，必填项未填写或填写错误！';
                    if (bool) {
                        let source = this.turnDetailAll;
                        let detail = source.turnscoredetaillist;
                        let option = {};
                        source.turnscoreid && (option.turnscoreid = source.turnscoreid);
                        source.id && (option.id = source.id);
                        post('/base/turnscore/editTurnScore', {
                            id: source.turnscoreid,
                            bigCaseScore: source.bigCaseScore,
                            compreScore: source.comprescore,
                            skillScore: source.skillscore,
                            theoryScore: source.theoryscore,
                        }).then(data => {
                            if (data && data.resCode == 200) {
                                message = '编辑成功！';
                                type = 'success';
                                this.dialogAdd = false;
                                let self = this;
                                this.usePage = true;
                                this.inittable(self.pageno, self.pagesize,
                                    self.queryForm.newbaseid,
                                    self.queryForm.startime, self.queryForm.endtime,
                                    self.queryForm.examstartdate, self.queryForm.examenddate,
                                    self.queryForm.outdeptstate,
                                    self.queryForm.inputquery)
                            } else {
                                message = data.errdesc ? data.errdesc : '编辑失败！';
                                type = 'error';
                            }
                            this.$message({
                                message,
                                type,
                            });
                        })
                    } else {
                        this.$message({
                            message,
                            type,
                        });
                    }
                })
            },
            /*分页区*/
            handleSizeChange(size) {
                this.pagesize = size;
                this.inittable(this.pageno, this.pagesize, this.queryForm.newbaseid,
                    this.queryForm.startime, this.queryForm.endtime,
                    this.queryForm.examstartdate, this.queryForm.examenddate,
                    this.queryForm.outdeptstate,
                    this.queryForm.inputquery);
            },
            handleCurrentChange(currentPage) {
                this.pageno = currentPage;
                this.usePage = true;
                return this.inittable(this.pageno, this.pagesize, this.queryForm.newbaseid,
                    this.queryForm.startime, this.queryForm.endtime,
                    this.queryForm.examstartdate, this.queryForm.examenddate,
                    this.queryForm.outdeptstate,
                    this.queryForm.inputquery);
            },
            examgetstartime: function (date) {		//报名开始时间
                this.queryForm.examstartdate = moment(new Date(date)).format("YYYY-MM");
            },
            examgetendtime: function (date) {		//报名结束时间
                this.queryForm.examenddate = moment(new Date(date)).format("YYYY-MM");;
            },
            gettime: function (date) {			//选取时间段
                this.queryForm.startime = date;
            },
            getendtime: function (date) {			//选取时间段
                this.queryForm.endtime = date;
            },
            doSelectQuery: function () {//查询方法
                let self = this;
                if (self.queryForm.newbaseid == 0 || self.queryForm.newbaseid == '') {
                    self.isnewbaseid = '';
                } else {
                    self.isnewbaseid = self.queryForm.newbaseid;
                };
                //查询的时候，总是从第一页开始
                self.pageno = 1;
                return self.inittable(self.pageno, self.pagesize,
                    self.queryForm.newbaseid,
                    self.queryForm.startime, self.queryForm.endtime,
                    self.queryForm.examstartdate, self.queryForm.examenddate,
                    self.queryForm.outdeptstate,
                    self.queryForm.inputquery)
            },
            realizeDelete(list) {
                let self = this;
                this.$confirm('是否要删除选中的学生?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/turnscore/deleteturnscore', {
                        command: 'turnscore/deleteturnscore',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        turnscoreidlist: list,	//成绩id
                    }).then(function (data) {
                        if (data && data.errcode == 0) {
                            self.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            self.inittable(self.pageno, self.pagesize,
                                self.queryForm.newbaseid,
                                self.queryForm.startime, self.queryForm.endtime,
                                self.queryForm.examstartdate, self.queryForm.examenddate,
                                self.queryForm.outdeptstate,
                                self.queryForm.inputquery);
                        } else {
                            self.$message({
                                type: 'error',
                                message: '删除失败：' + data.errdesc,
                            });
                        }
                    }).catch(() => {
                        self.$message({
                            type: 'error',
                            message: '网络请求失败！'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            singledelete: function (index, row, batch) {	//单个删除
                let _turnscoreid = [];
                _turnscoreid.push(row.turnscoreid);
                this.realizeDelete(_turnscoreid);
            },
            handleSelectionChange: function (item) {//全选的方法
                let self = this;	//0未开始1进行中2已结束
                self.deletelist = [];
                for (let i = 0; i < item.length; i++) {
                    self.deletelist.push(item[i].turnscoreid)
                }
            },
            batchdelete: function () {		//批量删除
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
                    this.realizeDelete(self.deletelist);
                }
            },

            //2018-05-11
            newbasechange: function () {
                let self = this;
                self.queryForm.deptid = '';
                self.newdeptList = [];
                self.newareaList = [];
                self.newroomList.map(function (index, item) {
                    if (self.queryForm.newbaseid == item.id) {
                        self.newdeptList = item.childlist
                    }
                })
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
            getpeopletypelist() {
                let self = this;
                post('/hr/querylevellist', {
                    command: 'hr/querylevellist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    code: 'stud_type',   	//人员类型
                }).then(function (data) {
                    if (data && data.errcode == 0) {
                        self.peopletypelist = data.levellist;
                    }
                })
            },
        }
    }
</script>
<style scoped>
    .wapper{
        padding: 0 20px;
    }
    .caseHistoryPagin {
        margin-top: 20px;
        text-align: right;
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
        /*min-width:1170px;*/
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
        width: 80px;
        text-align: right;
        display: inline-block;
    }

    .newandedit>.el-input {
        display: inline-block;
    }

    /* .newandedit>div>.el-select {
        width: 192px;
    } */

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

    .querybtn {
        margin-left: 10px;
    }

    .dataTable {
        /*min-width:1158px;*/
        margin-top: 20px;
    }

    .custom-form .el-form-item {
        margin-bottom: 16px;
        display: flex;
        justify-content: center;
    }

    .custom-form .el-select,
    .custom-form .el-input,
    .custom-form .custom-show {
        width: 225px;
    }

    .custom-show {
        box-sizing: border-box;
        padding-left: 8px;
    }

    .custom-line-parent {
        padding: 10px 15px;
    }

    .custom-line {
        border-top: 1px solid #ddd;
    }

    /* 查看 dialog */
    .underline {
        border-bottom: 1px solid #ccc;
        padding: 20px 0;
    }

    .base-info-box ul {
        display: flex;
        align-items: center;
        margin-bottom: 14px;
    }

    .base-info-box ul:last-child {
        margin-bottom: 0;
    }

    .base-info-box ul li {
        display: flex;
        align-items: center;
        margin-right: 20px;
    }

    .base-info-box ul li span:first-child {
        width: 100px;
        text-align: right;
        margin-right: 10px;
    }

    .base-info-box ul li span:last-child {
        width: 200px;
        white-space: normal;
    }

    .base-info-box ul li span:first-child::before {
        content: '*';
        color: red;
        margin-right: 6px;
    }

    .check-dialog>>>.el-dialog--small {
        width: 800px;
    }

    .check-table-box {
        display: flex;
        flex-direction: column;
    }

    .check-title {
        font-weight: 600;
        font-size: 14px;
        margin: 0 10px 10px 10px;
    }

    .skill-score-table {
        margin-bottom: 16px;
    }

    .tip {
        color: #349ADC;
        cursor: pointer;
    }

    .comment-box,
    .signature-box {
        display: flex;
        align-items: flex-start;
        margin: 10px 0;
    }

    .comment {
        font-weight: 600;
        margin-right: 6px;
        width: 66px;
        text-align: right;
    }

    .comment-content {
        width: 90%;
    }
</style>
<style>
    .selfFommter .el-form-item__label {
        width: 146px;
    }
</style>