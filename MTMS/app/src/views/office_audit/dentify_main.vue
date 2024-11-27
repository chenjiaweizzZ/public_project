<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png"/>
                </a>
            </div>
            个人综合考评表审核
        </c-header>
        <c-tabs :bus="bus" @change-tab="changeTab">
            <c-tab :title="tobeaudit" :active="type == 1" :bus="bus" data="1"></c-tab>
            <c-tab title="已鉴定" :active="type == 2" :bus="bus" data="2" ></c-tab>
        </c-tabs>

        <div class="g-main" >
            <div class="to_Dentify_Wrap">
                <div class="grade">
                    <input type="text" v-model="searchcontent" placeholder="请输入姓名搜索">
                    <i class="tosearch" @click="search"></i>
                </div>
                <ul class="dentify_Ul_Header">
                    <li>姓名</li>
                    <li>专业基地</li>
                    <li>提交日期</li>
                </ul>
                <div class="dentify_Ul_Wrap">
                    <ul class="dentify_Ul" v-for="(item,index) in mainList" @click="toaudit(item)">
                        <li>{{item.name}}</li>
                        <li>{{item.basename}}</li>
                        <li >{{item.stdsubdatestr}}<img src="../../assets/images/bnt_xiangyou.png" class="dentifyArrow"/></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import $ from 'jquery'
    import methods from '@/methods';
    import cHeader from '../header';
    import cTab from '@/components/tab'
    import cTabs from '@/components/tabs';
    import {mapState,mapActions} from 'vuex';
    let bus = new Vue();
    export default {
        name: '',
        components: {
            cHeader,
            cTab,
            cTabs,
        },
        data(){
            return{
                bus: bus,
                type: 2,
                tobeaudit:'待鉴定（ 0 ）人',//待鉴定title
                data:[],
                gradeList:true,
                mainList:[],
                has_type:true,
                searchcontent:'',
                seachgread:'',
                seachyear:'',
                istrue:false,
            }
        },
        watch:{
            'type':function(val,oldval){
                if(this.istrue && oldval == 2 && val == 1){
                      this.tolist();
                }
            }
        },
        methods:{
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            init(gread,year,seachinfo){
                this.gradeList = false;
                let self = this;
                self.seachgread = gread;
                self.seachyear = year;
                this.post('/turnedoctormain/getuserpersonalevaluatehospital', {
                    command: 'turnedoctormain/getuserpersonalevaluatehospital',
                    sessionid: $.cookie('sid'),
                    loginid: $.cookie('uid'),
                    uid: $.cookie('uid'),
                    requestflag: 2, //2 老师请求
                    requesttype: 4,//4 查教办鉴定列表;
                    grade: gread,
                    yearflag :year,
                    usersearchinfo:seachinfo
                }).done(data => {
                    if(data && data.errcode ==0){
                        self.mainList = data.result.beanlist;
                        self.istrue = true;
                    }else if(data.errdesc){
                        self.toast(data.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            },
            //顶部查询
            search(){
                this.init(this.$route.query.gread,this.$route.query.year,this.searchcontent)
            },

            //前往具体考核表
            toaudit(item){
                this.$router.push({
                    name:'audit_evaluation',
                    query:{
                        id:item.id,
                        yearflag:item.yearflag,
                        stdid:item.stdid,
                        type:2

                    }
                });
            },

            // 返回按钮
            back() {
                this.$router.push({
                    name:'audit_evaluation_list',
                    query:{
                        dotype:2,
                    }
                });
            },
            //  table
            changeTab(tab) {
                this.type = tab.data;
            },
            // title
            tolist(){
                this.$router.push({
                    // path:'/officeAudit/list',
                    name: "office_performance_evaluation",
                    query:{
                        dotype:1,
                    }
                });
            },
        },
        cread(){

        },
        mounted(){
            if(this.$route.query.count){
                this.tobeaudit = '待鉴定 ( ' + this.$route.query.count + ' ) 人'
            }
            let self = this;
            self.init(this.$route.query.gread,this.$route.query.year,'');
            this.registerToNative('goBack', function (data) {
                self.back()
            });
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../scss/mixin.scss";
    .to_Dentify_Wrap{
        .grade{
            height:0.6rem;
            text-align:right;
            border-bottom: $borderColor;
            line-height:0.6rem;
            color:$activeColor;
            padding-right: 0.2rem;
            border-bottom:1px solid $borderColor;
            position:relative;
            input{
                width:100%;
                background: #F8F8F8;
                padding-left: .2rem;
                margin-top: .1rem;
            }
            .tosearch {
                position: absolute;
                width: .5rem;
                height: .5rem;
                background: url("../../assets/images/search-white.png") 0 0 no-repeat;
                background-size: 100%;
                position: absolute;
                right: 5%;
                top: 5%;
                color: #fff;
            }
        }
        .dentify_Ul, .dentify_Ul_Header{
            @include sexy-flex();
            li{
                text-align: center;
                line-height:0.6rem;
                @include flex1(1);
                border-bottom: 1px solid $borderColor;
                height:0.6rem;
                font-size:0.2rem;
                .dentifyArrow{
                    width:0.3rem;
                    height:0.3rem;
                    float:right;
                    margin:0.15rem
                }
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
        .dentify_Ul_Header{
            li{
                font-size:0.24rem;
            }
        }
    }
</style>


