<template>
    <div class="g-main">
        <!--科室评分 && 带教评分-->
        <div v-if="code == 0 || code == 1">
            <div class="master-office">
                <p>
                    <span>{{selecttime}}</span>
                    <span style="color: #3499db;" @click="monthconfig.show = true">日期</span>
                </p>
                <p v-if="code == 0 && ranking">
                    <span>{{selecttime}} 全院排名: {{ranking}}</span>
                </p>
                <div class="echarts-content">

                    <div id="echarts-trend" v-show="code == 0">

                    </div>
                    <div id="echarts-rate" v-show="code !== 0">

                    </div>
                </div>
            </div>
        </div>
        <div v-if="code == 2"  class="master-office">
            <p>
                <span>{{selecttime}}</span>
                <span style="color: #3499db;" @click="monthconfig.show = true">日期</span>
            </p>
            <div class="echarts-content-plan">
                <div id="echarts-rate-plan">

                </div>
                <div id="echarts-trend-plan">

                </div>
            </div>
        </div>
        <div v-if="code == 3">
            <div class="trend">
                <p>
                    <span></span>
                    <span class="trend-select" @click="typeconfig.show = true">
                        {{trendSelect}}
                    </span>
                </p>
                <div class="trend-content">
                    <div id="echarts-trends">

                    </div>
                </div>
            </div>
            <div class="rate">
                <p>
                    <span>
                        {{currentmonth | substr(0,4)}}年{{currentmonth | substr(5,2)}}月
                    </span>
                    <span class="rate-select" @click="monthconfig.show = true">
                        <img src="../../assets/images/icon_rili.png" alt="">
                    </span>
                </p>
                <div class="rate-content">
                    <div id="echarts-rates">

                    </div>
                </div>
            </div>
        </div>
        <div v-show = 'code !== 3' class="tatistical">
            <div class="tatistical-improve">
                <p>
                    <span>需要改进的地方（评分3分以下）</span>
                    <span class="show-icon"></span>
                </p>
                <ul>
                    <li v-for="(item,index) in improvelist">{{index + 1}}.{{item}}</li>
                    <li v-show="improvelist.length == 0" style="text-align: center">当前月暂无内容</li>
                </ul>
            </div>
            <div class="tatistical-advice">
                <p>学员建议</p>
                <ul>
                    <li v-for="(item,index) in advicelist">{{index + 1}}.{{item}}</li>
                    <li v-show="advicelist.length == 0" style="text-align: center">当前月暂无内容</li>
                </ul>
            </div>
        </div>
        <!--类型选择-->
        <add-group :config = 'typeconfig' :data-list="typelist" @confirm = "typeselect">

        </add-group>
        <!--选择要看的月份-->
        <c-timepicker :config="monthconfig" @confirm="timeselect" :year="year" :month="month">

        </c-timepicker>
    </div>
