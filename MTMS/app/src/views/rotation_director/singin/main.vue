<template>
    <div class="g-wrapper">
        <c-header>
            <div slot="headerLeft">
                <!-- <router-link class="header-back-btn" to="/rt/rotation_teacher"> -->
                <router-link class="header-back-btn" :to="{ name: 'fdRotation_teacher' }">   
                    <img src="../../../assets/images/icon_fanhui.png" />
                </router-link>
            </div>
            考勤
            <div slot="headerRight">
                <!-- <router-link class="right-icon" to="/rt/rotation_doctor/analysis"> -->
                <router-link class="header-back-btn" :to="{ name: 'fdRotation_doctor_analysis' }">  
                    <img src="../../../assets/images/analysis.png" />
                </router-link>
            </div>
        </c-header>
        <div class="header-date" @click="timeconfig.show = true">
            <span>{{checkdDate}}</span>
            <span>日期</span>
        </div>
        <div class="g-main">
            <ul v-for="(item,index) in list" v-show="!noContent">
                <li class="date-flag">
                    <p>
                        {{now | substr(0,4)}}年{{now | substr(5,2)}}月&emsp;{{turninfo.stuname}}
                    </p>
                    <span>平均签到率{{item.averagerate | rate}}</span>
                </li>
                <li :class="{ 'noclick':val.editflag == 0}" v-for="(val,index) in item.beanlist" @click="status.show = true , id = val.id">
                    <span>{{val.workdatestr | substr(0,4)}}年{{val.workdatestr | substr(5,2)}}月{{val.workdatestr | substr(8,2)}}日</span>
                    <span :class="{'choice':val.editflag == 1}">{{val.workattendancename}}</span>
                </li>
            </ul>
        </div>
        <!--时间选择-->
        <add-group :config = 'timeconfig' :data-list="timelist" @confirm = "timeselect">

        </add-group>
        <!--更新状态-->
        <c-picker :config="status" @confirm="changeSinginStatus">

        </c-picker>
        <no-content v-if='noContent'></no-content>
    </div>
</template>
<script>
    import methods from '../../../methods';
    import { mapState, mapActions } from 'vuex'
    import cHeader from '../../header';
    import cPicker from '../../../components/default-picker';
    import addGroup from '../../../components/add-group';
    import noContent from '../../no_content';
    export default {
        props: ['active'],
        data() {
            return {
                id:'',
                stuid:'',
                plandetailid:'',
                list:'',
                checkdDate:'选择日期',
                now:'',
                status:{
                    show:false,
                    mainlist:[],
                    valueKey:'name'
                },
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
            'now':function(val,oldval){
                if(val !== oldval){
                    this.setTurninfo({k:'signindata',v:this.now});
                }
            }
        },
        filters:{
            'rate':function(value){
                return Number(value).toFixed(2) + '%';
            }
        },
        computed:{
            ...mapState([
                'turninfo'
            ]),
        },
        created() {
            let self = this;
            let lastmonth = '' ;
            let _year = new Date().getFullYear();
            let _month = new Date().getMonth()+1;
            let month = _month < 10 ? '0'+_month : _month;
            let __month = ['01','02','03','04','05','06','07','08','09','10','11','12'];
            this.now = (new Date().getFullYear()) + '-' + month;
            for(let i = 0 ; i<_month ; i++) {
                    self.timelist.push(
                        {
                            name:_year + '年' + __month[i] + '月',
                            value: _year + '-' + __month[i],
                            isused:1
                        }
                    )
            }
        },
        mounted() {
            let self = this;
            this.initstatus();
            this.registerToNative('goBack', function (data) {
                self.$router.push({
                    name: 'fdRotation_teacher_director',
                })
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
                this.post('/workattendance/getuserworkattendance',{
                    command:'workattendance/getuserworkattendance',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    uid:this.turninfo.stuid,
                    businessid:this.turninfo.actionplanid,
                    yearmonth:self.now
                }).done( res => {
                    if(res && res.errcode){
                        if(res.errcode == 0){
                            self.list = res.list;
                            self.timeconfig.show = false;
                            if(self.list[0].beanlist.length == 0){
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
            initstatus(){
                let self = this;
                this.post('/traineestudent/queryDictionaryList',{
                    command:'traineestudent/queryDictionaryList',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    code:'workattendancetype'
                }).done( res => {
                    if(res && res.errcode){
                        if(res.errcode == 0){
                            self.status.mainlist = res.dic_list;
                            self.init();
                        }else {
                            self.toast(res.errdesc);
                        }
                    }else {
                        self.toast('系统错误，请联系管理员~')
                    }
                });
            },
            // 修改状态
            changeSinginStatus(data){
                let self = this;
                this.post('/workattendance/updateworkattendance',{
                    command:'workattendance/updateworkattendance',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    id:self.id,
                    workattendancetype:data.key
                }).done( res => {
                    if(res && res.errcode){
                        if(res.errcode == 0){
                            self.status.show = false;
                            self.toast('修改成功~');
                            self.init();
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
                this.now = data.value;
                this.init();
            },
        }
    }
</script>
<style lang="scss" scoped>
    p {
        margin: 0;
        padding: 0;
    }
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
                line-height: .7rem;
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
            p {
                line-height: .5rem;
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
    .noclick {
        pointer-events: none;
    }
</style>
