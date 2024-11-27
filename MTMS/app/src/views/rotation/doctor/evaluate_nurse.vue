<template>
    <div class="g-main">
        <ul class="list" v-if="!nocontent">
            <li v-for="(item,index) in evaluatedlist" @click="detail(item)">
                <span>{{item.uname}}</span>
                <span>{{item.totalscore | score}}</span>
                <span class="choice">{{item.evaluationmonth}}</span>
            </li>
        </ul>
        <no-content v-if='nocontent'></no-content>
    </div>
</template>
<script>
    import $ from 'jquery'
    import methods from '../../../methods'
    import { mapState,mapActions } from 'vuex'
    import noContent from '../../no_content';
    export default {
        props: ['active'],
        components: {
            noContent
        },
        filters: {
            score: function (value) {
                return value + '分'
            },
        },
        data() {
            return {
                evaluatedlist: [],
                nocontent: false,
            }
        },
        watch: {
            'active': function (val, oldVal) {
                if(val !== oldVal){
                    this.init();
                }
            }
        },
        computed:{
            ...mapState([
                'turninfo',
            ]),
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

            // 查看日常考核详情
            detail: function (data) {
                this.$router.push({
                    name: 'fdRotation_nurse_evaluate',
                    query: {
                        booking:0,
                        type:this.$route.query.type,
                        from:2,
                        where:this.$route.query.where,
                        id: data.id,
                        businessId : data.businessid
                    }
                })
            },
            // 初始化页面发送请求
            init: function () {
                let self = this
                // self.data = {
                //     command: 'turnevaluate/getuserevaluatelist',
                //     sessionid: $.cookie('sid'),
                //     loginid: $.cookie('uid'),
                //     businessid: this.turninfo.businessid,
                //     type:12
                // }
                self.data = {
                    // command: 'turnevaluate/getuserevaluatelist',
                    // sessionid: $.cookie('sid'),
                    // loginid: $.cookie('uid'),
                    // businessid: this.turninfo.businessid,
                    // type:12
                    command: 'turn/queryEvaluatedMonths',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    businessid: this.turninfo.businessid,
                    type:12,
                    evaluatedid: "",
                    flag: "",
                    uid: "",
                }
                self.post('/turn/queryEvaluatedMonths', self.data)
                    .done(function (data) {
                        if(data){
                            if(data.errcode){
                                if(data.errcode == 0){
                                    self.evaluatedlist = data.monthlist;
                                    if (self.evaluatedlist.length <= 0) {
                                        self.nocontent = true
                                    }
                                }else {
                                    self.toast(data.errdesc);
                                }
                            }else {
                                self.toast('系统错误，请联系管理员！')
                            }
                        }
                        console.log(data)
                    }).fail(function (error) {
                    self.nocontent = true
                })
            }
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
