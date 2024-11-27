<template>
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
                    <!--<li>
                        <span>培训专业：{{item.majorname}}</span>
                    </li>-->
                    <li>
                        <span>分带教：{{item.tecname}}</span>
                    </li>
                    <li class="t-color">
                        <span>轮转周期：{{item.planbegintime | checkdate}}-{{item.planendtime | checkdate}}</span>
                        <span v-if="item.progress">轮转进度：{{item.progress | progress}}</span>
                    </li>
                    <!--<li v-if="item.progress">-->
                        <!--<span>轮转进度：{{item.progress | progress}}</span>-->
                    <!--</li>-->
                </ul>
                <div class="footerBtn">
                    <a @click='proving(item)'>日常考核</a>
                </div>
            </div>
            <no-content v-if='nocontent'></no-content>
        </div>
</template>
<script>
    import methods from '../../../methods'
    import { mapState,mapActions } from 'vuex'
    import noContent from '../../no_content'
    export default {
        props: ['active'],
        components: {
            noContent
        },
        data() {
            return {
                turndoctors: [],
                nocontent:false
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
        mounted() {
            let self = this
            self.init()
            self.registerToNative('goBack', function (data) {
                self.back();
            });
        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast',
                'setTurninfo'
            ]),
            // 护士长可评价列表
            init() {
                let self = this;
                self.post('/turnedoctormain/getnotevaluateforheadnurse', {
                    command: 'turnedoctormain/getnotevaluateforheadnurse',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                }).done(function (data) {
                    self.turndoctors = data.beanlist;
                    if (self.turndoctors.length == 0) {
                        self.nocontent = true
                    }
                }).fail(function (error) {
                    // self.nocontent = trues
                })
            },
            // 验证是否可评价
            proving(param) {
                let self = this;
                self.post('/turnevaluate/validateEvaluate', {
                    command: 'turnevaluate/validateEvaluate',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    businessid: param.id,
                    type: 12,
                }).done(function (data) {
                    if (data) {
                        if(data.errcode == 0){
                            self.dailyExam(param)
                        }else{
                            self.toast(data.errdesc)
                        }
                    }else {
                        self.toast('系统错误，请联系管理员！')
                    }
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
                        booking:1,
                        type:3,
                    }
                })
            },
            // 点击每一个学生列表调到学生的计划详情页
            plan: function (param) {
                this.setTurninfo({k:'stuid',v:param});
                this.$router.push({
                    name: 'fdRotation_doctor_plan_director',
                    query: {
                        type:3
                    }
                })
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
</style>
