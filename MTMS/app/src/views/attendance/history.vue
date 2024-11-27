<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <a @click="back()" class="header-back-btn">
                    <img src="../../assets/images/icon_fanhui.png" />
                </a>
            </div>
            查看历史
            <div slot="headerRight">
                <!-- <router-link class="right-icon" to="/attendance/analysis"> -->
                <router-link class="right-icon" :to="{ name: 'fdAttendance_analysis' }">
                    <img src="../../assets/images/analysis.png" />
                </router-link>
            </div>
        </c-header>
        <div class="header-date" @click="timeconfig.show = true">
            <span>{{yearmonth}}</span>
            <span>日期</span>
        </div>
        <div class="g-main">
            <ul v-show="!noContent">
                <li class="date-flag">
                    <span>{{yearmonth | substr(0,4)}}年{{yearmonth | substr(5,2)}}月</span>
                    <span>平均签到率{{list.averagerate | rate}}</span>
                </li>
                <li>
                    <span>日期</span>
                    <span style="padding-right: .4rem;">签到率</span>
                </li>
                <li v-for="(item,index) in list.list" @click="todetail(item.workdate)">
                    <span>{{item.workdate | substr(0,4)}}年{{item.workdate | substr(5,2)}}月{{item.workdate | substr(8,2)}}日</span>
                    <span class="choice">{{item.signpercent | rate}}</span>
                </li>
            </ul>
        </div>
        <!--时间选择-->
        <add-group :config = 'timeconfig' :data-list="timelist" @confirm = "timeselect">

        </add-group>
        <no-content v-if='noContent'></no-content>
    </div>
</template>
<script>
    import methods from '../../methods';
    import { mapState, mapActions } from 'vuex'
    import cHeader from '../header';
    import cPicker from '../../components/default-picker';
    import addGroup from '../../components/add-group';
    import noContent from '../no_content';
    export default {
        props: ['active'],
        data() {
            return {
                yearmonth:'',
                averagerate:'',
                list:[],
                timeconfig:{
                    show:false,
                    label:'name',
                    fixedtop:'1.5rem',
                    fixedright:'.1rem'
                },
                timelist:[

                ],
                noContent:false
            }
        },
        components: {
            cPicker,
            addGroup,
            noContent,
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
            let lastmonth = '';
            let year = new Date().getFullYear();
            let _month = new Date().getMonth()+1;
            let month = _month < 10 ? '0'+_month : _month;
            let day = new Date().getDate();
            let __month = ['01','02','03','04','05','06','07','08','09','10','11','12'];
            this.yearmonth = this.turninfo.signindata ? this.turninfo.signindata : year + '-' + month;
            if(this.turninfo.signindata == ''){
                this.setTurninfo({k:'signindata',v:this.yearmonth});
            }
            for(let i = 0 ; i<_month ; i++) {
                this.timelist.push(
                    {
                        name:year + '年' + __month[i] + '月',
                        value: year + '-' + __month[i],// '-' + lastmonth,
                        isused:1
                    }
                )
            }
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
                'toast',
                'setTurninfo'
            ]),
            init(){
                let self = this;
                this.post('/workattendance/getworkattendancedaysign',{
                    command:'workattendance/getworkattendancedaysign',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    systype:this.systype,
                    deptid: this.singindept,
                    yearmonth: this.yearmonth,
                    stdtype:self.turnstatus
                }).done( res => {
                    if(res && res.errcode){
                        if(res.errcode == 0){
                            self.list = res.result;
                            self.timeconfig.show = false;
                            if(self.list.list.length == 0){
                                self.noContent = !self.noContent;
                            }else {
                                self.noContent = false;
                            }
                        }else {
                            self.toast(res.errdesc);
                        }
                    }else {
                        self.toast('系统错误，请联系管理员~')
                    }
                });
            },
            //时间选择
            timeselect(data){
                this.yearmonth = data.value;
                this.setTurninfo({k:'signindata',v:data.value});
                this.init();
            },
            //查看每日详情
            todetail(param){
                this.setTurninfo({k:'workdate',v:param});
                this.$router.push({
                    name: 'fdAttendance_history_detail',
                })
            },
            //查看分析
            toAnalysis(){

            },
            back(){
                this.setTurninfo({k:'signindata',v:''});
                this.$router.push({
                    name: 'fdAttendance_main',
                    query:{
                        systype:this.systype,
                        menutype:this.turnstatus
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .right-icon {
        img {
            width: .35rem;
        }
    }
    .header-date {
        display: flex;
        justify-content: space-between;
        padding: 0 .2rem;
        background: #fff;
        margin-bottom: .2rem;
        span {
            line-height: .65rem;
        }
        span:last-child {
            color: #3499db;
        }
    }
    ul {
        background: #fff;
        margin-bottom: .15rem;
        color: #666;
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
        .date-flag {
            display: flex;
            flex-direction: column;
            padding: 0 .2rem;
            span {
                width: 100%;
                line-height: .5rem;
                text-align: left;
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
