<template>
    <div class="g-wrapper">
        <c-header v-show="showEvaluate">
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            {{title}}
            <!--住院生为带教老师评分-->
            <div slot='headerRight' style="font-size: 0.3rem" v-show="showsubmit" @click='evaluateTeacher'>
                评分
            </div>
        </c-header>
        <div class="g-main">
            <!--日常考核查看-->
            <ul v-if='showExam' class="exam-list">
                <li v-for="(item,index) in evaluatedlist" @click="detail(item)">
                    <span>{{item.evaluatedname}}</span>
                    <span>{{item.totalscore | score}}</span>
                    <span class="choice">{{item.evaluationmonth}}</span>
                </li>
            </ul>
            <!--评价带教老师-->
            <div v-if='showEvaluate' class="main">
                <div class="list t-title" v-if="isteach">
                    <span>带教老师</span>
                    <span>得分</span>
                    <span>评分日期</span>
                </div>
                <div class="list"  v-for='item in evaluatedlist' @click='evaluateDetail(item)'>
                    <span>{{item.evaluatedname}}</span>
                    <span>{{item.totalscore}}分</span>
                    <p class="score">
                        <span>{{item.evaluationmonth}}</span>
                        <img src="../../../assets/images/bnt_xiangyou.png" alt="">
                    </p>
                </div>
            </div>
            <no-content v-if='nocontent'></no-content>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery'
    import cHeader from '../../header'
    import methods from '../../../methods'
    import { mapState,mapActions } from 'vuex'
    import noContent from '../../no_content';
    export default {
        props: ['active'],
        components: {
            cHeader,
            noContent
        },
        filters: {
            score: function (value) {
                return value + '分'
            }
        },
        data() {
            return {
                showExam: false,
                showEvaluate: false,
                showTeacher: false,
                evaluatedlist: [],
                nocontent: false,
                data: {},
                title:'',
                showsubmit:true,
                isteach:true
            }
        },
        computed:{
            ...mapState([
                'turninfo',
            ]),
        },
        watch: {
            'active': function (val, oldVal) {
                let self = this;
                if (val !== oldVal) {
                    if (self.$route.query.booking == 0) {
                        self.showExam = true;
                        if(self.$route.query.type == 1){
                            self.evaluateMonth(4,$.cookie('uid'),'','',1);
                        }else if(self.$route.query.type == 2){
                            self.evaluateMonth(4,'','','',1);
                        }else{
                            self.evaluateMonth(4,'','','',1)
                        }
                    } else if (self.$route.query.booking == 1) {
                        self.showEvaluate = true;
                        if(self.$route.query.param == 1){
                            self.evaluateMonth(1,$.cookie('uid'),'',0)
                        }else if(self.$route.query.param == 5){
                            self.evaluateMonth(5,$.cookie('uid'),self.turninfo.deptid)
                        }
                    }
                }
            }
        },
        mounted() {
            let self = this;
            // booking=0是护培生日常考核查看
            // booking=1是护培生评价带教老师
            if(this.turninfo.status != 1){
                self.showsubmit = false;
            }
            if (self.$route.query.booking == 0) {
                self.showExam = true;
                if(self.$route.query.type == 1){
                    self.evaluateMonth(4,$.cookie('uid'),'','',1);
                }else if(self.$route.query.type == 2){
                    self.evaluateMonth(4,'','','',1);
                }else{
                    self.evaluateMonth(4,'','','',1)
                }
            } else if (self.$route.query.booking == 1) {
                self.showEvaluate = true;
                if(self.$route.query.param == 1){
                    self.title = '评价带教老师';
                    self.isteach = true
                    self.evaluateMonth(1,$.cookie('uid'),'',0)
                }else if(self.$route.query.param == 5){
                    self.title = '评价科室';
                    self.isteach = true;
                    self.evaluateMonth(5,$.cookie('uid'),self.turninfo.deptid)
                }
            }
        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),

            // 查看日常考核详情
            detail: function (item) {
                let self = this
                this.$router.push({
                    name: "fdRotation_teacher_detail_director",
                    query: {
                        // booking: date
                        id:item.id,
                        type:self.$route.query.type,
                        where:self.$route.query.where,
                        from:1,
                        id:self.$route.query.id,
                    }
                })
            },
            // 评价代教老师
            evaluateDetail: function (item) {
                let self = this;
                self.$router.push({
                    name: "fdRotation_doctor_evaluate_score_director",
                    query:{
                        booking:0,
                        id:item.id,
                        type:self.$route.query.type,
                        id:self.$route.query.id,
                    }
                })

            },
            // 初始化页面发送请求
            evaluateMonth: function (type,uid,evaluatedid,flag) {
                let self = this
                self.data = {
                    command: 'turn/queryevaluatedmonths',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    businessid: self.turninfo.businessid,
                    uid:uid,
                    evaluatedid:evaluatedid,
                    type: type,
                    flag:flag
                }
                self.post('/turn/queryevaluatedmonths', self.data)
                    .done(function (data) {
                        self.evaluatedlist = data.monthlist;
                        if (self.evaluatedlist.length <= 0) {
                            self.nocontent = true
                        }
                    }).fail(function (error) {
                    self.nocontent = true
                })
            },
            // 护培生登录，评价带教老师或者科室时，点击导航栏的评分按钮
            evaluateTeacher: function () {
                let self = this;
                let opitions ={};
                if(self.$route.query.param == 1){
                    opitions.evaluatedid = self.turninfo.teachingid;
                    opitions.type = 1;
                } else if(self.$route.query.param == 5 ){
                    opitions.deptid = self.turninfo.deptid;
                    opitions.type = 5;
                }
                self.post('/turn/validateevaluation', {
                    command: 'turn/validateevaluation',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                    stuid:$.cookie('uid'),
                    businessid: self.turninfo.businessid,
                    ...opitions
                }).done(function (data) {
                    if(data.errcode == 0){
                        if(data.validatecode == 0){
                            if(self.$route.query.param == 1){
                                self.$router.push({
                                    name: "fdRotation_doctor_evaluate_score_director",
                                    query:{
                                        booking:1,
                                        type:self.$route.query.type,
                                        param:1,
                                        id:self.$route.query.id,
                                    }
                                })
                            }else if(self.$route.query.param == 5){
                                self.$router.push({
                                    name: "fdRotation_doctor_evaluate_score_director",
                                    query:{
                                        booking:1,
                                        param:5,
                                        type:self.$route.query.type,
                                        id:self.$route.query.id,
                                    }
                                })
                            }
                        }else if(data.validatecode == 400101){
                            self.showAlert("当前用户不在轮转计划中！");
                        }else if(data.validatecode == 400102){
                            self.showAlert("已存在评价记录！");
                        }else if (data.validatecode == 400108) {
                            self.showAlert("未到出科评价时间！");
                        }else if(data.validatecode == 400103 || data.validatecode == 400104 || data.validatecode == 400105){
                            self.showAlert("请于"+data.evastartdate+ "至" +data.evaenddate + "进行评价");
                        }else if(data.validatecode == 400110){
                            self.showAlert("超出出科日期不能进行评价！");
                        }
                    }else {
                        self.showAlert(data.errdesc);
                    }
                }).fail(function (error) {

                })
            },
            back(){
                let self = this
                if(self.$route.query.booking == 0){
                    this.$router.push({
                        name: 'fdRotation_doctor_exam_director',
                        query:{
                            type:self.$route.query.type,
                            booking:self.$route.query.booking,
                            where:self.$route.query.where,
                            id:self.$route.query.id,
                        }
                    })
                }else if(self.$route.query.booking == 1){
                    this.$router.push({
                        name: 'fdRotation_doctor_evaluate_director',
                        query:{
                            type:self.$route.query.type,
                            id:self.$route.query.id,
                        }
                    })
                }
            },
        }
    }

