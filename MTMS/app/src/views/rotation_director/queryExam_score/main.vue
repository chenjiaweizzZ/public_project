<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            成绩查询
        </c-header>
        <header v-if="!nocontent">
           <span>年度考核</span>
           <span>考核日期</span>
           <span>合格状态</span>
        </header>
        <div class="g-main" v-if="!nocontent">
            <ul>
                <li v-for="(item,index) in list" @click="showdetail(item.id)">
                    <span>{{item.examyear}}</span>
                    <span>{{item.examdate | substring(0,4)}}年{{item.examdate | substring(5,7)}}月{{item.examdate | substring(8,11)}}日</span>
                    <span class="choice">{{item.examstatus}}</span>
                </li>
            </ul>
        </div>
        <no-content v-if="nocontent"></no-content>
    </div>
</template>
<script>
    import methods from '../../../methods';
    import cHeader from '../../header';
    import noContent from '../../no_content';
    import { mapState, mapActions } from 'vuex'
    export default {
        data() {
            return {
                list:'',
                nocontent:false
            }
        },
        components: {
            cHeader,
            noContent
        },
        filters:{

        },
        computed:{
            ...mapState([
                'turninfo',
            ]),
        },
        watch: {},
        created() {

        },
        mounted() {
            let self = this;
            this.init();
            this.registerToNative('goBack', function (data) {
                self.back()
            });
        },
        methods: {
            ...methods,
            init() {
                let self = this;
                this.post('/turnannualresult/queryannualscorebydetailid', {
                    command: 'turnannualresult/queryannualscorebydetailid',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    detailid: this.turninfo.businessid,
                }).done(function (data) {
                    self.list = data.annualscorelist;
                    if(self.list.length <= 0){
                        self.nocontent = true;
                    }
                }).fail(function(){
                    self.toast('连接服务失败，请稍后再试');
                    self.nocontent = true;
                })
            },
            showdetail(param){
                let self = this;
                this.$router.push({
                    name: "fdRotation_examdetail_director",
                    query:{
                        detailid:param,
                        type:self.$route.query.type
                    }
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
    header {
        background: #fff;
        height: 0.65rem;
        padding: 0 0.5rem 0 0.1rem;
        border-bottom: 1px solid #eee;
        color: #666;
        span {
            line-height: 0.65rem;
            width: 32%;
            text-align: center;
        }
    }
    li {
        position: relative;
        background: #fff;
        border-bottom: 1px solid #eee;
        margin-bottom: 0.1rem;
        display: flex;
        justify-content: space-between;
        height: 0.65rem;
        padding: 0 0.5rem 0 0;
        span {
            line-height: 0.65rem;
            width: 33.33%;
            text-align: center;
            font-size: 0.22rem;
        }
    }
    .choice:after {
        content:'';
        display:inline-block;
        width:0.3rem;
        height:0.3rem;
        background: url("../../../assets/images/you-jiantou.png") 0 0 no-repeat;
        background-size:100% 100%;
        position: absolute;
        right: 0.1rem;
        top: 0.15rem;
    }
</style>
