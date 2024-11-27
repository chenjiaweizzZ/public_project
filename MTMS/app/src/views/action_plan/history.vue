<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            查看历史
        </c-header>
        <ul class="filter">
            <li :class="{'active':typeconfig.show}" @click="typeconfig.show = typeconfig.show ? false : true">活动类型</li>
            <li :class="{'active':timeconfig.show}" @click="timeconfig.show = timeconfig.show ? false : true">活动日期</li>
            <li class="noselect" @click="noraml">默认</li>
        </ul>
        <!--选择类型-->
        <select-list :config = 'typeconfig' :data-list="typelist" @confirm = "typeselect">

        </select-list>
        <!--选择日期-->
        <!--选择要看的时间-->
        <c-timepicker :config="timeconfig" @confirm="timeselect" :year="year" :month="month">

        </c-timepicker>
        <div :class="!iscontent ? 'g-main' : 'g-main noneContent'">
            <load-more :loading-text="loadingText" :infinite-loading ='isgetmore' :to-top ='istotop' @getmore = 'init()'>
            <!--列表-->
            <!-- <actionplan :data-list="data" :ishistory="ishistory" @confirm="init()">

            </actionplan> -->
            <actionplanSteps :dataList="data" :ishistory="ishistory"></actionplanSteps>
            </load-more>
        </div>

        <no-content v-show="iscontent"></no-content>
    </div>
</template>
<script>
    import methods from '../../methods';
    import { mapState, mapActions } from 'vuex'
    import cHeader from '../header';
    import actionplan from './main';
    import actionplanSteps from '../../components/actionplan-steps';
    import selectList from '../../components/select';
    import cTimepicker from '../../components/timepicker';
    import loadMore from '../../components/load-more';
    import noContent from '../no_content.vue';
    export default {
        components:{
            cHeader,
            actionplan,
            noContent,
            selectList,
            cTimepicker,
            loadMore,
            actionplanSteps
        },
        data () {
            return {
                istotop:false,
                reqnum:10,
                isgetmore:true,
                iscontent:false,
                loadingText:'加载中~',
                ishistory:true,
                data:[],
                type:'',//需要查询的类型
                selecttime:'',//需要查询的时间
                timeconfig:{
                    show:false,
                    istime:false,
                    custom:true
                },
                year:[2017,2027],
                month:[1,12],
                typeconfig:{
                    show:false,
                    label:'name',
                    fixedvalue:'1.5rem',
                    textposition:'left'
                },
                typelist:[],
            }
        },
        watch:{
            'type':function(val,oldvalue){
                if(val!==oldvalue){
                    this.setActions({k:'historytype',v:this.type});
                }
            },
            'selecttime':function(val,oldvalue){
                if(val!==oldvalue){
                    this.setActions({k:'historydate',v:this.selecttime});
                }
            },
            'reqnum':function(val,oldvalue){
                if(val!==oldvalue){
                    this.setActions({k:'historyreqnum',v:this.reqnum});
                }
            },
        },
        filters: {

        },
        computed:{
            ...mapState([
                'actionfilters'
            ]),
        },
        created () {
            this.selecttime = this.actionfilters.historydate ;
            this.type = this.actionfilters.historytype ;
            this.reqnum = this.actionfilters.historyreqnum ;
        },
        mounted () {
            let self = this;
            this.init();
            this.inittypelist();
            this.registerToNative('goBack', function (data) {
                self.back()
            });
        },
        methods:{
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast',
                'setActions'
            ]),
            init(){
                let self=this;
                this.isgetmore = false ;
                this.post('/actionplan/listactionplan',{
                    command: 'actionplan/listactionplan',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    uid:$.cookie('uid'),
                    clientflag:1,//PC or APP
                    type:self.type,//活动类型
                    status:'',//单独搜索某个状态的教学计划
                    statuslist:[2],//默认页面需要显示未开始和进行中
                    starttime:'',//计划的开始时间（APP暂未用到）
                    endtime:'',//计划的结束时间（APP暂未用到）
                    yearmonth:self.selecttime,//年月（APP暂未用到）
                    beforemonthindex:'',//APP筛选前几个月的
                    isself:1,//查询是否与我相关 true  or  false
                    orderflag:1,
                    historyflag:1,
                    page:1,
                    reqnum:self.reqnum
                }).done((data)=>{
                    if(data && data.errcode ==0){
                        self.isgetmore = true ;
                        if(data.result.beanlist.length > 0){
                            self.iscontent = false;
                            self.data = data.result.beanlist;
                            if(self.data.length < self.reqnum){
                                self.isgetmore = false ;
                                self.loadingText = '没有更多啦~'
                            }
                            self.reqnum += 10 ;
                        }else {
                            self.data = []
                            self.iscontent = true
                        }
                    }else if(data.errdesc){
                        self.toast(data.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            inittypelist(){//获取活动类型
                let self=this;
                this.post('/turnbaseinfo/turnbaseinfolevel',{
                    command: 'turnbaseinfo/turnbaseinfolevel',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    code:'teachtype',
                }).done((data)=>{
                    if(data&&data.errcode ==0){
                        let _typelist = JSON.parse(data.baseinfolevellist);
                        _typelist.unshift({'name':'全部','id':''});
                        self.typelist = _typelist
                    }else if(data.errdesc){
                        self.toast(data.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            timeselect(data){
                this.timeconfig.show = false;
                this.istotop = !this.istotop;
                this.reqnum = 10 ;
                this.selecttime = data ;
                this.init();
            },
            typeselect(data){
                this.istotop = !this.istotop;
                this.typeconfig.show = false;
                this.reqnum = 10 ;
                this.type = data.key;
                this.init();
            },
            noraml(){
                this.reqnum = 10 ;
                this.istotop = !this.istotop;
                this.selecttime = '' ;
                this.type = '' ;
                this.init();
            },
            back(){
                this.setActions({k:'historytype',v:''});
                this.setActions({k:'historydate',v:''});
                this.$router.push({
                    name: 'fdAction_list',
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .noneContent {
        display: none;
    }
    .g-main {
        padding-top: 8px;
    }
    ul.filter {
        display: flex;
        height: .74rem;;
        background: #fff;
        color: #666;
        /* border-bottom: 1px solid #aaa; */
        li {
            flex: 1;
            width: 0;
            text-align: center;
            line-height: .74rem;
        }
        li.noselect {
            color: #3499db;
        }
        li.noselect:after {
            background: none;
        }
        li:after {
            content: '';
            display: inline-block;
            width: .2rem;
            height: .2rem;
            background: url("../../assets/images/xia-jiantou.png") 0 0 no-repeat;
            background-size: 100% 100%;
            margin-left: .1rem;
        }
        li.active {
            color: #3499db;
        }
        li.active:after {
            content: '';
            display: inline-block;
            width: .2rem;
            height: .2rem;
            background: url("../../assets/images/shang-jiantou.png") 0 0 no-repeat;
            background-size: 100% 100%;
            margin-left: .1rem;
        }
    }

</style>
