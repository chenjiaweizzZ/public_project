<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <!-- <router-link class="header-back-btn" to="/attendance/history"> -->
                <router-link class="header-back-btn" :to="{ name: 'fdAttendance_history' }">
                    <img src="../../assets/images/icon_fanhui.png" />
                </router-link>
            </div>
            考勤分析
        </c-header>
        <div class="g-main">
            <div class="trend">
                <p>
                    <span>
                        本科室近六个月{{trendSelect}}
                    </span>
                    <span class="trend-select" @click="typeconfig.show = true">
                        {{trendSelect}}
                    </span>
                </p>
                <div class="trend-content">
                    <div id="echarts-trend">

                    </div>
                </div>
            </div>
            <div class="rate">
                <p>
                    <span>
                        {{currentmonth | substr(0,4)}}年{{currentmonth | substr(5,2)}}月
                    </span>
                    <span class="rate-select" @click="gettime.show = true">
                        <img src="../../assets/images/icon_rili.png" alt="">
                    </span>
                </p>
                <div class="rate-content">
                    <div id="echarts-rate">

                    </div>
                </div>
            </div>
            <!--<div class="ranking">-->
            <!--<p>排行榜</p>-->
            <!--<ul class="getinfo">-->
            <!--<li>-->
            <!--<span :class="{'active':i == 0}" @click="i = 0 ; selectStu = '签到' ">签到({{list.length}})</span>-->
            <!--</li>-->
            <!--<li>-->
            <!--<span :class="{'active':i == 1}" @click="i = 1 ; selectStu = '请假'">请假({{list.length}})</span>-->
            <!--</li>-->
            <!--<li>-->
            <!--<span :class="{'active':i == 2}" @click="i = 2 ; selectStu = '缺勤'">缺勤({{list.length}})</span>-->
            <!--</li>-->
            <!--<li>-->
            <!--<span :class="{'active':i == 3}" @click="i = 3 ; selectStu = '迟到'">迟到({{list.length}})</span>-->
            <!--</li>-->
            <!--<li>-->
            <!--<span :class="{'active':i == 4}" @click="i = 4 ; selectStu = '早退'">早退({{list.length}})</span>-->
            <!--</li>-->
            <!--</ul>-->
            <!--<ul class="stu-list">-->
            <!--<li>-->
            <!--<span>名次</span>-->
            <!--<span>姓名</span>-->
            <!--<span>学号</span>-->
            <!--<span>带教老师</span>-->
            <!--<span>{{selectStu}}率</span>-->
            <!--</li>-->
            <!--<li v-for="(item,index) in list">-->
            <!--<span>{{item.index + 1}}.</span>-->
            <!--<span>{{item.uname}}</span>-->
            <!--<span>{{item.username}}</span>-->
            <!--<span>{{item.teaching}}</span>-->
            <!--<span>{{item.rateing | rate }}</span>-->
            <!--</li>-->
            <!--</ul>-->
            <!--</div>-->
        </div>
        <!--类型选择-->
        <add-group :config = 'typeconfig' :data-list="typelist" @confirm = "typeselect">

        </add-group>
        <!--选择环状图日期-->
        <c-timepicker :config="gettime"  :year="year" :month="month" @confirm="selecttime"></c-timepicker>
    </div>