</template>
<script>
    import methods from '../../methods';
    import { mapState, mapActions } from 'vuex'
    import cPicker from '../../components/default-picker'
    import addGroup from '../../components/add-group';
    import cTimepicker from '../../components/timepicker';
    import echarts from'echarts/lib/echarts';
    import 'echarts/lib/component/tooltip';
    import 'echarts/lib/component/legend';
    import 'echarts/lib/chart/pie';
    import 'echarts/lib/chart/line'
    export default {
        props: ['code'],
        data() {
            return {
                dept:'',
                improvelist:'',
                advicelist:'',
                selecttime:'',
                ranking:'',//较上月排名
                currentmonth:'',
                trendSelect:'签到率',
                rateOpinion: [],
                rateOpinionData: [],
                lineXdata:[],
                linedata:[],
                typeconfig:{
                    show:false,
                    label:'name',
                    fixedtop:'2.46rem',
                    fixedright:'.1rem'
                },
                typelist:[
                    {
                        isused : 1,
                        name:'签到率',
                        type:'signpercent'
                    },{
                        isused : 1,
                        name:'缺勤率',
                        type:'absencepercent'
                    },{
                        isused : 1,
                        name:'早退率',
                        type:'earlyleavepercent'
                    },{
                        isused : 1,
                        name:'迟到率',
                        type:'latepercent'
                    },{
                        isused : 1,
                        name:'请假率',
                        type:'leavepercent'
                    },
                ],
                attendancelist:'',
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
            addGroup,
            cTimepicker
        },
        watch:{
            'code':function(val,oldval) {
                let self = this;
                if ((val || val == 0) && val !== oldval) {
                    self.normalmonth();
                    if(this.tatistcal.systype == 1){
                        if (val === 0 || val === '0') {
                            self.initOffice(5);
                            self.initOfficeAdvance(5);
                        } else if (val == 1) {
                            self.initTeaching(1);
                            self.initTeachingImprove(1);
                            self.initTeachingAdvance(1);
                        } else if (val == 2) {
                            self.initActionplanSis();
                            self.initActionplan();
                            self.initOfficeAdvance(6);
                        } else if (val == 3) {
                            self.trendSelect = self.typelist[0].name;
                            self.initAttendance();
                            self.initAttendanceRate();
                        }
                    }else{
                        if (val === 0 || val === '0') {
                            if(this.$route.query.menutype==1){
                                self.initOffice(18);
                                self.initOfficeAdvance(18);
                            }else{
                                self.initOffice(8);
                                self.initOfficeAdvance(8);
                            }

                        } else if (val == 1) {
                            if(this.$route.query.menutype==1){
                                self.initTeaching(18);
                                self.initTeachingImprove(18);
                                self.initTeachingAdvance(18);

                            }else{
                                self.initTeaching(8);
                                self.initTeachingImprove(8);
                                self.initTeachingAdvance(8);
                            }

                        } else if (val == 2) {
                            self.initActionplanSis();
                            self.initActionplan();
                            self.initOfficeAdvance(6);
                        } else if (val == 3) {
                            self.trendSelect = self.typelist[0].name;
                            self.initAttendance();
                            self.initAttendanceRate();
                        }
                    }
                }
            },
            'tatistcal.dept':function(val,oldval){
                if(val !== oldval){
                    this.dept = this.tatistcal.dept;
                    if(this.tatistcal.systype == 1){
                        if(this.code === 0 || this.code === '0'){
                            this.initOffice(5);
                            this.initOfficeAdvance(5);
                        }else if(this.code == 1){
                            this.initTeaching(1);
                            this.initTeachingImprove(1);
                            this.initTeachingAdvance(1);
                        }else if(this.code == 2){
                            this.initActionplanSis();
                            this.initActionplan();
                            this.initOfficeAdvance(6);
                        }else if(this.code == 3){
                            this.initAttendance();
                            this.initAttendanceRate();
                        }
                    }else{
                        if(this.code === 0 || this.code === '0'){
                            if(this.$route.query.menutype==1){
                                this.initOffice(18);
                                this.initOfficeAdvance(18);
                            }else{
                                this.initOffice(8);
                                this.initOfficeAdvance(8);
                            }

                        }else if(this.code == 1){
                            if(this.$route.query.menutype==1){
                                this.initTeaching(18);
                                this.initTeachingImprove(18);
                                this.initTeachingAdvance(18);
                            }else{
                                this.initTeaching(8);
                                this.initTeachingImprove(8);
                                this.initTeachingAdvance(8);
                            }
                        }else if(this.code == 2){
                            this.initActionplanSis();
                            this.initActionplan();
                            this.initOfficeAdvance(6);
                        }else if(this.code == 3){
                            this.initAttendance();
                            this.initAttendanceRate();
                        }
                    }

                }
            }
        },
        filters:{

        },
        computed:{
            ...mapState([
                'tatistcal'
            ]),
        },
        created() {
            this.dept = this.tatistcal.dept;
            this.deptname = this.tatistcal.deptname;
            this.normalmonth();
        },
        mounted() {
            if(this.tatistcal.systype == 1){
                this.initOffice(5);
                this.initOfficeAdvance(5);
            }else{
                if(this.$route.query.menutype==1){
                    this.initTeaching(18);
                    this.initTeachingImprove(18);
                    this.initTeachingAdvance(18);
                }else{
                    this.initTeaching(8);
                    this.initTeachingImprove(8);
                    this.initTeachingAdvance(8);
                }

            }
        },
        methods: {
            ...methods,
            ...mapActions([
                'showAlert',
                'showConfirm',
                'showLoading',
                'hideLoading',
                'toast',
            ]),
            //重置为当前月
            normalmonth(){
                let nowyear = new Date().getFullYear();
                let _month = new Date().getMonth()+1;
                let month = _month < 10 ? '0'+_month : _month;
                this.year.push(nowyear);
                if(nowyear > 2018){
                    this.yearconfig.mainlist.push(nowyear)
                }
                this.selecttime = (new Date().getFullYear()) + '-' + month;
                this.currentmonth = (new Date().getFullYear()) + '-' + month;
            },
            //科室评分
            initOffice(param){
                let self = this;
                this.post('/turnevaluate/querydeptavgscorestats',{
                    command:'turnevaluate/querydeptavgscorestats',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    deptid:this.dept,
                    evaluationmonth:self.selecttime,
                    evaluationtype:param,
                    systype:this.tatistcal.systype,
                }).done( res => {
                    if(res && res.errcode == 0){
                        self.lineXdata = [];
                        self.linedata = [];
                        res.deptavgscorelist.map( val => {
                            self.lineXdata.push(val.month);
                            self.linedata.push(val.avgscore);
                        });
                        self.$nextTick(function() {
                                self.drawLine('echarts-trend','科室评分趋势统计');
                            }
                        );
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            },
            initOfficeAdvance(param){
                let self = this;
                this.post('/turnevaluate/queryscoreanalysis',{
                    command:'turnevaluate/queryscoreanalysis',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    deptid:this.dept,
                    evaluationmonth:self.selecttime,
                    evaluationtype:param,
                    systype:this.tatistcal.systype,
                }).done( res => {
                    if(res && res.errcode == 0){
                    	if(res.adviselist){
                    		self.advicelist = res.adviselist;
                    	}else{
                    		self.advicelist = [];
                    	}
                        self.improvelist = res.improveinfo;
                        self.ranking = res.ranking;
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            },
            //带教评分
            initTeaching(param){
                let self = this;
                let opitions = {};
                if(typeof(this.dept) === 'number'){
                    let _dept = [];
                    _dept.push(this.dept)
                    opitions.deptidlist = _dept
                }else {
                    opitions.deptidlist = this.dept
                }
                this.post('/turnevaluate/queryscorestats',{
                    command:'turnevaluate/queryscorestats',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    evaluationmonth:self.selecttime,
                    evaluationtype:param,
                    ...opitions
                }).done( res => {
                    if(res && res.errcode == 0){
                        self.rateOpinionData=[];
                        self.rateOpinion=[];
                        res.scorestats.map(item => {
                            self.rateOpinionData.push({
                                'value':item.percent,
                                'name':item.graderange
                            });
                            self.rateOpinion.push(item.graderange)
                        });
                        self.$nextTick(function() {
                                self.drawGraph('echarts-rate','带教评分比例分析');
                            }
                        );
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            },
            initTeachingImprove(param){
                let self = this;
                let opitions = {};
                if(typeof(this.dept) === 'number'){
                    let _dept = [];
                    _dept.push(this.dept);
                    opitions.deptidlist = _dept
                }else {
                    opitions.deptidlist = this.dept
                }
                this.post('/turnevaluate/queryadviselist',{
                    command:'turnevaluate/queryadviselist',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    evaluationmonth:self.selecttime,
                    evaluationtype:param,
                    systype:this.tatistcal.systype,
                    pagenum:'',
                    pagepersize:'',
                    ...opitions
                }).done( res => {
                    if(res && res.errcode == 0){
                        if(res.adviselist){
                            self.advicelist = res.adviselist;
                        }else{
                            self.advicelist = [];
                        }
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            },
            initTeachingAdvance(param){
                let self = this;
                let opitions = {};
                if(typeof(this.dept) === 'number'){
                    let _dept = [];
                    _dept.push(this.dept);
                    opitions.deptidlist = _dept
                }else {
                    opitions.deptidlist = this.dept
                }
                this.post('/turnevaluate/queryimproveinfolist',{
                    command:'turnevaluate/queryimproveinfolist',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    evaluationmonth:self.selecttime,
                    evaluationtype:param,
                    systype:this.tatistcal.systype,
                    pagenum:'',
                    pagepersize:'',
                    ...opitions
                }).done( res => {
                    if(res && res.errcode == 0){
                        if(res.improveinfolist){
                            self.improvelist = res.improveinfolist;
                        }else{
                            self.improvelist = [];
                        }
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            },
            //教学活动
            initActionplan(){
                let self = this;
                this.post('/turnanalysismanager/actionmonthanalysispic',{
                    command:'turnanalysismanager/actionmonthanalysispic',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    deptid:this.dept,
                }).done( res => {
                    if(res && res.errcode == 0){
                        self.lineXdata = [];
                        self.linedata = [];
                        res.beanlist.map( val => {
                            self.lineXdata.push(val.yearmonth);
                            self.linedata.push(val.actionplancount);
                        });
                        self.$nextTick(function() {
                                self.drawLine('echarts-rate-plan','近6个月教学活动数量趋势');
                            }
                        );
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            //教学活动
            initActionplanSis(){
                let self = this;
                this.post('/turnanalysismanager/actionmonthsignanalysispic',{
                    command:'turnanalysismanager/actionmonthsignanalysispic',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    deptid:this.dept,
                    systype:this.tatistcal.systype
                }).done( res => {
                    if(res && res.errcode == 0){
                        self.lineXdata = [];
                        self.linedata = [];
                        res.beanlist.map( val => {
                            self.lineXdata.push(val.yearmonth);
                            self.linedata.push(val.signpercent || 0);
                        });
                        self.$nextTick(function() {
                                self.drawLine('echarts-trend-plan','近6个月教学活动签到率趋势');
                            }
                        );
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                })
            },
            //考勤统计
            initAttendance(){
                let self = this;
                this.post('/turnanalysismanager/workanalysispicnormal',{
                    command:'turnanalysismanager/workanalysispicnormal',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    systype:this.tatistcal.systype,
                    deptid:this.dept,
                }).done( res => {
                    if(res && res.errcode == 0){
                        self.attendancelist = res.beanlist;
                        self.lineXdata = [];
                        self.linedata = [];
                        if( res.beanlist.length > 0 ){
                            res.beanlist.map( val => {
                                self.lineXdata.push(val.yearmonth);
                                self.linedata.push(val.signpercent);
                            });
                        }
                        self.$nextTick(function() {
                                self.drawLine('echarts-trends','近六个月'+ self.trendSelect +'趋势');
                            }
                        );
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            },
            initAttendanceRate(){
                let self = this;
                this.post('/turnanalysismanager/monthworanalysispicnormal',{
                    command:'turnanalysismanager/monthworanalysispicnormal',
                    sessionid:$.cookie('sid'),
                    loginid:$.cookie('uid'),
                    systype:this.tatistcal.systype,
                    deptid:this.dept,
                    yearmonth:this.currentmonth
                }).done( res => {
                    if(res && res.errcode == 0){
                        self.rateOpinionData=[];
                        self.rateOpinion=[];
                        self.rateOpinionData=[
                            {'value':res.bean.signpercent ,'name':'签到'},
                            {'value':res.bean.leavepercent,'name':'请假'},
                            {'value':res.bean.absencepercent,'name':'缺勤'},
                            {'value':res.bean.latepercent,'name':'迟到'},
                            {'value':res.bean.earlyretreatpercent,'name':'早退'},
                            {'value':res.bean.otherpercent,'name':'其他'},
                        ];
                        self.rateOpinion = ['签到','请假','缺勤','迟到','早退','其他'];
                        self.$nextTick(function() {
                                self.drawGraph('echarts-rates','考勤分析');
                            }
                        );
                    }else if(res.errdesc){
                        self.toast(res.errdesc)
                    }else {
                        self.toast('服务器错误，请联系管理员。')
                    }
                });
            },
            //饼图
            drawGraph:function(id,name){
                var self = this;
                self.chart = echarts.init(document.getElementById(id));
                this.chart.showLoading();
                self.chart.setOption ({
                    title : {
                        text: name,
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
            //折线图
            drawLine:function(id,name){
                var self = this;
                self.chart = echarts.init(document.getElementById(id));
                let formatter = '' ;
                let xformatter = '' ;
                if(id == 'echarts-trends'){
                    formatter = '{value}%'
                    xformatter = '{c}%'
                }else {
                    formatter = '{value}'
                    xformatter = '{c}'
                }
                this.chart.showLoading();
                self.chart.setOption({
                    title: {
                        text: name,
                        left: 'center'
                    },
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
                                formatter: formatter
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
                                    formatter: xformatter
                                },
                            }}
                    }]
                });
                this.chart.hideLoading();
            },
            //类型筛选
            typeselect(data){
                let self = this ;
                this.trendSelect = data.name;
                this.lineXdata = [];
                this.linedata = [];
                this.attendancelist.map( val => {
                    self.lineXdata.push(val.yearmonth);
                    self.linedata.push(val[data.type]);
                });
                self.$nextTick(function() {
                        self.drawLine('echarts-trends','近六个月'+ self.trendSelect +'趋势');
                    }
                );
                this.typeconfig.show = false;
            },
            //时间筛选
            timeselect(data){
                this.currentmonth = data;
                this.selecttime = data;
                if(this.tatistcal.systype ==1){
                    if(this.code == 0){
                        this.initOfficeAdvance(5);
                        this.initOffice(5);
                    }else if(this.code == 1){
                        this.initTeachingImprove(1);
                        this.initTeachingAdvance(1);
                        this.initTeaching(1);
                    }else if(this.code == 2){
                        this.initOfficeAdvance(6);
                        this.initActionplan();
                        this.initActionplanSis();
                    }else if(this.code == 3){
                        this.initAttendanceRate();
                        this.initAttendance();
                    }
                }else{
                    if(this.code == 0){
                        if(this.$route.query.menutype==1){
                            this.initOfficeAdvance(18);
                            this.initOffice(18);
                        }else{
                            this.initOfficeAdvance(8);
                            this.initOffice(8);
                        }

                    }else if(this.code == 1){
                        if(this.$route.query.menutype==1){
                            this.initTeachingImprove(18);
                            this.initTeachingAdvance(18);
                            this.initTeaching(18);
                        }else{
                            this.initTeachingImprove(8);
                            this.initTeachingAdvance(8);
                            this.initTeaching(8);
                        }

                    }else if(this.code == 2){
                        this.initOfficeAdvance(6);
                        this.initActionplan();
                        this.initActionplanSis();
                    }else if(this.code == 3){
                        this.initAttendanceRate();
                        this.initAttendance();
                    }
                }

            },
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
        }
    }
    .trend {
        background: #fff;
        color: #666;
        padding: .2rem 0;
        p {
            color: #333;
            line-height: .6rem;
            padding: .2rem;
            margin: 0;
            display: flex;
            justify-content: space-between;
            border-bottom: 1px solid #e0e0e0;
            span:first-child {
                font-weight: bold;
                font-size: .35rem;
            }
        }
        .trend-select {
            color: #3499db;
        }
        .trend-content {
            height:5rem;
            padding:0.2rem;
            background:#fff;
            #echarts-trends {
                /*需要制定具体高度，以px为单位*/
                height: 100%;
                width:100%;
            }
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
            #echarts-rates {
                /*需要制定具体高度，以px为单位*/
                height: 100%;
                width:100%;
            }
        }
    }
    .echarts-content {
        height:5rem;
        padding:0.2rem;
        background:#fff;
        #echarts-trend , #echarts-rate , #echarts-rate-plan , #echarts-trend-plan {
            /*需要制定具体高度，以px为单位*/
            height: 100%;
            width:100%;
        }
    }
    .echarts-content-plan {
        height:10rem;
        padding:0.2rem;
        background:#fff;
        #echarts-rate-plan , #echarts-trend-plan {
            /*需要制定具体高度，以px为单位*/
            height: 50%;
            width:100%;
        }
    }
    .tatistical {
        color: #666;
        background: #fff;
        border-top: 1px solid #e0e0e0;
        ul {
            padding: .2rem;
        }
        p {
            color: #000;
            background: #eee;
            padding: .2rem;
        }
        li {
            padding: .1rem 0;
        }
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
