<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            考勤
        </c-header>
        <div class="g-main">
            <p>
                {{now | substr(0,4)}}年{{now | substr(5,2)}}月
            </p>
            <div class="census-content">
                <div id="echart"></div>
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
                opinion: ['签到', '请假', '缺勤', '迟到', '早退', '其他'],
                opinionData: [
                    {'value': 12 || 0, 'name': '签到'},
                    {'value': 24, 'name': '请假'},
                    {'value': 3, 'name': '缺勤'},
                    {'value': 25, 'name': '迟到'},
                    {'value': 17, 'name': '早退'},
                    {'value': 19, 'name': '其他'}
                ],
                now:''
            }
        },
        components: {
            cHeader
        },
        watch:{

        },
        filters:{

        },
        computed:{
            ...mapState([
                'turninfo'
            ]),
        },
        created() {
            this.now = this.turninfo.signindata;
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
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast'
            ]),
            init(){
                let self = this;
                this.post('/workattendance/workattendanceteacher',{
                    command:'workattendance/workattendanceteacher',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    uid:this.turninfo.stuid,
                    businessid:this.turninfo.actionplanid,
                    yearmonth:this.now,
                }).done( res => {
                    self.opinionData='';
                    self.opinionData=[
                        {'value':res.bean.signpercent ,'name':'签到'},
                        {'value':res.bean.leavepercent,'name':'请假'},
                        {'value':res.bean.absencepercent,'name':'缺勤'},
                        {'value':res.bean.latepercent,'name':'迟到'},
                        {'value':res.bean.earlyretreatpercent,'name':'早退'},
                        {'value':res.bean.otherpercent,'name':'其他'},
                    ];
                    this.$nextTick(function() {
                        this.drawGraph('echart')}
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
                        data: self.opinion,
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
                            data:self.opinionData,
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
            back(){
                this.$router.push({
                    name: 'fdRotation_doctor_singin',
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    p {
        margin: 0;
        line-height: .6rem;
        padding: 0 .2rem;
    }
    .census-content {
        display: flex;
        height:5rem;
        padding:0.2rem;
        background:#fff;
        #echart {
            /*需要制定具体高度，以px为单位*/
            height: 100%;
            width:100%;
        }
    }
    .info {
        background: #fff;
        margin-top: 0.2rem;
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
</style>
