<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            出科考试查看
        </c-header>
        <div class="g-main">
            <ul class="c-content" v-for="(item,index) in list">
                <li class="title">出科考试报名日期：{{item.examdate | substring(0,4)}}年{{item.examdate | substring(5,7)}}月{{item.examdate | substring(8,11)}}日</li>
                <li>
                    <div>
                        <span>理论考试</span>
                        <span class="flag">{{item.theoryscore | score }}</span>
                        <span class="flag" :style = "{'color':computeColor(item.theoryflag) , 'pointer-events' : computeEvent(item.theoryflag)} " v-if="item.theoryflag" @click="makeup('theory',item.turnscoreid)">{{item.theoryflag | flag}}</span>
                        <i :class="{'onchoice':istheory , 'choice':item.theoryflag == 2}" @click="istheory = istheory ? false : true ;"></i>
                    </div>
                    <ul class="m-content" v-show="istheory">
                        <li v-for="(val,index) in item.turnscoredetaillist" v-if="val.examtype == 1">
                            <span>理论考试</span>
                            <span class="flag">{{val.theoryscore | score }}</span>
                            <span class="flag">{{val.examdate}}</span>
                        </li>
                    </ul>
                </li>
                <li>
                    <div>
                        <span>技能考核</span>
                        <span class="flag">{{item.skillscore | score}}</span>
                        <span class="flag" :style = "{'color':computeColor(item.skillflag) , 'pointer-events' : computeEvent(item.skillflag)}" v-if="item.skillflag" @click="makeup('skill',item.turnscoreid)">{{item.skillflag | flag}}</span>
                        <i :class="{'onchoice':isskill,'choice':item.skillflag == 2}" @click="isskill = isskill ? false : true ;"></i>
                    </div>
                    <ul class="m-content" v-show="isskill">
                        <li v-for="(val,index) in item.turnscoredetaillist" v-if="val.examtype == 2">
                            <span>技能考核</span>
                            <span class="flag">{{val.skillscore | score }}</span>
                            <span class="flag">{{val.examdate}}</span>
                        </li>
                    </ul>
                </li>
                <li>
                    <div>
                        <span>出科综合考评</span>
                        <span class="flag">{{item.comprescore | score}}</span>
                        <span class="flag" :style = "{'color':computeColor(item.compreflag) , 'pointer-events' : computeEvent(item.compreflag)}" v-if="item.compreflag" @click="makeup('compre',item.turnscoreid)">{{item.compreflag | flag}}</span>
                        <i :class="{'onchoice':iscompre,'choice':item.compreflag == 2}" @click="iscompre = iscompre ? false : true ;"></i>
                    </div>
                    <ul class="m-content" v-show="iscompre">
                        <li v-for="(val,index) in item.turnscoredetaillist" v-if="val.examtype == 3">
                            <span>出科综合考评</span>
                            <span class="flag">{{val.comprescore | score }}</span>
                            <span class="flag">{{val.examdate}}</span>
                        </li>
                    </ul>
                </li>
            </ul>
        </div>
        <no-content v-if='nocontent'></no-content>
    </div>
