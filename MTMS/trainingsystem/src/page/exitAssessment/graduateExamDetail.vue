<template>
    <div class="wapper">
        <el-breadcrumb separator="/">
            <el-breadcrumb-item :to="{ name: 'graduateExamine' }">出科考核管理</el-breadcrumb-item>
            <el-breadcrumb-item>出科考核详情</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="base-info-box">
            <div class="title">基本信息</div>
            <div class="base-info-content">
                <ul>
                    <li>
                        <span>考核级别:</span>
                        <span>{{baseInfo.examlevel == 0 ? '科室级' : '基地级'}}</span>
                    </li>
                    <li>
                        <span>科室:</span>
                        <span>{{baseInfo.deptIdNameVoList | filterDept}}</span>
                    </li>
                </ul>
                <ul>
                    <li>
                        <span>考核类型:</span>
                        <span>{{baseInfo.examtype == 1 ? '出科考核（技能）' : '出科考核（综合）'}}</span>
                    </li>
                    <li>
                        <span>考核项目:</span>
                        <span style="width:300px;">{{examItemList}}</span>
                    </li>
                </ul>
                <ul>
                    <li>
                        <span>考试开始时间:</span>
                        <span>{{baseInfo.starttime}}</span>
                    </li>
                    <li>
                        <span>考试结束时间:</span>
                        <span>{{baseInfo.endtime}}</span>
                    </li>
                </ul>
                <ul>
                    <li>
                        <span>考官:</span>
                        <span>{{teacherListDetail}}</span>
                    </li>
                    <li>
                        <span>考核地点:</span>
                        <span>{{baseInfo.place}}</span>
                    </li>
                </ul>
                <ul>
                    <li>
                        <span>被考核学员:</span>
                        <span>{{studentListDetail}}</span>
                    </li>
                    <li>
                        <span>备注:</span>
                        <span>{{baseInfo.remark}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <div class="record">
            <div class="title">现场记录</div>
            <div class="record-content">
                <div class="field_situation">
                    <span v-for="(item,index) in piclist">
                        <img @click="bigpicture = true;activeItemIndex=index" :src="baseUrl + item.picurl"></img>
                    </span>
                </div>
                <div class="grid-content">
                    <span>备注:</span>
                    <span>{{remark}}</span>
                </div>
            </div>
        </div>
        <div class="student-report" v-if="examType == 2">
            <div class="title">学员汇报</div>
            <div class="student-report-content">
                <ul>
                    <li v-for="(item, index) in studentReport" :key="index">
                        <div>{{item.studentName}}({{item.username}})</div>
                        <a target="_blank" :href="'/file/download2?file=' + item.uploadPath + '&name=' + item.fullName" :title="item.fullName">{{item.fullName}}</a>
                    </li>
                </ul>
            </div>
        </div>
        <!-- <div class="feedback">
            <div class="title">学员反馈</div>
            <div class="feedback-content">
                <div class="feedback-content-title">
                    <div>得分: 26分/总分30分</div>
                    <div>反馈人数: 5人/总人数8人</div>
                </div>
                <ul class="score-items">
                    <li>
                        <span>课程设计、时间安排</span>
                        <span>5</span>
                    </li>
                    <li>
                        <span>老师的教学方法</span>
                        <span>5</span>
                    </li>
                </ul>
                <div class="advise">建议</div>
                <ul class="advise-box">
                    <li>
                        <div>1.希望增强授课趣味性</div>
                        <div>张三</div>
                    </li>
                    <li>
                        <div>2.希望老师增强互动</div>
                        <div>李四</div>
                    </li>
                </ul>
            </div>
        </div> -->
        <div class="scores">
            <div class="title">成绩统计</div>
            <div class="score-table">
                <el-table ref="detailTable" :data="scoreList" border tooltip-effect="dark" style="width: 100%">
                    <el-table-column label="学员" prop="stuname" min-width="120"></el-table-column>
                    <el-table-column label="学号" prop="code" min-width="120"></el-table-column>
                    <el-table-column label="专业基地" prop="base" min-width="120"></el-table-column>

                    <el-table-column min-width="150" v-for="(item, index) in examItemLabel" :key="index" :label="item.examitemname" prop="itemscorelist">
                        <template slot-scope="scope">
                            <template v-for="(item2,index2) in scope.row.itemscorelist">
                                <template v-if="index == index2">
                                    <el-button type="text" @click="querySocreDetail(index2, scope.row)">{{item2.score}}
                                    </el-button>
                                </template>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="examType == 1" label="平均成绩" prop="score" min-width="100"></el-table-column>
                </el-table>
            </div>
        </div>
        <!-- 成绩详情弹窗 -->
        <el-dialog :title="examDetailTitle" :visible.sync="dialogScore" size="small" class="dialog-score-detail" @close="clearData">
            <div class="container">
                <div class="score-left-box">
                    <el-table :data="teacherList" @row-click="rowClick" style="width:300px;" highlight-current-row>
                        <el-table-column label="考官" prop="examinername" width="100"></el-table-column>
                        <el-table-column label="评分" prop="score" width="100"></el-table-column>
                    </el-table>
                </div>
                <div class="score-right-box">
                    <el-table :data="scoreItem" style="width:100%;" border empty-text="暂无数据,请点击考官查询评分详情">
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
                            <div class="comment-content">{{teacherName}}</div>
                        </div>

                    </div>
                </div>
            </div>
        </el-dialog>

        <!--查看图片 -->
        <el-dialog title="查看大图" size="small" :visible.sync="bigpicture" :close-on-click-modal="false">
            <el-carousel trigger="click" :initial-index='activeItemIndex' indicator-position="none" v-if="bigpicture">
                <el-carousel-item v-for="(item,index) in piclist" :key="item.id">
                    <img class="img-position" :src="baseUrl + item.picurl" />
                </el-carousel-item>
            </el-carousel>
        </el-dialog>
    </div>
</template>

<script>
    import { post, getCookie } from '../../config/util';
    import { mapState, mapActions } from 'vuex';
    import api from '../../config/common_data.js';
    export default {
        name: 'graduateExamDetail',
        data() {
            return {
                // 出科考核ID
                id: '',
                baseInfo: '',
                // 考核类型
                examType: '',
                // 考核项
                examItemList: '',
                // 评分表
                scoreItem: [],
                studentListDetail: '',
                teacherListDetail: '',
                examItemLabel: [],
                dialogScore: false,
                examDetailTitle: '',
                scoreList: [],
                teacherList: [],
                baseUrl: '',
                // 现场记录
                piclist: [],
                remark: '',
                bigpicture: false,
                activeItemIndex: 0,
                // 学员汇报
                studentReport: [],
                // 评语
                comment: '',
                // 签名
                signature: '',
                teacherName: '', //考官姓名
            }
        },
        filters: {
            filterDept(val) {
                let temp = []
                val.forEach(item => {
                    temp.push(item.deptName)
                })
                return temp.join(",")
            }
        },
        methods: {
            clearData() {
                this.teacherList = [];
                this.scoreItem = [];
            },

            rowClick(row) {
                console.log(row);
                this.scoreItem = [];
                if (row.status == 1) {
                    post('/turnExamInfo/queryturnexamscore', {
                        command: 'turnExamInfo/queryturnexamscore',
                        sessionid: getCookie('sid'),
                        loginid: getCookie('uid'),
                        turnexamscoreid: row.turnexamscoreid
                    }).then((data) => {
                        if (data && data.errcode == 0) {
                            if (data.itemlist) {
                                data.itemlist.forEach((item, index) => {
                                    item.value.map(val => {
                                        this.scoreItem.push(val);
                                    })
                                });
                            }

                            // 评语
                            this.comment = row.comment;
                            this.teacherName = row.examinername
                            // 签名
                            this.signature = row.signature;
                        }
                    }).catch((error) => {

                    })
                } else {
                    this.$message({
                        type: 'warning',
                        message: '当前考官没有评分'
                    });
                }
            },

            querySocreDetail(index, row) {
                // console.log(row);
                let examItemId = row.itemscorelist[index].examitemid;
                let examItemName = row.itemscorelist[index].examitemname;
                this.examDetailTitle = row.stuname + examItemName + '的考核详情';
                this.dialogScore = true;
                this.querystuscorelist(this.id, row.stuid, row.seiid, examItemId);
            },

            // 成绩打分查询
            querystuscorelist(examId, stuId, seiid, examItemId) {
                post('/turnExamInfo/querystuitemgradescorelist', {
                    command: 'turnExamInfo/querystuitemgradescorelist',
                    sessionid: getCookie('sid'),
                    loginid: getCookie('uid'),
                    examid: examId,
                    stuid: stuId,
                    seiid: seiid,
                    examitemid: examItemId
                }).then((data) => {
                    if (data && data.errcode == 0) {
                        this.teacherList = data.itemscorelist;
                    }
                }).catch((error) => {

                })
            },

            // 出科考试详情
            getExamDetails() {
                api.getExamDetails(this.id).then((data) => {
                    this.baseInfo = data;
                    this.examType = data.examtype;

                    let studentList = [];
                    let teacherList = [];
                    let examItemList = [];
                    for (var item of data.studentlist) {
                        studentList.push(item.studentname);
                    }
                    for (var item of data.teacherlist) {
                        teacherList.push(item.teachername);
                    }
                    // if (data.examtype == 1) {
                    for (var item of data.examitemlist) {
                        examItemList.push(item.examitemname);
                    }
                    this.examItemList = examItemList.join('、');
                    // }
                    this.studentListDetail = studentList.join('、');
                    this.teacherListDetail = teacherList.join('、');

                    this.baseUrl = data.fdfsurl;
                    // 现场记录
                    // 图片
                    this.piclist = data.picuploadlist;
                    // 备注
                    this.remark = data.decpdetail ? data.decpdetail.content : '';

                    // 综合 学员汇报
                    this.studentReport = data.filelist;

                    // 成绩
                    this.scoreList = data.stuScoreList ? data.stuScoreList : '';
                    if (data.stuScoreList.length > 0) {
                        this.examItemLabel = data.stuScoreList[0].itemscorelist;
                    }
                });
            }
        },
        mounted() {
            // 出科考试ID
            console.log("------------")
            this.id = this.$route.query.id;
            this.getExamDetails();
        },
    }
</script>

<style scoped>
    .wapper {
        padding: 0 20px;
    }

    .base-info-box {
        margin-top: 20px;
    }

    .base-info-box,
    .record,
    .student-report,
    .feedback {
        border-bottom: 1px solid #ccc;
    }

    .title {
        font-size: 16px;
        font-weight: 600;
    }

    .base-info-content ul {
        display: flex;
        align-items: flex-start;
        margin: 16px 0;
        font-size: 14px;
    }

    .base-info-content ul li {
        margin-right: 40px;
        display: flex;
        align-items: flex-start;
    }

    .base-info-content ul li span:first-child {
        width: 100px;
        text-align: right;
        margin-right: 10px;
    }

    .base-info-content ul li span:last-child {
        width: 200px;
        white-space: normal;
    }

    .record,
    .student-report,
    .feedback {
        padding: 10px 0;
    }

    .student-report-content,
    .feedback-content {
        width: 94%;
        margin: 10px auto;
    }

    .student-report-content ul li {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid #ccc;
        padding: 10px;
    }

    .student-report-content ul li:last-child {
        /* border-bottom: none; */
    }

    .feedback-content-title {
        width: 50%;
        display: flex;
        align-items: center;
        border-bottom: 1px solid #ccc;
        padding: 10px 20px 10px 10px;
    }

    .feedback-content-title div {
        margin-right: 40px;
    }

    .score-items li {
        border-bottom: 1px solid #ccc;
        padding: 10px 20px 10px 30px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .advise {
        padding: 10px 0 10px 30px;
        border-bottom: 1px solid #ccc;
    }

    .advise-box li {
        border-bottom: 1px solid #ccc;
        padding: 10px 20px 10px 30px;
    }

    .advise-box li div:last-child {
        text-align: right;
    }

    .advise-box li:last-child {
        border-bottom: none;
    }

    .scores {
        padding: 10px 0;
    }

    .score-table {
        padding: 10px 0;
    }

    .dialog-score-detail>>>.el-dialog--small {
        min-width: 1000px;
    }

    .container {
        display: flex;
        align-items: flex-start;
        justify-content: space-around;
    }

    .score-left-box {
        width: 201px;
    }

    .score-right-box {
        width: 75%;
        height: 100%;
    }

    /* 现场记录 */

    .record-content {
        min-height: 150px;
    }

    .field_situation {
        width: 100%;
        margin: 15px;
        min-height: 100px;
    }

    .field_situation img {
        width: 80px;
        height: 80px;
        display: inline-block;
        margin-right: 8px;
    }

    .grid-content {
        display: flex;
        align-items: flex-start;
    }

    .grid-content span:last-child {
        width: 800px;
        margin-left: 15px;
        white-space: normal;
        line-height: 20px;
    }

    .img-position {
        max-width: 100%;
        max-height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
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