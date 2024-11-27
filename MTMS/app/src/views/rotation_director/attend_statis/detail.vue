<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            请假详情
        </c-header>

        <div class="g-main">

            <ul class="main">
                <li v-for="item in detaillist">
                    <span>{{item.workattendancename}}</span>
                    <span>{{item.workdatestr}}</span>
                </li>
                <no-content v-if='nocontent'></no-content>
            </ul>
        </div>

    </div>
</template>
<script>
    import cHeader from '../../header';
    import $ from 'jquery';
    import methods from '../../../methods'
    import { mapState, mapActions } from 'vuex'
    import noContent from '../../no_content';
    export default {
        data() {
            return {
                detailid:'',
                nocontent: false,
                detaillist:[],
            }
        },
        components: {
            cHeader,
            noContent
        },
        computed:{
            ...mapState([
                'turninfo',
            ]),
        },
        watch:{

        },
        filters:{

        },
        created(){
            this.detailid = this.$route.query.id;
        },
        mounted(){
            let self = this;
            this.init();
            this.registerToNative('goBack', function (data) {
                self.back()
            });
        },
        methods: {
            ...methods,
            init(){//获取详情
                let self = this;
                this.post('/workattendance/getuserworkattendlistinfo',{
                    command:'workattendance/getuserworkattendlistinfo',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    actionplanid:self.detailid,
                    businessid: this.turninfo.businessid,
                    workattendancetype: this.$route.query.attendtype,
                    systype: 1
                }).done( res => {
                    if(res.beanlist.length > 0){
                        self.detaillist = res.beanlist;
                    }else{
                        self.detaillist = [];
                        self.nocontent = true
                    }
                }).fail(function (error) {
                    self.nocontent = true
                });
            },

            back(){
                let self = this;
                this.$router.push({
                    name: "fdRotation_attendstatis_director",
                    query: {
                        type:self.$route.query.type,
                        typeid:self.$route.query.typeid,
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .btn-group {
        height: .76rem;
        img {
            width: .4rem;
            height: .4rem;
            margin-top: .18rem;
            margin-left: .15rem;
        }
    }
    .g-main {
        margin-top:0.1rem;
        li:nth-child(2) , li:nth-child(4) , li:nth-child(7){
            border-bottom: 1px solid #eee;
            margin-bottom:0
        }
    }
    li {
        background:#fff;
        height: .65rem;
        line-height:.65rem;
        padding:0 0.4rem;
        color: #666;
        font-size: 0.26rem;
        font-family: "Microsoft YaHei";
        margin-bottom:0.1rem;
        display: flex;
        span{
            flex: 3;
            height: .62rem;
            line-height: .62rem;
            overflow: hidden;
            text-align: center;
        }

    }

</style>
