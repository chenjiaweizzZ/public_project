<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            {{code | title}}
        </c-header>
        <div class="g-main">
            <div v-if="code == 0 || code == 1">
                <ul>
                    <li v-for =" (item,index) in list">
                        <span>{{item.doctorname}}</span>
                        <span>
                            {{item.totalscore | score}}
                        </span>
                        <span>
                            {{item.evaluationmonth | date}}
                        </span>
                    </li>
                </ul>
            </div>
            <div v-if="code == 2">
                <ul>
                    <li>
                        <span>活动类型</span>
                        <span>次数</span>
                    </li>
                    <li v-for =" (item,index) in list">
                        <span>{{item.typeName}}</span>
                        <span>{{item.count}}</span>
                    </li>
                </ul>
            </div>
            <div v-if="code == 3">
                <ul>
                    <li>
                        <span>签到率</span>
                        <span>旷工率</span>
                        <span>请假率</span>
                        <span>迟到率</span>
                        <span>早退率</span>
                        <span>日期</span>
                    </li>
                    <li v-for =" (item,index) in list">
                        <span>{{item.signpercent | rate}}</span>
                        <span>{{item.absencepercent | rate}}</span>
                        <span>{{item.leavepercent | rate}}</span>
                        <span>{{item.latepercent | rate}}</span>
                        <span>{{item.earlyleavepercent | rate}}</span>
                        <span>{{item.day}}</span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import methods from '../../methods';
    import cHeader from '../header';
    import { mapState, mapActions } from 'vuex'
    export default {
        data() {
            return {
                code: null,
                list:''
            }
        },
        components: {
            cHeader,
        },
        watch:{
            'code':function(val,oldval) {
                if ((val || val == 0) && val !== oldval) {
                    if(this.tatistcal.systype == 1){
                        if (val === 0 || val === '0') {
                            this.initOffice(5)
                        } else if (val == 1) {
                            this.initOffice(1)
                        } else if (val == 2) {
                            this.initAction()
                        } else if (val == 3) {
                            this.initAttendance()
                        }
                    }else{
                        if (val === 0 || val === '0') {
                            if(this.$route.query.menutype==1){
                                this.initOffice(18)
                            }else{
                                this.initOffice(8)
                            }

                        } else if (val == 1) {
                            if(this.$route.query.menutype==1){
                                this.initOffice(18)
                            }else{
                                this.initOffice(8)
                            }
                        } else if (val == 2) {
                            this.initAction()
                        } else if (val == 3) {
                            this.initAttendance()
                        }
                    }

                }
            },
        },
        filters:{
            'title':function(val){
                if(val == 0){
                    return '科室评分'
                }else if(val == 1){
                    return '带教评分'
                }else if(val == 2){
                    return '教学活动'
                }else if(val == 3){
                    return '考勤统计'
                }
            },
            'score':function(val){
                if(val || val == 0){
                    return val + '分'
                }else {
                    return '-'
                }
            },
            'rate':function(val){
                if(val || val == 0){
                    return val + '%'
                }else {
                    return '-'
                }
            },
            'date':function(val){
                if(!val){
                    return '-'
                }else {
                    return val
                }
            }
        },
        computed:{
            ...mapState([
                'tatistcal'
            ]),
        },
        created() {
            this.code = this.tatistcal.tab
        },
        mounted() {

        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast',
                'setTatistical',
            ]),
            initOffice(param){
                let self = this;
                this.post('/turnevaluate/queryevaluationscoredetail',{
                    command:'turnevaluate/queryevaluationscoredetail',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    evaluatedid:this.$route.query.id,
                    evaluationmonth:this.$route.query.month,
                    evaluationtype:param,
                }).done( res => {
                    if(res && res.errcode){
                        if(res.errcode == 0){
                            self.list = res.detaillist;
                        }else {
                            self.toast(res.errdesc);
                        }
                    }else {
                        self.toast('系统错误，请联系管理员~')
                    }
                });
            },
            //教学活动
            initAction(){
                let self = this;
                let opitions = {} ;
                this.setTatistical({'k': 'selecttime', 'v': this.$route.query.month})
                if(this.tatistcal.role == 0 && this.tatistcal.dept){
                    opitions.deptid = this.tatistcal.dept
                }else {
                    opitions.deptid = this.$route.query.id
                }
                this.post('/turnanalysismanager/actionplansignanalysisdetail',{
                    command:'turnanalysismanager/actionplansignanalysisdetail',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    yearmonth:this.$route.query.month,
                    deptid:this.$route.query.id
                //    ...opitions
                }).done( res => {
                    if(res && res.errcode){
                        if(res.errcode == 0){
                            self.list = [] ;
                            // self.list = [
                            //     {name:'小讲课',count:res.bean.type1},
                            //     {name:'病例讨论',count:res.bean.type2},
                            //     {name:'教学查房',count:res.bean.type3},
                            //     {name:'入科教育',count:res.bean.type4},
                            //     {name:'技能培训',count:res.bean.type5},
                            //     {name:'出科考核',count:res.bean.type7},
                            //     {name:'教学会议',count:res.bean.type8},
                            //     {name:'其他',count:res.bean.type6},
                            //     {name:'总次数',count:res.bean.totalcount},
                            //     {name:'核心胜任力',count:res.bean.type9},
                            // ];
                            self.list = res.result
                        }else {
                            self.toast(res.errdesc);
                        }
                    }else {
                        self.toast('系统错误，请联系管理员~')
                    }
                });
            },
            //考勤
            initAttendance(){
                let self = this;
                let opitions = {} ;
                this.post('/turnanalysismanager/workattenddayanalysis',{
                    command:'turnanalysismanager/workattenddayanalysis',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    yearmonth:this.$route.query.month,
                    systype:this.tatistcal.systype,
                    deptid:this.$route.query.id
                }).done( res => {
                    if(res && res.errcode){
                        if(res.errcode == 0){
                            self.list = res.beanlist;
                        }else {
                            self.toast(res.errdesc);
                        }
                    }else {
                        self.toast('系统错误，请联系管理员~')
                    }
                });
            },
            back(){
                this.setTatistical({k:'isback',v:1});
                window.history.back();
            }
        }
    }
</script>
<style lang="scss" scoped>
    ul {
        background: #fff;
        li {
            display: flex;
            padding: 0 .2rem;
            border-bottom: 1px solid #e0e0e0;
            span {
                line-height: .6rem;
                width: 0;
                flex: 1;
                text-align: center;
            }
        }
    }
</style>
