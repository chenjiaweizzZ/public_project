<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            考勤统计
        </c-header>
        <div class="g-main">
            <ul class="exam-list">
                <li>
                    <div>计划轮转时间（{{evaluatedlist.planturncount}}天）{{evaluatedlist.planbegintime}} — {{evaluatedlist.planendtime}}</div>
                </li>
                <li>
                    <div>实际轮转时间（{{evaluatedlist.realturncount}}天）{{evaluatedlist.realbegintime}} — {{evaluatedlist.realendtime | date}}</div>
                </li>
                <li>
                    <span>考勤类型</span>
                    <span>天数/天</span>
                </li>
                <li v-for="(item,index) in evaluatedlist.countlist" @click="detail(item)">
                    <span>{{item.workattendname}}</span>
                    <span :class="{'choice':item.workattendtype != 1}">{{item.count}}</span>
                </li>
            </ul>
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
        components: {
            cHeader,
            noContent
        },
        filters: {
            'date':function (val) {
                return val  ? val : '至今'
            },
        },
        data() {
            return {
                evaluatedlist: [],
                nocontent: false,
                data: '',
                total:0
            }
        },
        watch: {

        },
        computed:{
            ...mapState([
                'turninfo',
            ]),
        },
        mounted() {
            this.init();
            this.registerToNative('goBack', function (data) {
                self.back()
            });
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

            // 查看考勤详情
            detail: function (item) {
                let self = this;
                if(item.workattendtype == 1){
                    return
                }
                this.$router.push({
                    name: "fdRotation_attenddetail_director",
                    query: {
                        type:self.$route.query.type,
                        attendtype:item.workattendtype,
                    }
                })
            },

            // 初始化页面发送请求
            init() {
                let self = this
                self.data = {
                    command: 'workattendance/getuserworkattendcount',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    businessid: this.turninfo.businessid,
                    systype:1,
                }
                self.post('/workattendance/getuserworkattendcount', self.data)
                    .done(function (data) {
                        self.evaluatedlist = data.workattendinfo;
                        if (self.evaluatedlist.length <= 0) {
                            self.nocontent = true
                        }
                    }).fail(function (error) {
                    self.nocontent = true
                })
            },
            back(){
                let self = this;
                this.$router.push({
                    name: 'fdRotation_doctor_exam_director',
                    query:{
                        type:self.$route.query.type,
                    }
                })
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
                text-align: center;
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
