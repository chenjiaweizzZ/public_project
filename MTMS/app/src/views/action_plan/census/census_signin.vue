<template>
    <div class="g-main">
        <template>
            <div class="census-content">
                <div>
                    <div id="echart"></div>
                </div>
                <div>
                    <ul>
                        <li>签到率：{{signinfo.signpercent || 0}}%</li>
                        <li>应到人数：{{signinfo.signnormalcount}}</li>
                        <li>实到人数：{{signinfo.signincount}}</li>
                        <li>缺勤人数：{{signinfo.signabsencecount}}</li>
                        <li>请假人数：{{signinfo.signleavecount}}</li>
                        <li>计划外签到人数：{{signinfo.signoutcount}}</li>
                    </ul>
                </div>
            </div>
        </template>
        <div class="info">
            <p>
                参与人员
                <img class="search" @click="showsearch = true" src="../../../assets/images/search.png" />
            </p>
            <ul class="getinfo">
                <li>
                    <span :class="{'active':i == 0}" @click="i = 0 ; list = signinfo.signinlist">已签到({{signinfo.signinlist&&signinfo.signinlist.length}})</span>
                </li>
                <li>
                    <span :class="{'active':i == 1}" @click="i = 1 ; list = signinfo.notsignlist">未签到({{signinfo.notsignlist&&signinfo.notsignlist.length}})</span>
                </li>
                <li>
                    <span :class="{'active':i == 2}" @click="i = 2 ; list = signinfo.signoutlist">计划外签到({{signinfo.signoutlist&&signinfo.signoutlist.length}})</span>
                </li>
            </ul>
            <ul class="stu-list">
                <li v-if = 'list && list.length > 0' @click="stusts.show = true , uid= item.uid" :class="{choice : signinfo.changestatusflag == 1 , nochoice:signinfo.changestatusflag == 0}" v-for="(item,index) in list">
                    <span>{{item.uname}}</span>
                    <span>{{item.username}}</span>
                    <span>{{item.statusstr}}</span>
                </li>
                <li v-show = 'list.length == 0'>
                    <span>
                       暂无内容
                    </span>
                </li>
            </ul>
        </div>
        <!--更新状态-->
        <c-picker :config="stusts" @confirm="selectstusu">

        </c-picker>
        <!--搜索框-->
        <div class="search-content g-wrapper" v-show = 'showsearch'>
            <c-header>
                <div slot="headerLeft">
                    <a @click="showsearch = false" class="header-back-btn">
                        <img src="../../../assets/images/icon_fanhui.png" />
                    </a>
                </div>
                参与人员
            </c-header>
            <div class="search-icon">
                <input type="text" v-model="searchname" placeholder="请输入姓名模糊搜索">
                <i @click="searchstudent()"></i>
            </div>
            <div class="g-main">
                <ul class="stu-list">
                    <li v-if = 'searchlist && searchlist.length > 0' @click="stusts.show = true , uid= item.id" :class="{choice : signinfo.changestatusflag == 1 , nochoice:signinfo.changestatusflag == 0}" v-for="(item,index) in searchlist">
                        <span>{{item.uname || item.name}}</span>
                        <span>{{item.username}}</span>
                        <span>{{item.statusstr}}</span>
                    </li>
                    <li v-show = 'searchlist.length == 0'>
                    <span>
                       暂无内容
                    </span>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import methods from '../../../methods';
    import { mapState, mapActions } from 'vuex'
    import cHeader from '../../header';
    import cPicker from '../../../components/default-picker'
    import echarts from'echarts/lib/echarts';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/legend';
    import 'echarts/lib/chart/pie'
    export default {
        props: ['active'],
        data() {
            return {
                detailid:'',
                opinion:['签到人数','缺勤人数'],
                opinionData:'',
                signinfo:'',
                i:0,
                list:'',
                stusts:{
                    show:false,
                    mainlist:[
                        {
                            name:'已签到',
                            status:10
                        },{
                            name:'请假',
                            status:2
                        },{
                            name:'缺勤',
                            status:1
                        }
                    ],
                    valueKey:'name'
                },
                searchlist:'',
                showsearch:false,
                searchname:''
            }
        },
        components: {
            cPicker,
            cHeader
        },
        watch:{
            'active': function (val, oldVal) {
                if (val) {
                    this.init();
                }
            }
        },
        filters:{
            rate:function(value){
                return Number(value).toFixed(2);
            }
        },
        created() {
            this.detailid = this.$route.query.id;
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
            init(){
                let self = this;
                this.post('/actionplan/signinfo',{
                    command:'actionplan/signinfo',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    uid:$.cookie('uid'),
                    actionplanid:self.detailid,
                }).done( res => {
                    self.signinfo = '';
                    self.signinfo = res.bean;
                    self.opinionData='';
                    self.opinionData=[
                        {'value':res.bean.signpercent || 0 ,'name':'签到率'},
                        {'value':100 - Number(res.bean.signpercent),'name':'缺勤率'},
                    ];
                    self.list = self.i == 0 ? res.bean.signinlist : self.i == 1 ? res.bean.notsignlist : self.i == 2 ? res.bean.signoutlist : res.bean.signinlist;
                    self.$nextTick(function() {
                        self.drawGraph('echart')}
                    );
                });
            },
            drawGraph:function(id){
                //饼图
                var self = this;
                self.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                self.chart.setOption ({
                    title : {
                        text: '签到情况',
                        x:'center',
                    },
                    tooltip : {
                        trigger: 'item',
                        show: false,
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        bottom: 10,
                        left: 'center',
                        data: ['签到率','缺勤率'],
                        itemHeight:10,
                        itemWidth:10,
                        itemGap:6,
                        textStyle:{fontSize:12}
                    },
                    series : [
                        {
                            type: 'pie',
                            center: ['50%', '50%'],
                            radius:[0,'70%'],
                            data:self.opinionData,
                            label:{normal:{position:'inner',formatter:"{d}%"}},
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ],
                    color:['#00b4f4','#f7c416']
                });
                this.chart.hideLoading();
            },
            selectstusu(data){
                let self = this;
                this.post('/actionplan/updatesign',{
                    command:'actionplan/updatesign',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    actionplanid:self.detailid,
                    uid: self.uid ,
                    status: data.status
                }).done( res => {
                    if(res && res.errcode == 0){
                        self.toast('修改成功');
                        self.stusts.show = false;
                        if(self.showsearch == true){
                            self.searchstudent();
                        }else{
                            self.init();
                        }
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            },
            searchstudent(){
                let self = this;
                if(self.searchname == ''){
                    self.toast('请输入搜索内容');
                    return
                }
                this.searchlist = '';
                this.post('/actionplanbase/getactionplanuser',{
                    command:'actionplanbase/getactionplanuser',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    actionplanid:self.detailid,
                    name:self.searchname
                }).done( res => {
                    if(res && res.errcode == 0){
                        self.searchlist = res.beanlist;
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
    .census-content {
        display: flex;

        height:4rem;
        padding:0.2rem;
        background:#fff;
        >div {
            flex: 1;
            width: 0;
            height: 100%;
        }
        ul {
            padding: .1rem;
            color: #666;
            li {
                padding: .1rem 0;
            }
        }
        #echart {
            /*需要制定具体高度，以px为单位*/
            height: 100%;
            width:100%;
        }
    }
    .info {
        background: #fff;
        margin-top: 0.2rem;
        p {
            padding: 0.2rem;
            margin: 0;
            border-bottom: 1px solid #eee;
        }
        ul.getinfo {
            display: flex;
            border-bottom: 1px solid #eee;
            li {
                width: 0;
                flex: 1;
                text-align: center;
                line-height: .7rem;
                color: #888;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            span {
                line-height: .7rem;
                font-size: .22rem;
            }
            span.active {
                border-bottom: 2px solid #3499db;
                color: #3499db;
            }
        }

    }
    ul.stu-list {
         color: #666;
         background: #fff;
         li {
             display: flex;
             border-bottom: 1px solid #eee;
             line-height: .6rem;
             text-align: center;
             padding: 0 .2rem;
             position: relative;
             span {
                 line-height: .6rem;
                 text-align: center;
                 overflow: hidden;white-space: nowrap;text-overflow: ellipsis;
                 flex: 1;
                 width: 0;
             }
         }
     }
    img.search {
        float: right;
        width: .35rem;
    }
    .choice {
        padding-right: 0.4rem;
    }
    .choice:after {
        content: '';
        display: inline-block;
        flex:3;
        width: 0.3rem;
        height: 0.3rem;
        background: url("../../../assets/images/you-jiantou.png") 0 0 no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 0.2rem;
        top: 0.15rem;
    }
    .search-content {
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        background: #F8F8F8;
    }
    .search-icon {
        position:relative;
        margin: .1rem .2rem;
        border: 1px solid #eee;
        border-radius: 0.3rem;
        height: 0.6rem;
        input {
            margin: 0.1rem 0 0.1rem 0.2rem;
            height: 0.4rem;
            width: calc(100% - 1rem);
            background: transparent;
            display:inline-block;
        }
        i {
            display:inline-block;
            width:0.4rem;
            height:0.4rem;
            margin:0.1rem;
            background:url('../../../assets/images/icon-search.png') 0 0 no-repeat;
            background-size:100% 100%;
            cursor:pointer;
            vertical-align: middle;
            z-index:99;
        }
    }
    .nochoice {
        pointer-events: none;
    }
</style>
