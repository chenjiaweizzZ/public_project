<template>
    <div class="g-wrapper">
        <p class="title-header">
            <span>{{date}}</span>
            <span @click="gettime.show = true">日期</span>
        </p>
        <div class="g-main">
            <div v-for='item in turndoctors' class="list">
                <ul @click='plan(item.stdid)'>
                    <li class="head">
                        <div class="headDiv">
                            <img src="../../../assets/images/icon_morentoux-.png" alt="">
                            <div class="content">
                                <p>
                                    <span>{{item.stdname}}</span>
                                    <span>{{item.gradename}}</span>
                                </p>
                                <p>
                                    <span>{{item.basename}}</span>
                                    <span>{{item.stdmobile}}</span>
                                </p>
                            </div>
                        </div>
                    </li>
                    <li>
                        <span>轮转科室：{{item.deptname}}</span>
                    </li>
                    <li>
                        <span>带教老师：{{item.tecname}}</span>
                    </li>
                    <li class="t-color">
                        <span>轮转周期：{{item.planbegintime | checkdate}}-{{item.planendtime | checkdate}}</span>
                        <span v-if="item.progress">轮转进度：{{item.progress | progress}}</span>
                    </li>
                    <!--<li v-if="item.progress">
                        <span>轮转进度：{{item.progress | progress}}</span>
                    </li>-->
                </ul>
                <div class="footerBtn">
                    <a @click='dailyExam(item)'>日常考核</a>
                </div>
            </div>
        </div>
        <!--选择时间-->
        <c-timepicker :config="gettime" @confirm="selectstarttime" :year="year" :month="month"></c-timepicker>
        <no-content v-if='noContent'></no-content>
    </div>
</template>
<script>
    import methods from '../../../methods'
    import cTimepicker from '../../../components/timepicker';
    import noContent from '../../no_content'
    import { mapState, mapActions } from 'vuex'
    export default {
        props: ['active'],
        components: {
            cTimepicker,
            noContent
        },
        data() {
            return {
                turndoctors: [],
                date:'',
                gettime:{
                    show:false,
                    isday:false,
                    istime:false,
                    custom:true
                },
                year:[2018,2028],
                month:[1,12],
                noContent:false
            }
        },
        filters: {
            progress: function (value,oldvalue) {
                if(value !== oldvalue){
                    if(value >= 100 ){
                        return '100%'
                    }else {
                        return value.toFixed(2) + '%'
                    }
                }
            },
            checkdate(date) {
                if(date){
                    return date.split('-').join('.')
                }
            }
        },
        watch: {
            'active': function (val, oldVal) {
                if (val) {
                    this.init()
                }
            }
        },
        created(){
            let self = this;
            if(self.$route.query.date){
                self.date = self.$route.query.date
            }else {
                let d = new Date();
                let y = d.getFullYear();
                let m = d.getMonth() + 1;
                if( m < 10){
                    m = '0' + m
                }
                self.date =  y + '-' + m;
            }
        },
        mounted() {
            let self = this;
            self.init();
            self.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        methods: {
            ...methods,
            ...mapActions([
                'setTurninfo'
            ]),
            // 护士长可评价列表
            init() {
                let self = this;
                self.post('/turnedoctormain/getevaluateforheadnurse', {
                    command: 'turnedoctormain/getevaluateforheadnurse',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                    yearmonth:self.date
                }).done(function (data) {
                    self.turndoctors = data.beanlist;
                    if (self.turndoctors.length == 0) {
                        self.noContent = true
                    }
                }).fail(function (error) {
                    // self.noContent = trues
                })
            },
            // 日常考核按钮
            dailyExam: function (data) {
                let self = this;
                self.setTurninfo({k:'businessid',v:data.id});
                self.setTurninfo({k:'deptname',v:data.deptname});
                self.setTurninfo({k:'deptid',v:data.deptid});
                self.setTurninfo({k:'status',v:data.turnstatus});
                self.setTurninfo({k:'stuid',v:data.stdid});
                self.setTurninfo({k:'teachingid',v:data.tecid});
                this.$router.push({
                    name: 'fdRotation_nurse_evaluate_director',
                    query: {
                        booking:0,
                        type:3,
                        where:2,
                        id:data.evaluateid,
                        date:self.date
                    }
                })
            },
            // 点击每一个学生列表调到学生的计划详情页
            plan: function (param) {
                this.setTurninfo({k:'stuid',v:param});
                this.$router.push({
                    name: 'fdRotation_doctor_plan_director',
                    query: {
                        type:3,
                        where:2
                    }
                })
            },
            selectstarttime:function(data){
                this.noContent = false;
                this.date = data;
                this.init();
            }
        }
    }

</script>
<style lang="scss" scoped>
    .g-main{
        font-size:0.22rem;
        background: #f8f7f9!important;
        color: rgb(100,100,100);
    }
    .list {
        padding-top: 0;
    }

    ul {
        background: white;
        padding: 0 0.3rem 0;
    }

    ul p {
        margin: 0;
    }

    ul li {
        padding: 0.05rem 0;
    }

    ul li:nth-of-type(1) {
        border-bottom: solid 0.01rem rgb(240,240,240);
        padding: 0.1rem 0;
    }

    ul li:nth-of-type(2) {
        padding-top: 0.1rem;
    }

    ul li:nth-last-of-type(1) {
        padding-bottom: 0.1rem;
    }

    .t-color span:nth-of-type(2) {
        float: right;
        color: #0B78E3;
    }

    .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .content {
            width: 100%;
            height: auto!important;
            padding: 0;
            margin-top: 0;
            p {
                display: flex;
            }
            span {
                width: 0;
                flex: 1;
            }
        }
    }

    .headDiv {
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .headDiv div {
        width: calc(100% - 1rem);
    }

    .headDiv img {
        width: 0.66rem;
        height: 0.66rem;
        margin-right: 0.2rem;
    }

    .footerBtn {
        border-top: solid 0.01rem rgb(240,240,240);
        text-align: right;
        padding: .1rem 0;
        margin: 0 0.3rem;
    }

    .footerBtn a {
        background: #3499db;
        color: white;
        padding: 0.1rem 0.05rem;
        border-radius: 0.1rem;
    }
    .title-header {
        display: flex;
        justify-content: space-around;
        background: #fff;
        padding: 0.1rem 0.2rem;
        span {
            flex: 1;
        }
        span:nth-of-type(2) {
            color: #3499db;
            text-align: right;
        }
    }
</style>
