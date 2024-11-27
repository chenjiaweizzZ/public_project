<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            教学活动
        </c-header>
        <div class="g-main">
            <ul class="exam-list">
                <li>
                    <span style="text-align: center">活动类型</span>
                    <span style="text-align: center">参加时间</span>
                </li>
                <li v-for="(item,index) in evaluatedlist" @click="detail(item)">
                    <span style="text-align: center">{{item.typename}}</span>
                    <span class="choice">{{item.starttimestr}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import $ from 'jquery'
    import cHeader from '../../header'
    import methods from '../../../methods'
    import { mapState,mapActions } from 'vuex'
    export default {
        components: {
            cHeader
        },
        filters: {

        },
        data() {
            return {
                evaluatedlist: [],
                data: '',
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

            // 查看日常考核详情
            detail: function (item) {
                let self = this;
                this.$router.push({
                    name: "fdRotation_activitydetail_director",
                    query: {
                        type:self.$route.query.type,
                        typeid:self.$route.query.typeid,
                        id:item.actionplanid,
                    }
                })
            },

            // 初始化页面发送请求
            init() {
                let self = this;
                self.data = {
                    command: 'teachingactivityplan/getuseractionplandetaillist',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    detailid: this.turninfo.businessid,
                    typeid: self.$route.query.typeid,
                    turnstatus: this.turninfo.status,
                };
                self.post('/teachingactivityplan/getuseractionplandetaillist', self.data)
                    .done(function (data) {
                        self.evaluatedlist = data.beanlist;
                    }).fail(function (error) {
                    self.nocontent = true
                })
            },
            back(){
                let self = this;
                this.$router.push({
                    name: 'fdRotation_activity_director',
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