</template>
<script>
    import methods from '../../methods';
    import { mapState, mapActions } from 'vuex'
    import cHeader from '../header';
    import cPicker from '../../components/default-picker';
    import addGroup from '../../components/add-group';
    import cTimepicker from '../../components/timepicker';
    import echarts from'echarts/lib/echarts';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/legend';
    import 'echarts/lib/chart/pie';
    import 'echarts/lib/chart/line'
    export default {
        props: ['active'],
        data() {
            return {
                trendSelect:'签到率',
                selectStu:'签到',
                type:'',
                rate:{},
                i:0,
                list:[],
                rateOpinion: ['签到','请假','缺勤','迟到','早退','其他'],
                rateOpinionData: [],
                lineXdata:[],
                linedata:[],
                currentmonth:'',
                typeconfig:{
                    show:false,
                    label:'name',
                    fixedtop:'1.7rem',
                    fixedright:'.1rem'
                },
                typelist:[

                ],
                gettime:{
                    show:false,
                    istime:false,
                    isday:false,
                    custom:true
                },
                year:[2018,2028],
                month:[1,12],
            }
        },
        components: {
            cPicker,
            addGroup,
            cTimepicker,
            cHeader
        },
        watch:{

        },
        filters:{
            'rate':function(value){
                return Number(value).toFixed(2) + '%';
            }
        },
        computed:{
            ...mapState([
                'turninfo',
                'systype',
                'singindept',
                'turnstatus'
            ]),
        },
        created() {
            this.currentmonth = this.turninfo.signindata;
        },
        mounted() {
            let self = this;
            this.inittypelist();
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
            inittypelist(){
                let self = this;
                this.post('/traineestudent/queryDictionaryList',{
                    command:'traineestudent/queryDictionaryList',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    code:'workattendancetype'
                }).done( res => {
                    if(res && res.errcode == 0){
                        let _typelist = res.dic_list;
                        _typelist.map( val => {
                            val.isused = 1;
                            val.name = val.name + '率'
                        });
                        self.typelist = _typelist;
                        self.type = self.typelist[0].key;
                        self.initline();
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            },
            init(){
                let self = this;
                this.post('/workattendance/workattendancedayanalysis',{
                    command:'workattendance/workattendancedayanalysis',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    systype:self.systype,
                    deptid:self.singindept,
                    yearmonth:self.currentmonth,
                    stdtype:self.turnstatus,
                }).done( res => {
                    if(res && res.errcode == 0){
                        self.rateOpinionData='';
                        self.rateOpinionData=[
                            {'value':res.bean.signpercent ,'name':'签到'},
                            {'value':res.bean.leavepercent,'name':'请假'},
                            {'value':res.bean.absencepercent,'name':'缺勤'},
                            {'value':res.bean.latepercent,'name':'迟到'},
                            {'value':res.bean.earlyretreatpercent,'name':'早退'},
                            {'value':res.bean.otherpercent,'name':'其他'},
                        ];
                        self.$nextTick(function() {
                                self.drawGraph('echarts-rate');
                            }
                        );
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            },
            drawGraph:function(id){
                //饼图
                var self = this;
                self.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                self.chart.setOption ({
                    title : {
                        text: '考勤分析',
                        x:'center',
                    },
                    tooltip : {
                        trigger: 'item',
                        show: false,
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        bottom: 0,
                        left: 'center',
                        data: self.rateOpinion,
                        itemHeight:10,
                        itemWidth:10,
                        itemGap:6,
                        textStyle:{fontSize:12}
                    },
                    series : [
                        {
                            type: 'pie',
                            center: ['50%', '50%'],
                            radius:['35%','50%'],
                            data:self.rateOpinionData,
                            label: {
                                normal: {
                                    formatter: '{b}：{d}%  ',
                                }
                            },
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ],
                    color:['#c7f316','#38ce9b','#ebb600','#00b4f4','#f97a1c','#a550f5']
                });
                this.chart.hideLoading();
            },
            initline(){
                let self = this;
                this.post('/workattendance/querydeptmonthattendancestats',{
                    command:'workattendance/querydeptmonthattendancestats',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    systype:self.systype,
                    deptid:self.singindept,
                    monthcount:6,
                    attendancetype:self.type,
                    stdtype:self.turnstatus,
                }).done( res => {
                    if(res && res.errcode == 0){
                        self.lineXdata = [];
                        self.linedata = [];
                        res.monthattendanceratelist.map( val => {
                            self.lineXdata.push(val.month);
                            self.linedata.push(val.attendancerate);
                        });
                        self.$nextTick(function() {
                                self.drawLine('echarts-trend');
                            }
                        );
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })

            },
            drawLine:function(id){
                //饼图
                var self = this;
                self.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                self.chart.setOption({
                    xAxis: {
                        type: 'category',
                        data: self.lineXdata,
                        //坐标轴颜色
                        axisLine:{
                            lineStyle:{
                                color:'#666'
                            }
                        },
                        //x轴文字旋转
                        axisLabel:{
                            rotate:30,
                            interval:0
                        },
                    },
                    yAxis : [
                        {
                            type : 'value',
                            axisLabel : {
                                formatter: '{value}%'
                            }
                        }
                    ],
                    series: [{
                        data: self.linedata,
                        type: 'line',
                        color:['#3499db'],
                        itemStyle : { normal: {
                                label : {
                                    show: true,
                                    formatter: '{c}%'
                                },
                            }}
                    }]
                });
                this.chart.hideLoading();
            },
            //时间选择
            selecttime(data){
                this.currentmonth = data;
                this.init();
            },
            typeselect(data){
                this.trendSelect = data.name;
                this.type = data.key;
                this.typeconfig.show = false;
                this.initline();
            },
            back(){
                this.$router.push({
                    name: 'fdAttendance_history',
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    ul.stu-list {
        background: #fff;
        margin-bottom: .15rem;
        color: #666;
        padding: 0 .15rem;
        li {
            display: flex;
            position: relative;
            border-bottom: 1px solid #eee;
            span {
                flex: 1;
                width: 0;
                line-height: .6rem;
                text-align: center;
            }
        }
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
    .trend {
        background: #fff;
        color: #666;
        padding: .2rem 0;
        p {
            color: #333;
            line-height: .6rem;
            padding: 0 .2rem;
            margin: 0;
            display: flex;
            justify-content: space-between;
            span:first-child {
                font-weight: bold;
                font-size: .35rem;
            }
        }
        .trend-select {
            padding: 6px;
            border: 1px solid #c3c3c3;
            border-radius: 6px;
        }
        .trend-content {
            height:5rem;
            padding:0.2rem;
            background:#fff;
            #echarts-trend {
                /*需要制定具体高度，以px为单位*/
                height: 100%;
                width:100%;
            }
        }
    }
    .ranking {
        background: #fff;
        color: #666;
        p {
            line-height: .6rem;
            color: #333;
            font-weight: bold;
            font-size: .35rem;
            padding: 0 .2rem;
            margin: 0;
        }
    }
    .rate {
        background: #fff;
        color: #666;
        padding: .2rem 0;
        p {
            line-height: .6rem;
            color: #333;
            font-weight: bold;
            font-size: .35rem;
            padding: 0 .2rem;
            margin: 0;
            display: flex;
            justify-content: space-between;
            img{
                width: .4rem;
                vertical-align: middle;
            }
        }
        .rate-content {
            height:5rem;
            padding:0.2rem;
            background:#fff;
            #echarts-rate {
                /*需要制定具体高度，以px为单位*/
                height: 100%;
                width:100%;
            }
        }
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
        background: url("../../assets/images/you-jiantou.png") 0 0 no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 0.2rem;
        top: 0.15rem;
    }
</style>