</template>
<script>
    import cHeader from '../../header'
    import methods from '../../../methods'
    import { mapState,mapActions } from 'vuex'
    import noContent from '../../no_content'
    export default {
        data() {
            return {
                list:'',
                nocontent:false,
                iscompre:false,
                isskill:false,
                istheory:false
            }
        },
        components: {cHeader,noContent},
        computed: {
            ...mapState([
                'turninfo',
            ]),
        },
        watch: {},
        created() {

        },
        filters:{
            flag:function(value){
                if(value == 0){
                    return ''
                }else if(value == 1){
                    return '补考'
                }else if(value == 2){
                    return '已补考报名'
                }
            },
            score:function(value){
                if(value){
                    return value
                }
                return '暂未录入'
            }
        },
        mounted() {
            this.init();
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
            init(){
                let self = this;
                let user = '';
                if(self.$route.query.type == 0){
                    user = $.cookie('uid')
                }else {
                    user = this.turninfo.stuid
                }
                self.post('/turnscore/querystuturnscore', {
                    command: 'turnscore/querystuturnscore',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    deptid:self.turninfo.deptid,
                    uid:user
                }).done(function (data) {
                    if(data && data.errcode == 0){
                        if(data.stuturnscorelist.length > 0){
                            self.list = data.stuturnscorelist;
                        }else {
                            self.nocontent = true;
                        }
                    }
                }).fail(function (error) {
                    self.nocontent = true
                })
            },
            computeColor(param){
                if(param == 1){
                    return '#3499db'
                }else if(param == 2){
                    return '#666'
                }
            },
            computeEvent(param){
                if(param == 1){
                    return 'auto'
                }else if(param == 2 || param == 0){
                    return 'none'
                }
            },
            makeup(param,id){
                let self = this;
                let opition = {};
                if(param == 'theory'){
                    opition.examflag = '1' ;
                }else if(param == 'skill'){
                    opition.examflag = '2' ;
                }else if(param == 'compre'){
                    opition.examflag = '3' ;
                }
                self.post('/turnexam/validateturnexamday', {
                    command: 'turnexam/validateturnexamday',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    businessid: self.turninfo.businessid,
                    turnscoreid:id,
                    ...opition,
                }).done(function (data) {
                    if(data && data.flag == 1){
                        self.showConfirm({
                            title: '提醒',
                            msg: '是否确认补考报名？',
                            theme: 'modal-confirm modal-white',
                            ok: function () {
                                self.enlist(param,id);
                            },
                            cancel: function () {

                            }
                        })
                    }else {
                        self.toast(data.message);
                    }
                })
            },
            enlist(param,id){
                let self = this;
                let opitions = {};
                if(param == 'theory'){
                    opitions.theorystatus = '1' ;
                    opitions.examtype = '1';
                }else if(param == 'skill'){
                    opitions.skillstatus = '1' ;
                    opitions.examtype = '2';
                }else if(param == 'compre'){
                    opitions.comprestatus = '1' ;
                    opitions.examtype = '3';
                }
                let date =  new Date().getFullYear() + '-' + (new Date().getMonth() + 1 ) + '-' + new Date().getDate();
                self.post('/turnexam/addtrunexaminition', {
                    command: 'turnexam/addtrunexaminition',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    examdate:date,
                    stuid: $.cookie('uid'),
                    businessid: self.turninfo.businessid,
                    deptid: self.turninfo.deptid,
                    enlisttype:'2',
                    isresouce:'0',
                    turnscoreid:id,
                    ...opitions,
                }).done(function (data) {
                    if(data && data.errcode == 0){
                        self.toast('报名成功！');
                        self.init();
                    }else {
                        self.toast(data.errdesc);
                    }
                })
            },
            back(){
                let self = this;
                this.$router.push({
                    name: 'fdRotation_doctor_exam_director',
                    query:{
                        type: self.$route.query.type,
                        where:self.$route.query.where
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    ul.c-content {
        margin: 0.1rem 0;
        >li {
            background: #fff;
            color: #666;
            font-size: 0.22rem;
            padding: 0.15rem .4rem .25rem 0.2rem;
            border-bottom: 1px solid #eee;
            div {
                display: flex;
                position: relative;
            }
            span {
                flex: 1;
                width: 0;
            }
        }
    }
    ul.m-content {
        margin-top: .1rem;
        padding: .1rem 0;
        color: #888;
        border-top: 1px solid #C9CACA;
        li {
            display: flex;
            span {
                flex: 1;
                width: 0;
            }
        }
    }
    i.choice {
        display: inline-block;
        width: 0.3rem;
        height: 0.3rem;
        background: url("../../../assets/images/you-jiantou.png") 0 0 no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: -.25rem;
    }
    i.onchoice {
        display: inline-block;
        width: 0.3rem;
        height: 0.3rem;
        background: url("../../../assets/images/xia-jiantou.png") 0 0 no-repeat;
        background-size: 100% 100%;
        right: -.25rem;
    }
    .flag {
        text-align: center;
    }
</style>