</script>
<style lang="scss" scoped>
    .g-main{
        font-size:0.26rem;
        background: #f8f7f9!important;
        color: rgb(100,100,100);
    }

    .list {
        margin-top: 0.1rem;
        padding: 0.2rem 0.3rem;
        height: 0.8rem;
        line-height: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        span {
            width:20vw;
        }
        span:nth-child(1) {
            display: inline-block;
            width: 40vw;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        p {
            width:30vw;
            text-align: center;
        }
    }

    .t-title{
        padding: 0.2rem 0.7rem 0.2rem 0.3rem;
        margin-bottom: 0px;
        color: #333;
    }

    .list img {
        width: 0.2rem;
        height: 0.2rem;
    }

    .score {
        margin: 0;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .score span {
        padding-right: 0.3rem;
    }

    .exam-list {
        background: #f8f7f9;
        margin-top: 0.1rem;
        li {
            display: flex;
            margin: .1rem 0;
            padding: .15rem .2rem;
            position: relative;
            background: #fff;
            span {
                flex: 1;
                width: 0;
            }
        }
    }
    span.choice:after {
        content: '';
        display: inline-block;
        width: 0.3rem;
        height: 0.3rem;
        background: url("../../../assets/images/you-jiantou.png") 0 0 no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 0.2rem;
    }
</style>
