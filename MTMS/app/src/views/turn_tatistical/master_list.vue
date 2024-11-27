<template>
    <div class="g-main">
        <!--科室评分-->
        <div  v-if="code == 0 && getTatistial.systype == '1' ">
            <div class="master-office" v-for="(item,index) in listOffice">
                <p>
                    <span v-if="index == 0">{{item.month}}</span>
                    <span v-if="index == 1">{{selecttime}}</span>
                    <span v-if="index == 0 && code == 0" style="color: #3499db;" @click="yearconfig.show = true">日期</span>
                    <span v-if="index == 0 && code == 1" style="color: #3499db;" @click="monthconfig.show = true">日期</span>
                </p>
                <ul>
                    <li>
                        <span v-if="code == 1">姓名</span>
                        <span :class="{'changeup':code == 1}" @click="code == 1 ? changeup() : undefined">平均分</span>
                        <span>最高分</span>
                        <span>最低分</span>
                        <span v-if="code == 0">评分日期</span>
                    </li>
                    <li v-for="(val,index) in item.evaluationscorelist" @click="todetail(val.evaluatedid,val.evaluationmonth)">
                        <span v-if="code == 1">{{val.name}}</span>
                        <span>{{val.avgscore | fen }}</span>
                        <span>{{val.maxscore | fen }}</span>
                        <span :class="{'choice':code == 1}">{{val.minscore | fen }}</span>
                        <span v-if="code == 0" class="choice">{{val.evaluationmonth}}</span>
                    </li>
                    <li v-if="item.evaluationscorelist.length == 0" style="text-align: center"><span>暂无内容</span></li>
                </ul>
            </div>
        </div>

        <!--带教评分-->
        <div v-if="code == 1">
            <div class="master-office" v-for="(item,index) in listOffice">
                <p>
                    <span>
                        {{selecttime}}
                        <div v-if="code == 1 && item.allavgscore">{{item.allavgscore}}</div>
                    </span>
                    <span v-if="index == 0 && code == 0" style="color: #3499db;" @click="yearconfig.show = true">日期</span>
                    <span v-if="index == 0 && code == 1" style="color: #3499db;" @click="monthconfig.show = true">日期</span>
                </p>

                <ul>
                    <li>
                        <span v-if="code == 1">姓名</span>
                        <span :class="{'changeup':code == 1}" @click="code == 1 ? changeup() : undefined">平均分</span>
                        <span>最高分</span>
                        <span>最低分</span>
                        <span v-if="code == 0">评分日期</span>
                    </li>
                    <li v-for="(val,index) in item.evaluationscorelist" @click="todetail(val.evaluatedid,val.evaluationmonth)">
                        <span v-if="code == 1">{{val.name}}</span>
                        <span>{{val.avgscore | fen}}</span>
                        <span>{{val.maxscore | fen}}</span>
                        <span :class="{'choice':code == 1}">{{val.minscore | fen}}</span>
                        <span v-if="code == 0" class="choice">{{val.evaluationmonth}}</span>
                    </li>
                    <li v-if="item.evaluationscorelist.length == 0" style="text-align: center"><span>暂无内容</span></li>
                </ul>
            </div>
        </div>
        <!--教学活动-->
        <div v-if="code == 2">
            <div class="master-office"  v-for="(item,index) in listPlan">
                <p>
                    <span>{{item.year}}</span>
                    <span v-if="index == 0" style="color: #3499db" @click="yearconfig.show = true">日期</span>
                </p>
                <ul>
                    <li>
                        <span :class="{'choice':code == 1}">活动次数</span>
                        <span :class="{'choice':code == 1}">平均签到率</span>
                        <span>日期</span>
                    </li>
                    <li v-for="(val,index) in item.beanlist" @click="todetail(val.deptid,val.yearmonth)">
                        <span>{{val.actionplancount}}</span>
                        <span>{{val.signpercent | rate }}</span>
                        <span class="choice">{{val.yearmonth}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <!--考勤统计-->
        <div v-if="code == 3">
            <div class="master-office"  v-for="(item,index) in listAttendance">
                <p>
                    <span>{{item.year}}</span>
                    <span v-if="index == 0" style="color: #3499db;" @click="yearconfig.show = true">日期</span>
                </p>
                <ul>
                    <li>
                        <span>签到率</span>
                        <span>旷工率</span>
                        <span>请假率</span>
                        <span>迟到率</span>
                        <span>早退率</span>
                        <span>日期</span>
                    </li>
                    <li v-for="(val,index) in item.beanlist"  @click="todetail(val.deptid,val.yearmonth)">
                        <span>{{val.signpercent | rate }}</span>
                        <span>{{val.absencepercent | rate }}</span>
                        <span>{{val.leavepercent | rate }}</span>
                        <span>{{val.latepercent | rate }}</span>
                        <span>{{val.earlyleavepercent | rate }}</span>
                        <span class="choice">{{val.yearmonth}}</span>
                    </li>
                </ul>
            </div>
        </div>
        <!--选择要看的年-->
        <c-picker :config="yearconfig" @confirm="timeselect">

        </c-picker>
        <!--选择要看的月份-->
        <c-timepicker :config="monthconfig" @confirm="timeselect" :year="year" :month="month">

        </c-timepicker>
    </div>
</template>
<script>
    import methods from '../../methods';
    import { mapState, mapActions, mapGetters } from 'vuex'
    import cPicker from '../../components/default-picker'
    import cTimepicker from '../../components/timepicker';
    import noContent from '../no_content';
    export default {
        props: ['code'],
        data() {
            return {
                dept:'',
                noshownotlist:false,
                listOffice:[],
                listPlan: '',
                listAttendance:'',
                ordertype:1,
                selecttime:'',
                yearconfig:{
                    show:false,
                    mainlist:[
                        {
                            val:2018
                        }
                    ],
                    valueKey:'val'
                },
                monthconfig:{
                    show:false,
                    istime:false,
                    custom:true
                },
                year:[2018],
                month:[1,12],
            }
        },
        components: {
            cPicker,
            cTimepicker,
            noContent
        },
        watch:{
            'code':function(val,oldval){
                let self = this;
                if((val || val == 0) && val !== oldval){
                    this.listOffice = [];
                    if(val === 0 || val === '0'){
                        self.selecttime = new Date().getFullYear();
                        if(this.getTatistial.systype == 1){
                            this.initOffice(5)
                        }else{
                            if(this.$route.query.menutype==1){
                                this.initOffice(18);
                            }else{
                                this.initOffice(8);
                            }
                        }
                    }else if(val == 1){
                        let _month = new Date().getMonth()+1;
                        let month = _month < 10 ? '0'+_month : _month;
                        this.selecttime = (new Date().getFullYear()) + '-' + month;
                        if(this.getTatistial.systype == 1){
                            this.initOffice(1)
                        }else{
                            if(this.$route.query.menutype==1){
                                this.initOffice(18);
                            }else{
                                this.initOffice(8);
                            }
                        }
                    }else if(val == 2){
                        self.selecttime = new Date().getFullYear();
                        self.initActionplan();
                    }else if(val == 3){
                        self.selecttime = new Date().getFullYear();
                        self.initAttendance();
                    }
                }
            },
            'selecttime':function(val,oldval) {
                if (val) {
                    this.setTatistical({'k': 'selecttime', 'v': val})
                }
            },
            'getTatistial.dept':function(val,oldval){
                if(val !== oldval){
                    if(this.getTatistial.systype == 1){
                        if(this.code === 0 || this.code === '0'){
                            this.initOffice(5)
                        }else if(this.code == 1){
                            this.initOffice(1)
                        }else if(this.code == 2){
                            this.initActionplan()
                        }else if(this.code == 3){
                            this.initAttendance()
                        }
                    }else{
                        if(this.code === 0 || this.code === '0'){
                            if(this.$route.query.menutype==1){
                                this.initOffice(18);
                            }else{
                                this.initOffice(8);
                            }
                        }else if(this.code == 1){
                            if(this.$route.query.menutype==1){
                                this.initOffice(18);
                            }else{
                                this.initOffice(8);
                            }
                        }else if(this.code == 2){
                            this.initActionplan()
                        }else if(this.code == 3){
                            this.initAttendance()
                        }
                    }

                }
            }
        },
        filters:{
            'rate':function(value){
                if(!value){
                    if(parseInt(value) == 0){
                        return Number(value).toFixed(2) + '%';
                    }else{
                        return '-'
                    }
                }else{
                    return Number(value).toFixed(2) + '%';
                }
            },
            'fen':function(value){
                if(value){
                    return Number(value).toFixed(2) + '分';
                }
            }
        },
        computed:{
            ...mapGetters([
                'getTatistial'
            ]),
        },
        created() {
            let nowyear = new Date().getFullYear();
            let nowyear20 = new Date().getFullYear() + 20;
            this.year.push(nowyear);
            if(nowyear - 2018 > 0){
                let len = nowyear - 2018
                for(let i=1;i<=len;i++){
                    this.yearconfig.mainlist.push({'val':2018 + i})
                }
            }
            for(let i=1;i<20;i++){
                this.yearconfig.mainlist.push({'val':nowyear + i})
            }
            if(this.code === 1){
                let _month = new Date().getMonth()+1;
                let month = _month < 10 ? '0'+_month : _month;
                this.selecttime = (new Date().getFullYear()) + '-' + month;
            }else {
                this.selecttime = nowyear;
            }
            if(!this.getTatistial.dept){
                this.initrole();
            }else {

                if(this.getTatistial.systype == 1){
                    if(this.code === 0){
                        this.initOffice(5)
                    }else if(this.code === 1){
                        this.initOffice(1)
                    }else if(this.code === 2){
                        this.initActionplan();
                    }else if(this.code === 3){
                        this.initAttendance();
                    }
                }else{
                    if(this.code === 0){
                        if(this.$route.query.menutype==1){
                            this.initOffice(18);
                        }else{
                            this.initOffice(8);
                        }
                    }else if(this.code === 1){
                        if(this.$route.query.menutype==1){
                            this.initOffice(18);
                        }else{
                            this.initOffice(8);
                        }
                    }else if(this.code === 2){
                        this.initActionplan();
                    }else if(this.code === 3){
                        this.initAttendance();
                    }
                }
            }
        },
        mounted() {

        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast',
                'setTatistical'
            ]),
            initrole(){
                let self = this;
                this.post('/turnbaseinfo/querydeptnodebyuid',{
                    command:'turnbaseinfo/querydeptnodebyuid',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    uid:$.cookie('uid'),
                }).done( res => {
                    if(res && res.errcode){
                        if(res.errcode == 0){
                            if(!this.dept){
                                self.deptname = res.depttreelist[0].deptname;
                                self.dept = res.depttreelist[0].id;
                            }
                            if(!this.getTatistial.systype || !this.deptname){
                                self.setTatistical({k:'dept',v:res.depttreelist[0].id});
                                self.setTatistical({k:'deptname',v:self.deptname});
                            }
                            if(!this.getTatistial.role){
                                if(res.depttreelist[0].deptcode == 'office'){
                                    self.role = 0;
                                    self.setTatistical({k:'role',v:self.role});
                                }else {
                                    self.role = 1;
                                    self.setTatistical({k:'role',v:self.role});
                                }
                            }

                            if(this.getTatistial.systype == 1){
                                if(this.code === 0 && self.role == 0){
                                    this.initOffice(5)
                                }else if(this.code === 1){
                                    this.initOffice(1)
                                }else if(this.code === 2){
                                    this.initActionplan();
                                }else if(this.code === 3){
                                    this.initAttendance();
                                }
                            }else{
                                if(this.code === 0){
                                    if(this.$route.query.menutype==1){
                                        this.initOffice(18);
                                    }else{
                                        this.initOffice(8);
                                    }
                                }else if(this.code === 1){
                                    if(this.$route.query.menutype==1){
                                        this.initOffice(18);
                                    }else{
                                        this.initOffice(8);
                                    }
                                }else if(this.code === 2){
                                    this.initActionplan();
                                }else if(this.code === 3){
                                    this.initAttendance();
                                }
                            }
                        }else {
                            self.toast(res.errdesc);
                        }
                    }else {
                        self.toast('系统错误，请联系管理员~')
                    }
                });
            },
            initOffice(param){
                console.log(param)
                let self = this;
                let opitions = {};
                if(!this.getTatistial.dept){
                    return
                }
                if(this.getTatistial.isback === 1){//返回的时候取 vuex 存的值，因为tab切换的时候此方法会在vuex值改变之前执行
                    this.selecttime = this.getTatistial.selecttime
                    opitions.evaluationmonth = this.getTatistial.selecttime
                }else {
                    opitions.evaluationmonth = this.selecttime
                }
                this.post('/turnevaluate/queryevaluationscorelist',{
                    command:'turnevaluate/queryevaluationscorelist',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    deptid:this.getTatistial.dept,
                    evaluationtype:param,
                    ordertype:this.ordertype,
                    ...opitions
                }).done( res => {
                    if(res && res.errcode){
                        if(res.errcode == 0){
                            self.listOffice = [] ;
                            self.listOffice.push(res);
                            self.setTatistical({k:'isback',v:0});
                        }else {
                            self.toast(res.errdesc);
                        }
                    }else {
                        self.toast('系统错误，请联系管理员~')
                    }
                });
                // this.post('/turn/queryevaluatedlist',{
                //     command:'turn/queryevaluatedlist',
                //     sessionid:$.cookie('sid'),
                //     loginid:$.cookie('uid'),
                //     startdate: opitions.evaluationmonth,
                //     enddate: opitions.evaluationmonth,
                //     baseid: "",
                //     type: param,
                //     doctoroffice: this.getTatistial.dept,
                //     evaluateflag: "1"
                // }).done(res => {
                //     if(res.errcode == 0) {
                //         self.listOffice = [] ;
                //         self.listOffice.push(res.evaluatedlist);
                //         self.setTatistical({k:'isback',v:0});
                //     }
                    
                // })
            },
            initActionplan(){
                let self = this;
                let opitions = {};
                if(this.getTatistial.isback === 1){//返回的时候取 vuex 存的值，因为tab切换的时候此方法会在vuex值改变之前执行
                    this.selecttime = this.getTatistial.selecttime;
                    let _year = this.getTatistial.selecttime;
                    if(String(_year).length > 4){
                        opitions.year = String(_year).substring(0, 4);
                    }else{
                        opitions.year = this.getTatistial.selecttime;
                    }
                }else {
                    opitions.year = this.selecttime
                }
                if(this.$route.query.menutype==1){
                    opitions.stdtype=2;
                }
                this.post('/turnanalysismanager/actionplansignanalysis',{
                    command:'turnanalysismanager/actionplansignanalysis',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    deptid:this.getTatistial.dept,
                    systype:this.getTatistial.systype,
                    ...opitions
                }).done( res => {
                    if(res && res.errcode){
                        if(res.errcode == 0){
                            self.listPlan = [] ;
                            self.listPlan = res.result;
                        }else {
                            self.toast(res.errdesc);
                        }
                    }else {
                        self.toast('系统错误，请联系管理员~')
                    }
                });
            },
            initAttendance(){
                let self = this;
                let opitions = {};
                if(this.getTatistial.isback === 1){//返回的时候取 vuex 存的值，因为tab切换的时候此方法会在vuex值改变之前执行
                    this.selecttime = this.getTatistial.selecttime;
                    let _year = this.getTatistial.selecttime;
                    if(String(_year).length > 4){
                        opitions.year = String(_year).substring(0, 4);
                    }else{
                        opitions.year = this.getTatistial.selecttime;
                    }
                }else {
                    opitions.year = this.selecttime
                }
                if(this.$route.query.menutype==1){
                    this.stdtype=2;
                }
                this.post('/turnanalysismanager/workattendanalysis',{
                    command:'turnanalysismanager/workattendanalysis',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    deptid:this.getTatistial.dept,
                    systype:this.getTatistial.systype,
                    ...opitions
                }).done( res => {
                    if(res && res.errcode){
                        if(res.errcode == 0){
                            self.listAttendance = [] ;
                            self.listAttendance = res.result;
                        }else {
                            self.toast(res.errdesc);
                        }
                    }else {
                        self.toast('系统错误，请联系管理员~')
                    }
                });
            },
            changeup(){
                this.ordertype = this.ordertype == 1 ? 0 :1;
                if(this.getTatistial.systype ==1){
                    this.initOffice(1);
                }else{
                    if(this.$route.query.menutype==1){
                        this.initOffice(18);
                    }else{
                        this.initOffice(8);
                    }
                }
            },
            timeselect(param){
                //如果选择的就是当前年份就return掉
                if(param.val == this.selecttime){
                    this.yearconfig.show = false;
                    this.monthconfig.show = false;
                    return
                }
                this.setTatistical({k:'isback',v:0});
                if(this.getTatistial.systype ==1){
                    if(this.code == 0){
                        this.selecttime = param.val;
                        this.initOffice(5);
                    }else if(this.code == 1){
                        this.selecttime = param;
                        this.initOffice(1);
                    }else if(this.code == 2){
                        this.selecttime = param.val;
                        this.initActionplan();
                    }else if(this.code == 3){
                        this.selecttime = param.val;
                        this.initAttendance();
                    }
                }else{
                    if(this.code == 0){
                        this.selecttime = param.val;
                        if(this.$route.query.menutype==1){
                            this.initOffice(18);
                        }else{
                            this.initOffice(8);
                        }
                    }else if(this.code == 1){
                        this.selecttime = param;
                        if(this.$route.query.menutype==1){
                            this.initOffice(18);
                        }else{
                            this.initOffice(8);
                        }
                    }else if(this.code == 2){
                        this.selecttime = param.val;
                        this.initActionplan();
                    }else if(this.code == 3){
                        this.selecttime = param.val;
                        this.initAttendance();
                    }
                }

                this.setTatistical({'k': 'selecttime', 'v': this.selecttime})
                this.yearconfig.show = false;
                this.monthconfig.show = false;
            },
            todetail(id,month){
                this.$router.push({
                    name: 'fdTatistical_detail',
                    query:{
                        id:id,
                        month:month
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .master-office {
        color: #666;
        p {
            display: flex;
            justify-content: space-between;
            padding: .2rem;
            margin: 0;
            border-bottom: 1px solid #e0e0e0;
            span{
                div{
                    margin-top: .1rem;
                }
            }
        }
        ul {
            background: #fff;
            li {
                display: flex;
                padding: 0 .2rem;
                border-bottom: 1px solid #e0e0e0;
                position: relative;
                span {
                    width: 0;
                    flex: 1;
                    text-align: center;
                    line-height: .6rem;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }

            }
        }
    }
    .changeup {
        position: relative;
    }
    .changeup::after {
        content: '';
        display: inline-block;
        width: 0.3rem;
        height: 0.3rem;
        background: url("../../assets/images/icon-updown.png") 0 0 no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: -.1rem;
        top: 0.15rem;
    }
    .choice:after {
        content: '';
        display: inline-block;
        width: 0.3rem;
        height: 0.3rem;
        background: url("../../assets/images/you-jiantou.png") 0 0 no-repeat;
        background-size: 100% 100%;
        position: absolute;
        right: 0.05rem;
        top: 0.15rem;
    }
</style>
